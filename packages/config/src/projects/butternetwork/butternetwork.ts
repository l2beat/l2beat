import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('butternetwork')

export const butternetwork: BaseProject = {
  id: ProjectId('butternetwork'),
  slug: 'butternetwork',
  name: 'Butter Network',
  shortName: 'Butter',
  addedAt: UnixTime(1785915246),
  interopConfig: {
    description:
      'Liquidity bridge and messaging protocol using the MAP relay chain (an alt-L1) and its light-client network to verify cross-chain messages.',
    intent: {
      color: '#F5A524',
      intentModel: {
        value: 'Liquidity network',
        description:
          'Transfers are filled from bridge-owned liquidity on the destination chain after the message settles on the MAP relay chain. MAPO is the only token that is burned and minted instead.',
      },
      userRecovery: {
        value: 'None',
        sentiment: 'bad',
        description:
          'There is no onchain refund: once assets are locked on the source chain, no contract path returns them. Failed destination deliveries can be permissionlessly re-executed via retryMessageIn, and failed token payouts are swept to an admin-set failedReceiver address.',
      },
      solverAccess: {
        value: 'Internal',
        sentiment: 'bad',
        description:
          'There are no independent solvers or auctions: destination payouts come from bridge-held pool liquidity and only after settlement on the MAP relay chain. Anyone can trigger a payout by relaying the settled message with a receipt proof.',
      },
      settlement: {
        value: 'Internal (sidechain)',
        sentiment: 'bad',
        description:
          'Transfers settle through the MAP relay chain, an external proof-of-stake chain. Destination chains verify only BLS signatures of its validator set via onchain light clients.',
      },
    },
    // as of 2026-08, MAPO (on ethereum and bsc) is the only token the bridge
    // actually burns/mints, everything else is lock&release
    plugins: [
      { plugin: 'butternetwork', bridgeType: 'burnAndMint' },
      { plugin: 'butternetwork', bridgeType: 'nonMinting' },
    ],
    type: 'intent',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
