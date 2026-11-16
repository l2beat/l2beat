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

// Discovery watches the Ethereum and Base deployments, which share addresses
// except for the verifier. The bridge is verified, its verifier and reserve
// are not, so their texts rest on getters read by full ABI and on fork tests.
// Once they are verified, review them and rewrite the warning and settlement.
const BRIDGE = '0x0000317Bec33Af037b5fAb2028f52d14658F6A56'
const RESERVE = '0xf95f0359704A66DB38d159e5A99721F069f30D9c'
const BRIDGE_AUTHORITY = '0xACC31A6756B60304C03d6626fc98c062E4539CCA'
const VERIFIERS = {
  eth: '0xA6a02d654c9a941EB95e8A925655903aD77BBe6B',
  base: '0xC1eFc08ab7481a9303D1670e8f955ABb38Cd69D4',
}
const perChain = (['eth', 'base'] as const).map((chain) => {
  const verifier = `${chain}:${VERIFIERS[chain]}`
  assert(
    discovery.getContract(verifier).unverified === true &&
      discovery.getContract(`${chain}:${RESERVE}`).unverified === true,
    'Butter Verifier or Reserve is verified: review the new code',
    { chain },
  )
  return {
    signers: discovery.getContractValue<string[]>(verifier, 'signers').length,
    quorum: discovery.getContractValue<number>(verifier, 'quorum'),
    relayers: discovery.getContractValue<string[]>(
      `${chain}:${BRIDGE_AUTHORITY}`,
      'relayers',
    ).length,
    releaseDelay: discovery.getContractValue<number>(
      `${chain}:${BRIDGE}`,
      'releaseDelay',
    ),
  }
})
const [ethereum, base] = perChain
assert(
  JSON.stringify(ethereum) === JSON.stringify(base),
  'Butter on Ethereum and Base differ, describe each chain in the texts',
)
const verifierSigners = ethereum.signers
const verifierQuorum = ethereum.quorum
const relayerCount = ethereum.relayers
const releaseDelay = formatSeconds(ethereum.releaseDelay)

export const butternetwork: BaseProject = {
  id: ProjectId('butternetwork'),
  slug: 'butternetwork',
  name: 'Butter Network',
  shortName: 'Butter',
  addedAt: UnixTime(1785915246),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: `On Ethereum and Base, the verifier and the reserve of the bridge run unverified code. The verifier's getters show that inbound messages need signatures of ${verifierQuorum} of ${verifierSigners} signers. Each admin multisig can replace these signers, and each reserve admin multisig can withdraw the reserve.`,
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
        description: `Transfers settle through the MAP relay chain, an external proof-of-stake chain. On Ethereum and Base, the bridge accepts a message from it with signatures of ${verifierQuorum} of ${verifierSigners} signers that the admins set. The payout waits ${releaseDelay}, during which guardians can freeze it.`,
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
