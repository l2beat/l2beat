import { assert, unique } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
import { getASTIdentifiers } from './getASTIdentifiers'
import {
  type DeclarationFilePair,
  type DeclarationType,
  type FileContent,
  type ParsedFile,
  ParsedFilesManager,
} from './ParsedFilesManager'
import { renameIdentifiers } from './renameIdentifier'
import type { FlattenOptions } from './types'

export function flattenStartingFrom(
  rootContractName: string,
  rootFile: string | undefined,
  files: FileContent[],
  remappingStrings: string[],
  options?: FlattenOptions,
): string {
  const parsedFileManager = ParsedFilesManager.parseFiles(
    files,
    remappingStrings,
    options,
  )
  const rootContract = parsedFileManager.findDeclarationAt(
    rootContractName,
    rootFile,
  )
  assert(rootContract !== undefined, 'Failed to find the root contract')
  const sorted = topologicalSort(parsedFileManager, rootContract)
  const order = [...collectPragmas(sorted), ...sorted]
  const shouldBeInterface = computeShouldBeInterface(
    parsedFileManager,
    rootContract,
    order,
  )
  const usedMembers = computeUsedMembers(
    parsedFileManager,
    order,
    shouldBeInterface,
  )

  const typeMap = buildTypeMap(order)
  const renameMap = buildRenameMap(order)

  let flatSource = ''
  for (const { declaration, file } of order) {
    const content = shouldBeInterface[declaration.id]
      ? generateInterfaceSourceFromContract(
          declaration,
          typeMap,
          usedMembers.get(declaration.id),
        )
      : declaration.content

    const remapNames = getVisibleNames(file).flatMap((from) => {
      const resolved = parsedFileManager.tryFindDeclaration(from, file)
      const to = resolved ? renameMap.get(resolved.declaration.id) : undefined
      return to !== undefined && from !== to ? [{ from, to }] : []
    })

    flatSource += renameIdentifiers(content, remapNames) + '\n\n'
  }

  return flatSource.trimEnd().replace(/\r\n/g, '\n')
}

function computeShouldBeInterface(
  parsedFileManager: ParsedFilesManager,
  rootContract: DeclarationFilePair,
  order: DeclarationFilePair[],
): Record<string, boolean> {
  // A declaration is "purely dynamic" if it's only ever reached via signature
  // references, never via implementation references.
  const purelyDynamic: Record<string, boolean> = {}
  for (const { declaration } of order) {
    purelyDynamic[declaration.id] = true
  }
  purelyDynamic[rootContract.declaration.id] = false
  for (const { declaration, file } of order) {
    for (const name of declaration.implementationReferences) {
      const target = parsedFileManager.tryFindDeclaration(name, file)
      if (target) {
        purelyDynamic[target.declaration.id] = false
      }
    }
  }

  // A contract should become an interface if it's purely dynamic, is a
  // contract/abstract, and all its base contracts are also interfaces.
  // Because order is topological, bases are already resolved when we get here.
  const result: Record<string, boolean> = {}
  for (const entry of order) {
    const { declaration, file } = entry
    const id = declaration.id

    if (!purelyDynamic[id] || !isContract(entry)) {
      result[id] = false
      continue
    }

    result[id] = declaration.implementationReferences.every((name) => {
      const base = parsedFileManager.tryFindDeclaration(name, file)
      assert(base, `Failed to find contract ${name}`)
      return !isContract(base) || result[base.declaration.id]
    })
  }

  return result
}

// For each contract that will be regenerated as an interface, decide which
// public members are still referenced by the rest of the flat file. Unused
// members are dropped.
//
// Receiver-aware (Approach B): `Iface(x).foo` and `Iface.foo` resolve to a
// specific interface; other member accesses (`varOfIfaceType.foo`, `msg.sender`,
// chained `a.b.c`, ...) are broadcast to every interface as a safety net. A
// final transitive pass keeps types referenced by kept members' signatures.
function computeUsedMembers(
  parsedFileManager: ParsedFilesManager,
  order: DeclarationFilePair[],
  shouldBeInterface: Record<string, boolean>,
): Map<string, Set<string>> {
  const used = new Map<string, Set<string>>()
  const ambiguous = new Set<string>()
  for (const { declaration } of order) {
    if (shouldBeInterface[declaration.id]) used.set(declaration.id, new Set())
  }

  const recordUse = (
    receiver: string | undefined,
    memberName: string,
    file: ParsedFile,
  ): void => {
    const decl =
      receiver && parsedFileManager.tryFindDeclaration(receiver, file)
    const target = decl && used.get(decl.declaration.id)
    if (target) target.add(memberName)
    else ambiguous.add(memberName)
  }

  for (const entry of order) {
    if (shouldBeInterface[entry.declaration.id]) continue
    getASTIdentifiers(entry.declaration.ast, (node) => {
      if (node.type === 'MemberAccess') {
        const { expression, memberName } = node as AST.MemberAccess
        const receiver =
          expression.type === 'Identifier'
            ? expression.name
            : expression.type === 'FunctionCall' &&
                expression.expression.type === 'Identifier'
              ? expression.expression.name
              : undefined
        recordUse(receiver, memberName, entry.file)
      } else if (node.type === 'UserDefinedTypeName') {
        const parts = (node as AST.UserDefinedTypeName).namePath.split('.')
        if (parts.length >= 2) {
          recordUse(parts[0], parts[1] as string, entry.file)
        }
      }
    })
  }

  for (const { declaration } of order) {
    const keep = used.get(declaration.id)
    if (!keep) continue
    for (const name of ambiguous) keep.add(name)
    const refs = signatureRefMap(declaration.ast as AST.ContractDefinition)
    const queue = [...keep]
    while (queue.length > 0) {
      const name = queue.pop() as string
      for (const id of refs.get(name) ?? []) {
        const head = id.split('.')[0] as string
        if (refs.has(head) && !keep.has(head)) {
          keep.add(head)
          queue.push(head)
        }
      }
    }
  }

  return used
}

// Identifiers reachable from each member's *signature* — function bodies are
// excluded because they're dropped when the interface is regenerated.
function signatureRefMap(ast: AST.ContractDefinition): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const sub of ast.subNodes) {
    const node = sub as AST.ASTNode
    if (node.type === 'FunctionDefinition') {
      if (
        node.isConstructor ||
        node.visibility === 'private' ||
        node.visibility === 'internal' ||
        node.name === null
      ) {
        continue
      }
      map.set(node.name, [
        ...node.parameters.flatMap((p) => getASTIdentifiers(p)),
        ...(node.returnParameters ?? []).flatMap((p) => getASTIdentifiers(p)),
      ])
    } else if (
      node.type === 'StructDefinition' ||
      node.type === 'EnumDefinition' ||
      node.type === 'TypeDefinition' ||
      node.type === 'EventDefinition' ||
      node.type === 'CustomErrorDefinition'
    ) {
      map.set(node.name, getASTIdentifiers(node))
    } else if (node.type === 'StateVariableDeclaration') {
      for (const variable of node.variables) {
        if (variable.visibility === 'public' && variable.name !== null) {
          map.set(variable.name, getASTIdentifiers(variable))
        }
      }
    }
  }
  return map
}

function topologicalSort(
  parsedFileManager: ParsedFilesManager,
  rootContract: DeclarationFilePair,
): DeclarationFilePair[] {
  // Post-order DFS that defers a node until its inheritance bases are emitted,
  // so reference cycles get broken at a signature edge, never an inheritance one.
  const order: DeclarationFilePair[] = []
  const inOrder = new Set<string>()
  const visited = new Set<string>()
  const pending: DeclarationFilePair[] = []

  const basesReady = (p: DeclarationFilePair) =>
    p.declaration.implementationReferences.every((name) => {
      const base = parsedFileManager.tryFindDeclaration(name, p.file)
      return !base || inOrder.has(base.declaration.id)
    })

  function visit(pair: DeclarationFilePair): void {
    if (visited.has(pair.declaration.id)) return
    visited.add(pair.declaration.id)
    for (const name of allReferences(pair)) {
      const dep = parsedFileManager.tryFindDeclaration(name, pair.file)
      if (dep) visit(dep)
    }
    pending.push(pair)
    for (let p = pending.find(basesReady); p; p = pending.find(basesReady)) {
      pending.splice(pending.indexOf(p), 1)
      order.push(p)
      inOrder.add(p.declaration.id)
    }
  }

  visit(rootContract)
  assert(pending.length === 0, 'inheritance cycle detected')
  return order
}

function allReferences(pair: DeclarationFilePair): string[] {
  const { implementationReferences, signatureReferences } = pair.declaration
  return unique([...implementationReferences, ...signatureReferences])
}

function isContract(entry: DeclarationFilePair): boolean {
  return (
    entry.declaration.type === 'contract' ||
    entry.declaration.type === 'abstract'
  )
}

function getVisibleNames(file: ParsedFile): string[] {
  return unique([
    ...file.topLevelDeclarations.map((d) => d.name),
    ...file.importDirectives.map((i) => i.importedName),
  ])
}

function buildTypeMap(
  order: DeclarationFilePair[],
): Map<string, DeclarationType> {
  const map = new Map<string, DeclarationType>()
  for (const { declaration } of order) {
    map.set(declaration.name, declaration.type)
    if (
      declaration.type === 'contract' ||
      declaration.type === 'abstract' ||
      declaration.type === 'interface' ||
      declaration.type === 'library'
    ) {
      const ast = declaration.ast as AST.ContractDefinition
      for (const sub of ast.subNodes) {
        const node = sub as AST.ASTNode
        if (node.type === 'StructDefinition') {
          map.set(`${declaration.name}.${node.name}`, 'struct')
          if (!map.has(node.name)) map.set(node.name, 'struct')
        } else if (node.type === 'EnumDefinition') {
          map.set(`${declaration.name}.${node.name}`, 'enum')
          if (!map.has(node.name)) map.set(node.name, 'enum')
        } else if (node.type === 'TypeDefinition') {
          map.set(`${declaration.name}.${node.name}`, 'typedef')
          if (!map.has(node.name)) map.set(node.name, 'typedef')
        }
      }
    }
  }
  return map
}

// NOTE(radomski): We want to have all pragrams without the ones that configure
// the Solidity version. Also the pragrams should be deduplicated.
function collectPragmas(order: DeclarationFilePair[]): DeclarationFilePair[] {
  const byContent = new Map<string, DeclarationFilePair>()
  for (const { file } of order) {
    for (const n of file.rootASTNode.children) {
      if (n.type !== 'PragmaDirective' || n.name === 'solidity') continue
      const content = `pragma ${n.name} ${n.value};`
      byContent.set(content, {
        file,
        declaration: {
          ast: n,
          name: content,
          type: 'pragma',
          content,
          id: content,
          implementationReferences: [],
          signatureReferences: [],
        },
      })
    }
  }
  return [...byContent.values()]
}

function buildRenameMap(order: DeclarationFilePair[]): Map<string, string> {
  const renameMap = new Map<string, string>()
  const usedNames = new Map<string, number>()

  for (const { declaration } of order) {
    const { name, id } = declaration
    const count = usedNames.get(name) ?? 0
    usedNames.set(name, count + 1)
    renameMap.set(id, count === 0 ? name : `${name}_${count}`)
  }

  return renameMap
}
