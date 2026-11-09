Circuit-specific Phase 2 trusted setup for the single Groth16 circuit of Tacit Pay, `transact.circom`
(2 inputs, 2 outputs, 44,414 constraints), over the BN254 curve. It builds on the Hermez ceremony as
Phase 1, using `powersOfTau28_hez_final_16.ptau`, which contains 54 Perpetual Powers of Tau participant
contributions and one public randomness beacon.

Tacit's own server coordinated Phase 2 from its website. It opened to everyone on 26 September 2026 at
18:21 UTC and closed 18 hours later. The hash of Bitcoin block 968840 sealed it as a beacon. The
transcript lists 176 contributions. 171 are named "anonymous" and 5 are Tacit test entries. A contributor
proves only a key they generate themselves. The coordinator accepts any number of contributions from
one key, so the contributions identify no participants. We found no public announcement of the
ceremony. The final key verifies against the circuit and the Phase 1 file with snarkjs, and its contribution
hashes equal the transcript's.

- Phase 1 file description (54 contributions and a beacon): <https://github.com/iden3/snarkjs#7-prepare-phase-2>.
- Ceremony bundle with transcript, keys and verifier: [IPFS bafybeia4yvn…ypfy](https://ipfs.filebase.io/ipfs/bafybeia4yvn2zoggvgpjwg5vpwpt6aivjbcm6tgzxoxsukao2nm5yyypfy)
- Transcript, 171 contributions named "anonymous": [transcript.json](https://ipfs.filebase.io/ipfs/bafybeia4yvn2zoggvgpjwg5vpwpt6aivjbcm6tgzxoxsukao2nm5yyypfy/transcript.json)
- Open ceremony without an eligibility proof: [worker/src/index.js#L9747-L9751](https://github.com/src-company/tacit/blob/389dd680cf18541eca1c0de922368fde2f5596f5/worker/src/index.js#L9747-L9751)
- Repeat contributions from one key: [worker/src/index.js#L11231-L11234](https://github.com/src-company/tacit/blob/389dd680cf18541eca1c0de922368fde2f5596f5/worker/src/index.js#L11231-L11234)
- Ceremony opened: [27b575a4](https://github.com/src-company/tacit/commit/27b575a43a37ccbb91e812b378f5e108248cb14e), closed and sealed: [ed2ffbf0](https://github.com/src-company/tacit/commit/ed2ffbf0a0947a0d54a5424b03b95134ddaad847)
- Rebuild and check instructions: [docs/EVM-POOL.md#rebuild-and-check-it](https://github.com/src-company/tacit/blob/389dd680cf18541eca1c0de922368fde2f5596f5/docs/EVM-POOL.md#rebuild-and-check-it)
