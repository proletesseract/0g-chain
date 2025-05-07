/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // local 0g-chain network
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        // User account private key
        "9549F115B0A21E5071A8AEC1B74AC093190E18DD83D019AC6497B0ADFBEFF26D",
      ],
      chainId: 8888,
      gas: 6000000,
      gasPrice: 10000000000,
    },
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [
        // User account private key
        "9549F115B0A21E5071A8AEC1B74AC093190E18DD83D019AC6497B0ADFBEFF26D",
      ],
      chainId: 8888,
      gas: 6000000,
      gasPrice: 10000000000,
    },
  },
};
