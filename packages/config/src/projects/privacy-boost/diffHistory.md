Generated with discovered.json: 0x75726324912c68f4f0af48def11d20571a9f189b

# Diff at Mon, 07 Sep 2026 08:34:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@25578f132c6c06c4de07ab98ad602d8239829c04 block: 1787302421
- current timestamp: 1788769982

## Description

Feature upgrade: replaces PrivacyBoost/AuthRegistry logic and all three verifiers, adds portal and gift features + verifiers, an external-call gateway, and expands the token registry to 11 assets. Auth snapshots are **removed**. New keys remain unverified because the trusted setup records are not yet published.

external call gateway: whitelisted defi interactions

portal: reusable recipient addresses

gift: claim to a custom address (private or public) using a 'gift note'

AuthRegistry: https://disco.l2beat.com/diff/oeth:0xcCdF755866c708A4a8D0002DC3f1a574226DF38b/oeth:0xA2072F7B4b261F997035f9522648c7c5bAF9370a

TokenRegistry: https://disco.l2beat.com/diff/oeth:0x238e6ec4968c9b00b16293139951c23815Ca1134/oeth:0x86A891632594Ae26834275925Eb4Fde37F1eBb19

AuditGateway: https://disco.l2beat.com/diff/oeth:0xfEfb6bD314680BDbc1B00FE2eA5A038655Bb4478/oeth:0x384D1460107D88b1a21CA202825583c19cb6A808

PrivacyBoost: https://disco.l2beat.com/diff/oeth:0x0b9B98d3B95D74487C481e7830ab440896aE62E5/oeth:0x9CB144D35748932EC44950d0837248fcF8747828

## Watched changes

```diff
    contract AuthRegistry (oeth:0x54e87D7D0E420B24B9FdFE9cFcAe88162093A48f) [privacy-boost/AuthRegistry_v2] {
    +++ description: Registry of PrivacyBoost account authorization keys and onchain spend approvals. Supports BabyJubJub keys authorized by account-owner signatures, approval-only accounts and revocable batches of spend approvals. Tracks current and recently superseded auth roots; forced withdrawals validate live auth records directly.
      template:
-        "privacy-boost/AuthRegistry"
+        "privacy-boost/AuthRegistry_v2"
      sourceHashes.1:
-        "0x6428f3cd5084b5378b6215a3d5732d338b7579e92f92b364ee6f1db1cd9c9f16"
+        "0x53a840fbb8f7f80637b9be2a5f960b7901c110d9a8e08d65befb06d6532b110a"
      description:
-        "Registry of account authorization keys for the PrivacyBoost pool. Accounts register BabyJubJub approval public keys into Merkle trees with EIP-712 owner signatures (submitted directly or through allowed relays), and can rotate or revoke them. PrivacyBoost snapshots the tree roots and epoch proofs validate spend authorization against them."
+        "Registry of PrivacyBoost account authorization keys and onchain spend approvals. Supports BabyJubJub keys authorized by account-owner signatures, approval-only accounts and revocable batches of spend approvals. Tracks current and recently superseded auth roots; forced withdrawals validate live auth records directly."
      values.$implementation:
-        "oeth:0xcCdF755866c708A4a8D0002DC3f1a574226DF38b"
+        "oeth:0xA2072F7B4b261F997035f9522648c7c5bAF9370a"
      values.$pastUpgrades.2:
+        ["2026-09-03T02:33:25.000Z","0xdb489f72d2b3e0cdab34535d416d81f14c6ca3d74d30c68e7f02cb2017fc035c",["oeth:0xA2072F7B4b261F997035f9522648c7c5bAF9370a"]]
      values.$upgradeCount:
-        2
+        3
      values.AUTH_ROOT_HISTORY_SIZE:
-        64
+++ description: External Poseidon2 helper for account IDs, authorization leaves and auth Merkle tree hashing.
+++ severity: HIGH
      values.authPoseidon:
+        "oeth:0x09257a2B24C27586c2Db2C18c4b53bE459c7e870"
+++ description: Maximum lifetime of an onchain spend approval, in seconds.
+++ severity: HIGH
      values.MAX_APPROVAL_LIFETIME:
+        2592000
      fieldMeta.authPoseidon:
+        {"severity":"HIGH","description":"External Poseidon2 helper for account IDs, authorization leaves and auth Merkle tree hashing."}
      fieldMeta.MAX_APPROVAL_LIFETIME:
+        {"severity":"HIGH","description":"Maximum lifetime of an onchain spend approval, in seconds."}
      implementationNames.oeth:0xcCdF755866c708A4a8D0002DC3f1a574226DF38b:
-        "AuthRegistry"
      implementationNames.oeth:0xA2072F7B4b261F997035f9522648c7c5bAF9370a:
+        "AuthRegistry"
    }
```

```diff
    contract AdminMultisig (oeth:0x6476cBeBbce2673aeDAa464a4b9f31FD284aA0dC) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"oeth:0x16e1dE876dEB1C3251A1E923A206605D084F25C5","description":"register and replace the Groth16 verification keys used to validate deposit epoch proofs.","role":".owner"}
      receivedPermissions.1:
+        {"permission":"interact","from":"oeth:0x249ae8887E15e3728187dd4E341a66cb0221B1B4","description":"register and replace the Groth16 verification keys used to validate gift settlement and public gift exit proofs.","role":".owner"}
      receivedPermissions.2:
+        {"permission":"interact","from":"oeth:0x54B576782d3CE325CAc9861E17bB5d7926e41955","description":"set the guardian, install or remove external call policies, pause or unpause the gateway, and sweep stranded tokens back to the pool while paused.","role":".owner"}
      receivedPermissions.4:
+        {"permission":"interact","from":"oeth:0x6806eA551C3c8350Ab156eC5001D28705dCda2B6","description":"register and replace the Groth16 verification keys used to validate portal deposit epoch proofs.","role":".owner"}
      receivedPermissions.1.description:
-        "register and replace the Groth16 verification keys used to validate epoch proofs."
+        "register and replace the Groth16 verification keys used to validate forced withdrawal proofs."
      receivedPermissions.1.from:
-        "oeth:0x67b1bD839203223870fBF51e4CDf2104E3Ca966b"
+        "oeth:0x78ff16aD4D38e560B81A7B33ae06607fe69D6641"
      receivedPermissions.7:
+        {"permission":"interact","from":"oeth:0xab52453B02ca68cfbe7B264d3C4bBa566198C6B6","description":"register and replace the Groth16 verification keys used to validate epoch proofs.","role":".owner"}
      receivedPermissions.4:
-        {"permission":"interact","from":"oeth:0xC829061276e95D11aF92E678DE2B767AcFB4e924","description":"register and replace the Groth16 verification keys used to validate deposit proofs.","role":".owner"}
      receivedPermissions.5:
-        {"permission":"interact","from":"oeth:0xca689828854a422CF1f778be03CA80549408F620","description":"replace the epoch, deposit and forced withdrawal proof verifiers, set the withdrawal fee (up to 10%), and set the treasury and operator addresses.","role":".owner"}
      receivedPermissions.6.description:
-        "register and replace the Groth16 verification keys used to validate forced withdrawal proofs."
+        "replace all five proof verifiers, set withdrawal and portal sweep fees (each up to 10%), set token-specific portal minimum sweeps, and change the treasury, operator and gateway route manager."
      receivedPermissions.6.from:
-        "oeth:0xF023c61C5c745Be40fd30B0d48C0929839Ec3C67"
+        "oeth:0xca689828854a422CF1f778be03CA80549408F620"
    }
```

```diff
-   Status: DELETED
    contract Groth16EpochVerifier (oeth:0x67b1bD839203223870fBF51e4CDf2104E3Ca966b) [privacy-boost/Groth16EpochVerifier]
    +++ description: Groth16 verifier for PrivacyBoost private transfer / withdrawal epoch proofs. Verification keys are stored in SSTORE2 data contracts, keyed by circuit configuration (max transfers, inputs and outputs per transfer). Registered epoch keys are not enumerable on-chain.
```

```diff
    EOA  (oeth:0x6Bd37032571F47e50f312542ae05D548B69DC9B0) {
    +++ description: None
      receivedPermissions.1.description:
-        "submit epochs of private transfers, withdrawals and deposits with validity proofs, and snapshot auth tree roots."
+        "submit private transfer, withdrawal, deposit, portal deposit and gift settlement epochs with validity proofs, and simulate gateway withdrawals."
    }
```

```diff
    contract OperatorMultisig (oeth:0x78a927114A20Fb34b9d8d9c6a9A75E65f918D52B) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"oeth:0x54B576782d3CE325CAc9861E17bB5d7926e41955","description":"pause the gateway and remove external call policies.","role":".guardian"}
      receivedPermissions.2:
+        {"permission":"interact","from":"oeth:0xca689828854a422CF1f778be03CA80549408F620","description":"approve or revoke external gateway routes used by proof-authorized withdrawals.","role":".gatewayRouteManager"}
      receivedPermissions.1.description:
-        "manage the relay allowlist and schedule changes of the auth snapshot interval."
+        "manage the allowlist of relays that submit epochs to the pool."
    }
```

```diff
    contract TokenRegistry (oeth:0x867872f80b1e22D30C4b06FcB474aC10B9DAA2f6) [privacy-boost/TokenRegistry] {
    +++ description: Registry mapping compact token IDs to the ERC-20 tokens accepted by the PrivacyBoost pool.
      values.$implementation:
-        "oeth:0x238e6ec4968c9b00b16293139951c23815Ca1134"
+        "oeth:0x86A891632594Ae26834275925Eb4Fde37F1eBb19"
      values.$pastUpgrades.1:
+        ["2026-09-03T02:33:25.000Z","0xdb489f72d2b3e0cdab34535d416d81f14c6ca3d74d30c68e7f02cb2017fc035c",["oeth:0x86A891632594Ae26834275925Eb4Fde37F1eBb19"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Latest token ID assigned; tokens are registered with IDs 1..nextId.
      values.nextId:
-        4
+        11
+++ description: Registered tokens (token type, token address, sub-id) by token ID.
      values.tokens.4:
+        {"tokenType":0,"tokenAddress":"oeth:0x68f180fcCe6836688e9084f035309E29Bf0A2095","tokenSubId":0}
+++ description: Registered tokens (token type, token address, sub-id) by token ID.
      values.tokens.5:
+        {"tokenType":0,"tokenAddress":"oeth:0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb","tokenSubId":0}
+++ description: Registered tokens (token type, token address, sub-id) by token ID.
      values.tokens.6:
+        {"tokenType":0,"tokenAddress":"oeth:0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db","tokenSubId":0}
+++ description: Registered tokens (token type, token address, sub-id) by token ID.
      values.tokens.7:
+        {"tokenType":0,"tokenAddress":"oeth:0xDCB612005417Dc906fF72c87DF732e5a90D49e11","tokenSubId":0}
+++ description: Registered tokens (token type, token address, sub-id) by token ID.
      values.tokens.8:
+        {"tokenType":0,"tokenAddress":"oeth:0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1","tokenSubId":0}
+++ description: Registered tokens (token type, token address, sub-id) by token ID.
      values.tokens.9:
+        {"tokenType":0,"tokenAddress":"oeth:0xC30ce6A5758786e0F640cC5f881Dd96e9a1C5C59","tokenSubId":0}
+++ description: Registered tokens (token type, token address, sub-id) by token ID.
      values.tokens.10:
+        {"tokenType":0,"tokenAddress":"oeth:0x3d63934715b6D4c4DFbBC1a00Fe2A2145079DD76","tokenSubId":0}
      implementationNames.oeth:0x238e6ec4968c9b00b16293139951c23815Ca1134:
-        "TokenRegistry"
      implementationNames.oeth:0x86A891632594Ae26834275925Eb4Fde37F1eBb19:
+        "TokenRegistry"
    }
```

```diff
    contract AuditGateway (oeth:0xb328535aB3bCe578996AE9af5A7f44f175721118) [privacy-boost/AuditGateway] {
    +++ description: Manages the list of auditors authorized to query private user data through the Audit API of the TEE, and stores an onchain log of every audit access so that users can publicly verify whether and when their private data was disclosed.
      values.$implementation:
-        "oeth:0xfEfb6bD314680BDbc1B00FE2eA5A038655Bb4478"
+        "oeth:0x384D1460107D88b1a21CA202825583c19cb6A808"
      values.$pastUpgrades.1:
+        ["2026-09-03T02:33:25.000Z","0xdb489f72d2b3e0cdab34535d416d81f14c6ca3d74d30c68e7f02cb2017fc035c",["oeth:0x384D1460107D88b1a21CA202825583c19cb6A808"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.oeth:0xfEfb6bD314680BDbc1B00FE2eA5A038655Bb4478:
-        "AuditGateway"
      implementationNames.oeth:0x384D1460107D88b1a21CA202825583c19cb6A808:
+        "AuditGateway"
    }
```

```diff
-   Status: DELETED
    contract Groth16DepositVerifier (oeth:0xC829061276e95D11aF92E678DE2B767AcFB4e924) [privacy-boost/Groth16DepositVerifier]
    +++ description: Groth16 verifier for PrivacyBoost deposit epoch proofs. Verification keys are stored in SSTORE2 data contracts, registered per supported batch size.
```

```diff
    contract PrivacyBoost (oeth:0xca689828854a422CF1f778be03CA80549408F620) [privacy-boost/PrivacyBoost_v2] {
    +++ description: Main contract of the PrivacyBoost pool. Escrows ERC-20 tokens and verifies relay-submitted private transfer, withdrawal, deposit, portal deposit and gift settlement proofs. Supports approved external gateway calls and permissionless exits through delayed forced withdrawals or public gift exits.
      template:
-        "privacy-boost/PrivacyBoost"
+        "privacy-boost/PrivacyBoost_v2"
      sourceHashes.1:
-        "0x0969b8ba50a27e47a32264c554c7bb5f41f38b4371347f61b08d4d8ac55ce613"
+        "0xa93601acbe9c964bab9c061132f2a8b35338b4dfbacee9bf924163d745e04405"
      description:
-        "Main contract of the PrivacyBoost private transfer pool. It escrows registered ERC-20 tokens deposited against note commitments, and lets allowed relays batch private transfers and withdrawals into epochs that are verified with Groth16 proofs against a note Merkle tree. Users can exit without relay cooperation via a delayed forced withdrawal with their own proof."
+        "Main contract of the PrivacyBoost pool. Escrows ERC-20 tokens and verifies relay-submitted private transfer, withdrawal, deposit, portal deposit and gift settlement proofs. Supports approved external gateway calls and permissionless exits through delayed forced withdrawals or public gift exits."
      values.$implementation:
-        "oeth:0x0b9B98d3B95D74487C481e7830ab440896aE62E5"
+        "oeth:0x9CB144D35748932EC44950d0837248fcF8747828"
      values.$pastUpgrades.1:
+        ["2026-09-03T02:33:25.000Z","0xdb489f72d2b3e0cdab34535d416d81f14c6ca3d74d30c68e7f02cb2017fc035c",["oeth:0x9CB144D35748932EC44950d0837248fcF8747828"]]
      values.$upgradeCount:
-        1
+        2
      values.authSnapshotInterval:
-        30
      values.authSnapshotScheduleVersion:
-        0
      values.authSnapshotStartBlock:
-        0
      values.authSnapshotStartRound:
-        0
      values.currentAuthSnapshotInterval:
-        30
+++ description: Groth16 verifier used for deposit epoch proofs.
+++ severity: HIGH
      values.depositVerifier:
-        "oeth:0xC829061276e95D11aF92E678DE2B767AcFB4e924"
+        "oeth:0x16e1dE876dEB1C3251A1E923A206605D084F25C5"
+++ description: Groth16 verifier used for private transfer / withdrawal epoch proofs.
+++ severity: HIGH
      values.epochVerifier:
-        "oeth:0x67b1bD839203223870fBF51e4CDf2104E3Ca966b"
+        "oeth:0xab52453B02ca68cfbe7B264d3C4bBa566198C6B6"
+++ description: Groth16 verifier used for forced withdrawal proofs.
+++ severity: HIGH
      values.forcedVerifier:
-        "oeth:0xF023c61C5c745Be40fd30B0d48C0929839Ec3C67"
+        "oeth:0x78ff16aD4D38e560B81A7B33ae06607fe69D6641"
      values.latestSnapshotRound:
-        5195055
      values.maxForcedInputs:
-        8
+        13
      values.maxOutputsPerTransfer:
-        11
+        201
      values.pendingAuthSnapshotEffectiveBlock:
-        0
      values.pendingAuthSnapshotInterval:
-        0
      values.pendingAuthSnapshotStartRound:
-        0
      values.gatewayRouteManager:
+        "oeth:0x78a927114A20Fb34b9d8d9c6a9A75E65f918D52B"
+++ description: Approved synchronous gateway routes for proof-authorized external calls.
+++ severity: HIGH
      values.gateways:
+        ["oeth:0x54B576782d3CE325CAc9861E17bB5d7926e41955"]
+++ description: Groth16 verifier for private gift settlement and public gift exit proofs.
+++ severity: HIGH
      values.giftClaimVerifier:
+        "oeth:0x249ae8887E15e3728187dd4E341a66cb0221B1B4"
+++ description: Maximum age in blocks of a superseded auth root accepted for epoch and private gift settlement proofs.
+++ severity: HIGH
      values.maxEpochAuthStalenessBlocks:
+        300
+++ description: Maximum age in blocks of a superseded auth root accepted for public gift exits. Despite its legacy name, this does not govern forced withdrawals, which check the live auth record at request time.
+++ severity: HIGH
      values.maxForcedWithdrawalAuthStalenessBlocks:
+        500
+++ description: Groth16 verifier for portal deposit proofs.
+++ severity: HIGH
      values.portalDepositVerifier:
+        "oeth:0x6806eA551C3c8350Ab156eC5001D28705dCda2B6"
+++ description: Minimum gross amount per token ID required for a portal sweep, in token base units; defaults to zero.
      values.portalMinimumSweeps:
+        {"1":200000000000000,"2":"5000000000000000000","3":500000,"4":500000,"5":650,"6":170000000000000,"7":"25000000000000000000","8":400000,"9":"500000000000000000"}
+++ description: Portal sweep fee in basis points, paid to the sweeper and snapshotted when the deposit is requested.
      values.portalSweepFeeBps:
+        0
      fieldMeta.operator:
-        {"severity":"HIGH"}
      fieldMeta.allowedRelays.severity:
-        "HIGH"
      fieldMeta.authRegistry.description:
-        "Registry of account authorization keys whose tree roots are snapshotted and used to validate spend authorization in epoch proofs."
+        "Registry of account authorization keys and spend approvals used to validate spend authorization."
      fieldMeta.treasury.severity:
-        "HIGH"
      fieldMeta.cancelDelay.severity:
+        "HIGH"
      fieldMeta.forcedWithdrawalDelay.severity:
+        "HIGH"
      fieldMeta.authSnapshotInterval:
-        {"description":"Block interval between snapshots of auth tree roots."}
      fieldMeta.gateways:
+        {"severity":"HIGH","description":"Approved synchronous gateway routes for proof-authorized external calls."}
      fieldMeta.portalMinimumSweeps:
+        {"description":"Minimum gross amount per token ID required for a portal sweep, in token base units; defaults to zero."}
      fieldMeta.portalDepositVerifier:
+        {"severity":"HIGH","description":"Groth16 verifier for portal deposit proofs."}
      fieldMeta.giftClaimVerifier:
+        {"severity":"HIGH","description":"Groth16 verifier for private gift settlement and public gift exit proofs."}
      fieldMeta.maxEpochAuthStalenessBlocks:
+        {"severity":"HIGH","description":"Maximum age in blocks of a superseded auth root accepted for epoch and private gift settlement proofs."}
      fieldMeta.maxForcedWithdrawalAuthStalenessBlocks:
+        {"severity":"HIGH","description":"Maximum age in blocks of a superseded auth root accepted for public gift exits. Despite its legacy name, this does not govern forced withdrawals, which check the live auth record at request time."}
      fieldMeta.portalSweepFeeBps:
+        {"description":"Portal sweep fee in basis points, paid to the sweeper and snapshotted when the deposit is requested."}
      implementationNames.oeth:0x0b9B98d3B95D74487C481e7830ab440896aE62E5:
-        "PrivacyBoost"
      implementationNames.oeth:0x9CB144D35748932EC44950d0837248fcF8747828:
+        "PrivacyBoost"
    }
```

```diff
-   Status: DELETED
    contract Groth16ForcedVerifier (oeth:0xF023c61C5c745Be40fd30B0d48C0929839Ec3C67) [privacy-boost/Groth16ForcedVerifier]
    +++ description: Groth16 verifier for PrivacyBoost forced withdrawal proofs, used by the permissionless exit path. Verification keys are stored in SSTORE2 data contracts, registered per supported input count.
```

```diff
+   Status: CREATED
    contract AuthPoseidon (oeth:0x09257a2B24C27586c2Db2C18c4b53bE459c7e870) [privacy-boost/AuthPoseidon]
    +++ description: Poseidon2 hashing helper used by AuthRegistry to compute account IDs, authorization leaves, spend approval commitments and Merkle tree nodes.
```

```diff
+   Status: CREATED
    contract Groth16DepositVerifier (oeth:0x16e1dE876dEB1C3251A1E923A206605D084F25C5) [privacy-boost/Groth16DepositVerifier_v2]
    +++ description: Groth16 verifier for PrivacyBoost deposit epoch proofs. Verification keys are stored in SSTORE2 data contracts.
```

```diff
+   Status: CREATED
    contract Groth16GiftClaimVerifier (oeth:0x249ae8887E15e3728187dd4E341a66cb0221B1B4) [privacy-boost/Groth16GiftClaimVerifier]
    +++ description: Groth16 verifier for PrivacyBoost gift settlement and public gift exit proofs. Verification keys are stored in SSTORE2 data contracts.
```

```diff
+   Status: CREATED
    contract ExternalCallGateway (oeth:0x54B576782d3CE325CAc9861E17bB5d7926e41955) [privacy-boost/ExternalCallGateway]
    +++ description: Gateway executing pool-authorized external calls against an allowlist of target addresses and function selectors, with optional input/output token constraints. Enforces proof-bound settlement receipts and redeposits returned funds into the pool.
```

```diff
+   Status: CREATED
    contract Groth16PortalDepositVerifier (oeth:0x6806eA551C3c8350Ab156eC5001D28705dCda2B6) [privacy-boost/Groth16PortalDepositVerifier]
    +++ description: Groth16 verifier for PrivacyBoost portal deposit epoch proofs. Verification keys are stored in SSTORE2 data contracts.
```

```diff
+   Status: CREATED
    contract Groth16ForcedVerifier (oeth:0x78ff16aD4D38e560B81A7B33ae06607fe69D6641) [privacy-boost/Groth16ForcedVerifier_v2]
    +++ description: Groth16 verifier for PrivacyBoost forced withdrawal proofs. Verification keys are stored in SSTORE2 data contracts.
```

```diff
+   Status: CREATED
    contract Groth16EpochVerifier (oeth:0xab52453B02ca68cfbe7B264d3C4bBa566198C6B6) [privacy-boost/Groth16EpochVerifier_v2]
    +++ description: Groth16 verifier for PrivacyBoost private transfer and withdrawal epochs. Keys are indexed by (max transfers, inputs per transfer, outputs per transfer). The nested key registry is not enumerable and emits no registration events; discovery monitors the reviewed production circuit configurations.
```

## Source code changes

```diff
.../AuditGateway/AuditGateway.sol                  |    37 +
 .../projects/privacy-boost/.flat/AuthPoseidon.sol  |   482 +
 .../AuthRegistry/AuthRegistry.sol                  |  1260 ++-
 .../privacy-boost/.flat/ExternalCallGateway.sol    |  4803 ++++++++
 .../Groth16DepositVerifier.sol                     |     1 +
 .../Groth16EpochVerifier.sol                       |    34 +
 .../Groth16ForcedVerifier.sol                      |     1 +
 .../.flat/Groth16GiftClaimVerifier.sol             |   465 +
 .../.flat/Groth16PortalDepositVerifier.sol         |   451 +
 .../PrivacyBoost/PrivacyBoost.sol                  | 11332 +++++++++++++++----
 10 files changed, 16616 insertions(+), 2250 deletions(-)
```

Generated with discovered.json: 0x665e91319f0483ef0a617dc1706100596f95024f

# Diff at Fri, 21 Aug 2026 08:54:45 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1787302421

## Description

Initial discovery of privacy boost.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenRegistryProxyAdmin (oeth:0x11B75DE42f6107AE4D5C50e4e34af6E34F63C0dd) [global/ProxyAdmin]
    +++ description: Admin contract of the TokenRegistry proxy.
```

```diff
+   Status: CREATED
    contract AuthRegistry (oeth:0x54e87D7D0E420B24B9FdFE9cFcAe88162093A48f) [privacy-boost/AuthRegistry]
    +++ description: Registry of account authorization keys for the PrivacyBoost pool. Accounts register BabyJubJub approval public keys into Merkle trees with EIP-712 owner signatures (submitted directly or through allowed relays), and can rotate or revoke them. PrivacyBoost snapshots the tree roots and epoch proofs validate spend authorization against them.
```

```diff
+   Status: CREATED
    contract AdminMultisig (oeth:0x6476cBeBbce2673aeDAa464a4b9f31FD284aA0dC) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Groth16EpochVerifier (oeth:0x67b1bD839203223870fBF51e4CDf2104E3Ca966b) [privacy-boost/Groth16EpochVerifier]
    +++ description: Groth16 verifier for PrivacyBoost private transfer / withdrawal epoch proofs. Verification keys are stored in SSTORE2 data contracts, keyed by circuit configuration (max transfers, inputs and outputs per transfer). Registered epoch keys are not enumerable on-chain.
```

```diff
+   Status: CREATED
    contract OperatorMultisig (oeth:0x78a927114A20Fb34b9d8d9c6a9A75E65f918D52B) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRegistry (oeth:0x867872f80b1e22D30C4b06FcB474aC10B9DAA2f6) [privacy-boost/TokenRegistry]
    +++ description: Registry mapping compact token IDs to the ERC-20 tokens accepted by the PrivacyBoost pool.
```

```diff
+   Status: CREATED
    contract AuditGatewayProxyAdmin (oeth:0x96f3E5551E1330f31974597217019812667544c8) [global/ProxyAdmin]
    +++ description: Admin contract of the AuditGateway proxy.
```

```diff
+   Status: CREATED
    contract PrivacyBoostProxyAdmin (oeth:0x9d3F3CcD3c7a084eE73C4584CE33e77CEdaEc7E2) [global/ProxyAdmin]
    +++ description: Admin contract of the PrivacyBoost proxy.
```

```diff
+   Status: CREATED
    contract AuditGateway (oeth:0xb328535aB3bCe578996AE9af5A7f44f175721118) [privacy-boost/AuditGateway]
    +++ description: Manages the list of auditors authorized to query private user data through the Audit API of the TEE, and stores an onchain log of every audit access so that users can publicly verify whether and when their private data was disclosed.
```

```diff
+   Status: CREATED
    contract TreasuryMultisig (oeth:0xc82018cbC82A50064e3DdEF79EAdC319710Ffc5e) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Groth16DepositVerifier (oeth:0xC829061276e95D11aF92E678DE2B767AcFB4e924) [privacy-boost/Groth16DepositVerifier]
    +++ description: Groth16 verifier for PrivacyBoost deposit epoch proofs. Verification keys are stored in SSTORE2 data contracts, registered per supported batch size.
```

```diff
+   Status: CREATED
    contract PrivacyBoost (oeth:0xca689828854a422CF1f778be03CA80549408F620) [privacy-boost/PrivacyBoost]
    +++ description: Main contract of the PrivacyBoost private transfer pool. It escrows registered ERC-20 tokens deposited against note commitments, and lets allowed relays batch private transfers and withdrawals into epochs that are verified with Groth16 proofs against a note Merkle tree. Users can exit without relay cooperation via a delayed forced withdrawal with their own proof.
```

```diff
+   Status: CREATED
    contract Groth16ForcedVerifier (oeth:0xF023c61C5c745Be40fd30B0d48C0929839Ec3C67) [privacy-boost/Groth16ForcedVerifier]
    +++ description: Groth16 verifier for PrivacyBoost forced withdrawal proofs, used by the permissionless exit path. Verification keys are stored in SSTORE2 data contracts, registered per supported input count.
```

```diff
+   Status: CREATED
    contract AuthRegistryProxyAdmin (oeth:0xfB66dfD80B9a96c2BF2bcfDC5E6715C48916eD6C) [global/ProxyAdmin]
    +++ description: Admin contract of the AuthRegistry proxy.
```
