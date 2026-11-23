### Enforcement

A list provider checks a shield an hour after it. The [open list node](https://github.com/Railgun-Community/private-proof-of-innocence/blob/4b1eaf6ef19099dbfd6b43b1ca78d2ce0132a752/packages/node/src/local-list-provider.ts#L10-L61) screens with Chainalysis's sanctions API. Railgun's [docs](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence) also name Elliptic, ScamSniffer, PureFi and SlowMist as list providers. Every later note needs a Private Proof of Innocence (PPoI) for the lists that a wallet or broadcaster requires. RailOxide [spends only notes](https://github.com/triamazikamno/railoxide/blob/d9e244c059d01fb52c21b878cb596971f8c1208c/crates/wallet-ops/src/utxos.rs#L184-L196) with a valid PPoI for [one fixed list](https://github.com/triamazikamno/railgun-rust/blob/95e05b0cc06bb6ee6d0d44d5112540b26da947c3/crates/poi/src/poi.rs#L18-L35), also when the user submits the transaction.

### Access to private data

The check sees only the public shielding address.

### Proof of clean origin

A PPoI shows nothing about which shields fund a note. Anyone can look up a transaction's PPoI status at [ppoi.info](https://ppoi.info), so a recipient can check an unshield without learning its history. List nodes verify the proof, the contracts do not. It speaks only for the lists it was built against.
