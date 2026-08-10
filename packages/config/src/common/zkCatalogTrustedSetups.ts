import type { TrustedSetup } from '../types'
import { readMarkdown } from '../utils/readMarkdown'

export const TRUSTED_SETUPS = {
  AztecIgnition: {
    id: 'AztecIgnition',
    name: 'Aztec Ignition',
    participantCount: 176,
    risk: 'green',
    shortDescription:
      'Aztec Ignition is a trusted setup ceremony that was run by Aztec for KZG commitment over BN254 curve in 2019. It included 176 participants and was publicly open for participation.',
    longDescription: readMarkdown('common/trustedSetups/AztecIgnition.md'),
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
    longDescription: readMarkdown('common/trustedSetups/SP1TurboGroth16.md'),
  },
  SP1HypercubeGroth16: {
    id: 'SP1HypercubeGroth16',
    name: 'SP1 Hypercube Groth16 circuit-specific setup',
    participantCount: 12,
    risk: 'red',
    shortDescription:
      'Trusted setup ceremony for SP1 Hypercube (release v6.0.0) Groth16 final wrap circuits. Phase 2 of the ceremony was organized by Succinct and includes 12 participants from 7 different organizations, without public calls to participate.',
    longDescription: readMarkdown(
      'common/trustedSetups/SP1HypercubeGroth16.md',
    ),
  },
  SP1HypercubeGroth16_v6_1_0: {
    id: 'SP1HypercubeGroth16_v6_1_0',
    name: 'SP1 Hypercube v6.1.0 Groth16 circuit-specific setup',
    participantCount: 18,
    risk: 'red',
    shortDescription:
      'Trusted setup ceremony for SP1 Hypercube (release v6.0.0) Groth16 final wrap circuits. Phase 2 of the ceremony was organized by Succinct and includes 18 participants from 8 different organizations, without public calls to participate.',
    longDescription: readMarkdown(
      'common/trustedSetups/SP1HypercubeGroth16_v6_1_0.md',
    ),
  },
  CeloPlumo: {
    id: 'CeloPlumo',
    name: 'Celo Plumo',
    participantCount: 55,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BW6-761 curve, initially run for Celo Plumo. Ceremony has 55 participants and was publicly open for participation.',
    longDescription: readMarkdown('common/trustedSetups/CeloPlumo.md'),
  },
  Aleo: {
    id: 'Aleo',
    risk: 'yellow',
    name: 'Aleo stage I trusted setup',
    participantCount: 106,
    shortDescription:
      "Trusted setup for KZG commitments over BLS12-377 curve, initially run as Aleo's Stage I setup. Ceremony has 106 participants and was publicly open for participation.",
    longDescription: readMarkdown('common/trustedSetups/Aleo.md'),
  },
  PolygonZkEVM: {
    id: 'PolygonZkEVM',
    name: 'Polygon zkEVM',
    participantCount: 55,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve used by Polygon zkEVM, includes 55 participants. Is a subset of Perpetual Powers of Tau ceremony.',
    longDescription: readMarkdown('common/trustedSetups/PolygonZkEVM.md'),
  },
  Risc0: {
    id: 'Risc0',
    name: 'Risc0 Groth16',
    participantCount: 55,
    risk: 'yellow',
    shortDescription:
      'Circuit-specific trusted setup for Risc0 final wrap Groth16 onchain verifier. It was built on top of 55 phase 1 contributions, and reached 238 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/Risc0.md'),
  },
  Halo2KZG: {
    id: 'Halo2KZG',
    name: 'Halo2 KZG over BN254',
    participantCount: 71,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments managed by Halo2 team on the base of the first 71 contributions to the Perpetual Powers of Tau contributions.',
    longDescription: readMarkdown('common/trustedSetups/Halo2KZG.md'),
  },
  Zircuit: {
    id: 'Zircuit',
    name: 'Zircuit',
    participantCount: 129,
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve run by Zircuit team for their proving system. Zircuit ceremony took 85th contribution to pptau ceremony and added another 44 contributions, totalling to 129 participants.',
    longDescription: readMarkdown('common/trustedSetups/Zircuit.md'),
  },
  Loopring: {
    id: 'Loopring',
    name: 'Loopring Stack',
    participantCount: 5,
    risk: 'red',
    shortDescription:
      'Two circuit-specific trusted setups for Groth16 verifiers of two L2s built with Loopring zk rollup stack. One contains 5 contributions, another 16 contributions.',
    longDescription: readMarkdown('common/trustedSetups/Loopring.md'),
  },
  TornadoCash: {
    id: 'TornadoCash',
    name: 'Tornado Cash',
    risk: 'yellow',
    participantCount: 30,
    shortDescription:
      'Circuit-specific trusted setup for Groth16 Tornado Cash circuits. It was built on top of 30 phase 1 contributions, and reached 1114 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/TornadoCash.md'),
  },
  PrivacyPools: {
    id: 'PrivacyPools',
    name: 'Privacy Pools',
    risk: 'yellow',
    participantCount: 80,
    shortDescription:
      'Trusted setup for two Groth16 Privacy Pools circuits. It was built on top of 80 phase 1 contributions, with 513 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/PrivacyPools.md'),
  },
  Railgun: {
    id: 'Railgun',
    name: 'Railgun',
    risk: 'yellow',
    participantCount: 55,
    shortDescription:
      'Circuit-specific trusted setup for 54 Groth16 Railgun circuits over BN254. It was built on top of 55 phase 1 contributions, with 304 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/Railgun.md'),
  },
} as const satisfies Record<string, TrustedSetup>

export type TrustedSetupId = keyof typeof TRUSTED_SETUPS
