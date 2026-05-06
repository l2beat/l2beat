Generated with discovered.json: 0x93a01838fa0b9a8cbf8d928cd8f69dd74eac4938

# Diff at Wed, 06 May 2026 12:27:51 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1778070408

## Description

initial discovery

## Initial discovery

```diff
+   Status: CREATED
    contract ERC20PeggedToken (eth:0x056fD0A3eD85c6ae1Ec1c398B33581951Ed4b090)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Blacklist (eth:0x05C5d46a5e6f92fB9CdA9A8b03E4440A175D1484)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FluentRollup (eth:0x1cF53Fd9CD0b713be29F2b41cA17A943f138727f)
    +++ description: Core Fluent rollup contract. Sequencers commit batch roots and EIP-4844 blob hashes; an AWS Nitro Enclave preconfirms each batch via a signature whose key is bound to a PCR0 measurement verified by SP1; participants holding CHALLENGER_ROLE can dispute and the prover resolves disputes with SP1 ZK proofs; batches finalize after a block-count delay or immediately once all blocks are proven.
```

```diff
+   Status: CREATED
    contract NitroVerifier (eth:0x207FBb4AC5227Ab598B8072BdC1E150dF687AC5B)
    +++ description: Verifies AWS Nitro Enclave attestations onchain. The enclave's signing key is admitted only after an SP1 proof confirms its attestation matches the expected PCR0 measurement, binding preconfirmation authority to audited enclave code.
```

```diff
+   Status: CREATED
    contract FluentMultisig (eth:0x33C0B99F3210a9578d81d5B13dEC03160F58ff11)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (eth:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract FastWithdrawalList (eth:0x3eFc3c84ecf259Da36E33692f2a107A0AB88D30E)
    +++ description: Per-token rate-limit registry for the optimistic (preconfirmed) fast-withdrawal path. Enforces hourly and daily caps using rolling windows keyed by block timestamp; related tokens (e.g. ETH and WETH) can be aliased to a shared bucket to prevent cap evasion.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract FluentTimeLock (eth:0x7846C001835d889A29ba659f67A5B7ac98E73bF4)
    +++ description: OpenZeppelin TimelockController used to delay privileged operations. PROPOSER_ROLE schedules calls; the configured minimum delay must elapse before EXECUTOR_ROLE can execute them; CANCELLER_ROLE can drop scheduled calls.
```

```diff
+   Status: CREATED
    contract NativeGateway (eth:0x8976Ca4E0c8467097Da675399fB7DB454a1b56dd)
    +++ description: L1 entry point for ETH deposits into Fluent. Forwards ETH to L1FluentBridge for actual escrow custody and emits the corresponding bridge message. UUPS-upgradeable; upgrades are gated by the contract owner.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x99A74A05a0FaBEB217C1A329b0dac59a1FA52508)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1FluentBridge (eth:0x9CAcf613fC29015893728563f423fD26dCdB8Ddc)
    +++ description: Bridge core for Fluent. Routes deposits from L1 gateways into a FIFO queue consumed by the sequencer, and lets relayers process L2->L1 messages with two Merkle proofs against the latest preconfirmed or finalized batch root. Custodies bridged ETH on L1 (gateways forward ETH here on deposit). UUPS-upgradeable; upgrades and gateway-whitelist / oracle / pause changes are gated by DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0xb69f2584CBcFf99a58C4e7002E8b89Af54a6f4e2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0xdD283a04cc711aB9c08d79e665835821BEef710B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20TokenFactory (eth:0xF6d49E874Cb64b8ee56D6F99BD340134B30AB225)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Gateway (eth:0xFD4C62647A34FF6d6802092F5fbe176099223B61)
    +++ description: L1 entry point for ERC-20 deposits into Fluent. Custodies ERC-20 tokens directly on L1 and emits the corresponding bridge message; on the L2 side the canonical pegged token is minted via the ERC20TokenFactory. UUPS-upgradeable; upgrades are gated by the contract owner.
```

```diff
+   Status: CREATED
    contract NitroVerifier (eth:0xFdB04b67ecD8352bA3885F66fFfddf1f5f25292F)
    +++ description: Verifies AWS Nitro Enclave attestations onchain. The enclave's signing key is admitted only after an SP1 proof confirms its attestation matches the expected PCR0 measurement, binding preconfirmation authority to audited enclave code.
```
