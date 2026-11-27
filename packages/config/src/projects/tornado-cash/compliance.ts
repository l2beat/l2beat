import { definePrivacyCompliance } from '../../common/privacyCompliance'

// The commit governance pinned on tornadocash.eth (proposal 73).
const APP =
  'https://github.com/torndao777-eng/classic-ui/blob/8af0abd14d7eeb734f943b968ce687cb5946eac6/'

export const tornadoCashCompliance = definePrivacyCompliance({
  description:
    "Tornado Cash has no screening or approval list. The app's [compliance page](https://github.com/torndao777-eng/classic-ui/blob/8af0abd14d7eeb734f943b968ce687cb5946eac6/pages/compliance.vue) builds a report that links one of the user's withdrawals to its deposit, for the user to share.",
  disclosure: {
    level: 2,
    text: "The app's compliance page reports one withdrawal with its deposit, which the verifier checks onchain.",
    verifiableWithoutOperator: true,
    singleVerifier: true,
    sources: [
      {
        title: 'Compliance page',
        url: 'https://github.com/torndao777-eng/classic-ui/blob/8af0abd14d7eeb734f943b968ce687cb5946eac6/pages/compliance.vue',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 1,
      text: 'No one holds a screening or approval list, and no one can pause, upgrade or make the pools reveal anything.',
      sources: [
        { contract: 'Pool_0.1_ETH', title: '0.1 ETH pool (no operator)' },
      ],
    },
    {
      ladder: 'funds',
      rung: 1,
      text: 'No one can block a withdrawal, since anyone can prove one directly to an immutable pool without a relayer.',
      sources: [
        {
          contract: 'Pool_1_ETH',
          title: 'withdraw: any caller, relayer optional',
        },
        {
          title: 'Only withdrawals without a relayer need a wallet',
          url: APP + 'components/withdraw/Withdraw.vue#L224-L226',
        },
      ],
    },
  ],
})
