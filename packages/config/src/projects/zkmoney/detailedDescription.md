zk.money lets users send DAI privately on Aztec and move it into sUSDS savings. Funds are escrowed on Ethereum. Names, deposits and withdrawals are public.

Every withdrawal and refund needs a zk proof and a signature from a live AWS Nitro enclave (TEE). Each pool's enclave decrypts and reads the operations it handles. Aztec Labs controls names and the contract lists the released wallets use.

The portal releases funds only after Aztec proves the withdrawal message and one registered enclave signer co-signs it. Stealing escrowed funds requires both layers to fail, while a failure of either breaks privacy.

### Flow

1. **Deposit.** You fund an L1 deposit address called a SIPA, and anyone can sweep it into the portal. USDC and USDT are swapped to DAI through Curve. After fees, an Inbox message credits private notes on Aztec. Reusing a SIPA links its deposits.
2. **Pay.** You add a name as a contact, and the wallet reads its Aztec address from the onchain registry and sends a private transfer.
3. **Withdraw.** Aztec proves the withdrawal message, an enclave co-signs it and the portal pays out DAI on Ethereum. A swap escrow can instead pay out USDC, USDT or ETH, and give a fresh recipient ETH for gas.

### Keys

Accounts sign with a passkey. The released wallet requires a registered name to access an account on a new device.

### App
The privacy ratings cover DAI payments and sUSDS savings in [zk.money Desktop v0.5.0](https://github.com/aztec-labs-eng/zkmoney-public/releases/tag/desktop-v0.5.0).

The Desktop release runs local code. Its endpoint settings accept the user's own Aztec node, Ethereum endpoint and DAI enclave. The sUSDS enclave address is always fetched from Aztec Labs among other addresses in two unsigned contract lists. Replacing them can redirect future deposits and payments.

The hosted wallet reloads code on every visit. Its owner can read viewing keys and request harmful passkey signatures through misleading prompts.

Independent operation remains untested. It requires a modified Desktop build without screening, pointed at self-hosted contract lists. Users would submit Ethereum transactions themselves and register an approved enclave on AWS. New names still require Aztec Labs' signature. The [enclave guide](https://docs.zk.money/docs/run-an-enclave) describes image downloads and registration.

### Savings
Savings hold sUSDS in a second portal with its own L2 token and enclave. A move in withdraws DAI to a deterministic SkyEscrow, which converts it through USDS into sUSDS shares and deposits them into the sUSDS portal. A move out reverses both legs into the DAI portal. Each move publishes its DAI and share amounts, tied by the escrow. The wallet moves sUSDS only to and from the user's own DAI balance.

### Names
Tags such as l2beat.zk.money publish Aztec addresses and keys on Ethereum.
- **L1 deposits:** ENS-compatible wallets resolve a tag to a deposit address through the recipient's chosen resolver operator. The default is a centralized resolver who can link deposits to their tag.
- **L2 transfers:** wallets read the registered Aztec address when a tag is added as a contact.

Name claims need the domain owner's signature. XMTP, an encrypted offchain messaging network, powers QR-code or link contacts and carries payment requests.

### Resolver
For ENS lookups, the resolver operator derives each deposit address from a secret shared with the recipient and announces it to them on L2. The assessed wallet can derive its own deposit addresses privately. The onchain Resolver checks a zk proof on every lookup, which stops the operator from redirecting payments. Users can choose a custom operator for name payments.

### Exits

**Refund.** If Aztec Network governance changes its canonical rollup, anyone can freeze the portal, see [upgrades and governance](#upgrades-and-governance). Refunds then publish note or deposit amounts on Ethereum and use proofs without zero knowledge.

### Compliance
The assessed wallet sends Ethereum addresses to Predicate through zk.money for screening, which funding a deposit SIPA directly avoids. The relayer screens token movements against OFAC and optionally Predicate, and self-submitted sweeps and withdrawals skip it.

The name resolver screens deposit addresses and funders against OFAC before notifying the recipient on L2. A blocked payment leaves funds at an address unknown to the wallet. Recovery requires the recipient's own tooling to re-derive it and authorization from their L1 account. Screening happens only in these offchain services.

### Fees and limits
A DAI sweep pays {{depositFee}}, or {{registrationSweepFee}} when claiming a name. Registration costs {{registrationFee}} by default, including its sweep fee.

The DAI portal takes {{fpcFundingCut}} from deposits and ordinary withdrawals to sponsor Aztec fees. The sUSDS portal takes {{susdsFpcFundingCut}}.

Gas sponsorship needs a registered name or a voucher from a registered account. An empty fee-paying contract, or fees above its allowance, stall the assessed wallet. Modified code can pay with the account's own Fee Juice.

DAI deposits share {{depositLimit}} of capacity, refilling over {{depositRefillTime}}. sUSDS deposits share {{susdsDepositLimit}}, refilling over {{susdsDepositRefillTime}}.

DAI deposits, payments and withdrawals are capped at {{transactionAmountCap}} each. sUSDS deposits and withdrawals are capped at {{susdsTransactionAmountCap}} each.

### Source verification
The [token verification steps](https://github.com/l2beat/l2beat/blob/main/packages/config/src/projects/zkmoney/verificationSteps-token.md) compare a fresh source build with the DAI and sUSDS L2 contracts pinned by their Ethereum portals. The [verifier steps](/zk-catalog/barretenberg#verifiers) regenerate the keys and Solidity verifiers of the refund and resolver circuits.
