Generated with discovered.json: 0x5ac2c20dbaba0fd287add792ec0c9a1acd25c8d0

# Diff at Mon, 21 Oct 2024 11:06:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20984946
- current block number: 20984946

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20984946 (main branch discovery), not current.

```diff
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
      values.$pastUpgrades.1.1:
-        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
+        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
      values.$pastUpgrades.0.2:
+        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
      values.$pastUpgrades.0.1:
-        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
+        "0x57fd18a56dc2962a59b2404aedf837e4168c2487750d1f670563ec70066a62f8"
    }
```

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
      values.$pastUpgrades.2.1:
-        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
+        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
      values.$pastUpgrades.1.2:
+        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
      values.$pastUpgrades.1.1:
-        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
+        "0xe79d42f297676dabd168e8f151e59c4d9d6a25f364cb098eb01273d173a8dd19"
      values.$pastUpgrades.0.2:
+        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
      values.$pastUpgrades.0.1:
-        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
+        "0xa06594153f87c4313fe3c5dd702cb063072dd438bac45b89b439ed7447b6ea9f"
    }
```

```diff
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
      values.$pastUpgrades.0.1:
-        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
+        "0x01e63713a7ddee90866f272b7afb1d49aea17ed314edc7a80d00af36fd9b640a"
    }
```

Generated with discovered.json: 0xca6d885f4f2c9a75dafa947282ee00109aa3a5ef

# Diff at Thu, 17 Oct 2024 11:20:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20984946

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FuelMultisig (0x32da601374b38154f05904B16F44A1911Aa6f314)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130)
    +++ description: None
```
