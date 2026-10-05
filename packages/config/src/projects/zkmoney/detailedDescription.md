Internal payments are hidden, but names, deposits and withdrawals are public. The first payment to a new contact reveals the recipient. The first sponsored transaction after registration reveals the sender's account.

Every withdrawal and refund needs a proof and a live AWS Nitro enclave. Operations are encrypted to the enclave (TEE), which decrypts and reads them. Its approved binary has not been reproduced from the published source. Aztec Labs controls zk.money names and the released wallets' contract configuration.

### Multiproofs and exits
The portal releases funds only after Aztec proves the withdrawal message (zk proof of validity) and any one registered enclave signer co-signs it (TEE signature). Stealing escrowed funds requires both layers to fail while privacy leaks depend on either. Anyone can register an enclave running the approved image with a fresh AWS attestation.

If Aztec governance changes its canonical rollup, anyone can freeze the portal. Deposits stop and refundable ownership is fixed at the last proven checkpoint. Later L2 transfers do not change it. Withdrawals and refunds still need an enclave. Refunds expose note or deposit amounts on Ethereum and use proofs without zero knowledge.

### Wallet
- **Hosted:** loads code from zk.money on every visit. Whoever controls deployment can read viewing keys and request harmful passkey signatures. Passkey prompts do not show the operation.
- **Desktop:** runs local code but fetches contract addresses from two unsigned Aztec Labs lists. Substituting them can redirect future deposits and payments.
- **Independent operation:** requires modifying the desktop build to pin verified addresses, remove screening and serve it under auth.zk.money. Users can submit Ethereum transactions themselves and run the approved enclave on AWS. New names still require Aztec Labs' signature. L2BEAT has not run this setup.

Both released wallets allow custom Aztec, Ethereum and enclave endpoints. Their passkeys belong to auth.zk.money, which must authorize wallet.zk.money on every use. Onchain contracts do not check the signature's origin. A modified wallet served under auth.zk.money would bypass this dependency.

Wallets use XMTP, an end-to-end encrypted messaging network, to confirm contacts added by QR code or link and to send payment requests. Messages are encrypted, but each inbox is publicly tied to a name, so XMTP's servers can see which names talk to each other.

The browser stores the master key unencrypted until sign-out, and viewing keys and decrypted notes until local data is cleared. All keys except the spending key derive from the master key (privacy is lost if the master key is leaked).

### Deposits and fees
Users fund deposit addresses called SIPAs. Anyone can sweep them into the Ethereum portal. USDC and USDT are swapped to DAI through Curve. After fees, DAI stays in escrow and an Inbox message credits private notes on Aztec L2. SIPAs can be reused, at the expense of user privacy.

A sweep pays {{depositFee}}, or {{registrationSweepFee}} when claiming a name. Registration costs {{registrationFee}} by default, including its sweep fee. The domain owner (onchain role in NameRegistry) can sign custom prices and add fee beneficiaries. Users select a beneficiary in their registration intent.

The portal takes {{fpcFundingCut}} from each deposit and ordinary withdrawal to sponsor Aztec fees. Sponsorship requires a registered name or a voucher from a registered account. An empty fee-paying contract or fees above its allowance stall the released wallet. Modified code can pay with the account's own Fee Juice (potential privacy implications). Deposits share a {{depositLimit}} capacity, refilling over {{depositRefillTime}}. Deposit, payment and withdrawal transaction amounts are capped at {{transactionAmountCap}} each.

### Names and Compliance
Names (tags) publicly map to Aztec addresses and keys on Ethereum. Claims require the domain owner's signature from a closed-source server with a name blocklist. The released wallet requires a registered name to access an account on a new device.

External name payments use a resolver operator to derive and announce deposit addresses. Internal payments skip it (reading from the onchain contract), but wallet-created deposit addresses still derive from Aztec Labs' operator key. The onchain Resolver checks a zk proof on every lookup, binding each address to the recipient's registered keys, Aztec address and L1 account, so the operator cannot redirect payments. It can still re-derive every deposit address of its users. Users can choose another operator for name payments. The only registered operator is Aztec Labs, and its service is unpublished.

The wallet sends Ethereum addresses to Predicate through zk.money for screening, which can be bypassed by funding a deposit SIPA directly. The relayer also screens token movements against OFAC and optionally Predicate. Self-submitting sweeps and proven withdrawals bypasses relayer screening.

The name resolver screens deposit addresses and funders against OFAC before notifying the recipient on L2. A blocked payment leaves funds at an address the wallet never learns. Recovery requires the recipient's own tooling to re-derive it and authorization from their L1 account. Onchain contracts and the enclave do not check compliance lists.

### Source verification
The [token verification steps](https://github.com/l2beat/l2beat/blob/main/packages/config/src/projects/zkmoney/verificationSteps-token.md) compare a fresh source build with the Aztec instance (L2 contract) pinned by the Ethereum portal. The [verifier steps](/zk-catalog/barretenberg#verifiers) regenerate the keys and Solidity verifiers of the refund and resolver circuits and compare them with the deployed contracts.
