import { Logger } from '@l2beat/backend-tools'
import { INTEROP_ONE_SIDED_CHAINS, ProjectService } from '@l2beat/config'
import type { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { expect, mockObject } from 'earl'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import {
  createInteropPlugins,
  flattenClusters,
  type PluginCluster,
  pluginsAsClusters,
} from './index'
import type { InteropPlugin, InteropPluginResyncable } from './types'
import { definedNetworks, isPluginResyncable } from './types'

// The opstack plugins have no RISE network yet
const KNOWN_UNSUPPORTED_CHAINS = new Set([
  'opstack:rise',
  'opstack-standardbridge:rise',
])

describe('Interop Plugins', async () => {
  const chainNames = new Set<string>()
  const plugins = createInteropPlugins({
    chains: [],
    oneSidedChains: [],
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

  describe('project interop configs', () => {
    const pluginsByName = new Map<string, InteropPlugin>(
      flattenClusters(plugins.eventPlugins).map((p) => [p.name, p]),
    )
    const entries: { project: string; plugin: string; chain?: string }[] = []

    before(async () => {
      const ps = new ProjectService()
      const projects = await ps.getProjects({ select: ['interopConfig'] })
      for (const project of projects) {
        for (const { plugin, chain } of project.interopConfig.plugins) {
          entries.push({ project: project.id, plugin, chain })
        }
      }
    })

    it('reference existing plugins', () => {
      const unknown = entries.filter((e) => !pluginsByName.has(e.plugin))
      expect(unknown).toEqual([])
    })

    // A chain qualifier keeps transfers with that chain on either side. This
    // assumes the plugin captures its own events there, so a plugin matching
    // another plugin's events on that chain needs an exception.
    it('qualify chains the plugin requests logs from', () => {
      const unsupported = entries.filter((e) => {
        if (!e.chain || KNOWN_UNSUPPORTED_CHAINS.has(`${e.plugin}:${e.chain}`))
          return false
        const plugin = pluginsByName.get(e.plugin)
        if (!plugin || !isPluginResyncable(plugin)) return false
        const chains = getRequestedChains(plugin)
        return chains !== undefined && !chains.has(e.chain)
      })
      expect(unsupported).toEqual([])
    })
  })

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

function getRequestedChains(
  plugin: InteropPluginResyncable,
): Set<string> | undefined {
  const chains = new Set<string>()
  for (const request of plugin.getDataRequests()) {
    if (request.type !== 'event') continue
    if (request.addresses === '*') return undefined
    for (const address of request.addresses) {
      chains.add(ChainSpecificAddress.longChain(address))
    }
  }
  return chains
}
