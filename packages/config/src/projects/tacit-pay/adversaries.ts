import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
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
// not anon.wei.limo, whose name Tacit's app owner can point at another page
// without delay.
export const REFERENCE_APP = {
  name: 'anon.wei',
  url: `https://etherscan.io/address/${REFERENCE_PAGE.replace('eth:', '')}#readContract#F15`,
  since: '2026-11-09',
  source: {
    repository: 'https://github.com/ERC8244/dapps',
    commit: 'bf39cc0b4d8c5eabdcd76f8b0672ec97b645a986',
  },
  checkedApps: [
    {
      name: 'tacit.finance',
      icon: 'tacit-finance',
      finding:
        "Sends ten of the user's deposit addresses per request to one public node at every sign-in, with no setting for the user's own node.",
      fix: 'Read each deposit address in its own request and offer an own-node setting, as anon.wei does.',
      source: 'https://tacit.finance/pay/eth/',
      checked: '2026-11-09',
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
      advice: `${S.exitViaRelayer('relay')} Give each payer its own deposit address.`,
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
      sentiment: 'bad',
      exposureShort:
        'Fewer than 50 wallets deposited into the Ethereum pool, besides wallets that only cycle funds back, so timing and amounts can pair the two ends.',
      exposureContinued: `Any amount is allowed, so an unusual amount pairs the two ends. ${S.walletFingerprint('relay')}`,
      interior: {
        ...INTERIOR,
        linkage: 'exposed',
      },
      sources: [
        {
          title:
            'Pool deposits: 37 direct depositors and at most 12 more through deposit addresses and zaps, self-cycling wallets excluded (counted 2026-11-09)',
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
        'By default, Tenderly and dRPC receive the deposit addresses and the withdrawal recipient in one session, so either can tie both sides. Base and Robinhood Chain nodes still receive the deposit addresses, which are the same on every chain.',
      advice:
        'Set your own Ethereum node under Endpoints and in your wallet before signing in, and shield from that wallet rather than through a deposit address.',
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
        'Tacit holds no key to any note, but its app owner can change the page anon.wei serves, its relay host and RPC nodes without delay.',
      exposureContinued:
        "The reviewed page version is an immutable contract, but running a saved copy of it takes command-line work. Tacit's relay sees the IP at sign-in, each exit's recipient with the IP that asked, and each deposit address the user views in the app.",
      advice:
        'Serve the page from localhost as the App section describes, not from anon.wei.limo. Exit as the network observer advice says.',
      interior: {
        ...INTERIOR,
        recipient: {
          verdict: 'atRisk',
          note: 'The relay sees the recipient of every exit, with the IP that asked.',
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
        { contract: 'zEndpoints' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'Whoever breaks elliptic-curve cryptography recovers the key of each wallet that signed in and sent a transaction, which opens its notes and links.',
      exposureContinued: `${S.walletSignatureAccounts()} A Tacit address published in a name record yields its view and nullifier keys the same way, exposing its incoming notes and their spends.`,
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'The key is a hash of one wallet signature',
          url: TACIT + 'dapp/identity-message.js',
        },
        {
          title: 'Note keys tweak the address keys by an ECDH secret',
          url: TACIT + 'dapp/btc-pool-zk.js#L126-L160',
        },
        {
          title: 'Names publish a Tacit address in a text record',
          url: TACIT + 'docs/EVM-POOL.md#names',
        },
        { section: 'trusted-setups' },
      ],
    },
  },
})
