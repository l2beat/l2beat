# Permissions section

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Overview](#overview)
- [Permissioned actors](#permissioned-actors)
- [Permissioned actions](#permissioned-actions)
- [Grouping actors by entity](#grouping-actors-by-entity)
- [Possible future developments](#possible-future-developments)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

The goal of the permissions section is to list ultimate permissioned actors such as EOAs, multisigs, governors, or equivalent, that can affect the system. What falls in the equivalent class is left to intuition and discussion.

## Permissioned actors

The permission section should not list nested multisigs when controlled by a single entity as it's not in our scope of assessment to evaluate members within one entity. For example, the `OPFoundationUpgradeSafe`, at the time of writing, is a 5/7 multisig that contains another 2/2 multisig as a member. Such multisig should not be listed. On the other hand, the `SuperchainProxyAdminOwner` is formed by two distinct entities that are relevant for the assessment, as one member is the `OpFoundationUpgradeSafe` and the other is the `SecurityCouncilMultisig`, so both should be listed. One possible solution is to always hide nested multisigs unless explicitly stated otherwise. Eventually, for the risk assessment purpose, we might want to explicitly assign entities to multisigs, so this logic for nested multisigs might eventually be built on top of that.

Each non-EOA permissioned actor should have a description of its code, independent of the connections to other contracts. For example, multisigs should show the threshold, size and eventual modules, while governors should describe their own mechanism and params like quorums and voting periods. All permissioned actors should list the ultimate permissioned actions that they can perform on the system. Actors that produce the exact same description should be grouped together in one entry.

```md
- (3) 0x123, 0x456, 0x789
  + Can interact with Inbox to:
    * sequence transactions  
```

## Permissioned actions

The "upgrade" permissioned action for each permissioned actor should group contracts based on the set of possible delays that can be used on them.

```md
- **FoochainMultisig**
  A multisig with 3/5 threshold.
  + Can upgrade with either 7d or no delay:
    * FoochainPortal <via>
    * L1StandardBridge <via>
  + Can upgrade with 7d delay:
    * L1ERC721Bridge <via>
  + Can upgrade with no delay:
    * SystemConfig <via>
```

Such grouping can be achieved by first grouping individual contracts by delay, and then contracts by set of delays.

```md
[FoochainPortal] with [7d <via1>] delay
[FoochainPortal] with [no <via2>] delay
[L1StandardBridge] with [7d <via3>] delay
[L1StandardBridge] with [no <via4>] delay
[L1ERC721Bridge] with [7d <via5>] delay
[SystemConfig] with [no <via6>] delay
>>>
[FoochainPortal] with [7d <via1>, no <via2>]
[L1StandardBridge] with [7d <via3>, no <via4>]
[L1ERC721Bridge] with [7d <via5>]
[SystemConfig] with [no <via6>]
>>>
[FoochainPortal <via1_or_via2>, L1StandardBridge <via3_or_via4>] with [7d, no] delay
[L1ERC721Bridge <via5>] with [7d] delay
[SystemConfig <via6>] with [no] delays
```

Each `<via>` should show the list of intermediate contracts used to perform the ultimate permissioned action, starting with the contract closer to the permissioned actor. If any contract adds a delay, it should be listed as well. The total delay shown with the permissioned action should be the sum of all delays in this chain of contracts.

```md
- **FoochainMultisig**
  A multisig with 3/5 threshold.
  + Can upgrade with 7d delay:
    * L1ERC721Bridge acting via Timelock1 with 3d delay -> Timelock2 with 4d delay -> ProxyAdmin or via Timelock3 with 7d delay -> ProxyAdmin
```

Permissioned actions outside of upgrades should group by contract first and then list the actions with the appropriate delays. Where possible, each action should be listed as a separate entry.

```md
- **FoochainMultisig**
  A multisig with 3/5 threshold.
  + Can interact with Timelock1 to:
    * propose transactions with 3d delay <via>
    * update the minimum delay with 7d delay <via>
```

## Grouping actors by entity 

As previously discussed, there's a will to group permissioned actors by entity. While the ultimate mechanism is still to be defined, it is worth it to first consider grouping multisigs with the same members, threshold and size under the same permissioned actor. Since these are abstracted entities, they should show the immediate underlying multisigs.

At the time of writing, Arbitrum One makes use of three distinct multisigs for the Security Council, with the same set of members and threshold: `L1EmergencySecurityCouncil`, `L2EmergencySecurityCouncil` and `L2ProposerSecurityCouncil`. Without the grouping, the permissions section would look like this:

```md
- **L1EmergencySecurityCouncil**
  A multisig with 9/12 threshold.
  + Can upgrade with no delay:
    * RollupProxy <via>
    * Outbox <via>
    * ...
  + Can interact with L1Timelock to:
    * update the minimum delay 
    * manage all access control roles of the timelock
    * cancel queued transactions
  + Can interact with RollupProxy to:
    * pause and unpause the contract
    * update sequencer management delegation
    * ...
- **L2EmergencySecurityCouncil**
  A multisig with 9/12 threshold.
  + Can upgrade with no delay:
    * L2ERC20Gateway <via>
    * L2GatewayRouter <via>
    * ...
  + Can interact with L2Timelock to:
    * update the minimum delay
    * manage all access control roles of the timelock
- **L2ProposerSecurityCouncil**
  A multisig with 9/12 threshold.
  + Can upgrade with 17d 8h delay:
    * RollupProxy <via>
    * Outbox <via>
  + Can interact with L2Timelock to:
    * propose transactions
  + Can interact with L1Timelock to:
    * propose transactions with 14d 8h delay
    * update the minimum delay with 17d 8h delay
    * manage all access control roles of the timelock with 17d 8h delay
    * cancel queued transactions with 17d 8h delay 
  + Can interact with RollupProxy to:
    * pause and unpause the contract with 17d 8h delay
    * update sequencer management delegation with 17d 8h delay
    * ...
```

With the grouping, the permissions section would look like this:

```md
- **SecurityCouncilMultisig**
  A multisig with 9/12 threshold. Acts through L1EmergencySecurityCouncil, L2EmergencySecurityCouncil and L2ProposerSecurityCouncil.
  + Can upgrade with either 14d 8h or no delay:
    * RollupProxy <via>
    * Outbox <via>
    * ...
  + Can interact with L1Timelock to:
    * propose transactions with 14d 8h <via>
    * update the minimum delay with either 14d 8h or no delay <via>
    * manage all access control roles of the timelock with either 14d 8h or no delay <via>
    * cancel queued transactions with either 17d 8h or no delay <via>
  + Can interact with L2Timelock to:
    * propose transactions <via>
    * update the minimum delay <via>
    * manage all access control roles of the timelock <via>
  + Can interact with RollupProxy to:
    * pause and unpause the contract with 17d 8h or no delay <via>
    * update sequencer management delegation with 17d 8h or no delay <via>
    * ...
```

## Possible future developments

While still in the discussion phase, there's a will to show immediate permissioned given by each contract. For example, if a contract makes use of access control, each immediate role assignment would be shown, regardless of whether it is an intermediate contract or a permissioned actor. It is likely that these entries will be displayed in the contracts section under each contract rather than the permissions section.
