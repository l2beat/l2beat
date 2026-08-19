import {
  assert,
  ChainSpecificAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('relay')

// "`RelayDepository.execute()` performs arbitrary external calls authorized
// by a single signature from the registered `allocator` address — on Base a
// plain address without contract code"
const allocator = discovery.getContractValue<string>(
  'RelayDepository',
  'allocator',
)
assert(
  discovery.isEOA(ChainSpecificAddress(allocator)),
  'The RelayDepository allocator is now a contract (was a plain ECDSA key): update detailedDescription.md',
)
// "the Depository's `owner` — currently an EOA on Base — can replace the
// allocator at any time and without delay"
const depositoryOwner = discovery.getContractValue<string>(
  'RelayDepository',
  'owner',
)
assert(
  discovery.isEOA(ChainSpecificAddress(depositoryOwner)),
  'The RelayDepository owner is no longer an EOA: update detailedDescription.md',
)
// "None of the onchain contracts are proxies — the `RelayDepository`,
// `RelayReceiver`, `RelayRouterV3`, and `RelayApprovalProxyV3` are all
// immutable."
for (const name of [
  'RelayDepository',
  'RelayReceiver',
  'RelayRouterV3',
  'RelayApprovalProxyV3',
]) {
  assert(
    discovery.getContractValue<boolean>(name, '$immutable') === true,
    `${name} is no longer immutable: update detailedDescription.md`,
  )
}

const RELAY_DETAILED_DESCRIPTION = readProjectMarkdown(
  'relay',
  'detailedDescription',
)

export const relay: BaseProject = {
  id: ProjectId('relay'),
  slug: 'relay',
  name: 'Relay',
  shortName: undefined,
  aliases: ['Reservoir'],
  addedAt: UnixTime(1769070497),
  interopConfig: {
    description:
      'Intent-based centralized bridge optimised for speed, multichain and multiasset support. A centralized API quotes orders and Relay-operated solvers fill them from their own liquidity; the onchain footprint is minimal and settlement depends on a single allocator key per chain.',
    detailedDescription: RELAY_DETAILED_DESCRIPTION,
    intent: {
      color: '#14B8A6',
      intentModel: {
        value: 'Intent framework',
        description:
          'Users pay against a quote from the centralized Relay API and Relay solvers fill on the destination chain from their own liquidity.',
      },
      userRecovery: {
        value: 'Request refund',
        sentiment: 'bad',
        description:
          'There is no onchain refund option. Failed transfers depend on Relay-operated recovery.',
      },
      solverAccess: {
        value: 'Internal',
        sentiment: 'bad',
        description: 'Transfers are filled by Relay-operated infrastructure.',
      },
      settlement: {
        value: 'Internal',
        sentiment: 'bad',
        description:
          "Settlement depends on Relay's centralized oracle and allocator flow: escrowed deposits are released by a single allocator signature, and the escrow owner can replace the allocator without delay.",
      },
    },
    plugins: [
      {
        plugin: 'relay',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      // no upgradeability risk: all discovered contracts are immutable
      risks: [],
    },
  },
}
