# Interop Missing Tokens and TokenDB Suggestions

This document maps the current flows that surface missing or suggested TokenDB entries for interop transfers. It covers the relevant code in `packages/backoffice`, `packages/interop-backoffice-ui`, `packages/token-ui`, `packages/token-backend`, `packages/backend`, and `packages/database`.

Note on package names: the tracked backoffice implementation is `@l2beat/backoffice` in `packages/backoffice`. There is also a tracked `packages/interop-backoffice-ui/src/App.tsx` that routes `/interop/missing-tokens` to `MissingTokensPage`, but the missing-token page source currently lives in `packages/backoffice/src/pages/interop/missing-tokens`.

## Data Model

TokenDB tables are defined in `packages/database/prisma/schema.prisma`.

- `AbstractToken` (`packages/database/prisma/schema.prisma:435`) is the abstract token concept. It has `id`, `issuer`, `symbol`, `category`, `iconUrl`, `coingeckoId`, `coingeckoListingTimestamp`, `comment`, and `reviewed`. It has a uniqueness constraint on `[issuer, symbol]`.
- `DeployedToken` (`packages/database/prisma/schema.prisma:452`) is a token deployed on a chain. It is keyed by `[chain, address]`, has `abstractTokenId`, `symbol`, `decimals`, `deploymentTimestamp`, `comment`, and optional `metadata`.
- `Chain` (`packages/database/prisma/schema.prisma:505`) stores the TokenDB chain name, numeric `chainId`, `explorerUrl`, CoinGecko `aliases`, and configured APIs.
- `InteropTransfer` (`packages/database/prisma/schema.prisma:370`) stores interop transfer sides, token addresses, attribution fields (`srcAbstractTokenId`, `dstAbstractTokenId`, value fields), and `isProcessed`.

The repository layer normalizes deployed token addresses to lowercase on insert (`packages/database/src/repositories/DeployedTokenRepository.ts:53`) and on lookups (`packages/database/src/repositories/DeployedTokenRepository.ts:163`).

## Runtime Boundaries

There are two database connections involved in the token service:

- `tokenDb`: the TokenDB connection, used for `abstractToken`, `deployedToken`, `chain`, and `tokenConnection` (`packages/database/src/tokenDatabase.ts:11`).
- `db`: the main L2BEAT database connection, used by token-backend for interop transfer reads (`packages/token-backend/src/database/db.ts:27`).

`packages/token-backend/src/server.ts:18` creates the CoinGecko client. `packages/token-backend/src/server/routers/TrpcRouter.ts:22` creates the token-backend TRPC router with both `db` and `tokenDb`.

The interop backend talks to TokenDB through a TRPC client created in `packages/backend/src/modules/interop/engine/InteropModule.ts:80`, with `callSource: 'interop'`. That client is passed to matching, financials, and dashboard routers (`packages/backend/src/modules/interop/engine/InteropModule.ts:131`, `packages/backend/src/modules/interop/engine/InteropModule.ts:146`, `packages/backend/src/modules/interop/engine/InteropModule.ts:178`).

## How Interop Transfers Become Missing Tokens

1. Interop matching builds transfers with token addresses but no financial attribution. `toTransferRecord` initializes `srcAbstractTokenId`, `dstAbstractTokenId`, `srcValueUsd`, and `dstValueUsd` as `undefined`, and sets `isProcessed: false` (`packages/backend/src/modules/interop/engine/match/InteropMatchingLoop.ts:274`).

2. The financials loop loads unprocessed transfers (`packages/backend/src/modules/interop/engine/financials/InteropFinancialsLoop.ts:66`) and normalizes source/destination token addresses through `toDeployedId` (`packages/backend/src/modules/interop/engine/financials/InteropFinancialsLoop.ts:325`):
   - Native address string `native` is accepted.
   - Zero address and invalid/unsupported chains are ignored.
   - EVM bytes32 addresses are cropped to Ethereum addresses.

3. It asks TokenDB for deployed tokens and abstract tokens (`packages/backend/src/modules/interop/engine/financials/InteropFinancialsLoop.ts:270`). A token side is skipped if:
   - the deployed token is absent (`Missing token detected`);
   - the deployed token has no abstract token;
   - the abstract token has no `coingeckoId`;
   - no recent price exists for the `coingeckoId`;
   - raw transfer amount is missing.

4. `updateFinancials` always marks the transfer as processed (`packages/database/src/repositories/InteropTransferRepository.ts:465`). If one side could not be attributed, that side remains null.

5. The backoffice missing-token list is built from processed transfers where either `srcValueUsd` or `dstValueUsd` is null (`packages/database/src/repositories/InteropTransferRepository.ts:626`). It groups by side-specific `chain:tokenAddress`, counts occurrences, and collects plugin names.

Important consequence: "missing tokens" means "processed transfers with missing financial attribution". It is usually caused by missing or incomplete TokenDB data, but a `ready` token can still appear if the actual blocker is missing price data or missing raw amount.

## Backoffice Missing Tokens

### Backend list and statuses

The backoffice router is registered in `packages/backend/src/modules/interop/engine/dashboard/trpc/router.ts:29` and exposes `interop.missingTokens.list` and `interop.missingTokens.requeue` from `packages/backend/src/modules/interop/engine/dashboard/trpc/routers/missingTokens.ts:22`.

`getMissingTokens` reads grouped rows from `db.interopTransfer.getMissingTokensInfo()` and classifies each row against live TokenDB data (`packages/backend/src/modules/interop/engine/dashboard/impls/missingTokens.ts:38`).

Statuses are computed in `getMissingTokenStatuses` (`packages/backend/src/modules/interop/engine/dashboard/impls/missingTokens.ts:60`):

- `unsupported`: chain is not in active interop capture chains, or `toDeployedId` cannot normalize the token address.
- `missing`: normalized deployed token does not exist in TokenDB.
- `incomplete`: deployed token exists, but has no abstract token or the abstract token has no `coingeckoId`.
- `ready`: deployed token exists and its abstract token has a `coingeckoId`.

The server deduplicates by `chain:tokenAddress` before status checks (`packages/backend/src/modules/interop/engine/dashboard/impls/missingTokens.ts:26`).

### Backoffice UI behavior

The page is routed in:

- `packages/backoffice/src/App.tsx:71`
- `packages/interop-backoffice-ui/src/App.tsx:69`

The page fetches missing-token rows and chain metadata (`packages/backoffice/src/pages/interop/missing-tokens/MissingTokensPage.tsx:21`). It shows total rows, total occurrences, and status counts (`packages/backoffice/src/pages/interop/missing-tokens/MissingTokensPage.tsx:47`).

The table implementation is in `packages/backoffice/src/pages/interop/missing-tokens/table/MissingTokensTable.tsx:27`. It:

- initially filters to `ready`, `incomplete`, and `missing` rows (`packages/backoffice/src/pages/interop/missing-tokens/table/MissingTokensTable.tsx:119`);
- allows selecting every row except `unsupported` (`packages/backoffice/src/pages/interop/missing-tokens/table/MissingTokensTable.tsx:126`);
- shows how many selected rows are actually `ready` (`packages/backoffice/src/pages/interop/missing-tokens/table/MissingTokensTable.tsx:129`);
- persists clicked action links in local storage (`packages/backoffice/src/pages/interop/missing-tokens/table/MissingTokensTable.tsx:15`).

Action links are generated in `packages/backoffice/src/pages/interop/missing-tokens/utils.ts:77`:

- `missing` -> `https://tokens.l2beat.com/tokens/new?tab=deployed&chain=...&address=...`
- `incomplete` and `ready` -> `https://tokens.l2beat.com/tokens/{chain}/{address}`
- `unsupported` -> no action

`getAddMissingTokenHref` refuses the zero address, crops EVM bytes32 addresses to 20-byte addresses, and maps native to `native` (`packages/backoffice/src/pages/interop/missing-tokens/utils.ts:39`).

### Requeue

The requeue endpoint accepts selected `chain/tokenAddress` pairs (`packages/backend/src/modules/interop/engine/dashboard/trpc/routers/missingTokens.ts:25`). It recomputes statuses server-side, keeps only `ready` tokens, and calls `markAsUnprocessedByTokens` (`packages/backend/src/modules/interop/engine/dashboard/trpc/routers/missingTokens.ts:28`).

`markAsUnprocessedByTokens` sets `isProcessed = false` for processed transfers where either side matches a selected token (`packages/database/src/repositories/InteropTransferRepository.ts:486`). The financials loop can then retry attribution.

The UI displays the result as "tokens requeued, skipped, transfers marked as unprocessed" (`packages/backoffice/src/pages/interop/missing-tokens/MissingTokensPage.tsx:67`).

## Token UI Suggestions Page

The token UI route `/tokens/suggestions` is registered in `packages/token-ui/src/App.tsx:28`, and the sidebar link is in `packages/token-ui/src/components/AppSidebar.tsx:32`.

The page has two cards in `packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:34`:

- "By matching abstract tokens"
- "From CoinGecko"

Both cards can add all suggestions into the deployed-token queue (`packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:56`, `packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:194`).

### Suggestion type 1: by matching abstract tokens

UI source: `packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:45`.

Backend endpoint: `deployedTokens.getSuggestionsByPartialTransfers` in `packages/token-backend/src/trpc/routers/deployedTokens/index.ts:50`.

Implementation: `packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:29`.

Heuristic:

1. Read interop transfers where exactly one side has an abstract token id and the other side does not (`packages/database/src/repositories/InteropTransferRepository.ts:417`, `packages/database/src/repositories/InteropTransferRepository.ts:447`).
2. Classify transfers by bridge type and keep only `lockAndMint` and `burnAndMint` (`packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:79`).
3. For a missing source abstract token id, suggest the destination abstract token for the source token address (`packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:155`).
4. For a missing destination abstract token id, suggest the source abstract token for the destination token address (`packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:165`).
5. Skip the suggestion if the suggested abstract token id is not found in TokenDB (`packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:117`).
6. Crop bytes32 EVM addresses to 20-byte Ethereum addresses before returning (`packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:122`).
7. Skip the suggestion if that deployed token already exists in TokenDB (`packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:125`).
8. Group repeated transfers by `chain:address:abstractTokenId` and attach transaction evidence (`packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByPartialTransfers.ts:93`).

Bridge type classification comes from `InteropTransferClassifier.groupByBridgeType` (`packages/shared/src/tools/InteropTransferClassifier.ts:64`). If a transfer has no explicit bridge type, it infers:

- `lockAndMint`: source not burned and destination minted, or source burned and destination not minted;
- `burnAndMint`: source burned and destination minted;
- `nonMinting`: neither side burned/minted;
- `unknown`: otherwise.

The suggestions page shows the target chain/address, suggested abstract token, and source/destination transaction links (`packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:89`). Single add links pass `tab=deployed`, `chain`, `address`, and `abstractTokenId` (`packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:145`). "Add all to queue" passes the same fields for every suggestion (`packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:61`).

### Suggestion type 2: from CoinGecko

UI source: `packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:167`.

Backend endpoint: `deployedTokens.getCoingeckoSuggestions` in `packages/token-backend/src/trpc/routers/deployedTokens/index.ts:46`.

Implementation: `packages/token-backend/src/trpc/routers/deployedTokens/getCoingeckoSuggestions.ts:19`.

Heuristic:

1. Load all abstract tokens, deployed tokens, TokenDB chains, and the CoinGecko coin list with platform data (`packages/token-backend/src/trpc/routers/deployedTokens/getCoingeckoSuggestions.ts:23`).
2. Build a deployed-token set keyed by `chain:lowercaseAddress` (`packages/token-backend/src/trpc/routers/deployedTokens/getCoingeckoSuggestions.ts:30`).
3. Build a CoinGecko platform alias map from TokenDB chain names and chain aliases (`packages/token-backend/src/trpc/routers/deployedTokens/chainAliases.ts:4`).
4. For each abstract token with a `coingeckoId`, find the matching CoinGecko coin. Skip abstract tokens with no `coingeckoId` or no matching CoinGecko coin/platforms (`packages/token-backend/src/trpc/routers/deployedTokens/getCoingeckoSuggestions.ts:37`).
5. Convert CoinGecko platforms to TokenDB `{ chain, address }` pairs. Platforms with no matching chain alias or no address are ignored (`packages/token-backend/src/trpc/routers/deployedTokens/chainAliases.ts:15`).
6. Emit a suggestion for each platform pair that is not already a deployed token (`packages/token-backend/src/trpc/routers/deployedTokens/getCoingeckoSuggestions.ts:43`).
7. Mark `isInterop` if the TokenDB chain id is in `INTEROP_CHAINS` (`packages/token-backend/src/trpc/routers/deployedTokens/getCoingeckoSuggestions.ts:9`).

The UI can filter to interop chains only and sorts interop suggestions first (`packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:173`). Add links pass `tab=deployed`, `chain`, `address`, and `abstractTokenId` (`packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx:291`).

### Per-abstract-token CoinGecko suggestions

Existing abstract token pages also show CoinGecko platform suggestions if that abstract token has a `coingeckoId` (`packages/token-ui/src/pages/tokens/AbstractTokenPage.tsx:89`).

Backend endpoint: `deployedTokens.getSuggestionsByCoingeckoId` (`packages/token-backend/src/trpc/routers/deployedTokens/index.ts:40`).

Implementation: `packages/token-backend/src/trpc/routers/deployedTokens/getSuggestionsByCoingeckoId.ts:12`.

This is the per-abstract-token version of the CoinGecko platform-diff heuristic:

1. Fetch full CoinGecko coin data by id.
2. Map CoinGecko platforms through TokenDB chain aliases.
3. Query existing deployed tokens for all mapped pairs.
4. Return only unregistered pairs, marked with `isInterop`.

The UI link opens `/tokens/new?tab=deployed&chain=...&address=...` without explicitly passing the abstract token id (`packages/token-ui/src/pages/tokens/AbstractTokenPage.tsx:264`). The deployed-token check will usually rediscover the abstract token by the CoinGecko id.

## Add Deployed Token Flow

Route: `/tokens/new?tab=deployed` in `packages/token-ui/src/pages/tokens/add-tokens/AddTokensPage.tsx:12`.

Main component: `packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:64`.

Inputs can come from:

- query params: `chain`, `address`, `abstractTokenId` (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:68`);
- navigation queue state from suggestions (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:65`);
- CSV queue import with `chain,address,abstractTokenId` (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:634`).

When both chain and address are present, the UI calls `deployedTokens.checks` (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:103`). The backend implementation is `checkDeployedToken` (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:22`).

### Deployed token check/autofill heuristic

`checkDeployedToken` does the following:

1. If TokenDB already has the deployed token, return `already-exists` (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:36`).
2. If the address does not start with `0x`, return no data and no warnings (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:50`). This means native-token rows must be filled manually today.
3. Require the chain to exist in TokenDB, otherwise return `chain-not-found` (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:58`).
4. Create a chain API wrapper from the TokenDB chain APIs (`packages/token-backend/src/chains/Chain.ts:18`).
5. If RPC is available, fetch contract code at `latest`. If it is `0x`, return `not-a-token`; if RPC fails, continue with a warning (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:393`).
6. If RPC is available, fetch ERC20 `decimals` and `symbol` in parallel (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:174`).
7. Fetch deployment timestamp using Etherscan first, then Blockscout, then RPC bisection (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:233`). The RPC bisection code is in `packages/token-backend/src/chains/clients/rpc/getDeploymentTimestampFromRpc.ts:4`.
8. Look up a CoinGecko coin by matching the checked chain/address against CoinGecko platform addresses for the chain name and aliases (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:313`).
9. If a CoinGecko coin is found, find the abstract token by `coingeckoId` (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:143`).
10. Independently ask interop partial transfers for abstract-token suggestions for this specific chain/address (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:107`).

If CoinGecko has no matching coin, the response has `not-found-on-coingecko`, but still returns any RPC symbol, decimals, deployment timestamp, and partial-transfer abstract-token suggestions (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:123`).

If CoinGecko has a matching coin, the response includes:

- `symbol`: RPC symbol if available, otherwise CoinGecko symbol;
- `symbolSource`: `rpc` or `coingecko`;
- `decimals`;
- `deploymentTimestamp`;
- `abstractTokenId` if TokenDB already has an abstract token with the CoinGecko id;
- `suggestions`: other CoinGecko platform addresses for the same coin that are not in TokenDB, excluding the currently checked chain;
- `coingeckoId`;
- `abstractTokenSuggestions`: partial-transfer suggestions only when no abstract token was found by CoinGecko id (`packages/token-backend/src/trpc/routers/deployedTokens/checkDeployedToken.ts:153`).

The UI writes returned `decimals`, `deploymentTimestamp`, `abstractTokenId`, and `symbol` into the form (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:116`). The abstract-token selector shows partial-transfer suggestions as clickable chips (`packages/token-ui/src/components/forms/DeployedTokenForm.tsx:619`).

The form also shows same-CoinGecko-token "Suggestions" below the form from `checks.data.suggestions` (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:386`). Those suggestions can be added to the queue or opened in a new add-token tab, but the queue item there only includes `chain` and `address`, not `abstractTokenId` (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:435`).

On submit, the UI creates an `AddDeployedTokenIntent` (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:176`). It explicitly blocks `already-exists`, `not-a-token`, and `chain-not-found`, but it does not explicitly block `not-found-on-coingecko` (`packages/token-ui/src/pages/tokens/add-tokens/AddDeployedToken.tsx:176`).

## Add Abstract Token Flow

Route: `/tokens/new?tab=abstract` in `packages/token-ui/src/pages/tokens/add-tokens/AddTokensPage.tsx:32`.

Main component: `packages/token-ui/src/pages/tokens/add-tokens/AddAbstractToken.tsx:25`.

If the URL has `coingeckoId`, the form pre-fills it (`packages/token-ui/src/pages/tokens/add-tokens/AddAbstractToken.tsx:61`). This is the route used from the deployed-token form when a CoinGecko coin is known but TokenDB has no abstract token for it (`packages/token-ui/src/components/forms/DeployedTokenForm.tsx:595`).

The form defaults are:

- random 6-character id;
- `reviewed: true`;
- `category: null` (`packages/token-ui/src/pages/tokens/add-tokens/AddAbstractToken.tsx:33`).

The backend check is `abstractTokens.checks` (`packages/token-backend/src/trpc/routers/abstractTokens/index.ts:36`) implemented by `checkAbstractToken` (`packages/token-backend/src/trpc/routers/abstractTokens/checkAbstractToken.ts:5`).

Heuristic:

1. Fetch CoinGecko coin data by id.
2. If found, return `id`, `image.large` as `iconUrl`, and CoinGecko symbol (`packages/token-backend/src/trpc/routers/abstractTokens/checkAbstractToken.ts:43`).
3. Fetch CoinGecko market chart from `2000-01-01` to today and use the first price timestamp as `coingeckoListingTimestamp` (`packages/token-backend/src/trpc/routers/abstractTokens/checkAbstractToken.ts:26`).

The UI autofills icon URL, uppercase symbol, and listing timestamp (`packages/token-ui/src/pages/tokens/add-tokens/AddAbstractToken.tsx:67`). It does not autofill issuer, category, or comments.

Submit creates an `AddAbstractTokenIntent`; if CoinGecko lookup failed for a nonempty CoinGecko id, submit is blocked (`packages/token-ui/src/pages/tokens/add-tokens/AddAbstractToken.tsx:101`).

## Plan and Execute Layer

Token UI does not write directly. It generates a plan and then asks the user to confirm it.

- Intents are defined in `packages/token-backend/src/intents.ts:12`.
- Commands are defined in `packages/token-backend/src/commands.ts:12`.
- Plan generation is in `packages/token-backend/src/planning.ts:41`.
- Plan execution is in `packages/token-backend/src/execution.ts:20`.
- The TRPC plan router is in `packages/token-backend/src/trpc/routers/plan/index.ts:7`.
- The confirmation dialog is `packages/token-ui/src/components/PlanConfirmationDialog.tsx:20`.

Relevant validation in planning:

- Adding an abstract token fails if the id already exists (`packages/token-backend/src/planning.ts:106`).
- Adding an abstract token with a non-null issuer also fails if `[issuer, symbol]` already exists (`packages/token-backend/src/planning.ts:110`).
- Adding a deployed token fails if `[chain, address]` already exists (`packages/token-backend/src/planning.ts:157`).

Execution regenerates the plan inside a serializable transaction and refuses to execute if the plan changed (`packages/token-backend/src/execution.ts:29`).

## Manual Work Still Present

Current manual steps include:

- Opening backoffice missing-token rows.
- Opening Token UI add-token links.
- Waiting for check/autofill.
- Choosing partial-transfer abstract-token suggestions when CoinGecko did not identify an existing abstract token.
- Creating a new abstract token when a CoinGecko coin is known but no TokenDB abstract token exists.
- Assigning abstract token category.
- Filling deployment timestamp when explorers/RPC cannot provide it.
- Filling native-token metadata, because native addresses do not go through deployed-token checks today.
- Confirming generated plans.
- Returning to backoffice and requeueing ready rows.

## Automation Assessment

These heuristics are strong automation candidates:

1. CoinGecko platform-diff suggestions for an existing abstract token.
   - Sources: `getCoingeckoSuggestions` and `getSuggestionsByCoingeckoId`.
   - Confidence is high when the abstract token already has a reviewed `coingeckoId`, the platform maps through a TokenDB chain alias, and the deployed token is absent.

2. Partial-transfer abstract-token suggestions.
   - Source: `getSuggestionsByPartialTransfers`.
   - Confidence is high for `lockAndMint` and `burnAndMint` transfers because the heuristic only triggers when one side is already attributed and the bridge type implies both sides are representations of the same abstract token.

3. Form autofill for deployed token metadata.
   - Sources: RPC decimals/symbol, explorer/RPC deployment timestamp, CoinGecko coin lookup.
   - This can be moved from UI-side "prefill before manual submit" into a backend job that creates the same `AddDeployedTokenIntent`.

These areas need guardrails before full automation:

1. New abstract tokens.
   - Token UI can derive `coingeckoId`, symbol, icon URL, and listing timestamp, but not issuer or category.
   - A pragmatic automated default would be `issuer: null`, `category: null`, `reviewed: false` or a new explicit "auto-added" marker. Current UI defaults to `reviewed: true`, which is probably not the right semantic for unattended creation.
   - Planning only checks duplicate `[issuer, symbol]` when `issuer` is non-null, so automated `issuer: null` creation can create multiple same-symbol abstract tokens unless the job adds its own duplicate policy.

2. Native tokens.
   - Backoffice can link to add `native`, but `checkDeployedToken` skips non-`0x` addresses. Native tokens need a separate source of decimals/symbol/timestamp/abstract token.

3. Ready missing-token rows.
   - `ready` only proves TokenDB has deployed token plus abstract `coingeckoId`; it does not prove the reprocess will succeed. Missing price data and missing raw amounts can keep values null.

4. Chain and alias failures.
   - A missing-token row can be `missing` even if the TokenDB chain itself is absent. The Token UI add-deployed flow then returns `chain-not-found` and sends the user to add the chain first.
   - Missing TokenDB chain aliases silently suppress CoinGecko platform suggestions.

5. CoinGecko failures.
   - `checkAbstractToken` catches CoinGecko errors, but some suggestion endpoints rely on CoinGecko calls directly. Automation should have retry, rate-limit, and quarantine behavior.

6. Address normalization.
   - Interop missing-token paths normalize bytes32 EVM addresses through `toDeployedId`.
   - Partial-transfer grouping keys are built before address cropping, while returned addresses are cropped. If mixed 20-byte and bytes32 forms ever enter the same query, duplicates are possible.

7. UI validation does not exactly equal database capability.
   - The deployed-token UI currently requires `decimals >= 1` (`packages/token-ui/src/components/forms/DeployedTokenForm.tsx:114`), while the backend schema accepts any number. An automation path should decide whether zero-decimal tokens are valid.

## Suggested Refactor Direction

I would make the automation backend-first, not UI-first:

1. Extract the current heuristics into pure, shared services in token-backend:
   - `suggestDeployedTokensFromCoinGeckoPlatforms`
   - `suggestDeployedTokensFromPartialTransfers`
   - `resolveDeployedTokenCandidate`
   - `resolveAbstractTokenCandidateFromCoinGecko`

2. Add confidence/status output to every candidate:
   - `autoAddable`: all required fields resolved and no conflicts;
   - `needsAbstractCategory`: abstract token would be created but category is unknown;
   - `needsDeploymentTimestamp`;
   - `unsupportedNative`;
   - `tokenAlreadyExists`;
   - `tokenDbIncomplete`;
   - `externalDataUnavailable`.

3. Add a job that:
   - reads both current suggestion sources and backoffice missing rows;
   - creates missing abstract tokens when policy allows it;
   - creates missing deployed tokens with the resolved abstract token;
   - records every skipped candidate with a reason;
   - requeues rows that become `ready`.

4. Keep a small review UI for exceptions only:
   - unknown CoinGecko/no partial-transfer match;
   - missing deployment timestamp;
   - native tokens;
   - abstract category assignment;
   - ambiguous or conflicting CoinGecko/TokenDB data.

5. Replace the current Token UI suggestions page and backoffice missing-token action workflow with job status, skip reasons, and audit logs.

The highest-value first automation would be: run `getCoingeckoSuggestions` plus `getSuggestionsByPartialTransfers`, use existing `checkDeployedToken` logic to resolve metadata, create deployed tokens whose abstract token already exists, then requeue ready backoffice rows. That removes the safest button-clicking work without deciding the harder "create new abstract token automatically" policy yet.
