import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('lido')

export const lido: BaseProject = {
  id: ProjectId('lido'),
  slug: 'lido',
  name: 'Lido',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Lido is Ethereum’s largest liquid staking protocol. Users deposit ETH and receive stETH, a rebasing token whose supply tracks the protocol’s total pooled ETH (~9.5M ETH) staked across four node-operator modules. Because staked ETH lives on the beacon chain, the core trust surface is the execution-layer↔consensus-layer boundary, bridged by a 5-of-9 oracle committee (bounded by on-chain sanity checks) and by trustless EIP-4788 beacon-root proofs. Withdrawal credentials are set by the protocol, so node operators cannot take user principal. Every protocol-critical change is controlled by the Lido DAO through Dual Governance, which gives stETH holders a veto and a rage-quit exit against DAO proposals over a 3-day-plus timelock.',
    detailedDescription: readProjectMarkdown('lido', 'detailedDescription'),
    links: {
      websites: ['https://lido.fi/'],
      documentation: ['https://docs.lido.fi/'],
      repositories: ['https://github.com/lidofinance/core'],
      socialMedia: ['https://x.com/LidoFinance'],
    },
    badges: [],
  },
  defiInfo: {
    category: 'Liquid Staking',
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'Ethereum consensus layer',
      icon: 'ethereum',
      description:
        'Staked ETH, validator balances, exits and slashings live on the beacon chain, which Lido’s contracts cannot read directly. Aggregate accounting and withdrawal finalization depend on the oracle committee reporting consensus-layer state; targeted facts use trustless EIP-4788 beacon-root proofs. A halt or corruption of the consensus layer halts rebases and withdrawal finalization.',
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
