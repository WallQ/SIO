#!/usr/bin/env bash
# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

create_container() {
  local DB_URL=$1

  local DB_CONTAINER_NAME
  local DB_NAME
  local DB_PASSWORD
  local DB_PORT
  local DB_HOST

  DB_URL=$(sed -e 's/^"//' -e 's/"$//' <<<"$DB_URL")
  DB_NAME=$(echo "$DB_URL" | awk -F'/' '{print $4}')
  DB_CONTAINER_NAME="sio-${DB_NAME}-postgresql"
  DB_PASSWORD=$(echo "$DB_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
  DB_PORT=$(echo "$DB_URL" | awk -F':' '{print $4}' | awk -F'/' '{print $1}')
  DB_HOST=$(echo "$DB_URL" | awk -F'@' '{print $2}' | awk -F':' '{print $1}')

  if [ -z "$DB_NAME" ] || [ -z "$DB_CONTAINER_NAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_PORT" ] || [ -z "$DB_HOST" ]; then
    echo "Failed to extract database information from .env file"
    exit 1
  fi

  if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
    echo "Database container '$DB_CONTAINER_NAME' already running"
    return 0
  fi

  if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
    docker start "$DB_CONTAINER_NAME"
    echo "Existing database container '$DB_CONTAINER_NAME' started"
    return 0
  fi

  docker run -d \
    --name $DB_CONTAINER_NAME \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB=$DB_NAME \
    -p $DB_PORT:5432 \
    docker.io/postgres && echo "Database container '$DB_CONTAINER_NAME' was successfully created"
}

if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ ! -f .env ]; then
  echo "File .env not found. Please create a .env file in the root directory of the project with the database URL"
  exit 1
fi

while IFS= read -r line; do
  if [[ "$line" == *_DB_URL=* ]]; then
    DB_URL=$(echo "$line" | cut -d'=' -f2)
    create_container "$DB_URL"
  fi
done < .env