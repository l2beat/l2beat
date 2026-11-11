Circuit-specific trusted setup for the 18 Groth16 circuits of the Privacy Boost protocol over the
BN254 curve, run by Sunnyside Labs and finalised on 1 April 2026.
It uses the `ppot_0080` files from the public
[Perpetual Powers of Tau](https://github.com/privacy-ethereum/perpetualpowersoftau) ceremony as Phase 1.
These contain 61 participant contributions and one public randomness beacon.
Contribution 0078 resumes from 0058 after a fork, so the included IDs are
0001–0058 and 0078–0080, rather than the first 80 contributions.
Phase 2 is a gnark-native MPC ceremony, the published manifest records **25 participants** and **425 contributions** in total, between 23 and
25 per circuit. Participants are identified by GitHub username.

- Phase 1 ceremony and fork: <https://github.com/privacy-ethereum/perpetualpowersoftau/blob/b077232729db7c9eb65b63c4aaaa0ac4a1b0bba2/README.md#note-on-chain-fork>.
- Ceremony repository and contributor tooling: [https://github.com/sunnyside-io/privacy-boost-ceremony](https://github.com/sunnyside-io/privacy-boost-ceremony)
- Offline verification procedure: [https://github.com/sunnyside-io/privacy-boost-ceremony/blob/main/PUBLIC_VERIFICATION.md](https://github.com/sunnyside-io/privacy-boost-ceremony/blob/main/PUBLIC_VERIFICATION.md)
- Public verification bundle: [https://file.ceremony.privacyboost.io/prod-20260401-public.tar.gz](https://file.ceremony.privacyboost.io/prod-20260401-public.tar.gz)
- Derived key bundle: [https://file.ceremony.privacyboost.io/prod-20260401-keys.tar.gz](https://file.ceremony.privacyboost.io/prod-20260401-keys.tar.gz)
