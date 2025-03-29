/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // local 0g-chain network
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [
        // Validator account private key
        "17939F5B4FA643AB86DF3AE9D0B8F9C8C0C14328E679ECE6C243D32DAB673E49"
      ],
      chainId: 8888,
      gas: 6000000,
      gasPrice: 10000000000,
    }
  }
}; 