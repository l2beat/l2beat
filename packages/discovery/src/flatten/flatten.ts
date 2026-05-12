import { assert, unique } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
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
  const order = topologicalSort(parsedFileManager, rootContract)
  const shouldBeInterface = computeShouldBeInterface(
    parsedFileManager,
    rootContract,
    order,
  )

  const typeMap = buildTypeMap(order)
  const renameMap = buildRenameMap(order)

  let flatSource = ''
  for (const { declaration, file } of order) {
    const content = shouldBeInterface[declaration.id]
      ? generateInterfaceSourceFromContract(declaration, typeMap)
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

function topologicalSort(
  parsedFileManager: ParsedFilesManager,
  rootContract: DeclarationFilePair,
): DeclarationFilePair[] {
  const order: DeclarationFilePair[] = []
  const visited = new Set<string>()

  function visit(pair: DeclarationFilePair): void {
    const id = pair.declaration.id
    if (visited.has(id)) return
    visited.add(id)

    for (const name of allReferences(pair)) {
      const dep = parsedFileManager.tryFindDeclaration(name, pair.file)
      if (dep === undefined) continue
      visit(dep)
    }

    order.push(pair)
  }

  visit(rootContract)

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
