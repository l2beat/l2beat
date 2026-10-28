import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { ProjectPrivacyReferenceApp } from '../../types'

// main after v1.2.1 of the web app, the build privacypools.com serves.
export const REFERENCE_APP = {
  name: 'privacypools.com',
  url: 'https://privacypools.com',
  since: '2026-10-23',
  source: {
    repository: 'https://github.com/0xbow-io/privacy-pools-website-v2',
    commit: '6c292b47a977cd86d506994f1b9a0fc51b9a79db',
  },
} satisfies ProjectPrivacyReferenceApp
const WEBSITE = `${REFERENCE_APP.source.repository}/blob/${REFERENCE_APP.source.commit}/`
// v1.0.2 of the monorepo: the circuits behind the live verifiers and the SDK the app vendors.
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
      advice:
        'Exit through a relayer, so none of your wallets pay gas for the receiving address. Ragequit only notes you deposited and never spent from. On any other note, a ragequit names the private transaction that created it.',
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
          title: 'Relayed transfers pay the fee as a public output',
          url: DOCS + 'operations/transfer',
        },
        {
          title: 'Ragequit publishes the label and owner',
          url: DOCS + 'operations/ragequit',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        "A note's label passes to every later payee, and the ASP update that first approved it often leaves one candidate deposit.",
      exposureContinued: `The ASP adds ten labels per update, decoys included, so an update that follows a single deposit names it. Without a payee, a relayed exit of a common amount hides among every approved deposit of its asset. Any amount is allowed, so an unusual one pairs a deposit with its withdrawal, and a yield deposit's share count encodes the day it was made. ${S.walletFingerprint('relayer')}`,
      advice: `Reshield into another asset before paying someone who should not learn the deposit, since the reshield deposits the funds again under a new label. ${S.largeAnonymitySet} ${S.commonAmounts} ${S.freshExit}`,
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
          title: 'Share counts encode the exchange rate at deposit',
          url: DOCS + 'concepts/yield-shares',
        },
        {
          title: 'Tutela (arXiv:2201.06811)',
          url: 'https://arxiv.org/abs/2201.06811',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort:
        "The default RPCs, led by Alchemy under 0xbow's key, see the account at sign-in and can time it against the withdrawal.",
      exposureContinued:
        "Tor does not hide that timing. Tor Browser and the app's Tor option cannot reach a local node, so it also needs a system-wide route.",
      advice:
        'Route all traffic through Tor or NymVPN and set a local node as the endpoint before signing in. Withdraw signed in with the account key instead of a wallet.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'Private only with a local node and all traffic through Tor or NymVPN.',
        },
      },
      sources: [
        {
          title: 'Alchemy first, public node last',
          url: WEBSITE + 'config/rpc-order.ts#L55-L70',
        },
        {
          title: 'Allowlist refuses per-note reads and topic filters',
          url: WEBSITE + 'services/egress-policy.ts#L447-L520',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'The ASP postman can publish a new approved list at any time with no delay, and every private spend must prove against the latest one.',
      exposureContinued:
        "A list without a deposit's label freezes every note descending from it, and a list with few labels narrows the set to them. 0xbow's relayer sees the IP and recipient of every private exit and its ASP feeds see the IP of every session, so one operator can pair a deposit session with its withdrawal. The request logs of its Alchemy key show it the account each sign-in looks up, which it can time against the withdrawals its relayer submits. A multisig holds every admin role and can upgrade the four core contracts without delay.",
      advice:
        'Before withdrawing, check the size of the approved list behind the latest root, which the ASPRegistry links on IPFS. Exit as the network observer advice says, so 0xbow sees no IP it saw at the deposit and no account lookup.',
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
          note: 'The ASP can narrow the approved list, and 0xbow can pair sessions across ASP, relayer and its Alchemy logs.',
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
          title: 'What the relayer receives, the IP included',
          url: DOCS + 'introduction/threat-model',
        },
        {
          title: 'Alchemy request logs show the key owner each payload',
          url: 'https://www.alchemy.com/docs/alchemy-request-logs',
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
})
