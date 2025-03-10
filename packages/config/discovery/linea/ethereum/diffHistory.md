Generated with discovered.json: 0xb20abb3200b9a4c07f68c9579ea8797dd43be3d0

# Diff at Thu, 06 Mar 2025 15:18:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21434844
- current block number: 21434844

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21434844 (main branch discovery), not current.

```diff
    contract LineaAdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]}
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.3.via:
-        [{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]
      receivedPermissions.3.description:
+        "propose transactions."
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.2.via.1:
-        {"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}
      receivedPermissions.2.via.0.address:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.2.description:
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.1.description:
-        "propose transactions in the Timelock."
+        "execute transactions that are ready."
      receivedPermissions.0.description:
-        "cancel transactions that are waiting in the Timelock."
+        "cancel queued transactions."
    }
```

```diff
    contract Timelock (0xd6B95c960779c72B8C6752119849318E5d550574) {
    +++ description: A standard timelock with access control. The current minimum delay is 0s.
      template:
-        "linea/Timelock"
+        "global/Timelock"
      description:
-        "A Timelock with currently 0s minimum delay."
+        "A standard timelock with access control. The current minimum delay is 0s."
      issuedPermissions.7:
+        {"permission":"interact","to":"0xF24f1DC519d88246809B660eb56D94048575d083","description":"propose transactions.","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      issuedPermissions.6:
+        {"permission":"interact","to":"0xF24f1DC519d88246809B660eb56D94048575d083","description":"manage all access control roles and change the minimum delay.","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]}
      issuedPermissions.5:
+        {"permission":"interact","to":"0xF24f1DC519d88246809B660eb56D94048575d083","description":"execute transactions that are ready.","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xF24f1DC519d88246809B660eb56D94048575d083","description":"cancel queued transactions.","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      issuedPermissions.3.to:
-        "0xF24f1DC519d88246809B660eb56D94048575d083"
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.3.description:
-        "propose transactions in the Timelock."
+        "propose transactions."
      issuedPermissions.3.via.0:
-        {"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}
      issuedPermissions.2.to:
-        "0xF24f1DC519d88246809B660eb56D94048575d083"
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.2.description:
-        "cancel transactions that are waiting in the Timelock."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.2.via.0.address:
-        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      issuedPermissions.1.description:
-        "propose transactions in the Timelock."
+        "execute transactions that are ready."
      issuedPermissions.0.description:
-        "cancel transactions that are waiting in the Timelock."
+        "cancel queued transactions."
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"0xd6B95c960779c72B8C6752119849318E5d550574","description":"manage all access control roles and change the minimum delay."}
      values.Canceller:
-        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.delayFormatted:
-        "0s"
      values.Executor:
-        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.Proposer:
-        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.cancellerAC:
+        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.executorAC:
+        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.minDelayFormatted:
+        "0s"
      values.proposerAC:
+        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.timelockAdminAC:
+        ["0xd6B95c960779c72B8C6752119849318E5d550574"]
      displayName:
+        "L1Timelock"
    }
```

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: The Zodiac roles module for Safe multisigs allows defining roles that are allowed to call preconfigured targets on behalf of the Gnosis Safe.
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"},{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"},{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.3.via.2:
-        {"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}
      receivedPermissions.3.via.1:
-        {"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}
      receivedPermissions.3.via.0.address:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      receivedPermissions.3.description:
+        "propose transactions."
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.2.via.2:
-        {"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}
      receivedPermissions.2.via.1.address:
-        "0xd6B95c960779c72B8C6752119849318E5d550574"
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      receivedPermissions.2.via.0.address:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.2.description:
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.1.description:
-        "propose transactions in the Timelock."
+        "execute transactions that are ready."
      receivedPermissions.0.description:
-        "cancel transactions that are waiting in the Timelock."
+        "cancel queued transactions."
    }
```

Generated with discovered.json: 0xe3f1d6d950a414cc9a2239609bb82e1651353cfa

# Diff at Tue, 04 Mar 2025 10:39:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21434844
- current block number: 21434844

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21434844 (main branch discovery), not current.

```diff
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: Contract used to bridge and escrow ERC-20 tokens.
      sinceBlock:
+        17834649
    }
```

```diff
    contract CallForwardingProxy (0x3697bD0bC6C050135b8321F989a5316eACbF367D) {
    +++ description: A proxy contract forwarding calls to a predefined (immutable) target contract.
      sinceBlock:
+        21321239
    }
```

```diff
    contract BridgedToken (0x36f274C1C197F277EA3C57859729398FCc8a3763) {
    +++ description: None
      sinceBlock:
+        17834645
    }
```

```diff
    contract USDCBridgeProxyAdmin (0x41fAD3Df1B07B647D120D055259E474fE8046eb5) {
    +++ description: None
      sinceBlock:
+        17836169
    }
```

```diff
    contract USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce) {
    +++ description: None
      sinceBlock:
+        17836170
    }
```

```diff
    contract LineaAdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      sinceBlock:
+        17676233
    }
```

```diff
    contract ERC20UpgradableBeacon (0x971f46a2852d11D59dbF0909e837cfd06f357DeB) {
    +++ description: None
      sinceBlock:
+        17834646
    }
```

```diff
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761) {
    +++ description: None
      sinceBlock:
+        12504265
    }
```

```diff
    contract VerifierProofType3 (0xBfF4a03A355eEF7dA720bBC7878F9BdBBE81fe6F) {
    +++ description: None
      sinceBlock:
+        20311286
    }
```

```diff
    contract LineaRollup (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.
      sinceBlock:
+        17677070
    }
```

```diff
    contract Timelock (0xd6B95c960779c72B8C6752119849318E5d550574) {
    +++ description: A Timelock with currently 0s minimum delay.
      sinceBlock:
+        17676332
    }
```

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: The Zodiac roles module for Safe multisigs allows defining roles that are allowed to call preconfigured targets on behalf of the Gnosis Safe.
      sinceBlock:
+        18614911
    }
```

```diff
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6) {
    +++ description: None
      sinceBlock:
+        17676969
    }
```

Generated with discovered.json: 0xc9703b0a44abd12c0eacba0069dfcfdc0ab54f00

# Diff at Tue, 04 Feb 2025 12:31:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21434844
- current block number: 21434844

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21434844 (main branch discovery), not current.

```diff
    contract LineaAdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Timelock (0xd6B95c960779c72B8C6752119849318E5d550574) {
    +++ description: A Timelock with currently 0s minimum delay.
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
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
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: The Zodiac roles module for Safe multisigs allows defining roles that are allowed to call preconfigured targets on behalf of the Gnosis Safe.
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x874bd8e09d9a59b1655c8a383934c39acfab39fd

# Diff at Wed, 29 Jan 2025 09:52:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 21434844
- current block number: 21434844

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21434844 (main branch discovery), not current.

```diff
    contract LineaAdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]}
      receivedPermissions.2.from:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
+        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.from:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.1.via:
-        [{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]
      receivedPermissions.1.description:
+        "propose transactions in the Timelock."
      receivedPermissions.0.description:
-        "propose transactions in the Timelock."
+        "cancel transactions that are waiting in the Timelock."
    }
```

```diff
    contract Timelock (0xd6B95c960779c72B8C6752119849318E5d550574) {
    +++ description: A Timelock with currently 0s minimum delay.
      issuedPermissions.3:
+        {"permission":"configure","to":"0xF24f1DC519d88246809B660eb56D94048575d083","description":"propose transactions in the Timelock.","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      issuedPermissions.2:
+        {"permission":"configure","to":"0xF24f1DC519d88246809B660eb56D94048575d083","description":"cancel transactions that are waiting in the Timelock.","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      issuedPermissions.1.to:
-        "0xF24f1DC519d88246809B660eb56D94048575d083"
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.1.via.0:
-        {"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}
      issuedPermissions.0.description:
-        "propose transactions in the Timelock."
+        "cancel transactions that are waiting in the Timelock."
    }
```

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: The Zodiac roles module for Safe multisigs allows defining roles that are allowed to call preconfigured targets on behalf of the Gnosis Safe.
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"},{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}
      receivedPermissions.2.from:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
+        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.from:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.1.via.2:
-        {"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}
      receivedPermissions.1.via.1:
-        {"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}
      receivedPermissions.1.via.0.address:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      receivedPermissions.1.description:
+        "propose transactions in the Timelock."
      receivedPermissions.0.description:
-        "propose transactions in the Timelock."
+        "cancel transactions that are waiting in the Timelock."
    }
```

Generated with discovered.json: 0x72516bc727c7c6f1a4b40a5e8bc54fa05c8c22a8

# Diff at Mon, 20 Jan 2025 11:09:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21434844
- current block number: 21434844

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21434844 (main branch discovery), not current.

```diff
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: Contract used to bridge and escrow ERC-20 tokens.
      issuedPermissions.1.target:
-        "0xF24f1DC519d88246809B660eb56D94048575d083"
      issuedPermissions.1.via.2.delay:
-        0
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xF24f1DC519d88246809B660eb56D94048575d083"
      issuedPermissions.0.target:
-        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
    }
```

```diff
    contract USDCBridgeProxyAdmin (0x41fAD3Df1B07B647D120D055259E474fE8046eb5) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x504A330327A089d8364C4ab3811Ee26976d388ce"
      receivedPermissions.0.from:
+        "0x504A330327A089d8364C4ab3811Ee26976d388ce"
    }
```

```diff
    contract USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x41fAD3Df1B07B647D120D055259E474fE8046eb5"
      issuedPermissions.0.to:
+        "0x41fAD3Df1B07B647D120D055259E474fE8046eb5"
    }
```

```diff
    contract LineaAdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      receivedPermissions.2.from:
+        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      receivedPermissions.1.target:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      receivedPermissions.1.from:
+        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      receivedPermissions.0.target:
-        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.0.from:
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      directlyReceivedPermissions.0.target:
-        "0xd6B95c960779c72B8C6752119849318E5d550574"
      directlyReceivedPermissions.0.from:
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
    }
```

```diff
    contract LineaRollup (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.
      issuedPermissions.3.target:
-        "0xF24f1DC519d88246809B660eb56D94048575d083"
      issuedPermissions.3.via.2.delay:
-        0
      issuedPermissions.3.via.1.delay:
-        0
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0xF24f1DC519d88246809B660eb56D94048575d083"
      issuedPermissions.2.target:
-        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.1.target:
-        "0x52FF08F313A00A54e3Beffb5C4a7F7446eFb6754"
      issuedPermissions.1.to:
+        "0x52FF08F313A00A54e3Beffb5C4a7F7446eFb6754"
      issuedPermissions.0.target:
-        "0x46d2F319fd42165D4318F099E143dEA8124E9E3e"
      issuedPermissions.0.to:
+        "0x46d2F319fd42165D4318F099E143dEA8124E9E3e"
    }
```

```diff
    contract Timelock (0xd6B95c960779c72B8C6752119849318E5d550574) {
    +++ description: A Timelock with currently 0s minimum delay.
      issuedPermissions.1.target:
-        "0xF24f1DC519d88246809B660eb56D94048575d083"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "propose transactions in the Timelock."
      issuedPermissions.1.to:
+        "0xF24f1DC519d88246809B660eb56D94048575d083"
      issuedPermissions.1.description:
+        "propose transactions in the Timelock."
      issuedPermissions.0.target:
-        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.0.to:
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.0.description:
+        "propose transactions in the Timelock."
      directlyReceivedPermissions.0.target:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
      directlyReceivedPermissions.0.from:
+        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
    }
```

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: The Zodiac roles module for Safe multisigs allows defining roles that are allowed to call preconfigured targets on behalf of the Gnosis Safe.
      receivedPermissions.2.target:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      receivedPermissions.2.from:
+        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      receivedPermissions.1.target:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      receivedPermissions.1.from:
+        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      receivedPermissions.0.target:
-        "0xd6B95c960779c72B8C6752119849318E5d550574"
      receivedPermissions.0.from:
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      directlyReceivedPermissions.0.target:
-        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      directlyReceivedPermissions.0.from:
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
    }
```

```diff
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      directlyReceivedPermissions.1.from:
+        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      directlyReceivedPermissions.0.target:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      directlyReceivedPermissions.0.from:
+        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
    }
```

Generated with discovered.json: 0x6fdf9898969d773a717bb79403088b72fdecd3d6

# Diff at Thu, 19 Dec 2024 06:41:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ba3abe5bc7194f8b3495f894c1b7e7b769bcdbb1 block: 21078909
- current block number: 21434844

## Description

Linea upgrades to [alpha v4](https://docs.linea.build/release-notes#alpha-v4)!

This upgrade adds new roles, deprecates `finalizeBlocksWithoutProof` and adds self-proposing/-proving if there weren't any finalized batches by the operator in the previous 6 months, among smaller changes.

## Watched changes

```diff
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: Contract used to bridge and escrow ERC-20 tokens.
      sourceHashes.1:
-        "0x4c5d4e5696bc435eefd0ba909c6a8a7748c4c49260fcb51a360f07af3c38d76f"
+        "0x49bdbe79d2cc9cefee03245e4b48260f4a71e7976af51741005758e7236d687d"
      values.$implementation:
-        "0xd52c09E67aF3BE0977B52b4817366e9BaB5dCFA2"
+        "0x2B6A2F8880220a66DfB9059FCB76F7dB54104a34"
      values.$pastUpgrades.2:
+        ["2024-12-16T13:52:11.000Z","0x96b88112de2e594cb763bc625cc2dcb6920825bb642eb1a62ff577f0c29f616d",["0x2B6A2F8880220a66DfB9059FCB76F7dB54104a34"]]
      values.$upgradeCount:
-        2
+        3
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      values.accessControl.PAUSE_ALL_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_ALL_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_INITIATE_TOKEN_BRIDGING_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_INITIATE_TOKEN_BRIDGING_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_COMPLETE_TOKEN_BRIDGING_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_COMPLETE_TOKEN_BRIDGING_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.SET_CUSTOM_CONTRACT_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.REMOVE_RESERVED_TOKEN_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.SET_MESSAGE_SERVICE_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.SET_REMOTE_TOKENBRIDGE_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.SET_RESERVED_TOKEN_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.owner:
-        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      values.paused:
-        false
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
      values.CONTRACT_VERSION:
+        "1.0"
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.PAUSE_ALL_ROLE:
+        "0x56bdc3c9ec86cb7db110a7699b2ade72f0b8819727d9f7d906b012641505fa77"
      values.PAUSE_COMPLETE_TOKEN_BRIDGING_ROLE:
+        "0x50962b2d10066f5051f78d5ea04a3ab09b9c87dd1002962f0b1e30e66eeb80a5"
      values.PAUSE_INITIATE_TOKEN_BRIDGING_ROLE:
+        "0x3900d9d72d5177a154375317154fdc0e08377e3134a8a5d21cadccf831cc231c"
      values.REMOVE_RESERVED_TOKEN_ROLE:
+        "0x19bf281d118073c159a713666aba52e0d403520cd01e03f42e0f62a0b3bd4a35"
      values.SET_CUSTOM_CONTRACT_ROLE:
+        "0x550554a677c8e7b73b62db78b0ef06c5f237da4ef30b88196a899ccf591041fe"
      values.SET_MESSAGE_SERVICE_ROLE:
+        "0x77974cc9cb5bafc9bb265be792d93fa46355c05701895b82f6d3b4b448c8ce00"
      values.SET_REMOTE_TOKENBRIDGE_ROLE:
+        "0xbf094fe3c005c553ff0d33c7dff9d1273add12fb3f258b992f8d36224dd35b24"
      values.SET_RESERVED_TOKEN_ROLE:
+        "0xeaf25fcc6b7d45bda16c56628df3f435e20319ef53b065c11ee4510083f0ae2d"
      values.UNPAUSE_ALL_ROLE:
+        "0xd8b4c34c2ec1f3194471108c64ad2beda340c0337ee4ca35592f9ef270f4228b"
      values.UNPAUSE_COMPLETE_TOKEN_BRIDGING_ROLE:
+        "0x8a7b208fd13ab36d18025be4f62b53d46aeb2cbe8958d2e13de74c040dddcddd"
      values.UNPAUSE_INITIATE_TOKEN_BRIDGING_ROLE:
+        "0x46e34517dc946faf87aabe65eb5b4fa06b974e5c8d72c5df73b9fb6ff7b6d802"
    }
```

```diff
    contract LineaRollup (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.
      sourceHashes.1:
-        "0x6eace22f38b33b52c0608ca553753365c7aaa2ac2e9efba018e6f2c4864b9e40"
+        "0xd9038151917d14b4d25257789abe9a10cecf3a5b4c0c2520860ce1338757ceff"
      values.$implementation:
-        "0x1825242411792536469Cbb5843fd27Ce3e9e583A"
+        "0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0"
      values.$pastUpgrades.8:
+        ["2024-12-16T13:52:11.000Z","0x96b88112de2e594cb763bc625cc2dcb6920825bb642eb1a62ff577f0c29f616d",["0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0"]]
      values.$upgradeCount:
-        8
+        9
      values.accessControl.PAUSE_MANAGER_ROLE:
-        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_MANAGER:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_ALL_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_L1_L2_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_L2_L1_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_ALL_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_L1_L2_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_L2_L1_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_BLOB_SUBMISSION_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_BLOB_SUBMISSION_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.PAUSE_FINALIZATION_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.UNPAUSE_FINALIZATION_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.USED_RATE_LIMIT_RESETTER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.accessControl.VERIFIER_UNSETTER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]}
      values.GENERAL_PAUSE_TYPE:
-        1
      values.L1_L2_PAUSE_TYPE:
-        2
      values.L2_L1_PAUSE_TYPE:
-        3
      values.PAUSE_MANAGER_ROLE:
-        "0x356a809dfdea9198dd76fb76bf6d403ecf13ea675eb89e1eda2db2c4a4676a26"
      values.PROVING_SYSTEM_PAUSE_TYPE:
-        4
      values.CONTRACT_VERSION:
+        "6.0"
      values.fallbackOperator:
+        "0x3697bD0bC6C050135b8321F989a5316eACbF367D"
      values.PAUSE_ALL_ROLE:
+        "0x56bdc3c9ec86cb7db110a7699b2ade72f0b8819727d9f7d906b012641505fa77"
      values.PAUSE_BLOB_SUBMISSION_ROLE:
+        "0x67c2dca7476ee0fe1dd3cba13428c6760bfe2599a6dfe26a9ad7ef27317c6e77"
      values.PAUSE_FINALIZATION_ROLE:
+        "0xe37c272ea30e2bb381ad7cf89ae754b49153250609f36d0cbdad8b64c184bb5c"
      values.PAUSE_L1_L2_ROLE:
+        "0x430a7f0cb00b5ebbe63cecc96e82cf959a883e7c13a95110854f1fa6b3fbf598"
      values.PAUSE_L2_L1_ROLE:
+        "0xe1fce82838dd7a42cfe783f60dc6233c8aa2c4fc66e77817805e767ec5e349b6"
      values.UNPAUSE_ALL_ROLE:
+        "0xd8b4c34c2ec1f3194471108c64ad2beda340c0337ee4ca35592f9ef270f4228b"
      values.UNPAUSE_BLOB_SUBMISSION_ROLE:
+        "0xe4831f9e4316ac2c65117d1f602fbf56d38128a9973d5e3fdbc5b77265c18d40"
      values.UNPAUSE_FINALIZATION_ROLE:
+        "0x1ab87f7458c0e3d07e9881c14ee67f0141703614fd48ea5b15ed987e5f4b030e"
      values.UNPAUSE_L1_L2_ROLE:
+        "0xe8cb6172fcf5cbaae022b7c910224a4f0c20d53227e630056efff182155a5abc"
      values.UNPAUSE_L2_L1_ROLE:
+        "0xb6cc65f42901ed602aec1619cc1ead29d487cd489094a37615153eaeb991d770"
      values.USED_RATE_LIMIT_RESETTER_ROLE:
+        "0x0cf0d2deb70d7bdac2fa48c4ac99bc558170be0ce5fcb994caefa4bf7b96edf9"
      values.VERIFIER_UNSETTER_ROLE:
+        "0x6b5661ddfbd1fbd525c902a513e0f47d9c74f1c1ee8a2d4f1937ad305fb8f41a"
    }
```

```diff
+   Status: CREATED
    contract CallForwardingProxy (0x3697bD0bC6C050135b8321F989a5316eACbF367D)
    +++ description: A proxy contract forwarding calls to a predefined (immutable) target contract.
```

## Source code changes

```diff
.../linea/ethereum/.flat/CallForwardingProxy.sol   |   23 +
 .../LineaRollup/LineaRollup.sol                    | 2267 +++++++++++---------
 .../TokenBridge/TokenBridge.sol                    | 1798 +++++++++++++---
 3 files changed, 2743 insertions(+), 1345 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078909 (main branch discovery), not current.

```diff
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: Contract used to bridge and escrow ERC-20 tokens.
      name:
-        "ERC20Bridge"
+        "TokenBridge"
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xF24f1DC519d88246809B660eb56D94048575d083","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3","delay":0},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574","delay":0},{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","delay":0}]}
      issuedPermissions.0.target:
-        "0xd6B95c960779c72B8C6752119849318E5d550574"
+        "0x892bb7EeD71efB060ab90140e7825d8127991DD3"
      issuedPermissions.0.via.1:
+        {"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      template:
+        "linea/TokenBridge"
      description:
+        "Contract used to bridge and escrow ERC-20 tokens."
    }
```

```diff
    contract LineaAdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      name:
-        "AdminMultisig"
+        "LineaAdminMultisig"
      receivedPermissions:
+        [{"permission":"configure","target":"0xd6B95c960779c72B8C6752119849318E5d550574","description":"propose transactions in the Timelock."},{"permission":"upgrade","target":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]},{"permission":"upgrade","target":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xd6B95c960779c72B8C6752119849318E5d550574"}]
    }
```

```diff
    contract LineaRollup (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.
      name:
-        "zkEVM"
+        "LineaRollup"
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0xF24f1DC519d88246809B660eb56D94048575d083","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3","delay":0},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574","delay":0},{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","delay":0}]}
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x892bb7EeD71efB060ab90140e7825d8127991DD3","via":[{"address":"0xd6B95c960779c72B8C6752119849318E5d550574","delay":0},{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","delay":0}]}
      issuedPermissions.1:
+        {"permission":"operateLinea","target":"0x52FF08F313A00A54e3Beffb5C4a7F7446eFb6754","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "operateLinea"
      issuedPermissions.0.target:
-        "0xd6B95c960779c72B8C6752119849318E5d550574"
+        "0x46d2F319fd42165D4318F099E143dEA8124E9E3e"
      issuedPermissions.0.via.0:
-        {"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","delay":0}
      values.generalPause:
-        false
      values.l1l2Pause:
-        false
      values.l2l1Pause:
-        false
      values.provenCompressedBlocksWithoutProof:
-        [2242752]
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.19:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.18:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.17:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.16:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.15:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.14:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.13:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.12:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.11:
+        "0x0000000000000000000000000000000000000000"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.10:
+        "0x0000000000000000000000000000000000000000"
      values.isPaused_BLOB_SUBMISSION:
+        false
      values.isPaused_CALLDATA_SUBMISSION:
+        false
      values.isPaused_COMPLETE_TOKEN_BRIDGING:
+        false
      values.isPaused_FINALIZATION:
+        false
      values.isPaused_GENERAL:
+        false
      values.isPaused_INITIATE_TOKEN_BRIDGING:
+        false
      values.isPaused_L1_L2:
+        false
      values.isPaused_L2_L1:
+        false
      values.Operators:
+        ["0x46d2F319fd42165D4318F099E143dEA8124E9E3e","0x52FF08F313A00A54e3Beffb5C4a7F7446eFb6754"]
      template:
+        "linea/LineaRollup"
      description:
+        "The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2."
    }
```

```diff
    contract Timelock (0xd6B95c960779c72B8C6752119849318E5d550574) {
    +++ description: A Timelock with currently 0s minimum delay.
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"}]},{"permission":"upgrade","target":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"}]}]
      values.Canceller:
+        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.delayFormatted:
+        "0s"
      values.Executor:
+        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      values.Proposer:
+        ["0x892bb7EeD71efB060ab90140e7825d8127991DD3"]
      template:
+        "linea/Timelock"
      description:
+        "A Timelock with currently 0s minimum delay."
      issuedPermissions:
+        [{"permission":"configure","target":"0x892bb7EeD71efB060ab90140e7825d8127991DD3","via":[]},{"permission":"configure","target":"0xF24f1DC519d88246809B660eb56D94048575d083","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3","delay":0,"description":"propose transactions in the Timelock."}]}]
    }
```

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: The Zodiac roles module for Safe multisigs allows defining roles that are allowed to call preconfigured targets on behalf of the Gnosis Safe.
      description:
+        "The Zodiac roles module for Safe multisigs allows defining roles that are allowed to call preconfigured targets on behalf of the Gnosis Safe."
      receivedPermissions:
+        [{"permission":"configure","target":"0xd6B95c960779c72B8C6752119849318E5d550574","description":"propose transactions in the Timelock.","via":[{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]},{"permission":"upgrade","target":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"},{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]},{"permission":"upgrade","target":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"},{"address":"0xd6B95c960779c72B8C6752119849318E5d550574"},{"address":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]}]
    }
```

Generated with discovered.json: 0x36a3a62508cac2618869c642a34cd0abe5d19e63

# Diff at Wed, 30 Oct 2024 14:01:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20997821
- current block number: 21078909

## Description

Minor (2 lines) upgrade to the assembly part of `_computePublicInput()`.

The old discovery value depending on `BlockFinalized` is removed as it was empty and the event was deprecated in the contracts some time ago.

## Watched changes

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      sourceHashes.1:
-        "0x9107909af0d0c9abd3904984ff1b8b0824d489b8b1ac2902b805ce7d417e2e9f"
+        "0x6eace22f38b33b52c0608ca553753365c7aaa2ac2e9efba018e6f2c4864b9e40"
      values.$implementation:
-        "0x53fC68bFfC03D17804e5A901DE42d1eeF2e64562"
+        "0x1825242411792536469Cbb5843fd27Ce3e9e583A"
      values.$pastUpgrades.7:
+        ["2024-10-29T15:35:47.000Z","0x0970f422c80627f28916f9c5583ff6298070893debd191ead0cf39778e4bae14",["0x1825242411792536469Cbb5843fd27Ce3e9e583A"]]
      values.$upgradeCount:
-        7
+        8
    }
```

## Source code changes

```diff
.../ethereum/{.flat@20997821 => .flat}/zkEVM/LineaRollup.sol     | 9 +++++----
 1 file changed, 5 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20997821 (main branch discovery), not current.

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      values.provenNonCompressedBlocksWithoutProof:
-        []
    }
```

Generated with discovered.json: 0xd2a3b998732812ae4b169116d1e878b0136cc29e

# Diff at Mon, 21 Oct 2024 11:07:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20997821
- current block number: 20997821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20997821 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xd52c09E67aF3BE0977B52b4817366e9BaB5dCFA2"]
      values.$pastUpgrades.1.1:
-        ["0xd52c09E67aF3BE0977B52b4817366e9BaB5dCFA2"]
+        "0x497bdab1d3fb97eed72a55fc6e3672694195b08f949c2e0e84ea4b36428ee9c6"
      values.$pastUpgrades.0.2:
+        ["0x6ccfD65b0b14F67259C77Ca6267104e058dDB292"]
      values.$pastUpgrades.0.1:
-        ["0x6ccfD65b0b14F67259C77Ca6267104e058dDB292"]
+        "0xbc08c4596eeee0a2e2527f03c0f2e85ec9e76e062b5f86eb435a67bca8f21122"
    }
```

```diff
    contract USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x0eC393209674090368C592A591B25811e490BF36"]
      values.$pastUpgrades.1.1:
-        ["0x0eC393209674090368C592A591B25811e490BF36"]
+        "0xe752ce539119fc11af6239e8b26a79d80c9e84cec19ac6aca060f466853f5b7d"
      values.$pastUpgrades.0.2:
+        ["0x16Db542C30fB3519D11CF8F632077c62c1a944fd"]
      values.$pastUpgrades.0.1:
-        ["0x16Db542C30fB3519D11CF8F632077c62c1a944fd"]
+        "0xa93648a8d01d65bea363bc2f6e19897e42f9af999370c07cb2a0ea6a5401b6b0"
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0x53fC68bFfC03D17804e5A901DE42d1eeF2e64562"]
      values.$pastUpgrades.6.1:
-        ["0x53fC68bFfC03D17804e5A901DE42d1eeF2e64562"]
+        "0x497bdab1d3fb97eed72a55fc6e3672694195b08f949c2e0e84ea4b36428ee9c6"
      values.$pastUpgrades.5.2:
+        ["0x934Dd4C63E285551CEceF8459103554D0096c179"]
      values.$pastUpgrades.5.1:
-        ["0x934Dd4C63E285551CEceF8459103554D0096c179"]
+        "0x565c77e109aac4df41d81457bdfbdd17782d8bca9a1330c68a271c64f35d05e5"
      values.$pastUpgrades.4.2:
+        ["0xAA4b3a9515c921996Abe7930bF75Eff7466a4457"]
      values.$pastUpgrades.4.1:
-        ["0xAA4b3a9515c921996Abe7930bF75Eff7466a4457"]
+        "0xb4ed5b2646e45744945a4fc51da0e5e687ffe26f570b7aa3abb7b1fd4a460ea4"
      values.$pastUpgrades.3.2:
+        ["0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3"]
      values.$pastUpgrades.3.1:
-        ["0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3"]
+        "0xdff29a7f65b6bec4e8288673a5ca55e12081b4d55879e600817484f28c5a80b1"
      values.$pastUpgrades.2.2:
+        ["0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3"]
      values.$pastUpgrades.2.1:
-        ["0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3"]
+        "0x628efc29f5b2267f23cf613720003fafe671ee47db60b4f6610f5ae1ab838555"
      values.$pastUpgrades.1.2:
+        ["0xE8f627df6Cb02e415b2e6d6e112323BD269b4706"]
      values.$pastUpgrades.1.1:
-        ["0xE8f627df6Cb02e415b2e6d6e112323BD269b4706"]
+        "0x8ee4253600d68665e8d52a522d8ba7136639187b87f8079b881de9e6d1f20d2a"
      values.$pastUpgrades.0.2:
+        ["0xE8f627df6Cb02e415b2e6d6e112323BD269b4706"]
      values.$pastUpgrades.0.1:
-        ["0xE8f627df6Cb02e415b2e6d6e112323BD269b4706"]
+        "0x3564f15a274bdc49a6ad8af161113d20a678d87efbd3d708540a9b4d026f1122"
    }
```

Generated with discovered.json: 0xe090f9a24a0d1e75044c61472210a93dbe843519

# Diff at Sat, 19 Oct 2024 06:28:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@493c96785a6a32c6417182bb9548d3a990297dbe block: 20934247
- current block number: 20997821

## Description

The two operator addresses are changed, which will be reflected in the permissions section.
Context: Team also helpfully notified us in advance on telegram.

## Watched changes

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      values.accessControl.OPERATOR_ROLE.members.1:
-        "0xa9268341831eFa4937537bc3e9EB36DbecE83C7e"
+        "0x52FF08F313A00A54e3Beffb5C4a7F7446eFb6754"
      values.accessControl.OPERATOR_ROLE.members.0:
-        "0x9228624C3185FCBcf24c1c9dB76D8Bef5f5DAd64"
+        "0x46d2F319fd42165D4318F099E143dEA8124E9E3e"
    }
```

Generated with discovered.json: 0x5f40de8e0cb83216d42503be0c8d068da862a1db

# Diff at Fri, 18 Oct 2024 10:56:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 20934247
- current block number: 20934247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20934247 (main branch discovery), not current.

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x892bb7EeD71efB060ab90140e7825d8127991DD3"}]
    }
```

Generated with discovered.json: 0x88c0a18d920ef566720eea6c23276ed64b5884f5

# Diff at Mon, 14 Oct 2024 10:52:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20934247
- current block number: 20934247

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20934247 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      issuedPermissions.0.via.0:
+        {"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x4c5d4e5696bc435eefd0ba909c6a8a7748c4c49260fcb51a360f07af3c38d76f"]
    }
```

```diff
    contract BridgedToken (0x36f274C1C197F277EA3C57859729398FCc8a3763) {
    +++ description: None
      sourceHashes:
+        ["0x8a6c3f5b047664111c8f981a4cb5d8a79c5652771665343ffdd15ae64fa253bf"]
    }
```

```diff
    contract USDCBridgeProxyAdmin (0x41fAD3Df1B07B647D120D055259E474fE8046eb5) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

```diff
    contract USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x27a9694e3bfad3a6ec23be7f15d8e6093b4d3a12eba4d10de0d9c660f5a47d30"]
    }
```

```diff
    contract AdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ERC20UpgradableBeacon (0x971f46a2852d11D59dbF0909e837cfd06f357DeB) {
    +++ description: None
      sourceHashes:
+        ["0x02777a2575f23718a66224f10ac65db704c8c844f66d08dd5f9afd58b869f133"]
    }
```

```diff
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761) {
    +++ description: None
      sourceHashes:
+        ["0x3b1182a0432445f884d447d11823ec4b120a198eeaa3d9f3024384d87ee77cf1"]
    }
```

```diff
    contract VerifierProofType3 (0xBfF4a03A355eEF7dA720bBC7878F9BdBBE81fe6F) {
    +++ description: None
      sourceHashes:
+        ["0x47f89dc90dfffe4c8914bdac8b7c92bc4cbee0df1bf52f3926e43fe0934a2ff4"]
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
+        "0xd6B95c960779c72B8C6752119849318E5d550574"
      issuedPermissions.0.via.0:
+        {"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x9107909af0d0c9abd3904984ff1b8b0824d489b8b1ac2902b805ce7d417e2e9f"]
    }
```

```diff
    contract Timelock (0xd6B95c960779c72B8C6752119849318E5d550574) {
    +++ description: None
      sourceHashes:
+        ["0xaf04cf94ef4bf759d6466fa262a5e8e54f6d5c9652286fe5d71c9a904de27e5c"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"}]},{"permission":"upgrade","target":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[{"address":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"}]
    }
```

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    +++ description: None
      sourceHashes:
+        ["0x699a67bde09c0d73c29ec9de66133bfee484544494865d954ac01f9736efed30"]
    }
```

```diff
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"},{"permission":"upgrade","target":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"},{"permission":"upgrade","target":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F"}]
    }
```

Generated with discovered.json: 0xa513efaf6e24057f268b8cace31dbb24a947c021

# Diff at Thu, 10 Oct 2024 09:15:27 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 20389671
- current block number: 20934247

## Description

Signer swapped in AdminMultisig.

## Watched changes

```diff
    contract AdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      values.$members.4:
-        "0x36a0b60162d7F407d74bd1def01410D20437F87B"
+        "0x9376c137AF5124FFc39bD8940A3D88D1cd508992"
    }
```

Generated with discovered.json: 0xe6232787bad87e3865c174553e77fde10d29dcbf

# Diff at Tue, 01 Oct 2024 10:52:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20389671
- current block number: 20389671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389671 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-03T13:04:35.000Z",["0x6ccfD65b0b14F67259C77Ca6267104e058dDB292"]],["2024-06-05T11:49:35.000Z",["0xd52c09E67aF3BE0977B52b4817366e9BaB5dCFA2"]]]
    }
```

```diff
    contract USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-03T18:11:11.000Z",["0x16Db542C30fB3519D11CF8F632077c62c1a944fd"]],["2023-09-01T20:25:47.000Z",["0x0eC393209674090368C592A591B25811e490BF36"]]]
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-12T11:05:23.000Z",["0xE8f627df6Cb02e415b2e6d6e112323BD269b4706"]],["2023-07-12T12:57:47.000Z",["0xE8f627df6Cb02e415b2e6d6e112323BD269b4706"]],["2023-07-15T13:31:23.000Z",["0x4c8d4Ce72afAA417d1F7E833725FdB4E793cd6b3"]],["2023-08-08T16:58:47.000Z",["0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3"]],["2024-02-13T08:39:59.000Z",["0xAA4b3a9515c921996Abe7930bF75Eff7466a4457"]],["2024-03-26T10:29:47.000Z",["0x934Dd4C63E285551CEceF8459103554D0096c179"]],["2024-06-05T11:49:35.000Z",["0x53fC68bFfC03D17804e5A901DE42d1eeF2e64562"]]]
    }
```

Generated with discovered.json: 0xf202e5cd4d42d8539223ef886681136b305c0e8a

# Diff at Fri, 30 Aug 2024 07:53:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20389671
- current block number: 20389671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389671 (main branch discovery), not current.

```diff
    contract USDCBridgeProxyAdmin (0x41fAD3Df1B07B647D120D055259E474fE8046eb5) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x999c5e9f0ead3074d6ddcafb48f46ad103b1e4ac

# Diff at Fri, 23 Aug 2024 09:53:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20389671
- current block number: 20389671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389671 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      values.$upgradeCount:
+        7
    }
```

Generated with discovered.json: 0xe4b4499b3735909ae2274d239b8770be989fb87d

# Diff at Wed, 21 Aug 2024 10:03:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20389671
- current block number: 20389671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389671 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","via":[]}]
    }
```

```diff
    contract USDCBridgeProxyAdmin (0x41fAD3Df1B07B647D120D055259E474fE8046eb5) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x504A330327A089d8364C4ab3811Ee26976d388ce"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x504A330327A089d8364C4ab3811Ee26976d388ce","via":[]}]
    }
```

```diff
    contract USDCBridge (0x504A330327A089d8364C4ab3811Ee26976d388ce) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x41fAD3Df1B07B647D120D055259E474fE8046eb5","via":[]}]
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF5058616517C068C7b8c7EbC69FF636Ade9066d6","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","0xd19d4B5d358258f05D7B411E21A1460D11B0876F"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","via":[]},{"permission":"upgrade","target":"0xd19d4B5d358258f05D7B411E21A1460D11B0876F","via":[]}]
    }
```

Generated with discovered.json: 0x1633d2e251676018188de3c5690fc5885afc96b4

# Diff at Fri, 09 Aug 2024 10:10:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20389671
- current block number: 20389671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389671 (main branch discovery), not current.

```diff
    contract USDCBridgeProxyAdmin (0x41fAD3Df1B07B647D120D055259E474fE8046eb5) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x504A330327A089d8364C4ab3811Ee26976d388ce"]
      assignedPermissions.upgrade:
+        ["0x504A330327A089d8364C4ab3811Ee26976d388ce"]
    }
```

```diff
    contract AdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 8 (50%)"
      values.getOwners:
-        ["0x497515578b0BE54d2f0f32cF3F08B85Bf8cEB6aB","0x239d9B860399366F8d25F6e2962Fb2B9D070aEFE","0x12d674b7eCc0302977E956Cd2d5AC8D030fdbea9","0x5822D8457c00FB82203918ED92907b935B9D40AE","0x36a0b60162d7F407d74bd1def01410D20437F87B","0x4CB4da1D1C198E506031C0Aa8480BA8b57C0fAD4","0xab23f8E6c3288952fdf193A17ad49b15F5EE55A1","0xB4dAebe4D01f467701F95f0196fc29033c54dBcb"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x497515578b0BE54d2f0f32cF3F08B85Bf8cEB6aB","0x239d9B860399366F8d25F6e2962Fb2B9D070aEFE","0x12d674b7eCc0302977E956Cd2d5AC8D030fdbea9","0x5822D8457c00FB82203918ED92907b935B9D40AE","0x36a0b60162d7F407d74bd1def01410D20437F87B","0x4CB4da1D1C198E506031C0Aa8480BA8b57C0fAD4","0xab23f8E6c3288952fdf193A17ad49b15F5EE55A1","0xB4dAebe4D01f467701F95f0196fc29033c54dBcb"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 8 (50%)"
    }
```

```diff
    contract ProxyAdmin (0xF5058616517C068C7b8c7EbC69FF636Ade9066d6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","0xd19d4B5d358258f05D7B411E21A1460D11B0876F"]
      assignedPermissions.upgrade:
+        ["0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319","0xd19d4B5d358258f05D7B411E21A1460D11B0876F"]
    }
```

Generated with discovered.json: 0x7ce7d8aba310ba771f7246400b1c50e747a7395e

# Diff at Tue, 30 Jul 2024 11:12:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20389671
- current block number: 20389671

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389671 (main branch discovery), not current.

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      fieldMeta:
+        {"verifiers":{"description":"Mapping of proof type to ZK Plonk Verifier contract"}}
    }
```

Generated with discovered.json: 0x51489b22b6b962ccd94c990e8c37495160e47993

# Diff at Fri, 26 Jul 2024 08:56:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20340569
- current block number: 20389671

## Description

An unused verifier is removed from the registry.

## Watched changes

```diff
-   Status: DELETED
    contract VerifierProofType1 (0x8AB455030E1Ea718e445f423Bb8D993dcAd24Cc4)
    +++ description: None
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.1:
-        "0x8AB455030E1Ea718e445f423Bb8D993dcAd24Cc4"
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../VerifierProofType1.sol => /dev/null            | 1347 --------------------
 1 file changed, 1347 deletions(-)
```

Generated with discovered.json: 0x20793d968ee199aa8b0f9d4a9b43b9aaff803dfe

# Diff at Fri, 19 Jul 2024 12:26:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@744d4e1fec0be9972ab7fde1dd4cc0ba0c91a28c block: 20059600
- current block number: 20340569

## Description

A new verifier is added for proofType 3 with almost no code diff to the old one (4 constants), probably related to [this PR](https://github.com/Consensys/linea-contracts/pull/20). Already [used in prod](https://app.blocksec.com/explorer/tx/eth/0x0f5c3d308947356409e0f048db7c8f4d5414840be0281c5368147fb6c8b758ab).

## Watched changes

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.3:
-        "0x1111111111111111111111111111111111111111"
+        "0xBfF4a03A355eEF7dA720bBC7878F9BdBBE81fe6F"
    }
```

```diff
+   Status: CREATED
    contract VerifierProofType3 (0xBfF4a03A355eEF7dA720bBC7878F9BdBBE81fe6F)
    +++ description: None
```

## Source code changes

```diff
.../linea/ethereum/.flat/VerifierProofType3.sol    | 1347 ++++++++++++++++++++
 1 file changed, 1347 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20059600 (main branch discovery), not current.

```diff
    contract PlonkVerifierForMultiTypeDataAggregation (0x8AB455030E1Ea718e445f423Bb8D993dcAd24Cc4) {
    +++ description: None
      name:
-        "PlonkVerifierForMultiTypeDataAggregation"
+        "VerifierProofType1"
    }
```

Generated with discovered.json: 0x7dd5879afdba65078bc0f42d885728316075d9e7

# Diff at Wed, 05 Jun 2024 13:36:11 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@dba0142405a65703b7e8a12a6df456ca91e8442d block: 19574554
- current block number: 20025964

## Description

This [upgrade](https://docs.linea.build/developers/linea-version#alpha-v32) is mainly about gas optimizations and does not change functionality. The bridge upgrade is minor, apart from it now being upgradeable by the timelock.

### LineaRollup.sol

- TransientStorageHelpers library added (for tstore'ing values)
- unsetVerifierAddress() function added to unset the verifier contract for a proof type
- Computation of finalized state and public input is now done using assembly

## Watched changes

```diff
    contract ERC20Bridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319) {
    +++ description: None
      upgradeability.implementation:
-        "0x6ccfD65b0b14F67259C77Ca6267104e058dDB292"
+        "0xd52c09E67aF3BE0977B52b4817366e9BaB5dCFA2"
      upgradeability.admin:
-        "0x5B0bb17755FBa06028530682E2FD5bc373931768"
+        "0xF5058616517C068C7b8c7EbC69FF636Ade9066d6"
      implementations.0:
-        "0x6ccfD65b0b14F67259C77Ca6267104e058dDB292"
+        "0xd52c09E67aF3BE0977B52b4817366e9BaB5dCFA2"
    }
```

```diff
-   Status: DELETED
    contract ERC20BridgeProxyAdmin (0x5B0bb17755FBa06028530682E2FD5bc373931768)
    +++ description: None
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      upgradeability.implementation:
-        "0x934Dd4C63E285551CEceF8459103554D0096c179"
+        "0x53fC68bFfC03D17804e5A901DE42d1eeF2e64562"
      implementations.0:
-        "0x934Dd4C63E285551CEceF8459103554D0096c179"
+        "0x53fC68bFfC03D17804e5A901DE42d1eeF2e64562"
      values.GENESIS_SHNARF:
-        "0x4f64fe1ce613546d34d666d8258c13c6296820fd13114d784203feb91276e838"
+        "0x47452a1b9ebadfe02bdd02f580fa1eba17680d57eec968a591644d05d78ee84f"
      values.sender:
-        "0x00000000000000000000000000000000075BCd15"
+        "0x0000000000000000000000000000000000000000"
      values.currentFinalizedState:
+        "0xdefa81791e0d707e911c19ca6336da4b78f81cf3e085e591c31b94155ede2b08"
    }
```

## Source code changes

```diff
.../ERC20Bridge/TokenBridge.sol                    | 111 ++-
 .../dev/null                                       | 146 ----
 .../zkEVM/LineaRollup.sol                          | 968 +++++++++++++--------
 3 files changed, 668 insertions(+), 557 deletions(-)
```

Generated with discovered.json: 0xb58a5128a27cb93b34481a9cfc0c0e196eef55fc

# Diff at Wed, 03 Apr 2024 10:10:46 GMT:

- author: maciekop (<maciej.opala@l2beat.com>)
- comparing to: main@34d9eb99e785ccac44323b84405d78f9783b5cc2 block: 19538689
- current block number: 19574554

## Description

Rediscovery with new field added (upgradeability.threshold)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19538689 (main branch discovery), not current.

```diff
    contract AdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x48387c3e14cc391fc0d151576e0a384601cfacae

# Diff at Tue, 26 Mar 2024 16:10:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4e8ac43fb779e7ec6cf93295564b2550a80d90ad block: 19319390
- current block number: 19519696

## Description

This is an implementation upgrade that adds the ability to use blobs for data submission and deprecates the ability to finalize uncompressed blocks among smaller changes.

### LineaRollup

Main addition here is the submitBlobData() function and its dependencies related to kzg commitment / point evaluation.
Compressed blocks can still be finalized without proof.

### ZkEvmV2

The function for finalizing uncompressed blocks has been removed.

### PlonkVerifierForDataAggregation updated

The new verifier is the same as 0xfB0C26A89833762b65098dD66b6Ae04b34D153be but with 4 changed constants: VK_QL_COM_X, VK_QL_COM_Y, VK_QK_COM_X, VK_QK_COM_Y.
The old one was removed from the zkEVM contract. (proof type 0)

### Removed libraries

TransactionDecoder, Rlp and codec libraries have been removed due to being related to raw transaction decoding when finalizing uncompressed blocks.

## Watched changes

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
    +++ description: None
      upgradeability.implementation:
-        "0xAA4b3a9515c921996Abe7930bF75Eff7466a4457"
+        "0x934Dd4C63E285551CEceF8459103554D0096c179"
      implementations.0:
-        "0xAA4b3a9515c921996Abe7930bF75Eff7466a4457"
+        "0x934Dd4C63E285551CEceF8459103554D0096c179"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.1:
-        "0x1111111111111111111111111111111111111111"
+        "0x8AB455030E1Ea718e445f423Bb8D993dcAd24Cc4"
+++ description: Mapping of proof type to ZK Plonk Verifier contract
      values.verifiers.0:
-        "0xfB0C26A89833762b65098dD66b6Ae04b34D153be"
+        "0x1111111111111111111111111111111111111111"
      values.GENESIS_SHNARF:
+        "0x4f64fe1ce613546d34d666d8258c13c6296820fd13114d784203feb91276e838"
    }
```

```diff
-   Status: DELETED
    contract PlonkVerifierForDataAggregation (0xfB0C26A89833762b65098dD66b6Ae04b34D153be)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierForMultiTypeDataAggregation (0x8AB455030E1Ea718e445f423Bb8D993dcAd24Cc4)
    +++ description: None
```

## Source code changes

```diff
.../meta.txt => /dev/null                          |   2 -
 .../PlonkVerifierForMultiTypeDataAggregation.sol}  |  12 +-
 .../meta.txt                                       |   2 +
 .../access/AccessControlUpgradeable.sol            |  12 +-
 .../security/ReentrancyGuardUpgradeable.sol        |   2 +-
 .../utils/ContextUpgradeable.sol                   |   8 +-
 .../utils/introspection/ERC165Upgradeable.sol      |   2 +-
 .../zkEVM/implementation/contracts/LineaRollup.sol | 288 +++++++++++++------
 .../zkEVM/implementation/contracts/ZkEvmV2.sol     | 188 +-----------
 .../contracts/interfaces/IGenericErrors.sol        |   2 +-
 .../contracts/interfaces/IMessageService.sol       |  16 +-
 .../contracts/interfaces/IPauseManager.sol         |  22 +-
 .../contracts/interfaces/IRateLimiter.sol          |  47 +--
 .../contracts/interfaces/l1/IL1MessageManager.sol  |  16 +-
 .../interfaces/l1/IL1MessageManagerV1.sol          |  10 +-
 .../contracts/interfaces/l1/IL1MessageService.sol  |  45 ++-
 .../contracts/interfaces/l1/ILineaRollup.sol       |  99 ++++++-
 .../contracts/interfaces/l1/IPlonkVerifier.sol     |   2 +-
 .../contracts/interfaces/l1/IZkEvmV2.sol           |  69 +----
 .../zkEVM/implementation/contracts/lib/Utils.sol   |   2 +-
 .../messageService/l1/L1MessageManager.sol         |   5 +-
 .../messageService/l1/L1MessageService.sol         |  33 +--
 .../messageService/l1/v1/L1MessageManagerV1.sol    |  49 +---
 .../messageService/l1/v1/L1MessageServiceV1.sol    |   7 +-
 .../messageService/lib/Codec.sol => /dev/null      |  28 --
 .../contracts/messageService/lib/PauseManager.sol  |   6 +-
 .../contracts/messageService/lib/RateLimiter.sol   |  12 +-
 .../messageService/lib/Rlp.sol => /dev/null        | 319 ---------------------
 .../lib/SparseMerkleTreeVerifier.sol               |   2 +-
 .../lib/TransactionDecoder.sol => /dev/null        |  94 ------
 .../zkEVM/implementation/meta.txt                  |   2 +-
 31 files changed, 457 insertions(+), 946 deletions(-)
```

Generated with discovered.json: 0xf601728a00dd36fda7e9e790618e91b1f1b4b7a2

# Diff at Tue, 27 Feb 2024 14:09:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@adf489177dd1f77aeea97ae8680a742bc6aec337 block: 19226416
- current block number: 19319390

## Description

Deleted two verifiers at `proofType = [6, 7]`. Both of them are identical and
only differ in the intial setup parameters.

## Watched changes

```diff
-   Status: DELETED
    contract PlonkVerifierFullLarge (0x2eDEa64BB8b45Fd87c05dC89286f1a60F4f4BEE0) {
    }
```

```diff
-   Status: DELETED
    contract PlonkVerifierFull (0x6312E56c17e1011dD0821558034a77BB60D06e1B) {
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
      values.verifiers.7:
-        "0x2eDEa64BB8b45Fd87c05dC89286f1a60F4f4BEE0"
+        "0x1111111111111111111111111111111111111111"
      values.verifiers.6:
-        "0x6312E56c17e1011dD0821558034a77BB60D06e1B"
+        "0x1111111111111111111111111111111111111111"
    }
```

## Source code changes

```diff
.../verifiers/PlonkVerifierFull.sol => /dev/null   | 1337 --------------------
 .../PlonkVerifierFull/meta.txt => /dev/null        |    2 -
 .../PlonkVerifierFullLarge.sol => /dev/null        | 1337 --------------------
 .../PlonkVerifierFullLarge/meta.txt => /dev/null   |    2 -
 4 files changed, 2678 deletions(-)
```

Generated with discovered.json: 0xe1b854d9d1e0fdb4f36dc514fe720231b67a1c02

# Diff at Wed, 14 Feb 2024 13:10:31 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c9d75a79ee568ba0a609342a536c18c36c61cf35 block: 19012997
- current block number: 19226416

## Description

Major upgrade. Mainly related to reducing fees with compression and aggregated proofs.

### ZkEvmV2

It's now inherited by the LineaRollup contract. The `setVerifierAddress` function has been moved to LineaRollup. The pause system has been tweaked but it's equivalent.
It's still possible to finalize blocks without proofs.

### LineaRollup

A VERIFIER_SETTER_ROLE is introduced that can call the `setVerifierAddress` function. Data and proof submission are now two separate steps.
Compressed data is posted using the `submitData` function and proofs are submitted with the `finalizeCompressedBlocksWithProofs` or `finalizeCompressedBlocksWithoutProof`.

### L1MessageManager

Inherited by LineaRollup. It has been renamed to L1MessageManagerV1 without big changes and it's now inherited by the new L1MessageManager. It mainly contains helper functions.

### L1MessageService

Inherited by LineaRollup. It has been renamed to L1MessageServiceV1 without big changes and it's now inherited by the new L1MessageService. It mainly contains helper functions.

Claiming messages now requires a Merkle proof. Previously, individual hashes for each message were saved but now they are aggregated.

## Watched changes

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
      upgradeability.implementation:
-        "0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3"
+        "0xAA4b3a9515c921996Abe7930bF75Eff7466a4457"
      implementations.0:
-        "0xb32c3D0dDb0063FfB15E8a50b40cC62230D820B3"
+        "0xAA4b3a9515c921996Abe7930bF75Eff7466a4457"
      values.accessControl.OPERATOR_ROLE.members[1]:
+        "0xa9268341831eFa4937537bc3e9EB36DbecE83C7e"
      values.accessControl.VERIFIER_SETTER_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xd6B95c960779c72B8C6752119849318E5d550574"]}
      values.GENERAL_PAUSE_TYPE:
-        "0x06193bb948d6b7a6fcbe51c193ccf2183bb5d979b6ae5d3a6971b8851461d3b0"
+        1
      values.L1_L2_PAUSE_TYPE:
-        "0x9a80e24e463f00a8763c4dcec6a92d07d33272fa5db895d8589be70dccb002df"
+        2
      values.L2_L1_PAUSE_TYPE:
-        "0x21ea2f4fee4bcb623de15ac222ea5c1464307d884f23394b78ddc07f9c9c7cd8"
+        3
      values.PROVING_SYSTEM_PAUSE_TYPE:
-        "0x3a56b1bd788a764cbd923badb6d0719f21f520455285bf6877e636d08708878d"
+        4
      values.verifiers.0:
-        "0x1111111111111111111111111111111111111111"
+        "0xfB0C26A89833762b65098dD66b6Ae04b34D153be"
      values.provenCompressedBlocksWithoutProof:
+        [2242752]
      values.provenNonCompressedBlocksWithoutProof:
+        []
      values.systemMigrationBlock:
+        19219000
      values.VERIFIER_SETTER_ROLE:
+        "0x32937fd5162e282df7e9a14a5073a2425321c7966eaf70ed6c838a1006d84c4c"
      errors:
-        {"provenCompressedBlocksWithoutProof":"Cannot find a matching event for DataFinalized","provenNonCompressedBlocksWithoutProof":"Cannot find a matching event for BlockFinalized"}
      derivedName:
-        "ZkEvmV2"
+        "LineaRollup"
    }
```

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
      values.roles.roles.1.functions.0xd19d4B5d358258f05D7B411E21A1460D11B0876F.pauseByType(bytes32):
-        {"options":"None","wildcarded":true,"parameters":[]}
      values.roles.roles.1.functions.0xd19d4B5d358258f05D7B411E21A1460D11B0876F.pauseByType(uint8):
+        {"options":"None","wildcarded":true,"parameters":[]}
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierForDataAggregation (0xfB0C26A89833762b65098dD66b6Ae04b34D153be) {
    }
```

## Source code changes

```diff
.../PlonkVerifierForDataAggregation.sol            | 1365 ++++++++++++++++++++
 .../.code/PlonkVerifierForDataAggregation/meta.txt |    2 +
 .../contracts/utils/structs/BitMaps.sol            |   51 +
 .../zkEVM/implementation/contracts/LineaRollup.sol |  438 +++++++
 .../zkEVM/implementation/contracts/ZkEvmV2.sol     |  156 +--
 .../contracts/interfaces/IGenericErrors.sol        |    7 +-
 .../contracts/interfaces/IMessageService.sol       |   16 +-
 .../contracts/interfaces/IPauseManager.sol         |   15 +-
 .../contracts/interfaces/IRateLimiter.sol          |   14 +-
 .../contracts/interfaces/l1/IL1MessageManager.sol  |   45 +
 .../interfaces/l1/IL1MessageManagerV1.sol}         |   16 +-
 .../contracts/interfaces/l1/IL1MessageService.sol  |   59 +
 .../contracts/interfaces/l1/ILineaRollup.sol       |  229 ++++
 .../contracts/interfaces/l1}/IPlonkVerifier.sol    |    5 +-
 .../contracts/interfaces/l1}/IZkEvmV2.sol          |   56 +-
 .../zkEVM/implementation/contracts/lib/Utils.sol   |   18 +
 .../messageService/l1/L1MessageManager.sol         |  133 +-
 .../messageService/l1/L1MessageService.sol         |  204 ++-
 .../messageService/l1/v1/L1MessageManagerV1.sol    |   94 ++
 .../messageService/l1/v1/L1MessageServiceV1.sol    |  138 ++
 .../contracts/messageService/lib/Codec.sol         |    8 +-
 .../contracts/messageService/lib/PauseManager.sol  |   91 +-
 .../contracts/messageService/lib/RateLimiter.sol   |   17 +-
 .../contracts/messageService/lib/Rlp.sol           |    5 +-
 .../lib/SparseMerkleTreeVerifier.sol               |   47 +
 .../messageService/lib/TransactionDecoder.sol      |   13 +-
 .../zkEVM/implementation/meta.txt                  |    4 +-
 27 files changed, 2829 insertions(+), 417 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19012997 (main branch discovery), not current.

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
      errors:
+        {"provenCompressedBlocksWithoutProof":"Cannot find a matching event for DataFinalized","provenNonCompressedBlocksWithoutProof":"Cannot find a matching event for BlockFinalized"}
    }
```

Generated with discovered.json: 0xf96825b03558d1edcc98e9c0f78df07f66bd73a2

# Diff at Mon, 15 Jan 2024 14:53:19 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@51b4576752b780b70ed977cf2d54041a7eb81039 block: 18618865
- current block number: 19012997

## Description

New role has been configured (`1`).
One and only member has been assigned (`0x453B3A4b4d64B4E6f472A306c3D4Fc318C34bbA8`).

Assigned member can now invoke:

- `pauseByType(bytes32)` on ZkEVM/MessageService (`0xd19d4B5d358258f05D7B411E21A1460D11B0876F`)
- `pause()` on ERC20Bridge (`0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319`)
- `pause()` on USDCBridge (`0x504A330327A089d8364C4ab3811Ee26976d388ce`)

## The member of this role can now invoke

## Watched changes

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
      upgradeability.modules[0]:
+        "0x453B3A4b4d64B4E6f472A306c3D4Fc318C34bbA8"
      values.roles.roles.1:
+        {"members":{"0x453B3A4b4d64B4E6f472A306c3D4Fc318C34bbA8":true},"targets":{"0xd19d4B5d358258f05D7B411E21A1460D11B0876F":{"clearance":"Function","options":"None"},"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319":{"clearance":"Function","options":"None"},"0x504A330327A089d8364C4ab3811Ee26976d388ce":{"clearance":"Function","options":"None"}},"functions":{"0xd19d4B5d358258f05D7B411E21A1460D11B0876F":{"pauseByType(bytes32)":{"options":"None","wildcarded":true,"parameters":[]}},"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319":{"pause()":{"options":"None","wildcarded":true,"parameters":[]}},"0x504A330327A089d8364C4ab3811Ee26976d388ce":{"pause()":{"options":"None","wildcarded":true,"parameters":[]}}},"compValues":{},"compValuesOneOf":{}}
    }
```

# Diff at Thu, 23 Nov 2023 15:07:23 GMT

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2ff45714640abe4c50d283967078888d4af81d78

## Description

Added a new module to the AdminMultisig called Roles. The owner of this module
(the AdminMultisig itself) can grant or remove access to given targets (whole
contracts) or just a certain function in a given contract per role. The module
checks if the message sender has a given role and checks if the role is allowed
to execute a given operation. This whole module seems like it solves the same
issue as AccessControl but with more granularity just like the extended
AccessControl in Scroll.

## Watched changes

```diff
    contract AdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
      upgradeability.modules[0]:
+        "0xF24f1DC519d88246809B660eb56D94048575d083"
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
      values.limitInWei:
-        "6250000000000000000000"
+        "18750000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761) {
    }
```

```diff
+   Status: CREATED
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    }
```

## Source code changes

```diff
.../linea/ethereum/.code/MultiSend/MultiSend.sol   |  66 ++
 .../linea/ethereum/.code/MultiSend/meta.txt        |   2 +
 .../safe-contracts/contracts/common/Enum.sol       |   8 +
 .../contracts/interfaces/IERC165.sol               |  15 +
 .../@gnosis.pm/zodiac/contracts/core/Modifier.sol  | 134 +++
 .../@gnosis.pm/zodiac/contracts/core/Module.sol    | 116 +++
 .../zodiac/contracts/factory/FactoryFriendly.sol   |  10 +
 .../zodiac/contracts/guard/BaseGuard.sol           |  38 +
 .../zodiac/contracts/guard/Guardable.sol           |  31 +
 .../zodiac/contracts/interfaces/IAvatar.sol        |  66 ++
 .../zodiac/contracts/interfaces/IGuard.sol         |  22 +
 .../access/OwnableUpgradeable.sol                  |  78 ++
 .../proxy/utils/Initializable.sol                  |  46 +
 .../utils/ContextUpgradeable.sol                   |  31 +
 .../ethereum/.code/Roles/contracts/Permissions.sol | 984 +++++++++++++++++++++
 .../linea/ethereum/.code/Roles/contracts/Roles.sol | 406 +++++++++
 .../linea/ethereum/.code/Roles/meta.txt            |   2 +
 17 files changed, 2055 insertions(+)
```

# Diff at Mon, 16 Oct 2023 07:14:10 GMT

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a2d21b0282f36d2369596c2fe3bb3e7746063abe

## Description

Unused verifier contracts are set to 0x111. The reason is that every position in the array corresponds to a proof type, therefore when a new proof type is introduced, a new verifier is added, and when a proof type is removed, the corresponding verifier is set to 0x111. My guess on why it is set to 0x111 and not 0x0 is that it allows to throw a different error in the verifier contract (deprecated proof), which is more informative than the error thrown when the verifier is not found (out of bounds).

## Watched changes

```diff
-   Status: DELETED
    contract PlonkVerifierFullLarge (0xa4F1155202D36348097b7488b0D2365fA91f8CaC) {
    }
```

```diff
-   Status: DELETED
    contract PlonkVerifierFull (0xc01E6807DB9Fb9cC75E9Fe622ba8e7f3eB9f2B32) {
    }
```

```diff
-   Status: DELETED
    contract PlonkVerifierFull2 (0xC84832f69bFFbC1A94E44a157A342766E959ED27) {
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
      values.verifiers[9]:
+        "0x0000000000000000000000000000000000000000"
      values.verifiers[8]:
+        "0x0000000000000000000000000000000000000000"
      values.verifiers[7]:
+        "0x2eDEa64BB8b45Fd87c05dC89286f1a60F4f4BEE0"
      values.verifiers[6]:
+        "0x6312E56c17e1011dD0821558034a77BB60D06e1B"
      values.verifiers[5]:
+        "0x0000000000000000000000000000000000000000"
      values.verifiers[4]:
+        "0x1111111111111111111111111111111111111111"
      values.verifiers.3:
-        "0xC84832f69bFFbC1A94E44a157A342766E959ED27"
+        "0x1111111111111111111111111111111111111111"
      values.verifiers.1:
-        "0xa4F1155202D36348097b7488b0D2365fA91f8CaC"
+        "0x1111111111111111111111111111111111111111"
      values.verifiers.0:
-        "0xc01E6807DB9Fb9cC75E9Fe622ba8e7f3eB9f2B32"
+        "0x1111111111111111111111111111111111111111"
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierFullLarge (0x2eDEa64BB8b45Fd87c05dC89286f1a60F4f4BEE0) {
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierFull (0x6312E56c17e1011dD0821558034a77BB60D06e1B) {
    }
```

## Source code changes

```diff
.../PlonkVerifierFull/PlonkVerifierFull.sol        | 1754 +++++++++++---------
 .../PlonkVerifierFull/Utils.sol => /dev/null       |   83 -
 .../PlonkVerifierFull/meta.txt                     |    2 +-
 .../PlonkVerifierFull.sol => /dev/null             | 1223 --------------
 .../PlonkVerifierFull2/meta.txt => /dev/null       |    2 -
 .../PlonkVerifierFullLarge.sol                     | 1154 +++++++------
 .../PlonkVerifierFullLarge/Utils.sol => /dev/null  |   83 -
 .../PlonkVerifierFullLarge/meta.txt                |    2 +-
 8 files changed, 1585 insertions(+), 2718 deletions(-)
```
