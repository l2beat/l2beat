Circuit-specific trusted setup for 12 Groth16 circuits of the Privacy Boost protocol over the
BN254 curve, run by Sunnyside Labs as its third production round (`prod-ceremony-2026-03`, release
`ceremony/v0.0.5`). Its keys were registered onchain on 23 September 2026 and replace the second round
keys of the epoch (9 shapes, down from 13), forced withdrawal and gift claim circuits, which were
recompiled with gnark v0.16.3 after the EdDSA signature check was rewritten. The deposit and portal
deposit circuits keep their second round keys.
It reuses the first 80 contributions of the public
[Perpetual Powers of Tau](https://github.com/privacy-ethereum/perpetualpowersoftau) ceremony (`pot28_0080`) as Phase 1.
Phase 2 is a gnark-native MPC ceremony. At the time of writing, the round record still marks the round as
in preparation, and neither the public verification bundle nor the bundle digests have been published,
so the number of participants and contributions could not be checked.

- Phase 1 ceremony (first 80 contributions are used): <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Ceremony repository and contributor tooling: [https://github.com/sunnyside-io/privacy-boost-ceremony](https://github.com/sunnyside-io/privacy-boost-ceremony)
- Round record: [rounds/2026-03.md](https://github.com/sunnyside-io/privacy-boost-ceremony/blob/26122120d04f04f0abe59a7119b9c9a12e7c209a/rounds/2026-03.md)
- Contributor release: [ceremony/v0.0.5](https://github.com/sunnyside-io/privacy-boost-ceremony/releases/tag/ceremony%2Fv0.0.5)
- Offline verification procedure: [https://github.com/sunnyside-io/privacy-boost-ceremony/blob/main/PUBLIC_VERIFICATION.md](https://github.com/sunnyside-io/privacy-boost-ceremony/blob/main/PUBLIC_VERIFICATION.md)
