import {
  ConfigReader,
  DiscoveryConfig,
  TemplateService,
  getChainConfig,
} from '@l2beat/discovery'
import { boolean, command, flag, option, optional, run, string } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { discoveryNeedsRefresh } from '../src/tools/discoveryNeedsRefresh'
import { discoverAndUpdateDiffHistory } from './discoveryWrapper'

const cmd = command({
  name: 'refresh-discovery',
  args: {
    all: flag({
      type: boolean,
      long: 'all',
      short: 'a',
      description: 'refreshes discovery for every project',
    }),
    from: option({
      type: optional(string),
      long: 'from',
      short: 'f',
      description:
        'where to at which project start discovery, format <project>/<chain>',
    }),
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md',
    }),
  },
  handler: async (args) => {
    const configReader = new ConfigReader()
    const templateService = new TemplateService()

    const chainConfigs = await Promise.all(
      configReader
        .readAllChains()
        .flatMap((chain) => configReader.readAllConfigsForChain(chain)),
    )
    const toRefresh: { config: DiscoveryConfig; reason: string }[] = []
    let foundFrom = false
    for (const config of chainConfigs) {
      if (args.from !== undefined) {
        if (!foundFrom && `${config.name}/${config.chain}` === args.from) {
          foundFrom = true
        }
        if (!foundFrom) {
          continue
        }
      }
      const discovery = configReader.readDiscovery(config.name, config.chain)
      const needsRefreshReason = args.all
        ? '--all flag was provided'
        : discoveryNeedsRefresh(discovery, config, templateService)
      if (needsRefreshReason !== undefined) {
        toRefresh.push({
          config,
          reason: needsRefreshReason,
        })
      }
    }

    if (toRefresh.length === 0) {
      console.log(
        'All projects are up to date. Pass --all flag to refresh anyway.',
      )
    } else {
      console.log('Found projects that need discovery refresh:')
      for (const { config, reason } of toRefresh) {
        console.log(`- ${config.chain}/${config.name} (${reason})`)
      }
      console.log(
        `\nOverall ${toRefresh.length} projects need discovery refresh.`,
      )
      if (keyInYN('Do you want to continue?')) {
        for (const { config } of toRefresh) {
          await discoverAndUpdateDiffHistory(
            {
              project: config.name,
              chain: getChainConfig(config.chain),
              dev: true,
            },
            args.message,
          )
        }
      }
    }
  },
})

run(cmd, process.argv.slice(2))
