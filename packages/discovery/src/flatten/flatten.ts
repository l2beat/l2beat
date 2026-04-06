import { assert } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
import {
  type DeclarationFilePair,
  type FileContent,
  type ParsedFile,
  ParsedFilesManager,
  type TopLevelDeclaration,
} from './ParsedFilesManager'
import type { FlattenOptions } from './types'

// A contract reference is one of:
//   - inheritance: appears in an `is Base` clause. The full contract must be
//     emitted.
//   - instantiation: used via `new Base(...)`. The full contract must be
//     emitted; an interface cannot be instantiated.
//   - dynamic: used only as a type in a function body, parameter, cast,
//     selector, etc. We only need its ABI, so if it is a contract we can
//     minimize it into an interface.
type EntryType = 'inheritance' | 'instantiation' | 'dynamic'

interface ContractNameFilePair {
  contractName: string
  file: ParsedFile
  type: EntryType
}

export function flattenStartingFrom(
  rootContractName: string,
  files: FileContent[],
  remappingStrings: string[],
  options?: FlattenOptions,
): string {
  const parsedFileManager = ParsedFilesManager.parseFiles(
    files,
    remappingStrings,
    options,
  )
  const rootContract = parsedFileManager.findRootDeclaration(rootContractName)
  const relationDictionary = generateUsedFromDictionary(
    parsedFileManager,
    rootContract,
  )

  // Post-order DFS. Each declaration is appended only after all of its
  // dependencies. This produces a topologically valid order that places base
  // contracts above any contract that inherits from them, even in the presence
  // of diamond inheritance.
  const visited = new Set<string>()
  // Top-level declarations may share a name across files (e.g. two copies
  // of Initializable from different library versions). In a single flat
  // file Solidity only allows one declaration per name, so we keep the
  // first version we see and drop subsequent duplicates. We track what
  // kind each emitted name was so that references to the name resolve to
  // the form that actually survived.
  const emittedKindByName = new Map<string, 'interface' | 'non-interface'>()
  const orderedPieces: string[] = []
  // File-level `using X for Y global;` directives from every file that
  // contributed at least one emitted declaration. Attached at the end so
  // the types they reference are always declared above.
  const seenFiles = new Set<string>()
  const usingDirectives: string[] = []
  const seenUsingSnippets = new Set<string>()

  // Given a declaration `entry`, return true if its emitted form will be an
  // interface. True for real interfaces and for contracts/abstracts that are
  // purely dynamic (and thus get minimized into a virtual interface).
  const emitsAsInterface = (entry: DeclarationFilePair): boolean => {
    if (entry === rootContract) return false
    if (entry.declaration.type === 'interface') return true
    if (!isContract(entry)) return false
    return entryIsPurelyDynamic(relationDictionary, entry)
  }

  // Resolves the short name of a base contract, as written in the source,
  // to the canonical declaration name used in the flattened output. Returns
  // undefined if the base is not emitted as an interface and should be
  // stripped from the generated `is` clause.
  const resolveInterfaceBaseFor = (entry: DeclarationFilePair) => {
    return (baseName: string): string | undefined => {
      const base = parsedFileManager.tryFindDeclaration(baseName, entry.file)
      if (base === undefined) return baseName
      const canonical = base.declaration.name
      // If some other version of this name already landed in the output,
      // the dedup will drop this one and leave the earlier form in place.
      // Honour that form when deciding whether to keep the base.
      const existingKind = emittedKindByName.get(canonical)
      if (existingKind !== undefined) {
        return existingKind === 'interface' ? canonical : undefined
      }
      if (!emitsAsInterface(base)) return undefined
      return canonical
    }
  }

  // Returns the canonical declaration name for a user-defined type as
  // referenced from `entry`. Handles `import { X as Y }` renames so that
  // generated interfaces reference the name that is actually emitted.
  const canonicalizeTypeNameFor = (entry: DeclarationFilePair) => {
    return (name: string): string => {
      const decl = parsedFileManager.tryFindDeclaration(name, entry.file)
      if (decl === undefined) return name
      return decl.declaration.name
    }
  }

  // Resolves a struct name (potentially nested inside a contract/library/
  // interface) to its top-level member declarations. Used by the public
  // state variable getter to expand struct-typed vars into tuple returns.
  const resolveStructFieldsFor = (entry: DeclarationFilePair) => {
    return (namePath: string) => {
      const shortName = namePath.split('.').at(-1)
      if (shortName === undefined) return undefined
      const topLevel = parsedFileManager.tryFindDeclaration(
        shortName,
        entry.file,
      )
      if (topLevel !== undefined && topLevel.declaration.type === 'struct') {
        const ast = topLevel.declaration.ast as unknown as {
          members?: unknown[]
        }
        return (ast.members ?? []) as never[]
      }
      // Search nested struct definitions across all files.
      for (const file of parsedFileManager.getAllFiles()) {
        for (const decl of file.rootASTNode.children) {
          if (decl.type !== 'ContractDefinition') continue
          for (const sub of decl.subNodes) {
            if (sub.type !== 'StructDefinition') continue
            const n = (sub as unknown as { name?: string }).name
            if (n !== shortName) continue
            const members = (sub as unknown as { members?: unknown[] }).members
            return (members ?? []) as never[]
          }
        }
      }
      return undefined
    }
  }

  // Collects externally-visible function definitions transitively reachable
  // from a base that had to be stripped from a generated interface's `is`
  // clause. These are inlined into the interface so callers that rely on
  // the external ABI keep working. Only functions whose parameter and
  // return types are resolvable in the current file context are emitted,
  // since we cannot import new files into the flat output.
  const inlineFunctionsForStrippedBaseFor = (entry: DeclarationFilePair) => {
    return (baseName: string) => {
      const fns: unknown[] = []
      const seenNames = new Set<string>()
      const seenDecls = new Set<string>()
      const canResolveType = (namePath: string): boolean => {
        const shortName = namePath.split('.').at(-1)
        if (shortName === undefined) return true
        if (ELEMENTARY_TYPES.has(shortName)) return true
        return (
          parsedFileManager.tryFindDeclaration(shortName, entry.file) !==
          undefined
        )
      }
      const collectTypeNames = (node: unknown, out: Set<string>): void => {
        if (node === null || node === undefined || typeof node !== 'object')
          return
        const n = node as Record<string, unknown> & { type?: string }
        if (n.type === 'UserDefinedTypeName') {
          const np = (n as unknown as { namePath?: string }).namePath
          if (typeof np === 'string') {
            const short = np.split('.').at(-1) ?? np
            out.add(short)
          }
        }
        for (const key of Object.keys(n)) {
          const v = n[key]
          if (Array.isArray(v)) {
            for (const item of v) collectTypeNames(item, out)
          } else if (v !== null && typeof v === 'object') {
            collectTypeNames(v, out)
          }
        }
      }
      const visit = (name: string, fromFile: ParsedFile): void => {
        if (seenDecls.has(name)) return
        seenDecls.add(name)
        const found = parsedFileManager.tryFindDeclaration(name, fromFile)
        if (found === undefined) return
        const declAst = found.declaration.ast as unknown as {
          type?: string
          subNodes?: Array<unknown>
        }
        if (declAst.type !== 'ContractDefinition') return
        for (const sub of declAst.subNodes ?? []) {
          const s = sub as {
            type?: string
            name?: string
            isConstructor?: boolean
            visibility?: string
            parameters?: unknown[]
            returnParameters?: unknown[]
          }
          if (s.type !== 'FunctionDefinition') continue
          if (s.isConstructor) continue
          if (s.visibility === 'internal' || s.visibility === 'private')
            continue
          const fnName = s.name ?? ''
          if (seenNames.has(fnName)) continue
          // Check that every type in the signature resolves in `entry.file`.
          const types = new Set<string>()
          for (const p of s.parameters ?? []) collectTypeNames(p, types)
          for (const p of s.returnParameters ?? []) collectTypeNames(p, types)
          let allResolvable = true
          for (const t of types) {
            if (!canResolveType(t)) {
              allResolvable = false
              break
            }
          }
          if (!allResolvable) continue
          seenNames.add(fnName)
          fns.push(sub)
        }
        for (const b of found.declaration.inheritsFrom) {
          visit(b, found.file)
        }
      }
      visit(baseName, entry.file)
      return fns as never[]
    }
  }

  const resolveTypeKindFor = (entry: DeclarationFilePair) => {
    return (namePath: string) => {
      const shortName = namePath.split('.').at(-1)
      if (shortName === undefined) return undefined
      const decl = parsedFileManager.tryFindDeclaration(shortName, entry.file)
      if (decl !== undefined) {
        return kindOf(decl)
      }
      // Fall back to searching all contracts/libraries/interfaces for a
      // nested struct or enum with this name. Names for nested structs are
      // not part of the top-level declarations table.
      return findNestedTypeKind(parsedFileManager, shortName)
    }
  }

  // Collects info about a given base of `entry`, restricted to the kept
  // portion of the inheritance chain as it appears in the flattened
  // output. Returns both the transitive ancestor names and the set of
  // externally-visible function names visible through that base, so the
  // interface generator can compute valid `override(...)` clauses.
  //
  // When the traversal passes through a declaration that is emitted as a
  // virtual interface, we include functions inlined into it from any
  // stripped bases, so callers that redeclare those functions correctly
  // get marked as `override`.
  const lookupKeptBaseInfoFor = (entry: DeclarationFilePair) => {
    return (baseName: string) => {
      const ancestorNames = new Set<string>()
      const functionNames = new Set<string>()
      const seen = new Set<string>()
      // Collects names from a declaration AND from the stripped branches
      // of its inheritance chain, which end up inlined into the virtual
      // interface form of that declaration.
      const collectInlinedFromStrippedBases = (
        decl: DeclarationFilePair,
      ): void => {
        const inlineSeen = new Set<string>()
        const walkStripped = (name: string, fromFile: ParsedFile): void => {
          if (inlineSeen.has(name)) return
          inlineSeen.add(name)
          const f = parsedFileManager.tryFindDeclaration(name, fromFile)
          if (f === undefined) return
          collectExternalFunctionNames(f.declaration, functionNames)
          for (const b of f.declaration.inheritsFrom) {
            walkStripped(b, f.file)
          }
        }
        for (const b of decl.declaration.inheritsFrom) {
          const baseDecl = parsedFileManager.tryFindDeclaration(b, decl.file)
          if (baseDecl === undefined) continue
          if (!emitsAsInterface(baseDecl)) {
            walkStripped(b, decl.file)
          }
        }
      }
      const visit = (declName: string, fromFile: ParsedFile): void => {
        if (seen.has(declName)) return
        seen.add(declName)
        const found = parsedFileManager.tryFindDeclaration(declName, fromFile)
        if (found === undefined) return
        ancestorNames.add(found.declaration.name)
        collectExternalFunctionNames(found.declaration, functionNames)
        const emittedAsInterface = emitsAsInterface(found)
        if (emittedAsInterface) {
          collectInlinedFromStrippedBases(found)
        }
        for (const b of found.declaration.inheritsFrom) {
          if (emittedAsInterface) {
            const baseDecl = parsedFileManager.tryFindDeclaration(b, found.file)
            if (baseDecl === undefined) continue
            if (!emitsAsInterface(baseDecl)) continue
          }
          visit(b, found.file)
        }
      }
      visit(baseName, entry.file)
      return { ancestorNames, functionNames }
    }
  }

  const visit = (entry: DeclarationFilePair): void => {
    const id = getUniqueContractId(entry)
    if (visited.has(id)) return
    visited.add(id)

    // Pull in any file-level `using for` directives from the file this
    // declaration came from, on the first visit to that file. Also visit
    // the library each directive binds so its source is emitted. Dedupe
    // by the exact snippet so shared library files don't emit the same
    // directive multiple times.
    const filePath = entry.file.normalizedPath
    if (!seenFiles.has(filePath)) {
      seenFiles.add(filePath)
      for (const using of entry.file.fileLevelUsings) {
        if (!seenUsingSnippets.has(using.snippet)) {
          seenUsingSnippets.add(using.snippet)
          usingDirectives.push(using.snippet)
        }
        if (using.libraryName !== '') {
          const lib = parsedFileManager.tryFindDeclaration(
            using.libraryName,
            entry.file,
          )
          if (lib !== undefined) visit(lib)
        }
      }
    }

    for (const dep of getStackEntries(entry)) {
      const found = parsedFileManager.tryFindDeclaration(
        dep.contractName,
        dep.file,
      )
      if (found === undefined) continue
      visit(found)
    }

    // Skip declarations whose name was already emitted by a different
    // version. Solidity does not allow two top-level declarations with the
    // same name in the same file.
    const declName = entry.declaration.name
    if (declName !== '' && emittedKindByName.has(declName)) {
      return
    }

    let content = entry.declaration.content
    let emittedKind: 'interface' | 'non-interface' = 'non-interface'
    if (
      entry !== rootContract &&
      entryIsPurelyDynamic(relationDictionary, entry) &&
      isContract(entry)
    ) {
      content = generateInterfaceSourceFromContract(
        entry.declaration,
        resolveInterfaceBaseFor(entry),
        resolveTypeKindFor(entry),
        lookupKeptBaseInfoFor(entry),
        canonicalizeTypeNameFor(entry),
        inlineFunctionsForStrippedBaseFor(entry),
        resolveStructFieldsFor(entry),
      )
      emittedKind = 'interface'
    } else {
      // Verbatim content still references imported names via the alias
      // each importing file gave them (e.g. `import { GnosisSafe as Safe }`).
      // Rewrite every such alias back to the declaration's canonical name
      // so the concatenated output compiles.
      content = rewriteAliases(entry.declaration, entry.file)
      if (entry.declaration.type === 'interface') emittedKind = 'interface'
    }
    if (declName !== '') emittedKindByName.set(declName, emittedKind)
    orderedPieces.push(content)
  }

  visit(rootContract)

  // Insert global using directives right before the root contract so that
  // every type and library they reference is already declared above.
  if (usingDirectives.length > 0) {
    const rootIdx = orderedPieces.length - 1
    orderedPieces.splice(rootIdx, 0, ...usingDirectives)
  }

  const flatSource = orderedPieces.map(formatSource).join('')
  return changeLineEndingsToUnix(flatSource.trimEnd())
}

function entryIsPurelyDynamic(
  relationDictionary: Record<string, string[]>,
  contract: DeclarationFilePair,
): boolean {
  const uniqueContractId = getUniqueContractId(contract)
  return (
    relationDictionary[uniqueContractId]?.every(
      (entry) => entry === 'dynamic',
    ) ?? false
  )
}

function generateUsedFromDictionary(
  parsedFileManager: ParsedFilesManager,
  rootContract: DeclarationFilePair,
): Record<string, EntryType[]> {
  const result: Record<string, EntryType[]> = {}
  const stack: ContractNameFilePair[] = getStackEntries(rootContract).reverse()

  while (stack.length > 0) {
    const entry = stack.pop()
    assert(entry !== undefined, 'Stack should not be empty')

    const foundContract = parsedFileManager.tryFindDeclaration(
      entry.contractName,
      entry.file,
    )
    assert(foundContract, `Failed to find contract ${entry.contractName}`)

    const uniqueContractId = getUniqueContractId(foundContract)
    if (result[uniqueContractId]?.includes(entry.type)) {
      continue
    }
    result[uniqueContractId] ??= []
    result[uniqueContractId]?.push(entry.type)

    const entries = getStackEntries(foundContract)
    if (entry.type === 'dynamic') {
      // Dynamic usage propagates to children, but an instantiation reached
      // through a dynamic chain still requires the full contract bytecode.
      // Otherwise, `library Foo { new Bar(...) }` called dynamically would
      // cause Bar to be demoted to an interface.
      entries.forEach((e) => {
        if (e.type !== 'instantiation') e.type = 'dynamic'
      })
    }
    stack.push(...entries)
  }

  return result
}

const ELEMENTARY_TYPES = new Set([
  'bool',
  'address',
  'string',
  'bytes',
  'bytes1',
  'bytes2',
  'bytes3',
  'bytes4',
  'bytes5',
  'bytes6',
  'bytes7',
  'bytes8',
  'bytes9',
  'bytes10',
  'bytes11',
  'bytes12',
  'bytes13',
  'bytes14',
  'bytes15',
  'bytes16',
  'bytes17',
  'bytes18',
  'bytes19',
  'bytes20',
  'bytes21',
  'bytes22',
  'bytes23',
  'bytes24',
  'bytes25',
  'bytes26',
  'bytes27',
  'bytes28',
  'bytes29',
  'bytes30',
  'bytes31',
  'bytes32',
  'int',
  'int8',
  'int16',
  'int24',
  'int32',
  'int40',
  'int48',
  'int56',
  'int64',
  'int72',
  'int80',
  'int88',
  'int96',
  'int104',
  'int112',
  'int120',
  'int128',
  'int136',
  'int144',
  'int152',
  'int160',
  'int168',
  'int176',
  'int184',
  'int192',
  'int200',
  'int208',
  'int216',
  'int224',
  'int232',
  'int240',
  'int248',
  'int256',
  'uint',
  'uint8',
  'uint16',
  'uint24',
  'uint32',
  'uint40',
  'uint48',
  'uint56',
  'uint64',
  'uint72',
  'uint80',
  'uint88',
  'uint96',
  'uint104',
  'uint112',
  'uint120',
  'uint128',
  'uint136',
  'uint144',
  'uint152',
  'uint160',
  'uint168',
  'uint176',
  'uint184',
  'uint192',
  'uint200',
  'uint208',
  'uint216',
  'uint224',
  'uint232',
  'uint240',
  'uint248',
  'uint256',
])

function isContract(entry: DeclarationFilePair): boolean {
  return (
    entry.declaration.type === 'contract' ||
    entry.declaration.type === 'abstract'
  )
}

function kindOf(
  entry: DeclarationFilePair,
): 'struct' | 'enum' | 'typedef' | 'interface' | 'contract' | undefined {
  const t = entry.declaration.type
  if (t === 'struct' || t === 'enum' || t === 'typedef') return t
  if (t === 'interface') return 'interface'
  if (t === 'contract' || t === 'abstract') return 'contract'
  return undefined
}

// Walks every parsed file's AST looking for a nested StructDefinition or
// EnumDefinition that matches the given name. Used as a fallback when a
// type referenced in a generated getter cannot be resolved via the
// top-level declaration table.
// Collects names of externally-visible functions declared directly on the
// given top-level declaration (contracts, interfaces, libraries). Public
// state variables contribute their auto-generated getter name. Internal
// and private functions are intentionally skipped because the generated
// interface never exposes them.
function collectExternalFunctionNames(
  declaration: TopLevelDeclaration,
  out: Set<string>,
): void {
  const ast = declaration.ast as unknown as {
    type?: string
    subNodes?: Array<unknown>
  }
  if (ast.type !== 'ContractDefinition') return
  for (const sub of ast.subNodes ?? []) {
    const s = sub as unknown as {
      type?: string
      name?: string
      isConstructor?: boolean
      visibility?: string
      variables?: Array<{
        visibility?: string
        identifier?: { name?: string }
      }>
    }
    if (s.type === 'FunctionDefinition') {
      if (s.isConstructor) continue
      if (s.visibility === 'internal' || s.visibility === 'private') continue
      if (typeof s.name === 'string' && s.name.length > 0) out.add(s.name)
    } else if (s.type === 'StateVariableDeclaration') {
      for (const v of s.variables ?? []) {
        if (v.visibility !== 'public') continue
        const name = v.identifier?.name
        if (name !== undefined) out.add(name)
      }
    }
  }
}

// Rewrites imported alias names back to the canonical declaration names.
// A file may say `import { GnosisSafe as Safe } from "..."` and use `Safe`
// throughout its body, but the flattener emits `contract GnosisSafe`, so
// references to `Safe` would fail to resolve in the single-file output.
//
// We walk the declaration's AST and only rewrite identifier *references*
// (UserDefinedTypeName nodes and bare Identifier expressions). This avoids
// touching string literals or comments, which would otherwise change the
// emitted bytecode.
function rewriteAliases(
  declaration: TopLevelDeclaration,
  file: ParsedFile,
): string {
  const renames = new Map<string, string>()
  for (const imp of file.importDirectives) {
    if (imp.originalName !== imp.importedName) {
      renames.set(imp.importedName, imp.originalName)
    }
  }
  const content = declaration.content
  if (renames.size === 0) return content

  const ast = declaration.ast as unknown as {
    range?: [number, number]
  }
  const declStart = ast.range?.[0] ?? 0

  // Collect (start, end, replacement) triples by walking the AST.
  const edits: Array<{ start: number; end: number; replacement: string }> = []
  const considerRename = (
    node: unknown,
    nameField: 'name' | 'namePath',
  ): void => {
    const n = node as Record<string, unknown>
    const value = n[nameField]
    if (typeof value !== 'string') return
    const range = n.range as [number, number] | undefined
    if (range === undefined) return
    // Aliases can apply to the leading segment (a namespace alias from
    // `import { Foo as ns }` used as `ns.Struct`) or to the lone
    // identifier itself. Check both and rewrite whichever matches.
    const parts = value.split('.')
    let newValue: string | undefined
    if (parts.length === 1) {
      const canonical = renames.get(parts[0] as string)
      if (canonical !== undefined) newValue = canonical
    } else {
      const head = parts[0] as string
      const canonicalHead = renames.get(head)
      if (canonicalHead !== undefined) {
        newValue = [canonicalHead, ...parts.slice(1)].join('.')
      } else {
        const tail = parts.at(-1) as string
        const canonicalTail = renames.get(tail)
        if (canonicalTail !== undefined) {
          newValue = parts.slice(0, -1).concat(canonicalTail).join('.')
        }
      }
    }
    if (newValue === undefined) return
    edits.push({
      start: range[0] - declStart,
      end: range[1] + 1 - declStart,
      replacement: newValue,
    })
  }

  const walk = (node: unknown): void => {
    if (node === null || node === undefined || typeof node !== 'object') return
    const n = node as Record<string, unknown> & { type?: string }
    if (n.type === 'UserDefinedTypeName') {
      considerRename(n, 'namePath')
      return
    }
    if (n.type === 'Identifier') {
      considerRename(n, 'name')
      return
    }
    for (const key of Object.keys(n)) {
      const value = n[key]
      if (Array.isArray(value)) {
        for (const v of value) walk(v)
      } else if (value !== null && typeof value === 'object') {
        walk(value)
      }
    }
  }
  walk(declaration.ast)

  if (edits.length === 0) return content

  // Apply edits in reverse order so positions stay valid.
  edits.sort((a, b) => b.start - a.start)
  let out = content
  for (const e of edits) {
    if (e.start < 0 || e.end > out.length) continue
    out = out.slice(0, e.start) + e.replacement + out.slice(e.end)
  }
  return out
}

function findNestedTypeKind(
  manager: ParsedFilesManager,
  shortName: string,
): 'struct' | 'enum' | undefined {
  for (const file of manager.getAllFiles()) {
    for (const decl of file.rootASTNode.children) {
      if (decl.type !== 'ContractDefinition') continue
      for (const sub of decl.subNodes) {
        const name = (sub as unknown as { name?: string }).name
        if (sub.type === 'StructDefinition' && name === shortName) {
          return 'struct'
        }
        if (sub.type === 'EnumDefinition' && name === shortName) {
          return 'enum'
        }
      }
    }
  }
  return undefined
}

function formatSource(source: string): string {
  return source + '\n\n'
}

function changeLineEndingsToUnix(source: string): string {
  return source.replace(/\r\n/g, '\n')
}

function getUniqueContractId(entry: DeclarationFilePair): string {
  const hasher = createHash('sha1')
  hasher.update(entry.declaration.content)
  return `0x${hasher.digest('hex')}`
}

function getStackEntries(pair: DeclarationFilePair): ContractNameFilePair[] {
  const inheritanceReferences: ContractNameFilePair[] =
    pair.declaration.inheritsFrom.map((contractName) => ({
      contractName,
      file: pair.file,
      type: 'inheritance',
    }))

  const instantiatedReferences: ContractNameFilePair[] =
    pair.declaration.instantiatedReferences
      .map(
        (contractName) =>
          ({
            contractName,
            file: pair.file,
            type: 'instantiation',
          }) as ContractNameFilePair,
      )
      .filter(
        (entry) =>
          !inheritanceReferences.some(
            (e) => e.contractName === entry.contractName,
          ),
      )

  const strongReferences = inheritanceReferences.concat(instantiatedReferences)

  const dynamicReferences: ContractNameFilePair[] =
    pair.declaration.dynamicReferences
      .map(
        (contractName) =>
          ({
            contractName,
            file: pair.file,
            type: 'dynamic',
          }) as ContractNameFilePair,
      )
      .filter(
        (entry) =>
          !strongReferences.some((e) => e.contractName === entry.contractName),
      )

  return strongReferences.concat(dynamicReferences)
}
