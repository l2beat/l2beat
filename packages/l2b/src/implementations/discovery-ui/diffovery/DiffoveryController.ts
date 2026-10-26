import {
  assert,
  type ChainSpecificAddress,
  partition,
} from '@l2beat/shared-pure'
import { splitSolidityDeclarations } from '../solidityDeclarations'
import type { FlatSource, FlatSourceClient } from './FlatSourceClient'

type DiffoveryResult = {
  kind: FlatSource['kind']
  name: string
  sources: Record<string, string>
}

export class DiffoveryController {
  constructor(private readonly flatSourceClient: FlatSourceClient) {}

  async handle(address: ChainSpecificAddress): Promise<DiffoveryResult> {
    const result = await this.flatSourceClient.getFlat(address)
    switch (result.kind) {
      case 'eoa':
        return {
          kind: result.kind,
          name: result.name,
          sources: { 'L2BEAT-EOA': result.flat },
        }
      case 'unverified':
        return {
          kind: result.kind,
          name: result.name,
          sources: { 'L2BEAT-UNVERIFIED': result.flat },
        }
      case 'non-solidity':
        return {
          kind: result.kind,
          name: result.name,
          sources: { 'L2BEAT-NON-SOLIDITY': result.flat },
        }
      case 'flat':
        return {
          kind: result.kind,
          name: result.name,
          sources: {
            '#ConstructorArguments': result.constructorArguments,
            ...splitFlatSolidity(result.flat),
          },
        }
    }
  }
}

// Text between declarations, like a comment after the last one, goes to
// #Directives, so that a difference there is not lost.
function splitFlatSolidity(flat: string): Record<string, string> {
  const result: Record<string, string> = {}

  const [named, unnamed] = partition(
    splitSolidityDeclarations(flat),
    (segment) => segment.name !== null,
  )

  const directives = unnamed
    .map((segment) => segment.content.trim())
    .filter((content) => content !== '')
  if (directives.length > 0) {
    result['#Directives'] = directives.join('\n\n')
  }

  for (const segment of named) {
    assert(segment.name !== null)
    result[uniqueKey(result, segment.name)] = segment.content
  }

  return result
}

// Overloaded free functions share a name, and a later one would replace
// the earlier one.
function uniqueKey(result: Record<string, string>, name: string): string {
  let key = name
  for (let occurrence = 2; key in result; occurrence++) {
    key = `${name} (${occurrence})`
  }
  return key
}
