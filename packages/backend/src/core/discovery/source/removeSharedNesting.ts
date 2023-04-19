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

  let commonPrefix = path.dirname(sanitized[0][0])
  for (const [fileName] of sanitized) {
    while (!fileName.startsWith(commonPrefix)) {
      commonPrefix = path.dirname(commonPrefix)
    }
  }

  const length = commonPrefix === '/' ? 1 : commonPrefix.length + 1
  return sanitized.map(([fileName, content]) => [
    fileName.slice(length),
    content,
  ])
}
