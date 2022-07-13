import { providers } from 'ethers'

import { DiscoveryEngine } from '../discovery/DiscoveryEngine'
import { ProjectParameters } from '../types'
import { addresses } from './constants'

export async function getArbitrumParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  provider
  return {
    name: 'arbitrum',
    contracts: await Promise.all([]),
  }
}

export async function discoverArbitrum(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    'arbitrum',
    [
      addresses.rollupAddress,
      addresses.l1ERC20Gateway,
      addresses.l1GatewayRouter,
    ],
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
      },
    },
  )
}
