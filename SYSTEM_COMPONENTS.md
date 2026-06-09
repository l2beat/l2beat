# L2BEAT System Components

Generated on 2026-06-09 from branch `main` at `72402a1994`.

This document is a working map of the L2BEAT monorepo for future discussions about maintenance, feature planning, and ownership. It intentionally favors breadth over complete certainty: each component has a short description, entry points for deeper investigation, important relationships, and a lightweight contributor signal derived from `git log --format=%aN -- <paths>`.

The contributor names below are not formal ownership. They are path-history signals, usually the top recent/all-time authors for the paths listed.

## High-Level Shape

L2BEAT is a pnpm/Turbo monorepo with public products, backend indexers, shared configuration, research tooling, and several internal UIs. The public L2BEAT website is only one consumer of the system: researchers also use discovery, flattening, code analysis, TokenDB, interop monitoring, and other tooling that may never surface directly on l2beat.com.

The main data loop is: `@l2beat/config` defines projects, chains, discovery outputs, risk data, token/TVS inputs, tracked transactions, DA tracking, interop config, privacy config, and many display fields; backend modules use those definitions plus RPC/API providers to index data into Postgres; frontend/public API packages read Postgres plus config to render pages and expose data; internal UIs talk to backend or token-backend tRPC routers. Discovery and research tools operate partly outside this loop but feed project configuration, permissions, contracts, and flat sources back into it.

## Monorepo Infrastructure

**What it does:** The root package coordinates the workspace with pnpm 9, Turbo, TypeScript, Biome, Mocha, and shared scripts for building, testing, typechecking, linting, and running specific apps. The workspace package pattern is `packages/*`, but a few folders currently have build artifacts or source without a package manifest.

**Entry points:** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.github/`, `scripts/`, `packages/typescript-config/`.

**Relationships:** Most packages depend on `@l2beat/shared-pure`, `@l2beat/validate`, and `@l2beat/typescript-config`; app packages also depend on config, database, shared clients, or backend tRPC types.

**Likely contributors:** Konrad B, Tomasz Torz, Piotr Szlachciak, Michal Podsiadly.

## Configuration And Project Registry

**What it does:** `@l2beat/config` is the canonical source for project definitions and much of the research model: scaling projects, bridges, DA layers, interop protocols, privacy systems, zk catalog entries, chain metadata, risks, badges, project display data, discovery-driven contracts/permissions, TVS config, activity config, liveness/cost config, DA tracking, and ecosystem metadata.

**Entry points:** `packages/config/src/types.ts`, `packages/config/src/ProjectService.ts`, `packages/config/src/ProjectDatabase.ts`, `packages/config/src/processing/getProjects.ts`, `packages/config/src/projects/`, `packages/config/src/templates/`, `packages/config/src/common/`.

**Relationships:** `ProjectService` reads a generated SQLite database from the built config package. The backend, frontend, public API, token-backend, l2b CLI, and tooling use this service instead of scanning raw project files at runtime.

**Further investigation:** `packages/config/src/projects/_templates/` contains reusable project patterns; `packages/config/src/processing/` turns legacy/refactored project definitions into the uniform `BaseProject`; `packages/config/src/discovery/` bridges discovery outputs into contracts and permissions.

**Likely contributors:** sekuba, vincfurc, Luca Donno, sergeyshemyakov.

## Project Files And Templates

**What it does:** Individual project folders in `packages/config/src/projects/` contain project TypeScript files, discovery configs, generated `discovered.json` files, `.flat` flattened sources, diff histories, and sometimes chain-specific folders. Templates encode recurring contract/permission/technology patterns such as OP Stack, Orbit Stack, Polygon CDK, shared provers, bridges, DA systems, privacy systems, and token framework conventions.

**Entry points:** `packages/config/src/projects/<project>/`, `packages/config/src/projects/_templates/`, `packages/config/src/projects/_clingo/`, `packages/config/src/projects/globalConfig.jsonc`, `packages/config/src/projects/globalEntrypoints.jsonc`, `packages/config/src/projects/globalTokens.jsonc`.

**Relationships:** Discovery writes and reads inside project folders. Frontend pages, backend indexers, public API, and research tooling all consume the processed project registry.

**Likely contributors:** sekuba, vincfurc, Luca Donno, sergeyshemyakov.

## Token Lists And Legacy Token Config

**What it does:** The config package still carries a generated token list used by project TVS inputs and older token paths. `tokens.jsonc` is processed into `generated.json`, with token category, source, supply mode, chain/platform data, deployment/listing timestamps, icons, and bridge metadata.

**Entry points:** `packages/config/src/tokens/tokens.jsonc`, `packages/config/src/tokens/generated.json`, `packages/config/src/tokens/tokens.ts`, `packages/config/src/tokens/types.ts`, scripts under `packages/config/scripts/tokens/`.

**Relationships:** This is related to but distinct from TokenDB. TokenDB models abstract/deployed token identity and connections; TVS config and frontend charts still use token inputs from `@l2beat/config`.

**Likely contributors:** Config path signal overlaps with the project registry: sekuba, vincfurc, Luca Donno, sergeyshemyakov.

## Database Layer

**What it does:** `@l2beat/database` owns the Postgres schema, Kysely type generation, database connection factory, repositories, migrations, and repository tests. Its tables cover backend sync state, activity, tracked transactions, liveness, costs, anomalies, TVS, DA, DA Beat, discovery/update-monitor cache, interop, privacy, ecosystem tokens, app state, notifications, and TokenDB.

**Entry points:** `packages/database/prisma/schema.prisma`, `packages/database/src/repositories/`, `packages/database/src/kysely/`, `packages/database/src/index.ts`, `packages/database/README.md`.

**Relationships:** Backend modules and token-backend write through repository objects. Frontend/public API packages read through repositories. UIF uses `IndexerState` and `IndexerConfiguration` to persist safe heights and configuration ranges.

**Notable tables:** `TvsAmount`, `TvsPrice`, `TokenValue`, `Activity`, `Liveness`, `AggregatedLiveness`, `L2Cost`, `AggregatedL2Cost`, `DataAvailability`, `Blob`, `InteropEvent`, `InteropMessage`, `InteropTransfer`, `AggregatedInteropTransfer`, `AbstractToken`, `DeployedToken`, `TokenConnection`, `TokenIngestionQueue`, `PrivacyFlowEvent`, `UpdateMonitor`, `UpdateNotifier`, `FlatSources`, `AppState`.

**Likely contributors:** Tomasz Torz, Antoni Pawlak, Maciej Zygmunt.

## Backend Application

**What it does:** `@l2beat/backend` is the main backend server. It builds config from environment feature flags, creates providers and a database connection, exposes Koa routers/tRPC endpoints, and starts enabled indexing/monitoring modules.

**Entry points:** `packages/backend/src/Application.ts`, `packages/backend/src/index.ts`, `packages/backend/src/config/makeConfig.ts`, `packages/backend/src/config/Config.ts`, `packages/backend/src/api/ApiServer.ts`, `packages/backend/src/modules/`.

**Relationships:** The backend is feature-flag driven via `FEATURES`. It consumes `ProjectService`, `@l2beat/database`, `@l2beat/shared` providers/clients, `@l2beat/discovery`, `@l2beat/uif`, and `@l2beat/token-backend` for interop financials.

**Likely contributors:** Antoni Pawlak, Piotr Szlachciak, Maciej Zygmunt, Tomasz Torz.

## UIF - Universal Indexer Framework

**What it does:** `@l2beat/uif` is the generic parent/child indexer state machine. It handles initialization, safe heights, update/invalidate effects, child readiness, parent updates, retries, and tick scheduling for root indexers.

**Entry points:** `packages/uif/src/Indexer.ts`, `packages/uif/src/indexers/RootIndexer.ts`, `packages/uif/src/indexers/ChildIndexer.ts`, `packages/uif/src/reducer/`.

**Backend wrappers:** `packages/backend/src/tools/uif/IndexerService.ts`, `packages/backend/src/tools/uif/ManagedChildIndexer.ts`, `packages/backend/src/tools/uif/multi/ManagedMultiIndexer.ts`, `packages/backend/src/tools/uif/indexerIdentity.ts`.

**Relationships:** Most newer backend indexers use `ManagedChildIndexer` or `ManagedMultiIndexer` so their progress and config changes are persisted in Postgres. TVS, DA, DA Beat, privacy, ecosystems, tracked txs aggregators, and many related modules depend on it.

**Likely contributors:** Antoni Pawlak, Piotr Szlachciak, Michal Sobieraj-Jakubiec, Tomasz Torz.

## Shared Runtime Packages

**What it does:** `@l2beat/shared-pure` contains pure types and utilities such as branded addresses, chain-specific addresses, project/token IDs, UnixTime, formatting, JSONC parsing, caches, and interop value helpers. `@l2beat/shared` contains runtime clients, providers, services, Discord/Dune/CoinGecko/RPC integrations, DA providers, block/log/price/balance/total-supply providers, and UOPS helpers.

**Entry points:** `packages/shared-pure/src/types/`, `packages/shared-pure/src/utils/`, `packages/shared/src/clients/`, `packages/shared/src/providers/`, `packages/shared/src/services/`, `packages/shared/src/uops/`.

**Relationships:** These packages are the low-level foundation used by backend, frontend, config, discovery, l2b, public API, tools, TokenDB, and dashboards.

**Likely contributors:** Antoni Pawlak, Maciej Zygmunt, Mateusz Radomski, maciekop-l2b.

## Backend Tools And Validation

**What it does:** `@l2beat/backend-tools` provides shared backend utilities such as logger, metrics, Elastic integration, and rate limiting. `@l2beat/validate` is the local validation/schema package used across backend, frontend, APIs, TokenDB, and tools.

**Entry points:** `packages/backend-tools/src/`, `packages/validate/src/`.

**Relationships:** These are infrastructure packages rather than product features. `validate` is used heavily for API schemas and runtime input parsing.

**Likely contributors:** backend-tools: Mateusz Radomski, Piotr Szlachciak, Michal Podsiadly; validate: Piotr Szlachciak, Tomasz Torz, Dawid Drobny.

## Activity

**What it does:** The activity module indexes transaction and user-operation counts per project. It supports block-based, slot-based, and day-based activity sources, including EVM chains, SVM-like slot sources, Starknet/day providers, and UOPS analysis.

**Entry points:** `packages/backend/src/modules/activity/ActivityModule.ts`, `packages/backend/src/modules/activity/indexers/`, `packages/backend/src/modules/activity/services/txs/`, `packages/backend/src/modules/activity/services/uops/`, `packages/backend/src/config/features/activity.ts`, `packages/config/src/templates/activity.ts`.

**Relationships:** Activity config comes from projects; results are stored in `Activity`; frontend scaling activity pages and public API activity routes read the indexed data.

**Likely contributors:** maciekop-l2b, Piotr Szlachciak, Antoni Pawlak, Tomasz Torz.

## TVS - Total Value Secured

**What it does:** TVS indexes token prices, token amounts, block timestamps, and derived per-project token values. It supports on-chain `balanceOfEscrow`, `totalSupply`, `starknetTotalSupply`, circulating supply, constants, and formulas, then computes token values by source (`native`, `canonical`, `custom-canonical`, `external`) and category (`ether`, `stablecoin`, `btc`, `rwaPublic`, `rwaRestricted`, `other`).

**Entry points:** `packages/backend/src/modules/tvs/TvsModule.ts`, `packages/backend/src/modules/tvs/indexers/`, `packages/backend/src/modules/tvs/services/ValueService.ts`, `packages/backend/src/modules/tvs/tools/`, `packages/backend/src/config/features/tvs.ts`, `packages/config/src/projects/tvs-config-schema.json`.

**Relationships:** Project token configs are extracted from `@l2beat/config`; backend writes `TvsPrice`, `TvsAmount`, `TvsBlockTimestamp`, `TokenValue`, and `TokenMetadata`; frontend scaling TVS pages and public API TVS routes read aggregated values. TVS is the replacement/renaming of older "TVL" mental models in parts of the code and docs.

**Further investigation:** `packages/backend/scripts/tvs/` contains generation/execution/debug scripts. `packages/backend/src/modules/tvs/tools/legacyConfig/` and `sharedEscrows/` are important when changing config generation or shared escrow handling.

**Likely contributors:** maciekop-l2b, Antoni Pawlak, Tomasz Torz.

## Tracked Transactions, Liveness, And Costs

**What it does:** The tracked-txs module imports configured transactions from Dune and feeds two subfeatures: liveness metrics and L2 cost metrics. Liveness aggregates delays/subtypes and computes anomaly inputs; costs track calldata/blob/compute/overhead gas and USD values.

**Entry points:** `packages/backend/src/modules/tracked-txs/TrackedTxsModule.ts`, `packages/backend/src/modules/tracked-txs/TrackedTxsIndexer.ts`, `packages/backend/src/modules/tracked-txs/modules/liveness/`, `packages/backend/src/modules/tracked-txs/modules/l2-costs/`, `packages/backend/src/config/features/trackedTxs.ts`.

**Relationships:** Config comes from `trackedTxsConfig` in projects. Results populate `Liveness`, `AggregatedLiveness`, `Anomaly`, `AnomalyStats`, `L2Cost`, `L2CostPrice`, and `AggregatedL2Cost`. Frontend pages under scaling liveness/costs and backend status endpoints depend on this module.

**Likely contributors:** Maciej Zygmunt, Tomasz Torz, maciekop-l2b, Piotr Szlachciak.

## Anomalies

**What it does:** The anomalies module processes real-time liveness records, detects ongoing/ended liveness anomalies, and can send Discord notifications when configured. It appears to bridge older liveness anomaly outputs with real-time processing.

**Entry points:** `packages/backend/src/modules/anomalies/AnomaliesModule.ts`, `packages/backend/src/modules/anomalies/RealTimeLivenessProcessor.ts`, `packages/backend/src/modules/anomalies/AnomalyNotifier.ts`, `packages/backend/src/config/Config.ts`.

**Relationships:** It depends on tracked-txs/liveness config and uses block processing when available. It writes/read `RealTimeLiveness`, `RealTimeAnomaly`, and related anomaly tables.

**Likely contributors:** Piotr Szlachciak, Maciej Zygmunt, Tomasz Torz.

## Data Availability Tracking

**What it does:** The DA tracking module indexes per-project and per-layer data availability throughput. It supports block-based DA layers such as Ethereum blobs, Celestia, and Avail, plus timestamp-based EigenDA APIs. It can also notify about Ethereum blob-related conditions.

**Entry points:** `packages/backend/src/modules/data-availability/DataAvailabilityModule.ts`, `packages/backend/src/modules/data-availability/indexers/`, `packages/backend/src/modules/data-availability/services/`, `packages/backend/src/config/features/da.ts`.

**Relationships:** DA tracking config comes from project DA definitions and environment endpoints. It writes `Blob` and `DataAvailability`, exposes a backend tRPC contribution, and feeds frontend DA throughput/liveness/project pages.

**Likely contributors:** maciekop-l2b, Antoni Pawlak, Tomasz Torz.

## DA Beat

**What it does:** DA Beat indexes DA-layer economic/security stats and prices for DA-layer tokens. It uses clients for Celestia, NEAR, Avail, Espresso, EigenDA-like sources, and CoinGecko IDs configured from DA-layer projects.

**Entry points:** `packages/backend/src/modules/da-beat/DaBeatModule.ts`, `packages/backend/src/modules/da-beat/DaBeatStatsIndexer.ts`, `packages/backend/src/modules/da-beat/DaBeatPricesIndexer.ts`, `packages/backend/src/config/features/dabeat.ts`, `packages/config/src/projects/` DA-layer definitions.

**Relationships:** Data is stored in `DaBeatStats` and current/price tables, then used by DA-related frontend pages and risk/economic-security displays.

**Likely contributors:** Maciej Zygmunt, Michal Podsiadly, Piotr Szlachciak.

## Interop Backend

**What it does:** The interop backend captures, stores, matches, enriches, aggregates, compares, and exposes cross-chain interoperability events/messages/transfers. It is plugin-based and covers protocol families such as Across, CCIP, CCTP, LayerZero, Wormhole, Hyperlane, Axelar, OP Stack, Orbit Stack, Polygon, Relay, GasZip, Stargate, Mayan, and many specific bridges/apps.

**Entry points:** `packages/backend/src/modules/interop/engine/InteropModule.ts`, `packages/backend/src/modules/interop/plugins/`, `packages/backend/src/modules/interop/engine/capture/`, `packages/backend/src/modules/interop/engine/sync/`, `packages/backend/src/modules/interop/engine/match/`, `packages/backend/src/modules/interop/engine/aggregation/`, `packages/backend/src/modules/interop/engine/financials/`, `packages/backend/src/modules/interop/engine/dashboard/`, `packages/backend/src/config/features/interop.ts`.

**Subcomponents:**

- Capture: `InteropBlockProcessor`, plugin `DataRequest`s, block sync integration, and `InteropEventStore` write raw events.
- Sync: `InteropSyncersManager` and plugin sync-state/range tables track plugin progress per chain.
- Matching: `InteropMatchingLoop` turns events into `InteropMessage` and `InteropTransfer` rows.
- Financials: `InteropRecentPricesIndexer` and `InteropFinancialsLoop` use TokenDB to identify tokens, prices, minted/burned flags, and USD values.
- Aggregation: `InteropAggregatingIndexer` computes daily aggregate transfer/token/pair stats for public/frontend/backoffice views.
- Config sync: config plugins discover protocol/network configuration and store historical config snapshots.
- Compare/cleaner: compare plugins and cleaner loops detect divergence or clear stale state.
- Dashboard: backend tRPC routers expose status, transfers, messages, events, aggregates, anomalies, memory, missing tokens, known apps, and dangerous operational actions.

**Relationships:** Interop depends on `block-sync`, TokenDB, `@l2beat/config` interop project definitions, shared RPC clients, and Postgres interop tables. It feeds the public L2BEAT interop pages, the backoffice interop dashboards, public API interop endpoints, and TokenDB automatic ingestion.

**Likely contributors:** sekuba, Luca Donno, Michal Podsiadly.

## Backoffice

**What it does:** `@l2beat/backoffice` is an internal Vite/React app for operational dashboards. It currently focuses heavily on interop monitoring and website operations such as daily checks, status pages, and interop aggregate timestamp pinning.

**Entry points:** `packages/backoffice/src/App.tsx`, `packages/backoffice/src/pages/interop/`, `packages/backoffice/src/pages/website/`, `packages/backend/src/modules/backoffice/BackofficeModule.ts`, `packages/backend/src/modules/backoffice/appRouter.ts`.

**Relationships:** The backend backoffice module collects tRPC contributions from enabled modules and exposes them under `/trpc` with optional Cloudflare Access/static-token auth. The UI can switch environments and call backend/frontend APIs.

**Likely contributors:** Michal Podsiadly, Tomasz Torz, Dawid Drobny.

## Block Sync

**What it does:** Block sync is a shared backend module that starts only when other modules register block processors. It tracks latest block targets per chain, fetches blocks/logs, and runs processors such as interop capture and real-time liveness/anomalies.

**Entry points:** `packages/backend/src/modules/block-sync/BlockSyncModule.ts`, `packages/backend/src/modules/block-sync/BlockIndexer.ts`, `packages/backend/src/modules/block-sync/BlockNumberIndexer.ts`, `packages/backend/src/modules/block-sync/WsBlockNumberIndexer.ts`.

**Relationships:** Interop capture and anomalies use `blockProcessors`; block sync chooses polling or WebSocket Ethereum block number indexing depending on config.

**Likely contributors:** Piotr Szlachciak, Antoni Pawlak, Adrian Adamiak.

## Update Monitor

**What it does:** Update Monitor runs discovery for configured projects/chains, compares new discovery outputs with stored state, records diffs/messages, and optionally sends Discord notifications. It is the system that watches contract/config changes over time.

**Entry points:** `packages/backend/src/modules/update-monitor/UpdateMonitorModule.ts`, `UpdateMonitor.ts`, `UpdateDiffer.ts`, `UpdateNotifier.ts`, `DiscoveryRunner.ts`, `createWorkers.ts`, API files under `packages/backend/src/modules/update-monitor/api/`, `packages/backend/src/config/features/updateMonitor.ts`.

**Relationships:** It depends on discovery config/readers, RPC/explorer setup, database caches, worker pools, and notification config. Its status and messages are exposed via backend routes and likely internal tooling.

**Likely contributors:** Mateusz Radomski, Michal Podsiadly, Piotr Szlachciak.

## Flat Sources Module

**What it does:** The backend flat-sources module exposes `/api/flat-sources`, returning flattened contract sources stored in the database. This is likely used by source comparison/research tooling and may be populated by scripts or external deployment flows.

**Entry points:** `packages/backend/src/modules/flat-sources/createFlatSourcesModule.ts`, `packages/backend/src/modules/flat-sources/api/`, `packages/database/src/repositories/FlatSourcesRepository.ts`.

**Relationships:** It is related to the discovery flattener and `l2b fetch-flat-sources`, but this backend module itself only serves database records.

**Likely contributors:** Piotr Szlachciak, Mateusz Radomski, Maciej Zygmunt.

## Privacy

**What it does:** The privacy backend indexes deposit/withdrawal flow events and prices for privacy systems such as Privacy Pools, Railgun, and Tornado Cash. It computes token-flow records from configured buckets and chains.

**Entry points:** `packages/backend/src/modules/privacy/PrivacyModule.ts`, `packages/backend/src/modules/privacy/indexers/`, `packages/backend/src/modules/privacy/utils/extractPrivacyFlow.ts`, `packages/backend/src/config/features/privacy.ts`, `packages/config/src/projects/` privacy project definitions.

**Relationships:** It writes `PrivacyPrice`, `PrivacyBlockTimestamp`, and `PrivacyFlowEvent`, then frontend privacy pages read those records.

**Likely contributors:** Tomasz Torz.

## Ecosystems

**What it does:** The ecosystems backend tracks ecosystem-token market data from CoinGecko, including price, market cap, circulating supply, and 7-day changes.

**Entry points:** `packages/backend/src/modules/ecosystems/EcosystemsModule.ts`, `packages/backend/src/modules/ecosystems/EcosystemTokenIndexer.ts`, `packages/backend/src/config/features/ecosystemToken.ts`, `packages/config/src/processing/ecosystems.ts`.

**Relationships:** It writes `EcosystemToken` and supports frontend ecosystem project pages.

**Likely contributors:** Tomasz Torz, Maciej Zygmunt.

## Daily Checks, App State, Status, And Notifications

**What it does:** These are smaller operational backend components. Daily checks sends scheduled reminders/links to Discord; app-state provides a simple key/value tRPC store for internal UI state such as interop aggregate timestamp overrides; status/cache/health endpoints expose sync/operational state; notification config wires Discord webhooks for update monitor, anomalies, interop, Ethereum blobs, and daily checks.

**Entry points:** `packages/backend/src/modules/daily-checks/`, `packages/backend/src/modules/app-state/`, `packages/backend/src/config/makeConfig.ts`, `packages/backend/src/api/`, `packages/backoffice/src/pages/website/`.

**Relationships:** App-state is consumed by backoffice and frontend interop override logic. Daily checks depends on `HourlyIndexer` and notification config.

**Likely contributors:** Daily checks and app-state are recent/small; path history overlaps with backend/backoffice contributors.

## Discovery Engine

**What it does:** `@l2beat/discovery` explores contracts and dependencies for a project by walking from configured initial addresses through discovered relatives. It uses RPC/explorer providers, proxy detection, source/ABI fetching, handlers, type casters, templates, overrides, output diffing, and config readers/writers to generate and maintain `discovered.json`.

**Entry points:** `packages/discovery/README.md`, `packages/discovery/src/discovery/engine/DiscoveryEngine.ts`, `packages/discovery/src/discovery/getDiscoveryEngine.ts`, `packages/discovery/src/discovery/runDiscovery.ts`, `packages/discovery/src/discovery/analysis/`, `packages/discovery/src/discovery/handlers/`, `packages/discovery/src/discovery/proxies/`, `packages/discovery/src/discovery/provider/`, `packages/discovery/src/discovery/output/`, `packages/discovery/src/discovery/config/`.

**Relationships:** Discovery is used by `l2b discover`, Update Monitor, config project folders, Disco UI, Protocolbeat, and discovery-driven frontend contract/permission sections.

**Likely contributors:** Mateusz Radomski, Adrian Adamiak, Michal Podsiadly.

## Discovery Permission Modelling And Clingo

**What it does:** Discovery modelling builds permission facts, runs Clingo, parses ultimate permission facts, combines permissions back into discovery, and supports researcher workflows for modelling contract permissions.

**Entry points:** `packages/discovery/src/discovery/modelling/`, `packages/discovery/src/cli/modelPermissionsCommand.ts`, `packages/l2b/src/commands/ModelPermissions.ts`, `packages/l2b/src/commands/ShowPermissions.ts`, `packages/config/src/projects/_clingo/`.

**Relationships:** This is part of the research/discovery workflow and appears separate from website runtime rendering, though its outputs inform project permission modelling and config.

**Likely contributors:** Adrian Adamiak, Mateusz Radomski, Piotr Szlachciak.

## Flattener And Source Comparison

**What it does:** The flattener turns Solidity source trees into flattened source files, handling AST parsing, import ordering, identifier collisions, formatting, interfaces, and comments. Related l2b commands compare flat sources across projects, find similar projects, match flat files, validate flattening, and fetch flat sources.

**Entry points:** `packages/discovery/src/flatten/`, `packages/l2b/src/commands/Flatten.ts`, `packages/l2b/src/commands/FlattenerValidator.ts`, `packages/l2b/src/commands/CompareFlatSources.ts`, `packages/l2b/src/implementations/compare-flat-sources/`, `packages/l2b/src/implementations/fetchFlatSources.ts`.

**Relationships:** Discovery/project folders store `.flat` outputs; the backend flat-sources endpoint stores/serves flat source data; Protocolbeat/Disco UI expose source/code views.

**Likely contributors:** Mateusz Radomski, Piotr Szlachciak, Michal Podsiadly.

## l2b CLI

**What it does:** `@l2beat/l2b` is the researcher CLI, similar in spirit to Foundry's `cast`. It wraps discovery, Disco UI, flattening, template/shape management, source comparison, proxy detection, event inspection, RPC checks, OP/Orbit stack comparison, token minter discovery, DA helpers, Starknet helpers, TVL estimation, and project-specific analyzers.

**Entry points:** `packages/l2b/README.md`, `packages/l2b/src/commands/index.ts`, `packages/l2b/src/commands/`, `packages/l2b/src/implementations/`.

**Important commands:** `discover`, `ui`, `flatten`, `model-permissions`, `show-permissions`, `compare-flat-sources`, `compare-op-stacks`, `compare-orbit-stacks`, `fetch-flat-sources`, `download-shapes`, `init-template`, `add-shape`, `why`, `leaks`, `events`, `check-rpc`, `blob-senders`, `find-l2`, `find-celestia-namespace`, `starknet-program-hashes`, `zkgovproposal`.

**Likely contributors:** Mateusz Radomski, Michal Podsiadly, sekuba.

## Disco UI

**What it does:** Disco UI is launched by `l2b ui` and serves a local browser interface for browsing discovery projects, configs, code, previews, diffs/history, templates, terminal commands, and project metadata. It is researcher tooling, not the public site.

**Entry points:** `packages/l2b/src/commands/UI.ts`, `packages/l2b/src/implementations/discovery-ui/main.ts`, `packages/l2b/src/implementations/discovery-ui/`, `packages/protocolbeat/src/apps/discovery/` for the newer/adjacent UI.

**Relationships:** It uses discovery/config files and local project folders directly. Some functionality overlaps with Protocolbeat's discovery app.

**Likely contributors:** Mateusz Radomski, Michal Podsiadly, Adrian Adamiak.

## Protocolbeat

**What it does:** `@l2beat/protocolbeat` is a Vite app for protocol discovery and visualization. It has modules for discovery, diffovery, and code browsing, with node panels, config panels, value panels, terminal/code panels, Monaco-based editors, diff views, search, preview, and multi-view layouts.

**Entry points:** `packages/protocolbeat/README.md`, `packages/protocolbeat/src/App.tsx`, `packages/protocolbeat/src/apps/discovery/`, `packages/protocolbeat/src/apps/diffovery/`, `packages/protocolbeat/src/apps/code/`, `packages/protocolbeat/src/components/editor/`.

**Relationships:** It consumes discovery/config/code APIs and appears to be a richer visual/editor surface for the same research data used by discovery and Disco UI.

**Likely contributors:** Michal Podsiadly, Mateusz Radomski, Adrian Adamiak, sekuba.

## Public Frontend

**What it does:** `@l2beat/frontend` is the public-facing dynamic L2BEAT website. It is a React/Vite/SSR-style app with server page routers, page loaders, shared components, charts/tables, content collections, static assets, tRPC, public API routes, and feature-specific data composition.

**Entry points:** `packages/frontend/README.md`, `packages/frontend/src/index.ts`, `packages/frontend/src/pages/ServerPageRouter.ts`, `packages/frontend/src/pages/pageLoaders.ts`, `packages/frontend/src/server/features/`, `packages/frontend/src/components/`, `packages/frontend/src/content/`, `packages/frontend/static/`.

**Relationships:** The frontend reads the generated config database and the main Postgres database. It renders data indexed by backend modules, plus static/research-authored content.

**Likely contributors:** Tomasz Torz, Maciej Zygmunt, Piotr Szlachciak, Dawid Drobny.

## Frontend: Scaling Product

**What it does:** Scaling pages are the core L2BEAT website product for rollups/L2s/L3s. They cover summary, risk, TVS, TVS breakdown, activity, DA, sequencing, liveness, costs, archived projects, project details, project TVS breakdown, and state-validation risk details.

**Entry points:** `packages/frontend/src/pages/scaling/`, `packages/frontend/src/server/features/scaling/`, `packages/frontend/src/components/projects/`, `packages/frontend/src/components/chart/tvs/`, `packages/frontend/src/components/chart/activity/`.

**Relationships:** Uses project config, TVS data, activity data, tracked-txs/liveness/costs data, DA config, discovery-derived contracts/permissions, and risk/stage definitions.

**Likely contributors:** Tomasz Torz, Maciej Zygmunt, Piotr Szlachciak.

## Frontend: Interop Product

**What it does:** Interop pages show cross-chain interoperability statistics and protocol/token views: summary, non-minting, lock-and-mint, burn-and-mint, protocol detail, token detail, token frameworks, chain flows, tokens, widgets, and comparison tables.

**Entry points:** `packages/frontend/src/pages/interop/`, `packages/frontend/src/server/features/scaling/interop/`, `packages/frontend/src/pages/interop/components/`.

**Relationships:** Reads aggregated interop transfer/token data, TokenDB enrichment, config interop metadata, and app-state overrides. Backoffice has the operational counterpart for debugging the same backend data.

**Likely contributors:** Maciej Zygmunt, Tomasz Torz, Dawid Drobny.

## Frontend: Data Availability Product

**What it does:** DA pages cover DA summary, risk, throughput, liveness, project pages, archived DA projects, and DA risk framework content.

**Entry points:** `packages/frontend/src/pages/data-availability/`, `packages/frontend/src/server/features/data-availability/`, `packages/frontend/src/pages/da-risk-framework/`, `packages/frontend/src/components/chart/data-availability/`.

**Relationships:** Uses DA-layer project config, DA tracking indexed data, DA Beat stats/economic security, and project risk definitions.

**Likely contributors:** Tomasz Torz, Maciej Zygmunt, Piotr Szlachciak.

## Frontend: Privacy Product

**What it does:** Privacy pages show summary and project views for privacy systems, using privacy attributes and indexed flow/value data.

**Entry points:** `packages/frontend/src/pages/privacy/`, `packages/frontend/src/server/features/privacy/`, `packages/frontend/src/components/PrivacyAttributeTag.tsx`, `packages/config/src/common/privacyAttributes.ts`.

**Relationships:** Reads project privacy config and backend `PrivacyFlowEvent` data.

**Likely contributors:** Tomasz Torz, Maciej Zygmunt, sekuba.

## Frontend: ZK Catalog

**What it does:** The zk catalog pages list and detail prover/proof-system related projects, with tags, attesters, trusted setup metadata, and project pages.

**Entry points:** `packages/frontend/src/pages/zk-catalog/`, `packages/frontend/src/server/features/zk-catalog/`, `packages/config/src/common/zkCatalog*.ts`, zk catalog project definitions in `packages/config/src/projects/`.

**Relationships:** Mostly config/content driven, with shared frontend table/detail infrastructure.

**Likely contributors:** Maciej Zygmunt, Tomasz Torz, Dawid Drobny.

## Frontend: Ecosystems, Governance, Publications, Content

**What it does:** The frontend also includes ecosystem pages, governance and Ethereum Connect pages, publications/monthly updates/other publications, glossary, FAQ, changelog, brand kit, donate, stages, multisig report, terms, dev icon preview, and static/SEO/OpenGraph assets.

**Entry points:** `packages/frontend/src/pages/ecosystems/`, `packages/frontend/src/server/features/ecosystems/`, `packages/frontend/src/pages/governance/`, `packages/frontend/src/pages/publications/`, `packages/frontend/src/content/`, `packages/frontend/scripts/opengraph-images/`.

**Relationships:** These are a mix of config-driven pages, authored content collections, and static assets.

**Likely contributors:** Frontend path signal: Tomasz Torz, Maciej Zygmunt, Piotr Szlachciak, Dawid Drobny.

## Public API

**What it does:** `@l2beat/public-api` exposes versioned API routes for public consumers. Current routes include activity, interop, projects, and TVS, with OpenAPI-style schemas and caching.

**Entry points:** `packages/public-api/src/routes/`, `packages/public-api/src/routes/activity/`, `packages/public-api/src/routes/interop/`, `packages/public-api/src/routes/projects/`, `packages/public-api/src/routes/tvs/`, `packages/public-api/src/context/`, `packages/public-api/src/middleware/`.

**Relationships:** It consumes `ProjectService`, `@l2beat/database`, and shared validation/cache utilities. The frontend package also still contains some `/api/scaling/...` public-ish routes under `packages/frontend/src/server/routers/PublicApiRouter/`.

**Likely contributors:** Tomasz Torz, Maciej Zygmunt, Dawid Drobny.

## TokenDB Backend

**What it does:** `@l2beat/token-backend` is the TokenDB service. It models Abstract Tokens, Deployed Tokens, chains, token connections, token history, user-driven writes, automatic token ingestion, and a tRPC API for the Token UI and interop financials.

**Entry points:** `packages/token-backend/README.md`, `packages/token-backend/src/server.ts`, `packages/token-backend/src/trpc/appRouter.ts`, `packages/token-backend/src/intents.ts`, `packages/token-backend/src/planning.ts`, `packages/token-backend/src/execution.ts`, `packages/token-backend/src/commitTokenChanges.ts`, `packages/token-backend/src/ingestion/`, `docs/mdbook/specs/l2b_specs/token_db/`.

**Key concepts:** Abstract Token is the canonical asset identity; Deployed Token is a `(chain, address)` instance; TokenConnection represents links between deployed tokens; user edits go intent -> plan -> commands -> execute; ingestion goes plan -> fetch -> apply from interop transfer evidence and CoinGecko/RPC facts.

**Relationships:** Interop financials calls TokenDB to map deployed tokens to abstract assets. Automatic ingestion scans `InteropTransfer` rows and enqueues token addresses. Token UI is the human editing/triage surface.

**Likely contributors:** Tomasz Torz, Adrian Adamiak, Michal Podsiadly.

## TokenDB UI

**What it does:** `@l2beat/token-ui` is a Vite/React internal UI for TokenDB. It lets researchers browse/search abstract and deployed tokens, add tokens/chains, inspect suggestions, manage the ingestion queue, view history, and confirm write plans.

**Entry points:** `packages/token-ui/src/App.tsx`, `packages/token-ui/src/pages/tokens/`, `packages/token-ui/src/pages/chains/`, `packages/token-ui/src/pages/search/`, `packages/token-ui/src/components/PlanConfirmationDialog.tsx`, `packages/token-ui/src/react-query/trpc.tsx`.

**Relationships:** It talks to token-backend tRPC and uses the intent/plan/execute workflow for human writes. The ingestion queue page can run cheap planning for visible rows and preview fetch/apply traces.

**Likely contributors:** Tomasz Torz, Adrian Adamiak, Maciej Zygmunt.

## Token Knowledge

**What it does:** `packages/token-knowledge` and `packages/token-knowledge-ui` exist in this checkout but do not have package manifests or source files visible, only build/dist artifacts. From filenames, they appear to be an experimental or generated Clingo/token inference service/UI around token transfer facts and a token knowledge base.

**Entry points:** Build artifacts under `packages/token-knowledge/build/` and `packages/token-knowledge-ui/dist/`.

**Uncertainty:** Because source and package manifests are absent in this checkout, treat this as historical/generated/worktree residue unless confirmed elsewhere.

**Likely contributors:** No useful git path signal in this checkout.

## Tools API

**What it does:** `@l2beat/tools-api` serves backend APIs for web tools, especially the transaction/calldata decoder. It looks up signatures from Sourcify/4byte, enriches addresses from discovery/Etherscan/Alchemy/token config, fetches transactions, and decodes nested calls/preimages.

**Entry points:** `packages/tools-api/src/index.ts`, `packages/tools-api/src/services/Application.ts`, `packages/tools-api/src/modules/decoder-module/`, `packages/tools-api/src/config/`, `packages/tools-api/src/third-party/`.

**Relationships:** It supports `@l2beat/tools` decoder UIs and consumes discovery data, token config, known ABIs/hashes, chain metadata, and third-party APIs.

**Likely contributors:** Mateusz Radomski, Piotr Szlachciak, Michal Podsiadly.

## Tools UI

**What it does:** `@l2beat/tools` is a Vite/React web tools app. It contains multiple decoder versions, a simulator, DiscoLupe, logo generator, and update-monitor-like monitor views.

**Entry points:** `packages/tools/src/index.tsx`, `packages/tools/src/decoder-3/`, `packages/tools/src/decoder-new/`, `packages/tools/src/decoder/`, `packages/tools/src/simulator/`, `packages/tools/src/discolupe/`, `packages/tools/src/logo-generator/`, `packages/tools/src/monitor/`.

**Relationships:** Decoder tools call tools-api; DiscoLupe appears to inspect discovery/config matrices; monitor views call update monitor APIs.

**Likely contributors:** Mateusz Radomski, Tomasz Torz, Michal Podsiadly.

## UOPS Dashboard

**What it does:** `@l2beat/uops-dashboard` is a Next.js dashboard for exploring user operations. Users select chains/blocks or ranges, the server fetches blocks, counts transactions vs user operations, detects ERC-4337/Safe/Multicall/EIP-712/EIP-7821 and Starknet operation patterns, and displays block/statistics details.

**Entry points:** `packages/uops-dashboard/README.md`, `packages/uops-dashboard/src/pages/index.tsx`, `packages/uops-dashboard/src/pages/stats/index.tsx`, `packages/uops-dashboard/src/pages/api/`, `packages/uops-dashboard/src/server/counters/`, `packages/uops-dashboard/src/server/services/ChainService.ts`, `packages/uops-dashboard/src/chains.ts`.

**Relationships:** Shares UOPS constants/helpers with `@l2beat/shared/uops`. It is separate from the backend activity module, though both deal with user-operation counts.

**Likely contributors:** maciekop-l2b, Antoni Pawlak, Maciej Zygmunt, Piotr Szlachciak.

## Public And Internal tRPC

**What it does:** Backend modules contribute tRPC routers for internal/backoffice-style UIs. TokenDB has its own token-backend tRPC API. Frontend also has its own tRPC utilities for client/server interactions.

**Entry points:** `packages/backend/src/trpc/`, `packages/backend/src/modules/*/trpc/`, `packages/backend/src/modules/interop/engine/dashboard/trpc/`, `packages/backend/src/modules/backoffice/`, `packages/token-backend/src/trpc/`, `packages/frontend/src/trpc/`, `packages/backoffice/src/react-query/trpc.tsx`, `packages/token-ui/src/react-query/trpc.tsx`.

**Relationships:** Backoffice backend wraps module tRPC contributions under one router; token-ui talks to token-backend; public website pages mostly use server-side data loaders and repository reads, not token-backend.

**Likely contributors:** Backend/backoffice/token contributors listed above.

## Legacy Or Ambiguous Folders

**packages/dal:** Contains build artifacts for a data-access-layer package (`QueryExecutor`, cache, query types) but no package manifest/source in this checkout. Treat as generated or historical unless source appears.

**packages/interop-backoffice-ui:** Contains only `src/App.tsx` visible and no package manifest. It may be an older or partial predecessor to `packages/backoffice`.

**packages/token-knowledge / token-knowledge-ui:** See Token Knowledge section. Build/dist artifacts only.

**.devcontainer:** Local container setup exists and is modified in this worktree before this document was created; this document does not depend on or alter that change.

## Documentation Site

**What it does:** `docs/mdbook` contains long-form specs and code walkthroughs, including TokenDB design docs and protocol code walkthroughs for Arbitrum, Optimism, Scroll, Taiko Alethia, Celestia, EigenDA, and DA layers.

**Entry points:** `docs/mdbook/package.json`, `docs/mdbook/specs/`, `docs/mdbook/specs/l2b_specs/token_db/`, `docs/mdbook/specs/code_walkthroughs/`.

**Relationships:** These docs are source material for design decisions and should be kept in sync for TokenDB topics according to `packages/token-backend/README.md`.

## Operational Scripts

**What it does:** Root and package scripts cover DB migration/restore, backend feature scripts, TVS generation/execution/debugging, token generation/verification, config diffs/fills, multichain/omnichain updates, discovery refresh, frontend OG/image/performance/page tests, and Coolify environment checks.

**Entry points:** `scripts/README.md`, `scripts/coolify/check-env.ts`, `packages/backend/scripts/`, `packages/config/scripts/`, `packages/frontend/scripts/`, `packages/database/scripts/`.

**Relationships:** Many workflows are script-driven rather than app-driven; check package `package.json` scripts before assuming a workflow lives in source code only.

## Glossary For Future Transcript Reading

**TVS:** Total Value Secured, the current value metric for tokens secured by projects. Implemented mainly in backend TVS, config TVS inputs, database token-value tables, frontend TVS pages, and public API TVS routes.

**Discovery:** Contract exploration and modelling system that generates `discovered.json`, contract/permission information, and update-monitor comparisons.

**Disco UI:** Local UI launched by `l2b ui` for discovery browsing/editing workflows.

**Protocolbeat:** Vite app for discovery/protocol visualization, diffs, code, and editor-like research workflows.

**Flattener:** Solidity source flattening and comparison tooling under discovery/l2b.

**UIF:** Universal Indexer Framework, the safe-height/update/retry state machine used by many backend indexers.

**Tracked transactions:** Configured Dune-sourced transaction streams used for liveness and cost metrics.

**Liveness:** Metrics about how frequently projects submit expected transactions, plus aggregated delays and anomaly inputs.

**DA / DA tracking:** Data availability layer and per-project/layer throughput tracking.

**DA Beat:** DA-layer economic/security stats and prices.

**Interop:** Cross-chain transfer/message/event tracking, plugin capture, matching, financial enrichment, aggregation, public pages, and backoffice monitoring.

**TokenDB:** Canonical token identity graph: Abstract Tokens, Deployed Tokens, connections, ingestion queue, history, token-backend, token-ui.

**Clingo:** Logic programming tool used in discovery/permission modelling and apparently experimental token knowledge work.

**Flat sources:** Flattened contract source files, both in project `.flat` folders and database-served flat-source records.

**UOPS:** User operations, counted in a standalone dashboard and also in backend activity paths.

## Gaps And Assumptions

- I did not read every project definition, template, frontend component, repository, or interop plugin. The document maps the system and gives entry points rather than exhaustively documenting every project.
- Contributor signals are based on Git author names for paths, not formal ownership or current team assignment.
- `packages/dal`, `packages/interop-backoffice-ui`, `packages/token-knowledge`, and `packages/token-knowledge-ui` look incomplete or generated in this checkout because they lack package manifests/source files.
- Some terminology has historical overlap: older code/scripts/docs may still say TVL, while the current product language uses TVS.
- Discovery, Protocolbeat, Disco UI, and tools have overlapping research workflows; the exact current preferred UI/tool for each researcher task may require team context.
