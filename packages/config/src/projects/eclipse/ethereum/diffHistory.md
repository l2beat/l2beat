Generated with discovered.json: 0xa35d51f47554e9ecf752b8aa4347259b3797d8c7

# Diff at Mon, 14 Jul 2025 12:44:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22868281
- current block number: 22868281

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22868281 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0706Ffc1722D53a85ba90f32807880ccee968Fed) {
    +++ description: None
      address:
-        "0x0706Ffc1722D53a85ba90f32807880ccee968Fed"
+        "eth:0x0706Ffc1722D53a85ba90f32807880ccee968Fed"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x45894CeBad0a1298D44aF2B528490693E58B322E"
+        "eth:0x45894CeBad0a1298D44aF2B528490693E58B322E"
      values.$members.1:
-        "0x825e868F5561352bC875E0C9D08d32e94F915E6b"
+        "eth:0x825e868F5561352bC875E0C9D08d32e94F915E6b"
      implementationNames.0x0706Ffc1722D53a85ba90f32807880ccee968Fed:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x0706Ffc1722D53a85ba90f32807880ccee968Fed:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x1a84163249B2909f746C725F23D5ae2a66D7C4fE) {
    +++ description: None
      address:
-        "0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
+        "eth:0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
    }
```

```diff
    contract CanonicalBridgeV1 (0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11) {
    +++ description: Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor.
      address:
-        "0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
+        "eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.PAUSER_ROLE.members.1:
-        "0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
+        "eth:0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
      values.accessControl.STARTER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.CLAIM_AUTHORITY_ROLE.members.0:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.accessControl.WITHDRAW_CANCELLER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.WITHDRAW_CANCELLER_ROLE.members.1:
-        "0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
+        "eth:0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
      values.accessControl.FRAUD_WINDOW_SETTER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.defaultAdminAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.pauserAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.pauserAC.1:
-        "0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
+        "eth:0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
      values.TREASURY:
-        "0xD7E4b67E735733aC98a88F13d087D8aac670E644"
+        "eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644"
      values.withdrawAuthorityAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      implementationNames.0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11:
-        "CanonicalBridge"
      implementationNames.eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11:
+        "CanonicalBridge"
    }
```

```diff
    EOA  (0x3392fd462d9710Fbf3A5703818b9920C119DC080) {
    +++ description: None
      address:
-        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
+        "eth:0x3392fd462d9710Fbf3A5703818b9920C119DC080"
    }
```

```diff
    EOA  (0x45894CeBad0a1298D44aF2B528490693E58B322E) {
    +++ description: None
      address:
-        "0x45894CeBad0a1298D44aF2B528490693E58B322E"
+        "eth:0x45894CeBad0a1298D44aF2B528490693E58B322E"
    }
```

```diff
    contract Eclipse Multisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      address:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBb534A6Bd0440727cb5883D037DEd7358059D547"
+        "eth:0xBb534A6Bd0440727cb5883D037DEd7358059D547"
      values.$members.1:
-        "0xCD2fA978D163c0068167dDff8b6951f0E626e6A4"
+        "eth:0xCD2fA978D163c0068167dDff8b6951f0E626e6A4"
      values.$members.2:
-        "0x950815d0e585095B06111CD101440fb1E95AB2a5"
+        "eth:0x950815d0e585095B06111CD101440fb1E95AB2a5"
      values.$members.3:
-        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
+        "eth:0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
      values.$members.4:
-        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
+        "eth:0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
      implementationNames.0x4720342419C1D316B948690d12C86D5b485C64E0:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4720342419C1D316B948690d12C86D5b485C64E0:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3) {
    +++ description: None
      address:
-        "0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
+        "eth:0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"
    }
```

```diff
    EOA  (0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2) {
    +++ description: None
      address:
-        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
+        "eth:0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
    }
```

```diff
    contract Eclipse Multisig 2 (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      address:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xd0615B1D3F24f691153C076d45104eEd3eF8cDb5"
+        "eth:0xd0615B1D3F24f691153C076d45104eEd3eF8cDb5"
      values.$members.1:
-        "0x0706Ffc1722D53a85ba90f32807880ccee968Fed"
+        "eth:0x0706Ffc1722D53a85ba90f32807880ccee968Fed"
      values.$members.2:
-        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
+        "eth:0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
      values.$members.3:
-        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
+        "eth:0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
      values.$members.4:
-        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
+        "eth:0x3392fd462d9710Fbf3A5703818b9920C119DC080"
      implementationNames.0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x825e868F5561352bC875E0C9D08d32e94F915E6b) {
    +++ description: None
      address:
-        "0x825e868F5561352bC875E0C9D08d32e94F915E6b"
+        "eth:0x825e868F5561352bC875E0C9D08d32e94F915E6b"
    }
```

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: (Deprecated) Entrypoint for depositing assets. This contract calls the Mailbox contract for each deposit. In practice this path is not used for deposits.
      address:
-        "0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1"
+        "eth:0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"
+        "eth:0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"
      values.$pastUpgrades.0.2.0:
-        "0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"
+        "eth:0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      implementationNames.0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1:
-        "ERC1967Proxy"
      implementationNames.0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9:
-        "EtherBridge"
      implementationNames.eth:0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1:
+        "ERC1967Proxy"
      implementationNames.eth:0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9:
+        "EtherBridge"
    }
```

```diff
    contract CanonicalBridgeV2 (0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51) {
    +++ description: Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor.
      address:
-        "0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
+        "eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.STARTER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.1:
-        "0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
+        "eth:0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
      values.accessControl.CLAIM_AUTHORITY_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.WITHDRAW_CANCELLER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.FRAUD_WINDOW_SETTER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.defaultAdminAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.defaultAdminAC.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.pauserAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.TREASURY:
-        "0xD7E4b67E735733aC98a88F13d087D8aac670E644"
+        "eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644"
      values.withdrawAuthorityAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.withdrawAuthorityAC.1:
-        "0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
+        "eth:0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
      implementationNames.0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51:
-        "CanonicalBridgeV2"
      implementationNames.eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51:
+        "CanonicalBridgeV2"
    }
```

```diff
    EOA  (0x950815d0e585095B06111CD101440fb1E95AB2a5) {
    +++ description: None
      address:
-        "0x950815d0e585095B06111CD101440fb1E95AB2a5"
+        "eth:0x950815d0e585095B06111CD101440fb1E95AB2a5"
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: (Deprecated) Mailbox contract for L1 -> L2 messaging. There is no canonical way to send messages back.
      address:
-        "0xb23B2492f7A9631104A5877F7FFA00633660968d"
+        "eth:0xb23B2492f7A9631104A5877F7FFA00633660968d"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"
+        "eth:0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"
      values.$pastUpgrades.0.2.0:
-        "0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"
+        "eth:0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.TRUSTED_RELAYER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.MODULE_ROLE.members.0:
-        "0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1"
+        "eth:0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1"
      implementationNames.0xb23B2492f7A9631104A5877F7FFA00633660968d:
-        "ERC1967Proxy"
      implementationNames.0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B:
-        "Mailbox"
      implementationNames.eth:0xb23B2492f7A9631104A5877F7FFA00633660968d:
+        "ERC1967Proxy"
      implementationNames.eth:0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B:
+        "Mailbox"
    }
```

```diff
    EOA  (0xBb534A6Bd0440727cb5883D037DEd7358059D547) {
    +++ description: None
      address:
-        "0xBb534A6Bd0440727cb5883D037DEd7358059D547"
+        "eth:0xBb534A6Bd0440727cb5883D037DEd7358059D547"
    }
```

```diff
    EOA  (0xCD2fA978D163c0068167dDff8b6951f0E626e6A4) {
    +++ description: None
      address:
-        "0xCD2fA978D163c0068167dDff8b6951f0E626e6A4"
+        "eth:0xCD2fA978D163c0068167dDff8b6951f0E626e6A4"
    }
```

```diff
    contract Upgrader0to1 (0xD02f545d57536BC1E8F12D867731F006AacE71E3) {
    +++ description: This contract was used for an upgrade an still retains its permissions and permissioned actors.
      address:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.UPGRADER_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.NULL_ADDRESS:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.upgraderAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      implementationNames.0xD02f545d57536BC1E8F12D867731F006AacE71E3:
-        "Upgrader0to1"
      implementationNames.eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3:
+        "Upgrader0to1"
    }
```

```diff
    EOA  (0xd0615B1D3F24f691153C076d45104eEd3eF8cDb5) {
    +++ description: None
      address:
-        "0xd0615B1D3F24f691153C076d45104eEd3eF8cDb5"
+        "eth:0xd0615B1D3F24f691153C076d45104eEd3eF8cDb5"
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: Permissioned escrow for assets bridged to Eclipse. There is no canonical messaging and users need to trust the bridge operators to process deposits and authorize withdrawals.
      address:
-        "0xD7E4b67E735733aC98a88F13d087D8aac670E644"
+        "eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978"
+        "eth:0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978"
      values.$pastUpgrades.0.2.0:
-        "0xa8E15d2B1bf6B0Fd3Bc9Ead06323c0730b67f8d4"
+        "eth:0xa8E15d2B1bf6B0Fd3Bc9Ead06323c0730b67f8d4"
      values.$pastUpgrades.1.2.0:
-        "0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978"
+        "eth:0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.accessControl.PAUSER_ROLE.members.1:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.PAUSER_ROLE.members.2:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.STARTER_ROLE.members.0:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.accessControl.STARTER_ROLE.members.1:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.STARTER_ROLE.members.2:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.UPGRADER_ROLE.members.0:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.accessControl.UPGRADER_ROLE.members.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.EMERGENCY_ROLE.members.0:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.accessControl.EMERGENCY_ROLE.members.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.DEPOSITOR_ROLE.members.0:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.DEPOSITOR_ROLE.members.1:
-        "0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
+        "eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.0:
-        "0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
+        "eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.2:
-        "0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
+        "eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
      values.defaultAdminAC.0:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
+        "eth:0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.defaultAdminAC.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.emergencyAC.0:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.emergencyAC.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.upgraderAC.0:
-        "0xD02f545d57536BC1E8F12D867731F006AacE71E3"
+        "eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3"
      values.upgraderAC.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.withdrawerAC.0:
-        "0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
+        "eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
      values.withdrawerAC.1:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "eth:0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.withdrawerAC.2:
-        "0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
+        "eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
      implementationNames.0xD7E4b67E735733aC98a88F13d087D8aac670E644:
-        "ERC1967Proxy"
      implementationNames.0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978:
-        "Treasury"
      implementationNames.eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644:
+        "ERC1967Proxy"
      implementationNames.eth:0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978:
+        "Treasury"
    }
```

```diff
    EOA  (0xDecF20b9213f5d7f16196420377d37ef5f8F9686) {
    +++ description: None
      address:
-        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
+        "eth:0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
    }
```

```diff
    EOA  (0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9) {
    +++ description: None
      address:
-        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
+        "eth:0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
    }
```

```diff
    EOA  (0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA) {
    +++ description: None
      address:
-        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
+        "eth:0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0706Ffc1722D53a85ba90f32807880ccee968Fed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CanonicalBridgeV1 (0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11)
    +++ description: Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor.
```

```diff
+   Status: CREATED
    contract Eclipse Multisig (0x4720342419C1D316B948690d12C86D5b485C64E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Eclipse Multisig 2 (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1)
    +++ description: (Deprecated) Entrypoint for depositing assets. This contract calls the Mailbox contract for each deposit. In practice this path is not used for deposits.
```

```diff
+   Status: CREATED
    contract CanonicalBridgeV2 (0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51)
    +++ description: Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor.
```

```diff
+   Status: CREATED
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d)
    +++ description: (Deprecated) Mailbox contract for L1 -> L2 messaging. There is no canonical way to send messages back.
```

```diff
+   Status: CREATED
    contract Upgrader0to1 (0xD02f545d57536BC1E8F12D867731F006AacE71E3)
    +++ description: This contract was used for an upgrade an still retains its permissions and permissioned actors.
```

```diff
+   Status: CREATED
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644)
    +++ description: Permissioned escrow for assets bridged to Eclipse. There is no canonical messaging and users need to trust the bridge operators to process deposits and authorize withdrawals.
```

Generated with discovered.json: 0x52434924e62b9ac77adc8ecd688ed47152bb47b9

# Diff at Mon, 07 Jul 2025 17:17:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1cd210776b4b1299634c153aa4f4e97a22ce39c6 block: 22868281
- current block number: 22868281

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22868281 (main branch discovery), not current.

```diff
    contract Eclipse Multisig 2 (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","description":"withdraw ETH from the contract, even when it is paused.","role":".emergencyAC"}
    }
```

```diff
    contract Upgrader0to1 (0xD02f545d57536BC1E8F12D867731F006AacE71E3) {
    +++ description: This contract was used for an upgrade an still retains its permissions and permissioned actors.
      directlyReceivedPermissions.0:
+        {"permission":"interact","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","description":"withdraw ETH from the contract, even when it is paused.","role":".emergencyAC"}
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: Permissioned escrow for assets bridged to Eclipse. There is no canonical messaging and users need to trust the bridge operators to process deposits and authorize withdrawals.
      values.emergencyAC:
+        ["0xD02f545d57536BC1E8F12D867731F006AacE71E3","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]
    }
```

Generated with discovered.json: 0x8100beb322891a9d6f0f3285b2beb23d8ed97e7c

# Diff at Mon, 07 Jul 2025 17:02:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b0f260a09a1907b9753f327752a82a61cb1f520e block: 21121371
- current block number: 22868281

## Description

discodrive.

new contract 'canonicalBridgeV2' added with [minimal diff to the old one.](https://disco.l2beat.com/diff/eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11/eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51)

## Watched changes

```diff
    EOA  (0x1a84163249B2909f746C725F23D5ae2a66D7C4fE) {
    +++ description: None
      receivedPermissions.0.from:
-        "eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
+        "eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
    }
```

```diff
    contract CanonicalBridgeV1 (0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11) {
    +++ description: Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor.
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.1:
-        "0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
      values.withdrawAuthorityAC.1:
-        "0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"
    }
```

```diff
    contract Eclipse Multisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51","description":"authorize withdrawals to any address.","role":".withdrawAuthorityAC"}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51","description":"grant / revoke all access control roles and thus access all permissioned functions in the contract.","role":".defaultAdminAC"}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51","description":"pause the contract for deposits and withdrawals.","role":".pauserAC"}
    }
```

```diff
    contract Eclipse Multisig 2 (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51","description":"grant / revoke all access control roles and thus access all permissioned functions in the contract.","role":".defaultAdminAC"}
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: Permissioned escrow for assets bridged to Eclipse. There is no canonical messaging and users need to trust the bridge operators to process deposits and authorize withdrawals.
      values.accessControl.DEPOSITOR_ROLE.members.0:
-        "0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11"
      values.accessControl.DEPOSITOR_ROLE.members.1:
+        "0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
      values.accessControl.WITHDRAW_AUTHORITY_ROLE.members.2:
+        "0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
      values.withdrawerAC.2:
+        "0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51"
    }
```

```diff
+   Status: CREATED
    contract CanonicalBridgeV2 (0x867A8FcD5Bb6774d4d37fb342D669A35FF789a51)
    +++ description: Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor.
```

## Source code changes

```diff
.../eclipse/ethereum/.flat/CanonicalBridgeV2.sol   | 1516 ++++++++++++++++++++
 1 file changed, 1516 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21121371 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0706Ffc1722D53a85ba90f32807880ccee968Fed) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    EOA  (0x1a84163249B2909f746C725F23D5ae2a66D7C4fE) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","description":"authorize withdrawals to any address.","role":".withdrawAuthorityAC"}]
    }
```

```diff
    contract CanonicalBridgeV1 (0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11) {
    +++ description: Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor.
      name:
-        "CanonicalBridge"
+        "CanonicalBridgeV1"
      values.defaultAdminAC:
+        ["0x4720342419C1D316B948690d12C86D5b485C64E0"]
      values.pauserAC:
+        ["0x4720342419C1D316B948690d12C86D5b485C64E0","0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3"]
      values.withdrawAuthorityAC:
+        ["0x4720342419C1D316B948690d12C86D5b485C64E0","0x1a84163249B2909f746C725F23D5ae2a66D7C4fE"]
      template:
+        "eclipse/CanonicalBridge"
      description:
+        "Entry point to deposit and withdraw ETH. There is no canonical messaging system. Deposited funds are sent to a Treasury contract and withdrawals must be authorized by a permissioned actor."
      category:
+        {"name":"Local Infrastructure","priority":5}
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","description":"withdraw ETH from the contract.","role":".withdrawerAC"}]
    }
```

```diff
    contract Eclipse Multisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      name:
-        "AuthorityMultisig"
+        "Eclipse Multisig"
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","description":"authorize withdrawals to any address.","role":".withdrawAuthorityAC"},{"permission":"interact","from":"eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","description":"grant / revoke all access control roles and thus access all permissioned functions in the contract.","role":".defaultAdminAC"},{"permission":"interact","from":"eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","description":"pause the contract for deposits and withdrawals.","role":".pauserAC"},{"permission":"interact","from":"eth:0xD02f545d57536BC1E8F12D867731F006AacE71E3","description":"start an upgrade of the core contracts.","role":".upgraderAC"},{"permission":"interact","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","description":"grant / revoke all access control roles and thus access all permissioned functions in the contract.","role":".defaultAdminAC"}]
    }
```

```diff
    EOA  (0x681086b630BC3B5f0bf544FDc2A0FC41Cf8977D3) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","description":"pause the contract for deposits and withdrawals.","role":".pauserAC"}]
    }
```

```diff
    contract Eclipse Multisig 2 (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      name:
-        "TreasuryOwner"
+        "Eclipse Multisig 2"
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","description":"grant / revoke all access control roles and thus access all permissioned functions in the contract.","role":".defaultAdminAC"},{"permission":"interact","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","description":"withdraw ETH from the contract.","role":".withdrawerAC"},{"permission":"upgrade","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","role":".upgraderAC"}]
    }
```

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: (Deprecated) Entrypoint for depositing assets. This contract calls the Mailbox contract for each deposit. In practice this path is not used for deposits.
      template:
+        "eclipse/EtherBridge"
      description:
+        "(Deprecated) Entrypoint for depositing assets. This contract calls the Mailbox contract for each deposit. In practice this path is not used for deposits."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: (Deprecated) Mailbox contract for L1 -> L2 messaging. There is no canonical way to send messages back.
      template:
+        "eclipse/Mailbox"
      description:
+        "(Deprecated) Mailbox contract for L1 -> L2 messaging. There is no canonical way to send messages back."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Upgrader0to1 (0xD02f545d57536BC1E8F12D867731F006AacE71E3) {
    +++ description: This contract was used for an upgrade an still retains its permissions and permissioned actors.
      values.upgraderAC:
+        ["0x4720342419C1D316B948690d12C86D5b485C64E0"]
      template:
+        "eclipse/Upgrader0to1"
      description:
+        "This contract was used for an upgrade an still retains its permissions and permissioned actors."
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0xD7E4b67E735733aC98a88F13d087D8aac670E644","role":".upgraderAC"}]
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: Permissioned escrow for assets bridged to Eclipse. There is no canonical messaging and users need to trust the bridge operators to process deposits and authorize withdrawals.
      values.defaultAdminAC:
+        ["0x4720342419C1D316B948690d12C86D5b485C64E0","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]
      values.upgraderAC:
+        ["0xD02f545d57536BC1E8F12D867731F006AacE71E3","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]
      values.withdrawerAC:
+        ["0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]
      template:
+        "eclipse/Treasury"
      description:
+        "Permissioned escrow for assets bridged to Eclipse. There is no canonical messaging and users need to trust the bridge operators to process deposits and authorize withdrawals."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xb8ddfecb85439ef7202e97a2197ee761dc94935c

# Diff at Tue, 04 Mar 2025 10:39:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21121371
- current block number: 21121371

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21121371 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0706Ffc1722D53a85ba90f32807880ccee968Fed) {
    +++ description: None
      sinceBlock:
+        19832392
    }
```

```diff
    contract CanonicalBridge (0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11) {
    +++ description: None
      sinceBlock:
+        21118887
    }
```

```diff
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      sinceBlock:
+        20393653
    }
```

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      sinceBlock:
+        20392523
    }
```

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      sinceBlock:
+        20402682
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      sinceBlock:
+        20402702
    }
```

```diff
    contract Upgrader0to1 (0xD02f545d57536BC1E8F12D867731F006AacE71E3) {
    +++ description: None
      sinceBlock:
+        21118543
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      sinceBlock:
+        20402663
    }
```

Generated with discovered.json: 0x58d05618acd06c3848de3a399ce40e0ed77a3b59

# Diff at Thu, 28 Nov 2024 11:02:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21121371
- current block number: 21121371

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21121371 (main branch discovery), not current.

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0x03f973eaa951078e3ce4e868aba5cb0f8b34d015

# Diff at Tue, 05 Nov 2024 12:13:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21092345
- current block number: 21121371

## Description

Bridge upgrade without major logic changes.

### EtherBridge 
- Now called CanonicalBridge.sol
- More granular roles (AuthorityMultisig still main admin)
- 'FraudWindow' of 7d introduced for normal withdrawals (but still using permissioned withdrawals, and Treasury allows permissioned direct emergencyWithdraw())
- Two step process for withdrawals interfaces with the bridge and not the Treasury directly: 1) `authorizeWithdraw()` by permissioned actor any time 2) `claimWithdraw()` after 7d by anyone

### Treasury
- AccessControl and SemVer added
- minor changes

### EtherBridge

## Watched changes

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xD7E4b67E735733aC98a88F13d087D8aac670E644"}]
    }
```

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      sourceHashes.1:
-        "0x9bdc786276b4d7feab768c6c8c296d44e22918524e1a28b23db40678d2b0eeef"
+        "0x63d1cc40bc2613e87b2d6905ffda15f04f069e3bf72cb12a2979f95a0e7010b7"
      issuedPermissions.0.target:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "0x0000000000000000000000000000000000000000"
      values.$admin:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
+        "0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xa8E15d2B1bf6B0Fd3Bc9Ead06323c0730b67f8d4"
+        "0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978"
      values.$pastUpgrades.1:
+        ["2024-11-05T03:53:23.000Z","0x15aecc2b0cac5c03221b0f7ade10e888ad4f944df4bdc19c1f3c40fc56d5ebbb",["0xF1F7a359C3f33EE8A66bdCbf4c897D25Caf90978"]]
      values.$upgradeCount:
-        1
+        2
      values.accessControl.DEFAULT_ADMIN_ROLE.members.1:
+        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
+        "0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.accessControl.PAUSER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD02f545d57536BC1E8F12D867731F006AacE71E3","0x4720342419C1D316B948690d12C86D5b485C64E0","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]}
      values.accessControl.STARTER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD02f545d57536BC1E8F12D867731F006AacE71E3","0x4720342419C1D316B948690d12C86D5b485C64E0","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]}
      values.accessControl.UPGRADER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD02f545d57536BC1E8F12D867731F006AacE71E3","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]}
      values.accessControl.EMERGENCY_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD02f545d57536BC1E8F12D867731F006AacE71E3","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]}
      values.accessControl.DEPOSITOR_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]}
      values.accessControl.WITHDRAW_AUTHORITY_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11","0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"]}
      values.getVersionComponents.major:
-        1
+        2
      values.owner:
-        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.pendingOwner:
-        "0x4720342419C1D316B948690d12C86D5b485C64E0"
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.DEPOSITOR_ROLE:
+        "0xd50fd8c1b5fa5213a5974932fcc33d2992a99225bc9319caf7cf652d0d2b9acf"
      values.EMERGENCY_ROLE:
+        "0x9e97963c33348a1cae64c3216747be51682ee42f36d1ed282cb81018cdb30e3d"
      values.PAUSER_ROLE:
+        "0x39935d86204acf3d77da26425d7a46606d2550568c6b1876f3a2e76c804c7626"
      values.STARTER_ROLE:
+        "0xac6a94bcd1ac2877eda181de9748e5972fc07f76d4864cecf836b3fca185e53c"
      values.UPGRADER_ROLE:
+        "0x0fb7166d9f681d2bd296a45a1a2e81365c392be30b6156d73b45df44e85cdb9f"
      values.WITHDRAW_AUTHORITY_ROLE:
+        "0xfe482b7b16acc2ea6eda181934b481a09d50ed8e3579b43c531bc57b84336c53"
    }
```

```diff
+   Status: CREATED
    contract CanonicalBridge (0x2B08D7cF7EafF0f5f6623d9fB09b080726D4be11)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Upgrader0to1 (0xD02f545d57536BC1E8F12D867731F006AacE71E3)
    +++ description: None
```

## Source code changes

```diff
.../eclipse/ethereum/.flat/CanonicalBridge.sol     | 952 +++++++++++++++++++++
 .../Treasury/Treasury.sol                          | 658 +++++++++-----
 .../eclipse/ethereum/.flat/Upgrader0to1.sol        | 686 +++++++++++++++
 3 files changed, 2067 insertions(+), 229 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21092345 (main branch discovery), not current.

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

Generated with discovered.json: 0xf7289bb1bf13ba75be6254a4e759e751bd0a6f53

# Diff at Fri, 01 Nov 2024 10:58:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21041942
- current block number: 21092345

## Description

Multisig members change and threshold increase, also added a pending owner. Waiting for the new owner to accept the ownership transfer.

## Watched changes

```diff
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      values.$members.4:
+        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
      values.$members.3:
-        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
+        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
      values.$members.2:
-        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
+        "0x950815d0e585095B06111CD101440fb1E95AB2a5"
      values.$members.1:
-        "0x950815d0e585095B06111CD101440fb1E95AB2a5"
+        "0xCD2fA978D163c0068167dDff8b6951f0E626e6A4"
      values.$members.0:
-        "0xCD2fA978D163c0068167dDff8b6951f0E626e6A4"
+        "0xBb534A6Bd0440727cb5883D037DEd7358059D547"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 5 (60%)"
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x4720342419C1D316B948690d12C86D5b485C64E0"
    }
```

Generated with discovered.json: 0x295923dcc511c729fda3a20b1db66baad067c07f

# Diff at Fri, 25 Oct 2024 10:10:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20997772
- current block number: 21041942

## Description

Single signer changed in AuthorityMultisig.

## Watched changes

```diff
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      values.$members.3:
-        "0xAFa49B46301BaaD9152dD5aF0C05245B0FA58695"
+        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
      values.$members.2:
-        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
+        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
      values.$members.1:
-        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
+        "0x950815d0e585095B06111CD101440fb1E95AB2a5"
      values.$members.0:
-        "0x950815d0e585095B06111CD101440fb1E95AB2a5"
+        "0xCD2fA978D163c0068167dDff8b6951f0E626e6A4"
    }
```

Generated with discovered.json: 0xc8d8f321c1c5b2dde2d7092a08ebb40586ef5d7c

# Diff at Mon, 21 Oct 2024 11:05:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20997772
- current block number: 20997772

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20997772 (main branch discovery), not current.

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"]
      values.$pastUpgrades.0.1:
-        ["0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"]
+        "0x4eed278fc63245a4b2a57a1e1c6dd876c9f18857b515b55a82c2235746c68486"
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"]
      values.$pastUpgrades.0.1:
-        ["0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"]
+        "0xd86c84f78d28d7df3ec285544aea3abab536407f88d5e01ca5b7cc1edd1b6c17"
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xa8E15d2B1bf6B0Fd3Bc9Ead06323c0730b67f8d4"]
      values.$pastUpgrades.0.1:
-        ["0xa8E15d2B1bf6B0Fd3Bc9Ead06323c0730b67f8d4"]
+        "0xa34790c0635f1f739540bf7e2998085e6426d1f17cd58617e26be884f625a0dc"
    }
```

Generated with discovered.json: 0xf6bf5966c73218d06e07d411dec3c09220a1b4b8

# Diff at Sat, 19 Oct 2024 06:18:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@493c96785a6a32c6417182bb9548d3a990297dbe block: 20985614
- current block number: 20997772

## Description

Threshold of the AuthorityMultisig raised to 2. As long as there are no withdrawals, the AuthorityMultisig is essentially a pauser only since upgrades do not change the withdrawals and can only affect a 'virtual' state on the L2 (from ethereum perspective).

## Watched changes

```diff
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      values.$members.3:
+        "0xAFa49B46301BaaD9152dD5aF0C05245B0FA58695"
      values.$members.2:
-        "0xAFa49B46301BaaD9152dD5aF0C05245B0FA58695"
+        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
      values.$members.1:
-        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
+        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
      values.$members.0:
-        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
+        "0x950815d0e585095B06111CD101440fb1E95AB2a5"
      values.$threshold:
-        1
+        2
      values.multisigThreshold:
-        "1 of 3 (33%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0xe3c8d8ce06ef1dfa7a4de366c021479d22d5de92

# Diff at Thu, 17 Oct 2024 13:35:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b22da46ad96e1d0cb3e7d83e3293eb7b76990953 block: 20775895
- current block number: 20985614

## Description

To harden security in the context of recent Multisig hacks, Eclipse chose to add another signer to their multisig. In a sudden clouding of their minds, they forgot to raise the threshold and ended up weakening security instead.

## Watched changes

```diff
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      values.$members.2:
+        "0xAFa49B46301BaaD9152dD5aF0C05245B0FA58695"
      values.$members.1:
-        "0xAFa49B46301BaaD9152dD5aF0C05245B0FA58695"
+        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
      values.$members.0:
-        "0xF48C91ca69Aef5ac47E430c3E90DEE1694d246FA"
+        "0x757210F15AB48f0F8d328984fc321CfA6BB5BFc2"
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0xf0532b82c3340aba55c87da64f0eaec24fe4c45b

# Diff at Mon, 14 Oct 2024 10:50:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20775895
- current block number: 20775895

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775895 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0706Ffc1722D53a85ba90f32807880ccee968Fed) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x6c9915deb3c1995718bd3919c08d1b3cd20ae7957820fa959345c6a6df1b2ab2"]
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xba13db03312283ce922ecc440fda2277ee898ec150ba63de910c6241181199ab"]
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9bdc786276b4d7feab768c6c8c296d44e22918524e1a28b23db40678d2b0eeef"]
    }
```

Generated with discovered.json: 0xe365aa15021cbf0ff69ff4c2eece6610f7372029

# Diff at Tue, 01 Oct 2024 10:50:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775895
- current block number: 20775895

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775895 (main branch discovery), not current.

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-28T04:33:47.000Z",["0x338017E0f208b4EAF8Cd4BbDc8bdabEFd0e39bE9"]]]
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-28T04:37:47.000Z",["0x4ceF0fA54dC06CE0eA198DAb2F57D28A9deE712B"]]]
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-28T04:29:47.000Z",["0xa8E15d2B1bf6B0Fd3Bc9Ead06323c0730b67f8d4"]]]
    }
```

Generated with discovered.json: 0x0dab860a3d1959578632c86c3612ba6ead88f75b

# Diff at Wed, 18 Sep 2024 07:09:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@eb7065b62e0bf0e8e364b8897a969ab444bac4b4 block: 20756723
- current block number: 20775895

## Description

One signer removed from TreasuryOwner.

## Watched changes

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      values.$members.5:
-        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
      values.$members.4:
-        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
+        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
      values.$members.3:
-        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
+        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
      values.$members.2:
-        "0x33440E53476B855A56B831e7924B5aa123981726"
+        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x06a3749952a97dd4187d39d935b01415ee491f40

# Diff at Sun, 15 Sep 2024 14:50:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20663231
- current block number: 20756723

## Description

Add two signers to the TreasuryOwner MS.

## Watched changes

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      values.$members.5:
+        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
      values.$members.4:
+        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
      values.$members.3:
-        "0x3392fd462d9710Fbf3A5703818b9920C119DC080"
+        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
      values.$members.2:
-        "0xEe058D13A0c25a1ce2f68eb02dE4CE7E621982D9"
+        "0x33440E53476B855A56B831e7924B5aa123981726"
      values.$members.1:
-        "0xDecF20b9213f5d7f16196420377d37ef5f8F9686"
+        "0x0706Ffc1722D53a85ba90f32807880ccee968Fed"
      values.$members.0:
-        "0x33440E53476B855A56B831e7924B5aa123981726"
+        "0xd0615B1D3F24f691153C076d45104eEd3eF8cDb5"
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "2 of 6 (33%)"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0706Ffc1722D53a85ba90f32807880ccee968Fed)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GnosisSafe/GnosisSafe.sol       | 953 +++++++++++++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0xd1d58883cb0cfd0b397d67fe177e27bc062d5ed2

# Diff at Mon, 02 Sep 2024 14:35:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0161d2234a9db923bf3750678040cdffe671cd56 block: 20590601
- current block number: 20663231

## Description

Discovery of newly verified contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590601 (main branch discovery), not current.

```diff
    contract TreasuryOwner (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      name:
-        "EclipseMultisig"
+        "TreasuryOwner"
    }
```

```diff
    contract EtherBridge (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      name:
-        "Contract3"
+        "EtherBridge"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x4720342419C1D316B948690d12C86D5b485C64E0"]}}
    }
```

```diff
    contract Mailbox (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      name:
-        "Contract1"
+        "Mailbox"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x4720342419C1D316B948690d12C86D5b485C64E0"]},"TRUSTED_RELAYER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x4720342419C1D316B948690d12C86D5b485C64E0"]},"MODULE_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1"]}}
    }
```

```diff
    contract Treasury (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      name:
-        "Contract2"
+        "Treasury"
    }
```

```diff
+   Status: CREATED
    contract AuthorityMultisig (0x4720342419C1D316B948690d12C86D5b485C64E0)
    +++ description: None
```

Generated with discovered.json: 0x69b4ca88a08532e5b927f8070fe227027e5c3602

# Diff at Fri, 30 Aug 2024 07:52:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20590601
- current block number: 20590601

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590601 (main branch discovery), not current.

```diff
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x0af9f27d0573e340b5d12bb19153c66199e89538

# Diff at Fri, 23 Aug 2024 10:14:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@80160913ce929ca5561025619766d621d08704f0 block: 20512023
- current block number: 20590601

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512023 (main branch discovery), not current.

```diff
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      unverified:
-        true
      values.$upgradeCount:
+        1
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.ETHER_BRIDGE_ID:
+        "0x0bcb6b0b9168c058e28754b0255038028ff8515b5755d989d746fdd8b8f11d7e"
      values.getVersionComponents:
+        {"major":1,"minor":0,"patch":0}
      values.MIN_DEPOSIT:
+        2000000000000000
      values.paused:
+        false
      values.proxiableUUID:
+        "EXPECT_REVERT"
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
    }
```

```diff
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      unverified:
-        true
      values.$upgradeCount:
+        1
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getVersionComponents:
+        {"major":1,"minor":0,"patch":0}
      values.MODULE_ROLE:
+        "0x5098275140f5753db46c42f6e139939968848633a1298402189fdfdafa69b453"
      values.proxiableUUID:
+        "EXPECT_REVERT"
      values.TRUSTED_RELAYER_ROLE:
+        "0xe8a0628d2ba937241981f34311d9db59dd5cf223365e8b6132bca13fc7ae519c"
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
    }
```

```diff
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      unverified:
-        true
      values.$upgradeCount:
+        1
      values.getVersionComponents:
+        {"major":1,"minor":0,"patch":0}
      values.owner:
+        "0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC"
      values.paused:
+        false
      values.pendingOwner:
+        "0x0000000000000000000000000000000000000000"
      values.proxiableUUID:
+        "EXPECT_REVERT"
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
    }
```

Generated with discovered.json: 0xe03dfb2a6dd1ed68503a47ad387a81dd44c5be5d

# Diff at Wed, 21 Aug 2024 10:02:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20512023
- current block number: 20512023

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512023 (main branch discovery), not current.

```diff
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xD7E4b67E735733aC98a88F13d087D8aac670E644"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xD7E4b67E735733aC98a88F13d087D8aac670E644","via":[]}]
    }
```

```diff
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC","via":[]}]
    }
```

Generated with discovered.json: 0xf211bfdcc94c6dd53cc0a2e3c91beb23eb9c3024

# Diff at Mon, 12 Aug 2024 10:45:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20512023

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract EclipseMultisig (0x7B2c1CbB33c53c3C6a695e36096AD2cfCE1c0efC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract3 (0x83cB71D80078bf670b3EfeC6AD9E5E6407cD0fd1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract1 (0xb23B2492f7A9631104A5877F7FFA00633660968d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contract2 (0xD7E4b67E735733aC98a88F13d087D8aac670E644)
    +++ description: None
```
