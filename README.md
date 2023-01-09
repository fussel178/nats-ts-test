# PoC: nats.js in TypeScript

This is a simple proof of concept that tests nats.js in TypeScript and Node v16.

## Installation

You'll the following tools:

- [Node.js v16](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [nats-server](https://docs.nats.io/nats-concepts/what-is-nats/walkthrough_setup#installing-the-nats-server-locally-if-needed)

1. Clone this repository:

   ```shell
   git clone git@github.com:fussel178/nats-ts-test.git
   cd nats-ts-test
   ```

2. Install development dependencies:

   ```shell
   pnpm install
   ```

3. Start the nats-server:

   ```shell
   pnpm start:server
   ```

4. Start the client:

   ```shell
   pnpm start:client
   ```

5. Login into the server:

   ```shell
   nats context create devel
   nats content edit devel
   ```

6. Publish some data:

   ```shell
   nats publish my.subscription "Hello World. Time: {{ UnixNano }}" --count=100 --sleep=0.5s
   ```
