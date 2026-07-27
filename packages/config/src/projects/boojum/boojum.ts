import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const boojum: BaseProject = {
  id: ProjectId('boojum'),
  slug: 'boojum',
  name: 'Boojum',
  shortName: undefined,
  aliases: ['Matter Labs', 'ZKsync'],
  addedAt: UnixTime.fromDate(new Date('2025-07-11')),
  display: {
    description:
      'Boojum is a zk proving system for EraVM programs built by Matter Labs to prove ZKsync Era state transition.',
    links: {
      documentation: [
        'https://matter-labs.github.io/zksync-era/core/latest/specs/prover/getting_started.html',
        'https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/14_zk_deeper_overview.html',
        'https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/15_prover_keys.html',
      ],
      repositories: ['https://github.com/matter-labs/era-boojum'],
    },
    badges: [],
  },
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  zkCatalogInfo: {
    creator: 'Matter Labs',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Boojum,
        ZK_CATALOG_TAGS.ISA.EraVM,
        // ZK_CATALOG_TAGS.Arithmetization.Plonkish,
        ZK_CATALOG_TAGS.Field.Goldilocks,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Bellman,
        ZK_CATALOG_TAGS.Fflonk.Zksync,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('boojum', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('zklinknova'),
        sinceTimestamp: UnixTime(1709217961),
      },
      {
        projectId: ProjectId('zksync2'),
        sinceTimestamp: UnixTime(1689544800),
      },
      {
        projectId: ProjectId('abstract'),
        sinceTimestamp: UnixTime(1737932400),
      },
      {
        projectId: ProjectId('sophon'),
        sinceTimestamp: UnixTime(1734476400),
      },
      {
        projectId: ProjectId('cronoszkevm'),
        sinceTimestamp: UnixTime(1723672800),
      },
      {
        projectId: ProjectId('zeronetwork'),
        sinceTimestamp: UnixTime(1731366000),
      },
      {
        projectId: ProjectId('lens'),
        sinceTimestamp: UnixTime(1743717600),
      },
      {
        projectId: ProjectId('wonder'),
        sinceTimestamp: UnixTime(1746741600),
      },
      {
        projectId: ProjectId('zkcandy'),
        sinceTimestamp: UnixTime(1743976800),
      },
      {
        projectId: ProjectId('grvt'),
        sinceTimestamp: UnixTime(1734649200),
      },
      {
        projectId: ProjectId('lachain'),
        sinceTimestamp: UnixTime(1747692000),
      },
    ],
    verifierHashes: [
      {
        hash: '0xe4503cf38485e3d728a7362155d53d3d63293e2fa48dca4f5588aa4625de251f',
        name: 'Boojum Fflonk v29.3 verifier',
        sourceLink:
          'https://github.com/matter-labs/zksync-era/tree/f57999997f581b557cf8e36e3a9be5650d992022/prover',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xE3743181a4b0A0C1260826105c6BBA4b6e18D79d',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'boojum',
          'verificationsSteps-0xe4503cf3',
        ),
      },
      // {
      //   hash: '0x17e8d7931f1314431359233e65c22657a32c335205e3c24ce292c5819becfaa7',
      //   proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0xD5dBE903F5382B052317D326FA1a7B63710C6a5b',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      // {
      //   hash: '0x941fd36f78a5ba753dbbe65b9123a43ae833405fafd03b5149b959eee766e03c',
      //   proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: '0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF',
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      {
        hash: '0x93e83aa1ec05a2ac4de1f0b241394efb9f94a4e7c1784a5a9bf6b85eb930c62a',
        name: 'Boojum Plonk v29.3 verifier',
        sourceLink:
          'https://github.com/matter-labs/zksync-era/tree/f57999997f581b557cf8e36e3a9be5650d992022/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xB3f4396C2040e502d0556Cbb16C0B22fE777A026',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'boojum',
          'verificationSteps-0x93e83aa1',
        ),
      },
      // {
      //   hash: '0xd90459c5b727b9ceeb2b6192d2953dbf05970edf090333b3ad3bcac1a1442b78',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      // {
      //   hash: '0xf688611ad4e0ef20184a89e7b593493dffcefe92071f85c1a0b94d4852c4f82f',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     {
      //       address: '0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e',
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      // {
      //   hash: '0x14f97b81e54b35fe673d8708cc1a19e1ea5b5e348e12d31e39824ed4f42bbca2',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     'https://etherscan.io/address/0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5',
      //   ],
      //   verificationStatus: 'notVerified',
      //   usedBy: [ProjectId('treasure')],
      // },
      {
        hash: '0x8574e152c41dc39a2ecab984545e1cf21cb3ec250b919018a8053f2fa270784f',
        name: 'Boojum Plonk zkLinkNova verifier',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'linea',
              '0x902C3806A84f4e855a8746e92d7F1C9a51400458',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0xb2f50340e0edbe49dc657d4eb298e07f13860c1be0fe2e438e44ef8fad133d84',
        name: 'Boojum Plonk core-v29.11.1',
        sourceLink:
          'https://github.com/matter-labs/zksync-era/tree/core-v29.11.1/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x7f33D100f482093182111d69a4a457289e99f4ec',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'boojum',
          'verificationSteps-0xb2f50340',
        ),
      },
      {
        hash: '0xc8cd705a0db89577146137de78eba6bd1f1c9c3f66dc52f7627e7c2df30895b2',
        name: 'Boojum Fflonk core-v29.11.1',
        sourceLink:
          'https://github.com/matter-labs/zksync-era/tree/core-v29.11.1/prover',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xa38a0Df579F9eCA29fbA560b9885B1113b1Df442',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'boojum',
          'verificationSteps-0xc8cd705a',
        ),
      },
      // {
      //   hash: '0x49eae0bf5c7ea580f4979b366e52b386adc5f42e2ce50fc1d3c4de9a86052bff',
      //   name: 'Boojum Fflonk core-v29.4.0',
      //   sourceLink:
      //     'https://github.com/matter-labs/zksync-era/tree/core-v29.4.0/prover',
      //   proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: ChainSpecificAddress.fromLong(
      //         'ethereum',
      //         '0xD324a7c8556A059371B207fB96FD77bE24E2042c',
      //       ),
      //     },
      //   ],
      //   verificationStatus: 'successful',
      //   attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      //   verificationSteps: readProjectMarkdown(
      //     'boojum',
      //     'verificationSteps-0x49eae0bf',
      //   ),
      // },
      // {
      //   hash: '0x1ffc56111a5cfaf5db387f6a31408ad20217e9bc1f31f2f5c1bd38b0d6d7968b',
      //   name: 'Boojum Plonk prover-v23.2.0',
      //   sourceLink:
      //     'https://github.com/matter-labs/zksync-era/tree/prover-v23.2.0/prover',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     {
      //       address: ChainSpecificAddress.fromLong(
      //         'ethereum',
      //         '0xe201837d151E5aC33Af3305f287Ad6F6a7Dfccd7',
      //       ),
      //     },
      //   ],
      //   verificationStatus: 'successful',
      //   attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      //   verificationSteps: readProjectMarkdown(
      //     'boojum',
      //     'verificationSteps-0x1ffc5611',
      //   ),
      // },
    ],
  },
}
