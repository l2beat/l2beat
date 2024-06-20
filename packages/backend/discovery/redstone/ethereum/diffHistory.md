Generated with discovered.json: 0xdeebc747cad7aaded15ebb8d725db8799fbc500a

# Diff at Thu, 09 May 2024 07:38:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19810497
- current block number: 19831040

## Description

The ProxyAdminOwner Multisig has two new signers and is now 2/3. Challenger, Guardian, SystemConfig, DataAvailabilityChallenge stay EOA-owned.

## Watched changes

```diff
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89) {
    +++ description: None
      upgradeability.threshold:
-        "1 of 1 (100%)"
+        "2 of 3 (67%)"
      values.getOwners.2:
+        "0x7211399b320a0417286897fCeD1ee4ba1C1771d4"
      values.getOwners.1:
+        "0x61fB1FDA30c900404CDfa22D3eAdCA86FdB95450"
      values.getOwners.0:
-        "0xb356B146F1629c49C44344464F69BCDAfb4bb664"
+        "0x5DeB7dD12ccF0BFb3b2D26D0A4f302Fb6ACBdcA8"
      values.getThreshold:
-        1
+        2
    }
```

Generated with discovered.json: 0x8c5f2b36bcdbbb428884c05c17a594382bc8a420

# Diff at Mon, 06 May 2024 10:38:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19810497

## Description

OP stack chain in Plasma mode (DA challenges, not really Plasma imo). Reading the project page is enough to understand the system, in particular the Technology section. In the discovery there are additional contracts related to the proof system (the one live on Sepolia for OP Mainnet) but they are currently not utilized and disconnected. The way to notice that is that this system is still using the L2OutputOracle for state roots while in the version with the fraud proof system it is deprecated.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x4b5b41c240173191425F5928bc6bdd0d439331BB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x4FFB98dBC3086bA85d5E626a6EbC3D0d08533fF4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x592C1299e0F8331D81A28C0FC7352Da24eDB444a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x5A50b05676705cd0189970d806a7c9d2a0201Da7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5f962474834Cf1981Df6232e4b6431d3d10cb71D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x66D6be83984e3F026B4a9e2D8Fb082ecDBd43648)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0x70FdbCb066eD3621647Ddf61A1f40aaC6058Bc89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8f2428F7189c0d92D1c4a5358903A8c80Ec6a69D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x8f68E849eaf8EB943536F9d1D49Ea9C9b5868b98)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x97A2dA87d3439b172e6DD027220e01c9Cb565B80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa130523fD22e2a9D78F8aB232b01ff552845B4A9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xa426A052f657AEEefc298b3B5c35a470e4739d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC5E3333f1Dd5e5bBca0Cf49B8799E0Eb567000ba)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCC53b447aFe07926423aB96D5496b1af30485ED2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xE7d0fE72637B3C949cd81c63A4Ff1fb23feeF3b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xFe27f187A9E46104a932189dDF229871E06B22F8)
    +++ description: None
```
