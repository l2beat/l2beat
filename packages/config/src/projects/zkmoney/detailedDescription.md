zk.money is a wallet for private DAI payments on Aztec. You deposit DAI, USDC or USDT on Ethereum, pay other users by name and withdraw to any Ethereum address. Payments inside are hidden, while names, deposits and withdrawals are public.

Funds stay escrowed in an Ethereum portal. Every withdrawal and refund needs a zk proof and a signature from a live AWS Nitro enclave (TEE). The enclave decrypts and reads the operations it handles. Aztec Labs controls zk.money names and the contract lists the released wallets use.

### Architecture

The portal releases funds only after Aztec proves the withdrawal message and one registered enclave signer co-signs it. Stealing escrowed funds requires both layers to fail, while a failure of either breaks privacy.

### Flow

1. **Deposit.** You fund an L1 deposit address called a SIPA, and anyone can sweep it into the portal. USDC and USDT are swapped to DAI through Curve. After fees, an Inbox message credits private notes on Aztec. Reusing a SIPA links its deposits.
2. **Pay.** You add a name as a contact, and the wallet reads its Aztec address from the onchain registry and sends a private transfer.
3. **Withdraw.** Aztec proves the withdrawal message, an enclave co-signs it and the portal pays out DAI on Ethereum.

### Keys

Accounts sign with a passkey. The released wallet requires a registered name to access an account on a new device.

### App

The ratings assume [zk.money Desktop v0.1.0](https://github.com/aztec-labs-eng/zkmoney-public/releases/tag/desktop-v0.1.0). There also is a hosted wallet without published source and the potential to build your independent wallet:
- **Desktop:** runs local code but fetches contract addresses from two unsigned Aztec Labs lists. The wallet checks the [profile](https://github.com/aztec-labs-eng/zkmoney-public/blob/f04743f5d57d1b89f9190cad0f6affd28b0793f2/packages/config-client/src/toContractServiceConfig.ts#L41-L68) against the [manifest](https://github.com/aztec-labs-eng/zkmoney-public/blob/f04743f5d57d1b89f9190cad0f6affd28b0793f2/packages/core/src/oxide/index.ts#L108-L170), and both come from Aztec Labs. Substituting them can redirect future deposits and payments.
- **Hosted:** loads code from zk.money on every visit, which makes its owner an insider. It can read viewing keys and request harmful passkey signatures behind prompts that hide the operation.
- **[CLI](https://github.com/aztec-labs-eng/zkmoney-cli/releases/tag/zkmoney-cli-v0.4.0):** skips XMTP, screens only when configured and accepts your own Aztec node and Ethereum RPC. It derives deposit addresses the same way.
- **Independent operation:** would allow a desktop build modified to pin verified addresses, remove screening and serve it under auth.zk.money. Users could submit Ethereum transactions themselves and run the approved enclave on AWS. New names still require Aztec Labs' signature. This setup is untested.

### Names

Tags like l2beat.zk.money publicly map to Aztec addresses and keys on Ethereum. Any Ethereum wallet with ENS offchain lookups can pay l2beat.zk.money, and the lookup returns a deposit address from the recipient's chosen resolver operator. zk.money users pay names directly on L2.

Claims require the domain owner's signature from a closed-source server with a name blocklist. Wallets use XMTP, an end-to-end encrypted messaging network, to confirm contacts added by QR code or link and to send payment requests.

### Resolver

For ENS lookups, the resolver operator derives each deposit address from a secret shared with the recipient and announces it to them on L2. The wallets derive their own deposit addresses from the same shared secret, so the operator can link them. The onchain Resolver checks a zk proof on every lookup, which stops the operator from redirecting payments. Users can choose a custom operator for name payments.

### Exits

**Refund.** If Aztec Network governance changes its canonical rollup, anyone can freeze the portal, see [upgrades and governance](#upgrades-and-governance). Refunds then publish note or deposit amounts on Ethereum and use proofs without zero knowledge.

### Compliance

The wallet sends Ethereum addresses to Predicate through zk.money for screening, which funding a deposit SIPA directly avoids. The relayer screens token movements against OFAC and optionally Predicate, and self-submitted sweeps and withdrawals skip it.

The name resolver screens deposit addresses and funders against OFAC before notifying the recipient on L2. A blocked payment leaves funds at an address unknown to the wallet. Recovery requires the recipient's own tooling to re-derive it and authorization from their L1 account. Screening happens only in these offchain services.

### Fees

A sweep pays {{depositFee}}, or {{registrationSweepFee}} when claiming a name. Registration costs {{registrationFee}} by default, including its sweep fee.

The portal takes {{fpcFundingCut}} from each deposit and ordinary withdrawal to sponsor Aztec fees. Sponsorship requires a registered name or a voucher from a registered account. An empty fee-paying contract, or fees above its allowance, stall the released wallet. Modified code can pay with the account's own Fee Juice. Deposits share a {{depositLimit}} capacity, refilling over {{depositRefillTime}}. Deposit, payment and withdrawal amounts are capped at {{transactionAmountCap}} each.

### Source verification

The [token verification steps](https://github.com/l2beat/l2beat/blob/main/packages/config/src/projects/zkmoney/verificationSteps-token.md) compare a fresh source build with the Aztec instance (L2 contract) pinned by the Ethereum portal. The [verifier steps](/zk-catalog/barretenberg#verifiers) regenerate the keys and Solidity verifiers of the refund and resolver circuits.
