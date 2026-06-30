# Privacy Flow Analysis Events Fetcher Plan

## Goal

Create a new script at `packages/frontend/data/fetch_privacy_flow_analysis_events.ts` that fetches onchain privacy-flow events and writes three protocol-specific CSV files:

- `packages/frontend/data/tornado_cash_privacy_flow.csv`
- `packages/frontend/data/railgun_privacy_flow.csv`
- `packages/frontend/data/privacy_pools_privacy_flow.csv`

Scope:

- Tornado Cash: withdrawals only
- Railgun: withdrawals only
- Privacy Pools: deposits and withdrawals

Each CSV row should include the relevant user-facing address, raw amount, token identifier in the same style as `PrivacyFlowTrxs_with_amounts.csv`, and enough log metadata to trace the source event later.

## Relevant Repo References

- `packages/frontend/data/fetch_privacy_flow_trxs.ts`
  - Good pattern for raw JSON-RPC batching, retry/fallback, and simple CSV writing.
- `packages/config/src/projects/tornado-cash/tornado-cash.ts`
  - Canonical discovery path for enumerating Tornado pools via `InstanceRegistry.getAllInstanceAddresses()`.
- `packages/config/src/projects/railgun/railgun.ts`
  - Canonical discovery entry for Railgun and existing token coverage.
- `packages/config/src/projects/railgun/discovered.json`
  - Confirms `RailgunCore` address `0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9`, which is the `RailgunSmartWallet` proxy address requested.
- `packages/config/src/projects/privacy-pools/privacy-pools.ts`
  - Canonical discovery path for enumerating Privacy Pools from `Entrypoint.pools`.
- `packages/frontend/src/server/features/privacy/refresh/refreshPrivacySnapshot.ts`
  - Useful reference for Ethereum RPC env var resolution.
- `packages/config/src/privacy/flowExtractors/*.ts`
  - Existing ABI strings and parsing rules for Tornado fixed amounts, Railgun unshields, and Privacy Pools value extraction.
- `packages/config/src/tokens/generated.json`
  - Best in-repo source for mapping Ethereum token addresses to Coingecko-style IDs like `ethereum`, `usd-coin`, `tether`, `weth`.

## Proposed Data Sources

### Tornado Cash

- Use `ProjectDiscovery('tornado-cash')` to enumerate all pool addresses from `InstanceRegistry.getAllInstanceAddresses()`.
- Do not reuse the UI relevance filter from `getTornadoAssets()`; the script should include all discovered pools.
- Fetch live pool metadata via batched `eth_call`:
  - `denomination()`
  - `token()` when supported
- Treat missing or reverting `token()` as native ETH.
- Fetch `Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)` logs from all pool addresses.
- Decode recipient from `to`.
- Derive token slug from pool metadata and derive bucket label from token + denomination.

### Railgun

- Use `ProjectDiscovery('railgun')` to resolve `RailgunCore` and its `sinceBlock`.
- Fetch `Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)` logs from `0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9`.
- Decode:
  - recipient: `to`
  - amount: `amount`
  - token metadata: `token.tokenType`, `token.tokenAddress`, `token.tokenSubID`
- Map ERC20 token addresses to the CSV token slug using `generated.json`.

### Privacy Pools

- Use `ProjectDiscovery('privacy-pools')` and enumerate pool addresses from `Object.keys(Entrypoint.pools)`.
- Do not reuse the UI relevance filter from `getPrivacyPoolsAssets()`; include all discovered pools.
- Fetch live pool metadata via batched `eth_call`:
  - `ASSET()`
- Fetch these logs from all pool addresses:
  - `Deposited(address indexed _depositor, uint256 _commitment, uint256 _label, uint256 _value, uint256 _precommitmentHash)`
  - `Ragequit(address indexed _ragequitter, uint256 _commitment, uint256 _label, uint256 _value)`
  - `Withdrawn(address indexed _processooor, uint256 _value, uint256 _spentNullifier, uint256 _newCommitment)`
- Map event name to action:
  - `Deposited` -> `deposit`
  - `Ragequit` -> `withdrawal`
  - `Withdrawn` -> `withdrawal`
- Address field per event:
  - `Deposited._depositor`
  - `Ragequit._ragequitter`
  - `Withdrawn._processooor`

## RPC Strategy

- Use the same Ethereum RPC env var precedence as the privacy refresh code:
  - `ETHEREUM_EVENT_RPC_URL_FOR_DISCOVERY`
  - `ETHEREUM_RPC_URL_FOR_DISCOVERY`
  - `ETHEREUM_RPC_URL`
- Follow the raw JSON-RPC batch style from `fetch_privacy_flow_trxs.ts`.
- Batch `eth_getLogs` requests instead of querying one contract at a time:
  - Tornado: one filter per address chunk, topic0 = `Withdrawal`
  - Railgun: one filter, topic0 = `Unshield`
  - Privacy Pools: one filter per address chunk, topic0 in `[Deposited, Ragequit, Withdrawn]`
- Batch `eth_call` metadata lookups too:
  - Tornado pool `denomination()` and optional `token()`
  - Privacy Pools `ASSET()`
- Add recursive fallback when a provider rejects a log range or response is too large:
  - split the affected block range in half
  - retry the smaller ranges
- Keep address chunking even if current pool counts fit in one filter, so the script remains stable as discovery grows.

## Token Formatting

- The `token` column should match the style already present in `PrivacyFlowTrxs_with_amounts.csv`.
- Planned mapping:
  - native ETH -> `ethereum`
  - ERC20 token -> `coingeckoId` from `packages/config/src/tokens/generated.json`
- Also store `token_address` in the CSV for auditability:
  - empty for native ETH
  - ERC20 address otherwise
- Use token decimals only when formatting Tornado bucket labels; keep `amount_raw` as the original integer string from the chain.

## Proposed CSV Schema

Recommended common header:

`protocol,action,bucket,address,amount_raw,token,token_address,block_number,tx_hash,log_index,contract_address`

Notes:

- `address` means:
  - Tornado / Railgun: withdrawal recipient
  - Privacy Pools deposit: depositor
  - Privacy Pools withdrawal: withdrawal address from the event
- `bucket` should mirror existing repo naming where practical:
  - Tornado: `tornado-<ticker>-<formatted_denomination>`
  - Railgun: `railgun-<ticker>`
  - Privacy Pools: `privacy-pools-<ticker>-<poolAddress>`
- `log_index` is not explicitly required, but it makes each row directly traceable inside a transaction and is valuable for future checks.

## Output Ordering

- Sort each file by:
  1. `block_number`
  2. `tx_hash`
  3. `log_index`

This keeps diffs deterministic and makes spot-checking easier.

## Validation Plan

- Verify that each protocol returns non-empty results from its expected deployment block onward.
- Spot-check a few rows per protocol by re-decoding the raw log and verifying:
  - event type
  - emitted contract address
  - extracted address field
  - raw amount
  - token slug
- Fail fast if a token address cannot be mapped to a Coingecko-style token id, rather than silently writing inconsistent values.

## Non-Goals

- No sender enrichment like `fetch_privacy_flow_trxs.ts`.
- No USD amount calculation.
- No changes to existing CSV files.
- No frontend wiring yet.

## Assumptions

- All requested protocols are on Ethereum mainnet.
- Discovery is used only to enumerate contract addresses and `sinceBlock` values.
- Event data and pool asset metadata come from live RPC calls.
- Railgun output will be limited to ERC20 unshields by default, because the requested token format matches the existing fungible-token CSV convention. If you later want NFT-style unshields too, we should agree on a token identifier format first.
- The new CSVs can include a header row, since they are standalone analysis artifacts rather than inputs to the current no-header helper scripts.

Under the assumptions above, the task is clear enough to implement without any additional input.
