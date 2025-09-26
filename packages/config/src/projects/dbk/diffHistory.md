Generated with discovered.json: 0x4b89f5a15f2eb90563dfab194475afaf33a9e78e

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x2527ee8a56015503f1b49201e9871fe9aaf619af

# Diff at Mon, 14 Jul 2025 12:44:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"
+        "eth:0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"
      values.$pastUpgrades.0.2.0:
-        "0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"
+        "eth:0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"
+        "eth:0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"
+++ severity: HIGH
      values.challenger:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
+        "eth:0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      values.CHALLENGER:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
+        "eth:0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
+++ severity: HIGH
      values.proposer:
-        "0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
+        "eth:0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
      values.PROPOSER:
-        "0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
+        "eth:0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
      implementationNames.0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e:
-        "Proxy"
      implementationNames.0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034:
-        "L2OutputOracle"
      implementationNames.eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e:
+        "Proxy"
      implementationNames.eth:0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0x0786509ADf5a28e8baA6247CE0faBCA42b5de4c9) {
    +++ description: None
      address:
-        "0x0786509ADf5a28e8baA6247CE0faBCA42b5de4c9"
+        "eth:0x0786509ADf5a28e8baA6247CE0faBCA42b5de4c9"
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
+        "eth:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0xE62EaD0c8d90f602AdE7c9B0df89025AFB61AbA4"
+        "eth:0xE62EaD0c8d90f602AdE7c9B0df89025AFB61AbA4"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
      values.MESSENGER:
-        "0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      values.systemConfig:
-        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      implementationNames.0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977:
-        "L1ChugSplashProxy"
      implementationNames.0xE62EaD0c8d90f602AdE7c9B0df89025AFB61AbA4:
-        "L1StandardBridge"
      implementationNames.eth:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xE62EaD0c8d90f602AdE7c9B0df89025AFB61AbA4:
+        "L1StandardBridge"
    }
```

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
+        "eth:0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      values.owner:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      implementationNames.0x306402f889035e2Cbd7e396080bf365ADB38B7DC:
-        "AddressManager"
      implementationNames.eth:0x306402f889035e2Cbd7e396080bf365ADB38B7DC:
+        "AddressManager"
    }
```

```diff
    EOA  (0x322C9a45368FdcdF358a4Ba340f88073Dc239e24) {
    +++ description: None
      address:
-        "0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
+        "eth:0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
    }
```

```diff
    EOA  (0x3867795f21ab2Fcb2dACb05f03CC6FCf50eb4BAF) {
    +++ description: None
      address:
-        "0x3867795f21ab2Fcb2dACb05f03CC6FCf50eb4BAF"
+        "eth:0x3867795f21ab2Fcb2dACb05f03CC6FCf50eb4BAF"
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031"
+        "eth:0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031"
      values.$pastUpgrades.0.2.0:
-        "0x09eBA78DED12068c301dFF046333424AE2521578"
+        "eth:0x09eBA78DED12068c301dFF046333424AE2521578"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031"
+        "eth:0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031"
      values.guardian:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
+        "eth:0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      values.l2Oracle:
-        "0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      values.systemConfig:
-        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      implementationNames.0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92:
-        "Proxy"
      implementationNames.0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031:
-        "OptimismPortal"
      implementationNames.eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92:
+        "Proxy"
      implementationNames.eth:0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0x6De8148Dad080548bd2D0C5a294549438aD5EFfD) {
    +++ description: None
      address:
-        "0x6De8148Dad080548bd2D0C5a294549438aD5EFfD"
+        "eth:0x6De8148Dad080548bd2D0C5a294549438aD5EFfD"
    }
```

```diff
    EOA  (0x6F0bc3fF0BE6fD52Ba3631bF9cB245a6d3181bdb) {
    +++ description: None
      address:
-        "0x6F0bc3fF0BE6fD52Ba3631bF9cB245a6d3181bdb"
+        "eth:0x6F0bc3fF0BE6fD52Ba3631bF9cB245a6d3181bdb"
    }
```

```diff
    EOA  (0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74) {
    +++ description: None
      address:
-        "0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74"
+        "eth:0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "eth:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0x2470eE5fDCa25fD60d178e16821931f830200ef9"
+        "eth:0x2470eE5fDCa25fD60d178e16821931f830200ef9"
      values.$pastUpgrades.0.2.0:
-        "0x2470eE5fDCa25fD60d178e16821931f830200ef9"
+        "eth:0x2470eE5fDCa25fD60d178e16821931f830200ef9"
      values.bridge:
-        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
+        "eth:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      values.BRIDGE:
-        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
+        "eth:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      implementationNames.0x7F7a01cBE67a31625B0C137e835a12d494E293c2:
-        "Proxy"
      implementationNames.0x2470eE5fDCa25fD60d178e16821931f830200ef9:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x7F7a01cBE67a31625B0C137e835a12d494E293c2:
+        "Proxy"
      implementationNames.eth:0x2470eE5fDCa25fD60d178e16821931f830200ef9:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0x80Ea66ABb3B0258e0eFB879d5C54f01683264077) {
    +++ description: None
      address:
-        "0x80Ea66ABb3B0258e0eFB879d5C54f01683264077"
+        "eth:0x80Ea66ABb3B0258e0eFB879d5C54f01683264077"
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      address:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.addressManager:
-        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
+        "eth:0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      values.owner:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
+        "eth:0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      implementationNames.0x830e68669019a05F41676546417D2A06fdfFF9fB:
-        "ProxyAdmin"
      implementationNames.eth:0x830e68669019a05F41676546417D2A06fdfFF9fB:
+        "ProxyAdmin"
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
+        "eth:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd"
+        "eth:0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd"
      values.$pastUpgrades.0.2.0:
-        "0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd"
+        "eth:0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd"
      values.messenger:
-        "0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
      values.MESSENGER:
-        "0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      implementationNames.0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02:
-        "Proxy"
      implementationNames.0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd:
-        "L1ERC721Bridge"
      implementationNames.eth:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02:
+        "Proxy"
      implementationNames.eth:0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd:
+        "L1ERC721Bridge"
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63"
+        "eth:0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63"
      values.$pastUpgrades.0.2.0:
-        "0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63"
+        "eth:0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63"
      values.guardian:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
+        "eth:0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      implementationNames.0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6:
-        "Proxy"
      implementationNames.0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63:
-        "SuperchainConfig"
      implementationNames.eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6:
+        "Proxy"
      implementationNames.eth:0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63:
+        "SuperchainConfig"
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6"
+        "eth:0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6"
      values.$pastUpgrades.0.2.0:
-        "0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6"
+        "eth:0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6"
      values.batcherHash:
-        "0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74"
+        "eth:0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74"
      values.batchInbox:
-        "0xFF00000000000000000000000000000020240603"
+        "eth:0xFF00000000000000000000000000000020240603"
      values.disputeGameFactory:
-        "0xcedFB43E1c6f3e1fbCde1d9Ec4c7749468FC3345"
+        "eth:0xcedFB43E1c6f3e1fbCde1d9Ec4c7749468FC3345"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
      values.l1ERC721Bridge:
-        "0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
+        "eth:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      values.l1StandardBridge:
-        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
+        "eth:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      values.optimismMintableERC20Factory:
-        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "eth:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      values.optimismPortal:
-        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      values.owner:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
+        "eth:0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      values.sequencerInbox:
-        "0xFF00000000000000000000000000000020240603"
+        "eth:0xFF00000000000000000000000000000020240603"
      values.unsafeBlockSigner:
-        "0x80Ea66ABb3B0258e0eFB879d5C54f01683264077"
+        "eth:0x80Ea66ABb3B0258e0eFB879d5C54f01683264077"
      implementationNames.0xcCcc98e93CeE060a03604D3916EE527a57078c8b:
-        "Proxy"
      implementationNames.0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6:
-        "SystemConfig"
      implementationNames.eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b:
+        "Proxy"
      implementationNames.eth:0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6:
+        "SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
      values.$admin:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      values.$implementation:
-        "0x307c7773097445400d2F2a51D65e38AEa8231868"
+        "eth:0x307c7773097445400d2F2a51D65e38AEa8231868"
      values.$pastUpgrades.0.2.0:
-        "0x307c7773097445400d2F2a51D65e38AEa8231868"
+        "eth:0x307c7773097445400d2F2a51D65e38AEa8231868"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      values.PORTAL:
-        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      values.ResolvedDelegateProxy_addressManager:
-        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
+        "eth:0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      values.superchainConfig:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      values.systemConfig:
-        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      implementationNames.0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254:
-        "ResolvedDelegateProxy"
      implementationNames.0x307c7773097445400d2F2a51D65e38AEa8231868:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x307c7773097445400d2F2a51D65e38AEa8231868:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract DeBank Multisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      address:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
+        "eth:0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x6F0bc3fF0BE6fD52Ba3631bF9cB245a6d3181bdb"
+        "eth:0x6F0bc3fF0BE6fD52Ba3631bF9cB245a6d3181bdb"
      values.$members.1:
-        "0x3867795f21ab2Fcb2dACb05f03CC6FCf50eb4BAF"
+        "eth:0x3867795f21ab2Fcb2dACb05f03CC6FCf50eb4BAF"
      values.$members.2:
-        "0x0786509ADf5a28e8baA6247CE0faBCA42b5de4c9"
+        "eth:0x0786509ADf5a28e8baA6247CE0faBCA42b5de4c9"
      values.$members.3:
-        "0x6De8148Dad080548bd2D0C5a294549438aD5EFfD"
+        "eth:0x6De8148Dad080548bd2D0C5a294549438aD5EFfD"
      implementationNames.0xfB04A190dC7D91E86109433858A48E0B98EF1450:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xfB04A190dC7D91E86109433858A48E0B98EF1450:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8) {
    +++ description: None
      address:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
+        "eth:0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
    }
```

```diff
    EOA  (0xFF00000000000000000000000000000020240603) {
    +++ description: None
      address:
-        "0xFF00000000000000000000000000000020240603"
+        "eth:0xFF00000000000000000000000000000020240603"
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DeBank Multisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450)
    +++ description: None
```

Generated with discovered.json: 0x94cb6cf3bdbb97e12bb60d38b5b59407768974fd

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xee2b0f94cc0362460735a05d54e08056632a3d5f

# Diff at Fri, 04 Jul 2025 12:18:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    EOA  (0x322C9a45368FdcdF358a4Ba340f88073Dc239e24) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      receivedPermissions.1.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
    }
```

```diff
    EOA  (0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
+        "eth:0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
+        "eth:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "eth:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
+        "eth:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
    }
```

```diff
    contract DeBank Multisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.0.from:
-        "ethereum:0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
+        "eth:0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.1.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.2.from:
-        "ethereum:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
+        "eth:0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.3.from:
-        "ethereum:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.4.from:
-        "ethereum:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "eth:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.5.from:
-        "ethereum:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
+        "eth:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.6.from:
-        "ethereum:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.7.from:
-        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
      receivedPermissions.8.from:
-        "ethereum:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
+        "eth:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"
+        "eth:0x830e68669019a05F41676546417D2A06fdfFF9fB"
    }
```

```diff
    EOA  (0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      receivedPermissions.1.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "eth:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      receivedPermissions.2.from:
-        "ethereum:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "eth:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      receivedPermissions.3.from:
-        "ethereum:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "eth:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      receivedPermissions.4.from:
-        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "eth:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
    }
```

Generated with discovered.json: 0x6900a32c9aad7b91e4affc24b3aa3838c524786c

# Diff at Mon, 16 Jun 2025 08:41:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "ethereum:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "ethereum:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "ethereum:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
+        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "ethereum:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
    }
```

```diff
    contract DeBank Multisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6","role":"admin","via":[{"address":"ethereum:0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}
      receivedPermissions.7.from:
-        "ethereum:0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "ethereum:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      receivedPermissions.6.from:
-        "ethereum:0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      receivedPermissions.5.from:
-        "ethereum:0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "ethereum:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      receivedPermissions.4.from:
-        "ethereum:0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "ethereum:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      receivedPermissions.3.from:
-        "ethereum:0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
+        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      receivedPermissions.2.from:
-        "ethereum:0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
+        "ethereum:0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254"
    }
```

Generated with discovered.json: 0xc76a1c348128a0a5196cab9e9b06b79d310c3044

# Diff at Fri, 30 May 2025 06:57:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 20792021
- current block number: 20792021

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x0d6371f51a82e9421f88924c2a878244399c97b1

# Diff at Fri, 23 May 2025 09:40:55 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 20792021
- current block number: 20792021

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    EOA  (0x322C9a45368FdcdF358a4Ba340f88073Dc239e24) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.2.from:
-        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
+        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      directlyReceivedPermissions.2.description:
-        "set and change address mappings."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      directlyReceivedPermissions.1.description:
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract DeBank Multisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.from:
-        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
+        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
+        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      receivedPermissions.1.description:
+        "set and change address mappings."
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8) {
    +++ description: None
      receivedPermissions.4:
+        {"permission":"challenge","from":"0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e","role":".CHALLENGER"}
      receivedPermissions.3.role:
+        ".challenger"
      receivedPermissions.2.permission:
-        "interact"
+        "guard"
      receivedPermissions.2.from:
-        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
+        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.from:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
+        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.permission:
-        "guard"
+        "interact"
      receivedPermissions.0.from:
-        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
+        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xe88fedb19efabd76786d9e9548d35591ba95acdd

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 20792021
- current block number: 20792021

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8","via":[]},{"permission":"propose","to":"0x322C9a45368FdcdF358a4Ba340f88073Dc239e24","via":[]},{"permission":"upgrade","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","description":"set and change address mappings.","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8","via":[]},{"permission":"upgrade","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8","via":[]},{"permission":"upgrade","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74","via":[]},{"permission":"upgrade","to":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB"}]}]
    }
```

Generated with discovered.json: 0x4d16f42d8b5c4e4083cb9df44c124ebf300ca471

# Diff at Thu, 27 Mar 2025 11:14:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 20792021
- current block number: 20792021

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x8237cf03b9dbad9ac79c70f2119424bf3d4649a7

# Diff at Wed, 19 Mar 2025 13:04:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract undefined (0x322C9a45368FdcdF358a4Ba340f88073Dc239e24) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xfd08f88be27eecc3fb8916a514dd016ba4ea9ac4

# Diff at Tue, 18 Mar 2025 08:12:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 20792021
- current block number: 20792021

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract DeBank Multisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      name:
-        "DeBankChainMultisig"
+        "DeBank Multisig"
    }
```

Generated with discovered.json: 0xe1ad5fbcb574304626228a7f1fa6b6bf9c5b492c

# Diff at Tue, 04 Mar 2025 11:25:34 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x674484b9902482876567d4ea08589347192acbd6

# Diff at Tue, 04 Mar 2025 10:39:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20015023
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20015023
    }
```

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20015023
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20015023
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20015023
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      sinceBlock:
+        20015023
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20015023
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20015023
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20015023
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20015023
    }
```

```diff
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      sinceBlock:
+        20015023
    }
```

Generated with discovered.json: 0x19e58ba4201d603b679c5d25ada2112e836ab066

# Diff at Wed, 26 Feb 2025 10:32:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 20792021
- current block number: 20792021

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xa2e052f53f722a5525d08cd6be5c50a30006eeae

# Diff at Fri, 21 Feb 2025 14:06:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 20792021
- current block number: 20792021

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x79bd81eb3118d198aa83e0fcd882bd45cfde1897

# Diff at Fri, 21 Feb 2025 08:59:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x3d49b903e8413ab90dd2206d5e29c167dfad422c

# Diff at Mon, 10 Feb 2025 19:03:49 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x2017a4079a98f5531ab8496073335be301c1a51d

# Diff at Tue, 04 Feb 2025 12:30:56 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 20792021
- current block number: 20792021

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x62679cabbefef758843cb5ae14e00474f29525a0

# Diff at Mon, 20 Jan 2025 11:09:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20792021
- current block number: 20792021

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.1.target:
-        "0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
      issuedPermissions.1.to:
+        "0x322C9a45368FdcdF358a4Ba340f88073Dc239e24"
      issuedPermissions.0.target:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.to:
+        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.target:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.to:
+        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      directlyReceivedPermissions.7.from:
+        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      directlyReceivedPermissions.6.target:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      directlyReceivedPermissions.6.from:
+        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      directlyReceivedPermissions.5.target:
-        "0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      directlyReceivedPermissions.5.from:
+        "0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      directlyReceivedPermissions.4.target:
-        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      directlyReceivedPermissions.4.from:
+        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      directlyReceivedPermissions.3.target:
-        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      directlyReceivedPermissions.3.from:
+        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      directlyReceivedPermissions.2.target:
-        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      directlyReceivedPermissions.2.from:
+        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      directlyReceivedPermissions.1.target:
-        "0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      directlyReceivedPermissions.1.from:
+        "0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      directlyReceivedPermissions.0.target:
-        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      directlyReceivedPermissions.0.from:
+        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.0.target:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.to:
+        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
      issuedPermissions.1.target:
-        "0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74"
      issuedPermissions.1.to:
+        "0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74"
      issuedPermissions.0.target:
-        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.to:
+        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      receivedPermissions.7.from:
+        "0xcCcc98e93CeE060a03604D3916EE527a57078c8b"
      receivedPermissions.6.target:
-        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      receivedPermissions.6.from:
+        "0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6"
      receivedPermissions.5.target:
-        "0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      receivedPermissions.5.from:
+        "0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02"
      receivedPermissions.4.target:
-        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      receivedPermissions.4.from:
+        "0x7F7a01cBE67a31625B0C137e835a12d494E293c2"
      receivedPermissions.3.target:
-        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      receivedPermissions.3.from:
+        "0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92"
      receivedPermissions.2.target:
-        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      receivedPermissions.2.from:
+        "0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977"
      receivedPermissions.1.target:
-        "0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      receivedPermissions.1.from:
+        "0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e"
      receivedPermissions.0.target:
-        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      receivedPermissions.0.from:
+        "0x306402f889035e2Cbd7e396080bf365ADB38B7DC"
      directlyReceivedPermissions.0.target:
-        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
      directlyReceivedPermissions.0.from:
+        "0x830e68669019a05F41676546417D2A06fdfFF9fB"
    }
```

Generated with discovered.json: 0xe883f85a98c8847abce57bdb25721bb1f1e1c9e6

# Diff at Wed, 08 Jan 2025 09:00:00 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xc4696aa0672a7a29d276817c97285e833cc53a0d

# Diff at Fri, 01 Nov 2024 12:23:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      directlyReceivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      receivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xeb5610cdcc24fd43a2eaa1fe68ed54059558d0d7

# Diff at Tue, 29 Oct 2024 13:07:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xd7086724ec1ee171f92cd72ee36499b7b4b1f416

# Diff at Tue, 22 Oct 2024 13:49:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0xe26e6d11d3d9d5323f68866c899405a26442df90

# Diff at Mon, 21 Oct 2024 12:43:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0xf72049ac6f01597f1af09b5c0271f9efcd093d4d

# Diff at Mon, 21 Oct 2024 11:05:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2.2:
+        ["0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"]
      values.$pastUpgrades.2.1:
-        ["0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"]
+        "0x08ad26f1a190ca9c62471b3f5fba14725a8cc373b766f7d47a2c45f3cd7a3b09"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0x08ad26f1a190ca9c62471b3f5fba14725a8cc373b766f7d47a2c45f3cd7a3b09"
      values.$pastUpgrades.0.2:
+        ["0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"]
      values.$pastUpgrades.0.1:
-        ["0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"]
+        "0xf19cab212e86e37ae252129a1f96aefbe4a1efc8657d06626b07dda1a81a9836"
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.2.2:
+        ["0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031"]
      values.$pastUpgrades.2.1:
-        ["0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031"]
+        "0xf85356fcfad851267c465dfc9468c8e85d62e0d61d1da5a6e7ae57efba63ff27"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xf85356fcfad851267c465dfc9468c8e85d62e0d61d1da5a6e7ae57efba63ff27"
      values.$pastUpgrades.0.2:
+        ["0x09eBA78DED12068c301dFF046333424AE2521578"]
      values.$pastUpgrades.0.1:
-        ["0x09eBA78DED12068c301dFF046333424AE2521578"]
+        "0x58434116437eb73b0365d8b885a8ae94d3e63b5b327466874300a79cfdce552d"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x2470eE5fDCa25fD60d178e16821931f830200ef9"]
      values.$pastUpgrades.0.1:
-        ["0x2470eE5fDCa25fD60d178e16821931f830200ef9"]
+        "0x1ebf611f132092531465b906730ee8c7c85a526b2126e6b28d76faae76e73d69"
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd"]
      values.$pastUpgrades.0.1:
-        ["0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd"]
+        "0xc30602e0a47fba79f14efb790e4b23237afd7f7284024d83559e67d44088b685"
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63"]
      values.$pastUpgrades.0.1:
-        ["0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63"]
+        "0xdc6debb37dff450fcfce7ce0c48ad8d5c15e6da82feafcc99c17aec59eea6eca"
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6"]
      values.$pastUpgrades.0.1:
-        ["0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6"]
+        "0x466528522989d9fa128392a5a30f1e2e5e435d876a8686cb0b87ad99539c9ac4"
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x307c7773097445400d2F2a51D65e38AEa8231868"]
      values.$pastUpgrades.0.1:
-        ["0x307c7773097445400d2F2a51D65e38AEa8231868"]
+        "0x70b2dbc67ddbed213866f3966fa2c46f3f0d710f41f7379ecd47614c088193e2"
    }
```

Generated with discovered.json: 0x1743beec238e2827361de83fc04584dc321d202e

# Diff at Wed, 16 Oct 2024 11:35:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x322C9a45368FdcdF358a4Ba340f88073Dc239e24","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
+        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.via.0:
-        {"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
+        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.via.0:
-        {"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
+        "0xfdA4cCC8dCE3f4b9ACE21d030Ed345e975b8a7B8"
      issuedPermissions.0.via.0:
-        {"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xfB04A190dC7D91E86109433858A48E0B98EF1450","via":[{"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0xfB04A190dC7D91E86109433858A48E0B98EF1450"
+        "0x7aB7da0C3117D7Dfe0ABfAA8d8D33883f8477C74"
      issuedPermissions.1.via.0:
-        {"address":"0x830e68669019a05F41676546417D2A06fdfFF9fB","delay":0}
    }
```

Generated with discovered.json: 0x97b2fe57854a442ffc7364516b5e5d65625138fa

# Diff at Mon, 14 Oct 2024 10:50:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x0c1c0a5eff46fa1b105a2cabe6ce2b7a7fbac2f58af57392b196f8fe5768bd2a"]
    }
```

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x8c9491e689f31c280886abc8ea05ec6ac8d5394be56da8048ab9efeca67c4a3c"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x5c566f7b9bd649708500a4ea89e4031d2dad1273ce56f6cb5e67d0193f136eb1"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x6bee26e08bb3e482693649b598e8c0423de9025ebebdc773e9a2f9aa6f362478"]
    }
```

```diff
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x707be71dd9ca05e6feda44bc8458f38eda5c0bff

# Diff at Wed, 09 Oct 2024 13:09:15 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0xd5377df58b3380cef458319fad2091476d4e0adc

# Diff at Tue, 01 Oct 2024 10:50:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20792021
- current block number: 20792021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792021 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-06-04T00:58:35.000Z",["0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"]],["2024-06-11T13:10:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-11T13:10:23.000Z",["0xE5000acFE7997a7B381C4d9f72fB593AD0AD6034"]]]
    }
```

```diff
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-06-04T00:58:35.000Z",["0x09eBA78DED12068c301dFF046333424AE2521578"]],["2024-06-07T01:10:11.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-07T01:10:11.000Z",["0xF666CE8Bf4d1b1be67eCe022132B36ee2e89c031"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-06-04T00:58:35.000Z",["0x2470eE5fDCa25fD60d178e16821931f830200ef9"]]]
    }
```

```diff
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-06-04T00:58:35.000Z",["0xBb41aeB788607249b3D479CB42d1eb466f28d1Cd"]]]
    }
```

```diff
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-06-04T00:58:11.000Z",["0xAB4DaE8DA2708609D81636Ca5C27CAa489160B63"]]]
    }
```

```diff
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-06-04T00:58:35.000Z",["0xcb32593E7eD1FBbf6db22348d444e2b1dDe71Fe6"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-06-04T00:58:35.000Z",["0x307c7773097445400d2F2a51D65e38AEa8231868"]]]
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x473bb768f1aa300c0dd6def36ec96e6a53937528

# Diff at Fri, 20 Sep 2024 14:13:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c1f8c9b7beabeba1a847fb9e1064a356593cfe16 block: 20790352
- current block number: 20792021

## Description

Ignored value.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20790352 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.balance:
-        "273731965608868189754"
    }
```

Generated with discovered.json: 0xeec51188f25afd9660ac5c21ff0644557b3829ab

# Diff at Fri, 20 Sep 2024 07:37:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20790352

## Description

Initial discovery of a highly custom OP stack deployment: Beta version of Systemconfig with gas token support (not used) and a deployed dispute game factory without support for it in the OptimismPortal (and an active legacy L2OutputOracle).

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0341bb689CB8a4c16c61307F4BdA254E1bFD525e)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x28f1b9F457CB51E0af56dff1d11CD6CEdFfD1977)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract AddressManager (0x306402f889035e2Cbd7e396080bf365ADB38B7DC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x63CA00232F471bE2A3Bf3C4e95Bc1d2B3EA5DB92)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x7F7a01cBE67a31625B0C137e835a12d494E293c2)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x830e68669019a05F41676546417D2A06fdfFF9fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xc4C9bfB77DAC8d8d03Fd24E1C2b86bb6A0664b02)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xC8271C3Be50B9D575220dA2F9FE2f670DD6483D6)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xcCcc98e93CeE060a03604D3916EE527a57078c8b)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xDEfab7699Ed60a863dce4B1095576F6d9EC5d254)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract DeBankChainMultisig (0xfB04A190dC7D91E86109433858A48E0B98EF1450)
    +++ description: None
```

