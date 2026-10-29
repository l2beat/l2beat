zk.money lets users send DAI privately on Aztec and move it into sUSDS savings. Funds are escrowed on Ethereum. Names, deposits and withdrawals are public.

Every withdrawal and refund needs a zk proof and a signature from a live AWS Nitro enclave (TEE). The enclave decrypts and reads the operations it handles, and its approved image is unpublished. Aztec Labs controls names, the code of future deposit addresses and the contract lists the released wallets use.

### Architecture

The portal releases funds only after Aztec proves the withdrawal message and one registered enclave signer co-signs it. Stealing escrowed funds requires both layers to fail, while a failure of either breaks privacy.

### Flow

1. **Deposit.** You fund an L1 deposit address called a SIPA, and anyone can sweep it into the portal. USDC and USDT are swapped to DAI through Curve. After fees, an Inbox message credits private notes on Aztec. Reusing a SIPA links its deposits.
2. **Pay.** You add a name as a contact, and the wallet reads its Aztec address from the onchain registry and sends a private transfer.
3. **Withdraw.** Aztec proves the withdrawal message, an enclave co-signs it and the portal pays out DAI on Ethereum. A relayer submits it, or the user's own wallet after an hour. A swap escrow can instead pay out USDC, USDT or ETH, and give a fresh recipient ETH for gas.

### Keys

Accounts sign with a passkey. The released wallet creates it only in Apple's, Google's or 1Password's synced passkey manager, or on a security key.

### App

The ratings cover DAI payments and sUSDS savings in Desktop, which runs local code. Its endpoint settings replace the Aztec node, the frozen v5 network's node, the Ethereum endpoint and the enclave. Aztec Labs always serves the two unsigned contract lists, and replacing them can redirect future deposits and payments. Its account service receives each account's name and L1 account on every launch.

The hosted wallet reloads code on every visit. Its owner can read viewing keys and request harmful passkey signatures through misleading prompts.

### Savings

Savings hold sUSDS in a second portal with its own L2 token and the same enclaves. A move in withdraws DAI to a deterministic SkyEscrow, which converts it through USDS into sUSDS shares and deposits them into the sUSDS portal. A move out reverses both legs into the DAI portal. Each move publishes its DAI and share amounts, tied by the escrow. Moving a whole position out republishes the share amount it went in with. The wallet moves sUSDS only to and from the user's own DAI balance.

### Names

Tags such as l2beat.zk.money publish Aztec addresses and keys on Ethereum.
- **L1 deposits:** ENS-compatible wallets resolve a tag to a deposit address through the recipient's chosen resolver operator. The default is a centralized resolver who can link deposits to their tag.
- **L2 transfers:** wallets read the registered Aztec address when a tag is added as a contact.

Name claims need the domain owner's signature. XMTP, an encrypted offchain messaging network, powers QR-code or link contacts and carries payment requests.

### Resolver

For ENS lookups, the resolver operator derives each deposit address from a secret shared with the recipient and announces it to them on L2. The assessed wallet derives its own deposit addresses privately. The onchain Resolver checks a zk proof on every lookup, which stops the operator from redirecting payments. Users can choose a custom operator for name payments.

### Migration from v5

Balances of the frozen v5 deployment move here through refunds. The wallet refunds v5 notes to a migration contract, which deposits them into the v6 portal for the same account. Users can instead withdraw v5 balances to Ethereum.

### Exits

**Refund.** If Aztec Network governance changes its canonical rollup, anyone can freeze the portals, see [upgrades and governance](#upgrades-and-governance). Refunds then publish note or deposit amounts on Ethereum and use proofs without zero knowledge.

### Compliance

The assessed wallet screens withdrawal recipients through Predicate, via zk.money, and stops when screening fails. The relayer screens token movements against OFAC and optionally Predicate, and self-submitted sweeps and withdrawals skip it.

The name resolver screens deposit addresses and funders against OFAC before notifying the recipient on L2. A blocked payment leaves funds at an address unknown to the wallet. Recovery requires the recipient's own tooling to re-derive it and authorization from their L1 account. Screening happens only in these offchain services.

### Fees and limits

A DAI sweep pays {{depositFee}}, or {{registrationSweepFee}} when claiming a name, and an sUSDS sweep {{susdsDepositFee}}. A name costs {{registrationFee}}. Each ordinary withdrawal pays {{withdrawalFee}} toward Aztec fees.

Gas sponsorship needs a registered name or a voucher from a registered account. An empty fee-paying contract, or fees above its allowance, stall the assessed wallet. Modified code can pay with the account's own Fee Juice.

DAI deposits share {{depositLimit}} of capacity, refilling over {{depositRefillTime}}. sUSDS deposits share {{susdsDepositLimit}}, refilling over {{susdsDepositRefillTime}}.

DAI deposits, payments and withdrawals are capped at {{transactionAmountCap}} each. sUSDS deposits and withdrawals are capped at {{susdsTransactionAmountCap}} each.

### Anonymity set

The chart counts depositors traced through deposit addresses. Each migration counts as one depositor, since its v5 refund names no funder. Moves out of savings count no depositor, since the mover already holds funds in zk.money.

### Source verification

The [token verification steps](https://github.com/l2beat/l2beat/blob/main/packages/config/src/projects/zkmoneyv6/verificationSteps-token.md) compare a fresh source build with the DAI and sUSDS L2 contracts pinned by their Ethereum portals. The [verifier steps](/zk-catalog/barretenberg#verifiers) regenerate the keys and Solidity verifiers of the refund and resolver circuits.
