# Interop Plugin Development Guide

This guide explains how to create new interop plugins for tracking cross-chain transfers and messages.

## Overview

Interop plugins capture blockchain events from L1/L2 transactions and match them to create:
- **Messages**: Cross-chain messaging (e.g., `opstack.L1ToL2Message`)
- **Transfers**: Token/ETH transfers with amounts (e.g., `sorare-base.L1ToL2Transfer`)

## Architecture

### Plugin Interface

```typescript
interface InteropPlugin {
  name: string
  capture?: (input: LogToCapture) => Omit<InteropEvent, 'plugin'>[] | undefined
  captureTx?: (input: TxToCapture) => Omit<InteropEvent, 'plugin'>[] | undefined
  matchTypes?: InteropEventType<unknown>[]
  match?: (event: InteropEvent, db: InteropEventDb) => MatchResult | undefined | Promise<MatchResult | undefined>
}
```

### Two-Phase Processing

1. **Capture Phase**: Plugins scan transaction logs and create `InteropEvent` objects
2. **Match Phase**: Plugins correlate events across chains to create `InteropMessage` or `InteropTransfer`

### Plugin Ordering

Plugins in `index.ts` are executed in order. More specific plugins must run BEFORE generic ones so they can "claim" events first:

```typescript
new SorareBasePlugin(),           // Specific app - runs first
new OpStackStandardBridgePlugin(), // Token bridge - runs second
new OpStackPlugin(),              // Generic messaging - runs last
```

## Environment Setup

### Database Connection

The database URL is stored in the backend `.env` file:

```bash
# Location: /packages/backend/.env
# Variable: PRISMA_DB_URL

# Connect to the database
psql "$(grep PRISMA_DB_URL /packages/backend/.env | cut -d= -f2-)"

# Or export it for repeated use
export PRISMA_DB_URL=$(grep PRISMA_DB_URL /packages/backend/.env | cut -d= -f2-)
psql "$PRISMA_DB_URL" -c "SELECT * FROM \"InteropMessage\" LIMIT 5;"
```

### RPC URLs

RPC URLs are stored in the config `.env` file:

```bash
# Location: /packages/config/.env
# Variables: ETHEREUM_RPC_URL, BASE_RPC_URL, ARBITRUM_RPC_URL, OPTIMISM_RPC_URL, etc.

# Use with cast commands
cast receipt <TX_HASH> --rpc-url $(grep ETHEREUM_RPC_URL /packages/config/.env | cut -d= -f2-)

# Or export for repeated use
export ETHEREUM_RPC_URL=$(grep ETHEREUM_RPC_URL /packages/config/.env | cut -d= -f2-)
export BASE_RPC_URL=$(grep BASE_RPC_URL /packages/config/.env | cut -d= -f2-)
cast receipt <TX_HASH> --rpc-url $ETHEREUM_RPC_URL
```

**Important**:
- **ALWAYS use the RPC URLs from the config `.env` file** - never use public RPC endpoints.
- **Do NOT use `source .env`** - it doesn't work reliably in subshells. Always use `grep ... | cut` or inline `$(grep ...)` instead.
- Use the inline pattern for one-off commands: `cast receipt <TX> --rpc-url $(grep ETHEREUM_RPC_URL /packages/config/.env | cut -d= -f2-)`

## Step-by-Step: Creating a New Plugin

### Step 1: Analyze the Transaction

Start with an example transaction hash. Use `cast` to understand the events:

```bash
# Get transaction details
cast tx <TX_HASH> --rpc-url <RPC_URL>

# Get transaction receipt with logs
cast receipt <TX_HASH> --rpc-url <RPC_URL>

# Decode event signature from topic0
cast 4byte-event <TOPIC0_HASH>
```

**Example output:**
```
TransferRegistered(bytes32,address,address,uint256,bytes32)
```

### Step 2: Identify Indexed vs Non-Indexed Parameters

From the receipt logs:
- `topics[0]` = event signature hash
- `topics[1..n]` = indexed parameters
- `data` = non-indexed parameters (ABI encoded)

**Important**: The `cast 4byte-event` output doesn't show which params are indexed. You must check the topics vs data to determine this.

Example log analysis:
```json
{
  "topics": [
    "0xf4fff384...",  // event sig
    "0x00...19f494..." // indexed sender
  ],
  "data": "0x776027ce...bbeca...006e22...f9bff6..."
  // ticketHash, recipient, amount, messageHash (non-indexed)
}
```

So the correct signature is:
```
event TransferRegistered(bytes32 ticketHash, address indexed sender, address recipient, uint256 amount, bytes32 messageHash)
```

### Step 3: Find the Matching Transaction

Query the database to find if matching transactions already exist:

```bash
psql "$PRISMA_DB_URL" -c "
  SELECT plugin, type, \"srcChain\", \"srcTxHash\", \"dstChain\", \"dstTxHash\"
  FROM \"InteropMessage\"
  WHERE \"srcTxHash\" LIKE '%<TX_HASH>%'
  LIMIT 5;
"
```

If matched by `opstack.L1ToL2Message`, you have both L1 and L2 tx hashes to work with.

### Step 4: Analyze Both Sides

For L1→L2 transfers, analyze both:

**L1 (Ethereum):**
```bash
cast receipt <L1_TX_HASH> --rpc-url $ETHEREUM_RPC_URL
```

**L2 (e.g., Base):**
```bash
cast receipt <L2_TX_HASH> --rpc-url $BASE_RPC_URL
```

Identify which events you need to capture on each chain.

### Step 5: Create the Plugin File

Create `src/modules/interop/plugins/<your-plugin>.ts`:

```typescript
import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  // Import from opstack if building on top of it
  hashCrossDomainMessageV1,
  parseRelayedMessage,
  parseSentMessage,
  parseSentMessageExtension1,
  RelayedMessage,
  SentMessage,
} from './opstack/opstack'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// Contract addresses
const L1_BRIDGE = EthereumAddress('0x...')
const L2_BRIDGE = EthereumAddress('0x...')

// Define event types with payload structure
const MyL1Event = createInteropEventType<{
  msgHash: string
  amount: bigint
}>('my-plugin.L1Event')

const MyL2Event = createInteropEventType<{
  msgHash: string
}>('my-plugin.L2Event')

// Create event parsers from Solidity signatures
const parseMyL1Event = createEventParser(
  'event MyEvent(bytes32 indexed hash, uint256 amount)'
)

const parseMyL2Event = createEventParser(
  'event MyEvent(bytes32 hash)'
)

export class MyPlugin implements InteropPlugin {
  name = 'my-plugin'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const parsed = parseMyL1Event(input.log, [L1_BRIDGE])
      if (parsed) {
        // Optionally find related events in same tx
        const relatedLog = input.txLogs.find(log => /* ... */)

        return [MyL1Event.create(input, {
          msgHash: parsed.hash,
          amount: parsed.amount,
        })]
      }
    } else if (input.chain === 'base') {
      const parsed = parseMyL2Event(input.log, [L2_BRIDGE])
      if (parsed) {
        return [MyL2Event.create(input, {
          msgHash: parsed.hash,
        })]
      }
    }
  }

  // Which event types trigger matching
  matchTypes = [MyL2Event]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (MyL2Event.checkType(event)) {
      // Find corresponding L1 event
      const srcEvent = db.find(MyL1Event, {
        msgHash: event.args.msgHash,
      })
      if (!srcEvent) return

      return [
        Result.Message('my-plugin.L1ToL2Message', {
          app: 'my-app',
          srcEvent,
          dstEvent: event,
        }),
        Result.Transfer('my-plugin.L1ToL2Transfer', {
          srcEvent,
          srcAmount: srcEvent.args.amount,
          srcTokenAddress: Address32.NATIVE, // or token address
          dstEvent: event,
          dstAmount: srcEvent.args.amount,
          dstTokenAddress: Address32.NATIVE,
        }),
      ]
    }
  }
}
```

### Step 6: Register the Plugin

Edit `src/modules/interop/plugins/index.ts`:

```typescript
import { MyPlugin } from './my-plugin'

// In createInteropPlugins(), add to eventPlugins array:
eventPlugins: [
  // ... other plugins ...
  new MyPlugin(), // Add BEFORE more generic plugins it builds on
  new OpStackStandardBridgePlugin(),
  new OpStackPlugin(),
  // ...
]
```

### Step 7: Add Test Examples

Edit `src/modules/interop/examples/examples.jsonc`:

```jsonc
"my-plugin": {
  "txs": [
    { "chain": "ethereum", "tx": "0x..." },
    { "chain": "base", "tx": "0x..." }
  ],
  "events": ["my-plugin.L1Event", "my-plugin.L2Event"],
  "messages": ["my-plugin.L1ToL2Message"],
  "transfers": ["my-plugin.L1ToL2Transfer"]
}
```

For plugins with multiple test cases, use groups:

```jsonc
"my-plugin": {
  "groups": [
    {
      "name": "L1 -> L2 deposit",
      "txs": [
        { "chain": "ethereum", "tx": "0x..." },
        { "chain": "base", "tx": "0x..." }
      ],
      "messages": ["my-plugin.L1ToL2Message"],
      "transfers": ["my-plugin.L1ToL2Transfer"]
    },
    {
      "name": "L2 -> L1 withdrawal",
      "txs": [
        { "chain": "base", "tx": "0x..." },
        { "chain": "ethereum", "tx": "0x..." }
      ],
      "messages": ["my-plugin.L2ToL1Message"],
      "transfers": ["my-plugin.L2ToL1Transfer"]
    }
  ]
}
```

### Step 8: Test the Plugin

```bash
# Run the example test
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example my-plugin --simple

# Run lint and typecheck
pnpm lint
pnpm typecheck
```

Expected output:
```
[XTRA] [MTCH] Event    my-plugin.L1Event
[XTRA] [MTCH] Event    my-plugin.L2Event
[PASS] Message  my-plugin.L1ToL2Message
[PASS] Transfer my-plugin.L1ToL2Transfer

SUMMARY

Events:
    my-plugin.L1Event 1
    my-plugin.L2Event 1
Messages:
    my-plugin.L1ToL2Message 1
Transfers:
    my-plugin.L1ToL2Transfer 1
```

## Common Patterns

### Building on OpStack

For apps using OpStack's CrossDomainMessenger:

1. Import and reuse OpStack's event types and parsers
2. Capture your app-specific event independently (don't combine in capture phase)
3. In match phase, use `sameTxBefore`/`sameTxAfter` to find related events
4. Use `msgHash` or `withdrawalHash` to correlate events across chains

See `opstack-standardbridge.ts` and `sorare-base.ts` for examples.

### Finding Related Events in Same Transaction

**Preferred approach**: Use `sameTxBefore`/`sameTxAfter` queries in the match phase:

```typescript
// Capture phase: capture each event independently
capture(input: LogToCapture) {
  const myEvent = parseMyEvent(input.log, [MY_CONTRACT])
  if (myEvent) {
    return [MyEvent.create(input, { /* only data from this event */ })]
  }
}

// Match phase: find related events using sameTxBefore/sameTxAfter
match(event: InteropEvent, db: InteropEventDb) {
  if (MyEvent.checkType(event)) {
    // Find event that comes AFTER this one in the same tx
    const laterEvent = db.find(OtherEvent, {
      sameTxAfter: event,
      chain: event.args.chain,
    })

    // Find event that comes BEFORE this one in the same tx
    const earlierEvent = db.find(AnotherEvent, {
      sameTxBefore: event,
      chain: event.args.chain,
    })
  }
}
```

**Important**: `sameTxBefore` finds events with **lower** logIndex, `sameTxAfter` finds events with **higher** logIndex. To determine the correct direction, check actual log indices in transaction receipts (see "Determining Event Order" below).

**Legacy approach** (use only when you need data from multiple events in a single captured event):

```typescript
capture(input: LogToCapture) {
  const myEvent = parseMyEvent(input.log, [MY_CONTRACT])
  if (myEvent) {
    const relatedLog = input.txLogs.find(log => {
      const parsed = parseOtherEvent(log, [OTHER_CONTRACT])
      return parsed !== undefined
    })
    // Combine data from both events into one InteropEvent
  }
}
```

### Determining Event Order

When using `sameTxBefore`/`sameTxAfter`, you must know which event comes first. Check actual log indices:

```bash
# Get transaction receipt and look at logIndex for each event
cast receipt <TX_HASH> --rpc-url <RPC_URL>
```

Example output (relevant fields):
```json
{
  "logs": [
    { "logIndex": "0x1a6", "address": "0x...", "topics": ["0xddf252ad..."] },
    { "logIndex": "0x1a7", "address": "0x...", "topics": ["0x3ceee06c..."] },
    { "logIndex": "0x1a8", "address": "0x...", "topics": ["0xd59c65b3..."] }
  ]
}
```

Lower `logIndex` = emitted earlier in the transaction.

**Common OpStack patterns:**
- L1 withdrawal finalization: `BridgeFinalized` → `WithdrawalFinalized` (portal event comes last)
- L2 deposit finalization: `DepositFinalized` → `RelayedMessage` (messenger event comes last)
- L1 deposit initiation: `BridgeInitiated` → `SentMessage` (messenger event comes last)
- L2 withdrawal initiation: `BridgeInitiated` → `MessagePassed` (message passer event comes last)

### Event with TTL (Time-To-Live)

For events that take time to finalize (e.g., challenge periods):

```typescript
const MyEvent = createInteropEventType<{ ... }>('my-plugin.Event', {
  ttl: 14 * UnixTime.DAY  // Keep in DB for 14 days
})
```

## Troubleshooting

### Event Not Being Captured

1. **Wrong event signature**: Check indexed vs non-indexed params
   - Use `cast source <ADDRESS> -f | grep -A6 "event Name"` to see the exact signature
   - Indexed params go in `topics[]`, non-indexed go in `data`
2. **Wrong contract address**: Verify the address matches
3. **Wrong chain check**: Ensure `input.chain` condition is correct

### Match Not Working

1. **Missing matchTypes**: Add your event type to `matchTypes` array
2. **Wrong db.find parameters**: Check the field names match event args
3. **Plugin order**: Ensure your plugin runs before generic ones
4. **Wrong sameTxBefore/sameTxAfter direction**: Check actual log indices in the transaction receipt. Use `sameTxAfter` to find events with higher logIndex, `sameTxBefore` for lower logIndex

### Test Shows FAIL

- `[FAIL] Event X` = Event not captured (check capture logic)
- `[XTRA] Event X` = Extra event captured (not in expected list, may be fine)
- `[PASS] Event X` = Event captured as expected
- `[MTCH]` = Event was matched (used by a plugin's match function)
- `[UNMT]` = Event was captured but not matched (may indicate match logic issue)

## Useful Commands

```bash
# Suppress foundry nightly warnings (add to all cast commands)
export FOUNDRY_DISABLE_NIGHTLY_WARNING=true

# Decode event signature (shows params but NOT which are indexed)
cast 4byte-event <TOPIC0>

# Fetch contract source code (best way to get exact event signatures with indexed params)
cast source <ADDRESS> --etherscan-api-key <KEY> -f | grep -A6 "event MyEvent"

# Example: find TransferRegistered event in Sorare contract
cast source 0xDAB785F7719108390A26ff8d167e40aE4789F8D7 -f | grep -A6 "event TransferRegistered"
# Output:
#   event TransferRegistered(
#       bytes32 fact,
#       address indexed from,  <-- shows which params are indexed!
#       address to,
#       uint256 amount,
#       bytes32 salt
#   );

# Save full source to directory for deeper analysis
cast source <ADDRESS> -d ./contract-source

# Get tx details
cast tx <HASH> --rpc-url <URL>

# Get tx receipt with logs
cast receipt <HASH> --rpc-url <URL>

# Decode calldata
cast calldata-decode "function(params)" <DATA>

# Query database
psql "$PRISMA_DB_URL" -c "SELECT ... FROM \"InteropMessage\" WHERE ..."

# Run specific example
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example <name> --simple

# Run all examples
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example all
```

## Adding OrbitStack Custom Gateways

For Arbitrum custom token gateways, add to `customGateways` in `orbitstack/orbitstack.ts`:

```typescript
{
  key: 'mytoken',  // App name: orbitstack-customgateway-mytoken
  l1Gateway: EthereumAddress('0x...'),  // Emits DepositInitiated on L1
  l2Gateway: EthereumAddress('0x...'),  // Emits WithdrawalInitiated on L2
},
```

**Finding gateway addresses:** L1 gateway emits `DepositInitiated`, L2 gateway emits `WithdrawalInitiated`.

**Example transactions needed:**
- Deposit: L1 tx + L2 RedeemScheduled tx + L2 DepositFinalized tx (get via `retryTxHash` in RedeemScheduled event)
- Withdrawal: L2 tx + L1 finalization tx

**Find L2 tx from L1:** `SELECT "dstTxHash" FROM "InteropMessage" WHERE "srcTxHash" LIKE '%<L1_TX>%'`

Add txs to `examples.jsonc` under `orbitstack-customgateway` with expected events/messages/transfers, then test:
```bash
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example orbitstack-customgateway --simple
```

**Supported gateways:** DAI, LPT, GRT, wstETH, Custom (see `orbitstack.ts` for addresses)

## Reference Plugins

- **Simple**: `sorare-base.ts` - Single app on OpStack with unique L2 event
- **Matcher-only**: `across-settlement.ts`, `zklink-nova.ts` - Match on OpStack's RelayedMessage (no unique L2 event)
- **Bidirectional**: `maker-bridge.ts`, `sky-bridge.ts`, `lido-wsteth.ts` - L1→L2 deposits and L2→L1 withdrawals with transfers
- **Standard**: `opstack-standardbridge.ts` - Token bridge with multiple event types
- **Complex**: `layerzero/layerzero-v2.plugin.ts` - Config-based multi-chain
- **Config-based**: `orbitstack/orbitstack-customgateway.ts` - Add new token gateways via configuration
