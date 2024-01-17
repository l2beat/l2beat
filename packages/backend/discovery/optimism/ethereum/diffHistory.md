# Diff at Wed, 10 Jan 2024 07:58:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@e2e6b511762816f77296c91449de9dfcd2aa348b block: 18961956
- current block number: 18975204

## Description

Renamed contract to be consistent with template.

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18961956 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessengerProxy (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1) {
      name:
-        "L1CrossDomainMessengerProxy"
+        "L1CrossDomainMessenger"
    }
```

# Diff at Mon, 08 Jan 2024 11:19:28 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@255faead9c908eabe1ba60518df6fac59f9743e0 block: 18927148
- current block number: 18961956

## Description

One owner is removed from SynthetixMultisig (now 5/11).

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
      values.getOwners[11]:
-        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.10:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.9:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.getOwners.8:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
+        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.getOwners.7:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.getOwners.6:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.getOwners.5:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
      values.getOwners.4:
-        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.getOwners.0:
-        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
+        "0x26E10fF641839cA457695CE955Cb90657D6E3F53"
    }
```

# Diff at Wed, 03 Jan 2024 13:33:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@2a4dee9ce3e9f4d9aa3c1d39fafd6ff2ba608ba2

## Description

SynthetixMultisig has removed one owner. We are not showing it on the frontend. If it changes often, we can ignore it but for now I'll leave it as it is.

## Watched changes

```diff
    contract SynthetixMultisig (0xEb3107117FEAd7de89Cd14D463D340A2E6917769) {
      values.getOwners[12]:
-        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.11:
-        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
+        "0xEde8a407913A874Dd7e3d5B731AFcA135D30375E"
      values.getOwners.10:
-        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
+        "0x562948111d50BF039A39Eea48D127f2Ae51ddF02"
      values.getOwners.9:
-        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
+        "0x1dd532CF7603a60C3ec91360f273DA3Db38545aB"
      values.getOwners.8:
-        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
+        "0x2d8cF727d37e7277D5eeDbAb853a3e8320f767Cd"
      values.getOwners.7:
-        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
+        "0x347c3190bD015FBD0e47fb90AA4917138A8A32FE"
      values.getOwners.6:
-        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
+        "0xa2fa6Ef1Fcf740b632a04B3FC56B5d3118Bbd211"
      values.getOwners.5:
-        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
+        "0x599e835cbFC903eF09f3Dd5E08D1cF63c32AF8d8"
      values.getOwners.4:
-        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
+        "0x6985b94Db148eDd4df6BD1Ba3F4640da79B44947"
      values.getOwners.3:
-        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
+        "0xe1Efa5C91cA533E4a51884d805879249E3FCB2BC"
      values.getOwners.2:
-        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
+        "0x8909F73188C4fE68B283fCB1E724b2466e0BdfD0"
      values.getOwners.1:
-        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
+        "0x0B67bab43157e53D21965Af0d83f83BeD9553E0a"
      values.getOwners.0:
-        "0x28Ed18Bd77A061E0A886a2a8FFb91da95FF03E56"
+        "0xd9b891AB93C210eafa46c61fAeb53836F99aa35B"
    }
```

# Diff at Tue, 26 Sep 2023 08:05:22 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0xdfe97868233d1aa22e815a266982f2cf17685a27) {
      values.deletedOutputs:
+        []
    }
```
