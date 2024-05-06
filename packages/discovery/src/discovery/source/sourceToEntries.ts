import z from 'zod'

const Sources = z.record(z.object({ content: z.string() }))
const Settings = z.object({ remappings: z.array(z.string()).optional() })
const EtherscanSource = z.object({ sources: Sources, settings: Settings })

export interface DecodedSource {
  sources: [string, string][]
  remappings: string[]
}

export function decodeEtherscanSource(
  name: string,
  source: string,
): DecodedSource {
  if (!source.startsWith('{')) {
    return {
      sources: [[`${name}.sol`, source]],
      remappings: [],
    }
  }

  // etherscan sometimes wraps the json in {} so you get {{...}}
  if (source.startsWith('{{')) {
    source = source.slice(1, -1)
  }

  const parsed: unknown = JSON.parse(source)
  let validated: Record<string, { content: string }>
  let remappings: string[] = []
  try {
    const verified = EtherscanSource.parse(parsed)
    validated = verified.sources
    remappings = verified.settings.remappings ?? []
  } catch {
    validated = Sources.parse(parsed)
  }

  return {
    sources: Object.entries(validated).map(([name, { content }]) => [
      name,
      content,
    ]),
    remappings,
  }
}
