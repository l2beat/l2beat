import { getDiscoveryPaths } from '@l2beat/discovery'
import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { writeFileSync } from 'fs'
import groupBy from 'lodash/groupBy'
import path from 'path'

type TokenToSave = {
  name: string
  chain: string
  address: EthereumAddress | undefined
}

const OUTPUT_FILE_NAME = 'globalTokens.jsonc'

export function generateTokenNames(tokens: TokenToSave[]) {
  const names: Record<string, string> = {}
  const byChain = groupBy(tokens, (token) => token.chain)

  for (const chainName in byChain) {
    const chainTokens = byChain[chainName].filter(
      (token) => token.address !== undefined,
    )

    const occurrences: Record<string, number> = {}
    for (const { name } of chainTokens) {
      occurrences[name] = (occurrences[name] ?? 0) + 1
    }

    const counters: Record<string, number> = {}
    for (const token of chainTokens) {
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      const total = occurrences[token.name]!
      let finalName = token.name

      if (total > 1) {
        counters[token.name] = (counters[token.name] ?? 0) + 1
        finalName = `${token.name} ${counters[token.name]}`
      }

      if (!finalName.toLowerCase().includes('token')) {
        finalName += ' Token'
      }

      try {
        // biome-ignore lint/style/noNonNullAssertion: address checked above
        const address = ChainSpecificAddress.fromLong(chainName, token.address!)
        names[address.toString()] = finalName
      } catch {}
    }
  }

  return names
}

export function getTokenNamesFilePath() {
  const paths = getDiscoveryPaths()
  return path.join(paths.discovery, OUTPUT_FILE_NAME)
}

export function saveTokenNames(names: Record<string, string>) {
  writeFileSync(getTokenNamesFilePath(), JSON.stringify({ names }, null, 2))
}
