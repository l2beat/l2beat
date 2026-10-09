import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const UMBRA =
  'https://github.com/ScopeLift/umbra-protocol/blob/947c4f3b9b89f6cf5d69b2d43d3cffec673da655/'
const ANALYSIS = 'https://arxiv.org/html/2308.01703v2'

export function umbraAdversaries(registrants: number) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'recipient',
      text: 'Hides which registered recipient a stealth payment is for. The payer knows; sender, asset, amount and where the funds go next are public.',
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort:
          "Each payment goes to a fresh stealth address, and only the recipient's viewing key shows whose it is.",
        exposureContinued:
          'The registry lists every recipient who could be behind it, with their key history.',
        advice:
          'Withdraw to a fresh address that is not registered and has no public link to you.',
        sources: [
          {
            contract: 'Umbra',
            title: 'Announcement and TokenWithdrawal publish the fund path',
          },
          {
            contract: 'StealthKeyRegistry',
            title: 'StealthKeyChanged publishes recipients and key changes',
          },
          {
            title:
              'Matching decrypts the secret with the viewing key and checks the stealth address',
            url: UMBRA + 'umbra-js/src/classes/Umbra.ts#L707-L721',
          },
        ],
      },
      chainAnalyst: {
        sentiment: 'good',
        exposureShort: `Any of the ${registrants.toLocaleString('en-US')} registered recipients could be behind a stealth address.`,
        exposureContinued:
          'Registrations are rare and public, so a payment that lands minutes after one points to that registrant. Several payments withdrawn to one address share a recipient.',
        advice: `Register long before anyone pays you, and withdraw each payment to its own address. ${S.exitViaRelayer('relayer for tokens')}`,
        sources: [
          {
            contract: 'StealthKeyRegistry',
            title: 'Each registration is public with its block',
          },
          {
            title:
              'Kovács and Seres: reuse heuristics and their reach on mainnet (sections 6 and 7)',
            url: ANALYSIS + '#S6',
          },
          {
            title:
              'The app warns about registered, named and sender destinations, and lets you proceed',
            url: UMBRA + 'frontend/src/utils/address.ts#L146-L241',
          },
        ],
      },
      networkObserver: {
        sentiment: 'warning',
        exposureShort:
          "The hosted app checks the payee's address with its Alchemy RPC seconds before each payment, so timing ties the payee to the payment.",
        exposureContinued:
          "When the payee withdraws, the same RPC receives their wallet address and the withdrawal address in one session. The wallet's own RPC receives the wallet address together with the matched stealth addresses.",
        advice:
          'Pay and withdraw from a local build with every RPC URL set to your own node, and point your wallet at that node.',
        sources: [
          {
            title:
              "Sending checks the recipient against a sanctions list through the app's mainnet RPC",
            url: UMBRA + 'umbra-js/src/classes/Umbra.ts#L219-L227',
          },
          {
            title: 'Connecting checks the wallet address through the same RPC',
            url: UMBRA + 'frontend/src/store/wallet.ts#L273',
          },
          {
            title: 'Withdrawing checks the destination through the same RPC',
            url: UMBRA + 'frontend/src/components/AccountReceiveTable.vue#L736',
          },
          {
            title:
              'Matched stealth addresses go to the wallet RPC in one balance call',
            url:
              UMBRA +
              'frontend/src/components/AccountReceiveTable.vue#L606-L625',
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'warning',
        exposureShort:
          'The hosted app gives the operator your wallet address on every scan and your withdrawal address in the same session.',
        exposureContinued:
          'Token withdrawals also hand its relayer the stealth address. The operator serves the app and can change it at any time. The contracts are immutable, and only you hold your viewing key.',
        advice: `${S.localBuild} Leave its indexer URL empty, so it reads payments from your node.`,
        sources: [
          {
            title:
              "Each scan first asks the indexer for the connected wallet's registration",
            url: UMBRA + 'umbra-js/src/utils/utils.ts#L336-L349',
          },
          {
            title:
              'The registry read stores no block, so the lookup repeats on every scan',
            url: UMBRA + 'frontend/src/store/wallet.ts#L605-L615',
          },
          {
            title:
              "Every withdrawal sends the destination to the operator's API",
            url: UMBRA + 'frontend/src/utils/address.ts#L201-L214',
          },
          {
            title: 'Token withdrawals send the stealth address to the relayer',
            url:
              UMBRA +
              'frontend/src/components/AccountReceiveTable.vue#L767-L768',
          },
        ],
      },
      futureAdversary: {
        sentiment: 'bad',
        exposureShort:
          'Whoever breaks elliptic-curve cryptography matches every past payment to its registered recipient from chain data alone.',
        exposureContinued:
          "The registry holds each recipient's public keys, and each announcement the payer's one-time key and the encrypted secret. Recovering the private keys decrypts the secret and confirms the stealth address.",
        sources: [
          {
            contract: 'Umbra',
            title: 'Announcement archives the one-time key and ciphertext',
          },
          {
            contract: 'StealthKeyRegistry',
            title: 'Historical public viewing and spending keys',
          },
          {
            title:
              'A shared secret from elliptic-curve keys encrypts the secret',
            url: UMBRA + 'umbra-js/src/classes/KeyPair.ts#L121-L157',
          },
        ],
      },
    },
  })
}
