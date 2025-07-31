import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const stone: BaseProject = {
  id: ProjectId('stone'),
  slug: 'stone',
  name: 'Stone',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-14')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Stone is a proving systems for programs written with Cairo language. Originally build by Starkware for proving Starknet state transition.',
    links: {
      websites: [
        'https://starkware.co',
        'https://starkware.co/blog/open-sourcing-the-battle-tested-stone-prover/',
      ],
      documentation: ['https://docs.starknet.io/architecture/sharp/'],
      repositories: ['https://github.com/starkware-libs/stone-prover'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Starkware',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Stone,
        ZK_CATALOG_TAGS.ISA.CASM,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.felt252,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.TransparentSetup,
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
      },
    ],
    verifierHashes: [
      {
        // Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier)
        // in hex format '0x...'
        hash: '0x5ed8957171b466464570ba10b3d5c5adfc54546ba56278129af5ae63a0d4ad22',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
        knownDeployments: [
          'https://etherscan.io/address/0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942',
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('starknet'),
          ProjectId('apex'),
          ProjectId('canvasconnect'),
          ProjectId('immutablex'),
          ProjectId('layer2financezk'),
          ProjectId('myria'),
          ProjectId('paradex'),
          ProjectId('reddioex'),
          ProjectId('deversifi'),
          ProjectId('sorare'),
          ProjectId('brine'),
        ],
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex format '0x...'",
      },
      {
        hash: '0xe12a7131035327b1f54cf3163d124b71da052535e71f64bbd9c2a460ec3a43f0',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
        knownDeployments: [
          'https://etherscan.io/address/0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('dydx')],
        description:
          'Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier)',
      },
    ],
  },
}
