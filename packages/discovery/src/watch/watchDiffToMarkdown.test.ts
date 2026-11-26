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

  it('keeps a root `true` that has no path to stand in for it', () => {
    const markdown = watchDiffToMarkdown([
      { key: 'added', changes: [{ path: [], after: true }] },
      { key: 'removed', changes: [{ path: [], before: true }] },
    ])
    expect(markdown).toInclude('+     true\n')
    expect(markdown).toInclude('-     true\n')
  })

  it('lists a large new value one level down, collapsing long children', () => {
    const items = Object.fromEntries(
      Array.from({ length: 30 }, (_, i) => [`item:${i}`, { s: 'ok' }]),
    )
    const markdown = watchDiffToMarkdown([
      { key: 'files', changes: [{ path: [], after: { items, note: 'x' } }] },
    ])
    expect(markdown).toEqual(
      [
        '```diff',
        '    files {',
        '+     items: {…30 keys}',
        '+     note: "x"',
        '    }',
        '```',
      ].join('\n'),
    )
  })

  it('truncates cleanly with a closing fence when exceeding maxLength', () => {
    const markdown = watchDiffToMarkdown(
      [
        {
          key: 'audits',
          changes: Array.from({ length: 20 }, (_, i) => ({
            path: [`repo:docs/audit-${i}.pdf`],
            after: { sha: 'a'.repeat(40), size: 1234 },
          })),
        },
      ],
      120,
    )
    expect(markdown.length).toEqual(120)
    expect(markdown.endsWith('\n... (message too long)\n```')).toEqual(true)
  })
})
