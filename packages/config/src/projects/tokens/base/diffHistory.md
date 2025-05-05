Generated with discovered.json: 0x8f1349a9c555262eb077ae82f48d471028870641

# Diff at Tue, 29 Apr 2025 08:19:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 29519230
- current block number: 29519230

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29519230 (main branch discovery), not current.

```diff
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) {
    +++ description: Part of CCTP
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x88acF681fb9a1DFcE5ac83391991895C54CF24cc","via":[]}]
    }
```

```diff
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) {
    +++ description: Part of CCTP
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x19b4B317E6Ea4643f1507c372630483092D0AbFf","via":[]}]
    }
```

```diff
    contract USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1","description":"manage minter addresses.","via":[]},{"permission":"interact","to":"0x3ABd6f64A422225E61E435baE41db12096106df7","description":"manage all critical roles like pausers, blacklisters, minters, rescuer.","via":[]},{"permission":"interact","to":"0x4d15e70518A20Fc8828b5C3853f32e35238d0b77","description":"blacklist addresses, freezing any interactions with the USDC token for them.","via":[]},{"permission":"interact","to":"0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4","description":"pause the USDC token (no transfers, mints, burns).","via":[]},{"permission":"upgrade","to":"0x4fc7850364958d97B4d3f5A08f79db2493f8cA44","via":[]}]
    }
```

```diff
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971","delay":172800,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xf817cb3092179083c48c014688D98B72fB61464f","delay":172800}]},{"permission":"interact","to":"0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","delay":172800,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xf817cb3092179083c48c014688D98B72fB61464f","delay":172800}]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"propose transactions.","via":[]}]
    }
```

Generated with discovered.json: 0x74a967b8211eef7064cd2c104a9230c4829c608f

# Diff at Mon, 28 Apr 2025 09:27:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@abb69590061038da05feece26d3be8369d45e4a9 block: 29215620
- current block number: 29519230

## Description

Add USDC and CCTP v1 and v2 on base.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29215620 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1)
    +++ description: Manager contract for minter management [sic].
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

Generated with discovered.json: 0x7373a5757b7ceead98f064f6c18a00ae87108903

# Diff at Mon, 21 Apr 2025 08:01:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 29215620

## Description

add wOETH (CCIP) discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgedWOETH (0xD8724322f44E5c58D7A815F542036fb17DbbF839)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f)
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
```
