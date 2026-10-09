Cloaked changes its hosted app, API, ENS gateway, indexer and relay at will, without notice onchain.

The OffchainResolver is immutable. Its owner can replace the gateway URLs and the accepted signer instantly, and the signer can authenticate any answer, including a payment address. Owner and signer are the same EOA. This affects new lookups only, since existing addresses stay under their owners' keys.
