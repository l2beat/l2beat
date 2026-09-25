import { expect } from 'earl'
import { diffsToText } from './text'
import type { Project } from './types'

describe(diffsToText.name, () => {
  const commits = { commitBefore: 'a'.repeat(40), commitAfter: 'b'.repeat(40) }

  it('lists added and removed projects with all their fields', () => {
    const text = diffsToText({
      ...commits,
      projectsBefore: [{ id: 'old', name: 'Old', display: null }],
      projectsAfter: [{ id: 'new', name: 'New', colors: { primary: '#fff' } }],
    })
    expect(text).toInclude('| new | added | name, colors |')
    expect(text).toInclude('| old | removed | name |')
    expect(text).toInclude(
      '## new [ADDED]\n\n+ name:\n    "New"\n\n+ colors:\n    { "primary": "#fff" }',
    )
    expect(text).toInclude('## old [REMOVED]\n\n- name:\n    "Old"')
  })

  it('summarizes discovery updates of an added project', () => {
    const entry = {
      id: 'abc',
      timestamp: 1789656139,
      description: 'Deployed.',
      isHighSeverity: false,
      changeCount: 3,
      sections: [{ kind: 'watched-changes', body: 'x'.repeat(5000) }],
    }
    const text = diffsToText({
      ...commits,
      projectsBefore: [],
      projectsAfter: [{ id: 'new', name: 'New', discoveryUpdates: [entry] }],
    })
    expect(text).toInclude(
      '+ discoveryUpdates:\n    2026-09-17 (3 changes): Deployed.',
    )
    expect(text).not.toInclude('xxxx')
  })

  it('reports value changes by keyed path', () => {
    const before = project({
      contracts: {
        ethereum: [{ name: 'Bridge', address: '0x1', verified: true }],
      },
    })
    const after = project({
      contracts: {
        ethereum: [{ name: 'Bridge', address: '0x2', verified: true }],
      },
    })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('| p | modified | contracts (1) |')
    expect(text).toInclude(
      '### contracts (1 change)\n\n~ contracts.ethereum[name=Bridge].address: "0x1" -> "0x2"',
    )
  })

  it('reports added and removed array elements', () => {
    const before = project({ risks: [{ title: 'A' }, { title: 'B' }] })
    const after = project({ risks: [{ title: 'B' }, { title: 'C' }] })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('- risks[title=A]: {"title":"A"}')
    expect(text).toInclude('+ risks[title=C]: {"title":"C"}')
  })

  it('collapses a rediscovery into one line and ignores baseTimestamp', () => {
    const before = project({
      discoveryInfo: { baseTimestamp: 1789000000, hasDiscoUi: true },
    })
    const after = project({
      discoveryInfo: { baseTimestamp: 1789656139, hasDiscoUi: true },
    })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('| p | modified | rediscovered |')
    expect(text).toInclude('Rediscovered: 2026-09-10 -> 2026-09-17')
    expect(text).not.toInclude('baseTimestamp')
  })

  it('summarizes new discovery updates instead of diffing them', () => {
    const entry = {
      id: 'abc',
      timestamp: 1789656139,
      description: 'Threshold raised.\n\nSecond paragraph.',
      isHighSeverity: true,
      changeCount: 1,
      sections: [{ kind: 'watched-changes', body: 'x'.repeat(5000) }],
    }
    const before = project({ discoveryUpdates: [] })
    const after = project({ discoveryUpdates: [entry] })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('| p | modified | 1 discovery update |')
    expect(text).toInclude(
      '+ 2026-09-17 [HIGH SEVERITY] (1 change): Threshold raised. Second paragraph.',
    )
    expect(text).not.toInclude('xxxx')
  })

  it('shows only changed words of long strings', () => {
    const filler =
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor '
    const before = project({
      display: { description: `${filler}version one of the text ${filler}` },
    })
    const after = project({
      display: { description: `${filler}version two of the text ${filler}` },
    })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude(
      '~ display.description:\n    ... sed do eiusmod tempor version [-one-]{+two+} of the text lorem ipsum ...',
    )
  })

  it('names a changed element by its pre-change position when the array shifted', () => {
    const before = project({ items: [{ name: 'A', value: 1 }] })
    const after = project({
      items: [
        { name: 'X', value: 0 },
        { name: 'A', value: 2 },
      ],
    })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('+ items[name=X]: {"name":"X","value":0}')
    expect(text).toInclude('~ items[name=A].value: 1 -> 2')
  })

  it('resolves a nested create under a shifted outer element', () => {
    const before = project({
      items: [{ name: 'R' }, { name: 'A', values: [] }],
    })
    const after = project({ items: [{ name: 'A', values: [{ name: 'V' }] }] })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('- items[name=R]: {"name":"R"}')
    expect(text).toInclude('+ items[name=A].values[name=V]: {"name":"V"}')
  })

  it('reports edits to an existing discovery update', () => {
    const entry = {
      id: 'abc',
      timestamp: 1789656139,
      description: 'Old text.',
      isHighSeverity: false,
      changeCount: 1,
    }
    const before = project({ discoveryUpdates: [entry] })
    const after = project({
      discoveryUpdates: [
        { ...entry, description: 'New text.', isHighSeverity: true },
      ],
    })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('| p | modified | 1 discovery update |')
    expect(text).toInclude(
      '~ discoveryUpdates[id=abc].description: "Old text." -> "New text."',
    )
    expect(text).toInclude(
      '~ discoveryUpdates[id=abc].isHighSeverity: false -> true',
    )
  })

  it('prints an unknown date for legacy discovery updates without a timestamp', () => {
    const entry = {
      id: 'abc',
      timestamp: null,
      description: 'Legacy.',
      isHighSeverity: false,
      changeCount: 1,
    }
    const before = project({ discoveryUpdates: [] })
    const after = project({ discoveryUpdates: [entry] })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('+ unknown date (1 change): Legacy.')
    expect(text).not.toInclude('1970')
  })

  it('reports a base timestamp that appears or disappears', () => {
    const before = project({ discoveryInfo: { hasDiscoUi: false } })
    const after = project({
      discoveryInfo: { baseTimestamp: 1789656139, hasDiscoUi: false },
    })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).not.toInclude('Rediscovered')
    expect(text).toInclude('+ discoveryInfo.baseTimestamp: 1789656139')
  })

  it('treats a missing column and a null column as equal', () => {
    const before = project({ display: { name: 'Same' } })
    const after = project({ display: { name: 'Same' }, newColumn: null })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('## Summary: 0 projects')
  })

  it('reports reordered discovery updates', () => {
    const a = {
      id: 'a',
      timestamp: 1789656139,
      description: 'A',
      isHighSeverity: false,
      changeCount: 1,
    }
    const b = {
      id: 'b',
      timestamp: 1789656139,
      description: 'B',
      isHighSeverity: false,
      changeCount: 1,
    }
    const before = project({ discoveryUpdates: [a, b] })
    const after = project({ discoveryUpdates: [b, a] })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('| p | modified | discovery updates reordered |')
    expect(text).toInclude('~ order: [a, b] -> [b, a]')
  })

  it('shows whitespace-only changes in long strings', () => {
    const filler =
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor '
    const before = project({
      display: { description: `${filler}first line second line ${filler}` },
    })
    const after = project({
      display: { description: `${filler}first line\n\nsecond line ${filler}` },
    })
    const text = diffsToText({
      ...commits,
      projectsBefore: [before],
      projectsAfter: [after],
    })
    expect(text).toInclude('line[- -]{+\\n\\n+}second')
  })

  it('omits projects without differences', () => {
    const same = project({ display: { name: 'Same' } })
    const text = diffsToText({
      ...commits,
      projectsBefore: [same],
      projectsAfter: [same],
    })
    expect(text).toInclude('## Summary: 0 projects')
    expect(text).not.toInclude('## p')
  })
})

function project(fields: Record<string, unknown>): Project {
  return { id: 'p', ...fields }
}
