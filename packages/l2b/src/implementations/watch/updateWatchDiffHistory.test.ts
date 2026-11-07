import { Logger } from '@l2beat/backend-tools'
import type { WatchDiff } from '@l2beat/discovery'
import { expect } from 'earl'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import {
  findUnmergedWatchEntry,
  generateWatchDiffHistoryEntry,
  prependEntry,
  writeWatchDiffHistory,
} from './updateWatchDiffHistory'

const TX = `0x8d2f${'0'.repeat(56)}c41a`
const MOKE = 'dfhl:src/test/2026-10/MOKE_exp.sol'
const MOKE_URL =
  'https://github.com/SunWeb3Sec/DeFiHackLabs/blob/main/src/test/2026-10/MOKE_exp.sol'

const DIFF: WatchDiff[] = [
  {
    key: 'dataset',
    changes: [
      { path: ['incidents', `eip155:56:${TX}`], after: 'MOKE' },
      {
        path: ['leads', MOKE],
        after: { status: 'handled', title: 'MOKE', url: MOKE_URL },
      },
      { path: ['recorded', MOKE], after: true },
      { path: ['recorded', `eip155:56:${TX}`], after: true },
      {
        path: ['recorded', 'https://example.com/moke-postmortem'],
        after: true,
      },
    ],
  },
]

const ENTRY = {
  date: 'Wed, 29 Oct 2026 09:12:40 GMT',
  id: '3f9a0c12',
  author: { name: 'Basti', email: 'basti@example.com' },
  mainBranchHash: '5c3198a20e',
  timestamp: 1793265160,
  description: 'MOKE added as incident.',
  diff: DIFF,
}

describe(generateWatchDiffHistoryEntry.name, () => {
  it('writes the metadata, description and offchain changes', () => {
    expect(generateWatchDiffHistoryEntry(ENTRY)).toEqual(
      [
        '# Diff at Wed, 29 Oct 2026 09:12:40 GMT:',
        '',
        '- id: 3f9a0c12',
        '- author: Basti (<basti@example.com>)',
        '- comparing to: main@5c3198a20e',
        '- current timestamp: 1793265160',
        '',
        '## Description',
        '',
        'MOKE added as incident.',
        '',
        '## Offchain changes',
        '',
        '```diff',
        '    dataset {',
        '+     incidents.eip155:56:0x8d2f…c41a: "MOKE"',
        `+     leads.${MOKE}: {"status":"handled","title":"MOKE","url":"${MOKE_URL}"}`,
        `+     recorded.${MOKE}`,
        '+     recorded.eip155:56:0x8d2f…c41a',
        '+     recorded.https://example.com/moke-postmortem',
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
