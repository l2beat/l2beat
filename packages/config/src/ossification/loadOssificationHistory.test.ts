import { expect } from 'earl'
import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { readDiffHistory } from './loadOssificationHistory'

describe(readDiffHistory.name, () => {
  it('reads no ossification change from an offchain changes entry', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ossification-'))
    const file = join(directory, 'diffHistory.md')
    writeFileSync(
      file,
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '- current timestamp: 1777994288',
        '',
        '## Offchain changes',
        '',
        '```diff',
        '    contract A (eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {',
        '      values.$implementation:',
        '-        "0xa"',
        '+        "0xb"',
        '    }',
        '```',
        '',
      ].join('\n'),
    )
    try {
      expect(readDiffHistory(file)).toEqual([])
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
