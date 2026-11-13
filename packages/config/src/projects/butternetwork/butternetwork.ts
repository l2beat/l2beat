import { assert, formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('butternetwork')

// Discovery watches only the Base bridge. The bridge is verified, its verifier
// and reserve are not, so their texts rest on getters read by full ABI.
// Once they are verified, review them and rewrite the warning and settlement.
assert(
  discovery.getContract('Butter Verifier').unverified === true &&
    discovery.getContract('Butter Reserve').unverified === true,
  'Butter Verifier or Reserve on Base is verified: review the new code',
)
const verifierSigners = discovery.getContractValue<string[]>(
  'Butter Verifier',
  'signers',
).length
const verifierQuorum = discovery.getContractValue<number>(
  'Butter Verifier',
  'quorum',
)
// AuthorityManager of the bridge, the reserve has its own
const relayerCount = discovery.getContractValue<string[]>(
  'base:0xACC31A6756B60304C03d6626fc98c062E4539CCA',
  'relayers',
).length
const releaseDelay = formatSeconds(
  discovery.getContractValue<number>('Butter Bridge', 'releaseDelay'),
)

export const butternetwork: BaseProject = {
  id: ProjectId('butternetwork'),
  slug: 'butternetwork',
  name: 'Butter Network',
  shortName: 'Butter',
  addedAt: UnixTime(1785915246),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: `On Base, the verifier and the reserve of the bridge run unverified code. The verifier's getters show that inbound messages need signatures of ${verifierQuorum} of ${verifierSigners} signers.`,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  interopConfig: {
    description:
      'Liquidity bridge and messaging protocol that routes cross-chain messages through the MAP relay chain (an alt-L1).',
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
          'There is no onchain refund: once assets are locked on the source chain, no contract path returns them. A payout that fails to reach the recipient goes to an admin-set failedReceiver address.',
      },
      solverAccess: {
        value: 'Internal',
        sentiment: 'bad',
        description: `There are no independent solvers or auctions: destination payouts come from the bridge's reserve, after settlement on the MAP relay chain. Only ${relayerCount} permissioned relayers can submit messages and release payouts.`,
      },
      settlement: {
        value: 'Internal (sidechain)',
        sentiment: 'bad',
        description: `Transfers settle through the MAP relay chain, an external proof-of-stake chain. On Base, the bridge accepts a message from it with signatures of ${verifierQuorum} of ${verifierSigners} signers that the admins set. The payout waits ${releaseDelay}, during which guardians can freeze it.`,
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
