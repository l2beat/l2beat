import { type ExpandedField, groupPaths, leafKeys } from './buildFieldTree'

// What a value, or a whole group of values, does in the node. `mixed` is not a
// choice the user makes, it is what a group reads as while its members
// disagree.
export type FieldState = 'on' | 'compress' | 'off'
export type DisplayedFieldState = FieldState | 'mixed'

export interface ValueVisibility {
  readonly hiddenFields: readonly string[]
  readonly compressedRows: readonly string[]
}

export function getFieldState(
  field: ExpandedField,
  visibility: ValueVisibility,
  subsumedBy?: string,
): DisplayedFieldState {
  const keys = leafKeys(field)
  const hiddenCount = keys.filter((key) =>
    visibility.hiddenFields.includes(key),
  ).length
  if (keys.length > 0 && hiddenCount === keys.length) {
    return 'off'
  }
  if (hiddenCount > 0) {
    return 'mixed'
  }
  if (
    subsumedBy !== undefined ||
    visibility.compressedRows.includes(field.fullKey)
  ) {
    return 'compress'
  }
  return 'on'
}

export function setFieldState(
  field: ExpandedField,
  visibility: ValueVisibility,
  state: FieldState,
  subsumedBy?: string,
): ValueVisibility {
  const keys = leafKeys(field)
  const paths = groupPaths(field)
  // Compression below the entry is either replaced by its own, or expanded
  // along with it, so it always goes.
  const compressedElsewhere = visibility.compressedRows.filter(
    (path) => !paths.includes(path),
  )

  if (state === 'off') {
    return {
      hiddenFields: [
        ...visibility.hiddenFields,
        ...keys.filter((key) => !visibility.hiddenFields.includes(key)),
      ],
      compressedRows: compressedElsewhere,
    }
  }

  // Showing a value again, on its own row or inside its group's single row,
  // always brings it back from hidden first.
  const hiddenFields = visibility.hiddenFields.filter(
    (key) => !keys.includes(key),
  )
  // Compressing one value is a no-op, and a member of an already compressed
  // group is compressed by its parent rather than by itself.
  const compressesItself =
    state === 'compress' && field.type === 'complex' && subsumedBy === undefined
  return {
    hiddenFields,
    compressedRows: compressesItself
      ? [...compressedElsewhere, field.fullKey]
      : compressedElsewhere,
  }
}
