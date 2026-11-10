Generated with discovered.json: 0x71c7361733e6bfe7e8d15605e66041848d7609ac

# Diff at Tue, 10 Nov 2026 14:25:39 GMT:

- id: 95eda926
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@28ea16426fac1900c2fffd1cec3ecc6b84981c76 block: 1793874658
- current timestamp: 1794320084

## Description

The Butter Bridge on Base, still paused, was upgraded by the 2/3 Safe base:0xAAAaEE7549a61282F2B4Ca1766f46249D9e71aaA through the AuthorityManager: https://disco.l2beat.com/diff/base:0x862761D6D52E9e812A8c22E6e6A39E186e59a33d/base:0xa2bd213E4e5655125A8c18D716184b6b11F45F25. The only code change is a new `emergencyWithdraw(token, to, amount)`: ADMIN_ROLE members of the AuthorityManager (both Safes, no delay) can send any asset held by the Bridge to any address, also while it is paused.

The same Safe then used it to move all USDC (94,176) and WETH (22.27) held by the Bridge to the 3/5 Safe base:0x9987463102993e177b107e0cE97a0420428D1999: https://basescan.org/tx/0x92f287eec13a8d25e9eb10d1d45c6b16e050e515ae09865e5940cbe58fd0c57c and https://basescan.org/tx/0x9e89a766ce74e84a25cc5c12084afbff1dcd37ecfc5baec200c4ccaf5d826e14. The Base bridge now holds no USDC or WETH to fill inbound transfers (other tokens not checked).

Message validation is unchanged: LightNode, VerifyTool, FeeService and relay are the same. The admins could already move the funds through an instant upgrade, so the trust assumption is the same with a more direct path.

Config: new Bridge shape, the admin permission names the withdrawal.

## Watched changes

```diff
    contract Butter Bridge (base:0x0000317Bec33Af037b5fAb2028f52d14658F6A56) [butternetwork/Bridge] {
    +++ description: Butter's Base bridge endpoint. Outbound transfers lock or burn assets and emit messages for the MAP relay chain; inbound transfers execute only after a LightNode-validated receipt proof for the configured MAP relay contract. The bridge can mint configured mintable tokens, release escrowed assets, and invoke receiver callbacks, so compromise of validation, relay configuration, or management authority can lead to loss of bridged funds.
      sourceHashes.1:
-        "0x4fbfa6dffeb7b0631c9754128ce823ee45e589dc9d6a230e444db8381a124cd6"
+        "0xcdcece1862e16da26424ca2364fc88c7dc2ac699b0bb37e0540a885a07c6b585"
+++ description: Current implementation of the upgradeable Butter Bridge proxy.
+++ severity: HIGH
      values.$implementation:
-        "base:0x862761D6D52E9e812A8c22E6e6A39E186e59a33d"
+        "base:0xa2bd213E4e5655125A8c18D716184b6b11F45F25"
      values.$pastUpgrades.5:
+        ["2026-11-10T07:53:20.000Z","0xb5a59a8d60bdfefe215aa6b7baeb1b676f9342aec11ef978b05d1a75049a039e",["base:0xa2bd213E4e5655125A8c18D716184b6b11F45F25"]]
      values.$upgradeCount:
-        5
+        6
      values.getImplementation:
-        "base:0x862761D6D52E9e812A8c22E6e6A39E186e59a33d"
+        "base:0xa2bd213E4e5655125A8c18D716184b6b11F45F25"
      implementationNames.base:0x862761D6D52E9e812A8c22E6e6A39E186e59a33d:
-        "Bridge"
      implementationNames.base:0xa2bd213E4e5655125A8c18D716184b6b11F45F25:
+        "Bridge"
    }
```

## Source code changes

```diff
.../{.flat@1793874658 => .flat}/Butter Bridge/Bridge.sol   | 14 ++++++++++++++
 1 file changed, 14 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1793874658 (main branch discovery), not current.

```diff
    contract Butter Bridge (base:0x0000317Bec33Af037b5fAb2028f52d14658F6A56) [butternetwork/Bridge] {
    +++ description: Butter's Base bridge endpoint. Outbound transfers lock or burn assets and emit messages for the MAP relay chain; inbound transfers execute only after a LightNode-validated receipt proof for the configured MAP relay contract. The bridge can mint configured mintable tokens, release escrowed assets, and invoke receiver callbacks, so compromise of validation, relay configuration, or management authority can lead to loss of bridged funds.
      fieldMeta.authority.description:
-        "Authority contract consulted by all Bridge management functions marked restricted. Its role members can pause the bridge, change supported tokens and service contracts, change the relay, configure trust-list entries, and upgrade the Bridge implementation."
+        "Authority contract consulted by all Bridge management functions marked restricted. Its role members can pause the bridge, change supported tokens and service contracts, change the relay, configure trust-list entries, withdraw any asset held by the Bridge with `emergencyWithdraw()`, and upgrade the Bridge implementation."
    }
```

```diff
    contract SafeL2 (base:0x9987463102993e177b107e0cE97a0420428D1999) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0.description:
-        "change AuthorityManager permissions and execute restricted Bridge and FeeService management operations."
+        "change AuthorityManager permissions and execute restricted Bridge and FeeService management operations without delay, including the withdrawal of all assets held by the Bridge."
    }
```

```diff
    contract SafeL2 (base:0xAAAaEE7549a61282F2B4Ca1766f46249D9e71aaA) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0.description:
-        "change AuthorityManager permissions and execute restricted Bridge and FeeService management operations."
+        "change AuthorityManager permissions and execute restricted Bridge and FeeService management operations without delay, including the withdrawal of all assets held by the Bridge."
    }
```

Generated with discovered.json: 0x555fc5b4a07e392070b5b1bd3a236f2392d178ed

# Diff at Thu, 05 Nov 2026 10:43:20 GMT:

- id: d6529c54
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ed3b78ee5d7973829dff175055ab7e54cc7df91 block: 1792144328
- current timestamp: 1793874658

## Description

The Safe member base:0x386ce1a1 revoked its EIP-7702 delegation to a SmartWallet contract and is a plain EOA again. Its key signs for the Safe as before, so the signer set is unchanged. Removed the override that silenced the SmartWallet getters.

## Watched changes

```diff
    EOA (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A) {
    +++ description: None
      sourceHashes:
-        ["0x75edcc789e2feb6dd3863127fde1296f7df029e9ba2e9a8aa0ea96c257bc9432"]
      proxyType:
-        "EIP7702 EOA"
+        "EOA"
      values:
-        {"$implementation":"base:0xe40ccB2D94975c51bff0C004eFDfd9B3a5796fA4","CUSTOM_STORAGE_ROOT":"0x653ff6dcbda533c3c7d8ffb646da3e510d0de40f237170c4da3f874472aecb00","eip712Domain":{"fields":"0x0f","name":"SmartWallet","version":"1.1.0","chainId":8453,"verifyingContract":"base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"base:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getExpiration":[0,0,0,0,0],"getHook":["base:0x0000000000000000000000000000000000000000","base:0x0000000000000000000000000000000000000001","base:0x0000000000000000000000000000000000000002","base:0x0000000000000000000000000000000000000003","base:0x0000000000000000000000000000000000000004"],"getOwnerKeys":[],"IMPLEMENTATION":"base:0xe40ccB2D94975c51bff0C004eFDfd9B3a5796fA4","isAdmin":[false,false,false,false,false],"isSettingsExpired":[false,false,false,false,false],"namespace":"SmartWallet.ERC7201.CustomStorage","ownerAt":[],"ownerCount":0}
      errors:
-        {"getExpiration":"Processing error occurred.","getHook":"Processing error occurred.","getImmutableFactory":"Processing error occurred.","isAdmin":"Processing error occurred.","isSettingsExpired":"Processing error occurred.","proxiableUUID":"Processing error occurred."}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1792144328 (main branch discovery), not current.

```diff
    EOA (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A) {
    +++ description: None
      values.getExpiration:
+        [0,0,0,0,0]
      values.getHook:
+        ["base:0x0000000000000000000000000000000000000000","base:0x0000000000000000000000000000000000000001","base:0x0000000000000000000000000000000000000002","base:0x0000000000000000000000000000000000000003","base:0x0000000000000000000000000000000000000004"]
      values.isAdmin:
+        [false,false,false,false,false]
      values.isSettingsExpired:
+        [false,false,false,false,false]
      errors:
+        {"getExpiration":"Processing error occurred.","getHook":"Processing error occurred.","getImmutableFactory":"Processing error occurred.","isAdmin":"Processing error occurred.","isSettingsExpired":"Processing error occurred.","proxiableUUID":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x5eca13bdc7be918527718ed40b80568e73556faa

# Diff at Fri, 16 Oct 2026 10:13:24 GMT:

- id: 7172ce00
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e45e14a922cef8b526f3f802ae97d6b7542cacb7 block: 1790850942
- current timestamp: 1792144328

## Description

The Butter Bridge on Base is paused. The Safe at the same address paused the bridge on Ethereum, Arbitrum, Optimism, Polygon PoS and BSC within the same 2h. Linea and Avalanche have stayed paused since the May 2026 exploit. Outbound transfers and inbound message execution are halted. https://x.com/ButterNetworkio/status/2110682522564825340 .

## Watched changes

```diff
    contract Butter Bridge (base:0x0000317Bec33Af037b5fAb2028f52d14658F6A56) [butternetwork/Bridge] {
    +++ description: Butter's Base bridge endpoint. Outbound transfers lock or burn assets and emit messages for the MAP relay chain; inbound transfers execute only after a LightNode-validated receipt proof for the configured MAP relay contract. The bridge can mint configured mintable tokens, release escrowed assets, and invoke receiver callbacks, so compromise of validation, relay configuration, or management authority can lead to loss of bridged funds.
+++ description: Whether bridge transfers and message execution are paused. The authority can toggle this circuit breaker.
+++ severity: HIGH
      values.paused:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790850942 (main branch discovery), not current.

```diff
    EOA (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A) {
    +++ description: None
      unverified:
-        true
      values.CUSTOM_STORAGE_ROOT:
+        "0x653ff6dcbda533c3c7d8ffb646da3e510d0de40f237170c4da3f874472aecb00"
      values.eip712Domain:
+        {"fields":"0x0f","name":"SmartWallet","version":"1.1.0","chainId":8453,"verifyingContract":"base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]}
      values.entryPoint:
+        "base:0x0000000071727De22E5E9d8BAf0edAc6f37da032"
      values.getOwnerKeys:
+        []
      values.IMPLEMENTATION:
+        "base:0xe40ccB2D94975c51bff0C004eFDfd9B3a5796fA4"
      values.namespace:
+        "SmartWallet.ERC7201.CustomStorage"
      values.ownerAt:
+        []
      values.ownerCount:
+        0
      sourceHashes:
+        ["0x75edcc789e2feb6dd3863127fde1296f7df029e9ba2e9a8aa0ea96c257bc9432"]
    }
```

Generated with discovered.json: 0xb42e981bfa9ea03ee9955be0b048d01c75d6a971

# Diff at Thu, 01 Oct 2026 11:10:27 GMT:

- id: c540e3bd
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed7cdd77b1978c118fb9b1f824ae6cb10dfb566e block: 1786352166
- current timestamp: 1790850942

## Description

7702 re-delegation of a multisig signer.

## Watched changes

```diff
    EOA (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A) {
    +++ description: None
      values.$implementation:
-        "base:0xa845C74344Fc9405b1Fcf712f04668979573c1bf"
+        "base:0xe40ccB2D94975c51bff0C004eFDfd9B3a5796fA4"
    }
```

Generated with discovered.json: 0xa53cbdad94c30a38aaf8d3d36d0df2d928451789

# Diff at Mon, 10 Aug 2026 09:00:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@be83079eed365197a392b6bfd65fa6506007093c block: 1785915246
- current timestamp: 1786352166

## Description

Config: ignore in watchmode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785915246 (main branch discovery), not current.

```diff
    contract Butter MAP LightNode (base:0x0001805c0B57DBd48B5c5c26E237a135dDC678ae) [butternetwork/LightNode] {
    +++ description: Upgradeable MAP relay-chain light client used by Butter bridges. It verifies relay-chain headers with the stored BLS validator set and verifies receipt Merkle proofs against accepted headers. It is the destination-chain validation boundary for bridged messages.
      fieldMeta.headerHeight.severity:
-        "HIGH"
      fieldMeta.epochSummary.severity:
-        "HIGH"
      fieldMeta.verifiableHeaderRange.severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xb36c1f52ebe9cbebf0c59f41c05a60bd99ee3123

# Diff at Wed, 05 Aug 2026 09:02:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1785915246

## Description

Butter interop protocol init disco: validation checks BLS sigs of a validator set on an external L1 (MAP Protocol). Validators can update the set with the discovered quorum. Each bridge tx verifies a merkle proof agains validator-signed block headers from the external L1. The L1 is supposed to run light clients of all participating chains.

## Initial discovery

```diff
+   Status: CREATED
    contract Butter Bridge (base:0x0000317Bec33Af037b5fAb2028f52d14658F6A56) [butternetwork/Bridge]
    +++ description: Butter's Base bridge endpoint. Outbound transfers lock or burn assets and emit messages for the MAP relay chain; inbound transfers execute only after a LightNode-validated receipt proof for the configured MAP relay contract. The bridge can mint configured mintable tokens, release escrowed assets, and invoke receiver callbacks, so compromise of validation, relay configuration, or management authority can lead to loss of bridged funds.
```

```diff
+   Status: CREATED
    contract Butter MAP LightNode (base:0x0001805c0B57DBd48B5c5c26E237a135dDC678ae) [butternetwork/LightNode]
    +++ description: Upgradeable MAP relay-chain light client used by Butter bridges. It verifies relay-chain headers with the stored BLS validator set and verifies receipt Merkle proofs against accepted headers. It is the destination-chain validation boundary for bridged messages.
```

```diff
+   Status: CREATED
    EOA  (base:0x386ce1a187eC7329CFb8E467EB02FB07c698256A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (base:0x9987463102993e177b107e0cE97a0420428D1999) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (base:0xAAAaEE7549a61282F2B4Ca1766f46249D9e71aaA) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Butter AuthorityManager (base:0xACC31A6756B60304C03d6626fc98c062E4539CCA) [butternetwork/AuthorityManager]
    +++ description: OpenZeppelin AccessManager-derived authority for Butter's restricted Bridge and FeeService functions. Its role configuration controls who can change bridge validation dependencies, relay and token settings, fee parameters, pause state, and implementation upgrades.
```

```diff
+   Status: CREATED
    contract Butter VerifyTool (base:0xc3393567DC2F1d071254E880c9f501641491471f) [butternetwork/VerifyTool]
    +++ description: Cryptographic and RLP/Merkle-proof helper contract called by the Butter MAP LightNode to validate relay-chain headers and transaction receipts.
```

```diff
+   Status: CREATED
    contract Butter FeeService (base:0xfeE31a1FD7FcA0E05428ff751242e46F6D5769a6) [butternetwork/FeeService]
    +++ description: Fee configuration contract used by Butter Bridge to calculate cross-chain message fees and select the fee recipient.
```
