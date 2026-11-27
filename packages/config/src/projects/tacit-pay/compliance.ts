import { definePrivacyCompliance } from '../../common/privacyCompliance'
import { TACIT_COMMIT, TACIT_REPOSITORY } from './adversaries'

const TACIT = `${TACIT_REPOSITORY}/blob/${TACIT_COMMIT}/`

export const tacitPayCompliance = definePrivacyCompliance({
  description:
    "Nothing in the contracts or the app screens users, and only the user holds the keys that decrypt their notes. The pool, its router and verifier are immutable and cannot be paused, and any account can submit a withdrawal proof without Tacit's relay.",
  powers: [
    {
      ladder: 'privacy',
      rung: 1,
      text: 'No one can refuse a deposit or view notes: nothing screens users, and only the user holds their viewing key.',
      sources: [
        { contract: 'TacitEvmPool', title: 'No owner, allowlist or admin' },
        {
          title: "Keys derive from the user's own wallet signature",
          url: TACIT + 'dapp/identity-message.js',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 1,
      text: 'No one can block a withdrawal: the pool is immutable and unpausable, and users can submit their own proofs.',
      sources: [
        { contract: 'TacitEvmPool' },
        { section: 'upgrades-and-governance' },
      ],
    },
  ],
})
