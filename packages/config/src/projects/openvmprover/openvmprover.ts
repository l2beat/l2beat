import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const openvmprover: BaseProject = {
  id: ProjectId('openvmprover'),
  slug: 'openvmprover',
  name: 'OpenVM',
  shortName: undefined,
  aliases: ['Axiom'],
  addedAt: UnixTime.fromDate(new Date('2025-07-21')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'OpenVM prover is a zk proving system for customizable modular VM built by Axiom and used to prove Scroll L2 STF.',
    links: {
      websites: ['https://openvm.dev'],
      documentation: [
        'https://book.openvm.dev',
        'https://openvm.dev/whitepaper.pdf',
        'https://www.youtube.com/watch?v=NHwd-gJ8xg4',
      ],
      repositories: [
        'https://github.com/openvm-org/openvm',
        'https://github.com/scroll-tech/zkvm-prover/tree/master',
      ],
      socialMedia: ['https://t.me/openvm'],
    },
    badges: [],
  },
  milestones: [
    {
      title:
        '[Disclosed vulnerability] Plonky3 final polynomial degree check vulnerability',
      url: 'https://forum.scroll.io/t/security-council-report-scroll-mainnet-emergency-upgrade-on-2025-05-26/810',
      date: '2025-05-26T00:00:00Z',
      description:
        'Fix of a bug in OpenVM that was analogous to an identified vulnerability in Plonky3 library.',
      type: 'incident',
    },
  ],
  zkCatalogInfo: {
    creator: 'Axiom',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Plonky3,
        ZK_CATALOG_TAGS.ISA.OpenVM,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Halo2,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('openvmprover', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        ...TRUSTED_SETUPS.Halo2KZG,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('scroll'),
        sinceTimestamp: UnixTime(1697493600),
      },
    ],
    verifierHashes: [
      {
        hash: '0x6a74f16c472ea2698ee461daf35ffb62faaef6280d40390961daa181bc805663',
        name: 'OpenVM v1.6.0 PostFeynman',
        sourceLink:
          'https://github.com/scroll-tech/zkvm-prover/tree/1839b4905bd920bf75de9c25997b8383029e021d/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x96cbcC4333E172927fDa8B631C716d43E2FBA01C',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'openvmprover',
          'verificationSteps-0x6a74f16c',
        ),
        description:
          'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      },
      {
        hash: '0x30af8474d8e13b8ce6a96eae63293310e7c1072b890bde77f96786497a9e5f4b',
        name: 'OpenVM Feynman',
        sourceLink:
          'https://github.com/scroll-tech/zkvm-prover/tree/v0.5.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x39854DF30b3482Ef546F68B8981Fae5A2C426eA4',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'openvmprover',
          'verificationSteps-0x30af8474',
        ),
        description:
          'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      },
      {
        hash: '0xf86ce35d4f5b1478f21194d9c6fc825f8d8afc0468425c981dc017149f0cac5e',
        name: 'OpenVM Galileo',
        sourceLink:
          'https://github.com/scroll-tech/zkvm-prover/tree/v0.7.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x749fC77A1a131632a8b88e8703E489557660C75e',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        description:
          'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
        verificationSteps: readProjectMarkdown(
          'openvmprover',
          'verificationSteps-0xf86ce35d',
        ),
      },
      // Verifiers below could not be used by scroll because their version is <7
      // {
      //   hash: '0x91816743ec15118a4ddacb13c830e56e9f8b28f1c875dfc458a27142a88c9fc8',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0xd1638c0C7Bd6bf49D655D855d353aC8b4f949582',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0x14fc3c8162cc5ead23a04f8221bbd7f18f21946a6e92df34831fab6482b19a37',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x8c1b52757b5c571ADcB5572E992679d4D48e30f7',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0xaeaf8626da1244ce080122af824423c2a78bb8a043a821473d2247e8462f28af',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0xa69a3ce200bf287833cb53d85a93e5a943ac51473dd9ee4dff855dcfbaeabb6a',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x03a72B00D036C479105fF98A1953b15d9c510110',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0x3b69f45dffa4aa394e991c0bbf0a31b5652a89639f075fa88ab7ea7245a4563a',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x2293cd12e8564e8219d314b075867c2f66ac6941',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
      // {
      //   hash: '0x9accf42dcd17d7f7f61eeedd3843ff669028f2cb5fd2c879c02da54945f6dbb9',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      //   description:
      //     'Custom verifier ID: solidity codehash of the verifier smart contract, i.e. keccak256 of the EVM bytecode.',
      // },
    ],
  },
}
