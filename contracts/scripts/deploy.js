// We require the Hardhat Runtime Environment explicitly here
const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleStorage contract...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Display account balance
  const balanceBefore = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balanceBefore)} ETH`);

  // Deploy the SimpleStorage contract
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.waitForDeployment();

  const contractAddress = await simpleStorage.getAddress();
  console.log(`SimpleStorage deployed to: ${contractAddress}`);

  // Display account balance after deployment
  const balanceAfter = await hre.ethers.provider.getBalance(deployer.address);
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
