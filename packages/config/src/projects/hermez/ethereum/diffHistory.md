Generated with discovered.json: 0x01c6e034f57fd1f0a4174f91c31c9ea098dee775

# Diff at Mon, 14 Jul 2025 12:45:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21778467
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
      address:
-        "0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
+        "eth:0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
      values.owner:
-        "0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3"
+        "eth:0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3"
      implementationNames.0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3:
-        "ProxyAdmin"
      implementationNames.eth:0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3:
+        "ProxyAdmin"
    }
```

```diff
    contract HermezAuctionProtocol (0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2) {
    +++ description: None
      address:
-        "0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
+        "eth:0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
      values.$admin:
-        "0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
+        "eth:0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
      values.$implementation:
-        "0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6"
+        "eth:0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6"
      values.getBootCoordinator:
-        "0xc3867Da55e14b722Ab2A8E9fa4e39F51F5e03dE5"
+        "eth:0xc3867Da55e14b722Ab2A8E9fa4e39F51F5e03dE5"
      values.getDonationAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.governanceAddress:
-        "0xf1B3b124842555782F98bE08d1357ABb8013F11c"
+        "eth:0xf1B3b124842555782F98bE08d1357ABb8013F11c"
      values.hermezRollup:
-        "0xA68D85dF56E733A06443306A095646317B5Fa633"
+        "eth:0xA68D85dF56E733A06443306A095646317B5Fa633"
      values.tokenHEZ:
-        "0xEEF9f339514298C6A857EfCfC1A762aF84438dEE"
+        "eth:0xEEF9f339514298C6A857EfCfC1A762aF84438dEE"
      implementationNames.0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2:
-        "AdminUpgradeabilityProxy"
      implementationNames.0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6:
-        "HermezAuctionProtocol"
      implementationNames.eth:0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2:
+        "AdminUpgradeabilityProxy"
      implementationNames.eth:0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6:
+        "HermezAuctionProtocol"
    }
```

```diff
    EOA  (0x1DBA1131000664b884A1Ba238464159892252D3a) {
    +++ description: None
      address:
-        "0x1DBA1131000664b884A1Ba238464159892252D3a"
+        "eth:0x1DBA1131000664b884A1Ba238464159892252D3a"
    }
```

```diff
    contract Verifier2048 (0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342) {
    +++ description: None
      address:
-        "0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342"
+        "eth:0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342"
      implementationNames.0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342:
-        "Verifier2048"
      implementationNames.eth:0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342:
+        "Verifier2048"
    }
```

```diff
    EOA  (0x2d3C8Ad3E6eE92D2e278B42db0FD7Aa99424bB92) {
    +++ description: None
      address:
-        "0x2d3C8Ad3E6eE92D2e278B42db0FD7Aa99424bB92"
+        "eth:0x2d3C8Ad3E6eE92D2e278B42db0FD7Aa99424bB92"
    }
```

```diff
    contract WithdrawalDelayer (0x392361427Ef5e17b69cFDd1294F31ab555c86124) {
    +++ description: None
      address:
-        "0x392361427Ef5e17b69cFDd1294F31ab555c86124"
+        "eth:0x392361427Ef5e17b69cFDd1294F31ab555c86124"
      values.getEmergencyCouncil:
-        "0xe1bbC673E537053c3536310851C6554BcfcF11Cd"
+        "eth:0xe1bbC673E537053c3536310851C6554BcfcF11Cd"
      values.getHermezGovernanceAddress:
-        "0xf1B3b124842555782F98bE08d1357ABb8013F11c"
+        "eth:0xf1B3b124842555782F98bE08d1357ABb8013F11c"
      values.hermezRollupAddress:
-        "0xA68D85dF56E733A06443306A095646317B5Fa633"
+        "eth:0xA68D85dF56E733A06443306A095646317B5Fa633"
      values.pendingEmergencyCouncil:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.pendingGovernance:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x392361427Ef5e17b69cFDd1294F31ab555c86124:
-        "WithdrawalDelayer"
      implementationNames.eth:0x392361427Ef5e17b69cFDd1294F31ab555c86124:
+        "WithdrawalDelayer"
    }
```

```diff
    EOA  (0x3Ac6Cb2CcFd8c8aAe3BA31D7ED44C20d241B16A4) {
    +++ description: None
      address:
-        "0x3Ac6Cb2CcFd8c8aAe3BA31D7ED44C20d241B16A4"
+        "eth:0x3Ac6Cb2CcFd8c8aAe3BA31D7ED44C20d241B16A4"
    }
```

```diff
    contract Verifier400 (0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2) {
    +++ description: None
      address:
-        "0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2"
+        "eth:0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2"
      implementationNames.0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2:
-        "Verifier400"
      implementationNames.eth:0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2:
+        "Verifier400"
    }
```

```diff
    contract VerifierWithdraw (0x4464A1E499cf5443541da6728871af1D5C4920ca) {
    +++ description: None
      address:
-        "0x4464A1E499cf5443541da6728871af1D5C4920ca"
+        "eth:0x4464A1E499cf5443541da6728871af1D5C4920ca"
      implementationNames.0x4464A1E499cf5443541da6728871af1D5C4920ca:
-        "VerifierWithdraw"
      implementationNames.eth:0x4464A1E499cf5443541da6728871af1D5C4920ca:
+        "VerifierWithdraw"
    }
```

```diff
    contract Hermez2 (0x6D85D79D69b7e190E671C16e8611997152bD3e95) {
    +++ description: None
      address:
-        "0x6D85D79D69b7e190E671C16e8611997152bD3e95"
+        "eth:0x6D85D79D69b7e190E671C16e8611997152bD3e95"
      values.hermezAuctionContract:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.hermezGovernanceAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenHEZ:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.withdrawDelayerContract:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.withdrawVerifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6D85D79D69b7e190E671C16e8611997152bD3e95:
-        "Hermez"
      implementationNames.eth:0x6D85D79D69b7e190E671C16e8611997152bD3e95:
+        "Hermez"
    }
```

```diff
    EOA  (0x839395e20bbB182fa440d08F850E6c7A8f6F0780) {
    +++ description: None
      address:
-        "0x839395e20bbB182fa440d08F850E6c7A8f6F0780"
+        "eth:0x839395e20bbB182fa440d08F850E6c7A8f6F0780"
    }
```

```diff
    contract HermezAuctionProtocol2 (0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6) {
    +++ description: None
      address:
-        "0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6"
+        "eth:0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6"
      values.getBootCoordinator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getDonationAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.governanceAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.hermezRollup:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.tokenHEZ:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6:
-        "HermezAuctionProtocol"
      implementationNames.eth:0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6:
+        "HermezAuctionProtocol"
    }
```

```diff
    contract Hermez (0xA68D85dF56E733A06443306A095646317B5Fa633) {
    +++ description: None
      address:
-        "0xA68D85dF56E733A06443306A095646317B5Fa633"
+        "eth:0xA68D85dF56E733A06443306A095646317B5Fa633"
      values.$admin:
-        "0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
+        "eth:0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3"
      values.$implementation:
-        "0x6D85D79D69b7e190E671C16e8611997152bD3e95"
+        "eth:0x6D85D79D69b7e190E671C16e8611997152bD3e95"
      values.$pastUpgrades.0.2.0:
-        "0x6D85D79D69b7e190E671C16e8611997152bD3e95"
+        "eth:0x6D85D79D69b7e190E671C16e8611997152bD3e95"
      values.hermezAuctionContract:
-        "0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
+        "eth:0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
      values.hermezGovernanceAddress:
-        "0xf1B3b124842555782F98bE08d1357ABb8013F11c"
+        "eth:0xf1B3b124842555782F98bE08d1357ABb8013F11c"
      values.rollupVerifiers.0.0:
-        "0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2"
+        "eth:0x3DAa0B2a994b1BC60dB9e312aD0a8d87a1Bb16D2"
      values.rollupVerifiers.1.0:
-        "0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342"
+        "eth:0x1DC4b451DFcD0e848881eDE8c7A99978F00b1342"
      values.tokenHEZ:
-        "0xEEF9f339514298C6A857EfCfC1A762aF84438dEE"
+        "eth:0xEEF9f339514298C6A857EfCfC1A762aF84438dEE"
      values.withdrawDelayerContract:
-        "0x392361427Ef5e17b69cFDd1294F31ab555c86124"
+        "eth:0x392361427Ef5e17b69cFDd1294F31ab555c86124"
      values.withdrawVerifier:
-        "0x4464A1E499cf5443541da6728871af1D5C4920ca"
+        "eth:0x4464A1E499cf5443541da6728871af1D5C4920ca"
      implementationNames.0xA68D85dF56E733A06443306A095646317B5Fa633:
-        "AdminUpgradeabilityProxy"
      implementationNames.0x6D85D79D69b7e190E671C16e8611997152bD3e95:
-        "Hermez"
      implementationNames.eth:0xA68D85dF56E733A06443306A095646317B5Fa633:
+        "AdminUpgradeabilityProxy"
      implementationNames.eth:0x6D85D79D69b7e190E671C16e8611997152bD3e95:
+        "Hermez"
    }
```

```diff
    EOA  (0xc3867Da55e14b722Ab2A8E9fa4e39F51F5e03dE5) {
    +++ description: None
      address:
-        "0xc3867Da55e14b722Ab2A8E9fa4e39F51F5e03dE5"
+        "eth:0xc3867Da55e14b722Ab2A8E9fa4e39F51F5e03dE5"
    }
```

```diff
    contract GnosisSafe (0xe1bbC673E537053c3536310851C6554BcfcF11Cd) {
    +++ description: None
      address:
-        "0xe1bbC673E537053c3536310851C6554BcfcF11Cd"
+        "eth:0xe1bbC673E537053c3536310851C6554BcfcF11Cd"
      values.$implementation:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
      values.$members.0:
-        "0x1DBA1131000664b884A1Ba238464159892252D3a"
+        "eth:0x1DBA1131000664b884A1Ba238464159892252D3a"
      values.$members.1:
-        "0x839395e20bbB182fa440d08F850E6c7A8f6F0780"
+        "eth:0x839395e20bbB182fa440d08F850E6c7A8f6F0780"
      values.$members.2:
-        "0xEA479628a2236865dcc01c0F9DF7d5955Ac602e4"
+        "eth:0xEA479628a2236865dcc01c0F9DF7d5955Ac602e4"
      values.$members.3:
-        "0x2d3C8Ad3E6eE92D2e278B42db0FD7Aa99424bB92"
+        "eth:0x2d3C8Ad3E6eE92D2e278B42db0FD7Aa99424bB92"
      values.$members.4:
-        "0x3Ac6Cb2CcFd8c8aAe3BA31D7ED44C20d241B16A4"
+        "eth:0x3Ac6Cb2CcFd8c8aAe3BA31D7ED44C20d241B16A4"
      implementationNames.0xe1bbC673E537053c3536310851C6554BcfcF11Cd:
-        "Proxy"
      implementationNames.0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
-        "GnosisSafe"
      implementationNames.eth:0xe1bbC673E537053c3536310851C6554BcfcF11Cd:
+        "Proxy"
      implementationNames.eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xEA479628a2236865dcc01c0F9DF7d5955Ac602e4) {
    +++ description: None
      address:
-        "0xEA479628a2236865dcc01c0F9DF7d5955Ac602e4"
+        "eth:0xEA479628a2236865dcc01c0F9DF7d5955Ac602e4"
    }
```

```diff
    contract HermezGovernance (0xf1B3b124842555782F98bE08d1357ABb8013F11c) {
    +++ description: None
      address:
-        "0xf1B3b124842555782F98bE08d1357ABb8013F11c"
+        "eth:0xf1B3b124842555782F98bE08d1357ABb8013F11c"
      implementationNames.0xf1B3b124842555782F98bE08d1357ABb8013F11c:
-        "HermezGovernance"
      implementationNames.eth:0xf1B3b124842555782F98bE08d1357ABb8013F11c:
+        "HermezGovernance"
    }
```

```diff
    contract Timelock (0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3) {
    +++ description: None
      address:
-        "0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3"
+        "eth:0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3"
      values.admin:
-        "0xf1B3b124842555782F98bE08d1357ABb8013F11c"
+        "eth:0xf1B3b124842555782F98bE08d1357ABb8013F11c"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3:
-        "Timelock"
      implementationNames.eth:0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3:
+        "Timelock"
    }
```

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
    contract HermezGovernance (0xf1B3b124842555782F98bE08d1357ABb8013F11c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3)
    +++ description: None
```

Generated with discovered.json: 0xf2789aeb2caa82f5efb32f054e255b7103b66b64

# Diff at Fri, 04 Jul 2025 12:19:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21778467
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
      receivedPermissions.0.from:
-        "ethereum:0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
+        "eth:0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2"
      receivedPermissions.1.from:
-        "ethereum:0xA68D85dF56E733A06443306A095646317B5Fa633"
+        "eth:0xA68D85dF56E733A06443306A095646317B5Fa633"
    }
```

Generated with discovered.json: 0xef08fc8b3f969a65a09145d9ada17ca0d147be15

# Diff at Fri, 23 May 2025 09:40:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21778467
- current block number: 21778467

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21778467 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x53cad9ac40b27cde6bec066f7d20e25583b0fe0d

# Diff at Tue, 29 Apr 2025 08:19:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21778467
- current block number: 21778467

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21778467 (main branch discovery), not current.

```diff
    contract HermezAuctionProtocol (0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3","via":[]}]
    }
```

```diff
    contract Hermez (0xA68D85dF56E733A06443306A095646317B5Fa633) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3","via":[]}]
    }
```

Generated with discovered.json: 0xf2662c36505e6141e09d837f1c75e3cebf023bcc

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
