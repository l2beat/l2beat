import { readdir } from 'fs/promises'
import { join, relative } from 'path'

/**
 * Find all files matching glob pattern
 */
export async function glob(
  startPath: string,
  pattern: string,
  collectFilesFn: (dir: string) => Promise<string[]> = getFilesRecursively,
): Promise<string[]> {
  const regex = globToRegex(pattern)
  const results: string[] = []
  const files = await collectFilesFn(startPath)

  for (const filePath of files) {
    if (regex.test(filePath)) {
      results.push(filePath)
    }
  }

  return results.sort()
}

async function getFilesRecursively(
  dir: string,
  results: string[] = [],
  startDir?: string,
): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      await getFilesRecursively(path, results, startDir ?? dir)
    } else {
      results.push(relative(startDir ?? dir, path))
    }
  }

  return results
}

function globToRegex(pattern: string): RegExp {
  const globstarPlaceholder = '__GLOBSTAR__'
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape regex chars
    .replace(/\*\*\//g, globstarPlaceholder)
    .replace(/\*/g, '([^/]+)')
    .replace(new RegExp(globstarPlaceholder, 'g'), '(.*)')

  return new RegExp(`^${escaped}$`)
}
