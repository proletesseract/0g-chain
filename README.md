<br />
<p align="center">
  <img src="https://framerusercontent.com/images/JJi9BT4FAjp4W63c3jjNz0eezQ.png" alt="Logo" width="140" height="140">
</p>
<p align="center">
    <b><font size="5">0G is limitless scalability</font></b>
</p>
<br />

# 0G Chain
Zero Gravity (0G) is the foundational infrastructure for high-performance dapps and chains particularly for AI. 

It efficiently orchestrates utilization of hardware resources such as storage and compute and software assets such as data and models to handle the scale and complexity of AI workloads.

Continue reading [here](https://docs.0g.ai/intro) if you want to learn more about 0G dAIOS and how its various layers enable limitless scalability.

## 0G Product Suite
- DA: ultra high-performance data availability layer with KZG and quorum-based DAS
- Storage: decentralized storage with erasure coding and replication
- Inference Serving: flexible serving framework for inferences and finetuning
- Network: high-performance, low-latency, and decentralized network

## Documentation
- If you want to build with 0G's network, DA layer, inference serving, or storage SDK, please refer to the [Build with 0G Documentation](https://docs.0g.ai/build-with-0g/contracts).

- If you want to run a validator node, DA node, or storage node, please refer to the [Run a Node Documentation](https://docs.0g.ai/run-a-node/overview).

## Local Development Setup

### Prerequisites

1. **Windows Subsystem for Linux (WSL)**
   - Windows users must use WSL for development
   - Install WSL by following [Microsoft's WSL Installation Guide](https://learn.microsoft.com/en-us/windows/wsl/install)
   - We recommend using Ubuntu as the WSL distribution

2. **Go 1.21 or later**
   ```bash
   # In WSL Ubuntu
   sudo snap install go --classic
   ```

3. **Build Tools**
   ```bash
   # In WSL Ubuntu
   sudo apt update
   sudo apt install -y build-essential git gcc make dos2unix
   ```

### Building and Running the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/0glabs/0g-chain.git
   cd 0g-chain
   ```

2. **Build the project**
   ```bash
   # In WSL Ubuntu
   make clean && make build
   ```

3. **Run the local testnet**
   ```bash
   # Convert script to Unix line endings
   dos2unix localtestnet.sh
   
   # Make the script executable
   chmod +x localtestnet.sh
   
   # Run the local testnet
   ./localtestnet.sh
   ```

The local testnet will:
- Initialize a validator node
- Create test accounts with funds
- Configure the chain for local development
- Start producing blocks

### Interacting with the Local Chain

Once the chain is running, you can interact with it using the `0gchaind` command:

```bash
# Check chain status
0gchaind status

# List accounts
0gchaind keys list

# Query block information
0gchaind query block
```

### Troubleshooting

If you encounter any issues:
1. Make sure you're using WSL (not PowerShell or Command Prompt)
2. Ensure all prerequisites are installed
3. Check that the build completed successfully
4. Verify the script has Unix line endings (use `dos2unix` if needed)

## Support and Additional Resources
We want to do everything we can to help you be successful while working on your contribution and projects. Here you'll find various resources and communities that may help you complete a project or contribute to 0G. 


### Communities
- [0G Telegram](https://t.me/web3_0glabs)
- [0G Discord](https://discord.com/invite/0glabs)