# Architecture decision records

Non-obvious decisions about the code, moved out of code comments. Why: see
[ADR 1](0001-decisions-live-in-adrs-not-comments.md).

Each ADR names the files it covers on its `Code:` line. To find the reasoning
behind a file, search this folder for its path.

## Writing one

1. Copy the shape of an existing ADR: a numbered title, `Status`, `Code`, then
   the decision and why, in plain words.
2. Number it one past the highest number here.
3. Add it to the list below.
4. When code changes a decision, update its ADR in the same PR. When the code
   goes away, mark the ADR `Status: superseded` or delete it.

## Index

| # | Decision | Code |
|---|---|---|
| 1 | [Decisions live in ADRs, not in code comments](0001-decisions-live-in-adrs-not-comments.md) | `lint/noComments.mts` |
| 2 | [InMemoryCache: keys, late fallbacks and sweeps](0002-in-memory-cache.md) | shared-pure `InMemoryCache` |
| 3 | [Retry policies](0003-retry-policies.md) | shared-pure `Retries` |
| 4 | [Address parsing](0004-address-parsing.md) | shared-pure `EthereumAddress`, `ChainSpecificAddress` |
| 5 | [UnixTime is a plain number](0005-unix-time-is-a-plain-number.md) | shared-pure `UnixTime` |
| 6 | [Manual token relations](0006-manual-token-relations.md) | shared-pure `TokenRelation` |
| 7 | [Calendar dates are checked by round trip](0007-calendar-date-check.md) | shared-pure `dateStrings` |
| 8 | [EVM disassembler](0008-evm-disassembler.md) | shared-pure `disasmEVM` |
| 9 | [Ossification band wording](0009-ossification-band-wording.md) | shared-pure `ossificationScoreBands` |
| 10 | [Interop lanes](0010-interop-lanes.md) | shared-pure `InteropLane` |
| 11 | [Blocks on chains with asynchronous execution](0011-asynchronous-execution-blocks.md) | shared-pure `Block` |
| 12 | [tRPC identity transformer](0012-trpc-identity-transformer.md) | shared-pure `trpcTransformer` |
| 13 | [OpenPanel plugin without a Vite dependency](0013-openpanel-plugin-without-vite.md) | shared-pure `openPanelPlugin` |
| 14 | [Compile-time type equality](0014-compile-time-type-equality.md) | shared-pure `typeAssertions` |
