# Contracts section

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Overview](#overview)
- [Single contract view](#single-contract-view)
- [Contract categories](#contract-categories)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

The goal of the contracts section is to list all contracts in the system that are not considered ultimate permissions, as per defined by the [Permissions section](./permissions.md) spec. For each contract, the most relevant information should be presented. All information for a single contract should be as local as possible to allow for modularity via the template system.

## Single contract view

For each contract, the basic information to be shown is the name and the address. If a contract is a proxy, the implementation contract(s) should also be shown. Optionally, a category can be shown. If a contract has any field with a defined "interact" or "act" permission, the direct permission receiver should be shown. Note that these permissions might not be ultimate permissions. Optionally, if the design allows, the ultimate permission receiver can be shown too. Upgrade permissions should be presented more distinctly, with the ultimate permission receiver shown, and its associated ultimate delay.

Let's pick some Arbitrum One's contracts to present an implementation proposal that only shows direct permissions for "interact" and "act" permissions:

```md
- **RollupProxy** [0x4DCe…Cfc0] [Implementation #1 (Upgradable)] [Implementation #2 (Upgradable)] [Admin]()
  ...description...
  + Can be upgraded by: [Outbox with 3d delay] [Arbitrum Security Council with no delay]()
  + <Roles>
    * `owner`: [UpgradeExecutor]()

- **UpgradeExecutor** [0x1234…5678] [Admin]()
  ...description...
  + Can be upgraded by: [Outbox with 3d delay] [Arbitrum Security Council with no delay]()
  + <Roles>
    * `executors`: [L1Timelock] [Arbitrum Security Council]()

- **L1Timelock** [0x9abc…def0] [Admin]()
   ...description...
  + Can be upgraded by: [Outbox with 3d delay] [Arbitrum Security Council with no delay]()
  + <Roles>
    * `proposer`: [Bridge]()
    * `canceller`: [UpgradeExecutor]()

- **Bridge** [0x1a2b…3c4d] [Admin]()
  ...description...
  + Can be upgraded by: [Outbox with 3d delay] [Arbitrum Security Council with no delay]()
  + <Roles>
    * `proposer`: [L1Timelock]()
    * `canceller`: [UpgradeExecutor]()
```

If the design allows, the description of each "role" can be shown.

## Contract categories

TBD
