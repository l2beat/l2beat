Generated with discovered.json: 0xef91d62a61251a159c367651354c03291f9e2a51

# Diff at Thu, 20 Jun 2024 14:11:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf726e5da31db25973635b239fd2b25758ca112e block: 20067895
- current block number: 20133449

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.10:
+        {"sourceChainSelector":"4411394078118774322","offRamp":"0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599"}
      values.onRamps.4411394078118774322:
+        "0x4545F9a17DA50110632C14704a15d893BF9CBD27"
    }
```

```diff
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: None
      values.getPriceUpdaters.10:
+        "0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53"
    }
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0x4545F9a17DA50110632C14704a15d893BF9CBD27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6452d693860ab7e18fC5858C05980F63d93F37a6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xf5224EfD7Ea9edFa6b6e06964084b92426DCdE99)
    +++ description: None
```

## Source code changes

```diff
...-0xf5224EfD7Ea9edFa6b6e06964084b92426DCdE99.sol |  998 +++++++
 ...-0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53.sol | 1089 ++++++++
 ...-0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599.sol | 2894 ++++++++++++++++++++
 ...-0x4545F9a17DA50110632C14704a15d893BF9CBD27.sol | 2732 ++++++++++++++++++
 ...-0x6452d693860ab7e18fC5858C05980F63d93F37a6.sol | 1407 ++++++++++
 5 files changed, 9120 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20067895 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
    contract OffRamp7 (0x0af338F0E314c7551bcE0EF516d46d855b0Ee395) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp11 (0x0f27c8532457b66D6037141DEB0ed479Dad04B3c) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "4051577828743386545"
+        "polygon"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore2 (0x118a9389960F86390A4F14ce4C95D6ff076C6bFC) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "465200170687744372"
+        "gnosis"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp10 (0x1C207dabc46902dF9028b27D6d301c3849b2D12c) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore11 (0x20718EfbC25Dba60FD51c2c81362b83f7C411A6D) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore5 (0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore14 (0x2D1708ff2a15adbE313eA8C6035aA24d0FBA1c77) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore1 (0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "5142893604156789321"
+        "wemix"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp12 (0x333f976915195ba9044fD0cd603cEcE936f6264e) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "4949039107694359620"
+        "arbitrum"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp2 (0x35F0ca9Be776E4B38659944c257bDd0ba75F1B8B) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.staticConfigChains.1:
-        "4051577828743386545"
+        "polygon"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp1 (0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "5142893604156789321"
+        "wemix"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore12 (0x3d3467e1036Ee25F6F4aa15e3Abf77443A23144C) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp4 (0x3df8dAe2d123081c4D5E946E655F7c109B9Dd630) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.staticConfigChains.1:
-        "6433500567565415381"
+        "avalanche"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore10 (0x40c558575093eC1099CC21B020d9b8D13c74417F) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp9 (0x41627a90f2c6238f2BADAB72D5aB050B857fdAb5) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOnRamp (0x466a078d17e3706a9414ACc48029EE9Bae4C9b65) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.staticConfigChains.1:
-        "7264351850409363825"
+        "mode"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore4 (0x4af4B497c998007eF83ad130318eB2b925a79dc8) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp5 (0x569940e02D4425eac61A7601632eC00d69f75c17) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"1000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"1000000000000000000000000","rate":"277000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "6433500567565415381"
+        "avalanche"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp12 (0x61135E701a2214C170c5F596D0067798FEfbaaE4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "7264351850409363825"
+        "mode"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore13 (0x7986C9892389854cAAbAC785ff18123B0070a5Fd) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp3 (0x7Afe7088aff57173565F4b034167643AA8b9171c) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: None
      values.offRamps.9:
-        ["7264351850409363825","0xE8af3b68eDfFf65Ce48648009982380701f09B92"]
+        {"sourceChainSelector":"mode","offRamp":"0xE8af3b68eDfFf65Ce48648009982380701f09B92"}
      values.offRamps.8:
-        ["1346049177634351622","0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46"]
+        {"sourceChainSelector":"celo","offRamp":"0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46"}
      values.offRamps.7:
-        ["465200170687744372","0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4"]
+        {"sourceChainSelector":"gnosis","offRamp":"0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4"}
      values.offRamps.6:
-        ["5142893604156789321","0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5"]
+        {"sourceChainSelector":"wemix","offRamp":"0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5"}
      values.offRamps.5:
-        ["15971525489660198786","0xdf85c8381954694E74abD07488f452b4c2Cddfb3"]
+        {"sourceChainSelector":"base","offRamp":"0xdf85c8381954694E74abD07488f452b4c2Cddfb3"}
      values.offRamps.4:
-        ["11344663589394136015","0x7Afe7088aff57173565F4b034167643AA8b9171c"]
+        {"sourceChainSelector":"bnb","offRamp":"0x7Afe7088aff57173565F4b034167643AA8b9171c"}
      values.offRamps.3:
-        ["6433500567565415381","0x569940e02D4425eac61A7601632eC00d69f75c17"]
+        {"sourceChainSelector":"avalanche","offRamp":"0x569940e02D4425eac61A7601632eC00d69f75c17"}
      values.offRamps.2:
-        ["4949039107694359620","0xeFC4a18af59398FF23bfe7325F2401aD44286F4d"]
+        {"sourceChainSelector":"arbitrum","offRamp":"0xeFC4a18af59398FF23bfe7325F2401aD44286F4d"}
      values.offRamps.1:
-        ["4051577828743386545","0x0af338F0E314c7551bcE0EF516d46d855b0Ee395"]
+        {"sourceChainSelector":"polygon","offRamp":"0x0af338F0E314c7551bcE0EF516d46d855b0Ee395"}
      values.offRamps.0:
-        ["3734403246176062136","0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7"]
+        {"sourceChainSelector":"optimism","offRamp":"0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7"}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore (0x831097033C88c82a7F1897b168Aa88cC44540C8f) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "1346049177634351622"
+        "celo"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp1 (0x86B47d8411006874eEf8E4584BdFD7be8e5549d1) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.staticConfigChains.1:
-        "3734403246176062136"
+        "optimism"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore3 (0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore9 (0x8bEFCa744c6f2b567b1863dcF055C593afdC11A0) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore6 (0x8DC27D621c41a32140e22E2a4dAf1259639BAe04) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp5 (0x91D25A56Db77aD5147437d8B83Eb563D46eBFa69) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.staticConfigChains.1:
-        "11344663589394136015"
+        "bnb"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp3 (0x925228D7B82d883Dde340A55Fe8e6dA56244A22C) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.staticConfigChains.1:
-        "4949039107694359620"
+        "arbitrum"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract BETS (0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5)
    +++ description: None
```

```diff
    contract CommitStore8 (0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp4 (0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "3734403246176062136"
+        "optimism"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
    contract OffRamp11 (0xBDd822f3bC2EAB6818CfA3053107831D4E93fE72) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
    contract OffRamp13 (0xC7176620daf49A39a17FF9A6C2DE1eAA6033EE94) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "11344663589394136015"
+        "bnb"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp7 (0xCbE7e5DA76dC99Ac317adF6d99137005FDA4E2C4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "5142893604156789321"
+        "wemix"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp9 (0xCC19bC4D43d17eB6859F0d22BA300967C97780b0) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "3734403246176062136"
+        "optimism"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp10 (0xd0B5Fc9790a6085b048b8Aa1ED26ca2b3b282CF2) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "6433500567565415381"
+        "avalanche"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract CommitStore7 (0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76) {
    +++ description: None
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4051577828743386545"
+        "polygon"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOffRamp (0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "1346049177634351622"
+        "celo"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp13 (0xdF1d7FD22aC3aB5171E275796f123224039f3b24) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "11344663589394136015"
+        "bnb"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp6 (0xdf85c8381954694E74abD07488f452b4c2Cddfb3) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp6 (0xe2c2AB221AA0b957805f229d2AA57fBE2f4dADf7) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.staticConfigChains.1:
-        "15971525489660198786"
+        "base"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp14 (0xe2Eb229e88F56691e96bb98256707Bc62160FE73) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "15971525489660198786"
+        "base"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOffRamp (0xE8af3b68eDfFf65Ce48648009982380701f09B92) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "7264351850409363825"
+        "mode"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp2 (0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "465200170687744372"
+        "gnosis"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract EVM2EVMOnRamp (0xEd5bE9508ae56531cc0EDe6A3bD588Eb9E2e3cfa) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"2000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"2000000000000000000000000","rate":"555550000000000000000"}
      values.staticConfigChains.1:
-        "1346049177634351622"
+        "celo"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OffRamp8 (0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"5000000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"5000000000000000000000000","rate":"1389000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "4949039107694359620"
+        "arbitrum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
    contract OnRamp8 (0xF538dA6c673A30338269655f4e019B71ba58CFd4) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"100000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"100000000000000000000000","rate":"167000000000000000000"}
      values.staticConfigChains.1:
-        "465200170687744372"
+        "gnosis"
      values.staticConfigChains.0:
-        "5009297550715157269"
+        "ethereum"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract CCIPTokenProxy (0xF9F5bcd3a50653387ee0b9d60C1905854093e8Fb)
    +++ description: None
```

```diff
    contract OffRamp14 (0xfF51C00546AA3d9051a4B96Ae81346E14709CD24) {
    +++ description: None
      values.currentRateLimiterState:
-        {"tokens":"600000000000000000000000","lastUpdated":1718100575,"isEnabled":true,"capacity":"600000000000000000000000","rate":"167000000000000000000"}
      values.getStaticConfig.chainSelector:
-        "5009297550715157269"
+        "ethereum"
      values.getStaticConfig.sourceChainSelector:
-        "15971525489660198786"
+        "base"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"465200170687744372":"gnosis","5009297550715157269":"ethereum","3734403246176062136":"optimism","4949039107694359620":"arbitrum","4051577828743386545":"polygon","6433500567565415381":"avalanche","5142893604156789321":"wemix","3719320017875267166":"kroma","1346049177634351622":"celo","7264351850409363825":"mode","11344663589394136015":"bnb","15971525489660198786":"base"}}]
    }
```

```diff
-   Status: DELETED
    contract Proxy (0xffffffaEff0B96Ea8e4f94b2253f31abdD875847)
    +++ description: None
```

Generated with discovered.json: 0x4125745c53ae7e2baa16f1d46316faf92f7ea21c

# Diff at Tue, 11 Jun 2024 10:09:59 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20067895

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PriceRegistry (0x020082A7a9c2510e1921116001152DEE4da81985)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x047204D42d93a6471F7c9Ec94292B4B00E8e0786)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x057152DB365B47851B0A0bd431644b8eE21fE1b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x06f9817a91595E1B595F789Fb91529e8651da9B8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp7 (0x0af338F0E314c7551bcE0EF516d46d855b0Ee395)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x0C291Ae31730901515e5C46406A6ba2d88c1f4aA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x0DAFed8dAF42040dB2c6227ca2AEB14D9C8B2602)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp11 (0x0f27c8532457b66D6037141DEB0ed479Dad04B3c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x1175E4CFd6a73A4c1F1f2c1400a08D88554FA62e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0x117ec8aD107976e1dBCc21717ff78407Bc36aADc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore2 (0x118a9389960F86390A4F14ce4C95D6ff076C6bFC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x123ed44f3B863a684437Ebf18F8a744c250Ee5cA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x1580C7d4754f5671626e42f0372D56104B092CFA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp10 (0x1C207dabc46902dF9028b27D6d301c3849b2D12c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x1e28DD4b559a7fF546b1e84691129508b2C9C3D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore11 (0x20718EfbC25Dba60FD51c2c81362b83f7C411A6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x21377fe476Fb8587CbAFd47155093597Fa4df45E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x2764910B500689BbC9DB16c7AD61c6DD32FDE73B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore5 (0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore14 (0x2D1708ff2a15adbE313eA8C6035aA24d0FBA1c77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x2dd317E7e36544C5222818F228d607c209517470)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore1 (0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp12 (0x333f976915195ba9044fD0cd603cEcE936f6264e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp2 (0x35F0ca9Be776E4B38659944c257bDd0ba75F1B8B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp1 (0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore12 (0x3d3467e1036Ee25F6F4aa15e3Abf77443A23144C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp4 (0x3df8dAe2d123081c4D5E946E655F7c109B9Dd630)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore10 (0x40c558575093eC1099CC21B020d9b8D13c74417F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ARMProxy (0x411dE17f12D1A34ecC7F45f49844626267c75e81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp9 (0x41627a90f2c6238f2BADAB72D5aB050B857fdAb5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x44622f4604353E4815A4212d5a3dD137A1C7FF14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RBACTimelock (0x44835bBBA9D40DEDa9b64858095EcFB2693c9449)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0x466a078d17e3706a9414ACc48029EE9Bae4C9b65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore4 (0x4af4B497c998007eF83ad130318eB2b925a79dc8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x4C3aEe10334461F1f33c0A8843424de3F8fb7709)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x50f6631B377be52E132DF35a2F05eA54fda882ac)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x55562A08104837FF55E3A66c49A1419b6311c1E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp5 (0x569940e02D4425eac61A7601632eC00d69f75c17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x57D3bb46aF4A9b210FAE046796013090D428475F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp12 (0x61135E701a2214C170c5F596D0067798FEfbaaE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x619ED9fE2E5CfD9FAE364E703b60eA776Bb5924E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherSenderReceiver (0x66598216D8E4d9AFE0F06d525B335b762229842f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x69c24c970B65e22Ac26864aF10b2295B7d78f93A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6ce8b799002BbECc7df94c18BF150B3b0E4A28F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6dDF2F3f93688dfc9d37DF7078982cE8E6494DB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x6Ff6BF3BF8af2e419DDC7BF038aFa5EB92b6cD7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x73aEB5ECA03Ad587B8Fdcc2B61f9fb4D2e3D90c1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x78196436aF11b948c7036424B1ceA711fAdAd288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore13 (0x7986C9892389854cAAbAC785ff18123B0070a5Fd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp3 (0x7Afe7088aff57173565F4b034167643AA8b9171c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Router (0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x8272dbBA30f14900b22b4bfC8DB4E88B02bA413a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0x8291a8E8dCF429e2FA7d032bF3E583ee959F3B06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallProxy (0x82b8A19497fA25575f250a3DcFfCD2562B575A2e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x8300e89e82A840176eb250EcDA0A7dBDb4a6B12D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore (0x831097033C88c82a7F1897b168Aa88cC44540C8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp1 (0x86B47d8411006874eEf8E4584BdFD7be8e5549d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore3 (0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ARM (0x8B63b3DE93431C0f756A493644d128134291fA1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x8BcD7e48Dd2104ed83eb1CE0c6E7610604AE9062)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore9 (0x8bEFCa744c6f2b567b1863dcF055C593afdC11A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PriceRegistry (0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore6 (0x8DC27D621c41a32140e22E2a4dAf1259639BAe04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp5 (0x91D25A56Db77aD5147437d8B83Eb563D46eBFa69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp3 (0x925228D7B82d883Dde340A55Fe8e6dA56244A22C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BETS (0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0x9797E886EDe987AEf6A62885dFD6CcA885D828E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore8 (0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xa008534BF96b61d9D33aD64aAD463bc6D300cd91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xa17698199466E71bAFC31F226db341B7840701E7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xa370CEcd451ecf15c2A01ec47762E967dF7574DA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDCTokenPool (0xA81f4AB595dE5C14759245DE5ce9899D380FeFda)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xA82A87a9b6550e89dd8a7C8a1E3e421974eaf858)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0xa8D5E1daA6D8B94f11D77B7E09DE846292ef69FF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0xAD97C0270a243270136E40278155C12ce7C7F87B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp4 (0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xb854536206EB6C1013b1642b576196E5EF19D7BA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp11 (0xBDd822f3bC2EAB6818CfA3053107831D4E93fE72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xBF7cb652A2d5ed3BFc3832Ef8Af33Ffb0cDc0982)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc07556a0Bd177F8de4D077f449C2653A072F3798)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xC2291992A08eBFDfedfE248F2CCD34Da63570DF4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xc43c01026128Aa758A65D12dB6a72CE4DD778dF2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xc62c311FE64abf19CF33195e15c188Ca6d1AaD3e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp13 (0xC7176620daf49A39a17FF9A6C2DE1eAA6033EE94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp7 (0xCbE7e5DA76dC99Ac317adF6d99137005FDA4E2C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp9 (0xCC19bC4D43d17eB6859F0d22BA300967C97780b0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xcd196D3905AfA0eCB4e0e62C2D7d6c52f9C73526)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp10 (0xd0B5Fc9790a6085b048b8Aa1ED26ca2b3b282CF2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xd1b3015ceFCAC84dB3EFCBB18FBdd50BA5aF49DE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommitStore7 (0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xdCa0A2341ed5438E06B9982243808A76B9ADD6d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp13 (0xdF1d7FD22aC3aB5171E275796f123224039f3b24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp6 (0xdf85c8381954694E74abD07488f452b4c2Cddfb3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp6 (0xe2c2AB221AA0b957805f229d2AA57fBE2f4dADf7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp14 (0xe2Eb229e88F56691e96bb98256707Bc62160FE73)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockReleaseTokenPool (0xE2F0dad85D504aa046b9F704a426fD6C5493e366)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (0xE53289F32c8E690b7173aA33affE9B6B0CB0012F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Router2 (0xE561d5E02207fb5eB32cca20a699E0d8919a1476)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOffRamp (0xE8af3b68eDfFf65Ce48648009982380701f09B92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp2 (0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xeaE89E53B8317CaB04165F5323285252D5669B73)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVM2EVMOnRamp (0xEd5bE9508ae56531cc0EDe6A3bD588Eb9E2e3cfa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp8 (0xeFC4a18af59398FF23bfe7325F2401aD44286F4d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (0xf0D19c04f04382048fC9ad157C529CeB2c7be823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnRamp8 (0xF538dA6c673A30338269655f4e019B71ba58CFd4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CCIPTokenProxy (0xF9F5bcd3a50653387ee0b9d60C1905854093e8Fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp14 (0xfF51C00546AA3d9051a4B96Ae81346E14709CD24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Proxy (0xffffffaEff0B96Ea8e4f94b2253f31abdD875847)
    +++ description: None
```
