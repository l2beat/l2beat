The ZkMoneyPortal, the zk.money token contract on Aztec and the fee-paying contract are immutable.

Anyone can register a TEE signer with a fresh (at most {{attestationMaxAge}} old) AWS Nitro attestation of the approved image. Registrations are permanent. {{teeSignerCount}} signers are currently registered.

Aztec governance can move the Aztec Network to a new rollup. This does not touch escrowed funds, but it lets anyone freeze the portal, after which funds can only exit.

The naming and deposit address layer is controlled by a single deployer EOA:

- It owns the NameRegistry and can replace the RegistrationController and the AccountMetadataRegistry. This lets it reassign names and redirect where future payments to zk.money names resolve.
- It owns zk.money in ENS and can replace the Resolver. Since zk.money is a DNS name, the holder of the DNS domain can also reclaim it.
- It owns the SIPAFactory, which sets the code of deposit addresses once per portal. For the current portal this code is permanent, so money already sent to a deposit address can only end up in the portal or back with its recipient. Only the code for metadata updates, which zk.money does not use yet, can still be set.

A separate domain owner EOA must sign every name claim, so it can refuse any name. It also sets custom registration fees.

Offchain, the wallet takes the contract addresses from two unsigned lists that Aztec Labs publishes (the zk.money config profile and the Oxide deployment manifest), and Aztec Labs controls the web wallet and the desktop app releases.
