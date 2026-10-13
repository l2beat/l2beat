## Funds can be stolen if

1. the owner pauses withdrawals until notes expire and anyone sweeps them to its treasury.
2. the single-party setup secrets or a circuit flaw allow forged withdrawal proofs.
3. malicious wallet code reads the note secret.

<br>

## Funds can be lost or frozen if

1. the note secret or the latest signed balance is lost.
2. a note expires before withdrawal.
3. the operator withholds a signed balance and cancels the escape with the request it received.

<br>

## Privacy can be lost if

1. the operator matches a deposit to its requests by timing, which few active notes make easy (see privileged insider).
2. a daemon user reveals the note id to the operator's indexer before each request (see privileged insider).
3. prompts identify the user to OpenRouter or the model provider (see privileged insider).
4. the operator keeps request transcripts and indexer logs, which later tie requests to deposits (see future adversary).
