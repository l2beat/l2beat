Generated with discovered.json: 0x5094b497a00fbdf8db369dfc3f5b590d682b3fc7

# Diff at Tue, 08 Oct 2024 16:23:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20775890
- current block number: 20921492

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775890 (main branch discovery), not current.

```diff
    contract L1ERC20TokenBridge (0x091dF5E1284E49fA682407096aD34cfD42B95B72) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      template:
+        "lido/L1ERC20TokenBridge"
      descriptions:
+        ["Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."]
    }
```

```diff
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194","via":[]}]
      template:
+        "circle/L1ERC20TokenBridge"
      descriptions:
+        ["Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally."]
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194)
    +++ description: None
```

```diff
    contract BobMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      name:
-        "RollupOwnerMultisig"
+        "BobMultisig"
    }
```

Generated with discovered.json: 0x068e890da52a4c9acb24e1e501496b9bb859703b

# Diff at Tue, 01 Oct 2024 10:50:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775890
- current block number: 20775890

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775890 (main branch discovery), not current.

```diff
    contract L1ERC20TokenBridge (0x091dF5E1284E49fA682407096aD34cfD42B95B72) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-22T11:43:59.000Z",["0xB531445401926029B1647669cFAc8b4e5d8C7777"]]]
    }
```

```diff
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-04-11T19:06:59.000Z",["0x994e3B01D130944a3E67BFd3B8Fc73069b959FEc"]]]
    }
```

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-04-11T19:04:47.000Z",["0xaa0A1EfD35d6578ea6B5704dbc2c40B36A55B590"]]]
    }
```

```diff
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-04-11T19:06:35.000Z",["0x59191bD38EBA4a642C9FEc308dc188731b229822"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xE3d981643b806FB8030CDB677D6E60892E547EdA) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-04-11T19:02:11.000Z",["0xE3d981643b806FB8030CDB677D6E60892E547EdA"]],["2024-04-11T19:06:11.000Z",["0x237853621998a33Fa5B9B820592F4c6f4c158c12"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xbe7e3a68e822a2fdc7e3b8069c25a32e039e1892

# Diff at Wed, 18 Sep 2024 11:32:13 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 20016201
- current block number: 20775890

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      directlyReceivedPermissions.1.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E","via":[{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1","via":[{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]}
      receivedPermissions.4.target:
-        "0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"
+        "0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"
      receivedPermissions.3.target:
-        "0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"
+        "0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E"
      receivedPermissions.2.target:
-        "0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E"
+        "0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7"
      receivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7"
+        "0xF2dc77c697e892542cC53336178a78Bb313DFDC7"
      receivedPermissions.0.target:
-        "0xF2dc77c697e892542cC53336178a78Bb313DFDC7"
+        "0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"
      receivedPermissions.0.via:
-        [{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.deletedOutputs:
+        []
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract L1CrossDomainMessenger (0xE3d981643b806FB8030CDB677D6E60892E547EdA) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

Generated with discovered.json: 0x62dbeb5f9142c376f33fd031402e69d310835d5b

# Diff at Sun, 08 Sep 2024 17:17:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xF2dc77c697e892542cC53336178a78Bb313DFDC7"},{"permission":"upgrade","target":"0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7"},{"permission":"upgrade","target":"0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E"},{"permission":"upgrade","target":"0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"},{"permission":"upgrade","target":"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xF2dc77c697e892542cC53336178a78Bb313DFDC7"},{"permission":"upgrade","target":"0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7"},{"permission":"upgrade","target":"0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E"},{"permission":"upgrade","target":"0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"},{"permission":"upgrade","target":"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"}]
    }
```

```diff
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"
+        "0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E"
      issuedPermissions.0.via.0:
+        {"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","delay":0}
    }
```

```diff
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"
+        "0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E"
      issuedPermissions.0.via.0:
+        {"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","delay":0}
    }
```

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"
+        "0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E"
      issuedPermissions.0.via.0:
+        {"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","delay":0}
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions."]
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1","via":[{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393","via":[{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","via":[{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","via":[{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]}
      receivedPermissions.0.target:
-        "0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"
+        "0xF2dc77c697e892542cC53336178a78Bb313DFDC7"
      receivedPermissions.0.via:
+        [{"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"}]
    }
```

```diff
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"
+        "0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E"
      issuedPermissions.0.via.0:
+        {"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","delay":0}
    }
```

```diff
    contract AddressManager (0xF2dc77c697e892542cC53336178a78Bb313DFDC7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"
+        "0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E"
      issuedPermissions.0.via.0:
+        {"address":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","delay":0}
    }
```

Generated with discovered.json: 0x92c87a09266d54273fb1171ca12fc5cd3796579f

# Diff at Fri, 30 Aug 2024 07:51:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x70a2b540baf6326f8456bf65284532664ea98925

# Diff at Fri, 23 Aug 2024 09:51:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract L1ERC20TokenBridge (0x091dF5E1284E49fA682407096aD34cfD42B95B72) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1f078d7f75bb60f3a1a63817c855587a3d0af3ba

# Diff at Wed, 21 Aug 2024 10:02:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393","0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"],"configure":["0xF2dc77c697e892542cC53336178a78Bb313DFDC7"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xF2dc77c697e892542cC53336178a78Bb313DFDC7","via":[]},{"permission":"upgrade","target":"0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","via":[]},{"permission":"upgrade","target":"0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","via":[]},{"permission":"upgrade","target":"0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393","via":[]},{"permission":"upgrade","target":"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb","via":[]}]
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

```diff
    contract AddressManager (0xF2dc77c697e892542cC53336178a78Bb313DFDC7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0","via":[]}]
    }
```

Generated with discovered.json: 0x8e0d0817f40d0d6a38239d1a617fd478b33111c9

# Diff at Fri, 09 Aug 2024 11:58:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"
+        "0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"
      assignedPermissions.upgrade.2:
-        "0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"
+        "0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"
    }
```

Generated with discovered.json: 0xc3b46a32a85e8df6b8fe449fb0867b49e637d65e

# Diff at Fri, 09 Aug 2024 10:08:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393","0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"]
      assignedPermissions.owner:
-        ["0xF2dc77c697e892542cC53336178a78Bb313DFDC7"]
      assignedPermissions.upgrade:
+        ["0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7","0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E","0xdDa53E23f8a32640b04D7256e651C1db98dB11C1","0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393"]
      assignedPermissions.configure:
+        ["0xF2dc77c697e892542cC53336178a78Bb313DFDC7"]
    }
```

```diff
    contract GnosisSafe (0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0x32B8325b7f12ADB06763D6D04c951AC94e36C3D7"]
      values.getThreshold:
-        1
      values.$members:
+        ["0x32B8325b7f12ADB06763D6D04c951AC94e36C3D7"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb"]
      assignedPermissions.upgrade:
+        ["0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb"]
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0xfB7Cf35d123BcE8bc91DC7bEccDC8ab81853007c","0x45894CeBad0a1298D44aF2B528490693E58B322E","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xCa1B0866CCcfcFf6dbb7B8a0eD57EA663070c50c","0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff","0xa23366C4bDD05d6Ac5ae66503fb5AC2827eD5051"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xfB7Cf35d123BcE8bc91DC7bEccDC8ab81853007c","0x45894CeBad0a1298D44aF2B528490693E58B322E","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xCa1B0866CCcfcFf6dbb7B8a0eD57EA663070c50c","0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff","0xa23366C4bDD05d6Ac5ae66503fb5AC2827eD5051"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"]
      assignedPermissions.configure:
+        ["0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0"]
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x56b73FA51e09D0BBFA3A5346aaB7576Edc9d0436","0xC9D2c719d6C8Ba2876FC9B443c7d2690072F04ad","0xFB771f2640Dfd37B18332a84817B2a6e994f5BF6","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x56b73FA51e09D0BBFA3A5346aaB7576Edc9d0436","0xC9D2c719d6C8Ba2876FC9B443c7d2690072F04ad","0xFB771f2640Dfd37B18332a84817B2a6e994f5BF6","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x9dd3533431ed12255a2204f7e920a5f2b32640dd

# Diff at Thu, 18 Jul 2024 10:30:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20016201
- current block number: 20016201

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016201 (main branch discovery), not current.

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x8966bc0f2b786fa51b15aa2d9982fd1d05f792ec

# Diff at Wed, 22 May 2024 16:40:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19825954
- current block number: 19926669

## Description

Fee change for the L2 fee calculation. The new scalar value is [encoded](https://specs.optimism.io/protocol/exec-engine.html#ecotone-l1-cost-fee-changes-eip-4844-da).

## Watched changes

```diff
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393) {
    +++ description: None
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279131273430256651056"
    }
```

```diff
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E) {
    +++ description: None
      values.nonce:
-        2
+        3
    }
```

Generated with discovered.json: 0x5cc273f3a6946a11fc5da2bff31e3aedf40a9af9

# Diff at Wed, 08 May 2024 14:32:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19825954

## Description

Initial discovery: BOB (build on bitcoin) is a general-purpose OP stack rollup (.97 similarity with base excluding USDC bridge).
They are early in their roadmap but aim to offer BTC defi options, a Bitcoin light client and security inheritance from Bitcoin PoW.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x091dF5E1284E49fA682407096aD34cfD42B95B72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0d9f416260598313Be6FDf6B010f2FbC34957Cd0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1UsdcBridge (0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x778870B55576Bdb2B5368A3CB225fBcED2B8D0Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xACB886b75D76d1c8d9248cFdDfA09b70C71c5393)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UsdcBridgeOwnerMultisig (0xC73b6E6ec346f9f1A07D2e7A4380858D7BEa0194)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0xC91482A96e9c2A104d9298D1980eCCf8C4dc764E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdDa53E23f8a32640b04D7256e651C1db98dB11C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xE3d981643b806FB8030CDB677D6E60892E547EdA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xF2dc77c697e892542cC53336178a78Bb313DFDC7)
    +++ description: None
```
