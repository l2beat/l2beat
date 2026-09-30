## Funds can be stolen if
1. private execution on Aztec or the zk.money token contract is unsound and the TEE layer also fails through an enclave flaw or compromised AWS Nitro attestation.
2. after a freeze, a refund circuit is unsound and the TEE layer fails at the same time.
3. a malicious web wallet or desktop release makes users sign a harmful operation.
4. the NameRegistry owner or owner of zk.money in ENS redirects future payments to zk.money names.
<br>
## Funds can be lost if
1. no registered enclave is running and nobody starts the approved image on AWS.
2. a user loses their passkey, required for spending and recovering stuck deposits.
3. resolver screening blocks an external payment to a zk.money name. The wallet never learns the deposit address, so recovery needs the recipient's own tooling.
<br>
## Privacy can be lost if
1. an enclave or AWS Nitro attestation is compromised, exposing operations received in plaintext.
2. the resolver operator re-derives deposit addresses and links deposits to recipients.
3. the first external payment to a tag publicly links the payment to that tag.
4. an external Aztec RPC learns the account from note requests, or zk.money and Predicate correlate screened deposit and withdrawal addresses by IP.
5. someone reads keys and decrypted notes stored unencrypted on the user's device.
6. a freeze forces users to exit through refunds, which pay out fixed note and deposit amounts on Ethereum and use proofs without zero-knowledge.
7. a quantum computer breaks the elliptic-curve encryption of the notes published to Ethereum.
