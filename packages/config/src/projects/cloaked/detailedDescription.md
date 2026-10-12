Cloaked is a wallet that gives the user a fresh receiving address for every payment and shows them all as one account. Payers use the user's name, like ltwobeat.clkd.eth, and each lookup returns a new address. Outsiders see separate payments, while Cloaked sees all of them.

The user trusts Cloaked, which holds a key that sees all their addresses, runs the closed-source app and submits every send. The user's funds sit in addresses that only they control, and an open recovery tool exports their keys without Cloaked.

### Keys

The app creates the user's keys in their browser, from a passkey or a wallet signature and a four-digit PIN. Cloaked gets a viewing key that shows all the user's addresses, while only the user can spend.

### Flow

1. **Request an address.** The app, the API or a lookup of your name asks Cloaked for a new address. For name lookups, Cloaked's server signs the answer, so a payer has to trust that the address is yours.
2. **Receive.** Each address is a plain account that only your spending key can control.
3. **Send.** Cloaked picks addresses with enough balance and prepares the transaction, your app signs it, and Cloaked submits it. Change goes to a fresh address in the same transaction, and a send that uses several addresses shows onchain that they belong together.

### App

The web app at [app.clkd.xyz](https://app.clkd.xyz) and the browser extension are closed source. They read balances through Cloaked's servers, and wallet logins use WalletConnect. The open [recovery tool](https://github.com/cloakedxyz/clkd-recovery) recreates the user's address keys offline.

### Incognito

The Incognito balance moves funds through [Privacy Pools](/privacy/projects/privacy-pools). Cloaked submits both the deposit and the withdrawal, so it knows which belong together, and it keeps that record.

### Compliance

Cloaked uses the user's IP address for sanctions and geographic checks and can refuse quotes or relays, for example for tokenized stocks.

### Fees

Gas for each send comes out of the sent token, so no native balance is needed. Incognito withdrawals pay Cloaked's relay 0.1% for USDC, per its relayer API.
