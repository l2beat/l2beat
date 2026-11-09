import { expect } from 'earl'
import { evaluateWhen, parseWhen, type WhenContext } from './when'

// Each expression is parsed once and evaluated against every combination of
// the contexts it uses, compared with the same logic written in TypeScript.
describe('when', () => {
  const CASES: [string, (c: WhenContext) => boolean][] = [
    ['inputFocus', (c) => c.inputFocus],
    ['!inputFocus', (c) => !c.inputFocus],
    ['!!inputFocus', (c) => c.inputFocus],
    [
      'nodesPanelActive && !searchOpen && !inputFocus',
      (c) => c.nodesPanelActive && !c.searchOpen && !c.inputFocus,
    ],
    // && binds tighter than ||.
    [
      'inputFocus || editorFocus && searchOpen',
      (c) => c.inputFocus || (c.editorFocus && c.searchOpen),
    ],
    [
      '(inputFocus || editorFocus) && searchOpen',
      (c) => (c.inputFocus || c.editorFocus) && c.searchOpen,
    ],
    ['!(inputFocus || editorFocus)', (c) => !(c.inputFocus || c.editorFocus)],
  ]

  for (const [source, expected] of CASES) {
    it(`evaluates ${source}`, () => {
      const parsed = parseWhen(source)
      if (!parsed.success) {
        throw new Error('Expected the expression to parse')
      }
      for (const context of allContexts()) {
        expect(evaluateWhen(parsed.value, context)).toEqual(expected(context))
      }
    })
  }

  it('keeps the trimmed source', () => {
    const parsed = parseWhen('  !inputFocus ')
    expect(parsed.success && parsed.value.source).toEqual('!inputFocus')
  })

  it('rejects malformed expressions and unknown contexts', () => {
    const invalid = [
      '',
      '   ',
      'inputFocus &&',
      '&& inputFocus',
      'inputFocus editorFocus',
      '(inputFocus',
      'inputFocus)',
      '()',
      'inputFocus & editorFocus',
      'terminalFocus',
      '!',
      'a'.repeat(300),
    ]
    for (const source of invalid) {
      expect(parseWhen(source).success).toEqual(false)
    }
  })
})

function allContexts(): WhenContext[] {
  const contexts: WhenContext[] = []
  for (let bits = 0; bits < 32; bits++) {
    contexts.push({
      inputFocus: (bits & 1) !== 0,
      editorFocus: (bits & 2) !== 0,
      nodesPanelActive: (bits & 4) !== 0,
      searchOpen: (bits & 8) !== 0,
      controlFocus: (bits & 16) !== 0,
    })
  }
  return contexts
}
