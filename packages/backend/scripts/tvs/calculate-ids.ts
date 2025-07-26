import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { command, option, optional, run, string } from 'cmd-ts'
import { extractPricesAndAmounts } from '../../src/modules/tvs/tools/extractPricesAndAmounts'

const args = {
  projects: option({
    type: optional(string),
    long: 'projects',
    short: 'p',
    description: 'Comma-separated list of projects',
  }),
  tokens: option({
    type: optional(string),
    long: 'tokens',
    short: 't',
    description: 'Comma-separated list of tokens',
  }),
}

const cmd = command({
  name: 'calculate-ids',
  args,
  handler: async (args) => {
    const logger = Logger.INFO
    const ps = new ProjectService()

    const projects = await ps.getProjects({
      select: ['tvsConfig'],
      optional: ['chainConfig', 'isBridge'],
    })

    if (args.projects) {
      for (const projectId of args.projects.split(',')) {
        const project = projects.find((p) => p.id === projectId)
        assert(project, `${projectId}: Project with given id not found`)
        assert(project.tvsConfig)

        logger.info(`Calculating ids for ${project.id}`)
        for (const token of project.tvsConfig) {
          const { prices, amounts } = extractPricesAndAmounts([token])

          logger.info(token.id, {
            prices,
            amounts,
          })
        }
      }
      return
    }

    if (args.tokens) {
      for (const tokenId of args.tokens.split(',')) {
        const token = projects
          .flatMap((p) => p.tvsConfig)
          .find((t) => t.id === tokenId)
        assert(token, `${tokenId}: Token with given id not found`)

        const { prices, amounts } = extractPricesAndAmounts([token])

        logger.info(token.id, {
          prices,
          amounts,
        })
      }
      return
    }

    logger.error('Pass either projects or tokens as an optional param')
  },
})

run(cmd, process.argv.slice(2))
