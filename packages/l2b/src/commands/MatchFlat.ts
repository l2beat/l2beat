import { buildSimilarityHashmap, format } from '@l2beat/discovery'
import { CliLogger } from '@l2beat/shared'
import { command, number, option, positional, subcommands } from 'cmd-ts'
import { fetchAndFlatten } from '../implementations/flatten'
import { matchFile, readAndHashFile } from '../implementations/matchFlat'
import { explorerApiKey, explorerType, explorerUrl } from './args'
import { Directory, EthereumAddressValue, File } from './types'

const minSimilarity = option({
  type: number,
  long: 'min-similarity',
  short: 's',
  defaultValue: () => 0.5,
  defaultValueIsSerializable: true,
})

const maxResults = option({
  type: number,
  long: 'max-results',
  short: 's',
  defaultValue: () => 10,
  defaultValueIsSerializable: true,
})

const MatchFlatFile = command({
  name: 'file',
  description: 'Using a local file as base input.',
  args: {
    file: positional({ type: File, displayName: 'file' }),
    directory: positional({ type: Directory, displayName: 'flat-database' }),
    minSimilarity,
    maxResults,
  },
  handler: async (args) => {
    const logger: CliLogger = new CliLogger()
    const baseFile = readAndHashFile(args.file)

    await matchFile(
      baseFile,
      args.directory,
      args.minSimilarity,
      args.maxResults,
      logger,
    )
  },
})

const MatchFlatAddress = command({
  name: 'address',
  description: 'Using an address as base input.',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    directory: positional({ type: Directory, displayName: 'flat-database' }),
    minSimilarity,
    maxResults,
    explorerUrl,
    type: explorerType,
    apiKey: explorerApiKey,
  },
  handler: async (args) => {
    const logger: CliLogger = new CliLogger()
    const flat = await fetchAndFlatten(
      args.address,
      args.explorerUrl,
      args.apiKey,
      args.type,
      logger,
      false,
    )

    const content = format(flat)
    const baseFile = {
      content,
      path: 'virtual.sol',
      hashChunks: buildSimilarityHashmap(content),
    }

    await matchFile(
      baseFile,
      args.directory,
      args.minSimilarity,
      args.maxResults,
      logger,
    )
  },
})

export const MatchFlat = subcommands({
  name: 'match-flat',
  cmds: Object.fromEntries(
    [MatchFlatFile, MatchFlatAddress].map((t) => [t.name, t]),
  ),
})
