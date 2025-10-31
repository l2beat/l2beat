Generated with discovered.json: 0x4ad2be96a6472cb72c1740890c9ba97f5d2c0a3f

# Diff at Fri, 31 Oct 2025 07:17:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@68eb98b0468d176aa44713dcaed98f67b2a200a0 block: 1761643945
- current timestamp: 1761894930

## Description

Minor upgrade proposed.

Reviewed here: https://gist.github.com/sekuba/46d7bcab5127c0ed6e0d66ce285b0559 (approved, will go to optimistic phase if at least 5 approve)

## Watched changes

```diff
    contract Multisig (eth:0xD7dA1C25E915438720692bC55eb3a7170cA90321) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing proposals (e.g. for Security Council standard proposals).
      values.proposalCount:
-        11
+        12
    }
```

Generated with discovered.json: 0x48b3c9a94d3498c063182c27bf387c8f600816ad

# Diff at Tue, 28 Oct 2025 09:33:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@090e135db1084f4a9678d6bf1cb0ff5e854903ea block: 1761550873
- current timestamp: 1761643945

## Description

proposer/sequencer whitelist changed.

## Watched changes

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contains the whitelist of addresses allowed to propose batches on L1. These operators can also issue pre-confirmation from their public addresses. Currently, there are 4 operators registered.
      values.registeredOperators.0.sequencer:
-        "eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"
+        "eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990"
      values.registeredOperators.0.proposer:
-        "eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"
+        "eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990"
      values.registeredOperators.3.sequencer:
-        "eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990"
+        "eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"
      values.registeredOperators.3.proposer:
-        "eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990"
+        "eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"
    }
```

Generated with discovered.json: 0x833740284aedb8b48b0da3078846244cdb7d3086

# Diff at Mon, 27 Oct 2025 07:42:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e31499883253bb2b7c36fe0654ea187cfa3ca612 block: 1759909174
- current timestamp: 1761550873

## Description

Operator change.

## Watched changes

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contains the whitelist of addresses allowed to propose batches on L1. These operators can also issue pre-confirmation from their public addresses. Currently, there are 4 operators registered.
      values.registeredOperators.0:
-        {"proposer":"eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990","sequencer":"eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990"}
      values.registeredOperators.1:
-        {"proposer":"eth:0xCbeB5d484b54498d3893A0c3Eb790331962e9e9d","sequencer":"eth:0x2ABD9afD6D41d0c37b8d55df11BFc73B53c3ac61"}
      values.registeredOperators.2:
+        {"proposer":"eth:0xCbeB5d484b54498d3893A0c3Eb790331962e9e9d","sequencer":"eth:0x2ABD9afD6D41d0c37b8d55df11BFc73B53c3ac61"}
      values.registeredOperators.3:
+        {"proposer":"eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990","sequencer":"eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990"}
    }
```

Generated with discovered.json: 0x55b32044ebd850568f757d8965b323b8b37b1ae5

# Diff at Wed, 08 Oct 2025 07:42:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@36fbb0e5eb9fa07c58f97370d929eaabfcd6c5ff block: 1759239729
- current timestamp: 1759909174

## Description

Proposal 23: encrypted emergency proposal.
'proposal is neither to fix a bug nor time-critical' - sc chat.

verification of the calldata is pending.

## Watched changes

```diff
    contract EmergencyMultisig (eth:0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing encrypted proposals (e.g. for Security Council emergency proposals).
+++ description: The total count of encrypted emergency proposals created.
      values.proposalCount:
-        23
+        24
    }
```

Generated with discovered.json: 0xd05faca832046b1c1d0640225e033e34a4cccf9d

# Diff at Tue, 30 Sep 2025 14:26:28 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@8b1e8b6b8628030e60b22b7773a337689b280854 block: 1758523605
- current timestamp: 1759239729

## Description

Config-related changes: added tracking for trusted zk program hashes for SP1 and Risc0 verifiers.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758523605 (main branch discovery), not current.

```diff
    contract Risc0VerifierGateway (eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE) {
    +++ description: Entry contract to verify batches using RISC Zero.
+++ description: Image IDs (i.e. program digest) of Risc0 programs trusted by this verifier gateway. Only proofs for these programs can be successfully verified. Note that proofs contains image ID data within them.
+++ severity: HIGH
      values.trustedImages:
+        ["0x49c8f13fdfbec7c03fc8516ef7d32d8fa43fa4f495d62e9ff6bf63710df402d4","0x052010a130f9957a9d218a173242070c47af1c5d2c3ccae1d8e8d85ce6c7d78e","0x1f28744f3b199dd31cfe84ee45bf6a7c9e4b7e8f7e888bb47889bba0237e00ff","0x0a0488e485692dd711b60258bd799099f8d1e6776cb96ede88c9fecfcc9b7e7c","0xa41db9223051c1a6b046829dc372eab4989ff0a3e027c360d8c906d831ca60d4","0xa3f175713dc988430192dfd9a6c49ea111e389e2c008428eedd5f38648094404","0xe9aec1d30d25da1ccfc02a81c4b71f32e0a6f675dff4ce01fe4bd5f96ff320bd","0xee950d20e2483b9b6b859272feaea2dd84cea8a9cfdf1af8834df6b75c3d715e"]
      fieldMeta:
+        {"trustedImages":{"severity":"HIGH","description":"Image IDs (i.e. program digest) of Risc0 programs trusted by this verifier gateway. Only proofs for these programs can be successfully verified. Note that proofs contains image ID data within them."}}
    }
```

```diff
    contract SP1VerifierGateway (eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9) {
    +++ description: Entry contract to verify batches using SP1.
+++ description: Program hashes of SP1 programs trusted by this verifier gateway. Only proofs for these programs can be successfully verified. Note that proofs contains program hash data within them.
+++ severity: HIGH
      values.trustedPrograms:
+        ["0x00380861a3c05aa16421c66921e7b952005ddad5b91b81e56d1a5f92a88db099","0x1c0430d17016a8590438cd241e7b952002eed6ad646e07955a34bf25288db099","0x00745853e47349fb2ddb364dae473e099c19890da8c786490da83066a0959689","0x3a2c29f21cd27ecb3b66c9b56473e09960cc486d231e19241b5060cd20959689","0x34712aed5061bce303b4bae32d3edafc05a1b9ec04c6d1d84dedc5ab28e8fe98","0x0068e255db4186f38c1da5d71ad3edafc0b4373d8131b47626f6e2d5a8e8fe98","0x43645b1b5d225d4539e38da910e3ba2a4d8d8dfc457a10d26a03d3cf1fb969be","0x0086c8b63774897515cf1c6d490e3ba2a9b1b1bf915e8434b501e9e79fb969be","0x0040b6021bbe547fc651492bcc4eea12eaaa9b0a60086439206e27495ec6d6c3","0x205b010d6f951ff14a29257944eea12e5554d853002190e440dc4e925ec6d6c3","0x00b14510cec97d3449eb84b814be2f4b5dae3eb56528d6bb65e1aa8226f2bed3","0x58a28867325f4d123d7097024be2f4b56d71f5ab14a35aed4bc3550426f2bed3"]
      fieldMeta:
+        {"trustedPrograms":{"severity":"HIGH","description":"Program hashes of SP1 programs trusted by this verifier gateway. Only proofs for these programs can be successfully verified. Note that proofs contains program hash data within them."}}
    }
```

Generated with discovered.json: 0x4831d3cceba0daa71cc689f23f9d7c40332b0fd4

# Diff at Mon, 22 Sep 2025 07:47:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3aa102df1ae0b60ff981cfe12b1d0c919b4c2704 block: 1758287100
- current timestamp: 1758523605

## Description

New operator (proposer/preconfer) registered.

config: act permissions for the dao controllers and minor description changes.

## Watched changes

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contains the whitelist of addresses allowed to propose batches on L1. These operators can also issue pre-confirmation from their public addresses. Currently, there are 4 operators registered.
      description:
-        "Contains the whitelist of addresses allowed to propose batches on L1. These operators can also issue pre-confirmation from their public addresses. Currently, there are 3 operators registered."
+        "Contains the whitelist of addresses allowed to propose batches on L1. These operators can also issue pre-confirmation from their public addresses. Currently, there are 4 operators registered."
      values.registeredOperators.3:
+        {"proposer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74","sequencer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74"}
      values.registeredOperatorsCount:
-        3
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758287100 (main branch discovery), not current.

```diff
    contract TaikoDAOController (eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a) {
    +++ description: Middleware contract that maintains ownership of DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      description:
-        "Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum."
+        "Middleware contract that maintains ownership of DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","description":"can update the contract address for a given name","role":".owner"},{"permission":"interact","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","description":"can add new instances without a DCAP attestation","role":".owner"},{"permission":"interact","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","description":"can update the contract address for a given name","role":".owner"},{"permission":"interact","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","description":"can add new instances without a DCAP attestation","role":".owner"},{"permission":"interact","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","description":"can update the contract address for a given name","role":".owner"},{"permission":"upgrade","from":"eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03","role":"admin"},{"permission":"upgrade","from":"eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","role":"admin"},{"permission":"upgrade","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","role":"admin"},{"permission":"upgrade","from":"eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","role":"admin"},{"permission":"upgrade","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","role":"admin"},{"permission":"upgrade","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","role":"admin"},{"permission":"upgrade","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","role":"admin"},{"permission":"upgrade","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin"},{"permission":"upgrade","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","role":"admin"},{"permission":"upgrade","from":"eth:0x91f67118DD47d502B1f0C354D0611997B022f29E","role":"admin"},{"permission":"upgrade","from":"eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin"},{"permission":"upgrade","from":"eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","role":"admin"},{"permission":"upgrade","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","role":"admin"},{"permission":"upgrade","from":"eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72","role":"admin"},{"permission":"upgrade","from":"eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1","role":"admin"},{"permission":"upgrade","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","role":"admin"},{"permission":"upgrade","from":"eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a","role":"admin"},{"permission":"upgrade","from":"eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC","role":"admin"},{"permission":"upgrade","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin"},{"permission":"upgrade","from":"eth:0xFD019460881e6EeC632258222393d5821029b2ac","role":"admin"}]
      values.proxiableUUID:
-        "EXPECT_REVERT"
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","description":"can update the contract address for a given name","role":".owner"},{"permission":"interact","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","description":"can add new instances without a DCAP attestation","role":".owner"},{"permission":"interact","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","description":"can update the contract address for a given name","role":".owner"},{"permission":"interact","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","description":"can add new instances without a DCAP attestation","role":".owner"},{"permission":"interact","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","description":"can update the program being verified","role":".owner"},{"permission":"interact","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","description":"can update the contract address for a given name","role":".owner"},{"permission":"upgrade","from":"eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03","role":"admin"},{"permission":"upgrade","from":"eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","role":"admin"},{"permission":"upgrade","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","role":"admin"},{"permission":"upgrade","from":"eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","role":"admin"},{"permission":"upgrade","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","role":"admin"},{"permission":"upgrade","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","role":"admin"},{"permission":"upgrade","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","role":"admin"},{"permission":"upgrade","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin"},{"permission":"upgrade","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","role":"admin"},{"permission":"upgrade","from":"eth:0x91f67118DD47d502B1f0C354D0611997B022f29E","role":"admin"},{"permission":"upgrade","from":"eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin"},{"permission":"upgrade","from":"eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","role":"admin"},{"permission":"upgrade","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","role":"admin"},{"permission":"upgrade","from":"eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72","role":"admin"},{"permission":"upgrade","from":"eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1","role":"admin"},{"permission":"upgrade","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","role":"admin"},{"permission":"upgrade","from":"eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a","role":"admin"},{"permission":"upgrade","from":"eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC","role":"admin"},{"permission":"upgrade","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin"},{"permission":"upgrade","from":"eth:0xFD019460881e6EeC632258222393d5821029b2ac","role":"admin"}]
    }
```

```diff
    contract DAO (eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261) {
    +++ description: The main contract and entrypoint of the Aragon-based DAO governance framework. Fine-grained DAO permissions, proposals, voting and thresholds are configured here.
      description:
-        "The main contract of the Aragon-based DAO governance framework."
+        "The main contract and entrypoint of the Aragon-based DAO governance framework. Fine-grained DAO permissions, proposals, voting and thresholds are configured here."
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","description":"can update the program being verified","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","description":"can update the contract address for a given name","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","description":"can update the program being verified","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","description":"can add new instances without a DCAP attestation","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","description":"can update the program being verified","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","description":"can update the contract address for a given name","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","description":"can add new instances without a DCAP attestation","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","description":"can update the program being verified","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","description":"can update the contract address for a given name","role":".owner","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.14:
+        {"permission":"upgrade","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.16:
+        {"permission":"upgrade","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.17:
+        {"permission":"upgrade","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.18:
+        {"permission":"upgrade","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.19:
+        {"permission":"upgrade","from":"eth:0x91f67118DD47d502B1f0C354D0611997B022f29E","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.20:
+        {"permission":"upgrade","from":"eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.21:
+        {"permission":"upgrade","from":"eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.22:
+        {"permission":"upgrade","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.23:
+        {"permission":"upgrade","from":"eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.24:
+        {"permission":"upgrade","from":"eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.25:
+        {"permission":"upgrade","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.26:
+        {"permission":"upgrade","from":"eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.27:
+        {"permission":"upgrade","from":"eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.28:
+        {"permission":"upgrade","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      receivedPermissions.30:
+        {"permission":"upgrade","from":"eth:0xFD019460881e6EeC632258222393d5821029b2ac","role":"admin","via":[{"address":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"}]}
      values.proxiableUUID:
-        "EXPECT_REVERT"
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a","role":".owner"},{"permission":"act","from":"eth:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3","role":".owner"}]
    }
```

```diff
    contract TaikoDAOController (eth:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3) {
    +++ description: Middleware contract that maintains ownership of DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      description:
-        "Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum."
+        "Middleware contract that maintains ownership of DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum."
      values.proxiableUUID:
-        "EXPECT_REVERT"
    }
```

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contains the whitelist of addresses allowed to propose batches on L1. These operators can also issue pre-confirmation from their public addresses. Currently, there are 3 operators registered.
      description:
-        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered."
+        "Contains the whitelist of addresses allowed to propose batches on L1. These operators can also issue pre-confirmation from their public addresses. Currently, there are 3 operators registered."
    }
```

Generated with discovered.json: 0x2fa73466d32cff274d9726c8d9ac42cc706f3567

# Diff at Fri, 19 Sep 2025 13:06:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a930e518d214c15603feeda62e2a483dbd2454e0 block: 1758110316
- current timestamp: 1758287100

## Description

One preconfirmer deregistered.

## Watched changes

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered.
      description:
-        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered."
+        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered."
      values.registeredOperators.3:
-        {"proposer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74","sequencer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74"}
      values.registeredOperatorsCount:
-        4
+        3
    }
```

Generated with discovered.json: 0x42f636e3dfaf48d1a9640e215b6c9c04e4943780

# Diff at Wed, 17 Sep 2025 12:00:17 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@597af358c0b75d4111ec7b5f25233424c734e04d block: 1757403234
- current timestamp: 1758110316

## Description

Removed and then added back a preconf operator. As the result the list is reordered.

## Watched changes

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered.
      values.registeredOperators.1:
-        {"proposer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74","sequencer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74"}
      values.registeredOperators.3:
+        {"proposer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74","sequencer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74"}
    }
```

Generated with discovered.json: 0xcf9453f3f3efc755bf71b0d92039c78b84a29b5c

# Diff at Tue, 09 Sep 2025 07:35:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@395d7487e1620571da9defc848ebbef6daf736b9 block: 1757344306
- current timestamp: 1757403234

## Description

move of preconfWhitelist gov to the DAO.

the single non-DAO-governed contract left is ProverSet, so the migration seems to be complete.

## Watched changes

```diff
    contract TaikoDAOController (eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      receivedPermissions.28:
+        {"permission":"upgrade","from":"eth:0xFD019460881e6EeC632258222393d5821029b2ac","role":"admin"}
    }
```

```diff
    contract Taiko Multisig (eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"eth:0xFD019460881e6EeC632258222393d5821029b2ac","role":"admin"}]
    }
```

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

Generated with discovered.json: 0x4bee562ef15ee71396aeac9381097512e04af8bd

# Diff at Mon, 08 Sep 2025 15:13:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@48f0161c75908020b4454ff29490575d534b39f4 block: 1757064809
- current timestamp: 1757344306

## Description

Remaining gov functions transfered to DAO/SC.

## Watched changes

```diff
    contract L2AddressManager (taiko:0x1670000000000000000000000000000000000006) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.$admin:
-        "taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8"
+        "taiko:0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C"
      values.owner:
-        "taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8"
+        "taiko:0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C"
      values.pendingOwner:
-        "taiko:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "taiko:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract TaikoAnchor (taiko:0x1670000000000000000000000000000000010001) {
    +++ description: Handles cross-layer message verification and manages EIP-1559 gas pricing for L2 operations. Anchors L1 block details to L2 for cross-layer communication.
      values.$admin:
-        "taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8"
+        "taiko:0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C"
      values.owner:
-        "taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8"
+        "taiko:0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C"
      values.pendingOwner:
-        "taiko:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "taiko:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract DefaultResolver (taiko:0xc32277f541bBADAA260337E71Cea53871D310DC8) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.$admin:
-        "taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8"
+        "taiko:0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C"
      values.owner:
-        "taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8"
+        "taiko:0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C"
      values.pendingOwner:
-        "taiko:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "taiko:0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract Taiko L2 Multisig (taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8)
    +++ description: None
```

```diff
    contract DelegateController (taiko:0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"taiko:0x1670000000000000000000000000000000000006","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.1:
+        {"permission":"interact","from":"taiko:0xc32277f541bBADAA260337E71Cea53871D310DC8","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"taiko:0x1670000000000000000000000000000000000006","role":"admin"}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"taiko:0x1670000000000000000000000000000000010001","role":"admin"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"taiko:0xc32277f541bBADAA260337E71Cea53871D310DC8","role":"admin"}
    }
```

## Source code changes

```diff
.../GnosisSafeL2.sol => /dev/null                  | 1032 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 2 files changed, 1067 deletions(-)
```

Generated with discovered.json: 0x297bb2d31f5cf198e31a17eeac9687cf46a6d5be

# Diff at Fri, 05 Sep 2025 09:35:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6cd15987e9ebf76a374fdd067e5e25baf948c56c block: 1756804828
- current timestamp: 1757064809

## Description

New operator registered, new pending owner (DAO/SC) for some contracts.

## Watched changes

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered.
      description:
-        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered."
+        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered."
      values.operatorCount:
-        3
+        4
      values.registeredOperators.3:
+        {"proposer":"eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7","sequencer":"eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"}
      values.registeredOperatorsCount:
-        3
+        4
    }
```

```diff
    contract L2AddressManager (taiko:0x1670000000000000000000000000000000000006) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.pendingOwner:
-        "taiko:0x0000000000000000000000000000000000000000"
+        "taiko:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract TaikoAnchor (taiko:0x1670000000000000000000000000000000010001) {
    +++ description: Handles cross-layer message verification and manages EIP-1559 gas pricing for L2 operations. Anchors L1 block details to L2 for cross-layer communication.
      values.pendingOwner:
-        "taiko:0x0000000000000000000000000000000000000000"
+        "taiko:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract DefaultResolver (taiko:0xc32277f541bBADAA260337E71Cea53871D310DC8) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.pendingOwner:
-        "taiko:0x0000000000000000000000000000000000000000"
+        "taiko:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract Taiko L2 Multisig (taiko:0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8) {
    +++ description: None
      values.$members.0:
+        "taiko:0xAC5898b0FFFd23F4Ef09F0E50Fa1bC4896eF7163"
      values.$threshold:
-        4
+        5
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "5 of 7 (71%)"
    }
```

Generated with discovered.json: 0x38e69c2c69134a9801e7ea6f8ca6e149fb23eeb2

# Diff at Tue, 02 Sep 2025 09:26:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@1144aeaf984988c003c97be3791eeda76896f8ca block: 1756626709
- current timestamp: 1756804828

## Description

One operator got removed.

## Watched changes

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered.
      description:
-        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered."
+        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered."
      values.registeredOperators.3:
-        {"proposer":"eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7","sequencer":"eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"}
      values.registeredOperatorsCount:
-        4
+        3
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756626709 (main branch discovery), not current.

```diff
    EOA  (eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"sequence","from":"eth:0xFD019460881e6EeC632258222393d5821029b2ac","role":".getOperatorCandidatesForCurrentEpoch"}]
    }
```

```diff
    contract PreconfWhitelist (eth:0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered.
      values.operatorCount:
-        4
+        3
    }
```

Generated with discovered.json: 0xe397a4e2f7bae970ccd0644fff18ad9dfffc77d0

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x31bd1e3db3f230a3c39a898f99a5d9969ea7c0bc

# Diff at Sun, 31 Aug 2025 07:53:11 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@87c5e382c642255fd0a2841d66e663193b01574e block: 1756117493
- current timestamp: 1756626709

## Description

- TaikoL1
Minimal diff: changed function return value (proposeBatch now returns lastBlockId)
https://disco.l2beat.com/diff/eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82/eth:0xaF95C030c7b8994Ba9213B6A3964baa64E7dF9D8

No diff, changed NewFork constructor param to use the new implementation contract from above (0xaF95C030c7b8994Ba9213B6A3964baa64E7dF9D8) 
https://disco.l2beat.com/diff/eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F/eth:0xbB1f830636e1A017b81C3E38b7f6219344149Eb7

- ProverSet
Admin change to EOA (taiko foundation msig member)

- TaikoWrapper
Minimal diff: changed functions ordering to do one less decoding 
https://disco.l2beat.com/diff/eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61/eth:0x52D6FC6F6db9E370c336f64f61ff3C29568d1859

- PreconfRouter
Minimal diff: match function interface changes from above 
https://disco.l2beat.com/diff/eth:0xf571E2626E2CE68127852123A2cC6AA522C586A0/eth:0xC44577BAA22f999a16a9dF817A2aba6e5e696913

- PreconfWhitelist
Operators can now also be added by ejecter (chnaged onlyOwner toonlyOwnerOrEjecter modifier).

## Watched changes

```diff
    contract ForcedInclusionStore (0x05d88855361808fA1d7fc28084Ef3fCa191c4e03) {
    +++ description: Contract that allows users to enqueue forced transactions via L1. The system guarantees that at least one pending forced transaction from the queue will be processed every 255 batches. Individual transactions may face longer delays if the queue is extensive.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract TaikoL1 (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: Main contract implementing the logic for proposing and proving Taiko blocks on L1.
      sourceHashes.1:
-        "0x036f854f425618da3e66dad1cd29e352eda6ce3f728eb078bc043f82fe653157"
+        "0x4a046242c16270e33ec006d5d7d18a68040b417d8355d24cc6a44926ce444f6e"
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation.0:
-        "eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F"
+        "eth:0xbB1f830636e1A017b81C3E38b7f6219344149Eb7"
      values.$implementation.2:
-        "eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82"
+        "eth:0xaF95C030c7b8994Ba9213B6A3964baa64E7dF9D8"
      values.$pastUpgrades.28:
+        ["2025-08-26T21:48:47.000Z","0x27f89b30a14fdf2c6adb42c5722f4ac403eefde7d26f6a64bdfd4a86458a0c00",["eth:0xbB1f830636e1A017b81C3E38b7f6219344149Eb7","eth:0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264","eth:0xaF95C030c7b8994Ba9213B6A3964baa64E7dF9D8"]]
      values.$upgradeCount:
-        28
+        29
      values.impl:
-        "eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F"
+        "eth:0xbB1f830636e1A017b81C3E38b7f6219344149Eb7"
      values.newFork:
-        "eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82"
+        "eth:0xaF95C030c7b8994Ba9213B6A3964baa64E7dF9D8"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      implementationNames.eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F:
-        "PacayaForkRouter"
      implementationNames.eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82:
-        "MainnetInbox"
      implementationNames.eth:0xbB1f830636e1A017b81C3E38b7f6219344149Eb7:
+        "PacayaForkRouter"
      implementationNames.eth:0xaF95C030c7b8994Ba9213B6A3964baa64E7dF9D8:
+        "MainnetInbox"
    }
```

```diff
    EOA  (0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","role":"admin"}]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261) {
    +++ description: Contract managing SGX attestation certificates.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract ProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: An operator proxy used by the Taiko team for operating (proposing, proving) the based rollup from permissioned addresses.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
      values.pendingOwner:
-        "eth:0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Risc0VerifierGateway (0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE) {
    +++ description: Entry contract to verify batches using RISC Zero.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract TaikoDAOController (0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","description":"can update the program being verified","role":".owner"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","description":"can update the program being verified","role":".owner"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","description":"can add new instances without a DCAP attestation","role":".owner"}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","description":"can update the program being verified","role":".owner"}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","description":"can add new instances without a DCAP attestation","role":".owner"}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","description":"can update the program being verified","role":".owner"}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03","role":"admin"}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","role":"admin"}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","role":"admin"}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","role":"admin"}
      receivedPermissions.14:
+        {"permission":"upgrade","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","role":"admin"}
      receivedPermissions.15:
+        {"permission":"upgrade","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","role":"admin"}
      receivedPermissions.16:
+        {"permission":"upgrade","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin"}
      receivedPermissions.17:
+        {"permission":"upgrade","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","role":"admin"}
      receivedPermissions.21:
+        {"permission":"upgrade","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","role":"admin"}
      receivedPermissions.22:
+        {"permission":"upgrade","from":"eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72","role":"admin"}
      receivedPermissions.23:
+        {"permission":"upgrade","from":"eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1","role":"admin"}
      receivedPermissions.24:
+        {"permission":"upgrade","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","role":"admin"}
      receivedPermissions.25:
+        {"permission":"upgrade","from":"eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a","role":"admin"}
      receivedPermissions.27:
+        {"permission":"upgrade","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin"}
    }
```

```diff
    contract SgxVerifier (0x7e6409e9b6c5e2064064a6cC994f9a2e95680782) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract DefaultResolver (0x8Efa01564425692d0a0838DC10E300BD310Cb43e) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","description":"can update the program being verified","role":".owner"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","description":"can update the program being verified","role":".owner"}
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","description":"can add new instances without a DCAP attestation","role":".owner"}
      receivedPermissions.4:
-        {"permission":"interact","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","description":"can update the program being verified","role":".owner"}
      receivedPermissions.5:
-        {"permission":"interact","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.6:
-        {"permission":"interact","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","description":"can add new instances without a DCAP attestation","role":".owner"}
      receivedPermissions.7:
-        {"permission":"interact","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","description":"can update the program being verified","role":".owner"}
      receivedPermissions.8:
-        {"permission":"interact","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","description":"can update the contract address for a given name","role":".owner"}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03","role":"admin"}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","role":"admin"}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261","role":"admin"}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a","role":"admin"}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","role":"admin"}
      receivedPermissions.14:
-        {"permission":"upgrade","from":"eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","role":"admin"}
      receivedPermissions.15:
-        {"permission":"upgrade","from":"eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782","role":"admin"}
      receivedPermissions.16:
-        {"permission":"upgrade","from":"eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin"}
      receivedPermissions.17:
-        {"permission":"upgrade","from":"eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e","role":"admin"}
      receivedPermissions.18:
-        {"permission":"upgrade","from":"eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136","role":"admin"}
      receivedPermissions.19:
-        {"permission":"upgrade","from":"eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72","role":"admin"}
      receivedPermissions.20:
-        {"permission":"upgrade","from":"eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1","role":"admin"}
      receivedPermissions.21:
-        {"permission":"upgrade","from":"eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9","role":"admin"}
      receivedPermissions.22:
-        {"permission":"upgrade","from":"eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a","role":"admin"}
      receivedPermissions.23:
-        {"permission":"upgrade","from":"eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin"}
    }
```

```diff
    contract SgxVerifier (0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract TaikoWrapper (0x9F9D2fC7abe74C79f86F0D1212107692430eef72) {
    +++ description: Entry point for proposing blocks. It enforces the inclusion of forced transactions after their deadline.
      sourceHashes.1:
-        "0x6f1f57d97885434b7f6b769ef9377a6fa75456740c69110c6bb37fb53a7fc68f"
+        "0xb219932acfe503395c533757b638bdb5327f27434f87222d3e135534243f0b51"
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation:
-        "eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61"
+        "eth:0x52D6FC6F6db9E370c336f64f61ff3C29568d1859"
      values.$pastUpgrades.2:
+        ["2025-08-26T21:48:47.000Z","0x27f89b30a14fdf2c6adb42c5722f4ac403eefde7d26f6a64bdfd4a86458a0c00",["eth:0x52D6FC6F6db9E370c336f64f61ff3C29568d1859"]]
      values.$upgradeCount:
-        2
+        3
      values.impl:
-        "eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61"
+        "eth:0x52D6FC6F6db9E370c336f64f61ff3C29568d1859"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      implementationNames.eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61:
-        "TaikoWrapper"
      implementationNames.eth:0x52D6FC6F6db9E370c336f64f61ff3C29568d1859:
+        "TaikoWrapper"
    }
```

```diff
    contract VerifierGateway (0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1) {
    +++ description: Gateway contract for the multi-proof system. It redirects proof to the appropriate verifier based on the proof type.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract SP1VerifierGateway (0xbee1040D0Aab17AE19454384904525aE4A3602B9) {
    +++ description: Entry contract to verify batches using SP1.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract PreconfRouter (0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a) {
    +++ description: Entry point for batch proposals under the pre-confirmation architecture. It allows batches to be proposed only by whitelisted addresses.
      sourceHashes.1:
-        "0x7029286f91090d6d474c9bc0329436fed073038c547c5cd3db6c70045a7dccf8"
+        "0x34a58f3c77d5666ec8a39b17ab327273604248af9004c771429a4413b09e20dd"
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation:
-        "eth:0xf571E2626E2CE68127852123A2cC6AA522C586A0"
+        "eth:0xC44577BAA22f999a16a9dF817A2aba6e5e696913"
      values.$pastUpgrades.2:
+        ["2025-08-26T21:48:47.000Z","0x27f89b30a14fdf2c6adb42c5722f4ac403eefde7d26f6a64bdfd4a86458a0c00",["eth:0xC44577BAA22f999a16a9dF817A2aba6e5e696913"]]
      values.$upgradeCount:
-        2
+        3
      values.impl:
-        "eth:0xf571E2626E2CE68127852123A2cC6AA522C586A0"
+        "eth:0xC44577BAA22f999a16a9dF817A2aba6e5e696913"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      implementationNames.eth:0xf571E2626E2CE68127852123A2cC6AA522C586A0:
-        "PreconfRouter"
      implementationNames.eth:0xC44577BAA22f999a16a9dF817A2aba6e5e696913:
+        "PreconfRouter"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.$admin:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract PreconfWhitelist (0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered.
      sourceHashes.1:
-        "0xf118d401839238cdc94b9476ab2149f7492c9653c489f80819102c4fe0b23fc3"
+        "0x93a254bb5914a81cd902577cdafd323639e44227fdae5e14aa14fd47e1440063"
      values.$implementation:
-        "eth:0x44eC275996BD69361EF062ed488882a58256CF11"
+        "eth:0x54FeDc114D78dcbDb8c7b2DeA433f9749E8fd0Fc"
      values.$pastUpgrades.2:
+        ["2025-08-26T21:48:47.000Z","0x27f89b30a14fdf2c6adb42c5722f4ac403eefde7d26f6a64bdfd4a86458a0c00",["eth:0x54FeDc114D78dcbDb8c7b2DeA433f9749E8fd0Fc"]]
      values.$upgradeCount:
-        2
+        3
      values.impl:
-        "eth:0x44eC275996BD69361EF062ed488882a58256CF11"
+        "eth:0x54FeDc114D78dcbDb8c7b2DeA433f9749E8fd0Fc"
      implementationNames.eth:0x44eC275996BD69361EF062ed488882a58256CF11:
-        "PreconfWhitelist"
      implementationNames.eth:0x54FeDc114D78dcbDb8c7b2DeA433f9749E8fd0Fc:
+        "PreconfWhitelist"
    }
```

## Source code changes

```diff
.../PreconfRouter/PreconfRouter.sol                | 20 +++++++--------
 .../PreconfWhitelist/PreconfWhitelist.sol          |  2 +-
 .../TaikoL1/MainnetInbox.3.sol                     | 15 +++++------
 .../TaikoWrapper/TaikoWrapper.sol                  | 30 ++++++++++++----------
 4 files changed, 33 insertions(+), 34 deletions(-)
```

Generated with discovered.json: 0x5765bae5ae61ad328c23ef2bdc03bc2fc2014036

# Diff at Mon, 25 Aug 2025 14:12:20 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ad220cb66b2845d84a69889aeb34f71bc5a0a6b0 block: 1755701960
- current timestamp: 1756117493

## Description

ProverSet is in the process of changing owner.

## Watched changes

```diff
    contract ProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: An operator proxy used by the Taiko team for operating (proposing, proving) the based rollup from permissioned addresses.
      values.pendingOwner:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
    }
```

Generated with discovered.json: 0x6f603e71956eb5c81b15934d5323116a67d0f380

# Diff at Wed, 20 Aug 2025 14:59:53 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd418e068c274f7cd46e3ace7789ff5bbb8a2dad block: 1755606045
- current timestamp: 1755701960

## Description

New preconfirmer.

## Watched changes

```diff
    contract PreconfWhitelist (0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered.
      description:
-        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered."
+        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered."
      values.havingPerfectOperators:
-        true
+        false
      values.operatorCount:
-        3
+        4
      values.registeredOperators.3:
+        {"proposer":"eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7","sequencer":"eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"}
      values.registeredOperatorsCount:
-        3
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755606045 (main branch discovery), not current.

```diff
    contract PreconfWhitelist (0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered.
      values.registeredOperators:
+        [{"proposer":"eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990","sequencer":"eth:0x5F62d006C10C009ff50C878Cd6157aC861C99990"},{"proposer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74","sequencer":"eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74"},{"proposer":"eth:0xCbeB5d484b54498d3893A0c3Eb790331962e9e9d","sequencer":"eth:0x2ABD9afD6D41d0c37b8d55df11BFc73B53c3ac61"}]
      values.registeredOperatorsCount:
+        3
    }
```

Generated with discovered.json: 0x63df18f68dee7b6d0de30ee238658e8ba79aa263

# Diff at Tue, 19 Aug 2025 09:02:29 GMT:

- chain: taiko
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0ed103f64e02fe332cd2478ee125c9e5f1d4c1d9 block: 1755212383
- current timestamp: 1755594109

## Description

Silence discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755212383 (main branch discovery), not current.

```diff
    contract Bridge (0x1670000000000000000000000000000000000001) {
    +++ description: None
      values.nextMessageId:
-        4288
      values.proxiableUUID:
+        "EXPECT_REVERT"
    }
```

```diff
    contract TaikoAnchor (0x1670000000000000000000000000000000010001) {
    +++ description: Handles cross-layer message verification and manages EIP-1559 gas pricing for L2 operations. Anchors L1 block details to L2 for cross-layer communication.
      values.lastSyncedBlock:
-        23142409
      values.parentTimestamp:
-        1755212383
      values.publicInputHash:
-        "0xba37b9e2e1c66e4398dcdbdd8ebf6d8ee0609de9110089dfb0f1b5e2cdbe46c9"
    }
```

Generated with discovered.json: 0xad376da02da1f79ecd6ee3bb86214a204bc4c8ac

# Diff at Tue, 19 Aug 2025 09:02:29 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0ed103f64e02fe332cd2478ee125c9e5f1d4c1d9 block: 1755212383
- current timestamp: 1755594109

## Description

New operator count.

## Watched changes

```diff
    contract PreconfWhitelist (0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered.
      description:
-        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered."
+        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered."
      values.havingPerfectOperators:
-        false
+        true
      values.operatorCount:
-        4
+        3
    }
```

Generated with discovered.json: 0x8b3be1f2a9eed12773d1c1a22d8cf9dbb272d2a3

# Diff at Fri, 15 Aug 2025 08:50:57 GMT:

- chain: taiko
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1755212383

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Bridge (0x1670000000000000000000000000000000000001)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignalService (0x1670000000000000000000000000000000000005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2AddressManager (0x1670000000000000000000000000000000000006)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract TaikoAnchor (0x1670000000000000000000000000000000010001)
    +++ description: Handles cross-layer message verification and manages EIP-1559 gas pricing for L2 operations. Anchors L1 block details to L2 for cross-layer communication.
```

```diff
+   Status: CREATED
    contract DefaultResolver (0xc32277f541bBADAA260337E71Cea53871D310DC8)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract Taiko L2 Multisig (0xCa5b76Cc7A38b86Db11E5aE5B1fc9740c3bA3DE8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegateController (0xfA06E15B8b4c5BF3FC5d9cfD083d45c53Cbe8C7C)
    +++ description: None
```

Generated with discovered.json: 0xb50d1b74749190bba47a2ce6f7d59e8916c5fea8

# Diff at Fri, 15 Aug 2025 08:50:57 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@4f587a59296d1379430ccb7a3b8122c0594f7dfa block: 1755172721
- current timestamp: 1755212383

## Description

Taiko L2 side initial discovery.

## Watched changes

```diff
    contract PreconfWhitelist (0xFD019460881e6EeC632258222393d5821029b2ac) {
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered.
      description:
-        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered."
+        "Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 4 operators registered."
      values.getOperatorForNextEpoch:
-        "eth:0x000cb000E880A92a8f383D69dA2142a969B93DE7"
+        "eth:0xe2dA8aC2E550cd141198a117520D4EDc8692AB74"
      values.operatorCount:
-        3
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755172721 (main branch discovery), not current.

```diff
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.namedAddresses.11.name:
-        "0x7461696b6f000000000000000000000000000000000000000000000000000000"
+        "taiko"
      usedTypes.0.arg.0x7461696b6f000000000000000000000000000000000000000000000000000000:
+        "taiko"
    }
```

```diff
    contract DefaultResolver (0x8Efa01564425692d0a0838DC10E300BD310Cb43e) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      usedTypes.0.arg.0x7461696b6f000000000000000000000000000000000000000000000000000000:
+        "taiko"
    }
```

Generated with discovered.json: 0x4767f4cfc200b7d4d01e1f6e42842ea9c15ddc8f

# Diff at Thu, 14 Aug 2025 11:58:53 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@20325e19767a916f8b99b4ee5c90e82a0b7a7e16 block: 1753796542
- current timestamp: 1755172721

## Description

Preconf Upgrade!

[Fork Router](https://disco.l2beat.com/diff/eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319/eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F): no code diff

Old fork: same address

[New fork](https://disco.l2beat.com/diff/eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC/eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82): Minimal config changes: lower liveness bond,lower max batches per proposal, higher max anchor height.

[TaikoWrapper](https://disco.l2beat.com/diff/eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b/eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61): proposing must be done via PreconfRouter now.

## Watched changes

```diff
    contract TaikoL1 (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: Main contract implementing the logic for proposing and proving Taiko blocks on L1.
      sourceHashes.1:
-        "0xd3d952e9a5655549b172292d82b0e6e7b2223cab5ef6819f2790ed53304f56a7"
+        "0x036f854f425618da3e66dad1cd29e352eda6ce3f728eb078bc043f82fe653157"
      values.$implementation.0:
-        "eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319"
+        "eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F"
      values.$implementation.2:
-        "eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC"
+        "eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82"
      values.$pastUpgrades.27:
+        ["2025-08-11T13:45:11.000Z","0xbfd772cb4571eb6275f23d4fd8c7eb1502462b55821ee59dae0d15ab3325fc22",["eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F","eth:0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264","eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82"]]
      values.$upgradeCount:
-        27
+        28
      values.impl:
-        "eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319"
+        "eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F"
      values.newFork:
-        "eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC"
+        "eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82"
      values.pacayaConfig.maxBatchesToVerify:
-        16
+        8
      values.pacayaConfig.livenessBondBase:
-        "125000000000000000000"
+        "25000000000000000000"
      values.pacayaConfig.maxAnchorHeightOffset:
-        64
+        96
      implementationNames.eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319:
-        "PacayaForkRouter"
      implementationNames.eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC:
-        "MainnetInbox"
      implementationNames.eth:0xb4530aBee1Dd239C02266e73ca83Fe6617e77F2F:
+        "PacayaForkRouter"
      implementationNames.eth:0x257df77Ec059ca5CF9B7eD523f85B731A2eCdb82:
+        "MainnetInbox"
    }
```

```diff
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.namedAddresses.17:
+        {"name":"0x707265636f6e665f77686974656c697374000000000000000000000000000000","address":"eth:0xFD019460881e6EeC632258222393d5821029b2ac"}
      values.namedAddresses.18:
+        {"name":"0x707265636f6e665f726f75746572000000000000000000000000000000000000","address":"eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a"}
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      values.mrEnclaves.16:
+        "0xca349ba0dfeced0bd837a56c97417c11e51d490eec4ff08321dd130776a413bd"
      values.mrEnclaves.17:
+        "0xe2375b778ee5700a73c7fcf449abb4a62e00127d324b6694898073ba5aff4f5c"
      values.mrEnclaves.18:
+        "0x67742ab222790e20ba3656b3b294645a3384a5df5a770b86f8c06529523d990e"
      values.mrEnclaves.19:
+        "0xddda8ba9c9153e3d2f680f2f53adbc774a9753cc55d40dde4cb02aef38c42109"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.0:
+        "eth:0xAC5898b0FFFd23F4Ef09F0E50Fa1bC4896eF7163"
      values.$threshold:
-        4
+        5
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "5 of 7 (71%)"
      receivedPermissions.22:
+        {"permission":"upgrade","from":"eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a","role":"admin"}
      receivedPermissions.24:
+        {"permission":"upgrade","from":"eth:0xFD019460881e6EeC632258222393d5821029b2ac","role":"admin"}
    }
```

```diff
    contract TaikoWrapper (0x9F9D2fC7abe74C79f86F0D1212107692430eef72) {
    +++ description: Entry point for proposing blocks. It enforces the inclusion of forced transactions after their deadline.
      sourceHashes.1:
-        "0x9cee3ca82b3cd60de871679b86db583cbf35a0a911ded84676f9fdcc1a77c8ca"
+        "0x6f1f57d97885434b7f6b769ef9377a6fa75456740c69110c6bb37fb53a7fc68f"
      values.$implementation:
-        "eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
+        "eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61"
      values.$pastUpgrades.1:
+        ["2025-08-11T13:45:11.000Z","0xbfd772cb4571eb6275f23d4fd8c7eb1502462b55821ee59dae0d15ab3325fc22",["eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61"]]
      values.$upgradeCount:
-        1
+        2
      values.impl:
-        "eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
+        "eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61"
      values.preconfRouter:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a"
      implementationNames.eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b:
-        "TaikoWrapper"
      implementationNames.eth:0xa2D216dD9c84cb2e738240aac0956BE98293be61:
+        "TaikoWrapper"
    }
```

```diff
+   Status: CREATED
    contract PreconfRouter (0xD5AA0e20e8A6e9b04F080Cf8797410fafAa9688a)
    +++ description: Entry point for batch proposals under the pre-confirmation architecture. It allows batches to be proposed only by whitelisted addresses.
```

```diff
+   Status: CREATED
    contract PreconfWhitelist (0xFD019460881e6EeC632258222393d5821029b2ac)
    +++ description: Contract that contains the whitelist for addresses allowed to propose (pre-confirmation) batches. There are currently 3 operators registered.
```

## Source code changes

```diff
.../.flat/PreconfRouter/ERC1967Proxy.p.sol         |  594 +++++++
 .../ethereum/.flat/PreconfRouter/PreconfRouter.sol | 1438 +++++++++++++++
 .../.flat/PreconfWhitelist/ERC1967Proxy.p.sol      |  594 +++++++
 .../.flat/PreconfWhitelist/PreconfWhitelist.sol    | 1842 ++++++++++++++++++++
 .../TaikoL1/MainnetInbox.3.sol                     |    6 +-
 .../TaikoWrapper/TaikoWrapper.sol                  |   18 +-
 6 files changed, 4485 insertions(+), 7 deletions(-)
```

Generated with discovered.json: 0x28d2529708b2356dbbabf80805e933dd64d654fd

# Diff at Tue, 29 Jul 2025 13:42:27 GMT:

- chain: ethereum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@985826fe73e93650e4402d9ab61540358802d73e block: 1752565811
- current timestamp: 1753796542

## Description

Updated RISC0 Groth16 verifier version for Taiko batch proofs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752565811 (main branch discovery), not current.

```diff
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.namedAddresses.0.address:
-        "eth:0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
+        "eth:0x0000000000000000000000000000000000000000"
      values.namedAddresses.1.address:
-        "eth:0xFF5Adab685362DC4C33536a65aF5873738D1216B"
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Risc0VerifierGateway (0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE) {
    +++ description: Entry contract to verify batches using RISC Zero.
      sourceHashes.1:
-        "0xbf2f7f196a5a1b3990b49d6d86c282eedd22259e4e1c970138b25b38cced4ac6"
+        "0xd24723da846efa982924d892e9d3e52d38b6d85eab9d8e2f0a298ff07d18d994"
      values.$implementation:
-        "eth:0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
+        "eth:0x3dEF88e306E449c6Abf9AaD8038C95d11Bb0b614"
      values.$pastUpgrades.2:
+        ["2025-07-24T03:56:11.000Z","0x95d0cfffe42dc984ce8b24104a28d1083100ab638bb4fe396d1a145c17460db9",["eth:0x3dEF88e306E449c6Abf9AaD8038C95d11Bb0b614"]]
      values.$upgradeCount:
-        2
+        3
      values.impl:
-        "eth:0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
+        "eth:0x3dEF88e306E449c6Abf9AaD8038C95d11Bb0b614"
      values.riscoGroth16Verifier:
-        "eth:0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
+        "eth:0x34Eda8BfFb539AeC33078819847B36D221c6641c"
      implementationNames.eth:0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be:
-        "TaikoRisc0Verifier"
      implementationNames.eth:0x3dEF88e306E449c6Abf9AaD8038C95d11Bb0b614:
+        "Risc0Verifier"
    }
```

```diff
-   Status: DELETED
    contract RiscZeroGroth16Verifier (0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a)
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.1.0).
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0x34Eda8BfFb539AeC33078819847B36D221c6641c)
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.2.0).
```

Generated with discovered.json: 0xa14d0b5804b0b13aa300d9e4913b17ccbac8a1c6

# Diff at Tue, 22 Jul 2025 15:40:05 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22923197
- current block number: 22923197

## Description

Config: add version to verifier description.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22923197 (main branch discovery), not current.

```diff
    contract RiscZeroGroth16Verifier (0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a) {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.1.0).
      description:
-        "Verifier contract for RISC Zero Groth16 proofs."
+        "Verifier contract for RISC Zero Groth16 proofs (version 2.1.0)."
    }
```

Generated with discovered.json: 0x122a95c45ad7254441535d5785cdf2d32647a3eb

# Diff at Wed, 16 Jul 2025 15:00:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@99f4c3c49844de20b37b0c4c9c35d616989eef7d block: 22923197
- current block number: 22923197

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22923197 (main branch discovery), not current.

```diff
    contract QuotaManager (0x91f67118DD47d502B1f0C354D0611997B022f29E) {
    +++ description: Defines withdrawal limits per token.
      usedTypes.0.arg.eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48:
+        "USDC"
      usedTypes.0.arg.eth:0xdAC17F958D2ee523a2206206994597C13D831ec7:
+        "USDT"
      usedTypes.0.arg.eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800:
+        "TAIKO"
      usedTypes.0.arg.eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2:
+        "WETH"
      usedTypes.0.arg.eth:0x0000000000000000000000000000000000000000:
+        "Ether"
      usedTypes.0.arg.0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48:
-        "USDC"
      usedTypes.0.arg.0xdAC17F958D2ee523a2206206994597C13D831ec7:
-        "USDT"
      usedTypes.0.arg.0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800:
-        "TAIKO"
      usedTypes.0.arg.0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2:
-        "WETH"
      usedTypes.0.arg.0x0000000000000000000000000000000000000000:
-        "Ether"
    }
```

Generated with discovered.json: 0xb699939d690e0dc1d5373e5a2e4bc38539774aff

# Diff at Tue, 15 Jul 2025 08:05:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22882688
- current block number: 22923197

## Description

[Single line change](https://disco.l2beat.com/diff/eth:0x497B13f9192B09244de9b5F0964830969FB26F07/eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC) to the baseFeeConfig.sharingPctg: 50 -> 75.

[ai]: this means that 75% of transaction fees are going to the block proposer and 25% to taiko treasury (distribution logic on L2).
i could not really verify this claim and unsuccessfully searched for any l2 logic that distributes fees.

the pre-pacaya impl is the same.

## Watched changes

```diff
    contract TaikoL1 (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: Main contract implementing the logic for proposing and proving Taiko blocks on L1.
      sourceHashes.1:
-        "0xc4ae3ca2fcf606673a1324989a7ac169b3fdb6780917814506e56898484e99d7"
+        "0xd3d952e9a5655549b172292d82b0e6e7b2223cab5ef6819f2790ed53304f56a7"
      values.$implementation.0:
-        "eth:0x4e030b19135869F6fd926614754B7F9c184E2B83"
+        "eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319"
      values.$implementation.2:
-        "eth:0x497B13f9192B09244de9b5F0964830969FB26F07"
+        "eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC"
      values.$pastUpgrades.26:
+        ["2025-07-15T01:20:35.000Z","0xffedb70a513e71486c3a47079508d3ba87ae5362e7efb3300febac1be69276bc",["eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319","eth:0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264","eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC"]]
      values.$upgradeCount:
-        26
+        27
      values.impl:
-        "eth:0x4e030b19135869F6fd926614754B7F9c184E2B83"
+        "eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319"
      values.newFork:
-        "eth:0x497B13f9192B09244de9b5F0964830969FB26F07"
+        "eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC"
      values.pacayaConfig.baseFeeConfig.sharingPctg:
-        50
+        75
      implementationNames.eth:0x4e030b19135869F6fd926614754B7F9c184E2B83:
-        "PacayaForkRouter"
      implementationNames.eth:0x497B13f9192B09244de9b5F0964830969FB26F07:
-        "MainnetInbox"
      implementationNames.eth:0xde813DD3b89702E5Eb186FeE6FBC5dCf02aE6319:
+        "PacayaForkRouter"
      implementationNames.eth:0x80d888ce11738196CfCf27E3b18F65bD4a331CEC:
+        "MainnetInbox"
    }
```

## Source code changes

```diff
.../taiko/ethereum/{.flat@22882688 => .flat}/TaikoL1/MainnetInbox.3.sol | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x68f1c20a820d13d60bb85440876ad5ed1c5c35a4

# Diff at Mon, 14 Jul 2025 12:46:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22882688
- current block number: 22882688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22882688 (main branch discovery), not current.

```diff
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169) {
    +++ description: Library for managing PEM certificate chains.
      address:
-        "0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169"
+        "eth:0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169"
      implementationNames.0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169:
-        "PEMCertChainLib"
      implementationNames.eth:0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169:
+        "PEMCertChainLib"
    }
```

```diff
    contract ForcedInclusionStore (0x05d88855361808fA1d7fc28084Ef3fCa191c4e03) {
    +++ description: Contract that allows users to enqueue forced transactions via L1. The system guarantees that at least one pending forced transaction from the queue will be processed every 255 batches. Individual transactions may face longer delays if the queue is extensive.
      address:
-        "0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
+        "eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2"
+        "eth:0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2"
      values.$pastUpgrades.0.2.0:
-        "0x4BfB2bd9dC62474e440567D4D1D8bD72c022149b"
+        "eth:0x4BfB2bd9dC62474e440567D4D1D8bD72c022149b"
      values.$pastUpgrades.1.2.0:
-        "0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2"
+        "eth:0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2"
      values.impl:
-        "0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2"
+        "eth:0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2"
      values.inbox:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.inboxWrapper:
-        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x05d88855361808fA1d7fc28084Ef3fCa191c4e03:
-        "ERC1967Proxy"
      implementationNames.0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2:
-        "ForcedInclusionStore"
      implementationNames.eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03:
+        "ERC1967Proxy"
      implementationNames.eth:0xcdb25e201Ad3fdcFe16730A6CA2cC0B1Ce2137a2:
+        "ForcedInclusionStore"
    }
```

```diff
    contract TaikoL1 (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: Main contract implementing the logic for proposing and proving Taiko blocks on L1.
      address:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation.0:
-        "0x4e030b19135869F6fd926614754B7F9c184E2B83"
+        "eth:0x4e030b19135869F6fd926614754B7F9c184E2B83"
      values.$implementation.1:
-        "0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264"
+        "eth:0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264"
      values.$implementation.2:
-        "0x497B13f9192B09244de9b5F0964830969FB26F07"
+        "eth:0x497B13f9192B09244de9b5F0964830969FB26F07"
      values.$pastUpgrades.0.2.0:
-        "0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"
+        "eth:0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"
      values.$pastUpgrades.0.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.0.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.1.2.0:
-        "0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"
+        "eth:0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"
      values.$pastUpgrades.1.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.1.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.2.2.0:
-        "0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"
+        "eth:0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"
      values.$pastUpgrades.2.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.2.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.3.2.0:
-        "0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"
+        "eth:0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"
      values.$pastUpgrades.3.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.3.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.4.2.0:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "eth:0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
      values.$pastUpgrades.4.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.4.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.5.2.0:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "eth:0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.$pastUpgrades.5.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.5.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.6.2.0:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "eth:0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      values.$pastUpgrades.6.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.6.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.7.2.0:
-        "0x0468745A07de44A9a3138adAc35875ecaf7a20D5"
+        "eth:0x0468745A07de44A9a3138adAc35875ecaf7a20D5"
      values.$pastUpgrades.7.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.7.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.8.2.0:
-        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
+        "eth:0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.$pastUpgrades.8.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.8.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.9.2.0:
-        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
+        "eth:0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      values.$pastUpgrades.9.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.9.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.10.2.0:
-        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
+        "eth:0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
      values.$pastUpgrades.10.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.10.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.11.2.0:
-        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
+        "eth:0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
      values.$pastUpgrades.11.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.11.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.12.2.0:
-        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
+        "eth:0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
      values.$pastUpgrades.12.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.12.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.13.2.0:
-        "0x4229d14F520848aa83760Cf748abEB8A69cdaB2d"
+        "eth:0x4229d14F520848aa83760Cf748abEB8A69cdaB2d"
      values.$pastUpgrades.13.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.13.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.14.2.0:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "eth:0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.14.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.14.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.15.2.0:
-        "0x0205ea1e1162bc50E1030F36412E5Dd69daA4040"
+        "eth:0x0205ea1e1162bc50E1030F36412E5Dd69daA4040"
      values.$pastUpgrades.15.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.15.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.16.2.0:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "eth:0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.16.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.16.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.17.2.0:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "eth:0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.$pastUpgrades.17.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.17.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.18.2.0:
-        "0xb74A66b6CF50AD63E29669F0BDE4354E11758162"
+        "eth:0xb74A66b6CF50AD63E29669F0BDE4354E11758162"
      values.$pastUpgrades.18.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.18.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.19.2.0:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "eth:0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.19.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.19.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.20.2.0:
-        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
+        "eth:0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
      values.$pastUpgrades.20.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.20.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.21.2.0:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "eth:0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.$pastUpgrades.21.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.21.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.22.2.0:
-        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
+        "eth:0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
      values.$pastUpgrades.22.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.22.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.23.2.0:
-        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
+        "eth:0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
      values.$pastUpgrades.23.2.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.23.2.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.24.2.0:
-        "0x5eEcd1305aC72d4a77Bf3BD734e81c15e2A2adEf"
+        "eth:0x5eEcd1305aC72d4a77Bf3BD734e81c15e2A2adEf"
      values.$pastUpgrades.24.2.1:
-        "0xaA64D5A3A26D1e76AcAf6e22c199D02d58076A01"
+        "eth:0xaA64D5A3A26D1e76AcAf6e22c199D02d58076A01"
      values.$pastUpgrades.24.2.2:
-        "0x497B13f9192B09244de9b5F0964830969FB26F07"
+        "eth:0x497B13f9192B09244de9b5F0964830969FB26F07"
      values.$pastUpgrades.25.2.0:
-        "0x4e030b19135869F6fd926614754B7F9c184E2B83"
+        "eth:0x4e030b19135869F6fd926614754B7F9c184E2B83"
      values.$pastUpgrades.25.2.1:
-        "0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264"
+        "eth:0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264"
      values.$pastUpgrades.25.2.2:
-        "0x497B13f9192B09244de9b5F0964830969FB26F07"
+        "eth:0x497B13f9192B09244de9b5F0964830969FB26F07"
      values.bondToken:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.impl:
-        "0x4e030b19135869F6fd926614754B7F9c184E2B83"
+        "eth:0x4e030b19135869F6fd926614754B7F9c184E2B83"
      values.inboxWrapper:
-        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      values.newFork:
-        "0x497B13f9192B09244de9b5F0964830969FB26F07"
+        "eth:0x497B13f9192B09244de9b5F0964830969FB26F07"
      values.oldFork:
-        "0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264"
+        "eth:0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.signalService:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      values.verifier:
-        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      implementationNames.0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a:
-        "ERC1967Proxy"
      implementationNames.0x4e030b19135869F6fd926614754B7F9c184E2B83:
-        "PacayaForkRouter"
      implementationNames.0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264:
-        "MainnetTaikoL1"
      implementationNames.0x497B13f9192B09244de9b5F0964830969FB26F07:
-        "MainnetInbox"
      implementationNames.eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a:
+        "ERC1967Proxy"
      implementationNames.eth:0x4e030b19135869F6fd926614754B7F9c184E2B83:
+        "PacayaForkRouter"
      implementationNames.eth:0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264:
+        "MainnetTaikoL1"
      implementationNames.eth:0x497B13f9192B09244de9b5F0964830969FB26F07:
+        "MainnetInbox"
    }
```

```diff
    EOA  (0x0aED2375549D1115e180bd0caea829C429Ea50B3) {
    +++ description: None
      address:
-        "0x0aED2375549D1115e180bd0caea829C429Ea50B3"
+        "eth:0x0aED2375549D1115e180bd0caea829C429Ea50B3"
    }
```

```diff
    EOA  (0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438) {
    +++ description: None
      address:
-        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
+        "eth:0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
    }
```

```diff
    contract Halborn (0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351) {
    +++ description: None
      address:
-        "0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351"
+        "eth:0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x1d955983044548E03DAA583B36A37cA4bdE6F556"
+        "eth:0x1d955983044548E03DAA583B36A37cA4bdE6F556"
      values.$members.1:
-        "0xBFD60Cb2313B848a2FC088d3bc1ab6BF498E1DD1"
+        "eth:0xBFD60Cb2313B848a2FC088d3bc1ab6BF498E1DD1"
      values.$members.2:
-        "0xDFbD5490462963Cc242471913B53b034B209B32c"
+        "eth:0xDFbD5490462963Cc242471913B53b034B209B32c"
      implementationNames.0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract SignerList (0x0F95E6968EC1B28c794CF1aD99609431de5179c2) {
    +++ description: A signer list for registering agents, similar to a Multisig.
      address:
-        "0x0F95E6968EC1B28c794CF1aD99609431de5179c2"
+        "eth:0x0F95E6968EC1B28c794CF1aD99609431de5179c2"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x584fE70fE82F728f0Fe26488857D623f3B59E070"
+        "eth:0x584fE70fE82F728f0Fe26488857D623f3B59E070"
      values.$pastUpgrades.0.2.0:
-        "0x584fE70fE82F728f0Fe26488857D623f3B59E070"
+        "eth:0x584fE70fE82F728f0Fe26488857D623f3B59E070"
      values.dao:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.getEncryptionAgents.0:
-        "0x93533a3511E9b0d5c17b1CBD0e1737781DEf61a6"
+        "eth:0x93533a3511E9b0d5c17b1CBD0e1737781DEf61a6"
      values.getEncryptionAgents.1:
-        "0x884c3e8235788ae52C2106E847e30BD84F2FBCb8"
+        "eth:0x884c3e8235788ae52C2106E847e30BD84F2FBCb8"
      values.getEncryptionAgents.2:
-        "0x22aD66bcEaeff83e1461772Fa85CbeB01f0915f4"
+        "eth:0x22aD66bcEaeff83e1461772Fa85CbeB01f0915f4"
      values.getEncryptionAgents.3:
-        "0x4236f57E9dBc238878EFac4AeF0A16D4dD06DC1A"
+        "eth:0x4236f57E9dBc238878EFac4AeF0A16D4dD06DC1A"
      values.getEncryptionAgents.4:
-        "0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
+        "eth:0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
      values.getEncryptionAgents.5:
-        "0x18B4f2afe456Dc89bddE9710476dCfC62D01d656"
+        "eth:0x18B4f2afe456Dc89bddE9710476dCfC62D01d656"
      values.getEncryptionAgents.6:
-        "0x1d955983044548E03DAA583B36A37cA4bdE6F556"
+        "eth:0x1d955983044548E03DAA583B36A37cA4bdE6F556"
      values.getEncryptionAgents.7:
-        "0xf0A0d6Bd4aA94F53F3FB2c88488202a9E9eD2c55"
+        "eth:0xf0A0d6Bd4aA94F53F3FB2c88488202a9E9eD2c55"
      values.settings.encryptionRegistry:
-        "0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1"
+        "eth:0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1"
      implementationNames.0x0F95E6968EC1B28c794CF1aD99609431de5179c2:
-        "ERC1967Proxy"
      implementationNames.0x584fE70fE82F728f0Fe26488857D623f3B59E070:
-        "SignerList"
      implementationNames.eth:0x0F95E6968EC1B28c794CF1aD99609431de5179c2:
+        "ERC1967Proxy"
      implementationNames.eth:0x584fE70fE82F728f0Fe26488857D623f3B59E070:
+        "SignerList"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261) {
    +++ description: Contract managing SGX attestation certificates.
      address:
-        "0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72"
+        "eth:0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72"
      values.$pastUpgrades.0.2.0:
-        "0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72"
+        "eth:0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72"
      values.impl:
-        "0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72"
+        "eth:0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pemCertLib:
-        "0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169"
+        "eth:0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.sigVerifyLib:
-        "0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9"
+        "eth:0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9"
      implementationNames.0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261:
-        "ERC1967Proxy"
      implementationNames.0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72:
-        "AutomataDcapV3Attestation"
      implementationNames.eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261:
+        "ERC1967Proxy"
      implementationNames.eth:0x5e46443bd131eB6d4c6Fb4849bAD29af9596dd72:
+        "AutomataDcapV3Attestation"
    }
```

```diff
    contract Taiko Token (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: ERC20 contract implementing the TAIKO token. It defines a list of addresses designated as non-voting.
      address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.$admin:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation:
-        "0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
+        "eth:0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
      values.$pastUpgrades.0.2.0:
-        "0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"
+        "eth:0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"
      values.$pastUpgrades.1.2.0:
-        "0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"
+        "eth:0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"
      values.$pastUpgrades.2.2.0:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "eth:0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
      values.$pastUpgrades.3.2.0:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "eth:0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
      values.$pastUpgrades.4.2.0:
-        "0xcfe803378D79d1180EbF030455040EA6513869dF"
+        "eth:0xcfe803378D79d1180EbF030455040EA6513869dF"
      values.$pastUpgrades.5.2.0:
-        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
+        "eth:0x87C752b0F70cAa237Edd7571B0845470A37DE040"
      values.$pastUpgrades.6.2.0:
-        "0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
+        "eth:0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
      values.eip712Domain.verifyingContract:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.getNonVotingAccounts.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getNonVotingAccounts.1:
-        "0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da"
+        "eth:0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da"
      values.getNonVotingAccounts.2:
-        "0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
+        "eth:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
      values.getNonVotingAccounts.3:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      values.impl:
-        "0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
+        "eth:0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
      values.owner:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.TAIKO_DAO_CONTROLLER:
-        "0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
+        "eth:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
      values.TAIKO_ERC20_VAULT:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      values.TAIKO_FOUNDATION_TREASURY:
-        "0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da"
+        "eth:0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da"
      implementationNames.0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800:
-        "ERC1967Proxy"
      implementationNames.0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106:
-        "TaikoToken"
      implementationNames.eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800:
+        "ERC1967Proxy"
      implementationNames.eth:0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106:
+        "TaikoToken"
    }
```

```diff
    EOA  (0x166868E5AE72592a06056775236d2E4D64CDcCa9) {
    +++ description: None
      address:
-        "0x166868E5AE72592a06056775236d2E4D64CDcCa9"
+        "eth:0x166868E5AE72592a06056775236d2E4D64CDcCa9"
    }
```

```diff
    EOA Drew Van der Werff Agent (0x18B4f2afe456Dc89bddE9710476dCfC62D01d656) {
    +++ description: None
      address:
-        "0x18B4f2afe456Dc89bddE9710476dCfC62D01d656"
+        "eth:0x18B4f2afe456Dc89bddE9710476dCfC62D01d656"
    }
```

```diff
    EOA Halborn Agent (0x1d955983044548E03DAA583B36A37cA4bdE6F556) {
    +++ description: None
      address:
-        "0x1d955983044548E03DAA583B36A37cA4bdE6F556"
+        "eth:0x1d955983044548E03DAA583B36A37cA4bdE6F556"
    }
```

```diff
    EOA  (0x1eE487CEdCe52c370DB11e62987F3ABe873E145A) {
    +++ description: None
      address:
-        "0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
+        "eth:0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
    }
```

```diff
    EOA Chainbound Agent (0x22aD66bcEaeff83e1461772Fa85CbeB01f0915f4) {
    +++ description: None
      address:
-        "0x22aD66bcEaeff83e1461772Fa85CbeB01f0915f4"
+        "eth:0x22aD66bcEaeff83e1461772Fa85CbeB01f0915f4"
    }
```

```diff
    EOA  (0x23aEC1a2094F995D1680E33c677b0a4092eFe2fB) {
    +++ description: None
      address:
-        "0x23aEC1a2094F995D1680E33c677b0a4092eFe2fB"
+        "eth:0x23aEC1a2094F995D1680E33c677b0a4092eFe2fB"
    }
```

```diff
    contract Drew Van der Werff (0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1) {
    +++ description: None
      address:
-        "0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1"
+        "eth:0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xE7CBcDa9a4FEAe2bC7ca6b2B682Bc4Ae9f8B7e3B"
+        "eth:0xE7CBcDa9a4FEAe2bC7ca6b2B682Bc4Ae9f8B7e3B"
      values.$members.1:
-        "0x23aEC1a2094F995D1680E33c677b0a4092eFe2fB"
+        "eth:0x23aEC1a2094F995D1680E33c677b0a4092eFe2fB"
      implementationNames.0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract EmergencyMultisig (0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing encrypted proposals (e.g. for Security Council emergency proposals).
      address:
-        "0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd"
+        "eth:0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x437E450452E8Bc142bd5317199296EcB187c514b"
+        "eth:0x437E450452E8Bc142bd5317199296EcB187c514b"
      values.$pastUpgrades.0.2.0:
-        "0x437E450452E8Bc142bd5317199296EcB187c514b"
+        "eth:0x437E450452E8Bc142bd5317199296EcB187c514b"
      values.dao:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.implementation:
-        "0x437E450452E8Bc142bd5317199296EcB187c514b"
+        "eth:0x437E450452E8Bc142bd5317199296EcB187c514b"
      values.multisigSettings.signerList:
-        "0x0F95E6968EC1B28c794CF1aD99609431de5179c2"
+        "eth:0x0F95E6968EC1B28c794CF1aD99609431de5179c2"
      implementationNames.0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd:
-        "ERC1967Proxy"
      implementationNames.0x437E450452E8Bc142bd5317199296EcB187c514b:
-        "EmergencyMultisig"
      implementationNames.eth:0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd:
+        "ERC1967Proxy"
      implementationNames.eth:0x437E450452E8Bc142bd5317199296EcB187c514b:
+        "EmergencyMultisig"
    }
```

```diff
    contract EncryptionRegistry (0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1) {
    +++ description: A registry for signers (of the Security Council) to appoint agents to operate on their behalf. These agents can also register their encryption keys for encrypted emergency proposal support.
      address:
-        "0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1"
+        "eth:0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1"
      values.accountList.0:
-        "0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070"
+        "eth:0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070"
      values.accountList.1:
-        "0xa384E224A3F3D664F43eBE33395eF0DCcE67e894"
+        "eth:0xa384E224A3F3D664F43eBE33395eF0DCcE67e894"
      values.accountList.2:
-        "0xf1cF63589A1e012F9124182c9eAa36B5333e5f06"
+        "eth:0xf1cF63589A1e012F9124182c9eAa36B5333e5f06"
      values.accountList.3:
-        "0x436a1075099A145417EBFc74BBaC9605e3e4f1A7"
+        "eth:0x436a1075099A145417EBFc74BBaC9605e3e4f1A7"
      values.accountList.4:
-        "0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95"
+        "eth:0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95"
      values.accountList.5:
-        "0xb284810536C0dAB6A8e48153B58588A9B9e0F701"
+        "eth:0xb284810536C0dAB6A8e48153B58588A9B9e0F701"
      values.accountList.6:
-        "0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1"
+        "eth:0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1"
      values.accountList.7:
-        "0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351"
+        "eth:0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351"
      values.accountList.8:
-        "0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
+        "eth:0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
      values.accountList.9:
-        "0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487"
+        "eth:0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487"
      values.getRegisteredAccounts.0:
-        "0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070"
+        "eth:0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070"
      values.getRegisteredAccounts.1:
-        "0xa384E224A3F3D664F43eBE33395eF0DCcE67e894"
+        "eth:0xa384E224A3F3D664F43eBE33395eF0DCcE67e894"
      values.getRegisteredAccounts.2:
-        "0xf1cF63589A1e012F9124182c9eAa36B5333e5f06"
+        "eth:0xf1cF63589A1e012F9124182c9eAa36B5333e5f06"
      values.getRegisteredAccounts.3:
-        "0x436a1075099A145417EBFc74BBaC9605e3e4f1A7"
+        "eth:0x436a1075099A145417EBFc74BBaC9605e3e4f1A7"
      values.getRegisteredAccounts.4:
-        "0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95"
+        "eth:0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95"
      values.getRegisteredAccounts.5:
-        "0xb284810536C0dAB6A8e48153B58588A9B9e0F701"
+        "eth:0xb284810536C0dAB6A8e48153B58588A9B9e0F701"
      values.getRegisteredAccounts.6:
-        "0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1"
+        "eth:0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1"
      values.getRegisteredAccounts.7:
-        "0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351"
+        "eth:0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351"
      values.getRegisteredAccounts.8:
-        "0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
+        "eth:0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
      values.getRegisteredAccounts.9:
-        "0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487"
+        "eth:0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487"
      implementationNames.0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1:
-        "EncryptionRegistry"
      implementationNames.eth:0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1:
+        "EncryptionRegistry"
    }
```

```diff
    EOA  (0x30bc4C0Baf55A37Ccf2d626Bc592bd7715b75De2) {
    +++ description: None
      address:
-        "0x30bc4C0Baf55A37Ccf2d626Bc592bd7715b75De2"
+        "eth:0x30bc4C0Baf55A37Ccf2d626Bc592bd7715b75De2"
    }
```

```diff
    contract Taiko Foundation Treasury Multisig (0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da) {
    +++ description: None
      address:
-        "0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da"
+        "eth:0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$members.1:
-        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
+        "eth:0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
      values.$members.2:
-        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
+        "eth:0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
      implementationNames.0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da:
-        "GnosisSafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da:
+        "GnosisSafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x392EF0Ec3579436299E4f9b170c454995c03CE8A) {
    +++ description: None
      address:
-        "0x392EF0Ec3579436299E4f9b170c454995c03CE8A"
+        "eth:0x392EF0Ec3579436299E4f9b170c454995c03CE8A"
    }
```

```diff
    EOA  (0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1) {
    +++ description: None
      address:
-        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
+        "eth:0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
    }
```

```diff
    EOA  (0x3D4997AAC0834BEb5ede861c424807Aa3F29b5bB) {
    +++ description: None
      address:
-        "0x3D4997AAC0834BEb5ede861c424807Aa3F29b5bB"
+        "eth:0x3D4997AAC0834BEb5ede861c424807Aa3F29b5bB"
    }
```

```diff
    EOA  (0x3ffe3F16d47A54b1C6A3f47c9E6Ff5C2C1B32859) {
    +++ description: None
      address:
-        "0x3ffe3F16d47A54b1C6A3f47c9E6Ff5C2C1B32859"
+        "eth:0x3ffe3F16d47A54b1C6A3f47c9E6Ff5C2C1B32859"
    }
```

```diff
    EOA Nethermind Agent (0x4236f57E9dBc238878EFac4AeF0A16D4dD06DC1A) {
    +++ description: None
      address:
-        "0x4236f57E9dBc238878EFac4AeF0A16D4dD06DC1A"
+        "eth:0x4236f57E9dBc238878EFac4AeF0A16D4dD06DC1A"
    }
```

```diff
    contract Chainbound (0x436a1075099A145417EBFc74BBaC9605e3e4f1A7) {
    +++ description: None
      address:
-        "0x436a1075099A145417EBFc74BBaC9605e3e4f1A7"
+        "eth:0x436a1075099A145417EBFc74BBaC9605e3e4f1A7"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x719304183f09a84C4D8dA8d64BDB6C6E0EEede4E"
+        "eth:0x719304183f09a84C4D8dA8d64BDB6C6E0EEede4E"
      values.$members.1:
-        "0xcF7017aD172a8aefBfF7e45CfaCeF5bd94701477"
+        "eth:0xcF7017aD172a8aefBfF7e45CfaCeF5bd94701477"
      values.$members.2:
-        "0xbBCE182D3d6ae94CF0d0BF7C83E87c01f42635B0"
+        "eth:0xbBCE182D3d6ae94CF0d0BF7C83E87c01f42635B0"
      values.$members.3:
-        "0x51c7c8F83F8C43D83ec5a5e0EB2a2863839B864d"
+        "eth:0x51c7c8F83F8C43D83ec5a5e0EB2a2863839B864d"
      implementationNames.0x436a1075099A145417EBFc74BBaC9605e3e4f1A7:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x436a1075099A145417EBFc74BBaC9605e3e4f1A7:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9) {
    +++ description: Library for verifying signatures.
      address:
-        "0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9"
+        "eth:0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9"
      implementationNames.0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9:
-        "SigVerifyLib"
      implementationNames.eth:0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9:
+        "SigVerifyLib"
    }
```

```diff
    EOA  (0x51c7c8F83F8C43D83ec5a5e0EB2a2863839B864d) {
    +++ description: None
      address:
-        "0x51c7c8F83F8C43D83ec5a5e0EB2a2863839B864d"
+        "eth:0x51c7c8F83F8C43D83ec5a5e0EB2a2863839B864d"
    }
```

```diff
    contract Nethermind (0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95) {
    +++ description: None
      address:
-        "0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95"
+        "eth:0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xbC40317A69CB1D1aF2CBcfE32C8B7a6840Dc287a"
+        "eth:0xbC40317A69CB1D1aF2CBcfE32C8B7a6840Dc287a"
      values.$members.1:
-        "0x4236f57E9dBc238878EFac4AeF0A16D4dD06DC1A"
+        "eth:0x4236f57E9dBc238878EFac4AeF0A16D4dD06DC1A"
      values.$members.2:
-        "0xE8Cd88fb3081EA29D1D6AeAefcb45BBDF512B39f"
+        "eth:0xE8Cd88fb3081EA29D1D6AeAefcb45BBDF512B39f"
      implementationNames.0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x5374b2907a45a28c37caA45e06FC6eBceECAC72a) {
    +++ description: None
      address:
-        "0x5374b2907a45a28c37caA45e06FC6eBceECAC72a"
+        "eth:0x5374b2907a45a28c37caA45e06FC6eBceECAC72a"
    }
```

```diff
    EOA  (0x55792e1F0a41D3af8B6d41DFdcf24651AA80fA1e) {
    +++ description: None
      address:
-        "0x55792e1F0a41D3af8B6d41DFdcf24651AA80fA1e"
+        "eth:0x55792e1F0a41D3af8B6d41DFdcf24651AA80fA1e"
    }
```

```diff
    EOA  (0x5811Ab14833720D743ec57BC49c9342DF66069d0) {
    +++ description: None
      address:
-        "0x5811Ab14833720D743ec57BC49c9342DF66069d0"
+        "eth:0x5811Ab14833720D743ec57BC49c9342DF66069d0"
    }
```

```diff
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      address:
-        "0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
+        "eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xE78659fbF234c84C909Cf317D84edc2f6C0D8413"
+        "eth:0xE78659fbF234c84C909Cf317D84edc2f6C0D8413"
      values.$pastUpgrades.0.2.0:
-        "0xE78659fbF234c84C909Cf317D84edc2f6C0D8413"
+        "eth:0xE78659fbF234c84C909Cf317D84edc2f6C0D8413"
      values.impl:
-        "0xE78659fbF234c84C909Cf317D84edc2f6C0D8413"
+        "eth:0xE78659fbF234c84C909Cf317D84edc2f6C0D8413"
      values.namedAddresses.0.address:
-        "0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
+        "eth:0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
      values.namedAddresses.1.address:
-        "0xFF5Adab685362DC4C33536a65aF5873738D1216B"
+        "eth:0xFF5Adab685362DC4C33536a65aF5873738D1216B"
      values.namedAddresses.2.address:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      values.namedAddresses.3.address:
-        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
+        "eth:0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
      values.namedAddresses.4.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.5.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.6.address:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      values.namedAddresses.7.address:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      values.namedAddresses.8.address:
-        "0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
+        "eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      values.namedAddresses.9.address:
-        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      values.namedAddresses.10.address:
-        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      values.namedAddresses.11.address:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.namedAddresses.12.address:
-        "0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      values.namedAddresses.13.address:
-        "0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      values.namedAddresses.14.address:
-        "0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
+        "eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      values.namedAddresses.15.address:
-        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      values.namedAddresses.16.address:
-        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
+        "eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      implementationNames.0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a:
-        "ERC1967Proxy"
      implementationNames.0xE78659fbF234c84C909Cf317D84edc2f6C0D8413:
-        "DefaultResolver"
      implementationNames.eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a:
+        "ERC1967Proxy"
      implementationNames.eth:0xE78659fbF234c84C909Cf317D84edc2f6C0D8413:
+        "DefaultResolver"
    }
```

```diff
    contract ProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: An operator proxy used by the Taiko team for operating (proposing, proving) the based rollup from permissioned addresses.
      address:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "eth:0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xB8826B144eB895eFE2923b61b3b117B1298A9526"
+        "eth:0xB8826B144eB895eFE2923b61b3b117B1298A9526"
      values.$pastUpgrades.0.2.0:
-        "0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"
+        "eth:0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"
      values.$pastUpgrades.1.2.0:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "eth:0x500735343372Dd6c9B84dBc7a75babf4479742B9"
      values.$pastUpgrades.2.2.0:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "eth:0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
      values.$pastUpgrades.3.2.0:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "eth:0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
      values.$pastUpgrades.4.2.0:
-        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
+        "eth:0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
      values.$pastUpgrades.5.2.0:
-        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
+        "eth:0x518845daA8870bE2C59E49620Fc262AD48953C9a"
      values.$pastUpgrades.6.2.0:
-        "0x74828E5fe803072AF9Df512B3911B4223572D652"
+        "eth:0x74828E5fe803072AF9Df512B3911B4223572D652"
      values.$pastUpgrades.7.2.0:
-        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
+        "eth:0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
      values.$pastUpgrades.8.2.0:
-        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
+        "eth:0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
      values.$pastUpgrades.9.2.0:
-        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
+        "eth:0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
      values.$pastUpgrades.10.2.0:
-        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
+        "eth:0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
      values.$pastUpgrades.11.2.0:
-        "0xB8826B144eB895eFE2923b61b3b117B1298A9526"
+        "eth:0xB8826B144eB895eFE2923b61b3b117B1298A9526"
      values.admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.bondToken:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.entrypoint:
-        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      values.impl:
-        "0xB8826B144eB895eFE2923b61b3b117B1298A9526"
+        "eth:0xB8826B144eB895eFE2923b61b3b117B1298A9526"
      values.inbox:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
+        "eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      implementationNames.0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9:
-        "ERC1967Proxy"
      implementationNames.0xB8826B144eB895eFE2923b61b3b117B1298A9526:
-        "ProverSet"
      implementationNames.eth:0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9:
+        "ERC1967Proxy"
      implementationNames.eth:0xB8826B144eB895eFE2923b61b3b117B1298A9526:
+        "ProverSet"
    }
```

```diff
    EOA  (0x6dcB04fCC1c597DAFad86e2886bE463d53CaFAdf) {
    +++ description: None
      address:
-        "0x6dcB04fCC1c597DAFad86e2886bE463d53CaFAdf"
+        "eth:0x6dcB04fCC1c597DAFad86e2886bE463d53CaFAdf"
    }
```

```diff
    EOA  (0x7057A707621Fadd422f84DE94A9dF7c4F1AC595C) {
    +++ description: None
      address:
-        "0x7057A707621Fadd422f84DE94A9dF7c4F1AC595C"
+        "eth:0x7057A707621Fadd422f84DE94A9dF7c4F1AC595C"
    }
```

```diff
    EOA  (0x719304183f09a84C4D8dA8d64BDB6C6E0EEede4E) {
    +++ description: None
      address:
-        "0x719304183f09a84C4D8dA8d64BDB6C6E0EEede4E"
+        "eth:0x719304183f09a84C4D8dA8d64BDB6C6E0EEede4E"
    }
```

```diff
    contract Risc0VerifierGateway (0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE) {
    +++ description: Entry contract to verify batches using RISC Zero.
      address:
-        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
+        "eth:0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
      values.$pastUpgrades.0.2.0:
-        "0x801878e56A8DA58d6a837006345CDD11a9E6a852"
+        "eth:0x801878e56A8DA58d6a837006345CDD11a9E6a852"
      values.$pastUpgrades.1.2.0:
-        "0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
+        "eth:0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
      values.impl:
-        "0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
+        "eth:0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.riscoGroth16Verifier:
-        "0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
+        "eth:0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
      implementationNames.0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE:
-        "ERC1967Proxy"
      implementationNames.0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be:
-        "TaikoRisc0Verifier"
      implementationNames.eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE:
+        "ERC1967Proxy"
      implementationNames.eth:0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be:
+        "TaikoRisc0Verifier"
    }
```

```diff
    contract TaikoDAOController (0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      address:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$admin:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.$implementation:
-        "0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06"
+        "eth:0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06"
      values.$pastUpgrades.0.2.0:
-        "0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06"
+        "eth:0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06"
      values.impl:
-        "0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06"
+        "eth:0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06"
      values.owner:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a:
-        "ERC1967Proxy"
      implementationNames.0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06:
-        "TaikoDAOController"
      implementationNames.eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a:
+        "ERC1967Proxy"
      implementationNames.eth:0x4347df63bdC82b8835fC9FF47bC5a71a12cC0f06:
+        "TaikoDAOController"
    }
```

```diff
    EOA  (0x7Cdd1c128Cd72dd252f569eeD942735330937F91) {
    +++ description: None
      address:
-        "0x7Cdd1c128Cd72dd252f569eeD942735330937F91"
+        "eth:0x7Cdd1c128Cd72dd252f569eeD942735330937F91"
    }
```

```diff
    contract SgxVerifier (0x7e6409e9b6c5e2064064a6cC994f9a2e95680782) {
    +++ description: Verifier contract for SGX proven blocks.
      address:
-        "0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5"
+        "eth:0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5"
      values.$pastUpgrades.0.2.0:
-        "0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5"
+        "eth:0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5"
      values.automataDcapAttestation:
-        "0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      values.impl:
-        "0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5"
+        "eth:0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.taikoInbox:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.taikoProofVerifier:
-        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      implementationNames.0x7e6409e9b6c5e2064064a6cC994f9a2e95680782:
-        "ERC1967Proxy"
      implementationNames.0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5:
-        "SgxVerifier"
      implementationNames.eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782:
+        "ERC1967Proxy"
      implementationNames.eth:0xDb7AEe4fA967C2aB0eC28f63C8675224E59340A5:
+        "SgxVerifier"
    }
```

```diff
    EOA Aragon Agent (0x824Dce8d292a393DAb5FFdeb788DC1086257f678) {
    +++ description: None
      address:
-        "0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
+        "eth:0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
    }
```

```diff
    EOA  (0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070) {
    +++ description: None
      address:
-        "0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070"
+        "eth:0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070"
    }
```

```diff
    EOA L2BEAT Agent (0x884c3e8235788ae52C2106E847e30BD84F2FBCb8) {
    +++ description: None
      address:
-        "0x884c3e8235788ae52C2106E847e30BD84F2FBCb8"
+        "eth:0x884c3e8235788ae52C2106E847e30BD84F2FBCb8"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      address:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"
+        "eth:0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"
      values.$pastUpgrades.0.2.0:
-        "0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"
+        "eth:0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"
      values.$pastUpgrades.1.2.0:
-        "0xde1b1FBe7D721af4A56651272ef91A59B7303323"
+        "eth:0xde1b1FBe7D721af4A56651272ef91A59B7303323"
      values.$pastUpgrades.2.2.0:
-        "0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"
+        "eth:0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"
      values.addressManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.impl:
-        "0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"
+        "eth:0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pemCertLib:
-        "0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169"
+        "eth:0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.sigVerifyLib:
-        "0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9"
+        "eth:0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9"
      implementationNames.0x8d7C954960a36a7596d7eA4945dDf891967ca8A3:
-        "ERC1967Proxy"
      implementationNames.0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5:
-        "AutomataDcapV3Attestation"
      implementationNames.eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3:
+        "ERC1967Proxy"
      implementationNames.eth:0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5:
+        "AutomataDcapV3Attestation"
    }
```

```diff
    contract DefaultResolver (0x8Efa01564425692d0a0838DC10E300BD310Cb43e) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      address:
-        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D"
+        "eth:0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D"
      values.$pastUpgrades.0.2.0:
-        "0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D"
+        "eth:0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D"
      values.impl:
-        "0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D"
+        "eth:0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D"
      values.namedAddresses.0.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.1.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.2.address:
-        "0x1670000000000000000000000000000000000001"
+        "eth:0x1670000000000000000000000000000000000001"
      values.namedAddresses.3.address:
-        "0x1670000000000000000000000000000000000005"
+        "eth:0x1670000000000000000000000000000000000005"
      values.namedAddresses.4.address:
-        "0x1670000000000000000000000000000000000002"
+        "eth:0x1670000000000000000000000000000000000002"
      values.namedAddresses.5.address:
-        "0x1670000000000000000000000000000000000003"
+        "eth:0x1670000000000000000000000000000000000003"
      values.namedAddresses.6.address:
-        "0x1670000000000000000000000000000000000004"
+        "eth:0x1670000000000000000000000000000000000004"
      values.namedAddresses.7.address:
-        "0x00000291AB79c55dC4Fcd97dFbA4880DF4b93624"
+        "eth:0x00000291AB79c55dC4Fcd97dFbA4880DF4b93624"
      values.namedAddresses.8.address:
-        "0x65666141a541423606365123Ed280AB16a09A2e1"
+        "eth:0x65666141a541423606365123Ed280AB16a09A2e1"
      values.namedAddresses.9.address:
-        "0xC3310905E2BC9Cfb198695B75EF3e5B69C6A1Bf7"
+        "eth:0xC3310905E2BC9Cfb198695B75EF3e5B69C6A1Bf7"
      values.namedAddresses.10.address:
-        "0x3c90963cFBa436400B0F9C46Aa9224cB379c2c40"
+        "eth:0x3c90963cFBa436400B0F9C46Aa9224cB379c2c40"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      implementationNames.0x8Efa01564425692d0a0838DC10E300BD310Cb43e:
-        "ERC1967Proxy"
      implementationNames.0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D:
-        "DefaultResolver"
      implementationNames.eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e:
+        "ERC1967Proxy"
      implementationNames.eth:0xFca4F0Ab7B95EEf2e3A60EF2Bc0c42DdAA62E66D:
+        "DefaultResolver"
    }
```

```diff
    contract QuotaManager (0x91f67118DD47d502B1f0C354D0611997B022f29E) {
    +++ description: Defines withdrawal limits per token.
      address:
-        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
+        "eth:0x91f67118DD47d502B1f0C354D0611997B022f29E"
      values.$admin:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation:
-        "0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64"
+        "eth:0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64"
      values.$pastUpgrades.0.2.0:
-        "0x49c5e5F131314Bb24b17E249960F8B12F925ef22"
+        "eth:0x49c5e5F131314Bb24b17E249960F8B12F925ef22"
      values.$pastUpgrades.1.2.0:
-        "0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64"
+        "eth:0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64"
      values.addressManager:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      values.impl:
-        "0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64"
+        "eth:0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64"
      values.owner:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x91f67118DD47d502B1f0C354D0611997B022f29E:
-        "ERC1967Proxy"
      implementationNames.0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64:
-        "QuotaManager"
      implementationNames.eth:0x91f67118DD47d502B1f0C354D0611997B022f29E:
+        "ERC1967Proxy"
      implementationNames.eth:0xdb627bfD79e81fE42138Eb875287F94FAd5BBc64:
+        "QuotaManager"
    }
```

```diff
    EOA Toni Wahrstätter Agent (0x93533a3511E9b0d5c17b1CBD0e1737781DEf61a6) {
    +++ description: None
      address:
-        "0x93533a3511E9b0d5c17b1CBD0e1737781DEf61a6"
+        "eth:0x93533a3511E9b0d5c17b1CBD0e1737781DEf61a6"
    }
```

```diff
    contract OptimisticTokenVotingPlugin (0x989E348275b659d36f8751ea1c10D146211650BE) {
    +++ description: An optimistic governance module. Proposals pass and can be executed unless 10% of votable TAIKO veto them within 7d.
      address:
-        "0x989E348275b659d36f8751ea1c10D146211650BE"
+        "eth:0x989E348275b659d36f8751ea1c10D146211650BE"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x5B0Da2FB08754a5dDf32e28887D2F5437485f085"
+        "eth:0x5B0Da2FB08754a5dDf32e28887D2F5437485f085"
      values.$pastUpgrades.0.2.0:
-        "0x5B0Da2FB08754a5dDf32e28887D2F5437485f085"
+        "eth:0x5B0Da2FB08754a5dDf32e28887D2F5437485f085"
      values.dao:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.implementation:
-        "0x5B0Da2FB08754a5dDf32e28887D2F5437485f085"
+        "eth:0x5B0Da2FB08754a5dDf32e28887D2F5437485f085"
      values.taikoBridge:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      values.taikoL1:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.votingToken:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      implementationNames.0x989E348275b659d36f8751ea1c10D146211650BE:
-        "ERC1967Proxy"
      implementationNames.0x5B0Da2FB08754a5dDf32e28887D2F5437485f085:
-        "OptimisticTokenVotingPlugin"
      implementationNames.eth:0x989E348275b659d36f8751ea1c10D146211650BE:
+        "ERC1967Proxy"
      implementationNames.eth:0x5B0Da2FB08754a5dDf32e28887D2F5437485f085:
+        "OptimisticTokenVotingPlugin"
    }
```

```diff
    contract MainnetERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: Shared vault for Taiko chains for bridged ERC20 tokens.
      address:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      values.$admin:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation:
-        "0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
+        "eth:0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
      values.$pastUpgrades.0.2.0:
-        "0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"
+        "eth:0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"
      values.$pastUpgrades.1.2.0:
-        "0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"
+        "eth:0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"
      values.$pastUpgrades.2.2.0:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "eth:0x4F750D13005444407D44dAA30922128db0374ca1"
      values.$pastUpgrades.3.2.0:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "eth:0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
      values.$pastUpgrades.4.2.0:
-        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
+        "eth:0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
      values.$pastUpgrades.5.2.0:
-        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
+        "eth:0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
      values.$pastUpgrades.6.2.0:
-        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
+        "eth:0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
      values.$pastUpgrades.7.2.0:
-        "0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
+        "eth:0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
      values.addressManager:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      values.impl:
-        "0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
+        "eth:0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
      values.owner:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab:
-        "ERC1967Proxy"
      implementationNames.0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63:
-        "MainnetERC20Vault"
      implementationNames.eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab:
+        "ERC1967Proxy"
      implementationNames.eth:0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63:
+        "MainnetERC20Vault"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      address:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a"
+        "eth:0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a"
      values.$members.1:
-        "0x0aED2375549D1115e180bd0caea829C429Ea50B3"
+        "eth:0x0aED2375549D1115e180bd0caea829C429Ea50B3"
      values.$members.2:
-        "0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
+        "eth:0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
      values.$members.3:
-        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
+        "eth:0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
      values.$members.4:
-        "0x7Cdd1c128Cd72dd252f569eeD942735330937F91"
+        "eth:0x7Cdd1c128Cd72dd252f569eeD942735330937F91"
      values.$members.5:
-        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
+        "eth:0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
      implementationNames.0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F:
-        "GnosisSafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F:
+        "GnosisSafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract DAO (0x9CDf589C941ee81D75F34d3755671d614f7cf261) {
    +++ description: The main contract of the Aragon-based DAO governance framework.
      address:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x52Af16664155608b845BE18aa29620EbF6eA2D3a"
+        "eth:0x52Af16664155608b845BE18aa29620EbF6eA2D3a"
      values.$pastUpgrades.0.2.0:
-        "0x52Af16664155608b845BE18aa29620EbF6eA2D3a"
+        "eth:0x52Af16664155608b845BE18aa29620EbF6eA2D3a"
      values.getTrustedForwarder:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.signatureValidator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x9CDf589C941ee81D75F34d3755671d614f7cf261:
-        "ERC1967Proxy"
      implementationNames.0x52Af16664155608b845BE18aa29620EbF6eA2D3a:
-        "DAO"
      implementationNames.eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261:
+        "ERC1967Proxy"
      implementationNames.eth:0x52Af16664155608b845BE18aa29620EbF6eA2D3a:
+        "DAO"
    }
```

```diff
    contract MainnetSignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.
      address:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      values.$admin:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation:
-        "0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
+        "eth:0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
      values.$pastUpgrades.0.2.0:
-        "0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"
+        "eth:0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"
      values.$pastUpgrades.1.2.0:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "eth:0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      values.$pastUpgrades.2.2.0:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "eth:0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
      values.$pastUpgrades.3.2.0:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "eth:0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      values.$pastUpgrades.4.2.0:
-        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
+        "eth:0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
      values.$pastUpgrades.5.2.0:
-        "0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
+        "eth:0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
      values.$pastUpgrades.6.2.0:
-        "0x0783Ee019C9b0f918A741469bD488A88827b3617"
+        "eth:0x0783Ee019C9b0f918A741469bD488A88827b3617"
      values.$pastUpgrades.7.2.0:
-        "0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
+        "eth:0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
      values.impl:
-        "0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
+        "eth:0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
      values.owner:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      implementationNames.0x9e0a24964e5397B566c1ed39258e21aB5E35C77C:
-        "ERC1967Proxy"
      implementationNames.0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c:
-        "MainnetSignalService"
      implementationNames.eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C:
+        "ERC1967Proxy"
      implementationNames.eth:0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c:
+        "MainnetSignalService"
    }
```

```diff
    contract SgxVerifier (0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136) {
    +++ description: Verifier contract for SGX proven blocks.
      address:
-        "0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
+        "eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5"
+        "eth:0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5"
      values.$pastUpgrades.0.2.0:
-        "0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5"
+        "eth:0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5"
      values.automataDcapAttestation:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      values.impl:
-        "0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5"
+        "eth:0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.taikoInbox:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.taikoProofVerifier:
-        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      implementationNames.0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136:
-        "ERC1967Proxy"
      implementationNames.0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5:
-        "SgxVerifier"
      implementationNames.eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136:
+        "ERC1967Proxy"
      implementationNames.eth:0x8ADDcf5d4CD7BD9dA1CE62eF84AeE22c9E2BfbA5:
+        "SgxVerifier"
    }
```

```diff
    contract TaikoWrapper (0x9F9D2fC7abe74C79f86F0D1212107692430eef72) {
    +++ description: Entry point for proposing blocks. It enforces the inclusion of forced transactions after their deadline.
      address:
-        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
+        "eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
      values.$pastUpgrades.0.2.0:
-        "0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
+        "eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
      values.forcedInclusionStore:
-        "0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
+        "eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      values.impl:
-        "0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
+        "eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b"
      values.inbox:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.preconfRouter:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x9F9D2fC7abe74C79f86F0D1212107692430eef72:
-        "ERC1967Proxy"
      implementationNames.0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b:
-        "TaikoWrapper"
      implementationNames.eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72:
+        "ERC1967Proxy"
      implementationNames.eth:0xAdBa78120E85Add0dBD2050dBA0548CEDA81A31b:
+        "TaikoWrapper"
    }
```

```diff
    contract Toni Wahrstätter (0xa384E224A3F3D664F43eBE33395eF0DCcE67e894) {
    +++ description: None
      address:
-        "0xa384E224A3F3D664F43eBE33395eF0DCcE67e894"
+        "eth:0xa384E224A3F3D664F43eBE33395eF0DCcE67e894"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xd0d756A346105511bc59726c82c7Fd2e3Fe69e3F"
+        "eth:0xd0d756A346105511bc59726c82c7Fd2e3Fe69e3F"
      values.$members.1:
-        "0x93533a3511E9b0d5c17b1CBD0e1737781DEf61a6"
+        "eth:0x93533a3511E9b0d5c17b1CBD0e1737781DEf61a6"
      implementationNames.0xa384E224A3F3D664F43eBE33395eF0DCcE67e894:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xa384E224A3F3D664F43eBE33395eF0DCcE67e894:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract VerifierGateway (0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1) {
    +++ description: Gateway contract for the multi-proof system. It redirects proof to the appropriate verifier based on the proof type.
      address:
-        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9"
+        "eth:0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9"
      values.$pastUpgrades.0.2.0:
-        "0xEbB8De866727984Ee3a364079f83177FE6d6e288"
+        "eth:0xEbB8De866727984Ee3a364079f83177FE6d6e288"
      values.$pastUpgrades.1.2.0:
-        "0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9"
+        "eth:0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9"
      values.impl:
-        "0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9"
+        "eth:0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9"
      values.opVerifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.risc0RethVerifier:
-        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      values.sgxGethVerifier:
-        "0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      values.sgxRethVerifier:
-        "0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
+        "eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      values.sp1RethVerifier:
-        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      values.taikoInbox:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.tdxGethVerifier:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1:
-        "ERC1967Proxy"
      implementationNames.0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9:
-        "MainnetVerifier"
      implementationNames.eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1:
+        "ERC1967Proxy"
      implementationNames.eth:0x8C520BB75590deaBC30c4fcaFD8778A43E5481b9:
+        "MainnetVerifier"
    }
```

```diff
    contract Aragon (0xb284810536C0dAB6A8e48153B58588A9B9e0F701) {
    +++ description: None
      address:
-        "0xb284810536C0dAB6A8e48153B58588A9B9e0F701"
+        "eth:0xb284810536C0dAB6A8e48153B58588A9B9e0F701"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x5811Ab14833720D743ec57BC49c9342DF66069d0"
+        "eth:0x5811Ab14833720D743ec57BC49c9342DF66069d0"
      values.$members.1:
-        "0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
+        "eth:0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
      values.$members.2:
-        "0x3ffe3F16d47A54b1C6A3f47c9E6Ff5C2C1B32859"
+        "eth:0x3ffe3F16d47A54b1C6A3f47c9E6Ff5C2C1B32859"
      implementationNames.0xb284810536C0dAB6A8e48153B58588A9B9e0F701:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xb284810536C0dAB6A8e48153B58588A9B9e0F701:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract Daniel Wang (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a) {
    +++ description: None
      address:
-        "0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
+        "eth:0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x30bc4C0Baf55A37Ccf2d626Bc592bd7715b75De2"
+        "eth:0x30bc4C0Baf55A37Ccf2d626Bc592bd7715b75De2"
      values.$members.1:
-        "0x7057A707621Fadd422f84DE94A9dF7c4F1AC595C"
+        "eth:0x7057A707621Fadd422f84DE94A9dF7c4F1AC595C"
      implementationNames.0xb47fE76aC588101BFBdA9E68F66433bA51E8029a:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xb47fE76aC588101BFBdA9E68F66433bA51E8029a:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0xB4BE8887908AA8a00A40F3a6AC28402672B83328) {
    +++ description: None
      address:
-        "0xB4BE8887908AA8a00A40F3a6AC28402672B83328"
+        "eth:0xB4BE8887908AA8a00A40F3a6AC28402672B83328"
    }
```

```diff
    EOA  (0xbBCE182D3d6ae94CF0d0BF7C83E87c01f42635B0) {
    +++ description: None
      address:
-        "0xbBCE182D3d6ae94CF0d0BF7C83E87c01f42635B0"
+        "eth:0xbBCE182D3d6ae94CF0d0BF7C83E87c01f42635B0"
    }
```

```diff
    EOA  (0xbC40317A69CB1D1aF2CBcfE32C8B7a6840Dc287a) {
    +++ description: None
      address:
-        "0xbC40317A69CB1D1aF2CBcfE32C8B7a6840Dc287a"
+        "eth:0xbC40317A69CB1D1aF2CBcfE32C8B7a6840Dc287a"
    }
```

```diff
    contract SP1VerifierGateway (0xbee1040D0Aab17AE19454384904525aE4A3602B9) {
    +++ description: Entry contract to verify batches using SP1.
      address:
-        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
+        "eth:0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
      values.$pastUpgrades.0.2.0:
-        "0x35f26e14D0dAeDd1904843370f761C60B891D466"
+        "eth:0x35f26e14D0dAeDd1904843370f761C60B891D466"
      values.$pastUpgrades.1.2.0:
-        "0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
+        "eth:0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
      values.impl:
-        "0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
+        "eth:0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.sp1RemoteVerifier:
-        "0xFF5Adab685362DC4C33536a65aF5873738D1216B"
+        "eth:0xFF5Adab685362DC4C33536a65aF5873738D1216B"
      implementationNames.0xbee1040D0Aab17AE19454384904525aE4A3602B9:
-        "ERC1967Proxy"
      implementationNames.0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7:
-        "TaikoSP1Verifier"
      implementationNames.eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9:
+        "ERC1967Proxy"
      implementationNames.eth:0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7:
+        "TaikoSP1Verifier"
    }
```

```diff
    EOA  (0xBFD60Cb2313B848a2FC088d3bc1ab6BF498E1DD1) {
    +++ description: None
      address:
-        "0xBFD60Cb2313B848a2FC088d3bc1ab6BF498E1DD1"
+        "eth:0xBFD60Cb2313B848a2FC088d3bc1ab6BF498E1DD1"
    }
```

```diff
    EOA  (0xcF7017aD172a8aefBfF7e45CfaCeF5bd94701477) {
    +++ description: None
      address:
-        "0xcF7017aD172a8aefBfF7e45CfaCeF5bd94701477"
+        "eth:0xcF7017aD172a8aefBfF7e45CfaCeF5bd94701477"
    }
```

```diff
    EOA  (0xd0d756A346105511bc59726c82c7Fd2e3Fe69e3F) {
    +++ description: None
      address:
-        "0xd0d756A346105511bc59726c82c7Fd2e3Fe69e3F"
+        "eth:0xd0d756A346105511bc59726c82c7Fd2e3Fe69e3F"
    }
```

```diff
    contract Safe (0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487) {
    +++ description: None
      address:
-        "0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487"
+        "eth:0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xB4BE8887908AA8a00A40F3a6AC28402672B83328"
+        "eth:0xB4BE8887908AA8a00A40F3a6AC28402672B83328"
      values.$members.1:
-        "0x392EF0Ec3579436299E4f9b170c454995c03CE8A"
+        "eth:0x392EF0Ec3579436299E4f9b170c454995c03CE8A"
      values.$members.2:
-        "0x55792e1F0a41D3af8B6d41DFdcf24651AA80fA1e"
+        "eth:0x55792e1F0a41D3af8B6d41DFdcf24651AA80fA1e"
      values.$members.3:
-        "0x5374b2907a45a28c37caA45e06FC6eBceECAC72a"
+        "eth:0x5374b2907a45a28c37caA45e06FC6eBceECAC72a"
      implementationNames.0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract MainnetBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: Shared bridge for Taiko chains for bridged ETH.
      address:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      values.$admin:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$implementation:
-        "0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
+        "eth:0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
      values.$pastUpgrades.0.2.0:
-        "0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"
+        "eth:0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"
      values.$pastUpgrades.1.2.0:
-        "0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"
+        "eth:0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"
      values.$pastUpgrades.2.2.0:
-        "0xc71CC3B0a47149878fad337fb2ca54E546A645ba"
+        "eth:0xc71CC3B0a47149878fad337fb2ca54E546A645ba"
      values.$pastUpgrades.3.2.0:
-        "0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"
+        "eth:0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"
      values.$pastUpgrades.4.2.0:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "eth:0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
      values.$pastUpgrades.5.2.0:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "eth:0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
      values.$pastUpgrades.6.2.0:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "eth:0x3c326483EBFabCf3252205f26dF632FE83d11108"
      values.$pastUpgrades.7.2.0:
-        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
+        "eth:0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      values.$pastUpgrades.8.2.0:
-        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
+        "eth:0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
      values.$pastUpgrades.9.2.0:
-        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
+        "eth:0x01E7D369a619eF1B0E92563d8737F42C09789986"
      values.$pastUpgrades.10.2.0:
-        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
+        "eth:0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
      values.$pastUpgrades.11.2.0:
-        "0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
+        "eth:0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
      values.addressManager:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      values.impl:
-        "0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
+        "eth:0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
      values.owner:
-        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC:
-        "ERC1967Proxy"
      implementationNames.0x2705B12a971dA766A3f9321a743d61ceAD67dA2F:
-        "MainnetBridge"
      implementationNames.eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC:
+        "ERC1967Proxy"
      implementationNames.eth:0x2705B12a971dA766A3f9321a743d61ceAD67dA2F:
+        "MainnetBridge"
    }
```

```diff
    contract Multisig (0xD7dA1C25E915438720692bC55eb3a7170cA90321) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing proposals (e.g. for Security Council standard proposals).
      address:
-        "0xD7dA1C25E915438720692bC55eb3a7170cA90321"
+        "eth:0xD7dA1C25E915438720692bC55eb3a7170cA90321"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x8510d389236d7213eE9B9C38CAaBc0aD24853C25"
+        "eth:0x8510d389236d7213eE9B9C38CAaBc0aD24853C25"
      values.$pastUpgrades.0.2.0:
-        "0x8510d389236d7213eE9B9C38CAaBc0aD24853C25"
+        "eth:0x8510d389236d7213eE9B9C38CAaBc0aD24853C25"
      values.dao:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.implementation:
-        "0x8510d389236d7213eE9B9C38CAaBc0aD24853C25"
+        "eth:0x8510d389236d7213eE9B9C38CAaBc0aD24853C25"
      values.multisigSettings.signerList:
-        "0x0F95E6968EC1B28c794CF1aD99609431de5179c2"
+        "eth:0x0F95E6968EC1B28c794CF1aD99609431de5179c2"
      implementationNames.0xD7dA1C25E915438720692bC55eb3a7170cA90321:
-        "ERC1967Proxy"
      implementationNames.0x8510d389236d7213eE9B9C38CAaBc0aD24853C25:
-        "Multisig"
      implementationNames.eth:0xD7dA1C25E915438720692bC55eb3a7170cA90321:
+        "ERC1967Proxy"
      implementationNames.eth:0x8510d389236d7213eE9B9C38CAaBc0aD24853C25:
+        "Multisig"
    }
```

```diff
    EOA  (0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a) {
    +++ description: None
      address:
-        "0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a"
+        "eth:0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a"
    }
```

```diff
    EOA  (0xDFbD5490462963Cc242471913B53b034B209B32c) {
    +++ description: None
      address:
-        "0xDFbD5490462963Cc242471913B53b034B209B32c"
+        "eth:0xDFbD5490462963Cc242471913B53b034B209B32c"
    }
```

```diff
    EOA  (0xE7CBcDa9a4FEAe2bC7ca6b2B682Bc4Ae9f8B7e3B) {
    +++ description: None
      address:
-        "0xE7CBcDa9a4FEAe2bC7ca6b2B682Bc4Ae9f8B7e3B"
+        "eth:0xE7CBcDa9a4FEAe2bC7ca6b2B682Bc4Ae9f8B7e3B"
    }
```

```diff
    EOA  (0xE8Cd88fb3081EA29D1D6AeAefcb45BBDF512B39f) {
    +++ description: None
      address:
-        "0xE8Cd88fb3081EA29D1D6AeAefcb45BBDF512B39f"
+        "eth:0xE8Cd88fb3081EA29D1D6AeAefcb45BBDF512B39f"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      address:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.$implementation:
-        "0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
+        "eth:0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
      values.$pastUpgrades.0.2.0:
-        "0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"
+        "eth:0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"
      values.$pastUpgrades.1.2.0:
-        "0xF1cA1F1A068468E1dcF90dA6add185467de80943"
+        "eth:0xF1cA1F1A068468E1dcF90dA6add185467de80943"
      values.$pastUpgrades.2.2.0:
-        "0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"
+        "eth:0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"
      values.$pastUpgrades.3.2.0:
-        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
+        "eth:0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
      values.$pastUpgrades.4.2.0:
-        "0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
+        "eth:0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
      values.addressManager:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      values.impl:
-        "0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
+        "eth:0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
      values.namedAddresses.0.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.1.address:
-        "0x1670000000000000000000000000000000000005"
+        "eth:0x1670000000000000000000000000000000000005"
      values.namedAddresses.2.address:
-        "0x1670000000000000000000000000000000000001"
+        "eth:0x1670000000000000000000000000000000000001"
      values.namedAddresses.3.address:
-        "0x1670000000000000000000000000000000000002"
+        "eth:0x1670000000000000000000000000000000000002"
      values.namedAddresses.4.address:
-        "0x1670000000000000000000000000000000000003"
+        "eth:0x1670000000000000000000000000000000000003"
      values.namedAddresses.5.address:
-        "0x1670000000000000000000000000000000000004"
+        "eth:0x1670000000000000000000000000000000000004"
      values.namedAddresses.6.address:
-        "0x65666141a541423606365123Ed280AB16a09A2e1"
+        "eth:0x65666141a541423606365123Ed280AB16a09A2e1"
      values.namedAddresses.7.address:
-        "0xC3310905E2BC9Cfb198695B75EF3e5B69C6A1Bf7"
+        "eth:0xC3310905E2BC9Cfb198695B75EF3e5B69C6A1Bf7"
      values.namedAddresses.8.address:
-        "0x3c90963cFBa436400B0F9C46Aa9224cB379c2c40"
+        "eth:0x3c90963cFBa436400B0F9C46Aa9224cB379c2c40"
      values.namedAddresses.9.address:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.namedAddresses.10.address:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "eth:0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.quotaManager:
-        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
+        "eth:0x91f67118DD47d502B1f0C354D0611997B022f29E"
      implementationNames.0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa:
-        "ERC1967Proxy"
      implementationNames.0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449:
-        "MainnetSharedAddressManager"
      implementationNames.eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa:
+        "ERC1967Proxy"
      implementationNames.eth:0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449:
+        "MainnetSharedAddressManager"
    }
```

```diff
    EOA Daniel Wang Agent (0xf0A0d6Bd4aA94F53F3FB2c88488202a9E9eD2c55) {
    +++ description: None
      address:
-        "0xf0A0d6Bd4aA94F53F3FB2c88488202a9E9eD2c55"
+        "eth:0xf0A0d6Bd4aA94F53F3FB2c88488202a9E9eD2c55"
    }
```

```diff
    contract L2BEAT (0xf1cF63589A1e012F9124182c9eAa36B5333e5f06) {
    +++ description: None
      address:
-        "0xf1cF63589A1e012F9124182c9eAa36B5333e5f06"
+        "eth:0xf1cF63589A1e012F9124182c9eAa36B5333e5f06"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x3D4997AAC0834BEb5ede861c424807Aa3F29b5bB"
+        "eth:0x3D4997AAC0834BEb5ede861c424807Aa3F29b5bB"
      values.$members.1:
-        "0x6dcB04fCC1c597DAFad86e2886bE463d53CaFAdf"
+        "eth:0x6dcB04fCC1c597DAFad86e2886bE463d53CaFAdf"
      values.$members.2:
-        "0x166868E5AE72592a06056775236d2E4D64CDcCa9"
+        "eth:0x166868E5AE72592a06056775236d2E4D64CDcCa9"
      implementationNames.0xf1cF63589A1e012F9124182c9eAa36B5333e5f06:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xf1cF63589A1e012F9124182c9eAa36B5333e5f06:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract RiscZeroGroth16Verifier (0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a) {
    +++ description: Verifier contract for RISC Zero Groth16 proofs.
      address:
-        "0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
+        "eth:0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
      implementationNames.0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a:
-        "RiscZeroGroth16Verifier"
      implementationNames.eth:0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a:
+        "RiscZeroGroth16Verifier"
    }
```

```diff
    contract TaikoDAOController (0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      address:
-        "0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
+        "eth:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
      values.$admin:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.$implementation:
-        "0xd1934807041B168f383870A0d8F565aDe2DF9D7D"
+        "eth:0xd1934807041B168f383870A0d8F565aDe2DF9D7D"
      values.$pastUpgrades.0.2.0:
-        "0xd1934807041B168f383870A0d8F565aDe2DF9D7D"
+        "eth:0xd1934807041B168f383870A0d8F565aDe2DF9D7D"
      values.impl:
-        "0xd1934807041B168f383870A0d8F565aDe2DF9D7D"
+        "eth:0xd1934807041B168f383870A0d8F565aDe2DF9D7D"
      values.owner:
-        "0x9CDf589C941ee81D75F34d3755671d614f7cf261"
+        "eth:0x9CDf589C941ee81D75F34d3755671d614f7cf261"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.resolver:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3:
-        "ERC1967Proxy"
      implementationNames.0xd1934807041B168f383870A0d8F565aDe2DF9D7D:
-        "TaikoDAOController"
      implementationNames.eth:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3:
+        "ERC1967Proxy"
      implementationNames.eth:0xd1934807041B168f383870A0d8F565aDe2DF9D7D:
+        "TaikoDAOController"
    }
```

```diff
    contract SP1Verifier (0xFF5Adab685362DC4C33536a65aF5873738D1216B) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      address:
-        "0xFF5Adab685362DC4C33536a65aF5873738D1216B"
+        "eth:0xFF5Adab685362DC4C33536a65aF5873738D1216B"
      implementationNames.0xFF5Adab685362DC4C33536a65aF5873738D1216B:
-        "SP1Verifier"
      implementationNames.eth:0xFF5Adab685362DC4C33536a65aF5873738D1216B:
+        "SP1Verifier"
    }
```

```diff
+   Status: CREATED
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169)
    +++ description: Library for managing PEM certificate chains.
```

```diff
+   Status: CREATED
    contract ForcedInclusionStore (0x05d88855361808fA1d7fc28084Ef3fCa191c4e03)
    +++ description: Contract that allows users to enqueue forced transactions via L1. The system guarantees that at least one pending forced transaction from the queue will be processed every 255 batches. Individual transactions may face longer delays if the queue is extensive.
```

```diff
+   Status: CREATED
    contract TaikoL1 (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a)
    +++ description: Main contract implementing the logic for proposing and proving Taiko blocks on L1.
```

```diff
+   Status: CREATED
    contract Halborn (0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignerList (0x0F95E6968EC1B28c794CF1aD99609431de5179c2)
    +++ description: A signer list for registering agents, similar to a Multisig.
```

```diff
+   Status: CREATED
    contract AutomataDcapV3Attestation (0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261)
    +++ description: Contract managing SGX attestation certificates.
```

```diff
+   Status: CREATED
    contract Taiko Token (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800)
    +++ description: ERC20 contract implementing the TAIKO token. It defines a list of addresses designated as non-voting.
```

```diff
+   Status: CREATED
    contract Drew Van der Werff (0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyMultisig (0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd)
    +++ description: Modular Governance contract allowing for proposing, voting on and executing encrypted proposals (e.g. for Security Council emergency proposals).
```

```diff
+   Status: CREATED
    contract EncryptionRegistry (0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1)
    +++ description: A registry for signers (of the Security Council) to appoint agents to operate on their behalf. These agents can also register their encryption keys for encrypted emergency proposal support.
```

```diff
+   Status: CREATED
    contract Taiko Foundation Treasury Multisig (0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Chainbound (0x436a1075099A145417EBFc74BBaC9605e3e4f1A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9)
    +++ description: Library for verifying signatures.
```

```diff
+   Status: CREATED
    contract Nethermind (0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract ProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9)
    +++ description: An operator proxy used by the Taiko team for operating (proposing, proving) the based rollup from permissioned addresses.
```

```diff
+   Status: CREATED
    contract Risc0VerifierGateway (0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE)
    +++ description: Entry contract to verify batches using RISC Zero.
```

```diff
+   Status: CREATED
    contract TaikoDAOController (0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a)
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
```

```diff
+   Status: CREATED
    contract SgxVerifier (0x7e6409e9b6c5e2064064a6cC994f9a2e95680782)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
+   Status: CREATED
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3)
    +++ description: Contract managing SGX attestation certificates.
```

```diff
+   Status: CREATED
    contract DefaultResolver (0x8Efa01564425692d0a0838DC10E300BD310Cb43e)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract QuotaManager (0x91f67118DD47d502B1f0C354D0611997B022f29E)
    +++ description: Defines withdrawal limits per token.
```

```diff
+   Status: CREATED
    contract OptimisticTokenVotingPlugin (0x989E348275b659d36f8751ea1c10D146211650BE)
    +++ description: An optimistic governance module. Proposals pass and can be executed unless 10% of votable TAIKO veto them within 7d.
```

```diff
+   Status: CREATED
    contract MainnetERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab)
    +++ description: Shared vault for Taiko chains for bridged ERC20 tokens.
```

```diff
+   Status: CREATED
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAO (0x9CDf589C941ee81D75F34d3755671d614f7cf261)
    +++ description: The main contract of the Aragon-based DAO governance framework.
```

```diff
+   Status: CREATED
    contract MainnetSignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C)
    +++ description: The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.
```

```diff
+   Status: CREATED
    contract SgxVerifier (0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
+   Status: CREATED
    contract TaikoWrapper (0x9F9D2fC7abe74C79f86F0D1212107692430eef72)
    +++ description: Entry point for proposing blocks. It enforces the inclusion of forced transactions after their deadline.
```

```diff
+   Status: CREATED
    contract Toni Wahrstätter (0xa384E224A3F3D664F43eBE33395eF0DCcE67e894)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifierGateway (0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1)
    +++ description: Gateway contract for the multi-proof system. It redirects proof to the appropriate verifier based on the proof type.
```

```diff
+   Status: CREATED
    contract Aragon (0xb284810536C0dAB6A8e48153B58588A9B9e0F701)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Daniel Wang (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0xbee1040D0Aab17AE19454384904525aE4A3602B9)
    +++ description: Entry contract to verify batches using SP1.
```

```diff
+   Status: CREATED
    contract Safe (0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC)
    +++ description: Shared bridge for Taiko chains for bridged ETH.
```

```diff
+   Status: CREATED
    contract Multisig (0xD7dA1C25E915438720692bC55eb3a7170cA90321)
    +++ description: Modular Governance contract allowing for proposing, voting on and executing proposals (e.g. for Security Council standard proposals).
```

```diff
+   Status: CREATED
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract L2BEAT (0xf1cF63589A1e012F9124182c9eAa36B5333e5f06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a)
    +++ description: Verifier contract for RISC Zero Groth16 proofs.
```

```diff
+   Status: CREATED
    contract TaikoDAOController (0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3)
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xFF5Adab685362DC4C33536a65aF5873738D1216B)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

Generated with discovered.json: 0x5062afcf00fa337bb7de1292f0f139b61536005a

# Diff at Wed, 09 Jul 2025 16:02:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d05d4ec9af28b2df4e687d7b7676cddffcae6887 block: 22738242
- current block number: 22882688

## Description

Enclave hashes updated. Safe Multisigs upgraded to newest version.

Taiko Foundation Treasury Multisig 4/6 -> 2/3

## Watched changes

```diff
    contract AutomataDcapV3Attestation (0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261) {
    +++ description: Contract managing SGX attestation certificates.
      values.mrEnclaves.1:
+        "0x692c8624d30a327340b0dfbb67203e941175ac700d1a058c717e5269103d37e6"
    }
```

```diff
    contract Taiko Foundation Treasury Multisig (0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da) {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.$members.2:
-        "0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
      values.$members.3:
-        "0xFa92ff698D57f7B875570D9F59501812B843CD44"
      values.$members.4:
-        "0x7Cdd1c128Cd72dd252f569eeD942735330937F91"
      values.$threshold:
-        4
+        2
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "2 of 3 (67%)"
      values.VERSION:
-        "1.3.0"
+        "1.4.1"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      values.mrEnclaves.14:
+        "0x631778b0d420d2d0bba4c730b0fd74857afeefb3429371ae97ab450e40ca127e"
      values.mrEnclaves.15:
+        "0x482b06132c4306ea55bc34ff90d46532ff4151f473dbfe4d2cb2442af2ff288b"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.VERSION:
-        "1.3.0"
+        "1.4.1"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

## Source code changes

```diff
.../Taiko Foundation Treasury Multisig/Safe.sol}   | 685 ++++++++++++---------
 .../Taiko Multisig/Safe.sol}                       | 685 ++++++++++++---------
 2 files changed, 820 insertions(+), 550 deletions(-)
```

Generated with discovered.json: 0x9d79c226a38e8b7e71e666a00a7718d663d81030

# Diff at Fri, 04 Jul 2025 12:19:25 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22738242
- current block number: 22738242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22738242 (main branch discovery), not current.

```diff
    contract TaikoDAOController (0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      receivedPermissions.0.from:
-        "ethereum:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "eth:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.1.from:
-        "ethereum:0x91f67118DD47d502B1f0C354D0611997B022f29E"
+        "eth:0x91f67118DD47d502B1f0C354D0611997B022f29E"
      receivedPermissions.2.from:
-        "ethereum:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "eth:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.3.from:
-        "ethereum:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "eth:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.4.from:
-        "ethereum:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "eth:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      receivedPermissions.1.from:
-        "ethereum:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
+        "eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      receivedPermissions.2.from:
-        "ethereum:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      receivedPermissions.3.from:
-        "ethereum:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      receivedPermissions.4.from:
-        "ethereum:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.5.from:
-        "ethereum:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.6.from:
-        "ethereum:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
+        "eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      receivedPermissions.7.from:
-        "ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.8.from:
-        "ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.9.from:
-        "ethereum:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
+        "eth:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      receivedPermissions.10.from:
-        "ethereum:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "eth:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      receivedPermissions.11.from:
-        "ethereum:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      receivedPermissions.12.from:
-        "ethereum:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
+        "eth:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      receivedPermissions.13.from:
-        "ethereum:0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "eth:0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.14.from:
-        "ethereum:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "eth:0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      receivedPermissions.15.from:
-        "ethereum:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "eth:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      receivedPermissions.16.from:
-        "ethereum:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "eth:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.17.from:
-        "ethereum:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "eth:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.18.from:
-        "ethereum:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
+        "eth:0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      receivedPermissions.19.from:
-        "ethereum:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "eth:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      receivedPermissions.20.from:
-        "ethereum:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "eth:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      receivedPermissions.21.from:
-        "ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "eth:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.22.from:
-        "ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "eth:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
    }
```

```diff
    contract DAO (0x9CDf589C941ee81D75F34d3755671d614f7cf261) {
    +++ description: The main contract of the Aragon-based DAO governance framework.
      receivedPermissions.0.from:
-        "ethereum:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
+        "eth:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      receivedPermissions.1.from:
-        "ethereum:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
+        "eth:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
    }
```

Generated with discovered.json: 0x375f6b8891b6a923cdfe2360c4becc0eb11bc870

# Diff at Thu, 19 Jun 2025 11:31:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5c484ae81a750a81728eec4c46d10685ad38407 block: 22731123
- current block number: 22738242

## Description

Some core upgrade permissions transferred to DAOController.

## Watched changes

```diff
    contract TaikoDAOController (0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      receivedPermissions.4:
+        {"permission":"upgrade","from":"ethereum:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin"}
      receivedPermissions.3:
+        {"permission":"upgrade","from":"ethereum:0x91f67118DD47d502B1f0C354D0611997B022f29E","role":"admin"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"ethereum:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","role":"admin"}
      receivedPermissions.1.from:
-        "ethereum:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "ethereum:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.0.from:
-        "ethereum:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "ethereum:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
    }
```

```diff
    contract QuotaManager (0x91f67118DD47d502B1f0C354D0611997B022f29E) {
    +++ description: Defines withdrawal limits per token.
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.25:
-        {"permission":"upgrade","from":"ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin"}
      receivedPermissions.24:
-        {"permission":"upgrade","from":"ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9","role":"admin"}
      receivedPermissions.23:
-        {"permission":"upgrade","from":"ethereum:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03","role":"admin"}
      receivedPermissions.22.from:
-        "ethereum:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.21.from:
-        "ethereum:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.20.from:
-        "ethereum:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "ethereum:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      receivedPermissions.19.from:
-        "ethereum:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "ethereum:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      receivedPermissions.18.from:
-        "ethereum:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "ethereum:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.17.from:
-        "ethereum:0x91f67118DD47d502B1f0C354D0611997B022f29E"
+        "ethereum:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      receivedPermissions.16.from:
-        "ethereum:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "ethereum:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.15.from:
-        "ethereum:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "ethereum:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      receivedPermissions.14.from:
-        "ethereum:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
+        "ethereum:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      receivedPermissions.13.from:
-        "ethereum:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "ethereum:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      receivedPermissions.12.from:
-        "ethereum:0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "ethereum:0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
    }
```

```diff
    contract MainnetSignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract MainnetBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: Shared bridge for Taiko chains for bridged ETH.
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

Generated with discovered.json: 0xb379b39a31df47264ec84c5407bcab9f94fa8c98

# Diff at Wed, 18 Jun 2025 11:39:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22694475
- current block number: 22731123

## Description

New test proposal (no actions, will be vetoed).

## Watched changes

```diff
    contract OptimisticTokenVotingPlugin (0x989E348275b659d36f8751ea1c10D146211650BE) {
    +++ description: An optimistic governance module. Proposals pass and can be executed unless 10% of votable TAIKO veto them within 7d.
      values.proposalCount:
-        19
+        20
      values.proposalIds.19:
+        "594516471058441525137805458817300690127055486982"
      values.proposalIds.18:
-        "594516471058441525137805458817300690127055486982"
+        "594368007222883387369940600290236287695678603267"
      values.proposalIds.17:
-        "594368007222883387369940600290236287695678603267"
+        "594789857995414210150628315872956409027640688649"
      values.proposalIds.16:
-        "594789857995414210150628315872956409027640688649"
+        "595223436259438596154551751121806216745162113041"
      values.proposalIds.15:
-        "595223436259438596154551751121806216745162113041"
+        "595223403592331371744459256866956472219296858128"
      values.proposalIds.14:
-        "595223403592331371744459256866956472219296858128"
+        "594333890512775894079591912881534348495153004546"
      values.proposalIds.13:
-        "594333890512775894079591912881534348495153004546"
+        "595517191137765700860044776076277647522733752339"
    }
```

```diff
    contract Multisig (0xD7dA1C25E915438720692bC55eb3a7170cA90321) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing proposals (e.g. for Security Council standard proposals).
      values.proposalCount:
-        10
+        11
    }
```

Generated with discovered.json: 0xbdc90e6d9c07377b6e510bfc21a5ed4f0d87fdf1

# Diff at Fri, 13 Jun 2025 08:40:49 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@47036f369616cc0b23ec8b94f0706f5c105ac1f5 block: 22666471
- current block number: 22694475

## Description

Risc0 verifier update (gateway and groth16 verifier changes are minimal).

## Watched changes

```diff
-   Status: DELETED
    contract RiscZeroGroth16Verifier (0x48E32eFbe22e180A3FFe617f4955cD83B983dd98)
    +++ description: Verifier contract for RISC Zero Groth16 proofs.
```

```diff
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.namedAddresses.13.name:
-        "0x72697363305f67726f746831365f766572696669657200000000000000000000"
+        "bond_token"
      values.namedAddresses.13.address:
-        "0x48E32eFbe22e180A3FFe617f4955cD83B983dd98"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.12.name:
-        "bond_token"
+        "0x7370315f72656d6f74655f766572696669657200000000000000000000000000"
      values.namedAddresses.12.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0xFF5Adab685362DC4C33536a65aF5873738D1216B"
      values.namedAddresses.11.name:
-        "0x7370315f72656d6f74655f766572696669657200000000000000000000000000"
+        "taiko_token"
      values.namedAddresses.11.address:
-        "0xFF5Adab685362DC4C33536a65aF5873738D1216B"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.10.name:
-        "taiko_token"
+        "0x6175746f6d6174615f646361705f6174746573746174696f6e00000000000000"
      values.namedAddresses.10.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      values.namedAddresses.9.name:
-        "0x6175746f6d6174615f646361705f6174746573746174696f6e00000000000000"
+        "0x72697363305f726574685f766572696669657200000000000000000000000000"
      values.namedAddresses.9.address:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      values.namedAddresses.8.name:
-        "0x72697363305f726574685f766572696669657200000000000000000000000000"
+        "bridge"
      values.namedAddresses.8.address:
-        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      values.namedAddresses.7.name:
-        "bridge"
+        "0x72697363305f67726f746831365f766572696669657200000000000000000000"
      values.namedAddresses.7.address:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
    }
```

```diff
    contract Risc0VerifierGateway (0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE) {
    +++ description: Entry contract to verify batches using RISC Zero.
      sourceHashes.1:
-        "0xd24723da846efa982924d892e9d3e52d38b6d85eab9d8e2f0a298ff07d18d994"
+        "0xbf2f7f196a5a1b3990b49d6d86c282eedd22259e4e1c970138b25b38cced4ac6"
      values.$implementation:
-        "0x801878e56A8DA58d6a837006345CDD11a9E6a852"
+        "0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
      values.$pastUpgrades.1:
+        ["2025-05-15T00:25:59.000Z","0x2c106efd4e844195ff8597792c0e87d8319c23b5f4b6f675f878d75181c27baa",["0x801878e56A8DA58d6a837006345CDD11a9E6a852"]]
      values.$pastUpgrades.0.2:
-        ["0x801878e56A8DA58d6a837006345CDD11a9E6a852"]
+        "2025-06-12T03:50:35.000Z"
      values.$pastUpgrades.0.1:
-        "0x2c106efd4e844195ff8597792c0e87d8319c23b5f4b6f675f878d75181c27baa"
+        "0x2b9250ebdcf10b1a1ec658e5cc9e7fd9aa19dd32573e6ab5bc036499682dea3a"
      values.$pastUpgrades.0.0:
-        "2025-05-15T00:25:59.000Z"
+        ["0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"]
      values.$upgradeCount:
-        1
+        2
      values.impl:
-        "0x801878e56A8DA58d6a837006345CDD11a9E6a852"
+        "0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be"
      values.riscoGroth16Verifier:
-        "0x48E32eFbe22e180A3FFe617f4955cD83B983dd98"
+        "0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a"
      implementationNames.0x801878e56A8DA58d6a837006345CDD11a9E6a852:
-        "Risc0Verifier"
      implementationNames.0xB1c6fF8dCbED16FE412291E7BDA0d611405944Be:
+        "TaikoRisc0Verifier"
    }
```

```diff
    contract TaikoDAOController (0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      receivedPermissions.1:
+        {"permission":"upgrade","from":"ethereum:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin"}
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      values.mrEnclaves.13:
+        "0xb09f9005e4612526e378466b5c16ab6028478e81c085812d6ed37166c4cda10e"
      values.mrEnclaves.12:
+        "0x6e43c1d575b5b785d0f6259dfac44998c6f0c164864f9f98270fb740c14eb943"
    }
```

```diff
    contract MainnetERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: Shared vault for Taiko chains for bridged ERC20 tokens.
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.26:
-        {"permission":"upgrade","from":"ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin"}
      receivedPermissions.25.from:
-        "ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.24.from:
-        "ethereum:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
+        "ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.23.from:
-        "ethereum:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "ethereum:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      receivedPermissions.22.from:
-        "ethereum:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "ethereum:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
    }
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0xfB3Ca570A5348FD101e65303eECdB5Bf43C5548a)
    +++ description: Verifier contract for RISC Zero Groth16 proofs.
```

## Source code changes

```diff
.../Risc0VerifierGateway/TaikoRisc0Verifier.sol}   | 80 ++--------------------
 .../RiscZeroGroth16Verifier.sol                    |  4 +-
 2 files changed, 8 insertions(+), 76 deletions(-)
```

Generated with discovered.json: 0xa09e2062598ded8a0f11be8153bf99e8073b6d56

# Diff at Mon, 09 Jun 2025 10:52:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 22630425
- current block number: 22666471

## Description

New daocontroller for the TAIKO token, which is now controlled by the DAO.

## Watched changes

```diff
    contract Taiko Token (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: ERC20 contract implementing the TAIKO token. It defines a list of addresses designated as non-voting.
      values.$admin:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
      values.owner:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
+        "0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract OptimisticTokenVotingPlugin (0x989E348275b659d36f8751ea1c10D146211650BE) {
    +++ description: An optimistic governance module. Proposals pass and can be executed unless 10% of votable TAIKO veto them within 7d.
      values.proposalCount:
-        14
+        19
      values.proposalIds.18:
+        "594516471058441525137805458817300690127055486982"
      values.proposalIds.17:
+        "594368007222883387369940600290236287695678603267"
      values.proposalIds.16:
+        "594789857995414210150628315872956409027640688649"
      values.proposalIds.15:
+        "595223436259438596154551751121806216745162113041"
      values.proposalIds.14:
+        "595223403592331371744459256866956472219296858128"
      values.proposalIds.13:
-        "594516471058441525137805458817300690127055486982"
+        "594333890512775894079591912881534348495153004546"
      values.proposalIds.12:
-        "594368007222883387369940600290236287695678603267"
+        "594544283016854707280302755040001935835586887687"
      values.proposalIds.11:
-        "594789857995414210150628315872956409027640688649"
+        "594516360806954642753743290707182802352260251653"
      values.proposalIds.10:
-        "594333890512775894079591912881534348495153004546"
+        "594868197801926748603689506985812031612995502090"
      values.proposalIds.9:
-        "594544283016854707280302755040001935835586887687"
+        "594516275055798178677248899489514254466604335108"
      values.proposalIds.8:
-        "594516360806954642753743290707182802352260251653"
+        "594544466769332844587073035223531748793578946568"
      values.proposalIds.7:
-        "594868197801926748603689506985812031612995502090"
+        "595202819231391590334926314529761202858453106703"
      values.proposalIds.6:
-        "594516275055798178677248899489514254466604335108"
+        "595112788683881116119978678391417950963358498829"
      values.proposalIds.5:
-        "594544466769332844587073035223531748793578946568"
+        "594932801089851422612858457733038049577270247436"
      values.proposalIds.4:
-        "595112788683881116119978678391417950963358498829"
+        "594333808845007833054360677244409987180489867265"
      values.proposalIds.3:
-        "594932801089851422612858457733038049577270247436"
+        "594318504305273196926027118847304676812617940992"
      values.proposalIds.2:
-        "594333808845007833054360677244409987180489867265"
+        "594868769476303175780308156445682560815637463051"
      values.proposalIds.1:
-        "594318504305273196926027118847304676812617940992"
+        "595168678020953678736974786657474616653076496398"
      values.proposalIds.0:
-        "594868769476303175780308156445682560815637463051"
+        "595300306046126036153418824792663965561388007442"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.27:
-        {"permission":"upgrade","from":"ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","role":"admin"}
      receivedPermissions.26.from:
-        "ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "ethereum:0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.25.from:
-        "ethereum:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
+        "ethereum:0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.24.from:
-        "ethereum:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "ethereum:0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      receivedPermissions.23.from:
-        "ethereum:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "ethereum:0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      receivedPermissions.22.from:
-        "ethereum:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "ethereum:0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.21.from:
-        "ethereum:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "ethereum:0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.20.from:
-        "ethereum:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "ethereum:0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      receivedPermissions.19.from:
-        "ethereum:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "ethereum:0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.18.from:
-        "ethereum:0x91f67118DD47d502B1f0C354D0611997B022f29E"
+        "ethereum:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      receivedPermissions.17.from:
-        "ethereum:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "ethereum:0x91f67118DD47d502B1f0C354D0611997B022f29E"
      receivedPermissions.16.from:
-        "ethereum:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "ethereum:0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      receivedPermissions.15.from:
-        "ethereum:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
+        "ethereum:0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.14.from:
-        "ethereum:0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "ethereum:0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
    }
```

```diff
    contract DAO (0x9CDf589C941ee81D75F34d3755671d614f7cf261) {
    +++ description: The main contract of the Aragon-based DAO governance framework.
      receivedPermissions.1:
+        {"permission":"upgrade","from":"ethereum:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3","role":"admin"}
      receivedPermissions.0.from:
-        "ethereum:0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
+        "ethereum:0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a"
    }
```

```diff
    contract Multisig (0xD7dA1C25E915438720692bC55eb3a7170cA90321) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing proposals (e.g. for Security Council standard proposals).
      values.proposalCount:
-        9
+        10
    }
```

```diff
+   Status: CREATED
    contract TaikoDAOController (0x75Ba76403b13b26AD1beC70D6eE937314eeaCD0a)
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
```

## Source code changes

```diff
.../ERC1967Proxy.p.sol                             |    0
 .../TaikoDAOController.sol                         | 1409 ++++++++++++++++++++
 .../ERC1967Proxy.p.sol                             |  594 +++++++++
 .../TaikoDAOController.sol                         |    0
 4 files changed, 2003 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22630425 (main branch discovery), not current.

```diff
    contract TaikoDAOController (0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3) {
    +++ description: Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum.
      description:
-        "Contract that maintains ownership of all contracts and assets, owned by the DAO. Its token weight does not count towards the DAO quorum."
+        "Contract that maintains ownership DAO-controlled assets and contracts. Its token weight does not count towards the DAO quorum."
    }
```

Generated with discovered.json: 0x9ce400284a479aa2af9b01856e428c1b2a4b6c51

# Diff at Fri, 06 Jun 2025 07:27:54 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1eba1823c240619119cd080ff8cbb757c1c3feda block: 22630425
- current block number: 22630425

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22630425 (main branch discovery), not current.

```diff
    contract SP1Verifier (0xFF5Adab685362DC4C33536a65aF5873738D1216B) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      description:
-        "Verifier contract for SP1 proofs."
+        "Verifier contract for SP1 proofs (v5.0.0)."
    }
```

Generated with discovered.json: 0x23992b35ffbf24a03ab26b97c00cb66f078a728a

# Diff at Wed, 04 Jun 2025 13:52:34 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 22616262
- current block number: 22630425

## Description

SP1 verifier upgrade to v5 (plonky3 vuln related). Security Council signer removed (internal test signer). The DAO/SC is now in prod configuration, but hasn't got any critical permissions yet.

## Watched changes

```diff
    contract SignerList (0x0F95E6968EC1B28c794CF1aD99609431de5179c2) {
    +++ description: A signer list for registering agents, similar to a Multisig.
      values.addresslistLength:
-        9
+        8
      values.getEncryptionAgents.8:
-        "0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
      values.getEncryptionAgents.7:
-        "0x1d955983044548E03DAA583B36A37cA4bdE6F556"
+        "0x824Dce8d292a393DAb5FFdeb788DC1086257f678"
      values.getEncryptionAgents.6:
-        "0x85f21919ed6046d7CE1F36a613eBA8f5EaC3d070"
+        "0x1d955983044548E03DAA583B36A37cA4bdE6F556"
      values.settings.minSignerListLength:
-        9
+        8
    }
```

```diff
    contract EmergencyMultisig (0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing encrypted proposals (e.g. for Security Council emergency proposals).
+++ description: The total count of encrypted emergency proposals created.
      values.proposalCount:
-        21
+        23
    }
```

```diff
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.namedAddresses.11.name:
-        "taiko_token"
+        "0x7370315f72656d6f74655f766572696669657200000000000000000000000000"
      values.namedAddresses.11.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0xFF5Adab685362DC4C33536a65aF5873738D1216B"
      values.namedAddresses.10.name:
-        "0x7370315f72656d6f74655f766572696669657200000000000000000000000000"
+        "taiko_token"
      values.namedAddresses.10.address:
-        "0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371)
    +++ description: Verifier contract for SP1 proofs.
```

```diff
    contract OptimisticTokenVotingPlugin (0x989E348275b659d36f8751ea1c10D146211650BE) {
    +++ description: An optimistic governance module. Proposals pass and can be executed unless 10% of votable TAIKO veto them within 7d.
      values.proposalCount:
-        13
+        14
      values.proposalIds.13:
+        "594516471058441525137805458817300690127055486982"
      values.proposalIds.12:
-        "594516471058441525137805458817300690127055486982"
+        "594368007222883387369940600290236287695678603267"
      values.proposalIds.11:
-        "594368007222883387369940600290236287695678603267"
+        "594789857995414210150628315872956409027640688649"
      values.proposalIds.10:
-        "594789857995414210150628315872956409027640688649"
+        "594333890512775894079591912881534348495153004546"
      values.proposalIds.9:
-        "594333890512775894079591912881534348495153004546"
+        "594544283016854707280302755040001935835586887687"
      values.proposalIds.8:
-        "594544283016854707280302755040001935835586887687"
+        "594516360806954642753743290707182802352260251653"
      values.proposalIds.7:
-        "594516360806954642753743290707182802352260251653"
+        "594868197801926748603689506985812031612995502090"
      values.proposalIds.6:
-        "594868197801926748603689506985812031612995502090"
+        "594516275055798178677248899489514254466604335108"
      values.proposalIds.5:
-        "594516275055798178677248899489514254466604335108"
+        "594544466769332844587073035223531748793578946568"
      values.proposalIds.4:
-        "594544466769332844587073035223531748793578946568"
+        "595112788683881116119978678391417950963358498829"
    }
```

```diff
    contract SP1VerifierGateway (0xbee1040D0Aab17AE19454384904525aE4A3602B9) {
    +++ description: Entry contract to verify batches using SP1.
      sourceHashes.1:
-        "0x5ae248a45849f9700bac9ab8fbd1570be72258e51c738511f3468f788e1127ca"
+        "0x21ba9895a752c42c9a52b397fdc8ee7c4c22e621273f53176f80c853e2502ca0"
      values.$implementation:
-        "0x35f26e14D0dAeDd1904843370f761C60B891D466"
+        "0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
      values.$pastUpgrades.1:
+        ["2025-06-04T00:40:23.000Z","0xbdc86ada3808a5987cd1f4bbc49ecd2d7e577bf90642956442a3d14cffa827ec",["0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"]]
      values.$upgradeCount:
-        1
+        2
      values.impl:
-        "0x35f26e14D0dAeDd1904843370f761C60B891D466"
+        "0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7"
      values.sp1RemoteVerifier:
-        "0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371"
+        "0xFF5Adab685362DC4C33536a65aF5873738D1216B"
      implementationNames.0x35f26e14D0dAeDd1904843370f761C60B891D466:
-        "SP1Verifier"
      implementationNames.0x2E17aC86CafC1db939C9942E478F92bF0E548Ee7:
+        "TaikoSP1Verifier"
    }
```

```diff
    contract Multisig (0xD7dA1C25E915438720692bC55eb3a7170cA90321) {
    +++ description: Modular Governance contract allowing for proposing, voting on and executing proposals (e.g. for Security Council standard proposals).
      values.proposalCount:
-        6
+        9
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xFF5Adab685362DC4C33536a65aF5873738D1216B)
    +++ description: Verifier contract for SP1 proofs.
```

## Source code changes

```diff
.../{.flat@22616262 => .flat}/SP1Verifier.sol      | 2682 ++++++++++----------
 .../SP1VerifierGateway/TaikoSP1Verifier.sol}       |   75 +-
 2 files changed, 1329 insertions(+), 1428 deletions(-)
```

Generated with discovered.json: 0x287517d33b3633841ff8cdced485ab5de6e0e5d0

# Diff at Mon, 02 Jun 2025 10:17:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22595405
- current block number: 22616262

## Description

add labs prover proxy template, add to initial addresses.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22595405 (main branch discovery), not current.

```diff
    contract ProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: An operator proxy used by the Taiko team for operating (proposing, proving) the based rollup from permissioned addresses.
      template:
+        "taiko/ProverSet"
      description:
+        "An operator proxy used by the Taiko team for operating (proposing, proving) the based rollup from permissioned addresses."
    }
```

Generated with discovered.json: 0x3b97d3b6d2abbe01b8e7fc47f5297e091a1fc8bb

# Diff at Fri, 30 May 2025 14:28:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e500d5a1007dd6ae5f41140c749d1328c37f401 block: 22595179
- current block number: 22595405

## Description

Add DAO and SC related contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22595179 (main branch discovery), not current.

```diff
    contract DAO (0x9CDf589C941ee81D75F34d3755671d614f7cf261) {
    +++ description: The main contract of the Aragon-based DAO governance framework.
      description:
-        "The entry point to the DAO Aragon-based governance framework."
+        "The main contract of the Aragon-based DAO governance framework."
    }
```

```diff
+   Status: CREATED
    contract Halborn (0x0F40268Ec0Dc8D88CF2f22E227A29a0b478b6351)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignerList (0x0F95E6968EC1B28c794CF1aD99609431de5179c2)
    +++ description: A signer list for registering agents, similar to a Multisig.
```

```diff
+   Status: CREATED
    contract Drew Van der Werff (0x25d3E89bAcE2040Ed3aF7c4c7B505cfBB72fD6f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyMultisig (0x2AffADEb2ef5e1F2a7F58964ee191F1e88317ECd)
    +++ description: Modular Governance contract allowing for proposing, voting on and executing encrypted proposals (e.g. for Security Council emergency proposals).
```

```diff
+   Status: CREATED
    contract EncryptionRegistry (0x2eFDb93a3B87b930E553d504db67Ee41c69C42d1)
    +++ description: A registry for signers (of the Security Council) to appoint agents to operate on their behalf. These agents can also register their encryption keys for encrypted emergency proposal support.
```

```diff
+   Status: CREATED
    contract Chainbound (0x436a1075099A145417EBFc74BBaC9605e3e4f1A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Nethermind (0x5353c607e6eca6C63FEC5c6C0F5CC3a5348d5c95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticTokenVotingPlugin (0x989E348275b659d36f8751ea1c10D146211650BE)
    +++ description: An optimistic governance module. Proposals pass and can be executed unless 10% of votable TAIKO veto them within 7d.
```

```diff
+   Status: CREATED
    contract Toni Wahrstätter (0xa384E224A3F3D664F43eBE33395eF0DCcE67e894)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Aragon (0xb284810536C0dAB6A8e48153B58588A9B9e0F701)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Daniel Wang (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xD5cF6A34Ba5fb9289510dC93c03F1f9084798487)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig (0xD7dA1C25E915438720692bC55eb3a7170cA90321)
    +++ description: Modular Governance contract allowing for proposing, voting on and executing proposals (e.g. for Security Council standard proposals).
```

```diff
+   Status: CREATED
    contract L2BEAT (0xf1cF63589A1e012F9124182c9eAa36B5333e5f06)
    +++ description: None
```

Generated with discovered.json: 0x47b22217bef062e9e7b46eb0b1ea339c1a6ab960

# Diff at Fri, 30 May 2025 11:13:55 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@80c24ef6a6e17335dc2761caff762cfb6f39304b block: 22579860
- current block number: 22595179

## Description

Ignore spammy batches/state values.

## Watched changes

```diff
    contract Taiko Foundation Treasury Multisig (0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da) {
    +++ description: None
      values.$members.5:
+        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
      values.$members.4:
-        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
+        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
      values.$members.3:
-        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
+        "0xFa92ff698D57f7B875570D9F59501812B843CD44"
      values.$members.2:
-        "0xFa92ff698D57f7B875570D9F59501812B843CD44"
+        "0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "4 of 6 (67%)"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.5:
+        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
      values.$members.4:
-        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
+        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
      values.$members.3:
-        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
+        "0xDC4ece5620659F4d5d1536Cab52BD5e5B15F8a0a"
      values.multisigThreshold:
-        "4 of 5 (80%)"
+        "4 of 6 (67%)"
      receivedPermissions.27:
+        {"permission":"upgrade","from":"0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin"}
      receivedPermissions.26:
+        {"permission":"upgrade","from":"0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","role":"admin"}
      receivedPermissions.25:
+        {"permission":"upgrade","from":"0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin"}
      receivedPermissions.24.from:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      receivedPermissions.23.from:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      receivedPermissions.22.from:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.21.from:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.20.from:
-        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.19.from:
-        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      receivedPermissions.18.from:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
      receivedPermissions.17.from:
-        "0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
+        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.16.from:
-        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
+        "0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      receivedPermissions.15.from:
-        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      receivedPermissions.14.from:
-        "0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
+        "0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      receivedPermissions.13.from:
-        "0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.12.from:
-        "0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
+        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      receivedPermissions.11.from:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.10.from:
-        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
+        "0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      receivedPermissions.9.from:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      receivedPermissions.8.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.8.from:
-        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
+        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.8.role:
-        "admin"
+        ".owner"
      receivedPermissions.8.description:
+        "can update the contract address for a given name"
      receivedPermissions.7.from:
-        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.7.description:
-        "can update the contract address for a given name"
+        "can update the program being verified"
      receivedPermissions.6.from:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      receivedPermissions.5.from:
-        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.5.description:
-        "can update the program being verified"
+        "can update the contract address for a given name"
      receivedPermissions.4.from:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.4.description:
-        "can update the contract address for a given name"
+        "can update the program being verified"
      receivedPermissions.3.from:
-        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
+        "0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a"
      receivedPermissions.3.description:
-        "can update the program being verified"
+        "can update the contract address for a given name"
    }
```

```diff
+   Status: CREATED
    contract DefaultResolver (0x5A982Fb1818c22744f5d7D36D0C4c9f61937b33a)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract ProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9)
    +++ description: None
```

## Source code changes

```diff
.../DefaultResolver.sol                            |    0
 .../ERC1967Proxy.p.sol                             |    0
 .../DefaultResolver.sol                            | 1428 ++++++++++++
 .../ERC1967Proxy.p.sol                             |  594 +++++
 .../ethereum/.flat/ProverSet/ERC1967Proxy.p.sol    |  594 +++++
 .../taiko/ethereum/.flat/ProverSet/ProverSet.sol   | 2287 ++++++++++++++++++++
 6 files changed, 4903 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22579860 (main branch discovery), not current.

```diff
    contract ForcedInclusionStore (0x05d88855361808fA1d7fc28084Ef3fCa191c4e03) {
    +++ description: Contract that allows users to enqueue forced transactions via L1. The system guarantees that at least one pending forced transaction from the queue will be processed every 255 batches. Individual transactions may face longer delays if the queue is extensive.
      description:
-        "Contract that allows to enqueue forced transaction through L1. A pending forced transaction must be processed every 255 batches."
+        "Contract that allows users to enqueue forced transactions via L1. The system guarantees that at least one pending forced transaction from the queue will be processed every 255 batches. Individual transactions may face longer delays if the queue is extensive."
    }
```

Generated with discovered.json: 0x848b84f997bf4e9315a8bdb2dccf8e479db8ba31

# Diff at Wed, 28 May 2025 13:56:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 22579860
- current block number: 22579860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22579860 (main branch discovery), not current.

```diff
    contract Taiko Token (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: ERC20 contract implementing the TAIKO token. It defines a list of addresses designated as non-voting.
      name:
-        "TaikoToken"
+        "Taiko Token"
    }
```

Generated with discovered.json: 0x39dbd31018bfdca6cf2ff2a00524592e3782adac

# Diff at Wed, 28 May 2025 11:33:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13b95854804f5ec749939a5230d24dfeedf19d1e block: 22481930
- current block number: 22579860

## Description

Main TaikoL1 contract has been upgraded to an intermediate proxy that points to both an old and new implementation. The old implementation is also not the same as the actually previous one, but it's just add a "Pacaya" fork height that prevents proposing or proving for new blocks. The new fork compared to the new presents some simplifications, like removal of `AddressCache`, `AddressResolver`, `IAddressResolver`, `ITaikoL1`, `LibBonds`, `LibData`, `LibProposing`, `LibProving`, `LibUtils`, `LibVerifying`, `RollupAddressCache`, `SafeCastUpgradeable`, `TaikoData`, and `TaikoEvents`. The address resolving logic is still present and has been moved to the `EssentialContract` contract.

At the time of writing, calls are still forwarded to the old impl as the Pacaya fork is expected to go live on Wed 21 May. `ITaikoInbox` and `TaikoInbox` replace `ITaikoL1` and `TaikoL1`. Batches have replaced blocks, as now one batch can contain multiple blocks. Instead of `proposeBlocksV2`, the `proposeBatch` function is called to sequence blocks. An `InboxWrapper` contract has been introduced, which is referenced by the `TaikoInbox`. The `InboxWrapper` references a `ForcedInclusionStore` contract that is used to submit forced transactions. All forced transactions must pay a fee, and it's currently set to a very high value meaning that the mechanism is in practice disabled. The slowest forced transactions can be included is one by one every 255 batches, creating a potential DoS attack via spam of forced transactions. It's therefore not clear how to estimate exit windows (not that it matters rn).

The `proveBatches` function reflects the removal of tiers. The `_params` is decoded into `metas[]` (metadatas) and `trans[]` (transitions). On transition ids: when a batch is first proposed, the `nextTransitionId` is 1 and the `verifiedTransitionId` is zero. When a batch is proven for the first time, the `nextTransitionId` is incremented to 2, the proofs get verified, everything is good. The same batch can be proven again: it is checked that the new block hash and new state root also corresponds. If it does, it is treated as a no-op, if it doesn't, the block hash of the transition is set to zero, and contracts are paused. It is possible to prove a fault this way by providing a different starting point for the proving process, by providing a different `parentHash` to start from. Batches whose transitions' `blockHash` is set to zero are skipped during the `verifyBatches` call.
 
The `verifyBatches` function also reflects the removal of tiers. The main function is still to credit back bonds to the proposer, specifically the full liveness bond if the block has been proved within the proving window, or half bond if not.
 
The `verifier` is actually a multi-proof system with 4 verifiers: sp1, r0, sgx_reth and sgx_geth. A proof must contain exactly two sub-proofs targeting two different verifiers. An ordering is defined between them based on their address: r0 -> sgx_geth -> sgx_reth -> sp1. It is required that one of the verifiers used is sgx_geth. It is possible to use two TEEs to verify a block, which causes them to still be affected by our recategorization.

## Watched changes

```diff
    contract TaikoL1 (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: Main contract implementing the logic for proposing and proving Taiko blocks on L1.
      name:
-        "MainnetTaikoL1"
+        "TaikoL1"
      template:
-        "taiko/TaikoL1Contract"
+        "taiko/TaikoL1PostPacaya"
      sourceHashes.1:
-        "0x8c8d91a3b010953954bbd3ba9f4c55f76112bf6d7f298dcd584c2de94a4ad1a4"
+        "0xc4ae3ca2fcf606673a1324989a7ac169b3fdb6780917814506e56898484e99d7"
      description:
-        "This contract provides functionalities for proposing, proving, and verifying blocks."
+        "Main contract implementing the logic for proposing and proving Taiko blocks on L1."
      values.$implementation:
-        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
+        ["0x4e030b19135869F6fd926614754B7F9c184E2B83","0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264","0x497B13f9192B09244de9b5F0964830969FB26F07"]
      values.$pastUpgrades.25:
+        ["2024-11-10T16:10:23.000Z","0x5eb57ab352b3e3c1ddbc3fe468d582901b88c6a137ce49b0d70857d5218d626d",["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]]
      values.$pastUpgrades.24:
+        ["2025-05-16T02:36:23.000Z","0x78f766ae83ce94ef2293c9c7d81ae514e8fa0a79fbce1530c3c68d7624708795",["0x4e030b19135869F6fd926614754B7F9c184E2B83","0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264","0x497B13f9192B09244de9b5F0964830969FB26F07"]]
      values.$pastUpgrades.23.2:
-        "0x5eb57ab352b3e3c1ddbc3fe468d582901b88c6a137ce49b0d70857d5218d626d"
+        "0x2c455ae888a23c232bb5c7603657eda010ffadc602a74e626332bc06eaaa3b78"
      values.$pastUpgrades.23.1:
-        "2024-11-10T16:10:23.000Z"
+        "2024-06-04T06:10:11.000Z"
      values.$pastUpgrades.23.0.2:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.$pastUpgrades.22.2:
-        "0x2c455ae888a23c232bb5c7603657eda010ffadc602a74e626332bc06eaaa3b78"
+        "0x6368890b9aa2f87c6a6b727efdd8af0ea357a11460b546d8a7f3e19e38a34e41"
      values.$pastUpgrades.22.1:
-        "2024-06-04T06:10:11.000Z"
+        "2025-02-27T03:27:23.000Z"
      values.$pastUpgrades.22.0.2:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
      values.$pastUpgrades.21.2:
-        "0x6368890b9aa2f87c6a6b727efdd8af0ea357a11460b546d8a7f3e19e38a34e41"
+        "0x78ca7c7d9c7e5aa9c5e6ab80e0229289a8d3bc8df2c2b9ba6baa74a0f60a0703"
      values.$pastUpgrades.21.1:
-        "2025-02-27T03:27:23.000Z"
+        "2024-11-03T05:15:23.000Z"
      values.$pastUpgrades.21.0.2:
-        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.20.2:
-        "0x78ca7c7d9c7e5aa9c5e6ab80e0229289a8d3bc8df2c2b9ba6baa74a0f60a0703"
+        "2024-05-27T16:37:11.000Z"
      values.$pastUpgrades.20.1:
-        "2024-11-03T05:15:23.000Z"
+        "0x187cc99e9bcf2a94f723cf52d85b74b79bdb3872681e2a3808cadbbc3ba301e2"
      values.$pastUpgrades.20.0.2:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"
      values.$pastUpgrades.19.2:
-        "2024-05-27T16:37:11.000Z"
+        "0xaed098ad0c93113e401f61358f963501f40a046c5b5b659a1610f10120a9a86b"
      values.$pastUpgrades.19.1:
-        "0x187cc99e9bcf2a94f723cf52d85b74b79bdb3872681e2a3808cadbbc3ba301e2"
+        "2024-05-21T14:15:11.000Z"
      values.$pastUpgrades.19.0.2:
-        "0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"
+        "0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"
      values.$pastUpgrades.18.2:
-        "0xaed098ad0c93113e401f61358f963501f40a046c5b5b659a1610f10120a9a86b"
+        "0x77871837d1749b22a7991da475e657baa4371937f5a8cb094d4e170db000cb25"
      values.$pastUpgrades.18.1:
-        "2024-05-21T14:15:11.000Z"
+        "2024-12-24T14:19:11.000Z"
      values.$pastUpgrades.18.0.2:
-        "0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.$pastUpgrades.17.2:
-        "0x77871837d1749b22a7991da475e657baa4371937f5a8cb094d4e170db000cb25"
+        "2025-05-15T08:40:47.000Z"
      values.$pastUpgrades.17.1:
-        "2024-12-24T14:19:11.000Z"
+        ["0x5eEcd1305aC72d4a77Bf3BD734e81c15e2A2adEf","0xaA64D5A3A26D1e76AcAf6e22c199D02d58076A01","0x497B13f9192B09244de9b5F0964830969FB26F07"]
      values.$pastUpgrades.17.0:
-        ["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]
+        "0x97789b6668d0a287b1f57bb6c8e23cce62308fb887139faeb0f06b77855995fd"
      values.$upgradeCount:
-        24
+        26
      values.addressManager:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      values.assignment_hook:
-        "0x0000000000000000000000000000000000000000"
      values.automata_dcap_attestation:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      values.bond_token:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.bridge:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      values.bridge_watchdog:
-        "0x0000000000000000000000000000000000000000"
      values.bridged_erc1155:
-        "0x0000000000000000000000000000000000000000"
      values.bridged_erc20:
-        "0x0000000000000000000000000000000000000000"
      values.bridged_erc721:
-        "0x0000000000000000000000000000000000000000"
      values.chain_watchdog:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      values.erc1155_vault:
-        "0x0000000000000000000000000000000000000000"
      values.erc20_vault:
-        "0x0000000000000000000000000000000000000000"
      values.erc721_vault:
-        "0x0000000000000000000000000000000000000000"
      values.getLastSyncedBlock:
-        {"blockId_":1148703,"blockHash_":"0x5a7e198eb91f666cb2a95abeb5585a7e9485c6c4a3008f8275c34ffedc3f1031","stateRoot_":"0x775e54de208c8220b5e302d1c845c1b25cf99ed1f8807ac36e20589e3b56231d","verifiedAt_":1747209131}
      values.getLastVerifiedBlock.blockId_:
-        1148703
+        1178564
      values.getLastVerifiedBlock.blockHash_:
-        "0x5a7e198eb91f666cb2a95abeb5585a7e9485c6c4a3008f8275c34ffedc3f1031"
+        "0x30dabf999649a05a6aeb9d9e30b6a2910788dbffb4a7fcdb5ec3f49934a0e12b"
      values.getLastVerifiedBlock.stateRoot_:
-        "0x775e54de208c8220b5e302d1c845c1b25cf99ed1f8807ac36e20589e3b56231d"
+        "0x339e2ac188194e6fd6bc0e129c2232940ca5c0efd7c7015435aafae3a1cb6587"
      values.getLastVerifiedBlock.verifiedAt_:
-        1747209131
+        1738480871
      values.getStateVariables.1.genesisHeight:
-        19923613
      values.getStateVariables.1.genesisTimestamp:
-        1716358991
      values.getStateVariables.1.lastSyncedBlockId:
-        1148703
      values.getStateVariables.1.lastSynecdAt:
-        1747226267
      values.getStateVariables.1.numBlocks:
+        1178840
      values.getStateVariables.1.lastVerifiedBlockId:
+        1178564
      values.getStateVariables.1.provingPaused:
+        false
      values.getStateVariables.1.lastProposedIn:
+        22579860
      values.getStateVariables.1.lastUnpausedAt:
+        1716571955
      values.getStateVariables.0.numBlocks:
-        1149204
      values.getStateVariables.0.lastVerifiedBlockId:
-        1148703
      values.getStateVariables.0.provingPaused:
-        false
      values.getStateVariables.0.lastProposedIn:
-        22481927
      values.getStateVariables.0.lastUnpausedAt:
-        1716571955
      values.getStateVariables.0.genesisHeight:
+        19923613
      values.getStateVariables.0.genesisTimestamp:
+        1716358991
      values.getStateVariables.0.lastSyncedBlockId:
+        1178564
      values.getStateVariables.0.lastSynecdAt:
+        1748416535
      values.impl:
-        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
+        "0x4e030b19135869F6fd926614754B7F9c184E2B83"
      values.lastProposedIn:
-        22481927
+        22579860
      values.lastUnpausedAt:
-        1716571955
      values.preconf_task_manager:
-        "0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x000000633b68f5D8D3a86593ebB815b4663BCBe0"
      values.proposer_one:
-        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
      values.prover_assignment:
-        "0x0000000000000000000000000000000000000000"
      values.prover_set:
-        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
      values.proxiableUUID:
-        "EXPECT_REVERT"
      values.quota_manager:
-        "0x0000000000000000000000000000000000000000"
      values.return_liveness_bond:
-        "0x0000000000000000000000000000000000000000"
      values.sgx_watchdog:
-        "0x0000000000000000000000000000000000000000"
      values.signal_root:
-        "0x0000000000000000000000000000000000000000"
      values.signal_service:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      values.sp1_remote_verifier:
-        "0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371"
      values.state.slotA:
-        {"genesisHeight":19923613,"genesisTimestamp":1716358991,"lastSyncedBlockId":1148703,"lastSynecdAt":1747226267}
      values.state.slotB:
-        {"numBlocks":1149204,"lastVerifiedBlockId":1148703,"provingPaused":false,"lastProposedIn":22481927,"lastUnpausedAt":1716571955}
      values.state.stats1:
+        {"genesisHeight":19923613,"__reserved2":1716358991,"lastSyncedBatchId":1178564,"lastSyncedAt":1748416535}
      values.state.stats2:
+        {"numBatches":1178840,"lastVerifiedBatchId":1178564,"paused":false,"lastProposedIn":22579860,"lastUnpausedAt":1716571955}
      values.state_root:
-        "0x0000000000000000000000000000000000000000"
      values.taiko:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      values.taiko_token:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.tier_router:
-        "0x44d307a9ec47aA55a7a30849d065686753C86Db6"
      values.verifier_RISCZERO_GROTH16_VERIFIER:
-        "0x48E32eFbe22e180A3FFe617f4955cD83B983dd98"
      values.verifier_TIER_GUARDIAN:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      values.verifier_TIER_GUARDIAN_MINORITY:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      values.verifier_TIER_OPTIMISTIC:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_SGX:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      values.verifier_TIER_TDX:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_TEE_ANY:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_AND_TEE:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_ANY:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_RISC0:
-        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      values.verifier_TIER_ZKVM_SP1:
-        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      values.withdrawer:
-        "0x0000000000000000000000000000000000000000"
      values.bondToken:
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.getLastSyncedTransition:
+        {"batchId_":1178564,"blockId_":1178564,"ts_":{"parentHash":"0x7c801227fd8912dfd03b4b1f664ae228b579aa782a221a4a4569131637ab2955","blockHash":"0x30dabf999649a05a6aeb9d9e30b6a2910788dbffb4a7fcdb5ec3f49934a0e12b","stateRoot":"0x339e2ac188194e6fd6bc0e129c2232940ca5c0efd7c7015435aafae3a1cb6587","prover":"0x41F2F55571f9e8e3Ba511Adc48879Bd67626A2b6","inProvingWindow":true,"createdAt":1748406971}}
      values.getLastVerifiedTransition:
+        {"batchId_":1178564,"blockId_":1178564,"ts_":{"parentHash":"0x7c801227fd8912dfd03b4b1f664ae228b579aa782a221a4a4569131637ab2955","blockHash":"0x30dabf999649a05a6aeb9d9e30b6a2910788dbffb4a7fcdb5ec3f49934a0e12b","stateRoot":"0x339e2ac188194e6fd6bc0e129c2232940ca5c0efd7c7015435aafae3a1cb6587","prover":"0x41F2F55571f9e8e3Ba511Adc48879Bd67626A2b6","inProvingWindow":true,"createdAt":1748406971}}
      values.getStats1:
+        {"genesisHeight":19923613,"__reserved2":1716358991,"lastSyncedBatchId":1178564,"lastSyncedAt":1748416535}
      values.getStats2:
+        {"numBatches":1178840,"lastVerifiedBatchId":1178564,"paused":false,"lastProposedIn":22579860,"lastUnpausedAt":1716571955}
      values.inboxWrapper:
+        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      values.isOnL1:
+        true
      values.newFork:
+        "0x497B13f9192B09244de9b5F0964830969FB26F07"
      values.oldFork:
+        "0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264"
      values.pacayaConfig:
+        {"chainId":167000,"maxUnverifiedBatches":324000,"batchRingBufferSize":360000,"maxBatchesToVerify":16,"blockMaxGasLimit":240000000,"livenessBondBase":"125000000000000000000","livenessBondPerBlock":0,"stateRootSyncInternal":4,"maxAnchorHeightOffset":64,"baseFeeConfig":{"adjustmentQuotient":8,"sharingPctg":50,"gasIssuancePerSecond":5000000,"minGasExcess":1344899430,"maxGasIssuancePerBlock":600000000},"provingWindow":7200,"cooldownWindow":7200,"maxSignalsToReceive":16,"maxBlocksPerBatch":768,"forkHeights":{"ontake":538304,"pacaya":1166000,"shasta":0,"unzen":0}}
      values.resolver:
+        "0x0000000000000000000000000000000000000000"
      values.signalService:
+        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      values.verifier:
+        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      implementationNames.0x5110634593Ccb8072d161A7d260A409A7E74D7Ca:
-        "MainnetTaikoL1"
      implementationNames.0x4e030b19135869F6fd926614754B7F9c184E2B83:
+        "PacayaForkRouter"
      implementationNames.0x904Da4C5bD76f932fE09fF32Ae5D7E3d2A5D2264:
+        "MainnetTaikoL1"
      implementationNames.0x497B13f9192B09244de9b5F0964830969FB26F07:
+        "MainnetInbox"
      category:
-        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: ERC20 contract implementing the TAIKO token. It defines a list of addresses designated as non-voting.
      template:
-        "taiko/TaikoToken"
+        "taiko/TaikoTokenPostPacaya"
      sourceHashes.1:
-        "0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b"
+        "0x2b1eb63ab3adb1a0783bae6252816727a2fb5d150dd0e9912e0a01e4ee224be9"
      sourceHashes.0:
-        "0xea41529d3c7a5cd7651ff173711c111016d65e4345f6f60dc2af04d8ddef375f"
+        "0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b"
      description:
-        "Taiko's native token. Used for block proposal rewards, proving bonds and rewards, and contesting bonds."
+        "ERC20 contract implementing the TAIKO token. It defines a list of addresses designated as non-voting."
      values.$implementation:
-        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
+        "0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
      values.$pastUpgrades.6:
+        ["2024-05-29T08:03:23.000Z","0x56402f9fd928be890fbd29829b817faffc0780b85e83300a29962c969808cae2",["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]]
      values.$pastUpgrades.5.2:
-        "0x56402f9fd928be890fbd29829b817faffc0780b85e83300a29962c969808cae2"
+        "2024-05-11T05:46:11.000Z"
      values.$pastUpgrades.5.1.0:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"
      values.$pastUpgrades.5.0:
-        "2024-05-29T08:03:23.000Z"
+        "0x7d82794932540ed9edd259e58f6ef8ae21a49beada7f0224638f888f7149c01c"
      values.$pastUpgrades.4.2:
-        "2024-05-11T05:46:11.000Z"
+        "0x4f7a1c6ad21fbfeaecab40ea36a3845bf67e22d7770d8a259d62b995cb93cb34"
      values.$pastUpgrades.4.1.0:
-        "0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"
+        "0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"
      values.$pastUpgrades.4.0:
-        "0x7d82794932540ed9edd259e58f6ef8ae21a49beada7f0224638f888f7149c01c"
+        "2024-04-25T08:29:59.000Z"
      values.$pastUpgrades.3.2:
-        "0x4f7a1c6ad21fbfeaecab40ea36a3845bf67e22d7770d8a259d62b995cb93cb34"
+        "0xdb7d5de46738ad3f676db47b61772db531f9858b7a01e8c3b5aee49fa74cac95"
      values.$pastUpgrades.3.1.0:
-        "0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"
+        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
      values.$pastUpgrades.3.0:
-        "2024-04-25T08:29:59.000Z"
+        "2025-05-13T00:47:23.000Z"
      values.$pastUpgrades.2.2:
-        "0xdb7d5de46738ad3f676db47b61772db531f9858b7a01e8c3b5aee49fa74cac95"
+        "2024-07-02T07:15:47.000Z"
      values.$pastUpgrades.2.1.0:
-        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
+        "0xcfe803378D79d1180EbF030455040EA6513869dF"
      values.$pastUpgrades.2.0:
-        "2025-05-13T00:47:23.000Z"
+        "0xc9f468d33d8d55911e4e5b5c301ed244a5f81ab0f389d2b4f398eb5b89d417ef"
      values.$pastUpgrades.1.2:
-        "2024-07-02T07:15:47.000Z"
+        ["0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"]
      values.$pastUpgrades.1.1:
-        ["0xcfe803378D79d1180EbF030455040EA6513869dF"]
+        "2024-06-07T04:02:11.000Z"
      values.$pastUpgrades.1.0:
-        "0xc9f468d33d8d55911e4e5b5c301ed244a5f81ab0f389d2b4f398eb5b89d417ef"
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.0.2.0:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
      values.$pastUpgrades.0.1:
-        "2024-06-07T04:02:11.000Z"
+        "0x986fc2c7ae945cdd358b2f2ae54364b350026f965f5861ed470f78e145f12626"
      values.$pastUpgrades.0.0:
-        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
+        "2025-05-15T05:12:11.000Z"
      values.$upgradeCount:
-        6
+        7
      values.clock:
-        1747232111
+        1748418323
      values.getNonVotingAccounts.3:
+        "0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
      values.getNonVotingAccounts.2:
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      values.getNonVotingAccounts.1:
-        "0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
+        "0x0000000000000000000000000000000000000000"
      values.impl:
-        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
+        "0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106"
      values.proxiableUUID:
-        "EXPECT_REVERT"
      values.TAIKO_ERC20_VAULT:
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      implementationNames.0x87C752b0F70cAa237Edd7571B0845470A37DE040:
-        "TaikoToken"
      implementationNames.0x5C96Ff5B7F61b9E3436Ef04DA1377C8388dfC106:
+        "TaikoToken"
      category:
-        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
-   Status: DELETED
    contract MainnetProverSet (0x280eAbfd252f017B78e15b69580F249F45FB55Fa)
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TAIKO. There are several instances of this contract operated by different entities.
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x44d307a9ec47aA55a7a30849d065686753C86Db6)
    +++ description: Contract managing and routing the multi-tier proof system.
```

```diff
-   Status: DELETED
    contract Risc0VerifierGateway (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc)
    +++ description: Entry contract to verify batches using RISC Zero.
```

```diff
-   Status: DELETED
    contract MainnetGuardianProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c)
    +++ description: Verifier contract for blocks proven by Guardian minority.
```

```diff
-   Status: DELETED
    contract MainnetRollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780)
    +++ description: This contract manages the rollup addresses list, allowing to set the address for a specific chainId-name pair.
```

```diff
-   Status: DELETED
    contract SP1VerifierGateway (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452)
    +++ description: Entry contract to verify batches using SP1.
```

```diff
-   Status: DELETED
    contract MainnetProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9)
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TAIKO. There are several instances of this contract operated by different entities.
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      values.mrEnclaves.11:
+        "0x3f71cf178a032816c2731a43aef746c464a5326e891dc881773ec2b599b2cf0a"
      values.mrEnclaves.10:
+        "0xc90e5d2e39d1d3f8397a6048c32ba50139d1577c28985e1f7638785935f41734"
      values.mrEnclaves.9:
-        "0x3f71cf178a032816c2731a43aef746c464a5326e891dc881773ec2b599b2cf0a"
+        "0x13ea9869632ac20b176ae0fdc39998b2a644a695db024ef7fe0e4b3c59084160"
      values.mrEnclaves.8:
-        "0xc90e5d2e39d1d3f8397a6048c32ba50139d1577c28985e1f7638785935f41734"
+        "0x9546301721e2ea111ab0f79b6e529d6bb6c486ac98bcf7739429ad06c09db63d"
      values.mrEnclaves.7:
-        "0x13ea9869632ac20b176ae0fdc39998b2a644a695db024ef7fe0e4b3c59084160"
+        "0xdfcb4fca3073e3f3a90b05d328688c32619d56f26789c0a9797aa10e765a7807"
      values.mrEnclaves.6:
-        "0x9546301721e2ea111ab0f79b6e529d6bb6c486ac98bcf7739429ad06c09db63d"
+        "0xdcd483d3406d9b1871bb92420f5a080c4372e0d6b8522a4a2cb91a0f736669c6"
      values.mrEnclaves.5:
-        "0xdfcb4fca3073e3f3a90b05d328688c32619d56f26789c0a9797aa10e765a7807"
+        "0xa096348d480eb0474f5eab182671933c029545521960d87d4e49283005809be9"
      values.mrEnclaves.4:
-        "0xa096348d480eb0474f5eab182671933c029545521960d87d4e49283005809be9"
+        "0xa4eedfc6484494d4c08bfb9b9dd887c6e0540ba9d8ee207fe0e16814852e3356"
      values.mrEnclaves.3:
-        "0xa4eedfc6484494d4c08bfb9b9dd887c6e0540ba9d8ee207fe0e16814852e3356"
+        "0x3551faac39edee5abfaa19ab065c217db1485aebae255a9edddf6dfff6b29b52"
      values.mrEnclaves.2:
-        "0x3551faac39edee5abfaa19ab065c217db1485aebae255a9edddf6dfff6b29b52"
+        "0x3b589538b775ddbfc5fb028167ff846116159e6687aef9f849ca5a70a7871ea5"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.2:
-        "0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
+        "0x0aED2375549D1115e180bd0caea829C429Ea50B3"
      values.$members.1:
-        "0x7Cdd1c128Cd72dd252f569eeD942735330937F91"
+        "0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
      values.$members.0:
-        "0x6B6072CE402F22fDcFbA1705383D8e280717Cb87"
+        "0x7Cdd1c128Cd72dd252f569eeD942735330937F91"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "4 of 5 (80%)"
      receivedPermissions.24:
+        {"permission":"upgrade","from":"0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin"}
      receivedPermissions.23:
+        {"permission":"upgrade","from":"0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","role":"admin"}
      receivedPermissions.22:
+        {"permission":"upgrade","from":"0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin"}
      receivedPermissions.21:
+        {"permission":"upgrade","from":"0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","role":"admin"}
      receivedPermissions.20:
+        {"permission":"upgrade","from":"0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE","role":"admin"}
      receivedPermissions.19.from:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.18.from:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.17.from:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      receivedPermissions.16.from:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
+        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
      receivedPermissions.15.from:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.14.from:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
+        "0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      receivedPermissions.13.from:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      receivedPermissions.12.from:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "0x05d88855361808fA1d7fc28084Ef3fCa191c4e03"
      receivedPermissions.11.from:
-        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.10.from:
-        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
+        "0x9F9D2fC7abe74C79f86F0D1212107692430eef72"
      receivedPermissions.9.from:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.8.from:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1"
      receivedPermissions.7.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.7.from:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      receivedPermissions.7.role:
-        "admin"
+        ".owner"
      receivedPermissions.7.description:
+        "can update the contract address for a given name"
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.from:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.6.role:
-        "admin"
+        ".owner"
      receivedPermissions.6.description:
+        "can update the program being verified"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
+        "0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE"
      receivedPermissions.5.role:
-        "admin"
+        ".owner"
      receivedPermissions.5.description:
+        "can update the program being verified"
      receivedPermissions.4.from:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.4.description:
-        "can update the program being verified"
+        "can update the contract address for a given name"
      receivedPermissions.3.from:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0xbee1040D0Aab17AE19454384904525aE4A3602B9"
      receivedPermissions.3.description:
-        "can update the contract address for a given name"
+        "can update the program being verified"
      receivedPermissions.2.from:
-        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
+        "0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261"
      receivedPermissions.1.from:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
+        "0x7e6409e9b6c5e2064064a6cC994f9a2e95680782"
      receivedPermissions.0.from:
-        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
+        "0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136"
      receivedPermissions.0.description:
-        "can update the program being verified"
+        "can add new instances without a DCAP attestation"
    }
```

```diff
    contract MainnetSignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.
      sourceHashes.1:
-        "0xf99b7d5f650d3734e945c5040d8e4776dfdc97ff745666e084c1d471b7973f38"
+        "0xc978dbfc097ca447823c4a1eb83078cd63532727420b19287acc0f87e884285f"
      values.$implementation:
-        "0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
+        "0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
      values.$pastUpgrades.7:
+        ["2024-05-01T08:03:23.000Z","0x0898d14da2f38d677085073d2decfb7ca32902406df2e7a84f6615d9c92d4516",["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]]
      values.$pastUpgrades.6:
+        ["2024-06-06T08:51:11.000Z","0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131",["0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"]]
      values.$pastUpgrades.5.2:
-        "2024-05-01T08:03:23.000Z"
+        ["0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"]
      values.$pastUpgrades.5.1:
-        "0x0898d14da2f38d677085073d2decfb7ca32902406df2e7a84f6615d9c92d4516"
+        "2025-05-18T14:25:11.000Z"
      values.$pastUpgrades.5.0:
-        ["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]
+        "0x0ae99d24b294622e3d3868c8dca911a5936231ce1f97254ec0c6a6f65f7aa81c"
      values.$pastUpgrades.4.2.0:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0x0783Ee019C9b0f918A741469bD488A88827b3617"
      values.$pastUpgrades.4.1:
-        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
+        "2025-05-15T08:40:47.000Z"
      values.$pastUpgrades.4.0:
-        "2024-06-06T08:51:11.000Z"
+        "0x97789b6668d0a287b1f57bb6c8e23cce62308fb887139faeb0f06b77855995fd"
      values.$upgradeCount:
-        6
+        8
      values.addressManager:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      values.impl:
-        "0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
+        "0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c"
      values.lastUnpausedAt:
-        0
      values.resolver:
+        "0x8Efa01564425692d0a0838DC10E300BD310Cb43e"
      implementationNames.0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3:
-        "MainnetSignalService"
      implementationNames.0x42Ec977eb6B09a8D78c6D486c3b0e63569bA851c:
+        "MainnetSignalService"
    }
```

```diff
-   Status: DELETED
    contract MainnetSgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
-   Status: DELETED
    contract MainnetGuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC)
    +++ description: Verifier contract for Guardian proven blocks.
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      values.namedAddresses.10.name:
-        "bridge_watchdog"
+        "taiko_token"
      values.namedAddresses.10.address:
-        "0x00000291AB79c55dC4Fcd97dFbA4880DF4b93624"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.namedAddresses.9.name:
-        "taiko_token"
+        "signal_service"
      values.namedAddresses.9.address:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0x1670000000000000000000000000000000000005"
      values.namedAddresses.8.name:
-        "signal_service"
+        "erc1155_vault"
      values.namedAddresses.8.address:
-        "0x1670000000000000000000000000000000000005"
+        "0x1670000000000000000000000000000000000004"
      values.namedAddresses.7.name:
-        "erc1155_vault"
+        "bridged_erc1155"
      values.namedAddresses.7.address:
-        "0x1670000000000000000000000000000000000004"
+        "0x3c90963cFBa436400B0F9C46Aa9224cB379c2c40"
      values.namedAddresses.6.name:
-        "bridged_erc1155"
+        "bridge"
      values.namedAddresses.6.address:
-        "0x3c90963cFBa436400B0F9C46Aa9224cB379c2c40"
+        "0x1670000000000000000000000000000000000001"
      values.namedAddresses.5.name:
-        "bridge"
+        "bridged_erc20"
      values.namedAddresses.5.address:
-        "0x1670000000000000000000000000000000000001"
+        "0x65666141a541423606365123Ed280AB16a09A2e1"
      values.namedAddresses.4.name:
-        "bridged_erc20"
+        "bridged_erc721"
      values.namedAddresses.4.address:
-        "0x65666141a541423606365123Ed280AB16a09A2e1"
+        "0xC3310905E2BC9Cfb198695B75EF3e5B69C6A1Bf7"
      values.namedAddresses.3.name:
-        "bridged_erc721"
+        "quota_manager"
      values.namedAddresses.3.address:
-        "0xC3310905E2BC9Cfb198695B75EF3e5B69C6A1Bf7"
+        "0x0000000000000000000000000000000000000000"
      values.namedAddresses.2.name:
-        "quota_manager"
+        "erc721_vault"
      values.namedAddresses.2.address:
-        "0x0000000000000000000000000000000000000000"
+        "0x1670000000000000000000000000000000000003"
      values.namedAddresses.1.name:
-        "erc721_vault"
+        "erc20_vault"
      values.namedAddresses.1.address:
-        "0x1670000000000000000000000000000000000003"
+        "0x1670000000000000000000000000000000000002"
      values.namedAddresses.0.name:
-        "erc20_vault"
+        "bridge_watchdog"
      values.namedAddresses.0.address:
-        "0x1670000000000000000000000000000000000002"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract ForcedInclusionStore (0x05d88855361808fA1d7fc28084Ef3fCa191c4e03)
    +++ description: Contract that allows to enqueue forced transaction through L1. A pending forced transaction must be processed every 255 batches.
```

```diff
+   Status: CREATED
    contract AutomataDcapV3Attestation (0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261)
    +++ description: Contract managing SGX attestation certificates.
```

```diff
+   Status: CREATED
    contract Risc0VerifierGateway (0x73Ee496dA20e5C65340c040B0D8c3C891C1f74AE)
    +++ description: Entry contract to verify batches using RISC Zero.
```

```diff
+   Status: CREATED
    contract SgxVerifier (0x7e6409e9b6c5e2064064a6cC994f9a2e95680782)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
+   Status: CREATED
    contract DefaultResolver (0x8Efa01564425692d0a0838DC10E300BD310Cb43e)
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
```

```diff
+   Status: CREATED
    contract SgxVerifier (0x9e322fC59b8f4A29e6b25c3a166ac1892AA30136)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
+   Status: CREATED
    contract TaikoWrapper (0x9F9D2fC7abe74C79f86F0D1212107692430eef72)
    +++ description: Entry point for proposing blocks. It enforces the inclusion of forced transactions after their deadline.
```

```diff
+   Status: CREATED
    contract VerifierGateway (0xB16931e78d0cE3c9298bbEEf3b5e2276D34b8da1)
    +++ description: Gateway contract for the multi-proof system. It redirects proof to the appropriate verifier based on the proof type.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0xbee1040D0Aab17AE19454384904525aE4A3602B9)
    +++ description: Entry contract to verify batches using SP1.
```

## Source code changes

```diff
.../AutomataDcapV3Attestation.sol                  | 3750 ++++++++++++++++++++
 .../ERC1967Proxy.p.sol                             |    2 +-
 .../AutomataDcapV3Attestation.sol                  |    0
 .../ERC1967Proxy.p.sol                             |    0
 .../DefaultResolver/DefaultResolver.sol}           |  807 ++---
 .../DefaultResolver}/ERC1967Proxy.p.sol            |    2 +-
 .../ForcedInclusionStore}/ERC1967Proxy.p.sol       |    2 +-
 .../ForcedInclusionStore/ForcedInclusionStore.sol} | 1533 +++-----
 .../MainnetSgxVerifier.sol => /dev/null            | 2857 ---------------
 .../MainnetSignalService/MainnetSignalService.sol  |  822 ++---
 .../MainnetTaikoL1/ERC1967Proxy.p.sol => /dev/null |  594 ----
 .../MainnetTierRouter.sol => /dev/null             |  219 --
 .../Risc0VerifierGateway/Risc0Verifier.sol         |  907 ++---
 .../SP1VerifierGateway/SP1Verifier.sol             |  914 ++---
 .../ERC1967Proxy.p.sol                             |    2 +-
 .../SgxVerifier.sol}                               | 3349 ++++++++---------
 .../ERC1967Proxy.p.sol                             |  594 ++++
 .../SgxVerifier.sol}                               | 3349 ++++++++---------
 .../TaikoL1}/ERC1967Proxy.p.sol                    |    0
 .../ethereum/.flat/TaikoL1/MainnetInbox.3.sol      | 2964 ++++++++++++++++
 .../TaikoL1/MainnetTaikoL1.2.sol}                  |    7 +
 .../ethereum/.flat/TaikoL1/PacayaForkRouter.1.sol  | 1173 ++++++
 .../TaikoToken/TaikoToken.sol                      |  132 +-
 .../ethereum/.flat/TaikoWrapper/ERC1967Proxy.p.sol |  594 ++++
 .../ethereum/.flat/TaikoWrapper/TaikoWrapper.sol   | 1471 ++++++++
 .../.flat/VerifierGateway/ERC1967Proxy.p.sol       |  594 ++++
 .../VerifierGateway/MainnetVerifier.sol}           | 1453 ++------
 27 files changed, 16368 insertions(+), 11723 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22481930 (main branch discovery), not current.

```diff
    contract MainnetTaikoL1 (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      name:
-        "TaikoL1Contract"
+        "MainnetTaikoL1"
      proxyType:
-        "EIP1967 proxy"
+        "TaikoFork proxy"
      values.$pastUpgrades.23.2:
-        ["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"]
+        "0x5eb57ab352b3e3c1ddbc3fe468d582901b88c6a137ce49b0d70857d5218d626d"
      values.$pastUpgrades.23.1:
-        "0x5eb57ab352b3e3c1ddbc3fe468d582901b88c6a137ce49b0d70857d5218d626d"
+        "2024-11-10T16:10:23.000Z"
      values.$pastUpgrades.23.0:
-        "2024-11-10T16:10:23.000Z"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"]
      values.$pastUpgrades.22.2:
-        ["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]
+        "0x2c455ae888a23c232bb5c7603657eda010ffadc602a74e626332bc06eaaa3b78"
      values.$pastUpgrades.22.1:
-        "0x5efedb806fca83936c58f9e4d30644257ce3a529239131b0b19f630320bcfb04"
+        "2024-06-04T06:10:11.000Z"
      values.$pastUpgrades.22.0:
-        "2024-11-10T15:46:23.000Z"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]
      values.$pastUpgrades.21.2:
-        ["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]
+        "0x6368890b9aa2f87c6a6b727efdd8af0ea357a11460b546d8a7f3e19e38a34e41"
      values.$pastUpgrades.21.1:
-        "0x78ca7c7d9c7e5aa9c5e6ab80e0229289a8d3bc8df2c2b9ba6baa74a0f60a0703"
+        "2025-02-27T03:27:23.000Z"
      values.$pastUpgrades.21.0:
-        "2024-11-03T05:15:23.000Z"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"]
      values.$pastUpgrades.20.2:
-        "0xa9e285d0f2cc84161ac3fc28962003779e9a618271bd6a54b16fb4001ede5b38"
+        "0x78ca7c7d9c7e5aa9c5e6ab80e0229289a8d3bc8df2c2b9ba6baa74a0f60a0703"
      values.$pastUpgrades.20.1:
-        "2024-11-10T15:32:47.000Z"
+        "2024-11-03T05:15:23.000Z"
      values.$pastUpgrades.20.0.2:
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.20.0.1:
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.20.0.0:
-        "0x0205ea1e1162bc50E1030F36412E5Dd69daA4040"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.19.2:
-        "0xc0e8ec30d1479ca2414d4d28a09a543c2845247d80387f78c179d663ffe55c3c"
+        "2024-05-27T16:37:11.000Z"
      values.$pastUpgrades.19.1:
-        "2025-02-13T06:57:47.000Z"
+        "0x187cc99e9bcf2a94f723cf52d85b74b79bdb3872681e2a3808cadbbc3ba301e2"
      values.$pastUpgrades.19.0.2:
+        "0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"
      values.$pastUpgrades.19.0.1:
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.19.0.0:
-        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.18.2:
-        ["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"]
+        "0xaed098ad0c93113e401f61358f963501f40a046c5b5b659a1610f10120a9a86b"
      values.$pastUpgrades.18.1:
-        "0x77871837d1749b22a7991da475e657baa4371937f5a8cb094d4e170db000cb25"
+        "2024-05-21T14:15:11.000Z"
      values.$pastUpgrades.18.0:
-        "2024-12-24T14:19:11.000Z"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]
      values.$pastUpgrades.17.2:
-        ["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]
+        "0x77871837d1749b22a7991da475e657baa4371937f5a8cb094d4e170db000cb25"
      values.$pastUpgrades.17.1:
-        "2024-12-23T03:12:35.000Z"
+        "2024-12-24T14:19:11.000Z"
      values.$pastUpgrades.17.0:
-        "0xe66aba9f8bfcd86dc0ae32416862ca61a51c47f8ec747799e65f155ef27eeb20"
+        ["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.16.2:
-        ["0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"]
+        "0xc0e8ec30d1479ca2414d4d28a09a543c2845247d80387f78c179d663ffe55c3c"
      values.$pastUpgrades.16.1:
-        "2024-12-23T14:55:47.000Z"
+        "2025-02-13T06:57:47.000Z"
      values.$pastUpgrades.16.0:
-        "0x9c2f36af40c0004110041fc45d980b73b0c8dde8064713a55aeb6f69fca77a99"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x2784423f7c61Bc7B75dB6CdA26959946f437588D"]
      values.$pastUpgrades.15.2:
-        ["0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.15.1:
-        "2024-05-27T16:37:11.000Z"
+        "2024-05-11T06:26:35.000Z"
      values.$pastUpgrades.15.0:
-        "0x187cc99e9bcf2a94f723cf52d85b74b79bdb3872681e2a3808cadbbc3ba301e2"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"]
      values.$pastUpgrades.14.2:
-        ["0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"]
+        "2024-12-23T02:45:11.000Z"
      values.$pastUpgrades.14.1:
-        "2024-07-02T07:03:35.000Z"
+        "0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944"
      values.$pastUpgrades.14.0:
-        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0xb74A66b6CF50AD63E29669F0BDE4354E11758162"]
      values.$pastUpgrades.13.2:
-        "2024-11-01T09:20:35.000Z"
+        "0x5efedb806fca83936c58f9e4d30644257ce3a529239131b0b19f630320bcfb04"
      values.$pastUpgrades.13.1:
-        "0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd"
+        "2024-11-10T15:46:23.000Z"
      values.$pastUpgrades.13.0.2:
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.13.0.1:
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.13.0.0:
-        "0x4229d14F520848aa83760Cf748abEB8A69cdaB2d"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.12.2:
-        ["0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]
+        "2024-07-13T12:34:35.000Z"
      values.$pastUpgrades.12.1:
-        "2024-10-16T07:55:23.000Z"
+        "0xdf3f0cb2eaca00484c30a5c63fafe8036a9e0f71bd4bab216504bee0f5bfb83f"
      values.$pastUpgrades.12.0:
-        "0x8778064404816273804d74c97b051f3865bc03062cfa4b0e9567f4556ad31981"
+        ["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.11.2:
-        ["0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]
+        "2024-10-16T07:55:23.000Z"
      values.$pastUpgrades.11.1:
-        "2024-06-07T04:02:11.000Z"
+        "0x8778064404816273804d74c97b051f3865bc03062cfa4b0e9567f4556ad31981"
      values.$pastUpgrades.11.0:
-        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]
      values.$pastUpgrades.10.2:
-        ["0xBA1d90BCfA74163bFE09e8eF609b346507D83231"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.10.1:
-        "2024-07-16T14:30:23.000Z"
+        "2024-06-06T08:51:11.000Z"
      values.$pastUpgrades.10.0:
-        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x4b2743B869b85d5F7D8020566f92664995E4f3c5"]
      values.$pastUpgrades.9.2:
-        "2024-05-01T08:03:47.000Z"
+        "2024-07-16T14:30:23.000Z"
      values.$pastUpgrades.9.1.2:
+        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
      values.$pastUpgrades.9.1.1:
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.9.1.0:
-        "0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.9.0:
-        "0x675a0b8283bd222e1df42a0a4df4b781a1a7c5575729e2e91f89dda879933702"
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.8.2:
-        ["0xB9E1E58bcF33B79CcfF99c298963546a6c334388"]
+        "2024-05-28T05:18:11.000Z"
      values.$pastUpgrades.8.1:
-        "2024-06-07T08:40:35.000Z"
+        "0xa603b6d55457e64e18ddae684bfd14948452cdd7b927dd22bf0b83045e8fd028"
      values.$pastUpgrades.8.0:
-        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]
      values.$pastUpgrades.7.2:
-        "0x6368890b9aa2f87c6a6b727efdd8af0ea357a11460b546d8a7f3e19e38a34e41"
+        "0xa9e285d0f2cc84161ac3fc28962003779e9a618271bd6a54b16fb4001ede5b38"
      values.$pastUpgrades.7.1:
-        ["0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"]
+        "2024-11-10T15:32:47.000Z"
      values.$pastUpgrades.7.0:
-        "2025-02-27T03:27:23.000Z"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0205ea1e1162bc50E1030F36412E5Dd69daA4040"]
      values.$pastUpgrades.6.2:
-        ["0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]
+        "2024-06-07T04:02:11.000Z"
      values.$pastUpgrades.6.1:
-        "0xaed098ad0c93113e401f61358f963501f40a046c5b5b659a1610f10120a9a86b"
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.6.0:
-        "2024-05-21T14:15:11.000Z"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]
      values.$pastUpgrades.5.2:
-        "0x2c455ae888a23c232bb5c7603657eda010ffadc602a74e626332bc06eaaa3b78"
+        "2024-12-23T14:55:47.000Z"
      values.$pastUpgrades.5.1:
-        "2024-06-04T06:10:11.000Z"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"]
      values.$pastUpgrades.5.0:
-        ["0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]
+        "0x9c2f36af40c0004110041fc45d980b73b0c8dde8064713a55aeb6f69fca77a99"
      values.$pastUpgrades.4.2:
-        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
+        "2024-05-01T08:03:47.000Z"
      values.$pastUpgrades.4.1:
-        "2024-05-11T06:26:35.000Z"
+        "0x675a0b8283bd222e1df42a0a4df4b781a1a7c5575729e2e91f89dda879933702"
      values.$pastUpgrades.4.0.2:
+        "0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"
      values.$pastUpgrades.4.0.1:
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.4.0.0:
-        "0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.3.2:
-        "2024-07-13T12:34:35.000Z"
+        "2024-12-23T03:12:35.000Z"
      values.$pastUpgrades.3.1:
-        ["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"]
+        "0xe66aba9f8bfcd86dc0ae32416862ca61a51c47f8ec747799e65f155ef27eeb20"
      values.$pastUpgrades.3.0:
-        "0xdf3f0cb2eaca00484c30a5c63fafe8036a9e0f71bd4bab216504bee0f5bfb83f"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]
      values.$pastUpgrades.2.2:
-        "2024-12-23T02:45:11.000Z"
+        "2024-07-02T07:03:35.000Z"
      values.$pastUpgrades.2.1:
-        "0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944"
+        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
      values.$pastUpgrades.2.0.2:
+        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      values.$pastUpgrades.2.0.1:
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.2.0.0:
-        "0xb74A66b6CF50AD63E29669F0BDE4354E11758162"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.1.2:
-        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
+        "2024-06-07T08:40:35.000Z"
      values.$pastUpgrades.1.1:
-        "2024-06-06T08:51:11.000Z"
+        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
      values.$pastUpgrades.1.0.2:
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.$pastUpgrades.1.0.1:
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.1.0.0:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0x0000000000000000000000000000000000000000"
      values.$pastUpgrades.0.2:
-        "2024-05-28T05:18:11.000Z"
+        "2024-11-01T09:20:35.000Z"
      values.$pastUpgrades.0.1:
-        ["0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]
+        "0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd"
      values.$pastUpgrades.0.0:
-        "0xa603b6d55457e64e18ddae684bfd14948452cdd7b927dd22bf0b83045e8fd028"
+        ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x4229d14F520848aa83760Cf748abEB8A69cdaB2d"]
    }
```

```diff
    contract RiscZeroGroth16Verifier (0x48E32eFbe22e180A3FFe617f4955cD83B983dd98) {
    +++ description: Verifier contract for RISC Zero Groth16 proofs.
      description:
-        "Verifier contract for ZK-proven batches."
+        "Verifier contract for RISC Zero Groth16 proofs."
    }
```

```diff
    contract Risc0VerifierGateway (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc) {
    +++ description: Entry contract to verify batches using RISC Zero.
      name:
-        "Risc0Verifier"
+        "Risc0VerifierGateway"
      template:
-        "taiko/Risc0Verifier"
+        "taiko/Risc0VerifierGateway"
      description:
-        "Verifier contract for Risc0 proven blocks."
+        "Entry contract to verify batches using RISC Zero."
    }
```

```diff
    contract MainnetGuardianProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      name:
-        "GuardianMinorityProver"
+        "MainnetGuardianProver"
    }
```

```diff
    contract MainnetRollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: This contract manages the rollup addresses list, allowing to set the address for a specific chainId-name pair.
      name:
-        "L1RollupAddressManager"
+        "MainnetRollupAddressManager"
    }
```

```diff
    contract SP1VerifierGateway (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: Entry contract to verify batches using SP1.
      name:
-        "SP1Verifier"
+        "SP1VerifierGateway"
      template:
-        "taiko/SP1Verifier"
+        "taiko/SP1VerifierGateway"
      description:
-        "Verifier contract for ZK-proven batches."
+        "Entry contract to verify batches using SP1."
    }
```

```diff
    contract SP1Verifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371) {
    +++ description: Verifier contract for SP1 proofs.
      name:
-        "SP1RemoteVerifier"
+        "SP1Verifier"
      description:
-        "SP1Verifier is a contract used to verify proofs given public values and verification key."
+        "Verifier contract for SP1 proofs."
    }
```

```diff
    contract MainnetProverSet (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TAIKO. There are several instances of this contract operated by different entities.
      name:
-        "DAOFallbackProposer"
+        "MainnetProverSet"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      values.mrEnclaves:
+        ["0xbdec26abd36fde2cfbb8db7a0793a9346b11bd558b39890407d458500711c88c","0xa5f741bfed254a1e21738d429e7bd074e25918af7f71fbe1e0135c3974b06e00","0x3551faac39edee5abfaa19ab065c217db1485aebae255a9edddf6dfff6b29b52","0xa4eedfc6484494d4c08bfb9b9dd887c6e0540ba9d8ee207fe0e16814852e3356","0xa096348d480eb0474f5eab182671933c029545521960d87d4e49283005809be9","0xdfcb4fca3073e3f3a90b05d328688c32619d56f26789c0a9797aa10e765a7807","0x9546301721e2ea111ab0f79b6e529d6bb6c486ac98bcf7739429ad06c09db63d","0x13ea9869632ac20b176ae0fdc39998b2a644a695db024ef7fe0e4b3c59084160","0xc90e5d2e39d1d3f8397a6048c32ba50139d1577c28985e1f7638785935f41734","0x3f71cf178a032816c2731a43aef746c464a5326e891dc881773ec2b599b2cf0a"]
      values.mrSigners:
+        ["0xca0583a715534a8c981b914589a7f0dc5d60959d9ae79fb5353299a4231673d5"]
    }
```

```diff
    contract MainnetERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: Shared vault for Taiko chains for bridged ERC20 tokens.
      name:
-        "SharedERC20Vault"
+        "MainnetERC20Vault"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.19:
+        {"permission":"upgrade","from":"0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","role":"admin"}
      receivedPermissions.18:
+        {"permission":"upgrade","from":"0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","role":"admin"}
      receivedPermissions.17:
+        {"permission":"upgrade","from":"0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","role":"admin"}
      receivedPermissions.16:
+        {"permission":"upgrade","from":"0xE3D777143Ea25A6E031d1e921F396750885f43aC","role":"admin"}
      receivedPermissions.15:
+        {"permission":"upgrade","from":"0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","role":"admin"}
      receivedPermissions.14:
+        {"permission":"upgrade","from":"0x579A8d63a2Db646284CBFE31FE5082c9989E985c","role":"admin"}
      receivedPermissions.13.from:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.12.from:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.11.from:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
      receivedPermissions.10.from:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.9.from:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      receivedPermissions.8.from:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.7.from:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.6.from:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      receivedPermissions.5.from:
-        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
+        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.4.role:
-        "admin"
+        ".owner"
      receivedPermissions.4.description:
+        "can update the program being verified"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.role:
-        "admin"
+        ".owner"
      receivedPermissions.3.description:
+        "can update the contract address for a given name"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.2.role:
-        "admin"
+        ".owner"
      receivedPermissions.2.description:
+        "can update the program being verified"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.role:
-        "admin"
+        ".owner"
      receivedPermissions.1.description:
+        "can add new instances without a DCAP attestation"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.role:
-        "admin"
+        ".owner"
      receivedPermissions.0.description:
+        "can update the program being verified"
    }
```

```diff
    contract MainnetSignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.
      name:
-        "SignalService"
+        "MainnetSignalService"
    }
```

```diff
    contract MainnetSgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      name:
-        "SgxVerifier"
+        "MainnetSgxVerifier"
    }
```

```diff
    contract MainnetBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: Shared bridge for Taiko chains for bridged ETH.
      name:
-        "TaikoBridge"
+        "MainnetBridge"
    }
```

```diff
    contract MainnetGuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      name:
-        "GuardianProver"
+        "MainnetGuardianProver"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades.
      description:
-        "This contract manages the shared addresses for Taiko rollups."
+        "Maps contract names to contract addresses. Changes in this mapping effectively act as contract upgrades."
      values.namedAddresses:
+        [{"name":"erc20_vault","address":"0x1670000000000000000000000000000000000002"},{"name":"erc721_vault","address":"0x1670000000000000000000000000000000000003"},{"name":"quota_manager","address":"0x0000000000000000000000000000000000000000"},{"name":"bridged_erc721","address":"0xC3310905E2BC9Cfb198695B75EF3e5B69C6A1Bf7"},{"name":"bridged_erc20","address":"0x65666141a541423606365123Ed280AB16a09A2e1"},{"name":"bridge","address":"0x1670000000000000000000000000000000000001"},{"name":"bridged_erc1155","address":"0x3c90963cFBa436400B0F9C46Aa9224cB379c2c40"},{"name":"erc1155_vault","address":"0x1670000000000000000000000000000000000004"},{"name":"signal_service","address":"0x1670000000000000000000000000000000000005"},{"name":"taiko_token","address":"0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"},{"name":"bridge_watchdog","address":"0x00000291AB79c55dC4Fcd97dFbA4880DF4b93624"}]
      values.quotaManager:
+        "0x91f67118DD47d502B1f0C354D0611997B022f29E"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x7461696b6f5f746f6b656e000000000000000000000000000000000000000000":"taiko_token","0x626f6e645f746f6b656e00000000000000000000000000000000000000000000":"bond_token","0x6272696467650000000000000000000000000000000000000000000000000000":"bridge","0x7369676e616c5f73657276696365000000000000000000000000000000000000":"signal_service","0x65726332305f7661756c74000000000000000000000000000000000000000000":"erc20_vault","0x6572633732315f7661756c740000000000000000000000000000000000000000":"erc721_vault","0x657263313135355f7661756c7400000000000000000000000000000000000000":"erc1155_vault","0x6272696467655f7761746368646f670000000000000000000000000000000000":"bridge_watchdog","0x627269646765645f657263323000000000000000000000000000000000000000":"bridged_erc20","0x627269646765645f657263373231000000000000000000000000000000000000":"bridged_erc721","0x627269646765645f657263313135350000000000000000000000000000000000":"bridged_erc1155","0x71756f74615f6d616e6167657200000000000000000000000000000000000000":"quota_manager"}}]
    }
```

```diff
+   Status: CREATED
    contract QuotaManager (0x91f67118DD47d502B1f0C354D0611997B022f29E)
    +++ description: Defines withdrawal limits per token.
```

Generated with discovered.json: 0xaab72c9107d4bab5978b4f6c09e73c6157b6c6b8

# Diff at Fri, 23 May 2025 09:41:06 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22481930
- current block number: 22481930

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22481930 (main branch discovery), not current.

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      receivedPermissions.0.role:
+        ".verifier_TIER_GUARDIAN_MINORITY"
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
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
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract DAO (0x9CDf589C941ee81D75F34d3755671d614f7cf261) {
    +++ description: The entry point to the DAO Aragon-based governance framework.
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      receivedPermissions.1.role:
+        ".chain_watchdog"
      receivedPermissions.0.role:
+        ".verifier_TIER_GUARDIAN"
    }
```

Generated with discovered.json: 0x671ab3bce1dd8e7fd074e68ae54bdccebf46988b

# Diff at Tue, 13 May 2025 14:42:00 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e7801928b60345a3e550e0f818e51329f969ff6f block: 22297586
- current block number: 22474965

## Description

TAIKO token contract refactor and introduces an explicit list of non-voting accounts, the Foundation (TAIKO_FOUNDATION_TREASURY) and DAO contracts (TAIKO_DAO_CONTROLLER), for which token weight do not count. Sets up the DAO with a separate executor contract (TAIKO_DAO_CONTROLLER) helper that the DAO owns.

## Watched changes

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: Taiko's native token. Used for block proposal rewards, proving bonds and rewards, and contesting bonds.
      sourceHashes.1:
-        "0x5da570fbffd5ab663ce8983496a9ded290ed853a950b4052ac93b35217babac8"
+        "0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b"
      sourceHashes.0:
-        "0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b"
+        "0xea41529d3c7a5cd7651ff173711c111016d65e4345f6f60dc2af04d8ddef375f"
      values.$implementation:
-        "0xcfe803378D79d1180EbF030455040EA6513869dF"
+        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
      values.$pastUpgrades.5:
+        ["2024-05-29T08:03:23.000Z","0x56402f9fd928be890fbd29829b817faffc0780b85e83300a29962c969808cae2",["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]]
      values.$pastUpgrades.4.2:
-        "0x56402f9fd928be890fbd29829b817faffc0780b85e83300a29962c969808cae2"
+        "2024-05-11T05:46:11.000Z"
      values.$pastUpgrades.4.1.0:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"
      values.$pastUpgrades.4.0:
-        "2024-05-29T08:03:23.000Z"
+        "0x7d82794932540ed9edd259e58f6ef8ae21a49beada7f0224638f888f7149c01c"
      values.$pastUpgrades.3.2:
-        "2024-05-11T05:46:11.000Z"
+        "0x4f7a1c6ad21fbfeaecab40ea36a3845bf67e22d7770d8a259d62b995cb93cb34"
      values.$pastUpgrades.3.1.0:
-        "0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"
+        "0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"
      values.$pastUpgrades.3.0:
-        "0x7d82794932540ed9edd259e58f6ef8ae21a49beada7f0224638f888f7149c01c"
+        "2024-04-25T08:29:59.000Z"
      values.$pastUpgrades.2.2:
-        "0x4f7a1c6ad21fbfeaecab40ea36a3845bf67e22d7770d8a259d62b995cb93cb34"
+        "0xdb7d5de46738ad3f676db47b61772db531f9858b7a01e8c3b5aee49fa74cac95"
      values.$pastUpgrades.2.1.0:
-        "0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"
+        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
      values.$pastUpgrades.2.0:
-        "2024-04-25T08:29:59.000Z"
+        "2025-05-13T00:47:23.000Z"
      values.$upgradeCount:
-        5
+        6
      values.addressManager:
-        "0x0000000000000000000000000000000000000000"
      values.getPastTotalSupply:
-        [0,0,0,0,0]
      values.impl:
-        "0xcfe803378D79d1180EbF030455040EA6513869dF"
+        "0x87C752b0F70cAa237Edd7571B0845470A37DE040"
      values.lastUnpausedAt:
-        0
      values.getNonVotingAccounts:
+        ["0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da","0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"]
      values.proxiableUUID:
+        "EXPECT_REVERT"
      values.resolver:
+        "0x0000000000000000000000000000000000000000"
      values.TAIKO_DAO_CONTROLLER:
+        "0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3"
      values.TAIKO_FOUNDATION_TREASURY:
+        "0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da"
      errors:
-        {"getPastTotalSupply":"Processing error occurred.","proxiableUUID":"Processing error occurred."}
      implementationNames.0xcfe803378D79d1180EbF030455040EA6513869dF:
-        "TaikoToken"
      implementationNames.0x87C752b0F70cAa237Edd7571B0845470A37DE040:
+        "TaikoToken"
      template:
+        "taiko/TaikoToken"
      description:
+        "Taiko's native token. Used for block proposal rewards, proving bonds and rewards, and contesting bonds."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.4:
+        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
      values.$members.3:
-        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
+        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
      values.$members.2:
-        "0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1"
+        "0x1eE487CEdCe52c370DB11e62987F3ABe873E145A"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
    }
```

```diff
+   Status: CREATED
    contract Taiko Foundation Treasury Multisig (0x363e846B91AF677Fb82f709b6c35BD1AaFc6B3Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAO (0x9CDf589C941ee81D75F34d3755671d614f7cf261)
    +++ description: The entry point to the DAO Aragon-based governance framework.
```

```diff
+   Status: CREATED
    contract TaikoDAOController (0xfC3C4ca95a8C4e5a587373f1718CD91301d6b2D3)
    +++ description: Contract that maintains ownership of all contracts and assets, owned by the DAO. Its token weight does not count towards the DAO quorum.
```

## Source code changes

```diff
.../src/projects/taiko/ethereum/.flat/DAO/DAO.sol  | 1895 ++++++++++++++++++++
 .../taiko/ethereum/.flat/DAO/ERC1967Proxy.p.sol    |  594 ++++++
 .../GnosisSafe.sol                                 |  953 ++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/TaikoDAOController/ERC1967Proxy.p.sol    |  594 ++++++
 .../TaikoDAOController/TaikoDAOController.sol      | 1393 ++++++++++++++
 .../TaikoToken/TaikoToken.sol                      |  433 ++---
 7 files changed, 5641 insertions(+), 256 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22297586 (main branch discovery), not current.

```diff
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169) {
    +++ description: Library for managing PEM certificate chains.
      template:
+        "taiko/PEMCertChainLib"
      description:
+        "Library for managing PEM certificate chains."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      template:
+        "taiko/TaikoL1Contract"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      values.proxiableUUID:
-        "EXPECT_REVERT"
      values.getPastTotalSupply:
+        [0,0,0,0,0]
      errors:
+        {"getPastTotalSupply":"Processing error occurred.","proxiableUUID":"Processing error occurred."}
    }
```

```diff
    contract MainnetProverSet (0x280eAbfd252f017B78e15b69580F249F45FB55Fa) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TAIKO. There are several instances of this contract operated by different entities.
      template:
+        "taiko/DAOFallbackProposer"
      description:
+        "A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TAIKO. There are several instances of this contract operated by different entities."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract MainnetTierRouter (0x44d307a9ec47aA55a7a30849d065686753C86Db6) {
    +++ description: Contract managing and routing the multi-tier proof system.
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"50000000000000000000","contestBond":"328125000000000000000","cooldownWindow":1440,"provingWindow":60,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      fieldMeta.TIER_OPTIMISTIC:
-        {"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}
      fieldMeta.TIER_SGX_ZKVM:
-        {"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}
      template:
+        "taiko/MainnetTierRouter"
      description:
+        "Contract managing and routing the multi-tier proof system."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9) {
    +++ description: Library for verifying signatures.
      template:
+        "taiko/SigVerifyLib"
      description:
+        "Library for verifying signatures."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract RiscZeroGroth16Verifier (0x48E32eFbe22e180A3FFe617f4955cD83B983dd98) {
    +++ description: Verifier contract for ZK-proven batches.
      template:
+        "taiko/RiscZeroGroth16Verifier"
      description:
+        "Verifier contract for ZK-proven batches."
    }
```

```diff
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc) {
    +++ description: Verifier contract for Risc0 proven blocks.
      template:
+        "taiko/Risc0Verifier"
      description:
+        "Verifier contract for Risc0 proven blocks."
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.guardians:
-        ["0x000012dd12a6D9Dd2045f5E2594f4996b99A5d33","0x0cAC6E2Fd10e92Bf798341Ad0A57b5Cb39DA8D0D","0xd6BB974bc47626E3547426efa4CA2A8d7DFCccdf","0xd26c4e85BC2fAAc27a320987e340971cF3b47d51","0xC384B679c028787166b9B3725aC14A60da205861","0x1602958A85494cd9C3e0D6672BA0eE42b95B4200","0x5CfEb9a72256B1b49dc2C98b1b7b99d172D50B68","0x1DB8Ac9f19AbdD60A6418383BfA56A4450aa80C6"]
      values.$members:
+        ["0x000012dd12a6D9Dd2045f5E2594f4996b99A5d33","0x1602958A85494cd9C3e0D6672BA0eE42b95B4200","0x0cAC6E2Fd10e92Bf798341Ad0A57b5Cb39DA8D0D","0xd26c4e85BC2fAAc27a320987e340971cF3b47d51","0xC384B679c028787166b9B3725aC14A60da205861","0x1DB8Ac9f19AbdD60A6418383BfA56A4450aa80C6","0x5CfEb9a72256B1b49dc2C98b1b7b99d172D50B68","0xd6BB974bc47626E3547426efa4CA2A8d7DFCccdf"]
+++ description: Current guardian minority threshold. Number of guardians required to prove a block.
+++ severity: HIGH
      values.$threshold:
+        1
      template:
+        "taiko/GuardianMinorityProver"
      fieldMeta:
+        {"$threshold":{"severity":"HIGH","description":"Current guardian minority threshold. Number of guardians required to prove a block."}}
      receivedPermissions:
+        [{"permission":"interact","from":"0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","description":"Minority guardians can prove blocks on the second highest tier."}]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: This contract manages the rollup addresses list, allowing to set the address for a specific chainId-name pair.
      template:
+        "taiko/L1RollupAddressManager"
      description:
+        "This contract manages the rollup addresses list, allowing to set the address for a specific chainId-name pair."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: Verifier contract for ZK-proven batches.
      template:
+        "taiko/SP1Verifier"
      description:
+        "Verifier contract for ZK-proven batches."
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TAIKO. There are several instances of this contract operated by different entities.
      description:
-        "A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities."
+        "A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TAIKO. There are several instances of this contract operated by different entities."
      template:
+        "taiko/DAOFallbackProposer"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: Contract managing SGX attestation certificates.
      template:
+        "taiko/AutomataDcapV3Attestation"
      description:
+        "Contract managing SGX attestation certificates."
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: Shared vault for Taiko chains for bridged ERC20 tokens.
      template:
+        "taiko/SharedERC20Vault"
      description:
+        "Shared vault for Taiko chains for bridged ERC20 tokens."
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.
      template:
+        "taiko/SignalService"
      description:
+        "The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      template:
+        "taiko/SgxVerifier"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: Shared bridge for Taiko chains for bridged ETH.
      template:
+        "taiko/TaikoBridge"
      description:
+        "Shared bridge for Taiko chains for bridged ETH."
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$members:
+        ["0x000012dd12a6D9Dd2045f5E2594f4996b99A5d33","0x1602958A85494cd9C3e0D6672BA0eE42b95B4200","0x0cAC6E2Fd10e92Bf798341Ad0A57b5Cb39DA8D0D","0xd26c4e85BC2fAAc27a320987e340971cF3b47d51","0xC384B679c028787166b9B3725aC14A60da205861","0x1DB8Ac9f19AbdD60A6418383BfA56A4450aa80C6","0x5CfEb9a72256B1b49dc2C98b1b7b99d172D50B68","0xd6BB974bc47626E3547426efa4CA2A8d7DFCccdf"]
+++ description: Current guardian threshold. Number of guardians required to prove a block.
+++ severity: HIGH
      values.$threshold:
+        6
      template:
+        "taiko/GuardianProver"
      fieldMeta:
+        {"$threshold":{"severity":"HIGH","description":"Current guardian threshold. Number of guardians required to prove a block."}}
      receivedPermissions:
+        [{"permission":"interact","from":"0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","description":"Guardians, acting as a multisig, can prove blocks on the highest tier."},{"permission":"interact","from":"0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","description":"as the chain watchdog, it can pause proving of blocks."}]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: This contract manages the shared addresses for Taiko rollups.
      template:
+        "taiko/L1SharedAddressManager"
      description:
+        "This contract manages the shared addresses for Taiko rollups."
    }
```

Generated with discovered.json: 0xe953c85250eae1e926b530c103144dc8d293b489

# Diff at Tue, 29 Apr 2025 08:19:14 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22297586
- current block number: 22297586

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22297586 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

Generated with discovered.json: 0x90c8a861a277d7e1eac093afd8611e7a56decbbb

# Diff at Thu, 24 Apr 2025 10:31:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22297586
- current block number: 22297586

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22297586 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x44d307a9ec47aA55a7a30849d065686753C86Db6) {
    +++ description: None
      values.active_tiers.4:
-        ["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"]
+        "0x746965725f736778000000000000000000000000000000000000000000000000"
      values.active_tiers.3:
-        ["0x746965725f736778000000000000000000000000000000000000000000000000"]
+        "0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"
      values.active_tiers.2:
-        ["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"]
+        "0x746965725f677561726469616e00000000000000000000000000000000000000"
      values.active_tiers.1:
-        ["0x746965725f677561726469616e00000000000000000000000000000000000000"]
+        "0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"
      values.active_tiers.0:
-        ["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"]
+        "0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x1bfe906931f5a55c95b8a523287b23652159e3aa

# Diff at Fri, 18 Apr 2025 18:11:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1dee5bc960c23f20e33ad3548023a46f9d9c2128 block: 21973872
- current block number: 22297586

## Description

Update RiscZeroGroth16Verifier.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.verifier_RISCZERO_GROTH16_VERIFIER:
-        "0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9"
+        "0x48E32eFbe22e180A3FFe617f4955cD83B983dd98"
    }
```

```diff
-   Status: DELETED
    contract RiscZeroGroth16Verifier (0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0x48E32eFbe22e180A3FFe617f4955cD83B983dd98)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@21973872 => .flat}/RiscZeroGroth16Verifier.sol         | 8 +++-----
 1 file changed, 3 insertions(+), 5 deletions(-)
```

Generated with discovered.json: 0x905eec349be76b315b91b7ffab9eb55ce7e13103

# Diff at Thu, 10 Apr 2025 14:43:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 21973872
- current block number: 21973872

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21973872 (main branch discovery), not current.

```diff
    contract SP1RemoteVerifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371) {
    +++ description: SP1Verifier is a contract used to verify proofs given public values and verification key.
      displayName:
-        "SP1Verifier"
    }
```

Generated with discovered.json: 0xe8b260db4ece65e96c52859473309acd07b7c026

# Diff at Thu, 03 Apr 2025 14:55:22 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@87156896058912c79002d4129b054942ff1352e9 block: 21973872
- current block number: 21973872

## Description

Templatized SP1Verifier.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21973872 (main branch discovery), not current.

```diff
    contract SP1RemoteVerifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371) {
    +++ description: SP1Verifier is a contract used to verify proofs given public values and verification key.
      template:
+        "succinct/SP1Verifier"
      displayName:
+        "SP1Verifier"
      description:
+        "SP1Verifier is a contract used to verify proofs given public values and verification key."
    }
```

Generated with discovered.json: 0xdfe96ceccfa57f816460528d311c383965924c85

# Diff at Tue, 18 Mar 2025 08:14:21 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21973872
- current block number: 21973872

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21973872 (main branch discovery), not current.

```diff
    contract Taiko Multisig (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      name:
-        "TaikoAdmin"
+        "Taiko Multisig"
    }
```

Generated with discovered.json: 0xd34a164de618a60754f0228d212eafe99bfe82d9

# Diff at Tue, 04 Mar 2025 13:38:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@40abad0e9dad8439d751a811eb767233c5a70a2f block: 21938094
- current block number: 21973872

## Description

Taiko admin multisig signer change.

## Watched changes

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.0:
-        "0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
+        "0x0F026a3efE44E0Fe34B87375EFe69b16c05D0438"
    }
```

```diff
-   Status: DELETED
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a)
    +++ description: None
```

## Source code changes

```diff
.../.flat@21938094/Safe/Safe.sol => /dev/null      | 1088 --------------------
 .../Safe/SafeProxy.p.sol => /dev/null              |   37 -
 2 files changed, 1125 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21938094 (main branch discovery), not current.

```diff
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169) {
    +++ description: None
      sinceBlock:
+        19773966
    }
```

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sinceBlock:
+        19773965
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      sinceBlock:
+        19731197
    }
```

```diff
    contract MainnetProverSet (0x280eAbfd252f017B78e15b69580F249F45FB55Fa) {
    +++ description: None
      sinceBlock:
+        21835609
    }
```

```diff
    contract MainnetTierRouter (0x44d307a9ec47aA55a7a30849d065686753C86Db6) {
    +++ description: None
      sinceBlock:
+        21913221
    }
```

```diff
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9) {
    +++ description: None
      sinceBlock:
+        19773966
    }
```

```diff
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc) {
    +++ description: None
      sinceBlock:
+        21127238
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      sinceBlock:
+        19773965
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sinceBlock:
+        19773964
    }
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: None
      sinceBlock:
+        21141069
    }
```

```diff
    contract SP1RemoteVerifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371) {
    +++ description: None
      sinceBlock:
+        21613149
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      sinceBlock:
+        19911920
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      sinceBlock:
+        19773966
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      sinceBlock:
+        19744335
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      sinceBlock:
+        19773965
    }
```

```diff
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a) {
    +++ description: None
      sinceBlock:
+        21278465
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      sinceBlock:
+        19773965
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      sinceBlock:
+        19773963
    }
```

```diff
    contract RiscZeroGroth16Verifier (0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9) {
    +++ description: None
      sinceBlock:
+        21613126
    }
```

Generated with discovered.json: 0x0053ad113edc05a21195e9b85a7648cb175ce75f

# Diff at Thu, 27 Feb 2025 13:52:49 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7afe405a4930423077d17ed79971752d0831e02a block: 21844977
- current block number: 21938094

## Description

The forced zk tiers for the DAO fallback proposer have been removed. Any proposer/challenger/prover can choose among the 5 tiers:
- tiers_[0] = LibTiers.TIER_SGX;
- tiers_[1] = LibTiers.TIER_ZKVM_RISC0;
- tiers_[2] = LibTiers.TIER_ZKVM_SP1;
- tiers_[3] = LibTiers.TIER_GUARDIAN_MINORITY;
- tiers_[4] = LibTiers.TIER_GUARDIAN;

Update MainnetTierRouter with new cooldown and proving periods, new validity bond values (see above which tiers are active):

| Tier | Parameter | Before | After |
|------|-----------|--------|-------|
| **TIER_OPTIMISTIC** | validityBond | 75 TKO | 50 TKO |
|  | contestBond | 492.19 TKO | 328.13 TKO |
|  | cooldownPeriod | 24 hours | 24 hours |
|  | provingPeriod | 4.25 hours | 1 hour |
| **TEE Tiers** (SGX, TDX, TEE_ANY) | validityBond | 150 TKO | 100 TKO |
|  | contestBond | 984.38 TKO | 656.25 TKO |
|  | cooldownPeriod | 4 hours | 4 hours |
|  | provingPeriod | 5 hours | 5 hours |
| **ZKVM Tiers** (RISC0, SP1, ANY, AND_TEE) | validityBond | 225 TKO | 150 TKO |
|  | contestBond | 1476.56 TKO | 984.38 TKO |
|  | cooldownPeriod | 4 hours | 4 hours |
|  | provingPeriod | 7 hours | 7 hours |
| **TIER_GUARDIAN_MINORITY** | validityBond | 225 TKO | 200 TKO |
|  | contestBond | 1476.56 TKO | 1312.5 TKO |
|  | cooldownPeriod | 4 hours | 4 hours |
|  | provingPeriod | 0 hours | 2 hours |
| **TIER_GUARDIAN** | validityBond | 0 TKO | 0 TKO |
|  | contestBond | 0 TKO | 0 TKO |
|  | cooldownPeriod | 4 hours | 8 hours |
|  | provingPeriod | 0 hours | 0 hours |

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xb0f9a7fd86a26f933460b09bf9ddb6f3fcb1926850109b97c24801d6230186e3"
+        "0x8c8d91a3b010953954bbd3ba9f4c55f76112bf6d7f298dcd584c2de94a4ad1a4"
      values.$implementation:
-        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
+        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
      values.$pastUpgrades.23:
+        ["2025-02-27T03:27:23.000Z","0x6368890b9aa2f87c6a6b727efdd8af0ea357a11460b546d8a7f3e19e38a34e41",["0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"]]
      values.$upgradeCount:
-        23
+        24
      values.impl:
-        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
+        "0x5110634593Ccb8072d161A7d260A409A7E74D7Ca"
      values.tier_router:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
+        "0x44d307a9ec47aA55a7a30849d065686753C86Db6"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x44d307a9ec47aA55a7a30849d065686753C86Db6)
    +++ description: None
```

## Source code changes

```diff
.../MainnetTierRouter.sol                          | 92 ++++++++++------------
 .../TaikoL1Contract/MainnetTaikoL1.sol             |  2 +-
 2 files changed, 41 insertions(+), 53 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21844977 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xda5cba7130c3b689c9358371f2d5d13f14e6e2e3

# Diff at Fri, 14 Feb 2025 13:24:42 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21630233
- current block number: 21844977

## Description

TaikoL1 upgrade:
- old proposeBlock() removed
- formatting, comments, small fixes

TierRouter:
- RISC0 from 1/200 to 1/1000
- SP1 from 1/40 to 1/10
...of daofallback proposer batches

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
+        "0xb0f9a7fd86a26f933460b09bf9ddb6f3fcb1926850109b97c24801d6230186e3"
      values.$implementation:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
      values.$pastUpgrades.22:
+        ["2025-02-13T06:57:47.000Z","0xc0e8ec30d1479ca2414d4d28a09a543c2845247d80387f78c179d663ffe55c3c",["0x2784423f7c61Bc7B75dB6CdA26959946f437588D"]]
      values.$upgradeCount:
-        22
+        23
      values.impl:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0x2784423f7c61Bc7B75dB6CdA26959946f437588D"
      values.prover_set:
-        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
+        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
      values.tier_router:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
+        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      sourceHashes.1:
-        "0x62ec48ec56b8eb6e604ca35e87dca2922adb6e914b1922139a0ae932750abd61"
+        "0x397ca5d98f464f3096b2ba95f9057ebbc27c56e4d878ebbae83c911594dd7c5b"
      values.$implementation:
-        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
+        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
      values.$pastUpgrades.10:
+        ["2025-02-13T06:57:47.000Z","0xc0e8ec30d1479ca2414d4d28a09a543c2845247d80387f78c179d663ffe55c3c",["0x280eAbfd252f017B78e15b69580F249F45FB55Fa"]]
      values.$upgradeCount:
-        10
+        11
      values.impl:
-        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
+        "0x280eAbfd252f017B78e15b69580F249F45FB55Fa"
    }
```

```diff
-   Status: DELETED
    contract MainnetProverSet (0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetProverSet (0x280eAbfd252f017B78e15b69580F249F45FB55Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

## Source code changes

```diff
.../DAOFallbackProposer/MainnetProverSet.sol       |    2 +-
 .../{.flat@21630233 => .flat}/MainnetProverSet.sol | 1060 ++++---
 .../MainnetTierRouter.sol                          |    4 +-
 .../TaikoL1Contract/MainnetTaikoL1.sol             | 3306 +++++++++++++-------
 4 files changed, 2733 insertions(+), 1639 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630233 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x8a1c79501de149df651427ca05a7b5a7261674a2

# Diff at Mon, 20 Jan 2025 11:10:16 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21630233
- current block number: 21630233

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630233 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.13.target:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.13.from:
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      receivedPermissions.12.target:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      receivedPermissions.12.from:
+        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      receivedPermissions.11.target:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.11.from:
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.10.target:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      receivedPermissions.10.from:
+        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      receivedPermissions.9.target:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.9.from:
+        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.8.target:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.8.from:
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.7.target:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.7.from:
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.6.target:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.6.from:
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.5.target:
-        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.5.from:
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.4.target:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      receivedPermissions.4.from:
+        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      receivedPermissions.3.target:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      receivedPermissions.3.from:
+        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      receivedPermissions.2.target:
-        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      receivedPermissions.2.from:
+        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      receivedPermissions.1.target:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.1.from:
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      receivedPermissions.0.target:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
      receivedPermissions.0.from:
+        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      issuedPermissions.0.to:
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

Generated with discovered.json: 0x708458d8bd375f8f63e7efac661f610f1b8e307a

# Diff at Wed, 15 Jan 2025 13:39:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21543865
- current block number: 21630233

## Description

Upgrade of both RISC0 and SP1 verifier contracts.

### SP1Verifier

v3.0.0 -> v4.0.0-rc.3

All-new verifier with new verifier hash: https://github.com/succinctlabs/sp1/releases/tag/v4.0.0-rc.1 ('not production ready').

### RiscZeroGroth16Verifier

v1.1.2 -> v1.2.0

Adds a new Interface `IRiscZeroSelectable` for easily querying the selector. No changes to the zk verification itself 

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.sp1_remote_verifier:
-        "0x2D33d748644dAb8B3FB0E07642d9dE96b816d067"
+        "0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371"
      values.verifier_RISCZERO_GROTH16_VERIFIER:
-        "0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D"
+        "0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9"
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0x2D33d748644dAb8B3FB0E07642d9dE96b816d067)
    +++ description: None
```

```diff
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452) {
    +++ description: None
      values.sp1RemoteVerifier:
-        "0x2D33d748644dAb8B3FB0E07642d9dE96b816d067"
+        "0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371"
    }
```

```diff
-   Status: DELETED
    contract RiscZeroGroth16Verifier (0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1RemoteVerifier (0x68593ad19705E9Ce919b2E368f5Cb7BAF04f7371)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0xf31DE43cc0cF75245adE63d3Dabf58d4332855e9)
    +++ description: None
```

## Source code changes

```diff
.../RiscZeroGroth16Verifier.sol                    | 19 ++++++++--
 .../SP1RemoteVerifier.sol}                         | 42 +++++++++++-----------
 .../SP1Verifier}/ERC1967Proxy.p.sol                |  0
 .../SP1Verifier}/SP1Verifier.sol                   |  0
 4 files changed, 38 insertions(+), 23 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543865 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x2D33d748644dAb8B3FB0E07642d9dE96b816d067) {
    +++ description: None
      name:
-        "SP1RemoteVerifier"
+        "SP1Verifier"
    }
```

Generated with discovered.json: 0x3af5b8c874ed7b4ffc3fba396a08c1387641f74f

# Diff at Fri, 03 Jan 2025 12:10:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21486439
- current block number: 21543865

## Description

MS signer change.

## Watched changes

```diff
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a) {
    +++ description: None
      values.$members.0:
-        "0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268"
+        "0x30bc4C0Baf55A37Ccf2d626Bc592bd7715b75De2"
    }
```

Generated with discovered.json: 0xa77a20fd111c2d69a312bfc27d0b3bb57907dba5

# Diff at Thu, 26 Dec 2024 11:48:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e29d1319d91d7959f43ee6476f8bc351dd60d254 block: 21471383
- current block number: 21486439

## Description

Tiny change in the MainnetTierRouter, resetting the probabilities for forced validity proofs via the DAO proposer to the old ~1/200, ~1/40 for RISC0 and SP1 respectively. No other changes.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xad202d72005832c623578708f77802197e8a681c1621f57c1106161858ba2dca"
+        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
      values.$implementation:
-        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.$pastUpgrades.21:
+        ["2024-12-24T14:19:11.000Z","0x77871837d1749b22a7991da475e657baa4371937f5a8cb094d4e170db000cb25",["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"]]
      values.$upgradeCount:
-        21
+        22
      values.impl:
-        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.tier_router:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
+        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

## Source code changes

```diff
.../taiko/ethereum/{.flat@21471383 => .flat}/MainnetTierRouter.sol    | 4 ++--
 .../{.flat@21471383 => .flat}/TaikoL1Contract/MainnetTaikoL1.sol      | 2 +-
 2 files changed, 3 insertions(+), 3 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21471383 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66","0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xfd29c8ce35d6e4ecf0081c09c3e9e4dbe718e3a8

# Diff at Tue, 24 Dec 2024 09:17:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@799e77243e46787b5be6a47a301a3e1069bfa010 block: 21465570
- current block number: 21471383

## Description

Validity proofs reinstated as before (same SP1 and RISC0 contracts), but with new probabilities for the DAO proposer: RISC0 ~1/1000 and SP1 ~1/100.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
+        "0xad202d72005832c623578708f77802197e8a681c1621f57c1106161858ba2dca"
      values.$implementation:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
      values.$pastUpgrades.20:
+        ["2024-12-23T14:55:47.000Z","0x9c2f36af40c0004110041fc45d980b73b0c8dde8064713a55aeb6f69fca77a99",["0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"]]
      values.$upgradeCount:
-        20
+        21
      values.impl:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xd4896d4537c6425aC5d89B9f122d4E4ac4D65e1c"
      values.tier_router:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
+        "0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8a4c692F12d3a9750E744A4CE24a1d351bE52E66)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@21465570 => .flat}/MainnetTierRouter.sol    | 18 +++++++++++++-----
 .../TaikoL1Contract/MainnetTaikoL1.sol                 |  2 +-
 2 files changed, 14 insertions(+), 6 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465570 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xfb12a68660b6a4aa06afff957e7c62a02790766d

# Diff at Mon, 23 Dec 2024 13:46:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21334445
- current block number: 21465570

## Description

New TierRouter, removing all validity proofs, leaving only SGX (minTier) and Guardians.

New DAOFallbackProposer refactors some minor things and deprecates the v1 proposals (only v2 possible).

Other changes are only related to the new TierRouter address.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
+        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
      values.$implementation:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.19:
+        ["2024-12-23T03:12:35.000Z","0xe66aba9f8bfcd86dc0ae32416862ca61a51c47f8ec747799e65f155ef27eeb20",["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]]
      values.$pastUpgrades.18:
+        ["2024-12-23T02:45:11.000Z","0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944",["0xb74A66b6CF50AD63E29669F0BDE4354E11758162"]]
      values.$upgradeCount:
-        18
+        20
      values.impl:
-        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.tier_router:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
+        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes.1:
-        "0xe3ef3bce11823157fe0b3d8d8705554e47a8789445c2a255990ca15564e7e945"
+        "0x9dede6e55b7b0db6226ea3cead125c4750d147ad96cef774a61e51e8e9ce6d36"
      values.$implementation:
-        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
+        "0x0079a79E5d8DDA67029051d505E5A11DE279B36D"
      values.$pastUpgrades.10:
+        ["2024-12-23T02:45:11.000Z","0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944",["0x0079a79E5d8DDA67029051d505E5A11DE279B36D"]]
      values.$upgradeCount:
-        10
+        11
      values.impl:
-        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
+        "0x0079a79E5d8DDA67029051d505E5A11DE279B36D"
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      sourceHashes.1:
-        "0x6c2e43f356e499e332ee9b82cb8ae970dbe6209146e72d925e9d9f22f5b791e1"
+        "0x62ec48ec56b8eb6e604ca35e87dca2922adb6e914b1922139a0ae932750abd61"
      values.$implementation:
-        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
+        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
      values.$pastUpgrades.9:
+        ["2024-12-23T02:45:11.000Z","0xfa949022e61921e108974e73130e94fc5120463f2c537d26626e5cee2120c944",["0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"]]
      values.$upgradeCount:
-        9
+        10
      values.impl:
-        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
+        "0xd0d3f025D83D7122de7eC43e86331C57c8A4F30B"
    }
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

## Source code changes

```diff
.../DAOFallbackProposer/MainnetProverSet.sol       | 138 ++++++++++++---------
 .../MainnetRollupAddressManager.sol                |   2 +-
 .../MainnetTierRouter.sol                          |  18 +--
 .../TaikoL1Contract/MainnetTaikoL1.sol             |   2 +-
 4 files changed, 85 insertions(+), 75 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21334445 (main branch discovery), not current.

```diff
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f7a6b766d5f72697363300000000000000000000000000000000000"],["0x746965725f7a6b766d5f73703100000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
      values.TIER_RISC0:
-        {"verifierName":"0x746965725f7a6b766d5f72697363300000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.TIER_SP1:
-        {"verifierName":"0x746965725f7a6b766d5f73703100000000000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0","0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_RISC0":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SP1":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xb743e863628c6723e5473668100ddb074e410ed7

# Diff at Thu, 05 Dec 2024 06:17:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 21215436
- current block number: 21334445

## Description

One TaikoAdmin MS member changed to a sub-safe.

## Watched changes

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.$members.0:
-        "0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268"
+        "0xb47fE76aC588101BFBdA9E68F66433bA51E8029a"
    }
```

```diff
+   Status: CREATED
    contract Safe (0xb47fE76aC588101BFBdA9E68F66433bA51E8029a)
    +++ description: None
```

## Source code changes

```diff
.../taiko/ethereum/.flat/Safe/Safe.sol             | 1088 ++++++++++++++++++++
 .../taiko/ethereum/.flat/Safe/SafeProxy.p.sol      |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xea65667fba3c7f9645243f698b73ace7a9ceb06a

# Diff at Mon, 18 Nov 2024 15:16:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b96351d6b064647cdbc4d127955822597fb5d9e0 block: 21122769
- current block number: 21215436

## Description
 
These upgrades contain the parameter changes and new deployments that activate Multiproofs, in particular the new ZK-VM tierIds 250 (ZKVM_RISC0) and 251 (ZKVM_SP1).

Current active tiers:
-  200: SGX
-  250: RISC0
-  251: SP1
-  900: guardian minority
- 1000: guardian

A higher tier can be used to challenge a lower tier before the tier-specific cooldown period has passed. A challenge resets the cooldown window for the proof.

The ZK tiers are generally not enforced and can always be contested by the higher Guardian tiers.

In the case of a block being proposed by the `DAO_FALLBACK_PROPOSER` (the ProverSetProxy contract that is used by Taiko and proposes almost all batches), the **minimum proof tier** is determined pseudorandomly at the time of a batch proposal based on a hash depending on the number of blocks in the batch (`keccak256(abi.encode("TAIKO_DIFFICULTY", local.b.numBlocks))`). It can be either of RISC0, SP1 or SGX with certain hardcoded probabilities.

Current probabilities assuming a uniformly random input (keccak256) to the function and the dao fallback proposer:
- RISC0: 0.5% or 1/200
- SP1: 2.5% or 1/40
- SGX: 97%

If any other (not dao_fallback) proposer proposes a batch by posting the required validity bond, the minimum-tier is always SGX.

Both zk-vm verifiers are currently used multiple times per day.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
+        "0x5ced94c638514ff09ace408fda7efb4bd52077a7e9ce2f20e154419454ac3869"
      values.$implementation:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.$pastUpgrades.17:
+        ["2024-11-10T16:10:23.000Z","0x5eb57ab352b3e3c1ddbc3fe468d582901b88c6a137ce49b0d70857d5218d626d",["0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"]]
      values.$pastUpgrades.16:
+        ["2024-11-10T15:46:23.000Z","0x5efedb806fca83936c58f9e4d30644257ce3a529239131b0b19f630320bcfb04",["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]]
      values.$pastUpgrades.15:
+        ["2024-11-10T15:32:47.000Z","0xa9e285d0f2cc84161ac3fc28962003779e9a618271bd6a54b16fb4001ede5b38",["0x0205ea1e1162bc50E1030F36412E5Dd69daA4040"]]
      values.$upgradeCount:
-        15
+        18
      values.bond_token:
-        "0x0000000000000000000000000000000000000000"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      values.impl:
-        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
+        "0xe7c4B445D3C7C8E4D68afb85A068F9fAa18e9A5B"
      values.sp1_remote_verifier:
-        "0x0000000000000000000000000000000000000000"
+        "0x2D33d748644dAb8B3FB0E07642d9dE96b816d067"
      values.tier_router:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
+        "0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0"
      values.verifier_RISCZERO_GROTH16_VERIFIER:
-        "0x0000000000000000000000000000000000000000"
+        "0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D"
      values.verifier_TIER_ZKVM_RISC0:
-        "0x0000000000000000000000000000000000000000"
+        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
      values.verifier_TIER_ZKVM_SP1:
-        "0x0000000000000000000000000000000000000000"
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes.1:
-        "0x5782d554c7b5637e1f166c61be43d34b6d44dabccd12fea3ed904f2988502d79"
+        "0xe3ef3bce11823157fe0b3d8d8705554e47a8789445c2a255990ca15564e7e945"
      values.$implementation:
-        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
+        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
      values.$pastUpgrades.9:
+        ["2024-11-10T05:21:47.000Z","0x43353a74df973d8f6a379b5c8815ac80935a5099f8ab93a4aa204eb5ef2c663e",["0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"]]
      values.$pastUpgrades.8:
+        ["2024-11-08T08:35:47.000Z","0x5d46840df79d8df508880675e7ea549e9b46137f597ca520c3e0c979439441d1",["0x6D8e6e1a061791AD17A55De5e15a111c58f6Fb3D"]]
      values.$upgradeCount:
-        8
+        10
      values.impl:
-        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
+        "0x52CA3c5566d779b3c6bb5c4f760Ea39E294Fc788"
    }
```

```diff
-   Status: DELETED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","target":"0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"}
      receivedPermissions.12:
+        {"permission":"upgrade","target":"0xE3D777143Ea25A6E031d1e921F396750885f43aC"}
      receivedPermissions.11.target:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      receivedPermissions.10.target:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
+        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      receivedPermissions.9.target:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      receivedPermissions.8.target:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      receivedPermissions.7.target:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
      receivedPermissions.6.target:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      receivedPermissions.5.target:
-        "0x8d7C954960a36a7596d7eA4945dDf891967ca8A3"
+        "0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452"
      receivedPermissions.4.target:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      receivedPermissions.3.target:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
+        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      receivedPermissions.2.target:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
+        "0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc"
    }
```

```diff
+   Status: CREATED
    contract SP1RemoteVerifier (0x2D33d748644dAb8B3FB0E07642d9dE96b816d067)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x394E30d83d020469a1F8b16E89D7fD5FdB1935b0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Risc0Verifier (0x55902b2D3DF2A65370A89C86Ae9dd71Ecd508edc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x5c44f2239925b0d86d2BFEe539f19CD0A08Af452)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (0xcF706D99C265fC2349AE43c5f6BFD7931FE5308D)
    +++ description: None
```

## Source code changes

```diff
.../MainnetRollupAddressManager.sol                |   68 +-
 .../MainnetTierRouter.sol                          |   18 +-
 .../.flat/Risc0Verifier/ERC1967Proxy.p.sol         |  594 +++++++
 .../ethereum/.flat/Risc0Verifier/Risc0Verifier.sol | 1823 +++++++++++++++++++
 .../ethereum/.flat/RiscZeroGroth16Verifier.sol     | 1656 ++++++++++++++++++
 .../taiko/ethereum/.flat/SP1RemoteVerifier.sol     | 1432 +++++++++++++++
 .../ethereum/.flat/SP1Verifier/ERC1967Proxy.p.sol  |  594 +++++++
 .../ethereum/.flat/SP1Verifier/SP1Verifier.sol     | 1825 ++++++++++++++++++++
 .../TaikoL1Contract/MainnetTaikoL1.sol             |    2 +-
 9 files changed, 7978 insertions(+), 34 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21122769 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.preconf_registry:
-        "0x0000000000000000000000000000000000000000"
      values.bond_token:
+        "0x0000000000000000000000000000000000000000"
      values.preconf_task_manager:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_OPTIMISTIC:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract DAOFallbackProposer (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities.
      name:
-        "ProverSetProxy"
+        "DAOFallbackProposer"
      description:
-        "A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO."
+        "A contract that holds TAIKO token and acts as a Taiko Labs owned proposer and prover proxy. This contract relays `proveBlock` calls to the TaikoL1 contract so that msg.sender doesn't need to hold any TKO. There are several instances of this contract operated by different entities."
    }
```

```diff
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542) {
    +++ description: None
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"75000000000000000000","contestBond":"492187500000000000000","cooldownWindow":1440,"provingWindow":255,"maxBlocksToVerifyPerProof":0}
      values.tier_provider:
-        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"150000000000000000000","contestBond":"984375000000000000000","cooldownWindow":240,"provingWindow":300,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7a6b766d5f616e645f746565000000000000000000000000000000","validityBond":"225000000000000000000","contestBond":"1476562500000000000000","cooldownWindow":240,"provingWindow":420,"maxBlocksToVerifyPerProof":0}
      values.getProvider:
+        ["0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542","0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getProvider":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x24f4cff1e2dad6e4e71802e79ed4a5c720ca24aa

# Diff at Tue, 05 Nov 2024 16:54:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21027555
- current block number: 21122769

## Description

Taiko ['Ontake' upgrade](https://taiko.mirror.xyz/OJA4SwCqHjF32Zz0GkNJvnHWlsRYzdJ6hcO9FXVOpLs).
- batching (for proposing and proving)
- new verifier slots (SP1, Risc0) (0x00 atm)
- new Block struct in preconf preparations (preconfRegistry set to 0x00)
- integration of the TierProvider into the MainnetTierRouter
- new TIER_SGX challengePeriod of 4h (down from 1d)

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xa2bfa567075799db54daaa89afafea79e42c73c36c23112c79926407116d0765"
+        "0xeeb07b10bec4783237afadc9ac7b0e746138695fef1f85996e97012e2e83b6df"
      values.$implementation:
-        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.$pastUpgrades.14:
+        ["2024-11-03T05:15:23.000Z","0x78ca7c7d9c7e5aa9c5e6ab80e0229289a8d3bc8df2c2b9ba6baa74a0f60a0703",["0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"]]
      values.$pastUpgrades.13:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x4229d14F520848aa83760Cf748abEB8A69cdaB2d"]]
      values.$upgradeCount:
-        13
+        15
      values.getConfig.checkEOAForCalldataDA:
-        true
      values.getConfig.maxAnchorHeightOffset:
+        64
      values.getConfig.baseFeeConfig:
+        {"adjustmentQuotient":8,"sharingPctg":75,"gasIssuancePerSecond":5000000,"minGasExcess":1340000000,"maxGasIssuancePerBlock":600000000}
      values.getConfig.ontakeForkHeight:
+        538304
      values.impl:
-        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
+        "0xA3E75eDA1Be2114816f388A5cF53EbA142DCDB17"
      values.tier_router:
-        "0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a"
+        "0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542"
    }
```

```diff
-   Status: DELETED
    contract TierProviderV2 (0x3a1A900680BaADb889202faf12915F7E47B71ddd)
    +++ description: None
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      sourceHashes.1:
-        "0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"
+        "0x489b7169b5c7aa13cbb8928934057ad78b37ce9b52651656bf8bda7759533f68"
      values.$implementation:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
      values.$pastUpgrades.6:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"]]
      values.$upgradeCount:
-        6
+        7
      values.impl:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes.1:
-        "0x06f614affc4908aeeac9faa505010855388740ee8e5ba632fbc0e5f56ee8927d"
+        "0x5782d554c7b5637e1f166c61be43d34b6d44dabccd12fea3ed904f2988502d79"
      values.$implementation:
-        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
+        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
      values.$pastUpgrades.7:
+        ["2024-11-02T12:04:59.000Z","0xf26d0526aa4b8225c603720ce0dc016803188b959c50677d5446087d1f2c4e60",["0x190D5d50D98D2202a618f75B2fD9986e60E096be"]]
      values.$pastUpgrades.6:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x3202Fc255aE09F91DbbD5b000b87dA4A2E04eE37"]]
      values.$upgradeCount:
-        6
+        8
      values.impl:
-        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
+        "0x190D5d50D98D2202a618f75B2fD9986e60E096be"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      sourceHashes.1:
-        "0x020f0e8ece4630d3f7e6458ef5f1d86c5408ed344c580633e3f32e53393ceab5"
+        "0x6c2e43f356e499e332ee9b82cb8ae970dbe6209146e72d925e9d9f22f5b791e1"
      values.$implementation:
-        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
+        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
      values.$pastUpgrades.8:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"]]
      values.$upgradeCount:
-        8
+        9
      values.impl:
-        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
+        "0x3022Ed0346CCE0c08268c8ad081458AfD95E8763"
    }
```

```diff
-   Status: DELETED
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a)
    +++ description: None
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      sourceHashes.1:
-        "0x3c7adf8e3200906bd67dec9e0b73fb813681e84ba1499dcede6987370ce146c9"
+        "0x0112b81e89b367f8ffeb6b571bd245b1be7a1279474ffa11591f8374a2c8b14f"
      values.$implementation:
-        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
+        "0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
      values.$pastUpgrades.7:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"]]
      values.$upgradeCount:
-        7
+        8
      values.impl:
-        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
+        "0xb20C8Ffc2dD49596508d262b6E8B6817e9790E63"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      sourceHashes.1:
-        "0xa5cf6831e233f05c8a2f677c311dd359c75850355d61417bc5201d493db30039"
+        "0xf99b7d5f650d3734e945c5040d8e4776dfdc97ff745666e084c1d471b7973f38"
      values.$implementation:
-        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
+        "0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
      values.$pastUpgrades.5:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"]]
      values.$upgradeCount:
-        5
+        6
      values.impl:
-        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
+        "0x45fed11Ba70D4217545F18E27DDAF7D76Ff499f3"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      sourceHashes.1:
-        "0xdb8e8268242e52348760b0b2d154955236307b3ef1bc9cb0234fc6c0d01aa70f"
+        "0x076c7d823685a1a394ad6ec677d2d7707207efa9e8e482f479c2cdfd92008904"
      values.$implementation:
-        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
+        "0x81DFEA931500cdcf0460e9EC45FA283A6B7f0838"
      values.$pastUpgrades.5:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x81DFEA931500cdcf0460e9EC45FA283A6B7f0838"]]
      values.$upgradeCount:
-        5
+        6
      values.impl:
-        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
+        "0x81DFEA931500cdcf0460e9EC45FA283A6B7f0838"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      sourceHashes.1:
-        "0x14240ef6b1d8181a009840162a21975c2777f78f27c22e8e550bc66b36357f78"
+        "0x118c20a34164db28141d7fa6496d1fcf9e139354ed77c4e1c3f33e5eaac65977"
      values.$implementation:
-        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
+        "0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
      values.$pastUpgrades.11:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"]]
      values.$upgradeCount:
-        11
+        12
      values.impl:
-        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
+        "0x2705B12a971dA766A3f9321a743d61ceAD67dA2F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      sourceHashes.1:
-        "0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"
+        "0x489b7169b5c7aa13cbb8928934057ad78b37ce9b52651656bf8bda7759533f68"
      values.$implementation:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
      values.$pastUpgrades.6:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"]]
      values.$upgradeCount:
-        6
+        7
      values.impl:
-        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
+        "0xB866E9046CAf4D75e2cbCD8b5eA3f07Ea74F7B47"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      sourceHashes.1:
-        "0xa0dc6b4537f21ed3a4a43a7fb74645ff827cff8c2b26f2e3e4350ddec470c990"
+        "0x61eadd250e6fee2eea7d778ca5fdb6e04b0fa09044c65eba836b397f585e5535"
      values.$implementation:
-        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
+        "0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
      values.$pastUpgrades.4:
+        ["2024-11-01T09:20:35.000Z","0x13ea4d044a313cf667d16514465e6b96227ef7198bda7b19c70eefee44e9bccd",["0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"]]
      values.$upgradeCount:
-        4
+        5
      values.impl:
-        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
+        "0xEC1a9aa1C648F047752fe4eeDb2C21ceab0c6449"
    }
```

```diff
+   Status: CREATED
    contract MainnetTierRouter (0x8f1C1D58C858e9a9eeCc587d7D51AECfd16b5542)
    +++ description: None
```

## Source code changes

```diff
.../MainnetGuardianProver.sol                      |  537 +++-
 .../GuardianProver/MainnetGuardianProver.sol       |  537 +++-
 .../MainnetRollupAddressManager.sol                |  305 +-
 .../MainnetSharedAddressManager.sol                |  247 +-
 .../taiko/ethereum/.flat/MainnetTierRouter.sol     |  223 ++
 .../ProverSetProxy/MainnetProverSet.sol            |  986 ++++---
 .../SgxVerifier/MainnetSgxVerifier.sol             |  467 ++-
 .../SharedERC20Vault/MainnetERC20Vault.sol         |  255 +-
 .../SignalService/MainnetSignalService.sol         |  526 ++--
 .../TaikoBridge/MainnetBridge.sol                  |  371 ++-
 .../TaikoL1Contract/MainnetTaikoL1.sol             | 3040 +++++++++++---------
 .../.flat@21027555/TierProviderV2.sol => /dev/null |  160 --
 .../.flat@21027555/TierRouter.sol => /dev/null     |   16 -
 13 files changed, 4490 insertions(+), 3180 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21027555 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.verifier_TIER_SGX_ZKVM:
-        "0x0000000000000000000000000000000000000000"
      values.preconf_registry:
+        "0x0000000000000000000000000000000000000000"
      values.sp1_remote_verifier:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_RISCZERO_GROTH16_VERIFIER:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_TDX:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_TEE_ANY:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_AND_TEE:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_ANY:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_RISC0:
+        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_ZKVM_SP1:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract TierProviderV2 (0x3a1A900680BaADb889202faf12915F7E47B71ddd) {
    +++ description: None
      name:
-        "TierProvider"
+        "TierProviderV2"
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
      values.TIER_GUARDIAN:
-        {"verifierName":"0x746965725f677561726469616e00000000000000000000000000000000000000","validityBond":0,"contestBond":0,"cooldownWindow":1440,"provingWindow":2880,"maxBlocksToVerifyPerProof":0}
      values.TIER_GUARDIAN_MINORITY:
-        {"verifierName":"0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","validityBond":"250000000000000000000","contestBond":"1640000000000000000000","cooldownWindow":240,"provingWindow":2880,"maxBlocksToVerifyPerProof":0}
      values.TIER_OPTIMISTIC:
-        {"verifierName":"0x0000000000000000000000000000000000000000000000000000000000000000","validityBond":"125000000000000000000","contestBond":"250000000000000000000","cooldownWindow":1440,"provingWindow":15,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX:
-        {"verifierName":"0x746965725f736778000000000000000000000000000000000000000000000000","validityBond":"125000000000000000000","contestBond":"820000000000000000000","cooldownWindow":1440,"provingWindow":60,"maxBlocksToVerifyPerProof":0}
      values.TIER_SGX_ZKVM:
-        {"verifierName":"0x746965725f7367785f7a6b766d00000000000000000000000000000000000000","validityBond":"250000000000000000000","contestBond":"1640000000000000000000","cooldownWindow":1440,"provingWindow":240,"maxBlocksToVerifyPerProof":0}
      values.getMinTier:
+        [200,200,200,200,200]
      fieldMeta:
-        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
      errors:
+        {"getMinTier":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a) {
    +++ description: None
      values.tier_provider:
-        "0x3a1A900680BaADb889202faf12915F7E47B71ddd"
      values.getProvider:
+        ["0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd","0x3a1A900680BaADb889202faf12915F7E47B71ddd"]
      errors:
+        {"getProvider":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x993c841b015e9f5d5325d2fe8b629c9fcc27632a

# Diff at Wed, 23 Oct 2024 10:01:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 20977175
- current block number: 21027555

## Description

Config: Remove instances monitoring from SgxVerifier contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977175 (main branch discovery), not current.

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.instances:
-        [["0x085Bf649bef6b9e97C73822724eD33553C20a1CA"],["0x584240b6296210BdF93E2221aBD69BDb312Dc8af"],["0x412A2aDFe3a7e6D737539E0FF526523a47D86ab3"],["0x3777c454aF69C87df961E92dA99fCF96EdB30683"],["0xf02099f42d499028Ca52a5205d4E21001f5E3525"],["0xC57230B9A1BD4f882c40C9f549a27034474e5962"],["0x4A9d339c94D1D3b685e3923907A98c73b8168AFF"],["0x6F6C0837b2c45B1bfE970bd5a0BB171605cb44F3"],["0x98f0050D3c7ba3B938A98dFBe2024CA5c1E517A9"],["0x9e7ae74CB0CCf4f49f2093097dCeE32C96Bef1a7"],["0x2bcD4D02Fb1c703C6C3f2976e82ea7457D26CB34"],["0xF445C0b580454E21a8b836318D83782d35986666"],["0xe79d80cC4CF385e30473cA41279BC4845c82bb9e"],["0x7D5798Ce898E7E79f60A126eE82a84fE564067B2"],["0x1E0b96e4665E622dcc2F2c11ba7a7dD8Bc1fDD8A"],["0x7eAb069309335b615cC99545542d9d3FDeb46534"],["0x1dE96F45CB6f78aBC35F0DfD68Cf356691B429da"],["0xBfDa132503F664d6B4c2cA4B1f41413956bB6ab1"],["0x25C1069AdA9D2E3c6e9706cAA6b5494062E27679"],["0x87f1bf0A503b025684136cdE16dd606De4f46b67"],["0xb0E92092bAAab77ba628CC5cD91397Ca4b675ec0"],["0x76BEc9620cbc4b15422CC8726a07765736A52Dd0"],["0x6037E46fDdB6278e2fc5BbC87bBf5AD040A7C38D"],["0xB22148BC3819b1519e0b21e667D0F4F183CDC20c"],["0xbf690e318D5C183D9ad1A626a0bd1DafD605b126"],["0x374DC646a6EDaDcCA4D653677444b5bb803CdfD4"],["0x70f067776426EBeB33aee88DEb03CD6C57DAE703"],["0x84f272246697d5C872890AfB6A5FbD5524ebcFef"],["0x40A2D3c20d766280C71EcE4E4aD4edF135C35634"],["0x0b0dEf1167893541cF8F951A8d627e206Ef2c47E"],["0x2C4DBAD36A5b7d59eAc38def94D9bBEa3b6D351B"],["0x0568b34255fc451F651d3021b0ee66DE80210A14"],["0x8033455650e71FF8376974AC8A7D6f4aEecad17c"],["0x6Ac9022c4bFBE548aA2621f9E10fA485EC013e6a"],["0x4Fe0dBb789b2204201e82f6Eae8491510bF74B2D"],["0xbc1671F4cFdDaA3CC28aa64Cf1C1874cADef7AC1"],["0xeBb85864BA610EFE2CA0B949A4189f1675c7FcAf"],["0xe8471669e79ff941Fe766a50fca219DD68ad81AC"],["0xF0495642611461Ae25F4867B043717D9F53a9237"],["0xda4d5372188B0b8502AeD3770212Ed5784f71550"],["0xCbC0c2D518cD3C832b210a9FC9Cb265119BedAf1"],["0x77Eb511caCCEdD71924B361dc24dE3A762A55927"],["0x1DD5E0E5b03608a30b55806358ddbABC6Dc83b3f"],["0x62a966A7492Be75182C89E6E2a519a87884A0382"],["0x4Ef2201f196196be4B9e50F93F67Ad462A0d25A8"],["0x27dE58B8b5B3B643eA8e68Ec829caA20f51e1089"],["0xf2231009908E695C010c02F57Ac541D3470d95d5"],["0xe23A97f0c0a1Bc748709c2a348705773197A9c11"],["0xE6e686341B58F5378e8913369d176dc47bc1DE7a"],["0x3410feA2fEC5c6830Ac4FC8664089a6FE32A81B0"],["0x6f66C3e73D6B0F9e3547954F1650b76428708Ad6"],["0xD1B462C00Cd0c852E00eeF0aD09a924fc3e1f3D5"],["0x0666C986800f3037793a46B96EBE75F5b4e68940"],["0x206A2e6bAF0304642FFed63B0aBA1AAEF3373515"],["0x2dD5B12E5847F196Dc9DaE90d620b81dcaB50e7D"],["0xDeEbeeC3B2951B72c232F6Aa30EAB9ae12e77E98"],["0x91eB9C57C46EA0bD928A911A56C3894f21e6D7Db"],["0x184c547493f14aCe4fb2a44Ef190c45C7eafB898"],["0x3C28D0Fd3f3A39685f6dc4cbE8B3Be8405C206A1"],["0x37b84a57EF5025Ab0aa2460b7176757D42B786Cd"],["0x4654C7470c4af4e7baF2bD2e78c75691fEd7d124"],["0xC560Bd2919d58A2A6619E42E0a71b8AD7aba614a"],["0xd5f97dcadd67cf36Af047EbE07d47c83fd2B1197"],["0xE62Cd6781dfA5eD96C902F18Ea28F73196Da7CF6"],["0x4607BD32d5C20630000BAC6a78B0e718130946a0"],["0x856c28C8Dd58634278581B0553CaAB68D7f6b6f4"],["0x1FAbf3d52398275aF43F7bC984bcb7B1478c9278"],["0x73E93170406d18e4eF934c76AB40d3348322f6bC"],["0xCAF98012B2a016451680153175194C8173bCeA26"],["0x3e9CdBD9de6729072D0c660E824849444070949d"],["0x8f0C981FD73Cd998196C9277e600026f1c2eE0Ab"],["0x848a16f4e0D546E4d78e8eA34F6D2AB3C3c7d558"],["0x8c52A064CA95C41066731603f65253034426A15d"],["0x1F07f753C0d8ACA03adb5bF6e05cED30611E6c19"],["0x4D9d4d4F6003A4849e021EE122323C67BAb4071D"],["0x797d57b15D0d983BCF8fdD174926cf763b0b8665"],["0x0ba352Eaf527B5640160bAe09bF2c59eC8D2b98d"],["0x9Aa926a5911C9C893d4Fa16B13B098503b2B00f9"],["0xC2366373Fd179716486b31201E1506301AeE9310"],["0x903B0a1A25b892AbaDd1eFD36dc13625e6538C6E"],["0x55B978203166cA740bdC18645129A2ECd907617E"],["0x4977FbF31F629199a6b02646999217F3a3E39Ca7"],["0x59044F7BCa6bC665d56ff669Cd28adD68e075361"],["0x146cAD870c688517Fc887d6e63A918EA79E56eeA"],["0x49307626002D5ADbeF00691D41D150C3f1508e3b"],["0x2291649f2a6230c20F775663BbC94629a1948CD2"],["0xf558FFb575834C9F8c58992C245fBA428C4c13Fe"],["0x435D33772a133e1F53c544026F4481082f5040C6"],["0x819B9Ffd2772bA385B5f9f3Edb6a8DdB2485A7e7"],["0x09b8e134EE80cD7b54d1fA741205146a74b47161"],["0xfa799d4f8A01422333F3b0b7e7F44ae1D85EbD5e"],["0xabe79443eBaf0465a48BE89C1F7810476C29B326"],["0x5A4F19E5CBc77C318a319fAcF2eA9CbCCbD63622"],["0xc5E30ACf5738BC354b88fC67037D6dCAD933D24a"],["0x648afFc05326959c6F5B64Eb4881dFf22990F26F"],["0xd128eC8fDb68D3375962fd88cdCb1Bc2704f9367"],["0x8b346295531E54cAacbA1117039865a9690d1026"],["0x40714C29C62BBe8D882b9449DaC60aB271B2E72C"],["0x4b867b8f9123F7E1f59371CeF7aD25C5F40B2FD8"]]
    }
```

Generated with discovered.json: 0x05326545ba0ebc85d3645002b6070b86e4600617

# Diff at Mon, 21 Oct 2024 12:49:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20977175
- current block number: 20977175

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977175 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      descriptions:
-        ["This contract provides functionalities for proposing, proving, and verifying blocks."]
      description:
+        "This contract provides functionalities for proposing, proving, and verifying blocks."
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      descriptions:
-        ["Verifier contract for blocks proven by Guardian minority."]
      description:
+        "Verifier contract for blocks proven by Guardian minority."
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      descriptions:
-        ["A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO."]
      description:
+        "A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO."
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      descriptions:
-        ["Verifier contract for SGX proven blocks."]
      description:
+        "Verifier contract for SGX proven blocks."
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      descriptions:
-        ["Verifier contract for Guardian proven blocks."]
      description:
+        "Verifier contract for Guardian proven blocks."
    }
```

Generated with discovered.json: 0x90c9d21da8c146e239bf6a9321d203849e53c916

# Diff at Mon, 21 Oct 2024 11:11:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20977175
- current block number: 20977175

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20977175 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$pastUpgrades.12.2:
+        ["0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]
      values.$pastUpgrades.12.1:
-        ["0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]
+        "0x8778064404816273804d74c97b051f3865bc03062cfa4b0e9567f4556ad31981"
      values.$pastUpgrades.11.2:
+        ["0xBA1d90BCfA74163bFE09e8eF609b346507D83231"]
      values.$pastUpgrades.11.1:
-        ["0xBA1d90BCfA74163bFE09e8eF609b346507D83231"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.10.2:
+        ["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"]
      values.$pastUpgrades.10.1:
-        ["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"]
+        "0xdf3f0cb2eaca00484c30a5c63fafe8036a9e0f71bd4bab216504bee0f5bfb83f"
      values.$pastUpgrades.9.2:
+        ["0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"]
      values.$pastUpgrades.9.1:
-        ["0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"]
+        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
      values.$pastUpgrades.8.2:
+        ["0xB9E1E58bcF33B79CcfF99c298963546a6c334388"]
      values.$pastUpgrades.8.1:
-        ["0xB9E1E58bcF33B79CcfF99c298963546a6c334388"]
+        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
      values.$pastUpgrades.7.2:
+        ["0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]
      values.$pastUpgrades.7.1:
-        ["0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.6.2:
+        ["0x4b2743B869b85d5F7D8020566f92664995E4f3c5"]
      values.$pastUpgrades.6.1:
-        ["0x4b2743B869b85d5F7D8020566f92664995E4f3c5"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.5.2:
+        ["0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]
      values.$pastUpgrades.5.1:
-        ["0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]
+        "0x2c455ae888a23c232bb5c7603657eda010ffadc602a74e626332bc06eaaa3b78"
      values.$pastUpgrades.4.2:
+        ["0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]
      values.$pastUpgrades.4.1:
-        ["0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]
+        "0xa603b6d55457e64e18ddae684bfd14948452cdd7b927dd22bf0b83045e8fd028"
      values.$pastUpgrades.3.2:
+        ["0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"]
      values.$pastUpgrades.3.1:
-        ["0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"]
+        "0x187cc99e9bcf2a94f723cf52d85b74b79bdb3872681e2a3808cadbbc3ba301e2"
      values.$pastUpgrades.2.2:
+        ["0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]
      values.$pastUpgrades.2.1:
-        ["0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]
+        "0xaed098ad0c93113e401f61358f963501f40a046c5b5b659a1610f10120a9a86b"
      values.$pastUpgrades.1.2:
+        ["0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"]
      values.$pastUpgrades.1.1:
-        ["0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"]
      values.$pastUpgrades.0.1:
-        ["0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"]
+        "0x675a0b8283bd222e1df42a0a4df4b781a1a7c5575729e2e91f89dda879933702"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0xcfe803378D79d1180EbF030455040EA6513869dF"]
      values.$pastUpgrades.4.1:
-        ["0xcfe803378D79d1180EbF030455040EA6513869dF"]
+        "0xc9f468d33d8d55911e4e5b5c301ed244a5f81ab0f389d2b4f398eb5b89d417ef"
      values.$pastUpgrades.3.2:
+        ["0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"]
      values.$pastUpgrades.3.1:
-        ["0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.2.2:
+        ["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]
      values.$pastUpgrades.2.1:
-        ["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]
+        "0x56402f9fd928be890fbd29829b817faffc0780b85e83300a29962c969808cae2"
      values.$pastUpgrades.1.2:
+        ["0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"]
      values.$pastUpgrades.1.1:
-        ["0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"]
+        "0x7d82794932540ed9edd259e58f6ef8ae21a49beada7f0224638f888f7149c01c"
      values.$pastUpgrades.0.2:
+        ["0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"]
      values.$pastUpgrades.0.1:
-        ["0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"]
+        "0x4f7a1c6ad21fbfeaecab40ea36a3845bf67e22d7770d8a259d62b995cb93cb34"
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$pastUpgrades.5.2:
+        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
      values.$pastUpgrades.5.1:
-        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.4.2:
+        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
      values.$pastUpgrades.4.1:
-        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.3.2:
+        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
      values.$pastUpgrades.3.1:
-        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
+        "0x5a60c5815947a199cc84e1bc75539e01a202597b20c1f87bd9d02f8be6453abd"
      values.$pastUpgrades.2.2:
+        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
      values.$pastUpgrades.2.1:
-        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
+        "0x8030569e293baddbc4e8b26688a1ecf14a231d86c90e9d02dad1e919ea2f3964"
      values.$pastUpgrades.1.2:
+        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
      values.$pastUpgrades.1.1:
-        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
      values.$pastUpgrades.0.1:
-        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
+        "0x77bb98950cca2b6e6640b4b35cecfb40fb302dfd17a0fdd9c1d5f95e91d2b031"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x4f6D5D3109C07E77035B410602996e445b18E8E9"]
      values.$pastUpgrades.5.1:
-        ["0x4f6D5D3109C07E77035B410602996e445b18E8E9"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.4.2:
+        ["0x29a88d60246C76E4F28806b9C8a42d2183154900"]
      values.$pastUpgrades.4.1:
-        ["0x29a88d60246C76E4F28806b9C8a42d2183154900"]
+        "0x9f787086b4c5e6887eb1d27c286069bcbbcabb1d7ed9f69ab3121c4681cf4b2c"
      values.$pastUpgrades.3.2:
+        ["0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"]
      values.$pastUpgrades.3.1:
-        ["0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.2.2:
+        ["0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"]
      values.$pastUpgrades.2.1:
-        ["0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"]
+        "0xe1ef58455de0b0331228e487d54720290ed8a73f709d2146bd43330d4a360bd3"
      values.$pastUpgrades.1.2:
+        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
      values.$pastUpgrades.1.1:
-        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0xd912aB787624c9eb96a37e658e9596e114360440"]
      values.$pastUpgrades.0.1:
-        ["0xd912aB787624c9eb96a37e658e9596e114360440"]
+        "0xbc9dfeb1062e7fdf8f918368964a41cc07b3edf3f8497a0abd9f426d1c9444bc"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$pastUpgrades.7.2:
+        ["0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"]
      values.$pastUpgrades.7.1:
-        ["0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.6.2:
+        ["0x74828E5fe803072AF9Df512B3911B4223572D652"]
      values.$pastUpgrades.6.1:
-        ["0x74828E5fe803072AF9Df512B3911B4223572D652"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.5.2:
+        ["0x518845daA8870bE2C59E49620Fc262AD48953C9a"]
      values.$pastUpgrades.5.1:
-        ["0x518845daA8870bE2C59E49620Fc262AD48953C9a"]
+        "0xdf3f0cb2eaca00484c30a5c63fafe8036a9e0f71bd4bab216504bee0f5bfb83f"
      values.$pastUpgrades.4.2:
+        ["0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"]
      values.$pastUpgrades.4.1:
-        ["0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"]
+        "0xb4c23d57a1f0916180d0752c57726b634e7707bb7377c93d9e95d19e3695887a"
      values.$pastUpgrades.3.2:
+        ["0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"]
      values.$pastUpgrades.3.1:
-        ["0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.2.2:
+        ["0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"]
      values.$pastUpgrades.2.1:
-        ["0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.1.2:
+        ["0x500735343372Dd6c9B84dBc7a75babf4479742B9"]
      values.$pastUpgrades.1.1:
-        ["0x500735343372Dd6c9B84dBc7a75babf4479742B9"]
+        "0x02ed558762eae5f0a930ba4a1047a02d4a793ea48890268c32df04e882f138ff"
      values.$pastUpgrades.0.2:
+        ["0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"]
      values.$pastUpgrades.0.1:
-        ["0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"]
+        "0xf3b6af477112d0a8209506c8f310f4eb0713beebb1911ef5d11162d36d93c0ff"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"]
      values.$pastUpgrades.2.1:
-        ["0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"]
+        "0x46a6d47c15505a1259c64d1e09353680e525b2706dd9e095e15019dda7c1b295"
      values.$pastUpgrades.1.2:
+        ["0xde1b1FBe7D721af4A56651272ef91A59B7303323"]
      values.$pastUpgrades.1.1:
-        ["0xde1b1FBe7D721af4A56651272ef91A59B7303323"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"]
      values.$pastUpgrades.0.1:
-        ["0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"]
+        "0x207dec76298211a2d988b0de3e9a3f8da0edb4524a011e72f28200be08edd4c6"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"]
      values.$pastUpgrades.6.1:
-        ["0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"]
+        "0xee632b50626beb2f7db84c9c7f303f29366f86dfaccd24ddd831ceac714c20e5"
      values.$pastUpgrades.5.2:
+        ["0xa303784B0557BF1F1FB8b8abEF2B18a005722689"]
      values.$pastUpgrades.5.1:
-        ["0xa303784B0557BF1F1FB8b8abEF2B18a005722689"]
+        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
      values.$pastUpgrades.4.2:
+        ["0x75b5E276c5C1e9378E899cb3A87977421980Eb22"]
      values.$pastUpgrades.4.1:
-        ["0x75b5E276c5C1e9378E899cb3A87977421980Eb22"]
+        "0x42a1dacf03a4032209ca4a6b922ffe2ebb34925c16a6632d8590cf3374ae59d8"
      values.$pastUpgrades.3.2:
+        ["0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"]
      values.$pastUpgrades.3.1:
-        ["0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"]
+        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
      values.$pastUpgrades.2.2:
+        ["0x4F750D13005444407D44dAA30922128db0374ca1"]
      values.$pastUpgrades.2.1:
-        ["0x4F750D13005444407D44dAA30922128db0374ca1"]
+        "0x02ed558762eae5f0a930ba4a1047a02d4a793ea48890268c32df04e882f138ff"
      values.$pastUpgrades.1.2:
+        ["0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"]
      values.$pastUpgrades.1.1:
-        ["0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"]
      values.$pastUpgrades.0.1:
-        ["0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"]
+        "0x109f0a0ff2b3b57f3a94bc1dd39159a7e3af9ec0141be56d49d7bb1db94279c2"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"]
      values.$pastUpgrades.4.1:
-        ["0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.3.2:
+        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
      values.$pastUpgrades.3.1:
-        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
+        "0xdb5e926c96d112ce1389da77a927fba6c7d04a711839b9e14777530ebcf83914"
      values.$pastUpgrades.2.2:
+        ["0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"]
      values.$pastUpgrades.2.1:
-        ["0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.1.2:
+        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
      values.$pastUpgrades.1.1:
-        ["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]
      values.$pastUpgrades.0.1:
-        ["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]
+        "0x0898d14da2f38d677085073d2decfb7ca32902406df2e7a84f6615d9c92d4516"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$pastUpgrades.4.2:
+        ["0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"]
      values.$pastUpgrades.4.1:
-        ["0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"]
+        "0x2e246e4b4637c4bf13dccea873a30e35e704bafa7f02e30c877ecec7d786e662"
      values.$pastUpgrades.3.2:
+        ["0xEE5F6648307319263FFBaE91f68ac700b188fF24"]
      values.$pastUpgrades.3.1:
-        ["0xEE5F6648307319263FFBaE91f68ac700b188fF24"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.2.2:
+        ["0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"]
      values.$pastUpgrades.2.1:
-        ["0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.1.2:
+        ["0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"]
      values.$pastUpgrades.1.1:
-        ["0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x3f54067EF5d8B414Bdb1945cdF482BD158Aad175"]
      values.$pastUpgrades.0.1:
-        ["0x3f54067EF5d8B414Bdb1945cdF482BD158Aad175"]
+        "0xb395374994ed9013749c8967babaa7cb5ad73699c1ae14794615bf4ffdd462e1"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$pastUpgrades.10.2:
+        ["0xAc96FF285158bceBB8573D20d853e86BB2915aF3"]
      values.$pastUpgrades.10.1:
-        ["0xAc96FF285158bceBB8573D20d853e86BB2915aF3"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.9.2:
+        ["0x01E7D369a619eF1B0E92563d8737F42C09789986"]
      values.$pastUpgrades.9.1:
-        ["0x01E7D369a619eF1B0E92563d8737F42C09789986"]
+        "0x13f54109cb7f7507ad03562b06ea8d8b472043186e44252302583bc64acfb20b"
      values.$pastUpgrades.8.2:
+        ["0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"]
      values.$pastUpgrades.8.1:
-        ["0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"]
+        "0x2f14829c3da1a755a74948d5716a625256ae7e2481e538b0660a8da11c84dc2e"
      values.$pastUpgrades.7.2:
+        ["0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"]
      values.$pastUpgrades.7.1:
-        ["0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"]
+        "0x0bbf7d1258c646f41a02a92a55825b1ebfd3659577d0f2b57b462f8895e23a04"
      values.$pastUpgrades.6.2:
+        ["0x3c326483EBFabCf3252205f26dF632FE83d11108"]
      values.$pastUpgrades.6.1:
-        ["0x3c326483EBFabCf3252205f26dF632FE83d11108"]
+        "0xc0ba6558642b93ee892bee0705dbcfb5130c53637e6266bfa5e3a6501167d6f2"
      values.$pastUpgrades.5.2:
+        ["0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"]
      values.$pastUpgrades.5.1:
-        ["0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"]
+        "0xf21f6bf720767db3bc9b63ef69cacb20340bdedfb6589e6a4d11fe082dfa7bd6"
      values.$pastUpgrades.4.2:
+        ["0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"]
      values.$pastUpgrades.4.1:
-        ["0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"]
+        "0x8a380a25d03a740d9535dfc3e2fc4f6960e22d49ad88b8d85f59af4013aedf87"
      values.$pastUpgrades.3.2:
+        ["0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"]
      values.$pastUpgrades.3.1:
-        ["0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"]
+        "0x02ed558762eae5f0a930ba4a1047a02d4a793ea48890268c32df04e882f138ff"
      values.$pastUpgrades.2.2:
+        ["0xc71CC3B0a47149878fad337fb2ca54E546A645ba"]
      values.$pastUpgrades.2.1:
-        ["0xc71CC3B0a47149878fad337fb2ca54E546A645ba"]
+        "0x5a60c5815947a199cc84e1bc75539e01a202597b20c1f87bd9d02f8be6453abd"
      values.$pastUpgrades.1.2:
+        ["0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"]
      values.$pastUpgrades.1.1:
-        ["0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"]
      values.$pastUpgrades.0.1:
-        ["0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"]
+        "0x99673a767d36f5f3bc4af415072f97f344b6a5ec39e0d85eb799691787b1b98b"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$pastUpgrades.5.2:
+        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
      values.$pastUpgrades.5.1:
-        ["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]
+        "0x170617251f2345eda4bcbd29e316caa0b014602a44244c60b963382ac7da7748"
      values.$pastUpgrades.4.2:
+        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
      values.$pastUpgrades.4.1:
-        ["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]
+        "0x8de1631a25b337c1e702f9ce9d9ab8a3b626922441855e959b2d79dae40bd131"
      values.$pastUpgrades.3.2:
+        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
      values.$pastUpgrades.3.1:
-        ["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]
+        "0x5a60c5815947a199cc84e1bc75539e01a202597b20c1f87bd9d02f8be6453abd"
      values.$pastUpgrades.2.2:
+        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
      values.$pastUpgrades.2.1:
-        ["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]
+        "0x8030569e293baddbc4e8b26688a1ecf14a231d86c90e9d02dad1e919ea2f3964"
      values.$pastUpgrades.1.2:
+        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
      values.$pastUpgrades.1.1:
-        ["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
      values.$pastUpgrades.0.1:
-        ["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]
+        "0x76bb4346eb067a443f2069793a10f547893102d91dfebd011909c0fdeefb1e94"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"]
      values.$pastUpgrades.3.1:
-        ["0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"]
+        "0x7d584f0a645cad61e634f64ffaf7e1bbfb92749878eb25b39ce0e5cf698897c7"
      values.$pastUpgrades.2.2:
+        ["0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"]
      values.$pastUpgrades.2.1:
-        ["0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"]
+        "0xe1ef58455de0b0331228e487d54720290ed8a73f709d2146bd43330d4a360bd3"
      values.$pastUpgrades.1.2:
+        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
      values.$pastUpgrades.1.1:
-        ["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]
+        "0x416560cd96dc75ccffebe889e8d1ab3e08b33f814dc4a2bf7c6f9555071d1f6f"
      values.$pastUpgrades.0.2:
+        ["0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"]
      values.$pastUpgrades.0.1:
-        ["0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"]
+        "0xf83131446154db1fb4013c20e9468c36f71085dbdf4304f8e2ef5ac13f2e3670"
    }
```

Generated with discovered.json: 0x4b43cc2a7f3a15e72a8d81383920862dccbbfc29

# Diff at Wed, 16 Oct 2024 09:19:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7921b2195836f60cdebc96df7164e01c8921b991 block: 20367491
- current block number: 20977175

## Description

Upgrade of the TaikoL1Contract implementation with a [bug fix](https://github.com/taikoxyz/taiko-mono/pull/18254) in a check ('sametransition') of the proving library.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes.1:
-        "0xf13ac7cd2ef8d7b72cab625effe80906f11db83cf2a688e85a19d515da43f06f"
+        "0xa2bfa567075799db54daaa89afafea79e42c73c36c23112c79926407116d0765"
      values.$implementation:
-        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
+        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
      values.$pastUpgrades.12:
+        ["2024-10-16T07:55:23.000Z",["0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"]]
      values.$upgradeCount:
-        12
+        13
      values.impl:
-        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
+        "0xf0E6d34937701622cA887a75c150cC23d4FFDf2F"
    }
```

## Source code changes

```diff
.../TaikoL1Contract/MainnetTaikoL1.sol             | 37 ++++++++++++----------
 1 file changed, 21 insertions(+), 16 deletions(-)
```

Generated with discovered.json: 0x62bbf8ea8ccf69d33116a4be61f87ed5c169c163

# Diff at Mon, 14 Oct 2024 10:56:48 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169) {
    +++ description: None
      sourceHashes:
+        ["0x97476fc6413c58015ddf51b5d2e37c3fdfc6b85ced25779773a1652ecc154c77"]
    }
```

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xf13ac7cd2ef8d7b72cab625effe80906f11db83cf2a688e85a19d515da43f06f"]
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x5da570fbffd5ab663ce8983496a9ded290ed853a950b4052ac93b35217babac8"]
    }
```

```diff
    contract TierProvider (0x3a1A900680BaADb889202faf12915F7E47B71ddd) {
    +++ description: None
      sourceHashes:
+        ["0xb4bbf462798387aaf063a17fe37e8c1b7680ea832f5d7578bb385b9ea4d96e7b"]
    }
```

```diff
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9) {
    +++ description: None
      sourceHashes:
+        ["0x5bf803a773ed2c117313ea970df3b38542eab3522714f18be2b65a75062e0ebf"]
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x06f614affc4908aeeac9faa505010855388740ee8e5ba632fbc0e5f56ee8927d"]
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x020f0e8ece4630d3f7e6458ef5f1d86c5408ed344c580633e3f32e53393ceab5"]
    }
```

```diff
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a) {
    +++ description: None
      sourceHashes:
+        ["0x0586e314d29674146a289903abeb027df33bc789e1aa325ebe458284967fe8d6"]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xac51975c574b128e9dc1e8542c616ed655d4a2abc91d3233648ac688e530c68c"]
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x3c7adf8e3200906bd67dec9e0b73fb813681e84ba1499dcede6987370ce146c9"]
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xa5cf6831e233f05c8a2f677c311dd359c75850355d61417bc5201d493db30039"]
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xdb8e8268242e52348760b0b2d154955236307b3ef1bc9cb0234fc6c0d01aa70f"]
    }
```

```diff
    contract MainnetProverSet (0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A) {
    +++ description: None
      sourceHashes:
+        ["0x020f0e8ece4630d3f7e6458ef5f1d86c5408ed344c580633e3f32e53393ceab5"]
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x14240ef6b1d8181a009840162a21975c2777f78f27c22e8e550bc66b36357f78"]
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xb6ed017b0bf49c547dbaa4b24efcbcd5218c26aafd94f8cf06850d009e538347"]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0xa0dc6b4537f21ed3a4a43a7fb74645ff827cff8c2b26f2e3e4350ddec470c990"]
    }
```

Generated with discovered.json: 0x23099ec7223b235b37cb37864d7faf0af142f3da

# Diff at Tue, 01 Oct 2024 11:11:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x99Ba70E62cab0cB983e66F72330fBDDC11d85501"]],["2024-05-11T06:26:35.000Z",["0x9fBBedBBcBb753E7214BE08381efE10d89D712fE"]],["2024-05-21T14:15:11.000Z",["0xe0A5D394878723CEAEC8B993e04756DF1f4B44eF"]],["2024-05-27T16:37:11.000Z",["0xa200c2268d77737a8Fd2CA1698dA6eeab2a85CEb"]],["2024-05-28T05:18:11.000Z",["0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"]],["2024-06-04T06:10:11.000Z",["0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"]],["2024-06-06T08:51:11.000Z",["0x4b2743B869b85d5F7D8020566f92664995E4f3c5"]],["2024-06-07T04:02:11.000Z",["0x0468745A07de44A9a3138adAc35875ecaf7a20D5"]],["2024-06-07T08:40:35.000Z",["0xB9E1E58bcF33B79CcfF99c298963546a6c334388"]],["2024-07-02T07:03:35.000Z",["0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"]],["2024-07-13T12:34:35.000Z",["0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"]],["2024-07-16T14:30:23.000Z",["0xBA1d90BCfA74163bFE09e8eF609b346507D83231"]]]
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-25T08:29:59.000Z",["0x9ae1a067F9655DD0511390e3d70Bb25933AE61eb"]],["2024-05-11T05:46:11.000Z",["0xea53c0f4b129Cf3f3FBA896F9f23ca18246e9B3c"]],["2024-05-29T08:03:23.000Z",["0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"]],["2024-06-07T04:02:11.000Z",["0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"]],["2024-07-02T07:15:47.000Z",["0xcfe803378D79d1180EbF030455040EA6513869dF"]]]
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]],["2024-05-11T06:26:35.000Z",["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]],["2024-05-15T04:09:35.000Z",["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]],["2024-05-22T06:23:11.000Z",["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]],["2024-06-06T08:51:11.000Z",["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]],["2024-07-17T06:19:35.000Z",["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]]]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:35.000Z",["0xd912aB787624c9eb96a37e658e9596e114360440"]],["2024-05-11T06:26:35.000Z",["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]],["2024-05-26T11:17:11.000Z",["0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"]],["2024-06-06T08:51:11.000Z",["0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"]],["2024-07-02T14:30:59.000Z",["0x29a88d60246C76E4F28806b9C8a42d2183154900"]],["2024-07-16T14:30:23.000Z",["0x4f6D5D3109C07E77035B410602996e445b18E8E9"]]]
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$pastUpgrades:
+        [["2024-05-20T15:05:59.000Z",["0x34f2B21107AfE3584949c184A1E6236FFDAC4f6F"]],["2024-05-25T11:00:59.000Z",["0x500735343372Dd6c9B84dBc7a75babf4479742B9"]],["2024-06-06T08:51:11.000Z",["0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"]],["2024-06-07T04:02:11.000Z",["0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"]],["2024-06-08T10:54:11.000Z",["0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"]],["2024-07-13T12:34:35.000Z",["0x518845daA8870bE2C59E49620Fc262AD48953C9a"]],["2024-07-16T14:30:23.000Z",["0x74828E5fe803072AF9Df512B3911B4223572D652"]],["2024-07-17T06:19:35.000Z",["0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"]]]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:59.000Z",["0xEE8FC1dbb8D345f5bF35dFb939C6f9EdC5fCDAFc"]],["2024-05-11T06:26:35.000Z",["0xde1b1FBe7D721af4A56651272ef91A59B7303323"]],["2024-05-15T15:34:23.000Z",["0x5f73f0AdC7dAA6134Fe751C4a78d524f9384e0B5"]]]
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0x15D9F7e12aEa18DAEF5c651fBf97567CAd4a4BEc"]],["2024-05-11T06:26:35.000Z",["0xC722d9f3f8D60288589F7f67a9CFAd34d3B9bf8E"]],["2024-05-25T11:00:59.000Z",["0x4F750D13005444407D44dAA30922128db0374ca1"]],["2024-06-07T08:40:35.000Z",["0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"]],["2024-06-10T12:45:47.000Z",["0x75b5E276c5C1e9378E899cb3A87977421980Eb22"]],["2024-07-02T07:03:35.000Z",["0xa303784B0557BF1F1FB8b8abEF2B18a005722689"]],["2024-07-16T12:45:59.000Z",["0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"]]]
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0xE1d91bAE44B70bD66e8b688B8421fD62dcC33c72"]],["2024-05-11T06:26:35.000Z",["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]],["2024-06-06T08:51:11.000Z",["0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"]],["2024-06-07T08:40:35.000Z",["0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"]],["2024-07-16T14:30:23.000Z",["0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"]]]
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x3f54067EF5d8B414Bdb1945cdF482BD158Aad175"]],["2024-05-11T06:26:35.000Z",["0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"]],["2024-06-06T08:51:11.000Z",["0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"]],["2024-07-17T06:19:35.000Z",["0xEE5F6648307319263FFBaE91f68ac700b188fF24"]],["2024-07-19T02:42:59.000Z",["0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"]]]
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0x91d593d34f2E1904cDCe3D5290a74563F87bCF6f"]],["2024-05-11T06:26:35.000Z",["0x4A1091c2fb37D9C4a661c2384Ff539d94CCF853D"]],["2024-05-22T06:23:11.000Z",["0xc71CC3B0a47149878fad337fb2ca54E546A645ba"]],["2024-05-25T11:00:59.000Z",["0x02F21B4C3d4dbfF70cE851741175a727c8D782Be"]],["2024-05-29T05:00:35.000Z",["0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"]],["2024-05-31T09:34:47.000Z",["0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"]],["2024-06-04T06:09:11.000Z",["0x3c326483EBFabCf3252205f26dF632FE83d11108"]],["2024-06-07T04:02:11.000Z",["0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"]],["2024-06-27T15:36:23.000Z",["0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"]],["2024-07-02T07:03:35.000Z",["0x01E7D369a619eF1B0E92563d8737F42C09789986"]],["2024-07-16T14:30:23.000Z",["0xAc96FF285158bceBB8573D20d853e86BB2915aF3"]]]
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$pastUpgrades:
+        [["2024-05-01T08:03:47.000Z",["0x717DC5E3814591790BcB1fD9259eEdA7c14ce9CF"]],["2024-05-11T06:26:35.000Z",["0x750221E951b77a2Cb4046De41Ec5F6d1aa7942D2"]],["2024-05-15T04:09:35.000Z",["0x253E47F2b1e91F2001d3578aeB24C0ccF464b65e"]],["2024-05-22T06:23:11.000Z",["0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"]],["2024-06-06T08:51:11.000Z",["0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"]],["2024-07-17T06:19:35.000Z",["0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"]]]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-01T08:03:23.000Z",["0x9cA1Ab10c9fAc5153F8b78E67f03aAa69C9c6A15"]],["2024-05-11T06:26:35.000Z",["0xF1cA1F1A068468E1dcF90dA6add185467de80943"]],["2024-05-26T11:17:11.000Z",["0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"]],["2024-07-16T14:30:23.000Z",["0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"]]]
    }
```

Generated with discovered.json: 0x853af766eb885dd729d9ef0b6a2f6337a5837305

# Diff at Fri, 30 Aug 2024 08:01:26 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x85330084ea47a398f6a995cd4eef2c75c96c8644

# Diff at Fri, 23 Aug 2024 09:56:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$upgradeCount:
+        12
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$upgradeCount:
+        6
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$upgradeCount:
+        8
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$upgradeCount:
+        7
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$upgradeCount:
+        5
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$upgradeCount:
+        11
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$upgradeCount:
+        6
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

Generated with discovered.json: 0x501fc3cc7a3f8189eebc64405060e1ce4a97c04a

# Diff at Wed, 21 Aug 2024 10:06:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","0x579A8d63a2Db646284CBFE31FE5082c9989E985c","0x579f40D0BE111b823962043702cabe6Aaa290780","0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","0xE3D777143Ea25A6E031d1e921F396750885f43aC","0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81","0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","via":[]},{"permission":"upgrade","target":"0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","via":[]},{"permission":"upgrade","target":"0x579A8d63a2Db646284CBFE31FE5082c9989E985c","via":[]},{"permission":"upgrade","target":"0x579f40D0BE111b823962043702cabe6Aaa290780","via":[]},{"permission":"upgrade","target":"0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","via":[]},{"permission":"upgrade","target":"0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","via":[]},{"permission":"upgrade","target":"0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","via":[]},{"permission":"upgrade","target":"0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","via":[]},{"permission":"upgrade","target":"0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81","via":[]},{"permission":"upgrade","target":"0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC","via":[]},{"permission":"upgrade","target":"0xE3D777143Ea25A6E031d1e921F396750885f43aC","via":[]},{"permission":"upgrade","target":"0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","via":[]}]
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F","via":[]}]
    }
```

Generated with discovered.json: 0xada8e10c7620e6341a1aa18d79161004c8a45df7

# Diff at Fri, 09 Aug 2024 12:02:49 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      assignedPermissions.upgrade.11:
-        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
+        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
      assignedPermissions.upgrade.10:
-        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
+        "0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"
      assignedPermissions.upgrade.9:
-        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
+        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
      assignedPermissions.upgrade.8:
-        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
+        "0xE3D777143Ea25A6E031d1e921F396750885f43aC"
      assignedPermissions.upgrade.7:
-        "0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa"
+        "0x9e0a24964e5397B566c1ed39258e21aB5E35C77C"
      assignedPermissions.upgrade.6:
-        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
+        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
      assignedPermissions.upgrade.4:
-        "0x579f40D0BE111b823962043702cabe6Aaa290780"
+        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
      assignedPermissions.upgrade.3:
-        "0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9"
+        "0x579f40D0BE111b823962043702cabe6Aaa290780"
      assignedPermissions.upgrade.2:
-        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
+        "0x579A8d63a2Db646284CBFE31FE5082c9989E985c"
      assignedPermissions.upgrade.1:
-        "0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab"
+        "0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800"
      assignedPermissions.upgrade.0:
-        "0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"
+        "0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a"
    }
```

Generated with discovered.json: 0x2d4a9452bbde47699d163c0ec1c075e63916fef1

# Diff at Fri, 09 Aug 2024 10:12:47 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","0x579A8d63a2Db646284CBFE31FE5082c9989E985c","0x579f40D0BE111b823962043702cabe6Aaa290780","0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","0xE3D777143Ea25A6E031d1e921F396750885f43aC","0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81","0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC"]
      assignedPermissions.upgrade:
+        ["0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC","0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab","0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a","0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9","0x579f40D0BE111b823962043702cabe6Aaa290780","0x8d7C954960a36a7596d7eA4945dDf891967ca8A3","0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800","0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa","0x9e0a24964e5397B566c1ed39258e21aB5E35C77C","0x579A8d63a2Db646284CBFE31FE5082c9989E985c","0xE3D777143Ea25A6E031d1e921F396750885f43aC","0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268","0x7Cdd1c128Cd72dd252f569eeD942735330937F91","0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1","0x6B6072CE402F22fDcFbA1705383D8e280717Cb87"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x55d79345Afc87806B690C9f96c4D7BfE2Bca8268","0x7Cdd1c128Cd72dd252f569eeD942735330937F91","0x3b1D1F89E0b6803174A2dE72e21A6f6f8464d5F1","0x6B6072CE402F22fDcFbA1705383D8e280717Cb87"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x5be646dcbd4e259784675edfccb4f73b54a477d6

# Diff at Tue, 30 Jul 2024 11:16:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20367491
- current block number: 20367491

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20367491 (main branch discovery), not current.

```diff
    contract TierProvider (0x3a1A900680BaADb889202faf12915F7E47B71ddd) {
    +++ description: None
      fieldMeta:
+        {"TIER_SGX":{"description":"verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN_MINORITY":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_GUARDIAN":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_OPTIMISTIC":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"},"TIER_SGX_ZKVM":{"description":"tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof"}}
    }
```

Generated with discovered.json: 0xb2a593359c71ae5bfd7af8acf5a2c646669ae3c5

# Diff at Tue, 23 Jul 2024 06:40:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20325786
- current block number: 20367491

## Description

Small upgrade, no functional changes.

## Watched changes

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$implementation:
-        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
+        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
      values.impl:
-        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
+        "0x7EE4CEF8a945639e09DDf3032e9d95c8d90f07f3"
    }
```

## Source code changes

```diff
.../SgxVerifier/MainnetSgxVerifier.sol              | 21 +++++++++++++++------
 1 file changed, 15 insertions(+), 6 deletions(-)
```

Generated with discovered.json: 0x4d8acd4949ddb9e86b59f0e29b2718147f570d2d

# Diff at Wed, 17 Jul 2024 10:56:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bff2b984ff65f6f4ce53cd6d7831c30ff25fdfa1 block: 20310388
- current block number: 20325786

## Description

Taiko [upgrade 1.9.0](https://github.com/taikoxyz/taiko-mono/pull/17783). The diff is extensive but logic changes are not since much of the diff is about naming and refactoring. The MainnetXXX contracts are deployed to save gas, logic is supposed to stay the same. Contract diffs were reviewed superficially since the code is changing too often and there seem to be no new features / permissions. Below is a changelog copied from the Taiko monorepo:

### Features

* **protocol:** add withdraw eth function to proverset ([#17800](https://github.com/taikoxyz/taiko-mono/issues/17800)) ([bb2abc5](https://github.com/taikoxyz/taiko-mono/commit/bb2abc510c98e62c89e0bfd9382c11720fb9edc7))
* **protocol:** update Hekla deployment ([#17795](https://github.com/taikoxyz/taiko-mono/issues/17795)) ([cadaef8](https://github.com/taikoxyz/taiko-mono/commit/cadaef882c0751496809c88ee03ff818e49c4b4a))
* **protocol:** update risc0 verifier contract to release-1.0 ([#17776](https://github.com/taikoxyz/taiko-mono/issues/17776)) ([2dd30ab](https://github.com/taikoxyz/taiko-mono/commit/2dd30ab2dc92b25105f19a4bcc1ddf7b40886039))


### Bug Fixes

* **protocol:** reduce MainnetTaikoL1 code size ([#17792](https://github.com/taikoxyz/taiko-mono/issues/17792)) ([45281b8](https://github.com/taikoxyz/taiko-mono/commit/45281b848f3ef3c45487bfcd1bfd38b382eff4d0))


### Documentation

* **protocol:** update L1 deployment ([#17789](https://github.com/taikoxyz/taiko-mono/issues/17789)) ([a889f1a](https://github.com/taikoxyz/taiko-mono/commit/a889f1a3e6c27b6758e873572c371ac9399a3d9a))


### Code Refactoring

* **protocol:** add MainnetGuardianProver ([#17805](https://github.com/taikoxyz/taiko-mono/issues/17805)) ([6f68316](https://github.com/taikoxyz/taiko-mono/commit/6f68316e89373670cf2c58bde5e64de196b9c139))
* **protocol:** add MainnetSgxVerifier ([#17803](https://github.com/taikoxyz/taiko-mono/issues/17803)) ([a4be247](https://github.com/taikoxyz/taiko-mono/commit/a4be247e181861300d79af6454b3fd3776100b48))
* **protocol:** added cached version of the bridge and vaults ([#17801](https://github.com/taikoxyz/taiko-mono/issues/17801)) ([b70cc57](https://github.com/taikoxyz/taiko-mono/commit/b70cc57704d750081a62a7e8e44f68f32efdc4c1))
* **protocol:** improve mainnet gas efficiency with addresses cached ([#17791](https://github.com/taikoxyz/taiko-mono/issues/17791)) ([b12227d](https://github.com/taikoxyz/taiko-mono/commit/b12227d4d2b2636fb80e04ee7ebc2dec3c17faa8))
* **protocol:** name address manager param clearer ([#17806](https://github.com/taikoxyz/taiko-mono/issues/17806)) ([1d5a6ff](https://github.com/taikoxyz/taiko-mono/commit/1d5a6ff191e8457ee12c96cb73c074560c556a2a))


## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$implementation:
-        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
+        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
      values.impl:
-        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
+        "0xBA1d90BCfA74163bFE09e8eF609b346507D83231"
      values.prover_set:
-        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
+        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
      derivedName:
-        "TaikoL1"
+        "MainnetTaikoL1"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x518845daA8870bE2C59E49620Fc262AD48953C9a)
    +++ description: None
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      values.$implementation:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      values.impl:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      derivedName:
-        "GuardianProver"
+        "MainnetGuardianProver"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      values.$implementation:
-        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
+        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
      values.impl:
-        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
+        "0x4f6D5D3109C07E77035B410602996e445b18E8E9"
      derivedName:
-        "L1RollupAddressManager"
+        "MainnetRollupAddressManager"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$implementation:
-        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
+        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
      values.impl:
-        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
+        "0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A"
      derivedName:
-        "ProverSet"
+        "MainnetProverSet"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      values.$implementation:
-        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
+        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
      values.impl:
-        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
+        "0x7ACFBb369a552C45d402448A4d64b9da54C3FF30"
      derivedName:
-        "ERC20Vault"
+        "MainnetERC20Vault"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      values.$implementation:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
      values.impl:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0xDF8642a1FBFc2014de27E8E87283D6f3eEF315DF"
      derivedName:
-        "SignalService"
+        "MainnetSignalService"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.$implementation:
-        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
+        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
      values.impl:
-        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
+        "0xEE5F6648307319263FFBaE91f68ac700b188fF24"
      derivedName:
-        "SgxVerifier"
+        "MainnetSgxVerifier"
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      values.$implementation:
-        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
+        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
      values.impl:
-        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
+        "0xAc96FF285158bceBB8573D20d853e86BB2915aF3"
      derivedName:
-        "Bridge"
+        "MainnetBridge"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      values.$implementation:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      values.impl:
-        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
+        "0x3c40CC51e78B4a622622F9A4Df1b40068bc8Df98"
      derivedName:
-        "GuardianProver"
+        "MainnetGuardianProver"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      values.$implementation:
-        "0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"
+        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
      values.impl:
-        "0x9496502d7D121B3D5eF25cA6c58d4f7593398a17"
+        "0x2f7126f78365AD54EAB26fD7faEc60435008E2fD"
      derivedName:
-        "L1SharedAddressManager"
+        "MainnetSharedAddressManager"
    }
```

```diff
+   Status: CREATED
    contract MainnetProverSet (0xCE5a119479337a153CA3bd1b2bF9755c78F2B15A)
    +++ description: None
```

## Source code changes

```diff
.../MainnetGuardianProver.sol}                     |  251 +-
 .../GuardianProver/MainnetGuardianProver.sol}      |  251 +-
 .../MainnetRollupAddressManager.sol}               |  141 +-
 .../MainnetSharedAddressManager.sol}               |  177 +-
 .../ProverSet.sol => .flat/MainnetProverSet.sol}   | 2657 +++++-----
 .../ProverSetProxy/MainnetProverSet.sol}           | 2657 +++++-----
 .../SgxVerifier/MainnetSgxVerifier.sol}            | 3481 ++++++-------
 .../SharedERC20Vault/MainnetERC20Vault.sol}        | 1270 ++---
 .../SignalService/MainnetSignalService.sol}        | 4297 ++++++++--------
 .../TaikoBridge/MainnetBridge.sol}                 | 1998 ++++----
 .../TaikoL1Contract/MainnetTaikoL1.sol}            | 5158 ++++++++++----------
 11 files changed, 11487 insertions(+), 10851 deletions(-)
```

Generated with discovered.json: 0xe016135302e207e21201065ab78e19edbf886272

# Diff at Mon, 15 Jul 2024 07:22:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c6bae99047cf03487a19e4008cfffabf520bcf2b block: 20262044
- current block number: 20310388

## Description

This is the [Taiko protocol v1.8.0 upgrade](https://github.com/taikoxyz/taiko-mono/releases/tag/protocol-v1.8.0).

tldr:
- TAIKO bonds are escrowed in the TaikoL1 contract and only manually withdrawn using `withdrawBond()` by proposers / provers. For efficiency, bonds can be deposited once in the contract and be left there.
- ring buffer size increased by 36 000 blocks (5 days worth of blocks @ 12 seconds). `getVerifiedBlockProver` can be called on these blocks to get their prover's address.
- `CalldataTxList` emitted when calldata is used as DA (to be used for derivation)

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.$implementation:
-        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
+        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
      values.getConfig.blockRingBufferSize:
-        324512
+        360000
      values.impl:
-        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
+        "0xcEe590fACd976B9BDE87BC1B7620B284c5edD2C3"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      values.$implementation:
-        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
+        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
      values.impl:
-        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
+        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
    }
```

## Source code changes

```diff
.../ProverSetProxy/ProverSet.sol                   |   41 +-
 .../TaikoL1Contract/TaikoL1.sol                    | 3683 ++++++++++----------
 2 files changed, 1924 insertions(+), 1800 deletions(-)
```

Generated with discovered.json: 0xd7d312e4f6b226cdfb6b99d711a06dfdbe019f7c

# Diff at Mon, 08 Jul 2024 13:19:34 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d3100be6db9452d1d69138aa6310415ece67a66f block: 20232590
- current block number: 20262044

## Description

New ProverSet implementation: added possibility for authorized admin to call depositBond and withdrawBond on TaikoL1contract. These functions don't exist yet on TaikoL1contract, so this change is probably the beginning of a bigger update.

ProverSet address changed in L1RollupAddressManager, old implementation still in use under ProverSetProxy.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.prover_set:
-        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
+        "0x518845daA8870bE2C59E49620Fc262AD48953C9a"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSet (0x518845daA8870bE2C59E49620Fc262AD48953C9a)
    +++ description: None
```

## Source code changes

```diff
.../taiko/ethereum/{.flat@20232590 => .flat}/ProverSet.sol     | 10 ++++++++++
 1 file changed, 10 insertions(+)
```

Generated with discovered.json: 0x6ea276c960b8bccf9d9d8ae744307cada936d2e3

# Diff at Wed, 03 Jul 2024 10:37:45 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@417b81634137b0450205477c050237b6c177f5d9 block: 20189741
- current block number: 20225431

## Description

- L1RollupAddressManager.sol: changed harcoded B_TIER_ROUTER address.
- Bridge.sol: small change in retryMessage logic.
- TaikoL1.sol: changes in block verification. assignedProver and hookCalls now DEPRECATED. assignedProver is now msg.sender of proposeBlock tx. New getters (getLastVerifiedBlock, getLastSyncedBlock), and decreased liveness bond to 125 TAIKO. Block proposers can now bribe the Ethereum block builder. Move some functions into libraries.
- TaikoToken.sol: can now call batchTransfer for multiple recipients and amounts.
- TierProviderV2.sol: validityBond and contestBond decreased (halved), cooldownWindow decreased (24h to 4h) for tiers TIER_SGX,TIER_GUARDIAN_MINORITY, for TIER_GUARDIAN increased from 1 to 24 hours. maxBlocksToVerifyPerProof now deprecated.
- TierRouter.sol: change hardcoded tier provider address.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
+        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      implementations.0:
-        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
+        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      values.getConfig.maxBlocksToVerifyPerProposal:
-        10
      values.getConfig.livenessBond:
-        "250000000000000000000"
+        "125000000000000000000"
      values.getConfig.blockSyncThreshold:
-        32
      values.getConfig.maxBlocksToVerify:
+        16
      values.getConfig.stateRootSyncInternal:
+        16
      values.impl:
-        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
+        "0x5fc54737ECC1de49D58AE1195d4A296257F1E31b"
      values.slotA:
-        {"genesisHeight":19923613,"genesisTimestamp":1716358991,"lastSyncedBlockId":105566,"lastSynecdAt":1719571751}
      values.slotB:
-        {"numBlocks":108928,"lastVerifiedBlockId":105588,"provingPaused":false,"__reservedB1":0,"__reservedB2":0,"__reservedB3":0,"lastUnpausedAt":1716571955}
      values.tier_router:
-        "0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F"
+        "0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.implementation:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "0xcfe803378D79d1180EbF030455040EA6513869dF"
      implementations.0:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "0xcfe803378D79d1180EbF030455040EA6513869dF"
      values.impl:
-        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
+        "0xcfe803378D79d1180EbF030455040EA6513869dF"
    }
```

```diff
-   Status: DELETED
    contract TierProviderV2 (0x4cffe56C947E26D07C14020499776DB3e9AE3a23)
    +++ description: None
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.implementation:
-        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
+        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
      implementations.0:
-        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
+        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
      values.impl:
-        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
+        "0x29a88d60246C76E4F28806b9C8a42d2183154900"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
+        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
      implementations.0:
-        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
+        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
      values.impl:
-        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
+        "0xa303784B0557BF1F1FB8b8abEF2B18a005722689"
    }
```

```diff
-   Status: DELETED
    contract TierRouter (0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F)
    +++ description: None
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
+        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
      implementations.0:
-        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
+        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
      values.impl:
-        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
+        "0x01E7D369a619eF1B0E92563d8737F42C09789986"
    }
```

```diff
+   Status: CREATED
    contract TierProvider (0x3a1A900680BaADb889202faf12915F7E47B71ddd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TierRouter (0x6E997f1F22C40ba37F633B08f3b07E10Ed43155a)
    +++ description: None
```

## Source code changes

```diff
.../L1RollupAddressManager.sol                     |   2 +-
 .../TaikoBridge/Bridge.sol                         |  11 +-
 .../TaikoL1Contract/TaikoL1.sol                    | 874 +++++++++++----------
 .../TaikoToken/TaikoToken.sol                      |  21 +-
 .../TierProviderV2.sol => .flat/TierProvider.sol}  |  41 +-
 .../{.flat@20189741 => .flat}/TierRouter.sol       |   2 +-
 6 files changed, 504 insertions(+), 447 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20189741 (main branch discovery), not current.

```diff
    contract TierProvider (0x4cffe56C947E26D07C14020499776DB3e9AE3a23) {
    +++ description: None
      name:
-        "TierProvider"
+        "TierProviderV2"
      values.active_tiers:
-        [["0x746965725f736778000000000000000000000000000000000000000000000000"],["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000"],["0x746965725f677561726469616e00000000000000000000000000000000000000"]]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_GUARDIAN:
-        ["0x746965725f677561726469616e00000000000000000000000000000000000000",0,0,60,2880,16]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_GUARDIAN_MINORITY:
-        ["0x746965725f677561726469616e5f6d696e6f7269747900000000000000000000","500000000000000000000","3280000000000000000000",1440,2880,16]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_OPTIMISTIC:
-        ["0x0000000000000000000000000000000000000000000000000000000000000000","250000000000000000000","500000000000000000000",1440,30,16]
+++ description: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_SGX:
-        ["0x746965725f736778000000000000000000000000000000000000000000000000","250000000000000000000","1640000000000000000000",1440,60,8]
+++ description: tuple args: verifierName, validityBond, contestBond, cooldownWindow, provingWindow, maxBlocksToVerifyPerProof
      values.TIER_SGX_ZKVM:
-        ["0x746965725f7367785f7a6b766d00000000000000000000000000000000000000","500000000000000000000","3280000000000000000000",1440,240,4]
      values.getMinTier:
+        [200,200,200,200,200]
      errors:
+        {"getMinTier":"Too many values. Update configuration to explore fully"}
    }
```

```diff
    contract TierRouter (0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F) {
    +++ description: None
      values.tier_provider:
-        "0x4cffe56C947E26D07C14020499776DB3e9AE3a23"
      values.getProvider:
+        ["0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23","0x4cffe56C947E26D07C14020499776DB3e9AE3a23"]
      errors:
+        {"getProvider":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x1a9d9e0714596a68f80cbf3b326f615b15bcfa66

# Diff at Fri, 28 Jun 2024 10:59:39 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0e63a13c0f6c2f62229e33cb4ab4b36a93715b3d block: 20063194
- current block number: 20189741

## Description

Update to bridge implementation, main changes include a new calculation of messageCalldataCost, used to calculate minimal gas limit required for sending bridge messages. Also removed SafeCastUpgradeable library.

## Watched changes

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
+        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
      implementations.0:
-        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
+        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
      values.CALLDATA_MESSAGE_SIZE_BYTES:
-        352
      values.impl:
-        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
+        "0x40f8Be2969D0D5717768F6799c8840e5D5D603F7"
    }
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 1249 ++------------------
 1 file changed, 88 insertions(+), 1161 deletions(-)
```

Generated with discovered.json: 0x9ec7174f8eea99746043ca4c4f61cd3f85b9c3f0

# Diff at Mon, 10 Jun 2024 18:24:02 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d3c8c03ba1310e94fe51ccffffb90b46e5ec9ea9 block: 20054153
- current block number: 20063194

## Description

Moved consumeTokenQuota from beginning to very end of _transferTokens function. Quota manager contract is currently not set.

## Watched changes

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
      implementations.0:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
      values.impl:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
    }
```

## Source code changes

```diff
.../ethereum/{.flat@20054153 => .flat}/SharedERC20Vault/ERC20Vault.sol | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)
```

Generated with discovered.json: 0x11db6f6b7eec90e64b2483ebac75da462cc2cc5a

# Diff at Sun, 09 Jun 2024 12:06:08 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 20039414
- current block number: 20054153

## Description

Added "payable" to proposeBlock function in ProverSet. Calling proposeBlocks from ProverSet allows the ProverSetProxy to be the proposer of the block. On proveBlock(), also called from ProverSetProxy, there will be no validityBond posted as net transfers will be zero, since the TaikoL1 needs to return the livenessBond (250 TAIKO) to ProverSetProxy, and the validityBond (250 TAIKO) is of the same amount.
There are no special privileges for ProverSetProxy or its set provers in TaikoL1 contract.

Also new SGX instances registered.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.prover_set:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd)
    +++ description: None
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
      implementations.0:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
      values.impl:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1)
    +++ description: None
```

## Source code changes

```diff
.../ProverSet-0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1.sol}            | 1 +
 .../ethereum/{.flat@20039414 => .flat}/ProverSetProxy/ProverSet.sol      | 1 +
 2 files changed, 2 insertions(+)
```

Generated with discovered.json: 0x038e91afa3edebd8b8da34afbe138b21b7d82f25

# Diff at Fri, 07 Jun 2024 10:40:21 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@41d748a25dcae1e5bca51dff605a48b4ddac2c56 block: 20032840
- current block number: 20039414

## Description

- ProverSet.sol: can now propose blocks by calling proposeBlock from proverSet contract, which will in turn call TaikoL1 proposeBlock().
- ERC20Vault.sol - LibStrings update, typo fixes and gas optimisations.
- SignalService.sol - Reverted to old implementation of SignalService (0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d). It is now back to old LibStrings, expecting an update soon.
- Bridge.sol - LibStrings update, added a max size for a calldata message to be processable by a relayer during proof verification.
- TaikoL1.sol - Added L1_NO_HOOKS error but not used. Fixed a bug where if they passed no hooks in the input params the livenessBond wouldn't be transferred.
- TaikoToken.sol - Added delegates function, not allowed to delegate to TaikoL1 or ERC20Vault.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      implementations.0:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.getConfig.6:
-        16
+        32
      values.getConfig.2:
-        432512
+        324512
      values.getConfig.1:
-        432000
+        324000
      values.impl:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.prover_set:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.implementation:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
      implementations.0:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
      values.impl:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
      implementations.0:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
      values.impl:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
      implementations.0:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
      values.impl:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.implementation:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      implementations.0:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      values.impl:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.instances.7:
+        ["0x6F6C0837b2c45B1bfE970bd5a0BB171605cb44F3"]
      values.instances.6:
+        ["0x4A9d339c94D1D3b685e3923907A98c73b8168AFF"]
      values.nextInstanceId:
-        6
+        8
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F)
    +++ description: None
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      implementations.0:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      values.impl:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      values.CALLDATA_MESSAGE_SIZE_BYTES:
+        352
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd)
    +++ description: None
```

## Source code changes

```diff
...0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd.sol} | 14 ++++-
 .../ProverSetProxy/ProverSet.sol                   | 14 ++++-
 .../SharedERC20Vault/ERC20Vault.sol                | 45 +++++++-------
 .../SignalService/SignalService.sol                | 70 ++++++++--------------
 .../TaikoBridge/Bridge.sol                         | 31 +++++++---
 .../TaikoL1Contract/TaikoL1.sol                    | 66 +++++++++-----------
 .../TaikoToken/TaikoToken.sol                      | 10 ++++
 7 files changed, 134 insertions(+), 116 deletions(-)
```

Generated with discovered.json: 0x5d7159ace678f291bde2f744c708641bebd2b669

# Diff at Thu, 06 Jun 2024 12:40:03 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@68b8e831d7a9790dc56ed4caf0e841fbec8adb53 block: 20018468
- current block number: 20032840

## Description

TaikoL1Contract implementation update:
- Retrieve the tier configurations based on router rather than tier_provider
- Removed L1_UNAUTHORIZED error and _isProposerPermitted function, making block proposing permissionless.
- checkEOAForCalldataDA is not in getConfig(), used when blob usages is not detected, it will check the calldata for tx data.
- LibStrings changes: removed assignment_hook, proposer and proposer_one. Proposer and proposer_one still resolve but unused since _isProposerPermitted is removed. 

SignalService update: getSyncedChainData to getSyncedChainHeight, some error changes.

Prover_set update: reflect changes to LibStrings, made natively aware of taiko token.

SGXVerifier update: reflect changes to LibStrings, some error changes. _replaceInstance only if new instance != old instance.

GuardianProver(s) update: safeApprove and safeTransfer function to approve and transfer. Reflect changes to LibStrings.

L1RollupAddressManager update: removed B_ASSIGNMENT_HOOK, B_PROPOSER, B_PROPOSER_ONE, B_TIER_PROVIDER. Added B_TIER_ROUTER.


## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      implementations.0:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      values.assignment_hook:
-        "0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6"
+        "0x0000000000000000000000000000000000000000"
      values.getConfig.7:
+        true
      values.impl:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      values.prover_set:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x500735343372Dd6c9B84dBc7a75babf4479742B9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6)
    +++ description: None
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      upgradeability.implementation:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      implementations.0:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      values.impl:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.implementation:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
      implementations.0:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
      values.impl:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
      implementations.0:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
      values.impl:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        26
+        28
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.implementation:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
      implementations.0:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
      values.impl:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      upgradeability.implementation:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
      implementations.0:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
      values.impl:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      upgradeability.implementation:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      implementations.0:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      values.impl:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F)
    +++ description: None
```

## Source code changes

```diff
.../AssignmentHook/AssignmentHook.sol => /dev/null | 2714 --------------------
 .../AssignmentHook/ERC1967Proxy.p.sol => /dev/null |  593 -----
 .../GuardianMinorityProver/GuardianProver.sol      |  136 +-
 .../GuardianProver.sol                             |  136 +-
 .../L1RollupAddressManager.sol                     |    8 +-
 ...0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F.sol} |   85 +-
 .../ProverSetProxy/ProverSet.sol                   |   85 +-
 .../SgxVerifier/SgxVerifier.sol                    |   40 +-
 .../SignalService/SignalService.sol                |   70 +-
 .../TaikoL1Contract/TaikoL1.sol                    |  333 +--
 10 files changed, 263 insertions(+), 3937 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20018468 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.tier_sgx_zkvm:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_SGX_ZKVM:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6) {
    +++ description: None
      values.proxiableUUID:
-        "EXPECT_REVERT"
      errors:
+        {"proxiableUUID":"Multicall failed"}
    }
```

Generated with discovered.json: 0xc7cd32149b27868b3a50016ee3970759f8e9aa0d

# Diff at Tue, 04 Jun 2024 09:25:32 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@8229f24e26195fa97d8d36bab0dd2d52dec7efa6 block: 20009991
- current block number: 20017546

## Description

Two contracts implementation changed, TaikoL1.sol, and Bridge.sol.
- TaikoL1.sol: introduced B_TIER_ROUTER = bytes32("tier_router") to replace B_TIER_PROVIDER
- Bridge.sol: Added a max proof size for a message to be processable by a relayer, an insufficent gas check, and added the B_TIER_ROUTER variable support.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      implementations.0:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.impl:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.tier_router:
-        "0x0000000000000000000000000000000000000000"
+        "0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        24
+        26
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      implementations.0:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      values.impl:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      values.RELAYER_MAX_PROOF_BYTES:
+        200000
    }
```

```diff
+   Status: CREATED
    contract TierRouter (0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F)
    +++ description: None
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 131 +++++++++++++--------
 .../TaikoL1Contract/TaikoL1.sol                    |  68 ++++++-----
 .../taiko/ethereum/.flat/TierRouter.sol            |  15 +++
 3 files changed, 133 insertions(+), 81 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20009991 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.tier_provider:
-        "0x4cffe56C947E26D07C14020499776DB3e9AE3a23"
      values.tier_router:
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x46b03e9120fb191d6dc7e9e29ada0f5de7841449

# Diff at Mon, 03 Jun 2024 08:06:00 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3f44aa4fafff6ecd52bf4dcc77df7a9b1884b765 block: 19985265
- current block number: 20009991

## Description

Change in bridge implementation processMessage function: message Status and B_OUT_OF_ETH_QUOTA revert logic.

## Watched changes

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        23
+        24
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
      implementations.0:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
      values.impl:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
    }
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 79 ++++++++++------------
 1 file changed, 37 insertions(+), 42 deletions(-)
```

Generated with discovered.json: 0x1de79ace616f10bb275665d3e223e2f7b9555b6c

# Diff at Thu, 30 May 2024 21:14:50 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@95f6b3cb82fafd7d8a66bb00c4812b8c0f2475a5 block: 19983331
- current block number: 19985265

## Description

Admin fetching bug fix, ignore discovery values. 

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19983331 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.instances.5.1:
-        1717080167
      values.instances.4.1:
-        1717080191
      values.instances.3.1:
-        1716720623
      values.instances.2.1:
-        1716625511
      values.instances.1.1:
-        1716802247
      values.instances.0.1:
-        1715680091
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

Generated with discovered.json: 0x3c58d71994fa7ba68b7629963e8d666c48d91dcd

# Diff at Thu, 30 May 2024 14:43:53 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19983331

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a)
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
```

```diff
+   Status: CREATED
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TierProvider (0x4cffe56C947E26D07C14020499776DB3e9AE3a23)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSet (0x500735343372Dd6c9B84dBc7a75babf4479742B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c)
    +++ description: Verifier contract for blocks proven by Guardian minority.
```

```diff
+   Status: CREATED
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9)
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
```

```diff
+   Status: CREATED
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
+   Status: CREATED
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC)
    +++ description: Verifier contract for Guardian proven blocks.
```

```diff
+   Status: CREATED
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa)
    +++ description: None
```

