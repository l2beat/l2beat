# Generate config schema
```
pnpm typescript-json-schema src/modules/tvs/types.ts ProjectTvsConfig > src/modules/tvs/config/schema/tvs-config-schema.json
```

# Formulas

## Diff
### How to configure?
- first argument is the one other values would be subtracted from
- first argument's sinceTimestamp has to be smaller or equal than ALL the other arguments
- other sinceTimestamps do not have to be the same, just bigger or equal than the first's argument

### Example
```json
{
  "type": "calculation",
  "operator": "diff",
  "arguments": [
    {
      "type": "value",
      "priceId": "solv-btc",
      "amount": {
        "type": "totalSupply",
        "address": "0x541FD749419CA806a8bc7da8ac23D346f2dF8B77",
        "chain": "bob",
        "decimals": 18,
        "sinceTimestamp": 1723638067
      }
    },
    {
      "type": "value",
      "priceId": "solv-btc",
      "amount": {
        "type": "balanceOfEscrow",
        "address": "0x541FD749419CA806a8bc7da8ac23D346f2dF8B77",
        "chain": "bob",
        "decimals": 18,
        "escrowAddress": "0x742779748Dc07943E97c2cf30B48A57b96E033e1",
        "sinceTimestamp": 1723638067
      }
    }
  ]
}
```
