## Funds can be stolen if
1. the custodial bridge operator's mint key or its Ethereum treasury key is compromised.
2. the NEAR Intents multisig (3/5) upgrades the Verifier maliciously.
3. the Rainbow Bridge multisig (3/5) upgrades the Zcash connector, its token or the light client maliciously.
4. 11 of the 17 NEAR MPC nodes collude to sign Zcash transactions from bridge addresses.
<br>
## Funds can be frozen if
1. the NEAR Intents multisig or the single-key account locker freezes the user's account in the Verifier.
2. the custodial bridge operator holds a deposit or withdrawal for a compliance review.
3. the relayers stop and the Rainbow Bridge multisig rejects anyone who stakes to replace them.
<br>
## Privacy can be lost if
1. the operator, which custodies both legs, makes the release of either depend on who the user is (see privileged insider).
2. the lightwalletd server Zodl syncs from ties the payout and the exit to the account, since every sync sends the account's transparent addresses outside Tor (see network observer).
3. elliptic-curve cryptography is broken, which recovers each account's viewing key from its payout addresses on NEAR (see future adversary).
