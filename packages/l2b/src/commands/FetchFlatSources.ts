import { getDiscoveryPaths } from '@l2beat/discovery'
import chalk from 'chalk'
import { boolean, command, flag, option, optional } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
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
    confirmed: flag({
      type: boolean,
      long: 'yes',
      short: 'y',
      description: 'accept the refresh, do not prompt the user.',
    }),
    quiet: flag({
      type: boolean,
      long: 'quiet',
      short: 'q',
      description: 'do not print anything on the terminal',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const logger = getPlainLogger()
    if (
      !args.confirmed &&
      paths.discovery !== undefined &&
      !keyInYN(
        `${chalk.red(
          'WARNING:',
        )} This command will override all of your local .flat directories with sources taken from UpdateMonitor.\nDo you wish to continue?`,
      )
    ) {
      return
    }

    const flat = await fetchFlatSources(logger, args.backendUrl)

    if (args.outputPath !== undefined) {
      saveIntoDirectory(logger, flat, args.outputPath)
    }
    saveIntoDiscovery(logger, flat, paths.discovery)
  },
})
