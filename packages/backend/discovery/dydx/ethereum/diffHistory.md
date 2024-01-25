Generated with discovered.json: 0x30f26d5087ec6f2f74616df94d036f43bfbb907e

# Diff at Wed, 10 Jan 2024 08:28:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@47499b2e645343d8fd16b1ecc8f9d4e11fbc57a1 block: 18969236
- current block number: 18975357

## Description

Changes necessary for diff history module.

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18969236 (main branch discovery), not current.

```diff
    contract StarkPerpetual (0xD54f502e184B6B739d7D27a6410a67dc462D69c8) {
      values.identify:
-        "StarkWare_PerpetualTokensAndRamping_2020_1"
    }
```

# Diff at Tue, 09 Jan 2024 11:54:37 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@75d008bcf5c1a0074ab8238c64ea85119a5c1f0e block: 18282753
- current block number: 18969236

## Description

Implementation of [Proposal DIP-29](https://dydx.community/dashboard/proposal/16)
intended to bridge ethDYDX tokens from Treasury on Ethereum to dYdX Chain.

## Watched changes

```diff
    contract Treasury (0x639192D54431F8c816368D3FB4107Bc168d0E871) {
      name:
-        "Treasury"
+        "TreasuryBridge"
      upgradeability.implementation:
-        "0x0AdA60E07717Ab19E4A466f5f0ac68A66e3995Ce"
+        "0x8d0051943D4c72aF12D638c6b7253C71929A910A"
      implementations.0:
-        "0x0AdA60E07717Ab19E4A466f5f0ac68A66e3995Ce"
+        "0x8d0051943D4c72aF12D638c6b7253C71929A910A"
      values.BRIDGE:
+        "0x46b2DeAe6eFf3011008EA27EA36b7c27255ddFA9"
      values.BURN_ADDRESS:
+        "0x0000000000000000000000000000000000000001"
      values.TREASURY_VESTER:
+        "0xb9431E19B29B952d9358025f680077C3Fd37292f"
    }
```

```diff
    contract TreasuryVester (0xb9431E19B29B952d9358025f680077C3Fd37292f) {
      values.recipient:
-        "0x639192D54431F8c816368D3FB4107Bc168d0E871"
+        "0x0000000000000000000000000000000000000001"
    }
```

## Source code changes

```diff
.../Treasury/implementation/meta.txt => /dev/null  |  2 -
 .../treasury/Treasury.sol => /dev/null             | 54 ------------
 .../dependencies/open-zeppelin/Address.sol         |  0
 .../dependencies/open-zeppelin/Context.sol         |  0
 .../open-zeppelin/OwnableUpgradeable.sol           |  0
 .../dependencies/open-zeppelin/SafeERC20.sol       |  0
 .../dependencies/open-zeppelin/SafeMath.sol        |  0
 .../implementation/governance/bridge/IBridge.sol   | 38 +++++++++
 .../implementation/interfaces/IERC20.sol           |  2 +-
 .../.code/TreasuryBridge/implementation/meta.txt   |  2 +
 .../implementation/treasury/Treasury.sol           | 65 +++++++++++++++
 .../implementation/treasury/TreasuryBridge.sol     | 84 +++++++++++++++++++
 .../implementation/treasury/TreasuryVester.sol     | 96 ++++++++++++++++++++++
 .../utils/VersionedInitializable.sol               |  0
 .../TreasuryBridge}/proxy/Address.sol              |  0
 .../proxy/AdminUpgradeabilityProxy.sol             |  0
 .../proxy/BaseAdminUpgradeabilityProxy.sol         |  0
 .../proxy/BaseUpgradeabilityProxy.sol              |  0
 .../InitializableAdminUpgradeabilityProxy.sol      |  0
 .../proxy/InitializableUpgradeabilityProxy.sol     |  0
 .../TreasuryBridge}/proxy/Proxy.sol                |  0
 .../TreasuryBridge}/proxy/UpgradeabilityProxy.sol  |  0
 .../TreasuryBridge}/proxy/meta.txt                 |  0
 23 files changed, 286 insertions(+), 57 deletions(-)
```

# Diff at Thu, 05 Oct 2023 07:17:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bd8583bb786deb2218b31cd53ffe833ba3b0b72a

## Description

Proposal: <https://dydx.community/dashboard/proposal/15>

TLDR: added wethDYDX in the calculation of governance power. wethDYDX is a token minted by locking Ethereum DYDX tokens (called ethDYDX) permanently which will be later bridged to the dYdX Chain. wethDYDX is a transferrable ERC20. Does this mean that tokens will get duplicated?

We don't have a specific section on the website to specify this information, but we will soon with the Governance section, so I'll wait before adding anything to the project page.

## Watched changes

```diff
    contract DydxGovernor (0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2) {
      values.getGovernanceStrategy:
-        "0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9"
+        "0xc2f5F3505910Da80F0592a3Cc023881C50b16505"
    }
```

```diff
-   Status: DELETED
    contract GovernanceStrategy (0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9) {
    }
```

```diff
+   Status: CREATED
    contract WrappedEthereumDydxToken (0x46b2DeAe6eFf3011008EA27EA36b7c27255ddFA9) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceStrategyV2 (0xc2f5F3505910Da80F0592a3Cc023881C50b16505) {
    }
```

# Diff at Tue, 26 Sep 2023 11:49:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract SafetyModule (0x65f7BA4Ec257AF7c55fd5854E5f6356bBd0fb8EC) {
      values.slashings:
+        []
    }
```
