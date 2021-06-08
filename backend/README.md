# @l2beat/backend

L2BEAT Data collection script. Because of the extensive amounts of data fetching it uses a cache to speed up the execution time.

## Setup

1. Obtain an Etherscan API key
2. Obtain a JSON-RPC url for an archive node (e.g. Alchemy)
3. Create a `.env` file that includes the following lines:

```
ETHERSCAN_API_KEY=your-etherscan-key
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-alchemy-key
```
