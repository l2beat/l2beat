import { ensureSyntaxTree, foldable } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { classHighlighter, highlightTree } from '@lezer/highlight'
import { expect } from 'earl'
import { solidity } from './solidity'

describe('solidity', () => {
  describe('highlighting', () => {
    it('tells keywords, type names and identifiers apart', () => {
      expect(highlight('function f(uint256 amount) external')).toEqual([
        ['function', 'keyword'],
        ['(', 'punctuation'],
        ['uint256', 'typeName'],
        [')', 'punctuation'],
        ['external', 'keyword'],
      ])
    })

    it('colors a symbol run only when the whole run is an operator', () => {
      expect(highlight('a <<= b => c')).toEqual([['<<=', 'operator']])
    })

    it('colors semicolons like brackets', () => {
      expect(highlight('x;')).toEqual([[';', 'punctuation']])
    })

    it('reads decimal, hex and float numbers', () => {
      expect(highlight('1_000 0xdead_BEEF .5 1.5e-3')).toEqual([
        ['1_000', 'number'],
        ['0xdead_BEEF', 'number'],
        ['.5', 'number'],
        ['1.5e-3', 'number'],
      ])
    })

    it('reads double quoted strings with escapes, unterminated ones too', () => {
      expect(highlight('"a\\"b" x "open')).toEqual([
        ['"a\\"b"', 'string'],
        ['"open', 'string'],
      ])
    })

    it('leaves single quoted strings uncolored, like Monaco did', () => {
      expect(highlight("'a'")).toEqual([])
    })

    it('marks NatSpec tags inside line comments', () => {
      expect(highlight('/// @notice Hi @dev')).toEqual([
        ['/// ', 'comment'],
        ['@notice', 'annotation'],
        [' Hi ', 'comment'],
        ['@dev', 'annotation'],
      ])
    })

    it('carries a block comment across lines', () => {
      expect(highlight('/* a\n * @param b */ c')).toEqual([
        ['/* a', 'comment'],
        [' * ', 'comment'],
        ['@param', 'annotation'],
        [' b */', 'comment'],
      ])
    })

    it('ends a line comment at the end of its line', () => {
      expect(highlight('// a\nreturn')).toEqual([
        ['// a', 'comment'],
        ['return', 'keyword'],
      ])
    })
  })

  describe('folding', () => {
    const source = [
      'contract A {',
      '    function f() {',
      '        x;',
      '',
      '        y;',
      '    }',
      '}',
    ].join('\n')

    it('folds the deeper indented lines after a line', () => {
      expect(fold(source, 2)).toEqual(['    function f() {', '        y;'])
      expect(fold(source, 1)).toEqual(['contract A {', '    }'])
    })

    it('does not fold a line followed by shallower lines', () => {
      expect(fold(source, 3)).toEqual(undefined)
      expect(fold(source, 6)).toEqual(undefined)
    })
  })
})

const CLASS_TO_STYLE: Record<string, string> = {
  'tok-keyword': 'keyword',
  'tok-typeName': 'typeName',
  'tok-operator': 'operator',
  'tok-punctuation': 'punctuation',
  'tok-number': 'number',
  'tok-string': 'string',
  'tok-comment': 'comment',
  'tok-meta': 'annotation',
}

// Brackets highlight as `punctuation` through classHighlighter, which has no
// class of its own for them, and annotations as `meta`.
function highlight(source: string): [string, string][] {
  const state = EditorState.create({ doc: source, extensions: solidity })
  const tree = ensureSyntaxTree(state, source.length, 5000)
  if (tree === null) {
    throw new Error('Syntax tree not ready')
  }
  const result: [string, string][] = []
  highlightTree(tree, classHighlighter, (from, to, classes) => {
    const style = CLASS_TO_STYLE[classes]
    if (style === undefined) {
      throw new Error('Unexpected class', { cause: { classes } })
    }
    result.push([source.slice(from, to), style])
  })
  return result
}

function fold(
  source: string,
  lineNumber: number,
): [string, string] | undefined {
  const state = EditorState.create({ doc: source, extensions: solidity })
  const line = state.doc.line(lineNumber)
  const range = foldable(state, line.from, line.to)
  if (range === null) {
    return undefined
  }
  return [state.doc.lineAt(range.from).text, state.doc.lineAt(range.to).text]
}
