## Funds can be stolen if
1. private execution on Aztec or the zk.money token contract is unsound and the TEE layer fails at the same time, through a flaw in the approved enclave image (which can never be replaced) or a break of AWS Nitro attestation.
2. after a freeze, a refund circuit is unsound and the TEE layer fails at the same time.
3. a malicious web wallet or desktop release makes users sign a harmful operation.
4. the owner of the NameRegistry or of zk.money in ENS redirects payments to zk.money names. This affects only payments made after the change.
<br>
## Funds can be lost if
1. no registered enclave is running and nobody runs and registers the published enclave image on AWS.
2. a user loses their passkey, which is the only way to spend and to recover stuck deposits.
<br>
## Privacy can be lost if
1. an enclave or AWS Nitro attestation is compromised, since enclaves receive every operation in plaintext.
2. the resolver operator (for name tags) re-derives deposit addresses, which ties every deposit to its recipient.
3. the first payment to a tag from outside zk.money is publicly tied to that tag
4. an Aztec node the user does not run (by default the one run by Aztec Labs) learns their account from its note requests, or zk.money and Predicate match the IP addresses under which a user's deposit wallet and withdrawal addresses were screened. Both the web wallet and zk.money Desktop can use a custom rpc.
5. anyone with access to the user's device reads the master key, which the wallet keeps unencrypted in the browser profile until sign-out.
6. a quantum computer breaks the elliptic-curve encryption of the notes published to Ethereum.
