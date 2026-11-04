Fluidkey is a wallet that gives the user a fresh receiving address for every payment and shows them all as one account. Payers use the user's name, like l2beat.fkey.eth, and each lookup returns a new address. Outsiders see separate payments, while Fluidkey sees all of them.

The user trusts Fluidkey, which holds a key that sees all their addresses, runs the closed-source app and submits every send. If the user signs in with Google, Apple, email or Farcaster on the web, Privy also takes part in creating their keys. The user's funds sit in Safes that only they control, and an open recovery app withdraws them without Fluidkey.

### Flow

1. **Request an address.** The app, the API or a lookup of your name asks Fluidkey for a new address. For name lookups, Fluidkey's server signs the answer, so a payer has to trust that the address is yours.
2. **Receive.** Each address is a new Safe controlled by a one-time key that only you can derive. It receives funds before it is deployed.
3. **Send.** Fluidkey picks Safes with enough balance, your app signs the transfers, and Fluidkey submits them. While open, the app also signs any transfer Fluidkey's server marks as approved, without asking. Spending from several Safes at once links them onchain.

### Keys

The user's keys come from a wallet signature and a four-digit PIN. On the web, that wallet is a Privy wallet behind a Google, Apple, email or Farcaster login, unless the user connects their own. Privy's code creates the signature, and Privy holds part of the wallet's key. The mobile apps create keys on the device instead. Fluidkey gets a viewing key that shows all the user's addresses, while only the user can spend.

### App

Fluidkey also offers a closed mobile app, whose code updates from Expo between store releases. The web app reads the chain through Fluidkey's proxy to Alchemy. Over Tor, its 20 MB of code can take minutes to load. Outside services see a Google, Apple, email or Farcaster login (Privy), the username (Plausible, and Intercom for support) and app errors (Sentry). Banking and identity checks use Noah, Bridge, Persona and Sumsub. For recovery, two open tools work without the app: the [stealth account kit](https://github.com/fluidkey/fluidkey-stealth-account-kit) creates addresses, and the [recovery app](https://github.com/fluidkey/sara) finds and deploys the user's Safes. Eternal Safe (eternalsafe.eth) then withdraws the funds. The recovery app sends each deployment from the wallet that created the user's keys, which links the two onchain.

### Auto-earn

With auto-earn on, Fluidkey deposits incoming tokens into yield vaults without repeated user approval. Fluidkey's multisig decides which vaults are offered, and the user's Safe switches to a new set only when they choose. The user can turn auto-earn off, while money already deposited keeps the vaults' risks and withdrawal limits.

### Score

Fluidkey computes a score for each account, partly from its balance. When the user claims it in the app, a token on Base that cannot be transferred goes to a separate stealth address of their account. That address holds nothing else, but it shows publicly that someone uses Fluidkey.

### Compliance

Bank transfers through Noah need identity verification. Hide Trail, an optional route for more privacy, sends funds through Houdini and two exchanges, which see the route and can hold the funds.

### Fees

Sends are free for 20 transactions a day on every chain but Ethereum, where gas is paid in ETH or a supported token. Auto-earn is free, except for USDC on Base in the Yield profile, where a Morpho fee wrapper takes 1% APY. Bank transfers pay no volume fee up to 3,000 USD a month, or 20,000 USD from a score of 10,000. Beyond that the volume fee is 0.10% to 0.30%, depending on the average balance. SWIFT and Fedwire transfers also cost 25 USD each, with one or more free a month from a 50,000 USD average balance, per the [docs](https://docs.fluidkey.com/readme/bank).
