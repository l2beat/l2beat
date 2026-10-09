## Funds can be stolen if
1. the closed-source app is malicious or compromised and exfiltrates spending keys.
2. the accepted ENS signer returns an attacker-controlled payment address for a Cloaked name.
<br>
## Funds can be lost if
1. a user loses the passkey and encrypted backup, or the wallet and PIN, needed to re-derive the spending key.
2. the service and the app derive different address data and a payment reaches an address whose key the user cannot recreate.
<br>
## Privacy can be lost if
1. Cloaked, or anyone who obtains its records now or later, uses the viewing keys to link every account's addresses (see privileged insider and future adversary).
2. Cloaked's relayers and fee Safe mark every spend, so an address hides only among Cloaked's few users (see chain analyst).
3. Cloaked changes its closed-source app to send account data to third parties, which users cannot check (see network observer).
4. a user relies on the Incognito balance, whose relay keeps the link between deposit and withdrawal (see privileged insider).
