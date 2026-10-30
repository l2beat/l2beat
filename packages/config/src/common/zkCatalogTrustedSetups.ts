import type { TrustedSetup } from '../types'
import { readMarkdown } from '../utils/readMarkdown'

export const TRUSTED_SETUPS = {
  AztecIgnition: {
    id: 'AztecIgnition',
    name: 'Aztec Ignition',
    participantCount: 176,
    phases: { phase1: { count: 176, unit: 'participants' } },
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
    phases: {
      phase1: { count: 54, unit: 'contributions' },
      phase2: { count: 7, unit: 'participants' },
    },
    risk: 'red',
    shortDescription:
      "Succinct's internally run trusted setup for SP1 Turbo (release v5.0.0) Groth16 final wrap circuits. Phase 2 of the ceremony was run among 7 contributors to the SP1 project without public calls to participate.",
    longDescription: readMarkdown('common/trustedSetups/SP1TurboGroth16.md'),
  },
  SP1HypercubeGroth16: {
    id: 'SP1HypercubeGroth16',
    name: 'SP1 Hypercube Groth16 circuit-specific setup',
    participantCount: 12,
    phases: {
      phase1: { count: 54, unit: 'contributions' },
      phase2: { count: 12, unit: 'participants' },
    },
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
    phases: {
      phase1: { count: 54, unit: 'contributions' },
      phase2: { count: 18, unit: 'participants' },
    },
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
    phases: { phase1: { count: 55, unit: 'participants' } },
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
    phases: { phase1: { count: 106, unit: 'participants' } },
    shortDescription:
      "Trusted setup for KZG commitments over BLS12-377 curve, initially run as Aleo's Stage I setup. Ceremony has 106 participants and was publicly open for participation.",
    longDescription: readMarkdown('common/trustedSetups/Aleo.md'),
  },
  PolygonZkEVM: {
    id: 'PolygonZkEVM',
    name: 'Polygon zkEVM',
    participantCount: 54,
    phases: { phase1: { count: 54, unit: 'contributions' } },
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve used by Polygon zkEVM. It uses 54 Perpetual Powers of Tau participant contributions followed by a public randomness beacon.',
    longDescription: readMarkdown('common/trustedSetups/PolygonZkEVM.md'),
  },
  Risc0: {
    id: 'Risc0',
    name: 'Risc0 Groth16',
    participantCount: 54,
    phases: {
      phase1: { count: 54, unit: 'contributions' },
      phase2: { count: 238, unit: 'participants' },
    },
    risk: 'yellow',
    shortDescription:
      'Circuit-specific trusted setup for Risc0 final wrap Groth16 onchain verifier. Phase 1 used 54 participant contributions and a public randomness beacon, and phase 2 reached 238 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/Risc0.md'),
  },
  Halo2KZG: {
    id: 'Halo2KZG',
    name: 'Halo2 KZG over BN254',
    participantCount: 71,
    phases: { phase1: { count: 71, unit: 'contributions' } },
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments managed by Halo2 team on the base of the first 71 contributions to the Perpetual Powers of Tau contributions.',
    longDescription: readMarkdown('common/trustedSetups/Halo2KZG.md'),
  },
  Zircuit: {
    id: 'Zircuit',
    name: 'Zircuit',
    participantCount: 105,
    phases: {
      phase1: {
        count: 105,
        unit: 'contributions',
        description:
          '66 inherited and 39 additional contributions. Public randomness updates are excluded.',
      },
    },
    risk: 'yellow',
    shortDescription:
      'Trusted setup for KZG commitments over BN254 curve run by the Zircuit team. It inherits 66 Perpetual Powers of Tau participant contributions and adds 39 participant contributions and 5 public randomness updates, for 105 participant contributions in total.',
    longDescription: readMarkdown('common/trustedSetups/Zircuit.md'),
  },
  Loopring: {
    id: 'Loopring',
    name: 'Loopring Stack',
    participantCount: 5,
    phases: {
      phase1: {
        unit: 'contributions',
        description:
          'The reused Perpetual Powers of Tau round is not specified.',
      },
      phase2: {
        count: { min: 5, max: 16 },
        unit: 'contributions',
        description: 'DeGate: 5. Loopring: 16.',
      },
    },
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
    phases: {
      phase1: { count: 30, unit: 'contributions' },
      phase2: {
        count: 1114,
        unit: 'contributions',
        description: '450 identified and 664 anonymous contributions.',
      },
    },
    shortDescription:
      'Circuit-specific trusted setup for Groth16 Tornado Cash circuits. It was built on top of 30 phase 1 contributions, and reached 1114 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/TornadoCash.md'),
  },
  PrivacyPools: {
    id: 'PrivacyPools',
    name: 'Privacy Pools v1',
    risk: 'yellow',
    participantCount: 61,
    phases: {
      phase1: { count: 61, unit: 'contributions' },
      phase2: {
        count: { min: 513, max: 514 },
        unit: 'contributions',
        description: 'Ragequit: 513. Withdraw: 514.',
      },
    },
    shortDescription:
      'Trusted setup for two Groth16 Privacy Pools circuits. Phase 1 used 61 participant contributions and a public randomness beacon, with 513 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/PrivacyPools.md'),
  },
  PrivacyPoolsV2: {
    id: 'PrivacyPoolsV2',
    name: 'Privacy Pools v2',
    risk: 'yellow',
    participantCount: 61,
    phases: {
      phase1: { count: 61, unit: 'contributions' },
      phase2: {
        count: 597,
        unit: 'participants',
        description: '500 contributions per circuit, followed by a beacon.',
      },
    },
    shortDescription:
      'Trusted setup for the 27 Groth16 Privacy Pools v2 circuits. Phase 1 used 61 participant contributions and a public randomness beacon. Phase 2 had 500 contributions per circuit from 597 participants and a RANDAO beacon. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/PrivacyPoolsV2.md'),
  },
  PrivacyBoostv1: {
    id: 'PrivacyBoostv1',
    name: 'Privacy Boost',
    risk: 'red',
    participantCount: 23,
    phases: {
      phase1: { count: 61, unit: 'contributions' },
      phase2: {
        count: 25,
        unit: 'participants',
        description: '23–25 contributions per circuit.',
      },
    },
    shortDescription:
      'Circuit-specific trusted setup for the 18 Groth16 Privacy Boost circuits. Phase 1 used 61 Perpetual Powers of Tau participant contributions and a public randomness beacon, with a publicly announced phase 2 that drew 23 to 25 participants depending on the circuit. The proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/PrivacyBoost.md'),
  },
  PrivacyBoostv2: {
    id: 'PrivacyBoostv2',
    name: 'Privacy Boost v2',
    risk: 'red',
    participantCount: 23,
    phases: {
      phase1: { count: 61, unit: 'contributions' },
      phase2: {
        count: 26,
        unit: 'participants',
        description: '23–25 contributions per circuit.',
      },
    },
    shortDescription:
      'Circuit-specific trusted setup for the 21 Groth16 Privacy Boost circuits deployed in September 2026. Phase 1 used 61 Perpetual Powers of Tau participant contributions and a public randomness beacon, with a publicly announced phase 2 that drew 26 participants and 23 to 25 contributions per circuit. The proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/PrivacyBoostv2.md'),
  },
  PrivacyBoostv3: {
    id: 'PrivacyBoostv3',
    name: 'Privacy Boost v3',
    risk: 'red',
    participantCount: 16,
    phases: {
      phase1: { count: 61, unit: 'contributions' },
      phase2: {
        count: 16,
        unit: 'participants',
        description: '16 contributions per circuit across 12 circuits.',
      },
    },
    shortDescription:
      'Circuit-specific trusted setup for the 12 Groth16 Privacy Boost epoch, forced withdrawal and gift claim circuits deployed in late September 2026. Phase 1 used 61 Perpetual Powers of Tau participant contributions and a public randomness beacon. The published phase 2 round record reports 16 participants and 16 contributions per circuit. The proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/PrivacyBoostv3.md'),
  },
  Railgun: {
    id: 'Railgun',
    name: 'Railgun',
    risk: 'yellow',
    participantCount: 54,
    phases: {
      phase1: { count: 54, unit: 'contributions' },
      phase2: {
        count: 304,
        unit: 'contributions',
        description: 'Counted in the published 1×1 circuit transcript.',
      },
    },
    shortDescription:
      'Circuit-specific trusted setup for 54 Groth16 Railgun circuits over BN254. Phase 1 used 54 participant contributions and a public randomness beacon, with 304 phase 2 participants. Proving system could be broken if either phase 1 or 2 is compromised.',
    longDescription: readMarkdown('common/trustedSetups/Railgun.md'),
  },
} as const satisfies Record<string, TrustedSetup>
