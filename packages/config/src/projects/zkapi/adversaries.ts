import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

const SRC =
  'https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/'
const DAEMON =
  'https://github.com/ethereum/zkapi/blob/20aa542ae98e767c0507133fd34b12a56f5ccd3d/crates/zkapi-clientd/src/'
const OA_CHAT =
  'https://github.com/OpenAnonymity/oa-chat/blob/60ed5be2957d984c70a7299474927becec47b61f/'

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
        'The app works in Tor Browser, the daemon has a Tor setting with a kill switch, and no third party sees both a deposit and a request.',
      exposureContinued:
        "Your wallet's RPC sees the deposit, while requests go to the operator and the provider. The app sends inference through a relay at refraction.network by default, which sees its timing. The hosted app reports feature use to Fathom, a cookieless analytics service.",
      advice:
        'Use the app in Tor Browser, or the daemon with its Tor setting, and send the deposit through a public RPC over Tor.',
      interior: {
        ...PUBLIC_INTERIOR,
        linkage: {
          verdict: 'atRisk',
          note: 'Private only over Tor, which keeps your IP off both sides.',
        },
      },
      sources: [
        {
          title: 'Daemon Tor route has a kill switch',
          url: `${SRC}zkapi-clientd/docs/CLI_ZKAPI.md#L81-L97`,
        },
        {
          title: 'App relay on by default, direct fallback',
          url: `${OA_CHAT}chat/services/networkProxy.js#L7-L10`,
        },
        {
          title: 'Hosted app loads Fathom Analytics (checked 2026-10-10)',
          url: 'https://chat.openanonymity.ai',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        "The operator sees each request's time and budget but not its note, so the candidates are all active notes, a small set.",
      exposureContinued:
        "The daemon reveals the note id to the operator's indexer before each request. An escape dispute lets the operator publish one request's link onchain. The provider can read prompts and responses and link requests under one key.",
      advice: `Use the browser app rather than the daemon, and wait a day or more between depositing and your first request. ${S.localBuild}`,
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'exposed',
          note: 'The operator bills each request and the provider meters it.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Timing narrows a small set, and daemon users reveal the note id.',
        },
      },
      sources: [
        {
          title: 'Balance commitment re-blinded for every request',
          url: `${SRC}docs/note-bound-commitments.md`,
        },
        {
          title: 'Daemon fetches the note path by note id',
          url: `${DAEMON}indexer.rs#L71-L80`,
        },
        {
          contract: 'ZkApiVault',
          title: 'challengeEscapeWithdrawal publishes a request proof',
        },
        {
          title: 'Provider sees inference content',
          url: `${SRC}zkapi-clientd/docs/PRIVACY.md`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposureShort:
        'Onchain data stays hashed, but retained operator transcripts and indexer logs would tie requests to deposits.',
      exposureContinued:
        'Note leaves and nullifiers are Poseidon hashes. Whoever breaks elliptic-curve cryptography opens only the balance commitment that a published dispute carries.',
      advice: 'Assume the operator and provider keep what you send.',
      interior: {
        ...PUBLIC_INTERIOR,
        amount: {
          verdict: 'atRisk',
          note: 'Per-request charges exist only in operator records.',
        },
        linkage: {
          verdict: 'atRisk',
          note: 'Depends on what the operator retains.',
        },
      },
      sources: [
        {
          title: 'Transcript store',
          url: `${SRC}crates/zkapi-serverd/src/nullifier_store.rs`,
        },
        {
          title: 'Note-bound commitments and assumptions',
          url: `${SRC}docs/note-bound-commitments.md`,
        },
      ],
    },
  },
})
