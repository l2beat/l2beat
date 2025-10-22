import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import type { HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { mockObject } from 'earl'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { createInteropPlugins } from './index'
import { definedNetworks } from './types'

describe('Interop Plugins', async () => {
  const chainNames = new Set<string>()
  const plugins = createInteropPlugins({
    chains: [],
    configs: mockObject<InteropConfigStore>(),
    httpClient: mockObject<HttpClient>(),
    logger: Logger.SILENT,
    rpcClients: [mockObject<RpcClient>({ chain: 'ethereum' })],
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

    for (const plugin of plugins.eventPlugins) {
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
    for (const plugin of plugins.eventPlugins) {
      if (plugin.match) {
        it(plugin.name, () => {
          assert(plugin.matchTypes, `matchTypes missing for ${plugin.name}`)
        })
      }
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
})
