import { expect } from 'earl'
import { watchDiffToMarkdown } from './watchDiffToMarkdown'

describe(watchDiffToMarkdown.name, () => {
  it('writes one block per watch key with removals before additions', () => {
    const markdown = watchDiffToMarkdown([
      {
        key: 'audits',
        changes: [
          { path: ['a:x.pdf', 'sha'], before: 'aa', after: 'bb' },
          { path: ['a:y.pdf'], before: { sha: 'cc' } },
        ],
      },
      { key: 'version', changes: [{ path: [], before: '1.0', after: '1.1' }] },
    ])
    expect(markdown).toEqual(
      [
        '```diff',
        '    audits {',
        '-     a:x.pdf.sha: "aa"',
        '+     a:x.pdf.sha: "bb"',
        '-     a:y.pdf: {"sha":"cc"}',
        '    }',
        '    version {',
        '-     "1.0"',
        '+     "1.1"',
        '    }',
        '```',
      ].join('\n'),
    )
  })

  it('keeps `true` of a changed flag, and short hashes in full', () => {
    const markdown = watchDiffToMarkdown([
      {
        key: 'flags',
        changes: [
          { path: ['paused'], before: false, after: true },
          { path: ['eip155:1:0x1234'], after: true },
        ],
      },
    ])
    expect(markdown).toInclude('-     paused: false\n+     paused: true')
    expect(markdown).toInclude('+     eip155:1:0x1234\n')
  })

  it('lists a large new value one level down, collapsing long children', () => {
    const leads = Object.fromEntries(
      Array.from({ length: 30 }, (_, i) => [`dfhl:${i}.sol`, { s: 'handled' }]),
    )
    const markdown = watchDiffToMarkdown([
      { key: 'dataset', changes: [{ path: [], after: { leads, note: 'x' } }] },
    ])
    expect(markdown).toEqual(
      [
        '```diff',
        '    dataset {',
        '+     leads: {…30 keys}',
        '+     note: "x"',
        '    }',
        '```',
      ].join('\n'),
    )
  })
})
