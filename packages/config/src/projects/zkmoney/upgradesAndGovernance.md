The core smart contracts of Aztec Network and zk.money are immutable.

### Enclave signers and freeze

Anyone can permanently register an enclave signer with an AWS Nitro attestation up to {{attestationMaxAge}} old, and {{teeSignerCount}} are registered. If Aztec governance changes its canonical rollup, anyone can freeze the portal for good, which stops deposits and enables refunds at the last proven checkpoint.

### Names and services

Two Aztec Labs EOAs control *.zk.money names. The deployer owns the NameRegistry and can replace its registration, metadata and resolver contracts, which lets it reassign names and redirect future payments. It also owns zk.money in ENS, which the DNS holder can reclaim. The domain owner can refuse claims, sign custom fees and add permanent fee beneficiaries, which users pick from in their registration intent. Aztec Labs also controls the hosted wallet, the desktop releases and the two unsigned contract lists both wallets currently use.
