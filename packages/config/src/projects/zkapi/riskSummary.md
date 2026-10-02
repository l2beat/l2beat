## Funds can be stolen if

1. the owner pauses new withdrawals until notes expire and directs the permissionless sweep proceeds to a treasury it controls.
2. someone uses retained single-party setup secrets or a circuit/verifier flaw to forge a withdrawal proof.
3. malicious wallet code obtains note secrets or redirects future deposits and payout instructions.

<br>

## Funds can be lost or frozen if

1. the user loses the note secret, signed state or pending-request recovery journal.
2. a submitted request proof prevents recovery from the same state while the operator withholds a successor signature. The challenge needs no evidence that service was accepted or delivered.
3. an active note expires and anyone sweeps its entire remaining deposit to the treasury.
4. the owner pauses cooperative closes and new escapes, or a payout destination or treasury rejects ETH transfers.
5. the operator loses a pinned signing key. This vault has no key-rotation mechanism.

<br>

## Privacy can be lost if

1. the indexer correlates the desktop companion's note-id path queries with API authorization traffic.
2. direct connections, timing, request budgets or a unique eligible deposit identify the funding account.
3. the provider or credential issuer links requests through the issued API key, which the desktop can reuse across chats by default.
4. identifying prompts, responses or retained service logs expose the user.
5. a withdrawal challenge publishes a request proof and links its nullifier to the original note.
6. hosted wallet code or another process obtains locally stored note secrets and recovery data.

Deposits and withdrawals are always publicly linked by note id. Their amounts, payout address and total consumption are public when a note closes.
