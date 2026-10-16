Generated with discovered.json: 0xa5e9caca8cfba61c584e8443cc7108a4ceb25bfa

# Diff at Fri, 16 Oct 2026 05:36:55 GMT:

- id: 3e77b31a
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08ad19bbcc6e7887cc77644c264a2a97a221bc94 block: 1791882651
- current timestamp: 1791882651

## Description

Ossification review: no severity on hardcoded verifier fields, rationale for helpers outside the perimeter.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1791882651 (main branch discovery), not current.

```diff
    contract FrozenNotesRefundVerifier (eth:0x0694fF404DDA586C73EfCe21f34fe084541BB877) [zkmoney/FrozenNotesRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of notes that were unspent when the zk.money portal froze. Its verification key is immutable.
      fieldMeta.verificationKeyHash.severity:
-        "HIGH"
      fieldMeta.$libraries.severity:
-        "HIGH"
    }
```

```diff
    contract FrozenDepositRefundVerifier_sUSDS (eth:0x2E0C30821b9fcCf1CDB47F4e3a3A993593344522) [zkmoney/FrozenDepositRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of deposits included in Aztec's frozen message tree but still unclaimed. Its verification key is immutable.
      fieldMeta.verificationKeyHash.severity:
-        "HIGH"
      fieldMeta.$libraries.severity:
-        "HIGH"
    }
```

```diff
    contract UnprocessedDepositRefundVerifier (eth:0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5) [zkmoney/UnprocessedDepositRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of deposits not absorbed into Aztec before the zk.money portal froze. Its verification key is immutable.
      fieldMeta.verificationKeyHash.severity:
-        "HIGH"
      fieldMeta.$libraries.severity:
-        "HIGH"
    }
```

```diff
    contract UnprocessedDepositRefundVerifier_sUSDS (eth:0x8ACcBa3958cEF8E30b255c70A4C16CD2D14fb787) [zkmoney/UnprocessedDepositRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of deposits not absorbed into Aztec before the zk.money portal froze. Its verification key is immutable.
      fieldMeta.verificationKeyHash.severity:
-        "HIGH"
      fieldMeta.$libraries.severity:
-        "HIGH"
    }
```

```diff
    contract FrozenDepositRefundVerifier (eth:0xa2fd594dCA2d598aF231d615E5D34903154C3cCe) [zkmoney/FrozenDepositRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of deposits included in Aztec's frozen message tree but still unclaimed. Its verification key is immutable.
      fieldMeta.verificationKeyHash.severity:
-        "HIGH"
      fieldMeta.$libraries.severity:
-        "HIGH"
    }
```

```diff
    contract ResolverVerifier (eth:0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451) [zkmoney/ResolverVerifier] {
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
      fieldMeta.verificationKeyHash.severity:
-        "HIGH"
      fieldMeta.$libraries.severity:
-        "HIGH"
    }
```

```diff
    contract FrozenNotesRefundVerifier_sUSDS (eth:0xd24a49321878AB82E46992ab853A11903882abf2) [zkmoney/FrozenNotesRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of notes that were unspent when the zk.money portal froze. Its verification key is immutable.
      fieldMeta.verificationKeyHash.severity:
-        "HIGH"
      fieldMeta.$libraries.severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x6b4de558bcec8ca15e1bd691902031211784433c

# Diff at Wed, 14 Oct 2026 08:59:20 GMT:

- id: f11e13f1
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02aa817a9a0b68ecae973986967fe6fdd1d56d56 block: 1791192874
- current timestamp: 1791882651

## Description

Track verifier key hashes and linked proof-verification libraries, add sUSDS escrow.
Move ENS handlers and refund-library criticality into templates.

## Watched changes

```diff
    contract SkyEscrowFactory (eth:0x9c4A7d65AFDC2b4eF1164264D9585ED64c869054) [zkmoney/SkyEscrowFactory] {
    +++ description: Deploys deterministic escrows for moving funds between the DAI and sUSDS portals. Anyone can execute a funded escrow. Its implementation and routes are immutable.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      name:
+        "SkyEscrowFactory"
      template:
+        "zkmoney/SkyEscrowFactory"
      sourceHashes:
+        ["0x186505f8f56ecd35908cef522d33f5658860e763137cb5c6d3bb0e206ac03742"]
      description:
+        "Deploys deterministic escrows for moving funds between the DAI and sUSDS portals. Anyone can execute a funded escrow. Its implementation and routes are immutable."
      deployerAddress:
+        "eth:0xa3533FD3dAC685D54df722B970772b54128a717C"
      sinceTimestamp:
+        1791329267
      sinceBlock:
+        26136622
      values:
+        {"$immutable":true,"DAI":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","DAI_PORTAL":"eth:0xdf410ad448A0f7165181FBdB32f8896f4a0d9449","IMPLEMENTATION":"eth:0x5C412Ba5B338F3e5E2a1332069bdd3Aae6ae6b8a","SKY_EXECUTOR":"eth:0x63e6cD9Ff886cFF198Eaaab01CeC2b707E7F5475","SUSDS":"eth:0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD","SUSDS_PORTAL":"eth:0xD7Ae00b91ba0B8e0240B22Cd75fE447d177C260f"}
      implementationNames:
+        {"eth:0x9c4A7d65AFDC2b4eF1164264D9585ED64c869054":"SkyEscrowFactory"}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ZkMoneyPortal_sUSDS (eth:0xD7Ae00b91ba0B8e0240B22Cd75fE447d177C260f) [zkmoney/ZkMoneyPortal] {
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      template:
+        "zkmoney/ZkMoneyPortal"
      sourceHashes:
+        ["0x7020e3729f66f6c8ddada17eeb82b33ae8b7f623c0ffb3bb6c921bf966a7f6a8"]
      description:
+        "Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint."
      critical:
+        true
      deployerAddress:
+        "eth:0xa3533FD3dAC685D54df722B970772b54128a717C"
      sinceTimestamp:
+        1791316739
      sinceBlock:
+        26135579
      values:
+        {"_$cachedAvailable":"49997504449688617568427","_$freezeArchive":"0x0000000000000000000000000000000000000000000000000000000000000000","_$freezeCheckpointCount":0,"_$freezeCheckpointNumber":0,"_$freezeEpochNumber":0,"_$frozen":false,"_$initialized":true,"_$l2Portal":"0x2bb708cb67bbda3ec2c79b842ef5d3b3d55897663d29cac5b5518c2e9af7171b","_$lastUpdatedTime":1791874367,"$immutable":true,"approvedPcr0Hashes":["0xbfdd552587f517a9f18ef6ed588e3bd57a21ac2070fda39ac4612558df3e72c8"],"FPC_FUNDER":"eth:0x37cD81C39Bf276ea7e1c6a416A254f688c70eAFb","FPC_FUNDING_CUT":0,"FROZEN_DEPOSIT_REFUND_VERIFIER":"eth:0x2E0C30821b9fcCf1CDB47F4e3a3A993593344522","FROZEN_NOTES_REFUND_VERIFIER":"eth:0xd24a49321878AB82E46992ab853A11903882abf2","getCurrentAvailable":"50000000000000000000000","GLOBAL_LIMIT":"50000000000000000000000","INBOX":"eth:0x7d4Ef0676c2032bbCC09227501D34d86641ab8cA","L2_PORTAL":"0x2bb708cb67bbda3ec2c79b842ef5d3b3d55897663d29cac5b5518c2e9af7171b","OUTBOX":"eth:0x5B062aB5fD3A66BC7e73b04CeD38587673b6A2D7","owner":"eth:0x0000000000000000000000000000000000000000","RATE":"578703703703703703","REGISTRY":"eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298","ROLLUP":"eth:0x91fF8bbD8Ebb07893010D50A48A1609e5EBd8E34","ROLLUP_VERSION":4248422647,"TEE_ATTESTATION_MAX_AGE":3600,"TEE_CERT_MANAGER":"eth:0xdfe52FD98aa0Cc8Ce7778a2b00ac7B7Dc9595875","TEE_NITRO_VALIDATOR":"eth:0x0119bC52a09Ac6e7998378BadC16D0e9A866Be56","teeSigners":["eth:0x367eD02480809f5020234181B61D9069a08974dD","eth:0x5F03984126AdFDb72B2823b553988Ccebe1F781e","eth:0x05406F53174EC1bFE5C94aF253CdD62A4adF2F29"],"UNDERLYING":"eth:0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD","UNPROCESSED_DEPOSIT_REFUND_VERIFIER":"eth:0x8ACcBa3958cEF8E30b255c70A4C16CD2D14fb787"}
      fieldMeta:
+        {"owner":{"severity":"MEDIUM"},"approvedPcr0Hashes":{"severity":"HIGH","description":"Hashes of the AWS Nitro enclave images (PCR0) whose attestations can register TEE signers."},"teeSigners":{"description":"Registered TEE signers. Registrations are permanent."},"_$l2Portal":{"description":"zk.money token contract on Aztec whose L2->L1 messages can release funds."},"_$frozen":{"severity":"MEDIUM","description":"Whether the portal is permanently frozen. A frozen portal accepts no deposits. Withdrawals within the frozen checkpoint and epoch bounds remain available alongside refunds against the frozen state. L2 transfers are not disabled but do not change refundable ownership."},"REGISTRY":{"description":"Aztec Registry. If its canonical rollup is no longer ROLLUP, anyone can freeze this portal."},"FPC_FUNDER":{"description":"Receives FPC_FUNDING_CUT from every deposit and withdrawal to fund Aztec fees for zk.money users."},"GLOBAL_LIMIT":{"description":"Deposit capacity (wei), refilling at RATE per second. Withdrawals are only limited by a hardcoded per-transaction cap.","type":"RISK_PARAMETER"}}
      implementationNames:
+        {"eth:0xD7Ae00b91ba0B8e0240B22Cd75fE447d177C260f":"OxidePortal"}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0x1ab8c7439B47B474d72963076aB1C8C944750241) [zkmoney/RefundRelationsLib]
    +++ description: Library immutably linked into a zk.money refund verifier. It evaluates the UltraHonk circuit constraints during proof verification.
```

```diff
+   Status: CREATED
    contract FrozenDepositRefundVerifier_sUSDS (eth:0x2E0C30821b9fcCf1CDB47F4e3a3A993593344522) [zkmoney/FrozenDepositRefundVerifier]
    +++ description: UltraHonk verifier for refunds of deposits included in Aztec's frozen message tree but still unclaimed. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0x567771A39903323B81E18b388372897FdAd6338C) [zkmoney/RefundRelationsLib]
    +++ description: Library immutably linked into a zk.money refund verifier. It evaluates the UltraHonk circuit constraints during proof verification.
```

```diff
+   Status: CREATED
    contract SkyEscrow (eth:0x5C412Ba5B338F3e5E2a1332069bdd3Aae6ae6b8a) [zkmoney/SkyEscrow]
    +++ description: Implementation for savings conversion escrows. Each clone fixes the route, deposit commitment, relayer tip and recovery commitment in its address. It converts DAI into sUSDS or redeposits DAI after a savings withdrawal. The recovery account can reclaim stranded tokens, including shares taken without redemption.
```

```diff
+   Status: CREATED
    contract SkyWithdrawalExecutor (eth:0x63e6cD9Ff886cFF198Eaaab01CeC2b707E7F5475) [zkmoney/SkyWithdrawalExecutor]
    +++ description: Payout contract for sUSDS withdrawals and refunds. Only the PORTAL can execute a payout. It normally redeems sUSDS into USDS and converts USDS to DAI before paying the committed recipient and relayer tip. The recipient can complete an ordinary withdrawal in sUSDS shares through withdrawInShares, bypassing redemption.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0x871Af018DeD698d9753766D41Dbc80B777944263) [zkmoney/RefundRelationsLib]
    +++ description: Library immutably linked into a zk.money refund verifier. It evaluates the UltraHonk circuit constraints during proof verification.
```

```diff
+   Status: CREATED
    contract UnprocessedDepositRefundVerifier_sUSDS (eth:0x8ACcBa3958cEF8E30b255c70A4C16CD2D14fb787) [zkmoney/UnprocessedDepositRefundVerifier]
    +++ description: UltraHonk verifier for refunds of deposits not absorbed into Aztec before the zk.money portal froze. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract FrozenNotesRefundVerifier_sUSDS (eth:0xd24a49321878AB82E46992ab853A11903882abf2) [zkmoney/FrozenNotesRefundVerifier]
    +++ description: UltraHonk verifier for refunds of notes that were unspent when the zk.money portal froze. Its verification key is immutable.
```

## Source code changes

```diff
.../.flat/FrozenDepositRefundVerifier_sUSDS.sol    | 2328 +++++++
 .../.flat/FrozenNotesRefundVerifier_sUSDS.sol      | 2328 +++++++
 ...:0x1ab8c7439B47B474d72963076aB1C8C944750241.sol | 1083 ++++
 ...:0x567771A39903323B81E18b388372897FdAd6338C.sol | 1083 ++++
 ...:0x871Af018DeD698d9753766D41Dbc80B777944263.sol | 1083 ++++
 .../projects/zkmoney/.flat/SkyEscrowFactory.sol    | 6761 ++++++++++++++++++++
 .../zkmoney/.flat/SkyWithdrawalExecutor.sol        | 2507 ++++++++
 .../UnprocessedDepositRefundVerifier_sUSDS.sol     | 2328 +++++++
 .../projects/zkmoney/.flat/ZkMoneyPortal_sUSDS.sol | 5266 +++++++++++++++
 9 files changed, 24767 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1791192874 (main branch discovery), not current.

```diff
    contract FrozenNotesRefundVerifier (eth:0x0694fF404DDA586C73EfCe21f34fe084541BB877) [zkmoney/FrozenNotesRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of notes that were unspent when the zk.money portal froze. Its verification key is immutable.
      template:
-        "zkmoney/HonkVerifier"
+        "zkmoney/FrozenNotesRefundVerifier"
      description:
-        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
+        "UltraHonk verifier for refunds of notes that were unspent when the zk.money portal froze. Its verification key is immutable."
+++ description: Runtime libraries immutably linked into this verifier.
+++ severity: HIGH
      values.$libraries:
+        ["eth:0x41F721e09a9C8027165C6Bf1B3771848f6a43D29"]
+++ description: Circuit verification key hash embedded in the verified Solidity source.
+++ severity: HIGH
      values.verificationKeyHash:
+        "0x05ea6d9d0a0b1b837f081862dd77aae6bc047fb822b9cf7055ef68719b04198e"
      fieldMeta:
+        {"verificationKeyHash":{"severity":"HIGH","description":"Circuit verification key hash embedded in the verified Solidity source.","type":"CODE_CHANGE"},"$libraries":{"severity":"HIGH","description":"Runtime libraries immutably linked into this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract Resolver (eth:0x3e9BcF7cCA4b94885aBEB9Bbf0005aA99DC6307F) [zkmoney/Resolver] {
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
+++ description: ENS node monitored for this deployment.
      values.ensNode:
+        "0xf605999a299a7229da9f2a3c65acf5cb829ae965cfe467f053e1b97c50b0eec2"
      fieldMeta.ensNodeOwner.description:
-        "Owner of zk.money in the ENS registry. zk.money is a DNS name imported into ENS, so the holder of the DNS domain can also reclaim it with a DNSSEC proof."
+        "Owner of zk.money in the ENS registry. The DNS domain holder can reclaim this DNS name in ENS with a DNSSEC proof."
      fieldMeta.ensNode:
+        {"description":"ENS node monitored for this deployment."}
    }
```

```diff
    contract UnprocessedDepositRefundVerifier (eth:0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5) [zkmoney/UnprocessedDepositRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of deposits not absorbed into Aztec before the zk.money portal froze. Its verification key is immutable.
      template:
-        "zkmoney/HonkVerifier"
+        "zkmoney/UnprocessedDepositRefundVerifier"
      description:
-        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
+        "UltraHonk verifier for refunds of deposits not absorbed into Aztec before the zk.money portal froze. Its verification key is immutable."
+++ description: Runtime libraries immutably linked into this verifier.
+++ severity: HIGH
      values.$libraries:
+        ["eth:0x9e2131C7B89D070a6b27f29c2b8e066399ECA5b7"]
+++ description: Circuit verification key hash embedded in the verified Solidity source.
+++ severity: HIGH
      values.verificationKeyHash:
+        "0x080b44509f327b7b0ee935247a069be5def58e0edf1b52721d9c42f5918c390c"
      fieldMeta:
+        {"verificationKeyHash":{"severity":"HIGH","description":"Circuit verification key hash embedded in the verified Solidity source.","type":"CODE_CHANGE"},"$libraries":{"severity":"HIGH","description":"Runtime libraries immutably linked into this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract FrozenDepositRefundVerifier (eth:0xa2fd594dCA2d598aF231d615E5D34903154C3cCe) [zkmoney/FrozenDepositRefundVerifier] {
    +++ description: UltraHonk verifier for refunds of deposits included in Aztec's frozen message tree but still unclaimed. Its verification key is immutable.
      template:
-        "zkmoney/HonkVerifier"
+        "zkmoney/FrozenDepositRefundVerifier"
      description:
-        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
+        "UltraHonk verifier for refunds of deposits included in Aztec's frozen message tree but still unclaimed. Its verification key is immutable."
+++ description: Runtime libraries immutably linked into this verifier.
+++ severity: HIGH
      values.$libraries:
+        ["eth:0xb66C441BbeFe703E423dbcAa515d32F50e507C2b"]
+++ description: Circuit verification key hash embedded in the verified Solidity source.
+++ severity: HIGH
      values.verificationKeyHash:
+        "0x2290cfb58dea33c485e0ac33581c1c8d358ac3dd9f434470b6cf87da12b5fd43"
      fieldMeta:
+        {"verificationKeyHash":{"severity":"HIGH","description":"Circuit verification key hash embedded in the verified Solidity source.","type":"CODE_CHANGE"},"$libraries":{"severity":"HIGH","description":"Runtime libraries immutably linked into this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract ResolverVerifier (eth:0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451) [zkmoney/ResolverVerifier] {
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
+++ description: Runtime libraries immutably linked into this verifier.
+++ severity: HIGH
      values.$libraries:
+        ["eth:0x02353dB283087CD51b13eE088A615Dad03949070","eth:0xf3E445E6E292dE756bD66011c23717DAb9e12DBD"]
+++ description: Circuit verification key hash embedded in the verified Solidity source.
+++ severity: HIGH
      values.verificationKeyHash:
+        "0x279d6dad93155d6c03ddd050359fb4675a66c08812b5306f6dfc9754e42827b7"
      fieldMeta:
+        {"verificationKeyHash":{"severity":"HIGH","description":"Circuit verification key hash embedded in the verified Solidity source.","type":"CODE_CHANGE"},"$libraries":{"severity":"HIGH","description":"Runtime libraries immutably linked into this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract ZkMoneyPortal (eth:0xdf410ad448A0f7165181FBdB32f8896f4a0d9449) [zkmoney/ZkMoneyPortal] {
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint.
      description:
-        "Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. Withdrawals within the frozen checkpoint and epoch bounds remain available alongside refunds that need a zk proof and a TEE signature. L2 transfers are not disabled but do not change refundable ownership."
+        "Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint."
    }
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0x02353dB283087CD51b13eE088A615Dad03949070) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0x41F721e09a9C8027165C6Bf1B3771848f6a43D29) [zkmoney/RefundRelationsLib]
    +++ description: Library immutably linked into a zk.money refund verifier. It evaluates the UltraHonk circuit constraints during proof verification.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0x9e2131C7B89D070a6b27f29c2b8e066399ECA5b7) [zkmoney/RefundRelationsLib]
    +++ description: Library immutably linked into a zk.money refund verifier. It evaluates the UltraHonk circuit constraints during proof verification.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0xb66C441BbeFe703E423dbcAa515d32F50e507C2b) [zkmoney/RefundRelationsLib]
    +++ description: Library immutably linked into a zk.money refund verifier. It evaluates the UltraHonk circuit constraints during proof verification.
```

```diff
+   Status: CREATED
    contract ZKTranscriptLib (eth:0xf3E445E6E292dE756bD66011c23717DAb9e12DBD) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

Generated with discovered.json: 0x7073767428a6e535ef0f5b692305d8657e0bc1ec

# Diff at Mon, 05 Oct 2026 09:38:12 GMT:

- id: e9f8fef9
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd994874bd99b18ba1f55be2a7905cd3e3005273 block: 1790840907
- current timestamp: 1791192874

## Description

Ossification review of zk.money: ZkMoneyPortal field severities follow the ossification spec.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790840907 (main branch discovery), not current.

```diff
    contract FrozenNotesRefundVerifier (eth:0x0694fF404DDA586C73EfCe21f34fe084541BB877) [zkmoney/HonkVerifier] {
    +++ description: UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key.
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
    }
```

```diff
    contract UnprocessedDepositRefundVerifier (eth:0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5) [zkmoney/HonkVerifier] {
    +++ description: UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key.
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
    }
```

```diff
    contract FrozenDepositRefundVerifier (eth:0xa2fd594dCA2d598aF231d615E5D34903154C3cCe) [zkmoney/HonkVerifier] {
    +++ description: UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key.
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
    }
```

```diff
    contract NameRegistry (eth:0xa9863B8F573D62377d987ccb9AF6e0000f99D14a) [zkmoney/NameRegistry] {
    +++ description: Registry of zk.money names. It points to the RegistrationController and the AccountMetadataRegistry, which together decide where payments to a zk.money name resolve to.
      fieldMeta.resolver:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ResolverVerifier (eth:0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451) [zkmoney/ResolverVerifier] {
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
      template:
-        "zkmoney/HonkVerifier"
+        "zkmoney/ResolverVerifier"
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address."
      critical:
-        true
    }
```

```diff
    contract SIPAFactory (eth:0xc357E34D4C7520a83C9Ec0a242Ba52b4ecABa1Fc) [zkmoney/SIPAFactory] {
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. The implementation per portal and intent is blessed once by the owner and cannot be changed afterwards.
      fieldMeta.blessedImplementations.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

```diff
    contract ZkMoneyPortal (eth:0xdf410ad448A0f7165181FBdB32f8896f4a0d9449) [zkmoney/ZkMoneyPortal] {
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. Withdrawals within the frozen checkpoint and epoch bounds remain available alongside refunds that need a zk proof and a TEE signature. L2 transfers are not disabled but do not change refundable ownership.
      fieldMeta.owner.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta._$l2Portal.severity:
-        "HIGH"
      fieldMeta._$frozen.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

Generated with discovered.json: 0x86ff4d71f651c62d1c8c8bdee886eb88ecbf0e7a

# Diff at Thu, 01 Oct 2026 07:49:42 GMT:

- id: 1225e8f9
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1790840907

## Description

Initial full discovery of zk.money.

## Initial discovery

```diff
+   Status: CREATED
    contract NitroValidator (eth:0x0119bC52a09Ac6e7998378BadC16D0e9A866Be56) [zkmoney/NitroValidator]
    +++ description: Validates AWS Nitro enclave attestations against the certificate chain verified by the CertManager.
```

```diff
+   Status: CREATED
    contract SwapEscrowFactory (eth:0x03b21BBa8e75A1BD0354c5ECbEC078cF59C85343) [zkmoney/SwapEscrowFactory]
    +++ description: Swap-on-withdraw: a withdrawal can pay DAI to a SwapEscrow clone whose route, recipient and tip are fixed in its address. Anyone can deploy and execute a funded clone to swap the DAI for USDC, USDT or ETH to the recipient.
```

```diff
+   Status: CREATED
    contract FrozenNotesRefundVerifier (eth:0x0694fF404DDA586C73EfCe21f34fe084541BB877) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract RegistrationSIPA (eth:0x0934F010d59b552949DBe44AcBE5AFf0e32C8C34) [zkmoney/RegistrationSIPA]
    +++ description: Implementation of zk.money registration addresses. Sweeping a funded clone registers the name through the current RegistrationController of the NameRegistry, pays the committed fees and deposits the rest into the PORTAL. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract RegistrationController (eth:0x10EB6fecD2DCE6DA55d25C355374c970D5D11E23) [zkmoney/RegistrationController]
    +++ description: Completes paid name registrations: deploys the user's L1 account, claims the name and writes the user record. Fees above the relayer fee go to an allowlisted beneficiary.
```

```diff
+   Status: CREATED
    contract OxideAccountFactory (eth:0x187d19EccBf2909AD3d71B798A8704D950b9C3ee) [zkmoney/OxideAccountFactory]
    +++ description: Permissionless factory for deterministic L1 accounts. The implementation is immutable and there is no administrator.
```

```diff
+   Status: CREATED
    contract FPCFunderDAI (eth:0x37cD81C39Bf276ea7e1c6a416A254f688c70eAFb) [zkmoney/FPCFunderDAI]
    +++ description: Collects the portal's funding cut. Anyone can swap it to AZTEC and bridge it as Fee Juice to the zk.money fee-paying contract on Aztec (L2_BENEFICIARY), which pays L2 fees for users.
```

```diff
+   Status: CREATED
    contract Resolver (eth:0x3e9BcF7cCA4b94885aBEB9Bbf0005aA99DC6307F) [zkmoney/Resolver]
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
```

```diff
+   Status: CREATED
    contract UnprocessedDepositRefundVerifier (eth:0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract FrozenDepositRefundVerifier (eth:0xa2fd594dCA2d598aF231d615E5D34903154C3cCe) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract NameRegistry (eth:0xa9863B8F573D62377d987ccb9AF6e0000f99D14a) [zkmoney/NameRegistry]
    +++ description: Registry of zk.money names. It points to the RegistrationController and the AccountMetadataRegistry, which together decide where payments to a zk.money name resolve to.
```

```diff
+   Status: CREATED
    contract ResolverVerifier (eth:0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract PlainWithdrawalExecutor (eth:0xC2363b7155EE8391C5395B72C46a6d22BF49151c) [zkmoney/PlainWithdrawalExecutor]
    +++ description: Default payout contract for withdrawals and refunds. Only the PORTAL can call it. It pays the recipient and relayer tip committed on Aztec.
```

```diff
+   Status: CREATED
    contract SIPAFactory (eth:0xc357E34D4C7520a83C9Ec0a242Ba52b4ecABa1Fc) [zkmoney/SIPAFactory]
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. The implementation per portal and intent is blessed once by the owner and cannot be changed afterwards.
```

```diff
+   Status: CREATED
    contract OxideAccount (eth:0xdA0D7cD0f49cE7b1D04bf03eE56374a8981c2844) [zkmoney/OxideAccount]
    +++ description: Immutable implementation of users' L1 accounts. The bootstrap key authorizes the first passkey. Once a passkey is installed, only the user's passkeys can authorize operations and manage keys. The last passkey cannot be removed. Deposit recovery checks signatures against this account.
```

```diff
+   Status: CREATED
    contract AccountMetadataRegistry (eth:0xDA79Bae4485c40291363D885Aae5B543d2D0Efa9) [zkmoney/AccountMetadataRegistry]
    +++ description: Stores user records (Aztec L2 address, keys, chosen resolver operator) and resolver operator entries. User records can be written by the user or by the RegistrationController. Anyone can register as a resolver operator.
```

```diff
+   Status: CREATED
    contract ZkMoneyPortal (eth:0xdf410ad448A0f7165181FBdB32f8896f4a0d9449) [zkmoney/ZkMoneyPortal]
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. Withdrawals within the frozen checkpoint and epoch bounds remain available alongside refunds that need a zk proof and a TEE signature. L2 transfers are not disabled but do not change refundable ownership.
```

```diff
+   Status: CREATED
    contract CertManager (eth:0xdfe52FD98aa0Cc8Ce7778a2b00ac7B7Dc9595875) [zkmoney/CertManager]
    +++ description: Verifies and caches AWS Nitro attestation certificates. The only trust anchor is the hardcoded AWS Nitro root certificate.
```

```diff
+   Status: CREATED
    contract OperationExecutor (eth:0xe883686d9EC4E0430f2233A6BF12B2D226a39e19) [zkmoney/OperationExecutor]
    +++ description: Permissionless helper that executes a call and forwards the resulting token payout to the caller. Used by finalizers to collect fees and subsidies.
```

```diff
+   Status: CREATED
    contract SwapEscrow (eth:0xf16Fd140036925e3a0630d0F743204a4c7d8ccaf) [zkmoney/SwapEscrow]
    +++ description: SwapEscrow implementation. A clone swaps via the Curve 3pool (and Uniswap for ETH) with a slippage bound of 100 bps for stablecoins and 200 bps against the Chainlink ETH/USD price for ETH. If the swap cannot execute, only the recovery key committed in the clone's address can move the funds.
```

```diff
+   Status: CREATED
    contract DepositSIPA (eth:0xF714D8Cf287F4A410b018514074A9371BC45461b) [zkmoney/DepositSIPA]
    +++ description: Implementation of zk.money deposit addresses. Anyone can sweep a funded clone, which swaps USDC or USDT to DAI, pays DEPOSIT_FEE to the relayer and deposits the rest into the PORTAL for the recipient fixed in the clone's address. The recipient's account can recover any funds from the clone.
```
