import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const strk20: BaseProject = {
  id: ProjectId('strk20'),
  slug: 'strk20',
  name: 'STRK-20',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-06-17')),
  statuses: {
    yellowWarning:
      'The SDK and proving stack are not open source yet. L2BEAT currently cannot track STRK-20 contracts, permissions, TVS or privacy flows on Starknet.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A Starknet privacy pool for arbitrary-amount private transfers and DeFi actions, using Cairo virtual execution proofs and auditor-readable compliance data.',
    detailedDescription: readProjectMarkdown('strk20', 'detailedDescription'),
    links: {
      documentation: [
        'https://docs.starknet.io/build/starknet-privacy/overview',
      ],
      explorers: [
        'https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
      ],
      other: ['https://eprint.iacr.org/2026/474'],
    },
    badges: [],
  },
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.TransparentSetup,
    tokens: [],
    attributes: [
      PRIVACY_ATTRIBUTES.upgradeable,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    riskSummary: readProjectMarkdown('strk20', 'riskSummary'),
    upgradesAndGovernance: readProjectMarkdown(
      'strk20',
      'upgradesAndGovernance',
    ),
  },
}
