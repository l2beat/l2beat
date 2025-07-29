import type { TrustedSetup } from '../types'

export const TRUSTED_SETUPS = {
  AztecIgnition: {
    id: 'AztecIgnition',
    risk: 'green',
    shortDescription:
      'Aztec Ignition universal setup for KZG commitments over BN254 curve.',
    longDescription: `
              
    ## Aztec Ignition 

    Aztec Ignition is a trusted setup ceremony that was run by Aztec for KZG commitment over BN254 curve in 2019. 
    It included 176 participants and was open for participation.
    
    - Github repo to download and verify the ceremony artifacts: https://github.com/AztecProtocol/ignition-verification.
    - Github repo with instructions for ceremony participants: https://github.com/AztecProtocol/Setup.
    - Ceremony announcement with a call to participate: https://aztec.network/blog/announcing-ignition.
    `,
  },
  TransparentSetup: {
    id: 'TransparentSetup',
    risk: 'N/A',
    shortDescription:
      'No trusted setup and no additional setup-related trust assumptions.',
    longDescription: `
        
        ## Transparent setup

        Transparent proving systems require no trusted setups and have no additional setup-related trust assumptions.
        `,
  },
  SP1Groth16: {
    id: 'SP1Groth16',
    risk: 'red',
    shortDescription:
      "Succinct's internally run trusted setup for SP1 Groth16 final wrap circuits.",
    longDescription: `
    
    ## SP1 Groth16 circuit-specific setup

    Ceremony was run among 7 contributors to the SP1 project without public calls to participate. 
    It generated setup parameters for Groth16 wrapper of SP1 zkVM.

    - Ceremony info on Succinct docs page: https://docs.succinct.xyz/docs/sp1/security/security-model#options.
    - Ceremony instructions and verification instructions: https://github.com/succinctlabs/semaphore-gnark-11/tree/main.
    - Link to transcript and other artifacts (Note: will immediately start downloading .tar.gz file): https://sp1-circuits.s3.us-east-2.amazonaws.com/v4.0.0-rc.3-trusted-setup.tar.gz.
    `,
  },
  CeloPlumo: {
    id: 'CeloPlumo',
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BW6-761 curve, initially run for Celo Plumo.',
    longDescription: `
    
    ## Celo Plumo trusted setup 

    Ceremony generated trusted setup for KZG commitments over BW6-761 curve, it was originally run for Celo
    Plumo and later reused for Linea prover. Ceremony has 55 participants.

  - Repo with ceremony instructions: https://github.com/celo-org/snark-setup?tab=readme-ov-file
  - Link to the ceremony details: https://celo.org/plumo (it is broken. Archived version here: https://web.archive.org/web/20221201203227/https://celo.org/plumo)
  - Links to ceremony transcript: https://console.cloud.google.com/storage/browser/plumoceremonyphase1/chunks
  - Link to ceremony verification code: https://github.com/Consensys/gnark-ignition-verifier/blob/feat/celo_parser/celo/main.go
    `,
  },
  Aleo: {
    id: 'Aleo',
    risk: 'red',
    shortDescription:
      "Trusted setup for KZG commitments over BLS12-377 curve, initially run as Aleo's Stage I setup.",
    longDescription: `
    
    ## Aleo stage I trusted setup

    Ceremony generated trusted setup for KZG commitments over BLS12-377 curve, it was originally run as stage I setup
    for Aleo blockchain and later reused for Linea prover. Ceremony contained 106 participants.

    - Repo with ceremony instructions https://github.com/AleoNet/aleo-setup
    - Link to the ceremony details: [https://setup.aleo.org](https://setup.aleo.org/) (it is broken. Archived version here: https://web.archive.org/web/20240815052920/https://setup.aleo.org/)
    `,
  },
  PolygonZkEVM: {
    id: 'PolyonZkEVM',
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve used by Polygon zkEVM. Is a subset of Perpetual Powers of Tau ceremony.',
    longDescription: `
    
    ## Polygon zkEVM

    Ceremony uses 54 first contributions from the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau)
    and adds one more contribution to the total of 55 participants.

    - Ceremony used: https://github.com/privacy-scaling-explorations/perpetualpowersoftau?tab=readme-ov-file
    - Public announcement: https://medium.com/coinmonks/announcing-the-perpetual-powers-of-tau-ceremony-to-benefit-all-zk-snark-projects-c3da86af8377
    - Final data and verification steps in this repo: https://github.com/iden3/snarkjs/tree/master?tab=readme-ov-file
    `,
  },
  Risc0: {
    id: 'Risc0',
    risk: 'green',
    shortDescription:
      'Circuit-specific trusted setup for Risc0 final wrap Groth16 onchain verifeir.',
    longDescription: `
    
    ## Risc0 Groth16

    Ceremony for a circuit-specific trusted setup run by Risc0 for Groth16 circuits verifying Risc0 STARK proof. 
    It was publicly announced and run with 238 participants. Ceremony transcript, as well as instructions for participation and verification 
    are publicly available.

    - Ceremony instructions: https://risczero.com/blog/ceremony-contribution-public-instructions
    - Link to the verification: https://dev.risczero.com/api/trusted-setup-ceremony#the-transcript-matches-the-circuit
    - Post with a call to community to participate: https://x.com/RiscZero/status/1781110200923275769
    `,
  },
  Halo2KZG: {
    id: 'Halo2KZG',
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments managed by Halo2 team on the base of Perpetual Powers of Tau contributions.',
    longDescription: `
    
    ## Halo2 KZG over BN254

    A trusted setup used for KZG commitments over BN254 curve for Halo2 SNARK proving system 
    (when it is set up not in a transparent way). De-facto it is the first 71 entries in the Perpetual Powers of Tau
    ceremony that were converted to a particular format.

    - The main coordination point is this Halo2 KZG repo to convert pptau format into Halo2-suitable format: https://github.com/han0110/halo2-kzg-srs?tab=readme-ov-file#perpetual-powers-of-tau
    - Ceremony is [Perpetual Powers of Tau](https://github.com/weijiekoh/perpetualpowersoftau): https://github.com/scroll-tech/scroll-prover/blob/main/circuit-assets.md
    `,
  },
  Zircuit: {
    id: 'Zircuit',
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve run by Zircuit team for their proving system.',
    longDescription: `
    
    ## Zircuit

    General trusted setup for KZG commitments over BN254 curve built on top of the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau).
    Zircuit ceremony took 85th contribution to pptau ceremony and added another 44 contributions, totalling to 129 participants.
    Ceremony artifacts are available on GitHub.

    - Main repo with all artifacts, as well as instructions for participation: https://github.com/zircuit-labs/ceremony?tab=readme-ov-file
    - Blog post: https://www.zircuit.com/blog/zircuit-kzg-ceremony
    `,
  },
  Loopring: {
    id: 'Loopring',
    risk: 'red',
    shortDescription:
      'Two circuit-specific trusted setups for Groth16 verifiers of two L2s built with Loopring zk rollup stack.',
    longDescription: `
    
    ## Loopring Stack

    This entry incorporates two different trusted setups with very similar properties. Namely, these are 
    circuit-specific trusted setups for Groth16 circuits over BN254 curve of DeGate and Loopring app chains 
    that are built with Loopring zk tech stack. DeGate trusted setup includes 5 phase 2 (i.e. circuit-specific) 
    contributions, Loopring trusted setup includes 16 phase 2 contributions. Circuit-specific phase builds on top 
    of the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau).

    - Repo for Loopring trusted setup: https://github.com/Loopring/trusted_setup/tree/master, repo for DeGate trusted setup: https://github.com/degatedev/trusted_setup/tree/master
    - Post for DeGate ceremony: https://medium.com/degate/degate-completes-zk-trusted-setup-ceremony-4752301e379f
    `,
  },
} as const satisfies Record<string, TrustedSetup>

export type TrustedSetupId = keyof typeof TRUSTED_SETUPS
