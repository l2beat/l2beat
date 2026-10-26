Payy is a mobile app for USDC payments. The user deposits USDC, sends it to other users or as a payment link, and withdraws it to Ethereum or tops up the Payy card. Note amounts and owners stay hidden. Which notes fund which, and every deposit and withdrawal with its address and amount, are public.

Users trust Payy, which runs the only validator, prover and node, delivers notes between users and holds the keys of link and ramp notes. The {{multisigStats}} multisig can upgrade the RollupV1 contract and overwrite its state root without delay. Leaving needs Payy: withdrawals settle only in its proven state updates, and transaction data lives only on its servers.

### Architecture

Each balance is a set of notes. A note holds an amount of USDC and an owner key, and only its commitment enters the state tree. A transaction spends up to two notes, creates up to two and names the commitments it spends, since the circuits use no nullifiers. Payy's node serves every block with its proofs. Ethereum receives only state roots, deposits and withdrawals.

### Flow

1. **Deposit.** The app gives each wallet one fixed deposit address. You send USDC there, and Payy's relayer moves it into the RollupV1 contract with your signed authorization. Deposit address and amount are public.
2. **Send.** Your phone proves the transfer and submits it to Payy's node. The note reaches the recipient through Payy's registry, encrypted to the recipient's key, or as a payment link whose URL holds the note's secret.
3. **Withdraw.** You burn notes to an Ethereum address, which the next state update pays out. A whitelisted account may pay at once and get refunded at settlement. Recipient and amount are public. Card top-ups are withdrawals to the card issuer's contract.

### Keys

The app is closed source, so how it creates and backs up keys is unverified. Payy's backend keeps wallet backups, and its diagnostics reports have a required field for the recovery phrase.

### App

The ratings assume the Payy mobile app, which is closed source and talks only to Payy's servers. The [repository](https://github.com/polybase/payy) publishes the contracts, circuits, node and backend interfaces. Its open TypeScript client knows only Payy's testnet.

### Compliance

KYC is required for the Payy card and fiat ramps, not for transfers. Payy's backend can block a wallet or an IP address from its services, and its validator can refuse any transaction. The protocol has no view key.

### Fees

The RollupV1 contract charges no fee. Payy pays the gas of deposits and settlement.
