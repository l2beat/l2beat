Cake Wallet lets users move funds out of one Ethereum address and into a new one through Monero, which hides the path between them. Its swap screen sends the funds to an exchange service that pays out XMR. A second swap later turns the XMR back into an Ethereum asset. Both Ethereum transfers are public.

Users trust the swap services, which hold the funds during each swap, and Cake Labs, which ships the wallet and picks the services. A service can hold a deposit until the user passes identity checks, and a party holding the records of both legs can link them. Funds in transit sit with the service, so leaving depends on its payout or refund.

### Flow

1. **Quote.** EVM asset to XMR: the app polls every enabled service and takes the best rate unless the user picks one.
2. **Ethereum to the service.** The app sends the amount, the Monero payout address and Cake's API key, for some providers with a markup. The Ethereum wallet address goes along as refund address. The service returns a deposit address it controls. The deposit is a plain, public transfer from the user's wallet. It goes first to the Blink Labs private mempool, on by default, then to the RPC.
3. **Into Monero.** The service sends XMR to the payout address. The transaction hides sender, recipient and amount.
4. **Inside Monero.** The user can self-transfer the XMR any number of times. Outputs unlock after ten blocks.
5. **Back to Ethereum.** From the Monero wallet the user picks XMR to the Ethereum asset. The app sends the Ethereum exit address and, as refund address, a subaddress not yet used for a swap. The service returns a Monero deposit address, the wallet pays it, and the service pays the exit address from its hot wallet.

### Architecture and Privacy

Monero hides which output a transaction spends with ring signatures: each input names 16 outputs, the real one and 15 decoys the wallet picks, and proves that one of them is spent. The rings stay public forever. This protects against observers who see only the chain.

Each service sees its whole leg. The entry service always knows the output it paid, because it created it. The exit service receives the Monero transaction and sees its rings. A party holding both legs therefore finds its payout output in the rings behind the exit. If all of the XMR is paid back, the received amount also matches the payout minus the public fee. Self-transfers in between only widen the search, by about 30 times per transaction. The swap screen lets the user pick a different exchange for each leg.

Shielded pools such as Tornado Cash, Privacy Pools or Zcash's shielded pool prove membership in the whole pool. A withdrawal there hides among all deposits, even from a party that knows one of them.

An EVM wallet in Cake has one address. It is sent as refund address on entry, and an exit to the same wallet pays the very address that deposited. On entry, picking an in-app Monero wallet pays to its primary address every time, so a service can tie a user's entries together.

[Built-in Tor](https://docs.cakewallet.com/features/privacy-and-security/built-in-tor) is off by default. Without it, the swap services, Blink, Etherscan, the nodes, Cake's price API and Moralis see the user's IP. Moralis receives every Ethereum wallet the app opens, and the app offers no switch for it. With Tor on, every call shares one circuit for up to ten minutes, so each leg needs its own app session. Keeping both Ethereum wallets in the app links them for Moralis whenever both are opened close together.

### Custody, fees and compliance

Services can freeze a deposit automatically and hold it for identity and compliance checks, as [ChangeNOW documents](https://changenow.io/faq/kyc-aml). Cake ships its API keys, and for some providers a markup, as build secrets, so its share of the fee is set outside the source. Cake Labs holds no user funds, and the app talks to each service directly.
