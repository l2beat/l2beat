import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { command, positional, run, string } from 'cmd-ts'
import { extractPricesAndAmounts } from '../../src/modules/tvs/tools/extractPricesAndAmounts'

const args = {
  id: positional({
    type: string,
    displayName: 'id',
  }),
}

const cmd = command({
  name: 'translate-id',
  args,
  handler: async (args) => {
    const logger = Logger.INFO
    const ps = new ProjectService()

    const projects = await ps.getProjects({
      select: ['tvsConfig'],
      optional: ['chainConfig', 'isBridge'],
    })

    const configs = []

    for (const project of projects) {
      const { prices, amounts } = extractPricesAndAmounts(
        projects.flatMap((p) => p.tvsConfig),
      )
      configs.push(
        ...prices.map((p) => ({ projectId: project.id, ...p })),
        ...amounts.map((a) => ({ projectId: project.id, ...a })),
      )
    }

    const config = configs.find((c) => c.id === args.id)

    assert(config, `${args.id}: Config not found`)

    logger.info(`Config ${config.id}`, config)
  },
})

run(cmd, process.argv.slice(2))
