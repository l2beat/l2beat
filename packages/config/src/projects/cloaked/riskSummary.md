## Funds can be stolen if
1. a user relies on the hosted wallet and it is malicious or compromised and exfiltrates derived spending keys. The production wallet is closed source and has no published reproducible build, so users cannot inspect its source or verify the code being served.
2. the accepted ENS signer returns an attacker-controlled payment address for a Cloaked name. The resolver authenticates the answer but does not prove that the intended recipient controls it.
<br>
## Funds can be lost if
1. a user loses the passkey and encrypted backup, or the wallet and PIN, needed to re-derive their private spending keys.
2. the service and client derive different address data and a payment is sent to an address for which the user cannot recreate the private key.
<br>
## Privacy can be lost if
1. Cloaked, or an attacker who obtains its viewing data, uses the service's viewing capability and index to link an account's stealth addresses and onchain activity.
2. spending from several stealth addresses together, reusing destinations, or recognizable timing and amounts links otherwise separate payments onchain.
3. a user relies on the Incognito balance, because Cloaked's relay observes the association between Privacy Pools deposits and withdrawals even though it is hidden from public onchain observers.
