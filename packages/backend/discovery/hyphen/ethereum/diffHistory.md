Generated with discovered.json: 0xe7c918d68b1a0189e5d881fee3ce3f5231bafc77

# Diff at Mon, 22 Jan 2024 13:06:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@42f07246c25b819542d5b57f09b8ddcdcc321c42 block: 16154924
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
