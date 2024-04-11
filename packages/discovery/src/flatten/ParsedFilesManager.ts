import { assert } from '@l2beat/backend-tools'
import type * as AST from '@mradomski/fast-solidity-parser'
import { parse } from '@mradomski/fast-solidity-parser'
import * as posix from 'path'

import { getASTIdentifiers } from './getASTIdentifiers'

type ParseResult = ReturnType<typeof parse>

export interface ByteRange {
  start: number
  end: number
}

type DeclarationType =
  | 'contract'
  | 'interface'
  | 'library'
  | 'abstract'
  | 'struct'
  | 'function'
  | 'typedef'
  | 'enum'

type TopLevelDeclarationNode =
  | AST.StructDefinition
  | AST.EnumDefinition
  | AST.FunctionDefinition
  | AST.TypeDefinition
  | AST.ContractDefinition

export interface TopLevelDeclaration {
  name: string
  type: DeclarationType

  ast: AST.ASTNode
  byteRange: ByteRange

  inheritsFrom: string[]
  referencedDeclaration: string[]
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
  normalizedPath: string
  rootASTNode: ParseResult

  topLevelDeclarations: TopLevelDeclaration[]
  importDirectives: ImportDirective[]
}

export interface DeclarationFilePair {
  declaration: TopLevelDeclaration
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

    result.files = files.map(({ path, content }) => {
      const remappedPath = resolveRemappings(path, remappings)
      return {
        path: remappedPath,
        normalizedPath: posix.normalize(remappedPath),
        content,
        rootASTNode: parse(content, { range: true }),
        topLevelDeclarations: [],
        importDirectives: [],
      }
    })

    // Pass 1: Find all contract declarations
    for (const file of result.files) {
      file.topLevelDeclarations = result.resolveTopLevelDeclarations(file)
    }

    // Pass 2: Resolve all imports
    for (const file of result.files) {
      const alreadyImportedObjects = new Map<string, string[]>()
      alreadyImportedObjects.set(
        file.path,
        file.topLevelDeclarations.map((c) => c.name),
      )

      file.importDirectives = result.resolveFileImports(
        file,
        remappings,
        alreadyImportedObjects,
      )
    }

    // Pass 3: Resolve all references to other contracts
    for (const file of result.files) {
      for (const declaration of file.topLevelDeclarations) {
        declaration.referencedDeclaration = result.resolveReferencedLibraries(
          file,
          declaration.ast,
        )
      }
    }

    return result
  }

  private resolveTopLevelDeclarations(file: ParsedFile): TopLevelDeclaration[] {
    const declarationNodes = file.rootASTNode.children.filter(
      (n): n is TopLevelDeclarationNode =>
        n.type === 'ContractDefinition' ||
        n.type === 'StructDefinition' ||
        n.type === 'FunctionDefinition' ||
        n.type === 'TypeDefinition' ||
        n.type === 'EnumDefinition',
    )

    const getDeclarationType = (
      n: TopLevelDeclarationNode,
    ): DeclarationType => {
      switch (n.type) {
        case 'ContractDefinition':
          return n.kind as DeclarationType
        case 'StructDefinition':
          return 'struct'
        case 'FunctionDefinition':
          return 'function'
        case 'TypeDefinition':
          return 'typedef'
        case 'EnumDefinition':
          return 'enum'
      }
    }

    const declarations = declarationNodes.map((d) => {
      assert(d.range !== undefined, 'Invalid contract definition')

      return {
        ast: d,
        name: d.name ?? '',
        type: getDeclarationType(d),
        inheritsFrom:
          d.type === 'ContractDefinition'
            ? d.baseContracts.map((c) => c.baseName.namePath)
            : [],
        referencedDeclaration: [],
        byteRange: {
          start: d.range[0],
          end: d.range[1],
        },
      }
    })

    return declarations
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
        const gotEverything =
          alreadyImported.length >= importedFile.topLevelDeclarations.length
        if (gotEverything) {
          return []
        }
      }
      alreadyImported ??= []

      const result = []
      const importEverything = i.symbolAliases === null
      if (importEverything) {
        for (const declaration of importedFile.topLevelDeclarations) {
          const object = {
            absolutePath: importedFile.path,
            originalName: declaration.name,
            importedName: declaration.name,
          }

          if (!alreadyImported.includes(object.originalName)) {
            result.push(object)
          }
        }

        alreadyImportedObjects.set(
          importedFile.path,
          importedFile.topLevelDeclarations.map((c) => c.name),
        )

        const recursiveResult = this.resolveFileImports(
          importedFile,
          remappings,
          alreadyImportedObjects,
        )

        const filteredRecursiveResult = recursiveResult.filter(
          (r) => alreadyImported?.includes(r.originalName) === false,
        )
        return result.concat(filteredRecursiveResult)
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

        const isDeclared = importedFile.topLevelDeclarations.some(
          (c) => c.name === object.originalName,
        )
        let isImported = false
        if (!isDeclared) {
          const copiedAlreadyImportedMap = structuredClone(
            alreadyImportedObjects,
          )
          const recursiveResult = this.resolveFileImports(
            importedFile,
            remappings,
            copiedAlreadyImportedMap,
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
    c: AST.ASTNode,
  ): string[] {
    let subNodes: AST.BaseASTNode[] = []
    if (c.type === 'ContractDefinition') {
      subNodes = c.subNodes
    } else if (c.type === 'StructDefinition') {
      subNodes = c.members
    } else if (c.type === 'FunctionDefinition') {
      subNodes = c.body ? [c.body] : []
    } else if (c.type === 'TypeDefinition') {
      subNodes = []
    } else if (c.type === 'EnumDefinition') {
      subNodes = c.members
    } else {
      throw new Error('Invalid node type')
    }

    const identifiers = new Set(
      subNodes.flatMap((n) => getASTIdentifiers(n)).map(extractNamespace),
    )

    const referenced = []
    for (const identifier of identifiers) {
      const result = this.tryFindDeclaration(identifier, file)
      const isLibrary =
        result !== undefined && result.declaration.type === 'library'
      const isStruct =
        result !== undefined && result.declaration.type === 'struct'
      const isFunction =
        result !== undefined && result.declaration.type === 'function'
      const isTypedef =
        result !== undefined && result.declaration.type === 'typedef'
      const isEnum = result !== undefined && result.declaration.type === 'enum'
      if (
        result !== undefined &&
        (isLibrary || isStruct || isFunction || isTypedef || isEnum)
      ) {
        referenced.push(identifier)
      }
    }

    return referenced
  }

  tryFindDeclaration(
    declarationName: string,
    file: ParsedFile,
  ): DeclarationFilePair | undefined {
    const matchingDeclaration = findOne(
      file.topLevelDeclarations,
      (c) => c.name === declarationName,
    )

    if (matchingDeclaration !== undefined) {
      return {
        declaration: matchingDeclaration,
        file,
      }
    }

    const matchingImport = findOne(
      file.importDirectives,
      (c) => c.importedName === declarationName,
    )

    if (matchingImport !== undefined) {
      return this.tryFindDeclaration(
        matchingImport.originalName,
        this.resolveImportPath(file, matchingImport.absolutePath),
      )
    }

    return undefined
  }

  findFileDeclaring(declarationName: string): ParsedFile {
    const matchingFile = findOne(this.files, (f) =>
      f.topLevelDeclarations.some((c) => c.name === declarationName),
    )
    assert(
      matchingFile !== undefined,
      `Failed to find file declaring ${declarationName}`,
    )

    return matchingFile
  }

  findDeclaration(
    declarationName: string,
    file?: ParsedFile,
  ): DeclarationFilePair {
    file ??= this.findFileDeclaring(declarationName)

    const matchingDeclaration = findOne(
      file.topLevelDeclarations,
      (c) => c.name === declarationName,
    )
    assert(matchingDeclaration !== undefined, 'Declaration not found')

    return {
      declaration: matchingDeclaration,
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

    const normalizedPath = posix.normalize(resolvedPath)
    const matchingFile = findOne(
      this.files,
      (f) => f.normalizedPath === normalizedPath,
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
