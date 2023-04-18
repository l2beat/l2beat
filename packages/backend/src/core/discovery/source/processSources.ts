import { EthereumAddress } from '@l2beat/shared'
import path from 'path'
import z from 'zod'

import { ContractMetadata } from '../provider/DiscoveryProvider'

export function processSources(
  address: EthereumAddress,
  { name, source, isVerified }: Omit<ContractMetadata, 'abi'>,
): Record<string, string> {
  if (!isVerified) {
    return { 'meta.txt': createMetaTxt(address, 'Unverified source code!') }
  }

  let result: Record<string, string> = {}

  if (!source.startsWith('{')) {
    result = parseSingleFile(`${name}.sol`, source)
  } else {
    try {
      result = parseSource(source)
    } catch (e) {
      console.error(e)
      console.log(source)
    }
  }

  result['meta.txt'] = createMetaTxt(address, name)
  return result
}

type Sources = z.infer<typeof Sources>
const Sources = z.record(z.object({ content: z.string() }))
const EtherscanSource = z.object({ sources: Sources })

function parseSource(source: string) {
  // etherscan sometimes wraps the json in {} so you get {{...}}
  if (source.startsWith('{{')) {
    source = source.slice(1, -1)
  }
  const parsed: unknown = JSON.parse(source)
  let validated: Sources
  try {
    validated = EtherscanSource.parse(parsed).sources
  } catch {
    validated = Sources.parse(parsed)
  }
  const entries: [string, string][] = Object.entries(validated).map(
    ([name, { content }]) => [sanitizePath(name), content],
  )

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

  // Try to split the files based on likely output from truffle-flattener
  const preamble = lines.slice(0, boundaries[0].i).join('\n')
  const entries: [string, string][] = []
  for (let i = 0; i < boundaries.length; i++) {
    const start = boundaries[i].i
    const end = boundaries[i + 1]?.i ?? lines.length
    const fileName = boundaries[i].line.slice('// File: '.length).trim()
    const fileContent =
      (preamble ? preamble + '\n' : '') + lines.slice(start + 1, end).join('\n')
    entries.push([sanitizePath(fileName), fileContent])
  }

  const simplified = removeSharedNesting(entries)
  simplified.push(['flattened.sol', content])
  return Object.fromEntries(simplified)
}

/**
 * Removes the common directory from all file names.
 *
 * For example if the paths are /a/b/c/d.sol and /a/b/e/f.sol, it will return
 * { 'c/d.sol': '...', 'e/f.sol': '...' }, removing the /a/b/ prefix.
 */
function removeSharedNesting(entries: [string, string][]): [string, string][] {
  const commonDirectory = entries
    .map((x) => x[0])
    .reduce((commonDirectory, fileName) => {
      while (commonDirectory !== '/') {
        if (fileName.startsWith(commonDirectory)) {
          return commonDirectory
        }
        commonDirectory = path.dirname(commonDirectory)
      }
      return '/'
    }, path.dirname(entries[0][0]))

  const length = commonDirectory.endsWith('/')
    ? commonDirectory.length
    : commonDirectory.length + 1

  return entries.map(([fileName, content]) => [fileName.slice(length), content])
}

function sanitizePath(file: string) {
  if (file.startsWith('https://')) {
    file = file.slice('https://'.length)
  } else if (file.startsWith('http://')) {
    file = file.slice('http://'.length)
  }
  return path.resolve('/', file)
}

export function createMetaTxt(address: EthereumAddress, name: string) {
  return `Address: ${address.toString()}\nContract: ${name}\n`
}
