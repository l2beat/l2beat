import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

// Resolves to packages/config/src both when compiled (build/utils -> ../../src)
// and when run via esbuild-register (src/utils -> ../../src).
const SRC_DIR = join(__dirname, '../..', 'src')

/**
 * Reads a markdown file relative to packages/config/src.
 * The content is trimmed so it can be used directly as a description.
 * e.g. readMarkdown('templates/starkex/daTechnology.md')
 */
export function readMarkdown(pathFromSrc: string): string {
  const filePath = join(SRC_DIR, pathFromSrc)
  if (!existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`)
  }
  return readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').trim()
}

/** e.g. readProjectMarkdown('tornado-cash', 'detailedDescription') */
export function readProjectMarkdown(slug: string, name: string): string {
  return readMarkdown(join('projects', slug, `${name}.md`))
}
