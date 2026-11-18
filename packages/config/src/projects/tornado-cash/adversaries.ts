import {
  USAGE_FLOW_SNIPPETS as A,
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
  toolLink,
} from '../../common/privacyAdversaries'

// v2.1, the circuits behind the verified verifier.
const CIRCUITS =
  'https://github.com/tornadocash/tornado-core/blob/a533ad9ffb62163a42d4fa9a09984c5dd4e5c41d/circuits/'
// ETHBEAT's recipe that rebuilds the pinned app to its IPFS hash: the DAO's
// Docker recipe (tornado-dao/tornado-ipfs-ui d2aa401) with two download fixes.
export const RECIPE =
  'https://github.com/l2beat/l2beat/blob/main/packages/config/src/projects/tornado-cash/verificationSteps-app.md'
// The commit governance pinned on tornadocash.eth (proposal 73).
const APP =
  'https://github.com/torndao777-eng/classic-ui/blob/8af0abd14d7eeb734f943b968ce687cb5946eac6/'

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
    usageFlow: [
      {
        name: 'Load',
        text: `Reviewed with all traffic routed through ${toolLink('nymVpn')} (Random profile) and the reviewed release loaded from a local IPFS node (${toolLink('ipfsDesktop')}) at \`localhost:8080/ipfs/${appCid}\`. A [rebuild](${RECIPE}) from the reviewed source produces the same hash.`,
        against: ['networkObserver', 'privilegedInsider'],
        outside: true,
      },
      {
        name: 'Deposit',
        text: 'Assumes deposits into the pool with the most depositors, made as several notes at different times rather than one batch, with notes saved locally and the onchain backup off.',
        against: ['chainAnalyst', 'futureAdversary'],
      },
      {
        name: 'Wait',
        text: A.wait,
        against: ['chainAnalyst'],
        randomWait: true,
      },
      {
        name: 'Exit',
        text: 'Assumes each note is withdrawn separately through a widely used relayer, with no wallet connected, to a new address.',
        against: ['publicObserver', 'chainAnalyst', 'networkObserver'],
      },
    ],
  })
}
