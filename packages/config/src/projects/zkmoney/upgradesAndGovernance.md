Aztec Network's rollup and zk.money's portals and payout contracts are immutable.

### Enclave signers and freeze

Anyone can register a signer with an AWS Nitro attestation up to {{attestationMaxAge}} old. DAI has {{teeSignerCount}} registered signers, and sUSDS has {{susdsTeeSignerCount}}. Both portals are frozen permanently, and no party can undo the freeze.

### Names and services

Two Aztec Labs EOAs control *.zk.money names. The deployer owns the NameRegistry and can replace its registration, metadata and resolver contracts, which lets it reassign names and redirect future payments. It also owns zk.money in ENS, which the DNS holder can reclaim. The domain owner can refuse claims, sign custom fees and add permanent fee beneficiaries, which users pick from in their registration intent. Aztec Labs also controls the hosted wallet, the desktop releases and the two unsigned contract lists both wallets currently use.

### Savings asset

[Sky governance](https://vote.sky.money/) can upgrade sUSDS, changing balances and transfer rules. Its authorized rate controller can change the savings rate.
