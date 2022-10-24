import { providers } from 'ethers'

import { getProxyAdmin } from '../../common/arbitrum/proxyAdmin'
import { ArbitrumProxy } from '../../common/proxies/ArbitrumProxy'
import { Eip1967Proxy } from '../../common/proxies/Eip1967Proxy'
import { GnosisSafe } from '../../common/proxies/GnosisSafe'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'

export const ARBITRUM_NAME = 'arbitrum'

export async function getArbitrumParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters = {
    name: ARBITRUM_NAME,
    contracts: await Promise.all([
      GnosisSafe.getContract(provider, addresses.multisig, 'Multisig'),
      ArbitrumProxy.getContract(provider, addresses.rollup, 'Rollup'),
      getProxyAdmin(provider, addresses.proxyAdmin1, 'ProxyAdmin1'),
      getProxyAdmin(provider, addresses.proxyAdmin2, 'ProxyAdmin2'),
      getProxyAdmin(provider, addresses.proxyAdmin3, 'ProxyAdmin3'),
      Eip1967Proxy.getContract(provider, addresses.bridge, 'Bridge'),
      Eip1967Proxy.getContract(
        provider,
        addresses.challengeManager,
        'ChallengeManager',
      ),
      Eip1967Proxy.getContract(provider, addresses.inbox, 'Inbox'),
      Eip1967Proxy.getContract(
        provider,
        addresses.sequencerInbox,
        'SequencerInbox',
      ),
      Eip1967Proxy.getContract(provider, addresses.outbox, 'Outbox'),
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
    ['Inbox.upgradeability.admin', 'ProxyAdmin2'],
    ['SequencerInbox.upgradeability.admin', 'ProxyAdmin1'],
    ['Outbox.upgradeability.admin', 'ProxyAdmin1'],
    ['Bridge.upgradeability.admin', 'ProxyAdmin1'],
    ['ChallengeManager.upgradeability.admin', 'ProxyAdmin1'],
    ['L1CustomGateway.upgradeability.admin', 'ProxyAdmin3'],
    ['L1ERC20Gateway.upgradeability.admin', 'ProxyAdmin3'],
    ['L1GatewayRouter.upgradeability.admin', 'ProxyAdmin3'],
  ])
  return parameters
}

export async function discoverArbitrum(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    ARBITRUM_NAME,
    [addresses.rollup, addresses.l1ERC20Gateway, addresses.l1GatewayRouter],
    {
      skipMethods: {
        '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515': ['inboxAccs'],
        '0x4c6f947Ae67F572afa4ae0730947DE7C874F95Ef': ['inboxAccs'],
        '0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40': [
          'outboxEntries',
          'outboxEntryExists',
        ],
        '0xC12BA48c781F6e392B49Db2E25Cd0c28cD77531A': [
          'getNodeHash',
          'getNode',
        ],
        '0x00C51F63a2D906510cb2C802C0A30589bA75D942': [
          'getNodeHash',
          'getStakerAddress',
          'getNode',
        ],
        '0x40Da6274A2E95D1b4baf2810700359ad258E6e21': [
          'getNodeHash',
          'getStakerAddress',
          'getNode',
        ],
        '0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a': [
          'outboxes',
          'outboxEntryExists',
        ],
        '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6': ['inboxAccs'],
        '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a': [
          'delayedInboxAccs',
          'sequencerInboxAccs',
        ],
        '0xDBE5c009095169D3de4a8D1C70E319fE647A3DBf': [
          'getNode',
          'getNodeHash',
        ],
        '0x3CcB27FD59398a015a1eb465582A934fbF318214': [
          'getNode',
          'getNodeHash',
        ],
        '0xe5896783a2F463446E1f624e64Aa6836BE4C6f58': ['challenges'],
        '0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840': ['spent', 'isSpent'],
      },
    },
  )
}
