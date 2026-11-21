# 11. Blocks on chains with asynchronous execution

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/types/Block.ts`

`Block.settledHeight` is set only on chains with asynchronous execution, such
as Avalanche C-Chain since Helicon (ACP-194). On those blocks `logsBloom`
covers the receipts of the blocks this block settles, not its own receipts.
