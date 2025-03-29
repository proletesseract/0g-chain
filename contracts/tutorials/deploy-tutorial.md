# 0G Chain - Local Development Tutorial

This tutorial will guide you through setting up a local 0G Chain testnet, creating a wallet, transferring tokens, and deploying and interacting with a smart contract.

## Prerequisites

- Go installed (for running the 0G Chain daemon)
- Node.js and npm installed (for compiling and deploying smart contracts)

## Step 1: Start the Local Testnet

The local testnet comes preconfigured with several test accounts, including a validator, faucet, and user account.

```bash
# Make the script executable
chmod +x localtestnet.sh

# Run the local testnet
./localtestnet.sh
```

This will initialize a new chain and start the node. Keep this terminal window open as the blockchain will continue running in the background.

## Step 2: Create a New Wallet Address

Open a new terminal window and create a new address:

```bash
./out/darwin/0gchaind keys add my-wallet --eth
```

This command generates a new private key and shows you the corresponding address. You'll see output similar to:

```
- address: 0g1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  name: my-wallet
  pubkey: '{"@type":"/ethermint.crypto.v1.ethsecp256k1.PubKey","key":"..."}'
  type: local

**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

word1 word2 word3 ... word24
```

Make sure to save your mnemonic phrase securely as it's the only way to recover your wallet.

## Step 3: Transfer Tokens to Your New Address

The local testnet comes with a pre-funded user account. Let's transfer 1000 tokens from this account to your new address:

```bash
./out/darwin/0gchaind tx bank send user YOUR_NEW_ADDRESS 1000ua0gi --chain-id zgchain_8888-1 --fees 2000ua0gi --yes
```

Replace `YOUR_NEW_ADDRESS` with your newly created address from Step 2.

Verify the transfer was successful by checking your wallet balance:

```bash
./out/darwin/0gchaind query bank balances YOUR_NEW_ADDRESS
```

You should see a balance of 1000 ua0gi tokens.

## Step 4: Deploy the SimpleStorage Smart Contract

The repository includes a sample Solidity contract called SimpleStorage. To deploy it:

```bash
# Navigate to the contracts directory
cd contracts

# Install dependencies (if not already installed)
npm install

# Deploy the contract using the user account
npx hardhat run scripts/deploy-with-user.js --network localhost
```

This will deploy the SimpleStorage contract to the blockchain. Note the contract address from the output, you'll need it for the next step.

The contract deployment output should look similar to:

```
Deploying SimpleStorage contract with user account...
Deploying from account: 0x7Bbf300890857b8c241b219C6a489431669b3aFA
Account balance: 999999999999999.997 ETH
Deploying contract...
SimpleStorage deployed to: 0x62d2f38dAA1153b381c6ed2A48e7f4673303ac9A
Account balance after deployment: 999999999999999.9969999896917 ETH
Deployment cost: 0.0000000103083 ETH
```

## Step 5: Interact with the Deployed Contract

Now you can interact with your deployed contract using the interact.js script:

```bash
npx hardhat run scripts/interact.js --network localhost
```

This script performs the following operations:
1. Gets the current stored value (initially 0)
2. Sets a new random value
3. Gets the updated value to verify the change

The output should look similar to:

```
Interacting with SimpleStorage contract...
Using account: 0x7Bbf300890857b8c241b219C6a489431669b3aFA
Account balance: 999999999999999.9969999896917 ETH
Current stored value: 0
Setting new value to: 913936
Transaction confirmed in block 15
Transaction hash: 0xaad6b1b5bd5c41720a1aed97ba2ae3345f2c64a962d9ade7a617bd58ad760077
Updated stored value: 913936
```

## Advanced: Modifying the Contract

If you want to modify the SimpleStorage contract or develop your own contracts:

1. Edit the contract in the `contracts` directory
2. Compile and deploy using the Hardhat framework
3. Create new scripts to interact with your contract's functions

## Contract Details

The SimpleStorage contract is a simple example that stores and retrieves a single integer value:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    
    event DataChanged(uint256 newValue);
    
    function set(uint256 x) public {
        storedData = x;
        emit DataChanged(x);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}
```

## Troubleshooting

- If you encounter errors with token transfers, make sure you have included sufficient fees (--fees 2000ua0gi)
- If the contract deployment fails, check that the local testnet is running
- For any JSON-RPC errors, verify that the API endpoints are enabled in your local testnet configuration

## Next Steps

- Create more complex contracts
- Explore the 0G Chain API and SDK
- Learn about validator staking and governance 