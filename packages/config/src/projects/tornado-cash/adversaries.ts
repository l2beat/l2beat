import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

// v2.1, the circuits behind the verified verifier.
const CIRCUITS =
  'https://github.com/tornadocash/tornado-core/blob/a533ad9ffb62163a42d4fa9a09984c5dd4e5c41d/circuits/'
// The commit governance pinned on tornadocash.eth (proposal 68).
const APP =
  'https://github.com/tornado-dao/classic-ui/blob/17c54dae9ad91bb3c6d62a7860df6cd365ab76d4/'

export function tornadoCashAdversaries(upgradeDelay: string) {
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
        advice: S.exitViaRelayer('relayer'),
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
        advice: `${S.largeAnonymitySet} Deposit and withdraw several notes at different times, not in batches. ${S.freshExit}`,
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
          'The app works in Tor Browser and downloads every deposit of a pool, so its services learn the pool but never your note.',
        exposureContinued:
          'Every listed relayer gets a status request, and the chosen one receives the finished withdrawal.',
        advice: `${S.ownNodeAndTor('relayer')} Withdraw without connecting a wallet.`,
        sources: [
          {
            title: 'Deposits fetched per pool and matched locally',
            url: APP + 'services/events.js#L90-L115',
          },
          {
            title: 'The relayer receives only the finished withdrawal',
            url: APP + 'store/relayer.js#L430-L460',
          },
          {
            title: 'Custom RPC setting',
            url: APP + 'components/Settings.vue#L8-L50',
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
        advice: `Load the app from the IPFS hash on tornadocash.eth through your own IPFS node. ${S.localBuild}`,
        sources: [
          { contract: 'Pool_0.1_ETH', title: '0.1 ETH pool (no operator)' },
          { section: 'upgrades-and-governance' },
          {
            title: "Build recipe that recomputes the pinned app's IPFS hash",
            url: 'https://github.com/tornado-dao/tornado-ipfs-ui',
          },
        ],
      },
      futureAdversary: {
        sentiment: 'warning',
        exposureShort: 'Commitments use a Pedersen hash on an elliptic curve.',
        exposureContinued:
          'Whoever breaks elliptic-curve cryptography could test whether a given deposit can fund a withdrawal, shrinking the candidate set without singling out one deposit. Notes backed up onchain are encrypted with elliptic-curve keys and become readable.',
        advice:
          'Keep the note on your device and leave the onchain backup off.',
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
  })
}
