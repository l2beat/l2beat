import { assert } from '@l2beat/backend-tools'
import { createHash } from 'crypto'

import {
  ByteRange,
  DeclarationFilePair,
  ParsedFile,
  ParsedFilesManager,
} from './ParsedFilesManager'

interface ContractNameFilePair {
  contractName: string
  file: ParsedFile
}

export function flattenStartingFrom(
  rootContractName: string,
  parsedFileManager: ParsedFilesManager,
): string {
  const rootContract = parsedFileManager.findDeclaration(rootContractName)

  let flatSource = formatSource(
    rootContract.file.content,
    rootContract.declaration.byteRange,
  )

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

    const { declaration: contract, file } = foundContract
    flatSource = formatSource(file.content, contract.byteRange) + flatSource
    stack.push(...getStackEntries(foundContract))
  }

  return changeLineEndingsToUnix(flatSource.trimEnd())
}

function formatSource(source: string, byteRange: ByteRange): string {
  return source.slice(byteRange.start, byteRange.end + 1) + '\n\n'
}

function changeLineEndingsToUnix(source: string): string {
  return source.replace(/\r\n/g, '\n')
}

function getUniqueContractId(entry: DeclarationFilePair): string {
  const hasher = createHash('sha1')
  const source = formatSource(entry.file.content, entry.declaration.byteRange)
  hasher.update(source)
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
