Aztec Network's v6 rollup and zk.money's portals, enclave registry and payout contracts are immutable.

### Enclave signers and freeze

Anyone can register a signer with an AWS Nitro attestation of the approved image up to {{attestationMaxAge}} old. Both portals share {{teeSignerCount}} signers. If [Aztec governance](https://stake.aztec.network/governance) makes another rollup canonical, anyone can freeze the portals for good, leaving only refunds.

### Deposit addresses and names

One Aztec Labs EOA owns the SIPAFactory, the ForwardingTable, the NameRegistry and zk.money in ENS. It can bless new code for future deposit addresses, which can redirect them, and reassign names. The DNS holder can reclaim zk.money in ENS. A second EOA authorizes name claims.

### Savings asset

[Sky governance](https://vote.sky.money/) can upgrade sUSDS and change its savings rate.
