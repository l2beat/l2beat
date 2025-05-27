import {
  ConfigReader,
  TemplateService,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import chalk from 'chalk'
import { command } from 'cmd-ts'

export const FindUnusedShapes = command({
  name: 'find-unused-shapes',
  description:
    'Go through all discovered.json and shape.json files and list all shapes that are not currently used.',
  args: {},
  handler: async () => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const shapes = templateService.getAllShapes()

    const chainConfigs = configReader
      .readAllChains()
      .flatMap((chain) => configReader.readAllConfigsForChain(chain))

    const allSourceHashesUsed = new Set<string>()

    for (const config of chainConfigs) {
      const discovery = configReader.readDiscovery(config.name, config.chain)

      for (const entry of discovery.entries) {
        if (entry.sourceHashes) {
          for (const hash of entry.sourceHashes) {
            allSourceHashesUsed.add(hash)
          }
        }
      }
    }

    for (const [templateId, shape] of Object.entries(shapes)) {
      const shapeSourceHashes = shape.hashes
      const unused = shapeSourceHashes.filter(
        (hash) => !allSourceHashesUsed.has(hash),
      )
      if (unused.length > 0) {
        const header = chalk.green(`${templateId}`)
        const lines = unused.map((hash, index) => {
          const isLast = index === unused.length - 1
          const prefix = isLast ? '└─' : '├─'
          return chalk.gray(`  ${prefix} ${hash}`)
        })
        console.log(`${header}\n${lines.join('\n')}`)
      }
    }
  },
})
