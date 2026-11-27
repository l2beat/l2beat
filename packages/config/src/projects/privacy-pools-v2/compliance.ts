import { definePrivacyCompliance } from '../../common/privacyCompliance'

export const privacyPoolsV2Compliance = definePrivacyCompliance({
  description:
    "The ASP screens each depositor before approving the deposit, under 0xbow's own due diligence, and may reject it. A rejected deposit can leave only by ragequit.",
  disclosure: {
    level: 1,
    text: "The app exports a receipt for one note, which the verifier checks against the pool's events.",
    verifiableWithoutOperator: true,
    singleVerifier: true,
    sources: [
      {
        title: 'Audit receipt',
        url: 'https://github.com/0xbow-io/privacy-pools-website-v2/blob/c7e5470e0e96ba750d6ce2e7fcf19cca9eb56f28/services/audit-receipt.ts',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 2,
      text: "0xbow's ASP screens each depositor and can refuse to approve the deposit.",
      sources: [
        {
          contract: 'ASPRegistry',
          title: 'updateASPRoot: the postman publishes the approved list',
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 3,
      text: "0xbow's ASP can drop an approved label from its latest list, which every private spend must prove against.",
      sources: [
        {
          contract: 'ASPRegistry',
          title: 'updateASPRoot: the postman sets a new root with no delay',
        },
        {
          contract: 'PoolVault',
          title: 'transact: only the latest ASP root is accepted',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 3,
      text: "The admin multisig can lower the state tree's capacity so it fills, which stops every ragequit along with private exits.",
      sources: [
        {
          contract: 'PoolVault',
          title:
            'maxStateTreeSize: a full tree stops deposits, transacts and ragequits',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
  ],
})
