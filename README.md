# Sistemas de Informação Organizacionais

## Description
This is an evaluation project of the SIO curricular unit.

## Technologies

[<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" width="64" height="64" />](https://www.typescriptlang.org/)
[<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React.js" width="64" height="64" />](https://reactjs.org/)
[<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" width="64" height="64" />](https://nextjs.org/)
[<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/trpc/trpc-original.svg" alt="tRPC" width="64" height="64" />](https://trpc.io/)
[<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="64" height="64" />](https://trpc.io/)
[<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" width="64" height="64" />](https://tailwindcss.com/)

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

3. Set up the environment variables:

```bash
cp .env.example .env
```

4. Set up the database:

```bash
chmod +x ./start-database.sh
./start-database.sh
```

5. Push the schema directly into the database:

```bash
pnpm run db:push
```

6. Run the application:

```bash
pnpm run dev
```

7. (Optional) Other useful commands:

Interact with the database with a GUI tool

```bash
pnpm run db:studio-a
pnpm run db:studio-r
pnpm run db:studio-s
```

The application should now be perfectly running locally on http://localhost:3000.

## License

[MIT](https://github.com/WallQ/SIO/blob/master/LICENSE)

**ESTG - Escola Superior de Tecnologia e Gestão | Politécnico do Porto**
