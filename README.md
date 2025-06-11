# Tell of Samurais

A monorepo containing both the client and server applications for the Tell of Samurais game.

## Project Structure

```
tell-of-samurais/
├── geishas-n-samurais-client/    # Frontend application
├── geishas-n-samurais-server/    # Backend server
├── package.json                  # Root package.json for workspace configuration
└── README.md                     # This file
```

## Getting Started

1. Install dependencies:

    ```bash
    npm install
    ```

2. Development:

    - Start both client and server concurrently: `npm run dev`
    - Start only the client: `npm run dev:client`
    - Start only the server: `npm run dev:server`

3. Production:

    - Build both projects: `npm run build`
    - Start both projects: `npm run start`
    - Build and start individual projects:
        - Client: `npm run build:client && npm run start:client`
        - Server: `npm run build:server && npm run start:server`

4. Testing:
    - Run all tests: `npm run test`
    - Run client tests: `npm run test:client`
    - Run server tests: `npm run test:server`
    - Watch mode for all tests: `npm run test:watch`
    - Generate coverage reports: `npm run test:coverage`

## Available Scripts

From the root directory, you can run:

-   `npm run dev` - Start both client and server in development mode
-   `npm run dev:client` - Start the client in development mode
-   `npm run dev:server` - Start the server in development mode
-   `npm run build` - Build both client and server
-   `npm run build:client` - Build the client
-   `npm run build:server` - Build the server
-   `npm run start` - Start both client and server in production mode
-   `npm run start:client` - Start the client in production mode
-   `npm run start:server` - Start the server in production mode
-   `npm run test` - Run all tests
-   `npm run test:client` - Run client tests
-   `npm run test:server` - Run server tests
-   `npm run test:watch` - Run tests in watch mode
-   `npm run test:coverage` - Generate test coverage reports

## Testing

The project uses different testing frameworks for client and server:

-   **Client**: Uses Vitest with Svelte Testing Library

    -   Unit tests: `src/**/*.test.ts`
    -   Component tests: `src/**/*.spec.ts`
    -   Coverage reports in `coverage/` directory

-   **Server**: Uses Jest with Supertest
    -   Unit tests: `src/**/*.test.ts`
    -   Integration tests: `src/**/__tests__/*.test.ts`
    -   Coverage reports in `coverage/` directory

## Workspace Management

This project uses npm workspaces to manage multiple packages in a single repository. The workspace configuration is defined in the root `package.json` file.
