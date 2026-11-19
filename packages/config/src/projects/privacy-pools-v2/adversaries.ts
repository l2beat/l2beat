import {
  USAGE_FLOW_SNIPPETS as A,
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
  toolLink,
} from '../../common/privacyAdversaries'
import type { ProjectPrivacyReferenceApp } from '../../types'

// The v1.6.0 release bundle of the web app, loaded by its CID. It differs
// from privacypools.com in its build env: no Alchemy key, public endpoints.
export const REFERENCE_APP = {
  name: 'Privacy Pools release bundle',
  url: 'https://github.com/0xbow-io/privacy-pools-website-v2/releases/tag/v1.6.0',
  since: '2026-11-18',
  version: '1.6.0',
  delivery: {
    type: 'pinned',
    pin: {
      type: 'ipfs',
      cid: 'bafybeif7cfytgswbv6rdv4arclle2xrhzullzay4qhl7wuj3h2idpf5cfa',
    },
    rebuild:
      'https://github.com/0xbow-io/privacy-pools-website-v2/blob/5dc5434b443b10aa33c7db5421824d84b71a08b4/docs/static-releases.md',
  },
  source: {
    repository: 'https://github.com/0xbow-io/privacy-pools-website-v2',
    commit: '5dc5434b443b10aa33c7db5421824d84b71a08b4',
  },
  checkedApps: [
    {
      name: 'Casberi',
      finding:
        "Names the user's account to 0xbow's relayer in a fee quote when the send screen opens, before the relay names the recipient.",
      fix: 'Quote fees without naming an account until the recipient is set, as the release bundle does.',
      source:
        'https://github.com/alexanderchopan/casberi/blob/881139276206d683aba3e54bce945796a43c1d93/Casberi/Casberi/Model/PrivateMove.swift#L318-L323',
    },
  ],
} satisfies ProjectPrivacyReferenceApp
const WEBSITE = `${REFERENCE_APP.source.repository}/blob/${REFERENCE_APP.source.commit}/`
// v1.0.2 of the monorepo: the circuits behind the live verifiers. The app
// vendors SDK 1.0.3-prerelease.00f84368, which the monorepo lacks. Its source
// maps differ from 1.0.2 only in the LI.FI quote provider.
export const MONOREPO_REPOSITORY =
  'https://github.com/0xbow-io/privacy-pools-v2-monorepo'
export const MONOREPO_COMMIT = '61fac03acd1fc306164ddc234f7fac4147d04493'
const MONOREPO = `${MONOREPO_REPOSITORY}/blob/${MONOREPO_COMMIT}/`
const DOCS = 'https://privacy-pools-v2-docs.vercel.app/'

export const privacyPoolsV2Adversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal and who pays whom inside the pool, for deposits the ASP approves. Deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'A zero-knowledge proof hides which approved notes a withdrawal or transfer spends, and a transfer publishes only encrypted notes.',
      exposureContinued:
        'A relayed transfer pays its fee as a public withdrawal to the relayer, so transfers are visible as events. A ragequit publishes the owner, the amount, the label and the commitment, which names the transaction that created the note. Claiming a payment to an unregistered address registers that wallet.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'A ragequit names the transaction that created the note.',
        },
      },
      sources: [
        { contract: 'PoolVault' },
        {
          title: 'Transact circuit',
          url:
            MONOREPO + 'packages/circuits/circuits/templates/Transact.circom',
        },
        {
          title:
            'Relayed transfers pay the fee as a public output (checked 2026-10-30)',
          url: DOCS + 'operations/transfer',
        },
        {
          title: 'Ragequit publishes the label and owner (checked 2026-10-30)',
          url: DOCS + 'operations/ragequit',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        "A note's label passes to every later payee, and the ASP update that first approved it often leaves one candidate deposit.",
      exposureContinued: `The ASP adds ten labels per update, decoys included, so an update that follows a single deposit names it. Without a payee, a relayed exit of a common amount hides among every approved deposit of its asset. Any amount is allowed, so an unusual amount, or a share count only one deposit day produces, pairs a deposit with its withdrawal. ${S.walletFingerprint('relayer')}`,
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: "A received note's label, an unusual amount or a share count only one deposit day produces can pair the two ends.",
        },
      },
      sources: [
        {
          title: 'Every output note inherits the label of an input',
          url:
            MONOREPO +
            'packages/circuits/circuits/templates/helpers/ValueConservation.circom',
        },
        {
          contract: 'ASPRegistry',
          title: 'Each root update links its list on IPFS',
        },
        {
          title:
            'Share counts encode the exchange rate at deposit (checked 2026-10-30)',
          url: DOCS + 'concepts/yield-shares',
        },
        {
          title: 'Tutela (arXiv:2201.06811)',
          url: 'https://arxiv.org/abs/2201.06811',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposureShort:
        "No request names the account, so over an IP-hiding route no third party can link the user's deposit and withdrawal.",
      exposureContinued:
        "A connected wallet's address reaches the default RPC, PublicNode on Ethereum, through the deposit screen's balance reads.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'Private only over an IP-hiding route, in a private window that never connected a wallet.',
        },
      },
      sources: [
        {
          title: 'Account reads come only from the local registry',
          url: WEBSITE + 'services/keystore-registry-reads.ts#L29-L33',
        },
        {
          title: 'Public node when the build has no Alchemy key',
          url: WEBSITE + 'config/prod-deployments.ts#L99-L105',
        },
        {
          title: "The deposit screen polls a connected wallet's balances",
          url: WEBSITE + 'components/home/action-hub.tsx#L2250-L2265',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'The ASP postman can publish a new approved list at any time with no delay, and every private spend must prove against the latest one.',
      exposureContinued:
        "A list without a deposit's label freezes every note descending from it, and a list with few labels narrows the set to them. 0xbow's ASP feeds see every session's IP and its relayer every exit's IP and recipient, so 0xbow can pair deposit and exit sessions. A multisig can upgrade the four core contracts without delay.",
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'atRisk',
          note: 'The relayer sees the recipient of every exit, with the IP that asked.',
        },
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'The ASP can narrow the approved list, and 0xbow can pair sessions across its ASP and relayer.',
        },
      },
      sources: [
        {
          contract: 'ASPRegistry',
          title: 'updateASPRoot: the postman sets a new root with no delay',
        },
        {
          contract: 'PoolVault',
          title: 'transact: only the latest ASP root is accepted',
        },
        {
          title:
            'What the relayer receives, the IP included (checked 2026-10-30)',
          url: DOCS + 'introduction/threat-model',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        "Every registered account's viewing public key sits in the Keystore, so whoever breaks elliptic-curve cryptography decrypts every note ever sent to it from the chain.",
      exposureContinued: `A decrypted note holds value, token and deposit lineage, which pairs each transfer's commitments with their deposit and recipient. ${S.walletSignatureAccounts()} Breaking the ASP's key the same way decrypts the data that ties each deposit to its label.`,
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          contract: 'Keystore',
          title: 'viewingKeys: X25519 public key per account',
        },
        {
          title: 'Notes encrypted with X25519 ECDH and XChaCha20',
          url:
            MONOREPO +
            'packages/core-sdk/src/services/NoteComputationService.ts#L242-L260',
        },
        {
          title: 'Three keys from one wallet signature',
          url:
            MONOREPO +
            'packages/core-sdk/src/services/AbstractCryptoService.ts#L147-L195',
        },
        { section: 'trusted-setups' },
      ],
    },
  },
  usageFlow: [
    {
      name: 'Load',
      text: `Install ${toolLink('ipfsDesktop')} and use Import CAR on \`site.car\` from the [v1.6.0 release](${REFERENCE_APP.url}). Open the app at \`http://localhost:8080/ipfs/${REFERENCE_APP.delivery.pin.cid}\`. A [rebuild](${REFERENCE_APP.delivery.rebuild}) from the reviewed source gives the same CID.`,
      against: ['privilegedInsider'],
      outside: true,
    },
    {
      name: 'Set up',
      text: `Turn on ${toolLink('nymVpn')} with the Random profile, an IP-hiding route for all of the computer's traffic, and reconnect it before each session. 0xbow's relayer refuses Tor exits on the app's default settings.`,
      against: ['networkObserver', 'privilegedInsider'],
      outside: true,
    },
    {
      name: 'Deposit',
      text: 'Assumes deposits into ppETH or ppUSDC, the pools with the most depositors.',
      against: ['chainAnalyst'],
    },
    {
      name: 'Pay',
      text: 'Assumes a reshield into another asset before paying someone who should not learn the deposit, since the reshield deposits the funds again under a new label.',
      against: ['chainAnalyst'],
    },
    {
      name: 'Wait',
      text: A.wait,
      against: ['chainAnalyst'],
      randomWait: true,
    },
    {
      name: 'Check',
      text: "Assumes the list named by the ASPRegistry's latest root is opened on IPFS before withdrawing, and a withdrawal only if it holds many deposits.",
      against: ['privilegedInsider'],
      outside: true,
    },
    {
      name: 'Withdraw',
      text: `Assumes sign-in with the account key in a private window instead of with a wallet, and withdrawals of common amounts rather than everything at once. ${A.relayer('relayer')} ${A.freshAddress}`,
      against: ['publicObserver', 'chainAnalyst', 'networkObserver'],
    },
    {
      name: 'Ragequit',
      text: 'Assumes a ragequit only of notes the user deposited and never spent from.',
      against: ['publicObserver'],
    },
  ],
})
