Circuit-specific trusted setup for 12 Groth16 circuits of the Privacy Boost protocol over the
BN254 curve, run by Sunnyside Labs as its third production round (`prod-ceremony-2026-03`, release
`ceremony/v0.0.5`). Its keys were registered onchain on 23 September 2026 and replace the second round
keys of the epoch (9 shapes, down from 13), forced withdrawal and gift claim circuits, which were
recompiled with gnark v0.16.3 after the EdDSA signature check was rewritten. The deposit and portal
deposit circuits keep their second round keys.
It reuses the first 80 contributions of the public
[Perpetual Powers of Tau](https://github.com/privacy-ethereum/perpetualpowersoftau) ceremony (`pot28_0080`) as Phase 1.
Phase 2 is a gnark-native MPC ceremony. Its published manifest records **16 participants** and **192 contributions**,
16 per circuit. Participants are identified by GitHub username, and four of them show a Sunnyside Labs affiliation there.
The coordinator served plain HTTP and contributions carry no signatures, so participant names rest on the coordinator's records.
The public verification bundle, published on 29 October 2026, re-derives every registered key from these contributions.

- Phase 1 ceremony (first 80 contributions are used): <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Ceremony repository and contributor tooling: [https://github.com/sunnyside-io/privacy-boost-ceremony](https://github.com/sunnyside-io/privacy-boost-ceremony)
- Round record with the bundle digests: [rounds/2026-03.md](https://github.com/sunnyside-io/privacy-boost-ceremony/blob/e1e5a01d9bc4ce5b0917d6302aa4d294b6539894/rounds/2026-03.md)
- Contributor release: [ceremony/v0.0.5](https://github.com/sunnyside-io/privacy-boost-ceremony/releases/tag/ceremony%2Fv0.0.5)
- Offline verification procedure: [PUBLIC_VERIFICATION.md](https://github.com/sunnyside-io/privacy-boost-ceremony/blob/e1e5a01d9bc4ce5b0917d6302aa4d294b6539894/PUBLIC_VERIFICATION.md)
- Public verification bundle: [https://file.ceremony.privacyboost.io/prod-20260923-public.tar.gz](https://file.ceremony.privacyboost.io/prod-20260923-public.tar.gz)
- Derived key bundle: [https://file.ceremony.privacyboost.io/prod-20260923-keys.tar.gz](https://file.ceremony.privacyboost.io/prod-20260923-keys.tar.gz)
