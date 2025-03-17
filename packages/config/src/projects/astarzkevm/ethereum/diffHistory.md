Generated with discovered.json: 0xe928b996f13f54d4bb1b6388f7faa40375c7e411

# Diff at Tue, 04 Mar 2025 10:38:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        19505052
    }
```

```diff
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d) {
    +++ description: None
      sinceBlock:
+        19284768
    }
```

```diff
    contract Validium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: The main system contract defining the Astar zkEVM Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        19285389
    }
```

```diff
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC) {
    +++ description: None
      sinceBlock:
+        19269852
    }
```

```diff
    contract PolygonDataCommittee (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 5/3).
      sinceBlock:
+        19284769
    }
```

```diff
    contract AstarMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      sinceBlock:
+        19269922
    }
```

Generated with discovered.json: 0xd6d3ad9130003a1fb440cca2ee18dd0d34eae8d7

# Diff at Thu, 27 Feb 2025 11:45:23 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0xfc70843e36051573835ab0b4dce0e4c53f4c2812

# Diff at Wed, 26 Feb 2025 10:32:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 20325048
- current block number: 20325048

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: The main system contract defining the Astar zkEVM Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 5/3).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xe738f4c25e19f56332562f440018f3caefcb8eb7

# Diff at Tue, 04 Feb 2025 12:30:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 20325048
- current block number: 20325048

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract Validium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: The main system contract defining the Astar zkEVM Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract PolygonDataCommittee (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 5/3).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AstarMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
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

Generated with discovered.json: 0x127c04e5e000ad8d8f5fd45746202639d724db0d

# Diff at Mon, 03 Feb 2025 09:09:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 20325048
- current block number: 20325048

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "AstarVerifier"
+        "FflonkVerifier"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract Validium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: The main system contract defining the Astar zkEVM Layer 2 logic. Entry point for sequencing batches.
      name:
-        "AstarValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the Astar zkEVM Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0xA09F1c88C0194Da6b0a1c564CDBEcbF3AAd649E4","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

```diff
    contract PolygonDataCommittee (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 5/3).
      name:
-        "AstarValidiumDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E","via":[{"address":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 5/3)."
    }
```

```diff
    contract AstarMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      name:
-        "LocalAdmin"
+        "AstarMultisig"
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0","via":[{"address":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"}]}
      receivedPermissions.2:
+        {"permission":"configure","from":"0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0","description":"manage the members of the data availability committee and the threshold for valid commitments."}
      receivedPermissions.1:
+        {"permission":"configure","from":"0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","description":"sole address that can force batches."}
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.from:
-        "0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"
+        "0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80"
      receivedPermissions.0.via:
-        [{"address":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"}]
      receivedPermissions.0.description:
+        "set core system parameters like the trusted sequencer and manage forced transactions/batches."
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x9b9278fd8d50544351685938921861d870430729

# Diff at Mon, 20 Jan 2025 11:09:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20325048
- current block number: 20325048

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"
      directlyReceivedPermissions.0.from:
+        "0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E"
    }
```

```diff
    contract LocalAdmin (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"
      receivedPermissions.0.from:
+        "0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"
      directlyReceivedPermissions.0.target:
-        "0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"
      directlyReceivedPermissions.0.from:
+        "0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"
    }
```

Generated with discovered.json: 0x4316b8e7dda31822b759eec5f03347c158b38855

# Diff at Mon, 21 Oct 2024 11:04:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract AstarValidium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.1.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0xf735ab474ff2e48c6231cc834828e35736c6fc9fec9759b74e5cf58a88075a36"
      values.$pastUpgrades.0.2:
+        ["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"]
      values.$pastUpgrades.0.1:
-        ["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"]
+        "0xd68a284c1d748ff541d3339f650f5b90e2faf2744db5fdfc27edfffc702e2dbd"
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF4e87685e323818E0aE35dCdFc3B65106002E456"]
      values.$pastUpgrades.0.1:
-        ["0xF4e87685e323818E0aE35dCdFc3B65106002E456"]
+        "0x72856ab866229053e930b1e4ec2c8505ed4b72feffdf13db4a218eced4364fa2"
    }
```

Generated with discovered.json: 0x60db18bbf616e56be12eb0232005fb4d9e473094

# Diff at Mon, 14 Oct 2024 10:49:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract AstarVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"}]
    }
```

```diff
    contract AstarValidium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

```diff
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"
+        "0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E"
      issuedPermissions.0.via.0:
+        {"address":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

```diff
    contract LocalAdmin (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0","via":[{"address":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d"}]
    }
```

Generated with discovered.json: 0x9bd8193a78bf39e9848d2145e1ed2d573e3f3a9d

# Diff at Tue, 01 Oct 2024 10:49:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract AstarValidium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-22T20:00:59.000Z",["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"]],["2024-04-08T18:10:59.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-22T17:55:59.000Z",["0xF4e87685e323818E0aE35dCdFc3B65106002E456"]]]
    }
```

Generated with discovered.json: 0xdb831b3c00409a66463c269d69024df58b67f87a

# Diff at Fri, 30 Aug 2024 07:51:24 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xde613ba738048f3624b819f6a69fbb987fab6e49

# Diff at Fri, 23 Aug 2024 09:51:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract AstarValidium (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x02a62722b1880efb5bcb0348fe18989f5bb3ec76

# Diff at Wed, 21 Aug 2024 10:02:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0","via":[]}]
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d","via":[]}]
    }
```

Generated with discovered.json: 0x665a7b1228f03991f8f70fbd27e5883123c84527

# Diff at Fri, 09 Aug 2024 10:08:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20325048
- current block number: 20325048

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325048 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"]
      assignedPermissions.upgrade:
+        ["0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0"]
    }
```

```diff
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 3 (33%)"
      values.getOwners:
-        ["0xEc33045FA66cF43E9b5b9F332dc124dbc71c0917","0x33f9b8ac59814E1A0a59e5d1a6125E5E7AF58BA8","0x2b3Aa0Dc0622eFb9426F5A44015aE9151Bd8224C"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xEc33045FA66cF43E9b5b9F332dc124dbc71c0917","0x33f9b8ac59814E1A0a59e5d1a6125E5E7AF58BA8","0x2b3Aa0Dc0622eFb9426F5A44015aE9151Bd8224C"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract LocalAdmin (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0xe4D4fBC6e27B3AE9D881BD9400071FB6c62E4dfa","0xEc24369A1269171e3cb0A323DD920F99Cb528Fb0","0x127Bae6Fc751dC92111a359500ae91EB437f3dCb","0x83cC8195856b0463dEd5f052021009b7985FDa2C","0x4324c3960c7B2567D0C13ba17493bb364c407937","0x6c4876Ecb5de33f76700f44d547C593065806dAC"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xe4D4fBC6e27B3AE9D881BD9400071FB6c62E4dfa","0xEc24369A1269171e3cb0A323DD920F99Cb528Fb0","0x127Bae6Fc751dC92111a359500ae91EB437f3dCb","0x83cC8195856b0463dEd5f052021009b7985FDa2C","0x4324c3960c7B2567D0C13ba17493bb364c407937","0x6c4876Ecb5de33f76700f44d547C593065806dAC"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x0fdc4f296dc50c1a0add96374b39d4b1248b9f0d

# Diff at Wed, 17 Jul 2024 08:27:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0df6fda263b58edb9acce032017abb5ebd61f5fd block: 20188651
- current block number: 20325048

## Description

Introduced a new LocalAdmin, not handled by the shared template, which mainContract admin (not the upgradeabilityAdmin) and who can change local system configs. This role was wrongly given to the SharedProxyAdminOwner before.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20188651 (main branch discovery), not current.

```diff
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: None
      name:
-        "AstarValidiumEtrog"
+        "AstarValidium"
    }
```

```diff
    contract ProxyAdminOwner (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "LocalAdmin"
    }
```

Generated with discovered.json: 0x4c1a1e744f8a16bc777c372929ab36767c7bcb20

# Diff at Fri, 28 Jun 2024 07:20:22 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@49bfbec96093cd13bd953b811e1f3024e562632f block: 19882099
- current block number: 20188651

## Description

Change sequencer address and URL. DAC committee members changed. Chain was offline for this update/maintenance for 40 minutes.

## Watched changes

```diff
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: None
      values.trustedSequencer:
-        "0xD49CD5f9776A54fAe89B68205F6Af69586F98203"
+        "0xA09F1c88C0194Da6b0a1c564CDBEcbF3AAd649E4"
      values.trustedSequencerURL:
-        "https://rpc.astar-zkevm.gelato.digital"
+        "https://rpc-zkevm.astar.network"
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      values.committeeHash:
-        "0xf3b713b9d34dd6c8f99950e7f622937def5d1044471824b807c8b9dbedf75d2f"
+        "0x9a0c18a0211f34e9126b78961894fb03edbdcb7e314a5affed3f8365315e3aff"
      values.members.4.1:
-        "0xF54b295a221B5d3510D03d9B16E23BA151da012A"
+        "0xC4ad70e848f36925FcbDfb252f5e258D06647320"
      values.members.4.0:
-        "http://cdk-validium-dac-1-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444"
+        "https://dac0-zkevm.astar.network"
      values.members.3.1:
-        "0xCFb77B6abb27e04cE0DB347cCCd5544f51A98CBc"
+        "0xB4d094b4216F1BEb8bAeD995092A05182fD4bEf0"
      values.members.3.0:
-        "http://cdk-validium-dac-2-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444"
+        "https://dac4-zkevm.astar.network"
      values.members.2.1:
-        "0x8FB3cb4777EE1c2C35C48aC69a650026d18aFF08"
+        "0x68B62E4C9E69cd637c61f19Fb64976D466De1d58"
      values.members.2.0:
-        "http://cdk-validium-dac-3-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444"
+        "https://dac2-zkevm.astar.network"
      values.members.1.1:
-        "0x37f0B74e0Fc72aDAAb1Fd39Ec6d779F596866aB8"
+        "0x361Ed4c21Ad3f9B28eeE1e1894854cE7E39b2dB1"
      values.members.1.0:
-        "http://cdk-validium-dac-4-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444"
+        "https://dac3-zkevm.astar.network"
      values.members.0.1:
-        "0x08EbBdFf8cB6d1336515A89641e899bc8ce91F2C"
+        "0x19DdD9d655B993D6B2e2437bfBA0378B777d7470"
      values.members.0.0:
-        "http://cdk-validium-dac-5-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444"
+        "https://dac1-zkevm.astar.network"
    }
```

Generated with discovered.json: 0x46c4eb4a0263e10d78594ff27d659e62a41b869d

# Diff at Thu, 16 May 2024 11:00:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@59d36171ee3aaf27d6db0c75fdfba523d2dad686 block: 19718007
- current block number: 19882099

## Description

Changes related to merging with shared-polygon-cdk module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718007 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

Generated with discovered.json: 0x6b156f3b83e9f164bbf59aa3a65eb2ffd4236b9f

# Diff at Tue, 23 Apr 2024 12:11:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@490974f5b59ffaa2fc80e604d18674505076a157 block: 19624593
- current block number: 19718007

## Description

Unified naming across CDK chains. Before, there were two ProxyAdmin with the same name, now the shared one is called SharedProxyAdmin. Also, the owner of the project specific one is not necessarily a multisig, hence the name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624593 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "SharedProxyAdmin"
    }
```

```diff
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      name:
-        "AdminMultisig"
+        "ProxyAdminOwner"
    }
```

Generated with discovered.json: 0x865fbe50de0f059c5957fa7a2f254f1f5adbaf16

# Diff at Wed, 10 Apr 2024 10:20:14 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6bb1fb9faf46a5960ef8903031fd713f6bd1234a block: 19610741
- current block number: 19624593

## Description

Migration of rollup contract Etrog and added related verifier.
Rollup contract changes:

- added timestamp range to check on sequenced batched, batches with timestamp outside range will be invalidated by circuit.
- added possibility to migrate data availability protocol.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80) {
    +++ description: None
      upgradeability.implementation:
-        "0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
+        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      implementations.0:
-        "0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30"
+        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
      values.TIMESTAMP_RANGE:
+        36
      derivedName:
-        "PolygonValidiumEtrog"
+        "PolygonValidiumStorageMigration"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Contains important info such as the etrog and verifier address, the rollup type and chain id
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.rollupData.4:
-        1
+        4
+++ description: Contains important info such as the etrog and verifier address, the rollup type and chain id
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.rollupData.3:
-        7
+        9
+++ description: Contains important info such as the etrog and verifier address, the rollup type and chain id
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.rollupData.2:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
    }
```

```diff
+   Status: CREATED
    contract AstarVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

## Source code changes

```diff
.../migration/PolygonRollupBaseEtrogNoGap.sol      | 945 +++++++++++++++++++++
 .../migration/PolygonValidiumStorageMigration.sol} |  84 +-
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |  10 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  34 +-
 .../AstarValidiumEtrog/implementation/meta.txt     |   4 +-
 .../contracts/verifiers/FflonkVerifier.sol         |   4 +-
 .../ethereum/.code/AstarVerifier/meta.txt          |   2 +
 .../FflonkVerifier/meta.txt => /dev/null           |   2 -
 8 files changed, 1068 insertions(+), 17 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19610741 (main branch discovery), not current.

```diff
    contract AstarVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8) {
    +++ description: None
      name:
-        "AstarVerifier"
+        "FflonkVerifier"
    }
```

Generated with discovered.json: 0xfef9baadda4970faf426f8f3f466cd74a3fe021c

# Diff at Mon, 08 Apr 2024 11:46:25 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@786d5557d38c508087b24a36535c329c2bdbb5ab block: 19567776
- current block number: 19610741

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19567776 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
-   Status: DELETED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupsData:
-        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
      values.rollupTypes:
-        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
+++ description: Contains important info such as the etrog and verifier address, the rollup type and chain id
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.rollupData:
+        ["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80",3776,"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8",7,1,0]
    }
```

```diff
-   Status: DELETED
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

Generated with discovered.json: 0x7256084bd40282d48d13d1d9f843a405770a177a

# Diff at Tue, 02 Apr 2024 11:19:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a9206f2bf2edf120bcda65c615e62ea076a00070 block: 19531427
- current block number: 19567776

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6) {
    +++ description: None
      values.lastMint:
-        1710310247
+        1711986143
      values.totalSupply:
-        "10113921492245423640000000000"
+        "10129821158641559310000000000"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        2
+        3
      values.rollupsData.2:
+        ["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
      values.rollupTypeCount:
-        3
+        4
      values.rollupTypes.3:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.depositCount:
-        5902
+        6983
      values.getLastGlobalExitRoot:
-        "0x9ca5a604c186e1ea5b4b1c98cef0172948cfdd3922e6d696432af039f2029ee4"
+        "0xc095e5994a0b9fd52ea40b40a773ef3501d71b6714aaa9f317da893d00a4a232"
      values.getRoot:
-        "0x8cc1015a052135594ecf5f93b9714a5fa9693df8723d30d54681edc0452ada70"
+        "0xfa45b3fc78774ebaab9c348497cd3179c1b985b3d5acd9f7943ef5249df28026"
      values.lastMainnetExitRoot:
-        "0xf497f247b8a83a6ef28ab1344cb4ceda601beadc8b8e750b9e94c60c692c90a6"
+        "0xb660abe75b32c4549f002831954229d9bca2088cbba3e11ed323d658d3405195"
      values.lastRollupExitRoot:
-        "0x3f422c6785e945568024d0ebffa974e7332ecb1abb878478ff7bb8d453408bf2"
+        "0xbe9fd8ca76197d4a5e1a89029ce2a23b17702c9c061ac9e1d5653d6de3cdd87e"
    }
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

## Source code changes

```diff
.../.code/OKBImplementation/implementation/OKb.sol |  408 +++++
 .../OKBImplementation/implementation/SafeMath.sol  |   28 +
 .../OKBImplementation/implementation/meta.txt      |    2 +
 .../.code/OKBImplementation/proxy/Address.sol      |   23 +
 .../proxy/OwnedUpgradeabilityProxy.sol             |   86 +
 .../.code/OKBImplementation/proxy/Proxy.sol        |   34 +
 .../proxy/UpgradeabilityProxy.sol                  |   59 +
 .../.code/OKBImplementation/proxy/meta.txt         |    2 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   70 +
 .../contracts/utils/cryptography/ECDSA.sol         |  213 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  345 ++++
 .../access/OwnableUpgradeable.sol                  |   95 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../v2/consensus/validium/PolygonDataCommittee.sol |  197 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../v2/interfaces/IPolygonDataCommitteeErrors.sol  |   40 +
 .../PolygonDataCommittee/implementation/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../.code/PolygonDataCommittee/proxy/meta.txt      |    2 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |  118 ++
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../migration/PolygonRollupBaseEtrogNoGap.sol      |  945 ++++++++++
 .../migration/PolygonValidiumStorageMigration.sol  |  347 ++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../contracts/v2/interfaces/IPolygonValidium.sol   |   15 +
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   56 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  951 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../implementation/meta.txt                        |    2 +
 .../PolygonValidiumStorageMigration/proxy/meta.txt |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../meta.txt                                       |    2 +
 95 files changed, 12282 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531427 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values._HALT_AGGREGATION_TIMEOUT:
-        604800
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"TRUSTED_AGGREGATOR":{"adminRole":"TRUSTED_AGGREGATOR_ADMIN","members":["0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"]},"ADD_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"ADD_EXISTING_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"UPDATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"OBSOLETE_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CREATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"STOP_EMERGENCY":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TWEAK_PARAMETERS":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TRUSTED_AGGREGATOR_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"SET_FEE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EMERGENCY_COUNCIL":{"adminRole":"EMERGENCY_COUNCIL_ADMIN","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]},"EMERGENCY_COUNCIL_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}}
      values.calculateRewardPerBatch:
-        "100000000000000000"
      values.getForcedBatchFee:
-        "10000000000000000000"
      values.getRollupExitRoot:
-        "0x3f422c6785e945568024d0ebffa974e7332ecb1abb878478ff7bb8d453408bf2"
      values.lastAggregationTimestamp:
-        1711612079
      values.multiplierBatchFee:
-        1002
      values.totalSequencedBatches:
-        27755
      values.totalVerifiedBatches:
-        27727
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]]
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      name:
-        "GlobalExitRootV2"
+        "PolygonZkEVMGlobalExitRootV2"
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      values.members:
+        [["http://cdk-validium-dac-5-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x08EbBdFf8cB6d1336515A89641e899bc8ce91F2C"],["http://cdk-validium-dac-4-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x37f0B74e0Fc72aDAAb1Fd39Ec6d779F596866aB8"],["http://cdk-validium-dac-3-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x8FB3cb4777EE1c2C35C48aC69a650026d18aFF08"],["http://cdk-validium-dac-2-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0xCFb77B6abb27e04cE0DB347cCCd5544f51A98CBc"],["http://cdk-validium-dac-1-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0xF54b295a221B5d3510D03d9B16E23BA151da012A"]]
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      name:
-        "Timelock"
+        "PolygonZkEVMTimelock"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}}
      values.CANCELLER_ROLE:
+        "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783"
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.EXECUTOR_ROLE:
+        "0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63"
      values.PROPOSER_ROLE:
+        "0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1"
      values.TIMELOCK_ADMIN_ROLE:
+        "0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5"
    }
```

Generated with discovered.json: 0x537893caa59f373cff2679fee537357a320870aa

# Diff at Thu, 28 Mar 2024 08:30:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19510528
- current block number: 19531427

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19510528 (main branch discovery), not current.

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      upgradeability.threshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 3 (33%)"
    }
```

```diff
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x80e34d2e9f076e502c2a5f413f27f449b1570d7a

# Diff at Mon, 25 Mar 2024 09:12:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9bc44b13c53d42ef5e81d478df7a78975e8d4088 block: 19482808
- current block number: 19510528

## Description

A bug on Polygon zkEVM was fixed, unrelated to Astar zkEVM.

## Watched changes

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      values.nonce:
-        19
+        27
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.UPDATE_ROLLUP.members.1:
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.lastDeactivatedEmergencyStateTimestamp:
-        0
+        1711323791
      values.rollupTypeCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x9d882fb2ce884a4add9de979baad67a6d2a8b618

# Diff at Thu, 21 Mar 2024 11:41:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19482808

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```
