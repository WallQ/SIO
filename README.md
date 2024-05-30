# Sistemas de Informação Organizacionais

## Getting Started

To get started with SIO application on your local machine, follow these steps:

<sup>Taking in consideration Node.js v20+, PnPM and Docker is already installed.</sup>

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install the required dependencies:

```bash
pnpm install
```

3. Set up the environment variables(look into .env.example file):

```bash
cp .env
```

4. Set up the database:

```bash
./start-database.sh
```

5. Alter the database schema:

```bash
pnpm run db:push-r
pnpm run db:push-s
```

6. Run the application:

```bash
pnpm run dev
```

7. (Optional) Interact with the databases with a GUI tool:

```bash
pnpm run db:studio-r
pnpm run db:studio-s
```

The application should now be perfectly running locally on http://localhost:3000.
