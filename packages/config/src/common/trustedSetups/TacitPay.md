Circuit-specific Phase 2 trusted setup for the single Groth16 circuit, `transact.circom`
(2 inputs, 2 outputs, 44,414 constraints), over the BN254 curve. It builds on the Hermez ceremony as
Phase 1, using `powersOfTau28_hez_final_16.ptau`, which contains 54 Perpetual Powers of Tau participant
contributions and one public randomness beacon.

Tacit's own server coordinated Phase 2 from its website, open to everyone. It took contributions from
26 September 2026 18:05 UTC, an hour after the circuit's first commit, until 27 September 12:00 UTC.
We found no announcement by the organizer. One contributor's post, 12 hours in, links the ceremony page. The hash of Bitcoin block 968840 sealed it as a beacon.

The transcript lists 176 contributions. 171 are named "anonymous" and 5 are Tacit test entries. The coordinator's records, which the sealed bundle does not contain, assign
the contributions to 120 public keys. One key contributed 20 times. A key is the contributor's Tacit wallet
key or one made in the browser. It signed the place in the queue, not the contribution, and the signatures
are not published. The final key
verifies against the circuit and the Phase 1 file with snarkjs, and its contribution hashes equal the
transcript's.

- Phase 1 file description (54 contributions and a beacon): <https://github.com/iden3/snarkjs#7-prepare-phase-2>.
- Ceremony bundle with transcript, keys and verifier: [IPFS bafybeia4yvn…ypfy](https://ipfs.filebase.io/ipfs/bafybeia4yvn2zoggvgpjwg5vpwpt6aivjbcm6tgzxoxsukao2nm5yyypfy)
- Transcript, 171 contributions named "anonymous": [transcript.json](https://ipfs.filebase.io/ipfs/bafybeia4yvn2zoggvgpjwg5vpwpt6aivjbcm6tgzxoxsukao2nm5yyypfy/transcript.json)
- Coordinator records with a public key per contribution: [attestations](https://api.tacit.finance/ceremony/b0a246d1790151c722e42ccfa89450cb96c7f5a9f4b70a2162b7d9fc79b6ddb3/attestations?limit=500), described in [docs/CEREMONY.md](https://github.com/src-company/tacit/blob/b5a4529a3abf49143a00b60996721f3147b4693b/docs/CEREMONY.md#evm-pool-ceremony-secret-sats-evm-pool--used-in-production)
- Contribution #114 posted with its hash and key, four minutes after it was recorded: [X post of 27 September 2026](https://x.com/0xAsta/status/2104093762486165746)
- Founder's post that it quotes: [X post of 26 September 2026](https://x.com/z0r0zzz/status/2103943466237775926)
- The key signs the queue slot: [worker/src/index.js#L8301-L8316](https://github.com/src-company/tacit/blob/ed2ffbf0a0947a0d54a5424b03b95134ddaad847/worker/src/index.js#L8301-L8316). The client sets the name "anonymous": [dapp/tacit.js#L45401-L45416](https://github.com/src-company/tacit/blob/ed2ffbf0a0947a0d54a5424b03b95134ddaad847/dapp/tacit.js#L45401-L45416)
- Open ceremony without an eligibility proof: [worker/src/index.js#L9747-L9751](https://github.com/src-company/tacit/blob/389dd680cf18541eca1c0de922368fde2f5596f5/worker/src/index.js#L9747-L9751)
- Repeat contributions from one key: [worker/src/index.js#L11231-L11234](https://github.com/src-company/tacit/blob/389dd680cf18541eca1c0de922368fde2f5596f5/worker/src/index.js#L11231-L11234)
- Circuit first committed: [98533a62](https://github.com/src-company/tacit/commit/98533a62b107d0546034e8ce1c970f9db34bf2ce), ceremony opened: [27b575a4](https://github.com/src-company/tacit/commit/27b575a43a37ccbb91e812b378f5e108248cb14e), closed and sealed: [ed2ffbf0](https://github.com/src-company/tacit/commit/ed2ffbf0a0947a0d54a5424b03b95134ddaad847)
- Rebuild and check instructions: [docs/EVM-POOL.md#rebuild-and-check-it](https://github.com/src-company/tacit/blob/389dd680cf18541eca1c0de922368fde2f5596f5/docs/EVM-POOL.md#rebuild-and-check-it)
