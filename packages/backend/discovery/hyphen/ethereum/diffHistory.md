Generated with discovered.json: 0x412b1b55ccdc087f52adb8ff99397c60bed85ea6

# Diff at Tue, 01 Oct 2024 10:51:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20138492
- current block number: 20138492

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138492 (main branch discovery), not current.

```diff
    contract LiquidityPool (0x2A5c2568b10A0E826BfA892Cf21BA7218310180b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-03-12T23:49:50.000Z",["0x279ac60785A2FCb85550EB243B9A42A543171Cc7"]],["2022-03-16T22:52:30.000Z",["0xD0eE149a4Ceec165C456C1E2D4372318e4Df82bd"]],["2022-05-12T18:33:22.000Z",["0x6C0CbaC5337Cf577452e99A18320fc5656Bd61E7"]],["2022-07-26T15:35:56.000Z",["0x256415A1f9468E5405abdAfD9B76c4f24451d7E7"]],["2023-12-30T09:50:47.000Z",["0x4906b8E690EB1E09Fec924422452d1105D59d042"]]]
    }
```

```diff
    contract TokenManager (0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-05-12T13:04:49.000Z",["0x79E559AC5b499A5676e28f0074e29763F6c2A27e"]]]
    }
```

```diff
    contract LiquidityProviders (0xebaB24F13de55789eC1F3fFe99A285754e15F7b9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-03-12T23:49:02.000Z",["0x6cc7E949807c0945afcb2be0C92F42191b31dFD7"]],["2022-05-12T18:25:42.000Z",["0x52a592fFE0377b351c8FD99189e5333ec362d66A"]],["2023-12-30T09:47:23.000Z",["0x38391eA26F9EeE3ab81DE3C7eE9e168da5149103"]]]
    }
```

Generated with discovered.json: 0xb357a0ef871094ffa94510b049480c9102e6f3e3

# Diff at Fri, 30 Aug 2024 07:53:05 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20138492
- current block number: 20138492

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138492 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13a4cC0750296bB72Eb0006febec306551A4f472) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x9d16f40288e4ef64aea185e5a0b2481228e6d8e6

# Diff at Fri, 23 Aug 2024 09:52:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20138492
- current block number: 20138492

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138492 (main branch discovery), not current.

```diff
    contract LiquidityPool (0x2A5c2568b10A0E826BfA892Cf21BA7218310180b) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract TokenManager (0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LiquidityProviders (0xebaB24F13de55789eC1F3fFe99A285754e15F7b9) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x4d887d0e9fec6480e83e095b5414037fff5b864f

# Diff at Wed, 21 Aug 2024 10:03:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20138492
- current block number: 20138492

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138492 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13a4cC0750296bB72Eb0006febec306551A4f472) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2A5c2568b10A0E826BfA892Cf21BA7218310180b","0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168","0xebaB24F13de55789eC1F3fFe99A285754e15F7b9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2A5c2568b10A0E826BfA892Cf21BA7218310180b","via":[]},{"permission":"upgrade","target":"0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168","via":[]},{"permission":"upgrade","target":"0xebaB24F13de55789eC1F3fFe99A285754e15F7b9","via":[]}]
    }
```

```diff
    contract LiquidityPool (0x2A5c2568b10A0E826BfA892Cf21BA7218310180b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13a4cC0750296bB72Eb0006febec306551A4f472","via":[]}]
    }
```

```diff
    contract TokenManager (0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13a4cC0750296bB72Eb0006febec306551A4f472","via":[]}]
    }
```

```diff
    contract LiquidityProviders (0xebaB24F13de55789eC1F3fFe99A285754e15F7b9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13a4cC0750296bB72Eb0006febec306551A4f472","via":[]}]
    }
```

Generated with discovered.json: 0xf2e32dc2eccc06b39b37157c31c1cdd8b989de1e

# Diff at Fri, 09 Aug 2024 11:59:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20138492
- current block number: 20138492

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138492 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13a4cC0750296bB72Eb0006febec306551A4f472) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168"
+        "0xebaB24F13de55789eC1F3fFe99A285754e15F7b9"
      assignedPermissions.upgrade.1:
-        "0xebaB24F13de55789eC1F3fFe99A285754e15F7b9"
+        "0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168"
    }
```

Generated with discovered.json: 0xe367300a8ff3bdf02df3b0bedd35254c4d1b1b03

# Diff at Fri, 09 Aug 2024 10:09:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20138492
- current block number: 20138492

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138492 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13a4cC0750296bB72Eb0006febec306551A4f472) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2A5c2568b10A0E826BfA892Cf21BA7218310180b","0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168","0xebaB24F13de55789eC1F3fFe99A285754e15F7b9"]
      assignedPermissions.upgrade:
+        ["0x2A5c2568b10A0E826BfA892Cf21BA7218310180b","0xebaB24F13de55789eC1F3fFe99A285754e15F7b9","0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168"]
    }
```

Generated with discovered.json: 0xb0a7f3993dd39cf765af447ed95de9a0642fbd48

# Diff at Fri, 21 Jun 2024 07:06:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 19062459
- current block number: 20138492

## Description

Fee ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19062459 (main branch discovery), not current.

```diff
    contract LiquidityProviders (0xebaB24F13de55789eC1F3fFe99A285754e15F7b9) {
    +++ description: None
      values.getFeeAccumulatedOnNft:
-        [635333863248404,230,0,249]
    }
```

Generated with discovered.json: 0x1cdd398d02c759d7e020b1e98c34f8872de8e3eb

# Diff at Mon, 22 Jan 2024 13:06:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@42f07246c25b819542d5b57f09b8ddcdcc321c42 block: 16154924
- current block number: 19062459

## Description

Whole update seems like a patch for a situation where the funds of the bridge
change through non-native withdrawing, the owner is now able to reset the
bridge to a proper state.

### LiquidityPool

Whole contract got flattened.
A new public function `setCurrentLiquidity(address tokenAddress)` callable only by the owner.
It gets the current liquidity for any given token and sets it in the `liquidityProvider` object.

### LiquidityProviders

Whole contract got flattened.
A new function callable only by the LiquidityPool contract called `setCurrentLiquidity(address tokenAddress, uint256 amount)`.
It sets the `currentLiquidity[tokenAddress] = amount`.

## Watched changes

```diff
    contract LiquidityPool (0x2A5c2568b10A0E826BfA892Cf21BA7218310180b) {
      upgradeability.implementation:
-        "0x256415A1f9468E5405abdAfD9B76c4f24451d7E7"
+        "0x4906b8E690EB1E09Fec924422452d1105D59d042"
      implementations.0:
-        "0x256415A1f9468E5405abdAfD9B76c4f24451d7E7"
+        "0x4906b8E690EB1E09Fec924422452d1105D59d042"
    }
```

```diff
    contract LiquidityProviders (0xebaB24F13de55789eC1F3fFe99A285754e15F7b9) {
      upgradeability.implementation:
-        "0x52a592fFE0377b351c8FD99189e5333ec362d66A"
+        "0x38391eA26F9EeE3ab81DE3C7eE9e168da5149103"
      implementations.0:
-        "0x52a592fFE0377b351c8FD99189e5333ec362d66A"
+        "0x38391eA26F9EeE3ab81DE3C7eE9e168da5149103"
    }
```

## Source code changes

```diff
.../access/OwnableUpgradeable.sol => /dev/null     |   78 -
 .../proxy/utils/Initializable.sol => /dev/null     |   46 -
 .../security/PausableUpgradeable.sol => /dev/null  |   97 -
 .../ReentrancyGuardUpgradeable.sol => /dev/null    |   68 -
 .../token/ERC20/IERC20Upgradeable.sol => /dev/null |   81 -
 .../utils/SafeERC20Upgradeable.sol => /dev/null    |   98 -
 .../utils/AddressUpgradeable.sol => /dev/null      |  189 --
 .../utils/ContextUpgradeable.sol => /dev/null      |   31 -
 .../LiquidityPool/implementation/LiquidityPool.sol | 1890 ++++++++++++++++++++
 .../hyphen/LiquidityPool.sol => /dev/null          |  805 ---------
 .../interfaces/IExecutorManager.sol => /dev/null   |   21 -
 .../ILiquidityProviders.sol => /dev/null           |   68 -
 .../interfaces/ISwapAdaptor.sol => /dev/null       |   18 -
 .../interfaces/ITokenManager.sol => /dev/null      |   37 -
 .../ERC2771ContextUpgradeable.sol => /dev/null     |   57 -
 .../hyphen/structures/SwapRequest.sol => /dev/null |   12 -
 .../hyphen/structures/TokenConfig.sol => /dev/null |   15 -
 .../interfaces/IERC20Permit.sol => /dev/null       |   21 -
 .../contracts/security/Pausable.sol => /dev/null   |   77 -
 .../LiquidityPool/implementation/meta.txt          |    2 +-
 .../access/OwnableUpgradeable.sol => /dev/null     |   78 -
 .../proxy/utils/Initializable.sol => /dev/null     |   46 -
 .../security/PausableUpgradeable.sol => /dev/null  |   97 -
 .../ReentrancyGuardUpgradeable.sol => /dev/null    |   68 -
 .../token/ERC20/IERC20Upgradeable.sol => /dev/null |   81 -
 .../utils/SafeERC20Upgradeable.sol => /dev/null    |   98 -
 .../utils/AddressUpgradeable.sol => /dev/null      |  189 --
 .../utils/ContextUpgradeable.sol => /dev/null      |   31 -
 .../implementation/LiquidityProviders.sol          | 1687 +++++++++++++++++
 .../hyphen/LiquidityProviders.sol => /dev/null     |  492 -----
 .../hyphen/interfaces/ILPToken.sol => /dev/null    |   92 -
 .../interfaces/ILiquidityPool.sol => /dev/null     |   94 -
 .../interfaces/ITokenManager.sol => /dev/null      |   37 -
 .../IWhiteListPeriodManager.sol => /dev/null       |   73 -
 .../ERC2771ContextUpgradeable.sol => /dev/null     |   57 -
 .../structures/LpTokenMetadata.sol => /dev/null    |    8 -
 .../hyphen/structures/TokenConfig.sol => /dev/null |   15 -
 .../contracts/security/Pausable.sol => /dev/null   |   77 -
 .../LiquidityProviders/implementation/meta.txt     |    2 +-
 39 files changed, 3579 insertions(+), 3454 deletions(-)
```
