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
} as const satisfies Record<string, TrustedSetup>

export type TrustedSetupId = keyof typeof TRUSTED_SETUPS
