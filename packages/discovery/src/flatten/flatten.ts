import { assert } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { generateInterfaceSourceFromContract } from './generateInterfaceSourceFromContract'
import {
  type DeclarationFilePair,
  type FileContent,
  type ParsedFile,
  ParsedFilesManager,
} from './ParsedFilesManager'
import type { FlattenOptions } from './types'

type EntryType = 'inheritance' | 'dynamic'

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

  // Topological sort so base contracts precede derived contracts
  const order = topologicalSort(parsedFileManager, rootContract)

  let flatSource = ''
  for (const foundContract of order) {
    const generateInterface =
      entryIsPurelyDynamic(relationDictionary, foundContract) &&
      isContract(foundContract)

    const content = generateInterface
      ? generateInterfaceSourceFromContract(foundContract.declaration)
      : foundContract.declaration.content

    flatSource += formatSource(content)
  }

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
      entries.forEach((e) => (e.type = 'dynamic'))
    }
    stack.push(...entries)
  }

  return result
}

function topologicalSort(
  parsedFileManager: ParsedFilesManager,
  rootContract: DeclarationFilePair,
): DeclarationFilePair[] {
  const order: DeclarationFilePair[] = []
  const visited = new Set<string>()

  function visit(pair: DeclarationFilePair | undefined): void {
    assert(pair !== undefined, "Pair shouldn't be undefined")

    const id = getUniqueContractId(pair)
    if (visited.has(id)) return
    visited.add(id)

    for (const { contractName, file } of getStackEntries(pair)) {
      visit(parsedFileManager.tryFindDeclaration(contractName, file))
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
  const inheritanceReferences: ContractNameFilePair[] =
    pair.declaration.inheritsFrom.map((contractName) => ({
      contractName,
      file: pair.file,
      type: 'inheritance',
    }))

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
          !inheritanceReferences.some(
            (e) => e.contractName === entry.contractName,
          ),
      )

  return inheritanceReferences.concat(dynamicReferences)
}
