# zkleaderboard-aleo

Learn how to build and deploy your own leaderboard on-chain, using Aleo's network and Leo language. Demo project used for zkLeaderboard workshop. Part of zkHouse Istanbul during DevConnect 2023.

## Before we begin

### PNPM

Make sure you have [Node.js](https://nodejs.org/en) LTS installed.

Enable corepack in order to be able to use PNPM (NPM for cool kids):

```sh
corepack enable
```

### Aleo account

Install [Leo Wallet](https://www.leo.app/) and follow the steps to create an Aleo account.

Give yourself some credits by tapping the faucet. You can find it on the [Aleo Discord](https://discord.com/invite/aleohq) server. Currently the maximum amount of credits per mint is 15.

### Obscura key

Follow [these steps](https://docs.obscura.network/Obscura-Api-Key/00_api-key/) to generate you Obscura API Key.

### .env

Create a `client/.env` file and define the following env variables.

> ⚠️ Currently the Aleo SDK does not work alongside Leo wallet, so in order to run the app with the SDK you have to manually specify your Private Key as an environment variable. If you are reading this from the future, please only use testnet accounts!

```env
VITE_PRIVATE_KEY=<your_aleo_private_key_exported_from_wallet>
VITE_NETWORK_URL="https://aleo.obscura.network/v1/<your_obscura_key>"
VITE_PROGRAM_NAME="leaderboard_<your_name>.aleo"
```

## Deploy and run

Navigate to the `client/` directory, this is where you will be running most of your commands:

```sh
cd client/
```

Install the required dependencies:

```sh
pnpm install
```

Build the `.aleo` program:

```sh
pnpm aleo:build
```

Deploy the program to the testnet (for this operation you need to have at least 2.1 aleo credits in your wallet):

```sh
pnpm aleo:deploy
```

Check your wallet activities. In a couple of minutes you should see an activity item confirming the deployment. The testnet is not always stable, so if after 5 minutes you still don't see the item, try re-running the deployment command.

You should also be able to find your program in the block explorer when navigating to `https://explorer.aleo.org/program/leaderboard_<your_name>.aleo`

If your program was deployed successfully, you can run the app:

```sh
pnpm dev
```

Navigate to the URL you see in your terminal. Make sure to open your browser console to see all the logs and errors.

✨ Happy hacking! ✨
