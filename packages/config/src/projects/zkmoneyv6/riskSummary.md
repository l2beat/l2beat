## Funds can be stolen if
1. Aztec's private execution or refund proof is unsound and the enclave layer also fails.
2. malicious wallet code obtains a harmful signature, or substituted unsigned contract lists redirect future deposits and payments.
3. Aztec Labs' deployer EOA blesses malicious code for future deposit addresses or redirects future payments to names (see [upgrades and governance](#upgrades-and-governance)).
4. a malicious sUSDS token upgrade confiscates escrowed shares (see [upgrades and governance](#upgrades-and-governance)).
<br>
## Funds can be lost if
1. a user loses their passkey.
2. all registered signers stop serving, since nobody else can obtain the approved enclave image.
3. resolver screening blocks an external payment and the recipient lacks the tooling to re-derive its deposit address.
<br>
## Privacy can be lost if
1. a user pays a new contact, whose handshake reveals the recipient (see public observer).
2. a user's payments hide only among zk.money's users on Aztec (see chain analyst).
3. the unpublished enclave image keeps or leaks what it reads, or AWS Nitro is compromised (see privileged insider).
4. the resolver operator links deposits paid through a name to their recipients (see privileged insider).
5. the default endpoints, Alchemy and Aztec Labs' Aztec nodes, see deposit addresses and withdrawals in one session (see network observer and privileged insider).
6. a portal freezes, and refunds publish note or deposit amounts on Ethereum.
7. elliptic-curve cryptography is broken, which decrypts data published to Ethereum (see future adversary).
