Generated with discovered.json: 0xecc7fcef7b208945eca0780721b8de594fe55f5b

# Diff at Wed, 28 Oct 2026 11:19:00 GMT:

- id: 4cf2689b
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1793184565

## Description

Initial discovery of zk.money on Aztec v6: immutable DAI and sUSDS OxidePortals sharing one TeeRegistry with a fixed enclave image, v5-to-v6 MigrationExecutors, and deposit-address, name and resolver contracts. The deployer EOA owns the SIPAFactory, ForwardingTable and NameRegistry.

## Initial discovery

```diff
+   Status: CREATED
    contract NitroValidator (eth:0x13114c5C847a414D20755DBc2eCbe00cc98039DF) [zkmoney/NitroValidator]
    +++ description: Validates AWS Nitro enclave attestations against the certificate chain verified by the CertManager.
```

```diff
+   Status: CREATED
    contract NamePortal (eth:0x158161B257f9bAD34C12Dd8D52638424b216c3a2) [zkmoney/v6/NamePortal]
    +++ description: Announces a zk.money name on Aztec. Anyone can send an L1->L2 message carrying a named account's name hash and bootstrap key to an Aztec address of their choice. It accepts only accounts deployed by ACCOUNT_FACTORY.
```

```diff
+   Status: CREATED
    contract SIPAFactory (eth:0x186C20F0F294378E1DecA7419c667e44c73E992C) [zkmoney/v6/SIPAFactory]
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. A clone counts as blessed when its implementation was blessed and its ForwardingTable approved. Each clone's code and table are fixed in its address. New deposit addresses, from the wallet or the Resolver, clone the current implementation for their intent.
```

```diff
+   Status: CREATED
    contract OxideAccountFactory (eth:0x187d19EccBf2909AD3d71B798A8704D950b9C3ee) [zkmoney/OxideAccountFactory]
    +++ description: Permissionless factory for deterministic L1 accounts. The implementation is immutable and there is no administrator.
```

```diff
+   Status: CREATED
    contract ResolverVerifier (eth:0x1E63715af06Bb12331f6A319b46253713e4d0206) [zkmoney/ResolverVerifier]
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
```

```diff
+   Status: CREATED
    contract OxidePortal_sUSDS (eth:0x2EbFEE284bABf94869FAC44BC85eDb3C34e536D8) [zkmoney/v6/OxidePortal]
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from L2_TOKEN and a signature from a TEE signer registered in the TEE_REGISTRY. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. A refund needs a zk proof against that snapshot and a registered signer's signature.
```

```diff
+   Status: CREATED
    contract ZKTranscriptLib (eth:0x428Fa81B22AAF7C9acb9c73D114894886E3F7d4d) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
+   Status: CREATED
    contract RegistrationController (eth:0x45F626E2a4D63232677C96B163ac46e20514a915) [zkmoney/v6/RegistrationController]
    +++ description: Completes paid name registrations from blessed registration addresses: deploys the user's L1 account, claims the name, writes the user record, optionally announces the name on Aztec through the NAME_PORTAL, and installs the user's first passkey. Fees above the relayer fee go to an allowlisted beneficiary.
```

```diff
+   Status: CREATED
    contract UserOpSIPA (eth:0x5180f0659D021368CDF5c4499967B9A329C775A0) [zkmoney/v6/UserOpSIPA]
    +++ description: Implementation of zk.money deposit addresses that carry an operation of the user's L1 account. Sweeping a funded clone executes the account operation fixed in the clone's address through the ERC-4337 EntryPoint, with the user's signature, then pays the listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract OperationExecutor (eth:0x5ecE3b4EBE7137b1b6f92406dE17d9816D585c1c) [zkmoney/OperationExecutor]
    +++ description: Permissionless helper that executes a call and forwards the resulting token payout to the caller. Used by finalizers to collect fees and subsidies.
```

```diff
+   Status: CREATED
    contract MigrationExecutor (eth:0x70E9c762B02Ec645DF4BC2456271805cba80126c) [zkmoney/v6/MigrationExecutor]
    +++ description: Payout contract that moves refunds from the frozen SOURCE_PORTAL into DESTINATION_PORTAL. Only SOURCE_PORTAL can call it. It deposits the refund, minus the relayer tip committed in the refund, into DESTINATION_PORTAL for the recipient commitment the refund names.
```

```diff
+   Status: CREATED
    contract PlainWithdrawalExecutor (eth:0x7C8c2147d1BB8B83e0a0501097372de170eE702a) [zkmoney/v6/PlainWithdrawalExecutor]
    +++ description: Default payout contract for withdrawals and refunds. Only the PORTAL can call it. It pays the recipient and relayer tip committed on Aztec. An ordinary withdrawal first pays FEE to BENEFICIARY, while refunds pay no fee.
```

```diff
+   Status: CREATED
    contract SkyEscrowFactory (eth:0x7F890e5DF3B4165D1cE4E9A42e97C44f1d7dCc09) [zkmoney/SkyEscrowFactory]
    +++ description: Deploys deterministic escrows for moving funds between the DAI and sUSDS portals. Anyone can execute a funded escrow. Its implementation and routes are immutable.
```

```diff
+   Status: CREATED
    contract FrozenNotesRefundVerifier (eth:0x880F3C8356A930522896A7c539157D4c87F95377) [zkmoney/v6/FrozenNotesRefundVerifier]
    +++ description: UltraHonk verifier for refunds of notes that were unspent when the zk.money portal froze. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract TeeRegistry (eth:0x8b705C3519169F29850D156574ec377B686bd9CD) [zkmoney/v6/TeeRegistry]
    +++ description: Registry of the TEE signers that the zk.money portals accept for withdrawals and refunds. Anyone can register a signer with an AWS Nitro attestation of the enclave image PCR0_HASH that is at most TEE_ATTESTATION_MAX_AGE seconds old. Registration also sends an L1->L2 message to L2_RECIPIENT, whose inclusion the zk.money contracts on Aztec prove to accept the signer there. Registrations are permanent, and the approved image cannot change.
```

```diff
+   Status: CREATED
    contract SwapEscrowFactory (eth:0x8F4105a55C457D796Adab90d5D9E649861E81625) [zkmoney/SwapEscrowFactoryV2]
    +++ description: Swap-on-withdraw: a withdrawal can pay DAI to a SwapEscrowV2 clone whose route, recipient, gas share and tip are fixed in its address. Anyone can deploy and execute a funded clone to pay USDC, USDT, ETH or DAI to the recipient.
```

```diff
+   Status: CREATED
    contract MigrationExecutor_sUSDS (eth:0x92270578f3A311B3ced0019a4E15701e7405b4AE) [zkmoney/v6/MigrationExecutor]
    +++ description: Payout contract that moves refunds from the frozen SOURCE_PORTAL into DESTINATION_PORTAL. Only SOURCE_PORTAL can call it. It deposits the refund, minus the relayer tip committed in the refund, into DESTINATION_PORTAL for the recipient commitment the refund names.
```

```diff
+   Status: CREATED
    contract RegistrationSIPA (eth:0x96A52ed47Af73423D4b8a920913e5c1ceFdC1319) [zkmoney/v6/RegistrationSIPA]
    +++ description: Implementation of zk.money registration addresses. Sweeping a funded clone registers the name through the current RegistrationController of the NameRegistry, pays the committed and listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract FrozenDepositsRefundVerifier (eth:0xa460C3130D1701a94f76d1122362C0D127f1C6A3) [zkmoney/v6/FrozenDepositsRefundVerifier]
    +++ description: UltraHonk verifier for refunds of deposits that reached Aztec but were unspent when the zk.money portal froze. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract NameRegistry (eth:0xa9863B8F573D62377d987ccb9AF6e0000f99D14a) [zkmoney/NameRegistry]
    +++ description: Registry of zk.money names. It points to the RegistrationController and the AccountMetadataRegistry, which together decide where payments to a zk.money name resolve to.
```

```diff
+   Status: CREATED
    contract SkyEscrow (eth:0xB61D97Faf96ec8de617aAF54F4764d01cfd25b8b) [zkmoney/SkyEscrow]
    +++ description: Implementation for savings conversion escrows. Each clone fixes the route, deposit commitment, relayer tip and recovery commitment in its address. It converts DAI into sUSDS or redeposits DAI after a savings withdrawal. The recovery account can reclaim stranded tokens, including shares taken without redemption.
```

```diff
+   Status: CREATED
    contract DepositSIPA (eth:0xBFe3dE3C4466cbC5803A756847208c69B3BAe401) [zkmoney/v6/DepositSIPA]
    +++ description: Implementation of zk.money deposit addresses. Anyone can sweep a funded clone, which swaps USDC or USDT to DAI, pays the fees its ForwardingTable lists and deposits the rest into the portal that table names for the token, for the recipient fixed in the clone's address. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract Resolver (eth:0xc329a74542688a3c4948B7d46F204d3d7e5Dd525) [zkmoney/Resolver]
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
```

```diff
+   Status: CREATED
    contract SwapEscrow (eth:0xc953308e66DA19881d8ddD240E6369Db8Ef72Ab9) [zkmoney/SwapEscrowV2]
    +++ description: SwapEscrowV2 implementation. A clone swaps via the Curve 3pool (and Uniswap for ETH) with a slippage bound of 100 bps for stablecoins and 200 bps against the Chainlink ETH/USD price for ETH. It can first swap a capped share of the DAI to ETH for the recipient's gas. If the swap cannot execute, only the recovery key committed in the clone's address can move the funds.
```

```diff
+   Status: CREATED
    contract OxidePortal (eth:0xCB99C58Fe81Ae6b2cB4835e46F7b703745879042) [zkmoney/v6/OxidePortal]
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from L2_TOKEN and a signature from a TEE signer registered in the TEE_REGISTRY. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. A refund needs a zk proof against that snapshot and a registered signer's signature.
```

```diff
+   Status: CREATED
    contract PortalFactory (eth:0xCeae64c7211a2208afFc4F396ADD1D46996Cd2A2) [zkmoney/v6/PortalFactory]
    +++ description: Deploys OxidePortals that share its TEE_REGISTRY and refund verifiers. Each portal is a separate escrow for one token and one L2 token contract, and nothing in a deployed portal refers back to the factory.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0xCEBD4589238699fcD7FEA8F89f05AE35F4D7E8c4) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
+   Status: CREATED
    contract PlainWithdrawalExecutor_sUSDS (eth:0xd0D8E5C5B128ea7e5f2d461Afd6C669BC0877dF8) [zkmoney/v6/PlainWithdrawalExecutor]
    +++ description: Default payout contract for withdrawals and refunds. Only the PORTAL can call it. It pays the recipient and relayer tip committed on Aztec. An ordinary withdrawal first pays FEE to BENEFICIARY, while refunds pay no fee.
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
    contract CertManager (eth:0xe3DDDf3D4B624F49B4CeB81807338CCa14f5dd86) [zkmoney/CertManager]
    +++ description: Verifies and caches AWS Nitro attestation certificates. The only trust anchor is the hardcoded AWS Nitro root certificate.
```

```diff
+   Status: CREATED
    contract UnprocessedDepositRefundVerifier (eth:0xF15780eB45c49a7cB4FB0BF178D3DaF0F1D68c8a) [zkmoney/v6/UnprocessedDepositRefundVerifier]
    +++ description: UltraHonk verifier for refunds of deposits that never reached Aztec before the zk.money portal froze. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract SkyWithdrawalExecutor (eth:0xFE0B2B24cca52D1680103E258985A5aCA33742d5) [zkmoney/SkyWithdrawalExecutor]
    +++ description: Payout contract for sUSDS withdrawals and refunds. Only the PORTAL can execute a payout. It normally redeems sUSDS into USDS and converts USDS to DAI before paying the committed recipient and relayer tip. The recipient can complete an ordinary withdrawal in sUSDS shares through withdrawInShares, bypassing redemption.
```

```diff
+   Status: CREATED
    contract ForwardingTable (eth:0xFf839a8Be7c90c804F42563f352324cEBcDfe41C) [zkmoney/v6/ForwardingTable]
    +++ description: Routing table of zk.money deposit addresses. For each listed token it names the portal that deposit addresses using this table sweep into, and per intent the fee for the beneficiary and the tip for the sweeper. Rows and intents can only be added, never changed or removed.
```
