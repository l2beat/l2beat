import {
  ADVICE_SNIPPETS as A,
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type {
  PrivacyExposureMap,
  ProjectPrivacyReferenceApp,
} from '../../types'

export const CIRCUITS_REPOSITORY =
  'https://github.com/Hinkal-Protocol/Hinkal-Contracts-Circuits'
export const CIRCUITS_COMMIT = '61b6839aa80fc0c33bfdcde0323753c83cb2ce67'
const CIRCUITS = `${CIRCUITS_REPOSITORY}/blob/${CIRCUITS_COMMIT}/circuits/`
// The Go port of Hinkal's closed TypeScript SDK (@hinkal/common), the only
// public source of the client logic. Every cited line has the same logic in
// @hinkal/common 0.4.1 and in the extension's bundle.
const HINKAL_GO =
  'https://github.com/Hinkal-Protocol/hinkal-go/blob/2b90690c8aa14456f2e42f062d214f41f6d3446f/'
const SDK =
  'https://www.npmjs.com/package/@hinkal/common/v/0.4.1?activeTab=code'

// Hinkal names no open app. The cells are rated with its Chrome extension,
// whose keys come from a recovery phrase on the device and which offers local
// proving. Read from the served CRX, sha256
// 4928242a99c47f1b6990a250ef2f0fbdd623e3fe861d979b998d8d9135f3ca59.
export const REFERENCE_APP = {
  name: 'Hinkal Wallet',
  url: 'https://chromewebstore.google.com/detail/hinkal-wallet/khfjgapjfcdoffmklchibpepboholpbe',
  since: '2026-11-20',
  version: '0.0.64',
  checked: '2026-11-20',
  delivery: { type: 'latestOnly', store: 'Chrome Web Store' },
  checkedApps: [
    {
      name: 'Hinkal Pay',
      icon: 'hinkal',
      finding:
        "Sends the wallet signature that derives every Hinkal key, the spending key included, to Hinkal's enclave at sign-in, and scans and proves in the enclave with no local option.",
      fix: 'Derive keys on the device and offer local proving, as the Hinkal Wallet extension does.',
      source: 'https://app.hinkal.io',
      checked: '2026-11-23',
    },
    {
      name: 'Hinkal MCP',
      icon: 'hinkal',
      finding:
        "Hinkal's server creates and holds the wallet's recovery phrase and builds every transaction, while the user's machine keeps only an access key.",
      fix: "Derive the keys on the user's machine and prove there, as the Hinkal Wallet extension does with Local Proving.",
      source: 'https://www.npmjs.com/package/@hinkal/mcp/v/0.0.8',
      checked: '2026-11-20',
    },
  ],
} satisfies ProjectPrivacyReferenceApp

// Each transaction lists its tokens, and swaps and other DeFi actions move
// funds out of the pool in public. The SDK folds a private send's 0.25% fee
// into the public flat relayer fee (fees.utils calculateModifiedFeeStructure,
// @hinkal/common 0.4.1), so the fee shows roughly the amount.
const INTERIOR: PrivacyExposureMap = {
  sender: 'private',
  recipient: 'private',
  amount: {
    verdict: 'exposed',
    note: "A private send's relayer fee is a share of its amount, and swaps show theirs.",
  },
  asset: { verdict: 'exposed', note: 'Every transaction names its tokens.' },
  linkage: 'private',
}

const OPEN: PrivacyExposureMap = {
  sender: 'exposed',
  recipient: 'exposed',
  amount: 'exposed',
  asset: 'exposed',
  linkage: 'exposed',
}

/** @param upgradeDelay formatted timelock delay, from discovery */
export function hinkalAdversaries(upgradeDelay: string) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'linkage',
      text: 'Hides who pays whom and which deposit funds which withdrawal. Deposits, withdrawals and the tokens of every transaction are public.',
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort:
          'A zero-knowledge proof hides which notes a transaction spends, so nothing public ties a withdrawal to its deposit.',
        exposureContinued: `${S.entryExitPublic()} Every transaction names its tokens, and swaps show their amounts. The public fee of a private send correlates with its amount.`,
        interior: INTERIOR,
        sources: [
          { contract: 'Hinkal', title: 'transact and prooflessDeposit' },
          { title: 'Main circuit', url: `${CIRCUITS}MainEVMCircuit.circom` },
          { contract: 'Emporium', title: 'DeFi actions' },
        ],
      },
      chainAnalyst: {
        sentiment: 'warning',
        exposureShort:
          'A withdrawal hides only among the deposits of its token that are still in the pool, and many deposits leave again as the same amount within a minute.',
        exposureContinued: `Each token has few depositors, the stablecoins fewest. Any amount is allowed, so an unusual one pairs a deposit with its withdrawal. ${S.walletFingerprint('relayer')}`,
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Private only among the deposits of the same token that stay in the pool.',
          },
        },
        sources: [
          {
            title:
              'Deposits since the 16 July 2026 launch, direct and through Emporium, DepositOnChainUtxos and receive vaults: 375 ETH, 225 USDC and 367 USDT from 216, 122 and 122 addresses (counted 2026-11-23)',
            url: 'https://etherscan.io/address/0x7cb60446d7635C68EDf1c568cac74A1f98c1Cfa4',
          },
          {
            title:
              'Deposits that leave again as the same amount, or within a day less up to 3% in fees: 45% of ETH, 55% of USDC and 72% of USDT deposits, at a median delay of 24 seconds. 129, 57 and 51 addresses have a deposit left (2026-11-23)',
            url: 'https://etherscan.io/address/0x7cb60446d7635C68EDf1c568cac74A1f98c1Cfa4',
          },
          { contract: 'HinkalHelper', title: 'Whitelisted relayers' },
        ],
      },
      networkObserver: {
        sentiment: 'bad',
        exposureShort:
          "Public RPC nodes read the balances of the user's public accounts every 10 seconds and get a burst of requests from the same session while a withdrawal is pending, which pairs the two.",
        exposureContinued:
          'The extension has no RPC setting and cannot run in Tor Browser. The same nodes resolve .eth recipient names.',
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'exposed',
            note: 'Public RPC nodes see the public accounts by content and the withdrawal by timing.',
          },
        },
        sources: [
          {
            title:
              'Hinkal Wallet 0.0.64, traced on 2026-11-20 without funds: balance reads of every public account at publicnode.com every 10 seconds',
            url: REFERENCE_APP.url,
          },
          {
            title:
              'Same bundle: after a send, waitForTransaction polls the public RPC for the block number every 4 seconds for up to 50 seconds',
            url: REFERENCE_APP.url,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort:
          "Every note is also encrypted to a key of Hinkal's enclave, so Hinkal can read every note and link deposits to withdrawals.",
        exposureContinued: `The extension does not check which code the enclave runs, and by default sends it the user's nullifying key from the first launch. Hinkal's relayers learn which notes each transaction spends. The timelock can replace the helper and the verifiers after ${upgradeDelay}.`,
        interior: OPEN,
        sources: [
          {
            title: 'Every note is sealed to the recipient and the enclave key',
            url: `${HINKAL_GO}internal/data-structures/utxo/encrypt.go#L24-L30`,
          },
          {
            title: 'The enclave key',
            url: `${HINKAL_GO}internal/constants/protocol.go#L20`,
          },
          {
            title:
              'Same sealing in @hinkal/common 0.4.1 (encryptDecryptUtxo.mjs)',
            url: SDK,
          },
          {
            title:
              'Relay requests carry the commitments, amounts and nullifiers of the spent notes',
            url: `${HINKAL_GO}internal/types/circom_data_types.go#L127-L134`,
          },
          {
            title:
              'Same data in @hinkal/common 0.4.1 (buildCommitmentValidationData.mjs, sent by hinkalTransact.mjs)',
            url: SDK,
          },
          { section: 'upgrades-and-governance' },
        ],
      },
      futureAdversary: {
        sentiment: 'bad',
        exposureShort:
          "Whoever breaks elliptic-curve cryptography recovers the enclave's private note key and opens every encrypted note in the pool.",
        exposureContinued:
          "Each transaction also publishes two curve points whose discrete logarithm is the sender's nullifying key.",
        interior: OPEN,
        sources: [
          {
            title: 'H1 = k·H0 in the stealth address',
            url: `${CIRCUITS}StealthAddressCalculator.circom#L22-L33`,
          },
          {
            title: 'Keys derive from one signature (Poseidon)',
            url: `${HINKAL_GO}internal/data-structures/crypto-keys/keys.go#L78-L156`,
          },
          {
            title: 'Every note is sealed to the enclave key',
            url: `${HINKAL_GO}internal/data-structures/utxo/encrypt.go#L24-L30`,
          },
        ],
      },
    },
    advice: [
      {
        name: 'Deposit',
        text: 'Deposit the token with the most depositors who keep their funds in the pool, since a withdrawal hides only among deposits of its token.',
        against: ['chainAnalyst'],
      },
      {
        name: 'Wait',
        text: A.wait,
        against: ['chainAnalyst'],
        randomWait: true,
      },
      {
        name: 'Withdraw',
        text: `${A.relayer('relayer')} ${A.commonAmounts} Send each withdrawal to a fresh address outside the extension, typed as an address and not an .eth name, and spend from it with a separate wallet.`,
        against: ['publicObserver', 'chainAnalyst'],
      },
    ],
  })
}
