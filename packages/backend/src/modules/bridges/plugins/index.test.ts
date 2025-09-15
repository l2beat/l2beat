import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { createBridgePlugins } from '.'

describe('Plugins', async () => {
  const plugins = createBridgePlugins(Logger.SILENT)
  const chainsWithRpc = new Set<string>()

  before(async () => {
    const ps = new ProjectService()
    const projects = await ps.getProjects({ select: ['chainConfig'] })
    for (const p of projects) {
      if (p.chainConfig.apis.find((a) => a.type === 'rpc')) {
        chainsWithRpc.add(p.chainConfig.name)
      }
    }
  })

  for (const plugin of plugins) {
    describe(plugin.name, () => {
      const chains = plugin.chains
      for (const chain of chains) {
        it(chain, () => {
          assert(
            chainsWithRpc.has(chain),
            `${chain}: unknown chain, update plugin.chains`,
          )
        })
      }
    })
  }
})
