Generated with discovered.json: 0xc86d7925390034d0c96d7130c701179d7d153aa3

# Diff at Thu, 06 Mar 2025 15:20:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21944318
- current block number: 21944318

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21944318 (main branch discovery), not current.

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        ""
+        "BlockedMessageLib"
      unverified:
-        true
      values.messageLibType:
+        2
      values.version:
+        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      sourceHashes:
+        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
    }
```

Generated with discovered.json: 0xe00f34163aeb9f579dfeb05071713442be8e07a4

# Diff at Tue, 04 Mar 2025 11:26:37 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21944318
- current block number: 21944318

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21944318 (main branch discovery), not current.

```diff
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        "BlockedMessageLib"
+        ""
      sourceHashes:
-        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
      values.messageLibType:
-        2
      values.version:
-        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      unverified:
+        true
    }
```

Generated with discovered.json: 0x30eba0a09fe248da5fd2f6db605273d31dd8090b

# Diff at Tue, 04 Mar 2025 10:40:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21944318
- current block number: 21944318

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21944318 (main branch discovery), not current.

```diff
    contract Treasurer (0x1041D127b2d4BC700F0F563883bC689502606918) {
    +++ description: None
      sinceBlock:
+        19963243
    }
```

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      sinceBlock:
+        19093746
    }
```

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
      sinceBlock:
+        19093715
    }
```

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      sinceBlock:
+        19093715
    }
```

```diff
    contract StargatePool (0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D) {
    +++ description: None
      sinceBlock:
+        19963228
    }
```

```diff
    contract StargateMultiRewarder (0x5871A7f88b0f3F5143Bf599Fd45F8C0Dc237E881) {
    +++ description: None
      sinceBlock:
+        19963242
    }
```

```diff
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056) {
    +++ description: None
      sinceBlock:
+        19093724
    }
```

```diff
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      sinceBlock:
+        14402408
    }
```

```diff
    contract CreditMessaging (0x6b8aD17795d89B283e6D0362A87A403f3544bb9d) {
    +++ description: None
      sinceBlock:
+        19963233
    }
```

```diff
    contract TokenMessaging (0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980) {
    +++ description: This is a Layer Zero OApp. It also handles the batching logic: bus, taxi, quotes
      sinceBlock:
+        19963232
    }
```

```diff
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) {
    +++ description: None
      sinceBlock:
+        21094853
    }
```

```diff
    contract StargatePoolNative (0x77b2043768d28E9C9aB44E1aBfC95944bcE57931) {
    +++ description: None
      sinceBlock:
+        19963227
    }
```

```diff
    contract Stargate Verifier (0x8FafAE7Dd957044088b3d0F67359C327c6200d18) {
    +++ description: None
      sinceBlock:
+        19922400
    }
```

```diff
    contract StargatePoolMigratable (0x933597a323Eb81cAe705C5bC29985172fd5A3973) {
    +++ description: None
      sinceBlock:
+        19963231
    }
```

```diff
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5) {
    +++ description: None
      sinceBlock:
+        17565746
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      sinceBlock:
+        19093732
    }
```

```diff
    contract Nethermind Verifier (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: None
      sinceBlock:
+        19108732
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      sinceBlock:
+        19093729
    }
```

```diff
    contract StargatePoolUSDC (0xc026395860Db2d07ee33e05fE50ed7bD583189C7) {
    +++ description: None
      sinceBlock:
+        19963230
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      sinceBlock:
+        19093731
    }
```

```diff
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113) {
    +++ description: None
      sinceBlock:
+        17565748
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      sinceBlock:
+        14457816
    }
```

```diff
    contract StargatePool (0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3) {
    +++ description: None
      sinceBlock:
+        19963229
    }
```

```diff
    contract  (0xd0ab8512CF4907bD94CDb5fE7d0C324E666c4006) {
    +++ description: None
      sinceBlock:
+        19922400
    }
```

Generated with discovered.json: 0x0f3a7ad4b9e88baa08e9eac3add521bd714e4cc6

# Diff at Fri, 28 Feb 2025 10:42:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a673c79f7be232b805781e844ed3929c5c5bb288 block: 21844076
- current block number: 21944318

## Description

BlockedMessageLib verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21844076 (main branch discovery), not current.

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        ""
+        "BlockedMessageLib"
      unverified:
-        true
      values.messageLibType:
+        2
      values.version:
+        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      sourceHashes:
+        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
    }
```

Generated with discovered.json: 0x7fe6dce5337a111a3dab30fc6b0ccdcf543047e5

# Diff at Thu, 27 Feb 2025 11:46:53 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21844076
- current block number: 21844076

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21844076 (main branch discovery), not current.

```diff
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        "BlockedMessageLib"
+        ""
      sourceHashes:
-        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
      values.messageLibType:
-        2
      values.version:
-        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      unverified:
+        true
    }
```

Generated with discovered.json: 0x01b35fa1f0b63e778bcdb34d83274c3447d3486f

# Diff at Wed, 12 Feb 2025 10:38:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21786545
- current block number: 21829862

## Description

BlockedMessageLib is now verified. A library that blocks any messages that specify it as required.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21786545 (main branch discovery), not current.

```diff
    contract BlockedMessageLib (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: None
      name:
-        ""
+        "BlockedMessageLib"
      unverified:
-        true
      values.messageLibType:
+        2
      values.version:
+        {"major":"18446744073709551615","minor":255,"endpointVersion":2}
      sourceHashes:
+        ["0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"]
    }
```

Generated with discovered.json: 0xc5bd6489e1cc55f36173cef53e3019acdfd0a3cb

# Diff at Thu, 06 Feb 2025 09:24:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21778531
- current block number: 21786545

## Description

deficitOffset changes, see below for an explanation what this does (fee related).

## Watched changes

```diff
    contract StargatePoolNative (0x77b2043768d28E9C9aB44E1aBfC95944bcE57931) {
    +++ description: None
      values.deficitOffset:
-        "90000000000000000000000"
+        "36000000000000000000000"
    }
```

```diff
    contract StargatePoolUSDC (0xc026395860Db2d07ee33e05fE50ed7bD583189C7) {
    +++ description: None
      values.deficitOffset:
-        30000000000000
+        100000000000000
    }
```

Generated with discovered.json: 0xb5d5de4f2fd12bbffe6cb9fdb73582e1f0424c5a

# Diff at Wed, 05 Feb 2025 06:34:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 21766636
- current block number: 21778531

## Description

Deficit offset raised for ETH pool. This mainly affects fees, see below.

## Watched changes

```diff
    contract StargatePoolNative (0x77b2043768d28E9C9aB44E1aBfC95944bcE57931) {
    +++ description: None
      values.deficitOffset:
-        0
+        "90000000000000000000000"
    }
```

Generated with discovered.json: 0x5f3681a6bdd635ad1f16b6c710568f36523a6f6f

# Diff at Mon, 03 Feb 2025 14:40:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21723800
- current block number: 21766636

## Description

USD 30M deficitOffset registered. This essentially simulates this pool having 30M less USDC then it has (~60M). This is only used for fee / slippage calculation for outgoing messages.
The change seems to be a hacky way of adjusting fees for this large pool.

## Watched changes

```diff
    contract StargatePoolUSDC (0xc026395860Db2d07ee33e05fE50ed7bD583189C7) {
    +++ description: None
      values.deficitOffset:
-        0
+        30000000000000
    }
```

Generated with discovered.json: 0x65e1be70f6bdcd798cda1a6395d04b42eed06981

# Diff at Tue, 28 Jan 2025 15:05:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 21630210
- current block number: 21723800

## Description

LayerZero MS update: members swapped and new member added (now 3/5).

## Watched changes

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$members.4:
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.3:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
+        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      values.$members.2:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.1:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x112c737AeEbD2E52DEb9ff5c9c19497F1A1777b0"
      values.$members.0:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0xB981a2664f5f547291Df5F8dCD4505f7015912CF"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xa1e0402cf375332155040f08ecbba275d26a4ed8

# Diff at Mon, 20 Jan 2025 11:10:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21630210
- current block number: 21630210

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630210 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
      issuedPermissions.0.to:
+        "0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"
    }
```

```diff
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
      receivedPermissions.0.from:
+        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x173272739Bd7Aa6e4e214714048a9fE699453059"
      receivedPermissions.0.from:
+        "0x173272739Bd7Aa6e4e214714048a9fE699453059"
    }
```

```diff
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5"
      issuedPermissions.0.to:
+        "0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5"
    }
```

Generated with discovered.json: 0x4373ee5870d10cf8513a86e72d2f437908a1d41b

# Diff at Wed, 15 Jan 2025 13:35:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465483
- current block number: 21630210

## Description

Nethermind signer size increased to 3.

## Watched changes

```diff
    contract Nethermind Verifier (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: None
      values.signerSize:
-        2
+        3
    }
```

Generated with discovered.json: 0x6c58969bd600f3cc53761d45cded299e14a788b8

# Diff at Mon, 23 Dec 2024 13:29:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21264298
- current block number: 21465483

## Description

Signer added to the Nethermind verifier  / DVN

## Watched changes

```diff
    contract Nethermind Verifier (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: None
      values.signerSize:
-        1
+        2
    }
```

Generated with discovered.json: 0xb5f1f88016b07d76f8d6a883b987da97d8363150

# Diff at Mon, 25 Nov 2024 10:53:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@62a44faa52866a55f9881cb2852ac75b1fcc60b0 block: 21184760
- current block number: 21264298

## Description

MS signer change.

## Watched changes

```diff
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      values.$members.4:
-        "0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4"
+        "0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
    }
```

Generated with discovered.json: 0x8b0a477ff755972982f608b4f4e4badb3dfff4d2

# Diff at Thu, 14 Nov 2024 08:32:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21121935
- current block number: 21184760

## Description

Previously added lib is now verified. This library is the core of the new [lzRead feature](https://medium.com/layerzero-official/lzread-power-your-app-with-omnichain-data-cdd341eeeaf7).

lzRead allows requesting and receiving data from other LayerZero-supported chains asynchronously. The library uses the same architecture and similar oracles as the LayerZero AMB (lzRead-specific DVNs).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21121935 (main branch discovery), not current.

```diff
    contract ReadLib1002 (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) {
    +++ description: None
      name:
-        ""
+        "ReadLib1002"
      unverified:
-        true
      values.getTreasuryAndNativeFeeCap:
+        ["0x0000000000000000000000000000000000000000",450000000000000]
      values.messageLibType:
+        2
      values.owner:
+        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
      values.version:
+        {"major":10,"minor":0,"endpointVersion":2}
      sourceHashes:
+        ["0xf7800be6fd99520201da1404c35bac8a1ed826bbc2134f0a77547e0d7a74c9c1"]
    }
```

Generated with discovered.json: 0x17bcc71bcb0f9f1253d487abedae99e93902cf58

# Diff at Tue, 05 Nov 2024 14:06:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21027597
- current block number: 21121935

## Description

A new unverified send- or receive library is added by the LayerZeroMultisig, but not yet used for the monitored OApps, nor as default, nor is it described in the docs.

This is a good example of an attack we would not notice because we cannot monitor all OApps and if someone is using this new library for any of them.

Also, the unverified LayerZero Executor is upgraded.

## Watched changes

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$implementation:
-        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
+        "0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"
      values.$pastUpgrades.2:
+        ["2024-11-01T19:07:23.000Z","0x8714871659f7ff2feb7968256c3baf39e5cdbe9160f36649f8a530a536456ed5",["0xfE9AB78eD4f9f3DbB168d9f5E5213d78605C9805"]]
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
+++ description: MessageLibs registered for this Endpoint, enforcing the OApp owner's custom security stack.
+++ severity: HIGH
      values.getRegisteredLibraries.3:
+        "0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D"
    }
```

```diff
+   Status: CREATED
    contract  (0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: None
```

Generated with discovered.json: 0xb5f91a650c3a7dffc12a394c10ca27113e365112

# Diff at Wed, 23 Oct 2024 10:10:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20340229
- current block number: 21027597

## Description

LayerZero Multisig: One signer removed.

## Watched changes

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$members.4:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.3:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.2:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.1:
-        "0xe095F2590eF1Ab39601445025847Ed8E4B40D687"
+        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x5e100b8388d2136485b63eae4fbb04c5448d649a

# Diff at Mon, 21 Oct 2024 12:49:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
      descriptions:
-        ["Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner."]
      description:
+        "Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner."
    }
```

```diff
    contract TokenMessaging (0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980) {
    +++ description: This is a Layer Zero OApp. It also handles the batching logic: bus, taxi, quotes
      descriptions:
-        ["This is a Layer Zero OApp. It also handles the batching logic: bus, taxi, quotes"]
      description:
+        "This is a Layer Zero OApp. It also handles the batching logic: bus, taxi, quotes"
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      descriptions:
-        ["Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to."]
      description:
+        "Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to."
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      descriptions:
-        ["Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to."]
      description:
+        "Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to."
    }
```

Generated with discovered.json: 0x87c879b1ba3960898824c2e627deb29372885e75

# Diff at Mon, 21 Oct 2024 11:10:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xDaC2d26317C42ae3CB21357B73404120E1dA4232"]
      values.$pastUpgrades.1.1:
-        ["0xDaC2d26317C42ae3CB21357B73404120E1dA4232"]
+        "0x22c22ee402c4be83ef7c851992c3125008be9ee0a39c0d83cf6be91a0506f7c4"
      values.$pastUpgrades.0.2:
+        ["0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"]
      values.$pastUpgrades.0.1:
-        ["0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"]
+        "0x5df683475486093be4a4f92d6f7c47548d3bf38e1a39e25bf0028353f83d4a2b"
    }
```

```diff
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x319AE539b5BA554b09A46791cdb88b10E4d8F627"]
      values.$pastUpgrades.2.1:
-        ["0x319AE539b5BA554b09A46791cdb88b10E4d8F627"]
+        "0x35c84fce2bd551b2e80f13f545f49c65ed2a20c3c2d46eecc10c825112a86ccc"
      values.$pastUpgrades.1.2:
+        ["0x13dff8847EA170eBb8439ce732c0A14Bb49fDd92"]
      values.$pastUpgrades.1.1:
-        ["0x13dff8847EA170eBb8439ce732c0A14Bb49fDd92"]
+        "0xb0be4d7a78cc69d7a3609a84216cbf0bae5b0ade84c45b35c05dafda6c84faec"
      values.$pastUpgrades.0.2:
+        ["0xF641db6860FD5f6643D05bD75405a2586a63a141"]
      values.$pastUpgrades.0.1:
-        ["0xF641db6860FD5f6643D05bD75405a2586a63a141"]
+        "0xd7e8b45283a17ffe10a55914b49e6114acd56dedba1a154159a9b71e9f9205df"
    }
```

Generated with discovered.json: 0x4815715b5451877d64fdbff7933f942e74d40816

# Diff at Fri, 18 Oct 2024 11:01:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract Stargate Verifier (0x8FafAE7Dd957044088b3d0F67359C327c6200d18) {
    +++ description: None
      unverified:
-        true
      values.allowlistSize:
+        0
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.defaultMultiplierBps:
+        12000
      values.paused:
+        false
      values.priceFeed:
+        "0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113"
      values.quorum:
+        1
      values.signerSize:
+        1
      values.vid:
+        101
      values.workerFeeLib:
+        "0xd0ab8512CF4907bD94CDb5fE7d0C324E666c4006"
      sourceHashes:
+        ["0x67b975b3ef00e71be27727f49933e41872aa848504565806e3e3482a2245f99c"]
    }
```

```diff
+   Status: CREATED
    contract  (0x9bfAc7947FC1b64aA9F12b24EcD519DaEcEf3Ba5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xC03f31fD86a9077785b7bCf6598Ce3598Fa91113)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xd0ab8512CF4907bD94CDb5fE7d0C324E666c4006)
    +++ description: None
```

Generated with discovered.json: 0x814d12129d0fc192efca6b68d1d0490e105b370b

# Diff at Mon, 14 Oct 2024 10:56:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract Treasurer (0x1041D127b2d4BC700F0F563883bC689502606918) {
    +++ description: None
      sourceHashes:
+        ["0x3857982ba9867dfe0d878491a8f43962a5ae20721e924738425e3e6902cf9097"]
    }
```

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
      sourceHashes:
+        ["0x399160e7d36a21fca31097d7875daed8f421f788b77f2a71974d51938c3ea520"]
    }
```

```diff
    contract StargatePool (0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D) {
    +++ description: None
      sourceHashes:
+        ["0xf0d2f0cd5f3481632b35bc976e24b16d77ccdeefeb7307139a3f3d2adf485094"]
    }
```

```diff
    contract StargateMultiRewarder (0x5871A7f88b0f3F5143Bf599Fd45F8C0Dc237E881) {
    +++ description: None
      sourceHashes:
+        ["0xc36d2c5087e47e6fad11a1bea54e8da1eba1b67863c32a5961968d43a77b2f0b"]
    }
```

```diff
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056) {
    +++ description: None
      sourceHashes:
+        ["0x79f573a9d94def8dc0b4319d44595f806685b0ca5875891eff1ed40a9ff6b6e0"]
    }
```

```diff
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CreditMessaging (0x6b8aD17795d89B283e6D0362A87A403f3544bb9d) {
    +++ description: None
      sourceHashes:
+        ["0xb151141227bb08ead5b1a7d464402bf23feaf60625a773cb8ced48745eb66fe6"]
    }
```

```diff
    contract TokenMessaging (0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980) {
    +++ description: This is a Layer Zero OApp. It also handles the batching logic: bus, taxi, quotes
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

```diff
    contract StargatePoolNative (0x77b2043768d28E9C9aB44E1aBfC95944bcE57931) {
    +++ description: None
      sourceHashes:
+        ["0x63ac97930921267a1251904351ae2409e0d62d3d3c3fcb2ed7bc1fc4775321f7"]
    }
```

```diff
    contract StargatePoolMigratable (0x933597a323Eb81cAe705C5bC29985172fd5A3973) {
    +++ description: None
      sourceHashes:
+        ["0xad746913c310c0ee643e98f0a0f4bc6095877e7c82e0779cb5d5e852e0e12c8d"]
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      sourceHashes:
+        ["0x130b90ae0c02f239d1ce8b414a1a9a49d97708bb4f07d7e9c69af4f7c8a8f5bc"]
    }
```

```diff
    contract Nethermind Verifier (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: None
      sourceHashes:
+        ["0x67b975b3ef00e71be27727f49933e41872aa848504565806e3e3482a2245f99c"]
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      sourceHashes:
+        ["0x159d8f84a5100285a7401e1ccb3d40a64fe944d9beb951c81749de40279a5876"]
    }
```

```diff
    contract StargatePoolUSDC (0xc026395860Db2d07ee33e05fE50ed7bD583189C7) {
    +++ description: None
      sourceHashes:
+        ["0x0ef9b0bca6f74cd24daa9d50e734dfec2ecbc71cef5b209fa0c0f93561ad2640"]
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      sourceHashes:
+        ["0x3904c78c7b0abf91f9544ebb9f08f2d2bc83028df65c912a7f7a6ca1ca109dde"]
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract StargatePool (0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3) {
    +++ description: None
      sourceHashes:
+        ["0xf0d2f0cd5f3481632b35bc976e24b16d77ccdeefeb7307139a3f3d2adf485094"]
    }
```

Generated with discovered.json: 0xecfd2cf0baf40fdc870412a7c19be626aa1ac2fa

# Diff at Tue, 01 Oct 2024 11:10:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-26T22:27:23.000Z",["0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"]],["2024-07-04T23:54:35.000Z",["0xDaC2d26317C42ae3CB21357B73404120E1dA4232"]]]
    }
```

Generated with discovered.json: 0x59222ab0bc0caecc64445f1c3b2db6e9f7eeee70

# Diff at Fri, 30 Aug 2024 08:01:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd669dc2bdf7ca6b201f3118d335062a48eaaef94

# Diff at Fri, 23 Aug 2024 09:55:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x0d02e17a196e8c9b7e602c6246a52bd172df2ab5

# Diff at Wed, 21 Aug 2024 10:06:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x173272739Bd7Aa6e4e214714048a9fE699453059"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x173272739Bd7Aa6e4e214714048a9fE699453059","via":[]}]
    }
```

Generated with discovered.json: 0x5470b6267bfdd713c3c8ea31269e1d1e2b181bbd

# Diff at Fri, 09 Aug 2024 10:12:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x173272739Bd7Aa6e4e214714048a9fE699453059"]
      assignedPermissions.upgrade:
+        ["0x173272739Bd7Aa6e4e214714048a9fE699453059"]
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x810d943354834eb2842ada20a89e7c45888f96d4

# Diff at Tue, 30 Jul 2024 11:14:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
      fieldMeta:
+        {"getRegisteredLibraries":{"severity":"HIGH","description":"MessageLibs registered for this Endpoint, enforcing the OApp owner's custom security stack."}}
    }
```

```diff
    contract CreditMessaging (0x6b8aD17795d89B283e6D0362A87A403f3544bb9d) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      fieldMeta:
+        {"getExecutorConfig":{"description":"The executor config of the Stargate Bridge OApp (TokenMessaging) for all messages coming from Arbitrum. (returns: [maxMessageSize, Executor])"}}
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      fieldMeta:
+        {"getUlnConfig":{"description":"The verification config of the Stargate Bridge OApp (TokenMessaging) for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])"}}
    }
```

Generated with discovered.json: 0x458094cf56fc38fb2390760322c8ca83de43a199

# Diff at Fri, 19 Jul 2024 11:18:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@744d4e1fec0be9972ab7fde1dd4cc0ba0c91a28c block: 20240871
- current block number: 20340229

## Description

Ignore relatives of the StargateMultiRewarder. (STG token and such)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240871 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x17BBC9BD51A52aAf4d2CC6652630DaF4fdB358F7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x5DaAee9EF143faFF495B581e9863570e83F99d31)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StargateToken (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xfcb42A0e352a08AbD50b8EE68d01f581B6Dfd80A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StargateStaking (0xFF551fEDdbeDC0AeE764139cCD9Cb644Bb04A6BD)
    +++ description: None
```

Generated with discovered.json: 0x28e8b5fbe4a5a8454398768047251d4caccd20af

# Diff at Fri, 05 Jul 2024 14:22:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 20082109
- current block number: 20240871

## Description

The LayerZero Executor contract is upgraded to a new implementation. (stays unverified)

## Watched changes

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      upgradeability.implementation:
-        "0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
+        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
      implementations.0:
-        "0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
+        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
    }
```

Generated with discovered.json: 0xc36ee197ed07f2b90a985666471e09b86a03e59c

# Diff at Thu, 13 Jun 2024 09:49:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20082109

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract Treasurer (0x1041D127b2d4BC700F0F563883bC689502606918)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x17BBC9BD51A52aAf4d2CC6652630DaF4fdB358F7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
```

```diff
+   Status: CREATED
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePool (0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargateMultiRewarder (0x5871A7f88b0f3F5143Bf599Fd45F8C0Dc237E881)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x5DaAee9EF143faFF495B581e9863570e83F99d31)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CreditMessaging (0x6b8aD17795d89B283e6D0362A87A403f3544bb9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessaging (0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980)
    +++ description: This is a Layer Zero OApp. It also handles the batching logic: bus, taxi, quotes
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0x77b2043768d28E9C9aB44E1aBfC95944bcE57931)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stargate Verifier (0x8FafAE7Dd957044088b3d0F67359C327c6200d18)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0x933597a323Eb81cAe705C5bC29985172fd5A3973)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Nethermind Verifier (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargateToken (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
```

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0xc026395860Db2d07ee33e05fE50ed7bD583189C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePool (0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xfcb42A0e352a08AbD50b8EE68d01f581B6Dfd80A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargateStaking (0xFF551fEDdbeDC0AeE764139cCD9Cb644Bb04A6BD)
    +++ description: None
```
