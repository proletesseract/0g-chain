# 0G Chain - Deploy Contracts Tutorial UI

This is a React application that provides a user-friendly UI for walking through the 0G Chain deployment tutorial. It allows users to easily follow the steps to create a wallet, transfer tokens, deploy a smart contract, and interact with it.

## Prerequisites

- Node.js (v18+) and npm (v10+)
- A running 0G Chain local testnet
- Windows users must use WSL (Windows Subsystem for Linux)
- `jq` command-line tool for JSON processing (required for localtestnet.sh)

## Getting Started

1. Install required system dependencies:
   ```bash
   # Install jq (required for localtestnet.sh)
   sudo apt-get update && sudo apt-get install -y jq
   ```

2. Start the 0G Chain local testnet (from the project root directory):
   ```bash
   # Make sure you're in the project root directory
   cd /mnt/c/Users/craig/Documents/GitHub/0g-chain
   
   # Run the local testnet script
   ./localtestnet.sh
   ```

3. In a new terminal window, navigate to the deploy-contracts directory:
   ```bash
   # Navigate to the deploy-contracts directory
   cd /mnt/c/Users/craig/Documents/GitHub/0g-chain/examples/deploy-contracts
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

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

### Common Issues

1. **Node.js Version Issues**
   - The application requires Node.js v18 or later
   - If you're using an older version, install nvm and use it to install Node.js 18:
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
     nvm install 18
     nvm use 18
     ```

2. **Crypto API Issues**
   - If you see `crypto.getRandomValues is not a function` error:
     - Make sure you're using Node.js v18 or later
     - Try cleaning and reinstalling dependencies:
       ```bash
       rm -rf node_modules package-lock.json
       npm install
       ```

3. **Windows-Specific Issues**
   - Always use WSL (Windows Subsystem for Linux) for development
   - Do not run the application in PowerShell or Command Prompt
   - Make sure WSL is properly configured with Node.js

### General Tips

- Make sure your local testnet is running before starting the application
- The application connects to the blockchain at http://127.0.0.1:8545
- If you encounter errors, check the browser console for more detailed information
- If the application fails to start, try cleaning the node_modules and reinstalling dependencies 