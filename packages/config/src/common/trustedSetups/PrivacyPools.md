Trusted setup for two Groth16 Privacy Pools circuits: the Ragequit circuit and the private Withdrawal circuit.

This trusted setup ceremony uses the `ppot_0080` files from the
[Perpetual Powers of Tau ceremony](https://github.com/privacy-ethereum/perpetualpowersoftau) as Phase 1.
They contain 61 participant contributions and one public randomness beacon, for 62
transcript records. The contribution IDs are 0001–0058 and 0078–0080: contribution
0078 resumes from 0058 after a fork, so 0080 is an identifier rather than a count.

Phase 2 of the ceremony was publicly announced, open to anonymous and identified participants, and concluded in March 2025. It contains 514 contributions to the Withdraw circuit and 513 participants to the Ragequit circuit.
The finalized zKeys were published for independent verification, and the ceremony code and UI were open-sourced.

- Phase 1 ceremony: <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Phase 1 fork and included contribution IDs: <https://github.com/privacy-ethereum/perpetualpowersoftau/blob/b077232729db7c9eb65b63c4aaaa0ac4a1b0bba2/README.md#note-on-chain-fork>.
- Ceremony completion announcement: [https://0xbow.io/blog/celebrating-the-conclusion-of-the-trusted-setup-ceremony](https://0xbow.io/blog/celebrating-the-conclusion-of-the-trusted-setup-ceremony)
- Ceremony page with finalized zKeys: [https://ceremony.pse.dev/projects/Privacy%20Pools%20Ceremony](https://ceremony.pse.dev/projects/Privacy%20Pools%20Ceremony)
- Initial ceremony announcement: [https://0xbow.io/blog/privacy-pools-trusted-setup-ceremony-join-us-in-strengthening-privacy](https://0xbow.io/blog/privacy-pools-trusted-setup-ceremony-join-us-in-strengthening-privacy)
- Privacy Pools repository: [https://github.com/0xbow-io/privacy-pools-core](https://github.com/0xbow-io/privacy-pools-core)
