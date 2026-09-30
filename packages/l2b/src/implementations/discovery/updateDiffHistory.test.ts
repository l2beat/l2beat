import { Logger } from '@l2beat/backend-tools'
import { DiffHistoryParser } from '@l2beat/discovery'
import { expect } from 'earl'
import { findUnmergedEntry } from './updateDiffHistory'

const PATH = 'packages/config/src/projects/example/diffHistory.md'

const MAIN = [
  'Generated with discovered.json: 0xaaaa',
  '',
  '# Diff at Mon, 04 May 2026 10:00:00 GMT:',
  '',
  '- current timestamp: 1777888888',
  '',
  '## Description',
  '',
  'Merged.',
  '',
].join('\n')

const UNMERGED = [
  'Generated with discovered.json: 0xbbbb',
  '',
  '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
  '',
  '- id: 1a2b3c4d',
  '- current timestamp: 1777994288',
  '',
  '## Description',
  '',
  'Unmerged.',
  '',
  '## Watched changes',
  '',
].join('\n')

describe(findUnmergedEntry.name, () => {
  it('carries the id and description of the entry above main', () => {
    const disk = `${UNMERGED}\n${MAIN}`
    const entry = findUnmergedEntry(PATH, disk, MAIN, Logger.SILENT)
    expect(entry.id).toEqual('1a2b3c4d')
    expect(entry.description?.trim()).toEqual('Unmerged.')
  })

  it('carries nothing when the file equals main', () => {
    const entry = findUnmergedEntry(PATH, MAIN, MAIN, Logger.SILENT)
    expect(entry).toEqual({ description: undefined, id: undefined })
  })

  it('treats the whole file as unmerged when main has no history', () => {
    const entry = findUnmergedEntry(PATH, UNMERGED, '', Logger.SILENT)
    expect(entry.id).toEqual('1a2b3c4d')
  })

  it('carries the old hash of an unmerged entry without an id line', () => {
    const legacy = UNMERGED.replace('- id: 1a2b3c4d\n', '')
    const disk = `${legacy}\n${MAIN}`
    const entry = findUnmergedEntry(PATH, disk, MAIN, Logger.SILENT)
    const expected = new DiffHistoryParser().parse(legacy)[0]!.id
    expect(entry.id).toEqual(expected)
  })

  it('throws when the file no longer contains the newest entry of main', () => {
    const behind = MAIN.replace('Mon, 04 May', 'Sun, 03 May')
    expect(() =>
      findUnmergedEntry(PATH, `${UNMERGED}\n${behind}`, MAIN, Logger.SILENT),
    ).toThrow()
  })
})
