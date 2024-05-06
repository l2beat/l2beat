# @l2beat/backend-tools

## 0.5.2

### Patch Changes

- Add the ability to pass multiple env variable keys

## 0.5.1

### Patch Changes

- Pretty format does not add an extra new line

## 0.5.0

### Minor Changes

- b8e1c2f: All logging methods in Logger now accept variadic arguments of any type.
  The `reportError` option callback now receives full context of the logged message.
  Added documentation for the `Logger` class.
  Logging in the `json` format now outputs a `"parameters"` property.

## 0.4.0

### Minor Changes

- 02f8ba7: Improve error reporting parameters

## 0.3.0

### Minor Changes

- 8c3cf3b: Add possibility to specify reportCriticalError
- a6f2896: Added RateLimiter to the backend-tools
- 6be46f5: Add throttling

### Patch Changes

- 6f84bf6: Downgrade chalk to version 4 with CJS support

## 0.2.0

### Minor Changes

- 535ce58: Add tag option
- 8998dae: Add Z to UTC timestamps in logger

### Patch Changes

- 87f950f: Add tests and fix small inconsistencies
