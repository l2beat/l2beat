Generated with discovered.json: 0x41ba141115593de23e25a41ef173868064cb70db

# Diff at Fri, 23 Aug 2024 09:53:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xb81be2d309fbabf0f34e1cf39f94a516caac2ab2

# Diff at Wed, 21 Aug 2024 10:03:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"],"configure":["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f","via":[]},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[]},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[]},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","via":[]},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[]},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[]},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[]},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[]}]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

Generated with discovered.json: 0xc988d44587d40c17e96c4210210f3743a3f3cd5a

# Diff at Fri, 09 Aug 2024 12:00:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.4:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      assignedPermissions.upgrade.3:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      assignedPermissions.upgrade.2:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      assignedPermissions.upgrade.1:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      assignedPermissions.upgrade.0:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
    }
```

Generated with discovered.json: 0x3c1e04c49c1534797ef43b1068b0a76881f43b28

# Diff at Fri, 09 Aug 2024 10:10:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]
      assignedPermissions.configure:
+        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"]
      assignedPermissions.owner:
-        ["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]
      assignedPermissions.upgrade:
+        ["0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"]
      assignedPermissions.configure:
+        ["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]
      assignedPermissions.configure:
+        ["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

Generated with discovered.json: 0x4220929a666aee751752bbed1141d7d708ba2ef8

# Diff at Tue, 30 Jul 2024 11:12:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x8d4557f91adb07eed80d7b422ffce2b174c2270e

# Diff at Tue, 23 Jul 2024 10:36:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@490aaec1a76ba293d442449146dd7c8335f4b7a1 block: 20367772
- current block number: 20368673

## Description

EOA signer removed, the LiskRollupOwnerMultisig is now just a transparent MS for Gelato MS. Warning removed from FE.

## Watched changes

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 1 (100%)"
      values.getOwners.1:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
    }
```

Generated with discovered.json: 0x4ea5b8947e58d62a04b241936e836cfc4c567bba

# Diff at Tue, 23 Jul 2024 07:36:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20339917
- current block number: 20367772

## Description

Challenger and Guardian are changed to the GelatoMultisig. Rollup Upgrade owner is still an EOA (and additionally GelatoMS).

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: None
      values.owner:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: None
      values.challenger:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.CHALLENGER:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.GUARDIAN:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
      values.getOwners.1:
+        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
      values.getOwners.0:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 952 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xbbda4273693b98590b45a10179daf316b84586ba

# Diff at Fri, 19 Jul 2024 10:16:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20339917

## Description

Initial discovery: OP stack rollup on the latest superchain (fork) contracts. EOA-governed without being in the Superchain governance.

## Initial discovery

```diff
+   Status: CREATED
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45)
    +++ description: None
```
