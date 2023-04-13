import { EthereumAddress } from '@l2beat/shared'
import path from 'path'
import z from 'zod'

export function processSources(
  code: string,
  address: EthereumAddress,
  contractName: string,
): Record<string, string> {
  let result: Record<string, string> = {}

  const meta = `Address: ${address.toString()}}\nContract: ${contractName}`
  result['meta.txt'] = meta

  if (!code.startsWith('{')) {
    result[`${contractName}.sol`] = code
  } else {
    try {
      result = { ...result, ...parseSource(code) }
    } catch (e) {
      console.error(e)
      console.log(code)
    }
  }

  return result
}

type Sources = z.infer<typeof Sources>
const Sources = z.record(z.object({ content: z.string() }))
const EtherscanSource = z.object({ language: z.string(), sources: Sources })

function parseSource(source: string) {
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
  const entries = Object.entries(validated).map(([name, { content }]) => [
    path.resolve('/', name),
    content,
  ])

  const commonDir = entries
    .map((x) => x[0])
    .reduce((common, file) => {
      while (common !== '/') {
        if (file.startsWith(common)) {
          return common
        }
        common = path.dirname(common)
      }
      return ''
    }, path.dirname(entries[0][0]))

  return Object.fromEntries(
    entries.map(([name, content]) => [name.slice(commonDir.length), content]),
  )
}
