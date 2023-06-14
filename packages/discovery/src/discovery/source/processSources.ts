import { EthereumAddress } from '@l2beat/shared-pure'
import path from 'path'

import { ContractMetadata } from '../provider/DiscoveryProvider'
import { removeSharedNesting } from './removeSharedNesting'
import { sourceToEntries } from './sourceToEntries'

export function processSources(
  address: EthereumAddress,
  { name, source, isVerified }: Omit<ContractMetadata, 'abi'>,
): Record<string, string> {
  let result: Record<string, string> = {}

  if (isVerified) {
    try {
      result = parseSource(name, source)
    } catch (e) {
      console.error(e)
      console.log(source)
    }
  }

  result['meta.txt'] = createMetaTxt(address, name, isVerified)
  return result
}

function parseSource(name: string, source: string) {
  const entries = sourceToEntries(name, source)

  if (entries.length === 1) {
    return parseSingleFile(...entries[0])
  }

  const simplified = removeSharedNesting(entries)
  return Object.fromEntries(simplified)
}

function parseSingleFile(file: string, content: string) {
  const singleFile = { [path.basename(file)]: content }
  if (!content.includes('// File: ')) {
    return singleFile
  }

  const lines = content.split('\n')
  const boundaries = lines
    .map((line, i) => ({ line, i }))
    .filter(({ line }) => line.startsWith('// File: '))

  if (boundaries.length === 0) {
    return singleFile
  }

  let preamble = lines.slice(0, boundaries[0].i).join('\n')
  if (preamble !== '') {
    preamble += '\n'
  }

  // Try to split the files based on likely output from truffle-flattener
  const entries: [string, string][] = []
  for (let i = 0; i < boundaries.length; i++) {
    const start = boundaries[i].i
    const end = boundaries[i + 1]?.i ?? lines.length
    const file = boundaries[i].line.slice('// File: '.length).trim()
    const content = preamble + lines.slice(start + 1, end).join('\n')
    entries.push([file, content])
  }

  const simplified = removeSharedNesting(entries)
  simplified.push(['flattened.sol', content])
  return Object.fromEntries(simplified)
}

export function createMetaTxt(
  address: EthereumAddress,
  name: string,
  isVerified: boolean,
) {
  if (!isVerified) {
    return `Address: ${address.toString()}\nSource code not verified!`
  }
  return `Address: ${address.toString()}\nContract: ${name}\n`
}
