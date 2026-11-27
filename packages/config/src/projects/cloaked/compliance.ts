import { definePrivacyCompliance } from '../../common/privacyCompliance'

const STEALTH =
  'https://github.com/cloakedxyz/clkd-stealth/blob/9eb359efdd4ea31f5504bf81e57dcfe6f966dc14/src/'
const PRIVACY = 'https://clkd.xyz/docs/privacy'

export const cloakedCompliance = definePrivacyCompliance({
  description:
    "Cloaked uses the user's IP address for sanctions and geographic checks and can refuse quotes or relays, for example for tokenized stocks.",
  powers: [
    {
      ladder: 'privacy',
      rung: 5,
      text: "Cloaked holds every user's viewing key, so it can tie all their addresses and activity to their account.",
      sources: [
        {
          title: 'Viewing key and public spending key shared with the server',
          url: STEALTH + 'client/deriveServerBoundKeys.ts#L16-L53',
        },
        {
          title: 'Privacy policy: retained account data',
          url: PRIVACY,
          checked: '2026-11-27',
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 2,
      text: "Cloaked can refuse quotes or relays after sanctions and geographic checks on the user's IP address.",
      sources: [
        {
          title:
            'Privacy policy: IP addresses are used for sanctions and geographic access controls',
          url: PRIVACY,
          checked: '2026-11-27',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 1,
      text: "No one can block a withdrawal: funds sit in addresses only the user's keys control, and an open tool exports those keys.",
      sources: [
        {
          title:
            'Stealth signing keys mix the spending key with a hashed secret',
          url: STEALTH + 'client/genStealthPrivateKey.ts#L17-L34',
        },
        {
          title: 'Open recovery tool',
          url: 'https://github.com/cloakedxyz/clkd-recovery',
          checked: '2026-11-27',
        },
      ],
    },
  ],
})
