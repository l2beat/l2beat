Monero via Cake Wallet can be abstracted as a privacy pool with Ethereum as its base: a centralized swap service takes Ethereum assets and pays out XMR into Monero. To come back, XMR goes to a swap service that pays out to any Ethereum address. Cake Wallet, a self-custodial multi-currency wallet, holds both wallets and embeds both swaps. No Ethereum contract is involved. The service is a custodian for the duration of each swap.

### Flow

1. **Quote.** EVM asset to XMR: the app polls every enabled service and takes the best rate unless the user forces one.
2. **Ethereum to the service.** The app sends amount, Monero payout address, the Ethereum wallet address as refund address, and Cake's API key, for some providers with a markup. The service returns a deposit address it controls. The deposit is a plain, public transfer from the user's wallet, sent first to the Blink Labs private mempool (on by default), then to the RPC.
3. **Into Monero.** The service sends XMR to the payout address. The transaction hides sender, recipient and amount.
4. **Inside Monero.** Every spend names 16 earlier outputs, the real one and 15 decoys picked by the wallet. Outputs unlock after ten blocks.
5. **Back to Ethereum.** From the Monero wallet the user picks XMR to the Ethereum asset. The app sends a subaddress not used for a swap before as refund address, and the Ethereum exit address, receives a Monero deposit address from the service and pays it from the Monero wallet. The service pays the Ethereum address from its hot wallet.

### Architecture

Monero hides which output a transaction spends with ring signatures: each input names 16 outputs and proves that one of them is spent, without saying which. The rings stay public forever. This works against observers who do not know where the coins came from. It fails against anyone who knows one of the outputs, because they only have to look for it in the rings behind a later transaction.

A privacy pool entry is always such a known output. Here the swap service creates the payout. With an onchain bridge as base, everyone would know it. The exit is known as well: the exit service receives the Monero transaction and sees its rings. So a party holding both legs, or a screening vendor both services use, finds its payout output in the ring of the exit transaction if the XMR is paid straight back, and the payout amount minus the public fee if all of it is paid. Self-transfers in between only widen the search, by about 30 times per transaction. Over the week to block 3,772,293 (September 2026), a service creating one in a hundred Monero outputs is left with about 6 candidates after one self-transfer and about 180 after two, before it uses amounts, timing, IP or Cake's API key.

Shielded pools such as Tornado Cash, Privacy Pools or Zcash's shielded pool prove membership in the whole pool without naming any deposit, so a party that knows a deposit, but not its secret, cannot find the withdrawal onchain.

### Privacy considerations

Both Ethereum legs are public. The entry service knows everything about its leg: addresses, amounts, IP and Cake as the integrator. The exit service knows the Ethereum exit address, amount and IP.

Client defaults weaken this. An EVM wallet in Cake has one address: it is sent as refund address on entry, and exiting to the same wallet pays the very address that deposited, so entry and exit are publicly linked unless the exit goes to a new in-app wallet from a fresh seed. On entry, picking an in-app Monero wallet pays to its primary address every time. Built-in Tor is off by default, so swap APIs, Blink, Etherscan, the RPC, Cake's price API and Moralis, which cannot be switched off, see the user's IP. With Tor on, all calls share one SOCKS port without isolation, so calls within ten minutes can share a circuit, and the Ethereum client only uses Tor after a restart.

### Custody, fees and compliance

Both legs are transfers to and from custodial exchange-controlled wallets. The centralized swap providers used by Cake can automatically freeze funds while in-flight and hold them for KYC and compliance checks, as documented in their terms of service. Cake ships its API keys, and for some providers a markup, as build secrets, so the fee cannot be verified from source. Cake Labs holds no keys and proxies nothing.

### Anonymity set

Each spend hides among its 16 ring members, and the rings behind them. Against a party that knows the entry output, the effective set is the number of its own payouts in those rings. Against everyone else, entry and exit amounts are public on Ethereum, so the set is the entries that could match an exit in amount and time.
