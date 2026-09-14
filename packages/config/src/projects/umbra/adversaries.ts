import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const UMBRA_JS =
  'https://github.com/ScopeLift/umbra-protocol/blob/a81df24e76a0d6ab1ec79c6353e28c527b1b1a80/'
const ANALYSIS = 'https://arxiv.org/html/2308.01703v2'

export const umbraAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides which recipient controls a stealth payment from the public. The payer knows the intended recipient; sender, asset, amount, stealth address and withdrawal destination remain public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Announcements identify each stealth payment but do not identify the recipient whose public keys were used; the registry exposes candidate recipients and their key history, not a payment-to-recipient mapping.',
      advice:
        'Withdraw to a fresh address without an ENS name or prior identity-linked activity, and use a token relayer to avoid funding the stealth address for gas from your known wallet.',
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
      sentiment: 'good',
      exposure:
        'Withdrawals to registered recipients, round trips to the sender and a shared collecting address can reveal or cluster recipients, but protocol membership alone does not identify them.',
      advice:
        'Keep withdrawal destinations separate across payments and chains, and check whether timing, amounts or recurring counterparties reconnect them to an identified account.',
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
        "Using your own wallet RPC does not cover all reads: the app looks up the connected wallet and the senders of locally matched payments through a separate build-configured mainnet RPC, and checks withdrawal destinations through additional providers and Umbra's API, exposing useful correlations within a session even over Tor. The wallet RPC also receives the matched stealth-address balance batch, the indexer can receive an address-specific registration lookup.",
      advice:
        'Use an inspected local client with all RPCs pointed at your own nodes, bulk log scanning and external name/safety lookups disabled. Send broadcasts and relay requests over Tor.',
      sources: [
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
            'Batched ENS reverse queries encode address-derived namehashes',
          url: UMBRA_JS + 'frontend/src/utils/address.ts#L105-L135',
        },
        {
          title:
            'Withdrawal checks send destination to ENS, POAP and Gitcoin lookups',
          url: UMBRA_JS + 'frontend/src/utils/address.ts#L255-L319',
        },
        {
          title: 'POAP check sends the destination address to api.poap.xyz',
          url: UMBRA_JS + 'frontend/src/utils/address.ts#L348-L358',
        },
        {
          title: 'Registration subgraph query filters by registrant address',
          url: UMBRA_JS + 'umbra-js/src/utils/utils.ts#L555-L626',
        },
        {
          title: 'Announcements fetched in bulk and matched locally',
          url: UMBRA_JS + 'umbra-js/src/classes/Umbra.ts#L631-L652',
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
        "The immutable contracts give no administrator a viewing key or a way to replace registered keys without the registrant's authorization. The reference client matches announcements locally, so an indexer or relayer has no protocol-wide viewing capability.",
      advice:
        'Keep viewing keys private and use an inspected local build when removing trust in remotely served frontend code.',
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
        'An archived announcement contains the ephemeral public key and encrypted scalar. A quantum adversary that breaks secp256k1 can decrypt that scalar against candidate public viewing keys and test the corresponding spending public key to identify the recipient.',
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
