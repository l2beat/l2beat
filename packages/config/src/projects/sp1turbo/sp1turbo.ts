import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const sp1turbo: BaseProject = {
  id: ProjectId('sp1turbo'),
  slug: 'sp1turbo',
  name: 'SP1 Turbo',
  shortName: undefined,
  aliases: ['Succinct'],
  addedAt: UnixTime.fromDate(new Date('2025-07-08')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'SP1 Turbo is a zk proving system for RISC-V programs built by Succinct, release v5.',
    links: {
      websites: ['https://www.succinct.xyz'],
      documentation: [
        'https://docs.succinct.xyz/docs/v5/protocol/introduction',
      ],
      repositories: ['https://github.com/succinctlabs/sp1/tree/v5.0.0'],
      socialMedia: [
        'https://x.com/SuccinctLabs',
        'https://discord.com/invite/succinctlabs',
      ],
    },
    badges: [],
  },
  milestones: [
    {
      title: '[Disclosed vulnerability] Plonky3 FRI size check vulnerability',
      url: 'https://x.com/SuccinctLabs/status/1905818676848406801',
      date: '2025-03-28T00:00:00Z',
      description:
        'Fix of a Plonky3 library soundness issue that affected the security of SP1 zkVM.',
      type: 'incident',
    },
    {
      title:
        '[Disclosed vulnerability] Plonky3 final polynomial degree check vulnerability',
      url: 'https://x.com/SuccinctLabs/status/1929773028034204121',
      date: '2025-06-03T00:00:00Z',
      description:
        'Release of SP1 V5.0.0 with a fix of a Plonky3 library issue that affected the security of SP1 zkVM.',
      type: 'incident',
    },
  ],
  zkCatalogInfo: {
    creator: 'Succinct',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Plonky3,
        ZK_CATALOG_TAGS.ISA.RISCV32,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.Groth16.Gnark,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('sp1turbo', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        ...TRUSTED_SETUPS.SP1TurboGroth16,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('fluent'),
        sinceTimestamp: UnixTime(1776599267), // first onchain commitBatch 2026-04-19
      },
      {
        projectId: ProjectId('forknet'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('katana'),
        sinceTimestamp: UnixTime(1751328000),
      },
      {
        projectId: ProjectId('blobstream'),
        sinceTimestamp: UnixTime(1717608107),
      },
      {
        projectId: ProjectId('vector'),
        sinceTimestamp: UnixTime(1720128227),
      },
      {
        projectId: ProjectId('sophon'),
        sinceTimestamp: UnixTime(1745341091),
      },
      {
        projectId: ProjectId('lens'),
        sinceTimestamp: UnixTime(1745359200),
      },
      {
        projectId: ProjectId('plumenetwork'),
        sinceTimestamp: UnixTime(1746735060),
        untilTimestamp: UnixTime(1763420400),
      },
      {
        projectId: ProjectId('galxegravity'),
        sinceTimestamp: UnixTime(1745880540),
        untilTimestamp: UnixTime(1763420400),
      },
      {
        projectId: ProjectId('rari'),
        sinceTimestamp: UnixTime(1734562800),
      },
      {
        projectId: ProjectId('winr'),
        sinceTimestamp: UnixTime(1747088280),
      },
      {
        projectId: ProjectId('molten'),
        sinceTimestamp: UnixTime(1731480840),
      },
      {
        projectId: ProjectId('taiko'),
        sinceTimestamp: UnixTime(1730452800),
      },
      {
        projectId: ProjectId('lumia'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('polygonzkevm'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('xlayer'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('silicon'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('facet'),
        sinceTimestamp: UnixTime(1751407200),
      },
      {
        projectId: ProjectId('ethscriptions'),
        sinceTimestamp: UnixTime(1767735587),
      },
      {
        projectId: ProjectId('ternoa'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('wirex'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('penchain'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('phala'),
        sinceTimestamp: UnixTime(1736290800),
      },
      {
        projectId: ProjectId('mantle'),
        sinceTimestamp: UnixTime(1757973600),
      },
      {
        projectId: ProjectId('zircuit'),
        sinceTimestamp: UnixTime(1756072800),
      },
      {
        projectId: ProjectId('morph'),
        sinceTimestamp: UnixTime(1737359447),
        untilTimestamp: UnixTime(1780559831),
      },
      // archived projects
      {
        projectId: ProjectId('gpt'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('astarzkevm'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('witness'),
        sinceTimestamp: UnixTime(1753882500),
      },
      {
        projectId: ProjectId('kroma'),
        sinceTimestamp: UnixTime(1739228400),
      },
      {
        projectId: ProjectId('haust'),
        sinceTimestamp: UnixTime(1756808195),
      },
      {
        projectId: ProjectId('celo'),
        sinceTimestamp: UnixTime(1765324800),
      },
      {
        projectId: ProjectId('rise'),
        sinceTimestamp: UnixTime(1767605759), // mainnet genesis 2026-01-05
      },
      {
        projectId: ProjectId('appchain'),
        sinceTimestamp: UnixTime(1776165024),
        untilTimestamp: UnixTime(1780326419),
      },
    ],
    verifierHashes: [
      {
        hash: '0xd4e8ecd2357dd882209800acd6abb443d231cf287d77ba62b732ce937c8b56e7',
        name: 'SP1 Turbo Plonk v5.0.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v5.0.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xFF5Adab685362DC4C33536a65aF5873738D1216B',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x059adC0Db833f7cCb12dC41BE0017626337AfA63',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x294a1Ee119C4B2510530572481A6a50892A9ae9f',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'sp1turbo',
          'verificationSteps-0xd4e8ecd2',
        ),
      },
      {
        hash: '0xa4594c59bbc142f3b81c3ecb7f50a7c34bc9af7c4c444b5d48b795427e285913',
        name: 'SP1 Turbo Groth16 v5.0.0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0xC513d6E8C8f915B1DA2f6eAC4C6d755ff3d5f21D',
            ),
          },
          // {
          //   address: EthereumAddress(
          //     '0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5',
          //   ),
          //   chain: 'arbitrum',
          // },
        ],
        verificationStatus: 'unsuccessful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'sp1turbo',
          'verificationSteps-0xa4594c59',
        ),
      },
    ],
  },
}
