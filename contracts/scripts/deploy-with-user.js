// We require the Hardhat Runtime Environment explicitly here
const hre = require("hardhat");
const { ethers } = require("ethers");

async function main() {
  console.log("Deploying SimpleStorage contract with user account...");

  // User private key
  const privateKey =
    "9549F115B0A21E5071A8AEC1B74AC093190E18DD83D019AC6497B0ADFBEFF26D";

  // Create a wallet with private key
  const provider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new hre.ethers.Wallet(privateKey, provider);

  console.log(`Deploying from account: ${wallet.address}`);

  // Display account balance
  const balanceBefore = await provider.getBalance(wallet.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balanceBefore)} ETH`);

  // Deploy the SimpleStorage contract
  const SimpleStorageFactory = await hre.ethers.getContractFactory(
    "SimpleStorage",
    wallet
  );
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();

  await simpleStorage.waitForDeployment();

  const contractAddress = await simpleStorage.getAddress();
  console.log(`SimpleStorage deployed to: ${contractAddress}`);

  // Display account balance after deployment
  const balanceAfter = await provider.getBalance(wallet.address);
  console.log(
    `Account balance after deployment: ${hre.ethers.formatEther(
      balanceAfter
    )} ETH`
  );

  const deploymentCost = balanceBefore - balanceAfter;
  console.log(`Deployment cost: ${hre.ethers.formatEther(deploymentCost)} ETH`);
}

// Execute the deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
