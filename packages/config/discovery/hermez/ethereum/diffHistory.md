Generated with discovered.json: 0xd901e07fdcb9aaa7c2a8ca974bd64670ade9f218

# Diff at Tue, 04 Mar 2025 10:39:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21778467
- current block number: 21778467

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21778467 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3) {
    +++ description: None
      sinceBlock:
+        12093588
    }
```

```diff
    contract HermezAuctionProtocol (0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2) {
    +++ description: None
      sinceBlock:
+        12093592
    }
```

```diff
    contract Verifier2048 (0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342) {
    +++ description: None
      sinceBlock:
+        12373414
    }
```

```diff
    contract WithdrawalDelayer (0x392361427Ef5e17b69cFDd1294F31ab555c86124) {
    +++ description: None
      sinceBlock:
+        12093599
    }
```

```diff
    contract Verifier400 (0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2) {
    +++ description: None
      sinceBlock:
+        12373413
    }
```

```diff
    contract VerifierWithdraw (0x4464A1E499cf5443541da6728871af1D5C4920ca) {
    +++ description: None
      sinceBlock:
+        12373429
    }
```

```diff
    contract Hermez2 (0x6D85D79D69b7e190E671C16e8611997152bD3e95) {
    +++ description: None
      sinceBlock:
+        12373616
    }
```

```diff
    contract HermezAuctionProtocol2 (0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6) {
    +++ description: None
      sinceBlock:
+        12093585
    }
```

```diff
    contract Hermez (0xA68D85dF56E733A06443306A095646317B5Fa633) {
    +++ description: None
      sinceBlock:
+        12093596
    }
```

```diff
    contract GnosisSafe (0xe1bbC673E537053c3536310851C6554BcfcF11Cd) {
    +++ description: None
      sinceBlock:
+        12080648
    }
```

```diff
    contract HermezGovernance (0xf1B3b124842555782F98bE08d1357ABb8013F11c) {
    +++ description: None
      sinceBlock:
+        12087709
    }
```

```diff
    contract Timelock (0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3) {
    +++ description: None
      sinceBlock:
+        12087731
    }
```

Generated with discovered.json: 0x350824661d288d2237a3317d3c51c924ad667c99

# Diff at Wed, 05 Feb 2025 06:23:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 21387322
- current block number: 21778467

## Description

config: remove token from discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387322 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract HEZ (0xEEF9f339514298C6A857EfCfC1A762aF84438dEE)
    +++ description: None
```

Generated with discovered.json: 0xb4193f12680d977cb7e9125096f365a6517c886d

# Diff at Mon, 20 Jan 2025 11:09:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21387322
- current block number: 21387322

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21387322 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xA68D85dF56E733A06443306A095646317B5Fa633"
      receivedPermissions.1.from:
+        "0xA68D85dF56E733A06443306A095646317B5Fa633"
      receivedPermissions.0.target:
-        "0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
      receivedPermissions.0.from:
+        "0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
    }
```

```diff
    contract HermezAuctionProtocol (0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
      issuedPermissions.0.to:
+        "0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
    }
```

```diff
    contract Hermez (0xA68D85dF56E733A06443306A095646317B5Fa633) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
      issuedPermissions.0.to:
+        "0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
    }
```

Generated with discovered.json: 0x4e982d831d9da2ac30c110b470b1173a47b70540

# Diff at Thu, 12 Dec 2024 15:29:13 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21322541
- current block number: 21387322

## Description

Ignored not needed slot value in config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21322541 (main branch discovery), not current.

```diff
    contract HermezAuctionProtocol (0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2) {
    +++ description: None
      values.getCurrentSlotNumber:
-        230713
    }
```

```diff
    contract HermezAuctionProtocol2 (0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6) {
    +++ description: None
      values.getCurrentSlotNumber:
-        533063
    }
```

Generated with discovered.json: 0xba37643c501eacaafa71413ef8afafef49868c1b

# Diff at Thu, 05 Dec 2024 08:52:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 21322541

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HermezAuctionProtocol (0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier2048 (0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalDelayer (0x392361427Ef5e17b69cFDd1294F31ab555c86124)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier400 (0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierWithdraw (0x4464A1E499cf5443541da6728871af1D5C4920ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hermez2 (0x6D85D79D69b7e190E671C16e8611997152bD3e95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HermezAuctionProtocol2 (0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hermez (0xA68D85dF56E733A06443306A095646317B5Fa633)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xe1bbC673E537053c3536310851C6554BcfcF11Cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HEZ (0xEEF9f339514298C6A857EfCfC1A762aF84438dEE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HermezGovernance (0xf1B3b124842555782F98bE08d1357ABb8013F11c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3)
    +++ description: None
```
