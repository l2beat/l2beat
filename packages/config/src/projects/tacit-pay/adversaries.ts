import { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  ADVICE_SNIPPETS as A,
  adviceLink,
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
  toolLink,
} from '../../common/privacyAdversaries'
import type {
  PrivacyExposureMap,
  ProjectPrivacyReferenceApp,
} from '../../types'

// Generation 6 of the anon.wei page, which the name resolved to at review.
// Its html() equals tacit-pay/dapp/page.min.html at this commit, which
// scripts/strip.mjs and the pins of deploy/repin.sh rebuild byte for byte from
// page.html, the file the sources below cite.
export const REFERENCE_PAGE = 'eth:0x0000000d42137547140b0812E1178F025e08bc49'
// The link goes to html() of the pinned contract (F15 in Etherscan's ABI order),
// not anon.wei.limo, whose name a Z DAO vote can point at another page after
// 1 day.
export const REFERENCE_APP = {
  name: 'anon.wei',
  url: `https://etherscan.io/address/${REFERENCE_PAGE.replace('eth:', '')}#readContract#F15`,
  since: '2026-11-09',
  delivery: {
    type: 'pinned',
    pin: { type: 'contract', address: ChainSpecificAddress(REFERENCE_PAGE) },
    rebuild:
      'https://github.com/ERC8244/dapps/blob/bf39cc0b4d8c5eabdcd76f8b0672ec97b645a986/tacit-pay/deploy/repin.sh',
  },
  source: {
    repository: 'https://github.com/ERC8244/dapps',
    commit: 'bf39cc0b4d8c5eabdcd76f8b0672ec97b645a986',
  },
  checkedApps: [
    {
      name: 'tacit.finance',
      icon: 'tacit-finance',
      finding:
        "Sends ten of the user's deposit addresses per request to Tacit's relay at every sign-in, with no setting for the user's own node.",
      fix: 'Read each deposit address in its own request and offer an own-node setting, as anon.wei does.',
      source: 'https://tacit.finance/pay/eth/',
      checked: '2026-11-18',
    },
  ],
} satisfies ProjectPrivacyReferenceApp
const PAGE = `${REFERENCE_APP.source.repository}/blob/${REFERENCE_APP.source.commit}/tacit-pay/dapp/page.html`
export const TACIT_REPOSITORY = 'https://github.com/src-company/tacit'
export const TACIT_COMMIT = '389dd680cf18541eca1c0de922368fde2f5596f5'
const TACIT = `${TACIT_REPOSITORY}/blob/${TACIT_COMMIT}/`

// One pool holds only ETH, so every note's asset is public.
const INTERIOR: PrivacyExposureMap = {
  sender: 'private',
  recipient: 'private',
  amount: 'private',
  asset: 'exposed',
  linkage: 'private',
}

export const tacitPayAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which deposit funds which withdrawal, and who pays whom and how much inside the pool. Deposits and withdrawals show address and amount.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'A zero-knowledge proof hides which notes a withdrawal or transfer spends, and a transfer publishes only note hashes and encrypted memos.',
      exposureContinued:
        'Payments to one deposit address are public and linked to each other. Anyone holding a payment link can tell its deposit address belongs to the payee.',
      interior: {
        ...INTERIOR,
        linkage: {
          verdict: 'atRisk',
          note: 'A spend sent from the depositing wallet names it.',
        },
      },
      sources: [
        { contract: 'TacitEvmPool' },
        {
          title: 'Transact circuit',
          url: TACIT + 'dapp/circuits/evm-pool/transact.circom',
        },
        {
          title: 'What each action shows',
          url: TACIT + 'docs/EVM-POOL.md#what-each-action-shows',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        'anon.wei fills every unused output with a dummy note, which other apps leave empty, so its withdrawals hide only among its own deposits and sweeps of deposit addresses, from fewer than 1,000 wallets.',
      exposureContinued: `Any amount is allowed, so an unusual amount pairs the two ends. ${S.walletFingerprint('relay')}`,
      interior: {
        ...INTERIOR,
        linkage: {
          verdict: 'atRisk',
          note: 'Private only with a common amount and a wait, among few candidate deposits.',
        },
      },
      sources: [
        {
          title: 'anon.wei fills an unused output with a zero-value note',
          url: PAGE + '#L2685-L2691',
        },
        {
          title:
            "anon.wei's sweep of a deposit address fills one output and leaves the other empty",
          url: PAGE + '#L3098-L3110',
        },
        {
          title:
            "Tacit's wallet library, which tacit.finance uses, leaves an unused output empty",
          url: TACIT + 'dapp/evm-pool-wallet.js#L933',
        },
        {
          title:
            'Two-output transactions: 139 of 581 withdrawals, and 109 of 653 deposits from 40 wallets. 22 sweeps of deposit addresses add 11 wallets',
          checked: '2026-11-26',
          url: 'https://etherscan.io/address/0x000000c2A20657CE25f2Ba99737933D031AFBEE9',
        },
        {
          title: 'Withdrawing well: amounts and timing',
          url: TACIT + 'docs/EVM-POOL.md#withdrawing-well',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposureShort:
        "The user's own Ethereum node can take every read that names a deposit address or the recipient, leaving third parties only pool-wide logs.",
      exposureContinued:
        'By default, Tenderly and dRPC receive the deposit addresses and the withdrawal recipient in one session, so either can tie both sides. On Base and Robinhood Chain, public nodes receive the deposit addresses, which are the same on every chain.',
      interior: {
        ...INTERIOR,
        linkage: {
          verdict: 'atRisk',
          note: 'Private only with your own node set before sign-in.',
        },
      },
      sources: [
        {
          title: 'Deposit addresses read one per request from random nodes',
          url: PAGE + '#L4760-L4790',
        },
        {
          title: 'The recipient is checked for code at public nodes',
          url: PAGE + '#L8485-L8492',
        },
        {
          title: 'Own node and relay under Endpoints',
          url: PAGE + '#L1673-L1690',
        },
        {
          title: "Reads that name the wallet go to the wallet's own node",
          url: PAGE + '#L4317',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'Tacit holds no key to any note, but a Z DAO vote can change the page anon.wei serves, its relay host and RPC nodes after 1 day.',
      exposureContinued:
        "The reviewed page version is an immutable contract, but running a saved copy of it takes command-line work. Tacit's relay sees the IP at sign-in, each exit's recipient with the IP that asked, and each deposit address the user views in the app.",
      interior: {
        ...INTERIOR,
        recipient: {
          verdict: 'atRisk',
          note: "Private only over an IP-hiding route, since the relay sees every exit's recipient with the IP that asked.",
        },
        linkage: {
          verdict: 'atRisk',
          note: 'Private only on a saved copy of the reviewed page version.',
        },
      },
      sources: [
        {
          contract: 'TacitPay8244',
          title: 'html(): the page, fixed per version',
        },
        {
          title: 'What the relay sees',
          url: TACIT + 'docs/EVM-POOL.md#the-relay',
        },
        {
          title: 'Registry entries go ahead of the built-in relay host',
          url: PAGE + '#L3135-L3139',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'Whoever breaks elliptic-curve cryptography recovers the key of each wallet that signed in and sent a transaction, which opens its notes and links.',
      exposureContinued: `${S.walletSignatureAccounts()} A Tacit address published in a name record holds the public key of the signature-derived key, which opens the account the same way.`,
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Private only for a user who signs in with a pasted key and whose Tacit address stays unshared.',
        },
        recipient: {
          verdict: 'atRisk',
          note: "Private only while the recipient's Tacit address stays unshared.",
        },
        amount: 'atRisk',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'The key is a hash of one wallet signature',
          url: TACIT + 'dapp/identity-message.js',
        },
        {
          title:
            'A Tacit address holds the public key of the signature-derived key',
          url: PAGE + '#L1479-L1485',
        },
        {
          title: 'Names publish a Tacit address in a text record',
          url: TACIT + 'docs/EVM-POOL.md#names',
        },
        {
          title: 'Sign-in also takes a 64-character key',
          url: PAGE + '#L4447-L4451',
        },
      ],
    },
  },
  advice: [
    {
      name: 'Load',
      text: 'Save the reviewed page version from your own node, check its hash and serve it from localhost, as the App section describes, not from anon.wei.limo.',
      against: ['privilegedInsider'],
      outside: true,
    },
    {
      name: 'Sign in',
      text: `Set your own ${toolLink('ethereumNode')} under Endpoints and in your wallet before signing in. Send all other traffic through an ${adviceLink('IP-hiding route', 'routes')}, so the relay sees no IP of yours.`,
      against: ['networkObserver', 'privilegedInsider'],
      outside: true,
    },
    {
      name: 'Shield',
      text: 'Shield your own funds from that wallet, not through a deposit address. Give each payer their own deposit address.',
      against: ['networkObserver', 'publicObserver'],
    },
    {
      name: 'Wait',
      text: A.wait,
      against: ['chainAnalyst'],
      randomWait: true,
    },
    {
      name: 'Withdraw',
      text: `${A.relayer('relay')} ${A.commonAmounts}`,
      against: ['publicObserver', 'chainAnalyst'],
    },
  ],
})
