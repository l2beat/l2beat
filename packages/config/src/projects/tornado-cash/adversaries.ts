import {
  ADVICE_SNIPPETS as A,
  adviceLink,
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

// v2.1, the circuits behind the verified verifier.
const CIRCUITS =
  'https://github.com/tornadocash/tornado-core/blob/a533ad9ffb62163a42d4fa9a09984c5dd4e5c41d/circuits/'
// The DAO's Docker recipe that rebuilds the pinned app to its IPFS hash.
const RECIPE =
  'https://github.com/tornado-dao/tornado-ipfs-ui/tree/d2aa401746e1b1195ff692a051636b8c5c43d2e5'
// The commit governance pinned on tornadocash.eth (proposal 68).
const APP =
  'https://github.com/tornado-dao/classic-ui/blob/17c54dae9ad91bb3c6d62a7860df6cd365ab76d4/'

/** `appCid` is the reviewed release, which the steps load instead of the name. */
export function tornadoCashAdversaries(upgradeDelay: string, appCid: string) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'linkage',
      text: 'Hides which deposit funds which withdrawal. Everything else is public.',
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort:
          'Each pool has one fixed amount and no in-pool transfers, so every withdrawal spends exactly one deposit.',
        sources: [
          { contract: 'Pool_1_ETH', title: '1 ETH pool' },
          { title: 'Withdrawal circuit', url: CIRCUITS + 'withdraw.circom' },
        ],
      },
      chainAnalyst: {
        sentiment: 'good',
        exposureShort:
          'A relayed withdrawal hides among all unspent deposits of its pool, the anonymity set, which differs sharply between pools.',
        exposureContinued: `Timing, address reuse and relayer choice narrow it further. ${S.walletFingerprint('relayer')}`,
        sources: [
          {
            contract: 'Pool_1_ETH',
            title: 'withdraw: any relayer, paid from the withdrawn amount',
          },
          {
            title: 'Tutela (arXiv:2201.06811)',
            url: 'https://arxiv.org/abs/2201.06811',
          },
          {
            title: 'Blockchain is Watching You (arXiv:2005.14051)',
            url: 'https://arxiv.org/abs/2005.14051',
          },
        ],
      },
      networkObserver: {
        sentiment: 'good',
        exposureShort:
          "The app downloads every deposit of a pool, so over an IP-hiding route its services learn the pool but not the user's note.",
        exposureContinued:
          "The Graph learns whether the note is newer than the app's event cache. Every listed relayer gets a status request, and the chosen one receives the finished withdrawal.",
        sources: [
          {
            title: 'Deposits fetched per pool and matched locally',
            url: APP + 'services/events.js#L90-L115',
          },
          {
            title:
              "Tree slices download newest first and stop at the note's slice",
            url: APP + 'services/merkleTree.js#L66-L102',
          },
          {
            title: 'The relayer receives only the finished withdrawal',
            url: APP + 'store/relayer.js#L430-L460',
          },
          {
            title: 'Only withdrawals without a relayer need a wallet',
            url: APP + 'components/withdraw/Withdraw.vue#L224-L226',
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'good',
        exposureShort:
          'The pools cannot be paused, upgraded or made to reveal anything.',
        exposureContinued: `Token governance controls the app pinned on tornadocash.eth, the router's pool list and the relayer list. Every change waits at least ${upgradeDelay} from proposal to execution.`,
        sources: [
          { contract: 'Pool_0.1_ETH', title: '0.1 ETH pool (no operator)' },
          { section: 'upgrades-and-governance' },
          {
            title: "Build recipe that recomputes the pinned app's IPFS hash",
            url: RECIPE,
          },
        ],
      },
      futureAdversary: {
        sentiment: 'warning',
        exposureShort:
          'Whoever breaks elliptic-curve cryptography can test whether a given deposit could fund a withdrawal, since commitments use a Pedersen hash on an elliptic curve.',
        exposureContinued:
          'The test shrinks the candidate set without singling out one deposit. Notes backed up onchain are encrypted with elliptic-curve keys and become readable.',
        sources: [
          {
            title: 'Pedersen hash circuit (pinned circomlib fork)',
            url: 'https://github.com/tornadocash/circomlib/blob/c372f14d324d57339c88451834bf2824e73bbdbc/circuits/pedersen.circom',
          },
          {
            title: 'Commitment and nullifier hashing',
            url: CIRCUITS + 'withdraw.circom',
          },
          { contract: 'TornadoRouter', title: 'Onchain note backups' },
        ],
      },
    },
    advice: [
      {
        name: 'Load',
        text: `Turn on NymVPN with the Random profile, an ${adviceLink('IP-hiding route', 'ipHidingRoutes')} for all of the computer's traffic. Install IPFS Desktop and open the reviewed release at \`http://localhost:8080/ipfs/${appCid}\`. A [rebuild](${RECIPE}) from the reviewed source gives the same hash.`,
        against: ['networkObserver', 'privilegedInsider'],
        outside: true,
      },
      {
        name: 'Deposit',
        text: `${A.largestPool} Deposit several notes at different times, not in one batch, and keep each note on your device with the onchain backup off.`,
        against: ['chainAnalyst', 'futureAdversary'],
      },
      {
        name: 'Wait',
        text: A.wait,
        against: ['chainAnalyst'],
      },
      {
        name: 'Exit',
        text: `${A.relayer('relayer')} Pick a popular one, connect no wallet and withdraw each note on its own. ${A.freshAddress}`,
        against: ['publicObserver', 'chainAnalyst', 'networkObserver'],
      },
    ],
  })
}
