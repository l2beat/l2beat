import { definePrivacyCompliance } from '../../common/privacyCompliance'

// app.umbra.cash serves this commit and shows it in its footer.
const UMBRA =
  'https://github.com/ScopeLift/umbra-protocol/blob/53ed4af5e575919680a4e70c1a090feafe365275/'

const SCREENING_LISTS = {
  title: 'The hardcoded blocklists and the Chainalysis sanctions oracle',
  url: UMBRA + 'umbra-js/src/utils/utils.ts#L927-L1192',
}

export const umbraCompliance = definePrivacyCompliance({
  description:
    "Screening runs in the app only. It refuses wallets, recipients and withdrawal addresses on its blocklist or Chainalysis's sanctions oracle, and hides payments from or to listed addresses.",
  disclosure: {
    level: 1,
    text: "With the open umbra-js library, a user can share one payment's random number, which proves that payment alone.",
    verifiableWithoutOperator: true,
    singleVerifier: true,
    sources: [
      {
        title: 'umbra-js',
        url: 'https://github.com/ScopeLift/umbra-protocol/blob/master/umbra-js/src/classes/Umbra.ts',
        checked: '2026-11-27',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 2,
      text: "ScopeLift's hosted app refuses to connect listed wallets or pay listed recipients.",
      sources: [
        SCREENING_LISTS,
        {
          title: 'Sending checks the recipient',
          url: UMBRA + 'umbra-js/src/classes/Umbra.ts#L226-L227',
        },
        {
          title: 'Connecting checks the wallet address',
          url: UMBRA + 'frontend/src/store/wallet.ts#L289',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 3,
      text: "ScopeLift's hosted app refuses listed withdrawal addresses and hides payments from or to listed addresses.",
      sources: [
        SCREENING_LISTS,
        {
          title: 'Withdrawing checks the destination',
          url: UMBRA + 'frontend/src/components/AccountReceiveTable.vue#L788',
        },
        {
          title: 'Scanning drops payments from or to listed addresses',
          url: UMBRA + 'umbra-js/src/classes/Umbra.ts#L419-L430',
        },
      ],
    },
  ],
  curatedList: true,
})
