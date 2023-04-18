import { EthereumAddress } from '@l2beat/shared'
import path from 'path'
import z from 'zod'

export function processSources(
  code: string,
  address: EthereumAddress,
  contractName: string,
): Record<string, string> {
  let result: Record<string, string> = {}

  if (!code.startsWith('{')) {
    result = parseSingleFile(contractName, code)
  } else {
    try {
      result = parseSource(code)
    } catch (e) {
      console.error(e)
      console.log(code)
    }
  }

  const meta = `Address: ${address.toString()}}\nContract: ${contractName}`
  result['meta.txt'] = meta
  return result
}

type Sources = z.infer<typeof Sources>
const Sources = z.record(z.object({ content: z.string() }))
const EtherscanSource = z.object({ language: z.string(), sources: Sources })

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
    ([name, { content }]) => [path.resolve('/', name), content],
  )

  if (entries.length === 1) {
    return parseSingleFile(path.parse(entries[0][0]).name, entries[0][1])
  }

  const simplified = removeSharedNesting(entries)
  return Object.fromEntries(simplified)
}

function parseSingleFile(name: string, content: string) {
  const singleFile = { [`${name}.sol`]: content }
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
    const fileContent = preamble + '\n' + lines.slice(start, end).join('\n')
    entries.push([path.resolve('/', fileName), fileContent])
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
      return ''
    }, path.dirname(entries[0][0]))

  return entries.map(([fileName, content]) => [
    fileName.slice(commonDirectory.length),
    content,
  ])
}
