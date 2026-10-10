## Funds can be stolen if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. the Entrypoint owner deploys a malicious [upgrade](#upgrades-and-governance) that steals new deposits or withdrawals relayed after it.
<br>
## Funds can be lost if
1. a user loses the recovery phrase that their notes derive from.
<br>
## Privacy can be lost if
1. the ASP leaves deposits out of its latest list, which blocks their private exit, up to halting all private withdrawals (see privileged insider).
2. the ASP keeps only a few deposits in its latest list, so withdrawals proven against it point to one of them (see privileged insider).
3. both relayers on the website refuse a withdrawal, so the user must self-relay or find a relayer elsewhere (see chain analyst).
4. a user withdraws signed in with a wallet on the default RPC, so Alchemy ties the wallet to the withdrawal by timing (see network observer).
