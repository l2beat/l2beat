import { ConfigReader, DiscoveryConfig } from '@l2beat/discovery'
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { ChainConverter } from '../../../tools/ChainConverter'
import {
  UpdateMonitorRecord,
  UpdateMonitorRepository,
} from '../../update-monitor/repositories/UpdateMonitorRepository'
import { ImplementationChangeController } from './ImplementationChangeController'

describe(ImplementationChangeController.name, () => {
  const CONTRACT_A = EthereumAddress.random()
  const IMPLEMENTATION_A_BEFORE = EthereumAddress.random()
  const IMPLEMENTATION_A_AFTER = EthereumAddress.random()

  it('returns empty for nothing returned', async () => {
    const repository = mockObject<UpdateMonitorRepository>({
      findLatest: async () => {
        return {
          discovery: {
            contracts: [
              {
                address: CONTRACT_A,
                implementations: [IMPLEMENTATION_A_AFTER],
              },
            ],
          },
        } as UpdateMonitorRecord
      },
    })
    const configReader = mockObject<ConfigReader>({
      readAllChains: () => {
        return ['ethereum', 'arbitrum']
      },
      readAllProjectsForChain: (chian: string) => {
        if (chian === 'ethereum') return ['optimism', 'arbitrum']
        if (chian === 'arbitrum') return ['arbitrum']
        return []
      },
      readConfig: async (name: string, chain: string) => {
        return new DiscoveryConfig({
          name,
          chain,
          initialAddresses: [],
        })
      },
      readDiscovery: async (name: string, chain: string) => {
        const result = {
          contracts: [
            {
              address: CONTRACT_A,
              implementations: [IMPLEMENTATION_A_AFTER],
            },
          ],
        } as DiscoveryOutput

        if (chain === 'ethereum' && name === 'arbitrum') {
          result.contracts[0].implementations = [IMPLEMENTATION_A_BEFORE]
        }
        return result
      },
    })

    const chainConverter = new ChainConverter([
      { name: 'ethereum', chainId: ChainId(1) },
      { name: 'arbitrum', chainId: ChainId(42161) },
    ])

    const controller = new ImplementationChangeController(
      repository,
      configReader,
      chainConverter,
    )
    const result = await controller.getImplementationChangeReport()

    expect(result).toEqual({
      projects: {
        arbitrum: {
          ethereum: [
            {
              containingContract: CONTRACT_A,
              newImplementations: [IMPLEMENTATION_A_AFTER],
            },
          ],
        },
      },
    })
  })

  it('returns empty for nothing returned', async () => {
    const repository = mockObject<UpdateMonitorRepository>({
      findLatest: async () => {
        return {} as UpdateMonitorRecord
      },
    })
    const configReader = mockObject<ConfigReader>({
      readAllChains: () => {
        return ['ethereum', 'arbitrum']
      },
      readAllProjectsForChain: (chian: string) => {
        if (chian === 'ethereum') return ['optimism', 'arbitrum']
        if (chian === 'arbitrum') return ['arbitrum']
        return []
      },
      readConfig: async () => {
        return {} as DiscoveryConfig
      },
      readDiscovery: async () => {
        return {} as DiscoveryOutput
      },
    })

    const chainConverter = new ChainConverter([
      { name: 'ethereum', chainId: ChainId(1) },
      { name: 'arbitrum', chainId: ChainId(42161) },
    ])

    const controller = new ImplementationChangeController(
      repository,
      configReader,
      chainConverter,
    )
    const result = await controller.getImplementationChangeReport()

    expect(result).toEqual({
      projects: {},
    })
  })
})
