Generated with discovered.json: 0x28cc0964133574f662a8d9d7e0b5fa2ea41e7d5f

# Diff at Thu, 24 Jul 2025 16:55:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a3f740c0fd51a5745c45d8f349ab01f4f33f7770 block: 22195184
- current block number: 22195184

## Description

config: set dispute game impl changes to high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta:
+        {"gameImpls":{"severity":"HIGH"},"game1337":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x24f0e8617ad9f80a3f2bb092abd6dfd290ade922

# Diff at Tue, 22 Jul 2025 14:10:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d5d65d1883c757ae790bbd0a6f785c98310d2516 block: 22195184
- current block number: 22195184

## Description

Config: Kailua added to OptimismPortal2 and DisputeGameFectory.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.game1337:
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x97112f4a542bb99f6be15ea4cb7c2a17e3220bdc

# Diff at Mon, 14 Jul 2025 12:45:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22195184
- current block number: 22195184

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x01440f52270A1CbA3449be1F7512CD9A1AA788FD) {
    +++ description: None
      address:
-        "0x01440f52270A1CbA3449be1F7512CD9A1AA788FD"
+        "eth:0x01440f52270A1CbA3449be1F7512CD9A1AA788FD"
    }
```

```diff
    EOA  (0x0F7A7ca8f7673D9D219766a962856371e1Ed27FF) {
    +++ description: None
      address:
-        "0x0F7A7ca8f7673D9D219766a962856371e1Ed27FF"
+        "eth:0x0F7A7ca8f7673D9D219766a962856371e1Ed27FF"
    }
```

```diff
    contract PreimageOracle (0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      address:
-        "0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4"
+        "eth:0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4"
      implementationNames.0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4:
-        "PreimageOracle"
      implementationNames.eth:0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4:
+        "PreimageOracle"
    }
```

```diff
    contract OptimismPortal (0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x6C766cBbCeb166a6Bfc72A365100D153dF9A3B98"
+        "eth:0x6C766cBbCeb166a6Bfc72A365100D153dF9A3B98"
      values.$pastUpgrades.0.2.0:
-        "0x6C766cBbCeb166a6Bfc72A365100D153dF9A3B98"
+        "eth:0x6C766cBbCeb166a6Bfc72A365100D153dF9A3B98"
      values.guardian:
-        "0x87aab081Ac9F8ce80fb048f23280DF019036BA1d"
+        "eth:0x87aab081Ac9F8ce80fb048f23280DF019036BA1d"
      values.l2Oracle:
-        "0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      values.systemConfig:
-        "0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
      implementationNames.0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e:
-        "Proxy"
      implementationNames.0x6C766cBbCeb166a6Bfc72A365100D153dF9A3B98:
-        "OptimismPortal"
      implementationNames.eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e:
+        "Proxy"
      implementationNames.eth:0x6C766cBbCeb166a6Bfc72A365100D153dF9A3B98:
+        "OptimismPortal"
    }
```

```diff
    contract DelayedWETH (0x465833609d9ff2Cb9A070b0d71b700F318C97293) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      address:
-        "0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x9Dc689620a87803378b3304776dd5AE9070730A8"
+        "eth:0x9Dc689620a87803378b3304776dd5AE9070730A8"
      values.$pastUpgrades.0.2.0:
-        "0x9Dc689620a87803378b3304776dd5AE9070730A8"
+        "eth:0x9Dc689620a87803378b3304776dd5AE9070730A8"
      values.config:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      values.owner:
-        "0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      implementationNames.0x465833609d9ff2Cb9A070b0d71b700F318C97293:
-        "Proxy"
      implementationNames.0x9Dc689620a87803378b3304776dd5AE9070730A8:
-        "DelayedWETH"
      implementationNames.eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293:
+        "Proxy"
      implementationNames.eth:0x9Dc689620a87803378b3304776dd5AE9070730A8:
+        "DelayedWETH"
    }
```

```diff
    contract L1CrossDomainMessenger (0x5b0e75a52862881b4077C865B244CC17cD2b531b) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x8bA829f040EB57668BDfb010472AEb0a16B2399C"
+        "eth:0x8bA829f040EB57668BDfb010472AEb0a16B2399C"
      values.$pastUpgrades.0.2.0:
-        "0x8bA829f040EB57668BDfb010472AEb0a16B2399C"
+        "eth:0x8bA829f040EB57668BDfb010472AEb0a16B2399C"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      values.PORTAL:
-        "0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      values.ResolvedDelegateProxy_addressManager:
-        "0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
+        "eth:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
      values.superchainConfig:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      values.systemConfig:
-        "0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
      implementationNames.0x5b0e75a52862881b4077C865B244CC17cD2b531b:
-        "ResolvedDelegateProxy"
      implementationNames.0x8bA829f040EB57668BDfb010472AEb0a16B2399C:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0x8bA829f040EB57668BDfb010472AEb0a16B2399C:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract AddressManager (0x66e58c9D0b42110E956F54aA850C0d629f4B56C5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
+        "eth:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
      values.owner:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      implementationNames.0x66e58c9D0b42110E956F54aA850C0d629f4B56C5:
-        "AddressManager"
      implementationNames.eth:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5:
+        "AddressManager"
    }
```

```diff
    contract L1StandardBridge (0x683ca289a8418Cb090E42929A73a263d7b81DfC2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "eth:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0xBab69f0A56Aea1117C0298341ddE52F3DbAfe4D1"
+        "eth:0xBab69f0A56Aea1117C0298341ddE52F3DbAfe4D1"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      values.MESSENGER:
-        "0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      values.systemConfig:
-        "0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
      implementationNames.0x683ca289a8418Cb090E42929A73a263d7b81DfC2:
-        "L1ChugSplashProxy"
      implementationNames.0xBab69f0A56Aea1117C0298341ddE52F3DbAfe4D1:
-        "L1StandardBridge"
      implementationNames.eth:0x683ca289a8418Cb090E42929A73a263d7b81DfC2:
+        "L1ChugSplashProxy"
      implementationNames.eth:0xBab69f0A56Aea1117C0298341ddE52F3DbAfe4D1:
+        "L1StandardBridge"
    }
```

```diff
    contract SystemConfig (0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0xae9fC3cFD19b751c893105c43A8ed8af6F9e1719"
+        "eth:0xae9fC3cFD19b751c893105c43A8ed8af6F9e1719"
      values.$pastUpgrades.0.2.0:
-        "0xae9fC3cFD19b751c893105c43A8ed8af6F9e1719"
+        "eth:0xae9fC3cFD19b751c893105c43A8ed8af6F9e1719"
      values.batcherHash:
-        "0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c"
+        "eth:0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c"
      values.batchInbox:
-        "0xFF00000000000000000000000000000000193939"
+        "eth:0xFF00000000000000000000000000000000193939"
      values.disputeGameFactory:
-        "0xF014d8028A7028352baD6226A4894Ae596e2846c"
+        "eth:0xF014d8028A7028352baD6226A4894Ae596e2846c"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      values.l1ERC721Bridge:
-        "0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
+        "eth:0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
      values.l1StandardBridge:
-        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "eth:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      values.optimismMintableERC20Factory:
-        "0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
+        "eth:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
      values.optimismPortal:
-        "0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      values.owner:
-        "0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395"
+        "eth:0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395"
      values.sequencerInbox:
-        "0xFF00000000000000000000000000000000193939"
+        "eth:0xFF00000000000000000000000000000000193939"
      values.unsafeBlockSigner:
-        "0x01440f52270A1CbA3449be1F7512CD9A1AA788FD"
+        "eth:0x01440f52270A1CbA3449be1F7512CD9A1AA788FD"
      implementationNames.0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA:
-        "Proxy"
      implementationNames.0xae9fC3cFD19b751c893105c43A8ed8af6F9e1719:
-        "SystemConfig"
      implementationNames.eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA:
+        "Proxy"
      implementationNames.eth:0xae9fC3cFD19b751c893105c43A8ed8af6F9e1719:
+        "SystemConfig"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
+        "eth:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x1561Fb12A6eFc3C63b881dE403A76B5F7Cd6a6CF"
+        "eth:0x1561Fb12A6eFc3C63b881dE403A76B5F7Cd6a6CF"
      values.$pastUpgrades.0.2.0:
-        "0x1561Fb12A6eFc3C63b881dE403A76B5F7Cd6a6CF"
+        "eth:0x1561Fb12A6eFc3C63b881dE403A76B5F7Cd6a6CF"
      values.bridge:
-        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "eth:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      values.BRIDGE:
-        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "eth:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      implementationNames.0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8:
-        "Proxy"
      implementationNames.0x1561Fb12A6eFc3C63b881dE403A76B5F7Cd6a6CF:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8:
+        "Proxy"
      implementationNames.eth:0x1561Fb12A6eFc3C63b881dE403A76B5F7Cd6a6CF:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0x79DdF0745D14783cDC2a05624c585Ddce07F4A02) {
    +++ description: None
      address:
-        "0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
+        "eth:0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
    }
```

```diff
    contract MIPS (0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6) {
    +++ description: None
      address:
-        "0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6"
+        "eth:0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6"
      values.oracle:
-        "0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4"
+        "eth:0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4"
      implementationNames.0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6:
-        "MIPS"
      implementationNames.eth:0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6:
+        "MIPS"
    }
```

```diff
    EOA  (0x87aab081Ac9F8ce80fb048f23280DF019036BA1d) {
    +++ description: None
      address:
-        "0x87aab081Ac9F8ce80fb048f23280DF019036BA1d"
+        "eth:0x87aab081Ac9F8ce80fb048f23280DF019036BA1d"
    }
```

```diff
    EOA  (0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F) {
    +++ description: None
      address:
-        "0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F"
+        "eth:0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F"
    }
```

```diff
    contract ProxyAdmin (0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA) {
    +++ description: None
      address:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.addressManager:
-        "0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
+        "eth:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
      values.owner:
-        "0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      implementationNames.0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA:
-        "ProxyAdmin"
      implementationNames.eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA:
+        "ProxyAdmin"
    }
```

```diff
    contract SuperchainConfig (0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x13a9A075D8Aa2D93c3d32F1C61aB671108fedE6E"
+        "eth:0x13a9A075D8Aa2D93c3d32F1C61aB671108fedE6E"
      values.$pastUpgrades.0.2.0:
-        "0x13a9A075D8Aa2D93c3d32F1C61aB671108fedE6E"
+        "eth:0x13a9A075D8Aa2D93c3d32F1C61aB671108fedE6E"
      values.guardian:
-        "0x87aab081Ac9F8ce80fb048f23280DF019036BA1d"
+        "eth:0x87aab081Ac9F8ce80fb048f23280DF019036BA1d"
      implementationNames.0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8:
-        "Proxy"
      implementationNames.0x13a9A075D8Aa2D93c3d32F1C61aB671108fedE6E:
-        "SuperchainConfig"
      implementationNames.eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8:
+        "Proxy"
      implementationNames.eth:0x13a9A075D8Aa2D93c3d32F1C61aB671108fedE6E:
+        "SuperchainConfig"
    }
```

```diff
    contract L2OutputOracle (0xb7850CFa577332EB839840e1411962AC3Dd2f183) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x503733C3d5AA487B88fA1FB475694da51744e4Cd"
+        "eth:0x503733C3d5AA487B88fA1FB475694da51744e4Cd"
      values.$pastUpgrades.0.2.0:
-        "0x503733C3d5AA487B88fA1FB475694da51744e4Cd"
+        "eth:0x503733C3d5AA487B88fA1FB475694da51744e4Cd"
      values.$pastUpgrades.1.2.0:
-        "0xCEBbcE0D64A1703dc74d3f3790A09c1E20a4cB09"
+        "eth:0xCEBbcE0D64A1703dc74d3f3790A09c1E20a4cB09"
      values.$pastUpgrades.2.2.0:
-        "0x503733C3d5AA487B88fA1FB475694da51744e4Cd"
+        "eth:0x503733C3d5AA487B88fA1FB475694da51744e4Cd"
+++ severity: HIGH
      values.challenger:
-        "0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
+        "eth:0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
      values.CHALLENGER:
-        "0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
+        "eth:0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
+++ severity: HIGH
      values.proposer:
-        "0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F"
+        "eth:0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F"
      values.PROPOSER:
-        "0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F"
+        "eth:0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F"
      implementationNames.0xb7850CFa577332EB839840e1411962AC3Dd2f183:
-        "Proxy"
      implementationNames.0x503733C3d5AA487B88fA1FB475694da51744e4Cd:
-        "L2OutputOracle"
      implementationNames.eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183:
+        "Proxy"
      implementationNames.eth:0x503733C3d5AA487B88fA1FB475694da51744e4Cd:
+        "L2OutputOracle"
    }
```

```diff
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      address:
-        "0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0"
+        "eth:0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0"
      values.anchorStateRegistry:
-        "0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
+        "eth:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
      values.challenger:
-        "0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
+        "eth:0x79DdF0745D14783cDC2a05624c585Ddce07F4A02"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x0F7A7ca8f7673D9D219766a962856371e1Ed27FF"
+        "eth:0x0F7A7ca8f7673D9D219766a962856371e1Ed27FF"
      values.vm:
-        "0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6"
+        "eth:0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6"
      values.weth:
-        "0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      implementationNames.0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0:
-        "PermissionedDisputeGame"
      implementationNames.eth:0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0:
+        "PermissionedDisputeGame"
    }
```

```diff
    EOA  (0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395) {
    +++ description: None
      address:
-        "0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395"
+        "eth:0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395"
    }
```

```diff
    contract AnchorStateRegistry (0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      address:
-        "0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
+        "eth:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x57923d2b2A4B32b0F1001022Fd81b9F0655F3AD5"
+        "eth:0x57923d2b2A4B32b0F1001022Fd81b9F0655F3AD5"
      values.$pastUpgrades.0.2.0:
-        "0x57923d2b2A4B32b0F1001022Fd81b9F0655F3AD5"
+        "eth:0x57923d2b2A4B32b0F1001022Fd81b9F0655F3AD5"
      values.disputeGameFactory:
-        "0xF014d8028A7028352baD6226A4894Ae596e2846c"
+        "eth:0xF014d8028A7028352baD6226A4894Ae596e2846c"
      implementationNames.0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F:
-        "Proxy"
      implementationNames.0x57923d2b2A4B32b0F1001022Fd81b9F0655F3AD5:
-        "AnchorStateRegistry"
      implementationNames.eth:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F:
+        "Proxy"
      implementationNames.eth:0x57923d2b2A4B32b0F1001022Fd81b9F0655F3AD5:
+        "AnchorStateRegistry"
    }
```

```diff
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      address:
-        "0xF014d8028A7028352baD6226A4894Ae596e2846c"
+        "eth:0xF014d8028A7028352baD6226A4894Ae596e2846c"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0x5cd233B95e4799444567873902bf9f9f20D3F640"
+        "eth:0x5cd233B95e4799444567873902bf9f9f20D3F640"
      values.$pastUpgrades.0.2.0:
-        "0x5cd233B95e4799444567873902bf9f9f20D3F640"
+        "eth:0x5cd233B95e4799444567873902bf9f9f20D3F640"
      values.gameImpls.0:
-        "0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2"
+        "eth:0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2"
      values.gameImpls.1:
-        "0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0"
+        "eth:0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0"
      values.gameImpls.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.3:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gameImpls.4:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      implementationNames.0xF014d8028A7028352baD6226A4894Ae596e2846c:
-        "Proxy"
      implementationNames.0x5cd233B95e4799444567873902bf9f9f20D3F640:
-        "DisputeGameFactory"
      implementationNames.eth:0xF014d8028A7028352baD6226A4894Ae596e2846c:
+        "Proxy"
      implementationNames.eth:0x5cd233B95e4799444567873902bf9f9f20D3F640:
+        "DisputeGameFactory"
    }
```

```diff
    contract L1ERC721Bridge (0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
+        "eth:0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
      values.$admin:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      values.$implementation:
-        "0xff57b96E6F426f9dEC14f083dE0D3aD9B95887b6"
+        "eth:0xff57b96E6F426f9dEC14f083dE0D3aD9B95887b6"
      values.$pastUpgrades.0.2.0:
-        "0xff57b96E6F426f9dEC14f083dE0D3aD9B95887b6"
+        "eth:0xff57b96E6F426f9dEC14f083dE0D3aD9B95887b6"
      values.messenger:
-        "0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      values.MESSENGER:
-        "0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      implementationNames.0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259:
-        "Proxy"
      implementationNames.0xff57b96E6F426f9dEC14f083dE0D3aD9B95887b6:
-        "L1ERC721Bridge"
      implementationNames.eth:0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259:
+        "Proxy"
      implementationNames.eth:0xff57b96E6F426f9dEC14f083dE0D3aD9B95887b6:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c) {
    +++ description: None
      address:
-        "0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c"
+        "eth:0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c"
    }
```

```diff
    contract GnosisSafe (0xf758e2272FCe1330d8a1De38D5128A47B4041752) {
    +++ description: None
      address:
-        "0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395"
+        "eth:0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395"
      implementationNames.0xf758e2272FCe1330d8a1De38D5128A47B4041752:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      address:
-        "0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2"
+        "eth:0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2"
      values.anchorStateRegistry:
-        "0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
+        "eth:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
      values.gameCreator:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2BlockNumberChallenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.vm:
-        "0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6"
+        "eth:0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6"
      values.weth:
-        "0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      implementationNames.0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2:
-        "FaultDisputeGame"
      implementationNames.eth:0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2:
+        "FaultDisputeGame"
    }
```

```diff
    EOA  (0xFF00000000000000000000000000000000193939) {
    +++ description: None
      address:
-        "0xFF00000000000000000000000000000000193939"
+        "eth:0xFF00000000000000000000000000000000193939"
    }
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x465833609d9ff2Cb9A070b0d71b700F318C97293)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5b0e75a52862881b4077C865B244CC17cD2b531b)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0x66e58c9D0b42110E956F54aA850C0d629f4B56C5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x683ca289a8418Cb090E42929A73a263d7b81DfC2)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract MIPS (0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb7850CFa577332EB839840e1411962AC3Dd2f183)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xf758e2272FCe1330d8a1De38D5128A47B4041752)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

Generated with discovered.json: 0x02293832a8806efdb193918ae27a1aff365a93d4

# Diff at Mon, 14 Jul 2025 08:02:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22195184
- current block number: 22195184

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x5bc8e1409e73010faef351a91f93fc29026201e4

# Diff at Fri, 04 Jul 2025 12:19:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22195184
- current block number: 22195184

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    EOA  (0x79DdF0745D14783cDC2a05624c585Ddce07F4A02) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
      receivedPermissions.1.from:
-        "ethereum:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
    }
```

```diff
    EOA  (0x87aab081Ac9F8ce80fb048f23280DF019036BA1d) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      receivedPermissions.1.from:
-        "ethereum:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
    }
```

```diff
    EOA  (0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
      receivedPermissions.1.from:
-        "ethereum:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
    }
```

```diff
    contract ProxyAdmin (0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
+        "eth:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "eth:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
+        "eth:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
+        "eth:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
      directlyReceivedPermissions.10.from:
-        "ethereum:0xF014d8028A7028352baD6226A4894Ae596e2846c"
+        "eth:0xF014d8028A7028352baD6226A4894Ae596e2846c"
      directlyReceivedPermissions.11.from:
-        "ethereum:0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
+        "eth:0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
    }
```

```diff
    EOA  (0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.0.from:
-        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      receivedPermissions.1.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.1.from:
-        "ethereum:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
+        "eth:0x66e58c9D0b42110E956F54aA850C0d629f4B56C5"
      receivedPermissions.2.from:
-        "ethereum:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
      receivedPermissions.3.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.3.from:
-        "ethereum:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "eth:0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      receivedPermissions.4.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.4.from:
-        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      receivedPermissions.5.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.5.from:
-        "ethereum:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
+        "eth:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
      receivedPermissions.6.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.6.from:
-        "ethereum:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "eth:0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      receivedPermissions.7.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.7.from:
-        "ethereum:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
      receivedPermissions.8.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.8.from:
-        "ethereum:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
+        "eth:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
      receivedPermissions.9.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.9.from:
-        "ethereum:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "eth:0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      receivedPermissions.10.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.10.from:
-        "ethereum:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "eth:0xb7850CFa577332EB839840e1411962AC3Dd2f183"
      receivedPermissions.11.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.11.from:
-        "ethereum:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
+        "eth:0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
      receivedPermissions.12.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.12.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.12.from:
-        "ethereum:0xF014d8028A7028352baD6226A4894Ae596e2846c"
+        "eth:0xF014d8028A7028352baD6226A4894Ae596e2846c"
      receivedPermissions.13.via.1.address:
-        "ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "eth:0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.13.via.0.address:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.13.from:
-        "ethereum:0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
+        "eth:0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
    }
```

```diff
    EOA  (0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
+        "eth:0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA"
    }
```

```diff
    contract GnosisSafe (0xf758e2272FCe1330d8a1De38D5128A47B4041752) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "eth:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "eth:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
    }
```

Generated with discovered.json: 0x1c712dec634b648e8f6a7d024f1d9709c2d4b971

# Diff at Mon, 16 Jun 2025 08:42:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22195184
- current block number: 22195184

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x5b0e75a52862881b4077C865B244CC17cD2b531b) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
    }
```

```diff
    contract ProxyAdmin (0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA) {
    +++ description: None
      directlyReceivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8","role":"admin"}
      directlyReceivedPermissions.10.from:
-        "ethereum:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
+        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      directlyReceivedPermissions.9.from:
-        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "ethereum:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
    }
```

```diff
    EOA  (0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"ethereum:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8","role":"admin","via":[{"address":"ethereum:0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"},{"address":"ethereum:0xf758e2272FCe1330d8a1De38D5128A47B4041752"}]}
      receivedPermissions.12.from:
-        "ethereum:0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
+        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      receivedPermissions.11.from:
-        "ethereum:0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "ethereum:0x5b0e75a52862881b4077C865B244CC17cD2b531b"
    }
```

Generated with discovered.json: 0xa08e1721199421c4df7ae0f7a814b6b09cd4990f

# Diff at Fri, 30 May 2025 07:13:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22195184
- current block number: 22195184

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract SystemConfig (0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x8af8d1727007fdc544135c3b87e11b2c63bbbf40

# Diff at Fri, 23 May 2025 09:41:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22195184
- current block number: 22195184

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    EOA  (0x79DdF0745D14783cDC2a05624c585Ddce07F4A02) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"0xb7850CFa577332EB839840e1411962AC3Dd2f183","role":".CHALLENGER"}
      receivedPermissions.0.role:
+        ".challenger"
    }
```

```diff
    EOA  (0x87aab081Ac9F8ce80fb048f23280DF019036BA1d) {
    +++ description: None
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    EOA  (0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0xb7850CFa577332EB839840e1411962AC3Dd2f183","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract ProxyAdmin (0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA) {
    +++ description: None
      directlyReceivedPermissions.10.role:
+        "admin"
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      directlyReceivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.from:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395) {
    +++ description: None
      receivedPermissions.12.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.12.from:
-        "0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "0xb7850CFa577332EB839840e1411962AC3Dd2f183"
      receivedPermissions.12.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.12.via.1:
+        {"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"}
      receivedPermissions.12.via.0.address:
-        "0xf758e2272FCe1330d8a1De38D5128A47B4041752"
+        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.from:
-        "0xb7850CFa577332EB839840e1411962AC3Dd2f183"
+        "0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.from:
-        "0x465833609d9ff2Cb9A070b0d71b700F318C97293"
+        "0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.from:
-        "0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F"
+        "0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8"
+        "0xF014d8028A7028352baD6226A4894Ae596e2846c"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0xF014d8028A7028352baD6226A4894Ae596e2846c"
+        "0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e"
+        "0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259"
+        "0x465833609d9ff2Cb9A070b0d71b700F318C97293"
      receivedPermissions.5.via.1:
-        {"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"}
      receivedPermissions.5.via.0.address:
-        "0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"
+        "0xf758e2272FCe1330d8a1De38D5128A47B4041752"
      receivedPermissions.5.description:
+        "can pull funds from the contract in case of emergency."
      receivedPermissions.5.role:
+        ".owner"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
+        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
      receivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8"
+        "0x683ca289a8418Cb090E42929A73a263d7b81DfC2"
      receivedPermissions.2.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract GnosisSafe (0xf758e2272FCe1330d8a1De38D5128A47B4041752) {
    +++ description: None
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x0eccd24d86a21ff5ad4fedb09925ed974eef2d1a

# Diff at Thu, 08 May 2025 10:03:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22195184
- current block number: 22195184

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

```diff
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6:
+        "v1.6.0 (cannon64)"
    }
```

Generated with discovered.json: 0x6e8bad4ae53c0f84e645dc27db973a34d04f61bb

# Diff at Tue, 06 May 2025 10:56:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 22195184
- current block number: 22195184

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    EOA  (0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x30bab02e4514dd91c43e1924be73206ce8cd1e7f

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22195184
- current block number: 22195184

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x87aab081Ac9F8ce80fb048f23280DF019036BA1d","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract DelayedWETH (0x465833609d9ff2Cb9A070b0d71b700F318C97293) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"can pull funds from the contract in case of emergency.","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"}]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract AddressManager (0x66e58c9D0b42110E956F54aA850C0d629f4B56C5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"set and change address mappings.","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract L1StandardBridge (0x683ca289a8418Cb090E42929A73a263d7b81DfC2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract SystemConfig (0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xF263a0AA8aFEaA7d516B596d49d7BA6C0FeB102c","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract SuperchainConfig (0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x87aab081Ac9F8ce80fb048f23280DF019036BA1d","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract L2OutputOracle (0xb7850CFa577332EB839840e1411962AC3Dd2f183) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x79DdF0745D14783cDC2a05624c585Ddce07F4A02","via":[]},{"permission":"propose","to":"0x8B72aB0D35F87e0f56D9805031D7CDfA13D1C71F","via":[]},{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract AnchorStateRegistry (0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xdaf66a37Fddc1095Aa916C6fF9347958DCa35395","via":[{"address":"0xf758e2272FCe1330d8a1De38D5128A47B4041752"},{"address":"0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA"}]}]
    }
```

Generated with discovered.json: 0x2432c4861b0b30d531ba6ddfeddecc60a2c4c3e5

# Diff at Fri, 11 Apr 2025 13:16:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b607477490db79d49274f7585039ac7263456118 block: 22195184
- current block number: 22195184

## Description

Config: global mapping updated for op stack prestates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22195184 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

```diff
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2) {
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
      usedTypes.0.arg.0x03ee2917da962ec266b091f4b62121dc9682bb0db534633707325339f99ee405:
+        "v1.5.1-rc.1 (cannon64)"
      usedTypes.0.arg.0x0354eee87a1775d96afee8977ef6d5d6bd3612b256170952a01bf1051610ee01:
+        "v1.5.1-rc.1"
      usedTypes.0.arg.0x039970872142f48b189d18dcbc03a3737338d098b0101713dc2d6710f9deb5ef:
+        "v1.5.0 (cannon64)"
      usedTypes.0.arg.0x039facea52b20c605c05efb0a33560a92de7074218998f75bcdf61e8989cb5d9:
+        "v1.5.0"
      usedTypes.0.arg.0x0336751a224445089ba5456c8028376a0faf2bafa81d35f43fab8730258cdf37:
+        "v1.4.0-unichain"
    }
```

Generated with discovered.json: 0x5ae255fc5aab3c872cee00c686ef93b0f65b4bab

# Diff at Fri, 04 Apr 2025 11:53:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22195184

## Description

Standard op chain.

## Initial discovery

```diff
+   Status: CREATED
    contract PreimageOracle (0x192668f6b57DeB9D46e6DE87caD7065a052fe1b4)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x2c6AF306F8D0Cd6d9E76D43b2DC9a4E60a7f446e)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x465833609d9ff2Cb9A070b0d71b700F318C97293)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x5b0e75a52862881b4077C865B244CC17cD2b531b)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0x66e58c9D0b42110E956F54aA850C0d629f4B56C5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x683ca289a8418Cb090E42929A73a263d7b81DfC2)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x689db31D7C367ed2c264994c0838a82EdD6Bc9AA)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x73bD898CD5b1dE0Ad1ED5Bf51aaEb52129F697d8)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract MIPS (0x82e66E285aeAd8C06D8b5d6f2a46fd6fAb9097e6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8E2dF5BfA8F8840C588662eE2D1b727b3982CdCA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x9bB00Bc6388Ec810d79cD0e8D5C33edFD4Fd1fa8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb7850CFa577332EB839840e1411962AC3Dd2f183)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xC5D5B6fCD5FdBdA41Ae640aC9881dC949aEd36d0)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xe7C8a3Dd5A03E01e92bD019bBd89bd67aCeC036F)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xF014d8028A7028352baD6226A4894Ae596e2846c)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xF24e68552ED9F4024E1cEBa8ECB8715F62Bb9259)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xf758e2272FCe1330d8a1De38D5128A47B4041752)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xFED2F84E3e18e24EE6aa5f375edBA79782FDA6D2)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```
