# 0G Chain Smart Contract Deployment Tutorial

This tutorial will guide you through using the 0G Chain blockchain to create a wallet, send tokens, deploy a smart contract, and interact with it. The example application provides a user-friendly interface to perform these operations without having to manually run multiple commands.

## Prerequisites

Before starting this tutorial, ensure you have:

- Node.js (v16+) and npm installed
- A running 0G Chain local testnet
- Git to clone the repository (if not done already)

## Getting Started

1. Start your 0G Chain local testnet:

```bash
./localtestnet.sh
```

2. Open a new terminal window and navigate to the deploy-contracts example directory:

```bash
cd examples/deploy-contracts
```

3. Install the required dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Understanding the 0G Chain Interface

The 0G Chain blockchain interface provides several key functionalities for interacting with the blockchain:

### Connection and Status

The application connects to your local 0G Chain testnet running at `http://127.0.0.1:8545`. The right panel displays real-time information about:

- Connection status to the 0G Chain
- Current block height
- User account address and balance
- New wallet details when created
- Contract address and stored value once deployed

### Blockchain Interaction

The application uses the `ethers.js` library to interact with the 0G Chain. Key functionalities include:

- Creating wallet addresses
- Sending tokens (displayed as ua0gi tokens in the UI)
- Deploying smart contracts
- Executing contract functions

## Step-by-Step Tutorial

Let's walk through each step of the application:

### Step 1: Create a New Wallet

**Objective**: Generate a new Ethereum-compatible wallet address for testing.

1. Click the "Create New Address" button.
2. The application will generate a new random wallet with its own private key.
3. The wallet address will be displayed in the result area and added to the status panel.

**Behind the scenes**:
```javascript
/**
 * Creates a new random wallet
 * @returns {ethers.Wallet} A new random wallet instance
 */
export const createNewWallet = () => {
  return ethers.Wallet.createRandom();
};
```

This creates a cryptographically secure random wallet that can receive tokens and interact with the blockchain.

### Step 2: Send Tokens to the New Wallet

**Objective**: Transfer tokens from your testnet account to the newly created wallet.

1. Click the "Send 1000 ua0gi" button.
2. The application will transfer 1000 ua0gi tokens from your default user account to the new wallet address.
3. After the transaction is processed, you'll see the updated balances in the status panel.

**Behind the scenes**:
```javascript
/**
 * Sends tokens from one wallet to another address
 * @param {ethers.Wallet} fromWallet - The sender wallet
 * @param {string} toAddress - The recipient address
 * @param {number} amount - The amount to send in ua0gi tokens
 * @returns {Promise<ethers.TransactionReceipt>} The transaction receipt
 */
export const sendTokens = async (fromWallet, toAddress, amount) => {
  try {
    // For 0G Chain, we're sending ETH as the underlying currency
    // but we'll display it as ua0gi tokens in the UI
    const tx = await fromWallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther((amount / 1000).toString()) // Convert tokens to ETH equivalent
    });
    
    return await tx.wait();
  } catch (error) {
    throw error;
  }
};
```

This sends a transaction on the blockchain, transferring the specified amount of tokens from one address to another.

### Step 3: Deploy the SimpleStorage Contract

**Objective**: Deploy a smart contract to the blockchain.

1. Click the "Deploy Contract" button.
2. The application will deploy the SimpleStorage contract to the 0G Chain blockchain.
3. Once deployed, the contract address will appear in the status panel.

**Behind the scenes**:
```javascript
/**
 * Deploys a SimpleStorage contract to the blockchain
 * @param {ethers.Wallet} wallet - The wallet to deploy from
 * @returns {Promise<ethers.Contract>} The deployed contract instance
 */
export const deploySimpleStorage = async (wallet) => {
  try {
    const factory = new ethers.ContractFactory(
      SIMPLE_STORAGE_ABI,
      SIMPLE_STORAGE_BYTECODE,
      wallet
    );
    
    // Deploy with explicit gas parameters
    const contract = await factory.deploy({
      gasLimit: 1000000, // Higher gas limit for deployment
      gasPrice: ethers.parseUnits('10', 'gwei')
    });
    
    await contract.waitForDeployment();
    return contract;
  } catch (error) {
    throw error;
  }
};
```

The SimpleStorage contract has a simple interface:
- `set(uint256 x)`: Stores a value in the contract
- `get()`: Retrieves the stored value
- `DataChanged` event: Emitted when the value is changed

### Step 4: Update the Stored Value

**Objective**: Interact with the deployed smart contract by updating its stored value.

1. Click the "Update Value" button.
2. The application will generate a random number and update the contract's stored value.
3. After the transaction is processed, the new value will be displayed in the status panel.

**Behind the scenes**:
```javascript
/**
 * Sets a new value in the SimpleStorage contract
 * @param {ethers.Contract} contract - The contract instance
 * @param {number} value - The value to store
 * @returns {Promise<ethers.TransactionReceipt>} The transaction receipt
 */
export const setStoredValue = async (contract, value) => {
  try {
    // Ensure the value is properly formatted as a BigInt
    const bigIntValue = BigInt(value);
    
    // Call the set function with proper gas parameters
    const tx = await contract.set(bigIntValue, {
      gasLimit: 1000000,
      gasPrice: ethers.parseUnits('10', 'gwei')
    });
    
    return await tx.wait();
  } catch (error) {
    throw error;
  }
};

/**
 * Generates a random value between 1 and 1,000,000
 * @returns {number} A random integer
 */
export const generateRandomValue = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};
```

This sends a transaction to call the `set` function on the smart contract, updating its stored value.

## How to Implement Your Own Blockchain Application

If you want to build your own application on top of the 0G Chain, here's how to get started:

### 1. Setting up the Blockchain Connection

```javascript
import { ethers } from 'ethers';

/**
 * Creates and tests a connection to the blockchain provider
 * @returns {Promise<ethers.JsonRpcProvider>} Connected provider instance
 */
const getProvider = async () => {
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  // Test the connection
  await provider.getBlockNumber();
  return provider;
};

// Create a wallet from a private key
const wallet = new ethers.Wallet(privateKey, provider);
```

### 2. Creating and Managing Wallets

```javascript
// Generate a random wallet
const newWallet = ethers.Wallet.createRandom();

/**
 * Gets the balance of an address in ua0gi tokens
 * @param {string} address - The address to check
 * @param {ethers.JsonRpcProvider} provider - The blockchain provider
 * @returns {Promise<string>} The balance in ua0gi tokens
 */
const getBalance = async (address, provider) => {
  const balance = await provider.getBalance(address);
  // Convert the balance from ETH to ua0gi (multiply by 1000)
  const ua0giBalance = parseFloat(ethers.formatEther(balance)) * 1000;
  return ua0giBalance.toString();
};
```

### 3. Sending Transactions

```javascript
/**
 * Sends tokens from one wallet to another address
 * @param {ethers.Wallet} fromWallet - The sender wallet
 * @param {string} toAddress - The recipient address
 * @param {number} amount - The amount to send in ua0gi tokens
 * @returns {Promise<ethers.TransactionReceipt>} The transaction receipt
 */
const sendTokens = async (fromWallet, toAddress, amount) => {
  const tx = await fromWallet.sendTransaction({
    to: toAddress,
    value: ethers.parseEther((amount / 1000).toString())
  });
  
  // Wait for transaction confirmation
  const receipt = await tx.wait();
  return receipt;
};
```

### 4. Deploying Smart Contracts

```javascript
/**
 * Deploys a smart contract to the blockchain
 * @param {ethers.Wallet} wallet - The wallet to deploy from
 * @param {Array} abi - The contract ABI
 * @param {string} bytecode - The contract bytecode
 * @returns {Promise<ethers.Contract>} The deployed contract instance
 */
const deployContract = async (wallet, abi, bytecode) => {
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  
  const contract = await factory.deploy({
    gasLimit: 1000000,
    gasPrice: ethers.parseUnits('10', 'gwei')
  });
  
  await contract.waitForDeployment();
  return contract;
};
```

### 5. Interacting with Smart Contracts

```javascript
/**
 * Gets an instance of a contract at a specific address
 * @param {string} address - The address of the deployed contract
 * @param {Array} abi - The contract ABI
 * @param {ethers.Wallet} wallet - The wallet to connect to the contract
 * @returns {ethers.Contract} The contract instance
 */
const getContract = (address, abi, wallet) => {
  return new ethers.Contract(address, abi, wallet);
};

/**
 * Calls a read function on a contract (no transaction, just reading state)
 * @param {ethers.Contract} contract - The contract instance
 * @param {string} functionName - The name of the function to call
 * @param {...any} args - The arguments to pass to the function
 * @returns {Promise<any>} The return value from the function
 */
const readContract = async (contract, functionName, ...args) => {
  return await contract[functionName](...args, { gasLimit: 100000 });
};

/**
 * Calls a write function on a contract (creates a transaction, modifies state)
 * @param {ethers.Contract} contract - The contract instance
 * @param {string} functionName - The name of the function to call
 * @param {...any} args - The arguments to pass to the function
 * @returns {Promise<ethers.TransactionReceipt>} The transaction receipt
 */
const writeContract = async (contract, functionName, ...args) => {
  const tx = await contract[functionName](...args, {
    gasLimit: 1000000,
    gasPrice: ethers.parseUnits('10', 'gwei')
  });
  
  const receipt = await tx.wait();
  return receipt;
};
```

## Common Issues and Troubleshooting

- **Connection Issues**: Ensure your local testnet is running before starting the application.
- **Transaction Failures**: Check transaction parameters like gas limits and ensure your wallet has enough tokens.
- **Contract Interaction Errors**: Verify you're using the correct ABI and that function parameters match the expected types.
- **Wallet Balance Issues**: Remember that transaction fees are deducted from your wallet balance.

## Conclusion

This tutorial has demonstrated how to:
1. Create a new wallet address
2. Transfer tokens between wallets
3. Deploy a smart contract to the blockchain
4. Interact with the deployed contract

You now have a basic understanding of how to interact with the 0G Chain blockchain. This foundation can be used to build more complex applications with custom smart contracts and user interfaces.

## Further Development

To extend this example:
- Create more complex smart contracts
- Implement token standards like ERC-20 or ERC-721
- Build a more feature-rich user interface
- Connect to different networks (testnet, mainnet)
- Add additional security features like wallet encryption 