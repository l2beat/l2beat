Fluidkey is a wallet service that separates incoming payments across fresh Ethereum addresses while presenting them as one account. Whether requested through an ENS name, the app, or the API, each receiving address is a Safe controlled by a private key that the recipient can derive locally.

### Stealth address generation

Under Fluidkey's published key model, the client deterministically derives separate viewing and spending keys from a wallet signature combined with a PIN. It shares a derived private viewing node and public spending key with Fluidkey so the service can generate and monitor payment addresses, but keeps the private spending key locally. Fluidkey also offers Privy embedded wallets on the web and device-generated keys on mobile. Recovery of those keys depends on the chosen login and backup method.

For each payment nonce, the service derives an ephemeral private key and combines it with the recipient's public spending key to generate a one-time signer address. The client can recreate the same ephemeral key and combine its public key with the private spending key to derive the private key controlling that signer. Under this model, only the client can derive the private key needed to sign for a correctly generated address.

The receiving address is a counterfactually predicted 1/1 Safe whose sole owner is the stealth signer. It can receive funds before the Safe contract is deployed. Its address depends on the Safe factory, singleton, proxy bytecode, owners, threshold, salt nonce, and initialization data. Recovery must reproduce the original parameters, including any auto-earn initialization, rather than just the user's current settings.

The derivation SDK and standalone recovery client are published. The recovery client can derive exportable stealth signer keys, predict receiving Safes, and deploy them without using the Fluidkey API.

The production web wallet itself is closed source, has no published reproducible build, and cannot be self-hosted. Users who rely on it must trust the remotely served application to preserve the client-side spending-key boundary. The API, ENS gateway, indexer, and relay are also hosted and closed source, so the complete wallet service cannot be self-hosted.

The hosted frontend is not required to hold or use spending keys. A locally run client can register and authenticate an account, independently verify service-generated receiving addresses, and recover funds from them. In this setup, the spending key and derived stealth private keys remain local. Fluidkey receives the scoped viewing capability and signed authorizations. Assuming the client verifies the data it signs, bypassing the hosted frontend removes it as a spending-key exfiltration risk.

This differs from the usual sender-driven ERC-5564 flow. The payer does not derive the address from public recipient metadata and publish an announcement. Fluidkey's service performs the derivation, keeps the address-to-account mapping, and indexes the resulting balances.

When a user spends, the service selects one or more stealth Safes and prepares the transactions. The client re-derives the corresponding owner keys and authorizes Safe execution. The hosted client also processes accepted actions returned by the backend, so keeping keys client-side does not replace checking the transaction data supplied by the service.

### ENS resolution

Fluidkey provides `username.fkey.eth` and `username.fkey.id` names. Both kinds of name use the same ENS CCIP-Read flow. The `.fkey.id` name also works as a web payment link.

A lookup is redirected to Fluidkey's gateway, which creates a fresh payment address and returns a signed ENS answer. The onchain resolver checks the answer's expiry and signature against its configurable set of signers.

The signature authenticates the answer as one accepted by Fluidkey, but it is not a proof that the returned address was correctly derived for the named recipient. An external sender cannot independently verify recipient control from the ENS answer alone. The resolver owner can immediately replace the gateway URL and add or remove accepted signers.

### Auto-earn

When auto-earn is enabled, receiving Safes are initialized with the Fluidkey Earn module. It allows authorized relayers to wrap native tokens when needed and deposit funds into configured ERC-4626 vaults, with the vault shares credited to the same Safe. These deposits do not require a new owner signature for each execution.

The module owner publishes token and vault configurations identified by a hash of their contents. Changing a vault produces a different configuration hash, and selecting a different hash requires a call from the Safe. The owner cannot silently replace the vault set under an already selected hash. Both the module owner and authorized relayers can manage relayer permissions. Users can disable the module through their Safe, but funds already deposited remain exposed to the underlying vaults' losses, liquidity, and withdrawal restrictions.

### Privacy considerations

Fluidkey's fresh addresses do not hide the sender, token, amount, or receiving address of an individual payment. They prevent separate receives from automatically accumulating under one reused public address. Later transactions can still link addresses when they consolidate balances, use a recognizable destination, or correlate by timing and amount.

The hosted service has the viewing capability and address index needed to link an account's stealth addresses and activity. Fluidkey also integrates Houdini Swap for its Hide Trail feature, which routes funds through two centralized exchanges (CEXs) to obscure the public link between the original and final addresses. This adds reliance on the swap service and participating exchanges, including their visibility into the transfers and their ability to delay or block them.
