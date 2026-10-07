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

1. the operator matches a deposit to its first requests by timing or note id (see privileged insider).
2. prompts identify you to the provider.
3. you deposit and request from the same IP without Tor (see network observer).
