import { ProjectService } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { definedNetworks } from './types'

describe('Plugins', async () => {
  const chainNames = new Set<string>()

  before(async () => {
    const ps = new ProjectService()
    const projects = await ps.getProjects({ select: ['chainConfig'] })
    for (const p of projects) {
      chainNames.add(p.chainConfig.name)
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
