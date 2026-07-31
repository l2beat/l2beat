Umbra Cash is a stealth-address payment protocol. A recipient registers separate viewing and spending public keys, and a sender uses them to derive a fresh address that only the recipient can control. The sender transfers ETH directly to that address or routes an ERC-20 payment through the immutable Umbra contract, which emits the encrypted data the recipient needs to discover the payment. Recipients scan `Announcement` events with their viewing key and use their spending key to access payments intended for them.

### Privacy considerations

Umbra is not a mixer and does not use zero-knowledge proofs or an anonymity pool. The sender, amount, token, and fresh receiving address remain public. Privacy comes from hiding the identity of the person controlling that address, although most likely it is one of the addresses that registered stealth keys on StealthKeyRegistry. 
