import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

// Varuna proofs are verified by Aleo validators and clients, not by a contract
// on a chain L2BEAT indexes, so there are no verifier IDs and no TVS projects.
// The entry exists so that privacy projects that settle on Aleo can reference
// its trusted setup via zkCatalogId.
export const aleo: BaseProject = {
  id: ProjectId('aleo'),
  slug: 'aleo',
  name: 'Aleo Varuna',
  shortName: undefined,
  aliases: ['Aleo', 'snarkVM', 'Varuna'],
  addedAt: UnixTime.fromDate(new Date('2026-11-17')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Varuna is the proof system of the Aleo proof-of-stake blockchain, a Marlin variant with KZG commitments over BLS12-377, verified by every Aleo validator and client.',
    links: {
      websites: ['https://aleo.org', 'https://provable.com'],
      documentation: ['https://docs.aleo.org'],
      repositories: [
        'https://github.com/ProvableHQ/snarkVM',
        'https://github.com/ProvableHQ/snarkOS',
        'https://github.com/AleoNet/aleo-setup',
      ],
      socialMedia: ['https://x.com/AleoHQ'],
    },
    badges: [],
  },
  milestones: [
    {
      // snarkVM d8cd2684a "Update sponge usage" (2026-05-01) makes the batch
      // randomizers absorb the opening proofs. The missing absorb dates back to
      // d795121d4b (2022-08-15), before mainnet genesis (2024-09-04). Veria
      // reported on 04-30, validators ran the patch from 05-03.
      title: 'Varuna proof forgery fixed',
      url: 'https://verialabs.com/blog/forging-transactions-on-aleo/',
      date: '2026-05-03T00:00:00Z',
      description:
        'A missing Fiat-Shamir absorb let anyone forge proofs and spend from any known address.',
      type: 'incident',
    },
    {
      title: 'Aleo mainnet launch',
      url: 'https://github.com/ProvableHQ/snarkVM/blob/c2909c55efb0c2202e7471e3e2efd73de1c4a468/console/network/src/mainnet_v0.rs#L170',
      date: '2024-09-04T00:00:00Z',
      description:
        'Aleo mainnet starts, with Varuna proofs verified by a proof-of-stake validator committee.',
      type: 'general',
    },
  ],
  zkCatalogInfo: {
    creator: 'Provable',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.Other.Varuna,
        ZK_CATALOG_TAGS.PCS.KZG,
        ZK_CATALOG_TAGS.curve['BLS12-377'],
      ],
    },
    proofSystemInfo: readProjectMarkdown('aleo', 'proofSystemInfo'),
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.Aleo,
        proofSystem: ZK_CATALOG_TAGS.Other.Varuna,
      },
    ],
    verifierHashes: [],
  },
}
