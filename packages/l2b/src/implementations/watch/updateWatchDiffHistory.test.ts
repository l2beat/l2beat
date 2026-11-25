import { Logger } from '@l2beat/backend-tools'
import type { WatchDiff } from '@l2beat/discovery'
import { expect } from 'earl'
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { assertNoUnmergedWatchEntry } from '../discovery/updateDiffHistory'
import {
  findUnmergedWatchEntry,
  generateWatchDiffHistoryEntry,
  prependEntry,
  writeWatchDiffHistory,
} from './updateWatchDiffHistory'

const DIFF: WatchDiff[] = [
  {
    key: 'audits',
    changes: [
      {
        path: ['org/repo:docs/audit-2026.pdf'],
        after: { sha: 'abc123', size: 4096 },
      },
    ],
  },
]

const ENTRY = {
  date: 'Wed, 29 Oct 2026 09:12:40 GMT',
  id: '3f9a0c12',
  author: { name: 'Alice', email: 'alice@example.com' },
  mainBranchHash: '5c3198a20e',
  timestamp: 1793265160,
  description: 'New audit added.',
  diff: DIFF,
}

describe(generateWatchDiffHistoryEntry.name, () => {
  it('writes the metadata, description and offchain changes', () => {
    expect(generateWatchDiffHistoryEntry(ENTRY)).toEqual(
      [
        '# Diff at Wed, 29 Oct 2026 09:12:40 GMT:',
        '',
        '- id: 3f9a0c12',
        '- author: Alice (<alice@example.com>)',
        '- comparing to: main@5c3198a20e',
        '- current timestamp: 1793265160',
        '',
        '## Description',
        '',
        'New audit added.',
        '',
        '## Offchain changes',
        '',
        '```diff',
        '    audits {',
        '+     org/repo:docs/audit-2026.pdf: {"sha":"abc123","size":4096}',
        '    }',
        '```',
        '',
      ].join('\n'),
    )
  })

  it('writes a placeholder description and no section for an empty diff', () => {
    const text = generateWatchDiffHistoryEntry({
      ...ENTRY,
      description: undefined,
      diff: [],
    })
    expect(text).toInclude(
      'Provide description of changes. This section will be preserved.',
    )
    expect(text).not.toInclude('## Offchain changes')
  })
})

describe(prependEntry.name, () => {
  it('puts the entry first, below the discovered.json hash line', () => {
    expect(prependEntry('', 'new\n')).toEqual('new\n')
    expect(prependEntry('# old\n', 'new\n')).toEqual('new\n\n# old\n')
    expect(
      prependEntry('Generated with discovered.json: 0x1\n\n# old\n', 'new\n'),
    ).toEqual('Generated with discovered.json: 0x1\n\nnew\n\n# old\n')
  })
})

describe(findUnmergedWatchEntry.name, () => {
  const main = entryText(28, 'Merged.', '## Offchain changes')

  it('keeps the id and description of the unmerged entry', () => {
    const onDisk = `${entryText(29, 'Keep me.', '## Offchain changes')}\n${main}`
    const unmerged = findUnmergedWatchEntry('d.md', onDisk, main, Logger.SILENT)
    expect(unmerged.id).toEqual('00000029')
    expect(unmerged.description?.trim()).toEqual('Keep me.')
  })

  it('refuses to drop an unmerged discovery entry', () => {
    const onDisk = `${entryText(29, 'Disco.', '## Watched changes')}\n${main}`
    expect(() =>
      findUnmergedWatchEntry('d.md', onDisk, main, Logger.SILENT),
    ).toThrow('Unmerged discovery entry in diffHistory.md')
  })

  it('refuses to overwrite an unmerged description-only discovery entry', () => {
    const sectionless = [
      '# Diff at 29 Oct 2026 09:00:00 GMT:',
      '',
      '- id: 00000029',
      '- current timestamp: 1',
      '',
      '## Description',
      '',
      'Manual discovery note.',
      '',
    ].join('\n')
    const onDisk = `${sectionless}\n${main}`
    expect(() =>
      findUnmergedWatchEntry('d.md', onDisk, main, Logger.SILENT),
    ).toThrow('Unmerged discovery entry in diffHistory.md')
  })
})

describe(assertNoUnmergedWatchEntry.name, () => {
  const main = entryText(28, 'Merged.', '## Watched changes')

  it('refuses to drop an unmerged watch entry when running discovery', () => {
    const onDisk = `${entryText(29, 'Watch.', '## Offchain changes')}\n${main}`
    expect(() => assertNoUnmergedWatchEntry('d.md', onDisk, main)).toThrow(
      'Unmerged watch entry in diffHistory.md',
    )
  })

  it('allows an unmerged discovery entry and merged watch entries', () => {
    const mainWithWatch = entryText(28, 'Merged watch.', '## Offchain changes')
    const onDisk = `${entryText(29, 'Disco.', '## Watched changes')}\n${mainWithWatch}`
    expect(() =>
      assertNoUnmergedWatchEntry('d.md', onDisk, mainWithWatch),
    ).not.toThrow()
  })
})

describe(writeWatchDiffHistory.name, () => {
  const main = entryText(28, 'Merged.', '## Offchain changes')
  let directory: string

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'watch-diff-history-'))
  })

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true })
  })

  // `l2b discover` then `l2b watch` with nothing new: the revert to main
  // would drop the discovery entry and its description.
  it('refuses an empty diff while an unmerged discovery entry is on disk', async () => {
    const file = join(directory, 'diffHistory.md')
    const onDisk = `${entryText(29, 'Disco.', '## Watched changes')}\n${main}`
    writeFileSync(file, onDisk)
    await expect(
      writeWatchDiffHistory(file, main, [], 1, undefined, Logger.SILENT),
    ).toBeRejectedWith('Unmerged discovery entry in diffHistory.md')
    expect(readFileSync(file, 'utf-8')).toEqual(onDisk)
  })

  it('reverts to main on an empty diff after an unmerged watch entry', async () => {
    const file = join(directory, 'diffHistory.md')
    writeFileSync(
      file,
      `${entryText(29, 'Watch.', '## Offchain changes')}\n${main}`,
    )
    await writeWatchDiffHistory(file, main, [], 1, undefined, Logger.SILENT)
    expect(readFileSync(file, 'utf-8')).toEqual(main)
  })

  it('skips creating diffHistory.md when there is no history on disk and diff is empty', async () => {
    const file = join(directory, 'diffHistory.md')
    await writeWatchDiffHistory(file, '', [], 1, undefined, Logger.SILENT)
    expect(existsSync(file)).toEqual(false)
  })
})

// Entries differ by day: the unmerged part of a file ends at the header line
// of the newest entry on main.
function entryText(day: number, description: string, section: string): string {
  return [
    `# Diff at ${day} Oct 2026 09:00:00 GMT:`,
    '',
    `- id: ${String(day).padStart(8, '0')}`,
    '- current timestamp: 1',
    '',
    '## Description',
    '',
    description,
    '',
    section,
    '',
    '```diff',
    '+ x',
    '```',
    '',
  ].join('\n')
}
