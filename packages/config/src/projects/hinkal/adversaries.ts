import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

const PROTOCOL =
  'https://github.com/Hinkal-Protocol/Hinkal-Contracts-Circuits/blob/61b6839aa80fc0c33bfdcde0323753c83cb2ce67/'
const SDK = 'https://unpkg.com/@hinkal/common@0.4.1/common/src/'
// Hinkal Wallet 0.0.64, the reference app: closed, so its own behaviour is the source.
const APP =
  'https://chromewebstore.google.com/detail/hinkal-wallet/khfjgapjfcdoffmklchibpepboholpbe'
const POOL =
  'https://etherscan.io/address/0x7cb60446d7635C68EDf1c568cac74A1f98c1Cfa4'

const INTERIOR: PrivacyExposureMap = {
  sender: 'private',
  recipient: 'private',
  amount: { verdict: 'atRisk', note: 'Public in swaps and bridges.' },
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
          'A zero-knowledge proof spends notes without naming them, so nothing public ties a withdrawal to its deposit.',
        exposureContinued: `${S.entryExitPublic()} Swaps and bridges also show their amounts.`,
        interior: INTERIOR,
        sources: [
          { contract: 'Hinkal' },
          {
            title: 'Public inputs: tokens and amount changes',
            url: `${PROTOCOL}contracts/CircomDataBuilder.sol#L180-L231`,
          },
        ],
      },
      chainAnalyst: {
        sentiment: 'bad',
        exposureShort:
          'About 50 addresses have deposited each token, too few to hide a withdrawal among.',
        exposureContinued:
          'Most deposits leave again as the same amount seconds later, which pairs sender and recipient and leaves few notes to hide among.',
        interior: {
          sender: 'atRisk',
          recipient: 'atRisk',
          amount: {
            verdict: 'atRisk',
            note: 'Bounded by the public deposit and withdrawal amounts.',
          },
          asset: 'exposed',
          linkage: {
            verdict: 'exposed',
            note: 'The set is too small to hide in.',
          },
        },
        sources: [
          {
            title:
              'Pool transactions: 49 USDT, 60 ETH and 47 USDC depositors since 2026-07-16 (2026-11-19)',
            url: POOL,
          },
          {
            title:
              '155 of 160 USDT deposits are followed within a day by a withdrawal of the same amount, half of them within 12 seconds (2026-11-19)',
            url: `${POOL}#tokentxns`,
          },
        ],
      },
      networkObserver: {
        sentiment: 'bad',
        exposureShort:
          "Public RPC nodes get the public account's address every few seconds while the wallet is open, so they can pair it with a withdrawal by timing.",
        exposureContinued:
          "The wallet has no RPC setting, and as a Chrome extension it cannot run in Tor Browser. ipapi.co and MoonPay get the user's IP at each start.",
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Private only on a busy pool, since public RPC nodes see the public account in each session.',
          },
        },
        sources: [
          {
            title:
              'The wallet reads balances at publicnode.com and other fixed public RPC nodes every 10 seconds (2026-11-19)',
            url: APP,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort:
          "Each note is also encrypted to a key of Hinkal's enclave, and the wallet sends that enclave the nullifying key, which reads the user's notes.",
        exposureContinued: `It does so within seconds of wallet creation, before Remote Proving can be switched off, and without checking which code the enclave runs. Hinkal's multisig can replace the verifiers after ${upgradeDelay}.`,
        interior: OPEN,
        sources: [
          { section: 'upgrades-and-governance' },
          {
            title:
              'The wallet posts the sealed nullifying key to enclave-server.hinkal.io 14 seconds after its creation (2026-11-19)',
            url: APP,
          },
          {
            title: 'Notes are sealed to the recipient and to ENCLAVE_PUBKEY',
            url: `${SDK}data-structures/crypto-keys/encryptDecryptUtxo.mjs`,
          },
        ],
      },
      futureAdversary: {
        sentiment: 'bad',
        exposureShort:
          "Whoever breaks elliptic-curve cryptography decrypts every note, since each one is also encrypted to Hinkal's long-lived public key.",
        exposureContinued:
          "Each transaction also publishes a pair of points that reduces to the sender's nullifying key, which opens their notes.",
        interior: OPEN,
        sources: [
          {
            title: 'ENCLAVE_PUBKEY, a constant Curve25519 key',
            url: `${SDK}constants/protocol.constants.mjs`,
          },
          {
            title: 'H1 is the nullifying key times H0',
            url: `${PROTOCOL}circuits/StealthAddressCalculator.circom#L20-L23`,
          },
          {
            title: 'The encryption key derives from the nullifying key',
            url: `${SDK}data-structures/crypto-keys/keys.mjs`,
          },
        ],
      },
    },
  })
}
