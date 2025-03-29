# 0G Chain - Deploy Contracts Tutorial UI

This is a React application that provides a user-friendly UI for walking through the 0G Chain deployment tutorial. It allows users to easily follow the steps to create a wallet, transfer tokens, deploy a smart contract, and interact with it.

## Prerequisites

- Node.js (v16+) and npm
- A running 0G Chain local testnet

## Getting Started

1. Make sure your 0G Chain local testnet is running:
   ```
   ./localtestnet.sh
   ```

2. In a new terminal, navigate to the deploy-contracts directory:
   ```
   cd examples/deploy-contracts
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Features

This application guides you through the following steps:

1. **Create New Address**: Generate a new Ethereum wallet address with a secure private key.
2. **Send Tokens**: Transfer 1 ETH from your local testnet user account to the newly created address.
3. **Deploy SimpleStorage Contract**: Deploy the SimpleStorage smart contract to the blockchain.
4. **Update Stored Value**: Set a random value in the SimpleStorage contract.

## Status Information

The application displays real-time information about the blockchain and your interaction with it:

- Connection status to the 0G Chain
- Current block height
- User account address and balance
- New wallet address and balance
- Contract address
- Currently stored value in the contract

## Behind the Scenes

This application uses:

- The `ethers` library to interact with the 0G Chain
- React for the user interface
- Styled-components for styling
- A custom blockchain utility module to handle wallet operations, contract deployment, and interaction

## Troubleshooting

- Make sure your local testnet is running before starting the application
- The application connects to the blockchain at http://127.0.0.1:8545
- If you encounter errors, check the browser console for more detailed information 