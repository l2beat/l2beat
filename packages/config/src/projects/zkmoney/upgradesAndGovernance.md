### Immutable
The zk.money contracts on Ethereum and Aztec cannot be upgraded. The portal, token, fee-paying contract, verifiers, withdrawal executors and current deposit address code also have no owner. Deposit addresses can send funds only to the portal or back to their recipient.

The approved enclave image is fixed. Anyone can permanently register a TEE signer with an AWS Nitro attestation of that image, at most {{attestationMaxAge}} old. {{teeSignerCount}} signers are registered.

If Aztec governance moves the network to a new rollup, anyone can permanently freeze the portal. This stops L1 deposits and fixes the refund snapshot at the last proven checkpoint. Withdrawals within the frozen checkpoint and epoch bounds remain available. Later L2 transfers do not change refundable ownership.

### Changeable by Aztec Labs
Two EOAs control the name layer:

- The deployer owns the NameRegistry and can replace the RegistrationController, AccountMetadataRegistry and Resolver, allowing it to reassign names, rewrite records and redirect future payments. It also owns zk.money in ENS, which the DNS domain holder can reclaim, and the SIPAFactory, whose remaining power is to set currently unused metadata update code.
- The domain owner can refuse name claims, set custom registration fees and choose fee recipients.

### Offchain
Aztec Labs runs the relayer, resolver, claim server, enclave hosts, auth.zk.money, contract lists and hosted wallet, and publishes desktop releases. Wallet code is trusted with users' keys. The services control availability and censorship.
