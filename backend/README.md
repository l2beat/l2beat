# L2Beat Data collection backend

## Setup

1. Obtain a BigQuery service account key
2. Save the key as google_key.json in the `/backend` directory
3. Obtain a JSON-RPC url for an archive node (e.g. Alchemy)
4. Create a `.env` file that includes the following lines:

```
GOOGLE_APPLICATION_CREDENTIALS=google_key.json
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/{YOUR_KEY}
```
