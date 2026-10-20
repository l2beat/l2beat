import type { BaseASTNode, FunctionCall } from '@mradomski/fast-solidity-parser'
import type { FlatEntry, FlatWorkspace } from './FlatWorkspace'
import {
  calleeOffset,
  type DefinitionResult,
  definitionsInEntry,
  resolveDefinition,
} from './resolveDefinition'
import { childrenOf, type TextPosition } from './SourceIndex'

export interface CallSite {
  caller: string
  path: string
  position: TextPosition
  result: DefinitionResult
}

export function listCalls(
  workspace: FlatWorkspace,
  entry: FlatEntry,
  functionName: string,
): CallSite[] {
  const callers = definitionsInEntry(
    workspace,
    entry,
    functionName,
    undefined,
    'in-file',
    'all',
  ).filter((d) => d.declaration.type === 'FunctionDefinition')

  const sites: CallSite[] = []
  for (const caller of callers) {
    const index = workspace.source(caller.path)
    for (const call of collectCalls(caller.declaration)) {
      const offset = calleeOffset(call)
      if (offset === undefined) {
        continue
      }
      const result = resolveDefinition(workspace, caller.path, offset)
      const definitions = result.definitions.filter((d) =>
        isCallable(d.declaration),
      )
      if (definitions.length === 0) {
        continue
      }
      sites.push({
        caller: caller.label,
        path: caller.path,
        position: index.positionOf(offset),
        result: { ...result, definitions },
      })
    }
  }
  return sites
}

function collectCalls(root: BaseASTNode): FunctionCall[] {
  const calls: FunctionCall[] = []
  const stack = childrenOf(root)
  while (stack.length > 0) {
    const node = stack.pop()
    if (node === undefined) {
      continue
    }
    if (node.type === 'FunctionCall') {
      calls.push(node as FunctionCall)
    }
    stack.push(...childrenOf(node))
  }
  return calls.sort((a, b) => (a.range?.[0] ?? 0) - (b.range?.[0] ?? 0))
}

function isCallable(node: BaseASTNode): boolean {
  return (
    node.type === 'FunctionDefinition' || node.type === 'VariableDeclaration'
  )
}
