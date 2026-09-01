## Funds can be stolen if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. the Entrypoint owner deploys a malicious [upgrade](#upgrades-and-governance) that steals new deposits.
<br>
## Funds can be lost if
1. a user loses the secret and nullifier required to spend their deposit.
<br>
## Privacy can be lost if
1. no relayer is available and the withdrawal must be submitted from an address that can be linked to the user.
2. the ASP manager refuses to whitelist a deposit, forcing the user to either wait or exit publicly through ragequit.
