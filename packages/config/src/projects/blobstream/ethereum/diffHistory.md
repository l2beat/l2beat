Generated with discovered.json: 0xe6a1d8e199420f7a3b2301fcdc7977245eaf4da8

# Diff at Tue, 04 Mar 2025 10:39:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21686332
- current block number: 21686332

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686332 (main branch discovery), not current.

```diff
    contract NextHeaderVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      sinceBlock:
+        20027571
    }
```

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sinceBlock:
+        19115866
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        20233410
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      sinceBlock:
+        19115872
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      sinceBlock:
+        20027685
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      sinceBlock:
+        20027494
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        20573748
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      sinceBlock:
+        16828272
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        21031662
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        21547470
    }
```

```diff
    contract HeaderRangeVerifier (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E) {
    +++ description: None
      sinceBlock:
+        20027559
    }
```

Generated with discovered.json: 0xc1bafb5831ea7f304925c6b267658445062e91b8

# Diff at Tue, 11 Feb 2025 14:13:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5604bedbb0dabec83d300e0abeb3d8685929c5d3 block: 21686332
- current block number: 21686332

## Description

Made succinct gateway description more generic (to be used not only for blobstream).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686332 (main branch discovery), not current.

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

Generated with discovered.json: 0x099ec9c5187e14fc6fad9484fabeee1b07479471

# Diff at Tue, 04 Feb 2025 12:30:50 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21686332
- current block number: 21686332

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686332 (main branch discovery), not current.

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
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
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
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions.0.permission:
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
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
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

Generated with discovered.json: 0x16c2ce3a509897f80928eb58665e33b2cee953dc

# Diff at Thu, 23 Jan 2025 09:36:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 21635651
- current block number: 21686332

## Description

blobstreamProgramVkey updated: The new key is not found anywhere yet, the old one was associated with v4.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
+        "0x00b6c8c78a73630fae80e45b2888a00d9ab0cc05a77cd7c027446a6ae2289928"
    }
```

Generated with discovered.json: 0xfd8c7ecff1a061e92b4848378cee6b1205033e35

# Diff at Mon, 20 Jan 2025 11:09:19 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635651
- current block number: 21635651

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635651 (main branch discovery), not current.

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
-        "0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0"
      issuedPermissions.0.to:
+        "0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0"
      issuedPermissions.0.description:
+        "can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.3.target:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.3.to:
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.2.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.to:
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.2.description:
+        "it is a 'Relayer' and can call commitHeaderRange() to commit block ranges. Since adding and removing Relayers emits no events, there can be more relayers than are presented here."
      issuedPermissions.1.target:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.1.to:
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
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
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      receivedPermissions.1.from:
+        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      receivedPermissions.0.target:
-        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
      receivedPermissions.0.from:
+        "0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"
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
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
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

Generated with discovered.json: 0xf53eab3132787e0bcb46a499a4cfb935af3baa3c

# Diff at Mon, 20 Jan 2025 09:24:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21635651
- current block number: 21635651

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635651 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: Users could interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Now deprecated, SP1 is used instead.
      fieldMeta.headerRangeProvers.type:
+        "PERMISSION"
      fieldMeta.nextHeaderProvers.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x38336130d165bbbbafde106d7b0cc84281eaa0c3

# Diff at Thu, 16 Jan 2025 12:09:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21629081
- current block number: 21635651

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
discovery. Values are for block 21629081 (main branch discovery), not current.

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

Generated with discovered.json: 0xae65751f0532cda70552bc10859a5e05344a4db0

# Diff at Wed, 15 Jan 2025 09:47:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21579366
- current block number: 21629081

## Description

New Vkey: [v4](https://github.com/succinctlabs/sp1-blobstream/blob/89e058052c0b691898c5b56a62a6fa0270b31627/contracts/script/UpdateVkey.s.sol#L26).

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.blobstreamProgramVkey:
-        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
+        "0x00e30cadab0b8ad6a5f115c5131a14afce4ec4bbf8acf7c821951778a2d97660"
    }
```

Generated with discovered.json: 0x3fc6d16fd0bc56f6bef0d311321a3bb6e02d71f9

# Diff at Wed, 08 Jan 2025 11:10:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21435567
- current block number: 21579366

## Description

Remove relayer1 as it is no longer approved.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.isRelayer1Approved:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21435567 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      issuedPermissions.4:
-        {"permission":"upgrade","target":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","via":[]}
      issuedPermissions.3.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
      issuedPermissions.2.target:
-        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
+        "0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC"
      issuedPermissions.1.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"
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

Generated with discovered.json: 0xec90d7cd820c3213f5679fe9b3f7a5531f428661

# Diff at Thu, 19 Dec 2024 11:57:28 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@1e850509cf42792486a5c52f33b2bb56c3de2df1 block: 21357513
- current block number: 21435567

## Description

Discovery rerun on the same block number with only config-related changes.
Properly resolve $admin.
Resolve old Gateway owner's permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357513 (main branch discovery), not current.

```diff
    contract NextHeaderVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      name:
-        "nextHeaderVerifier"
+        "NextHeaderVerifier"
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
+        [{"permission":"configure","target":"0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0","via":[]}]
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here.
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        ["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]
      values.isRelayerApproved:
-        true
      values.relayers.2:
+        "0x9c0b0dbbae8a976ceea8c2a96f6d00c53839afdc"
      values.relayers.1:
+        "0x3243552f3bcbce720db6f5ad0c1b7cd15458392d"
      values.guardians:
+        ["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]
      values.isRelayer1Approved:
+        true
      values.isRelayer2Approved:
+        true
      values.isRelayer3Approved:
+        true
      description:
+        "The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and the destination chain. It specifies relayers that commit block ranges, but due to the lack of emitted events, there may be more relayers than are presented here."
      issuedPermissions:
+        [{"permission":"configure","target":"0x3243552F3BcbcE720Db6f5ad0C1B7cd15458392D","via":[]},{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","via":[]},{"permission":"configure","target":"0x9c0B0dBBAe8a976CEeA8C2A96F6D00c53839afDC","via":[]},{"permission":"upgrade","target":"0x8bF34D8df1eF0A8A7f27fC587202848E528018E6","via":[]}]
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe","description":"can freeze the bridge contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe"}]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x6c7a05e0AE641c6559fD76ac56641778B6eCd776","description":"can renounce and transfer ownership, add and remove default prover, set fee vault, and recover stuck ETH."}]
    }
```

```diff
    contract HeaderRangeVerifier (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E) {
    +++ description: None
      name:
-        "headerRangeVerifier"
+        "HeaderRangeVerifier"
    }
```

Generated with discovered.json: 0x6c31d7012ac6a6f2e93565687c3188ce01664396

# Diff at Thu, 12 Dec 2024 15:07:33 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 21357513
- current block number: 21357513

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357513 (main branch discovery), not current.

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

Generated with discovered.json: 0x6711f52bb7c3e867fca16392ebea36c7eb4152f6

# Diff at Tue, 10 Dec 2024 10:37:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21357513
- current block number: 21357513

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357513 (main branch discovery), not current.

```diff
    contract nextHeaderVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      name:
-        "FunctionVerifier"
+        "nextHeaderVerifier"
    }
```

```diff
    contract headerRangeVerifier (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E) {
    +++ description: None
      name:
-        ""
+        "headerRangeVerifier"
    }
```

Generated with discovered.json: 0x192b61dd04f6c257364807da8aea8986386d9358

# Diff at Sun, 08 Dec 2024 11:36:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21328604
- current block number: 21357513

## Description

BlobstreamMultisig signer change.

## Watched changes

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      values.$members.4:
-        "0xA3fC931613a4E2440a199d47B0076e8b85F33099"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0x5d5e8b89ea8fc6286182d1699103e9d882101c87

# Diff at Wed, 04 Dec 2024 10:41:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21184621
- current block number: 21328604

## Description

Raise the max commitment size by one order of magnitude to 10000 celestia blocks.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      sourceHashes.1:
-        "0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"
+        "0x13872c9ceb24afa3e0819f2d13957fab016c612859cc40f542ee250f53e03dac"
      values.$implementation:
-        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
+        "0x46EbfC399d3913BB9b99E73675722417F9c5d416"
      values.$pastUpgrades.2:
+        ["2024-12-02T19:08:47.000Z","0xcc2a77da632e84e5fb17e863ec744d5f0921b70c191487179dd9e28ab855a3be",["0x46EbfC399d3913BB9b99E73675722417F9c5d416"]]
      values.$upgradeCount:
-        2
+        3
      values.DATA_COMMITMENT_MAX:
-        1000
+        10000
    }
```

## Source code changes

```diff
.../ethereum/{.flat@21184621 => .flat}/Blobstream/SP1Blobstream.sol     | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0xa3ccb038f264b6b4cd3ff99683365ccd9a8fbc9f

# Diff at Thu, 28 Nov 2024 11:02:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21184621
- current block number: 21184621

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184621 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x3c8ca726c6b4c1ec9288d9eb6cc0d0b9ebac6855

# Diff at Thu, 14 Nov 2024 08:04:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21122534
- current block number: 21184621

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
discovery. Values are for block 21122534 (main branch discovery), not current.

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

Generated with discovered.json: 0x3559920eeb70540f587c5416dbefbb086792cf7a

# Diff at Tue, 05 Nov 2024 16:06:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 20878389
- current block number: 21122534

## Description

Verifier program verification key changed, verifier implementation is the same.

## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.blobstreamProgramVkey:
-        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
+        "0x00a6ea49173d4b0b544a24a5a7474e76d1fda8f0f7e541cbb294d2b7249d7bcb"
    }
```

Generated with discovered.json: 0x42d70b8b26b74662354fbbc6e987c17224c1e207

# Diff at Mon, 21 Oct 2024 11:04:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20878389
- current block number: 20878389

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878389 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
      values.$pastUpgrades.1.1:
-        ["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]
+        "0x2cbc956737b46bd304d04f3051a65e311686d35792c54c67030d0c5417e76508"
      values.$pastUpgrades.0.2:
+        ["0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"]
      values.$pastUpgrades.0.1:
-        ["0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"]
+        "0xf156e666fc403369415601ab683befc8e177f698b69a4c4c313706127ec18a86"
    }
```

Generated with discovered.json: 0x73284c80daff75185d27f61cc2ed114b8f7716df

# Diff at Mon, 14 Oct 2024 10:49:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878389
- current block number: 20878389

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878389 (main branch discovery), not current.

```diff
    contract FunctionVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      sourceHashes:
+        ["0xa56a53a05b7201f86a6987201b5a99cb4f9e7fba1060ecf8290515990b6f6b5e"]
    }
```

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
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"]
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
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
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x3a94a8b28edaa88a724e637b67fd3f1fc11e7976

# Diff at Wed, 02 Oct 2024 14:25:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871621
- current block number: 20878389

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871621 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-05T19:21:47.000Z",["0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"]],["2024-08-26T18:55:23.000Z",["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]]]
    }
```

Generated with discovered.json: 0xbaaadc999e15bab5458f9d03f1ac9cea3dd706c0

# Diff at Tue, 01 Oct 2024 15:45:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20733790
- current block number: 20871621

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
discovery. Values are for block 20733790 (main branch discovery), not current.

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

Generated with discovered.json: 0x3eadd19bf219e615506b7a4f6cc2e2b18262c27c

# Diff at Thu, 12 Sep 2024 16:04:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 20733790
- current block number: 20733790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733790 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]}}
    }
```

Generated with discovered.json: 0x284d08252aa2489c2c43f1a7fcee954f098d861a

# Diff at Thu, 12 Sep 2024 09:59:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 20683436
- current block number: 20733790

## Description

Renames.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20683436 (main branch discovery), not current.

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
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      template:
-        "blobstream/SP1Blobstream"
+        "succinct/SP1Blobstream"
    }
```

Generated with discovered.json: 0x10abadaa17757983f4466ea6755c97721a41100d

# Diff at Thu, 05 Sep 2024 09:18:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6ec5206203571575116cf743c30b8a7c71ceafbb block: 20641123
- current block number: 20683436

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
discovery. Values are for block 20641123 (main branch discovery), not current.

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

Generated with discovered.json: 0xe304a4299d879d9d83a90949b26d2781cd131aad

# Diff at Fri, 30 Aug 2024 11:34:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@15092f43b0444977eaee21a17c064e8a6944b864 block: 20218838
- current block number: 20641123

## Description

- The SP1 Verifier Gateway address is set in the Blobstream contract, and replaces the SuccinctGateway for routing to the correct verifier. The Guardian can update the SP1VerifierGateway address.
- RequestHeaderRange and NextHeaderRange functions deprecated, together with their functionIds. FunctionIds were previously used when calling the SuccinctGateway to identify which verifier to use for proof verification. Now the verifier selector is contained in the first 4 bytes of the proof.
- Verifier program verification key is now stored in the Blobstream contract and it is used in the verifier for proof verification. It can be updated by the Guardian.
- CommitHeaderRange has now a permissioned mode, due to onlyApprovedRelayer modifier. Guardian can approve authorised relayers and toggle the permissioned mode through checkRelayer updates (true for permissioned, false for permissionless).

- SP1VerifierGateway:  contract that verifies proofs by routing to the correct verifier based on the verifier selector contained in the first 4 bytes of the proof. It additionally checks that to see that the verifier route is not frozen. The owner of the contract can add and freeze routes.


## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$implementation:
-        "0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"
+        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$upgradeCount:
-        1
+        2
      values.DATA_COMMITMENT_MAX:
-        10000
+        1000
      values.gateway:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId:
-        "0xdb3232748ba9f2906d9d2ce97d2fac3963d4346de23c30521f346e10ddad82f7"
      values.nextHeaderFunctionId:
-        "0xf7ab2ac6f5ccf2da79050efcc0dbdb06d5ae05a332f58076aeac7fc8c73811fe"
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
+        "0xdb3232748ba9f2906d9d2ce97d2fac3963d4346de23c30521f346e10ddad82f7"
      values.isRelayerApproved:
+        true
      values.nextHeaderFunctionId_depcrecated:
+        "0xf7ab2ac6f5ccf2da79050efcc0dbdb06d5ae05a332f58076aeac7fc8c73811fe"
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
 .../blobstream/ethereum/.flat/SP1Verifier.sol      | 1429 ++++++++++++++++++++
 .../ethereum/.flat/SuccinctGatewaySP1.sol          |  230 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  952 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 5 files changed, 2888 insertions(+), 188 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      name:
-        "BlobstreamX"
+        "Blobstream"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]}}
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "blobstream/SP1Blobstream"
      errors:
+        {"isRelayerApproved":"Execution reverted"}
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      name:
-        "BlobstreamXMultisig"
+        "BlobstreamMultisig"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      name:
-        "SuccinctMultisig"
+        "SuccinctGatewayMultisig"
    }
```

Generated with discovered.json: 0xdff2e689e46248cfd5fbc9cdc194a60b93a1bf8c

# Diff at Fri, 23 Aug 2024 09:51:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x6eebfbd59cd1ce9f75fa84ec38c1fc51dbc81fee

# Diff at Wed, 21 Aug 2024 10:02:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0xfab91205fdc6c53d8cd592cc86b3839e173721ea

# Diff at Fri, 09 Aug 2024 10:08:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
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
    contract SuccinctMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
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

Generated with discovered.json: 0xcb79dcf1d50142e427f3184a7dc418e412ac8a5f

# Diff at Tue, 30 Jul 2024 11:11:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x48c882d83a8c23c8b1c61b255f6b2f15dda4addc

# Diff at Thu, 13 Jun 2024 21:20:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20085541

## Description

Initial mainnet BlobstreamX discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FunctionVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamXMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E)
    +++ description: None
```
