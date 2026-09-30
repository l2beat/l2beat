### Immutable
No zk.money contract on Ethereum or Aztec can be upgraded. The contracts that hold and move funds also have no owner: the ZkMoneyPortal (its owner is renounced), the zk.money token and fee-paying contracts on Aztec, the verifiers, the withdrawal executors and the deposit address code of the current portal. Money sent to a deposit address can only end up in the portal or back with its recipient.

The approved enclave image is fixed. Anyone can register a TEE signer with a fresh (at most {{attestationMaxAge}} old) AWS Nitro attestation of that image. Registrations are permanent. {{teeSignerCount}} signers are currently registered.

Aztec governance can move the Aztec Network to a new rollup. In such a case, anyone can permanently freeze the portal, stopping new L1 deposits and fixing a state snapshot at the last proven checkpoint. Withdrawals within the frozen checkpoint and epoch bounds remain available. L2 transfers are not disabled but do not change refundable ownership.

### Changeable by Aztec Labs
The name layer is configured by two EOAs:

- The deployer EOA owns the NameRegistry and can replace the RegistrationController, the AccountMetadataRegistry and the Resolver. This lets it reassign names, rewrite user records and redirect where future payments to zk.money names resolve. It also owns zk.money in ENS, which the holder of the zk.money DNS domain can reclaim, and the SIPAFactory, where it can only still set the code for metadata updates, which zk.money does not use yet.
- The domain owner EOA must sign every name claim, so it can refuse any name. It also sets custom registration fees and who receives them.

### Offchain
Aztec Labs runs the relayer, the resolver service, the claim server, the enclave hosts, auth.zk.money, the two unsigned contract lists and the hosted wallet, and publishes the desktop releases. The hosted wallet and the desktop releases are trusted with the users' keys, the other services decide liveness and censorship.
