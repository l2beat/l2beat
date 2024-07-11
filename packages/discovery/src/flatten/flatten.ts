import { createHash } from 'crypto'
import { assert } from '@l2beat/backend-tools'

import {
  DeclarationFilePair,
  FileContent,
  ParsedFile,
  ParsedFilesManager,
} from './ParsedFilesManager'
import { FlattenOptions } from './types'

interface ContractNameFilePair {
  contractName: string
  file: ParsedFile
}

export function flattenStartingFrom(
  rootContractName: string,
  files: FileContent[],
  remappingStrings: string[],
  options?: FlattenOptions
): string {
  const parsedFileManager = ParsedFilesManager.parseFiles(
    files,
    remappingStrings,
    options
  )
  const rootContract = parsedFileManager.findDeclaration(rootContractName)

  let flatSource = formatSource(rootContract.declaration.content)

  // Depth first search
  const visited = new Set<string>()
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
    if (visited.has(uniqueContractId)) {
      continue
    }
    visited.add(uniqueContractId)

    const { declaration: contract } = foundContract
    flatSource = formatSource(contract.content) + flatSource
    stack.push(...getStackEntries(foundContract))
  }

  return changeLineEndingsToUnix(flatSource.trimEnd())
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
  const contractNames = pair.declaration.inheritsFrom.concat(
    pair.declaration.referencedDeclaration,
  )
  return contractNames.map((contractName) => ({
    contractName,
    file: pair.file,
  }))
}
