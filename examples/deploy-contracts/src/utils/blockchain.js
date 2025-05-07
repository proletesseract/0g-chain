import { ethers } from 'ethers';

// SimpleStorage ABI - updated from Hardhat compilation output
export const SIMPLE_STORAGE_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
      }
    ],
    "name": "DataChanged",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "get",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      }
    ],
    "name": "set",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// SimpleStorage contract bytecode - updated from Hardhat compilation output
export const SIMPLE_STORAGE_BYTECODE = "0x608060405234801561001057600080fd5b5060e68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146048575b600080fd5b604660423660046098565b605d565b005b60005460405190815260200160405180910390f35b60008190556040518181527f30abf1e3f71dc652b1df75682ae16af5c006ad42cd23d00001e8e106d8af4e1d9060200160405180910390a150565b60006020828403121560a957600080fd5b503591905056fea264697066735822122020d9e280e5069bc2ed945a33415396560558c406da8ba04f116cb0fd4deeafaf64736f6c63430008120033";

// Provider URL
const PROVIDER_URL = 'http://127.0.0.1:8545';

// Default user account private key from the tutorial
const DEFAULT_USER_KEY = '9549F115B0A21E5071A8AEC1B74AC093190E18DD83D019AC6497B0ADFBEFF26D';

/**
 * Creates and tests a connection to the blockchain provider
 * @returns {Promise<ethers.JsonRpcProvider>} Connected provider instance
 */
export const getProvider = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    // Test connection with a timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    const blockNumberPromise = provider.getBlockNumber();
    
    await Promise.race([blockNumberPromise, timeoutPromise]);
    return provider;
  } catch (error) {
    throw new Error('Failed to connect to blockchain. Make sure the local testnet is running.');
  }
};

/**
 * Gets the current block number from the blockchain
 * @param {ethers.JsonRpcProvider} provider - The blockchain provider
 * @returns {Promise<number|string>} The current block number or 'Unknown'
 */
export const getBlockNumber = async (provider) => {
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Creates a wallet instance from a private key
 * @param {string} privateKey - The private key
 * @param {ethers.JsonRpcProvider} provider - The blockchain provider
 * @returns {ethers.Wallet} The wallet instance
 */
export const getWallet = (privateKey, provider) => {
  try {
    return new ethers.Wallet(privateKey, provider);
  } catch (error) {
    throw error;
  }
};

/**
 * Gets the default user wallet using the hardcoded key
 * @returns {Promise<ethers.Wallet>} The default user wallet
 */
export const getDefaultUserWallet = async () => {
  try {
    const provider = await getProvider();
    return getWallet(DEFAULT_USER_KEY, provider);
  } catch (error) {
    throw error;
  }
};

/**
 * Gets the balance of an address in ua0gi tokens
 * @param {string} address - The address to check
 * @param {ethers.JsonRpcProvider} provider - The blockchain provider
 * @returns {Promise<string>} The balance in ua0gi tokens
 */
export const getBalance = async (address, provider) => {
  try {
    const balance = await provider.getBalance(address);
    // Convert the balance from ETH to ua0gi (multiply by 1000)
    const ua0giBalance = parseFloat(ethers.formatEther(balance)) * 1000;
    return ua0giBalance.toString();
  } catch (error) {
    return '0';
  }
};

/**
 * Creates a new random wallet
 * @returns {ethers.Wallet} A new random wallet instance
 */
export const createNewWallet = () => {
  return ethers.Wallet.createRandom();
};

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
      value: ethers.parseEther((amount / 1000).toString()) // Convert 1000 tokens to ETH equivalent
    });
    
    return await tx.wait();
  } catch (error) {
    throw error;
  }
};

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

/**
 * Gets an instance of the SimpleStorage contract at a specific address
 * @param {string} contractAddress - The address of the deployed contract
 * @param {ethers.Wallet} wallet - The wallet to connect to the contract
 * @returns {ethers.Contract} The contract instance
 */
export const getSimpleStorage = (contractAddress, wallet) => {
  try {
    return new ethers.Contract(contractAddress, SIMPLE_STORAGE_ABI, wallet);
  } catch (error) {
    throw error;
  }
};

/**
 * Gets the stored value from the SimpleStorage contract
 * @param {ethers.Contract} contract - The contract instance
 * @returns {Promise<number>} The stored value
 */
export const getStoredValue = async (contract) => {
  try {
    const value = await contract.get({
      gasLimit: 100000
    });
    return value;
  } catch (error) {
    return 0;
  }
};

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