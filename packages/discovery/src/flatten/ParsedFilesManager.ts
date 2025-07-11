import { assert } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import { parse } from '@mradomski/fast-solidity-parser'
import * as posix from 'path'
import { getASTIdentifiers } from './getASTIdentifiers'
import type { FlattenOptions } from './types'

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
  content: string

  inheritsFrom: string[]
  dynamicReferences: string[]
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
  private options: FlattenOptions = {}

  static parseFiles(
    files: FileContent[],
    remappingStrings: string[],
    options?: FlattenOptions,
  ): ParsedFilesManager {
    const result = new ParsedFilesManager()
    result.options = options ?? result.options

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
        file.normalizedPath,
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
        declaration.dynamicReferences = result.resolveDynamicReferences(
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

      const inheritsFrom = []
      if (d.type === 'ContractDefinition') {
        inheritsFrom.push(
          ...d.baseContracts.map((c) => {
            // biome-ignore lint/style/noNonNullAssertion: we know it's there
            return c.baseName.namePath.split('.').at(-1)!
          }),
        )
      }

      return {
        ast: d,
        name: d.name ?? '',
        type: getDeclarationType(d),
        inheritsFrom,
        dynamicReferences: [],
        byteRange: {
          start: d.range[0],
          end: d.range[1],
        },
        content: file.content.slice(d.range[0], d.range[1] + 1),
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

      const resolvedPath = this.resolveImportPath(i.path, file, remappings)
      const importedFile = this.resolveImport(file, resolvedPath)

      let alreadyImported = alreadyImportedObjects.get(
        importedFile.normalizedPath,
      )
      if (alreadyImported !== undefined) {
        let gotEverything = true
        for (const declaration of importedFile.topLevelDeclarations) {
          gotEverything &&= alreadyImported.includes(declaration.name)
        }

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
            absolutePath: importedFile.normalizedPath,
            originalName: declaration.name,
            importedName: declaration.name,
          }

          if (!alreadyImported.includes(object.originalName)) {
            result.push(object)
          }
        }

        alreadyImportedObjects.set(
          importedFile.normalizedPath,
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
          absolutePath: importedFile.normalizedPath,
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

      alreadyImportedObjects.set(importedFile.normalizedPath, alreadyImported)

      return result
    })
  }

  private resolveDynamicReferences(file: ParsedFile, c: AST.ASTNode): string[] {
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
      if (result === undefined) {
        continue
      }

      const isContract = result.declaration.type === 'contract'
      const isAbstract = result.declaration.type === 'abstract'
      const isInterface = result.declaration.type === 'interface'

      if (
        (isInterface || isContract || isAbstract) &&
        this.options.includeAll !== true
      ) {
        continue
      }

      referenced.push(identifier)
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
        this.resolveImport(file, matchingImport.absolutePath),
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

  findFileRootDeclaring(declarationName: string): ParsedFile {
    const matchingFile = findOne(this.files, (f) =>
      f.topLevelDeclarations.some(
        (c) =>
          c.name === declarationName &&
          (c.type === 'library' || c.type === 'contract'),
      ),
    )
    assert(
      matchingFile !== undefined,
      `Failed to find file declaring ${declarationName}`,
    )

    return matchingFile
  }

  findRootDeclaration(declarationName: string): DeclarationFilePair {
    const file = this.findFileRootDeclaring(declarationName)

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
    path: string,
    fromFile: ParsedFile,
    remappings: Remapping[],
  ): string {
    const directPath = solcAbsolutePath(path, fromFile.normalizedPath)
    const remappedPath = resolveImportRemappings(
      directPath,
      remappings,
      fromFile.normalizedPath,
    )

    const normalizedPath = posix.normalize(remappedPath)
    return normalizedPath
  }

  private resolveImport(fromFile: ParsedFile, importPath: string): ParsedFile {
    const matchingFile = findOne(
      this.files,
      (f) => f.normalizedPath === importPath,
    )

    assert(
      matchingFile !== undefined,
      `File [${fromFile.normalizedPath}][${importPath}] not found`,
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

function solcAbsolutePath(path: string, context: string): string {
  if (!path.startsWith('./') && !path.startsWith('../')) {
    return path
  }

  let result = posix.normalize(context)

  if (result !== '/' && posix.basename(result) !== '') {
    result = posix.dirname(result)
  }

  const segments = path.split('/')
  for (const segment of segments) {
    if (segment === '..') {
      result = posix.dirname(result)
    } else if (segment !== '.') {
      result = posix.join(result, segment)
    }
  }

  return posix.normalize(result)
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
