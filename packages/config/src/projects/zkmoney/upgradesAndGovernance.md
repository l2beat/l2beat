### Immutable escrow and accounts

The portal, Aztec token, fee-paying contract, verifiers, withdrawal executors and current SIPA implementations cannot be upgraded.

The approved enclave image is fixed. Anyone can permanently register a signer with an AWS Nitro attestation at most {{attestationMaxAge}} old. {{teeSignerCount}} signers are registered. A withdrawal or refund needs only one of them, alongside its proof. Registrations do not expire and cannot be revoked.

If Aztec governance changes the canonical rollup, anyone can permanently freeze the portal. Deposits stop and refundable ownership is fixed at the last proven checkpoint. Later L2 transfers do not change it. Withdrawals and refunds still require a live enclave.

### Name administration

Two Aztec Labs EOAs control *.zk.money names:

- The deployer owns the NameRegistry and can replace its RegistrationController, AccountMetadataRegistry and Resolver, allowing it to reassign names, rewrite records and redirect future payments. It also owns zk.money in ENS, which the DNS domain holder can reclaim.
- The domain owner can refuse name claims, sign custom registration fees and add fee beneficiaries. Users select a beneficiary from the allowlist in their signed registration intent. Existing beneficiaries cannot be removed.

### Wallet and services

Aztec Labs controls hosted wallet code, desktop releases and two unsigned contract lists consumed by both wallets. These are security dependencies: wallet code handles keys and signatures, and the lists determine where future funds go. The wallet checks the [profile](https://github.com/aztec-labs-eng/zkmoney-public/blob/fc37a3e25440bc4bd7a9de81a7f4830ec753a4d4/packages/config-client/src/toContractServiceConfig.ts#L41-L68) and [manifest](https://github.com/aztec-labs-eng/zkmoney-public/blob/fc37a3e25440bc4bd7a9de81a7f4830ec753a4d4/packages/core/src/oxide/index.ts#L108-L170) for consistency, but both come from Aztec Labs. A local build with custom nodes still trusts those lists until their addresses are independently verified and pinned.

The relayer, resolver, claim server, enclave hosts and passkey domain also control availability and censorship. Self-submission bypasses the relayer, but exits still need an enclave and the released wallets still depend on zk.money services.
