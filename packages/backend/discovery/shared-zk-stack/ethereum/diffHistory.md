Generated with discovered.json: 0x51986ec7c761eedc766c0d7b90bdfdc189defb33

# Diff at Wed, 31 Jul 2024 10:26:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20425929

## Description

Initial discovery of the shared config.

Two governance transactions (no delay) add the new Cronos zkEVM (First ZK stack chain). It shares the StateTransitionManager, ValidatorTimelock and Verifier with ZKsync Era, thus sharing the L2 logic. For DA it uses ValidiumMode. (https://etherscan.io/tx/0xb2a1d8913ebe7b4a8a21064c994801ad036fc85da1f378f35b57956df72f0131)
Four new Validators are registered with the Timelock, of which two are removed, leaving two new ones and two each for ZKsync Era and Cronos zkEVM.

The Cronos DiamondProxy is not yet verified.

## Initial discovery

```diff
+   Status: CREATED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828)
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB)
    +++ description: None
```
