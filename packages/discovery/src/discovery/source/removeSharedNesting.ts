import { assert } from '@l2beat/shared-pure'
import path from 'path'
import { sanitizePath } from './sanitizePath'

/**
 * Removes the common directory from all file names.
 *
 * For example if the paths are /a/b/c/d.sol and /a/b/e/f.sol, it will return
 * { 'c/d.sol': '...', 'e/f.sol': '...' }, removing the /a/b/ prefix.
 */
export function removeSharedNesting(
  entries: [string, string][],
): [string, string][] {
  if (entries.length === 0) {
    return entries
  }

  const sanitized = entries.map(([fileName, content]) => [
    sanitizePath(fileName),
    content,
  ])

  assert(sanitized[0]?.[0], 'cannot derive common prefix')

  let commonPrefix = path.dirname(sanitized[0][0])
  for (const [fileName] of sanitized) {
    while (fileName && !fileName.startsWith(commonPrefix)) {
      commonPrefix = path.dirname(commonPrefix)
    }
  }

  const length = commonPrefix === '/' ? 1 : commonPrefix.length + 1

  function hasFileAndContent(group: string[]): group is [string, string] {
    return group.length === 2
  }

  return sanitized
    .filter(hasFileAndContent)
    .map(([fileName, content]) => [fileName.slice(length), content])
}
