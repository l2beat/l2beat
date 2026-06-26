import { findLeadingCommentStart } from '@l2beat/discovery'
import {
  assert,
  type ChainSpecificAddress,
  partition,
} from '@l2beat/shared-pure'
import { type ASTNode, parse } from '@mradomski/fast-solidity-parser'
import { getASTTopLevelChildName } from '../solidityDeclarations'
import type { FlatSourceClient } from './FlatSourceClient'

type DiffoveryResult = {
  name: string
  sources: Record<string, string>
}

export class DiffoveryController {
  constructor(private readonly flatSourceClient: FlatSourceClient) {}

  async handle(address: ChainSpecificAddress): Promise<DiffoveryResult> {
    const result = await this.flatSourceClient.getFlat(address)
    switch (result.kind) {
      case 'eoa':
        return { name: result.name, sources: { 'L2BEAT-EOA': result.flat } }
      case 'unverified':
        return {
          name: result.name,
          sources: { 'L2BEAT-UNVERIFIED': result.flat },
        }
      case 'non-solidity':
        return {
          name: result.name,
          sources: { 'L2BEAT-NON-SOLIDITY': result.flat },
        }
      case 'flat':
        return {
          name: result.name,
          sources: {
            '#ConstructorArguments': result.constructorArguments,
            ...splitFlatSolidity(result.flat),
          },
        }
    }
  }
}

function splitFlatSolidity(flat: string): Record<string, string> {
  const result: Record<string, string> = {}

  const AST = parse(flat, { range: true })
  const [named, nameless] = partition(
    AST.children,
    (child) => getASTTopLevelChildName(child) !== undefined,
  )

  if (nameless.length > 0) {
    result['#Directives'] = nameless
      .map((n) => getNodeContent(flat, n))
      .join('\n\n')
  }

  for (const child of named) {
    const childName = getASTTopLevelChildName(child)
    assert(childName !== undefined)

    result[childName] = getNodeContent(flat, child)
  }

  return result
}

function getNodeContent(flat: string, node: ASTNode): string {
  assert(node.range !== undefined)

  const left = findLeadingCommentStart(flat, node.range[0])
  return flat.substring(left, node.range[1] + 1)
}
