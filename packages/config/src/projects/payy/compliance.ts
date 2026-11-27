import { definePrivacyCompliance } from '../../common/privacyCompliance'

const PAYY =
  'https://github.com/polybase/payy/blob/2f95947f12981a838f6f0c9dddace825bf835502/'

export const payyCompliance = definePrivacyCompliance({
  description:
    "KYC is required for the Payy card and fiat ramps, not for transfers. Payy's backend can block a wallet or an IP address from its services, and its validator can refuse any transaction. The protocol has no view key, but Payy's backend ties each wallet to its KYC record and the notes the app reports.",
  powers: [
    {
      ladder: 'privacy',
      rung: 5,
      text: "Payy's backend ties each wallet to its KYC record and the notes the app reports, with no record the user can check.",
      sources: [
        {
          title:
            'Wallet table: deposit address, KYC, country, IP country, fraud block',
          url: PAYY + 'pkg/database/src/schema.rs#L464-L481',
        },
        {
          title: 'Session bound to a wallet address by signature',
          url: PAYY + 'pkg/guild-interface/src/auth.rs#L1-L16',
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 2,
      text: "Payy's only validator can refuse any transaction, and Payy's backend can block a wallet or an IP address.",
      sources: [
        {
          contract: 'RollupV1',
          title: 'Validator signatures on every state update',
        },
        {
          title: 'IP blocklist table',
          url: PAYY + 'pkg/database/src/schema.rs#L3-L13',
        },
        {
          title: 'Per-wallet fraud_block flag',
          url: PAYY + 'pkg/database/src/schema.rs#L464-L481',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 5,
      text: 'The PayyMultisig can overwrite the RollupV1 state root with setRoot, without a proof or delay.',
      sources: [
        { contract: 'RollupV1', title: 'setRoot' },
        { section: 'permissions', title: 'PayyMultisig' },
      ],
    },
  ],
  identityAtEntry: true,
})
