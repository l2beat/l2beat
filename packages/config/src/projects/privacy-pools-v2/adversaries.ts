import {
  ADVICE_SNIPPETS as A,
  adviceLink,
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { ProjectPrivacyReferenceApp } from '../../types'

// v1.5.0 of the web app, which privacypools.com serves.
export const REFERENCE_APP = {
  name: 'privacypools.com',
  url: 'https://privacypools.com',
  since: '2026-10-23',
  source: {
    repository: 'https://github.com/0xbow-io/privacy-pools-website-v2',
    commit: '6fd83a092004ab7123613abff2b0ca319a2106ce',
  },
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
        'A sign-in with the account key names the account to no third party, so no third party sees both a deposit and a withdrawal.',
      exposureContinued:
        "A connected wallet's address goes to the default RPCs, led by Alchemy under 0xbow's key, which also see when that session withdraws.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: {
          verdict: 'atRisk',
          note: 'Private only over an IP-hiding route and in a session that never connected a wallet.',
        },
      },
      sources: [
        {
          title: 'Sign-in checks registration against bulk ASP feeds',
          url: WEBSITE + 'components/sdk-provider.tsx#L711-L757',
        },
        {
          title: "A connected wallet's tokens are read from Alchemy by address",
          url: WEBSITE + 'services/wallet-tokens.ts#L182-L190',
        },
        {
          title: 'Alchemy first, public node last',
          url: WEBSITE + 'config/rpc-order.ts#L55-L70',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'The ASP postman can publish a new approved list at any time with no delay, and every private spend must prove against the latest one.',
      exposureContinued:
        "A list without a deposit's label freezes every note descending from it, and a list with few labels narrows the set to them. 0xbow's ASP feeds see every session's IP and its relayer every exit's IP and recipient, so 0xbow can pair deposit and exit sessions. 0xbow can change the hosted app at any time, and a multisig can upgrade the four core contracts without delay.",
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
  advice: [
    {
      name: 'Set up',
      text: `Turn on NymVPN with the Random profile, an ${adviceLink('IP-hiding route', 'ipHidingRoutes')} for all of the computer's traffic. 0xbow's relayer refuses Tor exits on the app's default settings.`,
      against: ['networkObserver', 'privilegedInsider'],
      outside: true,
    },
    {
      name: 'Deposit',
      text: 'Deposit into ppETH or ppUSDC, the pools with the most depositors.',
      against: ['chainAnalyst'],
    },
    {
      name: 'Pay',
      text: 'Reshield into another asset before paying someone who should not learn the deposit, since the reshield deposits the funds again under a new label.',
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
      text: "Before withdrawing, find the ASPRegistry's latest root and open the list it names on IPFS. Withdraw only if the list holds many deposits.",
      against: ['privilegedInsider'],
      outside: true,
    },
    {
      name: 'Withdraw',
      text: `Sign in with the account key in a new browser session instead of with a wallet, and withdraw common amounts rather than everything at once. ${A.relayer('relayer')} ${A.freshAddress}`,
      against: ['publicObserver', 'chainAnalyst', 'networkObserver'],
    },
    {
      name: 'Ragequit',
      text: 'Ragequit only notes you deposited and never spent from.',
      against: ['publicObserver'],
    },
  ],
})
