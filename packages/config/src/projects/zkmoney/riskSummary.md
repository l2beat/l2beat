## Funds can be stolen if

1. Aztec's private execution or refund proof is unsound and the enclave layer also fails.
2. malicious wallet code obtains a harmful signature, or substituted unsigned contract lists redirect future deposits and payments.
3. the NameRegistry owner or owner of zk.money in ENS redirects future payments to names.

<br>

## Funds can be lost if

1. a user loses their passkey.
2. every AWS-attested enclave stops running.
3. resolver screening blocks an external payment and the recipient lacks the tooling to re-derive its deposit address.

<br>

## Privacy can be lost if

1. a user pays a new contact, whose handshake reveals the recipient (see public observer).
2. the resolver operator links L1 deposits to L2 recipients, or an enclave or AWS Nitro is compromised (see privileged insider).
3. anyone on the user's network path times their Aztec transactions, since Desktop has no Tor or proxy setting (see network observer).
4. the portal freezes, and refunds publish note or deposit amounts on Ethereum.
5. elliptic-curve cryptography is broken, which decrypts data published to Ethereum (see future adversary).
