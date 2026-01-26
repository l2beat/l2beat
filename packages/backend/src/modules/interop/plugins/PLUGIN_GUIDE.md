# Interop Plugin Development Guide

## Overview

Interop plugins capture blockchain events and match them to create:
- **Messages**: Cross-chain messaging (e.g., `opstack.L1ToL2Message`)
- **Transfers**: Token/ETH transfers with amounts (e.g., `my-plugin.L1ToL2Transfer`)

## Architecture

### Two-Phase Processing

1. **Capture Phase**: Plugins scan transaction logs and create `InteropEvent` objects
2. **Match Phase**: Plugins correlate events across chains to create `InteropMessage` or `InteropTransfer`

Notes:
- `capture()` runs per log; return `undefined` when a log is irrelevant.
- `InteropEvent` types should be short (`protocol.EventName`), stable, and directioned when useful.

### Plugin Ordering

Plugins in `index.ts` execute in order. Specific plugins must run BEFORE generic ones:

```typescript
new MySpecificPlugin(),            // Specific app - runs first
new OpStackStandardBridgePlugin(), // Token bridge - runs second
new OpStackPlugin(),               // Generic messaging - runs last
```

## Environment Setup

```bash
# RPC URLs from /packages/config/.env (use rpc.l2beat.com URLs)
# Use ^VAR= to match exact variable and skip commented/similar lines
export ETHEREUM_RPC_URL=$(grep "^ETHEREUM_RPC_URL=" /packages/config/.env | cut -d= -f2-)
export BASE_RPC_URL=$(grep "^BASE_RPC_URL=" /packages/config/.env | cut -d= -f2-)

# Database from /packages/backend/.env
export PRISMA_DB_URL=$(grep "^PRISMA_DB_URL=" /packages/backend/.env | cut -d= -f2-)
```

## Creating a Plugin

### 1. Analyze Transactions

```bash
# Get receipt with logs
cast receipt <TX_HASH> --rpc-url $ETHEREUM_RPC_URL

# Decode event signature
cast 4byte-event <TOPIC0_HASH>

# Get contract source (shows indexed params)
cast source <ADDRESS> -f | grep -A6 "event MyEvent"
```

Tips:
- Always confirm the event signature (indexed params + tuple syntax).
- Match `topic0` with `cast 4byte-event` if parsing fails.

### 2. Create Plugin File

Key components for `src/modules/interop/plugins/<your-plugin>.ts`:

```typescript
// 1. Event signatures
const myEventLog = 'event MyEvent(address indexed token, uint256 amount)'

// 2. Contract addresses using ChainSpecificAddress
const L1_BRIDGE = ChainSpecificAddress('eth:0x...')
const L2_BRIDGE = ChainSpecificAddress('base:0x...')

// 3. Event types (add TTL for events awaiting finalization)
const MyL1Event = createInteropEventType<{ amount: bigint }>('my-plugin.L1Event')
const MyL2Event = createInteropEventType<{ amount: bigint }>('my-plugin.L2Event', {
  ttl: 30 * UnixTime.DAY,
})

// 4. Event parsers
const parseMyEvent = createEventParser(myEventLog)

// 5. Plugin class implementing InteropPluginResyncable
export class MyPlugin implements InteropPluginResyncable {
  readonly name = 'my-plugin'

  getDataRequests(): DataRequest[] { /* return event signatures + addresses */ }
  capture(input: LogToCapture) { /* parse logs, return events */ }
  matchTypes = [MyL2Event]  // Events that trigger matching
  match(event, db) { /* correlate events, return Message/Transfer */ }
}
```

### 3. Register Plugin

In `src/modules/interop/plugins/index.ts`, add before generic plugins, e.g.:

```typescript
import { MyPlugin } from './my-plugin'

// In createInteropPlugins(), add to eventPlugins array:
eventPlugins: [
  // ... other plugin clusters ...
  new MyPlugin(), // Add as single item if it doesn't depend on other plugins
  {
    clusterName: 'opstack',
    plugins: [
      new MyPlugin(), // or add into a cluster, BEFORE more generic plugins it builds on in the cluster
      new OpStackPlugin()
    ]
  },
  // ...
]
```

### 4. Add Test Examples

In `src/modules/interop/examples/examples.jsonc`:

```jsonc
"my-plugin": {
  "groups": [
    {
      "name": "Example flow",
      "txs": [
        { "chain": "ethereum", "tx": "0x..." },
        { "chain": "base", "tx": "0x..." }
      ],
      "events": ["my-plugin.L1Event", "my-plugin.L2Event"],
      "messages": [{ "type": "opstack.L1ToL2Message", "app": "my-plugin" }],
      "transfers": ["my-plugin.L1ToL2Transfer"]
    }
  ]
}
```

### 5. Test

```bash
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example my-plugin --simple
```

## Common Patterns

### When You Need Other Logs in the Same Tx

Use `includeTxEvents` in `getDataRequests()` whenever you need to correlate with
auxiliary logs (e.g. `Transfer`, `BridgeBurn`, `BridgeMint`, etc.) during the capture phase:

```ts
{
  type: 'event',
  signature: myPrimaryEventLog,
  includeTxEvents: [transferLog, bridgeBurnLog],
  addresses: [L1_BRIDGE],
}
```

### Synthetic Matching Keys

If the two sides do not share a hash/nonce, build the most robust synthetic key:

```ts
const matchId = `${assetId}-${receiver.toLowerCase()}-${amount.toString()}`
```

### Matching Strategy

- Put the **last-arriving** event type in `matchTypes` so matching happens when the destination side exists.
- Use `sameTxBefore`/`sameTxAfter` when log indices vary; use `sameTxAtOffset` only when offsets are stable.

### Building on OpStack

1. Import OpStack event types: `SentMessage`, `RelayedMessage`, `MessagePassed`, `WithdrawalFinalized`
2. Capture your app-specific events independently
3. In match phase, use `sameTxAtOffset` to find related events
4. Use `msgHash` or `withdrawalHash` to correlate across chains

Reference: `lido-wsteth.ts`, `sky-bridge.ts`, `maker-bridge.ts`, `beefy-bridge.ts`

### sameTxAtOffset vs sameTxBefore

- **`sameTxAtOffset`**: Finds event at exact logIndex offset. Use when offsets are consistent.
- **`sameTxBefore`/`sameTxAfter`**: Finds **closest** matching event. Use when offsets vary between chains.

Example: Optimism ETH deposits have an extra `ETHLocked` event that Base doesn't have, so use `sameTxBefore` instead of fixed offset.

### Common OpStack Offsets

| Pattern | Offset |
|---------|--------|
| L2: AppEvent → RelayedMessage | `+1` |
| L1: SentMessage → AppEvent | `+2` |
| L1: AppEvent → WithdrawalFinalized | `+2` |
| L2: MessagePassed → AppEvent | `+3` |
| L2: AppEvent → MessagePassed | `-1` |

### Determining Offsets

```bash
# Get log indices
cast receipt <TX_HASH> --rpc-url $ETHEREUM_RPC_URL --json | jq '.logs[] | {logIndex, address, topic0: .topics[0]}'

# Decode event signature
cast 4byte-event <TOPIC0>
```

Convert hex logIndex to decimal and calculate offset.

### Address and Chain Helpers

- `ChainSpecificAddress('eth:0x...')` and `ChainSpecificAddress('base:0x...')` for address scoping.
- `Address32.from(log.address)` for ERC-20 token addresses.
- `EthereumAddress(value)` for receiver/sender EOA-like fields (validates checksum).
- Prefer `defineNetworks()` + chain-specific filtering if the plugin supports multiple networks.

## Troubleshooting

### Event Not Captured
- Wrong event signature (check indexed params)
- Wrong contract address
- Wrong chain check in `capture()`

### Match Not Working
- Missing event in `matchTypes` array
- Wrong `sameTxAtOffset` value (check actual log indices)
- Offsets vary between chains → use `sameTxBefore` instead
- Another plugin matched first due to ordering

### Test Output
- `[PASS]` = Expected and found
- `[FAIL]` = Expected but not found
- `[XTRA]` = Found but not in expected list (often OK)
- `[MTCH]` = Event was matched by a plugin
- `[UNMT]` = Event captured but not matched

## Reference Plugins

| Type | Examples |
|------|----------|
| Simple L1→L2 | `sorare-base.ts`, `beefy-bridge.ts` |
| Matcher-only | `across-settlement-op.ts`, `zklink-nova.ts` |
| Bidirectional | `lido-wsteth.ts`, `sky-bridge.ts`, `maker-bridge.ts` |
| Multi-chain | `opstack-standardbridge.ts` |
| Config-based | `orbitstack/orbitstack-customgateway.ts` |

## Useful Commands

```bash
# Run example
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example <name> --simple

# Run all examples
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example all

# Query database
psql "$PRISMA_DB_URL" -c "SELECT * FROM \"InteropMessage\" WHERE \"srcTxHash\" LIKE '%<TX>%'"

# Get contract source
cast source <ADDRESS> -f | grep -A6 "event Name"
```
