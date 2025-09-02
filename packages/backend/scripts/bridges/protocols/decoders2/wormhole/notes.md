# Wormhole

## ChainIds
Worhmohole has its own internal mapping for chains, that will need to be hardcoded https://wormhole.com/docs/products/reference/chain-ids/

## Matching ID
Unique Identifier can be generated for every Wormhole message using formula
```js
`${emitterChainId}_${emitterAddress}_${sequence}`
```

## Outbound Message
Every outbound message emits `LogMessagePublished` from `Wormhole: Core Bridge`.

Example transactions for Ethereum
```bash
pnpm bridges:cli-range wormhole ethereum 23175562 23175586
```

⚠️ There is no destination chain information. This would need to be obtained either from matching of from the app layer.
