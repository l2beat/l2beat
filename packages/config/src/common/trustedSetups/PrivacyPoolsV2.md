Trusted setup for the 27 Groth16 Privacy Pools v2 circuits: deposit, ragequit and 25 transact circuits, one per combination of 1 to 5 spent notes and 1 to 5 created notes.

Phase 1 uses `ppot_0080_18.ptau` from the
[Perpetual Powers of Tau ceremony](https://github.com/privacy-ethereum/perpetualpowersoftau), prepared for 2^18 constraints.
It contains 61 participant contributions and one public randomness beacon. Its
contribution IDs are 0001–0058 and 0078–0080: contribution 0078 resumes from 0058
after a fork, so 0080 is an identifier rather than a count.

Phase 2, named ppv2-ceremony, ran publicly from 2026-07-08 to 2026-07-14 with 500 contributions per circuit from 597 distinct participants, followed by one beacon contribution from the RANDAO reveal of beacon-chain slot 14767039. Participants are pseudonymous in the published transcript. The final proving keys, their verification keys and the transcript are published with release v1.0.0 of the monorepo, and the ceremony code is open source.

- Phase 1 ceremony: <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Phase 1 fork and included contribution IDs: <https://github.com/privacy-ethereum/perpetualpowersoftau/blob/b077232729db7c9eb65b63c4aaaa0ac4a1b0bba2/README.md#note-on-chain-fork>.
- Ceremony code and UI: <https://github.com/0xbow-io/v2-ceremony>.
- Ceremony description and key hashes: <https://github.com/0xbow-io/privacy-pools-v2-monorepo/blob/61fac03acd1fc306164ddc234f7fac4147d04493/packages/circuits/CEREMONY.md>.
- Final keys and transcript: <https://github.com/0xbow-io/privacy-pools-v2-monorepo/releases/tag/v1.0.0>.
