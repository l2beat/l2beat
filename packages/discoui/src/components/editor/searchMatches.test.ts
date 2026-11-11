import { SearchQuery } from '@codemirror/search'
import { EditorSelection, EditorState } from '@codemirror/state'
import { expect } from 'earl'
import {
  counterText,
  findMatches,
  firstMatchFrom,
  MATCH_COUNT_MAX,
} from './searchMatches'

describe(findMatches.name, () => {
  it('lists every match in order', () => {
    const state = EditorState.create({ doc: 'foo bar foo\nfoo' })
    const matches = findMatches(state, new SearchQuery({ search: 'foo' }))
    expect(matches).toEqual({
      froms: [0, 8, 12],
      tos: [3, 11, 15],
      truncated: false,
    })
  })

  it('stops counting at the limit', () => {
    const state = EditorState.create({ doc: 'a'.repeat(MATCH_COUNT_MAX + 1) })
    const matches = findMatches(state, new SearchQuery({ search: 'a' }))
    expect(matches.froms.length).toEqual(MATCH_COUNT_MAX)
    expect(matches.truncated).toEqual(true)
  })

  it("finds the same plain text matches as CodeMirror's own cursor", () => {
    const doc = [
      'Foo foo FOO food (a.b) a*b axb [x] {y} $z ^w | q?',
      'tab\there back\\slash end',
      'next line foo',
    ].join('\n')
    const state = EditorState.create({ doc })
    const searches = [
      'foo',
      'a.b',
      'a*b',
      '(a.b)',
      '[x]',
      '{y}',
      '$z',
      '^w',
      '| q?',
    ]
    const escaped = ['\\t', '\\\\', 'end\\nnext', 'end\nnext']
    for (const search of [...searches, ...escaped]) {
      for (const caseSensitive of [false, true]) {
        for (const wholeWord of [false, true]) {
          for (const literal of [false, true]) {
            const query = new SearchQuery({
              search,
              caseSensitive,
              wholeWord,
              literal,
            })
            const expected = { froms: [] as number[], tos: [] as number[] }
            const cursor = query.getCursor(state)
            for (let next = cursor.next(); !next.done; next = cursor.next()) {
              expected.froms.push(next.value.from)
              expected.tos.push(next.value.to)
            }
            expect({
              search,
              caseSensitive,
              wholeWord,
              literal,
              ...findMatches(state, query),
            }).toEqual({
              search,
              caseSensitive,
              wholeWord,
              literal,
              ...expected,
              truncated: false,
            })
          }
        }
      }
    }
  })

  it('finds nothing for an invalid regular expression', () => {
    const state = EditorState.create({ doc: '((' })
    const query = new SearchQuery({ search: '(', regexp: true })
    expect(findMatches(state, query).froms).toEqual([])
  })
})

describe(firstMatchFrom.name, () => {
  const state = EditorState.create({ doc: 'foo bar foo' })
  const query = new SearchQuery({ search: 'foo' })

  it('keeps a match that starts at the position', () => {
    expect(firstMatchFrom(state, query, 8)).toEqual(
      EditorSelection.range(8, 11),
    )
  })

  it('moves to the next match', () => {
    expect(firstMatchFrom(state, query, 1)).toEqual(
      EditorSelection.range(8, 11),
    )
  })

  it('wraps around past the last match', () => {
    expect(firstMatchFrom(state, query, 9)).toEqual(EditorSelection.range(0, 3))
  })

  it('finds nothing without a match', () => {
    const missing = new SearchQuery({ search: 'baz' })
    expect(firstMatchFrom(state, missing, 0)).toEqual(undefined)
  })
})

describe(counterText.name, () => {
  const state = EditorState.create({ doc: 'foo bar foo' })

  function text(search: string, from: number, to: number) {
    const query = new SearchQuery({ search })
    const matches = findMatches(state, query)
    return counterText(query, matches, EditorSelection.range(from, to))
  }

  it('numbers the selected match', () => {
    expect(text('foo', 8, 11)).toEqual('2 of 2')
  })

  it('marks a selection off the matches', () => {
    expect(text('foo', 4, 7)).toEqual('? of 2')
    expect(text('foo', 8, 10)).toEqual('? of 2')
  })

  it('reports no results', () => {
    expect(text('baz', 0, 0)).toEqual('No results')
  })

  it('stays empty without a query', () => {
    expect(text('', 0, 0)).toEqual('')
  })

  it('reports an invalid regular expression', () => {
    const query = new SearchQuery({ search: '(', regexp: true })
    const matches = findMatches(state, query)
    expect(counterText(query, matches, EditorSelection.cursor(0))).toEqual(
      'Invalid',
    )
  })

  it('shows that the count stopped at the limit', () => {
    const query = new SearchQuery({ search: 'foo' })
    const matches = { froms: [0, 8], tos: [3, 11], truncated: true }
    expect(counterText(query, matches, EditorSelection.range(0, 3))).toEqual(
      '1 of 2+',
    )
  })
})
