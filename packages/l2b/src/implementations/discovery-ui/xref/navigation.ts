import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { compareFiles } from '../../discovery/getCodePaths'
import type { FlatWorkspace } from '../../xref/FlatWorkspace'
import { findReferences, type Reference } from '../../xref/findReferences'
import {
  type Definition,
  resolveDefinition,
} from '../../xref/resolveDefinition'
import { addFlattenerNote } from '../getCode'
import type { ApiDefinitionResponse, ApiReferencesResponse } from '../types'

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
): ApiDefinitionResponse['definitions'][number] {
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
  }
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
