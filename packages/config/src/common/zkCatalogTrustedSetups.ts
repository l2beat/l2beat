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
      "Succinct's internally run trusted setup for SP1 Groth16 final wrap circuits",
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
} as const satisfies Record<string, TrustedSetup>

export type TrustedSetupId = keyof typeof TRUSTED_SETUPS
