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

// Create provider and connect
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
    console.error('Error connecting to provider:', error);
    throw new Error('Failed to connect to blockchain. Make sure the local testnet is running.');
  }
};

// Get current block number
export const getBlockNumber = async (provider) => {
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    console.error('Error getting block number:', error);
    return 'Unknown';
  }
};

// Get wallet from private key
export const getWallet = (privateKey, provider) => {
  try {
    return new ethers.Wallet(privateKey, provider);
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

// Get default user wallet
export const getDefaultUserWallet = async () => {
  try {
    const provider = await getProvider();
    return getWallet(DEFAULT_USER_KEY, provider);
  } catch (error) {
    console.error('Error getting default user wallet:', error);
    throw error;
  }
};

// Get account balance
export const getBalance = async (address, provider) => {
  try {
    const balance = await provider.getBalance(address);
    // Convert the balance from ETH to ua0gi (multiply by 1000)
    const ua0giBalance = parseFloat(ethers.formatEther(balance)) * 1000;
    return ua0giBalance.toString();
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};

// Create a new wallet
export const createNewWallet = () => {
  return ethers.Wallet.createRandom();
};

// Send tokens from one address to another
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
    console.error('Error sending tokens:', error);
    throw error;
  }
};

// Deploy SimpleStorage contract
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
    console.error('Error deploying contract:', error);
    throw error;
  }
};

// Get SimpleStorage contract instance
export const getSimpleStorage = (contractAddress, wallet) => {
  try {
    console.log(`Creating contract instance for ${contractAddress} connected to wallet ${wallet.address}`);
    return new ethers.Contract(contractAddress, SIMPLE_STORAGE_ABI, wallet);
  } catch (error) {
    console.error('Error getting contract instance:', error);
    throw error;
  }
};

// Get stored value from contract
export const getStoredValue = async (contract) => {
  try {
    console.log(`Calling get() on contract at ${await contract.getAddress()}`);
    // Add explicit call options
    const value = await contract.get({
      gasLimit: 100000
    });
    console.log(`Get result: ${value}`);
    return value;
  } catch (error) {
    console.error('Error getting stored value:', error);
    return 0;
  }
};

// Update stored value in contract
export const setStoredValue = async (contract, value) => {
  try {
    const contractAddress = await contract.getAddress();
    console.log(`Calling set function on contract at ${contractAddress} with value: ${value}`);
    
    // Debug contract and wallet information
    console.log(`Contract address: ${contractAddress}`);
    console.log(`Signer address: ${await contract.runner.getAddress()}`);
    
    // Check if the contract interface is correct
    try {
      // Verify the contract has the get method first
      const currentValue = await contract.get();
      console.log(`Current value before update: ${currentValue}`);
    } catch (getError) {
      console.error(`Error getting current value: ${getError.message}`);
    }
    
    // Ensure the value is properly formatted as a BigInt
    const bigIntValue = BigInt(value);
    console.log(`Converted value to BigInt: ${bigIntValue.toString()}`);
    
    // Call the set function with proper gas parameters
    console.log(`Sending transaction...`);
    const tx = await contract.set(bigIntValue, {
      gasLimit: 1000000, // Increased gas limit
      gasPrice: ethers.parseUnits('10', 'gwei')
    });
    
    console.log(`Transaction sent: ${tx.hash}`);
    console.log(`Transaction data: ${tx.data}`); // Debug the transaction data
    
    console.log(`Waiting for confirmation...`);
    const receipt = await tx.wait();
    
    console.log(`Transaction confirmed: status=${receipt.status}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    
    if (receipt.status === 0) {
      throw new Error("Transaction failed - contract execution reverted");
    }
    
    return receipt;
  } catch (error) {
    console.error('Error setting stored value:', error);
    console.error('Error details:', error.code, error.reason || 'No reason provided');
    
    if (error.transaction) {
      console.error('Transaction details:', {
        from: error.transaction.from,
        to: error.transaction.to,
        data: error.transaction.data
      });
    }
    
    throw error;
  }
};

// Generate random value between 1 and 1,000,000
export const generateRandomValue = () => {
  return Math.floor(Math.random() * 1000000) + 1;
}; 