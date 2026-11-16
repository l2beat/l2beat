import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CROP_NOTES } from '../../common/crops'
import { CROP_ATTESTATION_SOURCE } from '../../crops/attestations'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('eas')

const version = discovery.getContractValue<string>('EAS', 'VERSION')

// The description states which later versions changed what. A new version on
// Ethereum would be a new deployment and needs its own review.
assert(
  version === '0.26' &&
    discovery.getContractValue<string>('SchemaRegistry', 'VERSION') === version,
  'EAS on Ethereum is no longer v0.26, review the page',
)

// The page says ETHBEAT attests its CROPS reviews through this deployment.
assert(
  discovery.getContract('EAS').address.endsWith(CROP_ATTESTATION_SOURCE.eas) &&
    CROP_ATTESTATION_SOURCE.chainId === 1,
  'The CROPS attestations moved off this EAS deployment, update the page',
)

const deployedIn = (contract: string): string => {
  const since = discovery.getContract(contract).sinceTimestamp
  if (since === undefined) {
    throw new Error('Missing deployment time', { cause: { contract } })
  }
  return new Date(since * 1000).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export const eas: BaseProject = {
  id: ProjectId('eas'),
  slug: 'eas',
  name: 'EAS',
  shortName: undefined,
  addedAt: UnixTime(1794787200), // 2026-11-16
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `EAS, the Ethereum Attestation Service, is a public record of attestations: statements that an address makes onchain, about anything. Anyone can register a schema, which sets the fields of its attestations, then attest under it and read what others attested. A schema's creator can add a resolver, a contract that accepts or rejects attestations under that schema. Only the attester can revoke an attestation. This page covers EAS v${version} on Ethereum. Its two contracts are immutable, have no owner and do not hold user funds.`,
    detailedDescription: readProjectMarkdown('eas', 'detailedDescription', {
      version,
      deployDate: deployedIn('EAS'),
    }),
    links: {
      websites: ['https://attest.org/', 'https://easscan.org/'],
      documentation: ['https://docs.attest.org/'],
      repositories: [
        'https://github.com/ethereum-attestation-service/eas-contracts',
        'https://github.com/ethereum-attestation-service/eas-sdk',
        'https://github.com/ethereum-attestation-service/easctl',
      ],
      socialMedia: ['https://x.com/eas_eth'],
    },
    references: [
      {
        title: `EAS v${version} source at the commit of the Ethereum deployment`,
        url: 'https://github.com/ethereum-attestation-service/eas-contracts/tree/aefff5aea2b61b4d86f5af016bc51b6acf3685fc',
      },
      {
        title: 'The refund fix that later EAS versions include',
        url: 'https://github.com/ethereum-attestation-service/eas-contracts/commit/16b6d422dcae4e834c6c58bc583dcf9361011d1d',
      },
      {
        title: 'EAS documentation: FAQ entry on the audit',
        url: 'https://docs.attest.org/docs/quick--start/faqs',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Attestations',
  },
  // Declared empty on purpose: the contracts depend on no oracle, bridge or
  // other external contract. A resolver is chosen per schema by its creator.
  externalDependencies: [],
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        'The contracts are immutable and cannot be paused.',
        'Anyone can register a schema, timestamp data and attest under any schema without a resolver.',
        'Only its attester can revoke an attestation, and no one can change or delete one.',
        CROP_NOTES.passesWalkawayTest(
          'attestations are made and read with direct contract calls, without the team or easscan.org.',
        ),
      ],
      additionalConsiderations: [
        "A schema's resolver contract can reject any attestation or revocation under that schema."
      ],
    },
    openSource: {
      sentiment: 'good',
      license: 'MIT',
      points: [
        'The contracts and the SDK are published under the MIT license.',
        'The contracts are verified onchain, and a local build of the source at the deployment commit reproduces the deployed code.',
        'The SDK and the command-line tool easctl attest, revoke and read through any Ethereum node.',
      ],
      additionalConsiderations: [
        'The source of easscan.org, the explorer and no-code interface of the EAS team, is not published.',
        'The indexer that the EAS team publishes for self-hosting has no license file.',
      ],
    },
    privacy: {
      status: 'fullyTransparent',
      points: [
        'Onchain attestations are fully transparent: attester, recipient, schema and data are public.',
      ],
      additionalConsiderations: [
        'An offchain attestation is a signed message that never reaches the chain. Any holder can pass it on or publish it, signature included.',
        'A private data attestation contains only a salted hash of its fields. The holder reveals chosen fields in the clear.',
        "Timestamping or revoking an offchain attestation onchain shows its id and the sender's address.",
      ],
    },
    security: {
      sentiment: 'good',
      points: [
        'EAS and the SchemaRegistry are immutable and have no owner.',
        'An attestation names an address as attester only if that address sent it or signed it.',
        'EAS does not hold user funds. It forwards ETH sent with an attestation to the resolver in the same transaction.',
        'No external dependency: no oracle, no bridge.',
      ],
      additionalConsiderations: [
        'ETH sent with an attestation under a schema without a resolver stays in the contract for good.',
        "EAS's validity check only tells that an attestation exists. An app must check revocation and expiry itself.",
        'A signature for a delegated attestation has no deadline and no way to cancel it directly.',
        'The EAS documentation names an audit by Spearbit and links no report.',
        'No circuit breakers or rate limits. A bug in EAS would reach every app that relies on its attestations.',
      ],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
