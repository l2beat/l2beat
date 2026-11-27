import { definePrivacyCompliance } from '../../common/privacyCompliance'

export const privacyPoolsCompliance = definePrivacyCompliance({
  description:
    "The ASP screens each depositing address before approving its deposit, under 0xbow's own due diligence. It may ask for a Proof of Association, which 0xbow's [separate app](https://tornado.0xbow.io) creates for Tornado Cash withdrawals. Every withdrawal must prove against the ASP's latest list, so a later list can revoke an earlier approval. A deposit without approval can leave only by ragequit.",
  powers: [
    {
      ladder: 'privacy',
      rung: 2,
      text: "0xbow's ASP screens each depositing address and can refuse to approve its deposit.",
      sources: [
        {
          contract: 'PrivacyPoolsEntrypoint',
          title: 'updateRoot: the postman publishes the approved list',
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 3,
      text: "0xbow's ASP can drop an approved deposit from its latest list, which every private withdrawal must prove against.",
      sources: [
        {
          contract: 'PrivacyPoolsEntrypoint',
          title: 'updateRoot: the postman sets a new root with no delay',
        },
        {
          contract: 'PrivacyPoolETH',
          title: 'validWithdrawal: only the latest ASP root is accepted',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 2,
      text: "0xbow's ASP can block a private withdrawal, but the depositing address can always ragequit from the immutable pool in public.",
      sources: [
        {
          contract: 'PrivacyPoolETH',
          title: 'ragequit: only the depositing address, in public',
        },
      ],
    },
  ],
})
