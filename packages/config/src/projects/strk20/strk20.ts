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
      'The proven program is not made available so it is unknown what logic is verified by the smart contract. Furthermore, real-time monitoring for this project is not supported.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A privacy pool on Starknet for arbitrary-amount private transfers and DeFi actions, using Cairo execution proofs and auditor-accessible compliance data.',
    detailedDescription: readProjectMarkdown('strk20', 'detailedDescription'),
    links: {
      documentation: [
        'https://docs.starknet.io/build/starknet-privacy/overview',
      ],
      websites: ['https://strk20.starknet.io/'],
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
      {
        ...PRIVACY_ATTRIBUTES.upgradeable,
        description: 'Smart contract code can be upgraded instantly by an EOA.',
      },
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
      {
        ...PRIVACY_ATTRIBUTES.enforcedCompliance,
        description:
          "A permissioned 'auditor' key can link private transfers at any time, including retroactively.",
      },
      PRIVACY_ATTRIBUTES.closedSource,
    ],
    riskSummary: readProjectMarkdown('strk20', 'riskSummary'),
    upgradesAndGovernance: readProjectMarkdown(
      'strk20',
      'upgradesAndGovernance',
    ),
  },
}
