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
  type TopLevelDeclaration,
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
  // Interface-ness, used members, and reachability are interdependent: pruning
  // a contract can remove an implementation reference (e.g. a `new X` in a
  // now-stripped body) that was keeping its target out of the purely-dynamic
  // set, unblocking further pruning. Iterate until the surviving set is stable.
  let current = topologicalSort(parsedFileManager, rootContract)
  let shouldBeInterface = computeShouldBeInterface(
    parsedFileManager,
    rootContract,
    current,
  )
  let usedMembers = computeUsedMembers(
    parsedFileManager,
    current,
    shouldBeInterface,
  )
  while (true) {
    const next = pruneUnreachable(
      parsedFileManager,
      current,
      rootContract,
      shouldBeInterface,
      usedMembers,
    )
    if (next.length === current.length) break
    current = next
    shouldBeInterface = computeShouldBeInterface(
      parsedFileManager,
      rootContract,
      current,
    )
    usedMembers = computeUsedMembers(
      parsedFileManager,
      current,
      shouldBeInterface,
    )
  }
  const order = [...collectPragmas(current, rootContract.file), ...current]

  const typeMap = buildTypeMap(order)
  const renameMap = buildRenameMap(order)
  renameShadowedAliasTargets(parsedFileManager, order, renameMap)
  const structNames = collectStructNames(order)

  let flatSource = ''
  for (const { declaration, file } of order) {
    const content = shouldBeInterface[declaration.id]
      ? generateInterfaceSourceFromContract(
          declaration,
          typeMap,
          (namePath) =>
            resolveStruct(parsedFileManager, { declaration, file }, namePath),
          usedMembers.get(declaration.id),
        )
      : declaration.content

    const remapNames = getVisibleNames(file).flatMap((from) => {
      const resolved = parsedFileManager.tryFindDeclaration(from, file)
      const to = resolved ? renameMap.get(resolved.declaration.id) : undefined
      return to !== undefined && from !== to ? [{ from, to }] : []
    })

    flatSource += renameIdentifiers(content, remapNames, structNames) + '\n\n'
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
        const aliased = `${parts[0]}.${parts[1]}`
        if (
          parts.length >= 3 &&
          parsedFileManager.tryFindDeclaration(aliased, entry.file)
        ) {
          recordUse(aliased, parts[2] as string, entry.file)
        } else if (parts.length >= 2) {
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

function pruneUnreachable(
  parsedFileManager: ParsedFilesManager,
  order: DeclarationFilePair[],
  rootContract: DeclarationFilePair,
  shouldBeInterface: Record<string, boolean>,
  usedMembers: Map<string, Set<string>>,
): DeclarationFilePair[] {
  const effective = new Map<string, string[]>()
  for (const entry of order) {
    const id = entry.declaration.id
    if (!shouldBeInterface[id]) {
      effective.set(id, allReferences(entry))
      continue
    }
    const keep = usedMembers.get(id) ?? new Set<string>()
    const refs: string[] = [...entry.declaration.implementationReferences]
    const sigs = signatureRefMap(
      entry.declaration.ast as AST.ContractDefinition,
    )
    for (const [name, ids] of sigs) {
      if (keep.has(name)) refs.push(...ids)
    }
    effective.set(id, refs)
  }

  const reachable = new Set<string>([rootContract.declaration.id])
  const stack: DeclarationFilePair[] = [rootContract]
  while (stack.length > 0) {
    const cur = stack.pop() as DeclarationFilePair
    for (const ref of effective.get(cur.declaration.id) ?? []) {
      const head = ref.split('.')[0] as string
      const dep =
        parsedFileManager.tryFindDeclaration(ref, cur.file) ??
        parsedFileManager.tryFindDeclaration(head, cur.file)
      if (dep && !reachable.has(dep.declaration.id)) {
        reachable.add(dep.declaration.id)
        stack.push(dep)
      }
    }
  }
  return order.filter((e) => reachable.has(e.declaration.id))
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

// Resolves a struct type name the way solc does from inside a contract: its
// own and inherited nested types first, then the file scope
function resolveStruct(
  parsedFileManager: ParsedFilesManager,
  owner: DeclarationFilePair,
  namePath: string,
): AST.StructDefinition | undefined {
  const aliased = parsedFileManager.tryFindDeclaration(namePath, owner.file)
  if (aliased?.declaration.type === 'struct') {
    return aliased.declaration.ast as AST.StructDefinition
  }

  const [head, member] = namePath.split('.') as [string, string | undefined]
  if (member !== undefined) {
    const container = parsedFileManager.tryFindDeclaration(head, owner.file)
    const nested = container && findNestedType(container.declaration, member)
    return nested?.type === 'StructDefinition' ? nested : undefined
  }

  const visited = new Set<string>()
  const stack: DeclarationFilePair[] = [owner]
  while (stack.length > 0) {
    const pair = stack.pop() as DeclarationFilePair
    if (visited.has(pair.declaration.id)) continue
    visited.add(pair.declaration.id)
    const nested = findNestedType(pair.declaration, head)
    if (nested !== undefined) {
      return nested.type === 'StructDefinition' ? nested : undefined
    }
    const ast = pair.declaration.ast as AST.ContractDefinition
    for (const base of ast.baseContracts) {
      const resolved = parsedFileManager.tryFindDeclaration(
        base.baseName.namePath,
        pair.file,
      )
      if (resolved !== undefined) stack.push(resolved)
    }
  }

  const topLevel = parsedFileManager.tryFindDeclaration(head, owner.file)
  return topLevel?.declaration.type === 'struct'
    ? (topLevel.declaration.ast as AST.StructDefinition)
    : undefined
}

function findNestedType(
  declaration: TopLevelDeclaration,
  name: string,
): AST.StructDefinition | AST.EnumDefinition | AST.TypeDefinition | undefined {
  if (declaration.ast.type !== 'ContractDefinition') return undefined
  for (const sub of (declaration.ast as AST.ContractDefinition).subNodes) {
    const node = sub as AST.ASTNode
    if (
      (node.type === 'StructDefinition' ||
        node.type === 'EnumDefinition' ||
        node.type === 'TypeDefinition') &&
      node.name === name
    ) {
      return node
    }
  }
  return undefined
}

// NOTE(radomski): We want to have all pragrams without the ones that configure
// the Solidity version. Also the pragrams should be deduplicated.
//
// Before 0.8 the ABI coder is chosen per file and defaults to v1, so a v2
// pragma from a dependency would claim v2 for a root that was compiled with v1.
function collectPragmas(
  order: DeclarationFilePair[],
  rootFile: ParsedFile,
): DeclarationFilePair[] {
  const keepDependencyCoders = !isBeforeSolidity08(rootFile)
  const byContent = new Map<string, DeclarationFilePair>()
  for (const { file } of order) {
    for (const n of file.rootASTNode.children) {
      if (n.type !== 'PragmaDirective' || n.name === 'solidity') continue
      if (file !== rootFile && !keepDependencyCoders && isAbiCoderPragma(n)) {
        continue
      }
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

function isAbiCoderPragma(pragma: AST.PragmaDirective): boolean {
  if (pragma.name === 'abicoder') return true
  return pragma.name === 'experimental' && pragma.value === 'ABIEncoderV2'
}

function isBeforeSolidity08(file: ParsedFile): boolean {
  const pragma = file.rootASTNode.children.find(
    (n): n is AST.PragmaDirective =>
      n.type === 'PragmaDirective' && n.name === 'solidity',
  )
  if (pragma === undefined) return false
  return ['0.4.', '0.5.', '0.6.', '0.7.'].some((v) => pragma.value.includes(v))
}

// `K.X` becomes plain `X` in the flat file, so X needs a fresh name when the
// file reading it through K already uses another X
function renameShadowedAliasTargets(
  parsedFileManager: ParsedFilesManager,
  order: DeclarationFilePair[],
  renameMap: Map<string, string>,
): void {
  const namesByFile = new Map<ParsedFile, Set<string>>()
  for (const entry of order) {
    const names = namesByFile.get(entry.file) ?? new Set<string>()
    for (const name of getASTIdentifiers(entry.declaration.ast)) names.add(name)
    for (const name of getScopeMemberNames(parsedFileManager, entry)) {
      names.add(name)
    }
    namesByFile.set(entry.file, names)
  }

  const conflictsByTarget = new Map<string, Set<string>>()
  for (const [file, names] of namesByFile) {
    for (const { importedName } of file.importDirectives) {
      if (!importedName.includes('.')) continue
      const target = parsedFileManager.tryFindDeclaration(importedName, file)
      if (target === undefined) continue
      const id = target.declaration.id
      const conflicts = conflictsByTarget.get(id) ?? new Set<string>()
      for (const name of names) conflicts.add(name)
      conflictsByTarget.set(id, conflicts)
    }
  }

  const taken = new Set(renameMap.values())
  for (const [id, conflicts] of conflictsByTarget) {
    const name = renameMap.get(id)
    if (name === undefined || !conflicts.has(name)) continue
    let suffix = 1
    while (
      taken.has(`${name}_${suffix}`) ||
      conflicts.has(`${name}_${suffix}`)
    ) {
      suffix++
    }
    renameMap.set(id, `${name}_${suffix}`)
    taken.add(`${name}_${suffix}`)
  }
}

// Members of a contract and of every contract it inherits from, which shadow
// file-level names inside it
function getScopeMemberNames(
  parsedFileManager: ParsedFilesManager,
  entry: DeclarationFilePair,
): string[] {
  const names: string[] = []
  const visited = new Set<string>()
  const stack: DeclarationFilePair[] = [entry]
  while (stack.length > 0) {
    const pair = stack.pop() as DeclarationFilePair
    if (visited.has(pair.declaration.id)) continue
    visited.add(pair.declaration.id)
    const ast = pair.declaration.ast as AST.ASTNode
    if (ast.type !== 'ContractDefinition') continue
    names.push(...getMemberNames(ast))
    for (const base of ast.baseContracts) {
      const resolved = parsedFileManager.tryFindDeclaration(
        base.baseName.namePath,
        pair.file,
      )
      if (resolved !== undefined) stack.push(resolved)
    }
  }
  return names
}

function getMemberNames(ast: AST.ContractDefinition): string[] {
  return ast.subNodes.flatMap((sub) => {
    const node = sub as AST.ASTNode
    if (node.type === 'StateVariableDeclaration') {
      return node.variables.flatMap((v) => (v.name === null ? [] : [v.name]))
    }
    return 'name' in node && typeof node.name === 'string' ? [node.name] : []
  })
}

function collectStructNames(order: DeclarationFilePair[]): Set<string> {
  const names = new Set<string>()
  for (const { declaration } of order) {
    if (declaration.type === 'struct') names.add(declaration.name)
    const ast = declaration.ast as AST.ASTNode
    if (ast.type !== 'ContractDefinition') continue
    for (const sub of ast.subNodes) {
      const node = sub as AST.ASTNode
      if (node.type === 'StructDefinition') names.add(node.name)
    }
  }
  return names
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
