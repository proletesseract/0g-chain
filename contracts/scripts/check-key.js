// We require the Hardhat Runtime Environment explicitly here
const { ethers } = require("ethers");

async function main() {
  // Private key from hardhat.config.js
  const privateKey =
    "9549F115B0A21E5071A8AEC1B74AC093190E18DD83D019AC6497B0ADFBEFF26D";

  // Create a wallet instance
  const wallet = new ethers.Wallet(privateKey);

  // Expected address
  const expectedAddress = "0x7Bbf300890857b8c241b219C6a489431669b3aFA";

  console.log(`Wallet address from private key: ${wallet.address}`);
  console.log(`Expected user address: ${expectedAddress}`);
  console.log(
    `Do they match? ${
      wallet.address.toLowerCase() === expectedAddress.toLowerCase()
    }`
  );
}

// Execute the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
