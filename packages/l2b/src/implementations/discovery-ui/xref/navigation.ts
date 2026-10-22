import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import type { BaseASTNode } from '@mradomski/fast-solidity-parser'
import { compareFiles } from '../../discovery/getCodePaths'
import type { FlatWorkspace } from '../../xref/FlatWorkspace'
import { findReferences, type Reference } from '../../xref/findReferences'
import {
  type Definition,
  resolveDefinition,
} from '../../xref/resolveDefinition'
import type { SourceIndex } from '../../xref/SourceIndex'
import { addFlattenerNote } from '../getCode'
import type { ApiDefinitionResponse, ApiReferencesResponse } from '../types'

type ApiDefinition = ApiDefinitionResponse['definitions'][number]

// The code panel shows every flat behind this note, so its offsets are shifted.
const NOTE_LENGTH = addFlattenerNote('').length
const NOTE_LINES = addFlattenerNote('').split('\n').length - 1

export function definitionAt(
  workspace: FlatWorkspace,
  address: ChainSpecificAddress,
  sourceIndex: number,
  offset: number,
): ApiDefinitionResponse {
  if (offset < NOTE_LENGTH) {
    return { symbol: '', receiver: undefined, definitions: [] }
  }
  const path = sourcePath(workspace, address, sourceIndex)
  const result = resolveDefinition(workspace, path, offset - NOTE_LENGTH)
  const receiver = result.receiver?.address
  return {
    symbol: result.symbol,
    receiver:
      receiver === undefined
        ? undefined
        : { address: receiver, name: workspace.entryAt(receiver)?.name },
    definitions: result.definitions.map((d) => toApiDefinition(workspace, d)),
  }
}

export function referencesAt(
  workspace: FlatWorkspace,
  address: ChainSpecificAddress,
  sourceIndex: number,
  offset: number,
): ApiReferencesResponse {
  if (offset < NOTE_LENGTH) {
    return { symbol: '', definitions: [], references: [] }
  }
  const path = sourcePath(workspace, address, sourceIndex)
  const result = findReferences(workspace, path, offset - NOTE_LENGTH)
  return {
    symbol: result.symbol,
    definitions: result.targets.map((d) => toApiDefinition(workspace, d)),
    references: result.references.map((r) => toApiReference(workspace, r)),
  }
}

function toApiDefinition(
  workspace: FlatWorkspace,
  definition: Definition,
): ApiDefinition {
  const owner = workspace.entryOfPath(definition.path)
  assert(owner !== undefined, 'Definition outside the discovery')
  const index = workspace.source(definition.path)
  const label = definition.label
  return {
    address: owner.address,
    name: owner.name,
    label,
    resolution: definition.resolution,
    fileName: fileName(definition.path),
    line: definition.position.line + NOTE_LINES,
    sourceIndex: displayOrder(owner.sourcePaths).indexOf(definition.path),
    offset: index.offsetOf(definition.position) + NOTE_LENGTH,
    length: label.length - label.lastIndexOf('.') - 1,
    alsoIn: definition.entries.length > 1 ? definition.entries.length - 1 : 0,
    declaration: declarationLines(index, definition.declaration),
  }
}

function declarationLines(
  index: SourceIndex,
  node: BaseASTNode,
): ApiDefinition['declaration'] {
  assert(node.range !== undefined, 'Declaration without a range')
  const text = index.text
  const start = commentStart(text, lineStartOf(text, node.range[0]))
  const lineEnd = text.indexOf('\n', node.range[1])
  return {
    line: index.positionOf(start).line + NOTE_LINES,
    offset: start + NOTE_LENGTH,
    text: text.slice(start, lineEnd === -1 ? undefined : lineEnd),
  }
}

// Where the comments directly above the line starting at `start` begin.
function commentStart(text: string, start: number): number {
  while (start > 0) {
    const previous = lineStartOf(text, start - 1)
    const line = text.slice(previous, start - 1).trim()
    if (line.startsWith('//')) {
      start = previous
    } else if (line.endsWith('*/')) {
      start = lineStartOf(text, text.lastIndexOf('/*', start - 1))
    } else {
      break
    }
  }
  return start
}

function lineStartOf(text: string, offset: number): number {
  return text.lastIndexOf('\n', offset - 1) + 1
}

function toApiReference(
  workspace: FlatWorkspace,
  reference: Reference,
): ApiReferencesResponse['references'][number] {
  const owner = workspace.entryOfPath(reference.path)
  assert(owner !== undefined, 'Reference outside the discovery')
  const text = workspace.text(reference.path)
  const lineStart = text.lastIndexOf('\n', reference.offset) + 1
  const lineEnd = text.indexOf('\n', reference.offset)
  return {
    address: owner.address,
    name: owner.name,
    fileName: fileName(reference.path),
    line: reference.position.line + NOTE_LINES,
    sourceIndex: displayOrder(owner.sourcePaths).indexOf(reference.path),
    offset: reference.offset + NOTE_LENGTH,
    length: reference.length,
    resolution: reference.resolution,
    isCall: reference.isCall,
    elsewhere: reference.elsewhere,
    text: text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim(),
    copies: reference.copies.length,
  }
}

function sourcePath(
  workspace: FlatWorkspace,
  address: ChainSpecificAddress,
  sourceIndex: number,
): string {
  const entry = workspace.entryAt(address)
  assert(entry !== undefined, 'Address not in discovery')
  const path = displayOrder(entry.sourcePaths)[sourceIndex]
  assert(path !== undefined, 'Source index out of range')
  return path
}

// The order getCodeFromDisk returns sources in, which the panel indexes.
function displayOrder(paths: string[]): string[] {
  return [...paths].sort(compareFiles)
}

function fileName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1)
}
