Umbra Cash is a stealth-address payment protocol. A recipient registers separate viewing and spending public keys, and a sender uses them to derive a fresh address that only the recipient can control. The sender transfers ETH directly to that address or routes an ERC-20 payment through the immutable Umbra contract, which emits the encrypted data needed to access the payment.

### Privacy considerations

Umbra is not a mixer and does not use zero-knowledge proofs or an anonymity pool. The sender, amount, token, and fresh receiving address remain public. Privacy comes from hiding the identity of the person controlling that address.

Although not enforced by the protocol, Umbra Cash users register their public keys on StealthKeyRegistry. On one hand, this allows stealth transfers between the sender and the recipient without exchanging any data offchain. On the other hand, stealth transfer recipients are very likely to be among the registered addresses, which reduces recipient anonymity set.
