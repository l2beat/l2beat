import {
  assert,
  ChainSpecificAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const ZK_MONEY_CIRCUITS =
  'https://github.com/aztec-labs-eng/zkmoney-public/tree/68425f9cf408ac803eade04d10318fcf345444a0/vendor/oxide/noir-projects/'

const zkMoneyDiscovery = new ProjectDiscovery('zkmoney')
const aztecDiscovery = new ProjectDiscovery('aztecnetwork')
const ZK_MONEY_RELATIONS_LIB_HASH =
  '0x017e9069df063e1170d13ae9d49ca3f3ad737d4ca9db5ec30562e21faed3d334'
const ZK_MONEY_TRANSCRIPT_LIB_HASH =
  '0x608ffafa2dbec7cdd253ebe199e43765948e017a6bfcc141acfbed57e95394d8'

// The verifier keys have no getters. Discovery exposes their internal
// constants through source-matched templates, so reject stale annotations.
function getVerifierKeyHash(
  discovery: ProjectDiscovery,
  names: [string, ...string[]],
  expectedKeyHash: string,
  expectedSourceHash: string,
  expectedLibraryHashes: string[] = [],
): string {
  const keyHash = discovery.getContractValue<string>(
    names[0],
    'verificationKeyHash',
  )
  for (const name of names) {
    const contract = discovery.getContract(name)
    assert(
      contract.sourceHashes?.length === 1 &&
        contract.sourceHashes[0] === expectedSourceHash,
      'Verifier source changed, reproduce its circuit before updating the catalog',
      { verifier: name },
    )
    assert(
      discovery.getContractValue<string>(name, 'verificationKeyHash') ===
        expectedKeyHash,
      'Discovered verifier key differs from the reproduced key',
      { verifier: name },
    )
    const libraries =
      discovery.getContractValueOrUndefined<ChainSpecificAddress[]>(
        name,
        '$libraries',
      ) ?? []
    const libraryHashes = libraries.map((address) => {
      const library = discovery.getContract(address)
      assert(
        library.sourceHashes?.length === 1,
        'Verifier library needs a single verified source',
        { verifier: name, library: address },
      )
      return library.sourceHashes[0]
    })
    assert(
      libraryHashes.sort().join(',') ===
        [...expectedLibraryHashes].sort().join(','),
      'Verifier library sources changed, recheck the reproduced verifier',
      { verifier: name },
    )
  }
  return keyHash
}

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
        hash: getVerifierKeyHash(
          aztecDiscovery,
          ['HonkVerifier'],
          '0x2f0ca3e610369fc41f7fb8a69995a96428fbf69d7dffd2b576e63ba4d9511ee1',
          '0x571cb1ad009254f2861d4e9f714fd96b9650ac98914a54037baa51a782d166b3',
        ),
        name: 'Barretenberg Aztec verifier v5',
        sourceLink:
          'https://github.com/AztecProtocol/aztec-packages/tree/v5.0.0/noir-projects/noir-protocol-circuits',
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: aztecDiscovery.getContract('HonkVerifier').address,
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
        hash: getVerifierKeyHash(
          zkMoneyDiscovery,
          ['FrozenNotesRefundVerifier', 'FrozenNotesRefundVerifier_sUSDS'],
          '0x05ea6d9d0a0b1b837f081862dd77aae6bc047fb822b9cf7055ef68719b04198e',
          '0x5d55267ee005d05d45a308ff6053276ff510b8c1b1cb98729e0e7702c9679d1e',
          [ZK_MONEY_RELATIONS_LIB_HASH],
        ),
        name: 'zk.money frozen notes refund verifier',
        description:
          'Verifies refunds of notes that were unspent when the zk.money portal was frozen. Generated without the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}frozen_notes_refund`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: zkMoneyDiscovery.getContract('FrozenNotesRefundVerifier')
              .address,
          },
          {
            address: zkMoneyDiscovery.getContract(
              'FrozenNotesRefundVerifier_sUSDS',
            ).address,
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
        hash: getVerifierKeyHash(
          zkMoneyDiscovery,
          ['FrozenDepositRefundVerifier', 'FrozenDepositRefundVerifier_sUSDS'],
          '0x2290cfb58dea33c485e0ac33581c1c8d358ac3dd9f434470b6cf87da12b5fd43',
          '0x2599443408cdb65c811611ef0f6b0aa4ac75624823fca394f22f8898c1440d5d',
          [ZK_MONEY_RELATIONS_LIB_HASH],
        ),
        name: 'zk.money frozen deposit refund verifier',
        description:
          'Verifies refunds of deposits that reached Aztec but were unspent when the zk.money portal was frozen. Generated without the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}frozen_deposit_refund`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: zkMoneyDiscovery.getContract('FrozenDepositRefundVerifier')
              .address,
          },
          {
            address: zkMoneyDiscovery.getContract(
              'FrozenDepositRefundVerifier_sUSDS',
            ).address,
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
        hash: getVerifierKeyHash(
          zkMoneyDiscovery,
          [
            'UnprocessedDepositRefundVerifier',
            'UnprocessedDepositRefundVerifier_sUSDS',
          ],
          '0x080b44509f327b7b0ee935247a069be5def58e0edf1b52721d9c42f5918c390c',
          '0x3ea198cde16f8721f12298a5e60de6838d18cc87753fa9a9481c6292e4a94f09',
          [ZK_MONEY_RELATIONS_LIB_HASH],
        ),
        name: 'zk.money unprocessed deposit refund verifier',
        description:
          'Verifies refunds of deposits that had not reached Aztec when the zk.money portal was frozen. Generated without the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}unprocessed_deposit_refund`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: zkMoneyDiscovery.getContract(
              'UnprocessedDepositRefundVerifier',
            ).address,
          },
          {
            address: zkMoneyDiscovery.getContract(
              'UnprocessedDepositRefundVerifier_sUSDS',
            ).address,
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
        hash: getVerifierKeyHash(
          zkMoneyDiscovery,
          ['ResolverVerifier'],
          '0x279d6dad93155d6c03ddd050359fb4675a66c08812b5306f6dfc9754e42827b7',
          '0x4037936aa34f65195d0dc7ef3c98cc82e4f969470558a15ede8590867175baf2',
          [ZK_MONEY_RELATIONS_LIB_HASH, ZK_MONEY_TRANSCRIPT_LIB_HASH],
        ),
        name: 'zk.money resolver verifier',
        description:
          'Verifies that the secret behind a deposit address returned for a zk.money name was derived from the registered user and resolver operator keys, and binds the address to the registered Aztec address. Generated with the zero-knowledge option.',
        sourceLink: `${ZK_MONEY_CIRCUITS}resolver_circuit`,
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: zkMoneyDiscovery.getContract('ResolverVerifier').address,
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
