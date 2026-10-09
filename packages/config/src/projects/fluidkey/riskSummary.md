## Funds can be stolen if
1. the closed-source app is malicious or hacked and steals the user's spending keys.
2. Privy's code or key share is compromised, for accounts created with Google or Apple login on the web.
3. a Fluidkey signer returns an attacker's address when a payer looks up a Fluidkey name.
4. Fluidkey sends the app a malicious transaction and the user signs it without checking it.
<br>
## Funds can be lost if
1. a user loses the login, wallet, PIN or backup needed to recover the spending key.
2. Fluidkey's server gives out a wrong address, for example one built with a different Safe setup, and the user's keys cannot withdraw from it.
3. an auto-earn vault loses funds or blocks withdrawals, or a service used by Hide Trail keeps the funds.
<br>
## Privacy can be lost if
1. Fluidkey, or anyone who gets its records now or later, uses the viewing keys to link all Safes of every account (see privileged insider and future adversary).
2. Fluidkey changes its closed-source app to send account data to outside services, which users cannot check (see network observer).
3. a user takes Hide Trail and Houdini or the exchanges link the route from their records (see privileged insider).
