## Funds can be stolen if
1. a swap service does not pay out.
2. a service's hot wallet is compromised during the trade.
<br>
## Funds can be frozen if
1. a service holds the deposit pending identity verification.
2. a service refunds minus fees and blacklists the deposit address.
<br>
## Privacy can be lost if
1. the exit is paid to the same Ethereum wallet that deposited, since an EVM wallet in Cake has only one address.
2. the XMR is swapped back in a matching amount and time.
3. one service runs both swap directions and there was no Monero transaction in between.
4. two services or a shared vendor join the entry payout output, whose spends are visible in public rings, to the exit.
5. the same Monero payout address is reused on entry, the default for an in-app receiver.
6. swap APIs, Blink, Etherscan, Moralis, RPC and Monero node see the same IP. Tor is off by default and not circuit-isolated.
7. elliptic-curve cryptography is broken. The payout address is known to the service.
