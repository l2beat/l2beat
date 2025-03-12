Generated with discovered.json: 0x941286c1b0a4480b724c60d8401e4ffeb0a4b141

# Diff at Tue, 04 Mar 2025 10:40:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21635855
- current block number: 21635855

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      sinceBlock:
+        20235805
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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      sinceBlock:
+        19806461
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

Generated with discovered.json: 0x9d489ebdf0e1980b4299bc1541af8509618dbdb2

# Diff at Tue, 11 Feb 2025 14:13:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5604bedbb0dabec83d300e0abeb3d8685929c5d3 block: 21635855
- current block number: 21635855

## Description

Made succinct gateway description more generic (to be used not only for blobstream).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

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

Generated with discovered.json: 0x0c64fc63bbdd5cad4a68f330fd16514d41b012ab

# Diff at Tue, 04 Feb 2025 12:33:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21635855
- current block number: 21635855

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
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
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xd24662c1c9de18087685bcf760828453cabcc7e4

# Diff at Mon, 20 Jan 2025 11:10:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635855
- current block number: 21635855

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635855 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      issuedPermissions.2.target:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.2.to:
+        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.1.target:
-        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
      issuedPermissions.1.to:
+        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
      issuedPermissions.1.description:
+        "can call commitHeaderRange() to commit block ranges to the Vector contract."
      issuedPermissions.0.target:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.0.to:
+        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      issuedPermissions.0.description:
+        "can freeze the Vector contract and update the list of authorized relayers."
    }
```

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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.1.from:
+        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.0.target:
-        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
      receivedPermissions.0.from:
+        "0x02993cdC11213985b9B13224f3aF289F03bf298d"
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
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      receivedPermissions.0.from:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

Generated with discovered.json: 0x597df2b9f6a80e61eec7ffdfe64a32b78a1ba709

# Diff at Thu, 16 Jan 2025 12:09:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3513cb068688b9fa7f9ddd40447f5f70d088c2cf block: 21630305
- current block number: 21635855

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
discovery. Values are for block 21630305 (main branch discovery), not current.

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

Generated with discovered.json: 0x4dacf0edbf35077522b521884aad81792a036d93

# Diff at Wed, 15 Jan 2025 13:53:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21585288
- current block number: 21630305

## Description

New relayer, new programVkey.

## Watched changes

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      values.isRelayerApproved:
-        false
+        true
      values.vectorXProgramVkey:
-        "0x00285180a989ed2d6aa8194220690d0d45f2907535d3d3c09e4cb29f6dbe3d4d"
+        "0x00d0279ddadaccdbdb6142981d3830f9ada20ed4e2925ed186ae2be5806e3402"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585288 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      issuedPermissions.1.target:
-        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
+        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
      issuedPermissions.0.target:
-        "0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d"
+        "0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"
      values.isRelayerApproved:
-        true
+        false
      values.relayers.0:
-        "0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"
+        "0xC2ADCfccEE33A417064d1A45D3b202DE6d9fA474"
    }
```

Generated with discovered.json: 0x69c3f8489c736f7f92feded9f8328a32067bed91

# Diff at Thu, 09 Jan 2025 06:59:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21386151
- current block number: 21585288

## Description

AvailMultisig single signer rotated.

## Watched changes

```diff
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      values.$members.6:
-        "0xb9274De2305B377b437a9297D6c84eBD69f7aaCE"
+        "0x4983A5ebE79c0570aa368cE84f281A8aAc50cE4d"
    }
```

Generated with discovered.json: 0x3623d610bce0f7225855a7008102a289a89e0d0d

# Diff at Thu, 12 Dec 2024 15:07:34 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@675c2fed2e6fd64977d53add75705c1380efedb2 block: 21184939
- current block number: 21386151

## Description

Make Vector discovery-driven

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184939 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.
      values.guardians:
+        ["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]
      values.timelocks:
+        ["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]
      description:
+        "The Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum."
      issuedPermissions:
+        [{"permission":"configure","target":"0x44eB418A966ff47f5AF6f48AEa6Afde0bf193a8d","via":[]},{"permission":"configure","target":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","via":[]},{"permission":"upgrade","target":"0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666","via":[]}]
    }
```

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
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x02993cdC11213985b9B13224f3aF289F03bf298d","description":"can freeze the Vector contract and update the list of authorized relayers."},{"permission":"upgrade","target":"0x02993cdC11213985b9B13224f3aF289F03bf298d"}]
    }
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

Generated with discovered.json: 0x23f25fadc0df50db455a9050798d68335f58768a

# Diff at Thu, 28 Nov 2024 11:03:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21184939
- current block number: 21184939

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184939 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x6114f6566c4a9860fe0e5395e9f5826074d19140

# Diff at Thu, 14 Nov 2024 09:08:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 21122554
- current block number: 21184939

## Description

New verifier, zk catalog updated.

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
discovery. Values are for block 21122554 (main branch discovery), not current.

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
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
    +++ description: None
      name:
-        "SP1Verifier_OLD"
+        "SP1Verifier"
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

Generated with discovered.json: 0x17e3f29f3916d42155d9374428d10c5e6c6b7eb2

# Diff at Tue, 05 Nov 2024 16:10:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21022907
- current block number: 21122554

## Description

Verifier program verification key changed, verifier implementation is the same.

## Watched changes

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.vectorXProgramVkey:
-        "0x0003c5cf9260fcef3df6c79870952e1ce2f57595ac042ea868c9cbbcab548cf8"
+        "0x00285180a989ed2d6aa8194220690d0d45f2907535d3d3c09e4cb29f6dbe3d4d"
    }
```

Generated with discovered.json: 0xcccd51fbb01c8fd230c5f00ddbeb7a651eae76f6

# Diff at Tue, 22 Oct 2024 18:27:40 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20985031
- current block number: 21022907

## Description

Changed Vector name for consistency with blobstream.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985031 (main branch discovery), not current.

```diff
    contract Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      name:
-        "SP1Vector"
+        "Vector"
    }
```

Generated with discovered.json: 0xd280477a38c797769d7570dcd82e85f5e334b2f7

# Diff at Mon, 21 Oct 2024 11:11:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20985031
- current block number: 20985031

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985031 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"]
      values.$pastUpgrades.1.1:
-        ["0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"]
+        "0x13d7977b9fca12882ea6ba47ce1b20a87de540c358b5e260584e0d921e786f5e"
      values.$pastUpgrades.0.2:
+        ["0x2434564f3524b44258B11643729343Ef57D60989"]
      values.$pastUpgrades.0.1:
-        ["0x2434564f3524b44258B11643729343Ef57D60989"]
+        "0x6c2c609d7a13fbdad53b1530d34d740ffa36653f29b5f14220429d7c0d6a3ffc"
    }
```

Generated with discovered.json: 0x406b9eecd2307e8fc04062b629a3c8c3d9458e09

# Diff at Thu, 17 Oct 2024 11:37:36 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fe31a2a15a0974a7184aa64dcbcb48891916f4f9 block: 20878383
- current block number: 20985031

## Description

Gave name to Avail multisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878383 (main branch discovery), not current.

```diff
    contract AvailMultisig (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "AvailMultisig"
    }
```

Generated with discovered.json: 0x0651314515f38c5fb0ead4c76f7c53e53bc1f243

# Diff at Mon, 14 Oct 2024 10:57:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878383
- current block number: 20878383

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878383 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      sourceHashes:
+        ["0xca64a552160ec278e1bacf8ca23e8c71f49012ace91a33141b797451f4683731","0x0e469131222e34f50c12fe74205439de113446461e0fbd31fff1a43b081dbbeb"]
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
    contract GnosisSafe (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SP1Verifier_OLD (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
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

Generated with discovered.json: 0x7d9489c72ce965ec59331a95d7f397e78bb7e363

# Diff at Wed, 02 Oct 2024 14:22:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871625
- current block number: 20878383

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871625 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-04T21:23:47.000Z",["0x2434564f3524b44258B11643729343Ef57D60989"]],["2024-07-20T01:29:35.000Z",["0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"]]]
    }
```

Generated with discovered.json: 0x62904dc488f9c12751a30fa4fc056944696bdb3a

# Diff at Tue, 01 Oct 2024 15:45:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20735735
- current block number: 20871625

## Description

Vector proxy verified. New verifier.

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
 ...0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc.sol} |    0
 2 files changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735735 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      unverified:
-        true
    }
```

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

Generated with discovered.json: 0x6439fce17e3e9e6443d267d35aba6c3a3f3ca927

# Diff at Fri, 13 Sep 2024 08:14:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@db4bedcf90d9785b74ad29fd9c12386741eb1cd5 block: 20735735
- current block number: 20735735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735735 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xDEd0000E32f8F40414d3ab3a830f735a3553E18e","0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]}}
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666)
    +++ description: None
```

Generated with discovered.json: 0xc436404d20a195a814b6beef4caade0ec87eee63

# Diff at Thu, 12 Sep 2024 16:30:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 20735125
- current block number: 20735735

## Description

Update config to fetch relayers, ignore noisy values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735125 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.isRelayerApproved:
+        true
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "succinct/SP1Vector"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SuccinctGatewaySP1Multisig"
    }
```

Generated with discovered.json: 0x34e799459a1f0f40298882ee5a06293de6b3511b

# Diff at Thu, 12 Sep 2024 14:28:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20735125

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier_OLD (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```
