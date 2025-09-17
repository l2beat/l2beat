import { ProjectService } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { createBridgePlugins } from './index'
import { definedNetworks } from './types'

describe('Plugins', async () => {
  const plugins = createBridgePlugins()
  const chainsWithRpc = new Set<string>()
  const chainNames = new Set<string>()

  before(async () => {
    const ps = new ProjectService()
    const projects = await ps.getProjects({ select: ['chainConfig'] })
    for (const p of projects) {
      chainNames.add(p.chainConfig.name)
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
