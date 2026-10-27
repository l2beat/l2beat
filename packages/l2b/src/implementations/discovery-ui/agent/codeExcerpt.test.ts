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

  it('cuts a long block', () => {
    const body = Array.from({ length: 100 }, (_, i) => `  x = ${i};`)
    const code = ['function long() {', ...body, '}'].join('\n')
    const excerpt = excerptAt(code, 0, 1)
    expect(excerpt.lines.length).toEqual(60)
    expect(excerpt.isCut).toEqual(true)
  })
})
