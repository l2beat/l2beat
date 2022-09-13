import { providers } from 'ethers'

import { getProxyAdmin } from '../../common/arbitrum/proxyAdmin'
import { getRollup } from '../../common/arbitrum/rollup'
import { getSimpleEip1967Proxy } from '../../common/getSimpleEip1967Proxy'
import { getGnosisSafe } from '../../common/gnosisSafe'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'

export const NOVA_NAME = 'nova'

export async function getNovaParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: NOVA_NAME,
    contracts: await Promise.all([
      getGnosisSafe(provider, addresses.multisig, 'Multisig'),
      getRollup(provider, addresses.rollup),
      getProxyAdmin(provider, addresses.proxyAdmin1, 'ProxyAdmin1'),
      getProxyAdmin(provider, addresses.proxyAdmin2, 'ProxyAdmin2'),
      getSimpleEip1967Proxy(provider, addresses.inbox, 'Inbox'),
      getSimpleEip1967Proxy(
        provider,
        addresses.sequencerInbox,
        'SequencerInbox',
      ),
      getSimpleEip1967Proxy(provider, addresses.outbox, 'Outbox'),
      getSimpleEip1967Proxy(provider, addresses.bridge, 'Bridge'),
      getSimpleEip1967Proxy(
        provider,
        addresses.challengeManager,
        'ChallengeManager',
      ),
      getSimpleEip1967Proxy(
        provider,
        addresses.l1CustomGateway,
        'L1CustomGateway',
      ),
      getSimpleEip1967Proxy(
        provider,
        addresses.l1ERC20Gateway,
        'L1ERC20Gateway',
      ),
      getSimpleEip1967Proxy(
        provider,
        addresses.l1GatewayRouter,
        'L1GatewayRouter',
      ),
    ]),
  }
  verify(parameters, [
    ['Rollup.admin', 'Multisig'],
    ['ProxyAdmin1.owner', 'Multisig'],
    ['ProxyAdmin2.owner', 'Multisig'],
    ['Inbox.admin', 'ProxyAdmin1'],
    ['SequencerInbox.admin', 'ProxyAdmin1'],
    ['Outbox.admin', 'ProxyAdmin1'],
    ['Bridge.admin', 'ProxyAdmin1'],
    ['ChallengeManager.admin', 'ProxyAdmin1'],
    ['L1CustomGateway.admin', 'ProxyAdmin2'],
    ['L1ERC20Gateway.admin', 'ProxyAdmin2'],
    ['L1GatewayRouter.admin', 'ProxyAdmin2'],
  ])
  return parameters
}

export async function discoverNova(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(NOVA_NAME, [addresses.rollup])
}
