import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const UMBRA_JS =
  'https://github.com/ScopeLift/umbra-protocol/blob/a81df24e76a0d6ab1ec79c6353e28c527b1b1a80/'
const ANALYSIS = 'https://arxiv.org/html/2308.01703v2'

export const umbraAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides which registered recipient a stealth payment is for. The payer knows; sender, asset, amount and where the funds go next are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Announcements mark each stealth payment but not the recipient whose keys were used. The registry publishes the candidate recipients and their key history.',
      advice:
        'Withdraw to a fresh address with no ENS name or prior activity, through the token relayer so your known wallet never funds the stealth address for gas. Keep funds from different stealth addresses apart.',
      sources: [
        {
          contract: 'Umbra',
          title:
            'Announcement, tokenPayments and TokenWithdrawal expose the fund path',
        },
        {
          contract: 'StealthKeyRegistry',
          title: 'StealthKeyChanged publishes recipients and key changes',
        },
        {
          title:
            'Recipient matching decrypts locally and checks the stealth address',
          url: UMBRA_JS + 'umbra-js/src/classes/Umbra.ts#L704-L720',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'Protocol use is public once a payment is announced, which narrows the anonymity set to registered recipients. Withdrawals to registered addresses, round trips back to the sender and a shared collecting address reveal or cluster recipients; membership alone does not identify them. The client withdraws one stealth address at a time and never merges them.',
      advice:
        'Keep withdrawal destinations separate across payments and chains, and check that timing, amounts or recurring counterparties do not reconnect them to an identified account.',
      sources: [
        {
          title:
            'Sections 6–7: reuse heuristics, false positives and historical evaluation',
          url: ANALYSIS + '#S6',
        },
        {
          title:
            'Table 2: denominator is withdrawn payments; section 7.4: no fee matches',
          url: ANALYSIS + '#S7',
        },
        {
          title: 'Client warns on linked destinations, but allows proceeding',
          url:
            UMBRA_JS +
            'frontend/src/components/AccountReceiveTable.vue#L671-L715',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposure:
        "On the payer's side the wallet RPC resolves the recipient, reads their registry entry and broadcasts the stealth payment seconds apart, so that provider can pair the payment with the recipient. On your side the wallet RPC receives the matched stealth-address balance batch, while a build-configured mainnet RPC looks up your connected wallet and the senders of matched payments, and withdrawal destinations are checked against ENS, POAP and Gitcoin APIs.",
      advice:
        'Run an inspected local build with every RPC pointed at your own node and the external name and safety lookups disabled. Send broadcasts and relay requests over Tor.',
      sources: [
        {
          title:
            'Payer flow: registry lookup and send through the wallet provider',
          url: UMBRA_JS + 'frontend/src/pages/AccountSend.vue#L955-L1059',
        },
        {
          title: 'The wallet provider wraps the connected wallet',
          url: UMBRA_JS + 'frontend/src/store/wallet.ts#L262-L267',
        },
        {
          title:
            'Mainnet and Polygon RPCs are configured separately from the wallet',
          url: UMBRA_JS + 'frontend/src/utils/constants.ts#L1-L17',
        },
        {
          title: 'Connected-wallet name lookup uses MAINNET_PROVIDER',
          url: UMBRA_JS + 'frontend/src/store/wallet.ts#L336-L358',
        },
        {
          title:
            'Matched senders go to mainnet name lookup; stealth balances to wallet RPC',
          url:
            UMBRA_JS +
            'frontend/src/components/AccountReceiveTable.vue#L584-L626',
        },
        {
          title:
            'Withdrawal checks send destination to ENS, POAP and Gitcoin lookups',
          url: UMBRA_JS + 'frontend/src/utils/address.ts#L255-L319',
        },
        {
          title: 'Signed relay request carries stealthAddr and acceptor',
          url:
            UMBRA_JS +
            'frontend/src/components/AccountReceiveTable.vue#L758-L768',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'good',
      exposure:
        'The contracts are immutable and give no administrator a viewing key or a way to replace registered keys without the registrant. The client matches announcements locally, so no indexer or relayer has a protocol-wide view.',
      advice: S.localBuild,
      sources: [
        {
          contract: 'Umbra',
          title:
            'Owner sets toll, tollCollector and tollReceiver; withdrawals require authorization',
        },
        {
          contract: 'StealthKeyRegistry',
          title:
            'Direct registration or registrant-authorized signature, no admin override',
        },
        {
          title: 'Viewing-key decryption is local to the client',
          url: UMBRA_JS + 'umbra-js/src/classes/Umbra.ts#L704-L720',
        },
        {
          title: 'Relay API receives signed withdrawal data, not a viewing key',
          url: UMBRA_JS + 'frontend/src/utils/umbra-api.ts#L96-L111',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'Each announcement stores the ephemeral public key and the encrypted scalar. A quantum computer that breaks secp256k1 decrypts the scalar against every registered viewing key and checks which spending key yields the stealth address, identifying the recipient of every past payment.',
      sources: [
        {
          contract: 'Umbra',
          title: 'Announcement archives pkx and ciphertext',
        },
        {
          contract: 'StealthKeyRegistry',
          title: 'Historical public viewing and spending keys',
        },
        {
          title: 'ECDH-derived hash encrypts the scalar by XOR',
          url: UMBRA_JS + 'umbra-js/src/classes/KeyPair.ts#L121-L157',
        },
        {
          title: 'Recovered scalar is checked against the receiving address',
          url: UMBRA_JS + 'umbra-js/src/classes/Umbra.ts#L704-L720',
        },
      ],
    },
  },
})
