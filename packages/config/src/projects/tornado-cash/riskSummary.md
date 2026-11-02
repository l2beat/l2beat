## Funds can be stolen if
1. the zk proof system is broken, allowing invalid withdrawals.
2. all [trusted setup](#trusted-setups) participants collude or leak their secrets, allowing forged proofs.
3. TORN holders pin a malicious app or [upgrade](#upgrades-and-governance) the InstanceRegistry after {{upgradeDelay}}, stealing notes from app users or tokens approved to the router.
<br>
## Funds can be lost if
1. a user loses the note required to withdraw.
<br>
## Privacy can be lost if
1. elliptic-curve cryptography is broken, which lets an attacker test candidate deposits for each withdrawal and read notes backed up onchain (see future adversary).
