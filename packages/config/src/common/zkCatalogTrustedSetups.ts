import type { TrustedSetup } from '../types'

export const TRUSTED_SETUPS = {
  AztecIgnition: {
    id: 'AztecIgnition',
    name: 'Aztec Ignition',
    participantCount: 176,
    risk: 'green',
    shortDescription:
      'Aztec Ignition is a trusted setup ceremony that was run by Aztec for KZG commitment over BN254 curve in 2019. It included 176 participants and was publicly open for participation.',
    longDescription: `              
Aztec Ignition is a trusted setup ceremony for KZG commitments over BN254 curve that was run by Aztec for KZG commitment over BN254 curve in 2019. 
It included 176 participants and was publicly open for participation.

- Github repo to download and verify the ceremony artifacts: [https://github.com/AztecProtocol/ignition-verification](https://github.com/AztecProtocol/ignition-verification).
- Github repo with instructions for ceremony participants: [https://github.com/AztecProtocol/Setup](https://github.com/AztecProtocol/Setup).
- Ceremony announcement with a call to participate: [https://aztec.network/blog/announcing-ignition](https://aztec.network/blog/announcing-ignition).
    `,
  },
  TransparentSetup: {
    id: 'TransparentSetup',
    name: 'Transparent setup',
    risk: 'N/A',
    shortDescription:
      'No trusted setup and no additional setup-related trust assumptions.',
    longDescription:
      'Transparent proving systems require no trusted setups and have no additional setup-related trust assumptions.',
  },
  SP1TurboGroth16: {
    id: 'SP1TurboGroth16',
    name: 'SP1 Turbo Groth16 circuit-specific setup',
    participantCount: 7,
    risk: 'red',
    shortDescription:
      "Succinct's internally run trusted setup for SP1 Turbo (release v5.0.0) Groth16 final wrap circuits. Phase 2 of the ceremony was run among 7 contributors to the SP1 project without public calls to participate.",
    longDescription: `
SP1 Turbo Groth16 trusted setup builds on top of the first 54 contributions to the [Perpetual Powers of Tau](https://github.com/privacy-ethereum/perpetualpowersoftau) ceremony as its phase 1 setup.

Phase 2 of the ceremony was run among 7 contributors to the SP1 project without public calls to participate. It generated setup parameters for Groth16 wrapper of SP1 zkVM.

- Phase 1 ceremony (first 54 contributions are used): <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Ceremony info on Succinct docs page: [https://docs.succinct.xyz/docs/v5/sp1/security/security-model#options](https://docs.succinct.xyz/docs/v5/sp1/security/security-model#options).
- Ceremony instructions and verification instructions: [https://github.com/succinctlabs/semaphore-gnark-11/tree/main](https://github.com/succinctlabs/semaphore-gnark-11/tree/main).
- Link to transcript and other artifacts (Note: will immediately start downloading .tar.gz file): [https://sp1-circuits.s3.us-east-2.amazonaws.com/v4.0.0-rc.3-trusted-setup.tar.gz](https://sp1-circuits.s3.us-east-2.amazonaws.com/v4.0.0-rc.3-trusted-setup.tar.gz).
    `,
  },
  SP1HypercubeGroth16: {
    id: 'SP1HypercubeGroth16',
    name: 'SP1 Hypercube Groth16 circuit-specific setup',
    participantCount: 12,
    risk: 'red',
    shortDescription:
      'Trusted setup ceremony for SP1 Hypercube (release v6.0.0) Groth16 final wrap circuits. Phase 2 of the ceremony was organized by Succinct and includes 12 participants from 7 different organizations, without public calls to participate.',
    longDescription: `
SP1 Hypercube v6.0.0 Groth16 trusted setup builds on top of the first 54 contributions to the [Perpetual Powers of Tau](https://github.com/privacy-ethereum/perpetualpowersoftau) ceremony as its phase 1 setup.

Phase 2 of the ceremony was run among 12 participants affiliated with Across Protocol, OP Labs, Offchain Labs, Succinct Labs, Conduit, Ethrealize and 1 independent participant. It generated circuit-specific setup parameters for Groth16 wrapper of SP1 Hypercube zkVM.

- Phase 1 ceremony (first 54 contributions are used): <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Ceremony info on Succinct docs page: <https://docs.succinct.xyz/docs/sp1/security/security-model#options> (link is updated and points to a different ceremony now).
- Ceremony instructions and verification instructions: [https://github.com/succinctlabs/semaphore-gnark-11/tree/main](https://github.com/succinctlabs/semaphore-gnark-11/tree/main).
- Link to transcript and other artifacts (Note: will immediately start downloading .tar.gz file): <https://sp1-circuits.s3-us-east-2.amazonaws.com/v6.0.0-trusted-setup.tar.gz>.
    `,
  },
  SP1HypercubeGroth16_v6_1_0: {
    id: 'SP1HypercubeGroth16_v6_1_0',
    name: 'SP1 Hypercube v6.1.0 Groth16 circuit-specific setup',
    participantCount: 18,
    risk: 'red',
    shortDescription:
      'Trusted setup ceremony for SP1 Hypercube (release v6.0.0) Groth16 final wrap circuits. Phase 2 of the ceremony was organized by Succinct and includes 18 participants from 8 different organizations, without public calls to participate.',
    longDescription: `
SP1 Hypercube v6.1.0 Groth16 trusted setup builds on top of the first 54 contributions to the [Perpetual Powers of Tau](https://github.com/privacy-ethereum/perpetualpowersoftau) ceremony as its phase 1 setup.

Phase 2 of the ceremony was run among 18 participants affiliated with Etherealize, Polygon, OP Labs, Alpen Labs, Offchain Labs, Succinct, Coinbase, Across Protocol. It generated circuit-specific setup parameters for Groth16 wrapper of SP1 Hypercube zkVM.

- Phase 1 ceremony (first 54 contributions are used): <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Ceremony info on Succinct docs page: <https://docs.succinct.xyz/docs/sp1/security/security-model#options>.
- Ceremony instructions and verification instructions: [https://github.com/succinctlabs/semaphore-gnark-11/tree/main](https://github.com/succinctlabs/semaphore-gnark-11/tree/main).
- Link to transcript and other artifacts (Note: will immediately start downloading .tar.gz file): <https://sp1-circuits.s3-us-east-2.amazonaws.com/v6.1.0-trusted-setup.tar.gz>.
    `,
  },
  CeloPlumo: {
    id: 'CeloPlumo',
    name: 'Celo Plumo',
    participantCount: 55,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BW6-761 curve, initially run for Celo Plumo. Ceremony has 55 participants and was publicly open for participation.',
    longDescription: `
Ceremony generated trusted setup for KZG commitments over BW6-761 curve, it was originally run for Celo
Plumo and later reused for Linea prover. Ceremony has 55 participants.

- Repo with ceremony instructions: [https://github.com/celo-org/snark-setup?tab=readme-ov-file](https://github.com/celo-org/snark-setup?tab=readme-ov-file)
- Link to the ceremony details: [https://celo.org/plumo](https://celo.org/plumo) (it is broken. Archived version here: [https://web.archive.org/web/20221201203227/https://celo.org/plumo](https://web.archive.org/web/20221201203227/https://celo.org/plumo))
- Links to ceremony transcript: [https://console.cloud.google.com/storage/browser/plumoceremonyphase1/chunks](https://console.cloud.google.com/storage/browser/plumoceremonyphase1/chunks)
- Link to ceremony verification code: [https://github.com/Consensys/gnark-ignition-verifier/blob/feat/celo_parser/celo/main.go](https://github.com/Consensys/gnark-ignition-verifier/blob/feat/celo_parser/celo/main.go)
    `,
  },
  Aleo: {
    id: 'Aleo',
    risk: 'yellow',
    name: 'Aleo stage I trusted setup',
    participantCount: 106,
    shortDescription:
      "Trusted setup for KZG commitments over BLS12-377 curve, initially run as Aleo's Stage I setup. Ceremony has 106 participants and was publicly open for participation.",
    longDescription: `
Ceremony generated trusted setup for KZG commitments over BLS12-377 curve, it was originally run as stage I setup
for Aleo blockchain and later reused for Linea prover. Ceremony has 106 participants.

- Repo with ceremony instructions [https://github.com/AleoNet/aleo-setup](https://github.com/AleoNet/aleo-setup)
- Link to the ceremony details: [https://setup.aleo.org](https://setup.aleo.org/)
    `,
  },
  PolygonZkEVM: {
    id: 'PolygonZkEVM',
    name: 'Polygon zkEVM',
    participantCount: 55,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve used by Polygon zkEVM, includes 55 participants. Is a subset of Perpetual Powers of Tau ceremony.',
    longDescription: `
Ceremony uses 54 first contributions from the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau)
and adds one more contribution to the total of 55 participants.

- Ceremony used: [https://github.com/privacy-scaling-explorations/perpetualpowersoftau?tab=readme-ov-file](https://github.com/privacy-scaling-explorations/perpetualpowersoftau?tab=readme-ov-file)
- Public announcement: [https://medium.com/coinmonks/announcing-the-perpetual-powers-of-tau-ceremony-to-benefit-all-zk-snark-projects-c3da86af8377](https://medium.com/coinmonks/announcing-the-perpetual-powers-of-tau-ceremony-to-benefit-all-zk-snark-projects-c3da86af8377)
- Final data and verification steps in this repo: [https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file](https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file)
    `,
  },
  Risc0: {
    id: 'Risc0',
    name: 'Risc0 Groth16',
    participantCount: 55,
    risk: 'yellow',
    shortDescription:
      'Circuit-specific trusted setup for Risc0 final wrap Groth16 onchain verifier. It was built on top of 55 phase 1 contributions, and reached 238 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: `
Ceremony for a circuit-specific trusted setup run by Risc0 for Groth16 circuits verifying Risc0 STARK proof.

Risc0 Groth16 builds on top of Polygon zkEVM ceremony <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file> as phase 1. It contains 55 participants.

Phase 2 of the trusted setup was publicly announced and run with 238 participants. Ceremony transcript, as well as instructions for participation and verification 
are publicly available.

- Phase 1 ceremony: <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file>.
- Ceremony instructions: [https://risczero.com/blog/ceremony-contribution-public-instructions](https://risczero.com/blog/ceremony-contribution-public-instructions)
- Link to the verification: [https://dev.risczero.com/api/trusted-setup-ceremony#the-transcript-matches-the-circuit](https://dev.risczero.com/api/trusted-setup-ceremony#the-transcript-matches-the-circuit)
- Post with a call to community to participate: [https://x.com/RiscZero/status/1781110200923275769](https://x.com/RiscZero/status/1781110200923275769)
    `,
  },
  Halo2KZG: {
    id: 'Halo2KZG',
    name: 'Halo2 KZG over BN254',
    participantCount: 71,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments managed by Halo2 team on the base of the first 71 contributions to the Perpetual Powers of Tau contributions.',
    longDescription: `
A trusted setup used for KZG commitments over BN254 curve for Halo2 SNARK proving system 
(when it is set up not in a transparent way). De-facto it is the first 71 entries in the Perpetual Powers of Tau
ceremony that were converted to a particular format.

- The main coordination point is this Halo2 KZG repo to convert pptau format into Halo2-suitable format: [https://github.com/han0110/halo2-kzg-srs?tab=readme-ov-file#perpetual-powers-of-tau](https://github.com/han0110/halo2-kzg-srs?tab=readme-ov-file#perpetual-powers-of-tau)
- Ceremony is [Perpetual Powers of Tau](https://github.com/weijiekoh/perpetualpowersoftau): [https://github.com/scroll-tech/scroll-prover/blob/main/circuit-assets.md](https://github.com/scroll-tech/scroll-prover/blob/main/circuit-assets.md)
    `,
  },
  Zircuit: {
    id: 'Zircuit',
    name: 'Zircuit',
    participantCount: 129,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve run by Zircuit team for their proving system. Zircuit ceremony took 85th contribution to pptau ceremony and added another 44 contributions, totalling to 129 participants.',
    longDescription: `
General trusted setup for KZG commitments over BN254 curve built on top of the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau).
Zircuit ceremony took 85th contribution to pptau ceremony and added another 44 contributions, totalling to 129 participants.
Ceremony artifacts are available on GitHub.

- Main repo with all artifacts, as well as instructions for participation: [https://github.com/zircuit-labs/ceremony?tab=readme-ov-file](https://github.com/zircuit-labs/ceremony?tab=readme-ov-file)
- Blog post: [https://www.zircuit.com/blog/zircuit-kzg-ceremony](https://www.zircuit.com/blog/zircuit-kzg-ceremony)
    `,
  },
  Loopring: {
    id: 'Loopring',
    name: 'Loopring Stack',
    participantCount: 5,
    risk: 'red',
    shortDescription:
      'Two circuit-specific trusted setups for Groth16 verifiers of two L2s built with Loopring zk rollup stack. One contains 5 contributions, another 16 contributions.',
    longDescription: `
This entry incorporates two different trusted setups with very similar properties. Namely, these are 
circuit-specific trusted setups for Groth16 circuits over BN254 curve of DeGate and Loopring app chains 
that are built with Loopring zk tech stack. DeGate trusted setup includes 5 phase 2 (i.e. circuit-specific) 
contributions, Loopring trusted setup includes 16 phase 2 contributions. Circuit-specific phase builds on top 
of the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau).

- Repo for Loopring trusted setup: [https://github.com/Loopring/trusted_setup/tree/master](https://github.com/Loopring/trusted_setup/tree/master), repo for DeGate trusted setup: [https://github.com/degatedev/trusted_setup/tree/master](https://github.com/degatedev/trusted_setup/tree/master)
- Post for DeGate ceremony: [https://medium.com/degate/degate-completes-zk-trusted-setup-ceremony-4752301e379f](https://medium.com/degate/degate-completes-zk-trusted-setup-ceremony-4752301e379f)
    `,
  },
  TornadoCash: {
    id: 'TornadoCash',
    name: 'Tornado Cash',
    risk: 'yellow',
    participantCount: 30,
    shortDescription:
      'Circuit-specific trusted setup for Groth16 Tornado Cash circuits. It was built on top of 30 phase 1 contributions, and reached 1114 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: `
Circuit-specific trusted setup for Groth16 Tornado Cash circuits. It was publicly announced as a Phase 2 ceremony
built on top of the [30th contribution to the Perpetual Powers of Tau ceremony]<https://tornado-cash.medium.com/tornado-cash-trusted-setup-ceremony-b846e1e00be1>, and completed in May 2020. It
collected 1114 contributions over 10 days, with 450 identified contributors and 664 anonymous ones. Tornado Cash
published the participant list, archive of contributions and artifacts, and the generated verifier contract.

- Phase 1 ceremony (first 30 contributions are used): <https://github.com/privacy-ethereum/perpetualpowersoftau>.
- Ceremony completion announcement: [https://tornado-cash.medium.com/the-biggest-trusted-setup-ceremony-in-the-world-3c6ab9c8fffa](https://tornado-cash.medium.com/the-biggest-trusted-setup-ceremony-in-the-world-3c6ab9c8fffa)
- Ceremony page with participant list and archive download: [https://ceremony.tornado.cash/](https://ceremony.tornado.cash/)
- Initial ceremony announcement: [https://tornado-cash.medium.com/tornado-cash-trusted-setup-ceremony-b846e1e00be1](https://tornado-cash.medium.com/tornado-cash-trusted-setup-ceremony-b846e1e00be1)
- Ceremony code repository: [https://github.com/tornadocash/phase2-bn254](https://github.com/tornadocash/phase2-bn254)
    `,
  },
  PrivacyPools: {
    id: 'PrivacyPools',
    name: 'Privacy Pools',
    risk: 'yellow',
    participantCount: 55,
    shortDescription:
      'Trusted setup for two Groth16 Privacy Pools circuits. It was built on top of 55 phase 1 contributions, with 513 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: `
Trusted setup for two Groth16 Privacy Pools circuits: the Ragequit circuit and the private Withdrawal circuit.

This trusted setup ceremony [builds on top of Polygon zkEVM ceremony](https://github.com/0xbow-io/privacy-pools-core/blob/a80836a47451e662f127af17e11430ffa976c234/packages/circuits/package.json#L19-L21) <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file> as phase 1, which contains 55 participants.

Phase 2 of the ceremony was publicly announced, open to anonymous and identified participants, and concluded in March 2025. It contains 514 contributions to the Withdraw circuit and 513 participants to the Ragequit circuit.
The finalized zKeys were published for independent verification, and the ceremony code and UI were open-sourced.

- Phase 1 ceremony: <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file>.
- Ceremony completion announcement: [https://0xbow.io/blog/celebrating-the-conclusion-of-the-trusted-setup-ceremony](https://0xbow.io/blog/celebrating-the-conclusion-of-the-trusted-setup-ceremony)
- Ceremony page with finalized zKeys: [https://ceremony.pse.dev/projects/Privacy%20Pools%20Ceremony](https://ceremony.pse.dev/projects/Privacy%20Pools%20Ceremony)
- Initial ceremony announcement: [https://0xbow.io/blog/privacy-pools-trusted-setup-ceremony-join-us-in-strengthening-privacy](https://0xbow.io/blog/privacy-pools-trusted-setup-ceremony-join-us-in-strengthening-privacy)
- Privacy Pools repository: [https://github.com/0xbow-io/privacy-pools-core](https://github.com/0xbow-io/privacy-pools-core)
    `,
  },
  Railgun: {
    id: 'Railgun',
    name: 'Railgun',
    risk: 'yellow',
    participantCount: 55,
    shortDescription:
      'Circuit-specific trusted setup for 54 Groth16 Railgun circuits over BN254. It was built on top of 55 phase 1 contributions, with 304 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: `
Circuit-specific Phase 2 trusted setup for Railgun's 54 Groth16 circuits (parameterised by
transaction input/output counts) over the BN254 curve. It [builds on the
Polygon zkEVM ceremony](https://github.com/Railgun-Privacy/circuits-v2/blob/d0ec02dea0cbc8cd02a3b727b28de16e51f9a741/prepare_for_ceremony.sh#L13)  <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file> as phase 1, which contains 55 participants.

A separate Phase 2 ceremony was publicly announced,
open to anonymous and identified participants, and wrapped up in late December 2022.

Verified against the ceremony artifact IPFS hash
\`QmWAySHYhaZqioKi1ufrPJC1n1ZVtHP2w4hLA9XqqJCFne\`: the
\`/contributors\` directory contains 328 sequentially-numbered attestation files with
GitHub or Twitter handles, and the \`/zkeys\` directory contains 54 final zkey files (one
per circuit). Parsing the final zkey binary for the 1x1 circuit shows 304 Phase 2
contributions on that circuit.

- Phase 1 ceremony: <https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file>.
- Ceremony artifacts on IPFS: [https://ipfs.io/ipfs/QmWAySHYhaZqioKi1ufrPJC1n1ZVtHP2w4hLA9XqqJCFne](https://ipfs.io/ipfs/QmWAySHYhaZqioKi1ufrPJC1n1ZVtHP2w4hLA9XqqJCFne)
- Ceremony announcement: [https://medium.com/@Railgun_Project/railgun-project-begins-setup-ceremony-with-an-emphasis-on-security-d1c63117c312](https://medium.com/@Railgun_Project/railgun-project-begins-setup-ceremony-with-an-emphasis-on-security-d1c63117c312)
- Advanced Circuit ceremony user guide: [https://medium.com/@Railgun_Project/railgun-advanced-circuit-setup-ceremony-user-guide-32361c54242](https://medium.com/@Railgun_Project/railgun-advanced-circuit-setup-ceremony-user-guide-32361c54242)
- Docs overview of the trusted setup: [https://docs.railgun.org/wiki/learn/privacy-system/trusted-setup-ceremony](https://docs.railgun.org/wiki/learn/privacy-system/trusted-setup-ceremony)
- Railgun circuits repository with ceremony scripts: [https://github.com/Railgun-Privacy/circuits-v2](https://github.com/Railgun-Privacy/circuits-v2)
    `,
  },
} as const satisfies Record<string, TrustedSetup>

export type TrustedSetupId = keyof typeof TRUSTED_SETUPS
