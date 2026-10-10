## Funds can be stolen if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. the Entrypoint owner deploys a malicious [upgrade](#upgrades-and-governance) that steals new deposits or relayed withdrawals.
<br>
## Funds can be lost if
1. a user loses the recovery phrase that their notes derive from.
<br>
## Privacy can be lost if
1. the ASP leaves deposits out of its latest list, which blocks their private exit, up to halting all private withdrawals (see privileged insider).
2. the ASP keeps only a few deposits in its latest list, so withdrawals proven against it point to one of them (see privileged insider).
3. both relayers the website offers refuse a withdrawal, so the user must self-relay from a wallet or find a relayer outside the website (see chain analyst).
4. a user withdraws signed in with a wallet on the default RPC, since Alchemy then sees the wallet and the polling for the withdrawal, which ties the two by timing (see network observer).
