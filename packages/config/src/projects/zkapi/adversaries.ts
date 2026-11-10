import {
  ADVICE_SNIPPETS as A,
  adviceLink,
  definePrivacyAdversaries,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

const SRC =
  'https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/'
const OA_CHAT =
  'https://github.com/OpenAnonymity/oa-chat/blob/a2623612c17bea09d5efaf8f41b500fe98fb1c8a/'

// Linkage here is deposit-to-request. Deposits and withdrawals of one note are
// publicly linked by note id, which the promise says.
const PUBLIC_INTERIOR: PrivacyExposureMap = {
  sender: 'exposed',
  recipient: {
    verdict: 'exposed',
    note: 'Payments go to the operator treasury.',
  },
  amount: {
    verdict: 'atRisk',
    note: 'Charges per request stay offchain. Closing the note publishes the total.',
  },
  asset: 'exposed',
  linkage: {
    verdict: 'private',
    note: 'An escape dispute publishes the link for one request.',
  },
}

export const zkApiAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit pays for which API request. Deposits and withdrawals are public, and the provider can read prompts.',
  },
  fieldDescriptions: {
    linkage:
      'Whether an API request can be tied to the deposit that pays for it.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'Requests stay offchain, so nothing onchain ties a request to the deposit that pays for it.',
      exposureContinued:
        "A deposit publishes the funder, amount, note id and expiry. Closing the note publishes the payout address and the remaining balance, so each note's total spend is public.",
      interior: PUBLIC_INTERIOR,
      sources: [
        { contract: 'ZkApiVault' },
        {
          title: 'Deposit and close events',
          url: `${SRC}protocol/contracts/src/libraries/Events.sol#L6-L10`,
        },
        {
          title:
            'Request circuit keeps note id, balance and state signature private',
          url: `${SRC}protocol/rust/crates/zkapi-proof/src/groth16.rs#L368-L485`,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposureShort:
        'Authorizations never reach the chain, so correlating public data adds nothing to the note record.',
      interior: PUBLIC_INTERIOR,
      sources: [
        {
          title: 'Authorization is an HTTP request to the operator',
          url: `${SRC}docs/api-spec.md`,
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposureShort:
        'The app works in Tor Browser, and no third party sees both a deposit and a request.',
      exposureContinued:
        "The deposit reaches the wallet's RPC, or the app's public RPC when the user funds an address the app shows. A relay at refraction.network carries requests to OpenRouter and chain reads by default and sees their timing, and Fathom counts feature use.",
      interior: {
        ...PUBLIC_INTERIOR,
        linkage: {
          verdict: 'atRisk',
          note: "Private only when IP-hiding routes keep the user's IP out of both the deposit and the requests.",
        },
      },
      sources: [
        {
          title: 'App relay on by default, direct fallback',
          url: `${OA_CHAT}chat/services/networkProxy.js#L7-L10`,
        },
        {
          title: 'Hosted app loads Fathom Analytics (checked 2026-10-30)',
          url: 'https://chat.openanonymity.ai',
        },
      ],
    },
    // Anonymity set counted on 2026-10-30 from vault events up to block
    // 26306058, ETH/USD 2,215.41 (Chainlink): 105 deposits from 83 funders, 24
    // mutual closes (6 spent nothing), no escapes or expiry claims. Active
    // notes whose deposit covers the budget tier (an upper bound, the balance
    // is unknown), notes/funders: $1 79/75, $2 78/74, $3 76/72, $4.5 40/38, $6
    // 36/34. The launch notes expire 2026-10-31 to 2026-11-04, leaving 26
    // notes from 25 funders: $1 24, $2 23, $3 23, $4.5 19, $6 15 funders. The
    // default model, Auto Router, sends the $2 tier. All-time equals the last
    // 90 days, since the vault launched on 2026-09-30.
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        "The operator sees each request's time and budget tier but not its note, and too few active notes cover even the default model's budget to hide among.",
      exposureContinued:
        "The candidates are the active notes whose balance covers the request's budget tier, which follows the chosen model's price. The provider can read prompts and responses and link requests under one key.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'exposed',
          note: 'The operator bills each request and the provider meters it.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Balance commitment re-blinded for every request',
          url: `${SRC}docs/note-bound-commitments.md`,
        },
        {
          title: "OA Chat sets the budget tier from the model's price",
          url: `${OA_CHAT}chat/zkapi/services/zkapiModelBudget.mjs#L6-L14`,
        },
        {
          title: 'Provider sees inference content',
          url: `${SRC}zkapi-clientd/docs/PRIVACY.md`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'good',
      exposureShort:
        'Note leaves and nullifiers are Poseidon hashes and nothing encrypted is written onchain, so there is nothing to decrypt.',
      exposureContinued:
        'Whoever breaks elliptic-curve cryptography opens only the balance commitment that a published dispute carries.',
      interior: PUBLIC_INTERIOR,
      sources: [
        {
          title: 'Note-bound commitments and assumptions',
          url: `${SRC}docs/note-bound-commitments.md`,
        },
      ],
    },
  },
  advice: [
    {
      name: 'Set up',
      text: A.torBrowser,
      against: ['networkObserver'],
      outside: true,
    },
    {
      name: 'Deposit',
      text: `Deposit from a wallet whose traffic also takes an ${adviceLink('IP-hiding route', 'ipHidingRoutes')}.`,
      against: ['networkObserver'],
      outside: true,
    },
  ],
})
