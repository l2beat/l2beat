import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const risc0: BaseProject = {
  id: ProjectId('risc0'),
  slug: 'risc0',
  name: 'RISC Zero',
  shortName: undefined,
  aliases: ['Risc0'],
  addedAt: UnixTime.fromDate(new Date('2025-07-21')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'Risc0 is a zkVM proving system for RISC-V programs.',
    links: {
      websites: ['https://risczero.com'],
      documentation: ['https://dev.risczero.com/'],
      repositories: ['https://github.com/risc0/risc0'],
      socialMedia: [
        'https://x.com/RiscZero',
        'https://youtube.com/@risczero',
        'https://discord.com/invite/risczero',
      ],
    },
    badges: [],
  },
  milestones: [
    {
      title: '[Disclosed vulnerability] rv32im circuit soundness vulnerability',
      url: 'https://x.com/RiscZero/status/1935404812146725042',
      date: '2025-06-18T00:00:00Z',
      description:
        'Release of risc0-zkVM 2.1.0 with a fix of a missing constraint in rv32im circuit that affected any 3-register RISC-V instruction.',
      type: 'incident',
    },
    {
      title:
        '[Disclosed vulnerability] Underconstrained division vulnerability',
      url: 'https://x.com/RiscZero/status/1952503598056882225',
      date: '2025-08-05T00:00:00Z',
      description:
        'Release of risc0-zkVM 2.2.0 with a fix of a signed integer division soundness vulnerability.',
      type: 'incident',
    },
    {
      title: '[Disclosed vulnerability] Critical malicious host vulnerability',
      url: 'https://x.com/RiscZero/status/1973490104883990791',
      date: '2025-10-02T00:00:00Z',
      description:
        'Release of risc0-zkvm versions 2.3.2 and 3.0.3 with a fix of critical vulnerability where a malicious host can write to an arbitrary memory location in the guest.',
      type: 'incident',
    },
  ],
  zkCatalogInfo: {
    creator: 'RISC Zero',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.RISC0,
        ZK_CATALOG_TAGS.ISA.RISCV32,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('risc0', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.Risc0,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('taiko'),
        sinceTimestamp: UnixTime(1730452800),
      },
      {
        projectId: ProjectId('bob'),
        sinceTimestamp: UnixTime(1752703200),
      },
      {
        projectId: ProjectId('megaeth'),
        sinceTimestamp: UnixTime(1763954183),
      },
      {
        projectId: ProjectId('soon'),
        sinceTimestamp: UnixTime(1765180787),
      },
      {
        projectId: ProjectId('base'),
        sinceTimestamp: UnixTime(1779825599), // 2026-05-26 AggregateVerifier upgrade
      },
      {
        projectId: ProjectId('roninnetwork'),
        sinceTimestamp: UnixTime(1780557929), // Kailua KailuaTreasury deployed (not yet active)
      },
    ],
    verifierHashes: [
      {
        hash: '0xa42b7a9c647b7bea4f92660bfd9cd3c5afc91b4c40773f9fb410eb55c8402e40',
        name: 'RiscZero v2.2.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v2.2.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9',
            ),
            // Base also references this verifier via its TEE arm (Nitro attestation), not for state validation.
            overrideUsedIn: [
              ProjectId('taiko'),
              ProjectId('bob'),
              ProjectId('megaeth'),
              ProjectId('soon'),
              ProjectId('roninnetwork'),
            ],
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'risc0',
          'verificationSteps-0xa42b7a9c',
        ),
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        hash: '0x10ab33bc472e3e9024d89e512d33781519ba9b1621e4fe0ffd80cd20523062a8',
        name: 'RiscZero v3.0.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v3.0.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x2a098988600d87650Fb061FfAff08B97149Fa84D',
            ),
            // Base also references this verifier via its TEE arm (Nitro attestation), not for state validation.
            overrideUsedIn: [
              ProjectId('bob'),
              ProjectId('taiko'),
              ProjectId('roninnetwork'),
            ],
          },
          // {
          //   address: ChainSpecificAddress.fromLong(
          //     'ethereum',
          //     '0x7CCA385bdC790c25924333F5ADb7F4967F5d1599',
          //   ),
          // },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x411e56a890c5fe0712f6F345977815Ba8E7785C3',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'risc0',
          'verificationSteps-0x10ab33bc',
        ),
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        // Is a dummy to show soon as using risc0 proof system. Verifier
        // contract sources are unknown, so the actual hash cannot be computed.
        // Fix once the sources are on etherscan.
        hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        name: 'RiscZero Soon verifier',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            // Based on standard Risc0 verifier architecture, this contract should be
            // a verifier router that points to an actual verifier. But it's unverified, so idk
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x455218fa82e96A6adCcf182EE8A90A93BE7a6Bc6',
            ),
          },
        ],
        verificationStatus: 'unsuccessful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        description:
          'Verifier smart contract sources are not available on Etherscan, hash value is set to 0x0 to indicate that it is not known.',
      },
      {
        hash: '0x79325d9dc09af1afcea4dbf04db9fada7a71846045ad56daa1996bbebf9468d8',
        name: 'RiscZero v1.0.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v1.0.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'risc0',
          'verificationSteps-0x79325d9d',
        ),
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        name: 'Kailua v1.2.0 verifier',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xa23bf38299bbCbAA01b9ea8a1d3412D9f405b97d',
            ),
          },
        ],
        verificationStatus: 'notVerified',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        description:
          'Kailua v1.2.0 introduces a dedicated KailuaVerifier wrapper contract (deployed behind a proxy) that gates proof verification with optional fault-proof permits before delegating to the underlying RISC Zero verifier at `RISC_ZERO_VERIFIER`.',
      },
      {
        hash: '0x55c1a9d623f4b589ad496bf8fde885abfafbcbf0129c67f1dbc78c8430b69eaf',
        name: 'RiscZero v2.0.0-rc.3',
        sourceLink: 'https://github.com/risc0/risc0/tree/v2.0.0-rc.3',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x20ff7C2Cf391a5F096A2Cc181cb41916680f8E97',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'risc0',
          'verificationSteps-0x55c1a9d6',
        ),
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
      {
        hash: '0x23aae7a460d8470faa11d2b75a9005eee1d3e0bce0e88ac2288f1ada4e4664df',
        name: 'RiscZero v2.1.0',
        sourceLink: 'https://github.com/risc0/risc0/tree/v2.1.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x54aCE3ED46529B4d4F3770C8Bad5dDC48717B9bF',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'risc0',
          'verificationSteps-0x23aae7a4',
        ),
        description:
          'Custom verifier ID: SHA256 hash of the following values abi packed together: the bytes32 value of internal pure function verifier_key_digest() of the RiscZeroGroth16Verifier.sol, bytes32 value of \`control_root\` and bytes32 value of \`bn254_control_id\` of contract constructor values.',
      },
    ],
  },
}
