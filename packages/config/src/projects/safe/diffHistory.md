Generated with discovered.json: 0xa8b3c97c30bad1d31580e50fbc5e65a546b3315e

# Diff at Mon, 19 Oct 2026 08:35:39 GMT:

- id: 9877274c
- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1792398877

## Description

Initial discovery of the canonical Safe v1.3.0, v1.4.1 and v1.5.0 deployments: the implementations and their L2 variants, the proxy factories, the fallback handlers, and the libraries accounts delegatecall into.

## Initial discovery

```diff
+   Status: CREATED
    contract SimulateTxAccessor_v1_5_0 (eth:0x07EfA797c55B5DdE3698d876b277aBb6B893654C) [safe/SimulateTxAccessor]
    +++ description: Library that Safe tooling delegatecalls from an account to simulate a transaction and estimate its gas.
```

```diff
+   Status: CREATED
    contract SafeProxyFactory_v1_5_0 (eth:0x14F2982D601c9458F93bd70B218933A6f8165e7b) [safe/SafeProxyFactory]
    +++ description: Deploys Safe accounts as proxies and sets them up in the same transaction. It has no owner and no control over the accounts it created.
```

```diff
+   Status: CREATED
    contract MultiSend_v1_5_0 (eth:0x218543288004CD07832472D464648173c77D7eB7) [safe/MultiSend]
    +++ description: Library that Safe accounts delegatecall to execute a batch of transactions, each a call or a delegatecall.
```

```diff
+   Status: CREATED
    contract SafeL2_v1_4_1 (eth:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762) [GnosisSafe]
    +++ description: Same as the v1.4.1 implementation, but it also emits an event for every executed transaction, for indexing on chains without transaction tracing.
```

```diff
+   Status: CREATED
    contract CreateCall_v1_5_0 (eth:0x2Ef5ECfbea521449E4De05EDB1ce63B75eDA90B4) [safe/CreateCall]
    +++ description: Library that Safe accounts delegatecall to deploy contracts with CREATE or CREATE2.
```

```diff
+   Status: CREATED
    contract MultiSend_v1_4_1 (eth:0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526) [safe/MultiSend]
    +++ description: Library that Safe accounts delegatecall to execute a batch of transactions, each a call or a delegatecall.
```

```diff
+   Status: CREATED
    contract SimulateTxAccessor_v1_4_1 (eth:0x3d4BA2E0884aa488718476ca2FB8Efc291A46199) [safe/SimulateTxAccessor]
    +++ description: Library that Safe tooling delegatecalls from an account to simulate a transaction and estimate its gas.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (eth:0x3E5c63644E683549055b9Be8653de26E0B4CD36E) [GnosisSafe]
    +++ description: Same as the v1.3.0 implementation, but it also emits an event for every executed transaction, for indexing on chains without transaction tracing.
```

```diff
+   Status: CREATED
    contract CompatibilityFallbackHandler_v1_5_0 (eth:0x3EfCBb83A4A7AfcB4F68D501E2c2203a38be77f4) [safe/CompatibilityFallbackHandler]
    +++ description: Default fallback handler for Safe accounts: lets them receive ERC-721, ERC-1155 and ERC-777 tokens and answer EIP-1271 signature checks. It has no owner and no state.
```

```diff
+   Status: CREATED
    contract MultiSendCallOnly_v1_3_0 (eth:0x40A2aCCbd92BCA938b02010E17A5b8929b49130D) [safe/MultiSendCallOnly]
    +++ description: Like MultiSend, but the batch can only contain regular calls.
```

```diff
+   Status: CREATED
    contract Safe_v1_4_1 (eth:0x41675C099F32341bf84BFc5382aF534df5C7461a) [GnosisSafe]
    +++ description: Implementation of Safe v1.4.1 multisig accounts, which are proxies that delegatecall it. Accounts have M-of-N owners and optional modules, guard and fallback handler. Immutable and ownerless; it locks itself at deployment.
```

```diff
+   Status: CREATED
    contract SafeProxyFactory_v1_4_1 (eth:0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67) [safe/SafeProxyFactory]
    +++ description: Deploys Safe accounts as proxies and sets them up in the same transaction. It has no owner and no control over the accounts it created.
```

```diff
+   Status: CREATED
    contract SignMessageLib_v1_5_0 (eth:0x4FfeF8222648872B3dE295Ba1e49110E61f5b5aa) [safe/SignMessageLib]
    +++ description: Library that Safe accounts delegatecall to mark a message as signed for EIP-1271 checks.
```

```diff
+   Status: CREATED
    contract SimulateTxAccessor_v1_3_0 (eth:0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da) [safe/SimulateTxAccessor]
    +++ description: Library that Safe tooling delegatecalls from an account to simulate a transaction and estimate its gas.
```

```diff
+   Status: CREATED
    contract CreateCall_v1_3_0 (eth:0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4) [safe/CreateCall]
    +++ description: Library that Safe accounts delegatecall to deploy contracts with CREATE or CREATE2.
```

```diff
+   Status: CREATED
    contract MultiSendCallOnly_v1_4_1 (eth:0x9641d764fc13c8B624c04430C7356C1C7C8102e2) [safe/MultiSendCallOnly]
    +++ description: Like MultiSend, but the batch can only contain regular calls.
```

```diff
+   Status: CREATED
    contract CreateCall_v1_4_1 (eth:0x9b35Af71d77eaf8d7e40252370304687390A1A52) [safe/CreateCall]
    +++ description: Library that Safe accounts delegatecall to deploy contracts with CREATE or CREATE2.
```

```diff
+   Status: CREATED
    contract MultiSend_v1_3_0 (eth:0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761) [safe/MultiSend]
    +++ description: Library that Safe accounts delegatecall to execute a batch of transactions, each a call or a delegatecall.
```

```diff
+   Status: CREATED
    contract SignMessageLib_v1_3_0 (eth:0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2) [safe/SignMessageLib]
    +++ description: Library that Safe accounts delegatecall to mark a message as signed for EIP-1271 checks.
```

```diff
+   Status: CREATED
    contract GnosisSafeProxyFactory (eth:0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2) [safe/SafeProxyFactory]
    +++ description: Deploys Safe accounts as proxies and sets them up in the same transaction. It has no owner and no control over the accounts it created.
```

```diff
+   Status: CREATED
    contract MultiSendCallOnly_v1_5_0 (eth:0xA83c336B20401Af773B6219BA5027174338D1836) [safe/MultiSendCallOnly]
    +++ description: Like MultiSend, but the batch can only contain regular calls.
```

```diff
+   Status: CREATED
    contract SignMessageLib_v1_4_1 (eth:0xd53cd0aB83D845Ac265BE939c57F53AD838012c9) [safe/SignMessageLib]
    +++ description: Library that Safe accounts delegatecall to mark a message as signed for EIP-1271 checks.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552) [GnosisSafe]
    +++ description: Implementation of Safe v1.3.0 multisig accounts, which are proxies that delegatecall it. Accounts have M-of-N owners and optional modules, guard and fallback handler. Immutable and ownerless; it locks itself at deployment.
```

```diff
+   Status: CREATED
    contract SafeL2_v1_5_0 (eth:0xEdd160fEBBD92E350D4D398fb636302fccd67C7e) [N/A]
    +++ description: Same as the v1.5.0 implementation, but it also emits an event for every executed transaction, for indexing on chains without transaction tracing.
```

```diff
+   Status: CREATED
    contract CompatibilityFallbackHandler_v1_3_0 (eth:0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4) [N/A]
    +++ description: Default fallback handler for Safe v1.3.0 accounts: lets them receive ERC-721, ERC-1155 and ERC-777 tokens and answer EIP-1271 signature checks. It has no owner and no state.
```

```diff
+   Status: CREATED
    contract CompatibilityFallbackHandler_v1_4_1 (eth:0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99) [safe/CompatibilityFallbackHandler]
    +++ description: Default fallback handler for Safe accounts: lets them receive ERC-721, ERC-1155 and ERC-777 tokens and answer EIP-1271 signature checks. It has no owner and no state.
```

```diff
+   Status: CREATED
    contract Safe_v1_5_0 (eth:0xFf51A5898e281Db6DfC7855790607438dF2ca44b) [GnosisSafe]
    +++ description: Implementation of Safe v1.5.0 multisig accounts, which are proxies that delegatecall it. Accounts have M-of-N owners and optional modules, guards and fallback handler. Immutable and ownerless; it locks itself at deployment.
```
