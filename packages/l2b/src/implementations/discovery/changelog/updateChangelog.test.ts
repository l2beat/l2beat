import { getDiffHistoryEntryId } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { updateChangelog } from './updateChangelog'

function entry(date: string, timestamp: number, block: string[]): string {
  return [
    `# Diff at ${date}:`,
    '',
    '- author: someone (<someone@example.com>)',
    `- comparing to: main@deadbeef block: ${timestamp - 100}`,
    `- current timestamp: ${timestamp}`,
    '',
    '## Description',
    '',
    'Something happened.',
    '',
    '## Watched changes',
    '',
    '```diff',
    ...block,
    '```',
    '',
  ].join('\n')
}

const OLD_DATE = 'Mon, 19 Aug 2026 12:34:56 GMT'
const NEW_DATE = 'Tue, 20 Aug 2026 09:00:00 GMT'
const OLD_ID = getDiffHistoryEntryId(OLD_DATE, {
  kind: 'timestamp',
  value: 1755600100,
})
const NEW_ID = getDiffHistoryEntryId(NEW_DATE, {
  kind: 'timestamp',
  value: 1755680000,
})
const OLD_BLOCK = [
  '    contract Example (eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {',
  '      values.x:',
  '-        "1"',
  '+        "2"',
  '    }',
]
const NEW_DIFF = [
  {
    name: 'Example',
    address: ChainSpecificAddress(
      'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
    ),
    addressType: 'Contract' as const,
    diff: [{ key: 'values.x', before: '"2"', after: '"3"' }],
  },
]

describe(updateChangelog.name, () => {
  let folder: string
  beforeEach(() => {
    folder = mkdtempSync(path.join(tmpdir(), 'changelog-'))
  })
  afterEach(() => {
    rmSync(folder, { recursive: true, force: true })
  })

  const read = () =>
    JSON.parse(readFileSync(path.join(folder, 'changelog.json'), 'utf-8'))

  it('does nothing for a project that has not opted in', () => {
    writeFileSync(
      path.join(folder, 'diffHistory.md'),
      entry(OLD_DATE, 1755600100, OLD_BLOCK),
    )
    updateChangelog(folder, undefined, () => {})
    expect(() => read()).toThrow()
  })

  it('records the new entry from the diff and keeps older entries', () => {
    writeFileSync(
      path.join(folder, 'diffHistory.md'),
      entry(NEW_DATE, 1755680000, [
        '    contract ignored (eth:0x1) {',
        '    }',
      ]) +
        '\n' +
        entry(OLD_DATE, 1755600100, OLD_BLOCK),
    )
    writeFileSync(path.join(folder, 'ossification.json'), '{}')
    writeFileSync(
      path.join(folder, 'changelog.json'),
      JSON.stringify({
        formatVersion: 1,
        entries: [
          {
            id: OLD_ID,
            timestamp: 1755600100,
            changes: [
              {
                address: 'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
                fields: [{ key: 'values.x', removed: ['"1"'], added: ['"2"'] }],
              },
            ],
          },
        ],
      }),
    )

    updateChangelog(folder, { timestamp: 1755680000, diff: NEW_DIFF }, () => {})

    const changelog = read()
    expect(changelog.entries.map((e: { id: string }) => e.id)).toEqual([
      NEW_ID,
      OLD_ID,
    ])
    // the top entry comes from the diff, not from the rendered block
    expect(changelog.entries[0].changes).toEqual([
      {
        address: 'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
        fields: [{ key: 'values.x', removed: ['"2"'], added: ['"3"'] }],
      },
    ])
  })

  it('drops entries that are no longer in the markdown (reverted run)', () => {
    writeFileSync(
      path.join(folder, 'diffHistory.md'),
      entry(OLD_DATE, 1755600100, OLD_BLOCK),
    )
    writeFileSync(
      path.join(folder, 'changelog.json'),
      JSON.stringify({
        formatVersion: 1,
        entries: [
          { id: NEW_ID, timestamp: 1755680000, changes: [] },
          { id: OLD_ID, timestamp: 1755600100, changes: [] },
        ],
      }),
    )
    updateChangelog(folder, undefined, () => {})
    expect(read().entries.map((e: { id: string }) => e.id)).toEqual([OLD_ID])
  })

  it('backfills an entry that arrived as markdown from upstream', () => {
    // a merge brings in someone else's diffHistory entry; only our own
    // entries are in changelog.json
    writeFileSync(
      path.join(folder, 'diffHistory.md'),
      entry(NEW_DATE, 1755680000, OLD_BLOCK) +
        '\n' +
        entry(OLD_DATE, 1755600100, OLD_BLOCK),
    )
    writeFileSync(path.join(folder, 'ossification.json'), '{}')
    writeFileSync(
      path.join(folder, 'changelog.json'),
      JSON.stringify({
        formatVersion: 1,
        entries: [{ id: OLD_ID, timestamp: 1755600100, changes: [] }],
      }),
    )
    updateChangelog(folder, undefined, () => {})
    const changelog = read()
    expect(changelog.entries.map((e: { id: string }) => e.id)).toEqual([
      NEW_ID,
      OLD_ID,
    ])
    expect(changelog.entries[0].changes).toEqual([
      {
        address: 'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
        fields: [{ key: 'values.x', removed: ['"1"'], added: ['"2"'] }],
      },
    ])
  })

  it('migrates the existing markdown on the first run after opting in', () => {
    writeFileSync(
      path.join(folder, 'diffHistory.md'),
      entry(OLD_DATE, 1755600100, OLD_BLOCK),
    )
    writeFileSync(path.join(folder, 'ossification.json'), '{}')
    updateChangelog(folder, undefined, () => {})
    expect(read().entries).toEqual([
      {
        id: OLD_ID,
        timestamp: 1755600100,
        changes: [
          {
            address: 'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
            fields: [{ key: 'values.x', removed: ['"1"'], added: ['"2"'] }],
          },
        ],
      },
    ])
  })
})
