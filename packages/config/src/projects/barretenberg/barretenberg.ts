import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const barretenberg: BaseProject = {
  id: ProjectId('barretenberg'),
  slug: 'barretenberg',
  name: 'Barretenberg',
  shortName: undefined,
  aliases: ['Aztec'],
  addedAt: UnixTime.fromDate(new Date('2026-03-17')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Barretenberg includes several zk-SNARK proof systems built by Aztec, including UltraHonk and CHONK.',
    links: {
      websites: ['https://aztec.network'],
      documentation: [
        'https://barretenberg.aztec.network/docs/',
        'https://eprint.iacr.org/2022/1355',
      ],
      repositories: [
        'https://github.com/AztecProtocol/aztec-packages/tree/next/barretenberg',
      ],
      socialMedia: ['https://x.com/aztecnetwork'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Aztec',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.Plonk.UltraHonk,
        ZK_CATALOG_TAGS.Plonk.CHONK,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.curve.Grumpkin,
        ZK_CATALOG_TAGS.ISA.AVM,
      ],
    },
    proofSystemInfo: readProjectMarkdown('barretenberg', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('aztecnetwork'),
        sinceTimestamp: UnixTime(1774821600), //  Monday, 30. March 2026 at 04:52, aztec launch according to Basti
      },
    ],
    verifierHashes: [
      {
        hash: '0x059ad02b037fcfd4df2b9db771777d067a400f06fc55cf45fa601511e58e2c3e',
        name: 'Barretenberg Aztec verifier v4',
        sourceLink:
          'https://github.com/AztecProtocol/aztec-packages/tree/v4/noir-projects/noir-protocol-circuits',
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x70aEDda427f26480D240bc0f4308ceDec8d31348',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'barretenberg',
          'verificationSteps-0x059ad02b',
        ),
      },
      {
        hash: '0x2f0ca3e610369fc41f7fb8a69995a96428fbf69d7dffd2b576e63ba4d9511ee1',
        name: 'Barretenberg Aztec verifier v5',
        sourceLink:
          'https://github.com/AztecProtocol/aztec-packages/tree/v5.0.0/noir-projects/noir-protocol-circuits',
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x098f47c00F4df22a8030746Eb11378236C24b4bC',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'barretenberg',
          'verificationSteps-0x2f0ca3e6',
        ),
      },
    ],
  },
}
