Generated with discovered.json: 0x3f67b26072aa483c7476dcd8acd7cb2b7bdc5c0c

# Diff at Tue, 04 Mar 2025 10:40:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 305996466
- current block number: 305996466

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305996466 (main branch discovery), not current.

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sinceBlock:
+        175545872
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        226384983
    }
```

```diff
    contract HeaderRangeVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      sinceBlock:
+        193139337
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      sinceBlock:
+        188141651
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      sinceBlock:
+        190629615
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      sinceBlock:
+        191198934
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        245028307
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        266979384
    }
```

```diff
    contract SuccinctGatewayMultisig (0xdC00f2469023a7b0b1D5b6abE2F736F90955e7F3) {
    +++ description: None
      sinceBlock:
+        69837457
    }
```

```diff
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        291720238
    }
```

```diff
    contract NextHeaderVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      sinceBlock:
+        193139692
    }
```

Generated with discovered.json: 0xab070335bf656a277b62c714f8192d4ed60b43cb

# Diff at Fri, 14 Feb 2025 14:06:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 298391608
- current block number: 305996466

## Description

made template more general to fit other projects.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298391608 (main branch discovery), not current.

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

Generated with discovered.json: 0x3ea0c741e72e31ba1ff94af21ec3f8113b4dea90

# Diff at Wed, 12 Feb 2025 09:05:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 298391608
- current block number: 298391608

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298391608 (main branch discovery), not current.

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      name:
-        ""
+        "SP1Verifier"
    }
```

Generated with discovered.json: 0x522856152af318b4b2449a97eb8b305cadcb435c

# Diff at Tue, 04 Feb 2025 12:33:53 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 298391608
- current block number: 298391608

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298391608 (main branch discovery), not current.

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
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      receivedPermissions.0.permission:
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
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe01368d776dbe1537f65b3e696dc57631eeab2c0

# Diff at Thu, 23 Jan 2025 09:36:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 295956426
- current block number: 298391608

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

Generated with discovered.json: 0x09025dd2bd5e6d3c8d7fe47ac565179d0073fd06

# Diff at Mon, 20 Jan 2025 11:10:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 295956426
- current block number: 295956426

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 295956426 (main branch discovery), not current.

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
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
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
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.3.target:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.3.to:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.2.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.to:
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
      issuedPermissions.1.target:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.1.to:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
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
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0xf4f7a07aa780a1e95f0e748cb84b132c3f2d4eb8

# Diff at Mon, 20 Jan 2025 09:25:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 295956426
- current block number: 295956426

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 295956426 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      fieldMeta.headerRangeProvers.type:
+        "PERMISSION"
      fieldMeta.nextHeaderProvers.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0xb9ccffd6d2e21579c4c48259739aa72df6b91bdd

# Diff at Thu, 16 Jan 2025 12:09:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 295640184
- current block number: 295956426

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
discovery. Values are for block 295640184 (main branch discovery), not current.

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
    contract  (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

```diff
+   Status: CREATED
    contract  (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: None
```

Generated with discovered.json: 0xc85fe843d7daa3f1271d257125f4cc727226bf75

# Diff at Wed, 15 Jan 2025 09:47:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 293252435
- current block number: 295640184

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

Generated with discovered.json: 0xdec784644d4c02d5cdca179e038695d5b0d47320

# Diff at Wed, 08 Jan 2025 11:10:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 282615739
- current block number: 293252435

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
discovery. Values are for block 282615739 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.4:
-        {"permission":"upgrade","target":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","via":[]}
      issuedPermissions.3.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
      issuedPermissions.2.target:
-        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.1.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
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

Generated with discovered.json: 0xc37c9a7827e8491dac4b8ea540fa17c6abe038e5

# Diff at Thu, 19 Dec 2024 11:57:29 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@1e850509cf42792486a5c52f33b2bb56c3de2df1 block: 282615739
- current block number: 282615739

## Description

Discovery rerun on the same block number with only config-related changes.
Properly resolve $admin.
Resolve old Gateway owner's permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 282615739 (main branch discovery), not current.

```diff
    contract HeaderRangeVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      name:
-        "headerRangeVerifier"
+        "HeaderRangeVerifier"
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
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794","description":"can freeze the bridge contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"}]
    }
```

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        ["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]
      values.isRelayerApproved:
-        true
      values.relayers.2:
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
      values.guardians:
+        ["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]
      values.isRelayer1Approved:
+        true
      values.isRelayer2Approved:
+        true
      values.isRelayer3Approved:
+        true
      description:
+        "The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here."
      issuedPermissions:
+        [{"permission":"configure","target":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","via":[]},{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","via":[]},{"permission":"configure","target":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","via":[]},{"permission":"upgrade","target":"0x738a9b55304f9fcF776B3BA285e50c0f9eF77997","via":[]}]
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
    contract NextHeaderVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      name:
-        "nextHeaderVerifier"
+        "NextHeaderVerifier"
    }
```

Generated with discovered.json: 0xd39227606f84756fb081b73d26ca8508301b491e

# Diff at Thu, 12 Dec 2024 15:07:34 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 282615739
- current block number: 282615739

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 282615739 (main branch discovery), not current.

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
    contract  (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
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
    contract  (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"can verify proofs for the header range [latestBlock, targetBlock] proof."}]
    }
```

Generated with discovered.json: 0x58b1c233533fe3790d77fb27e2f53ec183202e79

# Diff at Tue, 10 Dec 2024 11:09:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 282615739
- current block number: 282615739

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 282615739 (main branch discovery), not current.

```diff
    contract headerRangeVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "headerRangeVerifier"
    }
```

```diff
    contract nextHeaderVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "nextHeaderVerifier"
    }
```

Generated with discovered.json: 0x6e041fc1949d56d85654cf090fe0c5fa96b0cb79

# Diff at Sun, 08 Dec 2024 11:35:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 281224085
- current block number: 282615739

## Description

BlobstreamMultisig signer change.

## Watched changes

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      values.$members.3:
-        "0xA3fC931613a4E2440a199d47B0076e8b85F33099"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0x39570decd9dd2f479dc1a9da99602516bacfa3ad

# Diff at Wed, 04 Dec 2024 10:42:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 274315505
- current block number: 281224085

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
+        ["2024-12-02T19:09:05.000Z","0x07dbff15e24a8c124a927a2881cb4d471ace180488a56a56b43b47d1da68a130",["0x46EbfC399d3913BB9b99E73675722417F9c5d416"]]
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
.../arbitrum/{.flat@274315505 => .flat}/Blobstream/SP1Blobstream.sol    | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0xbdefc05aef6d5f51d59ef8704453de4bb799375e

# Diff at Thu, 28 Nov 2024 11:03:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 274315505
- current block number: 274315505

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 274315505 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x942a777848cc3746f394cf60639a0f944635f434

# Diff at Thu, 14 Nov 2024 08:04:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 271340080
- current block number: 274315505

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
discovery. Values are for block 271340080 (main branch discovery), not current.

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
    contract  (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

Generated with discovered.json: 0xdb2b8749d56762083d1f791fd5e7d78856d33900

# Diff at Tue, 05 Nov 2024 16:07:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 259634526
- current block number: 271340080

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

Generated with discovered.json: 0x1f792e6a4a7bdeb8d78e2da95b143a25b0d6353c

# Diff at Mon, 21 Oct 2024 11:13:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 259634526
- current block number: 259634526

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 259634526 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
      values.$pastUpgrades.2.1:
-        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
+        "0x746e21628ccec4d5b4da96595f852a6398defcc360cb9f13aa2d84ebe4e7403f"
      values.$pastUpgrades.1.2:
+        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
      values.$pastUpgrades.1.1:
-        ["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]
+        "0xf45e346ddbedef1ea3f828954c979adcb205b4b1c0ca72e49e7e2ef5b1c43192"
      values.$pastUpgrades.0.2:
+        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
      values.$pastUpgrades.0.1:
-        ["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]
+        "0x58059198a17ae1d8dd73b4d0f0ce7169f4e55d901a8fea59b4ef12d005a41f0a"
    }
```

Generated with discovered.json: 0x59c2f6bb3798716fe1d3280176a3368a0ed60606

# Diff at Mon, 14 Oct 2024 10:58:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 259634526
- current block number: 259634526

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 259634526 (main branch discovery), not current.

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
    contract FunctionVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3) {
    +++ description: None
      sourceHashes:
+        ["0x205b995df6bf32d996abb3bf617459c0102ba36f15f7ec1b12994eba3346f12f"]
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
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
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
    contract FunctionVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C) {
    +++ description: None
      sourceHashes:
+        ["0xa56a53a05b7201f86a6987201b5a99cb4f9e7fba1060ecf8290515990b6f6b5e"]
    }
```

Generated with discovered.json: 0xa8fac87e1d40486f32dce5b155f9a6e3a8bc98dc

# Diff at Wed, 02 Oct 2024 14:23:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 259311089
- current block number: 259634526

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 259311089 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-17T04:51:20.000Z",["0x7C3A9b466FF5c02582fa32d4aD1b2Cb431fB7c9b"]],["2024-03-18T01:19:36.000Z",["0xfb19439fBa9f16aA720be6bE0e53465a9733C964"]],["2024-08-26T18:53:22.000Z",["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]]]
    }
```

Generated with discovered.json: 0x7c625db0b4e4f64e52d05c87e29ca4fe2a1a4e54

# Diff at Tue, 01 Oct 2024 15:44:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 252706992
- current block number: 259311089

## Description

New verifier used, oldVerifier2 frozen.

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
 ...0xc350F063C13a3Ca21331610fe159E697a5c9c2FB.sol} |    0
 2 files changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 252706992 (main branch discovery), not current.

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

Generated with discovered.json: 0x56c0008468b22a60e944d905106604276ae22d99

# Diff at Thu, 12 Sep 2024 16:05:08 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 252706992
- current block number: 252706992

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 252706992 (main branch discovery), not current.

```diff
    contract Blobstream (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]}}
    }
```

Generated with discovered.json: 0x3b8d2273e95552c643dd25b1e3aa0a2f3aae8ed8

# Diff at Thu, 12 Sep 2024 09:59:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 250294365
- current block number: 252706992

## Description

Renames.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 250294365 (main branch discovery), not current.

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

Generated with discovered.json: 0x27d781503a7821fdb523c9be91443e9eca1c3527

# Diff at Thu, 05 Sep 2024 09:17:59 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6ec5206203571575116cf743c30b8a7c71ceafbb block: 248266616
- current block number: 250294365

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
    contract  (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 248266616 (main branch discovery), not current.

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

Generated with discovered.json: 0x5b2c360f19f29887785ca845f03f2e00ce253980

# Diff at Fri, 30 Aug 2024 11:34:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@15092f43b0444977eaee21a17c064e8a6944b864 block: 208089280
- current block number: 248266616

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
-        "0x949dc389c82c63394889813be437513ebc5d06f43bbc9c1e2eb4b791faade1a0"
      values.nextHeaderFunctionId:
-        "0x044611c8d01cf88e09811f3270a654e7faf319e96b38f3dd7f9d218c8bb4d0ef"
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
+        "0x949dc389c82c63394889813be437513ebc5d06f43bbc9c1e2eb4b791faade1a0"
      values.isRelayerApproved:
+        true
      values.nextHeaderFunctionId_depcrecated:
+        "0x044611c8d01cf88e09811f3270a654e7faf319e96b38f3dd7f9d218c8bb4d0ef"
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
 .../blobstream/arbitrum/.flat/SP1Verifier.sol      | 1429 ++++++++++++++++++++
 .../arbitrum/.flat/SuccinctGatewaySP1.sol          |  230 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  952 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 5 files changed, 2888 insertions(+), 188 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
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
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"]}}
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

Generated with discovered.json: 0x1155d09f610a62ea87831e6583719e50f97da383

# Diff at Fri, 23 Aug 2024 09:56:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xc3b7e205dc04bbd75b04fd895e2c37c04afad1ba

# Diff at Wed, 21 Aug 2024 10:07:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamX (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x4c7a20502a211b09faf6b16b6ceec3ab43466504

# Diff at Fri, 09 Aug 2024 10:13:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x91D456f83f4a117B07866fdEdC29306f7E974e15","0x793979789Ec179183E396e76c1e241bE0c9eE899","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x91D456f83f4a117B07866fdEdC29306f7E974e15","0x793979789Ec179183E396e76c1e241bE0c9eE899","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf"]
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

Generated with discovered.json: 0x4fca5e622ef070699be15d6c5c980cac2309d296

# Diff at Tue, 30 Jul 2024 11:17:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 208089280
- current block number: 208089280

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 208089280 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x7285e99c4ab1b39cc0094977b44e197d8e3bfdec

# Diff at Sun, 05 May 2024 12:28:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@306760396dc5133ea2ec932bf81b9f36e88dbdd3 block: 197829534
- current block number: 208089280

## Description

A prover / relayer is added to the Succictgateway. It is whitelisted for both functionIds (headerRange and nextHeader) of BlobstreamX.
Same change as on Base.

## Watched changes

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

```diff
    contract BlobstreamXMultisig (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: Admin of the BlobstreamX contract. VerifierOwner of the BlobstreamX functionIDs in the SuccinctGateway.
      values.nonce:
-        6
+        7
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 197829534 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.headerRangeProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.headerRangeVerifierOwner:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
+++ description: List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX.
+++ type: PERMISSION
+++ severity: LOW
      values.nextHeaderProvers:
+        ["0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"]
      values.nextHeaderVerifierOwner:
+        "0x738a9b55304f9fcF776B3BA285e50c0f9eF77997"
    }
```

```diff
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "BlobstreamXMultisig"
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

Generated with discovered.json: 0xa83178f53f6a63952fe8b5488d76a52bd121cead

# Diff at Fri, 05 Apr 2024 11:41:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6e27442909c4cbe26f03c6413f64274ff68aa0d7 block: 197243619
- current block number: 197829534

## Description

No changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 197243619 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997) {
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

Generated with discovered.json: 0x2990628bad137a08bd1e6cf7186a0989a1dc8319

# Diff at Wed, 03 Apr 2024 18:46:58 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 197243619

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FunctionVerifier (0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x738a9b55304f9fcF776B3BA285e50c0f9eF77997)
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
    contract FunctionVerifier (0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C)
    +++ description: None
```
