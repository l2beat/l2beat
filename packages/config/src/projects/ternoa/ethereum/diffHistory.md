Generated with discovered.json: 0x0fd0f01c87cffac0bf954b49da9539a80236973b

# Diff at Tue, 04 Mar 2025 10:40:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766747
- current block number: 21766747

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        21522690
    }
```

```diff
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        20984421
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      sinceBlock:
+        21537112
    }
```

```diff
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b) {
    +++ description: None
      sinceBlock:
+        21537111
    }
```

Generated with discovered.json: 0xc1aeae51448e7ac640898f12e80515704e86b0c2

# Diff at Thu, 27 Feb 2025 11:47:00 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21766747
- current block number: 21766747

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier_12"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0x135eaa654289aa343cefa6d6b39481e9737a8e01

# Diff at Wed, 26 Feb 2025 10:33:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766747
- current block number: 21766747

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FflonkVerifier_12 (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x44dae61cab9273f3c07e57a2c1ab3983c9b76401

# Diff at Tue, 04 Feb 2025 12:33:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766747
- current block number: 21766747

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766747 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x0ecedcc2986ca4d00bba8eed5c77c24d5a5d8f65

# Diff at Mon, 03 Feb 2025 15:04:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21737758
- current block number: 21766747

## Description

Shape match bug fixd (override) and reported to tooooling.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21737758 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CapsuleCoin (0x03Be5C903c727Ee2C8C4e9bc0AcC860Cca4715e2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonEcosystemToken (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches.
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the Ternoa Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0x49015545B46B07082bd7faf2633643eae87710EC","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0x49015545B46B07082bd7faf2633643eae87710EC","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x129A94208bb3030D809c36849d43b50d13e0cACf","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

Generated with discovered.json: 0x65133cd49cd7c93be5bb74e300a20b9eee1dfc29

# Diff at Mon, 03 Feb 2025 09:09:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21737758
- current block number: 21737758

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21737758 (main branch discovery), not current.

```diff
    contract Validium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789) {
    +++ description: None
      name:
-        "TernoaValidium"
+        "Validium"
    }
```

```diff
    contract FflonkVerifier_12 (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "Verifier"
+        "FflonkVerifier_12"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract PolygonDataCommittee (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      name:
-        "TernoaDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x49015545B46B07082bd7faf2633643eae87710EC","via":[{"address":"0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1)."
    }
```

```diff
    contract ProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CapsuleCoin (0x03Be5C903c727Ee2C8C4e9bc0AcC860Cca4715e2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonEcosystemToken (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

Generated with discovered.json: 0xfef5aedf4f37dbc35548c8879144d6664ca58e56

# Diff at Thu, 30 Jan 2025 13:51:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21737758

## Description

Initial discovery: Type 7 polygon CDK validium (DAC) with custom gas token: CAPS.

## Initial discovery

```diff
+   Status: CREATED
    contract TernoaValidium (0x7fF0B5fF6Eb8B789456639AC2A02487c338c1789)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TernoaDAC (0xB408a216927d31A27fd96176dbF1B825630f0301)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0xE390FB0dd0Ea7684F59210d791D63E7fc28BbF9b)
    +++ description: None
```
