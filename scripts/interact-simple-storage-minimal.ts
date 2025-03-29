import { ethers } from "hardhat";

async function main() {
  console.log("Interacting with SimpleStorage contract...");
  
  // Get the account
  const [account] = await ethers.getSigners();
  console.log(`Using account: ${account.address}`);
  
  // Contract address from the deployment
  const contractAddress = "0x151aAE4a731B3Dc50a5112545694bd5aE0c50e42";
  
  // ABI for the functions we need
  const abi = [
    "function set(uint256 x) public",
    "function get() public view returns (uint256)"
  ];
  
  // Create contract instance
  const simpleStorage = new ethers.Contract(contractAddress, abi, account);
  
  try {
    // Try to get current value
    console.log("Attempting to get current value...");
    const currentValue = await simpleStorage.get();
    console.log(`Current value: ${currentValue.toString()}`);
  } catch (error) {
    console.log("Error getting value:", error.message);
  }
  
  try {
    // Setting a new value
    console.log("Setting value to 42...");
    const tx = await simpleStorage.set(42);
    console.log(`Transaction hash: ${tx.hash}`);
    
    // Wait for transaction to be mined
    console.log("Waiting for transaction to be mined...");
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Try to get the updated value
    console.log("Attempting to get updated value...");
    const newValue = await simpleStorage.get();
    console.log(`New value: ${newValue.toString()}`);
  } catch (error) {
    console.log("Error setting value:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
  }); 