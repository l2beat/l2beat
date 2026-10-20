import { fileURLToPath, pathToFileURL } from 'url'
import type { FlatWorkspace } from '../FlatWorkspace'
import { findReferences } from '../findReferences'
import {
  type Definition,
  type DefinitionResult,
  describeAddress,
  resolveDefinition,
} from '../resolveDefinition'
import type { TextPosition } from '../SourceIndex'

export interface RpcMessage {
  jsonrpc: '2.0'
  id?: number | string | null
  method?: string
  params?: unknown
}

interface TextDocumentPositionParams {
  textDocument: { uri: string }
  position: { line: number; character: number }
}

interface ReferenceParams extends TextDocumentPositionParams {
  context?: { includeDeclaration?: boolean }
}

interface LspLocation {
  uri: string
  range: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }
}

const METHOD_NOT_FOUND = -32601
const PARSE_ERROR = -32700
const INTERNAL_ERROR = -32603

const RESOLUTION_LABELS: Record<Definition['resolution'], string> = {
  'discovered-value': 'from discovered.json',
  'abi-match': 'matched by ABI',
  'in-file': 'in this file',
}

class RpcError extends Error {
  constructor(
    readonly code: number,
    message: string,
  ) {
    super(message)
  }
}

// Answers definition and hover for .flat files. Flats are generated and never
// edited, so the server reads them from disk instead of syncing documents.
export class XrefLanguageServer {
  private shutdownRequested = false

  constructor(
    private readonly workspaceFor: (path: string) => FlatWorkspace | undefined,
    private readonly send: (
      message: RpcMessage & Record<string, unknown>,
    ) => void,
    private readonly exit: (code: number) => void,
  ) {}

  receive(body: string) {
    let message: RpcMessage
    try {
      message = JSON.parse(body) as RpcMessage
    } catch {
      this.reply(null, undefined, new RpcError(PARSE_ERROR, 'Parse error'))
      return
    }
    if (message.method === 'exit') {
      this.exit(this.shutdownRequested ? 0 : 1)
      return
    }
    if (message.id === undefined || message.method === undefined) {
      return
    }
    try {
      this.reply(message.id, this.dispatch(message.method, message.params))
    } catch (error) {
      const failure =
        error instanceof RpcError
          ? error
          : new RpcError(INTERNAL_ERROR, 'Request failed')
      if (!(error instanceof RpcError)) {
        console.error(error)
      }
      this.reply(message.id, undefined, failure)
    }
  }

  private dispatch(method: string, params: unknown): unknown {
    switch (method) {
      case 'initialize':
        return {
          capabilities: {
            positionEncoding: 'utf-16',
            definitionProvider: true,
            hoverProvider: true,
            referencesProvider: true,
          },
          serverInfo: { name: 'l2b-xref' },
        }
      case 'shutdown':
        this.shutdownRequested = true
        return null
      case 'textDocument/definition':
        return this.definition(params as TextDocumentPositionParams)
      case 'textDocument/hover':
        return this.hover(params as TextDocumentPositionParams)
      case 'textDocument/references':
        return this.references(params as ReferenceParams)
      default:
        throw new RpcError(METHOD_NOT_FOUND, 'Method not found')
    }
  }

  private definition(params: TextDocumentPositionParams): LspLocation[] {
    const resolved = this.resolve(params)
    return resolved?.result.definitions.map(toLocation) ?? []
  }

  private hover(params: TextDocumentPositionParams) {
    const resolved = this.resolve(params)
    if (resolved === undefined || resolved.result.symbol === '') {
      return null
    }
    return {
      contents: {
        kind: 'markdown',
        value: describe(resolved.workspace, resolved.result),
      },
    }
  }

  // Identical copies of a file are listed too: each is a file someone may
  // have open.
  private references(params: ReferenceParams): LspLocation[] {
    const located = this.locate(params)
    if (located === undefined) {
      return []
    }
    const { workspace, path, offset } = located
    const result = findReferences(workspace, path, offset)
    const declarations = params.context?.includeDeclaration
      ? result.targets.flatMap((t) => declarationLocations(workspace, t))
      : []
    const references = result.references.flatMap((reference) =>
      [reference.path, ...reference.copies].map((copy) =>
        rangeAt(copy, reference.position, reference.length),
      ),
    )
    return [...declarations, ...references]
  }

  private resolve(params: TextDocumentPositionParams) {
    const located = this.locate(params)
    if (located === undefined) {
      return undefined
    }
    const { workspace, path, offset } = located
    return { workspace, result: resolveDefinition(workspace, path, offset) }
  }

  private locate(params: TextDocumentPositionParams) {
    const path = fileURLToPath(params.textDocument.uri)
    const workspace = this.workspaceFor(path)
    if (workspace === undefined || !workspace.entryOfPath(path)) {
      return undefined
    }
    const { line, character } = params.position
    const offset = workspace
      .source(path)
      .offsetOf({ line: line + 1, column: character + 1 })
    return { workspace, path, offset }
  }

  private reply(id: RpcMessage['id'], result: unknown, error?: RpcError) {
    if (error !== undefined) {
      this.send({
        jsonrpc: '2.0',
        id: id ?? null,
        error: { code: error.code, message: error.message },
      })
      return
    }
    this.send({ jsonrpc: '2.0', id: id ?? null, result: result ?? null })
  }
}

// A declaration folded from identical copies sits at the same spot in each.
function declarationLocations(
  workspace: FlatWorkspace,
  target: Definition,
): LspLocation[] {
  const start = target.declaration.range?.[0] ?? 0
  const nameOffset = workspace.source(target.path).offsetOf(target.position)
  const length = target.label.length - target.label.lastIndexOf('.') - 1
  const copies = target.copies.map((copy) => {
    const position = workspace
      .source(copy.path)
      .positionOf(copy.start + nameOffset - start)
    return rangeAt(copy.path, position, length)
  })
  return [toLocation(target), ...copies]
}

function toLocation(definition: Definition): LspLocation {
  const nameLength =
    definition.label.length - definition.label.lastIndexOf('.') - 1
  return rangeAt(definition.path, definition.position, nameLength)
}

function rangeAt(
  path: string,
  position: TextPosition,
  length: number,
): LspLocation {
  const { line, column } = position
  return {
    uri: pathToFileURL(path).toString(),
    range: {
      start: { line: line - 1, character: column - 1 },
      end: { line: line - 1, character: column - 1 + length },
    },
  }
}

function describe(workspace: FlatWorkspace, result: DefinitionResult): string {
  const lines = [`**${result.symbol}**`]
  const address = result.receiver?.address
  if (address !== undefined) {
    lines.push('', `receiver: ${describeAddress(workspace, address)}`)
  }
  if (result.definitions.length === 0) {
    lines.push('', 'No definition found.')
  }
  for (const definition of result.definitions) {
    const [owner, ...others] = definition.entries
    const where = owner ? ` in ${owner.name}` : ''
    const more = others.length > 0 ? ` (+${others.length} with this code)` : ''
    lines.push(
      `- ${definition.label}${where}, ${RESOLUTION_LABELS[definition.resolution]}${more}`,
    )
  }
  return lines.join('\n')
}
