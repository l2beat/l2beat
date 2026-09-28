Monero via Cake Wallet can be abstracted as a privacy pool with Ethereum as its base: a centralized swap service takes Ethereum assets and pays out XMR into Monero. To come back, XMR goes to a swap service that pays out to any Ethereum address. [Cake Wallet](https://cakewallet.com), a self-custodial multi-currency wallet, holds both wallets and embeds both legs. No Ethereum contract is involved. The service is a custodian for the duration of each swap.

### Flow

1. **Quote.** EVM asset to XMR: the app polls every enabled service every ten seconds and takes the best rate unless the user forces one.
2. **Ethereum to the service.** The app sends amount, Monero payout address, the Ethereum wallet address as refund address, and Cake's API key or markup. The service returns a deposit address it controls. The deposit is a plain, public transfer from the user's wallet, sent first to the Blink Labs private mempool (on by default), then to the RPC.
3. **Into Monero.** The service sends XMR to the payout address. The transaction hides sender, recipient and amount. The app polls the trade status every twenty seconds, then every five minutes for a day.
4. **Inside Monero.** Spends hide among 16 ring members. Outputs unlock after ten blocks.
5. **Back to Ethereum.** From the Monero wallet the user picks XMR to the Ethereum asset. The app sends a fresh subaddress as refund address and the Ethereum exit address, receives a Monero deposit address from the service and pays it from the Monero wallet. The service pays the Ethereum address from its hot wallet. The exit picker offers each in-app EVM wallet's single address or a pasted one.

### Privacy considerations

Both Ethereum legs are public. The entry service knows everything about its leg: addresses, amounts, IP and Cake as the integrator. The exit service knows the Ethereum exit address, amount and IP, but not where the XMR came from: Monero hides the sender, and the refund address Cake sends is a fresh subaddress that cannot be linked to the rest of the wallet. The only privacy is that Monero breaks the public link between the XMR paid out in step 3 and deposited in step 5.

Client defaults weaken this. An EVM wallet in Cake has one address: it is sent as refund address on entry, and exiting to the same wallet pays the very address that deposited, so entry and exit are publicly linked unless the exit goes to a new in-app wallet from a fresh seed. On entry, picking an in-app Monero wallet pays to its primary address every time, since the fresh-subaddress routine only serves the currently open wallet. Built-in Tor is off by default, so swap APIs, Blink, Etherscan, Moralis, the RPC and Cake's price API see the user's IP. With Tor on, one SOCKS port without isolation lets calls within ten minutes share a circuit. Legs in separate app sessions days apart are unlinkable by any network observer. One service, or Trocador, on both legs holds the full round trip. Two services can still find it: rings are public, so the entry service can scan for spends of its own payout output, and a shared screening vendor joins that to the exit. "Tor only" swap mode leaves only Trocador, the one provider with an onion endpoint.

### Custody, fees and compliance

Both legs are transfers to and from exchange-controlled wallets. No multisig, proof or timelock exists. ChangeNOW documents automated holds, ID and source-of-funds checks through SumSub, refunds minus fees and blacklisting. Trocador grades partners A to D by KYC risk. kycnot.me quotes a grade C partner as one that refunds failed AML checks unless its liquidity provider blocks funds "until KYC/SoF verification is passed". Cake ships a markup or affiliate parameter with every provider as a build secret, so the fee cannot be verified from source. Cake Labs holds no keys and proxies nothing.

### Anonymity set

Monero's output set. Nothing on Monero narrows it, but entry and exit amounts are public on Ethereum and each service knows both ends of its leg, so the effective set is the entries that could match an exit in amount and time and that no service ties together.
