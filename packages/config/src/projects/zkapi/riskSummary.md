## Funds can be stolen if

1. the owner blocks withdrawals before expiry and redirects the full expired deposits to its treasury.
2. retained setup secrets or a circuit/verifier flaw allow forged withdrawal proofs.
3. malicious wallet code steals note secrets or redirects payments.

<br>

## Funds can be lost or frozen if

1. note secrets, settlement state or operator signing keys are lost. The signing keys cannot rotate.
2. the operator withholds a successor signature after a request proof is submitted and used to challenge an escape.
3. active notes expire, withdrawals are paused or a destination/treasury rejects ETH.

<br>

## Privacy can be lost if

1. note-id queries, IPs, timing or budgets identify a deposit. Proxy fallback can expose IPs.
2. providers identify users from prompts or link requests sharing credentials. Verifier approval does not prove absence of provider logging.
3. challenges publish authorizations, linking their nullifiers to deposits.
4. hosted code or another process reads local secrets and chats.
