import { CliLogger } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, option, optional } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { readConfig } from '../config/readConfig'
import {
  fetchFlatSources,
  saveIntoDirectory,
  saveIntoDiscovery,
} from '../implementations/fetchFlatSources'
import { Directory, HttpUrl } from './types'

export const FetchFlatSources = command({
  name: 'fetch-flat-sources',
  description: 'Fetches flat sources from L2BEAT backend.',
  args: {
    backendUrl: option({
      type: HttpUrl,
      long: 'backend-url',
      short: 'u',
      defaultValue: () => 'https://api.l2beat.com',
      defaultValueIsSerializable: true,
    }),
    outputPath: option({
      type: optional(Directory),
      long: 'output',
      short: 'o',
      env: 'L2B_FLAT_SOURCES_OUTPUT_PATH',
    }),
  },
  handler: async (args) => {
    const config = readConfig()
    const logger = new CliLogger()
    if (
      config.discoveryPath !== undefined &&
      !keyInYN(
        `${chalk.red(
          'WARNING:',
        )} This command will override all of your local .flat directories with sources taken from UpdateMonitor.\nDo you wish to continue?`,
      )
    ) {
      return
    }

    const flat = await fetchFlatSources(logger, args.backendUrl)

    assert(
      config.discoveryPath !== undefined || args.outputPath !== undefined,
      'The output is undefined. Either create a .l2b file in the root of the project pointing the discovery path or provide the output path with --output.',
    )

    if (args.outputPath !== undefined) {
      saveIntoDirectory(logger, flat, args.outputPath)
    } else if (config.discoveryPath !== undefined) {
      saveIntoDiscovery(logger, flat, config.discoveryPath)
    }
  },
})
