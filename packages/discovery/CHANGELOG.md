# @l2beat/discovery

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
