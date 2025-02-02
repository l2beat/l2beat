Generated with discovered.json: 0xeb6cb770cc2e210c292c0999e6019ae84a28e02e

# Diff at Sun, 02 Feb 2025 16:46:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9637849b063da030577f396e3f0368d2e5dcec02 block: 21737758
- current block number: 21737758

## Description

discodrive polygon cdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21737758 (main branch discovery), not current.

```diff
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      template:
+        "polygon-cdk/Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract TernoaDAC (0xB408a216927d31A27fd96176dbF1B825630f0301) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
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
      displayName:
+        "PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1)."
    }
```

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
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
