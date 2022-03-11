# Optimism Checker

This script checks the current deployment of Optimism-like Rollup

Optimism (and optimisms clones) on L1 consists of several contracts. The list of the contracts is stored in LibAddressManager

The script:

1. Checks current configuration and warns if any of the components changed in LibAddressManager
2. Reads current parameters from each of the compoments
3. Checks the main generic bridge (TODO)

## Usage

`yarn start [network]`

optimism, metis, boba and nahmii are supported
