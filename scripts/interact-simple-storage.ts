import { ethers } from "hardhat";
import { formatEther } from "ethers";

async function main() {
  console.log("Interacting with SimpleStorage contract...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);
  
  // The address of the deployed contract
  const contractAddress = "0x151aAE4a731B3Dc50a5112545694bd5aE0c50e42";
  
  // Get the contract instance
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = SimpleStorage.attach(contractAddress);
  
  // Call the getter to get the current value
  const currentValue = await simpleStorage.get();
  console.log(`Current stored value: ${currentValue}`);
  
  // Set a new value
  console.log("Setting a new value...");
  const tx = await simpleStorage.set(42);
  
  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt?.blockNumber}`);
  
  // Get the updated value
  const newValue = await simpleStorage.get();
  console.log(`New stored value: ${newValue}`);
}

// Execute the interaction
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 