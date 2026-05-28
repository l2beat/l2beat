Generated with discovered.json: 0xe89b3ea302e4466d20231b9646b13c96ee3d09ad

# Diff at Fri, 15 May 2026 12:35:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1778679690
- current timestamp: 1778679690

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778679690 (main branch discovery), not current.

```diff
    EOA  (eth:0x839395e20bbB182fa440d08F850E6c7A8f6F0780) {
    +++ description: None
      sourceHashes.0:
-        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
+        "0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"
    }
```

Generated with discovered.json: 0xedeaf568c6fe9e126b1f6081f36e7a4ff4c3f72e

# Diff at Fri, 08 May 2026 08:06:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1778057820
- current timestamp: 1778057820

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778057820 (main branch discovery), not current.

```diff
    contract Gnosis Bridge Multisig (Ethereum) (eth:0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract XDaiForeignBridge (eth:0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016) [gnosis/XDaiForeignBridge] {
    +++ description: Ethereum-side ERC20-to-native bridge used to lock DAI or USDS on Ethereum and authorize xDAI minting on Gnosis. Message execution is validated by a dedicated validator set and can additionally be gated by Hashi.
      sourceHashes.0:
-        "0x781decea1d7b5174464b57449f32ada83d1c1b7e12bdfa47eb9d00a41a36c839"
+        "0x8c8e7e1f0584b0d66d934c9cb1155b205081e23d0315127d26e084b35382399d"
      sourceHashes.1:
-        "0x31707ec58aa0ebd43328575885a3495f21a2d3e21890280fafe5cbaf1ab5938b"
+        "0x4d35ade1cd3e7a3519e2ead3392d96056066b101769013782fa16ab64f7d6588"
    }
```

```diff
    contract Hashi Multisig (Ethereum) (eth:0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract ForeignAMB (eth:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e) [gnosis/ForeignAMB] {
    +++ description: Ethereum-side Arbitrary Message Bridge endpoint that verifies validator signatures before relaying cross-chain calls to Gnosis. Hashi can be enabled as an additional verification layer.
      sourceHashes.0:
-        "0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705"
+        "0x1bce2739b3c38c35dc0576c71db959a8c047bbb163f8d7abb959175a4890fd0e"
      sourceHashes.1:
-        "0x5d956ab2f7704c419737b2e96845631d87156578b49801dde52cc9e56eaa182f"
+        "0xbdd78252ae04cc1c12520151a5ecd55bc7e622db1a9d2ea3f0c47a880e17b52f"
    }
```

```diff
    contract ForeignOmnibridge TokenFactory (eth:0x71d5ba4e37de72415F685490B684538Aae8f0424) [gnosis/TokenFactory] {
    +++ description: Factory used by Omnibridge to deploy wrapped tokens representing assets native to the other chain.
      sourceHashes.0:
-        "0xc3fc18a2178145d16d7d8d6b50d97b6d7a405421b3fae66cdeb31fb52f4e7eed"
+        "0x60bb65b10b7cad53b123e6278ee460cd2bd751fc2e2076318c43c658b6332258"
    }
```

```diff
    EOA  (eth:0x839395e20bbB182fa440d08F850E6c7A8f6F0780) {
    +++ description: None
      sourceHashes.0:
-        "0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"
+        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
    }
```

```diff
    contract ForeignOmnibridge (eth:0x88ad09518695c6c3712AC10a214bE5109a655671) [gnosis/ForeignOmnibridge] {
    +++ description: Ethereum-side Omnibridge mediator used for arbitrary token transfers between Ethereum and Gnosis via the AMB bridge.
      sourceHashes.0:
-        "0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705"
+        "0x1bce2739b3c38c35dc0576c71db959a8c047bbb163f8d7abb959175a4890fd0e"
      sourceHashes.1:
-        "0xb84afd7276ac99834f5104f7c4f890572ffc31fadd9629aabd82017025e7ada2"
+        "0xc060a0a5c4d0b4fe874127fc0b42bad2697100539e62436edd051320ac798925"
    }
```

```diff
    contract BridgeRouter (eth:0x9a873656c19Efecbfb4f9FAb5B7acdeAb466a0B0) [gnosis/BridgeRouter] {
    +++ description: Entry router for bridging between Ethereum and Gnosis. It routes DAI and USDS through the legacy xDAI bridge, ETH through the WETH Omnibridge router, and other ERC20 tokens through Omnibridge.
      sourceHashes.0:
-        "0x986346836d4dfb3ec6cb62cd668e6d746f8be0a370a352172dd7f7e0a7fe1320"
+        "0x3335d1c5141feebb2c3729ab3dc2810d3d9196ee836d49c75be1c2b800a77d81"
    }
```

```diff
    contract WETHOmnibridgeRouter (eth:0xa6439Ca0FCbA1d0F80df0bE6A17220feD9c9038a) [gnosis/WETHOmnibridgeRouter] {
    +++ description: Router that wraps native ETH into WETH before sending it through Omnibridge and unwraps it again on Gnosis when bridge messages are executed.
      sourceHashes.0:
-        "0x18759236610feb6952e897ade6b43506d161d78d8954c89f9e8a74a88bd0fcde"
+        "0x3ece097c6b632e3fd79f6e3bc21188ea4dd12f318a71911f5453c56163b807f5"
    }
```

```diff
    contract XDai Bridge Validators (eth:0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E) [gnosis/BridgeValidators] {
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
      sourceHashes.0:
-        "0x781decea1d7b5174464b57449f32ada83d1c1b7e12bdfa47eb9d00a41a36c839"
+        "0x8c8e7e1f0584b0d66d934c9cb1155b205081e23d0315127d26e084b35382399d"
      sourceHashes.1:
-        "0x7123b263360e368977fbfb7da550817b9a4807849090a69d6415b0b1bb33b398"
+        "0x425e20a71323a60c28ce5fea6f556782ea2574976374aee9901d34cb73397522"
    }
```

```diff
    contract AMB Validators (eth:0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064) [gnosis/BridgeValidators] {
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
      sourceHashes.0:
-        "0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705"
+        "0x1bce2739b3c38c35dc0576c71db959a8c047bbb163f8d7abb959175a4890fd0e"
      sourceHashes.1:
-        "0x0ff53e04cc715e56805825c7eb45af72110792ad606dbfd4a97db98dfb75e6f7"
+        "0x9b17703651dbd73e46247e560c9c9dc2fafb5d61642ba7115598a4b62e48cbdd"
    }
```

```diff
    contract SBCDepositContract (gno:0x0B98057eA310F4d31F2a452B414647007d1645d9) [gnosis/SBCDepositContract] {
    +++ description: Gnosis Beacon Chain deposit contract escrowing all validator-staked GNO. Differs from the similar contract on Ethereum by being upgradable, allowing critical permissioned function access and using the non-gastoken GNO as its staking token.
      sourceHashes.1:
-        "0x8ed126164e79f30a4d20b9c831af078f671bfcdd195e47adecadd2164648f504"
+        "0x02b12849b490e3162584af627ba87de774106be25cb87726a24085ac42a0226e"
    }
```

```diff
    contract HomeOmnibridge Fee Manager (gno:0x5dbC897aEf6B18394D845A922BF107FA98E3AC55) [gnosis/OmnibridgeFeeManager] {
    +++ description: Fee manager used by HomeOmnibridge to calculate and distribute bridge fees to a configured reward address list.
      sourceHashes.0:
-        "0xdcb8211bc83ab560c19e3bc532a958bc0582fa7a02d0c53df72f3cf293f598d5"
+        "0x7c890d02973ae2cad3d3b0ce2ee5dbeded007b18f67b37013a6869d93159619f"
    }
```

```diff
    contract HomeAMB (gno:0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59) [gnosis/HomeAMB] {
    +++ description: Gnosis-side Arbitrary Message Bridge endpoint that verifies validator signatures before relaying cross-chain calls to Ethereum. Hashi can be enabled as an additional verification layer.
      sourceHashes.0:
-        "0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705"
+        "0x1bce2739b3c38c35dc0576c71db959a8c047bbb163f8d7abb959175a4890fd0e"
      sourceHashes.1:
-        "0x4e50aa13a908fda155f0aef44f6f0e2c003038cb4ba9731fc7fb16b70c3b7de4"
+        "0xa4d02292450841f41f670301dffedd4e067b1db31cc4bad3c863384915955ae2"
    }
```

```diff
    contract Omnibridge Fee Distributor Safe (gno:0x77bcb57ba7037e39063f1567ce734452bbD7a5F0) [GnosisSafe] {
    +++ description: Safe that currently receives Omnibridge fees distributed by the HomeOmnibridge fee manager.
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract Gnosis Multisig (Gnosis) (gno:0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract GNO token (gno:0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb) [gnosis/PermittableToken] {
    +++ description: Immutable GNO token smart contract contract, administered from the Ethereum side by the Gnosis Bridge contract.
      sourceHashes.1:
-        "0xd9a3b7f2158f4a5eea989005a42d2423bb609fe9ace98844568d2df9ac271035"
+        "0x7bcbb4de024b235710587626ded6954778c1084f861b308a92f053ee81f6d9e6"
    }
```

```diff
    contract HomeAMB Validators (gno:0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008) [gnosis/BridgeValidators] {
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
      sourceHashes.0:
-        "0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705"
+        "0x1bce2739b3c38c35dc0576c71db959a8c047bbb163f8d7abb959175a4890fd0e"
      sourceHashes.1:
-        "0x0ff53e04cc715e56805825c7eb45af72110792ad606dbfd4a97db98dfb75e6f7"
+        "0x9b17703651dbd73e46247e560c9c9dc2fafb5d61642ba7115598a4b62e48cbdd"
    }
```

```diff
    contract HomeOmnibridge TokenFactory (gno:0xEAAE83ac10f975a6456f4C4E48c45Ea2d8e1b5d2) [gnosis/TokenFactory] {
    +++ description: Factory used by Omnibridge to deploy wrapped tokens representing assets native to the other chain.
      sourceHashes.0:
-        "0xc3fc18a2178145d16d7d8d6b50d97b6d7a405421b3fae66cdeb31fb52f4e7eed"
+        "0x60bb65b10b7cad53b123e6278ee460cd2bd751fc2e2076318c43c658b6332258"
    }
```

```diff
    contract Hashi Multisig (Gnosis) (gno:0xEF138856d0581641A57245Ee5CFfc9ceaA059623) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract HomeOmnibridge (gno:0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d) [gnosis/HomeOmnibridge] {
    +++ description: Gnosis-side Omnibridge mediator used for arbitrary token transfers between Gnosis and Ethereum via the AMB bridge.
      sourceHashes.0:
-        "0xc2d647dd43d1a5c348b27b8b2bd671627d194c85cb69a865e67ae8dbdf38b705"
+        "0x1bce2739b3c38c35dc0576c71db959a8c047bbb163f8d7abb959175a4890fd0e"
      sourceHashes.1:
-        "0x054fd17b3f8e15a00d9fd1d8e96c3b2769ae32765e5babae32ca4fd2deae564b"
+        "0x05465c43ed7dcf2c37a59c4f582e92c8b61550c4af8026ec0d66ae6958bd4cef"
    }
```

Generated with discovered.json: 0xef4e6d27fe54dfd19dc3c64abf1423dc7f5bcf4c

# Diff at Wed, 06 May 2026 08:58:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1778057820

## Description

re-add entire gnosis disco incl bridge, consensus and Hashi.

## Initial discovery

```diff
+   Status: CREATED
    contract Gnosis Bridge Multisig (Ethereum) (eth:0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XDaiForeignBridge (eth:0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016)
    +++ description: Ethereum-side ERC20-to-native bridge used to lock DAI or USDS on Ethereum and authorize xDAI minting on Gnosis. Message execution is validated by a dedicated validator set and can additionally be gated by Hashi.
```

```diff
+   Status: CREATED
    contract Hashi Multisig (Ethereum) (eth:0x4b5F5231e2F08Ad49d79Ce5672A8339a63Cfbd43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ForeignAMB (eth:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e)
    +++ description: Ethereum-side Arbitrary Message Bridge endpoint that verifies validator signatures before relaying cross-chain calls to Gnosis. Hashi can be enabled as an additional verification layer.
```

```diff
+   Status: CREATED
    contract ForeignOmnibridge TokenFactory (eth:0x71d5ba4e37de72415F685490B684538Aae8f0424)
    +++ description: Factory used by Omnibridge to deploy wrapped tokens representing assets native to the other chain.
```

```diff
+   Status: CREATED
    EOA  (eth:0x839395e20bbB182fa440d08F850E6c7A8f6F0780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ForeignOmnibridge (eth:0x88ad09518695c6c3712AC10a214bE5109a655671)
    +++ description: Ethereum-side Omnibridge mediator used for arbitrary token transfers between Ethereum and Gnosis via the AMB bridge.
```

```diff
+   Status: CREATED
    contract BridgeRouter (eth:0x9a873656c19Efecbfb4f9FAb5B7acdeAb466a0B0)
    +++ description: Entry router for bridging between Ethereum and Gnosis. It routes DAI and USDS through the legacy xDAI bridge, ETH through the WETH Omnibridge router, and other ERC20 tokens through Omnibridge.
```

```diff
+   Status: CREATED
    contract WETHOmnibridgeRouter (eth:0xa6439Ca0FCbA1d0F80df0bE6A17220feD9c9038a)
    +++ description: Router that wraps native ETH into WETH before sending it through Omnibridge and unwraps it again on Gnosis when bridge messages are executed.
```

```diff
+   Status: CREATED
    contract BridgeRouter ProxyAdmin (eth:0xD7e65A32bEd4ce8cc57Ec188F2bBb8016dc4b1cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XDai Bridge Validators (eth:0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E)
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
```

```diff
+   Status: CREATED
    contract AMB Validators (eth:0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064)
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
```

```diff
+   Status: CREATED
    contract SBCDepositContract (gno:0x0B98057eA310F4d31F2a452B414647007d1645d9)
    +++ description: Gnosis Beacon Chain deposit contract escrowing all validator-staked GNO. Differs from the similar contract on Ethereum by being upgradable, allowing critical permissioned function access and using the non-gastoken GNO as its staking token.
```

```diff
+   Status: CREATED
    contract HomeOmnibridge Fee Manager (gno:0x5dbC897aEf6B18394D845A922BF107FA98E3AC55)
    +++ description: Fee manager used by HomeOmnibridge to calculate and distribute bridge fees to a configured reward address list.
```

```diff
+   Status: CREATED
    contract HomeOmnibridge Gas Limit Manager (gno:0x68A3674028a785A8BCE19bA81B9ab7c9942BA3ED)
    +++ description: Module used by HomeOmnibridge to choose default, selector-specific, and token-specific gas limits for cross-chain Omnibridge message execution.
```

```diff
+   Status: CREATED
    contract HomeAMB (gno:0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59)
    +++ description: Gnosis-side Arbitrary Message Bridge endpoint that verifies validator signatures before relaying cross-chain calls to Ethereum. Hashi can be enabled as an additional verification layer.
```

```diff
+   Status: CREATED
    contract Omnibridge Fee Distributor Safe (gno:0x77bcb57ba7037e39063f1567ce734452bbD7a5F0)
    +++ description: Safe that currently receives Omnibridge fees distributed by the HomeOmnibridge fee manager.
```

```diff
+   Status: CREATED
    contract Gnosis Multisig (Gnosis) (gno:0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GNO token (gno:0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb)
    +++ description: Immutable GNO token smart contract contract, administered from the Ethereum side by the Gnosis Bridge contract.
```

```diff
+   Status: CREATED
    contract HomeAMB Validators (gno:0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008)
    +++ description: Validator set contract used by the bridge to require threshold signatures before cross-chain messages can be executed.
```

```diff
+   Status: CREATED
    contract HomeOmnibridge Forwarding Rules Manager (gno:0xd4D8c07097F9b87EcC4C1a838C4b71DBebcd2286)
    +++ description: Module used by HomeOmnibridge to decide whether specific tokens, senders, or receivers must use the oracle-driven lane or the manual lane for bridge requests.
```

```diff
+   Status: CREATED
    contract HomeOmnibridge TokenFactory (gno:0xEAAE83ac10f975a6456f4C4E48c45Ea2d8e1b5d2)
    +++ description: Factory used by Omnibridge to deploy wrapped tokens representing assets native to the other chain.
```

```diff
+   Status: CREATED
    contract Hashi Multisig (Gnosis) (gno:0xEF138856d0581641A57245Ee5CFfc9ceaA059623)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HomeOmnibridge (gno:0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d)
    +++ description: Gnosis-side Omnibridge mediator used for arbitrary token transfers between Gnosis and Ethereum via the AMB bridge.
```
