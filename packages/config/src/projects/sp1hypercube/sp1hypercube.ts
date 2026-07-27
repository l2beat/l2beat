import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const sp1hypercube: BaseProject = {
  id: ProjectId('sp1hypercube'),
  slug: 'sp1hypercube',
  name: 'SP1 Hypercube',
  shortName: undefined,
  aliases: ['Succinct'],
  addedAt: UnixTime.fromDate(new Date('2026-03-04')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'SP1 Hypercube is a zk proving system for RISC-V programs built by Succinct, release v6.',
    links: {
      websites: ['https://www.succinct.xyz'],
      documentation: ['https://docs.succinct.xyz/docs/protocol/introduction'],
      repositories: ['https://github.com/succinctlabs/sp1/tree/v6.0.0'],
      socialMedia: [
        'https://x.com/SuccinctLabs',
        'https://discord.com/invite/succinctlabs',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Succinct',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Plonky3,
        ZK_CATALOG_TAGS.ISA.RISCV64,
        ZK_CATALOG_TAGS.Field.BabyBear,
        ZK_CATALOG_TAGS.Field.KoalaBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.Groth16.SP1_v6_0_0,
        ZK_CATALOG_TAGS.Groth16.SP1_v6_1_0,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('sp1hypercube', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_1_0,
        ...TRUSTED_SETUPS.SP1HypercubeGroth16_v6_1_0,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_0_0,
        ...TRUSTED_SETUPS.SP1HypercubeGroth16,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('fluent'),
        sinceTimestamp: UnixTime(1776599267), // first onchain commitBatch 2026-04-19
      },
      // Agglayer shared gateway v6 route
      {
        projectId: ProjectId('forknet'),
        sinceTimestamp: UnixTime(1781600877),
      },
      {
        projectId: ProjectId('katana'),
        sinceTimestamp: UnixTime(1781600877),
      },
      {
        projectId: ProjectId('lumia'),
        sinceTimestamp: UnixTime(1781600877),
      },
      {
        projectId: ProjectId('xlayer'),
        sinceTimestamp: UnixTime(1781600877),
      },
      {
        projectId: ProjectId('penchain'),
        sinceTimestamp: UnixTime(1781600877),
      },
      {
        projectId: ProjectId('celo'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('rise'),
        sinceTimestamp: UnixTime(1767605759), // mainnet genesis 2026-01-05
      },
      {
        projectId: ProjectId('vector'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('sophon'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('lens'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('galxegravity'),
        sinceTimestamp: UnixTime(1771445567),
        untilTimestamp: UnixTime(1763420400),
      },
      {
        projectId: ProjectId('rari'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('blobstream'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('molten'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('winr'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('phala'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('kroma'),
        sinceTimestamp: UnixTime(1771445567),
      },
      {
        projectId: ProjectId('taiko'),
        sinceTimestamp: UnixTime(1774964687),
      },
      {
        projectId: ProjectId('mantle'),
        sinceTimestamp: UnixTime(1778001356),
      },
      {
        projectId: ProjectId('morph'),
        sinceTimestamp: UnixTime(1779354407),
      },
      {
        projectId: ProjectId('base'),
        sinceTimestamp: UnixTime(1779825599), // 2026-05-26 AggregateVerifier upgrade
      },
      {
        projectId: ProjectId('appchain'),
        sinceTimestamp: UnixTime(1780326419),
      },
      {
        projectId: ProjectId('apechain'),
        sinceTimestamp: UnixTime(1780346337),
      },
    ],
    verifierHashes: [
      {
        hash: '0x4388a21c687fdd5f218d7e3d13190cac4c5355818d3605fd5fb811df468ee696',
        name: 'SP1 Hypercube Groth16 v6.1.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.1.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_1_0,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xb69f2584CBcFf99a58C4e7002E8b89Af54a6f4e2',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xD9d5C8456a168Dd25561064F47bF116111131B1D',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0xD9d5C8456a168Dd25561064F47bF116111131B1D',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'sp1hypercube',
          'verificationSteps-0x4388a21c',
        ),
      },
      {
        hash: '0x0e78f4db7a6771a3a6a7d9c3b0de6fe73d58781368967a7fe84d87aefffec896',
        name: 'SP1 Hypercube Groth16 v6.0.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.0.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Groth16.SP1_v6_0_0,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x99A74A05a0FaBEB217C1A329b0dac59a1FA52508',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'sp1hypercube',
          'verificationSteps-0x0e78f4db',
        ),
      },
      {
        hash: '0x5a093a2fcb46394f5cadfe55c44d4d572fad9cec7aeb38026b0278322ef07fac',
        name: 'SP1 Hypercube Plonk v6.1.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.1.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x9774CE99E8Ab3f13582bC6c2Bd2832e5A25C4624',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xD9F24400816c4CC1a3cBb9B851C9B0bAB63Ad692',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'sp1hypercube',
          'verificationSteps-0x5a093a2f',
        ),
      },
      {
        hash: '0xbb1a6f2930e94bfe8b35e794faf43133214534a17d2ad8e51358cad437b3c317',
        name: 'SP1 Hypercube Plonk v6.0.0',
        sourceLink:
          'https://github.com/succinctlabs/sp1/tree/v6.0.0/crates/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'arbitrum',
              '0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'sp1hypercube',
          'verificationSteps-0xbb1a6f29',
        ),
      },
    ],
  },
}
