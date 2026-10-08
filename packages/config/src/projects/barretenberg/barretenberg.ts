import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const ZK_MONEY_CIRCUITS =
  'https://github.com/aztec-labs-eng/zkmoney-public/tree/68425f9cf408ac803eade04d10318fcf345444a0/vendor/oxide/noir-projects/'

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
      {
        projectId: ProjectId('payy'),
        sinceTimestamp: UnixTime(1771324355), // 2026-02-17T10:32:35Z, payy rollup deployment on Ethereum
      },
      {
        projectId: ProjectId('zkmoney'),
        sinceTimestamp: UnixTime(1790298635), // 2026-09-25T01:10:35Z, ZkMoneyPortal deployment
      },
    ],
    verifierHashes: [
      // {
      //   hash: '0x059ad02b037fcfd4df2b9db771777d067a400f06fc55cf45fa601511e58e2c3e',
      //   name: 'Barretenberg Aztec verifier v4',
      //   sourceLink:
      //     'https://github.com/AztecProtocol/aztec-packages/tree/v4/noir-projects/noir-protocol-circuits',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
      //   knownDeployments: [
      //     {
      //       address: ChainSpecificAddress.fromLong(
      //         'ethereum',
      //         '0x70aEDda427f26480D240bc0f4308ceDec8d31348',
      //       ),
      //     },
      //   ],
      //   verificationStatus: 'successful',
      //   attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      //   verificationSteps: readProjectMarkdown(
      //     'barretenberg',
      //     'verificationSteps-0x059ad02b',
      //   ),
      // },
      {
        hash: '0x0f8581a994b714ef6fcffeaea9777e69e6bc7c0140a039a23afc764d8e863328',
        name: 'Payy aggregate verifier',
        sourceLink:
          'https://github.com/polybase/payy/tree/dcd5d96ee15664a59bc24ed0dc2bb78b73ac5e36/noir/agg_final',
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x14DACD534ddc676601B27f41Eb541a7951524a2F',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'barretenberg',
          'verificationSteps-0x0f8581a9',
        ),
        description:
          'UltraHonk verifier generated with Barretenberg from the final proof aggregation Noir circuit (agg_final) of Payy. The hash is the verification key hash hardcoded in the deployed verifier contract.',
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
      {
        hash: '0x05ea6d9d0a0b1b837f081862dd77aae6bc047fb822b9cf7055ef68719b04198e',
        name: 'zk.money frozen notes refund verifier',
        description:
          'Verifies refunds of notes that were unspent when the zk.money portal was frozen. Generated without the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}frozen_notes_refund`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x0694fF404DDA586C73EfCe21f34fe084541BB877',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'barretenberg',
          'verificationSteps-zkmoney',
        ),
      },
      {
        hash: '0x2290cfb58dea33c485e0ac33581c1c8d358ac3dd9f434470b6cf87da12b5fd43',
        name: 'zk.money frozen deposit refund verifier',
        description:
          'Verifies refunds of deposits that reached Aztec but were unspent when the zk.money portal was frozen. Generated without the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}frozen_deposit_refund`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xa2fd594dCA2d598aF231d615E5D34903154C3cCe',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'barretenberg',
          'verificationSteps-zkmoney',
        ),
      },
      {
        hash: '0x080b44509f327b7b0ee935247a069be5def58e0edf1b52721d9c42f5918c390c',
        name: 'zk.money unprocessed deposit refund verifier',
        description:
          'Verifies refunds of deposits that had not reached Aztec when the zk.money portal was frozen. Generated without the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}unprocessed_deposit_refund`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'barretenberg',
          'verificationSteps-zkmoney',
        ),
      },
      {
        hash: '0x279d6dad93155d6c03ddd050359fb4675a66c08812b5306f6dfc9754e42827b7',
        name: 'zk.money resolver verifier',
        description:
          'Verifies that the secret behind a deposit address returned for a zk.money name was derived from the registered user and resolver operator keys, and binds the address to the registered Aztec address. Generated with the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}resolver_circuit`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'barretenberg',
          'verificationSteps-zkmoney',
        ),
      },
    ],
  },
}
