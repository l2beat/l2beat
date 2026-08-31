Generated with discovered.json: 0x4cacb8866922a44ac5ab290b7bad30c725c86009

# Diff at Mon, 31 Aug 2026 15:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@213634bdbfe31b47c124857f877cc3b9f13184f4 block: 1787311119
- current timestamp: 1787311119

## Description

ossification severity fixes: DGF gameArgs + ETHLockbox authorizations + zk-stack governance pointers HIGH; fee/blocklist/maker-wards MEDIUM

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787311119 (main branch discovery), not current.

```diff
    contract GovernorRewardsSweeper (eth:0x2eCa05b128bF5cbd5A73CC4BB625B51131FF119B) [railgun/Sweeper] {
    +++ description: Helper that forwards all ETH or ERC20 balances it holds to a fixed receiver.
      values.$pastUpgrades.0:
+        ["2022-11-22T20:14:11.000Z","0x8a7ec325dbefb9e150064f9b94f680f3a96fef73b2f1160c40aa195a88a98ad6",["eth:0x7d1C12008d180718938F535eE0dec7ac3473c179"]]
      values.$pastUpgrades.1:
+        ["2023-02-07T06:14:47.000Z","0x128597009072e4bbc08293c81904d4cf5bb22b9cad1f87bf99a7edaa2878deaf",["eth:0x2ea76A3c4795DD1a5d206B285fD21b2Fb83EAf1a"]]
      values.$upgradeCount:
-        0
+        2
    }
```

```diff
    contract ProxyAdmin (eth:0x4F8E20f55f879beE7Bc010Bd6bD2138B34aC65c8) [railgun/ProxyAdmin] {
    +++ description: Admin interface for Railgun's pausable upgradeable proxies. It does not hold funds, but its controller can operate every proxy attached to it.
      critical:
+        true
    }
```

```diff
    contract VerificationKeySetter_64DA (eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, if Railgun governance switches the contract into COMMITTING state, can register the new keys in the Railgun smart wallet verifier.
      fieldMeta.owner.severity:
-        "HIGH"
      fieldMeta.state.severity:
-        "HIGH"
      fieldMeta.state.description:
-        "Current workflow phase: SETTING, WAITING, or COMMITTING. Only COMMITTING allows the owner to forward staged verification keys to the verifier."
+        "Current workflow phase: SETTING, WAITING, or COMMITTING. This is transient process state; completed verifier-key changes are tracked on the smart wallet."
      fieldMeta.state.type:
-        "RISK_PARAMETER"
      critical:
+        true
    }
```

```diff
    contract VerificationKeySetter_9086 (eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, if Railgun governance switches the contract into COMMITTING state, can register the new keys in the Railgun smart wallet verifier.
      fieldMeta.owner.severity:
-        "HIGH"
      fieldMeta.state.severity:
-        "HIGH"
      fieldMeta.state.description:
-        "Current workflow phase: SETTING, WAITING, or COMMITTING. Only COMMITTING allows the owner to forward staged verification keys to the verifier."
+        "Current workflow phase: SETTING, WAITING, or COMMITTING. This is transient process state; completed verifier-key changes are tracked on the smart wallet."
      fieldMeta.state.type:
-        "RISK_PARAMETER"
      critical:
+        true
    }
```

```diff
    contract GovernorRewards (eth:0xA02782CE1bF85f56f8cC7C0E66e61299Ac75c86f) [railgun/GovernorRewards] {
    +++ description: Reward distributor that pulls assets from the Railgun treasury and allocates them to stakers via token voting.
      values.$pastUpgrades.0:
+        ["2023-01-20T05:37:35.000Z","0x2a5967e08e872f7bd998842cbd9224ee81a39ddd16f7f40452fc3ba47c01c783",["eth:0xF035cEBa76C0C1f2c15457775745B1F5DC42CA2c"]]
      values.$pastUpgrades.1:
+        ["2023-01-20T05:40:47.000Z","0x14b883f710dbcdc1be58c03cedc447a7af82c843bfb2259c194eea7aef19d972",["eth:0x3db1c53366Fff57001fF6a9DaaCdA1FCFBaB56A9"]]
      values.$pastUpgrades.2:
+        ["2023-01-20T05:59:59.000Z","0x948534918749a94532adcbc0b5fbf6248e2cdb1ac905c688fc30b8eef649260b",["eth:0xaF51CD5f71Ed88D6d1F65b575f1a8Ce3a78eC42b"]]
      values.$pastUpgrades.3:
+        ["2026-07-18T18:15:47.000Z","0x01b125307242dcb57f77aa1c925ac1b0af56dc29616631336bb15f25fdca1778",["eth:0xaC76eB94703b16e704f76ECFFDADF36b6A53ECDB"]]
      values.$upgradeCount:
-        0
+        4
    }
```

```diff
    contract LegacySweeper (eth:0xa353bC0454931Ac46fd90c8EF27f908Ab9E34686) [railgun/SweeperLegacy] {
    +++ description: Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver.
      values.$pastUpgrades.0:
+        ["2022-09-10T00:32:00.000Z","0x1413ff21c2423fcb8cf10812ada82f33fe76a34f18368277ce5f1cd51e5750a5",["eth:0x27d30E803A0EC079DAA3A2e6c3590Cca9f63C9D8"]]
      values.$pastUpgrades.1:
+        ["2022-12-02T04:09:35.000Z","0xa61b7db4ff3ca6d8a4b44f396b019ee3bea1f9a8616ef8a35d0511bf03c2b7e1",["eth:0x9b1310BdCC19D172D0092240e33209a9156c8EE2"]]
      values.$upgradeCount:
-        0
+        2
    }
```

```diff
    contract Delegator (eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B) [railgun/Delegator] {
    +++ description: Permission router proxy owned by Railgun governance.
+++ description: Internal permission map restricted to critical Railgun targets and wildcard permissions.
      values.$criticalDelegatedPermissionsRaw:
+        {"eth:0x0219B4C1ADcEC8f4206b528832F66aB76766873D":[],"eth:0x17cF6Db98B05a0329c983f3a3b45d37d9cf1De86":[],"eth:0xCC29DBF69896278a0C6B886Ef8Cc30A56fA6164a":[],"eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46":[{"contractAddress":"eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9","selector":"0x2ec0f359"}],"eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598":[{"contractAddress":"eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9","selector":"0x2ec0f359"}]}
+++ description: Active delegated permissions targeting a critical Railgun contract, including wildcard permissions.
+++ severity: HIGH
      values.criticalDelegatedPermissions:
+        [["eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46",[{"contractAddress":"eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9","selector":"0x2ec0f359"}]],["eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598",[{"contractAddress":"eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9","selector":"0x2ec0f359"}]]]
      fieldMeta.$delegatedPermissionsRaw.severity:
-        "HIGH"
      fieldMeta.delegatedPermissions.severity:
-        "HIGH"
      fieldMeta.delegatedCallers.severity:
-        "HIGH"
      fieldMeta.verificationKeyDelegates.severity:
-        "HIGH"
      fieldMeta.$criticalDelegatedPermissionsRaw:
+        {"description":"Internal permission map restricted to critical Railgun targets and wildcard permissions.","type":"PERMISSION"}
      fieldMeta.criticalDelegatedPermissions:
+        {"severity":"HIGH","description":"Active delegated permissions targeting a critical Railgun contract, including wildcard permissions.","type":"PERMISSION"}
      critical:
+        true
    }
```

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator.
      fieldMeta.proposalCount.severity:
-        "HIGH"
      fieldMeta.proposalCount.description:
+        "Number of governance proposals published. Proposals are updates, but do not change the system until executed."
      critical:
+        true
    }
```

```diff
    contract Rail Token (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D) [railgun/RailToken] {
    +++ description: RAIL governance token contract with a capped (100,000,000 RAIL total supply) mint schedule and an early anti-bot transfer override.
      critical:
+        true
    }
```

```diff
    contract Treasury (eth:0xE8A8B458BcD1Ececc6b6b58F80929b29cCecFF40) [railgun/Treasury] {
    +++ description: Collects Railgun fees. Managed through access control roles.
      values.$pastUpgrades.0:
+        ["2022-07-14T05:21:05.000Z","0x271cb0bfab8dfeeda44381b22e6f93adc955002d387a96c0f8cd5719fb6a9504",["eth:0xA092c7577354EA82a6c7e55B423c3DD80f0dF255"]]
      values.$upgradeCount:
-        0
+        1
    }
```

```diff
    contract Staking (eth:0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20) [railgun/Staking] {
    +++ description: RAIL staking contract that tracks delegated voting power, enforces a 1mo unstake delay, and snapshots staking balances for governance every 1d. Its parameters define the governance voting system.
      critical:
+        true
    }
```

```diff
    contract RailgunSmartWallet (eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9) [railgun/RailgunSmartWallet] {
    +++ description: Main system contract and escrow that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree.
      values.$pastUpgrades.0:
+        ["2022-05-08T18:32:52.000Z","0x2bd98cd135e2eaf7b7239bb4951a043f655629b5d0f0ca12334ce05718512361",["eth:0xBCFA4De73afb071C9FF18a20A22F818e657C541a"]]
      values.$pastUpgrades.1:
+        ["2022-11-29T16:10:23.000Z","0xab0625746a64ed88fd040a39bdbe9ed930328d9b09245b36cd1d9a64444dad95",["eth:0x321617E18bE9EC7CFE5ab8856DE2aAbAA478E13B"]]
      values.$pastUpgrades.2:
+        ["2023-03-09T11:09:47.000Z","0xe001ac69697083957933db13ff27c56769ce8826d4ab676b3965d7a44b9f0668",["eth:0xc0BEF2D373A1EfaDE8B952f33c1370E486f209Cc"]]
      values.$pastUpgrades.3:
+        ["2025-07-28T15:48:23.000Z","0xfc6cda4a6e9b8e2d055a50212551e6daa8ec180ad7aced11d00ae71e1d0eab6e",["eth:0xB4F2d77bD12c6b548Ae398244d7FAD4ABCE4D89b"]]
      values.$pastUpgrades.4:
+        ["2026-08-14T13:50:35.000Z","0x7ac142845ccd9f156d992099a7ca8d6cb52655f4153cc49c48c38c8966a6b3ad",["eth:0xD662C4B1F22AcEb0BEaCdf3A493De6f478686A0C"]]
      values.$upgradeCount:
-        0
+        5
+++ description: Number of token blocklist additions, including additions later reverted.
+++ severity: MEDIUM
      values.blocklistAdditionCount:
+        0
+++ description: Number of token blocklist removals, including removals later reverted.
+++ severity: MEDIUM
      values.blocklistRemovalCount:
+        0
+++ description: Number of fee schedule changes, including changes later reverted.
+++ severity: HIGH
      values.feeChangeCount:
+        1
+++ description: Number of logic ownership transfers, including changes later reverted.
+++ severity: HIGH
      values.logicOwnershipChangeCount:
+        2
+++ description: Whether the smart wallet proxy currently blocks all calls to its implementation.
+++ severity: MEDIUM
      values.paused:
+        0
+++ description: Number of proxy ownership transfers, including changes later reverted.
+++ severity: HIGH
      values.proxyOwnershipChangeCount:
+        0
+++ description: Number of times the proxy has been paused.
+++ severity: MEDIUM
      values.proxyPauseCount:
+        0
+++ description: Number of times the proxy has been unpaused.
+++ severity: MEDIUM
      values.proxyUnpauseCount:
+        1
+++ description: Number of SNARK verification key changes, including keys later replaced or restored.
+++ severity: HIGH
      values.verificationKeyChangeCount:
+        150
      fieldMeta.treasury.severity:
-        "HIGH"
      fieldMeta.treasury.description:
-        "Treasury contract that receives shield and unshield fees."
+        "Treasury contract that receives shield and unshield fees. Changing the recipient does not change the fees charged to users."
      fieldMeta.tokenBlocklist.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.paused:
+        {"severity":"MEDIUM","description":"Whether the smart wallet proxy currently blocks all calls to its implementation."}
      fieldMeta.proxyOwnershipChangeCount:
+        {"severity":"HIGH","description":"Number of proxy ownership transfers, including changes later reverted."}
      fieldMeta.proxyPauseCount:
+        {"severity":"MEDIUM","description":"Number of times the proxy has been paused."}
      fieldMeta.proxyUnpauseCount:
+        {"severity":"MEDIUM","description":"Number of times the proxy has been unpaused."}
      fieldMeta.logicOwnershipChangeCount:
+        {"severity":"HIGH","description":"Number of logic ownership transfers, including changes later reverted."}
      fieldMeta.feeChangeCount:
+        {"severity":"HIGH","description":"Number of fee schedule changes, including changes later reverted."}
      fieldMeta.blocklistAdditionCount:
+        {"severity":"MEDIUM","description":"Number of token blocklist additions, including additions later reverted."}
      fieldMeta.blocklistRemovalCount:
+        {"severity":"MEDIUM","description":"Number of token blocklist removals, including removals later reverted."}
      fieldMeta.verificationKeyChangeCount:
+        {"severity":"HIGH","description":"Number of SNARK verification key changes, including keys later replaced or restored."}
      critical:
+        true
    }
```

Generated with discovered.json: 0xeb92c7221649da73ad67ce15309d6353e63c36f9

# Diff at Fri, 21 Aug 2026 11:19:42 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@97be884924a799765834458d955d84040bed3cfb block: 1787147547
- current timestamp: 1787311119

## Description

New proposal on Railgun DAO: "Base deployment of RAILGUN Privacy System". 

Onchain execution of this proposal sends tasks to OPStackSender contract: https://tools.l2beat.com/decoder-new/?hash=0xfd5860b22fad6d5bf81cd4e9c809b2016ed08971b0fbf96aaf033fdbf87b52ec&data=AwA. These tasks initialize verification keys for all railgun circuits on the main Railgun contract on Base (`base:0x0047d1F97674614189E80566575FB615788AcF25`).

Railgun smart contracts on Base are already deployed, with bytecode matching the deployment on Ethereum.

The proposal doesn't look malicious.

## Watched changes

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator.
+++ severity: HIGH
      values.proposalCount:
-        27
+        28
    }
```

Generated with discovered.json: 0xcd88c164b465017734a52e9426c4a394593da472

# Diff at Wed, 19 Aug 2026 10:26:56 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@de933fa9a1759053ca93b617a3305b5cd8938884 block: 1786961539
- current timestamp: 1787135135

## Description

New railgun proposal created: https://tools.l2beat.com/decoder-new/?hash=0xb0f02fe28a805756fbd58c90a0704c26be69882460b1bd8885ca9fe93dd77718&data=AwA. It sweeps most tokens from railgun treasury (excluding WETH, RAIL which have most value) to 0xA4f2eA0a81179362558eBC1d2Bc817c9a0134ee3. Also triggers an action on arbitrum deployment.

IPFS-published proposal description: "This proposal will gather tokens that are not part of the biweekly security staker rewards and use them to issue a research grant. The previous research funding ended earlier this year, so this would be a new and separate funding. All slightly significant tokens on Arbitrum will be collected. Most tokens not related to RAIL Security Rewards on Ethereum treasury will be collected.\n\nThe sum for this will be to fund the further development on the following (but not limited to): \n\n- RAILGUN-reloaded SDK, \n- RAILGUN v3,\n- Hardware Support \n- Post-Quantum Research \n- Multisig Support \n- and incentivise researchers and ecosystem.\n\nPlease do your own security review & vote YES to support this grant."

Looks legit.

## Watched changes

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator.
+++ severity: HIGH
      values.proposalCount:
-        26
+        27
    }
```

Generated with discovered.json: 0x684ef9c4e26669601d84b8db86cababa1e76c968

# Diff at Mon, 17 Aug 2026 10:15:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9b7337c108d300967ecea6d6606607859d1de669 block: 1785404669
- current timestamp: 1786961539

## Description

The RailgunSmartWallet implementation upgrade proposed and reviewed in the entry below (2026-07-30) has now been executed by governance. The new implementation (https://disco.l2beat.com/diff/eth:0xB4F2d77bD12c6b548Ae398244d7FAD4ABCE4D89b/eth:0xd662c4b1f22aceb0beacdf3a493de6f478686a0c):

- adds an `Action` event (caller + per-transaction nullifier/commitment counts, unshield flag, and boundParamsHash) emitted in `shield()` and `transact()` as an anchoring point for wallets/indexers to decode batched and nested Railgun transactions,
- changes `Verifier.verify()` and `validateTransaction()` return signatures to also return the boundParamsHash for the new event (validation logic unchanged),
- moves the token blocklist check from `validateCommitmentPreimage()` (now pure) directly into `shield()` (same effective behavior: blocked tokens still cannot be shielded).

No permission, fee, or escrow logic changes.

## Watched changes

```diff
    contract RailgunSmartWallet (eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9) [railgun/RailgunSmartWallet] {
    +++ description: Main system contract and escrow that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree.
      sourceHashes.1:
-        "0x0ad85e59396caf20dd30307894a735a097dbd0d914bc1851af97c04cc874ad3b"
+        "0xb6d8961a0f486e51d0c52fe1292f627928dba2087f6e643379207033c0966965"
+++ description: Current Railgun smart wallet implementation.
+++ severity: HIGH
      values.$implementation:
-        "eth:0xB4F2d77bD12c6b548Ae398244d7FAD4ABCE4D89b"
+        "eth:0xD662C4B1F22AcEb0BEaCdf3A493De6f478686A0C"
      implementationNames.eth:0xB4F2d77bD12c6b548Ae398244d7FAD4ABCE4D89b:
-        "RailgunSmartWallet"
      implementationNames.eth:0xD662C4B1F22AcEb0BEaCdf3A493De6f478686A0C:
+        "RailgunSmartWallet"
    }
```

## Source code changes

```diff
.../RailgunSmartWallet/RailgunSmartWallet.sol      | 132 +++++++++++++++++----
 1 file changed, 109 insertions(+), 23 deletions(-)
```

Generated with discovered.json: 0xdc5ee3658590f256c693fe0f1a3df0ef79d5592f

# Diff at Thu, 30 Jul 2026 15:18:34 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@66fa629d20cb3eebcd8a566401e5b4f335fafdf2 block: 1785404669
- current timestamp: 1785404669

## Description

Added RAIL balances to gov staking and the treasury.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785404669 (main branch discovery), not current.

```diff
    contract Treasury (eth:0xE8A8B458BcD1Ececc6b6b58F80929b29cCecFF40) [railgun/Treasury] {
    +++ description: Collects Railgun fees. Managed through access control roles.
      fieldMeta.RAILBalance:
+        {"description":"RAIL held by the treasury, movable by holders of TRANSFER_ROLE."}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract Staking (eth:0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20) [railgun/Staking] {
    +++ description: RAIL staking contract that tracks delegated voting power, enforces a 1mo unstake delay, and snapshots staking balances for governance every 1d. Its parameters define the governance voting system.
      fieldMeta.RAILStaked:
+        {"description":"Total RAIL locked in this contract by governance participants for voting power."}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

Generated with discovered.json: 0x2460028db8f0cf211ea30dd957fd769161b141b2

# Diff at Thu, 30 Jul 2026 10:47:38 GMT:

- author: Sergey Shemyakov (<serge.shemyakov@l2beat.com>)
- comparing to: main@4e9103e71c52f25da344c761254bcc489fdd6f5a block: 1784543269
- current timestamp: 1785404669

## Description

New railgun proposal created. It is evaluated as not malicious. The trx: https://tools.l2beat.com/decoder-new/?hash=0x818c219e6081d0b650f6be93fb19e1829c154c299f2dae0c7e2f6a6dcd3f2a71&data=AwA.
Proposed upgrade of the main Railgun contract: https://disco.l2beat.com/diff/eth:0xB4F2d77bD12c6b548Ae398244d7FAD4ABCE4D89b/eth:0xd662c4b1f22aceb0beacdf3a493de6f478686a0c.

Changes:
- Added Action event that has overview of trxs in the action. This event is now emitted in transact()
- verify() and validateTransaction() now also return hashBoundParams to be included in the new event
- minor refactoring.

Proposal also executes task 6 on Arbitrum Executor, which is this one: https://tools.l2beat.com/decoder-new/?hash=0xa2403ae37d69e9b92b5934bfb13779176d8484402b211ed8f55cd3d415ef0d66&data=AwA. It makes the same railgun contract upgrade on Arbitrum.

The newly deployed railgun contracts have poseidon hash libraries not verified, it is confirmed that the EVM byte code of these libraries is equivalent to the previous deployment (no vulnerabilities introduced) on Ethereum and Arbitrum.

## Watched changes

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator.
+++ severity: HIGH
      values.proposalCount:
-        25
+        26
    }
```

Generated with discovered.json: 0xfe1fbfd0e53c5757dbaa3477468a5f1704eb7f16

# Diff at Mon, 20 Jul 2026 10:53:56 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@7377ac7e3e345e802eb1ede5f0ed37baf517c024 block: 1779461009
- current timestamp: 1784543269

## Description

Executed a railgun proposal. It:

- Upgraded Governor rewards (https://disco.l2beat.com/diff/eth:0xaF51CD5f71Ed88D6d1F65b575f1a8Ce3a78eC42b/eth:0xaC76eB94703b16e704f76ECFFDADF36b6A53ECDB). Diff mostly a solidity & lib version upgrades + minimal refactoring around changing interval BP parameter.
- Minted 2.5M RAIL (currently ~$4M) for Treasury (staker rewards).
- Increased staker rewards from 200 bp of treasury per 2 weeks to 420 bp of treasury (4.2%).

## Watched changes

```diff
    contract GovernorRewards (eth:0xA02782CE1bF85f56f8cC7C0E66e61299Ac75c86f) [railgun/GovernorRewards] {
    +++ description: Reward distributor that pulls assets from the Railgun treasury and allocates them to stakers via token voting.
      sourceHashes.1:
-        "0x9bf4e7d842e397338e0191cf08fc9478cf3988db823baa64976da77c103fab0d"
+        "0xfe182358adbab091fd4af273d3cd98fe8b507eeb8a230e1b538a26a612d68ee9"
+++ description: Current GovernorRewards implementation.
+++ severity: HIGH
      values.$implementation:
-        "eth:0xaF51CD5f71Ed88D6d1F65b575f1a8Ce3a78eC42b"
+        "eth:0xaC76eB94703b16e704f76ECFFDADF36b6A53ECDB"
+++ description: Basis points of treasury balance earmarked for rewards on each distribution interval.
+++ severity: HIGH
      values.intervalBP:
-        200
+        420
      implementationNames.eth:0xaF51CD5f71Ed88D6d1F65b575f1a8Ce3a78eC42b:
-        "GovernorRewards"
      implementationNames.eth:0xaC76eB94703b16e704f76ECFFDADF36b6A53ECDB:
+        "GovernorRewards"
    }
```

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator.
+++ severity: HIGH
      values.proposalCount:
-        23
+        25
    }
```

```diff
    contract Rail Token (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D) [railgun/RailToken] {
    +++ description: RAIL governance token contract with a capped (100,000,000 RAIL total supply) mint schedule and an early anti-bot transfer override.
+++ description: Current minted RAIL supply.
      values.totalSupply:
-        "57500000000000000000000000"
+        "60000000000000000000000000"
    }
```

## Source code changes

```diff
.../GovernorRewards/GovernorRewards.sol            | 409 +++++++++++++++------
 1 file changed, 300 insertions(+), 109 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779461009 (main branch discovery), not current.

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator.
+++ severity: HIGH
      values.proposalCount:
+        23
      fieldMeta.proposalCount:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xbb96a58a3d0b2d62bd32d028f307ee079b77c450

# Diff at Fri, 12 Jun 2026 10:19:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a183e6009109d4e62087499f44eca4aceea9086 block: 1779461009
- current timestamp: 1779461009

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779461009 (main branch discovery), not current.

```diff
    EOA  (eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624) {
    +++ description: None
      eoaWithUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x9a62af265633fda4fca4560ad7cdfb7fb5a9f3e4

# Diff at Mon, 25 May 2026 09:49:42 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@639891c3b013ffc79bd0575fa15360dd2e0e6ae1 block: 1779378858
- current timestamp: 1779461009

## Description

config: description edits.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779378858 (main branch discovery), not current.

```diff
    contract IntervalPayouts (eth:0x29905A43aA3865D0D7F2743dDE63754B4aa9CA11) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due.
      description:
-        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule."
+        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due."
+++ description: Amount transferred on each successful payout.
+++ severity: HIGH
      values.amount:
-        "1850000000000000000000000"
+        "1,850,000"
      category.name:
-        "Governance"
+        "External Bridges"
      category.priority:
-        3
+        1
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract GovernorRewardsSweeper (eth:0x2eCa05b128bF5cbd5A73CC4BB625B51131FF119B) [railgun/Sweeper] {
    +++ description: Helper that forwards all ETH or ERC20 balances it holds to a fixed receiver.
      description:
-        "Upgradeable helper that forwards all ETH or ERC20 balances it holds to a fixed receiver. If you trust this contract, you trust its proxy admin to upgrade, pause, or retarget the sweep behavior."
+        "Helper that forwards all ETH or ERC20 balances it holds to a fixed receiver."
      category.name:
-        "Governance"
+        "External Bridges"
      category.priority:
-        3
+        1
    }
```

```diff
    contract VerificationKeySetter_64DA (eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, if Railgun governance switches the contract into COMMITTING state, can register the new keys in the Railgun smart wallet verifier.
      description:
-        "Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase."
+        "Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, if Railgun governance switches the contract into COMMITTING state, can register the new keys in the Railgun smart wallet verifier."
    }
```

```diff
    contract IntervalPayouts (eth:0x7673e2E62435D25EDBcb58fD0d88c4C95806b10F) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due.
      description:
-        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule."
+        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due."
+++ description: Amount transferred on each successful payout.
+++ severity: HIGH
      values.amount:
-        "75000000000000000000000"
+        "75,000"
      category.name:
-        "Governance"
+        "External Bridges"
      category.priority:
-        3
+        1
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract IntervalPayouts (eth:0x859E0C1790b8a721F4943742603cDB685A73BA5D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due.
      description:
-        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule."
+        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due."
+++ description: Amount transferred on each successful payout.
+++ severity: HIGH
      values.amount:
-        "925000000000000000000000"
+        "925,000"
      category.name:
-        "Governance"
+        "External Bridges"
      category.priority:
-        3
+        1
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract VerificationKeySetter_9086 (eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, if Railgun governance switches the contract into COMMITTING state, can register the new keys in the Railgun smart wallet verifier.
      description:
-        "Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase."
+        "Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, if Railgun governance switches the contract into COMMITTING state, can register the new keys in the Railgun smart wallet verifier."
    }
```

```diff
    contract GovernorRewards (eth:0xA02782CE1bF85f56f8cC7C0E66e61299Ac75c86f) [railgun/GovernorRewards] {
    +++ description: Reward distributor that pulls assets from the Railgun treasury and allocates them to stakers via token voting.
      description:
-        "Upgradeable reward distributor that pulls assets from the Railgun treasury and allocates them to stakers using snapshot voting power. If you trust this contract, you trust its owner to set reward parameters and tracked assets, and its proxy admin to pause or upgrade the logic."
+        "Reward distributor that pulls assets from the Railgun treasury and allocates them to stakers via token voting."
    }
```

```diff
    contract LegacySweeper (eth:0xa353bC0454931Ac46fd90c8EF27f908Ab9E34686) [railgun/SweeperLegacy] {
    +++ description: Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver.
      description:
-        "Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver, but this specific deployment does not expose the receiver getter cleanly through discovery."
+        "Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver."
    }
```

```diff
    contract IntervalPayouts (eth:0xa863262Bf5E97e8CFeC47a71402aC360C0983060) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due.
      description:
-        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule."
+        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due."
+++ description: Amount transferred on each successful payout.
+++ severity: HIGH
      values.amount:
-        "100000000000000000000000"
+        "100,000"
      category.name:
-        "Governance"
+        "External Bridges"
      category.priority:
-        3
+        1
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract Delegator (eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B) [railgun/Delegator] {
    +++ description: Permission router proxy owned by Railgun governance.
      description:
-        "Permission router owned by Railgun governance. If you trust this contract, you trust its owner and any currently delegated callers to execute privileged calls through it on connected Railgun components."
+        "Permission router proxy owned by Railgun governance."
    }
```

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator.
      description:
-        "Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator; if you trust this contract, you trust RAIL voting power governed by these rules to change connected Railgun components."
+        "Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator."
    }
```

```diff
    contract IntervalPayouts (eth:0xCA9A2894e814305fAfc2BA83a70B34295b1DdE9D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due.
      description:
-        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule."
+        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due."
+++ description: Amount transferred on each successful payout.
+++ severity: HIGH
      values.amount:
-        "200000000000000000000000"
+        "200,000"
      category.name:
-        "Governance"
+        "External Bridges"
      category.priority:
-        3
+        1
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract Rail Token (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D) [railgun/RailToken] {
    +++ description: RAIL governance token contract with a capped (100,000,000 RAIL total supply) mint schedule and an early anti-bot transfer override.
      description:
-        "RAIL governance token contract with a capped mint schedule and an early anti-bot transfer override. If you trust this contract, you trust its owner to mint additional RAIL up to the hard cap."
+        "RAIL governance token contract with a capped (100,000,000 RAIL total supply) mint schedule and an early anti-bot transfer override."
+++ description: Hard cap on total RAIL supply.
      values.cap:
-        "100000000000000000000000000"
+        "100,000,000"
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract Treasury (eth:0xE8A8B458BcD1Ececc6b6b58F80929b29cCecFF40) [railgun/Treasury] {
    +++ description: Collects Railgun fees. Managed through access control roles.
      description:
-        "Upgradeable treasury that collects Railgun fees, and can release ETH or ERC20s only to current TRANSFER_ROLE members. If you trust this contract, you trust its role admins to decide who can move treasury assets and its proxy admin to change the treasury logic."
+        "Collects Railgun fees. Managed through access control roles."
    }
```

```diff
    contract Getters (eth:0xe90275239D734899e8D94646139213F6F97bEB0E) [railgun/Getters] {
    +++ description: Read-only helper contract that batches governance snapshot and reward-view calls.
      description:
-        "Read-only helper contract that batches governance snapshot and reward-view calls. It does not custody funds or hold privileged roles."
+        "Read-only helper contract that batches governance snapshot and reward-view calls."
      category.name:
-        "Shared Infrastructure"
+        "External Bridges"
      category.priority:
-        4
+        1
    }
```

```diff
    contract Staking (eth:0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20) [railgun/Staking] {
    +++ description: RAIL staking contract that tracks delegated voting power, enforces a 1mo unstake delay, and snapshots staking balances for governance every 1d. Its parameters define the governance voting system.
      description:
-        "Immutable RAIL staking contract that tracks delegated voting power, enforces a 30-day unstake delay, and snapshots balances for governance. It has no admin, but its parameters define the governance system's voting power."
+        "RAIL staking contract that tracks delegated voting power, enforces a 1mo unstake delay, and snapshots staking balances for governance every 1d. Its parameters define the governance voting system."
      values.SNAPSHOT_INTERVAL_fmt:
+        "1d"
      values.STAKE_LOCKTIME_fmt:
+        "1mo"
    }
```

```diff
    contract IntervalPayouts (eth:0xf5F9d74FbFd04801DFf83425ff6C2002f60B921A) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due.
      description:
-        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule."
+        "Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due."
+++ description: Amount transferred on each successful payout.
+++ severity: HIGH
      values.amount:
-        "150000000000000000000000"
+        "150,000"
      category.name:
-        "Governance"
+        "External Bridges"
      category.priority:
-        3
+        1
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

```diff
    contract RailgunSmartWallet (eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9) [railgun/RailgunSmartWallet] {
    +++ description: Main system contract and escrow that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree.
      description:
-        "Upgradeable privacy pool contract that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree. If you trust this contract, you trust its owner to change fees, treasury routing, token compatibility, and SNARK safety vectors, and its proxy admin to pause or upgrade the logic."
+        "Main system contract and escrow that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree."
    }
```

Generated with discovered.json: 0x15acd29418ae7a1d5bd784a1f997519dcdbc04d2

# Diff at Thu, 21 May 2026 16:01:07 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@b3061d13527867199a7f8470f738f778234b8a4e block: 1777550988
- current timestamp: 1779378858

## Description

Added Relay adapter to discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777550988 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract RelayAdapt (eth:0xAc9f360Ae85469B27aEDdEaFC579Ef2d052aD405) [railgun/RelayAdapt]
    +++ description: Execution adapter contract for Railgun. To interact with public contracts from shielded pools, tokens are unshielded to RelayAdapter, which performs specified calls and shields tokens back to the same user.
```

Generated with discovered.json: 0xf4cf0474e43de803742779a2e4f647f18a803f53

# Diff at Thu, 21 May 2026 07:19:18 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@81af7a0da7d0a301e5b9686bebf53af2984b37b1 block: 1777550988
- current timestamp: 1777550988

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777550988 (main branch discovery), not current.

```diff
    contract Rail Token (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D) [railgun/RailToken] {
    +++ description: RAIL governance token contract with a capped mint schedule and an early anti-bot transfer override. If you trust this contract, you trust its owner to mint additional RAIL up to the hard cap.
      name:
-        "RailToken"
+        "Rail Token"
    }
```

Generated with discovered.json: 0x9d896aa554475323e31765e93cfd52a7fac2fb11

# Diff at Thu, 14 May 2026 07:39:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fda6b248112f1ba028bea437a3e980acbfd8741 block: 1777550988
- current timestamp: 1777550988

## Description

config: clean up some and remove 'act' permission from vkeysetter.owner.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777550988 (main branch discovery), not current.

```diff
    contract IntervalPayouts (eth:0x29905A43aA3865D0D7F2743dDE63754B4aa9CA11) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Ae8AStreamPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0x5a02474A3083Bc969f20F92E7a8bd3824EC607f0) {
    +++ description: None
      name:
-        "PayoutBeneficiary_5a02"
    }
```

```diff
    contract IntervalPayouts (eth:0x7673e2E62435D25EDBcb58fD0d88c4C95806b10F) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Beneficiary5a02OneOffPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624) {
    +++ description: None
      name:
-        "SweeperProxyOwner"
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B","description":"update the Railgun smart wallet SNARK verifying keys through the Delegator.","role":".verificationKeyDelegates","via":[{"address":"eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46","role":".owner"}]
    }
```

```diff
    contract IntervalPayouts (eth:0x859E0C1790b8a721F4943742603cDB685A73BA5D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Ae8AOneOffPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0xA4f2eA0a81179362558eBC1d2Bc817c9a0134ee3) {
    +++ description: None
      name:
-        "PayoutBeneficiary_A4f2"
    }
```

```diff
    contract IntervalPayouts (eth:0xa863262Bf5E97e8CFeC47a71402aC360C0983060) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "A4f2OneOffPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0xaE8A17EB859E024cF6B541802B08932B2268dcEe) {
    +++ description: None
      name:
-        "PayoutBeneficiary_Ae8A"
    }
```

```diff
    EOA  (eth:0xbbc2fB58643235AFfBF1f0CDd27Bc6E6CFBBa4e2) {
    +++ description: None
      name:
-        "VKeySetterOwner_bbc2"
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B","description":"update the Railgun smart wallet SNARK verifying keys through the Delegator.","role":".verificationKeyDelegates","via":[{"address":"eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598","role":".owner"}]
    }
```

```diff
    contract IntervalPayouts (eth:0xCA9A2894e814305fAfc2BA83a70B34295b1DdE9D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "A4f2StreamPayout"
+        "IntervalPayouts"
    }
```

```diff
    contract IntervalPayouts (eth:0xf5F9d74FbFd04801DFf83425ff6C2002f60B921A) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Beneficiary5a02StreamPayout"
+        "IntervalPayouts"
    }
```

Generated with discovered.json: 0x42a7033d1f9a3d7fe186bfb5dbb3ffa7136224b0

# Diff at Fri, 08 May 2026 08:36:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@66656ed8f737863b593f2b6759c08b24d56e9571 block: 1777550988
- current timestamp: 1777550988

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777550988 (main branch discovery), not current.

```diff
    contract Ae8AStreamPayout (eth:0x29905A43aA3865D0D7F2743dDE63754B4aa9CA11) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract GovernorRewardsSweeper (eth:0x2eCa05b128bF5cbd5A73CC4BB625B51131FF119B) [railgun/Sweeper] {
    +++ description: Upgradeable helper that forwards all ETH or ERC20 balances it holds to a fixed receiver. If you trust this contract, you trust its proxy admin to upgrade, pause, or retarget the sweep behavior.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract ProxyAdmin (eth:0x4F8E20f55f879beE7Bc010Bd6bD2138B34aC65c8) [railgun/ProxyAdmin] {
    +++ description: Admin interface for Railgun's pausable upgradeable proxies. It does not hold funds, but its controller can operate every proxy attached to it.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract VerificationKeySetter_64DA (eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
      sourceHashes.0:
-        "0x97c32fbfee382b7fe3932651160b482c01c51e25cee46e8e174218dadd7bcae8"
+        "0x9be46f47e8f61b9d373f7d991c68bc9d68a40d875ddb9da58563121fdeb69a85"
      deployerAddress:
+        "eth:0xbbc2fB58643235AFfBF1f0CDd27Bc6E6CFBBa4e2"
    }
```

```diff
    contract Beneficiary5a02OneOffPayout (eth:0x7673e2E62435D25EDBcb58fD0d88c4C95806b10F) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract Ae8AOneOffPayout (eth:0x859E0C1790b8a721F4943742603cDB685A73BA5D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract VerificationKeySetter_9086 (eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
      sourceHashes.0:
-        "0x4c94632d11362a5297c31f6eba9f37322caadd6a88247c9032529d66ebd04cdf"
+        "0x302a2769069056aa8c4a9be3ba0d53d9d831149d84f14b7650cc2ff13729d27f"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract GovernorRewards (eth:0xA02782CE1bF85f56f8cC7C0E66e61299Ac75c86f) [railgun/GovernorRewards] {
    +++ description: Upgradeable reward distributor that pulls assets from the Railgun treasury and allocates them to stakers using snapshot voting power. If you trust this contract, you trust its owner to set reward parameters and tracked assets, and its proxy admin to pause or upgrade the logic.
      sourceHashes.0:
-        "0xef8b7ca35114debbd8f7c5998a55ca9dd61bbd558bf6987cbfcf5ea97e3af83a"
+        "0x6719d1d65fb919b52e894f249bcbbde8d2fddde75de20893e50e1b96ec608f06"
      sourceHashes.1:
-        "0xd1b675b1a03700c03440f776180470c3a967a7ef2e7cbe7a6f2cb9d75c4ea8ad"
+        "0x9bf4e7d842e397338e0191cf08fc9478cf3988db823baa64976da77c103fab0d"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract LegacySweeper (eth:0xa353bC0454931Ac46fd90c8EF27f908Ab9E34686) [railgun/SweeperLegacy] {
    +++ description: Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver, but this specific deployment does not expose the receiver getter cleanly through discovery.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract A4f2OneOffPayout (eth:0xa863262Bf5E97e8CFeC47a71402aC360C0983060) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract Delegator (eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B) [railgun/Delegator] {
    +++ description: Permission router owned by Railgun governance. If you trust this contract, you trust its owner and any currently delegated callers to execute privileged calls through it on connected Railgun components.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator; if you trust this contract, you trust RAIL voting power governed by these rules to change connected Railgun components.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract A4f2StreamPayout (eth:0xCA9A2894e814305fAfc2BA83a70B34295b1DdE9D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract RailToken (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D) [railgun/RailToken] {
    +++ description: RAIL governance token contract with a capped mint schedule and an early anti-bot transfer override. If you trust this contract, you trust its owner to mint additional RAIL up to the hard cap.
      sourceHashes.0:
-        "0xa82346e65e8737f6ecea9914efe8654029b2c87c2af1186d3515a49ce1b9db39"
+        "0xedf311c1a35646cbfb452e13446e64818194f368b2cd56c3bae91b0593f49852"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Treasury (eth:0xE8A8B458BcD1Ececc6b6b58F80929b29cCecFF40) [railgun/Treasury] {
    +++ description: Upgradeable treasury that collects Railgun fees, and can release ETH or ERC20s only to current TRANSFER_ROLE members. If you trust this contract, you trust its role admins to decide who can move treasury assets and its proxy admin to change the treasury logic.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      sourceHashes.1:
-        "0x1e581c91de9e0c3cd50906d9d30663d1b8fe037db6a5a80caf0c20e961d7eb41"
+        "0x38e90021f1f1c6b5378b5a32d25769119a4c3c07b14c2f813eb2b7a6264172cd"
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract Getters (eth:0xe90275239D734899e8D94646139213F6F97bEB0E) [railgun/Getters] {
    +++ description: Read-only helper contract that batches governance snapshot and reward-view calls. It does not custody funds or hold privileged roles.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Staking (eth:0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20) [railgun/Staking] {
    +++ description: Immutable RAIL staking contract that tracks delegated voting power, enforces a 30-day unstake delay, and snapshots balances for governance. It has no admin, but its parameters define the governance system's voting power.
      sourceHashes.0:
-        "0x2bff1afa5e292171f2c6c15a1e62198b014ff5a8b42eedc6ad43ba8a0627787d"
+        "0x12d1c6ff9fbd0f99b457b153c78e8f364a9aad6b9bfed98b2b682b53870cc5e4"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Beneficiary5a02StreamPayout (eth:0xf5F9d74FbFd04801DFf83425ff6C2002f60B921A) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract RailgunSmartWallet (eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9) [railgun/RailgunSmartWallet] {
    +++ description: Upgradeable privacy pool contract that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree. If you trust this contract, you trust its owner to change fees, treasury routing, token compatibility, and SNARK safety vectors, and its proxy admin to pause or upgrade the logic.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      sourceHashes.1:
-        "0xcf70d21ec20aa9f668a3d77681b3214b2b7aab73bc22211bf503612e1be5b813"
+        "0x0ad85e59396caf20dd30307894a735a097dbd0d914bc1851af97c04cc874ad3b"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

Generated with discovered.json: 0x70860e1a5ef98e769e503e1a6cd6651aa8604907

# Diff at Wed, 06 May 2026 10:38:21 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1777550988

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Ae8AStreamPayout (eth:0x29905A43aA3865D0D7F2743dDE63754B4aa9CA11)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract GovernorRewardsSweeper (eth:0x2eCa05b128bF5cbd5A73CC4BB625B51131FF119B)
    +++ description: Upgradeable helper that forwards all ETH or ERC20 balances it holds to a fixed receiver. If you trust this contract, you trust its proxy admin to upgrade, pause, or retarget the sweep behavior.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x4F8E20f55f879beE7Bc010Bd6bD2138B34aC65c8)
    +++ description: Admin interface for Railgun's pausable upgradeable proxies. It does not hold funds, but its controller can operate every proxy attached to it.
```

```diff
+   Status: CREATED
    contract VerificationKeySetter_64DA (eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598)
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
```

```diff
+   Status: CREATED
    contract Beneficiary5a02OneOffPayout (eth:0x7673e2E62435D25EDBcb58fD0d88c4C95806b10F)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract Ae8AOneOffPayout (eth:0x859E0C1790b8a721F4943742603cDB685A73BA5D)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract VerificationKeySetter_9086 (eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46)
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
```

```diff
+   Status: CREATED
    contract GovernorRewards (eth:0xA02782CE1bF85f56f8cC7C0E66e61299Ac75c86f)
    +++ description: Upgradeable reward distributor that pulls assets from the Railgun treasury and allocates them to stakers using snapshot voting power. If you trust this contract, you trust its owner to set reward parameters and tracked assets, and its proxy admin to pause or upgrade the logic.
```

```diff
+   Status: CREATED
    contract LegacySweeper (eth:0xa353bC0454931Ac46fd90c8EF27f908Ab9E34686)
    +++ description: Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver, but this specific deployment does not expose the receiver getter cleanly through discovery.
```

```diff
+   Status: CREATED
    contract A4f2OneOffPayout (eth:0xa863262Bf5E97e8CFeC47a71402aC360C0983060)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract Delegator (eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B)
    +++ description: Permission router owned by Railgun governance. If you trust this contract, you trust its owner and any currently delegated callers to execute privileged calls through it on connected Railgun components.
```

```diff
+   Status: CREATED
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC)
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator; if you trust this contract, you trust RAIL voting power governed by these rules to change connected Railgun components.
```

```diff
+   Status: CREATED
    contract A4f2StreamPayout (eth:0xCA9A2894e814305fAfc2BA83a70B34295b1DdE9D)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract RailToken (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D)
    +++ description: RAIL governance token contract with a capped mint schedule and an early anti-bot transfer override. If you trust this contract, you trust its owner to mint additional RAIL up to the hard cap.
```

```diff
+   Status: CREATED
    contract Treasury (eth:0xE8A8B458BcD1Ececc6b6b58F80929b29cCecFF40)
    +++ description: Upgradeable treasury that collects Railgun fees, and can release ETH or ERC20s only to current TRANSFER_ROLE members. If you trust this contract, you trust its role admins to decide who can move treasury assets and its proxy admin to change the treasury logic.
```

```diff
+   Status: CREATED
    contract Getters (eth:0xe90275239D734899e8D94646139213F6F97bEB0E)
    +++ description: Read-only helper contract that batches governance snapshot and reward-view calls. It does not custody funds or hold privileged roles.
```

```diff
+   Status: CREATED
    contract Staking (eth:0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20)
    +++ description: Immutable RAIL staking contract that tracks delegated voting power, enforces a 30-day unstake delay, and snapshots balances for governance. It has no admin, but its parameters define the governance system's voting power.
```

```diff
+   Status: CREATED
    contract Beneficiary5a02StreamPayout (eth:0xf5F9d74FbFd04801DFf83425ff6C2002f60B921A)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract RailgunSmartWallet (eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9)
    +++ description: Upgradeable privacy pool contract that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree. If you trust this contract, you trust its owner to change fees, treasury routing, token compatibility, and SNARK safety vectors, and its proxy admin to pause or upgrade the logic.
```
