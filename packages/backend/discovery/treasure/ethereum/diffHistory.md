Generated with discovered.json: 0xa00d77eb51ceec77be0cffacb8e02aa22a7018d7

# Diff at Tue, 28 Jan 2025 06:34:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21585285
- current block number: 21717208

## Description

discodrive!

## Watched changes

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.baseTokenGasPriceMultiplierDenominator:
-        15677
+        10629
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585285 (main branch discovery), not current.

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]
    }
```

```diff
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.txFilterer.description:
-        "Optional: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
+        "This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
      fieldMeta.getProtocolVersion.description:
-        "Protocol version, increments with each protocol change"
+        "Protocol version, increments with each protocol upgrade."
      fieldMeta.getVerifierParams.description:
-        "Verifier parameters used for proving batches"
+        "Verifier parameters used for proving batches."
      fieldMeta.daMode:
-        {"description":"0 = rollup; 1 = Validium"}
      template:
+        "shared-zk-stack/Diamond"
      description:
+        "The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
      issuedPermissions:
+        [{"permission":"configure","to":"0x282370D1e925ee897CB29Cb3beC13aAe0743067C","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}]},{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604) {
    +++ description: Implements the ZK proof verification logic.
      template:
+        "shared-zk-stack/Verifier"
      description:
+        "Implements the ZK proof verification logic."
    }
```

```diff
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      issuedPermissions:
+        [{"permission":"configure","to":"0xdd2B80c477CF2f660A1Eda0FeCBD0291caE43216","description":"set the conversion factor for gas token deposits.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x9ccc58c9872fd26aaf70224eff95e611fe660852

# Diff at Thu, 09 Jan 2025 06:58:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21429089
- current block number: 21585285

## Description

TreasureChainAdminMultisig signers added, threshold increased.

## Watched changes

```diff
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C) {
    +++ description: None
      values.$members.5:
+        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
      values.$members.4:
+        "0x58244EA236D2ff57c023A4028E228f77dc328894"
      values.$members.3:
-        "0x18c16E72CAa10D2Ce13E4b61bfC51AB93B7e92f0"
+        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
      values.$members.2:
-        "0x58244EA236D2ff57c023A4028E228f77dc328894"
+        "0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
      values.$members.1:
-        "0x1ee4324F7BD44A4c7c335C2D4e758639B60E8726"
+        "0xe25AdA29FA5873A24afEe1342422BD14e5809e03"
      values.$members.0:
-        "0xBAe65c4bA62799F68817Cbb2bB353Da4572C23Ae"
+        "0x1c68007a9A7E5Adc862da9b54938112352B97f17"
      values.$threshold:
-        2
+        4
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xd294c53381a2cd4212e1f30f4ce84c5251a3360b

# Diff at Thu, 12 Dec 2024 11:05:27 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21386011

## Description

Initial discovery of a standard zk stack validium.

## Initial discovery

```diff
+   Status: CREATED
    contract TreasureChainAdminMultisig (0x282370D1e925ee897CB29Cb3beC13aAe0743067C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasureZkEvm (0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasureZkEvmAdmin (0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871)
    +++ description: None
```
