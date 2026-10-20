import type { FlatEntry, FlatWorkspace } from './FlatWorkspace'
import {
  callOf,
  type Definition,
  declarationAt,
  type Resolution,
  resolveDefinition,
} from './resolveDefinition'
import type { TextPosition } from './SourceIndex'

export interface Reference {
  path: string
  position: TextPosition
  offset: number
  length: number
  resolution: Resolution
  isCall: boolean
  copies: string[]
  // Uses an identical declaration compiled into another flat.
  elsewhere: boolean
}

export interface ReferencesResult {
  symbol: string
  targets: Definition[]
  references: Reference[]
}

// A reference is any occurrence of the name that go to definition would send
// to one of the targets, so both features always agree.
export function findReferences(
  workspace: FlatWorkspace,
  path: string,
  offset: number,
): ReferencesResult {
  const declaration = declarationAt(workspace.source(path), offset)
  if (declaration !== undefined) {
    return {
      symbol: declaration.label,
      targets: [declaration],
      references: referencesTo(workspace, [declaration]),
    }
  }
  const resolved = resolveDefinition(workspace, path, offset)
  return {
    symbol: resolved.symbol,
    targets: resolved.definitions,
    references: referencesTo(workspace, resolved.definitions),
  }
}

export function referencesTo(
  workspace: FlatWorkspace,
  targets: Definition[],
): Reference[] {
  const search: Search = {
    matchers: targets.map((t) => toMatcher(workspace, t)),
    shared: new Set(
      targets.flatMap((t) => sharedSignature(workspace, t) ?? []),
    ),
  }
  const declarationTexts = targets.flatMap((t) =>
    isShared(t) ? [declarationText(workspace, t)] : [],
  )
  const names = new Set(targets.map((t) => lastSegment(t.label)))
  const ownNames = new Set(
    targets.map((t) => positionKey(workspace, t.path, offsetOf(workspace, t))),
  )
  // In-file references read the same in every identical copy of a file, so
  // they are listed once. One that crosses contracts depends on the copy's
  // own discovered values, so it is not folded.
  const inFile = new Map<string, Reference>()
  const references: Reference[] = []
  // Of identical copies, the one being read is the one to show.
  const own = targets.map((t) => t.path)
  const paths = [...new Set([...own, ...workspace.sourcePaths])]
  const ownContent = new Set(own.map((path) => workspace.contentId(path)))
  const reachable = targets.some(isReachableFromOtherFiles)
  for (const path of paths) {
    const text = workspace.text(path)
    const sameContent = ownContent.has(workspace.contentId(path))
    const hasCopy = declarationTexts.some((t) => text.includes(t))
    if (!sameContent && !hasCopy && !reachable) {
      continue
    }
    for (const name of names) {
      for (const offset of wordOccurrences(text, name)) {
        if (!sameContent && !hasCopy && !followsDot(text, offset)) {
          continue
        }
        const key = positionKey(workspace, path, offset)
        const known = inFile.get(key)
        if (known !== undefined) {
          known.copies.push(path)
          continue
        }
        if (ownNames.has(key)) {
          continue
        }
        const reference = referenceAt(workspace, path, offset, name, search)
        if (reference?.resolution === 'in-file') {
          inFile.set(key, reference)
        }
        if (reference !== undefined) {
          references.push(reference)
        }
      }
    }
  }
  return [
    ...references.filter((r) => !r.elsewhere),
    ...references.filter((r) => r.elsewhere),
  ]
}

interface Search {
  matchers: Matcher[]
  shared: Set<string>
}

// Members and top-level declarations, not locals: the same library or base
// contract compiled into many flats is one thing to a reader.
function isShared(target: Definition): boolean {
  const node = target.declaration as { type: string; isStateVar?: boolean }
  if (node.type === 'VariableDeclaration') {
    return node.isStateVar === true
  }
  return SHARED_DECLARATIONS.includes(node.type)
}

const SHARED_DECLARATIONS = [
  'FunctionDefinition',
  'ModifierDefinition',
  'EventDefinition',
  'CustomErrorDefinition',
  'StructDefinition',
  'EnumDefinition',
  'EnumValue',
  'TypeDefinition',
  'ContractDefinition',
  'FileLevelConstant',
]

function sharedSignature(
  workspace: FlatWorkspace,
  definition: Definition,
): string | undefined {
  if (!isShared(definition)) {
    return undefined
  }
  return `${definition.label}\n${declarationText(workspace, definition)}`
}

function declarationText(workspace: FlatWorkspace, definition: Definition) {
  const range = definition.declaration.range
  if (range === undefined) {
    return ''
  }
  return workspace.text(definition.path).slice(range[0], range[1] + 1)
}

// Each flat holds everything it uses, so another file can only reach a
// declaration through an external call: `x.f()` on a public or external
// function, or `x.v()` on a public state variable's getter.
function isReachableFromOtherFiles(target: Definition): boolean {
  const node = target.declaration as { type: string; visibility?: string }
  if (node.type === 'FunctionDefinition') {
    return node.visibility !== 'internal' && node.visibility !== 'private'
  }
  return node.type === 'VariableDeclaration' && node.visibility === 'public'
}

const WHITESPACE = ' \t\r\n'

function followsDot(text: string, offset: number): boolean {
  let at = offset - 1
  while (at >= 0 && WHITESPACE.includes(text[at] ?? '')) {
    at--
  }
  return text[at] === '.'
}

interface Matcher {
  keys: Set<string>
  entries: FlatEntry[]
}

function toMatcher(workspace: FlatWorkspace, target: Definition): Matcher {
  const owner = workspace.entryOfPath(target.path)
  return {
    keys: new Set(declarationKeys(workspace, target)),
    entries: target.entries.length > 0 ? target.entries : owner ? [owner] : [],
  }
}

function matches(
  workspace: FlatWorkspace,
  definition: Definition,
  matcher: Matcher,
): boolean {
  const sameCode = declarationKeys(workspace, definition).some((key) =>
    matcher.keys.has(key),
  )
  if (!sameCode) {
    return false
  }
  return (
    definition.resolution === 'in-file' ||
    definition.entries.some((entry) => matcher.entries.includes(entry))
  )
}

function referenceAt(
  workspace: FlatWorkspace,
  path: string,
  offset: number,
  name: string,
  search: Search,
): Reference | undefined {
  const result = resolveDefinition(workspace, path, offset)
  const exact = result.definitions.find((d) =>
    search.matchers.some((matcher) => matches(workspace, d, matcher)),
  )
  const copy =
    exact === undefined
      ? result.definitions.find((d) => {
          // A call into another deployment counts only for the one it
          // reaches, even when that one runs identical code.
          const signature = sharedSignature(workspace, d)
          return (
            d.resolution === 'in-file' &&
            signature !== undefined &&
            search.shared.has(signature)
          )
        })
      : undefined
  const match = exact ?? copy
  // A declaration's own name, e.g. the copy of a constant in another flat.
  if (
    match === undefined ||
    (match.path === path && offsetOf(workspace, match) === offset)
  ) {
    return undefined
  }
  const index = workspace.source(path)
  return {
    path,
    position: index.positionOf(offset),
    offset,
    length: name.length,
    resolution: match.resolution,
    isCall: callOf(index.pathAt(offset)) !== undefined,
    copies: [],
    elsewhere: exact === undefined,
  }
}

export function wordOccurrences(text: string, word: string): number[] {
  const offsets: number[] = []
  let at = text.indexOf(word)
  while (at !== -1) {
    const before = text[at - 1]
    const after = text[at + word.length]
    if (!isIdentifierCharacter(before) && !isIdentifierCharacter(after)) {
      offsets.push(at)
    }
    at = text.indexOf(word, at + word.length)
  }
  return offsets
}

function isIdentifierCharacter(character: string | undefined): boolean {
  if (character === undefined) {
    return false
  }
  return (
    (character >= 'a' && character <= 'z') ||
    (character >= 'A' && character <= 'Z') ||
    (character >= '0' && character <= '9') ||
    character === '_' ||
    character === '$'
  )
}

function declarationKeys(
  workspace: FlatWorkspace,
  definition: Definition,
): string[] {
  const start = definition.declaration.range?.[0] ?? -1
  return [
    positionKey(workspace, definition.path, start),
    ...definition.copies.map((c) => positionKey(workspace, c.path, c.start)),
  ]
}

function positionKey(workspace: FlatWorkspace, path: string, offset: number) {
  return `${workspace.contentId(path)}:${offset}`
}

function offsetOf(workspace: FlatWorkspace, definition: Definition): number {
  return workspace.source(definition.path).offsetOf(definition.position)
}

function lastSegment(label: string): string {
  return label.slice(label.lastIndexOf('.') + 1)
}
