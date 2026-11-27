import { definePrivacyCompliance } from '../../common/privacyCompliance'

const KIT =
  'https://github.com/fluidkey/fluidkey-stealth-account-kit/blob/2a4ccfafef127165c11ba16fc16235c919698ec2/src/'
const HIDE_TRAIL = 'https://docs.fluidkey.com/readme/advanced-privacy/'

export const fluidkeyCompliance = definePrivacyCompliance({
  description:
    'Bank transfers through Noah need identity verification. Hide Trail, an optional route for more privacy, sends funds through Houdini and two exchanges, which see the route and can hold the funds.',
  disclosure: {
    level: 5,
    text: "Fluidkey's open kit extracts the viewing key, which reveals every past and future Safe and cannot be revoked.",
    verifiableWithoutOperator: true,
    singleVerifier: true,
    sources: [
      {
        title: 'Stealth account kit',
        url: 'https://github.com/fluidkey/fluidkey-stealth-account-kit/blob/main/src/extractViewingPrivateKeyNode.ts',
        checked: '2026-11-27',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 5,
      text: "Fluidkey holds every user's viewing key, so it can link all their Safes and tie their activity to their account.",
      sources: [
        {
          title: 'Private viewing key shared with the service',
          url: KIT + 'extractViewingPrivateKeyNode.ts#L14-L30',
        },
        {
          title: 'Verification results and identity attributes',
          url: 'https://www.fluidkey.com/privacy',
          checked: '2026-11-27',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 3,
      text: 'On Hide Trail, an optional route in the app, Houdini and two exchanges with AML monitoring can hold the funds.',
      sources: [
        {
          title: 'Hide Trail routes funds through two exchanges',
          url: HIDE_TRAIL,
          checked: '2026-11-27',
        },
      ],
    },
  ],
  identityAtEntry: true,
})
