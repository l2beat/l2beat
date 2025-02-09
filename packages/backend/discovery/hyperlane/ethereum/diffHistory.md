Generated with discovered.json: 0xb96ca09ceb1ec8cb97c9551db7056e11394d3075

# Diff at Sun, 09 Feb 2025 14:57:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21808054

## Description

Initial discovery: Token bridge with lane-specific confiuigurable security and chain-specific default security configs.

## Initial discovery

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x011a0D839e043D74c1073337DBf449ac47b82405)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0x26a3D8C5b70abb99828997b94D53d3c193A0F24b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A)
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543)
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```

```diff
+   Status: CREATED
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239)
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09)
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0xd27fe5631533a193776A61B600809a73256eF9a7)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x011a0D839e043D74c1073337DBf449ac47b82405,0x26a3D8C5b70abb99828997b94D53d3c193A0F24b] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c)
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7)
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2)
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```
