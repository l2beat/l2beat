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

1. a user pays a new contact, which reveals the recipient, or makes their first sponsored transaction after registration, which is tied to their account (see public observer).
2. the resolver operator derives the wallets' deposit addresses and links L1 deposits to L2 recipients (see privileged insider).
3. an enclave or AWS Nitro is compromised (see privileged insider).
4. the portal freezes and users exit through refunds, which publish note or deposit amounts on Ethereum.
5. elliptic-curve cryptography is broken, which decrypts data published to Ethereum (see future adversary).
