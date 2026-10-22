import type { ApiDefinition, ApiReference } from '../../../api/types'
import type { PeekContent } from '../../../components/editor/code/plugins/peek'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import type { CodeLocation, DefinitionLookup } from './useGoToDefinition'

const RESOLUTION_LABELS: Record<ApiDefinition['resolution'], string> = {
  'discovered-value': 'from discovered.json',
  'abi-match': 'matched by ABI',
  'in-file': 'in this file',
}

export interface Row {
  location: CodeLocation
  headline: string
  detail: string
}

export function rowsOf(lookup: DefinitionLookup): Row[] {
  if (lookup.status === 'definitions') {
    return lookup.response.definitions.map(definitionRow)
  }
  if (lookup.status === 'references') {
    return lookup.response.references.map(referenceRow)
  }
  return []
}

function definitionRow(definition: ApiDefinition): Row {
  const copies =
    definition.alsoIn > 0 ? ` · same code in ${definition.alsoIn} more` : ''
  return {
    location: definition,
    headline: definition.label,
    detail: `${definition.name} ${toShortenedAddress(definition.address)} · ${definition.fileName}:${definition.line} · ${RESOLUTION_LABELS[definition.resolution]}${copies}`,
  }
}

function referenceRow(reference: ApiReference): Row {
  const copies =
    reference.copies > 0 ? ` · also in ${reference.copies} identical files` : ''
  const kind = reference.isCall ? 'call · ' : ''
  const how = reference.elsewhere
    ? 'same code in another contract'
    : RESOLUTION_LABELS[reference.resolution]
  return {
    location: reference,
    headline: reference.text,
    detail: `${reference.name} · ${reference.fileName}:${reference.line} · ${kind}${how}${copies}`,
  }
}

export function title(lookup: DefinitionLookup): string {
  if (lookup.status === 'failed') {
    return 'Could not resolve this'
  }
  if (lookup.status === 'references') {
    const { symbol, references } = lookup.response
    if (symbol === '') {
      return 'Nothing to find references for here'
    }
    const count = references.length
    return `${symbol}: ${count} reference${count === 1 ? '' : 's'}`
  }
  const { symbol, receiver, definitions } = lookup.response
  if (definitions.length === 0) {
    const where = receiver
      ? ` (${receiver.name ?? toShortenedAddress(receiver.address)})`
      : ''
    return symbol
      ? `No definition found for ${symbol}${where}`
      : 'Nothing to go to here'
  }
  return `${symbol}: ${definitions.length} candidates`
}

export function peekContent(
  definition: ApiDefinition,
  onOpen: () => void,
): PeekContent {
  const { line, offset, text } = definition.declaration
  const lastLine = line + text.split('\n').length - 1
  return {
    key: `${definition.address}:${definition.sourceIndex}:${definition.offset}`,
    title: definition.label,
    location: `${definition.fileName} lines ${line}–${lastLine}`,
    owner: `${definition.name} ${toShortenedAddress(definition.address)}`,
    text,
    firstLine: line,
    origin: {
      address: definition.address,
      sourceIndex: definition.sourceIndex,
      offset,
    },
    onOpen,
  }
}
