import { buildSimilarityHashmap, format } from '@l2beat/discovery'
import { command, number, option, positional, subcommands } from 'cmd-ts'
import { getExplorer } from '../implementations/common/getExplorer'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { fetchAndFlatten } from '../implementations/flatten'
import { matchFile, readAndHashFile } from '../implementations/matchFlat'
import {
  chainName,
  explorerApiKey,
  explorerChainId,
  explorerType,
  explorerUrl,
} from './args'
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
    const logger = getPlainLogger()
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
    chainName,
    explorerUrl,
    explorerType,
    explorerApiKey,
    explorerChainId,
  },
  handler: async (args) => {
    const logger = getPlainLogger()
    const client = getExplorer(args)
    const flat = await fetchAndFlatten(args.address, client, logger, false)

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
  description:
    'Compute percentage similarity between a needle flat file and haystack.',
  cmds: Object.fromEntries(
    [MatchFlatFile, MatchFlatAddress].map((t) => [t.name, t]),
  ),
})
