# Personal Remix Starter Stack

This stack is based on the official [Blues Stack](https://github.com/remix-run/blues-stack).

Get started with:

```
npx create-remix@latest --template jdmcd/remix-starter
```

## Development

- Install deps:

  ```sh
  bun install
  ```

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  bun run docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial setup:

  ```sh
  bun run setup
  ```

- Run the first build:

  ```sh
  bun run build
  ```

- Start dev server:

  ```sh
  bun run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `jimmy@jdmcd.io`
- Password: `password`
