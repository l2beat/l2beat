import { ensureSyntaxTree, getIndentation } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { highlightTree, tagHighlighter, tags } from '@lezer/highlight'
import { expect } from 'earl'
import { jsonSyntax } from './jsonSyntax'

describe('jsonSyntax', () => {
  it('tells keys from string values', () => {
    expect(highlight('{ "a": "b" }')).toEqual([
      ['{', 'brace'],
      ['"a"', 'key'],
      [':', 'colon'],
      ['"b"', 'string'],
      ['}', 'brace'],
    ])
  })

  it('treats strings in arrays as values and keys after commas as keys', () => {
    expect(highlight('{ "a": ["x", 1], "b": true }')).toEqual([
      ['{', 'brace'],
      ['"a"', 'key'],
      [':', 'colon'],
      ['[', 'square'],
      ['"x"', 'string'],
      [',', 'comma'],
      ['1', 'number'],
      [']', 'square'],
      [',', 'comma'],
      ['"b"', 'key'],
      [':', 'colon'],
      ['true', 'literal'],
      ['}', 'brace'],
    ])
  })

  it('reads line and block comments, and escapes in strings', () => {
    expect(highlight('// a\n/* b\nc */ "d\\"e"')).toEqual([
      ['// a', 'comment'],
      ['/* b', 'comment'],
      ['c */', 'comment'],
      ['"d\\"e"', 'string'],
    ])
  })

  it('indents one level per open bracket', () => {
    const state = EditorState.create({
      doc: '{\n"a": [\n1\n]\n}',
      extensions: jsonSyntax,
    })
    const indents = [2, 3, 4, 5].map((number) =>
      getIndentation(state, state.doc.line(number).from),
    )
    expect(indents).toEqual([2, 4, 2, 0])
  })
})

const highlighter = tagHighlighter([
  { tag: tags.brace, class: 'brace' },
  { tag: tags.squareBracket, class: 'square' },
  { tag: tags.propertyName, class: 'key' },
  { tag: tags.definitionOperator, class: 'colon' },
  { tag: tags.separator, class: 'comma' },
  { tag: tags.string, class: 'string' },
  { tag: tags.number, class: 'number' },
  { tag: [tags.bool, tags.null], class: 'literal' },
  { tag: tags.comment, class: 'comment' },
])

function highlight(source: string): [string, string][] {
  const state = EditorState.create({ doc: source, extensions: jsonSyntax })
  const tree = ensureSyntaxTree(state, source.length, 5000)
  if (tree === null) {
    throw new Error('Syntax tree not ready')
  }
  const result: [string, string][] = []
  highlightTree(tree, highlighter, (from, to, classes) => {
    result.push([source.slice(from, to), classes])
  })
  return result
}
