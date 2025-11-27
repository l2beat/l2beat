import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  contractFlatteningHash,
  type DiscoveryPaths,
  getChainConfigs,
  getDiscoveryPaths,
  ShapeSchema,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import {
  assert,
  ChainSpecificAddress,
  formatJson,
  Hash256,
  unique,
} from '@l2beat/shared-pure'
import { boolean, command, flag, option, string } from 'cmd-ts'
import { createHash } from 'crypto'
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  chainName,
  explorerApiKey,
  explorerChainId,
  explorerType,
  explorerUrl,
} from './args'

export const RegenerateShapeHashes = command({
  name: 'regen-shape-hashes',
  description:
    'Recomputes hashes for all shape files. Useful for updating the flattener output.',
  version: '1.0.0',
  args: {
    chainName,
    explorerUrl,
    explorerType,
    explorerApiKey,
    explorerChainId,
    output: option({
      type: string,
      long: 'output',
      short: 'o',
      defaultValue: () => 'output.sol',
    }),
    includeAll: flag({
      type: boolean,
      long: 'include-all',
      short: 'a',
      defaultValue: () => true,
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()

    const httpClient = new HttpClient()
    const allProviders = new AllProviders(
      getChainConfigs(),
      httpClient,
      new SQLiteCache(paths.cache),
      Logger.SILENT,
    )

    const shapeFiles = getShapeFiles(paths)

    for (const shapeFile of shapeFiles) {
      const shape = ShapeSchema.parse(
        JSON.parse(readFileSync(shapeFile, 'utf-8')),
      )

      for (const [_, value] of Object.entries(shape)) {
        const newHash = await getSourceHash(
          allProviders,
          value.address,
          value.blockNumber,
        )
        if (newHash !== undefined) {
          value.hash = newHash
        }
      }

      writeFileSync(shapeFile, formatJson(shape))
    }
  },
})

function getShapeFiles(paths: DiscoveryPaths) {
  const results: string[] = []

  function searchDirectory(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        searchDirectory(fullPath)
      } else if (entry.name === 'shapes.json') {
        results.push(fullPath)
      }
    }
  }

  searchDirectory(paths.discovery)
  return results
}

async function getSourceHash(
  allProviders: AllProviders,
  address: ChainSpecificAddress | ChainSpecificAddress[],
  blockNumber: number,
): Promise<Hash256 | undefined> {
  const addresses = Array.isArray(address) ? address : [address]
  const longChains = unique(addresses.map(ChainSpecificAddress.longChain))
  assert(longChains.length === 1)
  const chain = longChains[0]
  if (chain === 'kinto') {
    return undefined
  }
  const client = await allProviders.getByBlockNumber(chain, blockNumber)

  const sources = await Promise.all(addresses.map((a) => client.getSource(a)))
  const hashes = sources.map((source) => contractFlatteningHash(source))
  assert(hashes.every((x) => x !== undefined))

  if (hashes.length === 1) {
    return Hash256(hashes[0])
  }

  return sha2_256bit(hashes.sort())
}

export function sha2_256bit(input: string | string[]): Hash256 {
  const baseHash = createHash('sha256')
  const inputs = Array.isArray(input) ? input : [input]

  inputs.reduce((hash, input) => {
    hash.update(input)
    return hash
  }, baseHash)

  return Hash256(`0x${baseHash.digest('hex')}`)
}
