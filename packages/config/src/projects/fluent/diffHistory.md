Generated with discovered.json: 0x7bd2d9efc5770d3dc63fbf9e415f775cbf90cf19

# Diff at Fri, 24 Jul 2026 09:11:37 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@e4bae6c708e972febd09837213f50ce9cdf09201 block: 1782901376
- current timestamp: 1784884231

## Description

Upgraded TEE verification SP1 program, program hash reproduced.

## Watched changes

```diff
    contract NitroVerifier (eth:0xFdB04b67ecD8352bA3885F66fFfddf1f5f25292F) [fluent/NitroVerifier] {
    +++ description: Verifies AWS Nitro Enclave attestations onchain. The enclave's signing key is admitted only after an SP1 proof confirms its attestation matches the expected PCR0 measurement, binding preconfirmation authority to audited enclave code.
      values.getProgramVKey:
-        "0x00fb9ae7af3b4852bd4524789cb15dbf188ee47b1d3838bdd39062821c6182e6"
+        "0x00e726560b91ff68e7e232d79536f4a8fb951f1f0197f97f7377b3f21e7e641e"
    }
```

Generated with discovered.json: 0x00aa16fb1067501e68e21d2cd8542ad42955a2ea

# Diff at Wed, 01 Jul 2026 10:23:59 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@ddc641881a6870ab0c9e9ee1c517ed9eb73306bc block: 1782384456
- current timestamp: 1782901376

## Description

Updated Fluent TEE program attestation verifier SP1 program to v1.0.3. Regenerated from sources.

## Watched changes

```diff
    contract NitroVerifier (eth:0xFdB04b67ecD8352bA3885F66fFfddf1f5f25292F) [fluent/NitroVerifier] {
    +++ description: Verifies AWS Nitro Enclave attestations onchain. The enclave's signing key is admitted only after an SP1 proof confirms its attestation matches the expected PCR0 measurement, binding preconfirmation authority to audited enclave code.
      values.getProgramVKey:
-        "0x0085924e73e2b0d0e2626c592825fe092d3cfb63b108757965b2a6c06c8c311b"
+        "0x00fb9ae7af3b4852bd4524789cb15dbf188ee47b1d3838bdd39062821c6182e6"
    }
```

Generated with discovered.json: 0x9e89818bde3567af20dc52741c5b1f1fae3a1d21

# Diff at Tue, 09 Jun 2026 12:43:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780653849
- current timestamp: 1780653849

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780653849 (main branch discovery), not current.

```diff
    EOA FluentAdminEOA (eth:0x9ec3f0d76A6d3847d86374c791C6E170CAd9518D) {
    +++ description: None
      receivedPermissions.1.permission:
-        "propose"
+        "interact"
    }
```

```diff
    EOA FluentProverEOA (eth:0xB9E6f78a0F35F96b806D0359AbB251117aCe255C) {
    +++ description: None
      receivedPermissions.0.permission:
-        "validate"
+        "interact"
    }
```

```diff
    EOA FluentEnclaveAttesterEOA (eth:0xef9Dc1F87BAA090a35B985DAad9c8096440F2012) {
    +++ description: None
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "interact"
    }
```

```diff
    EOA FluentSequencerEOA (eth:0xFd58Bc438d910088C413b889Eaa0aded5C0d1c26) {
    +++ description: None
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

Generated with discovered.json: 0x1b7b5494de277dc6ffcba400e196521568ca4bb0

# Diff at Fri, 05 Jun 2026 10:05:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1778589577
- current timestamp: 1780653849

## Description

L1FluentBridge implementation swapped by FluentMultisig on 2026-05-20: `0x047A…C227` → `0xF67255…F849` ([diff](https://disco.l2beat.com/diff/eth:0x047AaDf25df7D17bB5B6b1FF31cecD1E4973C227/eth:0xF67255be817061139C9DeeA757f7276916cBF849)). Key changes:

- `receiveMessageWithProof` is now **permissionless** — the `onlyRole(RELAYER_ROLE)` gate was removed, so anyone can relay an L2→L1 message from a preconfirmed or finalized batch. `RELAYER_ROLE` no longer gates the live L1 receive path.
- Message execution gas is now bounded by `executeGasLimit` instead of `gasleft()` (`_receiveMessage(getExecuteGasLimit(), …)`); the configured limit changed 5000 → 550000, and a `ReceivedMessage(hash, success, data)` event is emitted.
- Bare ETH transfers to the bridge are rejected — the `receive() external payable {}` fallback was deleted, so ETH must go through `NativeGateway`.
- `_beforeReceiveMessage` hook gains a `bytes32 messageHash` parameter (propagated through `receiveMessageWithProof` and `receiveFailedMessage`).
- `registerGateway` now requires the target to be a contract and rejects double-registration; `unregisterGateway` rejects unknown addresses.
- `rollbackMessageWithProof` still reverts `NOT_IMPLEMENTED`.

## Watched changes

```diff
    contract L1FluentBridge (eth:0x9CAcf613fC29015893728563f423fD26dCdB8Ddc) [fluent/L1FluentBridge] {
    +++ description: Bridge core for Fluent. Routes deposits from L1 gateways into a FIFO queue consumed by the sequencer, and lets anyone process L2->L1 messages with two Merkle proofs against a preconfirmed or finalized batch root. Custodies bridged ETH on L1 (gateways forward ETH here on deposit). UUPS-upgradeable; upgrades and gateway-whitelist / oracle / pause changes are gated by DEFAULT_ADMIN_ROLE.
      sourceHashes.1:
-        "0x7bda96bf482f46806c7ec01435c28a85aa1cac36fddebecc38ed1b28e23ebc12"
+        "0x73f59c197fe2e902ffd1c1e9ee49d52d05e0df7bf001e7e56cc3d82339a457ea"
      values.$implementation:
-        "eth:0x047AaDf25df7D17bB5B6b1FF31cecD1E4973C227"
+        "eth:0xF67255be817061139C9DeeA757f7276916cBF849"
      values.$pastUpgrades.6:
+        ["2026-05-20T15:00:23.000Z","0x5683f1be2880db1238db0cafc17623f895de685541543b5fd577efdfec53429c",["eth:0xF67255be817061139C9DeeA757f7276916cBF849"]]
      values.$upgradeCount:
-        6
+        7
      implementationNames.eth:0x047AaDf25df7D17bB5B6b1FF31cecD1E4973C227:
-        "L1FluentBridge"
      implementationNames.eth:0xF67255be817061139C9DeeA757f7276916cBF849:
+        "L1FluentBridge"
    }
```

## Source code changes

```diff
.../L1FluentBridge/L1FluentBridge.sol              | 471 ++++++++++++++-------
 1 file changed, 319 insertions(+), 152 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778589577 (main branch discovery), not current.

```diff
    EOA  (eth:0x4A0e88275dC08a15Bad0d12e7805574Ca0853A48) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"relay","from":"eth:0x9CAcf613fC29015893728563f423fD26dCdB8Ddc","description":"deliver L2->L1 messages on L1 via receiveMessageWithProof; this is the only entry point for first-time delivery, so user withdrawals progress only when a holder of this role acts (failed-execution retries via receiveFailedMessage are permissionless once a message has been delivered at least once).","role":".relayerAC"}]
    }
```

```diff
    contract SP1Verifier (eth:0x99A74A05a0FaBEB217C1A329b0dac59a1FA52508) [succinct/SP1Verifier] {
    +++ description: Verifier contract for SP1 proofs (v6.0.0).
      template:
+        "succinct/SP1Verifier"
      description:
+        "Verifier contract for SP1 proofs (v6.0.0)."
    }
```

```diff
    contract L1FluentBridge (eth:0x9CAcf613fC29015893728563f423fD26dCdB8Ddc) [fluent/L1FluentBridge] {
    +++ description: Bridge core for Fluent. Routes deposits from L1 gateways into a FIFO queue consumed by the sequencer, and lets anyone process L2->L1 messages with two Merkle proofs against a preconfirmed or finalized batch root. Custodies bridged ETH on L1 (gateways forward ETH here on deposit). UUPS-upgradeable; upgrades and gateway-whitelist / oracle / pause changes are gated by DEFAULT_ADMIN_ROLE.
      description:
-        "Bridge core for Fluent. Routes deposits from L1 gateways into a FIFO queue consumed by the sequencer, and lets relayers process L2->L1 messages with two Merkle proofs against the latest preconfirmed or finalized batch root. Custodies bridged ETH on L1 (gateways forward ETH here on deposit). UUPS-upgradeable; upgrades and gateway-whitelist / oracle / pause changes are gated by DEFAULT_ADMIN_ROLE."
+        "Bridge core for Fluent. Routes deposits from L1 gateways into a FIFO queue consumed by the sequencer, and lets anyone process L2->L1 messages with two Merkle proofs against a preconfirmed or finalized batch root. Custodies bridged ETH on L1 (gateways forward ETH here on deposit). UUPS-upgradeable; upgrades and gateway-whitelist / oracle / pause changes are gated by DEFAULT_ADMIN_ROLE."
      values.relayerAC:
-        ["eth:0x4A0e88275dC08a15Bad0d12e7805574Ca0853A48"]
    }
```

```diff
    contract SP1Verifier (eth:0xb69f2584CBcFf99a58C4e7002E8b89Af54a6f4e2) [succinct/SP1Verifier] {
    +++ description: Verifier contract for SP1 proofs (v6.1.0).
      template:
+        "succinct/SP1Verifier"
      description:
+        "Verifier contract for SP1 proofs (v6.1.0)."
    }
```

Generated with discovered.json: 0x2a715f75d799d10de6f858c25495805742c9b703

# Diff at Tue, 12 May 2026 12:40:42 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1778589577

## Description

initial discovery

## Initial discovery

```diff
+   Status: CREATED
    contract ERC20PeggedToken (eth:0x056fD0A3eD85c6ae1Ec1c398B33581951Ed4b090) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Blacklist (eth:0x05C5d46a5e6f92fB9CdA9A8b03E4440A175D1484) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FluentRollup (eth:0x1cF53Fd9CD0b713be29F2b41cA17A943f138727f) [fluent/FluentRollup]
    +++ description: Core Fluent rollup contract. Sequencers commit batch roots and EIP-4844 blob hashes; an AWS Nitro Enclave preconfirms each batch via a signature whose key is bound to a PCR0 measurement verified by SP1; participants holding CHALLENGER_ROLE can dispute and the prover resolves disputes with SP1 ZK proofs; batches finalize after a block-count delay or immediately once all blocks are proven.
```

```diff
+   Status: CREATED
    contract NitroVerifier (eth:0x207FBb4AC5227Ab598B8072BdC1E150dF687AC5B) [fluent/NitroVerifier]
    +++ description: Verifies AWS Nitro Enclave attestations onchain. The enclave's signing key is admitted only after an SP1 proof confirms its attestation matches the expected PCR0 measurement, binding preconfirmation authority to audited enclave code.
```

```diff
+   Status: CREATED
    contract FluentMultisig (eth:0x33C0B99F3210a9578d81d5B13dEC03160F58ff11) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (eth:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) [succinct/SP1VerifierGateway]
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract FastWithdrawalList (eth:0x3eFc3c84ecf259Da36E33692f2a107A0AB88D30E) [fluent/FastWithdrawalList]
    +++ description: Per-token rate-limit registry for the optimistic (preconfirmed) fast-withdrawal path. Enforces hourly and daily caps using rolling windows keyed by block timestamp; related tokens (e.g. ETH and WETH) can be aliased to a shared bucket to prevent cap evasion.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5) [succinct/SP1Verifier]
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract FluentTimeLock (eth:0x7846C001835d889A29ba659f67A5B7ac98E73bF4) [fluent/FluentTimeLock]
    +++ description: OpenZeppelin TimelockController used to delay privileged operations. PROPOSER_ROLE schedules calls; the configured minimum delay must elapse before EXECUTOR_ROLE can execute them; CANCELLER_ROLE can drop scheduled calls.
```

```diff
+   Status: CREATED
    contract NativeGateway (eth:0x8976Ca4E0c8467097Da675399fB7DB454a1b56dd) [fluent/NativeGateway]
    +++ description: L1 entry point for ETH deposits into Fluent. Forwards ETH to L1FluentBridge for actual escrow custody and emits the corresponding bridge message. UUPS-upgradeable; upgrades are gated by the contract owner.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x99A74A05a0FaBEB217C1A329b0dac59a1FA52508) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1FluentBridge (eth:0x9CAcf613fC29015893728563f423fD26dCdB8Ddc) [fluent/L1FluentBridge]
    +++ description: Bridge core for Fluent. Routes deposits from L1 gateways into a FIFO queue consumed by the sequencer, and lets relayers process L2->L1 messages with two Merkle proofs against the latest preconfirmed or finalized batch root. Custodies bridged ETH on L1 (gateways forward ETH here on deposit). UUPS-upgradeable; upgrades and gateway-whitelist / oracle / pause changes are gated by DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0xb69f2584CBcFf99a58C4e7002E8b89Af54a6f4e2) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0xdD283a04cc711aB9c08d79e665835821BEef710B) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20TokenFactory (eth:0xF6d49E874Cb64b8ee56D6F99BD340134B30AB225) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Gateway (eth:0xFD4C62647A34FF6d6802092F5fbe176099223B61) [fluent/ERC20Gateway]
    +++ description: L1 entry point for ERC-20 deposits into Fluent. Custodies ERC-20 tokens directly on L1 and emits the corresponding bridge message; on the L2 side the canonical pegged token is minted via the ERC20TokenFactory. UUPS-upgradeable; upgrades are gated by the contract owner.
```

```diff
+   Status: CREATED
    contract NitroVerifier (eth:0xFdB04b67ecD8352bA3885F66fFfddf1f5f25292F) [fluent/NitroVerifier]
    +++ description: Verifies AWS Nitro Enclave attestations onchain. The enclave's signing key is admitted only after an SP1 proof confirms its attestation matches the expected PCR0 measurement, binding preconfirmation authority to audited enclave code.
```
