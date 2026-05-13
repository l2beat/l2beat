import { expect } from 'earl'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { getRecentChanges, hasRecentChanges } from './getRecentChanges'

/**
 * `getRecentChanges` reads from `process.cwd()/../config/src/projects/<id>/diffHistory.md`.
 * We mirror that layout in a temp directory and swap `process.cwd()` for the
 * duration of each test so the on-disk fixtures are isolated.
 */
function withTempCwd(
  setup: (projectsDir: string) => void,
  fn: () => void,
): void {
  const root = mkdtempSync(join(tmpdir(), 'l2b-recent-changes-'))
  const frontendDir = join(root, 'packages', 'frontend')
  const projectsDir = join(root, 'packages', 'config', 'src', 'projects')
  mkdirSync(frontendDir, { recursive: true })
  mkdirSync(projectsDir, { recursive: true })
  setup(projectsDir)

  const originalCwd = process.cwd()
  process.chdir(frontendDir)
  try {
    fn()
  } finally {
    process.chdir(originalCwd)
    rmSync(root, { recursive: true, force: true })
  }
}

const SAMPLE = [
  'Generated with discovered.json: 0xabc',
  '',
  '# Diff at Wed, 21 Jan 2026 09:00:00 GMT:',
  '',
  '- author: Alice (<alice@example.com>)',
  '- comparing to: main@deadbeef block: 1000',
  '- current timestamp: 2000',
  '',
  '## Description',
  '',
  'The Mantle Security Multisig updated its signer set.',
  '',
  '## Watched changes',
  '',
  '```diff',
  '+   added line',
  '-   removed line',
  '```',
  '',
  '## Config/verification related changes',
  '',
  '```diff',
  '+ should be hidden',
  '```',
  '',
  '# Diff at Tue, 20 Jan 2026 09:00:00 GMT:',
  '',
  '- author: Bob',
  '- current timestamp: 1500',
  '',
  '## Description',
  '',
  '',
  '## Config/verification related changes',
  '',
  '```diff',
  '+ only config',
  '```',
  '',
].join('\n')

describe('getRecentChanges', () => {
  it('returns total 0 when diffHistory.md is missing', () => {
    withTempCwd(
      () => {},
      () => {
        expect(hasRecentChanges('missing')).toEqual(false)
        const result = getRecentChanges({
          projectId: 'missing',
          page: 1,
          pageSize: 5,
        })
        expect(result).toEqual({
          total: 0,
          page: 1,
          pageSize: 5,
          entries: [],
        })
      },
    )
  })

  it('strips config-related sections and skips entries that become empty', () => {
    withTempCwd(
      (projectsDir) => {
        const dir = join(projectsDir, 'sample')
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'diffHistory.md'), SAMPLE, 'utf-8')
      },
      () => {
        expect(hasRecentChanges('sample')).toEqual(true)
        const result = getRecentChanges({
          projectId: 'sample',
          page: 1,
          pageSize: 5,
        })
        expect(result.total).toEqual(1)
        expect(result.entries.length).toEqual(1)
        const entry = result.entries[0]!
        expect(entry.date).toEqual('Wed, 21 Jan 2026 09:00:00 GMT')
        expect(entry.description).toEqual(
          'The Mantle Security Multisig updated its signer set.',
        )
        expect(entry.sections.length).toEqual(1)
        expect(entry.sections[0]!.kind).toEqual('watched-changes')
        expect(entry.sections[0]!.body).toInclude('+   added line')
        // Section body must not include the stripped config block.
        for (const section of entry.sections) {
          expect(section.body).not.toInclude('should be hidden')
        }
      },
    )
  })

  it('paginates entries newest-first', () => {
    const lines: string[] = []
    for (let i = 5; i >= 1; i--) {
      lines.push(`# Diff at Day ${i}:`)
      lines.push('')
      lines.push('- current timestamp: 1000')
      lines.push('')
      lines.push('## Description')
      lines.push('')
      lines.push(`Entry ${i}`)
      lines.push('')
      lines.push('## Watched changes')
      lines.push('')
      lines.push('```diff')
      lines.push(`+ line ${i}`)
      lines.push('```')
      lines.push('')
    }
    const content = lines.join('\n')

    withTempCwd(
      (projectsDir) => {
        const dir = join(projectsDir, 'multi')
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'diffHistory.md'), content, 'utf-8')
      },
      () => {
        const firstPage = getRecentChanges({
          projectId: 'multi',
          page: 1,
          pageSize: 2,
        })
        expect(firstPage.total).toEqual(5)
        expect(firstPage.entries.map((e) => e.description)).toEqual([
          'Entry 5',
          'Entry 4',
        ])

        const lastPage = getRecentChanges({
          projectId: 'multi',
          page: 3,
          pageSize: 2,
        })
        expect(lastPage.entries.map((e) => e.description)).toEqual(['Entry 1'])
      },
    )
  })

  it('skips description-only entries (no watched / initial / source-code sections)', () => {
    const md = [
      '# Diff at Fri, 08 May 2026 07:50:59 GMT:',
      '',
      '- current timestamp: 1',
      '',
      '## Description',
      '',
      'Use the new flattener implementation',
      '',
      '## Config/verification related changes',
      '',
      '```diff',
      '+ config only',
      '```',
      '',
    ].join('\n')

    withTempCwd(
      (projectsDir) => {
        const dir = join(projectsDir, 'summary-only')
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'diffHistory.md'), md, 'utf-8')
      },
      () => {
        expect(hasRecentChanges('summary-only')).toEqual(false)
        const result = getRecentChanges({
          projectId: 'summary-only',
          page: 1,
          pageSize: 5,
        })
        expect(result.total).toEqual(0)
        expect(result.entries).toEqual([])
      },
    )
  })
})
