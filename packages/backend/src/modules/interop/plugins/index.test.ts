import { Logger } from '@l2beat/backend-tools'
import { INTEROP_ONE_SIDED_CHAINS, ProjectService } from '@l2beat/config'
import type { HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { beforeAll, describe, expect, it } from 'vitest'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import {
  createInteropPlugins,
  flattenClusters,
  type PluginCluster,
  pluginsAsClusters,
} from './index'
import type { InteropPlugin } from './types'
import { definedNetworks, isPluginResyncable } from './types'

describe('Interop Plugins', async () => {
  const chainNames = new Set<string>()
  const plugins = createInteropPlugins({
    chains: [],
    oneSidedChains: [],
    configs: {} as unknown as InteropConfigStore,
    httpClient: {} as unknown as HttpClient,
    logger: Logger.SILENT,
    rpcClients: [{ chain: 'ethereum' } as unknown as RpcClient],
    tokenDbClient: {} as unknown as TokenDbClient,
    configIntervalMs: -1,
  })

  beforeAll(async () => {
    const ps = new ProjectService()
    const projects = await ps.getProjects({ select: ['chainConfig'] })
    for (const p of projects) {
      chainNames.add(p.chainConfig.name)
    }
    for (const chain of INTEROP_ONE_SIDED_CHAINS) {
      chainNames.add(chain)
    }
  })

  describe('every plugin name is unique', () => {
    const kwnon = new Set<string>()

    for (const plugin of flattenClusters(plugins.eventPlugins)) {
      it(plugin.name, () => {
        assert(
          !kwnon.has(plugin.name),
          `Plugin name "${plugin.name}" is not unique.`,
        )
        kwnon.add(plugin.name)
      })
    }
  })

  describe('matchTypes check', () => {
    for (const plugin of flattenClusters(plugins.eventPlugins)) {
      if (plugin.match) {
        it(plugin.name, () => {
          assert(plugin.matchTypes, `matchTypes missing for ${plugin.name}`)
        })
      }
    }
  })

  describe('clusters do not mix resyncable and non-resyncable plugins', () => {
    for (const cluster of pluginsAsClusters(plugins.eventPlugins)) {
      it(cluster.name, () => {
        const resyncableCount =
          cluster.plugins.filter(isPluginResyncable).length
        const isMixed =
          resyncableCount > 0 && resyncableCount < cluster.plugins.length
        assert(
          !isMixed,
          `Cluster "${cluster.name}" mixes resyncable and non-resyncable plugins.`,
        )
      })
    }
  })

  for (const { protocol, chains } of definedNetworks) {
    describe(protocol, () => {
      for (const chain of chains) {
        it(chain, () => {
          assert(chainNames.has(chain), `Unknown chain name: ${chain}`)
        })
      }
    })
  }

  describe('flattenClusters', () => {
    it('flattens plugins and plugin clusters in order', () => {
      const pluginA = { name: 'across' } as unknown as InteropPlugin
      const pluginB = { name: 'celer' } as unknown as InteropPlugin
      const pluginC = { name: 'ccip' } as unknown as InteropPlugin
      const cluster: PluginCluster = {
        name: 'cluster',
        plugins: [pluginB, pluginC],
      }

      const result = flattenClusters([pluginA, cluster])
      expect(result).toEqual([pluginA, pluginB, pluginC])
    })
  })

  describe('pluginsAsClusters', () => {
    it('wraps single plugins in clusters and preserves cluster objects', () => {
      const pluginA = { name: 'across' } as unknown as InteropPlugin
      const pluginB = { name: 'celer' } as unknown as InteropPlugin
      const cluster: PluginCluster = { name: 'cluster', plugins: [pluginB] }

      const result = pluginsAsClusters([pluginA, cluster])

      expect(result).toEqual([{ name: 'across', plugins: [pluginA] }, cluster])
    })
  })
})
