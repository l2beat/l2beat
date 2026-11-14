import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { expect } from 'earl'

// Checks for the rules in DESIGN.md (repo root) that can be found by
// matching source text.

const SRC = join(__dirname)

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.(tsx?|css)$/.test(entry.name) && !entry.name.includes('.test.')
      ? [path]
      : []
  })
}

function filesMatching(dir: string, pattern: RegExp) {
  return sourceFiles(dir)
    .filter((path) => pattern.test(readFileSync(path, 'utf8')))
    .map((path) => relative(SRC, path))
}

describe('design rules (DESIGN.md)', () => {
  it('uses the site palette, never the brand kit paper #F5F3EE', () => {
    expect(filesMatching(SRC, /f5f3ee/i)).toEqual([])
  })

  it('does not cap the line length of research and markdown prose', () => {
    const cap = /max-w-prose|max-w-\[\d+ch\]/
    expect([
      ...filesMatching(join(SRC, 'components/markdown'), cap),
      ...filesMatching(join(SRC, 'components/projects'), cap),
    ]).toEqual([])
  })
})
