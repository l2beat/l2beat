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
