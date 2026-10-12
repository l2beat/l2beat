## Funds can be stolen if
1. a swap service does not pay out.
2. a service's hot wallet is compromised during the trade.
<br>
## Funds can be frozen if
1. a service holds the deposit pending identity verification.
2. a service refunds minus fees and blacklists the deposit address.
<br>
## Privacy can be lost if
1. a service holds a leg until the user identifies, since identities on both legs link them (see privileged insider).
2. one party holds the records of both legs, such as one service used twice, and finds its payout output in the rings behind the exit (see privileged insider).
3. swap APIs, Blink, Etherscan, Moralis, RPC and Monero node link your identity. Tor is off by default and not circuit-isolated (see network observer).
4. elliptic-curve cryptography is broken, which reveals the real spend in every ring (see future adversary).
