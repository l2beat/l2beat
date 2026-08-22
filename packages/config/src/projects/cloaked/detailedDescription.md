Cloaked is a wallet service that separates incoming payments across fresh Ethereum addresses while presenting them as one account. During registration, a recipient can claim a free `username.clkd.eth` subdomain. They can also link an existing `.eth` name they control or request a payment address from the app or API. Funds are sent to a fresh address controlled by a private key that the recipient can derive locally.

### Stealth address generation

Under Cloaked's published key model, the client deterministically derives separate viewing and spending capabilities from a passkey secret or a wallet signature combined with a PIN. A scoped child viewing private node and the public spending key are shared with the Cloaked service, while the private spending key remains client-side.

For each payment nonce, the service derives an ephemeral private key, combines it with the recipient's public spending key, and returns the resulting one-time address. The client can recreate the same ephemeral key and combine its public key with the private spending key to derive the private key controlling that address. Under this model, the service can generate and monitor addresses without being able to spend from correctly derived addresses.

The derivation SDK, API schema, and standalone recovery client are published. The recovery client can derive exportable stealth private keys without using the Cloaked API.

The hosted frontend is not required to hold or use spending keys. A locally run client can create an account and perform payment-address, quote, local derivation and signing, and submission flows against the hosted API. In this setup, the spending key and derived stealth private keys remain local; Cloaked receives the scoped viewing capability and signed authorizations. Assuming the client verifies the data it signs, bypassing the hosted frontend removes it as a spending-key exfiltration risk.

The production web wallet itself is closed source, has no published reproducible build, and cannot be self-hosted. Users who rely on it must trust the remotely served application to preserve the client-side spending-key boundary. The API, ENS gateway, indexer, and relay are also hosted and closed source, so the complete wallet service cannot be self-hosted.

This differs from the usual sender-driven ERC-5564 flow. The payer does not derive the address from public recipient metadata and publish an announcement. Cloaked's service performs the derivation, keeps the address-to-account mapping, and indexes the resulting balances.

When a user spends, the service selects one or more stealth addresses and prepares the transaction. The client re-derives the corresponding private keys and authorizes execution. Cloaked uses EIP-7702 account delegation for actions such as combining balances, paying fees in tokens, swaps, and bridging.

### ENS resolution

Cloaked supports both the free `username.clkd.eth` subdomain created during registration and custom `.eth` names or subnames owned by the user. Linking a custom name sets Cloaked's resolver for that name but does not transfer ownership, and the user can unlink it by changing the resolver again. Both kinds of name use the same ENS CCIP-Read flow.

A lookup is redirected to `api.clkd.xyz`, which creates a fresh payment address and returns a signed ENS answer. The onchain resolver checks the answer's expiry and signature against its configurable signer. For custom names, Cloaked stores the linked name only in encrypted form, although the name and its resolver configuration remain public on Ethereum.

The signature authenticates the answer as one accepted by Cloaked, but it is not a proof that the returned address was correctly derived for the named recipient. An external sender cannot independently verify recipient control from the ENS answer alone. The resolver owner can immediately replace both the gateway URLs and accepted signer.

### Privacy considerations

Cloaked's fresh addresses do not hide the sender, token, amount, or receiving address of an individual payment. They prevent separate receives from automatically accumulating under one reused public address. Later transactions can still link addresses when they consolidate balances, use a recognizable destination, or correlate by timing and amount.

The hosted service has the viewing capability and address index needed to link an account's stealth addresses and activity. Cloaked also integrates [Privacy Pools](/privacy/projects/privacy-pools) for an Incognito balance that can break the public onchain link between a deposit and withdrawal, but Cloaked states that its relay sees both sides. The underlying pools are tracked separately because their public transactions cannot be attributed specifically to Cloaked users.
