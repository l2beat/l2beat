# Wormhole & Mayan API Guide

This guide explains how to use the Wormholescan API and Mayan Explorer API to trace cross-chain transactions for debugging and finding example transactions.

## Wormholescan API

Base URL: `https://api.wormholescan.io/api/v1`

No authentication required, but some endpoints are rate limited.

### Chain IDs (Wormhole)

Common chain IDs used by Wormhole:
- 1 = Solana
- 2 = Ethereum
- 4 = BSC
- 5 = Polygon
- 6 = Avalanche
- 10 = Fantom
- 23 = Arbitrum
- 24 = Optimism
- 30 = Base
- 47 = Near

### Search Operations by Transaction Hash

Find Wormhole operations for a given source transaction:

```bash
curl -s 'https://api.wormholescan.io/api/v1/operations?txHash=0x...' \
  -H 'accept: application/json' | jq '.'
```

### Search Operations by App ID

Find operations for a specific protocol:

```bash
# Mayan Swift operations
curl -s 'https://api.wormholescan.io/api/v1/operations?appId=MAYAN_SWIFT&page=0&pageSize=100' \
  -H 'accept: application/json' | jq '.'

# Filter by source chain
curl -s 'https://api.wormholescan.io/api/v1/operations?appId=MAYAN_SWIFT&sourceChain=23&pageSize=50' \
  -H 'accept: application/json' | jq '.'

# Filter by target chain
curl -s 'https://api.wormholescan.io/api/v1/operations?appId=MAYAN_SWIFT&targetChain=4&pageSize=50' \
  -H 'accept: application/json' | jq '.'
```

Common app IDs: `MAYAN_SWIFT`, `WORMHOLE_GATEWAY`, `PORTAL_TOKEN_BRIDGE`, `CCTP_WORMHOLE_INTEGRATION`

### Get VAA Details

Get VAA (Verified Action Approval) by chain/emitter/sequence:

```bash
# Format: /vaas/{chainId}/{emitterAddress}/{sequence}
curl -s 'https://api.wormholescan.io/api/v1/vaas/4/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/177768' \
  -H 'accept: application/json' | jq '{id: .data.id, txHash: .data.txHash, timestamp: .data.timestamp}'
```

### Get Transaction Details with Payload

Get parsed transaction with payload details:

```bash
curl -s 'https://api.wormholescan.io/api/v1/transactions/4/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/177768' \
  -H 'accept: application/json' | jq '{id: .id, txHash: .txHash, action: .payload.action, messages: .payload.messages, globalTx: .globalTx}'
```

The `globalTx` field shows:
- `originTx`: Source transaction details
- `destinationTx`: Destination transaction (if relayed/redeemed)

### Finding Completed Operations

Operations with destination transactions:

```bash
curl -s 'https://api.wormholescan.io/api/v1/operations?appId=MAYAN_SWIFT&pageSize=100' \
  -H 'accept: application/json' | jq '[.operations[] | select(.targetChain.transaction.txHash)] | .[0:5]'
```

### Mayan Swift Payload Actions

When querying Mayan Swift operations, the `action` field indicates:
- `1` = Single order (UNLOCK message type 0x02)
- `4` = Batch unlock (BATCH_UNLOCK message type 0x04)

Example: Find batch operations:

```bash
curl -s 'https://api.wormholescan.io/api/v1/operations?appId=MAYAN_SWIFT&pageSize=100' \
  -H 'accept: application/json' | jq '[.operations[] | select(.content.payload.action == 4)] | .[0:5]'
```

## Mayan Explorer API

Base URL: `https://explorer-api.mayan.finance/v3`

No authentication required.

### Get Swap by Transaction Hash

Query full swap details by any transaction hash in the flow:

```bash
curl -s 'https://explorer-api.mayan.finance/v3/swap/trx/0x...' | jq '.'
```

This returns comprehensive data including:
- `orderHash`: Unique order identifier
- `sourceTxHash` / `createTxHash`: Order creation transaction
- `fulfillTxHash`: Order fulfillment transaction
- `redeemTxHash`: Settlement/unlock transaction
- `sourceChain`, `destChain`: Chain IDs (Mayan format, same as Wormhole)
- `batchFulfilled`: Whether fulfillment was batched
- `status`: Order status (`ORDER_CREATED`, `ORDER_FULFILLED`, `ORDER_UNLOCKED`)
- `txs`: Array of all transactions in the flow with goals

### Search Swaps with Filters

```bash
# By source chain
curl -s 'https://explorer-api.mayan.finance/v3/swaps?sourceChain=4&limit=20' | jq '.data'

# By destination chain
curl -s 'https://explorer-api.mayan.finance/v3/swaps?destChain=23&limit=20' | jq '.data'

# By status
curl -s 'https://explorer-api.mayan.finance/v3/swaps?status=ORDER_UNLOCKED&limit=20' | jq '.data'

# Combined filters
curl -s 'https://explorer-api.mayan.finance/v3/swaps?sourceChain=2&destChain=4&status=ORDER_UNLOCKED&limit=10' | jq '.data'
```

### Understanding the Response

Key fields in swap response:

```json
{
  "orderHash": "0xa2178dd7...",           // Order key for matching
  "sourceTxHash": "0x34159463...",        // OrderCreated tx
  "fulfillTxHash": "0xf7013ed6...",       // OrderFulfilled tx
  "redeemTxHash": "0x443fc3a3...",        // OrderUnlocked tx (settlement)
  "sourceChain": "2",                      // Ethereum
  "destChain": "4",                        // BSC
  "batchFulfilled": true,                  // Was fulfillment batched?
  "redeemSequence": "177768",              // Wormhole VAA sequence for settlement
  "txs": [
    {"txHash": "0x...", "goals": ["SEND"]},
    {"txHash": "0x...", "goals": ["FULFILL"]},
    {"txHash": "0x...", "goals": ["UNLOCK"]}
  ]
}
```

## Common Workflows

### 1. Trace a Complete Mayan Swift Flow

Given a source transaction hash:

```bash
# Step 1: Get swap details from Mayan API
curl -s 'https://explorer-api.mayan.finance/v3/swap/trx/0x34159463576341493f46076a0305f38f1d18d59977f2f2176efe8e62b6aefdc1' | jq '{
  orderHash,
  sourceTxHash,
  fulfillTxHash,
  redeemTxHash,
  sourceChain,
  destChain,
  batchFulfilled,
  redeemSequence
}'
```

### 2. Find the postBatch Transaction

If `batchFulfilled: true`, the settlement message comes from a separate postBatch tx.
Use the `redeemSequence` to find it:

```bash
# redeemSequence is the Wormhole VAA sequence from the destination chain
# destChain=4 (BSC), redeemSequence=177768
curl -s 'https://api.wormholescan.io/api/v1/vaas/4/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/177768' \
  -H 'accept: application/json' | jq '{txHash: .data.txHash}'

# This gives you the postBatch transaction hash
```

### 3. Get Batch Contents

Once you have the postBatch VAA, get the full payload:

```bash
curl -s 'https://api.wormholescan.io/api/v1/transactions/4/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/177768' \
  -H 'accept: application/json' | jq '.payload.messages'
```

This shows all order hashes in the batch with their destination chain IDs.

### 4. Find EVM-to-EVM Batched Settlement Examples

```bash
# Search for completed swaps from Ethereum to BSC
curl -s 'https://explorer-api.mayan.finance/v3/swaps?sourceChain=2&destChain=4&status=ORDER_UNLOCKED&limit=20' | jq '.data[] | select(.batchFulfilled == true) | {orderHash, sourceTxHash, fulfillTxHash, redeemTxHash}'
```

### 5. Verify Order Hash is in a Batch

Given an order hash and a postBatch VAA:

```bash
# Get batch contents
curl -s 'https://api.wormholescan.io/api/v1/transactions/4/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/177768' \
  -H 'accept: application/json' | jq '.payload.messages[] | select(.orderHash == "a2178dd759b8ca5aa843e4f541b6dc8b10bf2ec40da84cd501659150731e6528")'
```

## Mayan Swift Contract Addresses

The Mayan Swift contract address is the same across all EVM chains:
```
0xC38e4e6A15593f908255214653d3D947CA1c2338
```

In Wormhole emitter format (32 bytes, zero-padded):
```
000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338
```

## Useful jq Patterns

```bash
# Pretty print with selected fields
| jq '{field1, field2, nested: .nested.field}'

# Filter arrays
| jq '[.array[] | select(.condition == value)]'

# Get first N items
| jq '.[0:5]'

# Count items
| jq 'length'

# Check if field exists
| jq 'select(.field != null)'
```

## Troubleshooting

### "pageSize cannot be greater than 100"
Wormholescan API limits pageSize to 100. Use pagination:
```bash
curl -s '...&page=0&pageSize=100'
curl -s '...&page=1&pageSize=100'
```

### Transaction not found in Mayan API
The Mayan Explorer API only indexes swap transactions, not settlement-only transactions like postBatch. Use Wormholescan for those.

### destinationTx is null
The VAA hasn't been redeemed yet on the destination chain. For batch settlements, the redemption happens via `unlockBatch` which may not be tracked by Wormholescan.

### Finding matching postBatch for unlockBatch
1. Get the order hash from the OrderUnlocked event
2. Search Mayan API for swaps with that order hash
3. Use the redeemSequence to find the postBatch VAA in Wormholescan

## Efficiently Finding Settlement Examples

The API-based search can be slow and unreliable. Using `cast logs` is often faster for finding recent examples.

### Finding Non-Batched Examples

Non-batched settlements happen when the **destination is Ethereum** (batch=false). Look for completed swaps with destChain=2:

```bash
# 1. Search Mayan API for swaps to Ethereum
curl -s 'https://explorer-api.mayan.finance/v3/swaps?destChain=2&status=ORDER_UNLOCKED&limit=20' | \
  jq '.data[] | select(.fulfillTxHash | startswith("0x")) | {orderHash, sourceChain, destChain, sourceTxHash, fulfillTxHash, redeemTxHash}'

# 2. Get full details including batchFulfilled
curl -s 'https://explorer-api.mayan.finance/v3/swap/trx/0x<sourceTxHash>' | \
  jq '{orderHash, sourceChain, destChain, batchFulfilled, sourceTxHash, fulfillTxHash, redeemTxHash, txs}'
```

The `txs` array shows all transactions in the flow with their goals (SEND, FULFILL, UNLOCK).

### Finding Batched Examples Using Cast

Batched settlements happen when the **destination is an L2** (Arbitrum, Base, BSC, etc.). The fastest way to find them is to search for `OrderUnlocked` events directly using cast:

```bash
# Set up RPC URL (use l2beat RPC)
ARB_RPC="https://rpc.l2beat.com/arbitrum/local:YOUR_KEY"

# Get latest block
LATEST=$(cast block-number --rpc-url "$ARB_RPC")

# Search for OrderUnlocked events in recent blocks
cast logs --address 0xC38e4e6A15593f908255214653d3D947CA1c2338 \
  --from-block $((LATEST - 5000)) --to-block $LATEST \
  --rpc-url "$ARB_RPC" \
  'event OrderUnlocked(bytes32 key)'
```

Multiple OrderUnlocked events in the same transaction = batch unlock (unlockBatch call).

### Tracing Back from OrderUnlocked

Once you find an `unlockBatch` transaction:

```bash
# 1. Query Mayan API with the unlock tx hash
curl -s 'https://explorer-api.mayan.finance/v3/swap/trx/0x<unlockTxHash>' | \
  jq '{orderHash, sourceChain, destChain, batchFulfilled, sourceTxHash, fulfillTxHash, redeemTxHash, redeemSequence}'

# 2. Use redeemSequence to find the postBatch VAA
# Format: /vaas/{destChain}/{mayanEmitter}/{redeemSequence}
curl -s 'https://api.wormholescan.io/api/v1/vaas/30/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/<redeemSequence>' | \
  jq '{id: .data.id, txHash: .data.txHash}'

# 3. Verify batch contents
curl -s 'https://api.wormholescan.io/api/v1/transactions/30/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/<redeemSequence>' | \
  jq '{action: .payload.action, numMessages: (.payload.messages | length), srcChainIds: [.payload.messages[].srcChainId] | unique}'
```

### Example: Complete Batched Flow Discovery

```bash
# 1. Find OrderUnlocked on Arbitrum
ARB_RPC="https://rpc.l2beat.com/arbitrum/local:YOUR_KEY"
LATEST=$(cast block-number --rpc-url "$ARB_RPC")
cast logs --address 0xC38e4e6A15593f908255214653d3D947CA1c2338 \
  --from-block $((LATEST - 5000)) --rpc-url "$ARB_RPC" \
  'event OrderUnlocked(bytes32 key)' | head -50

# Found: 0x1cce878d867321728632a6e4d898e1b029e208dd9ae3d1e92f500dd4405abc5c (multiple events = batch)

# 2. Get swap details
curl -s 'https://explorer-api.mayan.finance/v3/swap/trx/0x1cce878d867321728632a6e4d898e1b029e208dd9ae3d1e92f500dd4405abc5c' | jq '.'
# Returns: sourceChain=23 (Arbitrum), destChain=30 (Base), redeemSequence=190162

# 3. Find postBatch tx on Base
curl -s 'https://api.wormholescan.io/api/v1/vaas/30/000000000000000000000000c38e4e6a15593f908255214653d3d947ca1c2338/190162' | jq '.data.txHash'
# Returns: b6487cd0106f85f35e75ecf561a7593356a2d60a5b76f739d286277d4482472b

# Complete flow:
# - OrderCreated (Arbitrum): 0xad5dda95f31cf81a1e2140d74838259dcb1b6062b39c7cd2dd9f4519cb6019a2
# - OrderFulfilled (Base): 0x20031fb2921b006c6e52b8de6e34385fe97d95dffcce1174cb659531b48d026f
# - postBatch (Base): 0xb6487cd0106f85f35e75ecf561a7593356a2d60a5b76f739d286277d4482472b
# - unlockBatch (Arbitrum): 0x1cce878d867321728632a6e4d898e1b029e208dd9ae3d1e92f500dd4405abc5c
```

### Key Insights

1. **Non-batched** = destination is Ethereum (batch=false in fulfillOrder)
   - SettlementSent in same tx as OrderFulfilled

2. **Batched** = destination is L2 (batch=true in fulfillOrder)
   - SettlementSent in separate postBatch tx
   - Multiple orders batched together for gas efficiency

3. **Chain IDs** (Wormhole/Mayan):
   - 1 = Solana, 2 = Ethereum, 4 = BSC, 23 = Arbitrum, 30 = Base

4. **Settlement direction**: Always goes back to source chain
   - srcChainId in batch payload = where OrderUnlocked will happen
