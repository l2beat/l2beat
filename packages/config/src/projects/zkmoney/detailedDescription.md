zk.money is a private DAI wallet on Aztec, with funds escrowed in an Ethereum portal. Payments inside are hidden, while names, deposits and withdrawals are public.

Every withdrawal and refund needs a zk proof and a signature from a live AWS Nitro enclave (TEE). The enclave decrypts and reads the operations it handles. Aztec Labs controls zk.money names and the contract lists the released wallets use.

### Multiproof system
The portal releases funds only after Aztec proves the withdrawal message and one registered enclave signer co-signs it. Stealing escrowed funds requires both layers to fail, while a failure of either breaks privacy.

If Aztec Network governance changes its canonical rollup, anyone can freeze the zk.money portal, see [upgrades and governance](#upgrades-and-governance). Refunds then publish note or deposit amounts on Ethereum and use proofs without zero knowledge.

### Wallets
The privacy ratings assume [zk.money Desktop v0.1.0](https://github.com/aztec-labs-eng/zkmoney-public/releases/tag/desktop-v0.1.0). There also is a hosted wallet without published source and the potential to build your independent wallet:
- **Desktop:** runs local code but fetches contract addresses from two unsigned Aztec Labs lists. The wallet checks the [profile](https://github.com/aztec-labs-eng/zkmoney-public/blob/f04743f5d57d1b89f9190cad0f6affd28b0793f2/packages/config-client/src/toContractServiceConfig.ts#L41-L68) against the [manifest](https://github.com/aztec-labs-eng/zkmoney-public/blob/f04743f5d57d1b89f9190cad0f6affd28b0793f2/packages/core/src/oxide/index.ts#L108-L170), and both come from Aztec Labs. Substituting them can redirect future deposits and payments.
- **Hosted:** loads code from zk.money on every visit, which makes its owner an insider. It can read viewing keys and request harmful passkey signatures behind prompts that hide the operation.
- **Independent operation:** would allow a desktop build modified to pin verified addresses, remove screening and serve it under auth.zk.money. Users could submit Ethereum transactions themselves and run the approved enclave on AWS. New names still require Aztec Labs' signature. This setup is untested.

### Deposits
Users fund L1 deposit addresses called SIPAs, and anyone can sweep them into the Ethereum portal. USDC and USDT are swapped to DAI through Curve. After fees, DAI stays in escrow and an Inbox message credits private notes on Aztec L2. Reusing a SIPA links its deposits.

### Names
Tags like l2beat.zk.money publicly map to Aztec addresses and keys on Ethereum. They have two uses:
- **L1 deposits:** any Ethereum wallet with ENS offchain lookups can pay l2beat.zk.money. The lookup returns a deposit address from the recipient's chosen resolver operator.
- **L2 transfers:** zk.money users add a tag as a contact, and the wallet reads its Aztec address from the onchain registry to send private transfers.

Claims require the domain owner's signature from a closed-source server with a name blocklist. The released wallet requires a registered name to access an account on a new device. Wallets use XMTP, an end-to-end encrypted messaging network, to confirm contacts added by QR code or link and to send payment requests.

### Resolver
For ENS lookups, the resolver operator derives each deposit address from a secret shared with the recipient and announces it to them on L2. The wallets derive their own deposit addresses from the same shared secret, so the operator can link them. The onchain Resolver checks a zk proof on every lookup, which stops the operator from redirecting payments. Users can choose a custom operator for name payments.

### Compliance
The wallet sends Ethereum addresses to Predicate through zk.money for screening, which funding a deposit SIPA directly avoids. The relayer screens token movements against OFAC and optionally Predicate, and self-submitted sweeps and withdrawals skip it.

The name resolver screens deposit addresses and funders against OFAC before notifying the recipient on L2. A blocked payment leaves funds at an address unknown to the wallet. Recovery requires the recipient's own tooling to re-derive it and authorization from their L1 account. Screening happens only in these offchain services.

### Fees and limits
A sweep pays {{depositFee}}, or {{registrationSweepFee}} when claiming a name. Registration costs {{registrationFee}} by default, including its sweep fee.

The portal takes {{fpcFundingCut}} from each deposit and ordinary withdrawal to sponsor Aztec fees. Sponsorship requires a registered name or a voucher from a registered account. An empty fee-paying contract, or fees above its allowance, stall the released wallet. Modified code can pay with the account's own Fee Juice. Deposits share a {{depositLimit}} capacity, refilling over {{depositRefillTime}}. Deposit, payment and withdrawal amounts are capped at {{transactionAmountCap}} each.

### Source verification
The [token verification steps](https://github.com/l2beat/l2beat/blob/main/packages/config/src/projects/zkmoney/verificationSteps-token.md) compare a fresh source build with the Aztec instance (L2 contract) pinned by the Ethereum portal. The [verifier steps](/zk-catalog/barretenberg#verifiers) regenerate the keys and Solidity verifiers of the refund and resolver circuits.
