// We require the Hardhat Runtime Environment explicitly here
const hre = require("hardhat");

async function main() {
  // Get the signer account
  const [signer] = await hre.ethers.getSigners();
  console.log(`Account address: ${signer.address}`);
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} ETH`);
}

// Execute the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
