Generated with discovered.json: 0x7073767428a6e535ef0f5b692305d8657e0bc1ec

# Diff at Mon, 05 Oct 2026 09:38:12 GMT:

- id: e9f8fef9
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd994874bd99b18ba1f55be2a7905cd3e3005273 block: 1790840907
- current timestamp: 1791192874

## Description

Ossification review of zk.money: ZkMoneyPortal field severities follow the ossification spec.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790840907 (main branch discovery), not current.

```diff
    contract FrozenNotesRefundVerifier (eth:0x0694fF404DDA586C73EfCe21f34fe084541BB877) [zkmoney/HonkVerifier] {
    +++ description: UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key.
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
    }
```

```diff
    contract UnprocessedDepositRefundVerifier (eth:0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5) [zkmoney/HonkVerifier] {
    +++ description: UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key.
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
    }
```

```diff
    contract FrozenDepositRefundVerifier (eth:0xa2fd594dCA2d598aF231d615E5D34903154C3cCe) [zkmoney/HonkVerifier] {
    +++ description: UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key.
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for a zk.money refund circuit with a hardcoded verification key."
    }
```

```diff
    contract NameRegistry (eth:0xa9863B8F573D62377d987ccb9AF6e0000f99D14a) [zkmoney/NameRegistry] {
    +++ description: Registry of zk.money names. It points to the RegistrationController and the AccountMetadataRegistry, which together decide where payments to a zk.money name resolve to.
      fieldMeta.resolver:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ResolverVerifier (eth:0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451) [zkmoney/ResolverVerifier] {
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
      template:
-        "zkmoney/HonkVerifier"
+        "zkmoney/ResolverVerifier"
      description:
-        "UltraHonk verifier for a zk.money circuit with a hardcoded verification key."
+        "UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address."
      critical:
-        true
    }
```

```diff
    contract SIPAFactory (eth:0xc357E34D4C7520a83C9Ec0a242Ba52b4ecABa1Fc) [zkmoney/SIPAFactory] {
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. The implementation per portal and intent is blessed once by the owner and cannot be changed afterwards.
      fieldMeta.blessedImplementations.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

```diff
    contract ZkMoneyPortal (eth:0xdf410ad448A0f7165181FBdB32f8896f4a0d9449) [zkmoney/ZkMoneyPortal] {
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. Withdrawals within the frozen checkpoint and epoch bounds remain available alongside refunds that need a zk proof and a TEE signature. L2 transfers are not disabled but do not change refundable ownership.
      fieldMeta.owner.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta._$l2Portal.severity:
-        "HIGH"
      fieldMeta._$frozen.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

Generated with discovered.json: 0x86ff4d71f651c62d1c8c8bdee886eb88ecbf0e7a

# Diff at Thu, 01 Oct 2026 07:49:42 GMT:

- id: 1225e8f9
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1790840907

## Description

Initial full discovery of zk.money.

## Initial discovery

```diff
+   Status: CREATED
    contract NitroValidator (eth:0x0119bC52a09Ac6e7998378BadC16D0e9A866Be56) [zkmoney/NitroValidator]
    +++ description: Validates AWS Nitro enclave attestations against the certificate chain verified by the CertManager.
```

```diff
+   Status: CREATED
    contract SwapEscrowFactory (eth:0x03b21BBa8e75A1BD0354c5ECbEC078cF59C85343) [zkmoney/SwapEscrowFactory]
    +++ description: Swap-on-withdraw: a withdrawal can pay DAI to a SwapEscrow clone whose route, recipient and tip are fixed in its address. Anyone can deploy and execute a funded clone to swap the DAI for USDC, USDT or ETH to the recipient.
```

```diff
+   Status: CREATED
    contract FrozenNotesRefundVerifier (eth:0x0694fF404DDA586C73EfCe21f34fe084541BB877) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract RegistrationSIPA (eth:0x0934F010d59b552949DBe44AcBE5AFf0e32C8C34) [zkmoney/RegistrationSIPA]
    +++ description: Implementation of zk.money registration addresses. Sweeping a funded clone registers the name through the current RegistrationController of the NameRegistry, pays the committed fees and deposits the rest into the PORTAL. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract RegistrationController (eth:0x10EB6fecD2DCE6DA55d25C355374c970D5D11E23) [zkmoney/RegistrationController]
    +++ description: Completes paid name registrations: deploys the user's L1 account, claims the name and writes the user record. Fees above the relayer fee go to an allowlisted beneficiary.
```

```diff
+   Status: CREATED
    contract OxideAccountFactory (eth:0x187d19EccBf2909AD3d71B798A8704D950b9C3ee) [zkmoney/OxideAccountFactory]
    +++ description: Permissionless factory for deterministic L1 accounts. The implementation is immutable and there is no administrator.
```

```diff
+   Status: CREATED
    contract FPCFunderDAI (eth:0x37cD81C39Bf276ea7e1c6a416A254f688c70eAFb) [zkmoney/FPCFunderDAI]
    +++ description: Collects the portal's funding cut. Anyone can swap it to AZTEC and bridge it as Fee Juice to the zk.money fee-paying contract on Aztec (L2_BENEFICIARY), which pays L2 fees for users.
```

```diff
+   Status: CREATED
    contract Resolver (eth:0x3e9BcF7cCA4b94885aBEB9Bbf0005aA99DC6307F) [zkmoney/Resolver]
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
```

```diff
+   Status: CREATED
    contract UnprocessedDepositRefundVerifier (eth:0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract FrozenDepositRefundVerifier (eth:0xa2fd594dCA2d598aF231d615E5D34903154C3cCe) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract NameRegistry (eth:0xa9863B8F573D62377d987ccb9AF6e0000f99D14a) [zkmoney/NameRegistry]
    +++ description: Registry of zk.money names. It points to the RegistrationController and the AccountMetadataRegistry, which together decide where payments to a zk.money name resolve to.
```

```diff
+   Status: CREATED
    contract ResolverVerifier (eth:0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451) [zkmoney/HonkVerifier]
    +++ description: UltraHonk verifier for a zk.money circuit with a hardcoded verification key.
```

```diff
+   Status: CREATED
    contract PlainWithdrawalExecutor (eth:0xC2363b7155EE8391C5395B72C46a6d22BF49151c) [zkmoney/PlainWithdrawalExecutor]
    +++ description: Default payout contract for withdrawals and refunds. Only the PORTAL can call it. It pays the recipient and relayer tip committed on Aztec.
```

```diff
+   Status: CREATED
    contract SIPAFactory (eth:0xc357E34D4C7520a83C9Ec0a242Ba52b4ecABa1Fc) [zkmoney/SIPAFactory]
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. The implementation per portal and intent is blessed once by the owner and cannot be changed afterwards.
```

```diff
+   Status: CREATED
    contract OxideAccount (eth:0xdA0D7cD0f49cE7b1D04bf03eE56374a8981c2844) [zkmoney/OxideAccount]
    +++ description: Immutable implementation of users' L1 accounts. The bootstrap key authorizes the first passkey. Once a passkey is installed, only the user's passkeys can authorize operations and manage keys. The last passkey cannot be removed. Deposit recovery checks signatures against this account.
```

```diff
+   Status: CREATED
    contract AccountMetadataRegistry (eth:0xDA79Bae4485c40291363D885Aae5B543d2D0Efa9) [zkmoney/AccountMetadataRegistry]
    +++ description: Stores user records (Aztec L2 address, keys, chosen resolver operator) and resolver operator entries. User records can be written by the user or by the RegistrationController. Anyone can register as a resolver operator.
```

```diff
+   Status: CREATED
    contract ZkMoneyPortal (eth:0xdf410ad448A0f7165181FBdB32f8896f4a0d9449) [zkmoney/ZkMoneyPortal]
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from the zk.money L2 contract and a signature from a registered TEE signer. Anyone can register a TEE signer with a fresh AWS Nitro attestation of an approved enclave image. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. Withdrawals within the frozen checkpoint and epoch bounds remain available alongside refunds that need a zk proof and a TEE signature. L2 transfers are not disabled but do not change refundable ownership.
```

```diff
+   Status: CREATED
    contract CertManager (eth:0xdfe52FD98aa0Cc8Ce7778a2b00ac7B7Dc9595875) [zkmoney/CertManager]
    +++ description: Verifies and caches AWS Nitro attestation certificates. The only trust anchor is the hardcoded AWS Nitro root certificate.
```

```diff
+   Status: CREATED
    contract OperationExecutor (eth:0xe883686d9EC4E0430f2233A6BF12B2D226a39e19) [zkmoney/OperationExecutor]
    +++ description: Permissionless helper that executes a call and forwards the resulting token payout to the caller. Used by finalizers to collect fees and subsidies.
```

```diff
+   Status: CREATED
    contract SwapEscrow (eth:0xf16Fd140036925e3a0630d0F743204a4c7d8ccaf) [zkmoney/SwapEscrow]
    +++ description: SwapEscrow implementation. A clone swaps via the Curve 3pool (and Uniswap for ETH) with a slippage bound of 100 bps for stablecoins and 200 bps against the Chainlink ETH/USD price for ETH. If the swap cannot execute, only the recovery key committed in the clone's address can move the funds.
```

```diff
+   Status: CREATED
    contract DepositSIPA (eth:0xF714D8Cf287F4A410b018514074A9371BC45461b) [zkmoney/DepositSIPA]
    +++ description: Implementation of zk.money deposit addresses. Anyone can sweep a funded clone, which swaps USDC or USDT to DAI, pays DEPOSIT_FEE to the relayer and deposits the rest into the PORTAL for the recipient fixed in the clone's address. The recipient's account can recover any funds from the clone.
```
