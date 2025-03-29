// We require the Hardhat Runtime Environment explicitly here
const hre = require("hardhat");

async function main() {
  console.log("Interacting with SimpleStorage contract...");

  // User private key
  const privateKey =
    "9549F115B0A21E5071A8AEC1B74AC093190E18DD83D019AC6497B0ADFBEFF26D";

  // The address of the deployed contract
  const contractAddress = "0x62d2f38dAA1153b381c6ed2A48e7f4673303ac9A";

  // Create a wallet with private key
  const provider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new hre.ethers.Wallet(privateKey, provider);

  console.log(`Using account: ${wallet.address}`);

  // Display account balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  // Get the contract instance
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = SimpleStorage.attach(contractAddress).connect(wallet);

  // 1. Get the current stored value
  const currentValue = await simpleStorage.get();
  console.log(`Current stored value: ${currentValue}`);

  // 2. Set a new value - generate a random integer between 1 and 1,000,000
  const newValue = Math.floor(Math.random() * 1000000) + 1;
  console.log(`Setting new value to: ${newValue}`);
  const tx = await simpleStorage.set(newValue);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Transaction hash: ${receipt.hash}`);

  // 3. Get the updated value
  const updatedValue = await simpleStorage.get();
  console.log(`Updated stored value: ${updatedValue}`);
}

// Execute the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
