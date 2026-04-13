import { assert } from '@l2beat/shared-pure'
import { parse } from '@mradomski/fast-solidity-parser'
import { createHash } from 'crypto'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
import {
  type DeclarationFilePair,
  type FileContent,
  type ParsedFile,
  ParsedFilesManager,
} from './ParsedFilesManager'
import { renameIdentifier } from './renameIdentifier'
import type { FlattenOptions } from './types'

type EntryType = 'implementation' | 'signature'

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
  const order = topologicalSort(parsedFileManager, rootContract)
  const shouldBeInterface = generateShouldBeInterfaceDictionary(
    parsedFileManager,
    rootContract,
    order,
  )

  let flatSource = ''
  for (const contract of order) {
    const { declaration, file } = contract

    let content = shouldBeInterface[getUniqueContractId(contract)]
      ? generateInterfaceSourceFromContract(declaration)
      : declaration.content

    for (const { importedName, originalName } of file.importDirectives) {
      const resolved =
        importedName !== originalName
          ? parsedFileManager.tryFindDeclaration(importedName, file)
          : undefined

      const targetName = resolved?.declaration.name ?? importedName
      if (importedName !== targetName) {
        const ast = parse(content, { range: true }).children[0] ?? null
        content = renameIdentifier(content, ast, importedName, targetName)
      }
    }

    flatSource += formatSource(content)
  }

  return changeLineEndingsToUnix(flatSource.trimEnd())
}

function generateShouldBeInterfaceDictionary(
  parsedFileManager: ParsedFilesManager,
  rootContract: DeclarationFilePair,
  order: DeclarationFilePair[],
): Record<string, boolean> {
  const purelyDynamic = generatePurelyDynamicDictionary(
    parsedFileManager,
    rootContract,
  )
  const result: Record<string, boolean> = {}

  for (const contract of order) {
    const id = getUniqueContractId(contract)

    if (!purelyDynamic[id] || !isContract(contract)) {
      result[id] = false
      continue
    }

    result[id] = contract.declaration.implementationReferences.every((name) => {
      const base = parsedFileManager.tryFindDeclaration(name, contract.file)
      assert(base, `Failed to find contract ${name}`)
      return !isContract(base) || result[getUniqueContractId(base)]
    })
  }

  return result
}

function generatePurelyDynamicDictionary(
  parsedFileManager: ParsedFilesManager,
  rootContract: DeclarationFilePair,
): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  const stack: ContractNameFilePair[] = getStackEntries(rootContract).reverse()

  while (stack.length > 0) {
    const entry = stack.pop()
    assert(entry !== undefined, 'Stack should not be empty')

    const foundContract = parsedFileManager.tryFindDeclaration(
      entry.contractName,
      entry.file,
    )
    if (foundContract === undefined) {
      continue
    }

    const uniqueContractId = getUniqueContractId(foundContract)
    const alreadyVisited = uniqueContractId in result

    result[uniqueContractId] ??= true
    if (entry.type !== 'signature') {
      result[uniqueContractId] = false
    }

    if (alreadyVisited) {
      continue
    }

    stack.push(...getStackEntries(foundContract))
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
    const id = getUniqueContractId(pair)
    if (visited.has(id)) return
    visited.add(id)

    for (const { contractName, file } of getStackEntries(pair)) {
      const pair = parsedFileManager.tryFindDeclaration(contractName, file)
      if (pair !== undefined) {
        visit(pair)
      }
    }

    order.push(pair)
  }

  visit(rootContract)

  return order
}

function isContract(entry: DeclarationFilePair): boolean {
  return (
    entry.declaration.type === 'contract' ||
    entry.declaration.type === 'abstract'
  )
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
  const {
    file,
    declaration: { implementationReferences, signatureReferences },
  } = pair
  const seen = new Set(implementationReferences)

  return [
    ...implementationReferences.map((contractName) => ({
      contractName,
      file,
      type: 'implementation',
    })),
    ...signatureReferences
      .filter((name) => !seen.has(name))
      .map((contractName) => ({ contractName, file, type: 'signature' })),
  ] as ContractNameFilePair[]
}
