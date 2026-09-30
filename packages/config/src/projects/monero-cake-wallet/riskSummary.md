## Funds can be stolen if
1. a swap service does not pay out.
2. a service's hot wallet is compromised during the trade.
<br>
## Funds can be frozen if
1. a service holds the deposit pending identity verification.
2. a service refunds minus fees and blacklists the deposit address.
<br>
## Privacy can be lost if
1. one party sees both legs: one service, Trocador or a vendor the services share. It finds its own payout output in the rings behind the exit transaction, and self-transfers in between only widen that search.
2. the exit is paid to the same Ethereum wallet that deposited, since an EVM wallet in Cake has only one address.
3. the XMR is swapped back in a matching amount and time.
4. the same Monero payout address is reused on entry, the default for an in-app receiver.
5. swap APIs, Blink, Etherscan, Moralis, RPC and Monero node see the same IP. Tor is off by default and not circuit-isolated.
6. elliptic-curve cryptography is broken, which reveals the real spend in every ring.
