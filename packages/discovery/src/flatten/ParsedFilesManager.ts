import { assert } from '@l2beat/backend-tools'
import { parse } from '@solidity-parser/parser'
// eslint-disable-next-line import/no-unresolved
import { ContractDefinition } from '@solidity-parser/parser/dist/src/ast-types'
import * as posix from 'path'

import { getASTIdentifiers } from './getASTIdentifiers'

type ParseResult = ReturnType<typeof parse>

export interface ByteRange {
  start: number
  end: number
}

type ContractType = 'contract' | 'interface' | 'library' | 'abstract'

export interface ContractDeclaration {
  name: string
  type: ContractType

  ast: ContractDefinition
  byteRange: ByteRange

  inheritsFrom: string[]
  referencedContracts: string[]
}

// If import is:
//
// import { foo as bar } from 'baz'
//
// Then:
// absolutePath: 'baz'
// originalName: 'foo'
// importedName: 'bar'
interface ImportDirective {
  absolutePath: string
  originalName: string
  importedName: string
}

export interface FileContent {
  path: string
  content: string
}

export interface Remapping {
  context: string
  prefix: string
  target: string
}

export interface ParsedFile extends FileContent {
  rootASTNode: ParseResult

  contractDeclarations: ContractDeclaration[]
  importDirectives: ImportDirective[]
}

export interface ContractFilePair {
  contract: ContractDeclaration
  file: ParsedFile
}

export class ParsedFilesManager {
  private files: ParsedFile[] = []

  static parseFiles(
    files: FileContent[],
    remappingStrings: string[],
  ): ParsedFilesManager {
    const result = new ParsedFilesManager()
    const remappings = decodeRemappings(remappingStrings)

    result.files = files.map(({ path, content }) => ({
      path: resolveRemappings(path, remappings),
      content,
      rootASTNode: parse(content, { range: true }),
      contractDeclarations: [],
      importDirectives: [],
    }))

    // Pass 1: Find all contract declarations
    for (const file of result.files) {
      file.contractDeclarations = result.resolveContractDeclarations(file)
    }

    // Pass 2: Resolve all imports
    for (const file of result.files) {
      const alreadyImportedObjects = new Map<string, string[]>()
      alreadyImportedObjects.set(
        file.path,
        file.contractDeclarations.map((c) => c.name),
      )

      file.importDirectives = result.resolveFileImports(
        file,
        remappings,
        alreadyImportedObjects,
      )
    }

    // Pass 3: Resolve all references to other contracts
    for (const file of result.files) {
      for (const contract of file.contractDeclarations) {
        contract.referencedContracts = result.resolveReferencedLibraries(
          file,
          contract.ast,
        )
      }
    }

    // Pass 4: Make sure that there are no top-level function definitions
    for (const file of result.files) {
      const areTopLevelPresent =
        file.rootASTNode.children.filter((n) => n.type === 'FunctionDefinition')
          .length !== 0
      assert(!areTopLevelPresent, 'Function definitions are not supported')
    }

    return result
  }

  private resolveContractDeclarations(file: ParsedFile): ContractDeclaration[] {
    const contractDeclarations = file.rootASTNode.children.filter(
      (n) => n.type === 'ContractDefinition',
    )

    return contractDeclarations.map((c) => {
      assert(c.range !== undefined, 'Invalid contract definition')
      const declaration = c as ContractDefinition

      return {
        ast: declaration,
        name: declaration.name,
        type: declaration.kind as ContractType,
        inheritsFrom: declaration.baseContracts.map(
          (bc) => bc.baseName.namePath,
        ),
        referencedContracts: [],
        byteRange: {
          start: c.range[0],
          end: c.range[1],
        },
      }
    })
  }

  private resolveFileImports(
    file: ParsedFile,
    remappings: Remapping[],
    alreadyImportedObjects: Map<string, string[]>,
  ): ImportDirective[] {
    const importDirectives = file.rootASTNode.children.filter(
      (n) => n.type === 'ImportDirective',
    )

    return importDirectives.flatMap((i) => {
      assert(
        i.type === 'ImportDirective' && i.range !== undefined,
        'Invalid import directive',
      )

      const remappedPath = resolveImportRemappings(
        i.path,
        remappings,
        file.path,
      )
      const importedFile = this.resolveImportPath(file, remappedPath)

      let alreadyImported = alreadyImportedObjects.get(importedFile.path)
      if (alreadyImported !== undefined) {
        assert(
          alreadyImported.length <= importedFile.contractDeclarations.length,
          'Already imported more than there are contracts in the file',
        )
        const gotEverything =
          alreadyImported.length === importedFile.contractDeclarations.length
        if (gotEverything) {
          return []
        }
      }
      alreadyImported ??= []

      const result = []
      const importEverything = i.symbolAliases === null
      if (importEverything) {
        for (const contract of importedFile.contractDeclarations) {
          const object = {
            absolutePath: importedFile.path,
            originalName: contract.name,
            importedName: contract.name,
          }

          if (!alreadyImported.includes(object.originalName)) {
            result.push(object)
          }
        }

        alreadyImportedObjects.set(
          importedFile.path,
          importedFile.contractDeclarations.map((c) => c.name),
        )

        const recursiveResult = this.resolveFileImports(
          importedFile,
          remappings,
          alreadyImportedObjects,
        )
        return result.concat(recursiveResult)
      }

      assert(i.symbolAliases !== null, 'Invalid import directive')
      for (const alias of i.symbolAliases) {
        const object = {
          absolutePath: importedFile.path,
          originalName: alias[0],
          importedName: alias[1] ?? alias[0],
        }

        const isAlreadyImported = alreadyImported.includes(object.originalName)
        if (isAlreadyImported) {
          continue
        }

        const isDeclared = importedFile.contractDeclarations.some(
          (c) => c.name === object.originalName,
        )
        let isImported = false
        if (!isDeclared) {
          const recursiveResult = this.resolveFileImports(
            importedFile,
            remappings,
            alreadyImportedObjects,
          )

          isImported = recursiveResult.some(
            (id) => id.originalName === object.originalName,
          )
        }

        if (isDeclared || isImported) {
          alreadyImported.push(object.originalName)
          result.push(object)
        }
      }

      alreadyImportedObjects.set(importedFile.path, alreadyImported)

      return result
    })
  }

  private resolveReferencedLibraries(
    file: ParsedFile,
    c: ContractDefinition,
  ): string[] {
    const identifiers = new Set(
      c.subNodes.flatMap((n) => getASTIdentifiers(n)).map(extractNamespace),
    )

    const referenced = []
    for (const identifier of identifiers) {
      const result = this.tryFindContract(identifier, file)
      if (result !== undefined && result.contract.type === 'library') {
        referenced.push(identifier)
      }
    }

    return referenced
  }

  tryFindContract(
    contractName: string,
    file: ParsedFile,
  ): ContractFilePair | undefined {
    const matchingContract = findOne(
      file.contractDeclarations,
      (c) => c.name === contractName,
    )

    if (matchingContract !== undefined) {
      return {
        contract: matchingContract,
        file,
      }
    }

    const matchingImport = findOne(
      file.importDirectives,
      (c) => c.importedName === contractName,
    )

    if (matchingImport !== undefined) {
      return this.tryFindContract(
        matchingImport.originalName,
        this.resolveImportPath(file, matchingImport.absolutePath),
      )
    }

    return undefined
  }

  findFileDeclaringContract(contractName: string): ParsedFile {
    const matchingFile = findOne(this.files, (f) =>
      f.contractDeclarations.some((c) => c.name === contractName),
    )
    assert(
      matchingFile !== undefined,
      `Failed to find file declaring contract ${contractName}`,
    )

    return matchingFile
  }

  findContractDeclaration(
    contractName: string,
    file?: ParsedFile,
  ): ContractFilePair {
    file ??= this.findFileDeclaringContract(contractName)

    const matchingContract = findOne(
      file.contractDeclarations,
      (c) => c.name === contractName,
    )
    assert(matchingContract !== undefined, 'Contract not found')

    return {
      contract: matchingContract,
      file,
    }
  }

  private resolveImportPath(
    fromFile: ParsedFile,
    importPath: string,
  ): ParsedFile {
    const resolvedPath =
      importPath.startsWith('./') || importPath.startsWith('../')
        ? posix.join(posix.dirname(fromFile.path), importPath)
        : importPath

    const matchingFile = findOne(
      this.files,
      (f) => posix.normalize(f.path) === posix.normalize(resolvedPath),
    )
    assert(
      matchingFile !== undefined,
      `File [${fromFile.path}][${resolvedPath}] not found`,
    )

    return matchingFile
  }
}

// Takes a user defined type name such as `MyLibrary.MyStructInLibrary` and
// returns only the namespace - the part before the dot.
function extractNamespace(identifier: string): string {
  const dotIndex = identifier.indexOf('.')
  if (dotIndex === -1) {
    return identifier
  }
  return identifier.substring(0, dotIndex)
}

function decodeRemappings(remappingStrings: string[]): Remapping[] {
  return remappingStrings.map((r) => {
    assert(r.includes('='), 'Invalid remapping, lacking "=" sign.')

    const [contextPrefix, target] = r.split('=')
    assert(contextPrefix !== undefined, 'Invalid remapping, missing prefix.')

    let context = undefined
    let prefix: string | undefined = contextPrefix
    if (contextPrefix.includes(':')) {
      ;[context, prefix] = contextPrefix.split(':')
    }
    context ??= ''

    assert(prefix !== undefined, 'Invalid remapping, missing prefix.')
    assert(target !== undefined, 'Invalid remapping, missing target.')
    return { context, prefix, target }
  })
}

function resolveRemappings(path: string, remappings: Remapping[]): string {
  const matchingRemappings = remappings.filter((r) => path.startsWith(r.prefix))
  if (matchingRemappings.length > 0) {
    const longest = matchingRemappings.reduce((a, b) =>
      a.prefix.length > b.prefix.length ? a : b,
    )

    const result = posix.join(longest.target, path.slice(longest.prefix.length))
    return result
  }

  return path
}

function resolveImportRemappings(
  path: string,
  remappings: Remapping[],
  context: string,
): string {
  let longestPrefix = 0
  let longestContext = 0
  let longest: Remapping | undefined = undefined

  for (const remapping of remappings) {
    const isSmallerContext = remapping.context.length < longestContext
    if (isSmallerContext) {
      continue
    }
    const isContextPrefix = context.startsWith(remapping.context)
    if (!isContextPrefix) {
      continue
    }
    const isSmallerPrefix =
      remapping.prefix.length < longestPrefix &&
      remapping.context.length === longestContext
    if (isSmallerPrefix) {
      continue
    }
    const isPrefixMatch = path.startsWith(remapping.prefix)
    if (!isPrefixMatch) {
      continue
    }

    longestContext = remapping.context.length
    longestPrefix = remapping.prefix.length
    longest = remapping
  }

  if (longest === undefined) {
    return path
  }

  const result = posix.join(longest.target, path.slice(longest.prefix.length))
  return result
}

function findOne<T>(
  array: T[],
  predicate: (item: T) => boolean,
): T | undefined {
  const matching = array.filter(predicate)

  if (matching.length === 1 && matching[0] !== undefined) {
    return matching[0]
  }

  return undefined
}
