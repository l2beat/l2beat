Umbra Cash is a stealth-address protocol that lets anyone pay you at a fresh address, so the payment does not show you as its recipient. You register once, and payers find your keys in a public registry. Payer, amount and token stay public, and so does where the funds go next.

Users trust ScopeLift, which hosts the app, runs its indexer and relays token withdrawals. The contracts are immutable, and their owner can only set a fee on new payments. Leaving needs no one: ETH lands at the stealth address itself, and any account can relay a token withdrawal.

### Flow

1. **Register.** The app derives a spending and a viewing key from a wallet signature and publishes the public keys in the StealthKeyRegistry.
2. **Pay.** The payer's app derives a fresh stealth address from those keys and pays through the Umbra contract. ETH goes straight to the address, tokens wait in the contract. An event publishes the address with a secret only the viewing key decrypts.
3. **Scan.** The recipient's app fetches every payment since registration and decrypts each locally.
4. **Withdraw.** ETH leaves in a plain transfer that pays its own gas. Tokens leave through a relayer, which pays the gas for a fee against the recipient's signature.

### Privacy considerations

Umbra hides only who controls the stealth address, and every registrant is a candidate. Withdrawals and payment timing can narrow that set. The app warns before withdrawals to registered, named or otherwise known addresses. Onchain registrations are not mandatory but remove the need for an (often centralised) offchain protocol to exchange keys/addresses. **Compliance** runs in the app only: it refuses wallets, recipients and withdrawal addresses on its blocklist or Chainalysis's sanctions oracle, and hides payments from or to listed addresses.

### App

The app at [app.umbra.cash](https://app.umbra.cash) is built from public source, while its indexer and relayer API are closed. It finds payments through the indexer, relays token withdrawals through the API and checks every address it handles with its mainnet RPC, Alchemy. A local build can leave the indexer out and read everything from your own node. The [privacy policy](https://app.umbra.cash/privacy) keeps IP logs for up to 90 days.

### Fees

Each payment through the Umbra contract pays the owner's ETH toll, {{toll}} today. Token withdrawals through the relayer pay its fee in the withdrawn token, and ETH withdrawals pay only gas.
