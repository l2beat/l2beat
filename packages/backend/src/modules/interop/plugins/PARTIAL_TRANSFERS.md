# One-Sided Chains in Interop (short intro)

## What is a one-sided chain?

A one-sided chain is a chain we reference in interop matching, but do not capture as a full event source in our pipeline.

Current config:

- `INTEROP_ONE_SIDED_CHAINS = ['solana']`
- This list is a policy/allowlist input; partial transfer creation itself is not auto-gated by framework assertions.

## Why do we need them?

- Some flows are only observable on one side (usually EVM side), but we still know the counterparty chain from calldata or protocol payload.
- Without one-sided support, these transfers are dropped or remain unmatched/unsupported.
- We still want chain-level transfer stats and token linkage for these flows.

## How to create a partial transfer

`Result.Transfer()` supports 3 valid shapes:

1. Full transfer:

```ts
Result.Transfer('app.Transfer', { srcEvent, dstEvent, ... })
```

2. Source event + destination chain (destination event missing):

```ts
Result.Transfer('app.Transfer', { srcEvent, dstChain: 'solana', ... })
```

3. Source chain + destination event (source event missing):

```ts
Result.Transfer('app.Transfer', { srcChain: 'solana', dstEvent, ... })
```

Invalid:

- `srcChain + dstChain` only (no events on either side).

## Event x chain combinations

Use this quick matrix:

| src side   | dst side   | status  |
| ---------- | ---------- | ------- |
| `srcEvent` | `dstEvent` | full    |
| `srcEvent` | `dstChain` | partial |
| `srcChain` | `dstEvent` | partial |
| `srcChain` | `dstChain` | invalid |

## Super short `layerzero-v2-ofts` example

```ts
// full match (current OFT flow)
const sent = db.find(OFTSentPacketSent, { guid })
if (!sent) return
return [
  Result.Transfer('oftv2.Transfer', {
    srcEvent: sent,
    dstEvent: oftReceivedPacketDelivered,
    srcAmount: sent.args.amountSentLD,
    dstAmount: oftReceivedPacketDelivered.args.amountReceivedLD,
  }),
]
```

```ts
// one-sided variant (if destination event is missing, but chain is known)
// so << if $dstChain in oneSidedChains and we could not find counter-party event then: >>
return [
  Result.Transfer('oftv2.Transfer', {
    srcEvent: sent,
    dstChain: sent.args.$dstChain,
  }),
]
```

## `matchTypes` (trigger array) pattern

If you add a new event type to matching, do both:

1. Extend `matchTypes`
2. Handle that type in `match()`

```ts
matchTypes = [OFTReceivedPacketDelivered, OFTSentPacketSent]

match(event, db) {
  if (OFTReceivedPacketDelivered.checkType(event)) {
    // existing full-match path
  }

  if (OFTSentPacketSent.checkType(event)) {
    // fallback one-sided path
    return [
      Result.Transfer('oftv2.Transfer', {
        srcEvent: event,
        dstChain: event.args.$dstChain,
      }),
    ]
  }
}
```

Note:

- The actual plugin field name is `matchTypes` (sometimes called "matched types" informally).

## Mental model (step-by-step)

1. Capture the event you can observe.
2. Extract counterparty chain (`$srcChain` / `$dstChain`) from protocol data.
3. Try full matching first (`srcEvent + dstEvent`).
4. If counterpart event is unavailable but chain is known (and accepted by your one-sided policy), emit partial transfer (`event + chain`).
5. Set token/amount/burn/mint flags from the observed side (and decoded payload if available).
6. Do not fabricate missing-side tx/log/time fields; they should remain empty.
7. If nothing can be matched/emitted, leave the event unmatched (it may be classified as unsupported later).

## Practical note

- Partial transfer support is implemented in the transfer type API and matching loop.
- `oneSidedChains` is currently config-level policy data; plugin/matching logic decides when to use it.
- Unsupported marking is event-based and mainly affects unmatched events; matched events consumed into a transfer are not treated as unsupported.
