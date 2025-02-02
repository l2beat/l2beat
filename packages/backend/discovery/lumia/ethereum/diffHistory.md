Generated with discovered.json: 0x619c8d621b8beccab7983858a47ac811aa00bb06

# Diff at Sun, 02 Feb 2025 11:57:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9637849b063da030577f396e3f0368d2e5dcec02 block: 21738270
- current block number: 21738270

## Description

discodrive polygon cdk stack!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21738270 (main branch discovery), not current.

```diff
    contract LumiaDAC (0x25ba7858b4592b777A2fF3f7da79cB080aAb15c8) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
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
      displayName:
+        "PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1)."
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
