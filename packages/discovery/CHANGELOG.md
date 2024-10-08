# @l2beat/discovery

## 0.48.0

### Minor Changes

- 1ebf93e: Support contract templates
- 474827d: Auto-detect contract templates during discovery
- 814c482: Remove meta.json files, move data to config.jsonc

## 0.47.1

### Patch Changes

- Check for values smaller than MIN_SAFE_INTEGER

## 0.47.0

### Minor Changes

- Use fast-solidity-parser

## 0.46.11

### Patch Changes

- Use cache for L2 calls in ArbitrumScheduledTransactionsHandler

## 0.46.10

### Patch Changes

- Read reorgSafeDepth from environment variable

## 0.46.9

### Patch Changes

- getLogs can now filter events for non-indexed values

## 0.46.8

### Patch Changes

- Unify var names for discovery config

## 0.46.7

### Patch Changes

- Allow to pick fields from struct returns in CallHandler

## 0.46.6

### Patch Changes

- Compute multisig threshold in the proxy detector
- Updated dependencies
  - @l2beat/discovery-types@0.8.1

## 0.46.5

### Patch Changes

- Extend the flattener to include other top-level declarations

## 0.46.4

### Patch Changes

- Fix Mantle flattener errors

## 0.46.3

### Patch Changes

- Fix PolygonZKEVM flattener errors

## 0.46.2

### Patch Changes

- Rename STRUCTURE to CODE_CHANGE

## 0.46.1

### Patch Changes

- Add ArbitrumScheduledTransactionsHandler

## 0.46.0

### Minor Changes

- Add sepolia support

## 0.45.5

### Patch Changes

- Sort the meta.json and allow for descriptions in contracts

## 0.45.4

### Patch Changes

- Add filtering to array handler

## 0.45.3

### Patch Changes

- Make the array syntax consistent

## 0.45.2

### Patch Changes

- Add a comment with the solidity version used to compile the contract to flat output

## 0.45.1

### Patch Changes

- Fix the StarkWareProxy handler versioning heuristic

## 0.45.0

### Minor Changes

- Add OP stack blob transaction checker

## 0.44.6

### Patch Changes

- Handle StarkWare proxy version 5

## 0.44.5

### Patch Changes

- Remove the need to have numeric suffixes in normalizing diff path

## 0.44.4

### Minor Changes

- Change ArbitrumDAC values calculation

## 0.44.3

### Patch Changes

- Flattening results always have unix line encodings

## 0.44.2

### Patch Changes

- Fix an edge case in import resolving.

## 0.44.1

### Patch Changes

- Allow for n-darray in normalizeDiffPath

## 0.44.0

### Minor Changes

- Import discovery diff related utilities from L2BEAT.
  Mainly focusing on importing and improving diffToMarkdown functionality.

## 0.43.7

### Patch Changes

- Add --flat-sources-folder as cli parameter

## 0.43.6

### Patch Changes

- Fix edge case in saving flattened sources

## 0.43.5

### Patch Changes

- Export type

## 0.43.4

### Patch Changes

- Flattener now supports context in the remappings

## 0.43.3

### Patch Changes

- Fix Scroll source code flattening

## 0.43.2

### Patch Changes

- Add zkSync Era as a chain

## 0.43.1

### Patch Changes

- Add meta.json

## 0.43.0

### Minor Changes

- Flattener

## 0.42.2

### Patch Changes

- Support all uint types in ArrayHandler

## 0.42.1

### Patch Changes

- Export InvertedAddressDetails and Role types

## 0.42.0

### Minor Changes

- Log all the discovery errors at the end of the execution

## 0.41.0

### Minor Changes

- Added StateFromEventTuple handler

## 0.40.1

### Patch Changes

- Filter out incoming transactions from etherscan response

## 0.40.0

### Minor Changes

- Add opStackSequencerInboxHandler

## 0.39.1

### Patch Changes

- Don't check every tx in opDAHandler

## 0.39.0

### Minor Changes

- Add ArbitrumDACKeyset handler

## 0.38.0

### Minor Changes

- Added a ArbitrumSequencerVersion handler

## 0.37.0

### Minor Changes

- Add OpStackDAHandler

## 0.36.0

### Minor Changes

- Add getDebugTraceTransaction method (debug_traceTransaction RPC call)

## 0.35.0

### Minor Changes

- Remove ChainId entirely

## 0.34.0

### Minor Changes

- Add chain name support to ConfigReader.
- Add readAllChains method.
- Mermaid output is now saved to {project}/{chain}/.mermaid

## 0.33.0

### Minor Changes

- Change the trace_transaction zod type

## 0.32.0

### Minor Changes

- Update environment variables for polygonpos and polygonzkevm

## 0.31.0

### Minor Changes

- Remove dashes from chain names (breaking!)

## 0.30.0

### Minor Changes

- Add ArbitrumActorsHandler

## 0.29.0

### Minor Changes

- Axelar proxy rewrite, now manual proxy type

### Patch Changes

- Updated dependencies
  - @l2beat/discovery-types@0.8.0

## 0.28.4

### Patch Changes

- Export getMulticall3Config

## 0.28.3

### Patch Changes

- Append address to source folders if names clash

## 0.28.2

### Patch Changes

- Add new ChainIds

## 0.28.1

### Patch Changes

- Expose UnixTime class

## 0.28.0

### Minor Changes

- Enable filtering events by topics in handlers

## 0.27.2

### Patch Changes

- Pretty format does not add an extra new line
- Updated dependencies
  - @l2beat/backend-tools@0.5.1

## 0.27.1

### Patch Changes

- Export additional types

## 0.27.0

### Minor Changes

- Improve Zodiac Module detection heuristic

### Patch Changes

- Updated dependencies
  - @l2beat/discovery-types@0.7.0

## 0.26.0

### Minor Changes

- Downgrade Etherscanlike Client's props privacy scope to enable easy class extension

## 0.25.1

### Patch Changes

- Fix array handler undetermistic indices

## 0.25.0

### Minor Changes

- Added LineaRolesHandler and automatic detection of Zodiac Gnosis Modules

### Patch Changes

- Updated dependencies
  - @l2beat/discovery-types@0.6.0

## 0.24.0

### Minor Changes

- Add indices field to ArrayHandler

## 0.23.1

### Patch Changes

- Improve ChainId error in Discovery

## 0.23.0

### Minor Changes

- runInversion now has config optional

## 0.22.0

### Minor Changes

- Added discovery support for Gnosis-Safe multisig modules

### Patch Changes

- Updated dependencies
  - @l2beat/discovery-types@0.5.0

## 0.21.4

### Patch Changes

- Export discover method to allow running `discovery discover` command directly from the package

## 0.21.3

### Patch Changes

- Fix dependency error when value is 0

## 0.21.2

### Patch Changes

- Cache getCode() with blockNumber because the code can change

## 0.21.1

### Patch Changes

- Updated dependencies [b8e1c2f]
  - @l2beat/backend-tools@0.5.0

## 0.21.0

### Minor Changes

- Skip functions with no outputs during discovery

## 0.20.0

### Minor Changes

- Sort discovery output values by keys

## 0.19.2

### Patch Changes

- Properly decode tuples from multicall

## 0.19.1

### Patch Changes

- Use config.json names entry in naming EOAs in the mermaid diagram
- Minimized proxy detection calls in scroll access control

## 0.19.0

### Minor Changes

- Block number is now required when working with cache despite invoked method

## 0.18.4

### Patch Changes

- Categorize a project as a folder with a config.jsonc and discovered.json

## 0.18.3

### Patch Changes

- Fix address analyzer log output

## 0.18.2

### Patch Changes

- Export multicall config type

## 0.18.1

### Patch Changes

- Expose the type for inversion

## 0.18.0

### Minor Changes

- Add multicall support and use multicall for SimpleStorageHandler

## 0.17.2

### Patch Changes

- Add AxelarProxy as auto detecting proxy
- Updated dependencies
  - @l2beat/discovery-types@0.4.1

## 0.17.1

### Patch Changes

- Expose the inverse functionality

## 0.17.0

### Minor Changes

- Add optional support for reorg cache protection via safe depth

## 0.16.2

### Patch Changes

- fix inversion for scroll access control

## 0.16.1

### Patch Changes

- Export ChainId, Remove an unused test

## 0.16.0

### Minor Changes

- add ScrollAccessControlHandler

## 0.15.0

### Minor Changes

- Add quick mode (hasOutputChanged)

### Patch Changes

- Updated dependencies
  - @l2beat/discovery-types@0.4.0

## 0.14.3

### Patch Changes

- Add immutable proxy override
- Updated dependencies
  - @l2beat/discovery-types@0.3.2

## 0.14.2

### Patch Changes

- Rediscover on upgradeBeacon too

## 0.14.1

### Patch Changes

- Fix unknown modifier bug

## 0.14.0

### Minor Changes

- 733dcc6: Add LayerZeroMultisig handler

## 0.13.1

### Patch Changes

- Pass the unsupported

## 0.13.0

### Minor Changes

- 0b08f01: Added point-in-time cache reference data

## 0.12.0

### Minor Changes

- Etherscan like clients can now configure unsuppoted methods

## 0.11.0

### Minor Changes

- Rediscover on beaconController in Optics Beacon Proxy

## 0.10.0

### Minor Changes

- New supported CLI options: --block-number, --sources-folder, --discovery-filename

## 0.9.0

### Minor Changes

- Allow the contract deployment query to fail

## 0.8.0

### Minor Changes

- Enable rateLimiting for provider witch cache

## 0.7.1

### Patch Changes

- 951c151: Export ProviderWithCache

## 0.7.0

### Minor Changes

- Support custom cache backend, provide SQLite3 cache backend.

## 0.6.0

### Minor Changes

- 2b3db57: Support fetching logs in batches

### Patch Changes

- Updated dependencies [02f8ba7]
  - @l2beat/backend-tools@0.4.0

## 0.5.0

### Minor Changes

- a04ca64: `ConstructorArgsHandler` now derives constructor arguments from block explorer's response instead of raw deploy transaction's data. If it fails to do so, it will fallback to the old behavior using heuristic and try to decode constructor arguments by reading end of the deployment data.
- 38f146e: Add DynamicArrayHandler for fetching the content of internal dynamic arrays.

## 0.4.1

### Patch Changes

- 69ffa66: Fix faulty release
- Updated dependencies [69ffa66]
  - @l2beat/discovery-types@0.3.1

## 0.4.0

### Minor Changes

- Start tracking the deployment timestamp for contracts

### Patch Changes

- Updated dependencies
  - @l2beat/discovery-types@0.3.0

## 0.3.0

### Minor Changes

- Add manual OpticsBeaconProxy

### Patch Changes

- Updated dependencies
  - @l2beat/discovery-types@0.2.0

## 0.2.1

### Patch Changes

- 9cf579a: Fix assertion error when contract code is not verified

## 0.2.0

### Minor Changes

- 7cfe43d: Added inline package description, pretty runner output, discovery diff now accepts list of unverified contracts

## 0.1.0

### Minor Changes

- df6341e: Initial discovery release, sync dependencies versions
