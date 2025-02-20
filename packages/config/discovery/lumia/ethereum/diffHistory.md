Generated with discovered.json: 0x3f9a7e09fc4e933e38aad11be95439f0ebf528b0

# Diff at Mon, 10 Feb 2025 19:04:12 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21764836
- current block number: 21764836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764836 (main branch discovery), not current.

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      unverified:
-        true
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0xb1bc4c159db77c4c914dc9753bc98947bbd8d353

# Diff at Tue, 04 Feb 2025 12:31:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21764836
- current block number: 21764836

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764836 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe3bb100bb57af825e84bb319822dc5d1bb5e612e

# Diff at Mon, 03 Feb 2025 09:09:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21738270
- current block number: 21764836

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21738270 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "Verifier"
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
    contract PolygonDataCommittee (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      name:
-        "LumiaDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "0x258862dec9a77db57b398c441390783293E2a7A1"
      issuedPermissions.0.via.0:
-        {"address":"0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1)."
    }
```

```diff
    contract Validium (0x92726F7dE49300DBdb60930066bc1d0803c0740B) {
    +++ description: The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches.
      name:
-        "LumiaValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the prism Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0x258862dec9a77db57b398c441390783293E2a7A1","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0x258862dec9a77db57b398c441390783293E2a7A1","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x8F2D2Da3044B0A1ea54Ee26F7fe376cD9ec4393F","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

```diff
    contract ProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xce8e32942820a66922c47e088dc4fb412ee0c1a7

# Diff at Thu, 30 Jan 2025 15:33:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21738270

## Description

Initial discovery: PolygonCDK type 4 validium (DAC) with custom gastoken LUMIA.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LumiaDAC (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LumiaValidium (0x92726F7dE49300DBdb60930066bc1d0803c0740B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0xb3F294dAEd917b33FFcC687DFfB8Cd77565FF54a)
    +++ description: None
```
