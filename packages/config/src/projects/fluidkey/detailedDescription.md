Fluidkey is a wallet that gives you a fresh receiving address for every payment and shows them all as one account. Payers use your name, like l2beat.fkey.eth, and each lookup returns a new address. Outsiders see separate payments, while Fluidkey sees all of them.

Users trust Fluidkey, which holds a key that sees all your addresses, runs the closed-source app and submits every send. If you sign in with Google or Apple on the web, Privy also takes part in creating your keys. Your funds sit in Safes that only you control, and an open recovery app withdraws them without Fluidkey.

### Keys

Your keys come from a wallet signature and a four-digit PIN. On the web, that wallet is usually a Privy wallet behind your Google or Apple login. Privy's code creates the signature, and Privy holds part of the wallet's key. You can connect your own wallet instead, and the mobile apps create keys on your device. Fluidkey gets a viewing key that shows all your addresses, while only you can spend.

### Flow

1. **Request an address.** The app, the API or a lookup of your name asks Fluidkey for a new address. For name lookups, Fluidkey's server signs the answer, so a payer has to trust that the address is yours.
2. **Receive.** Each address is a new Safe controlled by a one-time key that only you can derive. It can receive funds before the Safe is deployed.
3. **Send.** Fluidkey picks Safes with enough balance and prepares the transactions, your app signs them, and Fluidkey submits them. A send that spends from several Safes shows onchain that they belong together.

### App

The web and mobile apps are closed source. The web app reads the chain only through Fluidkey's servers. Outside services see your login (Privy), your username (Intercom, for support) and app errors (Sentry). Banking and identity checks use Noah, Bridge, Persona and Sumsub. For recovery, two open tools work without the app: the [stealth account kit](https://github.com/fluidkey/fluidkey-stealth-account-kit) creates addresses, and the [recovery app](https://github.com/fluidkey/sara) finds and withdraws your funds through any RPC.

### Special features

With auto-earn on, Fluidkey deposits incoming tokens into yield vaults without asking you each time. Fluidkey's multisig decides which vaults are offered, and your Safe switches to a new set only when you choose. You can turn auto-earn off, while money already deposited keeps the vaults' risks and withdrawal limits.

Fluidkey computes a score for each account, partly from its balance. When you claim it in the app, a token on Base that cannot be transferred goes to a separate stealth address of your account. That address holds nothing else, but it shows publicly that someone uses Fluidkey.

### Compliance

Bank transfers through Noah need identity verification. Hide Trail, an optional route for more privacy, sends funds through Houdini and two exchanges, which see the route and can hold the funds.

### Fees

Auto-earn is free. Sends are free for 20 transactions a day on every chain but Ethereum, where gas is paid in ETH or a supported token. Bank transfers are free up to 20,000 USD or EUR a month, then cost 0.6% in and 0.25% out, per the [docs](https://docs.fluidkey.com/readme/bank).
