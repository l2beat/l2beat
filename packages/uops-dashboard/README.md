## Getting Started

Run the development server:

```bash
pnpm dev
```
## How to add new chain to UOPS explorer?

1. Navigate to `packages/uops-dashboard/src/chains.ts`
2. Add new entry to `SUPPORTED_CHAINS`
3. For more info see `Chain` type comments
4. Here is the [example PR](https://github.com/l2beat/l2beat/commit/17b90b9468b5899aa7b704b0777cacdf5ffdb778)

### How to test newly added chain?

1. Run `pnpm dev` & open [local instance](http://localhost:3000)
2. Select this new chain & explore latest block
3. Check links: block, tx, contract
4. Go to [stats](http://localhost:3000/stats)
5. Explore last 100 blocks
6. [optional] If in steps 2 & 5 you did not see any UOPS: manually go to `0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789` on the explorer and find block number when it was invoked
