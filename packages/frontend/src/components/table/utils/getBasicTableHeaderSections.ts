import { assert } from '@l2beat/shared-pure'
import type { HeaderGroup } from '@tanstack/react-table'

export function getBasicTableHeaderSections<T>(
  headerGroups: HeaderGroup<T>[],
): {
  groupedHeader: HeaderGroup<T> | undefined
  actualHeader: HeaderGroup<T>
} {
  const maxDepth = headerGroups.length - 1
  assert(maxDepth <= 1, 'Only 1 level of headers is supported')

  const groupedHeader = maxDepth === 1 ? headerGroups[0] : undefined
  const actualHeader = maxDepth === 1 ? headerGroups[1] : headerGroups[0]
  assert(actualHeader, 'Actual header is required')

  return { groupedHeader, actualHeader }
}
