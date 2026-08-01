import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
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
    tokens: [],
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The pool implementation is immediately upgradeable, so users have no delay to withdraw before a malicious upgrade can take effect.',
      walkawayTest: {
        passed: false,
        reason:
          'Currently, only centrally operated provers can generate ZK proofs for interacting with STRK-20.',
      },
    },
    reproducibility: {
      value: 'Not published',
      sentiment: 'bad',
      description:
        'The STRK-20 protocol program and the sources for proving stack are not published. Users cannot independently verify the correctness of STRK-20 ZK program. They also cannot generate required ZK proofs locally and are forced to reveal private data to third party - the prover.',
    },
    privacy: {
      value: 'Admin view key',
      sentiment: 'bad',
      description:
        'All private actions include auditor-encrypted metadata, so whoever controls the auditor private key can decrypt user activity retroactively. Users can not know whether their privacy was violated. Compliance is facilitated by this mandatory auditor-encrypted metadata.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    quantumResistant: true,
    riskSummary: readProjectMarkdown('strk20', 'riskSummary'),
    upgradesAndGovernance: readProjectMarkdown(
      'strk20',
      'upgradesAndGovernance',
    ),
  },
}
