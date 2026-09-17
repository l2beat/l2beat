import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

// Orchard proofs are verified by Zcash consensus nodes, not by a contract on
// a chain L2BEAT indexes, so there are no verifier IDs and no TVS projects.
// The entry exists so that privacy projects that settle into the Zcash
// shielded pool can reference its (transparent) setup via zkCatalogId.
export const zcash: BaseProject = {
  id: ProjectId('zcash'),
  slug: 'zcash',
  name: 'Zcash Orchard',
  shortName: undefined,
  aliases: ['Zcash', 'Halo 2', 'Ironwood'],
  addedAt: UnixTime.fromDate(new Date('2026-09-16')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Orchard is the shielded protocol (with its latest pool called Ironwood) of the Zcash PoW blockchain. Its circuit is proven with Halo 2, a PLONKish proof system with a transparent IPA commitment over the Pasta curves, and verified by every Zcash full node.',
    links: {
      websites: ['https://z.cash', 'https://electriccoin.co'],
      documentation: [
        'https://zips.z.cash/protocol/protocol.pdf',
        'https://zips.z.cash/zip-0224',
        'https://zcash.github.io/halo2/',
        'https://zcash.github.io/orchard/',
      ],
      repositories: [
        'https://github.com/zcash/halo2',
        'https://github.com/zcash/orchard',
        'https://github.com/zcash/pasta_curves',
        'https://github.com/ZcashFoundation/zebra',
      ],
      socialMedia: ['https://x.com/zcash', 'https://x.com/ElectricCoinCo'],
    },
    badges: [],
  },
  milestones: [
    {
      title: 'NU5 activates the Orchard shielded pool',
      url: 'https://zips.z.cash/zip-0252',
      date: '2022-05-31T17:50:05Z',
      description:
        'Mainnet block 1687104 activates NU5, adding the Orchard shielded protocol with Halo 2 proofs alongside the Groth16-based Sapling pool.',
      type: 'general',
    },
    {
      title: '[Disclosed vulnerability] Orchard Action circuit soundness bug',
      url: 'https://github.com/zcash/zcash/security/advisories/GHSA-ghc3-g8w4-whf9',
      date: '2026-06-03T04:03:00Z',
      description:
        'A missing copy constraint in the halo2_gadgets variable-base scalar multiplication left the Orchard Action circuit under-constrained, allowing counterfeiting inside the pool. Orchard was disabled by an emergency soft fork at block 3363426 (2026-06-02) and re-enabled with a fixed circuit at NU6.2, block 3364600.',
      type: 'incident',
    },
    {
      title: 'NU6.3 creates the Ironwood pool',
      url: 'https://zips.z.cash/zip-0258',
      date: '2026-07-28T14:07:23Z',
      description:
        'Mainnet block 3428143 activates NU6.3, which opens the Ironwood pool with quantum-recoverable notes (ZIP 2005) and restricts the legacy Orchard pool to same-address transfers. Both pools use the Orchard Action circuit.',
      type: 'general',
    },
  ],
  zkCatalogInfo: {
    creator: 'Electric Coin Company',
    audits: [
      {
        company: 'NCC Group',
        url: 'https://research.nccgroup.com/2021/11/02/public-report-zcash-nu5-cryptography-review/',
      },
      {
        company: 'QEDIT',
        url: 'https://hackmd.io/@qedit/zcash-nu5-audit',
      },
    ],
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.Plonk.Halo2,
        // ZK_CATALOG_TAGS.Arithmetization.Plonkish,
        ZK_CATALOG_TAGS.PCS.IPA,
        ZK_CATALOG_TAGS.curve.Pallas,
        ZK_CATALOG_TAGS.curve.Vesta,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
    },
    proofSystemInfo: readProjectMarkdown('zcash', 'proofSystemInfo'),
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.TransparentSetup,
        proofSystem: ZK_CATALOG_TAGS.Plonk.Halo2,
      },
    ],
    verifierHashes: [],
  },
}
