import type {
  BaseASTNode,
  FunctionCall,
  FunctionDefinition,
} from '@mradomski/fast-solidity-parser'
import type { FlatEntry, FlatWorkspace } from './FlatWorkspace'
import {
  calleeOffset,
  type Definition,
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
    'in-file',
    'all',
  ).filter((d) => d.declaration.type === 'FunctionDefinition')

  const sites: CallSite[] = []
  for (const caller of callers) {
    for (const body of [caller, ...appliedModifiers(workspace, caller)]) {
      sites.push(...callSites(workspace, caller.label, body))
    }
  }
  return sites
}

// A modifier's body runs as part of every function that applies it.
function appliedModifiers(
  workspace: FlatWorkspace,
  caller: Definition,
): Definition[] {
  const fn = caller.declaration as FunctionDefinition
  return fn.modifiers.flatMap((modifier) => {
    const offset = modifier.range?.[0]
    if (offset === undefined) {
      return []
    }
    return resolveDefinition(workspace, caller.path, offset).definitions.filter(
      (d) => d.declaration.type === 'ModifierDefinition',
    )
  })
}

function callSites(
  workspace: FlatWorkspace,
  caller: string,
  body: Definition,
): CallSite[] {
  const sites: CallSite[] = []
  const index = workspace.source(body.path)
  for (const call of collectCalls(body.declaration)) {
    const offset = calleeOffset(call)
    if (offset === undefined) {
      continue
    }
    const result = resolveDefinition(workspace, body.path, offset)
    const definitions = result.definitions.filter((d) =>
      isCallable(d.declaration),
    )
    if (definitions.length === 0) {
      continue
    }
    sites.push({
      caller,
      path: body.path,
      position: index.positionOf(offset),
      result: { ...result, definitions },
    })
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
