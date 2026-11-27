import { definePrivacyCompliance } from '../../common/privacyCompliance'

const VAULT =
  'https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/protocol/contracts/src/ZkApiVault.sol'

export const zkApiCompliance = definePrivacyCompliance({
  description:
    'The vault has no onchain screening. The operator can refuse keys or clearance.',
  powers: [
    {
      ladder: 'privacy',
      rung: 3,
      text: "The operator, Open Anonymity, can cancel an escape with the user's request proof, which publishes that request's link onchain.",
      sources: [
        {
          title:
            'Any request proof for the withdrawn balance cancels an escape',
          url: `${VAULT}#L162-L188`,
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 3,
      text: 'The operator, Open Anonymity, can refuse a cooperative close, leaving the user a challengeable escape.',
      sources: [
        {
          title: "A cooperative close needs the operator's clearance",
          url: `${VAULT}#L115-L126`,
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 5,
      text: 'The owner, Open Anonymity, can pause the vault until notes expire, and anyone then sweeps them to its treasury.',
      sources: [
        {
          title: 'Pausing blocks closes and new escapes',
          url: `${VAULT}#L115-L132`,
        },
        {
          title: 'Expired notes go to the treasury',
          url: `${VAULT}#L208-L218`,
        },
        { contract: 'ZkApiVault', title: 'pause' },
      ],
    },
  ],
})
