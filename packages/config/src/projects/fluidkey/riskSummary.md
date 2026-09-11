## Funds can be stolen if
1. a user relies on the hosted wallet and it is malicious or compromised and exfiltrates derived spending keys. The production wallet is closed source and has no published reproducible build, so users cannot inspect its source or verify the code being served.
2. an accepted ENS signer returns an attacker-controlled payment address for a Fluidkey name. The resolver authenticates the answer but does not prove that the intended recipient controls it.
3. the hosted service supplies malicious transaction data and the client signs it without independently checking the destination, amount, and calls being authorized.
<br>
## Funds can be lost if
1. a user loses the wallet, PIN, login, or backup needed to recover their private spending keys.
2. the service and client derive different address data or Safe initialization parameters and a payment is sent to an address that the user cannot recover.
3. an auto-earn vault loses funds or cannot honor withdrawals, or a service used by Hide Trail fails to return the funds routed through it.
<br>
## Privacy can be lost if
1. Fluidkey, or an attacker who obtains its viewing data, uses the service's viewing capability and index to link an account's stealth addresses and onchain activity.
2. spending from several stealth addresses together, reusing destinations, or recognizable timing and amounts links otherwise separate payments onchain.
3. a user relies on Hide Trail and the swap service or participating exchanges use their transfer records to link activity that is obscured from public onchain observers.
