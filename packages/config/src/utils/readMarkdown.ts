import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

// Resolves to packages/config/src both when compiled (build/utils -> ../../src)
// and when run directly from TypeScript (src/utils -> ../../src).
const SRC_DIR = join(__dirname, '../..', 'src')

/**
 * Reads a markdown file relative to packages/config/src.
 * The content is trimmed so it can be used directly as a description.
 * Occurrences of {{name}} are replaced with vars.name; a placeholder
 * without a matching var (or with an undefined value) throws, and so
 * does a var without a matching placeholder.
 * e.g. readMarkdown('templates/starkex/daTechnology.md')
 */
export function readMarkdown(
  pathFromSrc: string,
  vars?: Record<string, string | number | bigint | undefined>,
): string {
  const filePath = join(SRC_DIR, pathFromSrc)
  if (!existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`)
  }
  const content = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').trim()
  const used = new Set<string>()
  const result = content.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    used.add(name)
    const value = vars?.[name]
    if (value === undefined) {
      throw new Error(
        `Missing template variable {{${name}}} for ${pathFromSrc}`,
      )
    }
    return String(value)
  })
  const unused = Object.keys(vars ?? {}).filter((name) => !used.has(name))
  if (unused.length > 0) {
    throw new Error(
      `Unused template variables for ${pathFromSrc}: ${unused.join(', ')}`,
    )
  }
  return result
}

/** e.g. readProjectMarkdown('tornado-cash', 'detailedDescription') */
export function readProjectMarkdown(
  slug: string,
  name: string,
  vars?: Record<string, string | number | bigint | undefined>,
): string {
  return readMarkdown(join('projects', slug, `${name}.md`), vars)
}
