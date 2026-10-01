Panther Protocol is governed by the Panther DAO through proposals (PIPs) voted on in the [pantherprotocol.eth Snapshot space](https://snapshot.org/#/s:pantherprotocol.eth) with ZKP. Each new deployment is configured and tested by the Panther team from a deployment multisig, and ownership is then handed over to the DAO through a PIP.

On Polygon and Base, both diamonds (the pool and the trees), the Vault, the FeeMaster and the PayMaster are owned by a DAO Safe, which is also the proxy admin of the Vault, FeeMaster and PayMaster. The Ethereum deployment is still owned by the team's deployment Safe and has not been handed over to the DAO yet. The owner can, without delay:
- Add, replace or remove diamond facets and upgrade the Vault, FeeMaster and PayMaster implementations.
- Replace the verifying key of any circuit.
- Change zones, zNetworks, zAssets and provider keys, including KYC/KYT rules, limits and data escrow keys.
- Blacklist master EOAs, spending keys and zAccount IDs.
- Whitelist swap plugins, set fees and reward parameters, and manage the PayMaster's authorized bundlers.

Passed proposals are executed onchain through Reality.eth (SafeSnap) modules. On Base, the module executes directly on the owner Safe. On Polygon, the Ethereum DAO multisig sends the calls through the Polygon FxPortal bridge to a MaticBridgeModule on the Polygon DAO Safe, which is the sole owner of the Safe that owns the contracts. Under PIP-25, the modules are enabled only around the execution of passed proposals.

All DAO Safes are controlled by the same DAO signers with a {{daoSignerStats}} threshold. The signers can also execute transactions directly, which is how the Reality.eth modules are enabled and disabled. Onchain, this direct path is not restricted to toggling the modules and has no delay.
