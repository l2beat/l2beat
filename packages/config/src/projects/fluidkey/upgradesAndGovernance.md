Fluidkey changes its app, API, name gateway, indexer and relayer at will, without notice onchain.

The OffchainResolver is immutable. Its owner, the Fluidkey Resolver Multisig, can instantly change where name lookups are answered and which keys may sign the answers. A signer can return any address for a name. This affects new lookups only, since existing Safes stay under their owners' keys.

The Fluidkey Earn module is immutable on each chain. Its owner, the Fluidkey Earn Owner multisig, publishes vault sets and chooses the relayers, which can also add or remove other relayers. An existing Safe moves to a new vault set only by its own call.
