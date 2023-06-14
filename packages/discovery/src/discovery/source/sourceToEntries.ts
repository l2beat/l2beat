import z from 'zod'

const Sources = z.record(z.object({ content: z.string() }))
const EtherscanSource = z.object({ sources: Sources })

export function sourceToEntries(
  name: string,
  source: string,
): [string, string][] {
  if (!source.startsWith('{')) {
    return [[`${name}.sol`, source]]
  }

  // etherscan sometimes wraps the json in {} so you get {{...}}
  if (source.startsWith('{{')) {
    source = source.slice(1, -1)
  }

  const parsed: unknown = JSON.parse(source)
  let validated: Record<string, { content: string }>
  try {
    validated = EtherscanSource.parse(parsed).sources
  } catch {
    validated = Sources.parse(parsed)
  }

  return Object.entries(validated).map(([name, { content }]) => [name, content])
}
