import {
  autocompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
  closeBrackets,
  closeBracketsKeymap,
  snippet,
} from '@codemirror/autocomplete'
import { indentWithTab } from '@codemirror/commands'
import { foldService, indentOnInput } from '@codemirror/language'
import { type Diagnostic, forceLinting, linter } from '@codemirror/lint'
import type { EditorState, Extension, Text } from '@codemirror/state'
import { EditorView, hoverTooltip, keymap, ViewPlugin } from '@codemirror/view'
import MarkdownIt from 'markdown-it'
import {
  type CompletionItem,
  CompletionItemKind,
  DiagnosticSeverity,
  getLanguageService,
  type Hover,
  InsertTextFormat,
  type JSONDocument,
  type JSONSchema,
  type Diagnostic as JsonDiagnostic,
  type MarkedString,
  type MarkupContent,
  type SchemaConfiguration,
  TextDocument,
} from 'vscode-json-languageservice'
import * as configSchema from '../../../../../discovery/schemas/config.v2.schema.json'
import * as contractSchema from '../../../../../discovery/schemas/contract.v2.schema.json'
import { jsonSyntax } from './jsonSyntax'

export interface JsonSchemaConfig {
  uri: string
  fileMatch?: string[]
  schema?: unknown
}

// What an editor needs to edit JSON. It is its own module, loaded only with
// the JSON panels, because the language service is a large part of it.
export interface JsonSupport {
  extension(documentUri: string): Extension
  upsertSchema(config: JsonSchemaConfig): void
  removeSchema(uri: string): void
}

const SCHEMA_ROOT = 'inmemory:/'
const LINT_DELAY_MS = 500

// Files point at these with a relative `$schema`, which resolves from the
// root, so any depth of `../` lands on the same schema. Files without one
// match by name.
const BASE_SCHEMAS: SchemaConfiguration[] = [
  {
    uri: `${SCHEMA_ROOT}discovery/schemas/contract.v2.schema.json`,
    fileMatch: ['template.jsonc'],
    schema: bundledSchema(contractSchema),
  },
  {
    uri: `${SCHEMA_ROOT}discovery/schemas/config.v2.schema.json`,
    fileMatch: ['config.jsonc'],
    schema: bundledSchema(configSchema),
  },
]

// Without `required`, like the Monaco setup this replaced, so a partial file
// is not an error.
function bundledSchema(file: {
  $schema: string
  properties: object
  type: string
}): JSONSchema {
  return {
    $schema: file.$schema,
    properties: file.properties as JSONSchema['properties'],
    type: file.type,
  }
}

const languageService = getLanguageService({
  schemaRequestService: requestSchema,
  workspaceContext: { resolveRelativePath: resolveFromRoot },
})
let schemas: SchemaConfiguration[] = []
const jsonViews = new Set<EditorView>()
const markdown = new MarkdownIt({ html: false, linkify: false })

configureSchemas([])

export const json: JsonSupport = {
  extension: (documentUri) => [
    jsonSyntax,
    closeBrackets(),
    indentOnInput(),
    keymap.of([...closeBracketsKeymap, indentWithTab]),
    foldService.of(foldJson),
    linter((view) => validate(view.state, documentUri), {
      delay: LINT_DELAY_MS,
    }),
    autocompletion({
      override: [(context) => complete(context, documentUri)],
    }),
    hoverTooltip((view, position) => hover(view, position, documentUri)),
    trackJsonView,
    hoverTheme,
  ],
  // A handler without a schema validates as plain JSON.
  upsertSchema(config) {
    const others = withoutSchema(config.uri)
    configureSchemas(
      config.schema === undefined
        ? others
        : [...others, { ...config, schema: config.schema as JSONSchema }],
    )
  },
  removeSchema(uri) {
    configureSchemas(withoutSchema(uri))
  },
}

function withoutSchema(uri: string): SchemaConfiguration[] {
  return schemas.filter(
    (schema) => schema.uri !== uri && !BASE_SCHEMAS.includes(schema),
  )
}

// Schemas are global, like Monaco's, so every open JSON editor revalidates.
function configureSchemas(extraSchemas: SchemaConfiguration[]) {
  schemas = [...BASE_SCHEMAS, ...extraSchemas]
  languageService.configure({ validate: true, allowComments: true, schemas })
  for (const view of jsonViews) {
    forceLinting(view)
  }
}

const trackJsonView = ViewPlugin.define((view) => {
  jsonViews.add(view)
  return { destroy: () => jsonViews.delete(view) }
})

function requestSchema(uri: string): Promise<string> {
  const known = schemas.find((schema) => schema.uri === uri)
  if (known?.schema === undefined) {
    return Promise.reject(new Error('Unknown schema'))
  }
  return Promise.resolve(JSON.stringify(known.schema))
}

function resolveFromRoot(relativePath: string): string {
  let path = relativePath
  while (path.startsWith('../') || path.startsWith('./')) {
    path = path.slice(path.indexOf('/') + 1)
  }
  return `${SCHEMA_ROOT}${path}`
}

interface ParsedDocument {
  text: TextDocument
  json: JSONDocument
}

// Lint, completion, hover and folding all read the same document version.
const parsedDocuments = new WeakMap<Text, ParsedDocument>()

function parse(doc: Text, documentUri: string): ParsedDocument {
  let parsed = parsedDocuments.get(doc)
  if (parsed === undefined) {
    const text = TextDocument.create(documentUri, 'json', 0, doc.toString())
    parsed = { text, json: languageService.parseJSONDocument(text) }
    parsedDocuments.set(doc, parsed)
  }
  return parsed
}

async function validate(
  state: EditorState,
  documentUri: string,
): Promise<Diagnostic[]> {
  const parsed = parse(state.doc, documentUri)
  const found = await languageService.doValidation(parsed.text, parsed.json, {
    comments: 'ignore',
    trailingCommas: 'error',
    schemaValidation: 'error',
    schemaRequest: 'warning',
  })
  return found.map((diagnostic) => toDiagnostic(diagnostic, parsed.text))
}

function toDiagnostic(
  diagnostic: JsonDiagnostic,
  text: TextDocument,
): Diagnostic {
  return {
    from: text.offsetAt(diagnostic.range.start),
    to: text.offsetAt(diagnostic.range.end),
    severity: toSeverity(diagnostic.severity),
    message:
      typeof diagnostic.message === 'string'
        ? diagnostic.message
        : diagnostic.message.value,
  }
}

function toSeverity(
  severity: DiagnosticSeverity | undefined,
): Diagnostic['severity'] {
  if (severity === DiagnosticSeverity.Warning) {
    return 'warning'
  }
  if (
    severity === DiagnosticSeverity.Information ||
    severity === DiagnosticSeverity.Hint
  ) {
    return 'info'
  }
  return 'error'
}

// Like Monaco, suggestions open by themselves only on the characters that
// start a key or a value; anywhere else they wait for Ctrl+Space.
async function complete(
  context: CompletionContext,
  documentUri: string,
): Promise<CompletionResult | null> {
  const typed = context.state.sliceDoc(context.pos - 1, context.pos)
  if (!context.explicit && typed !== '"' && typed !== ':') {
    return null
  }
  const parsed = parse(context.state.doc, documentUri)
  const list = await languageService.doComplete(
    parsed.text,
    parsed.text.positionAt(context.pos),
    parsed.json,
  )
  const first = list?.items[0]
  if (list === null || first === undefined) {
    return null
  }
  const from =
    first.textEdit !== undefined && 'range' in first.textEdit
      ? parsed.text.offsetAt(first.textEdit.range.start)
      : context.pos
  return {
    from,
    options: list.items.map(toCompletion),
    validFor: isCompletionText,
  }
}

function isCompletionText(text: string): boolean {
  for (const character of text) {
    if (character !== '"' && !isWordCharacter(character)) {
      return false
    }
  }
  return true
}

function isWordCharacter(character: string): boolean {
  return (
    (character >= 'a' && character <= 'z') ||
    (character >= 'A' && character <= 'Z') ||
    (character >= '0' && character <= '9') ||
    character === '_' ||
    character === '$' ||
    character === '-'
  )
}

function toCompletion(item: CompletionItem): Completion {
  const insertText = item.textEdit?.newText ?? item.insertText ?? item.label
  const isSnippet = item.insertTextFormat === InsertTextFormat.Snippet
  return {
    label: item.filterText ?? item.label,
    displayLabel: item.label,
    detail: item.detail,
    info: documentationText(item.documentation),
    type: completionType(item.kind),
    apply: (view, completion, from, to) => {
      const end = view.state.sliceDoc(to, to + 1) === '"' ? to + 1 : to
      if (isSnippet) {
        snippet(toSnippetTemplate(insertText))(view, completion, from, end)
      } else {
        view.dispatch({
          changes: { from, to: end, insert: insertText },
          selection: { anchor: from + insertText.length },
        })
      }
    },
  }
}

function completionType(kind: CompletionItemKind | undefined): string {
  if (kind === CompletionItemKind.Property) {
    return 'property'
  }
  if (kind === CompletionItemKind.Keyword) {
    return 'keyword'
  }
  if (kind === CompletionItemKind.Value || kind === CompletionItemKind.Enum) {
    return 'enum'
  }
  return 'text'
}

// LSP writes tab stops as `$1` and escapes with backslashes; CodeMirror only
// reads `${1}`.
export function toSnippetTemplate(lspSnippet: string): string {
  let template = ''
  for (let index = 0; index < lspSnippet.length; index++) {
    const character = lspSnippet[index] as string
    const next = lspSnippet[index + 1]
    if (character === '\\' && next !== undefined) {
      template += next
      index++
    } else if (character === '$' && next !== undefined && isDigit(next)) {
      let end = index + 1
      while (end < lspSnippet.length && isDigit(lspSnippet[end] as string)) {
        end++
      }
      template += `\${${lspSnippet.slice(index + 1, end)}}`
      index = end - 1
    } else {
      template += character
    }
  }
  return template
}

function isDigit(character: string): boolean {
  return character >= '0' && character <= '9'
}

function documentationText(
  documentation: CompletionItem['documentation'],
): string | undefined {
  if (documentation === undefined) {
    return undefined
  }
  return typeof documentation === 'string' ? documentation : documentation.value
}

async function hover(view: EditorView, position: number, documentUri: string) {
  const parsed = parse(view.state.doc, documentUri)
  const found = await languageService.doHover(
    parsed.text,
    parsed.text.positionAt(position),
    parsed.json,
  )
  const contents = found === null ? '' : hoverMarkdown(found)
  if (found === null || contents.trim() === '') {
    return null
  }
  return {
    pos:
      found.range === undefined
        ? position
        : parsed.text.offsetAt(found.range.start),
    end:
      found.range === undefined
        ? position
        : parsed.text.offsetAt(found.range.end),
    above: true,
    create: () => {
      const dom = document.createElement('div')
      dom.className = 'cm-json-hover'
      dom.innerHTML = markdown.render(contents)
      return { dom }
    },
  }
}

function hoverMarkdown(found: Hover): string {
  const contents = Array.isArray(found.contents)
    ? found.contents
    : [found.contents]
  return contents.map(markedText).join('\n\n')
}

function markedText(content: MarkedString | MarkupContent): string {
  if (typeof content === 'string') {
    return content
  }
  if ('kind' in content) {
    return content.value
  }
  return `\`\`\`${content.language}\n${content.value}\n\`\`\``
}

const hoverTheme = EditorView.theme({
  '.cm-json-hover': {
    maxWidth: '480px',
    padding: '4px 8px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
  },
  '.cm-json-hover p': { margin: '0' },
  '.cm-json-hover p + p': { marginTop: '4px' },
})

const foldRanges = new WeakMap<Text, Map<number, number>>()

// The language service's folding ranges, the ones Monaco used, keyed by the
// 1-based line a range starts on.
function foldJson(state: EditorState, lineStart: number) {
  let ranges = foldRanges.get(state.doc)
  if (ranges === undefined) {
    const text = TextDocument.create('fold', 'json', 0, state.doc.toString())
    ranges = new Map()
    for (const range of languageService.getFoldingRanges(text)) {
      ranges.set(range.startLine + 1, range.endLine + 1)
    }
    foldRanges.set(state.doc, ranges)
  }
  const line = state.doc.lineAt(lineStart)
  const endLineNumber = ranges.get(line.number)
  if (endLineNumber === undefined || endLineNumber <= line.number) {
    return null
  }
  return { from: line.to, to: state.doc.line(endLineNumber).to }
}
