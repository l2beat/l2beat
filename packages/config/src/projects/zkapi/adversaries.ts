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

/** @param totalNotes notes deposited since launch, from discovery */
export function zkApiAdversaries(totalNotes: number) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'linkage',
      text: 'Hides which deposit pays for which API request. Deposits and withdrawals are public, and the provider reads prompts.',
    },
    fieldDescriptions: {
      linkage: 'Whether an API request can be tied to the deposit that pays for it.',
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposure:
          "A deposit publishes the funder, amount, note id and expiry. Closing the note publishes its id, the payout address and the remaining balance, so each note's total spend is public. Requests stay offchain.",
        interior: PUBLIC_INTERIOR,
        sources: [
          { contract: 'ZkApiVault' },
          {
            title: 'Deposit and close events',
            url: `${SRC}protocol/contracts/src/libraries/Events.sol#L6-L10`,
          },
          {
            title: 'Request circuit keeps note id, balance and state signature private',
            url: `${SRC}protocol/rust/crates/zkapi-proof/src/groth16.rs#L368-L485`,
          },
        ],
      },
      chainAnalyst: {
        sentiment: 'good',
        exposure:
          'Correlating public data adds nothing beyond the note record.',
        interior: PUBLIC_INTERIOR,
        sources: [
          {
            title: 'Authorization is an HTTP request to the operator',
            url: `${SRC}docs/api-spec.md`,
          },
        ],
      },
      networkObserver: {
        sentiment: 'warning',
        exposure:
          "Deposits are public with their time. A session reaches the operator's servers minutes later, and with few users an observer there singles out the note even behind Tor. Without Tor the same IP ties deposit and requests together.",
        advice:
          'Wait a day or more between depositing and the first request. Use the app in Tor Browser and send the deposit over Tor as well, or run the local daemon with its Tor setting.',
        interior: {
          ...PUBLIC_INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Timing against public deposits, and the IP without Tor.',
          },
        },
        sources: [
          {
            title: 'Daemon Tor route fails closed',
            url: `${SRC}zkapi-clientd/docs/CLI_ZKAPI.md#tor`,
          },
          {
            title: 'Daemon streams share one Tor circuit',
            url: `${SRC}zkapi-clientd/internal/relay/socks5.go#L53-L59`,
          },
          {
            title: 'Hosted app proxy on by default, direct fallback',
            url: `${OA_CHAT}chat/services/networkProxy.js#L7-L10`,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposure: `The operator sees request times and budgets and, with ${totalNotes} notes since launch, matches a fresh deposit to its first requests by timing. The local daemon also reveals the note id to the operator's indexer before each request, and an escape dispute lets it publish the link onchain. The provider reads prompts and responses under one key per session.`,
        advice: `Prefer the browser app over the daemon, which reveals your note id, and avoid prompts that identify you. ${S.localBuild}`,
        interior: {
          sender: 'exposed',
          recipient: 'exposed',
          amount: {
            verdict: 'exposed',
            note: 'The operator bills each request and the provider meters it.',
          },
          asset: 'exposed',
          linkage: {
            verdict: 'exposed',
            note: 'By timing, by note id for daemon users, and by a published dispute proof.',
          },
        },
        sources: [
          {
            title: 'Operator stores a transcript per request',
            url: `${SRC}crates/zkapi-serverd/src/processor_v2.rs#L1267-L1381`,
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
        exposure:
          'Retained operator transcripts and indexer logs can tie requests to deposits later. Onchain, note leaves and nullifiers are Poseidon hashes, and only a published dispute carries an elliptic-curve commitment that a quantum computer could open.',
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
}
