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
  const files = await collectFilesFn(startPath)
  return files.filter((f) => regex.test(f)).sort()
}

async function getFilesRecursively(startPath: string): Promise<string[]> {
  const results: string[] = []

  async function recurse(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        await recurse(path)
      } else {
        results.push(relative(startPath, path))
      }
    }
  }

  await recurse(startPath)
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
