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
// @hinkal/common 0.4.1, the SDK the extension bundles. Same logic in the CRX.
const SDK = 'https://unpkg.com/@hinkal/common@0.4.1/common/src/'
const POOL =
  'https://etherscan.io/address/0x7cb60446d7635C68EDf1c568cac74A1f98c1Cfa4'

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

// Each transaction lists its tokens, and swaps move funds out of the pool in
// public. The SDK folds a private send's 0.25% fee into the public flat
// relayer fee (fees.utils calculateModifiedFeeStructure), so the fee shows
// roughly the amount.
const INTERIOR: PrivacyExposureMap = {
  sender: 'private',
  recipient: 'private',
  amount: {
    verdict: 'exposed',
    note: "Shown by swaps and by a private send's fee.",
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
      text: 'Hides which deposit funds which withdrawal, and who pays whom inside the pool. Deposits, withdrawals and the tokens of every transaction are public.',
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort:
          'A zero-knowledge proof hides which notes a transaction spends, so nothing public ties a withdrawal to its deposit.',
        exposureContinued: `${S.entryExitPublic()} Swaps show their amounts, and a private send's public relayer fee includes a fixed share of its amount.`,
        interior: INTERIOR,
        sources: [
          { contract: 'Hinkal', title: 'transact and prooflessDeposit' },
          { title: 'Main circuit', url: `${CIRCUITS}MainEVMCircuit.circom` },
          {
            title:
              'A private send adds its 0.25% fee to the public flat fee (calculateModifiedFeeStructure)',
            url: `${SDK}functions/utils/fees.utils.mjs`,
            checked: '2026-11-24',
          },
          { contract: 'LifiExternalAction', title: 'Swaps' },
        ],
      },
      chainAnalyst: {
        sentiment: 'warning',
        exposureShort:
          "A withdrawal hides among its token's depositors who left funds in the pool, fewer than 1,000 for every token.",
        exposureContinued:
          'Most USDT deposits are followed within ten minutes by a withdrawal of about the same amount, which pairs the two. An unusual amount withdrawn whole links a deposit to its withdrawal.',
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Private only when funds wait in the pool among other deposits of their token.',
          },
        },
        sources: [
          {
            title:
              'Deposits since 2026-07-16 through every path: ETH 382 from 187 addresses, USDT 364 from 117, USDC 218 from 118',
            url: POOL,
            checked: '2026-11-24',
          },
          {
            title:
              'Deposits followed within ten minutes by a withdrawal of the same amount less up to 3%: USDT 68%, USDC 47%, ETH 39%. With such pairs of one day left out, 119 ETH, 55 USDT and 56 USDC addresses remain',
            url: POOL,
            checked: '2026-11-24',
          },
        ],
      },
      networkObserver: {
        sentiment: 'bad',
        exposureShort:
          "Public RPC nodes read the user's public accounts every 10 seconds and see the same session wait for each withdrawal, which pairs them.",
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
              'Hinkal Wallet 0.0.64 reads the balance of every public account at publicnode.com every 10 seconds',
            url: REFERENCE_APP.url,
            checked: '2026-11-20',
          },
          {
            title:
              'After a send it polls publicnode.com for new blocks until the transaction confirms (waitForTransaction)',
            url: REFERENCE_APP.url,
            checked: '2026-11-20',
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort:
          "Hinkal's relayers learn which notes each spend uses, and every note is also encrypted to Hinkal's enclave, so Hinkal can link deposits to withdrawals.",
        exposureContinued: `The closed extension sends the enclave the nullifying key from the first launch by default, without checking which code the enclave runs. The timelock can replace the helper and the verifiers after ${upgradeDelay}.`,
        interior: OPEN,
        sources: [
          {
            title:
              'Relay requests carry the commitments, amounts and nullifiers of the spent notes',
            url: `${SDK}functions/pre-transaction/buildCommitmentValidationData.mjs`,
            checked: '2026-11-24',
          },
          {
            title:
              'Every note is sealed to the recipient and to ENCLAVE_PUBKEY',
            url: `${SDK}data-structures/crypto-keys/encryptDecryptUtxo.mjs`,
            checked: '2026-11-24',
          },
          {
            title:
              'Hinkal Wallet 0.0.64 posts the sealed nullifying key to enclave-server.hinkal.io 14 seconds after wallet creation',
            url: REFERENCE_APP.url,
            checked: '2026-11-19',
          },
          { section: 'upgrades-and-governance' },
        ],
      },
      futureAdversary: {
        sentiment: 'bad',
        exposureShort:
          "Whoever breaks elliptic-curve cryptography recovers the enclave's private note key and opens every encrypted note in the pool.",
        exposureContinued:
          "Each transaction also publishes two curve points whose discrete logarithm is the sender's nullifying key, which marks their spends and opens their notes.",
        interior: OPEN,
        sources: [
          {
            title: 'ENCLAVE_PUBKEY, a constant Curve25519 key',
            url: `${SDK}constants/protocol.constants.mjs`,
            checked: '2026-11-24',
          },
          {
            title: 'H1 = k·H0 in the stealth address',
            url: `${CIRCUITS}StealthAddressCalculator.circom#L22-L33`,
          },
          {
            title: 'The note key derives from the nullifying key',
            url: `${SDK}data-structures/crypto-keys/keys.mjs`,
            checked: '2026-11-24',
          },
        ],
      },
    },
    advice: [
      {
        name: 'Shield',
        text: 'Shield ETH, the token with the most depositors who keep funds in the pool.',
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
        text: `${A.commonAmounts} ${A.freshAddress}`,
        against: ['chainAnalyst'],
      },
    ],
  })
}
