Generated with discovered.json: 0x67f433e8fba505f229d40a3e6a9850d9ed7b1405

# Diff at Tue, 04 Mar 2025 10:40:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 25417811
- current block number: 25417811

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sinceBlock:
+        9892035
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        16367160
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      sinceBlock:
+        11858833
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      sinceBlock:
+        9892352
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      sinceBlock:
+        11930930
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        18708503
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        21468906
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      sinceBlock:
+        9889667
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        24580169
    }
```

```diff
    contract NextHeaderVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6) {
    +++ description: None
      sinceBlock:
+        12175358
    }
```

```diff
    contract HeaderRangeVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44) {
    +++ description: None
      sinceBlock:
+        12175332
    }
```

Generated with discovered.json: 0x1494e0b8fdf0458d1463dae2add4f13add5d56a5

# Diff at Tue, 11 Feb 2025 14:13:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5604bedbb0dabec83d300e0abeb3d8685929c5d3 block: 25417811
- current block number: 25417811

## Description

Made succinct gateway description more generic (to be used not only for blobstream).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      description:
-        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
+        "This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract."
      issuedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

Generated with discovered.json: 0x8989dcedddeda69f9879338077be520e5819fa5e

# Diff at Tue, 04 Feb 2025 12:34:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 25417811
- current block number: 25417811

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25417811 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x14d9dfd5c0ad3deaecd8c56aaa609438c78c1674

# Diff at Thu, 23 Jan 2025 09:36:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 25112167
- current block number: 25417811

## Description

blobstreamProgramVkey updated: The new key is not found anywhere yet, the old one was associated with v4.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
+        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
    }
```

Generated with discovered.json: 0x3ebec00f52e1351871d613148a0ea8ec93a1b94b

# Diff at Mon, 20 Jan 2025 11:10:37 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 25112167
- current block number: 25112167

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25112167 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.to:
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
      issuedPermissions.1.description:
+        "can verify proofs for the header range [latestBlock, targetBlock] proof."
      issuedPermissions.0.target:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.to:
+        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.description:
+        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.1.from:
+        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.0.target:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      receivedPermissions.0.from:
+        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.target:
-        "0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3"
      issuedPermissions.0.to:
+        "0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3"
      issuedPermissions.0.description:
+        "can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.3.target:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.3.to:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.2.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.to:
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
      issuedPermissions.1.target:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.1.to:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.1.description:
+        "can freeze the bridge contract and update the list of authorized relayers."
      issuedPermissions.0.target:
-        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.to:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
      issuedPermissions.0.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      receivedPermissions.0.from:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0x598612d118d939851b19435d5390a7fae553afb9

# Diff at Mon, 20 Jan 2025 09:25:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 25112167
- current block number: 25112167

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25112167 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      fieldMeta.headerRangeProvers.type:
+        "PERMISSION"
      fieldMeta.nextHeaderProvers.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x033936bc27cb3f4400257157fea42bf0205fc92a

# Diff at Thu, 16 Jan 2025 12:10:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 25072565
- current block number: 25112167

## Description

New verifier added, old one frozen.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25072565 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.1.target:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+        "0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
+        ["0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16",false]
      fieldMeta.oldVerifier5:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: None
```

Generated with discovered.json: 0x6286fe7d65df00c74c33fdfb8bdc278b379f5dac

# Diff at Wed, 15 Jan 2025 09:48:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 24772641
- current block number: 25072565

## Description

New Vkey: [v4](https://github.com/succinctlabs/sp1-blobstream/blob/89e058052c0b691898c5b56a62a6fa0270b31627/contracts/script/UpdateVkey.s.sol#L26).

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
+        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
    }
```

Generated with discovered.json: 0xdb2b5c704d7ff88d4e06fdd48ea0c7fa14ca5416

# Diff at Wed, 08 Jan 2025 11:10:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 23434494
- current block number: 24772641

## Description

Remove relayer1 as it is no longer approved.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.isRelayer1Approved:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23434494 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.4:
-        {"permission":"upgrade","target":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","via":[]}
      issuedPermissions.3.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      issuedPermissions.2.target:
-        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.1.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
      values.relayers.2:
-        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
-        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.0:
-        "0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
    }
```

Generated with discovered.json: 0x59df2631957c2fcd2298bc15d340ec886934759c

# Diff at Thu, 19 Dec 2024 11:57:29 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@1e850509cf42792486a5c52f33b2bb56c3de2df1 block: 23434494
- current block number: 23434494

## Description

Discovery rerun on the same block number with only config-related changes.
Properly resolve $admin.
Resolve old Gateway owner's permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23434494 (main branch discovery), not current.

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794","description":"can freeze the bridge contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"}]
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      template:
+        "succinct/SuccinctGateway"
      description:
+        "Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead."
      issuedPermissions:
+        [{"permission":"configure","target":"0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3","via":[]}]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        ["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]
      values.isRelayerApproved:
-        true
      values.relayers.2:
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
      values.guardians:
+        ["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]
      values.isRelayer1Approved:
+        true
      values.isRelayer2Approved:
+        true
      values.isRelayer3Approved:
+        true
      description:
+        "The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here."
      issuedPermissions:
+        [{"permission":"configure","target":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","via":[]},{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","via":[]},{"permission":"configure","target":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","via":[]},{"permission":"upgrade","target":"0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6","via":[]}]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x6c7a05e0AE641c6559fD76ac56641778B6eCd776","description":"can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."}]
    }
```

```diff
    contract NextHeaderVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "NextHeaderVerifier"
    }
```

```diff
    contract HeaderRangeVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "HeaderRangeVerifier"
    }
```

Generated with discovered.json: 0xa1b5d233f3944b15389a548ed37dfd5e63fa0578

# Diff at Thu, 12 Dec 2024 15:07:35 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 23434494
- current block number: 23434494

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23434494 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      description:
+        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
      issuedPermissions:
+        [{"permission":"configure","target":"0xCafEf00d348Adbd57c37d1B77e0619C6244C6878","via":[]},{"permission":"configure","target":"0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."}]
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

Generated with discovered.json: 0x00664097a7d1c6ccf5f2824f04f0e0b2a9ae3ff2

# Diff at Sun, 08 Dec 2024 11:45:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 23259798
- current block number: 23434494

## Description

BlobstreamMultisig signer change.

## Watched changes

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      values.$members.4:
-        "0xA3fC931613a4E2440a199d47B0076e8b85F33099"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0xdff17458ff82de3da00478196bff62b936e8b1a3

# Diff at Wed, 04 Dec 2024 10:43:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 22391049
- current block number: 23259798

## Description

Raise the max commitment size by one order of magnitude to 10000 celestia blocks.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      sourceHashes.1:
-        "0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"
+        "0x13872c9ceb24afa3e0819f2d13957fab016c612859cc40f542ee250f53e03dac"
      values.$implementation:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.3:
+        ["2024-12-02T19:09:23.000Z","0x972e1b10b3fd4c52bbd75c6215f12438b15229c9f609ad42273eb3985d8e4767",["0x46EbfC399d3913BB9b99E73675722417F9c5d416"]]
      values.$upgradeCount:
-        3
+        4
      values.DATA_COMMITMENT_MAX:
-        1000
+        10000
    }
```

## Source code changes

```diff
.../base/{.flat@22391049 => .flat}/Blobstream/SP1Blobstream.sol         | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x547b05a005c5552c4a89ebadd7bc9431733e3279

# Diff at Thu, 28 Nov 2024 11:03:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 22391049
- current block number: 22391049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22391049 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x28abb780d680f93714d4d31505503f243e16f77a

# Diff at Thu, 14 Nov 2024 08:04:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 22016709
- current block number: 22391049

## Description

Updated verifier discovery, old ones frozen (zk cat updated).

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4.1:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22016709 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
+        "0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3:
+        ["0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08.
      values.oldVerifier4:
+        ["0x1764C29FBd94865198588f10FC75D4f6636d158d",false]
      fieldMeta.oldVerifier3:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01."}
      fieldMeta.oldVerifier4:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-08."}
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

Generated with discovered.json: 0x7b8f34d0c4647f4ec77d29bffed9a57fc20f7597

# Diff at Tue, 05 Nov 2024 16:06:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 20544837
- current block number: 22016709

## Description

Verifier program verification key changed, verifier implementation is the same.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.blobstreamProgramVkey:
-        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
+        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
    }
```

Generated with discovered.json: 0xcd8832638f2d8634b9cd1967ae4751cc49a98b29

# Diff at Mon, 21 Oct 2024 11:13:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20544837
- current block number: 20544837

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20544837 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
      values.$pastUpgrades.2.1:
-        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
+        "0xd2efcdcc2ae2c8725a9d68bcce93edf7f4e2c5326ec75e9aea9cbdb6dfc7c6d3"
      values.$pastUpgrades.1.2:
+        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
      values.$pastUpgrades.1.1:
-        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
+        "0xcc77a9f79cc2dc869a5b2afcb9abe14014680e03797e00244a4580deb278eee8"
      values.$pastUpgrades.0.2:
+        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
      values.$pastUpgrades.0.1:
-        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
+        "0x4549f6dd026054361c6ec3372f446d9a594205d6a2681001f4d3567ef55d8d73"
    }
```

Generated with discovered.json: 0x6bf6fde301170cfdd9f8a0308f2fee00cab96f7b

# Diff at Mon, 14 Oct 2024 10:59:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20544837
- current block number: 20544837

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20544837 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d) {
    +++ description: None
      sourceHashes:
+        ["0xeb051b88e210e28fd696d01528e3cc9a131a08d69e20bf1983ac8d90dd9b1f4f"]
    }
```

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sourceHashes:
+        ["0x503f175ab3807eb7f958512d3dc2501bb2ab62286bcd8cd1f85d7d24b2ce90cc"]
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      sourceHashes:
+        ["0xc651adcd746b8794c5b6c418aeb146f1b13b207cc9d2712ba66a42bd4b29af37"]
    }
```

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc) {
    +++ description: None
      sourceHashes:
+        ["0xabb95b2d66749481071b7a258a3305198760dbaf12d7411cfaba5e4c26cc3a65"]
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      sourceHashes:
+        ["0xa148b7dcb3095dbb66f26d1428d50a59e1cd1384c80b0efe88efead152e6ebe2"]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"]
    }
```

```diff
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
    +++ description: None
      sourceHashes:
+        ["0x6e3bfeae0d549b79decfd956f551a8aeac66523cdd66da389ef55eb56ef72aac"]
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract FunctionVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6) {
    +++ description: None
      sourceHashes:
+        ["0xa56a53a05b7201f86a6987201b5a99cb4f9e7fba1060ecf8290515990b6f6b5e"]
    }
```

```diff
    contract FunctionVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44) {
    +++ description: None
      sourceHashes:
+        ["0x205b995df6bf32d996abb3bf617459c0102ba36f15f7ec1b12994eba3346f12f"]
    }
```

Generated with discovered.json: 0xf89ccb2be12746b4bec38d624d3e30104798ce9c

# Diff at Wed, 02 Oct 2024 14:23:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20504067
- current block number: 20544837

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20504067 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-17T04:53:27.000Z",["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]],["2024-03-18T01:20:33.000Z",["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]],["2024-08-26T18:52:49.000Z",["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]]]
    }
```

Generated with discovered.json: 0x048bcfad6829c5ec110d72088a643485686bebb8

# Diff at Tue, 01 Oct 2024 15:44:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 19672913
- current block number: 20504067

## Description

New verifier.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2.1:
-        false
+        true
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

## Source code changes

```diff
...-0x1764C29FBd94865198588f10FC75D4f6636d158d.sol | 1428 ++++++++++++++++++++
 1 file changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19672913 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.verifier.description:
-        "The verifier contract address for SP1, and whether it is frozen (true if frozen)."
+        "The prover contract address for SP1, and whether it is frozen (true if frozen)."
      fieldMeta.oldVerifier2:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
    }
```

Generated with discovered.json: 0x34ba33bde71ea0790a85be3b1105b31083a46990

# Diff at Thu, 12 Sep 2024 16:05:19 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 19672913
- current block number: 19672913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19672913 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]}}
    }
```

Generated with discovered.json: 0xd4c0029f645491b799b2a19d83254da94077c26d

# Diff at Thu, 12 Sep 2024 09:59:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 19369265
- current block number: 19672913

## Description

Renames.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19369265 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      template:
-        "blobstream/SP1SuccinctGateway"
+        "succinct/SP1SuccinctGateway"
      values.blobstreamVerifier:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      values.blobstreamVerifierOld:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.blobstreamVerifierOld:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.blobstreamVerifier:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.oldVerifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.verifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      template:
-        "blobstream/SP1Blobstream"
+        "succinct/SP1Blobstream"
    }
```

Generated with discovered.json: 0xa0600aa5c75af52b962365da504459ed78d5249a

# Diff at Thu, 05 Sep 2024 09:18:05 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6ec5206203571575116cf743c30b8a7c71ceafbb block: 19114152
- current block number: 19369265

## Description

New verifier version. Gateway route to old verifier route is frozen, and new route is added with identifier 0xc865c1b6.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld.1:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

## Source code changes

```diff
...-0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc.sol | 1427 ++++++++++++++++++++
 ...0xc350F063C13a3Ca21331610fe159E697a5c9c2FB.sol} |    0
 2 files changed, 1427 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19114152 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",false]
      template:
+        "blobstream/SP1SuccinctGateway"
      fieldMeta:
+        {"blobstreamVerifierOld":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."},"blobstreamVerifier":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}}
    }
```

Generated with discovered.json: 0x1bc2d20712a069d6f9e52125dee9bde59b48e33f

# Diff at Fri, 30 Aug 2024 11:34:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@15092f43b0444977eaee21a17c064e8a6944b864 block: 14061228
- current block number: 19114152

## Description

- The SP1 Verifier Gateway address is set in the Blobstream contract, and replaces the SuccinctGateway for routing to the correct verifier. The Guardian can update the SP1VerifierGateway address.
- RequestHeaderRange and NextHeaderRange functions deprecated, together with their functionIds. FunctionIds were previously used when calling the SuccinctGateway to identify which verifier to use for proof verification. Now the verifier selector is contained in the first 4 bytes of the proof.
- Verifier program verification key is now stored in the Blobstream contract and it is used in the verifier for proof verification. It can be updated by the Guardian.
- CommitHeaderRange has now a permissioned mode, due to onlyApprovedRelayer modifier. Guardian can approve authorised relayers and toggle the permissioned mode through checkRelayer updates (true for permissioned, false for permissionless).

- SP1VerifierGateway:  contract that verifies proofs by routing to the correct verifier based on the verifier selector contained in the first 4 bytes of the proof. It additionally checks that to see that the verifier route is not frozen. The owner of the contract can add and freeze routes.

## Watched changes

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$implementation:
-        "0xfb19439fBa9f16aA720be6bE0e53465a9733C964"
+        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$upgradeCount:
-        2
+        3
      values.DATA_COMMITMENT_MAX:
-        10000
+        1000
      values.gateway:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId:
-        "0x46132c86ed84fdc655528f80f9291dd3116b04902036b96925edc78bbf52b8ca"
      values.nextHeaderFunctionId:
-        "0x2ce8ca4f509cb09415b5a6ca6afa265571dac0b9f6ddb46f487e017fec71cf25"
      values.VERSION:
-        "0.1.0"
+        "1.1.0"
      values.blobstreamProgramVkey:
+        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
      values.checkRelayer:
+        true
      values.gateway_deprecated:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId_deprecated:
+        "0x46132c86ed84fdc655528f80f9291dd3116b04902036b96925edc78bbf52b8ca"
      values.isRelayerApproved:
+        true
      values.nextHeaderFunctionId_depcrecated:
+        "0x2ce8ca4f509cb09415b5a6ca6afa265571dac0b9f6ddb46f487e017fec71cf25"
      values.verifier:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      errors:
-        {"isRelayerApproved":"Execution reverted"}
      derivedName:
-        "BlobstreamX"
+        "SP1Blobstream"
    }
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

## Source code changes

```diff
.../Blobstream/SP1Blobstream.sol}                  |  431 +++---
 .../blobstream/base/.flat/SP1Verifier.sol          | 1429 ++++++++++++++++++++
 .../blobstream/base/.flat/SuccinctGatewaySP1.sol   |  230 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  952 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 5 files changed, 2888 insertions(+), 188 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      name:
-        "BlobstreamXMultisig"
+        "BlobstreamMultisig"
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      name:
-        "BlobstreamX"
+        "Blobstream"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"]}}
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "blobstream/SP1Blobstream"
      errors:
+        {"isRelayerApproved":"Execution reverted"}
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "SuccinctMultisig"
+        "SuccinctGatewayMultisig"
    }
```

Generated with discovered.json: 0x14340fa4862502db24894812cdb94c8b61760717

# Diff at Fri, 23 Aug 2024 09:57:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x804c9139ebaa21377c708ddf285fb1ef9f61c6dd

# Diff at Wed, 21 Aug 2024 10:07:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x8a16c522e63785ff3d9daf2c6fe3cfa751a29239

# Diff at Fri, 09 Aug 2024 10:13:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract SuccinctMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x9d5433ede5f09e4abfa6b2718f3d959c01c645fa

# Diff at Tue, 30 Jul 2024 11:17:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 14061228
- current block number: 14061228

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14061228 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x4b9f511ca9887f4a75d7e433e5398f5d19058446

# Diff at Sun, 05 May 2024 12:23:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 12726128
- current block number: 14061228

## Description

A prover / relayer is added to the Succictgateway. It is whitelisted for both functionIds (headerRange and nextHeader) of BlobstreamX.
Same change as on Arbitrum.

## Watched changes

```diff
    contract BlobstreamXMultisig (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: Admin of the BlobstreamX contract. VerifierOwner of the BlobstreamX functionIDs in the SuccinctGateway.
      values.nonce:
-        6
+        7
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers.1:
+        "0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12726128 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract FunctionVerifier (0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529)
    +++ description: None
```

```diff
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "BlobstreamXMultisig"
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      values.headerRangeVerifier:
-        "0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529"
+        "0xF2415C44F47983F7dD22003B46A034B1F1d04e44"
      values.nextHeaderVerifier:
-        "0xeEadfac6E689443d237B10F78e8424579e2e0177"
+        "0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.headerRangeVerifierOwner:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.nextHeaderVerifierOwner:
+        "0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "SuccinctMultisig"
    }
```

```diff
-   Status: DELETED
    contract FunctionVerifier (0xeEadfac6E689443d237B10F78e8424579e2e0177)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xF2415C44F47983F7dD22003B46A034B1F1d04e44)
    +++ description: None
```

Generated with discovered.json: 0xf4ce8849740c932ad0e0f9eb9bc6e239c3ae5dd0

# Diff at Thu, 04 Apr 2024 14:40:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0a9c7969ad2049584096c517179c4a4990f064bd block: 12672692
- current block number: 12726128

## Description

Threshold config related change. Onchain unchanged.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12672692 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x2aff9bf22d03c54504e3e165ecb551663cc6317b

# Diff at Wed, 03 Apr 2024 08:59:00 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 12672692

## Description

Initial discovery

## Initial discovery

```diff
+   Status: CREATED
    contract FunctionVerifier (0x294A466b50672029D0a8d7ad7E00AEfDeaE9f529)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x6ABa5D2084362038C9640a8851ff3b8BCbA81Ca6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0xeEadfac6E689443d237B10F78e8424579e2e0177)
    +++ description: None
```
