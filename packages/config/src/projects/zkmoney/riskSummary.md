## Funds can be stolen if

1. Aztec's private execution or refund proof is unsound and the enclave layer also fails.
2. malicious wallet code obtains a harmful signature, or substituted unsigned contract lists redirect future deposits and payments.
3. the NameRegistry owner or owner of zk.money in ENS redirects future payments to names.

<br>

## Funds can be lost if

1. a user loses their passkey.
2. no AWS-attested enclave is running.
3. resolver screening blocks an external payment. Funds remain recoverable, but the recipient needs their own tooling to re-derive the unannounced deposit address.

<br>

## Privacy can be lost if

1. a user pays a new contact. The handshake reveals the recipient's Aztec address, publicly linked to their name. The first sponsored transaction after registration also reveals the sender's account.
2. an enclave or AWS Nitro attestation is compromised.
3. the resolver operator re-derives deposit addresses and links deposits to recipients.
4. public deposits, withdrawals, registration and deposit-address reuse allow amount or timing correlation.
5. an external Aztec RPC learns the account from note requests, or zk.money and Predicate correlate screened addresses by IP.
6. someone reads keys and decrypted notes stored unencrypted on the device.
7. a freeze forces refunds, which expose note and deposit amounts on Ethereum and use proofs without zero knowledge.
8. a quantum computer breaks the elliptic-curve encryption of notes published to Ethereum.
