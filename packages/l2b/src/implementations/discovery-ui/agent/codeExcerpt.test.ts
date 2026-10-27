import { expect } from 'earl'
import { excerptAt } from './codeExcerpt'

const CODE = [
  'contract Rollup {',
  '  function finalize(uint256 n) external onlyOperator {',
  '    if (n == 0) {',
  '      revert Empty();',
  '    }',
  '    finalized = n;',
  '  }',
  '  uint256 public finalized;',
  '}',
].join('\n')

describe(excerptAt.name, () => {
  it('gives the whole function a header opens', () => {
    const offset = CODE.indexOf('function finalize')
    expect(excerptAt(CODE, offset, 2)).toEqual({
      line: 2,
      lines: CODE.split('\n').slice(1, 7),
      isCut: false,
    })
  })

  it('gives the lines after a snippet that opens no block', () => {
    const offset = CODE.indexOf('finalized = n')
    expect(excerptAt(CODE, offset, 6).lines).toEqual(CODE.split('\n').slice(5))
  })

  it('says the lines after a statement are cut from the rest', () => {
    const body = Array.from({ length: 30 }, (_, i) => `  x = ${i};`)
    const code = ['function f() {', ...body, '}'].join('\n')
    const excerpt = excerptAt(code, code.indexOf('x = 0'), 2)
    expect(excerpt.lines.length).toEqual(12)
    expect(excerpt.isCut).toEqual(true)
  })

  it('reads past call options in a statement', () => {
    const body = Array.from({ length: 20 }, (_, i) => `  x = ${i};`)
    const code = [
      'function f() {',
      '  receiver.deposit{value: amount}();',
      ...body,
      '}',
    ].join('\n')
    const excerpt = excerptAt(code, code.indexOf('receiver'), 2)
    expect(excerpt.lines.length).toEqual(12)
    expect(excerpt.isCut).toEqual(true)
  })

  it('gives the whole block a tuple assignment follows', () => {
    const body = Array.from({ length: 20 }, (_, i) => `    x = ${i};`)
    const code = [
      '  if (amount > limit) {',
      ...body,
      '  }',
      '  (bool ok, bytes memory data) = target.call("");',
    ].join('\n')
    const excerpt = excerptAt(code, 0, 1)
    expect(excerpt.lines.length).toEqual(22)
    expect(excerpt.isCut).toEqual(false)
  })

  it('skips named arguments before the body', () => {
    const body = Array.from({ length: 20 }, (_, i) => `  x = ${i};`)
    const code = ['function f() check({x: 1}) {', ...body, '}'].join('\n')
    expect(excerptAt(code, 0, 1).lines.length).toEqual(22)
  })

  it('skips braces in comments and strings', () => {
    const code = [
      'function f() {',
      '  // if (x) {',
      "  require(ok, '}');",
      '  /* } */',
      '  x = 1;',
      '}',
      'function g() {}',
    ].join('\n')
    expect(excerptAt(code, 0, 1).lines).toEqual(code.split('\n').slice(0, 6))
  })

  it('skips a semicolon in a comment before the body', () => {
    const body = Array.from({ length: 20 }, (_, i) => `  x = ${i};`)
    const code = ['function f() /* checked; */ {', ...body, '}'].join('\n')
    expect(excerptAt(code, 0, 1).lines.length).toEqual(22)
  })

  it('gives the whole loop a for header opens', () => {
    const body = Array.from({ length: 20 }, (_, i) => `    x += ${i};`)
    const code = ['  for (uint256 i = 0; i < n; i++) {', ...body, '  }'].join(
      '\n',
    )
    expect(excerptAt(code, 2, 1).lines.length).toEqual(22)
  })

  it('cuts a long block', () => {
    const body = Array.from({ length: 100 }, (_, i) => `  x = ${i};`)
    const code = ['function long() {', ...body, '}'].join('\n')
    const excerpt = excerptAt(code, 0, 1)
    expect(excerpt.lines.length).toEqual(60)
    expect(excerpt.isCut).toEqual(true)
  })
})
