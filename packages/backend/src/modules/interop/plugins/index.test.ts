import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import type { HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { expect, mockObject } from 'earl'
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
    configs: mockObject<InteropConfigStore>(),
    httpClient: mockObject<HttpClient>(),
    logger: Logger.SILENT,
    rpcClients: [mockObject<RpcClient>({ chain: 'ethereum' })],
    tokenDbClient: mockObject<TokenDbClient>(),
    configIntervalMs: -1,
  })

  before(async () => {
    const ps = new ProjectService()
    const projects = await ps.getProjects({ select: ['chainConfig'] })
    for (const p of projects) {
      chainNames.add(p.chainConfig.name)
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
      const pluginA = mockObject<InteropPlugin>({ name: 'across' })
      const pluginB = mockObject<InteropPlugin>({ name: 'celer' })
      const pluginC = mockObject<InteropPlugin>({ name: 'ccip' })
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
      const pluginA = mockObject<InteropPlugin>({ name: 'across' })
      const pluginB = mockObject<InteropPlugin>({ name: 'celer' })
      const cluster: PluginCluster = { name: 'cluster', plugins: [pluginB] }

      const result = pluginsAsClusters([pluginA, cluster])

      expect(result).toEqual([{ name: 'across', plugins: [pluginA] }, cluster])
    })
  })
})
