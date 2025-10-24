Generated with discovered.json: 0xca96b303a588e901da012a888fda90ac91477451

# Diff at Fri, 24 Oct 2025 09:13:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@11b074f59e0a769fa3d144569b93ef0f7ba1e44f block: 1760604460
- current timestamp: 1761220191

## Description

zk token proxy admin moved to new protocolupgradehandler l2 alias.

Config: zksync v29 upgrade.

## Watched changes

```diff
    contract EraChainAdminProxy (eth:0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: A governance proxy that lets eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828 act through it.
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.6:
+        {"_protocolVersion":124554051586,"_upgradeTimestamp":1761121800}
    }
```

```diff
    contract ZkTokenProxyAdmin (zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      values.owner:
-        "zksync:0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "zksync:0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
    }
```

```diff
    EOA ProtocolUpgradeHandler_l2Alias (zksync:0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","role":"admin","via":[{"address":"zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]}
      controlsMajorityOfUpgradePermissions:
+        true
      directlyReceivedPermissions:
+        [{"permission":"act","from":"zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC","role":".owner"}]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1760604460 (main branch discovery), not current.

```diff
    contract EraChainAdminProxy (eth:0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: A governance proxy that lets eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828 act through it.
      description:
+        "A governance proxy that lets eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828 act through it."
    }
```

```diff
    contract ProtocolUpgradeHandler (eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      directlyReceivedPermissions.2.description:
-        "set critical system contract addresses, register settlement layers, pause and unpause and manage zk chain registration."
+        "set critical contract addresses for the shared cluster, register settlement layers, pause and unpause migrations and the bridge and manage zk chain registration."
    }
```

```diff
    contract EmergencyUpgradeBoard (eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.0.description:
-        "set critical system contract addresses, register settlement layers, pause and unpause and manage zk chain registration."
+        "set critical contract addresses for the shared cluster, register settlement layers, pause and unpause migrations and the bridge and manage zk chain registration."
    }
```

```diff
    EOA  (zksync:0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      name:
-        "ProtocolUpgradeHandler_l2Alias_deprecated"
    }
```

Generated with discovered.json: 0xa54977ac3168282658040f1c7f667d67529d9167

# Diff at Thu, 16 Oct 2025 08:50:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@88fac19bbe6dc3868d941d9cb093cb5181d8344a block: 1760369926
- current timestamp: 1760604460

## Description

### ZIP-12 V29 'Interop Messaging' Upgrade
enables interop for Gateway chains, of which there is only one.

Bridgehub - https://disco.l2beat.com/diff/eth:0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32/eth:0xc89423b4909080fB8F8A43dF5E1C27001e55C24B
- move chain asset handling (for chain migrations) to a separate contract: [ChainAssetHandler](https://flat.l2beat.com/address/eth:0xaa180C70126f751C164465638770B865965A744B)
- 'precommitment' support (the gov proposal talks about preconf support in the contracts that is not supported in practice / offchain yet)
- NewValidatorTimelockPostV29, setValidatorTimelockPostV29 - new event/func for changing the VTL

ChainAssetHandler - smallish new contract handling migrations only (and migration pausing is also moved here)
https://flat.l2beat.com/address/eth:0xaa180C70126f751C164465638770B865965A744B

ProtocolUpgradeHandler - https://disco.l2beat.com/diff/eth:0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A/eth:0x36625Bd3dDB469377C6e9893712158cA3c0cC14B
- mini change: add ChainAssetHandler support

ChainTypeManager - https://disco.l2beat.com/diff/eth:0x345314c7E4af84B763d98d23f772622E23AfB5CE/eth:0x4aB7204e4205c96C32E23ADa9191720976dC084f
- minimal compatibility changes similar to Bridgehub abbove
- pre-/post v29 VTL fields

MessageRoot - https://disco.l2beat.com/diff/eth:0x382fb241396eA915108e7B7Ce1adE1322bA73aeE/eth:0x669ed5BB1377C917333e7d4223ce3419EE4099fD
- support new proofMetadata structure
- interop support for gateway

L1AssetRouter, L1Nullifier, CTMDeploymentTracker - https://disco.l2beat.com/diff/eth:0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F/eth:0x2386Bc2E26f39b72f0D4FDE0c07D68e4eEFfC725, https://disco.l2beat.com/diff/eth:0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431/eth:0x71759C4eA628293F5a99aAB1585dF1c8dA4718e0, https://disco.l2beat.com/diff/eth:0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1/eth:0x00e9d8A4b35C32880A10Feb391aDEDA0D3F90991
- minor compat changes for new ChainAssetHandler, interop

## Watched changes

```diff
    contract BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      sourceHashes.1:
-        "0x85a0337c9b2db31a1b7e623ed99509d22ead32ce301ae832247ee1240f43eccb"
+        "0x2a749098cea7b9243019ffc1193ad519dbadc55c43cf610962f7ba13beba3f21"
      values.$implementation:
-        "eth:0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32"
+        "eth:0xc89423b4909080fB8F8A43dF5E1C27001e55C24B"
      values.$pastUpgrades.6:
+        ["2025-10-15T09:09:11.000Z","0xa022a2ce09b145eb5d0c4342b3f3583e79b66ee7205ab986322be819f277ba83",["eth:0xc89423b4909080fB8F8A43dF5E1C27001e55C24B"]]
      values.$upgradeCount:
-        6
+        7
      values.migrationPaused:
-        true
+        false
      values.chainAssetHandler:
+        "eth:0xDd5CB8B9037357B4cD37391A073798f8aaB61076"
      implementationNames.eth:0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32:
-        "Bridgehub"
      implementationNames.eth:0xc89423b4909080fB8F8A43dF5E1C27001e55C24B:
+        "Bridgehub"
    }
```

```diff
    contract MessageRoot (eth:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      sourceHashes.1:
-        "0x9fe7372b4f7ead74634ad13ce858c9a6242995f2a40facaa212e524a02b506a2"
+        "0x515c1999e39bdd6435caf0c49791fcb515fb14c69a02e55dac0ff893f07bc6fe"
      values.$implementation:
-        "eth:0x382fb241396eA915108e7B7Ce1adE1322bA73aeE"
+        "eth:0x669ed5BB1377C917333e7d4223ce3419EE4099fD"
      values.$pastUpgrades.2:
+        ["2025-10-15T09:09:11.000Z","0xa022a2ce09b145eb5d0c4342b3f3583e79b66ee7205ab986322be819f277ba83",["eth:0x669ed5BB1377C917333e7d4223ce3419EE4099fD"]]
      values.$upgradeCount:
-        2
+        3
      values.L1_CHAIN_ID:
+        1
      implementationNames.eth:0x382fb241396eA915108e7B7Ce1adE1322bA73aeE:
-        "MessageRoot"
      implementationNames.eth:0x669ed5BB1377C917333e7d4223ce3419EE4099fD:
+        "MessageRoot"
    }
```

```diff
    contract CTMDeploymentTracker (eth:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860) {
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
      sourceHashes.1:
-        "0xb55fe571d010f5a5fa7f06d0aa6602a1a6b406ed8c3163fb400b0f6a947a4bba"
+        "0xfd2eb86126d27fd1027643f37fdf17726d5043abf02f5a0d31f4337a5c400ea5"
      values.$implementation:
-        "eth:0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1"
+        "eth:0x00e9d8A4b35C32880A10Feb391aDEDA0D3F90991"
      values.$pastUpgrades.1:
+        ["2025-10-15T09:09:11.000Z","0xa022a2ce09b145eb5d0c4342b3f3583e79b66ee7205ab986322be819f277ba83",["eth:0x00e9d8A4b35C32880A10Feb391aDEDA0D3F90991"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.eth:0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1:
-        "CTMDeploymentTracker"
      implementationNames.eth:0x00e9d8A4b35C32880A10Feb391aDEDA0D3F90991:
+        "CTMDeploymentTracker"
    }
```

```diff
-   Status: DELETED
    contract L1GenesisUpgrade (eth:0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
    contract L1AssetRouter (eth:0x8829AD80E425C646DAB305381ff105169FeEcE56) {
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
      sourceHashes.1:
-        "0xba83b7c168ffa78d2e714cfb804ca1cd4f33807f6e9b2abb2820457d6d2bf77a"
+        "0x44ec209239ba609c6f52edc0357702dd6bc4ee3f43da8492e4aa658b598b0a74"
      values.$implementation:
-        "eth:0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F"
+        "eth:0x2386Bc2E26f39b72f0D4FDE0c07D68e4eEFfC725"
      values.$pastUpgrades.3:
+        ["2025-10-15T09:09:11.000Z","0xa022a2ce09b145eb5d0c4342b3f3583e79b66ee7205ab986322be819f277ba83",["eth:0x2386Bc2E26f39b72f0D4FDE0c07D68e4eEFfC725"]]
      values.$upgradeCount:
-        3
+        4
      implementationNames.eth:0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F:
-        "L1AssetRouter"
      implementationNames.eth:0x2386Bc2E26f39b72f0D4FDE0c07D68e4eEFfC725:
+        "L1AssetRouter"
    }
```

```diff
    contract L1NativeTokenVault (eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6) {
    +++ description: Canonical central asset escrow for all ZK stack chains.
      values.$implementation:
-        "eth:0xBa05B8B761386289Ba413a74AF1933d6a76E1b52"
+        "eth:0x8E1C5A8c5d8C33ed0eC756d6f4006f2D875bA083"
      values.$pastUpgrades.3:
+        ["2025-10-15T09:09:11.000Z","0xa022a2ce09b145eb5d0c4342b3f3583e79b66ee7205ab986322be819f277ba83",["eth:0x8E1C5A8c5d8C33ed0eC756d6f4006f2D875bA083"]]
      values.$upgradeCount:
-        3
+        4
      implementationNames.eth:0xBa05B8B761386289Ba413a74AF1933d6a76E1b52:
-        "L1NativeTokenVault"
      implementationNames.eth:0x8E1C5A8c5d8C33ed0eC756d6f4006f2D875bA083:
+        "L1NativeTokenVault"
    }
```

```diff
    contract ProxyAdmin (eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xDd5CB8B9037357B4cD37391A073798f8aaB61076","role":"admin"}
    }
```

```diff
    contract ChainTypeManager (eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,29,2.
      sourceHashes.1:
-        "0x5462a6c55c6e9f2d98c21f2588b2b9a4de1dc41ba0c10906f8965e21849a3a52"
+        "0xee0ad6dd34008989477a03f84eca5083a1cb79b46c01c850617d62c7b406c4ba"
      description:
-        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,1."
+        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,29,2."
      values.$implementation:
-        "eth:0x345314c7E4af84B763d98d23f772622E23AfB5CE"
+        "eth:0x4aB7204e4205c96C32E23ADa9191720976dC084f"
      values.$pastUpgrades.6:
+        ["2025-10-15T09:09:11.000Z","0xa022a2ce09b145eb5d0c4342b3f3583e79b66ee7205ab986322be819f277ba83",["eth:0x4aB7204e4205c96C32E23ADa9191720976dC084f"]]
      values.$upgradeCount:
-        6
+        7
      values.getSemverProtocolVersion.1:
-        28
+        29
      values.getSemverProtocolVersion.2:
-        1
+        2
      values.initialCutHash:
-        "0x1ba089adbb5d0a9aa3f96947db5b1fd831e17ab789f1147883d891e1e7951605"
+        "0xfe2b1933fcc0d0a6fd9758ee5c6d121081bd4580ec7d87bdf299470ed70208c5"
      values.initialForceDeploymentHash:
-        "0xed1057fbf858575d7348c4f2c82dd034534c62d97d0ac1d46f98ed197403f3d9"
+        "0xad3fb7f31b114db9c3bce490d6ff173ee5bb075efddae0bd6ed01432f5c09860"
      values.l1GenesisUpgrade:
-        "eth:0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E"
+        "eth:0x390bc10e854e137d2625573272b3fEe2C615eBA4"
      values.protocolVersion:
-        120259084289
+        124554051586
      values.storedBatchZero:
-        "0x9629612e3685846dc5056347758c0f8286fc877383c762aa17b1411758a582d8"
+        "0x4e89e7408b8a0abb45917cb07d586b1b0affca0ba4e6fd450504bdea9dd079a1"
      values.validatorTimelockPostV29:
+        "eth:0x2e5110cF18678Ec99818bFAa849B8C881744b776"
      implementationNames.eth:0x345314c7E4af84B763d98d23f772622E23AfB5CE:
-        "ChainTypeManager"
      implementationNames.eth:0x4aB7204e4205c96C32E23ADa9191720976dC084f:
+        "ChainTypeManager"
    }
```

```diff
    contract L1Nullifier (eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
      sourceHashes.1:
-        "0x56a8f9e2feec75535d897e8159a8cdf1546d81df34f77964c66bc908820e8687"
+        "0x6ea5a06371f681d6fc53ffcddfc1395a3748a7d57499d48cf32cefb035e24af0"
      values.$implementation:
-        "eth:0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431"
+        "eth:0x71759C4eA628293F5a99aAB1585dF1c8dA4718e0"
      values.$pastUpgrades.6:
+        ["2025-10-15T09:09:11.000Z","0xa022a2ce09b145eb5d0c4342b3f3583e79b66ee7205ab986322be819f277ba83",["eth:0x71759C4eA628293F5a99aAB1585dF1c8dA4718e0"]]
      values.$upgradeCount:
-        6
+        7
      implementationNames.eth:0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431:
-        "L1Nullifier"
      implementationNames.eth:0x71759C4eA628293F5a99aAB1585dF1c8dA4718e0:
+        "L1Nullifier"
    }
```

```diff
    contract ProtocolUpgradeHandler (eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      sourceHashes.1:
-        "0x12958ca399cc6a20305ec705a35cae0ee77a75afd66ee1eb5f09d3a811ca4457"
+        "0x34c46d93159964444be38043b9ec094342e281f9e5fcb7f69eef181251cfd8e1"
      values.$implementation:
-        "eth:0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A"
+        "eth:0x36625Bd3dDB469377C6e9893712158cA3c0cC14B"
      values.$pastUpgrades.2:
+        ["2025-10-15T09:11:11.000Z","0x2309df20dd1cb3f3a3289e97517d10d399989292f966578240ec387246a13e61",["eth:0x36625Bd3dDB469377C6e9893712158cA3c0cC14B"]]
      values.$upgradeCount:
-        2
+        3
      values.CHAIN_ASSET_HANDLER:
+        "eth:0xDd5CB8B9037357B4cD37391A073798f8aaB61076"
      implementationNames.eth:0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A:
-        "ProtocolUpgradeHandler"
      implementationNames.eth:0x36625Bd3dDB469377C6e9893712158cA3c0cC14B:
+        "ProtocolUpgradeHandler"
      directlyReceivedPermissions.6:
+        {"permission":"interact","from":"eth:0xDd5CB8B9037357B4cD37391A073798f8aaB61076","description":"pause, resume chain migrations.","role":".owner"}
    }
```

```diff
    contract RollupDAManager (eth:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45) {
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
+++ severity: HIGH
      values.daPairs.3:
+        {"l1DAValidator":"eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119","l2DAValidator":"eth:0x177aB33Cf2EAce3d03318d59CBFE955aFEf2326A","status":true}
    }
```

```diff
    contract EmergencyUpgradeBoard (eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0xDd5CB8B9037357B4cD37391A073798f8aaB61076","description":"pause, resume chain migrations.","role":".owner","via":[{"address":"eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0xDd5CB8B9037357B4cD37391A073798f8aaB61076","role":"admin","via":[{"address":"eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
    }
```

```diff
    contract ZkTokenGovernor (zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalCreatedCount:
-        10
+        12
    }
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (eth:0x390bc10e854e137d2625573272b3fEe2C615eBA4)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
+   Status: CREATED
    contract ChainAssetHandler (eth:0xDd5CB8B9037357B4cD37391A073798f8aaB61076)
    +++ description: Specialized contract for managing chain assets, i.e. chain migrations.
```

## Source code changes

```diff
.../BridgeHub/Bridgehub.sol                        |  340 ++--
 .../CTMDeploymentTracker/CTMDeploymentTracker.sol  |   24 +-
 .../.flat/ChainAssetHandler/ChainAssetHandler.sol  | 1887 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  729 ++++++++
 .../ChainTypeManager/ChainTypeManager.sol          |   74 +-
 .../L1AssetRouter/L1AssetRouter.sol                |    4 +
 .../L1GenesisUpgrade.sol                           |   34 +-
 .../L1Nullifier/L1Nullifier.sol                    |    2 +-
 .../MessageRoot/MessageRoot.sol                    |  291 ++-
 .../ProtocolUpgradeHandler.sol                     |   10 +-
 10 files changed, 3106 insertions(+), 289 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1760369926 (main branch discovery), not current.

```diff
    contract BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      values.migrations:
-        [{"chainId":324,"assetId":"0x4322964cbd328346d5f59803d2974742a54a69e59fd8b8d4ca5c64773646bf7a","settlementLayerChainId":9075}]
      fieldMeta.migrationPaused:
-        {"severity":"HIGH","description":"If false, chains can migrate to whitelisted settlement layers."}
      fieldMeta.migrations:
-        {"severity":"HIGH","description":"zk chain migrations that were started"}
    }
```

Generated with discovered.json: 0x9dfa3ca69ccb7f5da4ce2109adc02dc752c34bc6

# Diff at Mon, 13 Oct 2025 15:39:54 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@51600557d780ac92375cfae390fda922b972fb85 block: 1759847246
- current timestamp: 1760369926

## Description

Queued this proposal: https://www.tally.xyz/gov/zksync/proposal/15539336001504922041482045464843306651217071205321499428543388348391561812720?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746.

Also started executing this proposal: https://www.tally.xyz/gov/zksync/proposal/40562439712311128665286075271414168289029475306445402072499591795343687723101?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f, which paused migrations. Note that only 1 out of 3 upgrade transactions were submitted on L1 (https://tools.l2beat.com/decoder-new/?hash=0x633f744ab8ceebcd8454fa3e10b9db8cf9e20250be28b38734060b2c985a8424).

## Watched changes

```diff
    contract BridgeHub (eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stmores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: If false, chains can migrate to whitelisted settlement layers.
+++ severity: HIGH
      values.migrationPaused:
-        false
+        true
    }
```

```diff
    contract ZkTokenGovernor (zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        7
+        8
    }
```

Generated with discovered.json: 0xb1223811c0458c0113ca44d28d27e0531791d19b

# Diff at Tue, 07 Oct 2025 14:28:34 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@8565ff097fc0a7fe0355555b648b1799518c8f35 block: 1759744123
- current timestamp: 1759847246

## Description

Queued and executed ZIP-12 and ZIP-13 proposals.

## Watched changes

```diff
    contract ZkProtocolGovernor (zksync:0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        11
+        13
    }
```

Generated with discovered.json: 0x0a40d07f265768926a7ac4028f190e00d8154cbc

# Diff at Mon, 06 Oct 2025 09:49:49 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@af10d4e90bc0f1be21a0242f8327fccf9a01f37a block: 1759398765
- current timestamp: 1759744123

## Description

New minter for ZK token according to https://www.tally.xyz/gov/zksync/proposal/3413588788305073197878658504162606756015331882899383310343250085297198101137?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746.

## Watched changes

```diff
    contract ZkToken (zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.14:
+        "zksync:0xF13374240dCf45783e510537d98dE1C6Ca522238"
    }
```

Generated with discovered.json: 0x82eff06f03c4622579a954b2b55b12ba0e1ad738

# Diff at Thu, 02 Oct 2025 09:53:53 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@b23cca5eaec9eb1fac489dca92defc845d56598a block: 1758619329
- current timestamp: 1759398765

## Description

Queued two proposals to be executed: https://www.tally.xyz/gov/zksync/proposal/19993014537746296636853362219247192671631735482612670856590540039176244970638?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746 and https://www.tally.xyz/gov/zksync/proposal/3413588788305073197878658504162606756015331882899383310343250085297198101137?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746.

Also changed config for ZkGovernor template: fixed proposalCreatedCount topic0 from 0xc149c905df4285aaa5aec8b4d3e8532039469e916660b4fc66767e151b8b26e8 to 0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0.

## Watched changes

```diff
    contract ZkProtocolGovernor (zksync:0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalCreatedCount:
-        12
+        14
    }
```

```diff
    contract ZkTokenGovernor (zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalCreatedCount:
-        9
+        10
      values.proposalQueuedCount:
-        5
+        7
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758619329 (main branch discovery), not current.

```diff
    contract ZkProtocolGovernor (zksync:0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalCreatedCount:
-        0
+        12
    }
```

```diff
    contract ZkTokenGovernor (zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalCreatedCount:
-        0
+        9
    }
```

```diff
    contract ZkGovOpsGovernor (zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalCreatedCount:
-        0
+        1
    }
```

Generated with discovered.json: 0x44295be5336c23a39201faab5676248067e0969f

# Diff at Tue, 23 Sep 2025 09:24:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9a796f3fca0d6345ed73136526bf67003edbb829 block: 1756817344
- current timestamp: 1758619329

## Description

sub-ms member change.

## Watched changes

```diff
    contract GnosisSafe (eth:0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      values.$members.3:
-        "eth:0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
+        "eth:0xB438667fea1cE20951430A68731F73f55D93D678"
    }
```

Generated with discovered.json: 0xce999d69d77eef5fcbda66530697b17ba1f17bba

# Diff at Tue, 02 Sep 2025 12:50:16 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@5c76cd9f009fe74629d27e4a1456e2856a34b3d4 block: 1755850298
- current timestamp: 1756817344

## Description

Added a new ZK token minter according to this proposal: https://www.tally.xyz/gov/zksync/proposal/14920227315823844313255249182525601975564035647349569740836448589354658768084?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746.

## Watched changes

```diff
    contract ZkToken (zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.2:
-        "zksync:0x21b27952f8621f54f3CB652630E122Ec81dd2dc1"
      values.accessControl.MINTER_ROLE.members.13:
+        "zksync:0x767bA4A501BBc0CfCF78733F471b209AaF9381dD"
    }
```

```diff
    contract ZkTokenGovernor (zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        4
+        5
    }
```

Generated with discovered.json: 0xf5c13787632f3ad2f9ca22ae22152e0e324d5bf0

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xdcf699d8b4eb92fb8d0630a8412e7a32042edba5

# Diff at Fri, 22 Aug 2025 08:12:51 GMT:

- chain: zksync2
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@3d329dea47533f39a2d068e0d1659b75a5fa8cef block: 1755599698
- current timestamp: 1755850298

## Description

Added a new minter to ZK token, as approved by this governance proposal: https://www.tally.xyz/gov/zksync/proposal/38542076628472360665761284306860773162167153028104855759973536253827423667325?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746.

## Watched changes

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.13:
+        "zksync:0xcfA355a6678a38c401B89bF44C6f98AF5a98572B"
    }
```

Generated with discovered.json: 0x87696c25baaddea3f1e0e454ef878abf51558206

# Diff at Tue, 19 Aug 2025 10:35:10 GMT:

- chain: zksync2
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@e55d710ea6abb9c86ba4da7b9086061648f68fba block: 1754120227
- current timestamp: 1755599698

## Description

Added a proposal to grant 0xcfA355a6678a38c401B89bF44C6f98AF5a98572B address a minter role on ZK token. (https://www.tally.xyz/gov/zksync/proposal/38542076628472360665761284306860773162167153028104855759973536253827423667325?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746)

## Watched changes

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        3
+        4
    }
```

Generated with discovered.json: 0x2b178eb655ad01f4f83593d247b74722c858db49

# Diff at Sat, 02 Aug 2025 07:37:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3d59e2b466fd3c111ff4d5621a7f80de65b0b3d5 block: 1754054035
- current timestamp: 1754120227

## Description

Emergency upgrade to [protocol version v28.1](https://app.blocksec.com/explorer/tx/eth/0x3c27a371dbd4f6b0d97a87f950065eb48db3c51ae4e962d1b6b4d4e32d2fbdb1), which only affects the verifiers and is only activated for zksync era and gateway so far.

diff fflonk: https://disco.l2beat.com/diff/eth:0xD5dBE903F5382B052317D326FA1a7B63710C6a5b/eth:0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911
diff plonk: https://disco.l2beat.com/diff/eth:0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1/eth:0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6

## Watched changes

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.5:
+        {"_protocolVersion":120259084289,"_upgradeTimestamp":0}
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,1.
      description:
-        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0."
+        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,1."
      values.getSemverProtocolVersion.2:
-        0
+        1
      values.initialCutHash:
-        "0xf5e92e1f82b7dcec41aad4bfbbd238b89380f311b2b65956d2073f59b4f9a58f"
+        "0x1ba089adbb5d0a9aa3f96947db5b1fd831e17ab789f1147883d891e1e7951605"
      values.protocolVersion:
-        120259084288
+        120259084289
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
+++ severity: HIGH
      values.emergencyUpgradesExecuted.2:
+        "0x9566d2c3ede4eb9a53f71f5f94bdf0e07db77ed92e421f399868d1db1a5622c6"
+++ severity: HIGH
      values.emergencyUpgradesExecuted.3:
+        "0x820d3989346828f564c6322b3b47631996ea66f7a826213d95ad69ded62adcdc"
+++ severity: HIGH
      values.emergencyUpgradesExecuted.4:
+        "0x8902737c0457ffdc1623387ed17201ccd6184b4cfef9c62dd5f00208e4b6e563"
    }
```

Generated with discovered.json: 0x522c3b43535b57b00203156a51ed4d99ddf5c2df

# Diff at Fri, 01 Aug 2025 13:14:11 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@802242fc2209399893865092b1048d583aafc2bb block: 1753944518
- current timestamp: 1754054035

## Description

Minter added([TPP](https://www.tally.xyz/gov/zksync/proposal/103009526770705342015760257902601847378333885610277726776315709127806766289886?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746)).

## Watched changes

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.12:
+        "zksync:0x496c401f5764D137a448C991D95B10125375AC08"
    }
```

Generated with discovered.json: 0x76f6cbb0e4e49c26ab996406ebdffd2dd6b9cedc

# Diff at Thu, 31 Jul 2025 10:24:44 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fc6aee0100bcf523dbfb20b1884ed98a8717207a block: 1753346675
- current timestamp: 1753944518

## Description

Changes are config related, ignore (an earlier config resolved incorrect permissions).

## Watched changes

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        2
+        3
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753346675 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89)
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
```

```diff
-   Status: DELETED
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
```

```diff
-   Status: DELETED
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
-   Status: DELETED
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb)
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.4:
-        {"permission":"interact","from":"zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"cancel queued transactions.","role":".Canceller"}
      receivedPermissions.5:
-        {"permission":"interact","from":"zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"execute transactions that are ready.","role":".Executor"}
      receivedPermissions.6:
-        {"permission":"interact","from":"zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"manage all access control roles and change the minimum delay.","role":".timelockAdminAC","via":[{"address":"zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}]}
      receivedPermissions.7:
-        {"permission":"interact","from":"zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions.","role":".Proposer"}
      directlyReceivedPermissions.1:
-        {"permission":"act","from":"zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","role":".Executor"}
    }
```

```diff
-   Status: DELETED
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

Generated with discovered.json: 0x6495479a11641512f68f8ce436eca328ec0a6122

# Diff at Thu, 31 Jul 2025 10:24:44 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fc6aee0100bcf523dbfb20b1884ed98a8717207a block: 1753346675
- current timestamp: 1753944518

## Description

Era migrates to the Gateway! permissions stay the same and diagrams remain correct.

config: renamed EraAdminProxy to EraChainAdminProxy to be consistent with the text and diagram.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: zk chain migrations that were started
+++ severity: HIGH
      values.migrations.0:
+        {"chainId":324,"assetId":"0x4322964cbd328346d5f59803d2974742a54a69e59fd8b8d4ca5c64773646bf7a","settlementLayerChainId":9075}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753346675 (main branch discovery), not current.

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      name:
-        "EraAdminProxy"
+        "EraChainAdminProxy"
    }
```

Generated with discovered.json: 0xdb7bde267cb7e911b8659c2102fc13b37e1399c9

# Diff at Wed, 30 Jul 2025 09:12:42 GMT:

- chain: gateway
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current timestamp: 1753346675

## Description

Discovery rerun on the same block number with only config-related changes.

Generated with discovered.json: 0xb3a9b1f7871727dcd32d8fa65577ba180373643b

# Diff at Thu, 24 Jul 2025 08:45:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e68e856ed444c9f5c0e702b0c18473a575f2e74a block: 22779828
- current block number: 22987909

## Description

ms signer change.

## Watched changes

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      values.$members.2:
-        "eth:0x8A23548a640De1137e58e2D9600e1c5913E3D674"
+        "eth:0x5C7E59Dba6557C7dAB3B69ccd3E309d1965Cf1B1"
    }
```

Generated with discovered.json: 0x32a53c40ad4ad5dfa11742e92c57427f5f2fefe5

# Diff at Mon, 14 Jul 2025 12:47:17 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 61100811
- current block number: 61100811

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 61100811 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      address:
-        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.Canceller.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.Executor.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.Proposer.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.timelockAdminAC.0:
-        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      implementationNames.0x085b8B6407f150D62adB1EF926F7f304600ec714:
-        "TimelockController"
      implementationNames.zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714:
+        "TimelockController"
    }
```

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      address:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      description:
-        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
      values.eip712Domain.verifyingContract:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      values.PROPOSE_GUARDIAN:
-        "0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D"
+        "zksync:0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D"
      values.timelock:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      values.token:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      values.VETO_GUARDIAN:
-        "0xe788e09324F8bb3cc64f009973693f751C33b999"
+        "zksync:0xe788e09324F8bb3cc64f009973693f751C33b999"
      implementationNames.0x10560f8B7eE37571AD7E3702EEb12Bc422036E89:
-        "ZkTokenGovernor"
      implementationNames.zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89:
+        "ZkTokenGovernor"
    }
```

```diff
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      address:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.Canceller.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.Executor.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.Proposer.0:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.timelockAdminAC.0:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      implementationNames.0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8:
-        "TimelockController"
      implementationNames.zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8:
+        "TimelockController"
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      address:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      values.Canceller.0:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      values.Executor.0:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      values.Proposer.0:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "zksync:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      values.timelockAdminAC.0:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      implementationNames.0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6:
-        "TimelockController"
      implementationNames.zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6:
+        "TimelockController"
    }
```

```diff
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      address:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      description:
-        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
      values.eip712Domain.verifyingContract:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      values.timelock:
-        "0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      values.token:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      values.VETO_GUARDIAN:
-        "0xe788e09324F8bb3cc64f009973693f751C33b999"
+        "zksync:0xe788e09324F8bb3cc64f009973693f751C33b999"
      implementationNames.0x496869a7575A1f907D1C5B1eca28e4e9E382afAb:
-        "ZkGovOpsGovernor"
      implementationNames.zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb:
+        "ZkGovOpsGovernor"
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      address:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      values.$admin:
-        "0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
      values.$implementation:
-        "0x01a6715d3560241E09E865a46122bf347A576c09"
+        "zksync:0x01a6715d3560241E09E865a46122bf347A576c09"
      values.$pastUpgrades.0.2.0:
-        "0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"
+        "zksync:0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"
      values.$pastUpgrades.1.2.0:
-        "0x01a6715d3560241E09E865a46122bf347A576c09"
+        "zksync:0x01a6715d3560241E09E865a46122bf347A576c09"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
+        "zksync:0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      values.accessControl.MINTER_ADMIN_ROLE.members.0:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.0:
-        "0xa97fBc75CcbC7d4353C4D2676ed18Cd0C5AaF7e6"
+        "zksync:0xa97fBc75CcbC7d4353C4D2676ed18Cd0C5AaF7e6"
      values.accessControl.MINTER_ROLE.members.1:
-        "0xD78dc27D4dB8f428C67f542216a2b23663838405"
+        "zksync:0xD78dc27D4dB8f428C67f542216a2b23663838405"
      values.accessControl.MINTER_ROLE.members.2:
-        "0x21b27952f8621f54f3CB652630E122Ec81dd2dc1"
+        "zksync:0x21b27952f8621f54f3CB652630E122Ec81dd2dc1"
      values.accessControl.MINTER_ROLE.members.3:
-        "0x0Ad50686C159040E57ddcE137Db0b63c67473450"
+        "zksync:0x0Ad50686C159040E57ddcE137Db0b63c67473450"
      values.accessControl.MINTER_ROLE.members.4:
-        "0x0681E3808a0aA12004fb815ebB4515DC823cfbb4"
+        "zksync:0x0681E3808a0aA12004fb815ebB4515DC823cfbb4"
      values.accessControl.MINTER_ROLE.members.5:
-        "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4"
+        "zksync:0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4"
      values.accessControl.MINTER_ROLE.members.6:
-        "0xb294F411cB52c7C6B6c0B0b61DBDf398a8b0725d"
+        "zksync:0xb294F411cB52c7C6B6c0B0b61DBDf398a8b0725d"
      values.accessControl.MINTER_ROLE.members.7:
-        "0xf29D698E74EF1904BCFDb20Ed38f9F3EF0A89E5b"
+        "zksync:0xf29D698E74EF1904BCFDb20Ed38f9F3EF0A89E5b"
      values.accessControl.MINTER_ROLE.members.8:
-        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
+        "zksync:0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
      values.accessControl.MINTER_ROLE.members.9:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.10:
-        "0x51E818785dEa065D392ac21F04E9cac5B601Cfd8"
+        "zksync:0x51E818785dEa065D392ac21F04E9cac5B601Cfd8"
      values.accessControl.MINTER_ROLE.members.11:
-        "0x70F6998FC0c492d9DD08b1105259252329be9Db6"
+        "zksync:0x70F6998FC0c492d9DD08b1105259252329be9Db6"
      values.DefaultAdmin.0:
-        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
+        "zksync:0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      values.eip712Domain.verifyingContract:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      values.MinterAdmin.0:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      implementationNames.0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E:
-        "TransparentUpgradeableProxy"
      implementationNames.0x01a6715d3560241E09E865a46122bf347A576c09:
-        "ZkTokenV2"
      implementationNames.zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E:
+        "TransparentUpgradeableProxy"
      implementationNames.zksync:0x01a6715d3560241E09E865a46122bf347A576c09:
+        "ZkTokenV2"
    }
```

```diff
    EOA Guardians_l2Alias (0x711ea620AB29f41AbC6596a15981e14ce58C97c9) {
    +++ description: None
      address:
-        "0x711ea620AB29f41AbC6596a15981e14ce58C97c9"
+        "zksync:0x711ea620AB29f41AbC6596a15981e14ce58C97c9"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      address:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.eip712Domain.verifyingContract:
-        "0x76705327e682F2d96943280D99464Ab61219e34f"
+        "zksync:0x76705327e682F2d96943280D99464Ab61219e34f"
      values.timelock:
-        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.token:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      implementationNames.0x76705327e682F2d96943280D99464Ab61219e34f:
-        "ZkProtocolGovernor"
      implementationNames.zksync:0x76705327e682F2d96943280D99464Ab61219e34f:
+        "ZkProtocolGovernor"
    }
```

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      address:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "zksync:0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
    }
```

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      address:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.eip712Domain.verifyingContract:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.PROPOSE_GUARDIAN:
-        "0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D"
+        "zksync:0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D"
      values.timelock:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.token:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      values.VETO_GUARDIAN:
-        "0x711ea620AB29f41AbC6596a15981e14ce58C97c9"
+        "zksync:0x711ea620AB29f41AbC6596a15981e14ce58C97c9"
      implementationNames.0xb83FF6501214ddF40C91C9565d095400f3F45746:
-        "ZkTokenGovernor"
      implementationNames.zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746:
+        "ZkTokenGovernor"
    }
```

```diff
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      address:
-        "0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      values.Canceller.0:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      values.Executor.0:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      values.Proposer.0:
-        "0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
+        "zksync:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"
      values.timelockAdminAC.0:
-        "0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      implementationNames.0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19:
-        "TimelockController"
      implementationNames.zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19:
+        "TimelockController"
    }
```

```diff
    contract GovOpsTimelockController (0xC9E442574958f96C026DeF9a50C3236cab17428a) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      address:
-        "0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.Canceller.0:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.Executor.0:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.Proposer.0:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.timelockAdminAC.0:
-        "0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      implementationNames.0xC9E442574958f96C026DeF9a50C3236cab17428a:
-        "TimelockController"
      implementationNames.zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a:
+        "TimelockController"
    }
```

```diff
    EOA ZKFoundationMultisig_l2Alias (0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D) {
    +++ description: None
      address:
-        "0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D"
+        "zksync:0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D"
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      address:
-        "0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
      values.owner:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "zksync:0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
      implementationNames.0xdB1E46B448e68a5E35CB693a99D59f784aD115CC:
-        "ProxyAdmin"
      implementationNames.zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC:
+        "ProxyAdmin"
    }
```

```diff
    contract ZkTokenTimelockController (0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      address:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.Canceller.0:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.Executor.0:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.Proposer.0:
-        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      values.timelockAdminAC.0:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      implementationNames.0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d:
-        "TimelockController"
      implementationNames.zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d:
+        "TimelockController"
    }
```

```diff
    EOA Guardians_l2Alias_deprecated (0xe788e09324F8bb3cc64f009973693f751C33b999) {
    +++ description: None
      address:
-        "0xe788e09324F8bb3cc64f009973693f751C33b999"
+        "zksync:0xe788e09324F8bb3cc64f009973693f751C33b999"
    }
```

```diff
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      address:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.eip712Domain.verifyingContract:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
      values.timelock:
-        "0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      values.token:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      values.VETO_GUARDIAN:
-        "0x711ea620AB29f41AbC6596a15981e14ce58C97c9"
+        "zksync:0x711ea620AB29f41AbC6596a15981e14ce58C97c9"
      implementationNames.0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160:
-        "ZkGovOpsGovernor"
      implementationNames.zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160:
+        "ZkGovOpsGovernor"
    }
```

```diff
    EOA ProtocolUpgradeHandler_l2Alias (0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4) {
    +++ description: None
      address:
-        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
+        "zksync:0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
    }
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
```

```diff
+   Status: CREATED
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89)
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
```

```diff
+   Status: CREATED
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb)
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
```

```diff
+   Status: CREATED
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E)
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
```

```diff
+   Status: CREATED
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f)
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
```

```diff
+   Status: CREATED
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746)
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
```

```diff
+   Status: CREATED
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract GovOpsTimelockController (0xC9E442574958f96C026DeF9a50C3236cab17428a)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkTokenTimelockController (0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160)
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
```

Generated with discovered.json: 0x0ae1a76b02db42231983c2297a12a99dea7f8c64

# Diff at Mon, 14 Jul 2025 12:47:17 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22779828
- current block number: 22779828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22779828 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057) {
    +++ description: None
      address:
-        "0x015318c16AE443a20DE0A776dB06a59F0D279057"
+        "eth:0x015318c16AE443a20DE0A776dB06a59F0D279057"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xb799FF3DeF706045B5061B22d748E8F52737415d"
+        "eth:0xb799FF3DeF706045B5061B22d748E8F52737415d"
      implementationNames.0x015318c16AE443a20DE0A776dB06a59F0D279057:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x015318c16AE443a20DE0A776dB06a59F0D279057:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac) {
    +++ description: None
      address:
-        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
+        "eth:0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
    }
```

```diff
    EOA ProtocolTimelockController(L2->L1) (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: None
      address:
-        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "eth:0x085b8B6407f150D62adB1EF926F7f304600ec714"
    }
```

```diff
    EOA  (0x0B2E7ffbcD1E3e6f5034555Fb638889FE7564709) {
    +++ description: None
      address:
-        "0x0B2E7ffbcD1E3e6f5034555Fb638889FE7564709"
+        "eth:0x0B2E7ffbcD1E3e6f5034555Fb638889FE7564709"
    }
```

```diff
    EOA  (0x0e621b0A275A207211e161Ee997aA80661Bc1bcf) {
    +++ description: None
      address:
-        "0x0e621b0A275A207211e161Ee997aA80661Bc1bcf"
+        "eth:0x0e621b0A275A207211e161Ee997aA80661Bc1bcf"
    }
```

```diff
    EOA  (0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1) {
    +++ description: None
      address:
-        "0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
+        "eth:0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
    }
```

```diff
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66) {
    +++ description: None
      address:
-        "0x13f07d9BF17615f6a17F272fe1A913168C275A66"
+        "eth:0x13f07d9BF17615f6a17F272fe1A913168C275A66"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x2A71F929fC583Db245B1563996de76Ab9d9A3DAf"
+        "eth:0x2A71F929fC583Db245B1563996de76Ab9d9A3DAf"
      implementationNames.0x13f07d9BF17615f6a17F272fe1A913168C275A66:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x13f07d9BF17615f6a17F272fe1A913168C275A66:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x160669864cDe95c190364ad01eDfbAA32E9DA430) {
    +++ description: None
      address:
-        "0x160669864cDe95c190364ad01eDfbAA32E9DA430"
+        "eth:0x160669864cDe95c190364ad01eDfbAA32E9DA430"
    }
```

```diff
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D) {
    +++ description: None
      address:
-        "0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D"
+        "eth:0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001"
+        "eth:0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001"
      implementationNames.0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract ProxyAdmin (0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e) {
    +++ description: None
      address:
-        "0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "eth:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      implementationNames.0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e:
-        "ProxyAdmin"
      implementationNames.eth:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x227230CD05e89f41E67df3E5fC61B18411d147A9) {
    +++ description: None
      address:
-        "0x227230CD05e89f41E67df3E5fC61B18411d147A9"
+        "eth:0x227230CD05e89f41E67df3E5fC61B18411d147A9"
    }
```

```diff
    EOA  (0x239cCb0a6Fc59fc6A53584613707F815503a6aAF) {
    +++ description: None
      address:
-        "0x239cCb0a6Fc59fc6A53584613707F815503a6aAF"
+        "eth:0x239cCb0a6Fc59fc6A53584613707F815503a6aAF"
    }
```

```diff
    EOA  (0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839) {
    +++ description: None
      address:
-        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
+        "eth:0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
    }
```

```diff
    contract ProxyAdmin (0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B) {
    +++ description: None
      address:
-        "0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
+        "eth:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
      values.owner:
-        "0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      implementationNames.0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B:
-        "ProxyAdmin"
      implementationNames.eth:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x2A71F929fC583Db245B1563996de76Ab9d9A3DAf) {
    +++ description: None
      address:
-        "0x2A71F929fC583Db245B1563996de76Ab9d9A3DAf"
+        "eth:0x2A71F929fC583Db245B1563996de76Ab9d9A3DAf"
    }
```

```diff
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384) {
    +++ description: None
      address:
-        "0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384"
+        "eth:0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x160669864cDe95c190364ad01eDfbAA32E9DA430"
+        "eth:0x160669864cDe95c190364ad01eDfbAA32E9DA430"
      implementationNames.0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      address:
-        "0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.owner:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenMultiplierSetter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x2cf3bD6a9056b39999F3883955E183F655345063:
-        "ChainAdmin"
      implementationNames.eth:0x2cf3bD6a9056b39999F3883955E183F655345063:
+        "ChainAdmin"
    }
```

```diff
    EOA  (0x2F73918C0F92FA9aD3Cfa87611677345a98CEa6f) {
    +++ description: None
      address:
-        "0x2F73918C0F92FA9aD3Cfa87611677345a98CEa6f"
+        "eth:0x2F73918C0F92FA9aD3Cfa87611677345a98CEa6f"
    }
```

```diff
    EOA  (0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2) {
    +++ description: None
      address:
-        "0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
+        "eth:0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      address:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32"
+        "eth:0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32"
      values.$pastUpgrades.0.2.0:
-        "0x12f893689f9603991a8c22C249FFd0509Be95661"
+        "eth:0x12f893689f9603991a8c22C249FFd0509Be95661"
      values.$pastUpgrades.1.2.0:
-        "0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"
+        "eth:0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"
      values.$pastUpgrades.2.2.0:
-        "0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"
+        "eth:0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"
      values.$pastUpgrades.3.2.0:
-        "0xb720523EC3c615b069453bF4B0584CEbF034706f"
+        "eth:0xb720523EC3c615b069453bF4B0584CEbF034706f"
      values.$pastUpgrades.4.2.0:
-        "0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87"
+        "eth:0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87"
      values.$pastUpgrades.5.2.0:
-        "0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32"
+        "eth:0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32"
      values.admin:
-        "0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.assetRouter:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.chainsCreated.0.chainGovernance:
-        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
+        "eth:0x71d84c3404a6ae258E6471d4934B96a2033F9438"
      values.chainsCreated.0.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.1.chainGovernance:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "eth:0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
      values.chainsCreated.1.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.2.chainGovernance:
-        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
+        "eth:0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
      values.chainsCreated.2.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.3.chainGovernance:
-        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
+        "eth:0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
      values.chainsCreated.3.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.4.chainGovernance:
-        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "eth:0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
      values.chainsCreated.4.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.5.chainGovernance:
-        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
+        "eth:0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      values.chainsCreated.5.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.6.chainGovernance:
-        "0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "eth:0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
      values.chainsCreated.6.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.7.chainGovernance:
-        "0x49664fFe2c2335c28631629606E26a6971aEf261"
+        "eth:0x49664fFe2c2335c28631629606E26a6971aEf261"
      values.chainsCreated.7.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.8.chainGovernance:
-        "0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "eth:0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
      values.chainsCreated.8.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.9.chainGovernance:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "eth:0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.chainsCreated.9.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.10.chainGovernance:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.chainsCreated.10.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.11.chainGovernance:
-        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
+        "eth:0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
      values.chainsCreated.11.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.12.chainGovernance:
-        "0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
+        "eth:0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
      values.chainsCreated.12.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.13.chainGovernance:
-        "0x6ec9117dCFBe2E8Dd747c9D45034E2DF9C7d2da0"
+        "eth:0x6ec9117dCFBe2E8Dd747c9D45034E2DF9C7d2da0"
      values.chainsCreated.13.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.14.chainGovernance:
-        "0x21bFaD8F0f781F367ACCb5276199B0c0E819CbD9"
+        "eth:0x21bFaD8F0f781F367ACCb5276199B0c0E819CbD9"
      values.chainsCreated.14.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.15.chainGovernance:
-        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
+        "eth:0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      values.chainsCreated.15.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.getAllZKChains.0:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
+        "eth:0x32400084C286CF3E17e7B677ea9583e60a000324"
      values.getAllZKChains.1:
-        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "eth:0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      values.getAllZKChains.2:
-        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
+        "eth:0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
      values.getAllZKChains.3:
-        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
+        "eth:0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllZKChains.4:
-        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
      values.getAllZKChains.5:
-        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
+        "eth:0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      values.getAllZKChains.6:
-        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "eth:0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      values.getAllZKChains.7:
-        "0x89f90748A9a36C30A324481133fa198f4E16A824"
+        "eth:0x89f90748A9a36C30A324481133fa198f4E16A824"
      values.getAllZKChains.8:
-        "0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
+        "eth:0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
      values.getAllZKChains.9:
-        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "eth:0xF2704433d11842d15aa76BBF0E00407267a99C92"
      values.getAllZKChains.10:
-        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "eth:0xc29d04A93F893700015138E3E334eB828dAC3cef"
      values.getAllZKChains.11:
-        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
+        "eth:0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
      values.getAllZKChains.12:
-        "0x742A28e22277945BBAAa34810393bf6e8512576C"
+        "eth:0x742A28e22277945BBAAa34810393bf6e8512576C"
      values.getAllZKChains.13:
-        "0x270bF3978FeA60719Dd25A400EbE6969bF451493"
+        "eth:0x270bF3978FeA60719Dd25A400EbE6969bF451493"
      values.getAllZKChains.14:
-        "0xD231E2fD0DeC5993fCeae3E504930631876e8C63"
+        "eth:0xD231E2fD0DeC5993fCeae3E504930631876e8C63"
      values.getAllZKChains.15:
-        "0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
+        "eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
      values.l1CtmDeployer:
-        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
+        "eth:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      values.messageRoot:
-        "0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
+        "eth:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.sharedBridge:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      implementationNames.0x303a465B659cBB0ab36eE643eA362c509EEb5213:
-        "TransparentUpgradeableProxy"
      implementationNames.0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32:
-        "Bridgehub"
      implementationNames.eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32:
+        "Bridgehub"
    }
```

```diff
    EOA  (0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc) {
    +++ description: None
      address:
-        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
+        "eth:0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
    }
```

```diff
    EOA  (0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735) {
    +++ description: None
      address:
-        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
+        "eth:0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
    }
```

```diff
    EOA  (0x3133781381bC58564D5e9888c208ED0b7BD7721F) {
    +++ description: None
      address:
-        "0x3133781381bC58564D5e9888c208ED0b7BD7721F"
+        "eth:0x3133781381bC58564D5e9888c208ED0b7BD7721F"
    }
```

```diff
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a) {
    +++ description: None
      address:
-        "0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a"
+        "eth:0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xd20a09d16964aefc8c8c5355C5141f54274521c7"
+        "eth:0xd20a09d16964aefc8c8c5355C5141f54274521c7"
      values.$members.1:
-        "0xDF1aa0495C815A1b9156796a741885a4834EC012"
+        "eth:0xDF1aa0495C815A1b9156796a741885a4834EC012"
      implementationNames.0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F) {
    +++ description: None
      address:
-        "0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F"
+        "eth:0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x78834238C8F4CA04c73256D221cd6a1d29b9A81c"
+        "eth:0x78834238C8F4CA04c73256D221cd6a1d29b9A81c"
      values.$members.1:
-        "0x6DA259FD6b42D6bAB9D22C01418F87c13a271478"
+        "eth:0x6DA259FD6b42D6bAB9D22C01418F87c13a271478"
      values.$members.2:
-        "0xa5D0084A766203b463b3164DFc49D91509C12daB"
+        "eth:0xa5D0084A766203b463b3164DFc49D91509C12daB"
      values.$members.3:
-        "0x53A26f48ED901336D7C165B85E6F43d9F8dBeAA7"
+        "eth:0x53A26f48ED901336D7C165B85E6F43d9F8dBeAA7"
      values.$members.4:
-        "0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
+        "eth:0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
      implementationNames.0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f) {
    +++ description: None
      address:
-        "0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f"
+        "eth:0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f"
    }
```

```diff
    EOA  (0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c) {
    +++ description: None
      address:
-        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
+        "eth:0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
    }
```

```diff
    EOA  (0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A) {
    +++ description: None
      address:
-        "0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A"
+        "eth:0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A"
    }
```

```diff
    EOA  (0x3846c3A30E62075Fa916216b35EF04B8F53931f6) {
    +++ description: None
      address:
-        "0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
+        "eth:0x3846c3A30E62075Fa916216b35EF04B8F53931f6"
    }
```

```diff
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F) {
    +++ description: None
      address:
-        "0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F"
+        "eth:0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB1072fD3a5EA72B42e063e5A61963d00eeF655DF"
+        "eth:0xB1072fD3a5EA72B42e063e5A61963d00eeF655DF"
      values.$members.1:
-        "0xEE8fAC9051243379dAAA02c24e07D29F22d73b4E"
+        "eth:0xEE8fAC9051243379dAAA02c24e07D29F22d73b4E"
      implementationNames.0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x3F0009D00cc78979d00Eb635490F23E8d6aCc481) {
    +++ description: None
      address:
-        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
+        "eth:0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
    }
```

```diff
    EOA  (0x41814626a9256173B6E6441d8133F9286F02AA16) {
    +++ description: None
      address:
-        "0x41814626a9256173B6E6441d8133F9286F02AA16"
+        "eth:0x41814626a9256173B6E6441d8133F9286F02AA16"
    }
```

```diff
    EOA  (0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5) {
    +++ description: None
      address:
-        "0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
+        "eth:0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
    }
```

```diff
    EOA  (0x441e5c8910Ef39996B2D01499509861228cbc2d1) {
    +++ description: None
      address:
-        "0x441e5c8910Ef39996B2D01499509861228cbc2d1"
+        "eth:0x441e5c8910Ef39996B2D01499509861228cbc2d1"
    }
```

```diff
    EOA  (0x44450Ff37FbBD29B705514e9d0252A43f5aB634c) {
    +++ description: None
      address:
-        "0x44450Ff37FbBD29B705514e9d0252A43f5aB634c"
+        "eth:0x44450Ff37FbBD29B705514e9d0252A43f5aB634c"
    }
```

```diff
    EOA  (0x4A333c167Ce76C46149c6B0197977ae02aaeC929) {
    +++ description: None
      address:
-        "0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
+        "eth:0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      address:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
+        "eth:0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
      values.$members.1:
-        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
+        "eth:0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
      values.$members.2:
-        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
+        "eth:0x8A23548a640De1137e58e2D9600e1c5913E3D674"
      values.$members.3:
-        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
+        "eth:0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
      values.$members.4:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "eth:0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
      values.$members.5:
-        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
+        "eth:0xFAdb20191Ab38362C50f52909817B74214CA79AE"
      values.$members.6:
-        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
+        "eth:0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
      values.$members.7:
-        "0x7408A268e5E6e8F08917c5b71015F4B9044970C7"
+        "eth:0x7408A268e5E6e8F08917c5b71015F4B9044970C7"
      implementationNames.0x4e4943346848c4867F81dFb37c4cA9C5715A7828:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4e4943346848c4867F81dFb37c4cA9C5715A7828:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f) {
    +++ description: None
      address:
-        "0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f"
+        "eth:0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x227230CD05e89f41E67df3E5fC61B18411d147A9"
+        "eth:0x227230CD05e89f41E67df3E5fC61B18411d147A9"
      implementationNames.0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x53A26f48ED901336D7C165B85E6F43d9F8dBeAA7) {
    +++ description: None
      address:
-        "0x53A26f48ED901336D7C165B85E6F43d9F8dBeAA7"
+        "eth:0x53A26f48ED901336D7C165B85E6F43d9F8dBeAA7"
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      address:
-        "0x55c671BcE13120387Ded710A1d1b80C0e3d8E857"
+        "eth:0x55c671BcE13120387Ded710A1d1b80C0e3d8E857"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x9f708301AA8CB86A06D23152fE67F2bFaa094cA1"
+        "eth:0x9f708301AA8CB86A06D23152fE67F2bFaa094cA1"
      implementationNames.0x55c671BcE13120387Ded710A1d1b80C0e3d8E857:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x55c671BcE13120387Ded710A1d1b80C0e3d8E857:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x56B3120c32AE9C3188fafc5Cc542F9c53B0b2222) {
    +++ description: None
      address:
-        "0x56B3120c32AE9C3188fafc5Cc542F9c53B0b2222"
+        "eth:0x56B3120c32AE9C3188fafc5Cc542F9c53B0b2222"
    }
```

```diff
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69) {
    +++ description: None
      address:
-        "0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69"
+        "eth:0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0e621b0A275A207211e161Ee997aA80661Bc1bcf"
+        "eth:0x0e621b0A275A207211e161Ee997aA80661Bc1bcf"
      implementationNames.0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      address:
-        "0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
+        "eth:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0x382fb241396eA915108e7B7Ce1adE1322bA73aeE"
+        "eth:0x382fb241396eA915108e7B7Ce1adE1322bA73aeE"
      values.$pastUpgrades.0.2.0:
-        "0x19347Fb8eD3E8e35eb4a01c8B18Bd330194Cf0ad"
+        "eth:0x19347Fb8eD3E8e35eb4a01c8B18Bd330194Cf0ad"
      values.$pastUpgrades.1.2.0:
-        "0x382fb241396eA915108e7B7Ce1adE1322bA73aeE"
+        "eth:0x382fb241396eA915108e7B7Ce1adE1322bA73aeE"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      implementationNames.0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD:
-        "TransparentUpgradeableProxy"
      implementationNames.0x382fb241396eA915108e7B7Ce1adE1322bA73aeE:
-        "MessageRoot"
      implementationNames.eth:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x382fb241396eA915108e7B7Ce1adE1322bA73aeE:
+        "MessageRoot"
    }
```

```diff
    EOA  (0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C) {
    +++ description: None
      address:
-        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
+        "eth:0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
    }
```

```diff
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      address:
-        "0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
+        "eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
      values.$members.0:
-        "0x015318c16AE443a20DE0A776dB06a59F0D279057"
+        "eth:0x015318c16AE443a20DE0A776dB06a59F0D279057"
      values.$members.1:
-        "0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D"
+        "eth:0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D"
      values.$members.2:
-        "0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384"
+        "eth:0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384"
      values.$members.3:
-        "0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f"
+        "eth:0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f"
      values.$members.4:
-        "0x55c671BcE13120387Ded710A1d1b80C0e3d8E857"
+        "eth:0x55c671BcE13120387Ded710A1d1b80C0e3d8E857"
      values.$members.5:
-        "0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69"
+        "eth:0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69"
      values.$members.6:
-        "0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0"
+        "eth:0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0"
      values.$members.7:
-        "0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"
+        "eth:0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"
      values.eip712Domain.verifyingContract:
-        "0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
+        "eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
      values.PROTOCOL_UPGRADE_HANDLER:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.ZKSYNC_ERA:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
+        "eth:0x32400084C286CF3E17e7B677ea9583e60a000324"
      implementationNames.0x600dA620Ab29F41ABC6596a15981e14cE58c86b8:
-        "Guardians"
      implementationNames.eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8:
+        "Guardians"
    }
```

```diff
    contract CTMDeploymentTracker (0x6078F6B379f103de1Aa912dc46bb8Df0c8809860) {
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
      address:
-        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
+        "eth:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1"
+        "eth:0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1"
      values.$pastUpgrades.0.2.0:
-        "0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1"
+        "eth:0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.L1_ASSET_ROUTER:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6078F6B379f103de1Aa912dc46bb8Df0c8809860:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1:
-        "CTMDeploymentTracker"
      implementationNames.eth:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x1E405E5cdF127Dc98Eb490AB0e97345f892Ff7E1:
+        "CTMDeploymentTracker"
    }
```

```diff
    EOA  (0x610e45F112e0c8a9aA7137677C83E7A198A1b991) {
    +++ description: None
      address:
-        "0x610e45F112e0c8a9aA7137677C83E7A198A1b991"
+        "eth:0x610e45F112e0c8a9aA7137677C83E7A198A1b991"
    }
```

```diff
    EOA  (0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281) {
    +++ description: None
      address:
-        "0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281"
+        "eth:0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281"
    }
```

```diff
    EOA  (0x663ec2BfB273447DC236A646d6dAAA333aAB08f7) {
    +++ description: None
      address:
-        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
+        "eth:0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
    }
```

```diff
    contract SecurityCouncil (0x66E4431266DC7E04E7d8b7FE9d2181253df7F410) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      address:
-        "0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
+        "eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
      values.$members.0:
-        "0x13f07d9BF17615f6a17F272fe1A913168C275A66"
+        "eth:0x13f07d9BF17615f6a17F272fe1A913168C275A66"
      values.$members.1:
-        "0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a"
+        "eth:0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a"
      values.$members.2:
-        "0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F"
+        "eth:0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F"
      values.$members.3:
-        "0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F"
+        "eth:0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F"
      values.$members.4:
-        "0x69462a81ba94D64c404575f1899a464F123497A2"
+        "eth:0x69462a81ba94D64c404575f1899a464F123497A2"
      values.$members.5:
-        "0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A"
+        "eth:0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A"
      values.$members.6:
-        "0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0"
+        "eth:0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0"
      values.$members.7:
-        "0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88"
+        "eth:0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88"
      values.$members.8:
-        "0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803"
+        "eth:0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803"
      values.$members.9:
-        "0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44"
+        "eth:0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44"
      values.$members.10:
-        "0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e"
+        "eth:0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e"
      values.$members.11:
-        "0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"
+        "eth:0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"
      values.eip712Domain.verifyingContract:
-        "0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
+        "eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
      values.PROTOCOL_UPGRADE_HANDLER:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      implementationNames.0x66E4431266DC7E04E7d8b7FE9d2181253df7F410:
-        "SecurityCouncil"
      implementationNames.eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410:
+        "SecurityCouncil"
    }
```

```diff
    EOA  (0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7) {
    +++ description: None
      address:
-        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
+        "eth:0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
    }
```

```diff
    EOA  (0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F) {
    +++ description: None
      address:
-        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
+        "eth:0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
    }
```

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      address:
-        "0x69462a81ba94D64c404575f1899a464F123497A2"
+        "eth:0x69462a81ba94D64c404575f1899a464F123497A2"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A"
+        "eth:0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A"
      values.$members.1:
-        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
+        "eth:0xaaAdAa000867fb883089B7e528d7eA96937b777f"
      values.$members.2:
-        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
+        "eth:0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
      values.$members.3:
-        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
+        "eth:0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
      values.$members.4:
-        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
+        "eth:0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
      values.$members.5:
-        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
+        "eth:0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
      values.$members.6:
-        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
+        "eth:0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
      values.$members.7:
-        "0xe968FB773e54f77350A427B057FDB44e6592E338"
+        "eth:0xe968FB773e54f77350A427B057FDB44e6592E338"
      values.$members.8:
-        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
+        "eth:0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
      values.$members.9:
-        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
+        "eth:0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
      values.$members.10:
-        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
+        "eth:0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
      implementationNames.0x69462a81ba94D64c404575f1899a464F123497A2:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x69462a81ba94D64c404575f1899a464F123497A2:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0) {
    +++ description: None
      address:
-        "0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0"
+        "eth:0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f"
+        "eth:0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f"
      implementationNames.0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x6DA259FD6b42D6bAB9D22C01418F87c13a271478) {
    +++ description: None
      address:
-        "0x6DA259FD6b42D6bAB9D22C01418F87c13a271478"
+        "eth:0x6DA259FD6b42D6bAB9D22C01418F87c13a271478"
    }
```

```diff
    EOA  (0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6) {
    +++ description: None
      address:
-        "0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6"
+        "eth:0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6"
    }
```

```diff
    EOA  (0x702caCafA54B88e9c54449563Fb2e496e85c78b7) {
    +++ description: None
      address:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "eth:0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
    }
```

```diff
    contract RollupL1DAValidator (0x72213dfe8CA61B0A782970dCFebFb877778f9119) {
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
      address:
-        "0x72213dfe8CA61B0A782970dCFebFb877778f9119"
+        "eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119"
      implementationNames.0x72213dfe8CA61B0A782970dCFebFb877778f9119:
-        "RollupL1DAValidator"
      implementationNames.eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119:
+        "RollupL1DAValidator"
    }
```

```diff
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A) {
    +++ description: None
      address:
-        "0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A"
+        "eth:0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6"
+        "eth:0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6"
      implementationNames.0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x7408A268e5E6e8F08917c5b71015F4B9044970C7) {
    +++ description: None
      address:
-        "0x7408A268e5E6e8F08917c5b71015F4B9044970C7"
+        "eth:0x7408A268e5E6e8F08917c5b71015F4B9044970C7"
    }
```

```diff
    EOA  (0x78834238C8F4CA04c73256D221cd6a1d29b9A81c) {
    +++ description: None
      address:
-        "0x78834238C8F4CA04c73256D221cd6a1d29b9A81c"
+        "eth:0x78834238C8F4CA04c73256D221cd6a1d29b9A81c"
    }
```

```diff
    EOA  (0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8) {
    +++ description: None
      address:
-        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
+        "eth:0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
    }
```

```diff
    EOA  (0x7DcA405b791CdE56aA60f036C95ec2Efe283647e) {
    +++ description: None
      address:
-        "0x7DcA405b791CdE56aA60f036C95ec2Efe283647e"
+        "eth:0x7DcA405b791CdE56aA60f036C95ec2Efe283647e"
    }
```

```diff
    contract L1GenesisUpgrade (0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E) {
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
      address:
-        "0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E"
+        "eth:0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E"
      implementationNames.0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E:
-        "L1GenesisUpgrade"
      implementationNames.eth:0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E:
+        "L1GenesisUpgrade"
    }
```

```diff
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      address:
-        "0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0"
+        "eth:0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
+        "eth:0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
      values.$members.1:
-        "0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
+        "eth:0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
      values.$members.2:
-        "0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
+        "eth:0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
      values.$members.3:
-        "0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
+        "eth:0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
      values.$members.4:
-        "0x3133781381bC58564D5e9888c208ED0b7BD7721F"
+        "eth:0x3133781381bC58564D5e9888c208ED0b7BD7721F"
      implementationNames.0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56) {
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
      address:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F"
+        "eth:0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F"
      values.$pastUpgrades.0.2.0:
-        "0x20E17D0280DeaBb78f7c193E3Ef05F62adC0936E"
+        "eth:0x20E17D0280DeaBb78f7c193E3Ef05F62adC0936E"
      values.$pastUpgrades.1.2.0:
-        "0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315"
+        "eth:0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315"
      values.$pastUpgrades.2.2.0:
-        "0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F"
+        "eth:0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.L1_NULLIFIER:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      values.L1_WETH_TOKEN:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.legacyBridge:
-        "0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"
+        "eth:0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"
      values.nativeTokenVault:
-        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x8829AD80E425C646DAB305381ff105169FeEcE56:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F:
-        "L1AssetRouter"
      implementationNames.eth:0x8829AD80E425C646DAB305381ff105169FeEcE56:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F:
+        "L1AssetRouter"
    }
```

```diff
    EOA  (0x8A23548a640De1137e58e2D9600e1c5913E3D674) {
    +++ description: None
      address:
-        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
+        "eth:0x8A23548a640De1137e58e2D9600e1c5913E3D674"
    }
```

```diff
    EOA  (0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D) {
    +++ description: None
      address:
-        "0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D"
+        "eth:0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D"
    }
```

```diff
    EOA  (0x98E24e308c4B7cdADcf4d116B2B8939a21420bA1) {
    +++ description: None
      address:
-        "0x98E24e308c4B7cdADcf4d116B2B8939a21420bA1"
+        "eth:0x98E24e308c4B7cdADcf4d116B2B8939a21420bA1"
    }
```

```diff
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88) {
    +++ description: None
      address:
-        "0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88"
+        "eth:0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
+        "eth:0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
      values.$members.1:
-        "0xd9f8460f3081dC29dF1e3b6e5404B245B96F4A30"
+        "eth:0xd9f8460f3081dC29dF1e3b6e5404B245B96F4A30"
      values.$members.2:
-        "0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
+        "eth:0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
      implementationNames.0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803) {
    +++ description: None
      address:
-        "0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803"
+        "eth:0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
+        "eth:0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
      values.$members.1:
-        "0x98E24e308c4B7cdADcf4d116B2B8939a21420bA1"
+        "eth:0x98E24e308c4B7cdADcf4d116B2B8939a21420bA1"
      values.$members.2:
-        "0xc8E2806A97413b5496A1ba6050b517CC98D0EfCA"
+        "eth:0xc8E2806A97413b5496A1ba6050b517CC98D0EfCA"
      values.$members.3:
-        "0x7DcA405b791CdE56aA60f036C95ec2Efe283647e"
+        "eth:0x7DcA405b791CdE56aA60f036C95ec2Efe283647e"
      values.$members.4:
-        "0x239cCb0a6Fc59fc6A53584613707F815503a6aAF"
+        "eth:0x239cCb0a6Fc59fc6A53584613707F815503a6aAF"
      values.$members.5:
-        "0xC2Cd2330A575af7f124E07820E7c4AbfaeD02392"
+        "eth:0xC2Cd2330A575af7f124E07820E7c4AbfaeD02392"
      values.$members.6:
-        "0xcb218CD15fAa4dbAc294b15C7cE99482783d7ad6"
+        "eth:0xcb218CD15fAa4dbAc294b15C7cE99482783d7ad6"
      values.$members.7:
-        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
+        "eth:0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
      values.$members.8:
-        "0xBab69188f07F2569A41C5B875e147216D974eB3e"
+        "eth:0xBab69188f07F2569A41C5B875e147216D974eB3e"
      implementationNames.0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x9f708301AA8CB86A06D23152fE67F2bFaa094cA1) {
    +++ description: None
      address:
-        "0x9f708301AA8CB86A06D23152fE67F2bFaa094cA1"
+        "eth:0x9f708301AA8CB86A06D23152fE67F2bFaa094cA1"
    }
```

```diff
    EOA  (0xA10fcD4B012467FAC48ce63838B7bE56AB16bE52) {
    +++ description: None
      address:
-        "0xA10fcD4B012467FAC48ce63838B7bE56AB16bE52"
+        "eth:0xA10fcD4B012467FAC48ce63838B7bE56AB16bE52"
    }
```

```diff
    EOA  (0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001) {
    +++ description: None
      address:
-        "0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001"
+        "eth:0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001"
    }
```

```diff
    EOA  (0xa5D0084A766203b463b3164DFc49D91509C12daB) {
    +++ description: None
      address:
-        "0xa5D0084A766203b463b3164DFc49D91509C12daB"
+        "eth:0xa5D0084A766203b463b3164DFc49D91509C12daB"
    }
```

```diff
    EOA  (0xaaAdAa000867fb883089B7e528d7eA96937b777f) {
    +++ description: None
      address:
-        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
+        "eth:0xaaAdAa000867fb883089B7e528d7eA96937b777f"
    }
```

```diff
    EOA  (0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c) {
    +++ description: None
      address:
-        "0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c"
+        "eth:0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c"
    }
```

```diff
    EOA  (0xB1072fD3a5EA72B42e063e5A61963d00eeF655DF) {
    +++ description: None
      address:
-        "0xB1072fD3a5EA72B42e063e5A61963d00eeF655DF"
+        "eth:0xB1072fD3a5EA72B42e063e5A61963d00eeF655DF"
    }
```

```diff
    EOA  (0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c) {
    +++ description: None
      address:
-        "0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
+        "eth:0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
    }
```

```diff
    EOA  (0xb799FF3DeF706045B5061B22d748E8F52737415d) {
    +++ description: None
      address:
-        "0xb799FF3DeF706045B5061B22d748E8F52737415d"
+        "eth:0xb799FF3DeF706045B5061B22d748E8F52737415d"
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      address:
-        "0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44"
+        "eth:0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
+        "eth:0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
      values.$members.1:
-        "0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c"
+        "eth:0xafc7805c640C4A9E5D28f6A5Eae23b50e59B831c"
      values.$members.2:
-        "0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f"
+        "eth:0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f"
      implementationNames.0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xBab69188f07F2569A41C5B875e147216D974eB3e) {
    +++ description: None
      address:
-        "0xBab69188f07F2569A41C5B875e147216D974eB3e"
+        "eth:0xBab69188f07F2569A41C5B875e147216D974eB3e"
    }
```

```diff
    contract ZK Foundation Multisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      address:
-        "0xbC1653bd3829dfEc575AfC3816D4899cd103B51c"
+        "eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xA10fcD4B012467FAC48ce63838B7bE56AB16bE52"
+        "eth:0xA10fcD4B012467FAC48ce63838B7bE56AB16bE52"
      values.$members.1:
-        "0x56B3120c32AE9C3188fafc5Cc542F9c53B0b2222"
+        "eth:0x56B3120c32AE9C3188fafc5Cc542F9c53B0b2222"
      values.$members.2:
-        "0x441e5c8910Ef39996B2D01499509861228cbc2d1"
+        "eth:0x441e5c8910Ef39996B2D01499509861228cbc2d1"
      values.$members.3:
-        "0x0B2E7ffbcD1E3e6f5034555Fb638889FE7564709"
+        "eth:0x0B2E7ffbcD1E3e6f5034555Fb638889FE7564709"
      values.$members.4:
-        "0x610e45F112e0c8a9aA7137677C83E7A198A1b991"
+        "eth:0x610e45F112e0c8a9aA7137677C83E7A198A1b991"
      implementationNames.0xbC1653bd3829dfEc575AfC3816D4899cd103B51c:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6) {
    +++ description: Canonical central asset escrow for all ZK stack chains.
      address:
-        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0xBa05B8B761386289Ba413a74AF1933d6a76E1b52"
+        "eth:0xBa05B8B761386289Ba413a74AF1933d6a76E1b52"
      values.$pastUpgrades.0.2.0:
-        "0x40B1060a114380f40faC6869c5B383f47e61530c"
+        "eth:0x40B1060a114380f40faC6869c5B383f47e61530c"
      values.$pastUpgrades.1.2.0:
-        "0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947"
+        "eth:0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947"
      values.$pastUpgrades.2.2.0:
-        "0xBa05B8B761386289Ba413a74AF1933d6a76E1b52"
+        "eth:0xBa05B8B761386289Ba413a74AF1933d6a76E1b52"
      values.ASSET_ROUTER:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.bridgedTokenBeacon:
-        "0xb3618AbcbA795588C43eA602dD0Cd6E952A85a6A"
+        "eth:0xb3618AbcbA795588C43eA602dD0Cd6E952A85a6A"
      values.L1_NULLIFIER:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.WETH_TOKEN:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6:
-        "TransparentUpgradeableProxy"
      implementationNames.0xBa05B8B761386289Ba413a74AF1933d6a76E1b52:
-        "L1NativeTokenVault"
      implementationNames.eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xBa05B8B761386289Ba413a74AF1933d6a76E1b52:
+        "L1NativeTokenVault"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      address:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      implementationNames.0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1:
-        "ProxyAdmin"
      implementationNames.eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xC2Cd2330A575af7f124E07820E7c4AbfaeD02392) {
    +++ description: None
      address:
-        "0xC2Cd2330A575af7f124E07820E7c4AbfaeD02392"
+        "eth:0xC2Cd2330A575af7f124E07820E7c4AbfaeD02392"
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0.
      address:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0x345314c7E4af84B763d98d23f772622E23AfB5CE"
+        "eth:0x345314c7E4af84B763d98d23f772622E23AfB5CE"
      values.$pastUpgrades.0.2.0:
-        "0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"
+        "eth:0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"
      values.$pastUpgrades.1.2.0:
-        "0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"
+        "eth:0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"
      values.$pastUpgrades.2.2.0:
-        "0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"
+        "eth:0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"
      values.$pastUpgrades.3.2.0:
-        "0xA3bCcAEe38cb0273A979118a0DE483E47D50F6Cb"
+        "eth:0xA3bCcAEe38cb0273A979118a0DE483E47D50F6Cb"
      values.$pastUpgrades.4.2.0:
-        "0x6D598c77AF57Bfa17201483400615c61819dD45A"
+        "eth:0x6D598c77AF57Bfa17201483400615c61819dD45A"
      values.$pastUpgrades.5.2.0:
-        "0x345314c7E4af84B763d98d23f772622E23AfB5CE"
+        "eth:0x345314c7E4af84B763d98d23f772622E23AfB5CE"
      values.admin:
-        "0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.l1GenesisUpgrade:
-        "0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E"
+        "eth:0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.serverNotifierAddress:
-        "0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
+        "eth:0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
      values.validatorTimelock:
-        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
+        "eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
      implementationNames.0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C:
-        "TransparentUpgradeableProxy"
      implementationNames.0x345314c7E4af84B763d98d23f772622E23AfB5CE:
-        "ChainTypeManager"
      implementationNames.eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x345314c7E4af84B763d98d23f772622E23AfB5CE:
+        "ChainTypeManager"
    }
```

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      address:
-        "0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e"
+        "eth:0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x41814626a9256173B6E6441d8133F9286F02AA16"
+        "eth:0x41814626a9256173B6E6441d8133F9286F02AA16"
      values.$members.1:
-        "0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0"
+        "eth:0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0"
      values.$members.2:
-        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
+        "eth:0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
      values.$members.3:
-        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
+        "eth:0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      implementationNames.0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xc8E2806A97413b5496A1ba6050b517CC98D0EfCA) {
    +++ description: None
      address:
-        "0xc8E2806A97413b5496A1ba6050b517CC98D0EfCA"
+        "eth:0xc8E2806A97413b5496A1ba6050b517CC98D0EfCA"
    }
```

```diff
    EOA  (0xcb218CD15fAa4dbAc294b15C7cE99482783d7ad6) {
    +++ description: None
      address:
-        "0xcb218CD15fAa4dbAc294b15C7cE99482783d7ad6"
+        "eth:0xcb218CD15fAa4dbAc294b15C7cE99482783d7ad6"
    }
```

```diff
    EOA  (0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F) {
    +++ description: None
      address:
-        "0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
+        "eth:0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
    }
```

```diff
    EOA  (0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f) {
    +++ description: None
      address:
-        "0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f"
+        "eth:0xCe20135Ac0253650E28Ea14911c69F1fADD8b06f"
    }
```

```diff
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf) {
    +++ description: None
      address:
-        "0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"
+        "eth:0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D"
+        "eth:0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D"
      implementationNames.0xCe7a3dFcc35602155809920Ff65e093aa726f6cf:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xCe7a3dFcc35602155809920Ff65e093aa726f6cf:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xd20a09d16964aefc8c8c5355C5141f54274521c7) {
    +++ description: None
      address:
-        "0xd20a09d16964aefc8c8c5355C5141f54274521c7"
+        "eth:0xd20a09d16964aefc8c8c5355C5141f54274521c7"
    }
```

```diff
    EOA  (0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553) {
    +++ description: None
      address:
-        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
+        "eth:0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
    }
```

```diff
    contract L1Nullifier (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
      address:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      values.$admin:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      values.$implementation:
-        "0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431"
+        "eth:0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431"
      values.$pastUpgrades.0.2.0:
-        "0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"
+        "eth:0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"
      values.$pastUpgrades.1.2.0:
-        "0xb56A8225A745756DD215faf22E4796f373561AcD"
+        "eth:0xb56A8225A745756DD215faf22E4796f373561AcD"
      values.$pastUpgrades.2.2.0:
-        "0xF5A14DCdde1143443f06033200D345c2a2828A99"
+        "eth:0xF5A14DCdde1143443f06033200D345c2a2828A99"
      values.$pastUpgrades.3.2.0:
-        "0xda2866AF0e170d0867a3F3bB52Db10D6E09Df78A"
+        "eth:0xda2866AF0e170d0867a3F3bB52Db10D6E09Df78A"
      values.$pastUpgrades.4.2.0:
-        "0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518"
+        "eth:0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518"
      values.$pastUpgrades.5.2.0:
-        "0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431"
+        "eth:0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.l1AssetRouter:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.l1NativeTokenVault:
-        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      values.legacyBridge:
-        "0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"
+        "eth:0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB:
-        "TransparentUpgradeableProxy"
      implementationNames.0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431:
-        "L1Nullifier"
      implementationNames.eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431:
+        "L1Nullifier"
    }
```

```diff
    EOA  (0xd9f8460f3081dC29dF1e3b6e5404B245B96F4A30) {
    +++ description: None
      address:
-        "0xd9f8460f3081dC29dF1e3b6e5404B245B96F4A30"
+        "eth:0xd9f8460f3081dC29dF1e3b6e5404B245B96F4A30"
    }
```

```diff
    EOA  (0xDF1aa0495C815A1b9156796a741885a4834EC012) {
    +++ description: None
      address:
-        "0xDF1aa0495C815A1b9156796a741885a4834EC012"
+        "eth:0xDF1aa0495C815A1b9156796a741885a4834EC012"
    }
```

```diff
    EOA  (0xdF28907A6A272fa06333a197d7F0379A0f8f00aa) {
    +++ description: None
      address:
-        "0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
+        "eth:0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
    }
```

```diff
    EOA  (0xDFbD13B78010BF2110a168FA59b682c8a6D96564) {
    +++ description: None
      address:
-        "0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
+        "eth:0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
    }
```

```diff
    EOA  (0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2) {
    +++ description: None
      address:
-        "0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
+        "eth:0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      address:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.$admin:
-        "0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "eth:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
      values.$implementation:
-        "0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A"
+        "eth:0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A"
      values.$pastUpgrades.0.2.0:
-        "0xD5e9D3d483a93d03D8d604CC79dC9f2F4B78C604"
+        "eth:0xD5e9D3d483a93d03D8d604CC79dC9f2F4B78C604"
      values.$pastUpgrades.1.2.0:
-        "0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A"
+        "eth:0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.CHAIN_TYPE_MANAGER:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.emergencyUpgradeBoard:
-        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
+        "eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      values.guardians:
-        "0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
+        "eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
      values.L1_ASSET_ROUTER:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.L1_NATIVE_TOKEN_VAULT:
-        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      values.L1_NULLIFIER:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      values.L2_PROTOCOL_GOVERNOR:
-        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "eth:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.securityCouncil:
-        "0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
+        "eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
      values.ZKSYNC_ERA:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
+        "eth:0x32400084C286CF3E17e7B677ea9583e60a000324"
      implementationNames.0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A:
-        "ProtocolUpgradeHandler"
      implementationNames.eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A:
+        "ProtocolUpgradeHandler"
    }
```

```diff
    contract RollupDAManager (0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45) {
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
      address:
-        "0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "eth:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
      values.daPairs.0.l2DAValidator:
-        "0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
+        "eth:0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
      values.daPairs.0.l1DAValidator:
-        "0x72213dfe8CA61B0A782970dCFebFb877778f9119"
+        "eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119"
      values.daPairs.1.l2DAValidator:
-        "0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281"
+        "eth:0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281"
      values.daPairs.1.l1DAValidator:
-        "0x72213dfe8CA61B0A782970dCFebFb877778f9119"
+        "eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119"
      values.daPairs.2.l2DAValidator:
-        "0x44450Ff37FbBD29B705514e9d0252A43f5aB634c"
+        "eth:0x44450Ff37FbBD29B705514e9d0252A43f5aB634c"
      values.daPairs.2.l1DAValidator:
-        "0x72213dfe8CA61B0A782970dCFebFb877778f9119"
+        "eth:0x72213dfe8CA61B0A782970dCFebFb877778f9119"
+++ severity: HIGH
      values.owner:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45:
-        "RollupDAManager"
      implementationNames.eth:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45:
+        "RollupDAManager"
    }
```

```diff
    EOA  (0xe968FB773e54f77350A427B057FDB44e6592E338) {
    +++ description: None
      address:
-        "0xe968FB773e54f77350A427B057FDB44e6592E338"
+        "eth:0xe968FB773e54f77350A427B057FDB44e6592E338"
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      address:
-        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
+        "eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      description:
-        "A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3."
+        "A custom contract allowing a 3/3 of eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3."
      values.eip712Domain.verifyingContract:
-        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
+        "eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      values.GUARDIANS:
-        "0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
+        "eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8"
      values.PROTOCOL_UPGRADE_HANDLER:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.SECURITY_COUNCIL:
-        "0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
+        "eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410"
      values.ZK_FOUNDATION_SAFE:
-        "0xbC1653bd3829dfEc575AfC3816D4899cd103B51c"
+        "eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c"
      implementationNames.0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6:
-        "EmergencyUpgradeBoard"
      implementationNames.eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6:
+        "EmergencyUpgradeBoard"
    }
```

```diff
    EOA  (0xEE8fAC9051243379dAAA02c24e07D29F22d73b4E) {
    +++ description: None
      address:
-        "0xEE8fAC9051243379dAAA02c24e07D29F22d73b4E"
+        "eth:0xEE8fAC9051243379dAAA02c24e07D29F22d73b4E"
    }
```

```diff
    EOA  (0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0) {
    +++ description: None
      address:
-        "0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0"
+        "eth:0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0"
    }
```

```diff
    EOA  (0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46) {
    +++ description: None
      address:
-        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
+        "eth:0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
    }
```

```diff
    EOA  (0xfa96A3Da88f201433911bEFf3Ecc434CB1222731) {
    +++ description: None
      address:
-        "0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
+        "eth:0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
    }
```

```diff
    EOA  (0xFAdb20191Ab38362C50f52909817B74214CA79AE) {
    +++ description: None
      address:
-        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
+        "eth:0xFAdb20191Ab38362C50f52909817B74214CA79AE"
    }
```

```diff
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231) {
    +++ description: None
      address:
-        "0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"
+        "eth:0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x2F73918C0F92FA9aD3Cfa87611677345a98CEa6f"
+        "eth:0x2F73918C0F92FA9aD3Cfa87611677345a98CEa6f"
      implementationNames.0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract ServerNotifier (0xfca808A744735D9919EEBe4660B8Fd897456Ce31) {
    +++ description: A simple contract that can be called by the ChainAdmin to emit notifications about chain migrations.
      address:
-        "0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
+        "eth:0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
      values.$admin:
-        "0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
+        "eth:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
      values.$implementation:
-        "0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A"
+        "eth:0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A"
      values.$pastUpgrades.0.2.0:
-        "0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A"
+        "eth:0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A"
      values.chainTypeManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.owner:
-        "0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xfca808A744735D9919EEBe4660B8Fd897456Ce31:
-        "TransparentUpgradeableProxy"
      implementationNames.0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A:
-        "ServerNotifier"
      implementationNames.eth:0xfca808A744735D9919EEBe4660B8Fd897456Ce31:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x555D040F4A089D1dF14B372a87C5aF8FA37BDB7A:
+        "ServerNotifier"
    }
```

```diff
    EOA  (0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2) {
    +++ description: None
      address:
-        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
+        "eth:0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD)
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
```

```diff
+   Status: CREATED
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
+   Status: CREATED
    contract CTMDeploymentTracker (0x6078F6B379f103de1Aa912dc46bb8Df0c8809860)
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x66E4431266DC7E04E7d8b7FE9d2181253df7F410)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupL1DAValidator (0x72213dfe8CA61B0A782970dCFebFb877778f9119)
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56)
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZK Foundation Multisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6)
    +++ description: Canonical central asset escrow for all ZK stack chains.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Nullifier (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB)
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
+   Status: CREATED
    contract RollupDAManager (0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45)
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6)
    +++ description: A custom contract allowing a 3/3 of eth:0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, eth:0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and eth:0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ServerNotifier (0xfca808A744735D9919EEBe4660B8Fd897456Ce31)
    +++ description: A simple contract that can be called by the ChainAdmin to emit notifications about chain migrations.
```

Generated with discovered.json: 0x09110da964c6b1ed98d8e3355d03e831151831bf

# Diff at Fri, 04 Jul 2025 12:19:20 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 61100811
- current block number: 61100811

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 61100811 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      directlyReceivedPermissions.0.from:
-        "zksync2:0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
    }
```

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.0.via.0.address:
-        "zksync2:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.0.from:
-        "zksync2:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.1.from:
-        "zksync2:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.2.from:
-        "zksync2:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.3.from:
-        "zksync2:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      directlyReceivedPermissions.0.from:
-        "zksync2:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
    }
```

```diff
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      directlyReceivedPermissions.0.from:
-        "zksync2:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.0.from:
-        "zksync2:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "zksync:0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
    }
```

```diff
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.0.via.0.address:
-        "zksync2:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      receivedPermissions.0.from:
-        "zksync2:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      receivedPermissions.1.from:
-        "zksync2:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      receivedPermissions.2.from:
-        "zksync2:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      receivedPermissions.3.from:
-        "zksync2:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
      directlyReceivedPermissions.0.from:
-        "zksync2:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
    }
```

```diff
    EOA Guardians_l2Alias (0x711ea620AB29f41AbC6596a15981e14ce58C97c9) {
    +++ description: None
      receivedPermissions.0.from:
-        "zksync2:0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
      receivedPermissions.1.from:
-        "zksync2:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "zksync:0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.0.from:
-        "zksync2:0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.1.from:
-        "zksync2:0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.2.via.0.address:
-        "zksync2:0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.2.from:
-        "zksync2:0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.3.from:
-        "zksync2:0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.4.from:
-        "zksync2:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      receivedPermissions.5.from:
-        "zksync2:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      receivedPermissions.6.via.0.address:
-        "zksync2:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      receivedPermissions.6.from:
-        "zksync2:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      receivedPermissions.7.from:
-        "zksync2:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      directlyReceivedPermissions.0.from:
-        "zksync2:0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "zksync:0x085b8B6407f150D62adB1EF926F7f304600ec714"
      directlyReceivedPermissions.1.from:
-        "zksync2:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "zksync:0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
    }
```

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "zksync2:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
      receivedPermissions.0.from:
-        "zksync2:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      directlyReceivedPermissions.0.from:
-        "zksync2:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "zksync:0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
    }
```

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.0.via.0.address:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      receivedPermissions.0.from:
-        "zksync2:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      receivedPermissions.1.via.0.address:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      receivedPermissions.1.from:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      receivedPermissions.2.from:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      receivedPermissions.3.from:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      receivedPermissions.4.from:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      directlyReceivedPermissions.0.from:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
    }
```

```diff
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.0.from:
-        "zksync2:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
+        "zksync:0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"
    }
```

```diff
    contract GovOpsTimelockController (0xC9E442574958f96C026DeF9a50C3236cab17428a) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.0.from:
-        "zksync2:0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
    }
```

```diff
    EOA ZKFoundationMultisig_l2Alias (0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D) {
    +++ description: None
      receivedPermissions.0.from:
-        "zksync2:0xb83FF6501214ddF40C91C9565d095400f3F45746"
+        "zksync:0xb83FF6501214ddF40C91C9565d095400f3F45746"
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "zksync2:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
    }
```

```diff
    contract ZkTokenTimelockController (0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.0.from:
-        "zksync2:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      directlyReceivedPermissions.1.from:
-        "zksync2:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "zksync:0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
    }
```

```diff
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.0.via.0.address:
-        "zksync2:0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      receivedPermissions.0.from:
-        "zksync2:0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      receivedPermissions.1.from:
-        "zksync2:0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      receivedPermissions.2.from:
-        "zksync2:0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      receivedPermissions.3.from:
-        "zksync2:0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
      directlyReceivedPermissions.0.from:
-        "zksync2:0xC9E442574958f96C026DeF9a50C3236cab17428a"
+        "zksync:0xC9E442574958f96C026DeF9a50C3236cab17428a"
    }
```

```diff
    EOA ProtocolUpgradeHandler_l2Alias (0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4) {
    +++ description: None
      receivedPermissions.0.from:
-        "zksync2:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "zksync:0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
    }
```

Generated with discovered.json: 0x09a71207920680fae295ec6ddefb75a5616264a4

# Diff at Fri, 04 Jul 2025 12:19:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22779828
- current block number: 22779828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22779828 (main branch discovery), not current.

```diff
    EOA ProtocolTimelockController(L2->L1) (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
    contract ProxyAdmin (0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
    contract ProxyAdmin (0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
+        "eth:0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
    }
```

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
+        "eth:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      directlyReceivedPermissions.2.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      receivedPermissions.0.from:
-        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      receivedPermissions.1.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
+        "eth:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
      receivedPermissions.2.from:
-        "ethereum:0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
+        "eth:0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "eth:0x2cf3bD6a9056b39999F3883955E183F655345063"
    }
```

```diff
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      receivedPermissions.0.from:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.1.from:
-        "ethereum:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
+        "eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
    }
```

```diff
    contract SecurityCouncil (0x66E4431266DC7E04E7d8b7FE9d2181253df7F410) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      receivedPermissions.0.from:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.1.from:
-        "ethereum:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
+        "eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
    }
```

```diff
    contract ZK Foundation Multisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
+        "eth:0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
+        "eth:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
+        "eth:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "eth:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "eth:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.0.via.0.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.0.from:
-        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.1.from:
-        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.2.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.3.from:
-        "ethereum:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.4.via.0.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.4.from:
-        "ethereum:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "eth:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
      receivedPermissions.5.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.5.from:
-        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.6.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.6.from:
-        "ethereum:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
+        "eth:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
      receivedPermissions.7.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.7.from:
-        "ethereum:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
+        "eth:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      receivedPermissions.8.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.8.from:
-        "ethereum:0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      receivedPermissions.9.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.9.from:
-        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      receivedPermissions.10.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.10.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "eth:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.11.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.11.via.0.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "eth:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.11.from:
-        "ethereum:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "eth:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.12.via.1.address:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "eth:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
      receivedPermissions.12.from:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "eth:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

Generated with discovered.json: 0x3de6244c3c29bf06b84e9bc90b2d9b98fa3de3c6

# Diff at Thu, 03 Jul 2025 13:13:59 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2bf1651fdc6ade0d159b4c4c95f961e0088ae458 block: 61100811
- current block number: 61100811

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 61100811 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      description:
-        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
+        "Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
    }
```

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      description:
-        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
+        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed."
    }
```

```diff
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      description:
-        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
+        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
    }
```

Generated with discovered.json: 0xd47c9eb9f58ac2317a1267b8085f54c51e783409

# Diff at Wed, 25 Jun 2025 07:10:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22767970
- current block number: 22779828

## Description

ML MS: single signer change.

Config: rename, tidy template folders. unhide the L1NativeTokenVault.

## Watched changes

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      values.$members.7:
-        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
+        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
      values.$members.6:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
      values.$members.5:
-        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
+        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
      values.$members.4:
-        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
+        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
      values.$members.3:
-        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
+        "0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
      values.$members.2:
-        "0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
+        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
      values.$members.1:
-        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
+        "0x7408A268e5E6e8F08917c5b71015F4B9044970C7"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22767970 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      template:
-        "shared-zk-stack/v26/BridgeHub"
+        "shared-zk-stack/BridgeHub"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      template:
-        "shared-zk-stack/v26/MessageRoot"
+        "shared-zk-stack/MessageRoot"
    }
```

```diff
    contract CTMDeploymentTracker (0x6078F6B379f103de1Aa912dc46bb8Df0c8809860) {
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
      template:
-        "shared-zk-stack/v26/CTMDeploymentTracker"
+        "shared-zk-stack/CTMDeploymentTracker"
    }
```

```diff
    contract RollupL1DAValidator (0x72213dfe8CA61B0A782970dCFebFb877778f9119) {
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
      template:
-        "shared-zk-stack/v26/RollupL1DAValidator"
+        "shared-zk-stack/RollupL1DAValidator"
    }
```

```diff
    contract L1GenesisUpgrade (0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E) {
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
      template:
-        "shared-zk-stack/v26/L1GenesisUpgrade"
+        "shared-zk-stack/L1GenesisUpgrade"
    }
```

```diff
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56) {
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
      template:
-        "shared-zk-stack/v26/L1AssetRouter"
+        "shared-zk-stack/L1AssetRouter"
    }
```

```diff
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6) {
    +++ description: Canonical central asset escrow for all ZK stack chains.
      template:
-        "shared-zk-stack/v26/L1NativeTokenVault"
+        "shared-zk-stack/L1NativeTokenVault"
      description:
-        "Part of the v26 upgrade: Canonical central asset escrow for all ZK stack chains."
+        "Canonical central asset escrow for all ZK stack chains."
      category:
-        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0.
      template:
-        "shared-zk-stack/v26/ChainTypeManager"
+        "shared-zk-stack/ChainTypeManager"
    }
```

```diff
    contract L1Nullifier (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
      template:
-        "shared-zk-stack/v26/L1Nullifier"
+        "shared-zk-stack/L1Nullifier"
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      template:
-        "shared-zk-stack/v26/ProtocolUpgradeHandler"
+        "shared-zk-stack/ProtocolUpgradeHandler"
      directlyReceivedPermissions.6:
+        {"permission":"act","from":"ethereum:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e","role":".owner"}
      directlyReceivedPermissions.5.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      directlyReceivedPermissions.5.description:
+        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
      directlyReceivedPermissions.4.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "ethereum:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
      directlyReceivedPermissions.4.description:
-        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
+        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
      directlyReceivedPermissions.3.permission:
-        "interact"
+        "act"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      directlyReceivedPermissions.3.description:
-        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
      directlyReceivedPermissions.2.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.2.from:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      directlyReceivedPermissions.2.description:
+        "pause / unpause the bridge."
    }
```

```diff
    contract RollupDAManager (0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45) {
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
      template:
-        "shared-zk-stack/v26/RollupDAManager"
+        "shared-zk-stack/RollupDAManager"
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.12:
+        {"permission":"upgrade","from":"ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","role":"admin","via":[{"address":"ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      receivedPermissions.11.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      receivedPermissions.10.from:
-        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.10.via.1.address:
-        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "ethereum:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
      receivedPermissions.9.from:
-        "ethereum:0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "ethereum:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.9.via.1.address:
-        "ethereum:0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.8.from:
-        "ethereum:0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "ethereum:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      receivedPermissions.7.from:
-        "ethereum:0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
+        "ethereum:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      receivedPermissions.6.from:
-        "ethereum:0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.5.from:
-        "ethereum:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "ethereum:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "ethereum:0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
+        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.4.role:
-        "admin"
+        ".owner"
      receivedPermissions.4.via.1:
-        {"address":"ethereum:0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      receivedPermissions.4.description:
+        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
      receivedPermissions.3.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "ethereum:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
      receivedPermissions.3.description:
-        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
+        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
      receivedPermissions.2.from:
-        "ethereum:0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "ethereum:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      receivedPermissions.2.description:
-        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
+        "pause / unpause the bridge."
    }
```

Generated with discovered.json: 0x642afe96e73d7379237bef6bc51f476f1ffbdb14

# Diff at Mon, 23 Jun 2025 15:18:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@399f5abaefa11c25467c604969aa558f53a49aa0 block: 22744143
- current block number: 22767970

## Description

v28 upgrade complete.

## Watched changes

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.4:
+        {"_protocolVersion":115964116992,"_upgradeTimestamp":1746435600}
      values.upgradeTimestamps.3._protocolVersion:
-        115964116992
+        120259084288
      values.upgradeTimestamps.3._upgradeTimestamp:
-        1746435600
+        1750042800
    }
```

Generated with discovered.json: 0x34e56c064e3683bce438c2bcf4545c803f423735

# Diff at Fri, 20 Jun 2025 07:28:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@70109db050355e01a50f54497c60fdd17bbdbc2d block: 22738072
- current block number: 22744143

## Description

zk stack [v28 upgrade](https://www.tally.xyz/gov/zksync/proposal/54063168049426383294336598998322383147338444177076559098597792110160570100155?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

TLDR: adds precompiles for elliptic curve operations (ECAdd, ECMul, ECPairing) and modular exponentiation (ModExp).

all shared contract upgraded implementations are code-identical with their predecessors (except genesisUpdate, which contains l2 logic).

migrations unpaused!

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      values.$implementation:
-        "0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87"
+        "0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32"
      values.$pastUpgrades.5:
+        ["2024-06-04T17:03:59.000Z","0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61",["0x12f893689f9603991a8c22C249FFd0509Be95661"]]
      values.$pastUpgrades.4.2:
-        ["0x12f893689f9603991a8c22C249FFd0509Be95661"]
+        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
      values.$pastUpgrades.4.1:
-        "2024-06-04T17:03:59.000Z"
+        "2025-04-28T12:33:11.000Z"
      values.$pastUpgrades.4.0:
-        "0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61"
+        ["0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87"]
      values.$pastUpgrades.3.2:
-        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
+        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
      values.$pastUpgrades.3.1:
-        "2025-04-28T12:33:11.000Z"
+        "2025-01-08T16:00:35.000Z"
      values.$pastUpgrades.3.0.0:
-        "0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87"
+        "0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"
      values.$pastUpgrades.2.2:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        ["0xb720523EC3c615b069453bF4B0584CEbF034706f"]
      values.$pastUpgrades.2.1:
-        "2025-01-08T16:00:35.000Z"
+        "2025-03-31T08:00:47.000Z"
      values.$pastUpgrades.2.0:
-        ["0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"]
+        "0x96a2f14c85022136ab3d4e568e9f1fe8f4611a4a2597f979332840259378f6b3"
      values.$pastUpgrades.1.2:
-        ["0xb720523EC3c615b069453bF4B0584CEbF034706f"]
+        "0x56b626590d1042673f7cf09f480533e8084d3e6141dc079fba657b1cc2ec17eb"
      values.$pastUpgrades.1.1:
-        "2025-03-31T08:00:47.000Z"
+        "2025-06-19T14:26:59.000Z"
      values.$pastUpgrades.1.0:
-        "0x96a2f14c85022136ab3d4e568e9f1fe8f4611a4a2597f979332840259378f6b3"
+        ["0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32"]
      values.$upgradeCount:
-        5
+        6
+++ description: If false, chains can migrate to whitelisted settlement layers.
+++ severity: HIGH
      values.migrationPaused:
-        true
+        false
      implementationNames.0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87:
-        "Bridgehub"
      implementationNames.0x08A98B1048Fb61E9Fff7d7d98305aC6286Ae9F32:
+        "Bridgehub"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      values.$implementation:
-        "0x19347Fb8eD3E8e35eb4a01c8B18Bd330194Cf0ad"
+        "0x382fb241396eA915108e7B7Ce1adE1322bA73aeE"
      values.$pastUpgrades.1:
+        ["2025-06-19T14:26:59.000Z","0x56b626590d1042673f7cf09f480533e8084d3e6141dc079fba657b1cc2ec17eb",["0x382fb241396eA915108e7B7Ce1adE1322bA73aeE"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.0x19347Fb8eD3E8e35eb4a01c8B18Bd330194Cf0ad:
-        "MessageRoot"
      implementationNames.0x382fb241396eA915108e7B7Ce1adE1322bA73aeE:
+        "MessageRoot"
    }
```

```diff
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56) {
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
      values.$implementation:
-        "0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315"
+        "0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F"
      values.$pastUpgrades.2:
+        ["2025-04-28T12:33:11.000Z","0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132",["0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315"]]
      values.$pastUpgrades.1.2:
-        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
+        ["0x20E17D0280DeaBb78f7c193E3Ef05F62adC0936E"]
      values.$pastUpgrades.1.1:
-        "2025-04-28T12:33:11.000Z"
+        "0x2c945c00f7a9f08b1a0bc749a08d76ca4cd5ee6f8890011ab43898e9fa1fcdf2"
      values.$pastUpgrades.1.0:
-        ["0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315"]
+        "2025-02-09T13:51:11.000Z"
      values.$pastUpgrades.0.2.0:
-        "0x20E17D0280DeaBb78f7c193E3Ef05F62adC0936E"
+        "0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F"
      values.$pastUpgrades.0.1:
-        "0x2c945c00f7a9f08b1a0bc749a08d76ca4cd5ee6f8890011ab43898e9fa1fcdf2"
+        "0x56b626590d1042673f7cf09f480533e8084d3e6141dc079fba657b1cc2ec17eb"
      values.$pastUpgrades.0.0:
-        "2025-02-09T13:51:11.000Z"
+        "2025-06-19T14:26:59.000Z"
      values.$upgradeCount:
-        2
+        3
      implementationNames.0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315:
-        "L1AssetRouter"
      implementationNames.0x0cb7f11BA981E13598D70625dF8f4597d59f2F4F:
+        "L1AssetRouter"
    }
```

```diff
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6) {
    +++ description: Part of the v26 upgrade: Canonical central asset escrow for all ZK stack chains.
      values.$implementation:
-        "0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947"
+        "0xBa05B8B761386289Ba413a74AF1933d6a76E1b52"
      values.$pastUpgrades.2:
+        ["2025-04-28T12:33:11.000Z","0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132",["0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947"]]
      values.$pastUpgrades.1.2:
-        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
+        "2025-02-09T13:52:11.000Z"
      values.$pastUpgrades.1.1.0:
-        "0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947"
+        "0x40B1060a114380f40faC6869c5B383f47e61530c"
      values.$pastUpgrades.1.0:
-        "2025-04-28T12:33:11.000Z"
+        "0x50619c1506e8e93cc28017847b5690b6a0784bc2b08c1dbb8555b71525b72351"
      values.$pastUpgrades.0.2:
-        "2025-02-09T13:52:11.000Z"
+        "0x56b626590d1042673f7cf09f480533e8084d3e6141dc079fba657b1cc2ec17eb"
      values.$pastUpgrades.0.1.0:
-        "0x40B1060a114380f40faC6869c5B383f47e61530c"
+        "0xBa05B8B761386289Ba413a74AF1933d6a76E1b52"
      values.$pastUpgrades.0.0:
-        "0x50619c1506e8e93cc28017847b5690b6a0784bc2b08c1dbb8555b71525b72351"
+        "2025-06-19T14:26:59.000Z"
      values.$upgradeCount:
-        2
+        3
      implementationNames.0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947:
-        "L1NativeTokenVault"
      implementationNames.0xBa05B8B761386289Ba413a74AF1933d6a76E1b52:
+        "L1NativeTokenVault"
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0.
      description:
-        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,27,0."
+        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,28,0."
      values.$implementation:
-        "0x6D598c77AF57Bfa17201483400615c61819dD45A"
+        "0x345314c7E4af84B763d98d23f772622E23AfB5CE"
      values.$pastUpgrades.5:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"]]
      values.$pastUpgrades.4.2:
-        ["0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"]
+        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
      values.$pastUpgrades.4.1:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        ["0x6D598c77AF57Bfa17201483400615c61819dD45A"]
      values.$pastUpgrades.4.0:
-        "2025-01-08T16:00:35.000Z"
+        "2025-04-28T12:33:11.000Z"
      values.$pastUpgrades.3.2:
-        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
+        ["0x345314c7E4af84B763d98d23f772622E23AfB5CE"]
      values.$pastUpgrades.3.1:
-        ["0x6D598c77AF57Bfa17201483400615c61819dD45A"]
+        "0x56b626590d1042673f7cf09f480533e8084d3e6141dc079fba657b1cc2ec17eb"
      values.$pastUpgrades.3.0:
-        "2025-04-28T12:33:11.000Z"
+        "2025-06-19T14:26:59.000Z"
      values.$upgradeCount:
-        5
+        6
      values.getSemverProtocolVersion.0:
-        27
+        28
      values.initialCutHash:
-        "0xd20b12f6c5152e7197db37e19b177d22a369c32230fbbc2bfeec5b39788afd8c"
+        "0xf5e92e1f82b7dcec41aad4bfbbd238b89380f311b2b65956d2073f59b4f9a58f"
      values.initialForceDeploymentHash:
-        "0x48dac090fa2f13afa11b2ea3f456fb424cef704d997bd137575a5fe9c5c3241a"
+        "0xed1057fbf858575d7348c4f2c82dd034534c62d97d0ac1d46f98ed197403f3d9"
      values.l1GenesisUpgrade:
-        "0xC5bBb8bA0302215Da343D47EC617649E59c7d61C"
+        "0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E"
      values.protocolVersion:
-        115964116992
+        120259084288
      values.storedBatchZero:
-        "0xe3199bb31e1acf8a1667692d8536edcce799c58cfebe85e3e0adeb0ae788b291"
+        "0x9629612e3685846dc5056347758c0f8286fc877383c762aa17b1411758a582d8"
      implementationNames.0x6D598c77AF57Bfa17201483400615c61819dD45A:
-        "ChainTypeManager"
      implementationNames.0x345314c7E4af84B763d98d23f772622E23AfB5CE:
+        "ChainTypeManager"
    }
```

```diff
-   Status: DELETED
    contract L1GenesisUpgrade (0xC5bBb8bA0302215Da343D47EC617649E59c7d61C)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
    contract L1Nullifier (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
      values.$implementation:
-        "0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518"
+        "0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431"
      values.$pastUpgrades.5:
+        ["2024-08-26T07:51:11.000Z","0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c",["0xb56A8225A745756DD215faf22E4796f373561AcD"]]
      values.$pastUpgrades.4.2.0:
-        "0xb56A8225A745756DD215faf22E4796f373561AcD"
+        "0xF5A14DCdde1143443f06033200D345c2a2828A99"
      values.$pastUpgrades.4.1:
-        "2024-08-26T07:51:11.000Z"
+        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
      values.$pastUpgrades.4.0:
-        "0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c"
+        "2025-01-08T16:00:35.000Z"
      values.$pastUpgrades.3.2:
-        ["0xF5A14DCdde1143443f06033200D345c2a2828A99"]
+        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
      values.$pastUpgrades.3.1:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        "2025-04-28T12:33:11.000Z"
      values.$pastUpgrades.3.0:
-        "2025-01-08T16:00:35.000Z"
+        ["0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518"]
      values.$pastUpgrades.2.2:
-        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
+        "0x56b626590d1042673f7cf09f480533e8084d3e6141dc079fba657b1cc2ec17eb"
      values.$pastUpgrades.2.1:
-        "2025-04-28T12:33:11.000Z"
+        ["0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431"]
      values.$pastUpgrades.2.0:
-        ["0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518"]
+        "2025-06-19T14:26:59.000Z"
      values.$upgradeCount:
-        5
+        6
      implementationNames.0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518:
-        "L1Nullifier"
      implementationNames.0xC6f08EFb7BA78f40d00F41aFAC00211d59eb9431:
+        "L1Nullifier"
    }
```

```diff
    contract RollupDAManager (0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45) {
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
+++ severity: HIGH
      values.daPairs.2:
+        {"l1DAValidator":"0x72213dfe8CA61B0A782970dCFebFb877778f9119","l2DAValidator":"0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281","status":true}
      values.daPairs.1.l2DAValidator:
-        "0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281"
+        "0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
      values.daPairs.0.l2DAValidator:
-        "0xfa96A3Da88f201433911bEFf3Ecc434CB1222731"
+        "0x44450Ff37FbBD29B705514e9d0252A43f5aB634c"
    }
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (0x7Dde6ce8Ee4865f4BBD134d3BE827DBE5282100E)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

## Source code changes

```diff
.../BridgeHub/Bridgehub.sol                        |  2 +-
 .../ChainTypeManager/ChainTypeManager.sol          |  2 +-
 .../L1AssetRouter/L1AssetRouter.sol                |  2 +-
 .../{.flat@22738072 => .flat}/L1GenesisUpgrade.sol | 35 ++++++++++++++++++----
 .../L1NativeTokenVault/L1NativeTokenVault.sol      |  2 +-
 .../L1Nullifier/L1Nullifier.sol                    |  2 +-
 .../MessageRoot/MessageRoot.sol                    |  7 +++--
 7 files changed, 38 insertions(+), 14 deletions(-)
```

Generated with discovered.json: 0xacf0fe97bd31ff4bd21dff7855ff18ab0b74c7cf

# Diff at Thu, 19 Jun 2025 11:10:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5c484ae81a750a81728eec4c46d10685ad38407 block: 22694404
- current block number: 22738072

## Description

ServerNotifier deployed (simple notifier/emit contract).

## Watched changes

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"interact","from":"ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"revert batches for any connected chain (ZK cluster Admin role).","role":".admin"}
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "act"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "ethereum:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"
      directlyReceivedPermissions.1.description:
-        "revert batches for any connected chain (ZK cluster Admin role)."
      directlyReceivedPermissions.1.role:
-        ".admin"
+        ".owner"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"upgrade","from":"ethereum:0xfca808A744735D9919EEBe4660B8Fd897456Ce31","role":"admin","via":[{"address":"ethereum:0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B"},{"address":"ethereum:0x2cf3bD6a9056b39999F3883955E183F655345063"}]}
    }
```

```diff
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      values.nonce:
-        0
+        1
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,27,0.
      values.serverNotifierAddress:
-        "0x0000000000000000000000000000000000000000"
+        "0xfca808A744735D9919EEBe4660B8Fd897456Ce31"
    }
```

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      values.$members.4:
-        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.3:
-        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
+        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.2:
-        "0x41814626a9256173B6E6441d8133F9286F02AA16"
+        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
      values.$members.1:
-        "0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0"
+        "0x41814626a9256173B6E6441d8133F9286F02AA16"
      values.$members.0:
-        "0xB5676D771b538D8E184EaCB1Cc7a963a4bF99252"
+        "0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0"
      values.multisigThreshold:
-        "1 of 5 (20%)"
+        "1 of 4 (25%)"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ServerNotifier (0xfca808A744735D9919EEBe4660B8Fd897456Ce31)
    +++ description: A simple contract that can be called by the ChainAdmin to emit notifications about chain migrations.
```

## Source code changes

```diff
...-0x257FC0c3EB02F7ba8C0fd3eD57692A9c1ee6D29B.sol | 151 +++++
 .../.flat/ServerNotifier/ServerNotifier.sol        | 602 +++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              | 729 +++++++++++++++++++++
 3 files changed, 1482 insertions(+)
```

Generated with discovered.json: 0x580368f29129a9f62fd2de055e18d599722c27e0

# Diff at Fri, 13 Jun 2025 08:32:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@47036f369616cc0b23ec8b94f0706f5c105ac1f5 block: 22615717
- current block number: 22694404

## Description

gateway is whitelisted as a settlement layer. we have triggers defined for any chain migration.

also: migration is currently paused for the entire zk stack.

also: sub-ms signer change.

also: add manual chain admin permission because the template one gets blackholed.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: If false, chains can migrate to whitelisted settlement layers.
+++ severity: HIGH
      values.migrationPaused:
-        false
+        true
+++ description: New settlement layers and their whitelist status. Chains can be migrated to whitelisted settlement layers by their chain admin.
+++ severity: HIGH
      values.settlementLayers.9075:
+        true
    }
```

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      values.$members.4:
+        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.3:
+        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
      values.$members.2:
-        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
+        "0x41814626a9256173B6E6441d8133F9286F02AA16"
      values.$members.1:
-        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
+        "0xf10697cd80FFc0A70bc8E9ab03D6D6596cc143E0"
      values.multisigThreshold:
-        "1 of 3 (33%)"
+        "1 of 5 (20%)"
    }
```

Generated with discovered.json: 0xf1ecaded2ebfa21b7a954758d8aea74ee75e8ae8

# Diff at Mon, 02 Jun 2025 08:10:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22594206
- current block number: 22615717

## Description

sub ms signer change.

## Watched changes

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      values.$members.3:
-        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.2:
-        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
+        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.1:
-        "0xb9e3C7BbC0677dD018254C74B5ed2Ad90a0dba9F"
+        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
      values.multisigThreshold:
-        "1 of 4 (25%)"
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x5083a32bfa506d97f8ca78a3930bce4d5e934a13

# Diff at Fri, 30 May 2025 07:58:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22572946
- current block number: 22594206

## Description

subsafe signer change.

## Watched changes

```diff
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a) {
    +++ description: None
      values.$members.1:
-        "0x1462112B5abdc5577Cbd25a9cAbB4C4d5979D697"
+        "0xd20a09d16964aefc8c8c5355C5141f54274521c7"
      values.$members.0:
-        "0xd20a09d16964aefc8c8c5355C5141f54274521c7"
+        "0xDF1aa0495C815A1b9156796a741885a4834EC012"
    }
```

Generated with discovered.json: 0xccde5188651e730a5816c89f36d4d0f48e0312fd

# Diff at Fri, 30 May 2025 07:58:07 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 60946125
- current block number: 61100811

## Description

ZK minter add.

## Watched changes

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.11:
+        "0xb294F411cB52c7C6B6c0B0b61DBDf398a8b0725d"
      values.accessControl.MINTER_ROLE.members.10:
+        "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4"
      values.accessControl.MINTER_ROLE.members.9:
-        "0xb294F411cB52c7C6B6c0B0b61DBDf398a8b0725d"
+        "0x51E818785dEa065D392ac21F04E9cac5B601Cfd8"
      values.accessControl.MINTER_ROLE.members.8:
-        "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4"
+        "0x0681E3808a0aA12004fb815ebB4515DC823cfbb4"
      values.accessControl.MINTER_ROLE.members.7:
-        "0x0681E3808a0aA12004fb815ebB4515DC823cfbb4"
+        "0xf29D698E74EF1904BCFDb20Ed38f9F3EF0A89E5b"
      values.accessControl.MINTER_ROLE.members.6:
-        "0xf29D698E74EF1904BCFDb20Ed38f9F3EF0A89E5b"
+        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
      values.accessControl.MINTER_ROLE.members.5:
-        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
+        "0x0Ad50686C159040E57ddcE137Db0b63c67473450"
      values.accessControl.MINTER_ROLE.members.4:
-        "0x0Ad50686C159040E57ddcE137Db0b63c67473450"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.3:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "0x70F6998FC0c492d9DD08b1105259252329be9Db6"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      values.proposalQueuedCount:
-        9
+        11
    }
```

Generated with discovered.json: 0x6ac3ef0025475d671bf9fe885e5d3bbd10e96e8d

# Diff at Tue, 27 May 2025 08:31:33 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 60151606
- current block number: 60946125

## Description

remove old minter contracts from the ZK token. new proposals in the non-protocol tracks.

## Watched changes

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.19:
-        "0xb294F411cB52c7C6B6c0B0b61DBDf398a8b0725d"
      values.accessControl.MINTER_ROLE.members.18:
-        "0x4E86e74237Eb1f9432810eB5ab5861368d2f5964"
      values.accessControl.MINTER_ROLE.members.17:
-        "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4"
      values.accessControl.MINTER_ROLE.members.16:
-        "0x6b689B93B368c7C25E6e5ecaeAb23C11F8C2c392"
      values.accessControl.MINTER_ROLE.members.15:
-        "0x0681E3808a0aA12004fb815ebB4515DC823cfbb4"
      values.accessControl.MINTER_ROLE.members.14:
-        "0xf29D698E74EF1904BCFDb20Ed38f9F3EF0A89E5b"
      values.accessControl.MINTER_ROLE.members.13:
-        "0xe546AEaaC57584da7554e7F88154DeDAD30A82b0"
      values.accessControl.MINTER_ROLE.members.12:
-        "0x3BC3f64d084bE6d3336f10340DC8424290FFc4ab"
      values.accessControl.MINTER_ROLE.members.11:
-        "0x11791c6249631555cEb75CB39128789E3954c2EC"
      values.accessControl.MINTER_ROLE.members.10:
-        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
      values.accessControl.MINTER_ROLE.members.9:
-        "0x2CC6c7b1a59A23fB3faCAFe4A3791C5c8A58Cbcc"
+        "0xb294F411cB52c7C6B6c0B0b61DBDf398a8b0725d"
      values.accessControl.MINTER_ROLE.members.8:
-        "0x178bFf5A197FB4499526D04Db602C45cEDCA40a9"
+        "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4"
      values.accessControl.MINTER_ROLE.members.7:
-        "0x0Ad50686C159040E57ddcE137Db0b63c67473450"
+        "0x0681E3808a0aA12004fb815ebB4515DC823cfbb4"
      values.accessControl.MINTER_ROLE.members.6:
-        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
+        "0xf29D698E74EF1904BCFDb20Ed38f9F3EF0A89E5b"
      values.accessControl.MINTER_ROLE.members.5:
-        "0xD375A20d93C2F7C6a83B19C5ae153cF2C6e09ba9"
+        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
      values.accessControl.MINTER_ROLE.members.4:
-        "0xa97fBc75CcbC7d4353C4D2676ed18Cd0C5AaF7e6"
+        "0x0Ad50686C159040E57ddcE137Db0b63c67473450"
      values.accessControl.MINTER_ROLE.members.3:
-        "0xD78dc27D4dB8f428C67f542216a2b23663838405"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.2:
-        "0x2ADa5C15BC4FEE97EC2463ce4F8E4557174B8Dcf"
+        "0xa97fBc75CcbC7d4353C4D2676ed18Cd0C5AaF7e6"
      values.accessControl.MINTER_ROLE.members.1:
-        "0xDa2fBE31Fd47Af741bdB3dBC4eb662dA0107D33a"
+        "0xD78dc27D4dB8f428C67f542216a2b23663838405"
    }
```

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      values.proposalQueuedCount:
-        0
+        2
    }
```

```diff
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      values.proposalQueuedCount:
-        0
+        1
    }
```

Generated with discovered.json: 0x44c75b3e0dd50cd00d20be6abd35f1c47ecff3df

# Diff at Tue, 27 May 2025 08:31:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22496282
- current block number: 22572946

## Description

Config: add migration tracking.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22496282 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: zk chain migrations that were started
+++ severity: HIGH
      values.migrations:
+        []
      fieldMeta.migrations:
+        {"severity":"HIGH","description":"zk chain migrations that were started"}
    }
```

Generated with discovered.json: 0x73a6d33a2ebb572dac957e59c35c37a0de33eea0

# Diff at Fri, 23 May 2025 09:41:10 GMT:

- chain: zksync2
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 60151606
- current block number: 60151606

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 60151606 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    EOA Guardians_l2Alias (0x711ea620AB29f41AbC6596a15981e14ce58C97c9) {
    +++ description: None
      receivedPermissions.1.role:
+        ".VETO_GUARDIAN"
      receivedPermissions.0.role:
+        ".VETO_GUARDIAN"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.7.role:
+        ".Executor"
      receivedPermissions.6.role:
+        ".Executor"
      receivedPermissions.5.role:
+        ".Proposer"
      receivedPermissions.4.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.4.description:
-        "propose transactions."
+        "cancel queued transactions."
      receivedPermissions.4.role:
+        ".Canceller"
      receivedPermissions.3.from:
-        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
+        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
      receivedPermissions.3.description:
-        "cancel queued transactions."
+        "propose transactions."
      receivedPermissions.3.role:
+        ".Proposer"
      receivedPermissions.2.role:
+        ".Canceller"
      receivedPermissions.1.role:
+        ".timelockAdminAC"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.1.role:
+        ".Executor"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.4.role:
+        ".MinterAdmin"
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".timelockAdminAC"
      receivedPermissions.1.role:
+        ".Proposer"
      receivedPermissions.0.role:
+        ".Canceller"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract GovOpsTimelockController (0xC9E442574958f96C026DeF9a50C3236cab17428a) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    EOA ZKFoundationMultisig_l2Alias (0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D) {
    +++ description: None
      receivedPermissions.0.role:
+        ".PROPOSE_GUARDIAN"
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ZkTokenTimelockController (0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.1.role:
+        ".MinterAdmin"
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.3.role:
+        ".Executor"
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    EOA ProtocolUpgradeHandler_l2Alias (0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4) {
    +++ description: None
      receivedPermissions.0.role:
+        ".DefaultAdmin"
    }
```

Generated with discovered.json: 0x549f6db2a17c41223d7aac5081b7692aad5f198d

# Diff at Fri, 23 May 2025 09:41:10 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22496282
- current block number: 22496282

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22496282 (main branch discovery), not current.

```diff
    EOA ProtocolTimelockController(L2->L1) (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: None
      receivedPermissions.0.role:
+        ".L2_PROTOCOL_GOVERNOR"
    }
```

```diff
    contract ProxyAdmin (0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      directlyReceivedPermissions.1.role:
+        ".admin"
      directlyReceivedPermissions.0.role:
+        ".admin"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      receivedPermissions.1.role:
+        ".admin"
      receivedPermissions.0.role:
+        ".admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      receivedPermissions.1.role:
+        ".guardians"
      receivedPermissions.0.role:
+        ".GUARDIANS"
    }
```

```diff
    contract SecurityCouncil (0x66E4431266DC7E04E7d8b7FE9d2181253df7F410) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      receivedPermissions.1.role:
+        ".securityCouncil"
      receivedPermissions.0.role:
+        ".SECURITY_COUNCIL"
    }
```

```diff
    contract ZK Foundation Multisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      receivedPermissions.0.role:
+        ".ZK_FOUNDATION_SAFE"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      directlyReceivedPermissions.5.role:
+        ".owner"
      directlyReceivedPermissions.4.role:
+        ".owner"
      directlyReceivedPermissions.3.role:
+        ".owner"
      directlyReceivedPermissions.2.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.7.from:
-        "0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.7.description:
-        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
      receivedPermissions.7.via.1:
+        {"address":"0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"}
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      receivedPermissions.6.via.1.address:
-        "0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.4.from:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      receivedPermissions.4.description:
-        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
      receivedPermissions.4.via.1:
+        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
      receivedPermissions.3.via.1:
-        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      receivedPermissions.3.description:
+        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.2.via.1:
-        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      receivedPermissions.2.description:
+        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".emergencyUpgradeBoard"
    }
```

Generated with discovered.json: 0xef8d564dad79326bcd20932896350ba05a834f44

# Diff at Fri, 16 May 2025 14:40:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e002413ca40890ffd9150afa1422bcb6338725ba block: 22481824
- current block number: 22496282

## Description

emergency upgrade executed (see abstract diff).

signer changes.

## Watched changes

```diff
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803) {
    +++ description: None
      values.$members.8:
+        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
      values.$members.7:
+        "0x98E24e308c4B7cdADcf4d116B2B8939a21420bA1"
      values.$members.6:
-        "0xd757D6A02cD5af9AEF163D7eB8034f75ac22B553"
+        "0xC2Cd2330A575af7f124E07820E7c4AbfaeD02392"
      values.$members.5:
-        "0xC2Cd2330A575af7f124E07820E7c4AbfaeD02392"
+        "0x7DcA405b791CdE56aA60f036C95ec2Efe283647e"
      values.$members.4:
-        "0x7DcA405b791CdE56aA60f036C95ec2Efe283647e"
+        "0xc8E2806A97413b5496A1ba6050b517CC98D0EfCA"
      values.$members.3:
-        "0xc8E2806A97413b5496A1ba6050b517CC98D0EfCA"
+        "0xBab69188f07F2569A41C5B875e147216D974eB3e"
      values.$members.2:
-        "0xBab69188f07F2569A41C5B875e147216D974eB3e"
+        "0x239cCb0a6Fc59fc6A53584613707F815503a6aAF"
      values.$members.1:
-        "0x239cCb0a6Fc59fc6A53584613707F815503a6aAF"
+        "0xe2eB80C72Fa12Ba50B3bD6545709DC153D5b26D2"
      values.multisigThreshold:
-        "1 of 7 (14%)"
+        "1 of 9 (11%)"
    }
```

```diff
    contract ZK Foundation Multisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      values.$members.3:
-        "0xd5966E3dd25f6086b6aD7D7Fa3292d11b988da95"
+        "0xA10fcD4B012467FAC48ce63838B7bE56AB16bE52"
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
+++ severity: HIGH
      values.emergencyUpgradesExecuted.1:
+        "0xa34bdc028de549c0fbd0374e64eb5977e78f62331f6a55f4f2211348c4902d13"
+++ severity: HIGH
      values.emergencyUpgradesExecuted.0:
-        "0xa34bdc028de549c0fbd0374e64eb5977e78f62331f6a55f4f2211348c4902d13"
+        "0x09a5358047d9d0898d14c31823e9ea544f5f33c280441d1f34d5cc6dafe7a055"
    }
```

Generated with discovered.json: 0x08582c0d6231062a036f71ee48f13e25ba73f564

# Diff at Wed, 14 May 2025 14:02:05 GMT:

- chain: zksync2
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3e40b87963942c5b1b364373f150a7eda9e4eccd block: 60151606
- current block number: 60151606

## Description

Max upgrade count flag updated (after change to algo to scope per chain).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 60151606 (main branch discovery), not current.

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x79b4df69baa0d32210e5bdf125498d68403727a4

# Diff at Wed, 14 May 2025 13:54:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e40b87963942c5b1b364373f150a7eda9e4eccd block: 22437978
- current block number: 22481824

## Description

New chain deployed with chainID 9075 and an unknown gas token called ZK.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: All new chains created go thorugh the central bridgehub and are stored here with their respective STMs.
      values.chainsCreated.15:
+        {"chainId":9637,"chainTypeManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
      values.chainsCreated.14.chainId:
-        9637
+        388
      values.chainsCreated.14.chainGovernance:
-        "0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
      values.chainsCreated.13.chainId:
-        388
+        325
      values.chainsCreated.13.chainGovernance:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      values.chainsCreated.12.chainId:
-        325
+        320
      values.chainsCreated.12.chainGovernance:
-        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
+        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.chainsCreated.11.chainId:
-        320
+        324
      values.chainsCreated.11.chainGovernance:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
      values.chainsCreated.10.chainId:
-        324
+        51888
      values.chainsCreated.10.chainGovernance:
-        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
+        "0x21bFaD8F0f781F367ACCb5276199B0c0E819CbD9"
      values.chainsCreated.9.chainId:
-        51888
+        50104
      values.chainsCreated.9.chainGovernance:
-        "0x21bFaD8F0f781F367ACCb5276199B0c0E819CbD9"
+        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
      values.chainsCreated.8.chainId:
-        50104
+        543210
      values.chainsCreated.8.chainGovernance:
-        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
+        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
      values.chainsCreated.7.chainId:
-        543210
+        1217
      values.chainsCreated.7.chainGovernance:
-        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
+        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
      values.chainsCreated.6.chainId:
-        1217
+        375
      values.chainsCreated.6.chainGovernance:
-        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
+        "0x6ec9117dCFBe2E8Dd747c9D45034E2DF9C7d2da0"
      values.chainsCreated.5.chainId:
-        375
+        2741
      values.chainsCreated.5.chainGovernance:
-        "0x6ec9117dCFBe2E8Dd747c9D45034E2DF9C7d2da0"
+        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
      values.chainsCreated.4.chainId:
-        2741
+        1345
      values.chainsCreated.4.chainGovernance:
-        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "0x49664fFe2c2335c28631629606E26a6971aEf261"
      values.chainsCreated.3.chainId:
-        1345
+        232
      values.chainsCreated.3.chainGovernance:
-        "0x49664fFe2c2335c28631629606E26a6971aEf261"
+        "0x0000000000000000000000000000000000000000"
      values.chainsCreated.2.chainId:
-        232
+        61166
      values.chainsCreated.2.chainGovernance:
-        "0x0000000000000000000000000000000000000000"
+        "0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
      values.chainsCreated.1.chainId:
-        61166
+        2904
      values.chainsCreated.1.chainGovernance:
-        "0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
      values.chainsCreated.0.chainId:
-        2904
+        9075
      values.chainsCreated.0.chainGovernance:
-        "0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
+        "0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3"
      values.getAllZKChainChainIDs.15:
+        388
      values.getAllZKChainChainIDs.14:
-        388
+        375
      values.getAllZKChainChainIDs.13:
-        375
+        325
      values.getAllZKChainChainIDs.12:
-        325
+        324
      values.getAllZKChainChainIDs.11:
-        324
+        320
      values.getAllZKChainChainIDs.10:
-        320
+        232
      values.getAllZKChainChainIDs.9:
-        232
+        9637
      values.getAllZKChainChainIDs.8:
-        9637
+        9075
      values.getAllZKChains.15:
+        "0xD231E2fD0DeC5993fCeae3E504930631876e8C63"
      values.getAllZKChains.14:
-        "0xD231E2fD0DeC5993fCeae3E504930631876e8C63"
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllZKChains.13:
-        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
+        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      values.getAllZKChains.12:
-        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
      values.getAllZKChains.11:
-        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
+        "0x32400084C286CF3E17e7B677ea9583e60a000324"
      values.getAllZKChains.10:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
+        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
      values.getAllZKChains.9:
-        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      values.getAllZKChains.8:
-        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
      values.getAllZKChains.7:
-        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
+        "0x89f90748A9a36C30A324481133fa198f4E16A824"
      values.getAllZKChains.6:
-        "0x89f90748A9a36C30A324481133fa198f4E16A824"
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      values.getAllZKChains.5:
-        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
+        "0x742A28e22277945BBAAa34810393bf6e8512576C"
      values.getAllZKChains.4:
-        "0x742A28e22277945BBAAa34810393bf6e8512576C"
+        "0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
      values.getAllZKChains.3:
-        "0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
+        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
      values.getAllZKChains.2:
-        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
      values.getAllZKChains.1:
-        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "0x270bF3978FeA60719Dd25A400EbE6969bF451493"
      values.getAllZKChains.0:
-        "0x270bF3978FeA60719Dd25A400EbE6969bF451493"
+        "0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      values.chainCount:
-        16
+        17
      values.getAggregatedRoot:
-        "0xd893aacecf7a4ed2d1aa0c30c3b52d12388abecacbaa7b6e63a5a7f00178f1cf"
+        "0x3915543a6d021896bf955b7f4eb63ef57a27b8b1412eb83de831d169ff0db864"
    }
```

Generated with discovered.json: 0x0cb2d2c9b68b3e0d3747cb138cfbb16f908ab931

# Diff at Fri, 09 May 2025 11:21:54 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b9a3516de49f42efd9d26f04918d74a8d92c6204 block: 60094914
- current block number: 60151606

## Description

Config related.

## Watched changes

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 60094914 (main branch discovery), not current.

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x43a3ff23daf457122d501c922b4499f6c6df9507

# Diff at Thu, 08 May 2025 09:50:11 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 59465384
- current block number: 60094914

## Description

Config related.

## Watched changes

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 59465384 (main branch discovery), not current.

```diff
    EOA ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xe2f8451543b5671bfb1c462ff54621b82357a232

# Diff at Thu, 08 May 2025 09:50:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22423769
- current block number: 22437978

## Description

New zk stack chain deployed: chainid 51888, validium, ETH for gas.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: All new chains created go thorugh the central bridgehub and are stored here with their respective STMs.
      values.chainsCreated.14:
+        {"chainId":9637,"chainTypeManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
      values.chainsCreated.13.chainId:
-        9637
+        388
      values.chainsCreated.13.chainGovernance:
-        "0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
      values.chainsCreated.12.chainId:
-        388
+        325
      values.chainsCreated.12.chainGovernance:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      values.chainsCreated.11.chainId:
-        325
+        320
      values.chainsCreated.11.chainGovernance:
-        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
+        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.chainsCreated.10.chainId:
-        320
+        324
      values.chainsCreated.10.chainGovernance:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
      values.chainsCreated.9.chainId:
-        324
+        51888
      values.chainsCreated.9.chainGovernance:
-        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
+        "0x21bFaD8F0f781F367ACCb5276199B0c0E819CbD9"
      values.getAllZKChainChainIDs.14:
+        388
      values.getAllZKChainChainIDs.13:
-        388
+        375
      values.getAllZKChainChainIDs.12:
-        375
+        325
      values.getAllZKChainChainIDs.11:
-        325
+        324
      values.getAllZKChainChainIDs.10:
-        324
+        320
      values.getAllZKChainChainIDs.9:
-        320
+        232
      values.getAllZKChainChainIDs.8:
-        232
+        9637
      values.getAllZKChainChainIDs.7:
-        9637
+        2904
      values.getAllZKChainChainIDs.6:
-        2904
+        2741
      values.getAllZKChainChainIDs.5:
-        2741
+        1345
      values.getAllZKChainChainIDs.4:
-        1345
+        1217
      values.getAllZKChainChainIDs.3:
-        1217
+        61166
      values.getAllZKChainChainIDs.2:
-        61166
+        51888
      values.getAllZKChains.14:
+        "0xD231E2fD0DeC5993fCeae3E504930631876e8C63"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      values.chainCount:
-        15
+        16
      values.getAggregatedRoot:
-        "0x5054187811209ac55f16381dbcbbfb219fd033e43b680f7649de648ba69daaa6"
+        "0xd893aacecf7a4ed2d1aa0c30c3b52d12388abecacbaa7b6e63a5a7f00178f1cf"
    }
```

Generated with discovered.json: 0x7f3103d711ae6ddefe7a0dce96c1114b9ac568c2

# Diff at Tue, 06 May 2025 09:28:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@797a9ec756b28fc8b608c3143fbee4e577108cbc block: 22382816
- current block number: 22423769

## Description

v27 upgrade for zksync era executed.

## Watched changes

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.3:
+        {"_protocolVersion":115964116992,"_upgradeTimestamp":1746435600}
    }
```

Generated with discovered.json: 0x63d08ed4115a5738396e2ddc41b1fa96771de4a8

# Diff at Wed, 30 Apr 2025 15:49:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7e552dc46a020318c06ae0f56471c26a9b8ef3f5 block: 22281621
- current block number: 22382816

## Description

v27 upgrade: Minor L1 contract changes (maintenance) and deployment of new diamond cut data for v27 (EVM emulation).

## Watched changes

```diff
-   Status: DELETED
    contract L1GenesisUpgrade (0x107e92E7360e595d8129B522ABD458361f32f66C)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      sourceHashes.1:
-        "0xe79288af01ff8940265966caffdc9ea0ef18822166fd7f704488419737716623"
+        "0x85a0337c9b2db31a1b7e623ed99509d22ead32ce301ae832247ee1240f43eccb"
      values.$implementation:
-        "0xb720523EC3c615b069453bF4B0584CEbF034706f"
+        "0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87"
      values.$pastUpgrades.4:
+        ["2024-06-04T17:03:59.000Z","0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61",["0x12f893689f9603991a8c22C249FFd0509Be95661"]]
      values.$pastUpgrades.3.2:
-        ["0x12f893689f9603991a8c22C249FFd0509Be95661"]
+        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
      values.$pastUpgrades.3.1:
-        "2024-06-04T17:03:59.000Z"
+        "2025-04-28T12:33:11.000Z"
      values.$pastUpgrades.3.0:
-        "0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61"
+        ["0xcdd748d4A80CE6831080f1dA2CA9084CDa87Cc87"]
      values.$upgradeCount:
-        4
+        5
    }
```

```diff
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56) {
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
      sourceHashes.1:
-        "0x1912c5e1125a20bfd6b933a66a437e3d04e2404549b86b88ceadb233eff05477"
+        "0xba83b7c168ffa78d2e714cfb804ca1cd4f33807f6e9b2abb2820457d6d2bf77a"
      values.$implementation:
-        "0x20E17D0280DeaBb78f7c193E3Ef05F62adC0936E"
+        "0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315"
      values.$pastUpgrades.1:
+        ["2025-04-28T12:33:11.000Z","0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132",["0xcaD49896F3d54d9A93eDdBFd370c8A4a1b239315"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6) {
    +++ description: Part of the v26 upgrade: Canonical central asset escrow for all ZK stack chains.
      sourceHashes.1:
-        "0xcd61d013f1b30811a4dab3d32b43daa9f826ed31663857c1e349c7986cdf2497"
+        "0xb5c84cdd8085d4ad38124e19b8be87360c9401f9621534284de4ed5fa69c3b63"
      values.$implementation:
-        "0x40B1060a114380f40faC6869c5B383f47e61530c"
+        "0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947"
      values.$pastUpgrades.1:
+        ["2025-04-28T12:33:11.000Z","0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132",["0xDf3a3E51aEABB5da548F854B608E3C9De1ae2947"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,27,0.
      sourceHashes.1:
-        "0xf6789714ce74a28098dbbf1bb19c228c5c72b5a0756925b2f1c4b8ea9c072e37"
+        "0x5462a6c55c6e9f2d98c21f2588b2b9a4de1dc41ba0c10906f8965e21849a3a52"
      description:
-        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,26,0."
+        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,27,0."
      values.$implementation:
-        "0xA3bCcAEe38cb0273A979118a0DE483E47D50F6Cb"
+        "0x6D598c77AF57Bfa17201483400615c61819dD45A"
      values.$pastUpgrades.4:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"]]
      values.$pastUpgrades.3.2:
-        ["0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"]
+        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
      values.$pastUpgrades.3.1:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        ["0x6D598c77AF57Bfa17201483400615c61819dD45A"]
      values.$pastUpgrades.3.0:
-        "2025-01-08T16:00:35.000Z"
+        "2025-04-28T12:33:11.000Z"
      values.$upgradeCount:
-        4
+        5
      values.getSemverProtocolVersion.0:
-        26
+        27
      values.initialCutHash:
-        "0x1f2fc821f3af8fc4dae46f80a28e8b582ace20e83a979acacf6ecbd0e9b4fcea"
+        "0xd20b12f6c5152e7197db37e19b177d22a369c32230fbbc2bfeec5b39788afd8c"
      values.initialForceDeploymentHash:
-        "0x5d46606048f0821e6ce823fd9cc257b47818b44dffed0bc21489e23ab242d0e1"
+        "0x48dac090fa2f13afa11b2ea3f456fb424cef704d997bd137575a5fe9c5c3241a"
      values.l1GenesisUpgrade:
-        "0x107e92E7360e595d8129B522ABD458361f32f66C"
+        "0xC5bBb8bA0302215Da343D47EC617649E59c7d61C"
      values.protocolVersion:
-        111669149696
+        115964116992
      values.storedBatchZero:
-        "0x30624ae13932bc83804b007160a60b2394893f6097d5f7062de441172adc4749"
+        "0xe3199bb31e1acf8a1667692d8536edcce799c58cfebe85e3e0adeb0ae788b291"
      values.serverNotifierAddress:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract L1Nullifier (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
      sourceHashes.1:
-        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
+        "0x56a8f9e2feec75535d897e8159a8cdf1546d81df34f77964c66bc908820e8687"
      sourceHashes.0:
-        "0x1d68adefefffd4b896740e985d1d7d39abbface4239c0fb54cbda7892ce8c99d"
+        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
      values.$implementation:
-        "0xda2866AF0e170d0867a3F3bB52Db10D6E09Df78A"
+        "0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518"
      values.$pastUpgrades.4:
+        ["2024-08-26T07:51:11.000Z","0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c",["0xb56A8225A745756DD215faf22E4796f373561AcD"]]
      values.$pastUpgrades.3.2.0:
-        "0xb56A8225A745756DD215faf22E4796f373561AcD"
+        "0xF5A14DCdde1143443f06033200D345c2a2828A99"
      values.$pastUpgrades.3.1:
-        "2024-08-26T07:51:11.000Z"
+        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
      values.$pastUpgrades.3.0:
-        "0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c"
+        "2025-01-08T16:00:35.000Z"
      values.$pastUpgrades.2.2:
-        ["0xF5A14DCdde1143443f06033200D345c2a2828A99"]
+        "0x1fbaad1ac4bffb295da999881a37c1a52751ccad9b1533c0d2400fdca3631132"
      values.$pastUpgrades.2.1:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        "2025-04-28T12:33:11.000Z"
      values.$pastUpgrades.2.0:
-        "2025-01-08T16:00:35.000Z"
+        ["0x3B4FD84B27fE7B9247d5B8C6d1A29B2889C81518"]
      values.$upgradeCount:
-        4
+        5
    }
```

```diff
    contract RollupDAManager (0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45) {
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
+++ severity: HIGH
      values.daPairs.1:
+        {"l1DAValidator":"0x72213dfe8CA61B0A782970dCFebFb877778f9119","l2DAValidator":"0x64E2AfcFE648201b2F4a749aF0B7229ecfa44281","status":true}
    }
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (0xC5bBb8bA0302215Da343D47EC617649E59c7d61C)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

## Source code changes

```diff
.../BridgeHub/Bridgehub.sol                        |  8 ++-
 .../ChainTypeManager/ChainTypeManager.sol          | 16 +++++
 .../L1AssetRouter/L1AssetRouter.sol                | 20 +++----
 .../{.flat@22281621 => .flat}/L1GenesisUpgrade.sol | 69 +++++++++++++++++++---
 .../L1NativeTokenVault/L1NativeTokenVault.sol      | 17 +++---
 .../L1Nullifier/L1Nullifier.sol                    | 10 +++-
 6 files changed, 107 insertions(+), 33 deletions(-)
```

Generated with discovered.json: 0x0a6772033009be788ef753319cecfd2951adc5b2

# Diff at Tue, 29 Apr 2025 09:41:07 GMT:

- chain: zksync2
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 59465384
- current block number: 59465384

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 59465384 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      issuedPermissions:
-        [{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"manage all access control roles and change the minimum delay.","via":[{"address":"0x085b8B6407f150D62adB1EF926F7f304600ec714"}]},{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      issuedPermissions:
-        [{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"manage all access control roles and change the minimum delay.","via":[{"address":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}]},{"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions:
-        [{"permission":"interact","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","delay":259200,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]},{"permission":"interact","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      issuedPermissions:
-        [{"permission":"interact","to":"0xb83FF6501214ddF40C91C9565d095400f3F45746","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d","delay":259200}]},{"permission":"interact","to":"0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4","description":"control all roles in the ZkToken access control, including the minter roles.","via":[]},{"permission":"upgrade","to":"0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8","via":[{"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]}]
    }
```

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      issuedPermissions:
-        [{"permission":"interact","to":"0x711ea620AB29f41AbC6596a15981e14ce58C97c9","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]},{"permission":"interact","to":"0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false.","via":[]}]
    }
```

```diff
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions:
-        [{"permission":"interact","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","delay":259200,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200}]},{"permission":"interact","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract GovOpsTimelockController (0xC9E442574958f96C026DeF9a50C3236cab17428a) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions:
-        [{"permission":"interact","to":"0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160","delay":259200,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xC9E442574958f96C026DeF9a50C3236cab17428a","delay":259200}]},{"permission":"interact","to":"0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract ZkTokenTimelockController (0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions:
-        [{"permission":"interact","to":"0xb83FF6501214ddF40C91C9565d095400f3F45746","delay":259200,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d","delay":259200}]},{"permission":"interact","to":"0xb83FF6501214ddF40C91C9565d095400f3F45746","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xb83FF6501214ddF40C91C9565d095400f3F45746","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0xb83FF6501214ddF40C91C9565d095400f3F45746","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      issuedPermissions:
-        [{"permission":"interact","to":"0x711ea620AB29f41AbC6596a15981e14ce58C97c9","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
    }
```

Generated with discovered.json: 0xa18e8f6b7461533079ddeaa1545fa7d542388152

# Diff at Tue, 29 Apr 2025 09:41:07 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22281621
- current block number: 22281621

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22281621 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4e4943346848c4867F81dFb37c4cA9C5715A7828","description":"create new zk chains (based on the current version), register tokens (ZK cluster Admin role).","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"permission":"interact","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","description":"set critical system contract addresses, register settlement layers, pause and unpause and manage zk chain registration.","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]},{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}]
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}]
    }
```

```diff
    contract CTMDeploymentTracker (0x6078F6B379f103de1Aa912dc46bb8Df0c8809860) {
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}]
    }
```

```diff
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56) {
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}]
    }
```

```diff
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6) {
    +++ description: Part of the v26 upgrade: Canonical central asset escrow for all ZK stack chains.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}]
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,26,0.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4e4943346848c4867F81dFb37c4cA9C5715A7828","description":"revert batches for any connected chain (ZK cluster Admin role).","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"permission":"interact","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","description":"manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains.","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]},{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}]
    }
```

```diff
    contract L1Nullifier (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","description":"pause, unpause and set critical escrow address references.","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]},{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}]
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      issuedPermissions:
-        [{"permission":"interact","to":"0x085b8B6407f150D62adB1EF926F7f304600ec714","description":"start (queue) upgrades.","via":[]},{"permission":"interact","to":"0x600dA620Ab29F41ABC6596a15981e14cE58c86b8","description":"extend the legal veto period, approve a protocol upgrade.","via":[]},{"permission":"interact","to":"0x66E4431266DC7E04E7d8b7FE9d2181253df7F410","description":"soft freeze, hard freeze, approve a protocol upgrade.","via":[]},{"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"}]}]
    }
```

```diff
    contract RollupDAManager (0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45) {
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
      issuedPermissions:
-        [{"permission":"interact","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","description":"manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode).","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}]
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      issuedPermissions:
-        [{"permission":"interact","to":"0x600dA620Ab29F41ABC6596a15981e14cE58c86b8","description":"one of its 3/3 signers.","via":[]},{"permission":"interact","to":"0x66E4431266DC7E04E7d8b7FE9d2181253df7F410","description":"one of its 3/3 signers.","via":[]},{"permission":"interact","to":"0xbC1653bd3829dfEc575AfC3816D4899cd103B51c","description":"one of its 3/3 signers.","via":[]}]
    }
```

Generated with discovered.json: 0x8c3263ccda583a59843916187172855c22b89838

# Diff at Tue, 22 Apr 2025 12:21:29 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@60b07eece04f1a17d258d39ff1adffbef4174f23 block: 57909592
- current block number: 59465384

## Description

[ZIP-9: V27 EVM Emulation Upgrade](https://www.tally.xyz/gov/zksync/proposal/112142012854508751423955156601121618924383324119199970784935099214632480260394?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) has arrived in the ProtocolUpgradeHandler.

can be executed from tomorrow, `l2b zkgovproposal 112142012854508751423955156601121618924383324119199970784935099214632480260394` excerpt:
```
================================================================================
L1 Upgrade Information
================================================================================

L1 Message Hash: 0x2d3883b5d936c6a3c8b4170c4735bbf437de601b3f5afaceeee27b6b52907574
L2 -> L1 Message Origin: Tx: 0xef8d3d6c0afde1cd9f867a82e32dad5a4fab54c7dc7f81f920fc611b0224540e

Estimated L1 Arrival: 2025-04-19T03:34:12.000Z (3d ago)

L1 Upgrade Started: Yes (Tx: 0xc59c407de7a9cc4c13fdf403165f91d6942a4f87ed27197324c298944518c474)
L1 Upgrade ID: 0x2d3883b5d936c6a3c8b4170c4735bbf437de601b3f5afaceeee27b6b52907574

L1 Upgrade State: LegalVetoPeriod

L1 Upgrade Timeline:
• Created: 2025-04-21T10:31:47.000Z (1d ago)
• Legal Veto Period End: 2025-04-24T10:31:47.000Z (in 1d)
• Guardians Approval: No
• Expires If Not Approved By: 2025-05-24T10:31:47.000Z (in 31d)

================================================================================
L2 vs L1 Payload Comparison
================================================================================

✓ L1 payload is contained within the L2 proposal
```

## Watched changes

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      values.proposalQueuedCount:
-        8
+        9
    }
```

Generated with discovered.json: 0xf13d42f97689394808e9aa92a8a89942e33b540c

# Diff at Wed, 16 Apr 2025 12:41:31 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@db872d8b788e204aeb64e983eeb7178891d61d76 block: 22267290
- current block number: 22281621

## Description

New chain deployed (admin associated with Caldera, chainID not yet found). Sub-MS changes.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: All new chains created go thorugh the central bridgehub and are stored here with their respective STMs.
      values.chainsCreated.13:
+        {"chainId":9637,"chainTypeManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
      values.chainsCreated.12.chainId:
-        9637
+        388
      values.chainsCreated.12.chainGovernance:
-        "0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
      values.chainsCreated.11.chainId:
-        388
+        325
      values.chainsCreated.11.chainGovernance:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      values.chainsCreated.10.chainId:
-        325
+        320
      values.chainsCreated.10.chainGovernance:
-        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
+        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.chainsCreated.9.chainId:
-        320
+        324
      values.chainsCreated.9.chainGovernance:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
      values.chainsCreated.8.chainId:
-        324
+        50104
      values.chainsCreated.8.chainGovernance:
-        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
+        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
      values.chainsCreated.7.chainId:
-        50104
+        543210
      values.chainsCreated.7.chainGovernance:
-        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
+        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
      values.chainsCreated.6.chainId:
-        543210
+        1217
      values.chainsCreated.6.chainGovernance:
-        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
+        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
      values.chainsCreated.5.chainId:
-        1217
+        375
      values.chainsCreated.5.chainGovernance:
-        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
+        "0x6ec9117dCFBe2E8Dd747c9D45034E2DF9C7d2da0"
      values.getAllZKChainChainIDs.13:
+        388
      values.getAllZKChainChainIDs.12:
-        388
+        375
      values.getAllZKChains.13:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllZKChains.12:
-        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
+        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      values.getAllZKChains.11:
-        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
      values.getAllZKChains.10:
-        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
+        "0x32400084C286CF3E17e7B677ea9583e60a000324"
      values.getAllZKChains.9:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
+        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
      values.getAllZKChains.8:
-        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      values.getAllZKChains.7:
-        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
      values.getAllZKChains.6:
-        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
+        "0x89f90748A9a36C30A324481133fa198f4E16A824"
      values.getAllZKChains.5:
-        "0x89f90748A9a36C30A324481133fa198f4E16A824"
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      values.getAllZKChains.4:
-        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
+        "0x742A28e22277945BBAAa34810393bf6e8512576C"
      values.getAllZKChains.3:
-        "0x742A28e22277945BBAAa34810393bf6e8512576C"
+        "0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
      values.getAllZKChains.2:
-        "0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
+        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
      values.getAllZKChains.1:
-        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
+        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
      values.getAllZKChains.0:
-        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
+        "0x270bF3978FeA60719Dd25A400EbE6969bF451493"
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      values.$members.7:
-        "0x227230CD05e89f41E67df3E5fC61B18411d147A9"
      values.$members.6:
-        "0x0e621b0A275A207211e161Ee997aA80661Bc1bcf"
      values.$members.5:
-        "0x160669864cDe95c190364ad01eDfbAA32E9DA430"
      values.$members.4:
-        "0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D"
      values.$members.3:
-        "0x7461633b1Fc7CdAa64A5B7bAb1b1F0145Acd7953"
      values.$members.2:
-        "0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001"
      values.$members.1:
-        "0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f"
      values.$members.0:
-        "0xb799FF3DeF706045B5061B22d748E8F52737415d"
+        "0x9f708301AA8CB86A06D23152fE67F2bFaa094cA1"
      values.$threshold:
-        5
+        1
      values.multisigThreshold:
-        "5 of 8 (63%)"
+        "1 of 1 (100%)"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      values.chainCount:
-        14
+        15
      values.getAggregatedRoot:
-        "0x3b831e3946c9e482436b4dd704221715c4a0737d68f4f4761ea6075405805771"
+        "0x5054187811209ac55f16381dbcbbfb219fd033e43b680f7649de648ba69daaa6"
    }
```

Generated with discovered.json: 0x93bc0e69ffc00980d10b7c93ca33bd2cc8f335ca

# Diff at Mon, 14 Apr 2025 12:41:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@22d5bd9958c2ffcb130d83154e0650da7c63f262 block: 22208565
- current block number: 22267290

## Description

new rollup deployed: [LaChain by Ripio](https://www.lachain.network/).

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: All new chains created go thorugh the central bridgehub and are stored here with their respective STMs.
      values.chainsCreated.12:
+        {"chainId":9637,"chainTypeManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
      values.chainsCreated.11.chainId:
-        9637
+        388
      values.chainsCreated.11.chainGovernance:
-        "0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
      values.chainsCreated.10.chainId:
-        388
+        325
      values.chainsCreated.10.chainGovernance:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      values.chainsCreated.9.chainId:
-        325
+        320
      values.chainsCreated.9.chainGovernance:
-        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
+        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.chainsCreated.8.chainId:
-        320
+        324
      values.chainsCreated.8.chainGovernance:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
      values.chainsCreated.7.chainId:
-        324
+        50104
      values.chainsCreated.7.chainGovernance:
-        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
+        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
      values.chainsCreated.6.chainId:
-        50104
+        543210
      values.chainsCreated.6.chainGovernance:
-        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
+        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
      values.chainsCreated.5.chainId:
-        543210
+        1217
      values.chainsCreated.5.chainGovernance:
-        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
+        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
      values.chainsCreated.4.chainId:
-        1217
+        2741
      values.chainsCreated.4.chainGovernance:
-        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
+        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
      values.chainsCreated.3.chainId:
-        2741
+        1345
      values.chainsCreated.3.chainGovernance:
-        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "0x49664fFe2c2335c28631629606E26a6971aEf261"
      values.chainsCreated.2.chainId:
-        1345
+        232
      values.chainsCreated.2.chainGovernance:
-        "0x49664fFe2c2335c28631629606E26a6971aEf261"
+        "0x0000000000000000000000000000000000000000"
      values.chainsCreated.1.chainId:
-        232
+        61166
      values.chainsCreated.1.chainGovernance:
-        "0x0000000000000000000000000000000000000000"
+        "0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
      values.chainsCreated.0.chainId:
-        61166
+        2904
      values.chainsCreated.0.chainGovernance:
-        "0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"
+        "0xc4F79BAb04664229eAEf3dBbc528Dd982df81EdD"
      values.getAllZKChainChainIDs.12:
+        388
      values.getAllZKChainChainIDs.11:
-        388
+        325
      values.getAllZKChainChainIDs.10:
-        325
+        324
      values.getAllZKChainChainIDs.9:
-        324
+        320
      values.getAllZKChainChainIDs.8:
-        320
+        232
      values.getAllZKChainChainIDs.7:
-        232
+        9637
      values.getAllZKChainChainIDs.6:
-        9637
+        2904
      values.getAllZKChains.12:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllZKChains.11:
-        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
+        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      values.getAllZKChains.10:
-        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
      values.getAllZKChains.9:
-        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
+        "0x32400084C286CF3E17e7B677ea9583e60a000324"
      values.getAllZKChains.8:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
+        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
      values.getAllZKChains.7:
-        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
+        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      values.getAllZKChains.6:
-        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
+        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
      values.getAllZKChains.5:
-        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
+        "0x89f90748A9a36C30A324481133fa198f4E16A824"
      values.getAllZKChains.4:
-        "0x89f90748A9a36C30A324481133fa198f4E16A824"
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      values.getAllZKChains.3:
-        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
+        "0x742A28e22277945BBAAa34810393bf6e8512576C"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      values.chainCount:
-        13
+        14
      values.getAggregatedRoot:
-        "0x619372ea4d229fc7921bbdcd7b46a64f151d566c0bf6d43cf1807bc6aa4629ad"
+        "0x3b831e3946c9e482436b4dd704221715c4a0737d68f4f4761ea6075405805771"
    }
```

Generated with discovered.json: 0xda1215aaae5b259d0bbe7241c15b75452d7c9979

# Diff at Thu, 10 Apr 2025 14:43:43 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 57909592
- current block number: 57909592

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 57909592 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      description:
-        "This timelock has a minimum delay of 0s. It does not have the L2_SENDER_ROLE yet."
+        "Timelock contract allowing the queueing of transactions with a minimum delay of 0s."
    }
```

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      category.name:
-        "Spam"
+        "Governance"
      category.priority:
-        -1
+        3
    }
```

```diff
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      category.name:
-        "Spam"
+        "Governance"
      category.priority:
-        -1
+        3
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      description:
-        "Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
    }
```

```diff
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      description:
-        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      description:
-        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
    }
```

Generated with discovered.json: 0x7269f33b27d3266c8d92c522d58572023b8467e4

# Diff at Sun, 06 Apr 2025 08:05:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22181739
- current block number: 22208565

## Description

new chain deployed: chainID 1217, ETH gas token validium, not active yet.
lens has launched. unfortunately the diamond proxy is not verified.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
+++ description: All new chains created go thorugh the central bridgehub and are stored here with their respective STMs.
      values.chainsCreated.11:
+        {"chainId":9637,"chainTypeManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
      values.chainsCreated.10.chainId:
-        9637
+        388
      values.chainsCreated.10.chainGovernance:
-        "0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
      values.chainsCreated.9.chainId:
-        388
+        325
      values.chainsCreated.9.chainGovernance:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      values.chainsCreated.8.chainId:
-        325
+        320
      values.chainsCreated.8.chainGovernance:
-        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
+        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.chainsCreated.7.chainId:
-        320
+        324
      values.chainsCreated.7.chainGovernance:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
      values.chainsCreated.6.chainId:
-        324
+        50104
      values.chainsCreated.6.chainGovernance:
-        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
+        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
      values.chainsCreated.5.chainId:
-        50104
+        543210
      values.chainsCreated.5.chainGovernance:
-        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
+        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
      values.chainsCreated.4.chainId:
-        543210
+        1217
      values.chainsCreated.4.chainGovernance:
-        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
+        "0x86F4487949Ac2fb0d5735870f1731e879e1d9680"
      values.getAllZKChainChainIDs.11:
+        388
      values.getAllZKChainChainIDs.10:
-        388
+        325
      values.getAllZKChainChainIDs.9:
-        325
+        324
      values.getAllZKChainChainIDs.8:
-        324
+        320
      values.getAllZKChainChainIDs.7:
-        320
+        232
      values.getAllZKChainChainIDs.6:
-        232
+        9637
      values.getAllZKChainChainIDs.5:
-        9637
+        2741
      values.getAllZKChainChainIDs.4:
-        2741
+        1345
      values.getAllZKChainChainIDs.3:
-        1345
+        1217
      values.getAllZKChains.11:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllZKChains.10:
-        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
+        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      values.getAllZKChains.9:
-        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "0x410D7e4Ea1093A532eF9A7a2D5df84084B05ec24"
    }
```

```diff
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD) {
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
      values.chainCount:
-        12
+        13
      values.getAggregatedRoot:
-        "0x160dd873fe3499b5aafd588005617fae4d12e5d11f0e856de9576aedf0565019"
+        "0x619372ea4d229fc7921bbdcd7b46a64f151d566c0bf6d43cf1807bc6aa4629ad"
    }
```

Generated with discovered.json: 0x76aab63ab59b57351874ceefbea12218f8494404

# Diff at Wed, 02 Apr 2025 14:42:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6d66206526294fb00e0c08e8ff3bf70febdc1aaa block: 22123258
- current block number: 22181739

## Description

shared zk stack contracts upgraded to v26: config related changes for all children chains.

## Watched changes

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      directlyReceivedPermissions.2:
-        {"permission":"interact","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager."}
      directlyReceivedPermissions.1.from:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      directlyReceivedPermissions.1.description:
-        "register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts."
+        "revert batches for any connected chain (ZK cluster Admin role)."
      directlyReceivedPermissions.0.from:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      directlyReceivedPermissions.0.description:
-        "register new Elastic Chains in the shared bridge."
+        "create new zk chains (based on the current version), register tokens (ZK cluster Admin role)."
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers.
      template:
-        "shared-zk-stack/v25/BridgeHub"
+        "shared-zk-stack/v26/BridgeHub"
      sourceHashes.1:
-        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
+        "0xe79288af01ff8940265966caffdc9ea0ef18822166fd7f704488419737716623"
      sourceHashes.0:
-        "0x568d6f26c34f7da5f4ac55957f99d9e66cbf967d550fa27ec431fb66bbd36a0b"
+        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
      description:
-        "Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations."
+        "The main registry (hub) for all the contracts in the ZK stack cluster and central entrypoint for bridge transactions. Stores important mappings like from chainId to diamond address, from chainId to parent CTM, from chainId to base token etc. A clone of Bridgehub is also deployed on each L2 chain, but this clone is only used on settlement layers."
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.via.1:
-        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      issuedPermissions.1.description:
+        "set critical system contract addresses, register settlement layers, pause and unpause and manage zk chain registration."
      issuedPermissions.0.description:
-        "register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts."
+        "create new zk chains (based on the current version), register tokens (ZK cluster Admin role)."
      values.$implementation:
-        "0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"
+        "0xb720523EC3c615b069453bF4B0584CEbF034706f"
      values.$pastUpgrades.3:
+        ["2024-06-04T17:03:59.000Z","0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61",["0x12f893689f9603991a8c22C249FFd0509Be95661"]]
      values.$pastUpgrades.2.2:
-        ["0x12f893689f9603991a8c22C249FFd0509Be95661"]
+        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
      values.$pastUpgrades.2.1:
-        "2024-06-04T17:03:59.000Z"
+        "2025-01-08T16:00:35.000Z"
      values.$pastUpgrades.2.0:
-        "0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61"
+        ["0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"]
      values.$pastUpgrades.1.2:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        ["0xb720523EC3c615b069453bF4B0584CEbF034706f"]
      values.$pastUpgrades.1.1:
-        "2025-01-08T16:00:35.000Z"
+        "2025-03-31T08:00:47.000Z"
      values.$pastUpgrades.1.0:
-        ["0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"]
+        "0x96a2f14c85022136ab3d4e568e9f1fe8f4611a4a2597f979332840259378f6b3"
      values.$upgradeCount:
-        3
+        4
      values.chainsCreated.10.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.10.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.9.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.9.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.8.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.8.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.7.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.7.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.6.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.6.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.5.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.5.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.4.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.4.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.3.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.3.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.2.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.2.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.1.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.1.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.0.stateTransitionManager:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.chainsCreated.0.chainTypeManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.CronosDiamond:
-        "0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc"
      values.CronosSTM:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.getHyperchain:
-        []
      values.GrvtDiamond:
-        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      values.GrvtSTM:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.sharedBridge:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.SophonDiamond:
-        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
      values.SophonSTM:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.ZeroNetworkDiamond:
-        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.ZeroNetworkSTM:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.zksyncEraDiamond:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
      values.zksyncEraSTM:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.assetRouter:
+        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.getAllZKChainChainIDs:
+        [324,388,50104,543210,2741,325,61166,1345,9637,320,232]
      values.getAllZKChains:
+        ["0x32400084C286CF3E17e7B677ea9583e60a000324","0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3","0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9","0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9","0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E","0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879","0x89f90748A9a36C30A324481133fa198f4E16A824","0xC8C4cB5AF7c723c7EfD360898B47920679f92C92","0xF2704433d11842d15aa76BBF0E00407267a99C92","0xc29d04A93F893700015138E3E334eB828dAC3cef"]
      values.L1_CHAIN_ID:
+        1
      values.l1CtmDeployer:
+        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      values.MAX_NUMBER_OF_ZK_CHAINS:
+        100
      values.messageRoot:
+        "0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"
+++ description: If false, chains can migrate to whitelisted settlement layers.
+++ severity: HIGH
      values.migrationPaused:
+        false
+++ description: New settlement layers and their whitelist status. Chains can be migrated to whitelisted settlement layers by their chain admin.
+++ severity: HIGH
      values.settlementLayers:
+        {}
      fieldMeta.chainsCreated.description:
-        "All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs."
+        "All new chains created go thorugh the central bridgehub and are stored here with their respective STMs."
      fieldMeta.migrationPaused:
+        {"severity":"HIGH","description":"If false, chains can migrate to whitelisted settlement layers."}
      fieldMeta.settlementLayers:
+        {"severity":"HIGH","description":"New settlement layers and their whitelist status. Chains can be migrated to whitelisted settlement layers by their chain admin."}
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"interact","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager.","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}
      receivedPermissions.1.from:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.1.description:
-        "register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts."
+        "revert batches for any connected chain (ZK cluster Admin role)."
      receivedPermissions.0.from:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.0.description:
-        "register new Elastic Chains in the shared bridge."
+        "create new zk chains (based on the current version), register tokens (ZK cluster Admin role)."
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD"}
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"}
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"0x8829AD80E425C646DAB305381ff105169FeEcE56"}
      directlyReceivedPermissions.3:
+        {"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"}
      directlyReceivedPermissions.2.from:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      directlyReceivedPermissions.1.from:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      directlyReceivedPermissions.0.from:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
    }
```

```diff
    contract ChainTypeManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,26,0.
      name:
-        "StateTransitionManager"
+        "ChainTypeManager"
      template:
-        "shared-zk-stack/v25/StateTransitionManager"
+        "shared-zk-stack/v26/ChainTypeManager"
      sourceHashes.1:
-        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
+        "0xf6789714ce74a28098dbbf1bb19c228c5c72b5a0756925b2f1c4b8ea9c072e37"
      sourceHashes.0:
-        "0x2322249822d1ffda838f7005dd4137d161f15f2cc3553e9bffba7c04a44d9226"
+        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
      description:
-        "Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic)."
+        "Defines L2 diamond contract versions, creation and upgrade data and the proof system for all ZK stack chains connected to it. ZK chains are children of this central contract and can only upgrade to versions that were previously registered here. The current protocol version is 0,26,0."
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.via.1:
-        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      issuedPermissions.1.description:
+        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
      issuedPermissions.0.description:
-        "manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager."
+        "revert batches for any connected chain (ZK cluster Admin role)."
      values.$implementation:
-        "0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"
+        "0xA3bCcAEe38cb0273A979118a0DE483E47D50F6Cb"
      values.$pastUpgrades.3:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"]]
      values.$pastUpgrades.2.2.0:
-        "0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"
+        "0xA3bCcAEe38cb0273A979118a0DE483E47D50F6Cb"
      values.$pastUpgrades.2.1:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        "2025-03-31T08:00:47.000Z"
      values.$pastUpgrades.2.0:
-        "2025-01-08T16:00:35.000Z"
+        "0x96a2f14c85022136ab3d4e568e9f1fe8f4611a4a2597f979332840259378f6b3"
      values.$upgradeCount:
-        3
+        4
      values.genesisUpgrade:
-        "0x0000000000000000000000000000000000000001"
      values.getAllHyperchainChainIDs:
-        [324,388,50104,543210,2741,325,61166,1345,9637,320,232]
      values.getAllHyperchains:
-        ["0x32400084C286CF3E17e7B677ea9583e60a000324","0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3","0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9","0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9","0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E","0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879","0x89f90748A9a36C30A324481133fa198f4E16A824","0xC8C4cB5AF7c723c7EfD360898B47920679f92C92","0xF2704433d11842d15aa76BBF0E00407267a99C92","0xc29d04A93F893700015138E3E334eB828dAC3cef"]
      values.getChainAdmin:
-        []
      values.initialCutHash:
-        "0xaf3397d2d574e3fb4a729df5b561afe890323a5eab21980fe9aae230f5934458"
+        "0x1f2fc821f3af8fc4dae46f80a28e8b582ace20e83a979acacf6ecbd0e9b4fcea"
      values.MAX_NUMBER_OF_HYPERCHAINS:
-        100
      values.storedBatchZero:
-        "0xbb3c62fb5577f094f9290297114948e6f6fb8d04083a366ba3dadb3569fb5c4f"
+        "0x30624ae13932bc83804b007160a60b2394893f6097d5f7062de441172adc4749"
      values.initialForceDeploymentHash:
+        "0x5d46606048f0821e6ce823fd9cc257b47818b44dffed0bc21489e23ab242d0e1"
      values.l1GenesisUpgrade:
+        "0x107e92E7360e595d8129B522ABD458361f32f66C"
      derivedName:
-        "StateTransitionManager"
+        "ChainTypeManager"
    }
```

```diff
    contract L1Nullifier (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds.
      name:
-        "L1SharedBridge"
+        "L1Nullifier"
      template:
-        "shared-zk-stack/v25/L1SharedBridge"
+        "shared-zk-stack/v26/L1Nullifier"
      sourceHashes.1:
-        "0x23ebe4dfc517328a5acc1f6f8aa84be593be5db9d6357fcdcd69c62ca60853f7"
+        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
      sourceHashes.0:
-        "0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad"
+        "0x1d68adefefffd4b896740e985d1d7d39abbface4239c0fb54cbda7892ce8c99d"
      description:
-        "This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era."
+        "Contract responsible for bookkeeping L1 bridging transactions. Used to finalize withdrawals and reclaim failed deposits. Does not escrow funds."
      issuedPermissions.0.to:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      issuedPermissions.0.description:
-        "register new Elastic Chains in the shared bridge."
+        "pause, unpause and set critical escrow address references."
      issuedPermissions.0.via.0.address:
-        "0x2cf3bD6a9056b39999F3883955E183F655345063"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.$implementation:
-        "0xF5A14DCdde1143443f06033200D345c2a2828A99"
+        "0xda2866AF0e170d0867a3F3bB52Db10D6E09Df78A"
      values.$pastUpgrades.3:
+        ["2024-08-26T07:51:11.000Z","0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c",["0xb56A8225A745756DD215faf22E4796f373561AcD"]]
      values.$pastUpgrades.2.2.0:
-        "0xb56A8225A745756DD215faf22E4796f373561AcD"
+        "0xF5A14DCdde1143443f06033200D345c2a2828A99"
      values.$pastUpgrades.2.1:
-        "2024-08-26T07:51:11.000Z"
+        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
      values.$pastUpgrades.2.0:
-        "0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c"
+        "2025-01-08T16:00:35.000Z"
      values.$pastUpgrades.1.2:
-        ["0xF5A14DCdde1143443f06033200D345c2a2828A99"]
+        "2025-03-31T08:00:47.000Z"
      values.$pastUpgrades.1.1:
-        "0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5"
+        "0x96a2f14c85022136ab3d4e568e9f1fe8f4611a4a2597f979332840259378f6b3"
      values.$pastUpgrades.1.0:
-        "2025-01-08T16:00:35.000Z"
+        ["0xda2866AF0e170d0867a3F3bB52Db10D6E09Df78A"]
      values.$upgradeCount:
-        3
+        4
      values.admin:
-        "0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
      values.l1AssetRouter:
+        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.l1NativeTokenVault:
+        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      derivedName:
-        "L1SharedBridge"
+        "L1Nullifier"
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      template:
-        "shared-zk-stack/v25/ProtocolUpgradeHandler"
+        "shared-zk-stack/v26/ProtocolUpgradeHandler"
      sourceHashes.1:
-        "0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8"
+        "0x12958ca399cc6a20305ec705a35cae0ee77a75afd66ee1eb5f09d3a811ca4457"
      sourceHashes.0:
-        "0x07105095c7b0ff20b0cdd1e3754255aa6189aa79719f6d09fdd8e20df48bed44"
+        "0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8"
      description:
-        "The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract."
+        "The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract."
      directlyReceivedPermissions.5:
+        {"permission":"interact","from":"0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45","description":"manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."}
      directlyReceivedPermissions.4:
+        {"permission":"interact","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."}
      directlyReceivedPermissions.3:
+        {"permission":"act","from":"0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"}
      directlyReceivedPermissions.2.from:
-        "0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      directlyReceivedPermissions.2.description:
-        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
+        "set critical system contract addresses, register settlement layers, pause and unpause and manage zk chain registration."
      directlyReceivedPermissions.1.from:
-        "0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      directlyReceivedPermissions.0.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      directlyReceivedPermissions.0.description:
+        "pause, unpause and set critical escrow address references."
      values.$implementation:
-        "0xD5e9D3d483a93d03D8d604CC79dC9f2F4B78C604"
+        "0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A"
      values.$pastUpgrades.1:
+        ["2025-02-06T15:32:47.000Z","0xa3d1fa107e6dc4ce67d92a5af74aa7dc34602c2a1d46727790819c1f974bed95",["0xD5e9D3d483a93d03D8d604CC79dC9f2F4B78C604"]]
      values.$pastUpgrades.0.2:
-        ["0xD5e9D3d483a93d03D8d604CC79dC9f2F4B78C604"]
+        "2025-03-31T08:00:47.000Z"
      values.$pastUpgrades.0.1:
-        "2025-02-06T15:32:47.000Z"
+        "0x96a2f14c85022136ab3d4e568e9f1fe8f4611a4a2597f979332840259378f6b3"
      values.$pastUpgrades.0.0:
-        "0xa3d1fa107e6dc4ce67d92a5af74aa7dc34602c2a1d46727790819c1f974bed95"
+        ["0x0A67f0Fd2f7523057039F14969Fe23a5f620f19A"]
      values.$upgradeCount:
-        1
+        2
      values.emergencyUpgradeProposals:
-        ["0xa34bdc028de549c0fbd0374e64eb5977e78f62331f6a55f4f2211348c4902d13"]
      values.SHARED_BRIDGE:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      values.STATE_TRANSITION_MANAGER:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.CHAIN_TYPE_MANAGER:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+++ severity: HIGH
      values.emergencyUpgradesExecuted:
+        ["0xa34bdc028de549c0fbd0374e64eb5977e78f62331f6a55f4f2211348c4902d13"]
      values.L1_ASSET_ROUTER:
+        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
      values.L1_NATIVE_TOKEN_VAULT:
+        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      values.L1_NULLIFIER:
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      fieldMeta.emergencyUpgradeProposals:
-        {"severity":"HIGH"}
      fieldMeta.emergencyUpgradesExecuted:
+        {"severity":"HIGH"}
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0x8829AD80E425C646DAB305381ff105169FeEcE56","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45","description":"manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode).","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3","via":[{"address":"0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"},{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.via.1:
-        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      receivedPermissions.4.description:
+        "manage the shared ValidatorTimelock contract address and the admin role, register and execute upgrades (and set their deadlines), freeze, revert batches and set permissioned validators and fee params for all connected chains."
      receivedPermissions.3.from:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
+        "0x6078F6B379f103de1Aa912dc46bb8Df0c8809860"
      receivedPermissions.2.description:
-        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
      receivedPermissions.2.via.1:
+        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.1.via.1:
-        {"address":"0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"}
      receivedPermissions.1.description:
+        "set critical system contract addresses, register settlement layers, pause and unpause and manage zk chain registration."
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.via.1:
-        {"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}
      receivedPermissions.0.description:
+        "pause, unpause and set critical escrow address references."
    }
```

```diff
+   Status: CREATED
    contract L1GenesisUpgrade (0x107e92E7360e595d8129B522ABD458361f32f66C)
    +++ description: Diamond implementation code to initialize new ZK chains. Used to set their chainID.
```

```diff
+   Status: CREATED
    contract MessageRoot (0x5Ce9257755391D1509cD4eC1899d3F88A57BB4aD)
    +++ description: Aggregates remote bridge message roots from all ZK stack chains. To be used with the Gateway when deployed.
```

```diff
+   Status: CREATED
    contract CTMDeploymentTracker (0x6078F6B379f103de1Aa912dc46bb8Df0c8809860)
    +++ description: Asset deployment tracker where the 'asset' is a ChainTypeManager. The registering of asset IDs for ChainTypeManagers is necessary to be able to migrate them to a given settlement layer, for example the Gateway.
```

```diff
+   Status: CREATED
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56)
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
```

```diff
+   Status: CREATED
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6)
    +++ description: Part of the v26 upgrade: Canonical central asset escrow for all ZK stack chains.
```

## Source code changes

```diff
.../BridgeHub/Bridgehub.sol                        | 2541 +++++++++++--
 .../CTMDeploymentTracker/CTMDeploymentTracker.sol  |  674 ++++
 .../TransparentUpgradeableProxy.p.sol              |    0
 .../ChainTypeManager/ChainTypeManager.sol}         |  476 ++-
 .../TransparentUpgradeableProxy.p.sol              |    0
 .../ethereum/.flat/L1AssetRouter/L1AssetRouter.sol | 2359 ++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  729 ++++
 .../ethereum/.flat/L1GenesisUpgrade.sol            | 3775 ++++++++++++++++++++
 .../L1NativeTokenVault/L1NativeTokenVault.sol      | 2202 ++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  729 ++++
 .../L1Nullifier/L1Nullifier.sol}                   | 1488 ++++----
 .../L1Nullifier/TransparentUpgradeableProxy.p.sol  |  729 ++++
 .../ethereum/.flat/MessageRoot/MessageRoot.sol     | 1448 ++++++++
 .../MessageRoot/TransparentUpgradeableProxy.p.sol  |  729 ++++
 .../ProtocolUpgradeHandler.sol                     |   64 +-
 15 files changed, 16537 insertions(+), 1406 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22123258 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      template:
-        "shared-zk-stack/BridgeHub"
+        "shared-zk-stack/v25/BridgeHub"
    }
```

```diff
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      receivedPermissions.1:
+        {"permission":"interact","from":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3","description":"extend the legal veto period, approve a protocol upgrade."}
      receivedPermissions.0.from:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      receivedPermissions.0.description:
-        "extend the legal veto period, approve a protocol upgrade."
+        "one of its 3/3 signers."
    }
```

```diff
    contract SecurityCouncil (0x66E4431266DC7E04E7d8b7FE9d2181253df7F410) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      receivedPermissions.1:
+        {"permission":"interact","from":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3","description":"soft freeze, hard freeze, approve a protocol upgrade."}
      receivedPermissions.0.from:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      receivedPermissions.0.description:
-        "soft freeze, hard freeze, approve a protocol upgrade."
+        "one of its 3/3 signers."
    }
```

```diff
    contract RollupL1DAValidator (0x72213dfe8CA61B0A782970dCFebFb877778f9119) {
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
      template:
-        "shared-zk-stack/RollupL1DAValidator"
+        "shared-zk-stack/v26/RollupL1DAValidator"
    }
```

```diff
-   Status: DELETED
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56)
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
```

```diff
-   Status: DELETED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
    contract ZK Foundation Multisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6","description":"one of its 3/3 signers."}]
    }
```

```diff
-   Status: DELETED
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6)
    +++ description: Part of the v26 upgrade: Canonical central asset escrow for all ZK stack chains.
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      directlyReceivedPermissions.4:
-        {"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"}
      directlyReceivedPermissions.3:
-        {"permission":"upgrade","from":"0x8829AD80E425C646DAB305381ff105169FeEcE56"}
      directlyReceivedPermissions.2.from:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      directlyReceivedPermissions.1.from:
-        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      template:
-        "shared-zk-stack/StateTransitionManager"
+        "shared-zk-stack/v25/StateTransitionManager"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      template:
-        "shared-zk-stack/L1SharedBridge"
+        "shared-zk-stack/v25/L1SharedBridge"
    }
```

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      template:
-        "shared-zk-stack/ProtocolUpgradeHandler"
+        "shared-zk-stack/v25/ProtocolUpgradeHandler"
      directlyReceivedPermissions.2:
+        {"permission":"interact","from":"0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45","description":"manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."}
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"}]}
      receivedPermissions.4.from:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45"
      receivedPermissions.2.via.1:
-        {"address":"0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"}
      receivedPermissions.2.description:
+        "manage allowed rollup DA pairs (allowed to be used by rollups in permanent rollup mode)."
      receivedPermissions.1.from:
-        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.1.via.1.address:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
      issuedPermissions:
+        [{"permission":"interact","to":"0x66E4431266DC7E04E7d8b7FE9d2181253df7F410","description":"one of its 3/3 signers.","via":[]},{"permission":"interact","to":"0x600dA620Ab29F41ABC6596a15981e14cE58c86b8","description":"one of its 3/3 signers.","via":[]},{"permission":"interact","to":"0xbC1653bd3829dfEc575AfC3816D4899cd103B51c","description":"one of its 3/3 signers.","via":[]}]
    }
```

```diff
+   Status: CREATED
    contract RollupDAManager (0xE689e79a06D3D09f99C21E534cCF6a8b7C9b3C45)
    +++ description: Simple registry for allowed DA address pairs for the 'rollup' data availability mode (can be permanently enforced with isPermanentRollup=true). Rollup DA address pairs (especially the L1 part) usually point to contracts that validate if data was made available on Ethereum.
```

Generated with discovered.json: 0xe7639ce8f9590f6e6cc987fc96ee73940a4be783

# Diff at Tue, 25 Mar 2025 10:34:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 22081910
- current block number: 22123258

## Description

Added discovery for currently unused contracts (L1AssetRouter, L1NativeTokenVault). Category in the template is "spam" until these contracts are used (in ~1 week).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081910 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"}
      directlyReceivedPermissions.3:
+        {"permission":"upgrade","from":"0x8829AD80E425C646DAB305381ff105169FeEcE56"}
      directlyReceivedPermissions.2.from:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      directlyReceivedPermissions.1.from:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
    }
```

```diff
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6) {
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0x8829AD80E425C646DAB305381ff105169FeEcE56","via":[{"address":"0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      receivedPermissions.3.from:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.2.from:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      receivedPermissions.2.via.1.address:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
      receivedPermissions.1.from:
-        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
+        "0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6"
      receivedPermissions.1.via.1.address:
-        "0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e"
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
    }
```

```diff
+   Status: CREATED
    contract RollupL1DAValidator (0x72213dfe8CA61B0A782970dCFebFb877778f9119)
    +++ description: Contract that verifies the data availability of ethereum calldata and blobs. Can be used by ZK stack rollups as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract L1AssetRouter (0x8829AD80E425C646DAB305381ff105169FeEcE56)
    +++ description: Part of the v26 upgrade: Canonical central asset router for all ZK stack chains (not escrowing funds).
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract L1NativeTokenVault (0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6)
    +++ description: Part of the v26 upgrade: Canonical central asset escrow for all ZK stack chains.
```

Generated with discovered.json: 0x29c9f4544dd05bf880daeb972811c734859fde06

# Diff at Wed, 19 Mar 2025 15:49:45 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4609d8355d7594946b66bef47876090fce6b0842 block: 57469400
- current block number: 57909592

## Description

[ZIP-8](https://www.tally.xyz/gov/zksync/proposal/98806622840077485421207653857298019081476009136539565020582912190689619102417?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) is sent to L1 and queued in the ProtocolUpgradeHandler.

## Watched changes

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        7
+        8
    }
```

Generated with discovered.json: 0x9a13288795e7cf6d1f8dd42fd7d112a5e25e39e4

# Diff at Tue, 18 Mar 2025 11:38:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 22037103
- current block number: 22073511

## Description

New validium deployed. The current list is (pretty script soon):

🚀: posting batches
✅: officially launched 

Current ZK stack chains (BH.getAllHyperchains array): 
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH 🚀✅
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO 🚀✅
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH 🚀
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH 🚀✅
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH 🚀
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken) 🚀
7) [Treasure Chain](https://docs.treasure.lol/chain) 61166 Validium 0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879 MAGIC 🚀✅
8) Unknown 1345 Validium 0x89f90748A9a36C30A324481133fa198f4E16A824 ozETH
9) lumoz 9637 validium 0xC8C4cB5AF7c723c7EfD360898B47920679f92C92 ETH
10) ZKcandy 320 validium 0xF2704433d11842d15aa76BBF0E00407267a99C92  ETH
11) lens 232 validium 0xc29d04A93F893700015138E3E334eB828dAC3cef LGHO

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.10:
+        {"chainId":9637,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
      values.chainsCreated.9.chainId:
-        9637
+        388
      values.chainsCreated.9.chainGovernance:
-        "0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"
+        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
      values.chainsCreated.8.chainId:
-        388
+        325
      values.chainsCreated.8.chainGovernance:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      values.chainsCreated.7.chainId:
-        325
+        320
      values.chainsCreated.7.chainGovernance:
-        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
+        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
      values.chainsCreated.6.chainId:
-        320
+        324
      values.chainsCreated.6.chainGovernance:
-        "0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"
+        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
      values.chainsCreated.5.chainId:
-        324
+        50104
      values.chainsCreated.5.chainGovernance:
-        "0x71d84c3404a6ae258E6471d4934B96a2033F9438"
+        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
      values.chainsCreated.4.chainId:
-        50104
+        543210
      values.chainsCreated.4.chainGovernance:
-        "0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"
+        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
      values.chainsCreated.3.chainId:
-        543210
+        2741
      values.chainsCreated.3.chainGovernance:
-        "0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"
+        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
      values.chainsCreated.2.chainId:
-        2741
+        1345
      values.chainsCreated.2.chainGovernance:
-        "0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"
+        "0x49664fFe2c2335c28631629606E26a6971aEf261"
      values.chainsCreated.1.chainId:
-        1345
+        232
      values.chainsCreated.1.chainGovernance:
-        "0x49664fFe2c2335c28631629606E26a6971aEf261"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      values.getAllHyperchainChainIDs.10:
+        388
      values.getAllHyperchainChainIDs.9:
-        388
+        325
      values.getAllHyperchainChainIDs.8:
-        325
+        324
      values.getAllHyperchainChainIDs.7:
-        324
+        320
      values.getAllHyperchainChainIDs.6:
-        320
+        232
      values.getAllHyperchains.10:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllHyperchains.9:
-        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
+        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
      values.getAllHyperchains.8:
-        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
+        "0x32400084C286CF3E17e7B677ea9583e60a000324"
      values.getAllHyperchains.7:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
+        "0xc29d04A93F893700015138E3E334eB828dAC3cef"
    }
```

Generated with discovered.json: 0x52adb00fc528d034ea73742a31096846848e729a

# Diff at Tue, 18 Mar 2025 08:14:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22037103
- current block number: 22037103

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22037103 (main branch discovery), not current.

```diff
    contract ZK Foundation Multisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      name:
-        "ZkFoundationMultisig"
+        "ZK Foundation Multisig"
    }
```

Generated with discovered.json: 0xb97d73a0cddfe9c506f4b6cd79c5aa3a58f21584

# Diff at Thu, 13 Mar 2025 09:38:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9dd209f83894c1f6612b7ed3bb249aa61692d929 block: 22030561
- current block number: 22037103

## Description

Sub-MS signer changes.

## Watched changes

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      values.$members.7:
+        "0x7461633b1Fc7CdAa64A5B7bAb1b1F0145Acd7953"
      values.$members.6:
+        "0x227230CD05e89f41E67df3E5fC61B18411d147A9"
      values.$members.5:
+        "0xb799FF3DeF706045B5061B22d748E8F52737415d"
      values.$members.4:
+        "0x8b0c64CcaB94d4618Ef834F396F622f61F2b013D"
      values.$members.3:
+        "0x0e621b0A275A207211e161Ee997aA80661Bc1bcf"
      values.$members.2:
+        "0x160669864cDe95c190364ad01eDfbAA32E9DA430"
      values.$members.1:
+        "0x3620B9e7c75E09cCC37458c7B6EE6c23D8Ee4f0f"
      values.$members.0:
-        "0xD9b0579e2B8387fE153201631EBC4be9dEFA1A6d"
+        "0xa376AaF645dbd9b4f501B2A8a97bc21DcA15B001"
      values.$threshold:
-        1
+        5
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x6efbd6780b58fc5887ada743f9acb8c8882483e8

# Diff at Wed, 12 Mar 2025 11:43:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d56fc86cf5944647644b8653ca9717b11d4adae8 block: 22022274
- current block number: 22030561

## Description

Part of the protocol version 26 upgrade: New L2 logic [deployed to the STM](https://app.blocksec.com/explorer/tx/eth/0x93e4efe078b08019c40dc11046abaa531b75263f297ec014c2d7901c0e1ff243), from where it will be distributed to the zk stack chains:
- `setNewVersionUpgrade()` called: diamond cut data for the v26 upgrade for existing chains
- `setChainCreationParams()` called: new genesis diamond cut data for new zk stack chains
- `setValidatorTimelock()` called: adds the new ValidatorTimelock as a reference to the STM

ML MS signer change.

## Watched changes

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.2:
+        {"_protocolVersion":111669149696,"_upgradeTimestamp":1741773600}
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      values.$members.7:
+        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
      values.$members.6:
-        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
+        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
      values.$members.5:
-        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
+        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
      values.$members.4:
-        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
+        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
      values.$members.3:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
      values.$members.2:
-        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
+        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
      values.$members.1:
-        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
+        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
      values.$members.0:
-        "0x3F0009D00cc78979d00Eb635490F23E8d6aCc481"
+        "0x4A333c167Ce76C46149c6B0197977ae02aaeC929"
      values.$threshold:
-        4
+        5
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "5 of 8 (63%)"
    }
```

```diff
-   Status: DELETED
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971)
    +++ description: Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts.
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      values.genesisUpgrade:
-        "0x6e2BC597F1e83F9fC7c1f69157F2C12476873971"
+        "0x0000000000000000000000000000000000000001"
      values.getSemverProtocolVersion.1:
-        25
+        26
      values.initialCutHash:
-        "0x0b30ec2102ea8e2cf92d22857c347d3b29bde8dfaf6f2ae19045f19c5a94ba5a"
+        "0xaf3397d2d574e3fb4a729df5b561afe890323a5eab21980fe9aae230f5934458"
      values.protocolVersion:
-        107374182400
+        111669149696
      values.storedBatchZero:
-        "0x83325e26523f69ee6ea60aea582325d22f3c6a85db5e4890e14d62a377635a6b"
+        "0xbb3c62fb5577f094f9290297114948e6f6fb8d04083a366ba3dadb3569fb5c4f"
      values.validatorTimelock:
-        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
+        "0x8c0Bfc04AdA21fd496c55B8C50331f904306F564"
    }
```

```diff
+   Status: CREATED
    contract undefined (0x0000000000000000000000000000000000000001)
    +++ description: None
```

```diff
+   Status: CREATED
    contract undefined (0x4A333c167Ce76C46149c6B0197977ae02aaeC929)
    +++ description: None
```

## Source code changes

```diff
.../.flat@22022274/GenesisUpgrade.sol => /dev/null | 2806 --------------------
 1 file changed, 2806 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022274 (main branch discovery), not current.

```diff
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
+++ severity: HIGH
      values.emergencyUpgradeProposals:
+        ["0xa34bdc028de549c0fbd0374e64eb5977e78f62331f6a55f4f2211348c4902d13"]
      fieldMeta.emergencyUpgradeProposals:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x4d241b93e2064870d390237196943a1a0cbe198c

# Diff at Tue, 11 Mar 2025 07:58:48 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 56755451
- current block number: 57469400

## Description

Onchain execution of [[ZIP-5] Upgrade Governance Contracts](https://www.tally.xyz/gov/zksync/proposal/32477831455745537024214395992964479454779258818502397012096084176779102554510?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f). See also `packages/config/discovery/shared-zk-stack/ethereum/diffHistory.md`.

## Watched changes

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.4:
-        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.1:
-        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."}
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      issuedPermissions.1.to:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      issuedPermissions.0.to:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
      issuedPermissions.0.via.0.address:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      values.accessControl.MINTER_ADMIN_ROLE.members.0:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.19:
-        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.18:
-        "0x178bFf5A197FB4499526D04Db602C45cEDCA40a9"
+        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
      values.accessControl.MINTER_ROLE.members.17:
-        "0x4E86e74237Eb1f9432810eB5ab5861368d2f5964"
+        "0x178bFf5A197FB4499526D04Db602C45cEDCA40a9"
      values.accessControl.MINTER_ROLE.members.16:
-        "0x2ADa5C15BC4FEE97EC2463ce4F8E4557174B8Dcf"
+        "0x4E86e74237Eb1f9432810eB5ab5861368d2f5964"
      values.accessControl.MINTER_ROLE.members.15:
-        "0xD375A20d93C2F7C6a83B19C5ae153cF2C6e09ba9"
+        "0x2ADa5C15BC4FEE97EC2463ce4F8E4557174B8Dcf"
      values.accessControl.MINTER_ROLE.members.14:
-        "0x2CC6c7b1a59A23fB3faCAFe4A3791C5c8A58Cbcc"
+        "0xD375A20d93C2F7C6a83B19C5ae153cF2C6e09ba9"
      values.accessControl.MINTER_ROLE.members.13:
-        "0x6b689B93B368c7C25E6e5ecaeAb23C11F8C2c392"
+        "0x2CC6c7b1a59A23fB3faCAFe4A3791C5c8A58Cbcc"
      values.accessControl.MINTER_ROLE.members.12:
-        "0xDa2fBE31Fd47Af741bdB3dBC4eb662dA0107D33a"
+        "0x6b689B93B368c7C25E6e5ecaeAb23C11F8C2c392"
      values.accessControl.MINTER_ROLE.members.11:
-        "0x3BC3f64d084bE6d3336f10340DC8424290FFc4ab"
+        "0xDa2fBE31Fd47Af741bdB3dBC4eb662dA0107D33a"
      values.accessControl.MINTER_ROLE.members.10:
-        "0x11791c6249631555cEb75CB39128789E3954c2EC"
+        "0x3BC3f64d084bE6d3336f10340DC8424290FFc4ab"
      values.accessControl.MINTER_ROLE.members.9:
-        "0xe546AEaaC57584da7554e7F88154DeDAD30A82b0"
+        "0x11791c6249631555cEb75CB39128789E3954c2EC"
      values.accessControl.MINTER_ROLE.members.8:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe546AEaaC57584da7554e7F88154DeDAD30A82b0"
      values.DefaultAdmin.0:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      values.MinterAdmin.0:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
    }
```

```diff
    contract Guardians_l2Alias (0x711ea620AB29f41AbC6596a15981e14ce58C97c9) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period)."}
      receivedPermissions.0.from:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        6
+        7
    }
```

```diff
    contract ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"upgrade","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","via":[{"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]}
      receivedPermissions.0.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.0.description:
-        "control all roles in the ZkToken access control, including the minter roles."
      receivedPermissions.0.via:
+        [{"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]
    }
```

```diff
    contract ZKFoundationMultisig_l2Alias (0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0xb83FF6501214ddF40C91C9565d095400f3F45746","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false."}]
    }
```

```diff
+   Status: CREATED
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746)
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
```

```diff
+   Status: CREATED
    contract ZkTokenTimelockController (0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler_l2Alias (0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4)
    +++ description: None
```

## Source code changes

```diff
.../zksync2/.flat/ZkTokenGovernor.sol              | 5087 ++++++++++++++++++++
 .../zksync2/.flat/ZkTokenTimelockController.sol    | 1227 +++++
 2 files changed, 6314 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 56755451 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      name:
-        "ZkTokenGovernor"
+        "ZkTokenGovernor_deprecated"
      description:
-        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
      issuedPermissions:
-        [{"permission":"interact","to":"0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false.","via":[]},{"permission":"interact","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      name:
-        "TokenTimelockController"
+        "TokenTimelockController_deprecated"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      name:
-        "ZkGovOpsGovernor"
+        "ZkGovOpsGovernor_deprecated"
      description:
-        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
      issuedPermissions:
-        [{"permission":"interact","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.7:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions."}
      receivedPermissions.6:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"manage all access control roles and change the minimum delay.","via":[{"address":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"execute transactions that are ready."}
      receivedPermissions.4:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"cancel queued transactions."}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}
    }
```

```diff
    contract ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      name:
-        "ProtocolUpgradeHandler_l2Alias"
+        "ProtocolUpgradeHandler_l2Alias_deprecated"
    }
```

```diff
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      name:
-        "GovOpsTimelockController"
+        "GovOpsTimelockController_deprecated"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ZKFoundationMultisig_l2Alias (0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false."}]
    }
```

```diff
    contract Guardians_l2Alias_deprecated (0xe788e09324F8bb3cc64f009973693f751C33b999) {
    +++ description: None
      name:
-        "Guardians_l2Alias"
+        "Guardians_l2Alias_deprecated"
      receivedPermissions:
-        [{"permission":"interact","from":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period)."},{"permission":"interact","from":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period)."}]
    }
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
```

```diff
+   Status: CREATED
    contract Guardians_l2Alias (0x711ea620AB29f41AbC6596a15981e14ce58C97c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovOpsTimelockController (0xC9E442574958f96C026DeF9a50C3236cab17428a)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160)
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
```

Generated with discovered.json: 0x7a9585ff0df7f4aa277f5502d867069cae9ccba3

# Diff at Tue, 11 Mar 2025 07:55:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21944239
- current block number: 22022274

## Description

update 03/11: old owner (PUH) is fully transferred, new contracts are governing.

Onchain execution of [[ZIP-5] Upgrade Governance Contracts](https://www.tally.xyz/gov/zksync/proposal/32477831455745537024214395992964479454779258818502397012096084176779102554510?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

SC and Guardians redeployed in the same configuration, new ProtocolUpgradeHandler deployed as a proxy referencing and the new ProtocolGovernor on L2.

Currently the new ProtocolUpgradeHandler is the upgrade admin, Elastic Chain admin and pending owner of the shared contracts, and the old PUH remains the owner.

This complicates showing discodriven perms correctly, as the permissions are the same as before but the contracts are doubled.
Since the old governance contracts on L1 only have the 'owner' role in the shared contracts until the next upgrade, we hide them from the frontend.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      issuedPermissions.1.to:
-        "0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      issuedPermissions.1.via.0.address:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract ProtocolTimelockController(L2->L1)_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProtocolUpgradeHandler_deprecated (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
-   Status: DELETED
    contract SecurityCouncil_deprecated (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      issuedPermissions.1.to:
-        "0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      issuedPermissions.1.via.0.address:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract Guardians_deprecated (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      issuedPermissions.1.to:
-        "0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29"
+        "0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6"
      issuedPermissions.1.via.0.address:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract EmergencyUpgradeBoard_deprecated (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController(L2->L1) (0x085b8B6407f150D62adB1EF926F7f304600ec714)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Guardians (0x600dA620Ab29F41ABC6596a15981e14cE58c86b8)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x66E4431266DC7E04E7d8b7FE9d2181253df7F410)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xECE8e30bFc92c2A8e11e6cb2e17B70868572E3f6)
    +++ description: A custom contract allowing a 3/3 of 0x66E4431266DC7E04E7d8b7FE9d2181253df7F410, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0x600dA620Ab29F41ABC6596a15981e14cE58c86b8 to `executeEmergencyUpgrade()` via the 0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3.
```

## Source code changes

```diff
.../EmergencyUpgradeBoard.sol}                     |   0
 .../Guardians.sol}                                 |   0
 .../ProtocolUpgradeHandler.sol}                    | 222 +++++++-
 .../TransparentUpgradeableProxy.p.sol              | 581 +++++++++++++++++++++
 ...-0x1e4c534e7ce1FF5621Ea506D99b367D7d8EFbE3e.sol | 132 +++++
 ...0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1.sol} |   0
 .../SecurityCouncil.sol}                           |   0
 7 files changed, 917 insertions(+), 18 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21944239 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController(L2->L1)_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: None
      name:
-        "ProtocolTimelockController(L2->L1)"
+        "ProtocolTimelockController(L2->L1)_deprecated"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ProtocolUpgradeHandler_deprecated (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      name:
-        "ProtocolUpgradeHandler"
+        "ProtocolUpgradeHandler_deprecated"
      category.name:
-        "Shared Infrastructure"
+        "Spam"
      category.priority:
-        4
+        -1
    }
```

```diff
    contract SecurityCouncil_deprecated (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      name:
-        "SecurityCouncil"
+        "SecurityCouncil_deprecated"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract Guardians_deprecated (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      name:
-        "Guardians"
+        "Guardians_deprecated"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract EmergencyUpgradeBoard_deprecated (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      name:
-        "EmergencyUpgradeBoard"
+        "EmergencyUpgradeBoard_deprecated"
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

Generated with discovered.json: 0xa80d0aa1f580af83f24eca2f8cdca1516fe19f51

# Diff at Thu, 06 Mar 2025 15:34:14 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 56755451
- current block number: 56755451

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 56755451 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: This timelock has a minimum delay of 0s. It does not have the L2_SENDER_ROLE yet.
      issuedPermissions.3:
+        {"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}
      issuedPermissions.2.description:
-        "propose transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.2.via.0:
+        {"address":"0x085b8B6407f150D62adB1EF926F7f304600ec714"}
      values.timelockAdminAC:
+        ["0x085b8B6407f150D62adB1EF926F7f304600ec714"]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x085b8B6407f150D62adB1EF926F7f304600ec714","description":"manage all access control roles and change the minimum delay."}]
    }
```

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.4:
+        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}
      receivedPermissions.3.from:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.3.description:
-        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
+        "propose transactions."
      receivedPermissions.3.via:
-        [{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
      receivedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      receivedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.0.delay:
+        259200
      receivedPermissions.0.via:
+        [{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.3:
+        {"permission":"interact","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"propose transactions.","via":[]}
      issuedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      issuedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      issuedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.0.via.0:
+        {"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}
      issuedPermissions.0.delay:
+        259200
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."}
      directlyReceivedPermissions.0.from:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      directlyReceivedPermissions.0.description:
-        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
+        "manage all access control roles and change the minimum delay."
      directlyReceivedPermissions.0.delay:
+        259200
      values.timelockAdminAC:
+        ["0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"]
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.3:
+        {"permission":"interact","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"propose transactions."}
      receivedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      receivedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.0.delay:
+        259200
      receivedPermissions.0.via:
+        [{"address":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200}]
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.3:
+        {"permission":"interact","from":"0x085b8B6407f150D62adB1EF926F7f304600ec714","description":"propose transactions."}
      receivedPermissions.2.description:
-        "propose transactions."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.2.via:
+        [{"address":"0x085b8B6407f150D62adB1EF926F7f304600ec714"}]
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.3:
+        {"permission":"interact","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"propose transactions.","via":[]}
      issuedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      issuedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      issuedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.0.via.0:
+        {"address":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200}
      issuedPermissions.0.delay:
+        259200
      values.timelockAdminAC:
+        ["0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200,"description":"manage all access control roles and change the minimum delay."}]
    }
```

Generated with discovered.json: 0xea527b5dcf9806a3bd340ad0f223338fda340d20

# Diff at Tue, 04 Mar 2025 10:40:20 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 56755451
- current block number: 56755451

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 56755451 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: This timelock has a minimum delay of 0s. It does not have the L2_SENDER_ROLE yet.
      sinceBlock:
+        55404657
    }
```

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      sinceBlock:
+        41197311
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      sinceBlock:
+        41197308
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      sinceBlock:
+        41197430
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      sinceBlock:
+        34572100
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      sinceBlock:
+        41196850
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      sinceBlock:
+        41197426
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      sinceBlock:
+        34572095
    }
```

Generated with discovered.json: 0x82a5bd749b650d76f521b2037179ad7ead672671

# Diff at Tue, 04 Mar 2025 10:39:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21944239
- current block number: 21944239

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21944239 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057) {
    +++ description: None
      sinceBlock:
+        20292687
    }
```

```diff
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66) {
    +++ description: None
      sinceBlock:
+        20372302
    }
```

```diff
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D) {
    +++ description: None
      sinceBlock:
+        20292681
    }
```

```diff
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384) {
    +++ description: None
      sinceBlock:
+        20292637
    }
```

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      sinceBlock:
+        20427018
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      sinceBlock:
+        20019828
    }
```

```diff
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a) {
    +++ description: None
      sinceBlock:
+        20390079
    }
```

```diff
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F) {
    +++ description: None
      sinceBlock:
+        20422264
    }
```

```diff
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F) {
    +++ description: None
      sinceBlock:
+        20406309
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      sinceBlock:
+        15839298
    }
```

```diff
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f) {
    +++ description: None
      sinceBlock:
+        20292668
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      sinceBlock:
+        20292673
    }
```

```diff
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69) {
    +++ description: None
      sinceBlock:
+        20292656
    }
```

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      sinceBlock:
+        20425173
    }
```

```diff
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0) {
    +++ description: None
      sinceBlock:
+        20292645
    }
```

```diff
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971) {
    +++ description: Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts.
      sinceBlock:
+        21087222
    }
```

```diff
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A) {
    +++ description: None
      sinceBlock:
+        20378889
    }
```

```diff
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      sinceBlock:
+        20370671
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      sinceBlock:
+        20486023
    }
```

```diff
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88) {
    +++ description: None
      sinceBlock:
+        20370122
    }
```

```diff
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803) {
    +++ description: None
      sinceBlock:
+        20386973
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      sinceBlock:
+        20372086
    }
```

```diff
    contract ZkFoundationMultisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      sinceBlock:
+        20363246
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      sinceBlock:
+        20486034
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      sinceBlock:
+        20019827
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      sinceBlock:
+        20019830
    }
```

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      sinceBlock:
+        20393837
    }
```

```diff
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf) {
    +++ description: None
      sinceBlock:
+        20292663
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      sinceBlock:
+        20486034
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      sinceBlock:
+        20019898
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      sinceBlock:
+        20486038
    }
```

```diff
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231) {
    +++ description: None
      sinceBlock:
+        20390387
    }
```

Generated with discovered.json: 0x28177c39a81621a19a8bc43a34efb472c4d22016

# Diff at Fri, 28 Feb 2025 11:37:34 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a673c79f7be232b805781e844ed3929c5c5bb288 block: 55387644
- current block number: 56755451

## Description

Queue / execute [ZIP-5 Upgrade Governance Contracts](https://www.tally.xyz/gov/zksync/proposal/32477831455745537024214395992964479454779258818502397012096084176779102554510?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) and [ZIP-6 Prepare ZKsync for ZK Gateway](https://www.tally.xyz/gov/zksync/proposal/67712324710515983914473127418805437707715095849437613773846173900686148862581?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

### gud / bad tldr (check notion for )
gud meta:
- the verification tool works and is helpful
- most contracts are predeployed on L1 and verified
- the audits have a summary section and working links to github
- docs are on github
gud:
- more customizability for assets while keeping central cluster standards (asset routers and -handlers)
- ZK stack comes closer to being an interop cluster: prep for proof aggregation (lower cost, similar security), preconfs, fast L3<->L3 bridging (not in this upgrade)
- all in all clever architecture where chains will be bridgeable similar to assets (choose your settlement layer)
bad meta:
- verification tool has [some limitations](https://github.com/matter-labs/protocol-upgrade-verification-tool?tab=readme-ov-file#abilities-and-limitations-of-the-tool) (e.g. would be nice if there was a step-by-step to compile the `ecosystem-yaml` or contract bytecode myself).
- docs are a bit confusing because they talk about much more than the current upgrade
bad:
- DA switching to worse DA (rollup -> validium) will be instant and can be done by local chain operators (not zk stack operators) unless actively prevented by DA mode `permanent-rollup`
- token customizability in practice usually means worse trust assumptions and risk abstraction

check [the wiki entry](https://www.notion.so/l2beat/ZK-stack-protocol-upgrade-v26-Gateway-1a0094a2aee78009af4efc679ecbd995) for more.

## Watched changes

```diff
-   Status: DELETED
    contract TimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.1.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.0.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      directlyReceivedPermissions.0.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.lateQuorumVoteExtension:
-        604800
+        259200
      values.proposalQueuedCount:
-        4
+        6
      values.timelock:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.votingDelay:
-        604800
+        259200
    }
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714)
    +++ description: This timelock has a minimum delay of 0s. It does not have the L2_SENDER_ROLE yet.
```

## Source code changes

```diff
.../TimelockController.sol => .flat/ProtocolTimelockController.sol}       | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 55387644 (main branch discovery), not current.

```diff
    contract TimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      name:
-        "ProtocolTimelockController"
+        "TimelockController"
      description:
-        "Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s."
+        "Timelock contract allowing the queueing of transactions with a minimum delay of 0s."
    }
```

Generated with discovered.json: 0xd6e875cc8e83e0d38c0bba2253c8bb8ef4021044

# Diff at Fri, 28 Feb 2025 10:27:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a673c79f7be232b805781e844ed3929c5c5bb288 block: 21802976
- current block number: 21944239

## Description

Two new chains created: lumoz and zkcandy. The former is live.

Current ZK stack chains (BH.getAllHyperchains array): 
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH 🚀✅
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO 🚀✅
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH 🚀
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH 🚀✅
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH 🚀
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken) 🚀
7) [Treasure Chain](https://docs.treasure.lol/chain) 61166 Validium 0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879 MAGIC 🚀✅
8) Unknown 1345 Validium 0x89f90748A9a36C30A324481133fa198f4E16A824 ozETH
9) [lumoz](https://docs.lumoz.org/introduction/lumoz-chain) 9637 RU 0xC8C4cB5AF7c723c7EfD360898B47920679f92C92 MOZ 🚀
10) [zkcandy](https://zkcandy.io/) 320 RU 0xF2704433d11842d15aa76BBF0E00407267a99C92

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.9:
+        {"chainId":320,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x309EfA797ec5cd324Cb473F141F95214F3a25ab2"}
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.8:
+        {"chainId":9637,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      values.getAllHyperchainChainIDs.9:
+        320
      values.getAllHyperchainChainIDs.8:
+        9637
      values.getAllHyperchains.9:
+        "0xF2704433d11842d15aa76BBF0E00407267a99C92"
      values.getAllHyperchains.8:
+        "0xC8C4cB5AF7c723c7EfD360898B47920679f92C92"
    }
```

Generated with discovered.json: 0x6cb5d3288c6bb3c43612f498940dc890a6723970

# Diff at Wed, 26 Feb 2025 10:33:18 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 55387644
- current block number: 55387644

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 55387644 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x8240be23b7c2deb2da1c1ec6b7dcf4a49cf73f04

# Diff at Wed, 26 Feb 2025 10:33:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21802976
- current block number: 21802976

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802976 (main branch discovery), not current.

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0xeaf42c32ac714e06060a1a87b07efbfd885d6659

# Diff at Fri, 21 Feb 2025 09:00:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21802976
- current block number: 21802976

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802976 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x62dfffb7ceda3a33bfad682c9fc990bd6ac8ef22

# Diff at Sat, 08 Feb 2025 16:26:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21744163
- current block number: 21802976

## Description

sub-MS signer change.

## Watched changes

```diff
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e) {
    +++ description: None
      values.$members.4:
-        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.3:
-        "0xb9e3C7BbC0677dD018254C74B5ed2Ad90a0dba9F"
+        "0x0298512Bf8e7AC383c0A353354E3Ff66216654Ac"
      values.$members.2:
-        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
+        "0xb9e3C7BbC0677dD018254C74B5ed2Ad90a0dba9F"
      values.$members.1:
-        "0xB5676D771b538D8E184EaCB1Cc7a963a4bF99252"
+        "0x310E84b3063bBC5C86ED4Bf4D25E2fc3DF1B9735"
      values.$members.0:
-        "0x5B87156f1e4Da117c5B49571aa80C836b007e479"
+        "0xB5676D771b538D8E184EaCB1Cc7a963a4bF99252"
      values.multisigThreshold:
-        "1 of 5 (20%)"
+        "1 of 4 (25%)"
    }
```

Generated with discovered.json: 0x9829e200f5487d12242a34ff85f0d451e5115cec

# Diff at Thu, 06 Feb 2025 09:34:26 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 55181277
- current block number: 55387644

## Description

Seems to be the execution of [AAVE DAO Airdrop Claim Extension Request](https://www.tally.xyz/gov/zksync/proposal/57908166665921469155508302947951953966033148387652385473031300159207145997268?govId=eip155:324:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) TPP.

## Watched changes

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.19:
+        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
    }
```

Generated with discovered.json: 0xd294fbd6e769de9056e40610ba279d1fd676df80

# Diff at Tue, 04 Feb 2025 12:33:45 GMT:

- chain: zksync2
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 55181277
- current block number: 55181277

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 55181277 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.3.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s.
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
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
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

Generated with discovered.json: 0x055311d62bd21b26f6dbf2254bfc3b445ccb2b0d

# Diff at Tue, 04 Feb 2025 12:32:33 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21744163
- current block number: 21744163

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744163 (main branch discovery), not current.

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      directlyReceivedPermissions.2.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
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
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x60eec5b53262d973f06f6ca4f1d13d7a1bc5c4b9

# Diff at Mon, 03 Feb 2025 15:07:56 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 54882487
- current block number: 55181277

## Description

[AAVE DAO Airdrop Claim Extension Request](https://www.tally.xyz/gov/zksync/proposal/57908166665921469155508302947951953966033148387652385473031300159207145997268?govId=eip155:324:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) TPP queued.

## Watched changes

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        1
+        2
    }
```

Generated with discovered.json: 0x31b0dacc814f04df8b051448dbb2ffe2ec1fefa2

# Diff at Fri, 31 Jan 2025 11:18:51 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84b1296dd423a2ef9361874d922cd6911109ba10 block: 21716805
- current block number: 21744163

## Description

sub-MS member changes.

## Watched changes

```diff
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88) {
    +++ description: None
      values.$members.2:
+        "0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
      values.$members.1:
-        "0xDfe6610c2357a0BfECF788e52697554aF5F35174"
+        "0xd9f8460f3081dC29dF1e3b6e5404B245B96F4A30"
      values.$members.0:
-        "0xcD6998D20876155D37aEC0dB4C19d63EEAEf058F"
+        "0x438Df339934B6Fb9dA8E0DC6f0Ba0bca22B8A7b5"
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x3ac96ec7a82bd03e7013fd3b3d8c381cf7a9f3f7

# Diff at Thu, 30 Jan 2025 10:59:47 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 54684343
- current block number: 54882487

## Description

[GAP-2](https://vote.zknation.io/dao/proposal/35395412545014978447594654620386134175315194219985614464693911512436668500487?govId=eip155:324:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) queued.

## Watched changes

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        1
+        2
    }
```

Generated with discovered.json: 0xda20effe750a8a43dfc8c74f79941ffccfb1f6e1

# Diff at Wed, 29 Jan 2025 09:53:14 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 54684343
- current block number: 54684343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 54684343 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.3:
+        {"permission":"configure","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}
      receivedPermissions.2:
+        {"permission":"configure","from":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","description":"propose transactions."}
      receivedPermissions.1.from:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.1.description:
-        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
+        "execute transactions that are ready."
      receivedPermissions.1.via:
-        [{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
      receivedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s.
      issuedPermissions.2:
+        {"permission":"configure","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"execute transactions that are ready.","via":[]}
      issuedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.2:
+        {"permission":"configure","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"propose transactions.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"execute transactions that are ready.","via":[]}
      issuedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2:
+        {"permission":"configure","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"propose transactions."}
      receivedPermissions.1:
+        {"permission":"configure","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"execute transactions that are ready."}
      receivedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2:
+        {"permission":"configure","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions."}
      receivedPermissions.1:
+        {"permission":"configure","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"execute transactions that are ready."}
      receivedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.2:
+        {"permission":"configure","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"propose transactions.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"execute transactions that are ready.","via":[]}
      issuedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

Generated with discovered.json: 0x03c5af13478d02516b582a390c63107b0fe8a114

# Diff at Tue, 28 Jan 2025 06:34:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21715649
- current block number: 21716805

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715649 (main branch discovery), not current.

```diff
    contract EraAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      name:
-        "EraChainAdminProxy"
+        "EraAdminProxy"
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","description":"register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts."},{"permission":"configure","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager."},{"permission":"configure","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","description":"register new Elastic Chains in the shared bridge."}]
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29","via":[{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      issuedPermissions.0.via.0:
+        {"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}
      issuedPermissions.0.description:
+        "register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts."
      template:
+        "shared-zk-stack/BridgeHub"
      description:
+        "Sits between the shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations."
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      description:
-        "Can instantly upgrade all contracts and roles in the zksync Era contracts"
      fieldMeta:
-        {"getOwners":{"severity":"LOW","description":"Signers of the multisig","type":"PERMISSION"},"getThreshold":{"severity":"HIGH","description":"Should be 4/8 per official docs","type":"PERMISSION"}}
      receivedPermissions:
+        [{"permission":"configure","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","description":"register new tokens in the BridgeHub and create new chains sharing the Elastic Chain contracts.","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"permission":"configure","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","description":"manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager.","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"permission":"configure","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","description":"register new Elastic Chains in the shared bridge.","via":[{"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]
    }
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971) {
    +++ description: Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts.
      template:
+        "shared-zk-stack/GenesisUpgrade"
      description:
+        "Helper contract that defines diamondcut data to initialize a new diamond implementation for the chain-specific system contracts."
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
      template:
+        "shared-zk-stack/ProtocolUpgradeHandler"
      description:
+        "The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract."
      issuedPermissions:
+        [{"permission":"configure","to":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"start (queue) upgrades.","via":[]},{"permission":"configure","to":"0xBDFfCC71FE84020238F2990a6D2954e87355De0D","description":"soft freeze, hard freeze, approve a protocol upgrade.","via":[]},{"permission":"configure","to":"0xD677e09324F8Bb3cC64F009973693f751c33A888","description":"extend the legal veto period, approve a protocol upgrade.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
      values.members:
-        ["0x13f07d9BF17615f6a17F272fe1A913168C275A66","0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a","0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F","0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F","0x69462a81ba94D64c404575f1899a464F123497A2","0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A","0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0","0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88","0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803","0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44","0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e","0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"]
      values.$members:
+        ["0x13f07d9BF17615f6a17F272fe1A913168C275A66","0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a","0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F","0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F","0x69462a81ba94D64c404575f1899a464F123497A2","0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A","0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0","0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88","0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803","0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44","0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e","0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231"]
      values.$threshold:
+        9
      template:
+        "shared-zk-stack/SecurityCouncil"
      description:
+        "Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3)."
      receivedPermissions:
+        [{"permission":"configure","from":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897","description":"soft freeze, hard freeze, approve a protocol upgrade."}]
      references:
+        [{"text":"Security Council members - ZK Nation docs","href":"https://docs.zknation.io/zksync-governance/schedule-3-zksync-security-council"}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"},{"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"},{"permission":"upgrade","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"},{"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"},{"permission":"upgrade","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29","via":[{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      issuedPermissions.0.via.0:
+        {"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}
      issuedPermissions.0.description:
+        "manage the shared ValidatorTimelock contract address, revert batches and set permissioned validators for all chains connected to the StateTransitionManager."
      template:
+        "shared-zk-stack/StateTransitionManager"
      description:
+        "Defines L2 diamond contract creation and upgrade data, the proof system for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic)."
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
      values.members:
-        ["0x015318c16AE443a20DE0A776dB06a59F0D279057","0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D","0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384","0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f","0x55c671BcE13120387Ded710A1d1b80C0e3d8E857","0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69","0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0","0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"]
      values.$members:
+        ["0x015318c16AE443a20DE0A776dB06a59F0D279057","0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D","0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384","0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f","0x55c671BcE13120387Ded710A1d1b80C0e3d8E857","0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69","0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0","0xCe7a3dFcc35602155809920Ff65e093aa726f6cf"]
      values.$threshold:
+        5
      template:
+        "shared-zk-stack/Guardians"
      description:
+        "Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2."
      receivedPermissions:
+        [{"permission":"configure","from":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897","description":"extend the legal veto period, approve a protocol upgrade."}]
      references:
+        [{"text":"Guardians - ZK Nation docs","href":"https://docs.zknation.io/zksync-governance/schedule-4-zksync-guardians"}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29","via":[{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"},{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
+        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
      issuedPermissions.0.via.0:
+        {"address":"0x2cf3bD6a9056b39999F3883955E183F655345063"}
      issuedPermissions.0.description:
+        "register new Elastic Chains in the shared bridge."
      template:
+        "shared-zk-stack/L1SharedBridge"
      description:
+        "This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era."
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
      template:
+        "shared-zk-stack/EmergencyUpgradeBoard"
      description:
+        "A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897."
      receivedPermissions:
+        [{"permission":"upgrade","from":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"permission":"upgrade","from":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"permission":"upgrade","from":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[{"address":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"},{"address":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]
    }
```

Generated with discovered.json: 0xaa4e9dc207bc75f0cd3031a8eb0f73fec4be520a

# Diff at Mon, 27 Jan 2025 18:32:34 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 54670089
- current block number: 54684343

## Description

discodrive!

## Watched changes

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        3
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 54670089 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed."
      issuedPermissions:
+        [{"permission":"configure","to":"0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false.","via":[]},{"permission":"configure","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","description":"propose transactions."},{"permission":"configure","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":24}}]
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s.
      values.Canceller:
+        ["0x76705327e682F2d96943280D99464Ab61219e34f"]
      values.Executor:
+        ["0x76705327e682F2d96943280D99464Ab61219e34f"]
      values.getMinDelay_formatted:
+        "0s"
      values.Proposer:
+        ["0x76705327e682F2d96943280D99464Ab61219e34f"]
      template:
+        "shared-zk-stack/TimelockController"
      description:
+        "Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s."
      issuedPermissions:
+        [{"permission":"configure","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      values.Canceller:
+        ["0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"]
      values.Executor:
+        ["0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"]
      values.getMinDelay_formatted:
+        "3d"
      values.Proposer:
+        ["0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"]
      template:
+        "shared-zk-stack/TimelockController"
      description:
+        "Timelock contract allowing the queueing of transactions with a minimum delay of 3d."
      issuedPermissions:
+        [{"permission":"configure","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"propose transactions.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."}]
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
      issuedPermissions:
+        [{"permission":"configure","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"propose transactions."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200}]
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":24}}]
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8","via":[{"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8","description":"control all roles in the ZkToken access control, including the minter roles.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      issuedPermissions.0.via.0.address:
-        "0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      issuedPermissions.0.via.0.delay:
+        259200
      issuedPermissions.0.description:
+        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
      values.DefaultAdmin:
+        ["0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"]
      values.MinterAdmin:
+        ["0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"]
      template:
+        "shared-zk-stack/ZkToken"
      description:
+        "The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system."
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
      receivedPermissions:
+        [{"permission":"configure","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}]
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":24}}]
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      values.Canceller:
+        ["0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"]
      values.Executor:
+        ["0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"]
      values.getMinDelay_formatted:
+        "3d"
      values.Proposer:
+        ["0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"]
      template:
+        "shared-zk-stack/TimelockController"
      description:
+        "Timelock contract allowing the queueing of transactions with a minimum delay of 3d."
      issuedPermissions:
+        [{"permission":"configure","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"propose transactions.","via":[]}]
    }
```

Generated with discovered.json: 0x4f5c74e5e4ed8db60e1de92ff86377dbb4502f02

# Diff at Mon, 27 Jan 2025 13:17:28 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 54131125
- current block number: 54670089

## Description

[GAP-1](https://vote.zknation.io/dao/proposal/13823050748058617424077595486689751986818771098977300222700522842013613046754?govId=eip155:324:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) ZKsync Token Program Priorities 2025 Endorsement queued in timelock (voting finished in favor).

## Watched changes

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: None
      values.proposalQueuedCount:
-        0
+        1
    }
```

Generated with discovered.json: 0x1bea2349b623e76e37cd29e9fb16f8a540badb4f

# Diff at Mon, 27 Jan 2025 11:46:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21630370
- current block number: 21715649

## Description

new zk stack chain added:

🚀: posting batches
✅: officially launched 

Current ZK stack chains (BH.getAllHyperchains array): 
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH 🚀✅
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO 🚀✅
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH 🚀
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH 🚀✅
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH 🚀
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken) 🚀
7) [Treasure Chain](https://docs.treasure.lol/chain) 61166 Validium 0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879 MAGIC 🚀✅
8) Unknown 1345 Validium 0x89f90748A9a36C30A324481133fa198f4E16A824 ozETH

abstract will launch today.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.7:
+        {"chainId":1345,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x49664fFe2c2335c28631629606E26a6971aEf261"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.7:
+        1345
      values.getAllHyperchains.7:
+        "0x89f90748A9a36C30A324481133fa198f4E16A824"
    }
```

Generated with discovered.json: 0x5fd268f6b8cd64ea74979363d5fc9b7bc1f7fbf5

# Diff at Mon, 27 Jan 2025 08:45:23 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 21630370
- current block number: 21630370

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630370 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.cronosValidatorsAdded:
-        ["0xACBD581D1BedB2F71d2F5F01f881586e0623d591","0xE4F4FdaD61f192EBe9a32b2d2fB47A5802891e14","0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122","0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"]
      values.cronosValidatorsRemoved:
-        ["0xE4F4FdaD61f192EBe9a32b2d2fB47A5802891e14","0xACBD581D1BedB2F71d2F5F01f881586e0623d591"]
      values.grvtValidatorsAdded:
-        ["0x58D14960E0a2be353eDdE61ad719196A2b816522","0x0b114d4675Cb79507e68F2616c93e124122c6ef0"]
      values.grvtValidatorsRemoved:
-        []
      values.sophonValidatorsAdded:
-        ["0x4cc87B0A504047967CeD9A955431B3229237e7de","0xf3b07F6744e06cd5074b7D15ed2c33760837CE1f"]
      values.sophonValidatorsRemoved:
-        []
      values.treasureValidatorsAdded:
-        ["0x2572835e02b59078711aa0800490e80975e4169d","0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"]
      values.treasureValidatorsRemoved:
-        []
      values.zeronetworkValidatorsAdded:
-        ["0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","0x479B7c95b9509E1A834C994fc94e3581aA8A73B9"]
      values.zeronetworkValidatorsRemoved:
-        []
      values.zksyncValidatorsAdded:
-        ["0x0D3250c3D5FAcb74Ac15834096397a3Ef790ec99","0x3527439923a63F8C13CF72b8Fe80a77f6e572092"]
      values.zksyncValidatorsRemoved:
-        []
      values.cronosValidators:
+        ["0xb9d48DaF26F3CBE01A959F09f98E8a2eC8204122","0x7fEA26A181A792B5107ee0a31e434F5dBcbBe0B7"]
      values.grvtValidators:
+        ["0x58D14960E0a2be353eDdE61ad719196A2b816522","0x0b114d4675Cb79507e68F2616c93e124122c6ef0"]
      values.sophonValidators:
+        ["0x4cc87B0A504047967CeD9A955431B3229237e7de","0xf3b07F6744e06cd5074b7D15ed2c33760837CE1f"]
      values.treasureValidators:
+        ["0x2572835e02b59078711aa0800490e80975e4169d","0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"]
      values.zeronetworkValidators:
+        ["0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","0x479B7c95b9509E1A834C994fc94e3581aA8A73B9"]
      values.zksyncValidators:
+        ["0x0D3250c3D5FAcb74Ac15834096397a3Ef790ec99","0x3527439923a63F8C13CF72b8Fe80a77f6e572092"]
    }
```

Generated with discovered.json: 0x079e02fd625cb6f100f843470a2c5144657c22dd

# Diff at Mon, 20 Jan 2025 12:14:12 GMT:

- chain: zksync2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@658eb33e9afd98eac45a3037d195357115d19a86 block: 44113900
- current block number: 54131125

## Description

Config related: zksync2 discovery was deactivated for some time and is now re-enabled, these updates are old.

## Watched changes

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: None
      values.proposalQueuedCount:
-        0
+        1
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.accessControl.MINTER_ROLE.members.18:
+        "0x178bFf5A197FB4499526D04Db602C45cEDCA40a9"
      values.accessControl.MINTER_ROLE.members.17:
+        "0x4E86e74237Eb1f9432810eB5ab5861368d2f5964"
      values.accessControl.MINTER_ROLE.members.16:
+        "0x2ADa5C15BC4FEE97EC2463ce4F8E4557174B8Dcf"
      values.accessControl.MINTER_ROLE.members.15:
+        "0xD375A20d93C2F7C6a83B19C5ae153cF2C6e09ba9"
      values.accessControl.MINTER_ROLE.members.14:
+        "0x2CC6c7b1a59A23fB3faCAFe4A3791C5c8A58Cbcc"
      values.accessControl.MINTER_ROLE.members.13:
+        "0x6b689B93B368c7C25E6e5ecaeAb23C11F8C2c392"
      values.accessControl.MINTER_ROLE.members.12:
+        "0xDa2fBE31Fd47Af741bdB3dBC4eb662dA0107D33a"
      values.accessControl.MINTER_ROLE.members.11:
+        "0x3BC3f64d084bE6d3336f10340DC8424290FFc4ab"
      values.accessControl.MINTER_ROLE.members.10:
+        "0x11791c6249631555cEb75CB39128789E3954c2EC"
      values.accessControl.MINTER_ROLE.members.9:
+        "0xe546AEaaC57584da7554e7F88154DeDAD30A82b0"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: None
      values.proposalQueuedCount:
-        0
+        3
    }
```

Generated with discovered.json: 0x9b7b6c787576a3feea73a81c20ba63815740a4ea

# Diff at Mon, 20 Jan 2025 11:10:47 GMT:

- chain: zksync2
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 44113900
- current block number: 44113900

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      directlyReceivedPermissions.0.from:
+        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
    }
```

Generated with discovered.json: 0xddf66763fd2f8f422ceeeff1382e701e28511520

# Diff at Mon, 20 Jan 2025 11:10:06 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21630370
- current block number: 21630370

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630370 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      issuedPermissions.0.to:
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.2.from:
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      receivedPermissions.1.target:
-        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.1.from:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      receivedPermissions.0.target:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      receivedPermissions.0.from:
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      issuedPermissions.0.to:
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      issuedPermissions.0.to:
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
    }
```

Generated with discovered.json: 0x1952ccf0e63752ab6ffe2e2b850c6daa6c251323

# Diff at Mon, 20 Jan 2025 09:26:15 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x9689f25484248ef4dcada49eedef9676e5c7572e

# Diff at Mon, 20 Jan 2025 09:25:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21630370
- current block number: 21630370

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630370 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      fieldMeta.getOwners.type:
+        "PERMISSION"
      fieldMeta.getThreshold.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x089edefbfba6e10c0a05b5f4799e7ef7af5a1815

# Diff at Fri, 10 Jan 2025 11:44:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e594a564c9c62a7edef1a6e3f64f955bf70aa8eb block: 21585244
- current block number: 21593851

## Description

UpgradeTimestamp added for the latest ZKsync Protocol Upgrade v25 (QoL upgrade, partly reviewed below).

## Watched changes

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.1:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1736517600}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21585244 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.GrvtDiamond:
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      values.GrvtSTM:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.grvtThirdBatchTS:
-        1733327159
      values.grvtValidatorsAdded:
+        ["0x58D14960E0a2be353eDdE61ad719196A2b816522","0x0b114d4675Cb79507e68F2616c93e124122c6ef0"]
      values.grvtValidatorsRemoved:
+        []
      fieldMeta.grvtThirdBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

Generated with discovered.json: 0x403fce2f16a4bdb19d6487a08be2ae753e9a6875

# Diff at Thu, 09 Jan 2025 06:50:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21543858
- current block number: 21585244

## Description

Upgrade BridgeHub, StateTransitionManager, L1SharedBridge. [Tally proposal](https://www.tally.xyz/gov/zksync/proposal/39897055470405054808751466940888279812739313934036970931300785151980460250983?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

Minor changes only (replacing `require()` with `if(revert()))` and adding docs).

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      sourceHashes.1:
-        "0x0d42e482e85877d75871eacd767228a9e735bb3e0478cb2b80235d6f428ba055"
+        "0x568d6f26c34f7da5f4ac55957f99d9e66cbf967d550fa27ec431fb66bbd36a0b"
      values.$implementation:
-        "0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"
+        "0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"
      values.$pastUpgrades.2:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0x0029e562c0b54C0b88cB22adF4346DbfEC87400c"]]
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
-   Status: DELETED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      sourceHashes.1:
-        "0x96877e17c5bb84aa94de97c0a9764405e673c26bbf2c649349984d825b326940"
+        "0x2322249822d1ffda838f7005dd4137d161f15f2cc3553e9bffba7c04a44d9226"
      values.$implementation:
-        "0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"
+        "0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"
      values.$pastUpgrades.2:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0xb39B175a5E0945F2FB6A7F31764c0e31D9cF5b75"]]
      values.$upgradeCount:
-        2
+        3
      values.genesisUpgrade:
-        "0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2"
+        "0x6e2BC597F1e83F9fC7c1f69157F2C12476873971"
      values.getSemverProtocolVersion.2:
-        2
+        0
      values.getSemverProtocolVersion.1:
-        24
+        25
      values.initialCutHash:
-        "0x88acf7bca5d9b0309546e053ad035bd6d8da5f13f39ca1d8f8ffab1a8d4aa60f"
+        "0x0b30ec2102ea8e2cf92d22857c347d3b29bde8dfaf6f2ae19045f19c5a94ba5a"
      values.protocolVersion:
-        103079215106
+        107374182400
      values.storedBatchZero:
-        "0x1574fa776dec8da2071e5f20d71840bfcbd82c2bca9ad68680edfedde1710bc4"
+        "0x83325e26523f69ee6ea60aea582325d22f3c6a85db5e4890e14d62a377635a6b"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      sourceHashes.1:
-        "0xee3958605e4357a1803d3eb2c6d0d455fdbcc9c550a55b801834030d2a39cef8"
+        "0x23ebe4dfc517328a5acc1f6f8aa84be593be5db9d6357fcdcd69c62ca60853f7"
      values.$implementation:
-        "0xb56A8225A745756DD215faf22E4796f373561AcD"
+        "0xF5A14DCdde1143443f06033200D345c2a2828A99"
      values.$pastUpgrades.2:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0xF5A14DCdde1143443f06033200D345c2a2828A99"]]
      values.$upgradeCount:
-        2
+        3
      values.ERA_CHAIN_ID:
-        324
      values.ERA_DIAMOND_PROXY:
-        "0x32400084C286CF3E17e7B677ea9583e60a000324"
    }
```

```diff
+   Status: CREATED
    contract GenesisUpgrade (0x6e2BC597F1e83F9fC7c1f69157F2C12476873971)
    +++ description: None
```

## Source code changes

```diff
.../BridgeHub/Bridgehub.sol                        | 143 ++++++---
 .../{.flat@21543858 => .flat}/GenesisUpgrade.sol   | 352 +++++++++++++++------
 .../L1SharedBridge/L1SharedBridge.sol              | 278 +++++++++++-----
 .../StateTransitionManager.sol                     | 126 ++++++--
 4 files changed, 645 insertions(+), 254 deletions(-)
```

Generated with discovered.json: 0x630ceb70bec843b173e2618cf268f7e1adda1539

# Diff at Fri, 03 Jan 2025 12:08:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21421036
- current block number: 21543858

## Description

Multisig signer changes.

## Watched changes

```diff
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0) {
    +++ description: None
      values.$members.5:
-        "0x3133781381bC58564D5e9888c208ED0b7BD7721F"
      values.$members.4:
-        "0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
+        "0x3133781381bC58564D5e9888c208ED0b7BD7721F"
      values.$members.3:
-        "0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
+        "0xDFbD13B78010BF2110a168FA59b682c8a6D96564"
      values.$members.2:
-        "0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
+        "0xB2Be7F1957Fe3C3Be912e8C736d7e6e8459d386c"
      values.$members.1:
-        "0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
+        "0x0F3F84b0aaaA6f577468F6708e7A5E09e59dbfA1"
      values.$members.0:
-        "0x09040e439Ca5F1CF50CF4e9BE9b1F1FB8ef1ce07"
+        "0x2Fd57fdFba5aABbFdc43Fd450c2817D1401E72F2"
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x689e4270aa9108022db71e3b0f874b583a00bdef

# Diff at Thu, 12 Dec 2024 11:47:09 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21357589
- current block number: 21386218

## Description

Config related changes. Adding Sophon discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357589 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.treasureThirdBatchTS:
-        1732907795
      values.treasureValidatorsAdded:
+        ["0x2572835e02b59078711aa0800490e80975e4169d","0x4131719fb0FA1CB3e3A052A4A309ea7575d8c283"]
      values.treasureValidatorsRemoved:
+        []
      fieldMeta.treasureThirdBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

Generated with discovered.json: 0x94a03248b7c968a9228f4c918b302f081aaa268f

# Diff at Tue, 10 Dec 2024 11:08:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21357589
- current block number: 21357589

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21357589 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

Generated with discovered.json: 0x84b9b6d9912626f624bbec1ed2469d79f770962f

# Diff at Sun, 08 Dec 2024 11:51:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21334370
- current block number: 21357589

## Description

ML MS single member change.

## Watched changes

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      values.$members.1:
-        "0xe79af29d618141Ffef951B240b250d47030D56d7"
+        "0x8A23548a640De1137e58e2D9600e1c5913E3D674"
    }
```

Generated with discovered.json: 0x130741beb8896a212215e004768fdc2a13bfb95d

# Diff at Thu, 05 Dec 2024 06:01:51 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21313606
- current block number: 21334370

## Description

GRVT chain is active (chainId says mainnet). No launch announcement yet.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.grvtThirdBatchTS:
-        0
+        1733327159
    }
```

Generated with discovered.json: 0xc3e18d834ba499a857aacbf4ae99de7db3c45493

# Diff at Mon, 02 Dec 2024 08:23:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0cac24376573663e0a362b2f340a124e5238a2bc block: 21242824
- current block number: 21313606

## Description

Treasure.lol is now actively sending batches. No launch announcement yet.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.treasureThirdBatchTS:
-        0
+        1732907795
    }
```

Generated with discovered.json: 0xed104435ef55701aeca108a1798bf308db31f8d9

# Diff at Fri, 22 Nov 2024 10:58:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@47360b3fe185e6a526c31e0dfe4ad128b9d7db9f block: 21178397
- current block number: 21242824

## Description

New chain deployed: Treasure Chain

🚀: posting batches
✅: officially launched 

Current ZK stack chains (BH.getAllHyperchains array): 
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH 🚀✅
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO 🚀✅
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH 🚀
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH 🚀✅
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH 🚀
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken)
7) [Treasure Chain](https://docs.treasure.lol/chain) 61166 Validium 0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879 EDU

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.6:
+        {"chainId":61166,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x97440Bf040f0dfA402cf5D4F1e0f574309Ace871"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.6:
+        61166
      values.getAllHyperchains.6:
+        "0x5e64D248Eab336AB3Fd0BeC0CFe31D4AAE32E879"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21178397 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.treasureThirdBatchTS:
+        0
      fieldMeta.treasureThirdBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

Generated with discovered.json: 0x5cb3ef8489e38292ed93e28a0a458eea902c4bb1

# Diff at Wed, 13 Nov 2024 11:13:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@52436269c628b928351a43e9d5c374c442a5c66d block: 21077285
- current block number: 21178397

## Description

New ZK stack chain deployed (native token is called GBT - GRVTBaseToken)

Current ZK stack chains (BH.getAllHyperchains array):
1) ZKsync Era 324 RU 0x32400084C286CF3E17e7B677ea9583e60a000324 ETH
2) CronosZkEvm 388 Validium 0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc zkCRO
3) Sophon 50104 Validium 0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3 SOPH
4) ZeroNetwork 543210 RU 0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9 ETH
5) [Abstract](docs.abs.xyz) 2741 RU 0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9 ETH
6) [GRVT](https://grvt.gitbook.io/grvt/introduction/architecture-overview) 325 Validium 0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E GBT (GRVTBaseToken)

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.5:
+        {"chainId":325,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.abstractThirdBatchTS:
-        0
+        1730348459
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.5:
+        325
      values.getAllHyperchains.5:
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21077285 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Safe (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9)
    +++ description: None
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.sophonTenthBatchTS:
-        1730241371
      values.zeronetworkTenthBatchTS:
-        1729719755
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.abstractThirdBatchTS:
+        0
+++ description: If non-zero, the third batch has been posted (launch monitor).
+++ severity: MEDIUM
      values.grvtThirdBatchTS:
+        0
      fieldMeta.zeronetworkTenthBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.sophonTenthBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.abstractThirdBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
      fieldMeta.grvtThirdBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the third batch has been posted (launch monitor)."}
    }
```

```diff
-   Status: DELETED
    contract Safe (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ChainAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ChainAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Safe (0xe4644b6d106A18062344c0A853666bc0B8f052d1)
    +++ description: None
```

Generated with discovered.json: 0x7834eee0c00ff2ede2944dbdc6c7a1d9a38b154e

# Diff at Wed, 06 Nov 2024 12:10:20 GMT:

- chain: zksync2
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@569158b15e3821e66365edc31ada3588122315be block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
      issuedPermissions.0.via.0:
+        {"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC","delay":0}
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"}]
    }
```

Generated with discovered.json: 0xde45bfbb66b4c0ba71900ab28b3dcd0ed29ac97c

# Diff at Wed, 30 Oct 2024 08:32:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@133f6bdd684278299c8df162b697d52fa91f3aef block: 21064368
- current block number: 21077285

## Description

Sophon tenth batch committed, project PR is ready, waiting for them.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.sophonTenthBatchTS:
-        0
+        1730241371
    }
```

Generated with discovered.json: 0x49be4a26135f66dff4b13920e7b71330ccc21716

# Diff at Mon, 28 Oct 2024 13:16:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@00bd1d18460d612b1f06ce2339854c105cd41bd5 block: 21027403
- current block number: 21064368

## Description

New chainID 2741 deployed.

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.4:
+        {"chainId":2741,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661"}
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.zeronetworkTenthBatchTS:
-        0
+        1729719755
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.4:
+        2741
      values.getAllHyperchains.4:
+        "0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661)
    +++ description: None
```

## Source code changes

```diff
...-0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661.sol |  222 ++++
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 3 files changed, 1347 insertions(+)
```

Generated with discovered.json: 0x579cb2d4a94299bd6e5baab4aadab66f01057f9e

# Diff at Wed, 23 Oct 2024 09:31:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 21013457
- current block number: 21027403

## Description

ChainAdmin change for Sophon and Zero network. Both produced first batches already, not officially launched yet though.

## Watched changes

```diff
-   Status: DELETED
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC)
    +++ description: None
```

```diff
    contract ChainAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3) {
    +++ description: None
      values.owner:
-        "0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC"
+        "0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9"
      values.pendingOwner:
-        "0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ChainAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3) {
    +++ description: None
      values.owner:
-        "0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC"
+        "0xe4644b6d106A18062344c0A853666bc0B8f052d1"
      values.pendingOwner:
-        "0xe4644b6d106A18062344c0A853666bc0B8f052d1"
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../Safe.sol => /dev/null                          | 1088 --------------------
 .../SafeProxy.p.sol => /dev/null                   |   37 -
 2 files changed, 1125 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21013457 (main branch discovery), not current.

```diff
    contract Safe (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9) {
    +++ description: None
      values.getOwners:
-        ["0xA167ca2984F7e08EFd4DDf9c5a4A21D66c07813E","0xc858a504d6c267fe2d462D240b68A7D939B1fEC9","0xF322467cec88d3CDFa9376B19bD5AD40da665277","0x3Bc72A56F9036B94ad14BF082bF93731e0545255","0x3Ec90fA056A39e7281a5b4c8c044B86667D770e1"]
      values.getThreshold:
-        3
      template:
+        "GnosisSafe"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.sophonFirstBatchTS:
-        0
      values.zeronetworkFirstBatchTS:
-        0
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.sophonTenthBatchTS:
+        0
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.zeronetworkTenthBatchTS:
+        0
      fieldMeta.zeronetworkFirstBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.sophonFirstBatchTS:
-        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.zeronetworkTenthBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
      fieldMeta.sophonTenthBatchTS:
+        {"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}
    }
```

```diff
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC) {
    +++ description: None
      values.getOwners:
-        ["0xf2BFa7c00aDDF7765B40e83Fc4207b16EBD6db89","0xD767A6058c34E88Dc4Ce49114C362C8FAc265A76","0x2AF852529DDF5D3cF3130423b56DF8Db50A11b6B","0x090268B1b2170eB5964402321aDa988D7c75a90e"]
      values.getThreshold:
-        2
      template:
+        "GnosisSafe"
    }
```

```diff
    contract Safe (0xe4644b6d106A18062344c0A853666bc0B8f052d1) {
    +++ description: None
      values.getOwners:
-        ["0x3b6036d410cA018661324766680674921a8b2d89","0x20719Abd2E63518e68D30a295388cAd6B542dCEf","0x14574dfC6B7aF658c5033BA95673864947956521","0x90E10C37d8d9e854e7775B0069728642A1F88610","0x7f413262Cb811B034d077d9184b5Efda6943f2c3","0xd89b0f620E0C72BD82e0447dE07FB0A0Abe01F69"]
      values.getThreshold:
-        3
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x0e6c70c0ef9c01d3fdef20ceb46ed231ce43f024

# Diff at Mon, 21 Oct 2024 12:48:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 21013457
- current block number: 21013457

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21013457 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      descriptions:
-        ["Can instantly upgrade all contracts and roles in the zksync Era contracts"]
      description:
+        "Can instantly upgrade all contracts and roles in the zksync Era contracts"
    }
```

Generated with discovered.json: 0x4c413eb9e9afd24611089408ad364cabe7a1703c

# Diff at Mon, 21 Oct 2024 11:30:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@89bb82544503b2bb7544ceb7dedf56a03e0c5339 block: 21013457
- current block number: 21013457

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21013457 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"]
      values.$pastUpgrades.1.1:
-        ["0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"]
+        "0x21aec24a9df97ce4886d699314be627b0818da4d1987349421fb3df102c43f2b"
      values.$pastUpgrades.0.2:
+        ["0x12f893689f9603991a8c22C249FFd0509Be95661"]
      values.$pastUpgrades.0.1:
-        ["0x12f893689f9603991a8c22C249FFd0509Be95661"]
+        "0xdbb03a14ea223de3db4ac0916e78123bd0a1dde68e98952326d8382d29ac4d61"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"]
      values.$pastUpgrades.1.1:
-        ["0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"]
+        "0xc1e73b06359759201b76ab7654e0bd49011f33c0230dfc24423985fbf36ea817"
      values.$pastUpgrades.0.2:
+        ["0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"]
      values.$pastUpgrades.0.1:
-        ["0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"]
+        "0x514bbf46d227eee8567825bf5c8ee1855aa8a1916f7fee7b191e2e3d5ecba849"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xb56A8225A745756DD215faf22E4796f373561AcD"]
      values.$pastUpgrades.1.1:
-        ["0xb56A8225A745756DD215faf22E4796f373561AcD"]
+        "0xaec33529b74f8f9d56d7aa568c6358be299228a85e49ea85cb106eca5af7367c"
      values.$pastUpgrades.0.2:
+        ["0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"]
      values.$pastUpgrades.0.1:
-        ["0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"]
+        "0xce3d72f23297a281cb58502dcc6a6c029489316a2faf9c4ef83141b1b254017c"
    }
```

Generated with discovered.json: 0x03496e6ab8129e2a79adcf97e5207bd330279a28

# Diff at Mon, 21 Oct 2024 11:15:32 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x01a6715d3560241E09E865a46122bf347A576c09"]
      values.$pastUpgrades.1.1:
-        ["0x01a6715d3560241E09E865a46122bf347A576c09"]
+        "0xa6bc022ba0f60ac6f10a6efb84b261e9ca1b327a611bdd7a1f4d37cc9b027a3c"
      values.$pastUpgrades.0.2:
+        ["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]
      values.$pastUpgrades.0.1:
-        ["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]
+        "0x5bfce59c2ad18019ef20d58a3f1ec496cdc85537fc9564c932f7dcbbb2a15b56"
    }
```

Generated with discovered.json: 0x03f189e9a43739247b980d79767b1d27ad6069b3

# Diff at Mon, 21 Oct 2024 10:48:51 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20998125
- current block number: 21013457

## Description

Add metadata and triggers for the two new ZK stack chains launching soon.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20998125 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.SophonDiamond:
+        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
      values.SophonSTM:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
      values.ZeroNetworkDiamond:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.ZeroNetworkSTM:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.sophonFirstBatchTS:
+        0
      values.sophonValidatorsAdded:
+        ["0x4cc87B0A504047967CeD9A955431B3229237e7de","0xf3b07F6744e06cd5074b7D15ed2c33760837CE1f"]
      values.sophonValidatorsRemoved:
+        []
+++ description: If non-zero, the first batch has been posted.
+++ severity: MEDIUM
      values.zeronetworkFirstBatchTS:
+        0
      values.zeronetworkValidatorsAdded:
+        ["0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F","0x479B7c95b9509E1A834C994fc94e3581aA8A73B9"]
      values.zeronetworkValidatorsRemoved:
+        []
      fieldMeta:
+        {"zeronetworkFirstBatchTS":{"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."},"sophonFirstBatchTS":{"severity":"MEDIUM","description":"If non-zero, the first batch has been posted."}}
    }
```

Generated with discovered.json: 0x32eed5a1b6eaf7441ca6eafe6f85ee2e932531ab

# Diff at Sat, 19 Oct 2024 07:29:48 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@493c96785a6a32c6417182bb9548d3a990297dbe block: 20777100
- current block number: 20998125

## Description

Two new ZK stack Validiums are added that share the zksync/cronos implementation, verifier and STM.
* ['Sophon', Validium](https://sophon.xyz/) with chainID 50104, diamond 0x05ede6ad1f39b7a16c949d5c33a0658c9c7241e3, baseToken SOPH
* [Zerion(?), ZK Rollup](https://docs.zero.network/build-on-zero/network-information) with chainID 543210, diamond 0xdbd849acc6ba61f461cb8a41bbaee2d673ca02d9, baseToken ETH

Will add them underreview/full on monday ;)

## Watched changes

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.3:
+        {"chainId":543210,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3"}
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated.2:
+        {"chainId":50104,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3"}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.getAllHyperchainChainIDs.3:
+        543210
      values.getAllHyperchainChainIDs.2:
+        50104
      values.getAllHyperchains.3:
+        "0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9"
      values.getAllHyperchains.2:
+        "0x05eDE6aD1f39B7A16C949d5C33a0658c9C7241e3"
    }
```

```diff
+   Status: CREATED
    contract Safe (0x2e5BE1479cF661eeD9F526b7926eA87F6A5dD6a9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xe4644b6d106A18062344c0A853666bc0B8f052d1)
    +++ description: None
```

## Source code changes

```diff
...-0xCA8faaF5BA885fEC8C2c8CD49bADAa7589D173b3.sol |  222 ++++
 ...-0xE1eeA4D6443b19D373Fe99De838b930Ef0ac2Ad3.sol |  222 ++++
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 8 files changed, 3819 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777100 (main branch discovery), not current.

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      template:
+        "shared-zk-stack/ChainAdmin"
    }
```

Generated with discovered.json: 0x2246a8aced604288721a8ed0d1148c84b6110e4b

# Diff at Mon, 14 Oct 2024 11:00:47 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: None
      sourceHashes:
+        ["0x3d8c2d3bcd396a14d951c81ad0c163139768c7439152292846ce2ef8a34affe8"]
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: None
      sourceHashes:
+        ["0x7132507bdacfea50a991d23f4b78d18a03a78fe5a265fd7a07397c4f6ce93399"]
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x3a3b3a9708ad3a6179afe0f24a1426254e558d14bbaa4f155ed0db49027b2099"]
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: None
      sourceHashes:
+        ["0x82c5a05996248ee29f451f121ff0f973a3b17f7c7a8ed31878d30c5eaa51b245"]
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

Generated with discovered.json: 0x4919b628b23d822b85c121a07aa57e64591cfdb8

# Diff at Mon, 14 Oct 2024 10:55:49 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20777100
- current block number: 20777100

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777100 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      sourceHashes:
+        ["0x3423f941c413d4f07703ba62723b05600f2a33f8725e8d89a53194efb05f4086"]
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x0d42e482e85877d75871eacd767228a9e735bb3e0478cb2b80235d6f428ba055"]
    }
```

```diff
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2) {
    +++ description: None
      sourceHashes:
+        ["0xc9967ed702de956442f294c09e62b4c0a2c4c86707e081af1c4ae4b0119ac3fb"]
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      sourceHashes:
+        ["0x5c435b3eaf489b61e623af2356a751079cfa87c079c12e5d93108d007d3b4c97"]
    }
```

```diff
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: None
      sourceHashes:
+        ["0xe59fe71de493915d874d4d22b4637434d86b42759b4d5fd2dddf4f25cfdd1544"]
    }
```

```diff
    contract ZkFoundationMultisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: None
      sourceHashes:
+        ["0x153a01097ad00f13ce2cb9f0178a19858cb44dd75a40132d64d7fb1450cc0bf5"]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      sourceHashes:
+        ["0x04a556db1ea1a651e1174247090ad4c7105b455feab1a9672d5c4cd113b9ff0b"]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x96877e17c5bb84aa94de97c0a9764405e673c26bbf2c649349984d825b326940"]
    }
```

```diff
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888) {
    +++ description: None
      sourceHashes:
+        ["0xe702d26fd65786b2e88bd0998f300af1fa11cd1a733a78e5da7ec0699a60e5ce"]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xee3958605e4357a1803d3eb2c6d0d455fdbcc9c550a55b801834030d2a39cef8"]
    }
```

```diff
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29) {
    +++ description: None
      sourceHashes:
+        ["0x15445918f67256c3edb446079c491b396c922a20fb0dc931fa7aaa6095f19aa6"]
    }
```

Generated with discovered.json: 0xf64431a2b31fceb223cd8c07679bebcb4755d352

# Diff at Tue, 01 Oct 2024 11:14:28 GMT:

- chain: zksync2
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-21T18:48:46.000Z",["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]],["2024-06-10T09:25:38.000Z",["0x01a6715d3560241E09E865a46122bf347A576c09"]]]
    }
```

Generated with discovered.json: 0xd97b2cb4e179850b9ec5569ebc16941e345ce95c

# Diff at Tue, 01 Oct 2024 10:55:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20777100
- current block number: 20777100

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777100 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:03:59.000Z",["0x12f893689f9603991a8c22C249FFd0509Be95661"]],["2024-09-09T13:09:23.000Z",["0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"]]]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:04:23.000Z",["0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"]],["2024-08-06T08:56:59.000Z",["0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"]]]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:17:59.000Z",["0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"]],["2024-08-26T07:51:11.000Z",["0xb56A8225A745756DD215faf22E4796f373561AcD"]]]
    }
```

Generated with discovered.json: 0xc9681e2069081f5380a59667639df35872f0358c

# Diff at Wed, 18 Sep 2024 11:12:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14dc1d5395aaa4aca4e79a08fd6132e42e3cf1a4 block: 20741455
- current block number: 20777100

## Description

Renamed for clarity. (has both ChainAdmin and Elastic Chain Operator roles)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20741455 (main branch discovery), not current.

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      name:
-        "ChainAdmin"
+        "EraChainAdminProxy"
    }
```

Generated with discovered.json: 0x8280118b8556ab1e638dadc43c445dd09f499c68

# Diff at Fri, 13 Sep 2024 15:33:54 GMT:

- chain: zksync2
- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 44113900

## Description

Initial discovery: Added the three token governance contracts for the shared ZK stack (including the main ProtocolGov contract that acts through L1) and their timelocks. Wrote event alerts for all three contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC)
    +++ description: None
```

Generated with discovered.json: 0x87075ab461d044a431c2143eca3e60ab362bc7ad

# Diff at Fri, 13 Sep 2024 11:40:40 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f3f080827a9c9144630c7d8b5f28745b2029ead2 block: 20725957
- current block number: 20741455

## Description

Ownership of the four shared ZK stack contracts and their ProxyAdmin has been fully transferred to the ProtocolUpgradeHandler.

## Watched changes

```diff
-   Status: DELETED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../.flat@20725957/Governance.sol => /dev/null     | 440 ---------------------
 1 file changed, 440 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20725957 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: None
      values.EXTENDED_LEGAL_VETO_PERIOD:
+        604800
      values.HARD_FREEZE_PERIOD:
+        604800
      values.SOFT_FREEZE_PERIOD:
+        43200
      values.STANDARD_LEGAL_VETO_PERIOD:
+        259200
      values.UPGRADE_DELAY_PERIOD:
+        86400
      values.UPGRADE_WAIT_OR_EXPIRE_PERIOD:
+        2592000
      fieldMeta:
+        {"protocolFrozenUntil":{"severity":"HIGH","description":"Timestamp until which ALL Hyperchains connected to the main STM are frozen. (Mailbox and Executor facets blocked)"}}
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
    contract ZkFoundationMultisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ZkFoundationMultisig"
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: None
      fieldMeta:
+        {"softFreezeNonce":{"severity":"HIGH","description":"Increments with each softFreeze (freezes ALL Hyperchains (blocks Mailbox and Executor facets) connected to the main STM for SOFT_FREEZE_PERIOD"},"hardFreezeNonce":{"severity":"HIGH","description":"Increments with each hardFreeze (freezes ALL Hyperchains (blocks Mailbox and Executor facets) connected to the main STM for HARD_FREEZE_PERIOD"}}
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

Generated with discovered.json: 0x5316f6730537230399f403d045aae371108b264d

# Diff at Wed, 11 Sep 2024 07:44:15 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20713619
- current block number: 20725957

## Description

Two child-multisigs of the SecurityCouncil have signer-changes.

## Watched changes

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      values.$members.11:
+        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
      values.$members.10:
-        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
+        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
      values.$members.9:
-        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
+        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
      values.$members.8:
-        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
+        "0xe968FB773e54f77350A427B057FDB44e6592E338"
      values.$members.7:
-        "0xe968FB773e54f77350A427B057FDB44e6592E338"
+        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
      values.$members.6:
-        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
+        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
      values.$members.5:
-        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
+        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
      values.$members.4:
-        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
+        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
      values.$members.3:
-        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
+        "0x7e0d106fD2Cee9aa846bc419944f5eD8F2935135"
      values.$members.2:
-        "0x7e0d106fD2Cee9aa846bc419944f5eD8F2935135"
+        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
      values.$members.1:
-        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
+        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
      values.$members.0:
-        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
+        "0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A"
      values.multisigThreshold:
-        "1 of 11 (9%)"
+        "1 of 12 (8%)"
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      values.$members.4:
+        "0x57855BeeB39C56ca4Ff41C1D039B0F022ED08cea"
      values.$members.3:
-        "0x57855BeeB39C56ca4Ff41C1D039B0F022ED08cea"
+        "0xA1AF6Ed43eDeE80F1913ea44E9DC2A93A738EB44"
      values.$members.2:
-        "0xA1AF6Ed43eDeE80F1913ea44E9DC2A93A738EB44"
+        "0x896E7D2108245ae8d5Aa7E4763024b3945AEd77F"
      values.$members.1:
-        "0x896E7D2108245ae8d5Aa7E4763024b3945AEd77F"
+        "0x6c25cda91Bef3A4Ba1e4488b4ac276aA02921D67"
      values.$members.0:
-        "0x6c25cda91Bef3A4Ba1e4488b4ac276aA02921D67"
+        "0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
      values.multisigThreshold:
-        "1 of 4 (25%)"
+        "1 of 5 (20%)"
    }
```

Generated with discovered.json: 0xfebdc41677b04bf109847e17a5320f23bd01c291

# Diff at Mon, 09 Sep 2024 14:22:30 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@92161a8609a409a7bea80cf1d38924cd21e5bc7f block: 20692926
- current block number: 20713619

## Description

BridgeHub upgrade (one-line diff):
* `addToken()` (acts as a global token whitelist for the shared bridge) now can only be called by the owner (not the admin). Currently those two roles are still held by the same address anyway.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.64:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"},{"name":"implementation","value":"0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$implementation:
-        "0x12f893689f9603991a8c22C249FFd0509Be95661"
+        "0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../ethereum/{.flat@20692926 => .flat}/BridgeHub/Bridgehub.sol          | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x954bbe4a7a75f6047280a13af0431f31d4dc3168

# Diff at Fri, 06 Sep 2024 17:05:06 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20663562
- current block number: 20692926

## Description

This update introduces a new ProtocolUpgradeHandler contract, with a new attached Governance system. The ProtocolUpgradeHandler is pendingOwner in all shared ZK stack contracts and will supposedly be used as the new owner of the central ProxyAdmin. It currently has no gov roles assigned (yet).

The L2 part of the Governance will be added in a separate config / PR.

### ProtocolUpgradeHandler.sol

Keeps track of the upgrade stages, executes upgrades, freezes contracts (all ZK shared contracts). (needs ProxyAdmin Owner and owner permissions)

check out my ART:
```
                     +----------------+
                     |     START      |
                     | (UpgradeState  |
                     |     .None)     |
                     +----------------+
                              |
      L2_PROTOCOL_GOVERNOR    |  (Currently timelock with 3 L2 Gov contracts)
                              v
                     +----------------+
                     |    Proposal    |
                     | (UpgradeState  |
                     |     .None)     |
                     +----------------+
                              |
    Timelock L2 (minDelay 0)  | message to L1
                              v
         +---------------------------------------------+
         |           Legal Veto Period                 |
         | (3 days, extendable to 7 days by Guardians) |
         |        (UpgradeState.LegalVetoPeriod)       |
         +---------------------------------------------+
                              |
                              | Time passes
                              v 
                     +----------------+ nobody   +----------------------+
                     |    Waiting     | approves |                      |
                     | (UpgradeState  |--------> | UpgradeState.expired |
                     |   .Waiting)    | 30 days  |                      |
                     +----------------+          +----------------------+
                         /        \
     Security Council  /            \ Guardians approve within
approves (immediate)  /              \  waiting period (+ 30d !!)
                     v                v 
         +---------------------------------+ 
         |       Execution Pending         | 
         | (UpgradeState.ExecutionPending) | 
         +---------------------------------+ 
                          |
                          | 1 day
                          v  
                 +-----------------+
                 |      Ready      |
                 | (UpgradeState   |
                 |    .Ready)      |
                 +-----------------+
                 | 
                 |        
                 |  Executor   or
                 |  Security Council
                 v 
         +-----------------+
         |    Executed     |
         | (UpgradeState   |
         |     .Done)      |
         +-----------------+

Actors:
- L2 Timelock Governors: Initiate the upgrade proposal
- Guardians: Can extend legal veto period and/or approve within 30d delay
- Security Council: Can approve immediately after legal waiting (3d)
- Executor: Specified address that can execute the upgrade when ready

UpgradeState Enum:
- None: Initial state or non-existent upgrade
- LegalVetoPeriod: During the legal veto period
- Waiting: Waiting for approval by SC or Guardians
- ExecutionPending: Approved, waiting for execution delay (1d)
- Ready: Ready for execution
- Done: Upgrade executed
- Expired: Upgrade expired without execution
```

Apart from this non-emergency track, there is `executeEmergencyUpgrade()` which has no delay. For this, SC, ZK_FOUNDATION MS and Guardians must all approve. (Uses eip712 standard)

Delay with current vars: 
- L2 proposal, then SC: messageToL1delay+3d+1d = ~5d (The ProtocolUpgradeHandler calls `proveL2MessageInclusion()` which needs the upgrade message batch from L2 to be executed on L1, thus currently ~1d messageToL1delay)
- L2 Proposal, then Guardians: messageToL1delay+3d+30d+1d = ~35d
- L1 'emergency' proposal by SC, ZK_FOUNDATION MS, Guardians = No delay

### EmergencyUpgradeBoard.sol

Uses eip712 standard to check signatures from SC, ZK_FOUNDATION MS and Guardians to push emergency approvals through the ProtocolUpgradeHandler.

### SecurityCouncil

12 signers custom multisig (some signers are MS themselves) with varying thresholds for certain actions. (3-9) Has eip712 support.

### Guardians

8 signers custom multisig (all signers are 1/1 GnosisSafes) with eip712 support. `"APPROVE_UPGRADE_GUARDIANS_THRESHOLD": 5`

### ZK Foundation Safe

New 3/5 GnosisSafe currently only used in by the EmergencyUpgradeBoard.

### Various GnosisSafes in the diff

Belong to Guardians or SC signers, there are no superfluous contracts in the config.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.63:
+        {"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/EmergencyUpgradeBoard.sol       | 1233 +++++++++++++++++
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../shared-zk-stack/ethereum/.flat/Guardians.sol   | 1439 ++++++++++++++++++++
 .../ethereum/.flat/ProtocolUpgradeHandler.sol      |  605 ++++++++
 .../ethereum/.flat/SecurityCouncil.sol             | 1389 +++++++++++++++++++
 46 files changed, 25414 insertions(+)
```

Generated with discovered.json: 0xe131f21db446bf93a860e4e5e83e4f27e772bd97

# Diff at Fri, 30 Aug 2024 08:00:41 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20618759
- current block number: 20618759

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20618759 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xfddab7e20377594ae29665447bb6672e87b6f07a

# Diff at Tue, 27 Aug 2024 08:35:30 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@cf2dd34fdc5bce846ae811aa246ba203fc03f637 block: 20585030
- current block number: 20618759

## Description

The transactions were executed immediately and update the implementation of the shared bridge contract to introduce the ability to set an admin that can initialize new chains to the shared bridge (can set a chain's l2 bridge address) or add a new pending admin. The `onlyOwnerOrAdmin` is added for this purpose, so the two functions are also callable by the owner (matter labs gov).

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.62:
+        {"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.61:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"},{"name":"implementation","value":"0xb56A8225A745756DD215faf22E4796f373561AcD"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.60:
+        {"delay":0,"operation":{"calls":[{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"requestL2TransactionDirect","inputs":[{"name":"_request","value":[388,"8000000000000000000","0x898B3560AFFd6D955b1574D87EE09e46669c60eA",0,"0xb71bcf9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005457468657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034554480000000000000000000000000000000000000000000000000000000000",1600000,800,[],"0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$implementation:
-        "0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"
+        "0xb56A8225A745756DD215faf22E4796f373561AcD"
      values.$upgradeCount:
-        1
+        2
      values.admin:
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.pendingAdmin:
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../L1SharedBridge/L1SharedBridge.sol              | 68 +++++++++++++++++++++-
 1 file changed, 67 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0x3f5e72eeb57d7ed748830fda356242452bae1bd4

# Diff at Fri, 23 Aug 2024 09:55:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20585030
- current block number: 20585030

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20585030 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x4640fe69b924e5b47a41d891a603415d05e47cc1

# Diff at Thu, 22 Aug 2024 15:26:28 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20577647
- current block number: 20585030

## Description

Config changes related to trust permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20577647 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0x21457d5a4d6030a99808e98536320926080b462b

# Diff at Wed, 21 Aug 2024 14:40:15 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ff9ee2b2fd37e2cdd4a4bcebdcefcb5e61b1e6c block: 20469956
- current block number: 20577647

## Description

10 zkCRO tokens were transferred from the Matter Labs Multisig to the Governance contract and then 2 of them deposited to the bridge.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.59:
+        {"delay":0,"operation":{"calls":[{"target":"0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2","value":"0","function":"approve","inputs":[{"name":"spender","value":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"},{"name":"value","value":"10000000000000000000"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"requestL2TransactionDirect","inputs":[{"name":"_request","value":[388,"2000000000000000000","0x898B3560AFFd6D955b1574D87EE09e46669c60eA",0,"0xb71bcf9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005457468657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034554480000000000000000000000000000000000000000000000000000000000",400000,800,[],"0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0xa9240a22791f73d566140a9cdc4236fe6c458128

# Diff at Wed, 21 Aug 2024 10:05:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0xda40aa4c78260b726a113b92cf0b6ad67b96c8e1

# Diff at Fri, 09 Aug 2024 12:02:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      assignedPermissions.upgrade.0:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
    }
```

Generated with discovered.json: 0xf03a299dddbd127d2d553cbfff574e6d581ee856

# Diff at Fri, 09 Aug 2024 10:12:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      values.$multisigThreshold:
-        "4 of 7 (57%)"
+++ description: Signers of the multisig
+++ severity: LOW
      values.getOwners:
-        ["0x3F0009D00cc78979d00Eb635490F23E8d6aCc481","0xe79af29d618141Ffef951B240b250d47030D56d7","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0xFAdb20191Ab38362C50f52909817B74214CA79AE","0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2","0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"]
+++ description: Should be 4/8 per official docs
+++ severity: HIGH
      values.getThreshold:
-        4
      values.$members:
+        ["0x3F0009D00cc78979d00Eb635490F23E8d6aCc481","0xe79af29d618141Ffef951B240b250d47030D56d7","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0xFAdb20191Ab38362C50f52909817B74214CA79AE","0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2","0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]
      assignedPermissions.upgrade:
+        ["0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]
    }
```

Generated with discovered.json: 0xa996360228c16c8eb5c8e3493c4f01c107b710c8

# Diff at Tue, 06 Aug 2024 13:54:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08572cac0b099c9871f6e5b417260b029c0e9393 block: 20432409
- current block number: 20469956

## Description

The shared ZK stack contracts BridgeHub and StateTransitionManager (used by cronos and ZKsync Era) and also the ZKsync Era diamond proxy are moved to new admin contract called 'ChainAdmin' (owner is Matter Labs MS). The STM is upgraded to a new implementation with marginal diff (one added event).

The scheduled tx is immediately executed.

This upgrade does not change net permissions at the moment but will probably be used in the future once more ZK stack chains are used or something like a SecurityCouncil is added.

### New ChainAdmin contract

This contract is very simple with the most important functions being:
- `multicall` (onlyOwner): Does what the name suggests
- `setTokenMultiplier` (callable by `tokenMultiplierSetter`): Used for the custom gas tokens of ZK stack chains
- `setUpgradeTimestamp` (onlyOwner): sets a public expected upgrade timestamp for a new protocol version (like the one used for this upgrade `103079215106`), this var is only informative and not enforced so far

The contract is set as admin (NOT upgradeability admin, see upgrades&gov diagram) for the BridgeHub, the STM and the ZKsync Era diamond at the moment.
The Governance contract still has its former upgradeabilityAdmin role.


## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.58:
+        {"delay":0,"operation":{"calls":[{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"setNewVersionUpgrade","inputs":[{"name":"_cutData","value":[[],"0x4d376798Ba8F69cEd59642c3AE8687c7457e855d","0x08284e5700000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000004c00000000000000000000000000000000000000000000000000000000066ab923f0000000000000000000000000000000000000000000000000000001800000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]},{"name":"_oldProtocolVersion","value":103079215105},{"name":"_oldProtocolVersionDeadline","value":"115792089237316195423570985008687907853269984665640564039457584007913129639935"},{"name":"_newProtocolVersion","value":103079215106}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.57:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"},{"name":"implementation","value":"0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"}]},{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.admin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
+++ description: Signers of the multisig
+++ severity: LOW
      values.getOwners.4:
-        "0x9dF8bc0918F357c766A5697E031fF5237c05747A"
+        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$implementation:
-        "0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"
+        "0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"
      values.admin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.getSemverProtocolVersion.2:
-        1
+        2
      values.protocolVersion:
-        103079215105
+        103079215106
    }
```

```diff
+   Status: CREATED
    contract ChainAdmin (0x2cf3bD6a9056b39999F3883955E183F655345063)
    +++ description: None
```

## Source code changes

```diff
.../shared-zk-stack/ethereum/.flat/ChainAdmin.sol  | 214 +++++++++++++++++++++
 .../StateTransitionManager.sol                     |  24 ++-
 2 files changed, 228 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x71be9779a8f3457a1989249b52a4cdb17a231835

# Diff at Wed, 31 Jul 2024 10:26:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20425929

## Description

Initial discovery of the shared config.

Two governance transactions (no delay) add the new Cronos zkEVM (First ZK stack chain). It shares the StateTransitionManager, ValidatorTimelock and Verifier with ZKsync Era, thus sharing the L2 logic. For DA it uses ValidiumMode. (https://etherscan.io/tx/0xb2a1d8913ebe7b4a8a21064c994801ad036fc85da1f378f35b57956df72f0131)
Four new Validators are registered with the Timelock, of which two are removed, leaving two new ones and two each for ZKsync Era and Cronos zkEVM.

The Cronos DiamondProxy is not yet verified.

## Initial discovery

```diff
+   Status: CREATED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828)
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB)
    +++ description: None
```

