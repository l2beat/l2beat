Generated with discovered.json: 0x737e4d5ab331575691a93ee258f2edca7eb10812

# Diff at Tue, 30 Jul 2024 11:16:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x384ba11ab649558fc75508b449408c264f12d147

# Diff at Mon, 29 Jul 2024 15:11:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20413034

## Description

Initial discovery: OP stack rollup with non-onboarded SuperchainConfig.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x15567C4FfD9109795dFf1D9A5233D10aef0738D2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e)
    +++ description: None
```
