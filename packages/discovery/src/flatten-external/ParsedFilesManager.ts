import { assert, unique } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import { parse } from '@mradomski/fast-solidity-parser'
import { createHash } from 'crypto'
import * as posix from 'path'
import { findLeadingCommentStart } from './commentUtilities'
import { getASTIdentifiers } from './getASTIdentifiers'
import type { FlattenOptions } from './types'

type ParseResult = ReturnType<typeof parse>

export interface ByteRange {
  start: number
  end: number
}

export type DeclarationType =
  | 'contract'
  | 'interface'
  | 'library'
  | 'abstract'
  | 'struct'
  | 'function'
  | 'typedef'
  | 'enum'
  | 'constant'
  | 'event'
  | 'error'
  | 'using'

type TopLevelDeclarationNode =
  | AST.StructDefinition
  | AST.EnumDefinition
  | AST.FunctionDefinition
  | AST.TypeDefinition
  | AST.ContractDefinition
  | AST.FileLevelConstant
  | AST.EventDefinition
  | AST.CustomErrorDefinition
  | AST.UsingForDeclaration

export interface TopLevelDeclaration {
  name: string
  type: DeclarationType

  ast: AST.ASTNode
  content: string
  id: string

  implementationReferences: string[]
  signatureReferences: string[]
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

const extendedDeclaration = new Set([
  'contract',
  'abstract',
  'interface',
  'event',
  'error',
  'constant',
])

export class ParsedFilesManager {
  private files: ParsedFile[] = []
  private options: FlattenOptions = {}
  private remappings: Remapping[] = []

  static parseFiles(
    files: FileContent[],
    remappingStrings: string[],
    options?: FlattenOptions,
  ): ParsedFilesManager {
    const result = new ParsedFilesManager()
    result.options = options ?? result.options

    result.remappings = decodeRemappings(remappingStrings)
    result.files = files.map(({ path, content }) => {
      const remappedPath = result.resolveRemappings(path)
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
      const alreadyImportedMap = new Map<string, string[]>()
      alreadyImportedMap.set(
        file.normalizedPath,
        file.topLevelDeclarations.map((c) => c.name),
      )

      file.importDirectives = result.resolveFileImports(
        file,
        result.remappings,
        alreadyImportedMap,
      )
    }

    // Pass 3: Resolve all references to other contracts
    for (const file of result.files) {
      for (const declaration of file.topLevelDeclarations) {
        const { signatureReferences, implementationReferences, backwardLinks } =
          result.resolveReferences(file, declaration.ast)

        declaration.signatureReferences.push(...signatureReferences)
        declaration.implementationReferences.push(...implementationReferences)
        for (const backwardLink of backwardLinks) {
          const decl = result.tryFindDeclaration(backwardLink, file)
          decl?.declaration.signatureReferences.push(declaration.name)
        }
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
        n.type === 'EnumDefinition' ||
        n.type === 'FileLevelConstant' ||
        n.type === 'EventDefinition' ||
        n.type === 'CustomErrorDefinition' ||
        n.type === 'UsingForDeclaration',
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
        case 'FileLevelConstant':
          return 'constant'
        case 'EventDefinition':
          return 'event'
        case 'CustomErrorDefinition':
          return 'error'
        case 'UsingForDeclaration':
          return 'using'
      }
    }

    let unnamedIndex = 0
    const declarations = declarationNodes.map((d) => {
      assert(d.range !== undefined, 'Invalid contract definition')

      const implementationReferences = []
      if (d.type === 'ContractDefinition') {
        implementationReferences.push(
          ...d.baseContracts.map((c) => {
            // biome-ignore lint/style/noNonNullAssertion: we know it's there
            return c.baseName.namePath.split('.').at(-1)!
          }),
        )
      }

      // When includeAll is true, extend start backwards to include leading comments
      const adjustedStart =
        this.options.includeAll === true
          ? findLeadingCommentStart(file.content, d.range[0])
          : d.range[0]

      const content = file.content.slice(adjustedStart, d.range[1] + 1)
      return {
        ast: d,
        name: 'name' in d ? (d.name ?? '') : `$${unnamedIndex++}`,
        type: getDeclarationType(d),
        implementationReferences,
        signatureReferences: [],
        content,
        id: sha1(content),
      } satisfies TopLevelDeclaration
    })

    return declarations
  }

  private resolveFileImports(
    file: ParsedFile,
    remappings: Remapping[],
    alreadyImportedMap: Map<string, string[]>,
  ): ImportDirective[] {
    const importDirectives = file.rootASTNode.children.filter(
      (n) => n.type === 'ImportDirective',
    )

    return importDirectives.flatMap((i) => {
      assert(
        i.type === 'ImportDirective' && i.range !== undefined,
        'Invalid import directive',
      )
      const { path, symbolAliases } = i

      const resolvedPath = this.resolveImportPath(path, file, remappings)
      const importedFile = this.resolveImport(file, resolvedPath)
      const { topLevelDeclarations, normalizedPath } = importedFile

      const alreadyImported = alreadyImportedMap.get(normalizedPath) ?? []

      const gotEverything =
        alreadyImported.length > 0 &&
        topLevelDeclarations.every(({ name }) => alreadyImported.includes(name))

      if (gotEverything) {
        return []
      }

      const importEverything = symbolAliases === null
      const topLevelImports = (
        importEverything
          ? topLevelDeclarations.map((e) => ({
              absolutePath: normalizedPath,
              originalName: e.name,
              importedName: e.name,
            }))
          : symbolAliases.map(([name, as]) => ({
              absolutePath: normalizedPath,
              originalName: name,
              importedName: as ?? name,
            }))
      ).filter(({ originalName }) => !alreadyImported.includes(originalName))

      alreadyImported.push(...topLevelImports.map((e) => e.originalName))
      alreadyImportedMap.set(importedFile.normalizedPath, alreadyImported)

      const transitive = importEverything
        ? this.resolveFileImports(importedFile, remappings, alreadyImportedMap)
        : []
      return [...transitive, ...topLevelImports]
    })
  }

  private resolveReferences(
    file: ParsedFile,
    c: AST.ASTNode,
  ): {
    signatureReferences: string[]
    implementationReferences: string[]
    backwardLinks: string[]
  } {
    let subNodes: AST.BaseASTNode[] = []
    let backwardLinks: string[] = []
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
    } else if (c.type === 'FileLevelConstant') {
      subNodes = [c.typeName, c.initialValue]
    } else if (c.type === 'EventDefinition') {
      subNodes = c.parameters ?? []
    } else if (c.type === 'CustomErrorDefinition') {
      subNodes = c.parameters ?? []
    } else if (c.type === 'UsingForDeclaration') {
      subNodes = [c]
      const [typeName, ...rest] = getASTIdentifiers(c.typeName)
      if (typeName !== undefined && rest.length === 0) {
        backwardLinks = [typeName]
      }
    } else {
      throw new Error('Invalid node type')
    }

    const implementationReferences: string[] = []
    const allIdentifiers: string[] = []

    for (const node of subNodes) {
      const ids = getASTIdentifiers(node, (n, i) => {
        // NOTE(radomski): You can only _new_ arrays or contracts.
        //
        // - new [], creates an array and uses the signature but not the implementation
        // - new Ident, creates a new contract and Ident has to be a contract
        //
        // We only care about contracts here, so it's fine to drop all arrays
        if (
          n.type === 'NewExpression' &&
          (n as AST.NewExpression).typeName.type !== 'ArrayTypeName'
        ) {
          implementationReferences.push(...i)
        }
      })
      allIdentifiers.push(...ids)
    }

    const identifiers = unique(
      allIdentifiers.map((i) => i.split('.')[0] as string),
    )

    const signatureReferences = identifiers.filter((identifier) => {
      const type = this.tryFindDeclaration(identifier, file)?.declaration.type
      return (
        type !== undefined &&
        (this.options.includeAll || !extendedDeclaration.has(type))
      )
    })

    return { signatureReferences, implementationReferences, backwardLinks }
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

  findDeclarationAt(
    declarationName: string,
    path?: string,
  ): DeclarationFilePair {
    const file = path
      ? this.findFile(path)
      : this.findFileRootDeclaring(declarationName)

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

  private findFile(rawPath: string): ParsedFile {
    const path = this.resolveRemappings(rawPath)
    const matchingFile = findOne(this.files, (f) => f.path === path)
    assert(matchingFile !== undefined, `Failed to find the root file ${path}`)
    return matchingFile
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

  private resolveRemappings(path: string): string {
    const matchingRemappings = this.remappings
      .filter((r) => path.startsWith(r.prefix))
      .filter((r) => r.context.length === 0)

    if (matchingRemappings.length > 0) {
      const longest = matchingRemappings.reduce((a, b) =>
        a.prefix.length > b.prefix.length ? a : b,
      )

      const result = posix.join(
        longest.target,
        path.slice(longest.prefix.length),
      )
      return result
    }

    return path
  }
}

function sha1(s: string): string {
  const hasher = createHash('sha1')
  hasher.update(s)
  return `0x${hasher.digest('hex')}`
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
