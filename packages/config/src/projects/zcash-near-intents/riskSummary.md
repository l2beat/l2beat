## Funds can be stolen if
1. the custodial bridge operator's single mint key or its Ethereum treasury key is compromised.
2. 4/5 NEAR Intents DAO council members upgrade the Verifier maliciously.
3. 2/5 Rainbow Bridge DAO council members upgrade the Zcash connector, its token or the light client maliciously.
4. 9/15 NEAR MPC nodes collude to sign Zcash transactions from bridge addresses.
<br>
## Funds can be frozen if
1. the DAO or one of the two single-key account lockers freezes the user's account in the Verifier.
2. the custodial bridge operator freezes a deposit or withdrawal for a compliance review.
3. the whitelisted relayers stop proving Zcash deposits or triggering Zcash withdrawals.
<br>
## Privacy can be lost if
1. the ZEC is swapped back in an amount and at a time that matches the payout; both are public at the edge of the shielded pool.
2. the same Zcash address receives more than one payout, since every payout note is decryptable by anyone.
3. the operator or its screening vendors join the two legs through IP address, session or partner key. Tor is off by default in Zodl.
4. the lightwalletd server links the wallet's fetch of the payout transaction with its later broadcast of the exit.
5. elliptic-curve cryptography is broken: all of an account's addresses share one incoming viewing key, and the addresses are public.
