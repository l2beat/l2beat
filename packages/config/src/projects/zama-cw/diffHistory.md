Generated with discovered.json: 0xbcd0be3384308b413c0bb6d085893d42e1a15df6

# Diff at Thu, 27 Aug 2026 12:39:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@07685e2b690dd5d880203f3696ff2e1bc300a13d block: 1787648016
- current timestamp: 1787834146

## Description

All nine confidential token wrappers were upgraded to a shared new implementation named `ConfidentialWrapper` (eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8). Compared to the previous `ConfidentialWrapperV3`, the upgrade adds two subsystems:

1. Observers: the owner can add/remove observer accounts that receive a wildcard, non-expiring user-decryption delegation over all wrapper-owned encrypted handles, i.e. they can decrypt every confidential balance and transfer amount of the wrapper.
2. Pausing: an owner-set pauser address can pause wrapping, unwrapping, unwrap finalization and confidential transfers; only the owner can unpause.

## Watched changes

```diff
    contract ConfidentialSteakcUSDCWrapper (eth:0x66Bf74E96900D1a19c7070D939D124f2F565C458) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.2:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        2
+        3
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":false,"selector":"0x00000000"}
+        "0x00000000"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract ConfidentialXAUTWrapper (eth:0x73cc9aF9d6BEFdb3c3fAf8a5E8c05Cb95FdaEEf1) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.3:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":true,"selector":"0xfbac3951"}
+        "0xfbac3951"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract ConfidentialZAMAWrapper (eth:0x80CB147Fd86dC6dEe3Eee7e4Cee33d1397d98071) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.3:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":false,"selector":"0x00000000"}
+        "0x00000000"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract ConfidentialBRONWrapper (eth:0x85dE671c3bec1aDeD752c3Cea943521181C826bc) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.3:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":false,"selector":"0x00000000"}
+        "0x00000000"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract ConfidentialTGBPWrapper (eth:0xa873750ccBafD5ec7Dd13bfD5237d7129832eDD9) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.3:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":true,"selector":"0x97f735d5"}
+        "0x97f735d5"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract ConfidentialUSDTWrapper (eth:0xAe0207C757Aa2B4019Ad96edD0092ddc63EF0c50) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.3:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":true,"selector":"0x59bf1abe"}
+        "0x59bf1abe"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
      directlyReceivedPermissions.1.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.4.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.5.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.6.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.7.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.8.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.12.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.17.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      directlyReceivedPermissions.18.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
    }
```

```diff
    contract ConfidentialBbqTGBPWrapper (eth:0xBA4cFF6ED6F7Cb2A58776dECa4E984b498446762) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.2:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        2
+        3
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":false,"selector":"0x00000000"}
+        "0x00000000"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract ZamaGovMultisigB (eth:0xBc860b6a4C860C5424B84A056E53ACFb2C99a38F) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.1.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.4.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.5.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.6.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.7.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.8.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.14.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.19.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.20.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
    }
```

```diff
    contract ConfidentialWETHWrapper (eth:0xda9396b82634Ea99243cE51258B6A5Ae512D4893) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.3:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":false,"selector":"0x00000000"}
+        "0x00000000"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

```diff
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.1.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.4.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.5.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.6.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.7.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.8.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.14.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.19.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
      receivedPermissions.20.description:
-        "block and unblock users, and transfer ownership."
+        "block and unblock users, add and remove observers (wildcard decryption access to all balances of this wrapper), set the pauser and the underlying denylist selector, unpause, and transfer ownership."
    }
```

```diff
    contract ConfidentialUSDCWrapper (eth:0xe978F22157048E5DB8E5d07971376e86671672B2) [zama/ConfidentialWrapper] {
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing.
      template:
-        "zama/ConfidentialWrapperV3"
+        "zama/ConfidentialWrapper"
      sourceHashes.1:
-        "0xc6ef75f9a2275b9cfb58b0322dfb55b63e1630022b171af50f1851ee8052447b"
+        "0x111b5cc66fc29cac57ed685c50a509014181cbf98122b5fd89c0449eea3fab5f"
      description:
-        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks."
+        "ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, optional underlying-token denylist checks, owner-managed observers with wildcard decryption access, and pausing."
      values.$implementation:
-        "eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5"
+        "eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"
      values.$pastUpgrades.3:
+        ["2026-08-25T15:59:35.000Z","0x55c55172da4c231406a41da3838bff87dc9b361c62f208fe0e60994a1b82b0b0",["eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations.
+++ severity: HIGH
      values.getUnderlyingDenyListSelector:
-        {"isSet":true,"selector":"0xfe575a87"}
+        "0xfe575a87"
+++ description: Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.
+++ severity: HIGH
      values.observers:
+        []
+++ description: Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.
      values.paused:
+        false
+++ description: Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.
      values.pauser:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta.getUnderlyingDenyListSelector.description:
-        "Underlying-token denylist hook used by the wrapper. If enabled, the wrapper calls this selector on the underlying token before restricted operations."
+        "Underlying-token denylist hook used by the wrapper. If enabled (non-zero), the wrapper calls this selector on the underlying token before restricted operations."
      fieldMeta.observers:
+        {"severity":"HIGH","description":"Accounts holding a wildcard user-decryption delegation over all wrapper-owned encrypted handles. Observers can decrypt every confidential balance and transfer amount of this wrapper, so adding one changes its privacy guarantees.","type":"PERMISSION"}
      fieldMeta.pauser:
+        {"description":"Address allowed to pause the wrapper (zero address means pausing is disabled). Only the owner can unpause.","type":"PERMISSION"}
      fieldMeta.paused:
+        {"description":"Whether wrapping, unwrapping, unwrap finalization and confidential transfers are currently halted.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x5226fe30Fa7Bf20C1Cd33F125f77D0c42d3c23b5:
-        "ConfidentialWrapperV3"
      implementationNames.eth:0x2ABad2203Eba104b52cf040cCcFA100Df15687F8:
+        "ConfidentialWrapper"
    }
```

## Source code changes

```diff
.../ConfidentialWrapper.sol}                       |  4239 ++++-
 .../ConfidentialWrapper.sol}                       |  4239 ++++-
 .../ConfidentialWrapper.sol}                       |  4239 ++++-
 .../ConfidentialWrapper.sol}                       |  4239 ++++-
 .../ConfidentialWrapper.sol                        | 18868 +++++++++++++++++++
 .../ConfidentialWrapperV3.sol => /dev/null         | 15109 ---------------
 .../ConfidentialWrapper.sol                        | 18868 +++++++++++++++++++
 .../ConfidentialWrapperV3.sol => /dev/null         | 15109 ---------------
 .../ConfidentialWrapper.sol                        | 18868 +++++++++++++++++++
 .../ConfidentialWrapperV3.sol => /dev/null         | 15109 ---------------
 .../ConfidentialWrapper.sol                        | 18868 +++++++++++++++++++
 .../ConfidentialWrapperV3.sol => /dev/null         | 15109 ---------------
 .../ConfidentialWrapper.sol                        | 18868 +++++++++++++++++++
 .../ConfidentialWrapperV3.sol => /dev/null         | 15109 ---------------
 14 files changed, 110336 insertions(+), 76505 deletions(-)
```

Generated with discovered.json: 0xdd6926b5de1bf6cee2ab80edba35ef3782a4c169

# Diff at Tue, 25 Aug 2026 08:55:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@afee435bc99a79b6a7bbb46fd9865fb0e8b74e89 block: 1786539392
- current timestamp: 1787648016

## Description

Add multisig signer.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x9402c42dB162d5a0927c032136f40Cc9C71853F2"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x3cda5fd8197379092f8e08a01d89186879f3d6cc

# Diff at Wed, 12 Aug 2026 12:58:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe520bd4ade03975f1066b4ec47ec40ba7f6e27f block: 1786107356
- current timestamp: 1786539392

## Description

Zama FHEVM host-chain upgrade (the Ethereum-side counterpart of the 2026-08-07 Gateway upgrade that moved KMS management off the Gateway): ZamaGovMultisigB executed a DAO (ACL owner) proposal that upgraded four host contracts and initialized two new ones in a single transaction. Governance is unchanged — everything below remains controlled by the Aragon DAO without a timelock.

- KMSVerifier v0.2.0 -> v0.3.0 ([implementation diff](https://disco.l2beat.com/diff/eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD/eth:0x390683dEa46a61786f4F0807bf3559038Cf43Fa4)): all KMS context management (signer sets, thresholds, context create/destroy) is removed from the verifier and moved to the new ProtocolConfig contract. The KMSVerifier is now a stateless proof checker whose signer- and threshold-reads delegate to ProtocolConfig. Public decryption proofs can still select any non-destroyed context via extraData v1.
- New ProtocolConfig v0.1.0 (proxy eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4, impl eth:0x25c76298Fb4d15bFADce4798519a7B37ac0076E7): ACL-owner-governed registry of KMS nodes (signer + tx-sender + metadata) and contexts, now with four separate per-context thresholds: publicDecryption (7), userDecryption (9), kmsGen and mpc. exactly one context is live. the ACL owner can now retune the thresholds of any live context — including the current one — in place, mirroring GatewayConfig v0.6.0 on the Gateway.
- New KMSGeneration v0.1.0 (proxy eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa, impl eth:0x5DD95e97287672b5d86dd3a427E855099E5AC940): FHE key- and CRS-generation is now orchestrated onchain on Ethereum (previously not orchestrated onchain at all after being removed from the Gateway KMSGeneration v0.5.0). The ACL owner triggers keygen/crsgen and can abort them; KMS nodes respond with EIP-712 signatures that reach consensus at the ProtocolConfig kmsGen threshold.
- ACL v0.3.0 -> v0.4.0 ([implementation diff](https://disco.l2beat.com/diff/eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6/eth:0x9A017e0ba4c19A325D5a89f5dd2112e605E85418)): adds wildcard user-decryption delegation — a user can delegate user decryption of their handles across all app contracts at once
- FHEVMExecutor v0.3.0 -> v0.4.0 ([implementation diff](https://disco.l2beat.com/diff/eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5/eth:0xf444B2B5e45cD07F1E735122F53A2d70A8c81dB5)): adds two n-ary encrypted operations, `fheSum` (sum over up to 100/60 ciphertexts depending on width) and `fheIsIn` (encrypted set membership), with per-element ACL checks on inputs.
- HCULimit v0.2.0 -> v0.3.0 ([implementation diff](https://disco.l2beat.com/diff/eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442/eth:0x69A91389006443448d8E90Fd84B6bDF5ae253837)): adds HCU pricing for the new fheSum/fheIsIn operations and a guard reserving the zero transient-storage slot for the per-transaction HCU accumulator (a handle of 0x0 can no longer read/write it). Limits themselves are unchanged (empty reinitializer).

## Watched changes

```diff
    contract HCULimit (eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2) [zama/ZamaHCULimit_v0_3_0] {
    +++ description: Tracks and enforces per-transaction and per-block homomorphic computation unit limits for FHEVM operation requests. v0.3.0 adds pricing for the fheSum and fheIsIn operations.
      template:
-        "zama/ZamaHCULimit_v0_2_0"
+        "zama/ZamaHCULimit_v0_3_0"
      sourceHashes.1:
-        "0xc52e1b93c97602e6da1f1925e14fc5454426a778875655ec17910be5e217b98e"
+        "0x7ca7880da7a551111a41d9a1673890e2a6c1dd27c3cdf51a82f893b410b2d038"
      description:
-        "Tracks and enforces per-transaction and per-block homomorphic computation unit limits for FHEVM operation requests."
+        "Tracks and enforces per-transaction and per-block homomorphic computation unit limits for FHEVM operation requests. v0.3.0 adds pricing for the fheSum and fheIsIn operations."
      values.$implementation:
-        "eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442"
+        "eth:0x69A91389006443448d8E90Fd84B6bDF5ae253837"
      values.$pastUpgrades.3:
+        ["2026-08-10T11:50:47.000Z","0x3a73cbfe82d45d522aafa83acbc4a44dd89a2b409530e3a52d0076009a036c78",["eth:0x69A91389006443448d8E90Fd84B6bDF5ae253837"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "HCULimit v0.2.0"
+        "HCULimit v0.3.0"
      implementationNames.eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442:
-        "HCULimit"
      implementationNames.eth:0x69A91389006443448d8E90Fd84B6bDF5ae253837:
+        "HCULimit"
    }
```

```diff
    EOA  (eth:0x41b19EB4585450db79ac03ba9503106EC7895905) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    EOA  (eth:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    EOA  (eth:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    EOA  (eth:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier_v0_3_0] {
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Since v0.3.0 it is a stateless proof checker: KMS signer sets and thresholds are read from the ProtocolConfig contract, and confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any explicitly selected non-destroyed KMS context.
      template:
-        "zama/ZamaKMSVerifier_v0_2_0"
+        "zama/ZamaKMSVerifier_v0_3_0"
      sourceHashes.1:
-        "0xa40292fe461810a065f80e305f6b85ab3ca2cfd416dc965d4791a111554cf638"
+        "0x83222b4971c6b79adbd52cb7d500d84b7d2d59886f828b6a1cdc128dcd2bb9d1"
      description:
-        "Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any retained non-destroyed KMS context."
+        "Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Since v0.3.0 it is a stateless proof checker: KMS signer sets and thresholds are read from the ProtocolConfig contract, and confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any explicitly selected non-destroyed KMS context."
      values.$implementation:
-        "eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD"
+        "eth:0x390683dEa46a61786f4F0807bf3559038Cf43Fa4"
      values.$pastUpgrades.3:
+        ["2026-08-10T11:50:47.000Z","0x3a73cbfe82d45d522aafa83acbc4a44dd89a2b409530e3a52d0076009a036c78",["eth:0x390683dEa46a61786f4F0807bf3559038Cf43Fa4"]]
      values.$upgradeCount:
-        3
+        4
      values.createdKmsContexts:
-        []
      values.getVersion:
-        "KMSVerifier v0.2.0"
+        "KMSVerifier v0.3.0"
      values.initialKmsContextId:
-        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
      values.initialKmsContextSigners:
-        ["eth:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","eth:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","eth:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","eth:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","eth:0x41b19EB4585450db79ac03ba9503106EC7895905","eth:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","eth:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","eth:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","eth:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","eth:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","eth:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","eth:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","eth:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
+++ description: ProtocolConfig contract that stores the KMS contexts (signer sets and thresholds) this verifier reads during proof verification. Referenced as a compile-time constant without a getter.
      values.protocolConfig:
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
      fieldMeta.aclOwner.severity:
-        "HIGH"
      fieldMeta.aclOwner.description:
-        "Owner of the Zama ACL contract. This account can create a new KMS signer context that immediately becomes the default verifier authority, and can destroy any non-current context."
+        "Owner of the Zama ACL contract. This account is authorized by onlyACLOwner for KMSVerifier upgrades. Context and threshold management moved to ProtocolConfig in v0.3.0."
      fieldMeta.getKmsSigners.severity:
-        "HIGH"
      fieldMeta.getKmsSigners.description:
-        "KMS signers in the current context. Permission coverage is also indexed through initialKmsContextSigners and createdKmsContexts so superseded contexts remain visible."
+        "KMS signers in the current context, read through from ProtocolConfig where they are indexed for permissions and monitoring."
      fieldMeta.initialKmsContextId:
-        {"severity":"HIGH","description":"Identifier of the first v0.2 KMS context created from the source-defined context counter during initialization or migration.","type":"RISK_PARAMETER"}
      fieldMeta.initialKmsContextSigners:
-        {"severity":"HIGH","description":"Signers in the first v0.2 KMS context. This code-defined context remains authorized for public decryption proofs after later rotations unless the ACL owner explicitly destroys it.","type":"PERMISSION"}
      fieldMeta.createdKmsContexts:
-        {"severity":"HIGH","description":"Non-destroyed KMS contexts created after the v0.2 migration, reconstructed from context creation and destruction events. Each context is an immutable signer and threshold snapshot that can attest results for any ciphertext handle; it is not scoped to ciphertext age or key ID.","type":"PERMISSION"}
      fieldMeta.getThreshold.severity:
-        "HIGH"
      fieldMeta.getThreshold.description:
-        "Minimum number of KMS signatures from the current context required to accept a public decryption result. Retained contexts keep their own immutable thresholds."
+        "Minimum number of unique valid KMS signatures required to accept a public decryption result, read through from the ProtocolConfig public-decryption threshold of the current context."
      fieldMeta.getCurrentKmsContextId.severity:
-        "HIGH"
      fieldMeta.getCurrentKmsContextId.description:
-        "Identifier of the context used when proof extraData is empty or starts with version 0. Version 1 extraData can explicitly select any non-destroyed historical context, including for ciphertexts created after that context was superseded."
+        "Identifier of the context used when proof extraData is empty or starts with version 0. Version 1 extraData can explicitly select any non-destroyed context, including for ciphertexts created after that context was superseded."
      fieldMeta.protocolConfig:
+        {"description":"ProtocolConfig contract that stores the KMS contexts (signer sets and thresholds) this verifier reads during proof verification. Referenced as a compile-time constant without a getter.","type":"EXTERNAL"}
      implementationNames.eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD:
-        "KMSVerifier"
      implementationNames.eth:0x390683dEa46a61786f4F0807bf3559038Cf43Fa4:
+        "KMSVerifier"
    }
```

```diff
    EOA  (eth:0x7C17BE232e5968BDa9516478B798b9E90D013fCC) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    EOA  (eth:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    EOA  (eth:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    EOA  (eth:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
      directlyReceivedPermissions.5:
-        {"permission":"interact","from":"eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03","description":"create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing.","role":".aclOwner"}
      directlyReceivedPermissions.15.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, and manage PauserSet membership."
      directlyReceivedPermissions.16:
+        {"permission":"interact","from":"eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4","description":"create KMS contexts with arbitrary node sets and thresholds that immediately become the default verifier authority, destroy non-current contexts, and retune the per-context thresholds (public decryption, user decryption, key generation, MPC) of any live context including the current one. A malicious context or lowered threshold can attest an inflated unwrap amount and drain pooled wrapper backing.","role":".aclOwner"}
      directlyReceivedPermissions.22:
+        {"permission":"interact","from":"eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa","description":"trigger and abort FHE key and CRS generation rounds executed by the KMS nodes.","role":".aclOwner"}
      directlyReceivedPermissions.36:
+        {"permission":"upgrade","from":"eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4","description":"upgrade the ProtocolConfig implementation.","role":".aclOwner"}
      directlyReceivedPermissions.42:
+        {"permission":"upgrade","from":"eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa","description":"upgrade the KMSGeneration implementation.","role":".aclOwner"}
    }
```

```diff
    EOA  (eth:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    contract ZamaGovMultisigB (eth:0xBc860b6a4C860C5424B84A056E53ACFb2C99a38F) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.5:
-        {"permission":"interact","from":"eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03","description":"create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.17.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, and manage PauserSet membership."
      receivedPermissions.18:
+        {"permission":"interact","from":"eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4","description":"create KMS contexts with arbitrary node sets and thresholds that immediately become the default verifier authority, destroy non-current contexts, and retune the per-context thresholds (public decryption, user decryption, key generation, MPC) of any live context including the current one. A malicious context or lowered threshold can attest an inflated unwrap amount and drain pooled wrapper backing.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.24:
+        {"permission":"interact","from":"eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa","description":"trigger and abort FHE key and CRS generation rounds executed by the KMS nodes.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.38:
+        {"permission":"upgrade","from":"eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4","description":"upgrade the ProtocolConfig implementation.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.44:
+        {"permission":"upgrade","from":"eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa","description":"upgrade the KMSGeneration implementation.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
    }
```

```diff
    EOA  (eth:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    contract ACL (eth:0xcA2E8f1F656CD25C01F05d0b243Ab1ecd4a8ffb6) [zama/ZamaACL_v0_4_0] {
    +++ description: Ethereum host-chain access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references. Its public-decryption and user-delegation events are mirrored into the Gateway MultichainACL by coprocessor consensus. Since v0.4.0 users can delegate user decryption of their handles across all app contracts at once via a wildcard delegation.
      template:
-        "zama/ZamaACL_v0_3_0"
+        "zama/ZamaACL_v0_4_0"
      sourceHashes.1:
-        "0x47f47986a3024b31fa3caee357720f4fba4ea3fae419ff53eebe1a66e87d69ef"
+        "0xa69c606dd333427d22d0b664b3c7b39118934dd95a2b7b37c737e37b39bba7e5"
      description:
-        "Ethereum host-chain access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references. Its public-decryption and user-delegation events are mirrored into the Gateway MultichainACL by coprocessor consensus."
+        "Ethereum host-chain access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references. Its public-decryption and user-delegation events are mirrored into the Gateway MultichainACL by coprocessor consensus. Since v0.4.0 users can delegate user decryption of their handles across all app contracts at once via a wildcard delegation."
      values.$implementation:
-        "eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6"
+        "eth:0x9A017e0ba4c19A325D5a89f5dd2112e605E85418"
      values.$pastUpgrades.4:
+        ["2026-08-10T11:50:47.000Z","0x3a73cbfe82d45d522aafa83acbc4a44dd89a2b409530e3a52d0076009a036c78",["eth:0x9A017e0ba4c19A325D5a89f5dd2112e605E85418"]]
      values.$upgradeCount:
-        4
+        5
      values.getVersion:
-        "ACL v0.3.0"
+        "ACL v0.4.0"
+++ description: Sentinel contract address that a user can pass to delegateForUserDecryption to delegate user decryption of their handles across all app contracts at once. The wildcard does not bypass per-handle allowances.
      values.WILDCARD_DELEGATION_ADDRESS:
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
      fieldMeta.owner.description:
-        "Owner of the ACL and host-contract owner checked by onlyACLOwner in the Zama verifier and helper contracts."
+        "Owner of the ACL and host-contract owner checked by onlyACLOwner in the Zama verifier and helper contracts, including ProtocolConfig and KMSGeneration."
      fieldMeta.WILDCARD_DELEGATION_ADDRESS:
+        {"description":"Sentinel contract address that a user can pass to delegateForUserDecryption to delegate user decryption of their handles across all app contracts at once. The wildcard does not bypass per-handle allowances."}
      implementationNames.eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6:
-        "ACL"
      implementationNames.eth:0x9A017e0ba4c19A325D5a89f5dd2112e605E85418:
+        "ACL"
    }
```

```diff
    contract ProtocolConfig (eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4) [zama/ZamaProtocolConfig] {
    +++ description: Ethereum host-chain registry of KMS node sets, per-context thresholds, and context lifecycle, introduced in the v0.3.0 KMSVerifier upgrade. A KMS context snapshots node transaction senders and signers; the four per-context thresholds (public decryption, user decryption, key generation, MPC) can be retuned by the ACL owner for any live context, including the current one. A newly created context becomes current immediately; older contexts remain selectable for public decryption proofs until destroyed.
      name:
-        "EmptyUUPSProxy"
+        "ProtocolConfig"
      sourceHashes.1:
-        "0xc71891567f1a766aa3a25d1830c5362e3bcf7682574b11b20a51401acb718db4"
+        "0x3ded50e4089de288e1a23ff043bc49ad1ab743d9c4d68dff679355192bc0edbd"
      values.$implementation:
-        "eth:0xC94790325C61A7D98e90d835ea89777d64b17492"
+        "eth:0x25c76298Fb4d15bFADce4798519a7B37ac0076E7"
      values.$pastUpgrades.1:
+        ["2026-08-10T11:50:47.000Z","0x3a73cbfe82d45d522aafa83acbc4a44dd89a2b409530e3a52d0076009a036c78",["eth:0x25c76298Fb4d15bFADce4798519a7B37ac0076E7"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Owner of the Zama ACL contract. This account is authorized by onlyACLOwner for all ProtocolConfig administration.
+++ severity: HIGH
      values.aclOwner:
+        "eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"
+++ description: KMS contexts created after the ProtocolConfig migration, reconstructed from NewKmsContext and KmsContextDestroyed events with their node sets and creation thresholds. The context created by initializeFromMigration does not emit this event and is indexed through the live getters and project overrides. Thresholds can be retuned per context after creation.
+++ severity: HIGH
      values.createdKmsContexts:
+        []
+++ description: KMS signers from contexts created after the ProtocolConfig migration. They remain authorized for public decryption proofs that select their context until the ACL owner destroys that context.
+++ severity: HIGH
      values.createdKmsContextSigners:
+        []
+++ description: KMS transaction senders from contexts created after the ProtocolConfig migration. They remain authorized to submit key- and CRS-generation responses for their context until the ACL owner destroys that context.
      values.createdKmsContextTxSenders:
+        []
+++ description: KMS node transaction-sender addresses in the current context. These accounts submit key- and CRS-generation responses to the Ethereum KMSGeneration contract.
      values.currentKmsTxSenders:
+        ["eth:0x711EBE8aA590f9C9904ff279239E89dB2eFbC890","eth:0xB4CE988D382425F64c99A352375F72A5f1cf6FFB","eth:0x4eC7200E392B97913cbD6d8160B011406EB019F1","eth:0xEd1D622bd59d657580aBAc65312b40B4B2dA6236","eth:0x74a1E2e87a4026b7B8b5252c747E514159515e9a","eth:0x0e25B8DB74c754C8275C0B219ba2A6CD7c59E31D","eth:0x577Fd21e4BC7D644A4177C4B89146e1Ab394De04","eth:0xbaac6F9DD84bFB303F05B4DE45A88Eec86855BD0","eth:0x43e4c21cf9d24Dc5b4e00031349EC213A2ba8340","eth:0xC105B5933446658D226582f7A112F49a70b54364","eth:0xbcF4943A856497FB2345409D35f4d1eae9A0363E","eth:0xD227C4B573800EdA3bAdA6DAC872E9134E012e6D","eth:0x487e41623b7FeB464ff79F7326DCa791c9a1c5EC"]
+++ description: KMS contexts destroyed by the ACL owner. Destroyed contexts are invalid: their per-context getters revert and public decryption proofs can no longer select them.
+++ severity: HIGH
      values.destroyedKmsContexts:
+        []
+++ description: Identifier of the current KMS context, used by verifiers when a proof does not explicitly select a historical context.
      values.getCurrentKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: Minimum number of KMS responses from the current context required to reach consensus on key- and CRS-generation results in KMSGeneration.
      values.getKmsGenThreshold:
+        7
+++ description: KMS signer addresses in the current context. Their signatures are accepted by the Ethereum KMSVerifier for public decryption results and by KMSGeneration for key- and CRS-generation responses. Signers from other live contexts remain authorized for proofs that select their context until that context is destroyed.
+++ severity: HIGH
      values.getKmsSigners:
+        ["eth:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","eth:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","eth:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","eth:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","eth:0x41b19EB4585450db79ac03ba9503106EC7895905","eth:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","eth:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","eth:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","eth:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","eth:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","eth:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","eth:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","eth:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
+++ description: MPC threshold recorded for the current context. The KMS SDK derives its effective MPC threshold from the nodes it knows about instead of reading this value.
      values.getMpcThreshold:
+        4
+++ description: Minimum number of KMS signatures from the current context required to accept a public decryption result. Retunable in place by the ACL owner without rotating the context.
+++ severity: HIGH
      values.getPublicDecryptionThreshold:
+        7
+++ description: Minimum number of KMS signatures from the current context required for user decryption verification. Retunable in place by the ACL owner without rotating the context.
+++ severity: HIGH
      values.getUserDecryptionThreshold:
+        9
      values.getVersion:
+        "ProtocolConfig v0.1.0"
+++ description: Live public-decryption threshold of the migrated context, retunable in place by the ACL owner. It remains security-critical after future rotations while the context is live. This call reverts once the context is destroyed; remove the field then.
+++ severity: HIGH
      values.migratedKmsContextPublicDecryptionThreshold:
+        7
+++ description: Live KMS signer set of the migrated context. Node membership is immutable, so these signers remain authorized for proofs selecting this context after future rotations. This call reverts once the context is destroyed; remove the field then.
+++ severity: HIGH
      values.migratedKmsContextSigners:
+        ["eth:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","eth:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","eth:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","eth:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","eth:0x41b19EB4585450db79ac03ba9503106EC7895905","eth:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","eth:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","eth:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","eth:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","eth:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","eth:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","eth:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","eth:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
+++ description: Live user-decryption threshold of the migrated context, retunable in place by the ACL owner. This call reverts once the context is destroyed; remove the field then.
      values.migratedKmsContextUserDecryptionThreshold:
+        9
      errors:
-        {"migratedKmsContextPublicDecryptionThreshold":"Processing error occurred.","migratedKmsContextSigners":"Processing error occurred.","migratedKmsContextUserDecryptionThreshold":"Processing error occurred.","proxiableUUID":"Processing error occurred."}
      fieldMeta.aclOwner:
+        {"severity":"HIGH","description":"Owner of the Zama ACL contract. This account is authorized by onlyACLOwner for all ProtocolConfig administration.","type":"PERMISSION"}
      fieldMeta.getKmsSigners:
+        {"severity":"HIGH","description":"KMS signer addresses in the current context. Their signatures are accepted by the Ethereum KMSVerifier for public decryption results and by KMSGeneration for key- and CRS-generation responses. Signers from other live contexts remain authorized for proofs that select their context until that context is destroyed.","type":"PERMISSION"}
      fieldMeta.currentKmsTxSenders:
+        {"description":"KMS node transaction-sender addresses in the current context. These accounts submit key- and CRS-generation responses to the Ethereum KMSGeneration contract.","type":"PERMISSION"}
      fieldMeta.getPublicDecryptionThreshold:
+        {"severity":"HIGH","description":"Minimum number of KMS signatures from the current context required to accept a public decryption result. Retunable in place by the ACL owner without rotating the context.","type":"RISK_PARAMETER"}
      fieldMeta.getUserDecryptionThreshold:
+        {"severity":"HIGH","description":"Minimum number of KMS signatures from the current context required for user decryption verification. Retunable in place by the ACL owner without rotating the context.","type":"RISK_PARAMETER"}
      fieldMeta.getKmsGenThreshold:
+        {"description":"Minimum number of KMS responses from the current context required to reach consensus on key- and CRS-generation results in KMSGeneration.","type":"RISK_PARAMETER"}
      fieldMeta.getMpcThreshold:
+        {"description":"MPC threshold recorded for the current context. The KMS SDK derives its effective MPC threshold from the nodes it knows about instead of reading this value.","type":"RISK_PARAMETER"}
      fieldMeta.getCurrentKmsContextId:
+        {"description":"Identifier of the current KMS context, used by verifiers when a proof does not explicitly select a historical context.","type":"RISK_PARAMETER"}
      fieldMeta.createdKmsContexts:
+        {"severity":"HIGH","description":"KMS contexts created after the ProtocolConfig migration, reconstructed from NewKmsContext and KmsContextDestroyed events with their node sets and creation thresholds. The context created by initializeFromMigration does not emit this event and is indexed through the live getters and project overrides. Thresholds can be retuned per context after creation.","type":"RISK_PARAMETER"}
      fieldMeta.createdKmsContextSigners:
+        {"severity":"HIGH","description":"KMS signers from contexts created after the ProtocolConfig migration. They remain authorized for public decryption proofs that select their context until the ACL owner destroys that context.","type":"PERMISSION"}
      fieldMeta.createdKmsContextTxSenders:
+        {"description":"KMS transaction senders from contexts created after the ProtocolConfig migration. They remain authorized to submit key- and CRS-generation responses for their context until the ACL owner destroys that context.","type":"PERMISSION"}
      fieldMeta.destroyedKmsContexts:
+        {"severity":"HIGH","description":"KMS contexts destroyed by the ACL owner. Destroyed contexts are invalid: their per-context getters revert and public decryption proofs can no longer select them.","type":"RISK_PARAMETER"}
      implementationNames.eth:0xC94790325C61A7D98e90d835ea89777d64b17492:
-        "EmptyUUPSProxy"
      implementationNames.eth:0x25c76298Fb4d15bFADce4798519a7B37ac0076E7:
+        "ProtocolConfig"
      template:
+        "zama/ZamaProtocolConfig"
      description:
+        "Ethereum host-chain registry of KMS node sets, per-context thresholds, and context lifecycle, introduced in the v0.3.0 KMSVerifier upgrade. A KMS context snapshots node transaction senders and signers; the four per-context thresholds (public decryption, user decryption, key generation, MPC) can be retuned by the ACL owner for any live context, including the current one. A newly created context becomes current immediately; older contexts remain selectable for public decryption proofs until destroyed."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FHEVMExecutor (eth:0xD82385dADa1ae3E969447f20A3164F6213100e75) [zama/ZamaFHEVMExecutor_v0_4_0] {
    +++ description: FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results. v0.4.0 adds the n-ary encrypted operations fheSum and fheIsIn (encrypted set membership) over bounded ciphertext collections.
      template:
-        "zama/ZamaFHEVMExecutor_v0_3_0"
+        "zama/ZamaFHEVMExecutor_v0_4_0"
      sourceHashes.1:
-        "0xf475718e9125acfc2f69d3c9cca8cedb9a15c644da7490f7f5fe0ae2690a77cc"
+        "0x8521799e0a57218bcbd587c2f46222a266bbcbe2f27780cc0bf6ed66eb9cda1f"
      description:
-        "FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results."
+        "FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results. v0.4.0 adds the n-ary encrypted operations fheSum and fheIsIn (encrypted set membership) over bounded ciphertext collections."
      values.$implementation:
-        "eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5"
+        "eth:0xf444B2B5e45cD07F1E735122F53A2d70A8c81dB5"
      values.$pastUpgrades.4:
+        ["2026-08-10T11:50:47.000Z","0x3a73cbfe82d45d522aafa83acbc4a44dd89a2b409530e3a52d0076009a036c78",["eth:0xf444B2B5e45cD07F1E735122F53A2d70A8c81dB5"]]
      values.$upgradeCount:
-        4
+        5
      values.getVersion:
-        "FHEVMExecutor v0.3.0"
+        "FHEVMExecutor v0.4.0"
      implementationNames.eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5:
-        "FHEVMExecutor"
      implementationNames.eth:0xf444B2B5e45cD07F1E735122F53A2d70A8c81dB5:
+        "FHEVMExecutor"
    }
```

```diff
    EOA  (eth:0xdC472efa1642D5afB684aAaa546E22FB24AAB965) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    EOA  (eth:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.5:
-        {"permission":"interact","from":"eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03","description":"create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.17.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, and manage PauserSet membership."
      receivedPermissions.18:
+        {"permission":"interact","from":"eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4","description":"create KMS contexts with arbitrary node sets and thresholds that immediately become the default verifier authority, destroy non-current contexts, and retune the per-context thresholds (public decryption, user decryption, key generation, MPC) of any live context including the current one. A malicious context or lowered threshold can attest an inflated unwrap amount and drain pooled wrapper backing.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.24:
+        {"permission":"interact","from":"eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa","description":"trigger and abort FHE key and CRS generation rounds executed by the KMS nodes.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.38:
+        {"permission":"upgrade","from":"eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4","description":"upgrade the ProtocolConfig implementation.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.44:
+        {"permission":"upgrade","from":"eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa","description":"upgrade the KMSGeneration implementation.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
    }
```

```diff
    EOA  (eth:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign public decryption results accepted by the KMSVerifier."
+        "sign public decryption results accepted by the KMSVerifier and key- and CRS-generation responses accepted by KMSGeneration."
      receivedPermissions.0.from:
-        "eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03"
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
    }
```

```diff
    contract KMSGeneration (eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa) [zama/ZamaKMSGeneration] {
    +++ description: Orchestrates FHE key and CRS generation on the Ethereum host chain, taking over the workflows removed from the Gateway KMSGeneration in v0.5.0. The ACL owner triggers and aborts generations; KMS node transaction senders registered in ProtocolConfig submit EIP-712-signed responses that activate a key or CRS once the ProtocolConfig key-generation threshold is reached.
      name:
-        "EmptyUUPSProxy"
+        "KMSGeneration"
      sourceHashes.1:
-        "0xc71891567f1a766aa3a25d1830c5362e3bcf7682574b11b20a51401acb718db4"
+        "0x265ec46d9bb4498caf973d6a60d3cbbe1f3ceff12597fcd3140bdff9e6322f76"
      values.$implementation:
-        "eth:0xC94790325C61A7D98e90d835ea89777d64b17492"
+        "eth:0x5DD95e97287672b5d86dd3a427E855099E5AC940"
      values.$pastUpgrades.1:
+        ["2026-08-10T11:50:47.000Z","0x3a73cbfe82d45d522aafa83acbc4a44dd89a2b409530e3a52d0076009a036c78",["eth:0x5DD95e97287672b5d86dd3a427E855099E5AC940"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Owner of the Zama ACL contract. This account is authorized by onlyACLOwner for KMSGeneration administration.
      values.aclOwner:
+        "eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"
+++ description: EIP-712 domain against which KMS key- and CRS-generation response signatures are verified.
      values.eip712Domain:
+        {"fields":"0x0f","name":"KMSGeneration","version":"1","chainId":1,"verifyingContract":"eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]}
+++ description: Identifier of the currently active CRS generated through this contract.
      values.getActiveCrsId:
+        "2261564242916331941866620800950935700259179388000792266395655937654553313281"
+++ description: Identifier of the currently active FHE key generated through this contract.
      values.getActiveKeyId:
+        "1809251394333065553493296640760748560207343510400633813116524750123642650625"
      values.getCrsCounter:
+        "2261564242916331941866620800950935700259179388000792266395655937654553313281"
      values.getKeyCounter:
+        "1809251394333065553493296640760748560207343510400633813116524750123642650625"
      values.getVersion:
+        "KMSGeneration v0.1.0"
+++ description: ProtocolConfig contract providing the KMS node set and the key-generation consensus threshold. Referenced as a compile-time constant without a getter.
      values.protocolConfig:
+        "eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4"
      errors:
-        {"proxiableUUID":"Processing error occurred."}
      implementationNames.eth:0xC94790325C61A7D98e90d835ea89777d64b17492:
-        "EmptyUUPSProxy"
      implementationNames.eth:0x5DD95e97287672b5d86dd3a427E855099E5AC940:
+        "KMSGeneration"
      template:
+        "zama/ZamaKMSGeneration"
      description:
+        "Orchestrates FHE key and CRS generation on the Ethereum host chain, taking over the workflows removed from the Gateway KMSGeneration in v0.5.0. The ACL owner triggers and aborts generations; KMS node transaction senders registered in ProtocolConfig submit EIP-712-signed responses that activate a key or CRS once the ProtocolConfig key-generation threshold is reached."
      fieldMeta:
+        {"protocolConfig":{"description":"ProtocolConfig contract providing the KMS node set and the key-generation consensus threshold. Referenced as a compile-time constant without a getter.","type":"EXTERNAL"},"aclOwner":{"description":"Owner of the Zama ACL contract. This account is authorized by onlyACLOwner for KMSGeneration administration.","type":"PERMISSION"},"getActiveKeyId":{"description":"Identifier of the currently active FHE key generated through this contract."},"getActiveCrsId":{"description":"Identifier of the currently active CRS generated through this contract."},"eip712Domain":{"description":"EIP-712 domain against which KMS key- and CRS-generation response signatures are verified."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

## Source code changes

```diff
.../{.flat@1786107356 => .flat}/ACL/ACL.sol        |   93 +-
 .../EmptyUUPSProxy.sol => /dev/null                | 1172 -----
 .../EmptyUUPSProxy.sol => /dev/null                | 1172 -----
 .../FHEVMExecutor/FHEVMExecutor.sol                |  657 ++-
 .../HCULimit/HCULimit.sol                          |  237 +-
 .../ERC1967Proxy.p.sol                             |    0
 .../KMSGeneration.sol                              | 5465 ++++++++++++++++++++
 .../ERC1967Proxy.p.sol                             |    0
 .../KMSGeneration.sol                              |    0
 .../KMSVerifier/KMSVerifier.sol                    |  569 +-
 .../ProtocolConfig}/ERC1967Proxy.p.sol             |    0
 .../.flat/ProtocolConfig/ProtocolConfig.sol        | 3956 ++++++++++++++
 12 files changed, 10548 insertions(+), 2773 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1786107356 (main branch discovery), not current.

```diff
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier_v0_2_0] {
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any retained non-destroyed KMS context.
      values.initialKmsContextThreshold:
-        7
      fieldMeta.initialKmsContextThreshold:
-        {"severity":"HIGH","description":"Immutable public-decryption threshold assigned to initialKmsContextId during the v0.2 migration. It remains security-critical after rotation while initialKmsContextSigners is non-empty; an empty signer list means the context was destroyed.","type":"RISK_PARAMETER"}
    }
```

```diff
+   Status: CREATED
    contract EmptyUUPSProxy (eth:0xD8236B57394f90726b26aB25D38CeAC776E1a7C4) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmptyUUPSProxy (eth:0xf102cC9A9D2174630c394f5b7B7D63104E348daa) [N/A]
    +++ description: None
```

Generated with discovered.json: 0x55d44c4022a34a2b451603062a4b613f2b96a88c

# Diff at Fri, 07 Aug 2026 12:57:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3952db2ad8479541c0493e01971033f3859abf91 block: 1785844532
- current timestamp: 1786107356

## Description

Zama Gateway upgrade: a larger upgrade that touches key generation and is only half deployed.

- Decryption v0.4.0 -> v0.5.0: requests now pin a KMS context at request time and responses must reference the pinned context
- GatewayConfig v0.5.0 -> v0.6.0: the owner can now destroy non-current KMS contexts (immediately invalidating them for decryption), retune thresholds of any live context (context-scoped events), and disable/enable/remove host chains. Coprocessor updates now require InputVerification to be paused.
- KMSGeneration v0.4.0 -> v0.5.0: now view-only; all key/CRS/PRSS/resharing workflows were removed from the gateway after their move to Ethereum (getActiveKeyId/getActiveCrsId are gone).
- InputVerification v0.3.0 -> v0.4.0 and CiphertextCommits v0.3.0 -> v0.4.0: minor; both now reject requests/handles from disabled host chains,  and CiphertextCommits dropped its KMSGeneration reference.
- a Polygon host chain (chainId 137) is now registered in GatewayConfig.

## Watched changes

```diff
    EOA  (zama:0x0e25B8DB74c754C8275C0B219ba2A6CD7c59E31D) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption_v0_5_0] {
    +++ description: Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each request pins a KMS context at request time (explicitly through extraData or the then-current context) and rejects unknown or destroyed contexts; responses must reference the pinned context. Requests recorded before v0.5.0 fall back to the context declared by each response. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain.
      template:
-        "zama/Decryption_v0_4_0"
+        "zama/Decryption_v0_5_0"
      sourceHashes.1:
-        "0xcd821ac822a19a355acde1dd7ce435e2a6e16e21017756b899c058ee64552e28"
+        "0x1dd2af26cc2be12ff30232e8df9c95ec66fcbc987f40372ad56a9d8f1073260c"
      description:
-        "Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each response independently selects a KMS context through extraData, or uses the context current when the response executes; requests do not store a context. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain."
+        "Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each request pins a KMS context at request time (explicitly through extraData or the then-current context) and rejects unknown or destroyed contexts; responses must reference the pinned context. Requests recorded before v0.5.0 fall back to the context declared by each response. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain."
      values.$implementation:
-        "zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0"
+        "zama:0x86F8e9626cCff3f2eB3dA248F33DfF43531DBFD8"
      values.$pastUpgrades.4:
+        ["2026-08-06T17:11:04.000Z","0x350755101263bed64dc377ef6f3ef07f95f97918b689967a60ee625d0d9e025c",["zama:0x86F8e9626cCff3f2eB3dA248F33DfF43531DBFD8"]]
      values.$upgradeCount:
-        4
+        5
      values.getVersion:
-        "Decryption v0.4.0"
+        "Decryption v0.5.0"
      fieldMeta.gatewayMultichainACL.description:
-        "MultichainACL contract containing the gateway-side host-chain ACL mirror. The upgraded Decryption contract no longer checks it onchain and relies on KMS nodes to enforce ACL state."
+        "MultichainACL contract containing the gateway-side host-chain ACL mirror. Decryption does not check it onchain and relies on KMS nodes to enforce ACL state."
      fieldMeta.gatewayKmsTxSenders.description:
-        "KMS transaction-sender addresses configured in the current GatewayConfig context. Historical context senders can also submit responses when response extraData explicitly selects their retained context. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
+        "KMS transaction-sender addresses configured in the current GatewayConfig context. Senders from other live contexts can still submit responses to requests that pinned their context; destroying a context revokes this. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
      fieldMeta.gatewayKmsSigners.description:
-        "KMS signer addresses configured in the current GatewayConfig context. Historical context signers can also sign responses when response extraData explicitly selects their retained context. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
+        "KMS signer addresses configured in the current GatewayConfig context. Signers from other live contexts can still sign responses to requests that pinned their context; destroying a context revokes this. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
      fieldMeta.gatewayKmsContextId.description:
-        "Current GatewayConfig KMS context used by responses whose extraData is empty or starts with version 0. Requests do not bind this value, so a rotation can change the context used to answer an already pending request."
+        "Current GatewayConfig KMS context, pinned by new requests whose extraData is empty or starts with version 0. The pin is stored per request, so a later rotation does not change the context or thresholds used to answer a pending request. Requests recorded before v0.5.0 have no pin and fall back to the context declared by each response."
      fieldMeta.gatewayPublicDecryptionThreshold.description:
-        "Minimum matching-signature count for the current context. Public responses are grouped by a digest containing raw extraData; identical empty or version 0 extraData can accumulate responses across a context rotation while the last response selects the threshold checked."
+        "Minimum matching-signature count for public decryption consensus in the current context. Each request is answered under the threshold of its pinned context, which the GatewayConfig owner can retune per context."
      fieldMeta.gatewayUserDecryptionThreshold.description:
-        "Minimum response count for the current context. User response counts are stored per request rather than per context, so valid shares submitted under different contexts can be combined and the last response selects the threshold checked."
+        "Minimum response count for user decryption consensus in the current context. Each request is answered under the threshold of its pinned context, which the GatewayConfig owner can retune per context."
      implementationNames.zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0:
-        "Decryption"
      implementationNames.zama:0x86F8e9626cCff3f2eB3dA248F33DfF43531DBFD8:
+        "Decryption"
    }
```

```diff
    contract KMSGeneration (zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3) [zama/KMSGeneration_v0_5_0] {
    +++ description: View-only gateway contract retaining historical queries for previously generated FHE keys and CRS materials. All state-changing key-generation, CRS-generation, PRSS, and key-resharing workflows were removed in v0.5.0 after their move to Ethereum.
      template:
-        "zama/KMSGeneration"
+        "zama/KMSGeneration_v0_5_0"
      sourceHashes.1:
-        "0x24b946dbf9b33a087ddcfba5bef6adfb4fb85c47ee48d0f3d35487b5a76900dc"
+        "0x19abe2dec360556cd7dd3bbf0197f56dcaf76dc5889859f0e18046a971c70498"
      description:
-        "Gateway contract that orchestrates FHE key generation, CRS generation, PRSS initialization, and key resharing through threshold KMS responses."
+        "View-only gateway contract retaining historical queries for previously generated FHE keys and CRS materials. All state-changing key-generation, CRS-generation, PRSS, and key-resharing workflows were removed in v0.5.0 after their move to Ethereum."
      values.$implementation:
-        "zama:0x3d345DFc156381E6060Cdf652cDf7f92DF94fAFF"
+        "zama:0x68CEb7709aC1bcD60e36c4144a243A445A2cb076"
      values.$pastUpgrades.3:
+        ["2026-08-06T17:11:04.000Z","0x350755101263bed64dc377ef6f3ef07f95f97918b689967a60ee625d0d9e025c",["zama:0x68CEb7709aC1bcD60e36c4144a243A445A2cb076"]]
      values.$upgradeCount:
-        3
+        4
      values.gatewayKmsGenThreshold:
-        7
      values.gatewayKmsSigners:
-        ["zama:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","zama:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","zama:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","zama:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","zama:0x41b19EB4585450db79ac03ba9503106EC7895905","zama:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","zama:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","zama:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","zama:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","zama:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","zama:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","zama:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","zama:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
      values.gatewayKmsTxSenders:
-        ["zama:0x711EBE8aA590f9C9904ff279239E89dB2eFbC890","zama:0xB4CE988D382425F64c99A352375F72A5f1cf6FFB","zama:0x4eC7200E392B97913cbD6d8160B011406EB019F1","zama:0xEd1D622bd59d657580aBAc65312b40B4B2dA6236","zama:0x74a1E2e87a4026b7B8b5252c747E514159515e9a","zama:0x0e25B8DB74c754C8275C0B219ba2A6CD7c59E31D","zama:0x577Fd21e4BC7D644A4177C4B89146e1Ab394De04","zama:0xbaac6F9DD84bFB303F05B4DE45A88Eec86855BD0","zama:0x43e4c21cf9d24Dc5b4e00031349EC213A2ba8340","zama:0xC105B5933446658D226582f7A112F49a70b54364","zama:0xbcF4943A856497FB2345409D35f4d1eae9A0363E","zama:0xD227C4B573800EdA3bAdA6DAC872E9134E012e6D","zama:0x487e41623b7FeB464ff79F7326DCa791c9a1c5EC"]
      values.getActiveCrsId:
-        "2261564242916331941866620800950935700259179388000792266395655937654553313281"
      values.getActiveKeyId:
-        "1809251394333065553493296640760748560207343510400633813116524750123642650625"
      values.getVersion:
-        "KMSGeneration v0.4.0"
+        "KMSGeneration v0.5.0"
      fieldMeta.gatewayConfig.description:
-        "GatewayConfig contract used as the source of truth for the gateway owner, KMS set, and KMS generation threshold."
+        "GatewayConfig contract used as the source of truth for the gateway owner and for resolving KMS node storage URLs in historical material queries."
      fieldMeta.gatewayOwner.description:
-        "Owner of GatewayConfig. This account authorizes KMSGeneration upgrades and can trigger key, CRS, PRSS, and key-resharing workflows."
+        "Owner of GatewayConfig. This account authorizes KMSGeneration upgrades."
      fieldMeta.gatewayKmsTxSenders:
-        {"severity":"HIGH","description":"KMS transaction-sender addresses configured in GatewayConfig. These accounts may submit preprocessing keygen, keygen, and CRS generation responses.","type":"PERMISSION"}
      fieldMeta.gatewayKmsSigners:
-        {"severity":"HIGH","description":"KMS signer addresses configured in GatewayConfig. Their EIP-712 signatures determine whether key and CRS generation responses reach threshold.","type":"PERMISSION"}
      fieldMeta.gatewayKmsGenThreshold:
-        {"severity":"HIGH","description":"Minimum number of matching KMS responses required before key or CRS generation reaches consensus.","type":"RISK_PARAMETER"}
      fieldMeta.getActiveKeyId:
-        {"severity":"HIGH","description":"Identifier of the active FHE key generated through KMS consensus.","type":"RISK_PARAMETER"}
      fieldMeta.getActiveCrsId:
-        {"severity":"HIGH","description":"Identifier of the active CRS generated through KMS consensus.","type":"RISK_PARAMETER"}
      fieldMeta.eip712Domain.description:
-        "EIP-712 domain used when validating KMS signatures over key-generation and CRS-generation responses."
+        "EIP-712 domain retained from the KMS generation workflows removed in v0.5.0."
      implementationNames.zama:0x3d345DFc156381E6060Cdf652cDf7f92DF94fAFF:
-        "KMSGeneration"
      implementationNames.zama:0x68CEb7709aC1bcD60e36c4144a243A445A2cb076:
+        "KMSGeneration"
    }
```

```diff
    EOA  (zama:0x41b19EB4585450db79ac03ba9503106EC7895905) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0x43e4c21cf9d24Dc5b4e00031349EC213A2ba8340) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0x487e41623b7FeB464ff79F7326DCa791c9a1c5EC) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0x4eC7200E392B97913cbD6d8160B011406EB019F1) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0x577Fd21e4BC7D644A4177C4B89146e1Ab394De04) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    contract SafeL2 (zama:0x5f0F86BcEad6976711C9B131bCa5D30E767fe2bE) [GnosisSafe] {
    +++ description: Gateway owner Safe. Its LayerZero governance module is outside the Zama Gateway protocol surface covered here.
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"start KMS key generation, CRS generation, PRSS initialization, and key resharing.","role":".gatewayOwner"}
      receivedPermissions.5.description:
-        "create KMS contexts that immediately become current, update current thresholds and other gateway configuration, transfer ownership, and unpause gateway workflow contracts. Historical KMS contexts cannot be removed in this version."
+        "create KMS contexts that immediately become current, destroy historical KMS contexts, update thresholds of any live context, manage coprocessors, custodians and host chains, transfer ownership, and unpause gateway workflow contracts."
    }
```

```diff
    EOA  (zama:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0x711EBE8aA590f9C9904ff279239E89dB2eFbC890) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0x74a1E2e87a4026b7B8b5252c747E514159515e9a) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0x7C17BE232e5968BDa9516478B798b9E90D013fCC) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0xB4CE988D382425F64c99A352375F72A5f1cf6FFB) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0xbaac6F9DD84bFB303F05B4DE45A88Eec86855BD0) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0xbcF4943A856497FB2345409D35f4d1eae9A0363E) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    EOA  (zama:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0xC105B5933446658D226582f7A112F49a70b54364) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    contract InputVerification (zama:0xcB1bB072f38bdAF0F328CdEf1Fc6eDa1DF029287) [zama/InputVerification] {
    +++ description: Gateway contract that receives encrypted input verification requests from registered and enabled host chains, collects coprocessor responses, and emits a threshold-signed attestation once coprocessor consensus is reached. Ethereum InputVerifier verifies attestations against this contract's EIP-712 domain.
      sourceHashes.1:
-        "0x52c38ce781ecef28b118222541c9b079f2ae7d6402452584e620e84ca347875f"
+        "0x58bb055397e294a46ebccbc53c94bb2494bf05acd7ad77f2fb7cc46b3ef1eb92"
      values.$implementation:
-        "zama:0xA08c4367eB984945da2dad5BF7d94D1B2863197A"
+        "zama:0xf9f0F5ef8301CF1573EBe0F45E13A4CabB621821"
      values.$pastUpgrades.3:
+        ["2026-08-06T17:11:04.000Z","0x350755101263bed64dc377ef6f3ef07f95f97918b689967a60ee625d0d9e025c",["zama:0xf9f0F5ef8301CF1573EBe0F45E13A4CabB621821"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "InputVerification v0.3.0"
+        "InputVerification v0.4.0"
      implementationNames.zama:0xA08c4367eB984945da2dad5BF7d94D1B2863197A:
-        "InputVerification"
      implementationNames.zama:0xf9f0F5ef8301CF1573EBe0F45E13A4CabB621821:
+        "InputVerification"
    }
```

```diff
    EOA  (zama:0xD227C4B573800EdA3bAdA6DAC872E9134E012e6D) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

```diff
    contract CiphertextCommits (zama:0xd82cF70FC102028cd01acB87D0E107780ae4F41F) [zama/CiphertextCommits] {
    +++ description: Gateway contract that stores ciphertext and SNS ciphertext digests after coprocessor consensus, allowing decryption requests to reference committed ciphertext material. Digests referencing unregistered or disabled host chains are rejected.
      sourceHashes.1:
-        "0x70a834887489420cb7ea7044739bcc74d735be01e262a27ea23132992d21a898"
+        "0xa3aa22a184258ca16a5d83ce495ae0d307d4c5ec9fda8a7622d4f95728f4af03"
      values.$implementation:
-        "zama:0xC92f2dc7eF79728ed32e745020EF463270217e78"
+        "zama:0xB373Ae42736E3C266D4A5D090c00c7f0Bda06622"
      values.$pastUpgrades.3:
+        ["2026-08-06T17:11:04.000Z","0x350755101263bed64dc377ef6f3ef07f95f97918b689967a60ee625d0d9e025c",["zama:0xB373Ae42736E3C266D4A5D090c00c7f0Bda06622"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "CiphertextCommits v0.3.0"
+        "CiphertextCommits v0.4.0"
      implementationNames.zama:0xC92f2dc7eF79728ed32e745020EF463270217e78:
-        "CiphertextCommits"
      implementationNames.zama:0xB373Ae42736E3C266D4A5D090c00c7f0Bda06622:
+        "CiphertextCommits"
    }
```

```diff
    EOA  (zama:0xdC472efa1642D5afB684aAaa546E22FB24AAB965) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    contract GatewayConfig (zama:0xDE537Be194777A56f8B19d14079E6a78249390ab) [zama/GatewayConfig_v0_6_0] {
    +++ description: Central configuration contract for the Zama Gateway. A KMS context snapshots node transaction senders, signers, and workflow thresholds; the owner can create new contexts, retune the thresholds of any live context, and destroy non-current contexts, which immediately invalidates them for decryption. Registered host chains can be disabled, re-enabled, or removed by the owner.
      template:
-        "zama/GatewayConfig_v0_5_0"
+        "zama/GatewayConfig_v0_6_0"
      sourceHashes.1:
-        "0x1089121569189032b8cee0dae0c71eedecf7757f712a6d14ef684915093c6747"
+        "0xe903576aaecdd97c5036c6bc029149a11b44484c78d9c6b0d802a882d4744597"
      description:
-        "Central configuration contract for the Zama Gateway. A KMS context snapshots node transaction senders, signers, and workflow thresholds; historical contexts remain stored and selectable by Decryption because this version has no context-destruction function."
+        "Central configuration contract for the Zama Gateway. A KMS context snapshots node transaction senders, signers, and workflow thresholds; the owner can create new contexts, retune the thresholds of any live context, and destroy non-current contexts, which immediately invalidates them for decryption. Registered host chains can be disabled, re-enabled, or removed by the owner."
      values.$implementation:
-        "zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00"
+        "zama:0x1950aD98e834f6c07553365196d4CddeD179c536"
      values.$pastUpgrades.4:
+        ["2026-08-06T17:11:04.000Z","0x350755101263bed64dc377ef6f3ef07f95f97918b689967a60ee625d0d9e025c",["zama:0x1950aD98e834f6c07553365196d4CddeD179c536"]]
      values.$upgradeCount:
-        4
+        5
+++ description: Registered host chains and their host-chain FHEVMExecutor and ACL endpoints. Returned addresses belong to the listed host chain, not to the gateway chain; Ethereum entries are exposed as formatted cross-chain references in ethereumHostChains.
      values.getHostChains.1:
+        {"chainId":137,"fhevmExecutorAddress":"zama:0xAB0075E77fe06083f52bdf10e2ccDB3712483057","aclAddress":"zama:0x6737F17e31cf26a1b62fb0362acC5a16CB156F49","name":"polygon","website":"https://polygonscan.com"}
      values.getVersion:
-        "GatewayConfig v0.5.0"
+        "GatewayConfig v0.6.0"
+++ description: KMS contexts destroyed by the owner. Destroyed contexts are invalid: their per-context getters revert, new requests cannot pin them, and pending requests pinned to them can no longer reach consensus.
+++ severity: HIGH
      values.destroyedKmsContexts:
+        []
+++ description: Registered host chains currently disabled by the owner. Gateway workflows reject requests and ciphertext handles referencing disabled chains; a chain must be disabled before it can be removed.
+++ severity: HIGH
      values.disabledHostChains:
+        []
      fieldMeta.owner.description:
-        "Owner of GatewayConfig. This account creates KMS contexts, changes the current context's thresholds, manages coprocessors, custodians and host chains, transfers ownership, and unpauses gateway contracts. A newly created context becomes current immediately, while all older contexts remain selectable by Decryption."
+        "Owner of GatewayConfig. This account creates and destroys KMS contexts, changes the thresholds of any live context, manages coprocessors, custodians and host chains (including disabling and removing them), transfers ownership, and unpauses gateway contracts. A newly created context becomes current immediately; older contexts remain selectable by Decryption requests until destroyed."
      fieldMeta.inputVerification.description:
-        "InputVerification workflow contract paused and unpaused by GatewayConfig."
+        "InputVerification workflow contract paused and unpaused by GatewayConfig. Coprocessor set and threshold updates require this contract to be paused first."
      fieldMeta.ethereumHostChains.description:
-        "Ethereum host-chain endpoints registered in GatewayConfig, derived from getHostChains entries with chainId 1. These are the L1 FHEVMExecutor and ACL contracts whose state is used by the Gateway workflows."
+        "Ethereum host-chain endpoints registered in GatewayConfig, derived from getHostChains entries with chainId 1. These are the L1 FHEVMExecutor and ACL contracts whose state is used by the Gateway workflows. Disabled-but-not-removed chains still appear here; see disabledHostChains."
      fieldMeta.getKmsTxSenders.description:
-        "KMS transaction-sender addresses in the current Gateway context. Historical context senders remain authorized for Decryption responses that explicitly select their context; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
+        "KMS transaction-sender addresses in the current Gateway context. Senders from other live contexts remain authorized for Decryption requests that pinned their context until the context is destroyed; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
      fieldMeta.getKmsSigners.description:
-        "KMS signer addresses in the current Gateway context. Historical context signers remain authorized for explicitly selected Decryption responses; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
+        "KMS signer addresses in the current Gateway context. Signers from other live contexts remain authorized for Decryption requests that pinned their context until the context is destroyed; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
      fieldMeta.createdKmsContexts.description:
-        "KMS contexts created after migration, reconstructed from UpdateKmsContext events with their node set and creation thresholds. Nodes remain authorized for Decryption indefinitely; later threshold-update events do not identify a context, so final historical thresholds must be read through context-specific getters or project overrides."
+        "KMS contexts created after migration, reconstructed from UpdateKmsContext events with their node set and creation thresholds. Contexts stay selectable by Decryption requests until destroyed (see destroyedKmsContexts). Thresholds can be retuned per context after creation; current values must be read through context-specific getters or project overrides."
      fieldMeta.createdKmsContextTxSenders.description:
-        "KMS transaction senders from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function."
+        "KMS transaction senders from contexts created after migration. They remain authorized for Decryption requests that pinned their context until the owner destroys that context."
      fieldMeta.createdKmsContextSigners.description:
-        "KMS signers from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function."
+        "KMS signers from contexts created after migration. They remain authorized for Decryption requests that pinned their context until the owner destroys that context."
      fieldMeta.getMpcThreshold.description:
-        "MPC threshold for KMS key material generation in the current context."
+        "MPC threshold for KMS key material generation in the current context. The owner can retune it per context."
      fieldMeta.getCurrentKmsContextId.description:
-        "Identifier of the context used when a Decryption response has empty or version 0 extraData. Version 1 responses can explicitly select any historical context, and requests do not store or bind a context."
+        "Identifier of the context pinned by new Decryption requests whose extraData is empty or starts with version 0. Version 1 request extraData can explicitly pin any live context; responses must match the pinned context."
      fieldMeta.getPublicDecryptionThresholdForContext.description:
-        "Minimum number of KMS signatures required for public decryption consensus in the current context."
+        "Minimum number of KMS signatures required for public decryption consensus in the current context. The owner can retune it per context."
      fieldMeta.getUserDecryptionThresholdForContext.description:
-        "Minimum number of KMS shares required for user decryption consensus in the current context."
+        "Minimum number of KMS shares required for user decryption consensus in the current context. The owner can retune it per context."
      fieldMeta.getKmsGenThreshold.description:
-        "Minimum number of KMS signatures required for key and CRS generation consensus in the current context."
+        "Minimum number of KMS signatures required for key and CRS generation consensus in the current context. Consumed by the Ethereum-side KMS generation since gateway KMSGeneration v0.5.0."
      fieldMeta.getCoprocessorMajorityThreshold.description:
-        "Minimum number of matching coprocessor messages required for gateway coprocessor consensus."
+        "Minimum number of matching coprocessor messages required for gateway coprocessor consensus. Updates require InputVerification to be paused first."
      fieldMeta.destroyedKmsContexts:
+        {"severity":"HIGH","description":"KMS contexts destroyed by the owner. Destroyed contexts are invalid: their per-context getters revert, new requests cannot pin them, and pending requests pinned to them can no longer reach consensus.","type":"RISK_PARAMETER"}
      fieldMeta.disabledHostChains:
+        {"severity":"HIGH","description":"Registered host chains currently disabled by the owner. Gateway workflows reject requests and ciphertext handles referencing disabled chains; a chain must be disabled before it can be removed.","type":"RISK_PARAMETER"}
      implementationNames.zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00:
-        "GatewayConfig"
      implementationNames.zama:0x1950aD98e834f6c07553365196d4CddeD179c536:
+        "GatewayConfig"
    }
```

```diff
    EOA  (zama:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"sign KMS key-generation and CRS-generation material accepted by KMSGeneration.","role":".gatewayKmsSigners"}
      receivedPermissions.2.description:
-        "sign KMS decryption, key-generation, and CRS-generation material accepted by gateway contracts."
+        "sign KMS decryption material accepted by gateway contracts."
    }
```

```diff
    EOA  (zama:0xEd1D622bd59d657580aBAc65312b40B4B2dA6236) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"interact","from":"zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3","description":"submit KMS key-generation and CRS-generation responses to KMSGeneration.","role":".gatewayKmsTxSenders"}
      receivedPermissions.2.description:
-        "submit KMS decryption, key-generation, and CRS-generation responses to gateway contracts."
+        "submit KMS decryption responses to gateway contracts."
    }
```

## Source code changes

```diff
.../CiphertextCommits/CiphertextCommits.sol        | 1042 ++++++-----
 .../Decryption/Decryption.sol                      |  424 ++++-
 .../GatewayConfig/GatewayConfig.sol                |  797 ++++++--
 .../InputVerification/InputVerification.sol        |  802 +++++---
 .../KMSGeneration/KMSGeneration.sol                | 1912 ++++++--------------
 5 files changed, 2679 insertions(+), 2298 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785844532 (main branch discovery), not current.

```diff
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption_v0_4_0] {
    +++ description: Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each response independently selects a KMS context through extraData, or uses the context current when the response executes; requests do not store a context. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain.
      fieldMeta.initialMigratedKmsContextId.description:
-        "Identifier assigned to the Gateway KMS context created by the v0.5 migration. Version 1 Decryption response metadata can continue to select it after later rotations."
+        "Identifier assigned to the Gateway KMS context created by the v0.5 migration. Since Decryption v0.5.0 requests pin a context at request time; this context stays selectable after later rotations until the owner destroys it (only possible once it is no longer current)."
      fieldMeta.initialMigratedKmsTxSenders.description:
-        "KMS transaction senders in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so these accounts remain authorized to submit responses to Decryption after future rotations."
+        "KMS transaction senders in the Gateway context created by the v0.5 migration. Node membership is immutable, so these accounts remain authorized to submit responses for requests pinned to this context after future rotations, until the owner destroys the context (only possible once it is no longer current)."
      fieldMeta.initialMigratedKmsSigners.description:
-        "KMS signers in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so this signer set remains authorized for Decryption responses after future rotations."
+        "KMS signers in the Gateway context created by the v0.5 migration. Node membership is immutable, so this signer set remains authorized for requests pinned to this context after future rotations, until the owner destroys the context (only possible once it is no longer current)."
      fieldMeta.initialMigratedPublicDecryptionThreshold.description:
-        "Snapshot of the public-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations."
+        "Snapshot of the public-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance retunes this context's threshold (possible for any live context since GatewayConfig v0.6.0). This value remains security-critical after future context rotations while the context is live."
      fieldMeta.initialMigratedUserDecryptionThreshold.description:
-        "Snapshot of the user-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations."
+        "Snapshot of the user-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance retunes this context's threshold (possible for any live context since GatewayConfig v0.6.0). This value remains security-critical after future context rotations while the context is live."
    }
```

```diff
    contract InputVerification (zama:0xcB1bB072f38bdAF0F328CdEf1Fc6eDa1DF029287) [zama/InputVerification] {
    +++ description: Gateway contract that receives encrypted input verification requests from registered and enabled host chains, collects coprocessor responses, and emits a threshold-signed attestation once coprocessor consensus is reached. Ethereum InputVerifier verifies attestations against this contract's EIP-712 domain.
      description:
-        "Gateway contract that receives encrypted input verification requests from registered host chains, collects coprocessor responses, and emits a threshold-signed attestation once coprocessor consensus is reached. Ethereum InputVerifier verifies attestations against this contract's EIP-712 domain."
+        "Gateway contract that receives encrypted input verification requests from registered and enabled host chains, collects coprocessor responses, and emits a threshold-signed attestation once coprocessor consensus is reached. Ethereum InputVerifier verifies attestations against this contract's EIP-712 domain."
    }
```

```diff
    contract CiphertextCommits (zama:0xd82cF70FC102028cd01acB87D0E107780ae4F41F) [zama/CiphertextCommits] {
    +++ description: Gateway contract that stores ciphertext and SNS ciphertext digests after coprocessor consensus, allowing decryption requests to reference committed ciphertext material. Digests referencing unregistered or disabled host chains are rejected.
      description:
-        "Gateway contract that stores ciphertext and SNS ciphertext digests after coprocessor consensus, allowing decryption requests to reference committed ciphertext material."
+        "Gateway contract that stores ciphertext and SNS ciphertext digests after coprocessor consensus, allowing decryption requests to reference committed ciphertext material. Digests referencing unregistered or disabled host chains are rejected."
      values.kmsGeneration:
-        "zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3"
      fieldMeta.kmsGeneration:
-        {"description":"KMSGeneration contract referenced by the CiphertextCommits implementation for KMS key material context.","type":"EXTERNAL"}
    }
```

Generated with discovered.json: 0xc20ac24b3edc3828052271cdd51f43b296273f8d

# Diff at Tue, 04 Aug 2026 13:19:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@36c0588f2e6fd433fcb60f558353b75cea40247d block: 1784815701
- current timestamp: 1785844532

## Description

ZamaGovMultisigB executed a proposal rotating two ZamaGovMultisigA members while preserving its 9-of-17 threshold.

## Watched changes

```diff
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
+++ description: Current multisig members reconstructed from MembersAdded and MembersRemoved events.
      values.$members.5:
-        "eth:0x32f3D0D7E20Ca11Cad21f32Dad91506ea89f5897"
+++ description: Current multisig members reconstructed from MembersAdded and MembersRemoved events.
      values.$members.6:
-        "eth:0xE53e32a669357Ab0360103d8f294812B914AF9e4"
+++ description: Current multisig members reconstructed from MembersAdded and MembersRemoved events.
      values.$members.15:
+        "eth:0xc49376C4D044011eEce6eE69eFAe06f0Cc2bd008"
+++ description: Current multisig members reconstructed from MembersAdded and MembersRemoved events.
      values.$members.16:
+        "eth:0x27B1c34F2aeEc91F9704BD1CE288E5c667F29045"
    }
```

```diff
-   Status: DELETED
    contract Safe (eth:0xE53e32a669357Ab0360103d8f294812B914AF9e4) [GnosisSafe]
    +++ description: None
```

## Source code changes

```diff
.../Safe.sol => /dev/null                          | 1216 --------------------
 .../SafeProxy.p.sol => /dev/null                   |   42 -
 2 files changed, 1258 deletions(-)
```

Generated with discovered.json: 0xb4c2e2ca4fa6219d510415bfc0f6ea329ea208dd

# Diff at Thu, 23 Jul 2026 14:09:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@efd03446560a8d585747f124c71622cbfa33fca4 block: 1783927795
- current timestamp: 1784815701

## Description

The Safe signer set changed from 2-of-3 to 3-of-5, removing two signers and adding four.

## Watched changes

```diff
-   Status: DELETED
    EOA  (eth:0x4202860Fa6afAF3e2977cD139Ac693a05e4f9450)
    +++ description: None
```

```diff
    contract Safe (eth:0x69E55790880d0ABa56E48Ee1f7fc3834b0F5c223) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x5e4f2616AA570d60EC6D7BBF08D070fb81353553"
      values.$members.1:
+        "eth:0x1E3eafD783D47c36dC5CD529721E6cc16456Cc0F"
      values.$members.1:
-        "eth:0x7df0Fe803832BB3Ca8906a6e49968C2421C1aE9B"
+        "eth:0x0BBc1d7ceB10a0a00dD3aeBcA37e85D60d4a1103"
      values.$members.2:
-        "eth:0x4202860Fa6afAF3e2977cD139Ac693a05e4f9450"
+        "eth:0xFa4902732675Ee16a508487E4fDcb910fFb00A20"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xabfdb4e50f19d35c07b5b6d3642cd689e8a492c9

# Diff at Mon, 13 Jul 2026 09:17:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c168d01f86d16067de2977156e2af7e763a31d0d block: 1783513792
- current timestamp: 1783927795

## Description

Introduces KMS signer set rotation on Ethereum and the Gateway: each signer set is called a context and is valid and retains all permissions until specifically invalidated ('destroyed'). HCULimit adds per-transaction and per-block caps plus a bypass whitelist.

## Watched changes

```diff
    contract HCULimit (eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2) [zama/ZamaHCULimit_v0_2_0] {
    +++ description: Tracks and enforces per-transaction and per-block homomorphic computation unit limits for FHEVM operation requests.
      template:
-        "zama/ZamaHCULimit"
+        "zama/ZamaHCULimit_v0_2_0"
      sourceHashes.1:
-        "0xb4b32e3ee98a51750d9ec0af3a9c599dbb6e097cdf4f55f37e198a75f0f2e5eb"
+        "0xc52e1b93c97602e6da1f1925e14fc5454426a778875655ec17910be5e217b98e"
      description:
-        "Tracks and enforces homomorphic computation unit limits for FHEVM operation requests."
+        "Tracks and enforces per-transaction and per-block homomorphic computation unit limits for FHEVM operation requests."
      values.$implementation:
-        "eth:0x4E4329F10f7EE88a5dDB13716B8bE00c077CBeb6"
+        "eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442"
      values.$pastUpgrades.2:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442"]]
      values.$upgradeCount:
-        2
+        3
      values.getVersion:
-        "HCULimit v0.1.0"
+        "HCULimit v0.2.0"
+++ description: Callers that bypass the global per-block HCU cap, reconstructed from whitelist events.
+++ severity: HIGH
      values.blockHCUWhitelist:
+        []
+++ description: Maximum HCU consumed by non-whitelisted callers in one block.
+++ severity: HIGH
      values.getGlobalHCUCapPerBlock:
+        281474976710655
+++ description: Maximum sequential HCU depth allowed in one transaction.
+++ severity: HIGH
      values.getMaxHCUDepthPerTx:
+        5000000
+++ description: Maximum total HCU allowed in one transaction.
+++ severity: HIGH
      values.getMaxHCUPerTx:
+        20000000
      fieldMeta.getGlobalHCUCapPerBlock:
+        {"severity":"HIGH","description":"Maximum HCU consumed by non-whitelisted callers in one block.","type":"RISK_PARAMETER"}
      fieldMeta.getMaxHCUDepthPerTx:
+        {"severity":"HIGH","description":"Maximum sequential HCU depth allowed in one transaction.","type":"RISK_PARAMETER"}
      fieldMeta.getMaxHCUPerTx:
+        {"severity":"HIGH","description":"Maximum total HCU allowed in one transaction.","type":"RISK_PARAMETER"}
      fieldMeta.blockHCUWhitelist:
+        {"severity":"HIGH","description":"Callers that bypass the global per-block HCU cap, reconstructed from whitelist events.","type":"PERMISSION"}
      fieldMeta.getBlockMeter:
+        {"description":"HCU consumed by non-whitelisted callers in the current block."}
      implementationNames.eth:0x4E4329F10f7EE88a5dDB13716B8bE00c077CBeb6:
-        "HCULimit"
      implementationNames.eth:0x0F2B7e8F19ADc874F21e27ADAA4B22FC00a0B442:
+        "HCULimit"
    }
```

```diff
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier_v0_2_0] {
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any retained non-destroyed KMS context.
      template:
-        "zama/ZamaKMSVerifier"
+        "zama/ZamaKMSVerifier_v0_2_0"
      sourceHashes.1:
-        "0xe6773e8f1549070f8e0fcae01d4bcf98332a43c1b6f2d4eca1a108295c327d8e"
+        "0xa40292fe461810a065f80e305f6b85ab3ca2cfd416dc965d4791a111554cf638"
      description:
-        "Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers use it before accepting decrypted values."
+        "Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers accept a decrypted value when it is signed by the threshold of the current or any retained non-destroyed KMS context."
      values.$implementation:
-        "eth:0x8210A6c69FAc2e9856C7a19Ee70b26cFa3A4F0E2"
+        "eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD"
      values.$pastUpgrades.2:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD"]]
      values.$upgradeCount:
-        2
+        3
      values.getVersion:
-        "KMSVerifier v0.1.0"
+        "KMSVerifier v0.2.0"
+++ description: Non-destroyed KMS contexts created after the v0.2 migration, reconstructed from context creation and destruction events. Each context is an immutable signer and threshold snapshot that can attest results for any ciphertext handle; it is not scoped to ciphertext age or key ID.
+++ severity: HIGH
      values.createdKmsContexts:
+        []
+++ description: Identifier of the context used when proof extraData is empty or starts with version 0. Version 1 extraData can explicitly select any non-destroyed historical context, including for ciphertexts created after that context was superseded.
+++ severity: HIGH
      values.getCurrentKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: Identifier of the first v0.2 KMS context created from the source-defined context counter during initialization or migration.
+++ severity: HIGH
      values.initialKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: Signers in the first v0.2 KMS context. This code-defined context remains authorized for public decryption proofs after later rotations unless the ACL owner explicitly destroys it.
+++ severity: HIGH
      values.initialKmsContextSigners:
+        ["eth:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","eth:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","eth:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","eth:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","eth:0x41b19EB4585450db79ac03ba9503106EC7895905","eth:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","eth:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","eth:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","eth:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","eth:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","eth:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","eth:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","eth:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
      fieldMeta.aclOwner.description:
-        "Owner of the Zama ACL contract. This account is authorized by onlyACLOwner to rotate the KMS signer set and threshold."
+        "Owner of the Zama ACL contract. This account can create a new KMS signer context that immediately becomes the default verifier authority, and can destroy any non-current context."
      fieldMeta.getKmsSigners.description:
-        "KMS signers accepted by KMSVerifier. The threshold number of these signers must sign public decryption results for the Gateway Decryption EIP-712 domain before wrappers accept the decrypted values."
+        "KMS signers in the current context. Permission coverage is also indexed through initialKmsContextSigners and createdKmsContexts so superseded contexts remain visible."
      fieldMeta.getThreshold.description:
-        "Minimum number of configured KMS signer signatures required to accept a public decryption result."
+        "Minimum number of KMS signatures from the current context required to accept a public decryption result. Retained contexts keep their own immutable thresholds."
      fieldMeta.initialKmsContextId:
+        {"severity":"HIGH","description":"Identifier of the first v0.2 KMS context created from the source-defined context counter during initialization or migration.","type":"RISK_PARAMETER"}
      fieldMeta.initialKmsContextSigners:
+        {"severity":"HIGH","description":"Signers in the first v0.2 KMS context. This code-defined context remains authorized for public decryption proofs after later rotations unless the ACL owner explicitly destroys it.","type":"PERMISSION"}
      fieldMeta.createdKmsContexts:
+        {"severity":"HIGH","description":"Non-destroyed KMS contexts created after the v0.2 migration, reconstructed from context creation and destruction events. Each context is an immutable signer and threshold snapshot that can attest results for any ciphertext handle; it is not scoped to ciphertext age or key ID.","type":"PERMISSION"}
      fieldMeta.getCurrentKmsContextId:
+        {"severity":"HIGH","description":"Identifier of the context used when proof extraData is empty or starts with version 0. Version 1 extraData can explicitly select any non-destroyed historical context, including for ciphertexts created after that context was superseded.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x8210A6c69FAc2e9856C7a19Ee70b26cFa3A4F0E2:
-        "KMSVerifier"
      implementationNames.eth:0xd0d0C7E1bc1E2F6Cd00E3b4B1083DdD9969155FD:
+        "KMSVerifier"
    }
```

```diff
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
      directlyReceivedPermissions.0:
+        {"permission":"interact","from":"eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2","description":"change the per-block and per-transaction HCU limits and manage callers that bypass the per-block limit.","role":".aclOwner"}
      directlyReceivedPermissions.4.description:
-        "set the KMS signer set and signature threshold used for public decryption verification."
+        "create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing."
      directlyReceivedPermissions.14.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and update Zama verifier signer sets and thresholds."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
    }
```

```diff
    contract ZamaGovMultisigB (eth:0xBc860b6a4C860C5424B84A056E53ACFb2C99a38F) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2","description":"change the per-block and per-transaction HCU limits and manage callers that bypass the per-block limit.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.4.description:
-        "set the KMS signer set and signature threshold used for public decryption verification."
+        "create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing."
      receivedPermissions.16.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and update Zama verifier signer sets and thresholds."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
    }
```

```diff
    contract ACL (eth:0xcA2E8f1F656CD25C01F05d0b243Ab1ecd4a8ffb6) [zama/ZamaACL_v0_3_0] {
    +++ description: Ethereum host-chain access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references. Its public-decryption and user-delegation events are mirrored into the Gateway MultichainACL by coprocessor consensus.
      template:
-        "zama/ZamaACL"
+        "zama/ZamaACL_v0_3_0"
      sourceHashes.1:
-        "0x5f835dee1c2a2676dc34ff636b1df73f1fe8b58073069d0a8df7687cd834f35f"
+        "0x47f47986a3024b31fa3caee357720f4fba4ea3fae419ff53eebe1a66e87d69ef"
      values.$implementation:
-        "eth:0x96B171e4f8eCda0FFdD128b319Fa185b14f99D76"
+        "eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "ACL v0.2.0"
+        "ACL v0.3.0"
      implementationNames.eth:0x96B171e4f8eCda0FFdD128b319Fa185b14f99D76:
-        "ACL"
      implementationNames.eth:0x3F6D970d30E1FFE9657aa8072C82dA10eef1c3D6:
+        "ACL"
    }
```

```diff
    contract FHEVMExecutor (eth:0xD82385dADa1ae3E969447f20A3164F6213100e75) [zama/ZamaFHEVMExecutor_v0_3_0] {
    +++ description: FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results.
      template:
-        "zama/ZamaFHEVMExecutor"
+        "zama/ZamaFHEVMExecutor_v0_3_0"
      sourceHashes.1:
-        "0xc3b56811670be45b7f1aac864be6855e3875c8e449c2fe3cbb540143f0dacddb"
+        "0xf475718e9125acfc2f69d3c9cca8cedb9a15c644da7490f7f5fe0ae2690a77cc"
      values.$implementation:
-        "eth:0xde3624dA8d9c45B57674cA0AcAC40630682211bb"
+        "eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:34:11.000Z","0xec2212fb2d35b72388507e5fe9c218c97512b943b5f28cedbfba35b7ac9bd224",["eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "FHEVMExecutor v0.2.0"
+        "FHEVMExecutor v0.3.0"
      fieldMeta.getHCULimitAddress.description:
-        "HCULimit contract used to account for homomorphic computation units consumed by encrypted operations."
+        "HCULimit contract used to account for homomorphic computation units consumed by encrypted operations for the original external caller."
      fieldMeta.getHandleVersion.description:
-        "Current ciphertext handle version emitted by the executor."
+        "Current ciphertext handle version emitted by the executor. Version 1 result handles include operation-specific domain separation and block context in their derivation."
      implementationNames.eth:0xde3624dA8d9c45B57674cA0AcAC40630682211bb:
-        "FHEVMExecutor"
      implementationNames.eth:0xC38aAfCBB73Fd4bd6f995275079C4Add9C1687E5:
+        "FHEVMExecutor"
    }
```

```diff
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig] {
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2","description":"change the per-block and per-transaction HCU limits and manage callers that bypass the per-block limit.","role":".aclOwner","via":[{"address":"eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3"}]}
      receivedPermissions.4.description:
-        "set the KMS signer set and signature threshold used for public decryption verification."
+        "create KMS signer contexts with arbitrary signer sets and thresholds, and destroy non-current contexts. A malicious context can attest an inflated unwrap amount and drain pooled wrapper backing."
      receivedPermissions.16.description:
-        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and update Zama verifier signer sets and thresholds."
+        "transfer ACL ownership, unpause the ACL, block or unblock accounts, manage PauserSet membership, and create or destroy KMSVerifier signer contexts."
    }
```

```diff
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption_v0_4_0] {
    +++ description: Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each response independently selects a KMS context through extraData, or uses the context current when the response executes; requests do not store a context. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain.
      template:
-        "zama/Decryption"
+        "zama/Decryption_v0_4_0"
      sourceHashes.1:
-        "0xd2e9269a1dc3580af2eaa84178722c052767a5d174734ececeddeea5bacd1929"
+        "0xcd821ac822a19a355acde1dd7ce435e2a6e16e21017756b899c058ee64552e28"
      description:
-        "Gateway contract that orchestrates public and user decryption requests, checks mirrored host-chain ACL state, collects KMS responses, and emits results once the configured KMS threshold is reached. Ethereum KMSVerifier verifies public decryption results against this contract's EIP-712 domain."
+        "Gateway contract that orchestrates public and user decryption requests and checks committed ciphertext material. Each response independently selects a KMS context through extraData, or uses the context current when the response executes; requests do not store a context. KMS nodes enforce host-chain ACL state offchain, and Ethereum KMSVerifier verifies public results against this contract's EIP-712 domain."
      values.$implementation:
-        "zama:0xe691cE3d7a71E2eC9E96AF5bdD263FfEB124F8dE"
+        "zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:15:40.000Z","0x5d63d8d9bf4790e7169cd1d6c440262aad29368190932f823377df311f389217",["zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0"]]
      values.$upgradeCount:
-        3
+        4
      values.getVersion:
-        "Decryption v0.3.0"
+        "Decryption v0.4.0"
+++ description: Current GatewayConfig KMS context used by responses whose extraData is empty or starts with version 0. Requests do not bind this value, so a rotation can change the context used to answer an already pending request.
+++ severity: HIGH
      values.gatewayKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
      fieldMeta.gatewayMultichainACL.description:
-        "MultichainACL contract containing the gateway-side ACL mirror checked before public or user decryptions are accepted."
+        "MultichainACL contract containing the gateway-side host-chain ACL mirror. The upgraded Decryption contract no longer checks it onchain and relies on KMS nodes to enforce ACL state."
      fieldMeta.gatewayKmsTxSenders.description:
-        "KMS transaction-sender addresses configured in GatewayConfig. These accounts may submit signed public decryption results and user decryption shares."
+        "KMS transaction-sender addresses configured in the current GatewayConfig context. Historical context senders can also submit responses when response extraData explicitly selects their retained context. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
      fieldMeta.gatewayKmsSigners.description:
-        "KMS signer addresses configured in GatewayConfig. Their EIP-712 signatures determine whether public decryption results and user decryption shares reach threshold."
+        "KMS signer addresses configured in the current GatewayConfig context. Historical context signers can also sign responses when response extraData explicitly selects their retained context. Post-migration contexts are indexed on GatewayConfig; migration-created membership requires a project override because no creation event was emitted."
      fieldMeta.gatewayPublicDecryptionThreshold.description:
-        "Minimum number of matching KMS signatures required before a public decryption result is emitted."
+        "Minimum matching-signature count for the current context. Public responses are grouped by a digest containing raw extraData; identical empty or version 0 extraData can accumulate responses across a context rotation while the last response selects the threshold checked."
      fieldMeta.gatewayUserDecryptionThreshold.description:
-        "Minimum number of KMS shares required before a user decryption request is considered threshold-reached."
+        "Minimum response count for the current context. User response counts are stored per request rather than per context, so valid shares submitted under different contexts can be combined and the last response selects the threshold checked."
      fieldMeta.gatewayKmsContextId:
+        {"severity":"HIGH","description":"Current GatewayConfig KMS context used by responses whose extraData is empty or starts with version 0. Requests do not bind this value, so a rotation can change the context used to answer an already pending request.","type":"RISK_PARAMETER"}
      implementationNames.zama:0xe691cE3d7a71E2eC9E96AF5bdD263FfEB124F8dE:
-        "Decryption"
      implementationNames.zama:0x943CEfD1A00d3ae5b298bB10D4EddA09B279C8B0:
+        "Decryption"
    }
```

```diff
    contract SafeL2 (zama:0x5f0F86BcEad6976711C9B131bCa5D30E767fe2bE) [GnosisSafe] {
    +++ description: Gateway owner Safe. Its LayerZero governance module is outside the Zama Gateway protocol surface covered here.
      receivedPermissions.5.description:
-        "update KMS, coprocessor, custodian, host-chain, and threshold configuration, transfer GatewayConfig ownership, and unpause gateway workflow contracts."
+        "create KMS contexts that immediately become current, update current thresholds and other gateway configuration, transfer ownership, and unpause gateway workflow contracts. Historical KMS contexts cannot be removed in this version."
    }
```

```diff
    contract GatewayConfig (zama:0xDE537Be194777A56f8B19d14079E6a78249390ab) [zama/GatewayConfig_v0_5_0] {
    +++ description: Central configuration contract for the Zama Gateway. A KMS context snapshots node transaction senders, signers, and workflow thresholds; historical contexts remain stored and selectable by Decryption because this version has no context-destruction function.
      template:
-        "zama/GatewayConfig"
+        "zama/GatewayConfig_v0_5_0"
      sourceHashes.1:
-        "0x40662103941fd76e1fc3b63e38f9036b39d3394d96fe2c46db9640bcbbc76d4b"
+        "0x1089121569189032b8cee0dae0c71eedecf7757f712a6d14ef684915093c6747"
      description:
-        "Central configuration contract for the Zama Gateway. It stores the KMS, coprocessor, custodian, host-chain, pauser, and consensus-threshold configuration used by the gateway workflow contracts."
+        "Central configuration contract for the Zama Gateway. A KMS context snapshots node transaction senders, signers, and workflow thresholds; historical contexts remain stored and selectable by Decryption because this version has no context-destruction function."
      values.$implementation:
-        "zama:0xDa97dfc327349F7C1333610C80cc20971eD0eb0f"
+        "zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00"
      values.$pastUpgrades.3:
+        ["2026-07-10T08:15:40.000Z","0x5d63d8d9bf4790e7169cd1d6c440262aad29368190932f823377df311f389217",["zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00"]]
      values.$upgradeCount:
-        3
+        4
      values.getPublicDecryptionThreshold:
-        7
      values.getUserDecryptionThreshold:
-        9
      values.getVersion:
-        "GatewayConfig v0.4.0"
+        "GatewayConfig v0.5.0"
+++ description: KMS contexts created after migration, reconstructed from UpdateKmsContext events with their node set and creation thresholds. Nodes remain authorized for Decryption indefinitely; later threshold-update events do not identify a context, so final historical thresholds must be read through context-specific getters or project overrides.
+++ severity: HIGH
      values.createdKmsContexts:
+        []
+++ description: KMS signers from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.
+++ severity: HIGH
      values.createdKmsContextSigners:
+        []
+++ description: KMS transaction senders from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.
+++ severity: HIGH
      values.createdKmsContextTxSenders:
+        []
+++ description: Identifier of the context used when a Decryption response has empty or version 0 extraData. Version 1 responses can explicitly select any historical context, and requests do not store or bind a context.
+++ severity: HIGH
      values.getCurrentKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: Minimum number of KMS signatures required for public decryption consensus in the current context.
+++ severity: HIGH
      values.getPublicDecryptionThresholdForContext:
+        7
+++ description: Minimum number of KMS shares required for user decryption consensus in the current context.
+++ severity: HIGH
      values.getUserDecryptionThresholdForContext:
+        9
      fieldMeta.owner.description:
-        "Owner of GatewayConfig. This account manages KMS nodes, coprocessors, custodians, host chains, consensus thresholds, ownership, and gateway unpausing."
+        "Owner of GatewayConfig. This account creates KMS contexts, changes the current context's thresholds, manages coprocessors, custodians and host chains, transfers ownership, and unpauses gateway contracts. A newly created context becomes current immediately, while all older contexts remain selectable by Decryption."
      fieldMeta.getKmsTxSenders.description:
-        "KMS transaction-sender addresses registered for this gateway. These accounts submit KMS responses to gateway contracts."
+        "KMS transaction-sender addresses in the current Gateway context. Historical context senders remain authorized for Decryption responses that explicitly select their context; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
      fieldMeta.getKmsSigners.description:
-        "KMS signer addresses registered for this gateway. Thresholds over these signers secure public and user decryption, key generation, and CRS generation."
+        "KMS signer addresses in the current Gateway context. Historical context signers remain authorized for explicitly selected Decryption responses; post-migration contexts are indexed here and the migrated context is indexed on Decryption."
      fieldMeta.getMpcThreshold.description:
-        "MPC threshold for KMS key material generation."
+        "MPC threshold for KMS key material generation in the current context."
      fieldMeta.getPublicDecryptionThreshold:
-        {"severity":"HIGH","description":"Minimum number of KMS signatures required for public decryption consensus.","type":"RISK_PARAMETER"}
      fieldMeta.getUserDecryptionThreshold:
-        {"severity":"HIGH","description":"Minimum number of KMS shares required for user decryption consensus.","type":"RISK_PARAMETER"}
      fieldMeta.getKmsGenThreshold.description:
-        "Minimum number of KMS signatures required for key and CRS generation consensus."
+        "Minimum number of KMS signatures required for key and CRS generation consensus in the current context."
      fieldMeta.createdKmsContexts:
+        {"severity":"HIGH","description":"KMS contexts created after migration, reconstructed from UpdateKmsContext events with their node set and creation thresholds. Nodes remain authorized for Decryption indefinitely; later threshold-update events do not identify a context, so final historical thresholds must be read through context-specific getters or project overrides.","type":"RISK_PARAMETER"}
      fieldMeta.createdKmsContextTxSenders:
+        {"severity":"HIGH","description":"KMS transaction senders from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.","type":"PERMISSION"}
      fieldMeta.createdKmsContextSigners:
+        {"severity":"HIGH","description":"KMS signers from contexts created after migration. They remain authorized for Decryption responses that select their context because GatewayConfig has no context-destruction function.","type":"PERMISSION"}
      fieldMeta.getCurrentKmsContextId:
+        {"severity":"HIGH","description":"Identifier of the context used when a Decryption response has empty or version 0 extraData. Version 1 responses can explicitly select any historical context, and requests do not store or bind a context.","type":"RISK_PARAMETER"}
      fieldMeta.getPublicDecryptionThresholdForContext:
+        {"severity":"HIGH","description":"Minimum number of KMS signatures required for public decryption consensus in the current context.","type":"RISK_PARAMETER"}
      fieldMeta.getUserDecryptionThresholdForContext:
+        {"severity":"HIGH","description":"Minimum number of KMS shares required for user decryption consensus in the current context.","type":"RISK_PARAMETER"}
      implementationNames.zama:0xDa97dfc327349F7C1333610C80cc20971eD0eb0f:
-        "GatewayConfig"
      implementationNames.zama:0x2294E3C211238Ae31E2824576CCd7f996CC7Dc00:
+        "GatewayConfig"
    }
```

## Source code changes

```diff
.../{.flat@1783513792 => .flat}/ACL/ACL.sol        |   28 +-
 .../Decryption/Decryption.sol                      | 1115 +++++++--------
 .../FHEVMExecutor/FHEVMExecutor.sol                |  617 ++++++---
 .../GatewayConfig/GatewayConfig.sol                | 1434 ++++++++++----------
 .../HCULimit/HCULimit.sol                          |  507 +++++--
 .../KMSVerifier/KMSVerifier.sol                    |  287 +++-
 6 files changed, 2239 insertions(+), 1749 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1783513792 (main branch discovery), not current.

```diff
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier] {
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers use it before accepting decrypted values.
+++ description: Immutable public-decryption threshold assigned to initialKmsContextId during the v0.2 migration. It remains security-critical after rotation while initialKmsContextSigners is non-empty; an empty signer list means the context was destroyed.
+++ severity: HIGH
      values.initialKmsContextThreshold:
+        7
      fieldMeta.initialKmsContextThreshold:
+        {"severity":"HIGH","description":"Immutable public-decryption threshold assigned to initialKmsContextId during the v0.2 migration. It remains security-critical after rotation while initialKmsContextSigners is non-empty; an empty signer list means the context was destroyed.","type":"RISK_PARAMETER"}
    }
```

```diff
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption] {
    +++ description: Gateway contract that orchestrates public and user decryption requests, checks mirrored host-chain ACL state, collects KMS responses, and emits results once the configured KMS threshold is reached. Ethereum KMSVerifier verifies public decryption results against this contract's EIP-712 domain.
+++ description: Identifier assigned to the Gateway KMS context created by the v0.5 migration. Version 1 Decryption response metadata can continue to select it after later rotations.
+++ severity: HIGH
      values.initialMigratedKmsContextId:
+        "3166189940082864718613269121331309980362851143201109172953918312716374638593"
+++ description: KMS signers in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so this signer set remains authorized for Decryption responses after future rotations.
+++ severity: HIGH
      values.initialMigratedKmsSigners:
+        ["zama:0xe9f7ecfF21a2e0Ca58eA26ae869FEF38ab49ed6f","zama:0xdC472efa1642D5afB684aAaa546E22FB24AAB965","zama:0xbf05c17BEB0BF2F2c78Cd491A53a148e035279C3","zama:0x915055c5F05C0d88BCdf1e3DfBA18aBD2a18350f","zama:0x41b19EB4585450db79ac03ba9503106EC7895905","zama:0x6e5f02Cd4B33f0Cf4ED5326ac9eE25e5aA8c4921","zama:0x966188a1f697F6A1B5cfA51495DD8A8A7b5CdB8D","zama:0x5d0e7033774dD43eE546D49b72Bd0B561E52f7C8","zama:0xDFc9Dcb3D206AA164770874f36a4B5AD2EE5194f","zama:0x7C5Eeb4D8CED0101799B8Cc212eE874097364F58","zama:0x7C17BE232e5968BDa9516478B798b9E90D013fCC","zama:0x6016DCA5e91e62826e3FEA1Fb0a763602dc1E385","zama:0xB7978e602D2AF68258dA614AF949E014BF0DE0eb"]
+++ description: KMS transaction senders in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so these accounts remain authorized to submit responses to Decryption after future rotations.
+++ severity: HIGH
      values.initialMigratedKmsTxSenders:
+        ["zama:0x711EBE8aA590f9C9904ff279239E89dB2eFbC890","zama:0xB4CE988D382425F64c99A352375F72A5f1cf6FFB","zama:0x4eC7200E392B97913cbD6d8160B011406EB019F1","zama:0xEd1D622bd59d657580aBAc65312b40B4B2dA6236","zama:0x74a1E2e87a4026b7B8b5252c747E514159515e9a","zama:0x0e25B8DB74c754C8275C0B219ba2A6CD7c59E31D","zama:0x577Fd21e4BC7D644A4177C4B89146e1Ab394De04","zama:0xbaac6F9DD84bFB303F05B4DE45A88Eec86855BD0","zama:0x43e4c21cf9d24Dc5b4e00031349EC213A2ba8340","zama:0xC105B5933446658D226582f7A112F49a70b54364","zama:0xbcF4943A856497FB2345409D35f4d1eae9A0363E","zama:0xD227C4B573800EdA3bAdA6DAC872E9134E012e6D","zama:0x487e41623b7FeB464ff79F7326DCa791c9a1c5EC"]
+++ description: Snapshot of the public-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.
+++ severity: HIGH
      values.initialMigratedPublicDecryptionThreshold:
+        7
+++ description: Snapshot of the user-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.
+++ severity: HIGH
      values.initialMigratedUserDecryptionThreshold:
+        9
      fieldMeta.initialMigratedKmsContextId:
+        {"severity":"HIGH","description":"Identifier assigned to the Gateway KMS context created by the v0.5 migration. Version 1 Decryption response metadata can continue to select it after later rotations.","type":"RISK_PARAMETER"}
      fieldMeta.initialMigratedKmsTxSenders:
+        {"severity":"HIGH","description":"KMS transaction senders in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so these accounts remain authorized to submit responses to Decryption after future rotations.","type":"PERMISSION"}
      fieldMeta.initialMigratedKmsSigners:
+        {"severity":"HIGH","description":"KMS signers in the Gateway context created by the v0.5 migration. Node membership is immutable and GatewayConfig cannot destroy contexts, so this signer set remains authorized for Decryption responses after future rotations.","type":"PERMISSION"}
      fieldMeta.initialMigratedPublicDecryptionThreshold:
+        {"severity":"HIGH","description":"Snapshot of the public-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.","type":"RISK_PARAMETER"}
      fieldMeta.initialMigratedUserDecryptionThreshold:
+        {"severity":"HIGH","description":"Snapshot of the user-decryption threshold in the context created by the v0.5 migration. Update this project-specific value if governance changes the initial context while it is current. This value remains security-critical after future context rotations.","type":"RISK_PARAMETER"}
    }
```

Generated with discovered.json: 0x755dc68568a28f6800ab2d7043af99d88031b4f7

# Diff at Mon, 29 Jun 2026 15:21:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1782746392

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ZamaGovMemberDAO (eth:0x31bBD7a242A38372DE92CA304fE29C12C90A382C) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract HCULimit (eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2) [zama/ZamaHCULimit]
    +++ description: Tracks and enforces homomorphic computation unit limits for FHEVM operation requests.
```

```diff
+   Status: CREATED
    EOA  (eth:0x4202860Fa6afAF3e2977cD139Ac693a05e4f9450)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialSteakcUSDCWrapper (eth:0x66Bf74E96900D1a19c7070D939D124f2F565C458) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x69E55790880d0ABa56E48Ee1f7fc3834b0F5c223) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Staking (Coprocessor) (eth:0x7147485b892158f2B875f7aC5Ea48A9937C66AE8) [zama/ProtocolStaking]
    +++ description: Staking contract that escrows ZAMA, issues non-transferable staked voting tokens, and mints protocol rewards to eligible stakers at a configurable reward rate.
```

```diff
+   Status: CREATED
    contract ConfidentialXAUTWrapper (eth:0x73cc9aF9d6BEFdb3c3fAf8a5E8c05Cb95FdaEEf1) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier]
    +++ description: Ethereum host-chain verifier for public decryption results produced through the Zama Gateway Decryption contract. Confidential token wrappers use it before accepting decrypted values.
```

```diff
+   Status: CREATED
    contract ConfidentialZAMAWrapper (eth:0x80CB147Fd86dC6dEe3Eee7e4Cee33d1397d98071) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ConfidentialBRONWrapper (eth:0x85dE671c3bec1aDeD752c3Cea943521181C826bc) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x8c0E2c46F96756C49DBd6723F4C57a03a254B4B0) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x97E18544e156724E4076945F10c288ecBBC94e54) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialTGBPWrapper (eth:0xa873750ccBafD5ec7Dd13bfD5237d7129832eDD9) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ConfidentialUSDTWrapper (eth:0xAe0207C757Aa2B4019Ad96edD0092ddc63EF0c50) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract ConfidentialBbqTGBPWrapper (eth:0xBA4cFF6ED6F7Cb2A58776dECa4E984b498446762) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract PauserSet (eth:0xbBfE1680b4a63ED05f7F80CE330BED7C992A586C) [zama/ZamaPauserSet]
    +++ description: Maintains the pauser account set used in pause-control checks.
```

```diff
+   Status: CREATED
    contract ZamaGovMultisigB (eth:0xBc860b6a4C860C5424B84A056E53ACFb2C99a38F) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract ACL (eth:0xcA2E8f1F656CD25C01F05d0b243Ab1ecd4a8ffb6) [zama/ZamaACL]
    +++ description: Ethereum host-chain access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references. Its public-decryption and user-delegation events are mirrored into the Gateway MultichainACL by coprocessor consensus.
```

```diff
+   Status: CREATED
    contract InputVerifier (eth:0xCe0FC2e05CFff1B719EFF7169f7D80Af770c8EA2) [zama/ZamaInputVerifier]
    +++ description: Ethereum host-chain verifier for encrypted input attestations produced by the Zama Gateway InputVerification contract. The FHEVMExecutor calls it before accepting user-provided ciphertext handles.
```

```diff
+   Status: CREATED
    contract FHEVMExecutor (eth:0xD82385dADa1ae3E969447f20A3164F6213100e75) [zama/ZamaFHEVMExecutor]
    +++ description: FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results.
```

```diff
+   Status: CREATED
    contract ConfidentialWETHWrapper (eth:0xda9396b82634Ea99243cE51258B6A5Ae512D4893) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xE53e32a669357Ab0360103d8f294812B914AF9e4) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialUSDCWrapper (eth:0xe978F22157048E5DB8E5d07971376e86671672B2) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Staking (KMS) (eth:0xe9b176CCaA8840DC3b3567bb83e2cD2a6c36F4Ab) [zama/ProtocolStaking]
    +++ description: Staking contract that escrows ZAMA, issues non-transferable staked voting tokens, and mints protocol rewards to eligible stakers at a configurable reward rate.
```

```diff
+   Status: CREATED
    contract ConfidentialTokenWrappersRegistry (eth:0xeb5015fF021DB115aCe010f23F55C2591059bBA0) [zama/ConfidentialTokenWrappersRegistry]
    +++ description: Registry for Zama confidential token wrappers.
```

```diff
+   Status: CREATED
    contract MultichainACL (zama:0x055d9FD50a612A9027716ec8db663E7D68562468) [zama/MultichainACL]
    +++ description: Gateway-side ACL mirror that records coprocessor consensus for host-chain public decryption permissions, account handle allowances, and delegated user-decryption access. For Ethereum, it mirrors ACL events emitted by the L1 ACL contract registered in GatewayConfig.
```

```diff
+   Status: CREATED
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [zama/Decryption]
    +++ description: Gateway contract that orchestrates public and user decryption requests, checks mirrored host-chain ACL state, collects KMS responses, and emits results once the configured KMS threshold is reached. Ethereum KMSVerifier verifies public decryption results against this contract's EIP-712 domain.
```

```diff
+   Status: CREATED
    contract KMSGeneration (zama:0x290947F9fed2d91fdB22f35E162aDfA744b7aEe3) [zama/KMSGeneration]
    +++ description: Gateway contract that orchestrates FHE key generation, CRS generation, PRSS initialization, and key resharing through threshold KMS responses.
```

```diff
+   Status: CREATED
    contract GatewayPauserSet (zama:0x571ecb596fCc5c840DA35CbeCA175580db50ac1b) [zama/GatewayPauserSet]
    +++ description: Maintains the set of accounts allowed to pause gateway contracts. The set is managed by the GatewayConfig owner.
```

```diff
+   Status: CREATED
    contract SafeL2 (zama:0x5f0F86BcEad6976711C9B131bCa5D30E767fe2bE) [GnosisSafe]
    +++ description: Gateway owner Safe. Its LayerZero governance module is outside the Zama Gateway protocol surface covered here.
```

```diff
+   Status: CREATED
    contract ProtocolPayment (zama:0x7E179E45E5fe0a21015Be25185363B4F2F2F7e89) [zama/ProtocolPayment]
    +++ description: Gateway fee contract that charges ZAMA fees for encrypted input verification, public decryption, and user decryption requests, then forwards the collected fees to the configured fee burner sender.
```

```diff
+   Status: CREATED
    contract InputVerification (zama:0xcB1bB072f38bdAF0F328CdEf1Fc6eDa1DF029287) [zama/InputVerification]
    +++ description: Gateway contract that receives encrypted input verification requests from registered host chains, collects coprocessor responses, and emits a threshold-signed attestation once coprocessor consensus is reached. Ethereum InputVerifier verifies attestations against this contract's EIP-712 domain.
```

```diff
+   Status: CREATED
    contract CiphertextCommits (zama:0xd82cF70FC102028cd01acB87D0E107780ae4F41F) [zama/CiphertextCommits]
    +++ description: Gateway contract that stores ciphertext and SNS ciphertext digests after coprocessor consensus, allowing decryption requests to reference committed ciphertext material.
```

```diff
+   Status: CREATED
    contract GatewayConfig (zama:0xDE537Be194777A56f8B19d14079E6a78249390ab) [zama/GatewayConfig]
    +++ description: Central configuration contract for the Zama Gateway. It stores the KMS, coprocessor, custodian, host-chain, pauser, and consensus-threshold configuration used by the gateway workflow contracts.
```
