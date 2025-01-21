import type { ColumnId } from './columns'

export type ColumnFilter = Record<ColumnId, string[] | undefined>

// NOTE(radomski): If the output will become too big we might use something
// like smaz or some other compression technique
export function serializeFilter(filter: ColumnFilter): string {
  const definedEntries = Object.entries(filter).filter(
    ([_, value]) => value !== undefined,
  )
  if (definedEntries.length === 0) return ''

  return definedEntries
    .map(([key, values]) => `${key}:${values?.join(',')}`)
    .join('|')
}

export function deserializeFilter(
  serialized: string,
  defaultFilter: ColumnFilter,
): ColumnFilter {
  if (!serialized) return defaultFilter

  try {
    const result = { ...defaultFilter }

    const segments = serialized.split('|')
    segments.forEach((segment) => {
      const parts = segment.split(':')
      const columnId = parts[0]
      const valueStr = parts[1]

      if (columnId && columnId in defaultFilter) {
        result[columnId as keyof ColumnFilter] = valueStr
          ? valueStr.split(',')
          : undefined
      }
    })

    return result
  } catch {
    return defaultFilter
  }
}
