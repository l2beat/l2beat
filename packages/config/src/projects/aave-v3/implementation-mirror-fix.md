# Implementation Mirror Entries — Display Fix

## Problem

13 implementation addresses were appearing as broken entries in the Contract Funds UI panel
("No funds data available", no graph node, "go to file" did nothing).

## Root Cause

The backend function `enrichFundsWithImplementations` (in `fundsData.ts`) runs on every
`GET /api/projects/:project/funds-data` request. It reads `discovered.json`, builds a map of
all proxy→implementation relationships, and for each implementation whose proxy already has
a funds entry, it injects a synthetic copy of the proxy's data keyed by the implementation
address, with a `proxyAddress` field pointing back to the proxy.

This enrichment exists for a legitimate backend purpose: when the scoring engine analyzes
functions on an implementation contract (where the business logic lives), it needs to resolve
the funds at risk — those funds are held by the proxy, not the implementation. The
`proxyAddress` field is the marker that identifies these as mirrors.

The bug: `FundsSection.tsx` was rendering every entry from the API response without filtering
out these implementation mirrors. Since implementation addresses have no standalone node in the
discovery graph (they live inside the proxy's `$implementation` field), they had no name,
could not be navigated to, and showed "No funds data available" because the Contract Funds
section renders `balances` — not `tokenInfo` — and the mirror entries carry only the proxy's
token data, not its balance records.

## Fix

Added a guard in `FundsSection.tsx` (`packages/protocolbeat/src/apps/discovery/defidisco/`)
to skip any entry where `data.proxyAddress` differs from the entry key:

```tsx
if (
  data.proxyAddress &&
  normalizeForLookup(data.proxyAddress) !== normalizeForLookup(address)
) {
  continue
}
```

The enrichment still runs server-side — scoring is unaffected. Only the display is filtered.

## Affected Contracts (13)

These 13 implementation addresses were appearing in the UI. They have no graph node and are
fully represented by their proxy entry.

| Implementation address | Proxy name | Proxy address | Why proxy has funds entry |
|---|---|---|---|
| 0xadC45Df3cf1584624C97338BEF33363BF5b97AdA | ATokenInstance | 0xFa82580c16A31D0c1bC632A36F82e83EfEF3Eec0 | isToken (aEthRLUSD) |
| 0x5148d810B1DaE509d68f9d9219AD1d004EA32545 | RwaATokenInstance | 0xE1CfD16b8E4B1C86Bb5b7A104cfEFbc7b09326dD | isToken (aHorRwaVBILL) |
| 0x80D786DF608603cCDcC83F5712B97C185A6A948d | ATokenInstance | 0xfA1fDbBD71B0aA16162D76914d69cD8CB3Ef92da | isToken (aEthLidoWETH) |
| 0x0F3bCeb6b3b2dfb7f0ac58fCbF6DaDd23cf34244 | PoolInstance | 0x0AA97c284e98396202b6A04024F5E2c65026F3c0 | fetchBalances (Pool 3 / Lido) |
| 0x10c74b37Ad4541E394c607d78062e6d22D9ad632 | AaveEcosystemReserveV2 | 0x25F2226B597E8F9514B3F68F00f494cF4f286491 | fetchBalances (treasury) |
| 0x83b7Ce402a0E756e901C4A9d1CAfA27ca9572AfC | CollectorWithCustomImpl | 0x464C71f6c2F760DDA6093dCB91C24c39e5d6e18c | fetchBalances (fee collector) |
| 0x0fE58FE1cAA69951dC924a8c222bE19013b89476 | StakedAaveV3 | 0x4da27a545c0c5B758a6BA100e3a049001de870f5 | isToken (stkAAVE) |
| 0xC313A383d1838DCda96F4c97698238f0A5499Ea4 | PoolInstance | 0x4e033931ad43597d96D6bcc25c280717730b58B1 | fetchBalances (Pool 2 / EtherFi) |
| 0x9EB507147b99D3CDe32A53BD5cD12BDeEAC26e5c | ATokenInstance | 0xE3190143eb552456f88464662F0c0C4ac67A77eB | isToken (aEthweETH) |
| 0xdC7B6B0ACf2Fb6927526E2c501dE41EaEAe8702A | ATokenInstance | 0xdF7f48892244c6106Ea784609f7de10aB36f9C7E | isToken (aEthezETH) |
| 0x8147b99Df7672a21809C9093E6f6Ce1a60f119BD | PoolInstance | 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2 | fetchBalances (Pool 1 / main) |
| 0x38769a7dA85429aC9d61167FDfECCAae8Aa11766 | ATokenWithDelegationInstance | 0xa700b4eB416Be35b2911fd5Dee80678Ff64ff6C9 | isToken (aEthAAVE) |
| 0xcD8B9aC3B72e81FD8A0C9a0DBba583597e48a23A | PoolInstance | 0xAe05Cd22df81871bc7cC2a04BeCfb516bFe332C8 | fetchBalances (Pool 4 / Horizon) |

## Why only these 13 (out of 365 proxy→impl pairs)

`enrichFundsWithImplementations` only creates a mirror entry when the proxy already has a
funds entry. Of the 365 proxy→implementation relationships in `discovered.json`, only the 13
proxies above have a funds entry (either `isToken: true` or `fetchBalances: true`), which is
why exactly these 13 implementations were affected.
