import type { Field, Node } from '../State'

// How much of a row's height the links leaving a compressed row spread over,
// so a 1:N row reads as a fan while every link still touches its dot.
export const ROW_FAN_SPREAD = 0.5

export interface NodeRow {
  // The field path that owns the row: a field's own name for a 1:1 row, or the
  // compressed prefix shared by the fields that fan out of it.
  readonly key: string
  readonly label: string
  // Indices into node.fields of the visible fields drawn through this row,
  // in field order. A compressed row holds more than one.
  readonly fieldIndices: readonly number[]
}

export interface RowLayout {
  readonly rows: readonly NodeRow[]
  // Geometry row of every field, hidden ones included, so a hidden field keeps
  // the box it had before compression existed: the row that follows it.
  readonly rowByField: readonly number[]
  // Fractional row index for processConnection. Fields sharing a compressed
  // row leave it at slightly different heights, so N links read as a fan
  // instead of one thick stroke. A row of one resolves to its exact centre.
  readonly anchorByField: readonly number[]
}

// Nodes are immutable, so a layout stays valid for the lifetime of its node.
const cache = new WeakMap<Node, RowLayout>()

export function getRowLayout(node: Node): RowLayout {
  const cached = cache.get(node)
  if (cached !== undefined) {
    return cached
  }
  const layout = buildRowLayout(node)
  cache.set(node, layout)
  return layout
}

// Field paths nest as `group.entry[3].leaf`, so every prefix of a path is a
// candidate row owner. Shortest first, which makes the outermost compression
// win: compressing `foo` subsumes whatever `foo.bar` asked for.
export function fieldPathPrefixes(name: string): string[] {
  const prefixes: string[] = []
  for (let i = 1; i < name.length; i++) {
    const char = name[i]
    if (char !== '.' && char !== '[') {
      continue
    }
    prefixes.push(name.slice(0, i))
  }
  prefixes.push(name)
  return prefixes
}

export function resolveRowKey(
  name: string,
  compressed: ReadonlySet<string>,
): string {
  for (const prefix of fieldPathPrefixes(name)) {
    if (compressed.has(prefix)) {
      return prefix
    }
  }
  return name
}

// Drops compression on paths that no longer exist in the node's values, the
// way reconcileHiddenFields does for hidden ones.
export function reconcileCompressedRows(
  fields: readonly { readonly name: string }[],
  compressedRows: readonly string[],
): string[] {
  if (compressedRows.length === 0) {
    return []
  }
  const valid = new Set<string>()
  for (const field of fields) {
    for (const prefix of fieldPathPrefixes(field.name)) {
      valid.add(prefix)
    }
  }
  const result = new Set<string>()
  for (const path of compressedRows) {
    if (valid.has(path)) {
      result.add(path)
    }
  }
  return [...result]
}

interface MutableRow {
  key: string
  label: string
  fieldIndices: number[]
}

function buildRowLayout(node: Node): RowLayout {
  const hidden =
    node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
  const compressed =
    node.compressedRows.length > 0 ? new Set(node.compressedRows) : undefined

  const rows: MutableRow[] = []
  const rowIndexByKey = new Map<string, number>()
  const rowByField: number[] = new Array(node.fields.length)
  const anchorByField: number[] = new Array(node.fields.length)

  for (let i = 0; i < node.fields.length; i++) {
    const field = node.fields[i] as Field
    if (hidden?.has(field.name)) {
      rowByField[i] = rows.length
      anchorByField[i] = rows.length
      continue
    }
    const key =
      compressed === undefined
        ? field.name
        : resolveRowKey(field.name, compressed)
    let index = rowIndexByKey.get(key)
    if (index === undefined) {
      index = rows.length
      rowIndexByKey.set(key, index)
      rows.push({ key, label: '', fieldIndices: [] })
    }
    const row = rows[index] as MutableRow
    row.fieldIndices.push(i)
    rowByField[i] = index
  }

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index] as MutableRow
    const count = row.fieldIndices.length
    row.label = getRowLabel(node, row)
    for (let slot = 0; slot < count; slot++) {
      const spread = ((slot + 1) / (count + 1) - 0.5) * ROW_FAN_SPREAD
      anchorByField[row.fieldIndices[slot] as number] = index + spread
    }
  }

  return { rows, rowByField, anchorByField }
}

function getRowLabel(node: Node, row: MutableRow): string {
  const first = node.fields[row.fieldIndices[0] as number] as Field
  const isCompressed = row.fieldIndices.length > 1 || row.key !== first.name
  if (!isCompressed) {
    return first.label ?? first.name
  }
  return `${row.key} (${row.fieldIndices.length})`
}
