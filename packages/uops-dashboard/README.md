## Getting Started

Run the development server:

```bash
pnpm dev
```
## How to add new chain to UOPS explorer?

1. Navigate to `packages/uops-dashboard/src/chains.ts`
2. Add new entry to `SUPPORTED_CHAINS`
3. For more info see `Chain` type comments

### How to test newly added chain?

1. Run `pnpmn dev` & open [local instance](http://localhost:3000)
2. Select this new chain & explore latest block
3. Check links: block, tx, contract
4. Go to [stats](http://localhost:3000/stats)
5. Explore last 100 blocks
6. [optional] If in steps 2 & 5 you did not see any UOPS: manually go to `0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789` on the explorer and find block number when it was invoked
