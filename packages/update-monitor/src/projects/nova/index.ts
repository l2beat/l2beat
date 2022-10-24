import { providers } from 'ethers'

import { getProxyAdmin } from '../../common/arbitrum/proxyAdmin'
import { ArbitrumProxy } from '../../common/proxies/ArbitrumProxy'
import { Eip1967Proxy } from '../../common/proxies/Eip1967Proxy'
import { GnosisSafe } from '../../common/proxies/GnosisSafe'
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
      GnosisSafe.getContract(provider, addresses.multisig, 'Multisig'),
      ArbitrumProxy.getContract(provider, addresses.rollup, 'Rollup'),
      getProxyAdmin(provider, addresses.proxyAdmin1, 'ProxyAdmin1'),
      getProxyAdmin(provider, addresses.proxyAdmin2, 'ProxyAdmin2'),
      Eip1967Proxy.getContract(provider, addresses.inbox, 'Inbox'),
      Eip1967Proxy.getContract(
        provider,
        addresses.sequencerInbox,
        'SequencerInbox',
      ),
      Eip1967Proxy.getContract(provider, addresses.outbox, 'Outbox'),
      Eip1967Proxy.getContract(provider, addresses.bridge, 'Bridge'),
      Eip1967Proxy.getContract(
        provider,
        addresses.challengeManager,
        'ChallengeManager',
      ),
      Eip1967Proxy.getContract(
        provider,
        addresses.l1CustomGateway,
        'L1CustomGateway',
      ),
      Eip1967Proxy.getContract(
        provider,
        addresses.l1ERC20Gateway,
        'L1ERC20Gateway',
      ),
      Eip1967Proxy.getContract(
        provider,
        addresses.l1GatewayRouter,
        'L1GatewayRouter',
      ),
    ]),
  }
  verify(parameters, [
    ['Rollup.upgradeability.admin', 'Multisig'],
    ['ProxyAdmin1.owner', 'Multisig'],
    ['ProxyAdmin2.owner', 'Multisig'],
    ['Inbox.upgradeability.admin', 'ProxyAdmin1'],
    ['SequencerInbox.upgradeability.admin', 'ProxyAdmin1'],
    ['Outbox.upgradeability.admin', 'ProxyAdmin1'],
    ['Bridge.upgradeability.admin', 'ProxyAdmin1'],
    ['ChallengeManager.upgradeability.admin', 'ProxyAdmin1'],
    ['L1CustomGateway.upgradeability.admin', 'ProxyAdmin2'],
    ['L1ERC20Gateway.upgradeability.admin', 'ProxyAdmin2'],
    ['L1GatewayRouter.upgradeability.admin', 'ProxyAdmin2'],
  ])
  return parameters
}

export async function discoverNova(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(NOVA_NAME, [addresses.rollup])
}
