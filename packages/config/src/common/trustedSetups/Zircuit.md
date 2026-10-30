General trusted setup for KZG commitments over BN254 curve built on top of the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau).
Zircuit starts from `challenge_0086`, which includes 66 participant contributions:
Perpetual Powers of Tau IDs 0001–0058 and 0078–0085. The IDs skip 0059–0077 because
contribution 0078 resumes from 0058 after a fork.

The Zircuit ceremony adds 44 updates, of which IDs 10, 20, 30, 40 and 44 use public
randomness. Excluding those five beacon updates leaves 39 additional participant
contributions, for 105 participant contributions in total. The initial Zircuit
record, ID 0, imports the Perpetual Powers of Tau parameters and adds no new participant.
Ceremony artifacts are available on GitHub.

- Main repo with all artifacts, as well as instructions for participation: [https://github.com/zircuit-labs/ceremony?tab=readme-ov-file](https://github.com/zircuit-labs/ceremony?tab=readme-ov-file)
- Starting parameters and inherited contribution: <https://github.com/zircuit-labs/ceremony/issues/1>.
- Perpetual Powers of Tau fork: <https://github.com/privacy-ethereum/perpetualpowersoftau/blob/b077232729db7c9eb65b63c4aaaa0ac4a1b0bba2/README.md#note-on-chain-fork>.
- Final verification log identifying all five public randomness updates: <https://github.com/zircuit-labs/ceremony/issues/774>.
- Blog post: [https://www.zircuit.com/blog/zircuit-kzg-ceremony](https://www.zircuit.com/blog/zircuit-kzg-ceremony)
