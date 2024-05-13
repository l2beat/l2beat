Generated with discovered.json: 0x1be769dd7c57d040bbbab89bd20d2c7b751d5419

# Diff at Mon, 13 May 2024 08:17:32 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19573574
- current block number: 19859844

## Description

One signer of the frxETH Multisig is changed.

## Watched changes

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: This address is the owner of the gas token contract frxETH, and the frxETHMinter contract. It can pause and unpause ETH deposits, and change how much ETH is withheld from each submit() transaction.
      values.getOwners.3:
-        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
+        "0x8da4E997e051605878c9C0B793c496556EACC2C0"
    }
```

Generated with discovered.json: 0x8b040a76aba80d05b354d6a3599890e6aefd6263

# Diff at Wed, 03 Apr 2024 06:51:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b58073d6e00a407c2aba3b43af1c68de0726a85a block: 19532850
- current block number: 19573574

## Description

One signer of frxETH Multisig is changed.

## Watched changes

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: This address is the owner of the gas token contract frxETH, and the frxETHMinter contract. It can pause and unpause ETH deposits, and change how much ETH is withheld from each submit() transaction.
      values.getOwners.3:
-        "0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"
+        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
    }
```

Generated with discovered.json: 0xf2ca2b1fecb97feb06e36aecc6f50407d20055c1

# Diff at Thu, 28 Mar 2024 13:17:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d6dd20a306b268b851f83df5487b048c1253bb51 block: 19531830
- current block number: 19532850

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531830 (main branch discovery), not current.

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x0f8dee218ea3b0b3545bdbcadcdc249d145a3a03

# Diff at Fri, 15 Mar 2024 10:25:21 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6a294996c13c1a3ad00c7c4d72e651e8fbd4fa1c block: 19412037
- current block number: 19439733

## Description

One signer in the multisig is changed.

## Watched changes

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
+++ description: Signers of the multisig, high severity if threshold changes
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0xf4E1d185666a624099298FcC42C50ba662DC7e52"
+        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
    }
```

Generated with discovered.json: 0xc7d883541dcc997f1ca9944846e1b7ddd7675f47

# Diff at Mon, 11 Mar 2024 13:05:47 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19384276
- current block number: 19412037

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: None
      values.withholdRatio:
-        920000
+        980000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19384276 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xc776573184b74c22a61dc03318859dd4c0928cea

# Diff at Thu, 07 Mar 2024 15:46:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@b0c42602239073a6821d73af2ad55522306d8622 block: 19374912
- current block number: 19384276

## Description

Ignored nonces, totalSupply and deposit count/root methods.

## Watched changes

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      values.getOwners.0:
-        "0xf4E1d185666a624099298FcC42C50ba662DC7e52"
+        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
    }
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      values.getOwners.1:
-        "0xf4E1d185666a624099298FcC42C50ba662DC7e52"
+        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
    }
```

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: None
      values.numValidators:
-        212
+        211
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      values.getOwners[5]:
-        "0xE7c147CD1A7c05a6e73217645547582024E87a9B"
    }
```

Generated with discovered.json: 0xa0e7c3cc5c7b0345b997f268444feac8ada39a1b

# Diff at Wed, 06 Mar 2024 08:24:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19374912

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintableERC20FactoryProxy (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508)
    +++ description: None
```
