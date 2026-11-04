import { expect } from 'earl'
import { anchorSnippet, type CodeMatch, type CodeSource } from './codeAnchor'
import {
  cutText,
  EXCERPT_CHARACTERS_MAX,
  EXCERPT_LINES_MAX,
  excerptAt,
} from './excerpt'

// Each case parses a small flattened source and checks where the snippet
// opens and what the agent reads around it.
const BRIDGE = [
  'interface IBridge {',
  '  function deposit(uint256 amount) external;',
  '}',
  'contract Bridge is IBridge {',
  '  uint256 public total = 1;',
  '  modifier onlyOwner() {',
  '    require(msg.sender == owner);',
  '    _;',
  '  }',
  '  function deposit(uint256 amount) external onlyOwner {',
  '    total += amount;',
  '  }',
  '}',
].join('\n')

describe(anchorSnippet.name, () => {
  it('opens the implementation past an earlier interface declaration', () => {
    const anchor = anchorSnippet(sources(BRIDGE), 'function deposit(')
    expect(anchor?.match.line).toEqual(10)
    expect(anchor?.match.isImplementation).toEqual(true)
    expect(anchor?.others.map((m) => m.line)).toEqual([2])
  })

  it('shows the whole function around the snippet, not its contract', () => {
    const text = excerptFor(BRIDGE, 'total += amount')
    expect(text).toEqual(
      [
        '10    function deposit(uint256 amount) external onlyOwner {',
        '11      total += amount;',
        '12    }',
      ].join('\n'),
    )
  })

  it('opens a snippet inside a modifier', () => {
    const anchor = anchorSnippet(sources(BRIDGE), 'msg.sender == owner')
    expect(anchor?.match.isImplementation).toEqual(true)
    expect(excerptFor(BRIDGE, 'msg.sender == owner').split('\n')).toEqual([
      '6    modifier onlyOwner() {',
      '7      require(msg.sender == owner);',
      '8      _;',
      '9    }',
    ])
  })

  it('shows the contract member around a snippet outside any function', () => {
    const anchor = anchorSnippet(sources(BRIDGE), 'uint256 public total')
    expect(anchor?.match.isImplementation).toEqual(false)
    expect(excerptFor(BRIDGE, 'uint256 public total')).toEqual(
      '5    uint256 public total = 1;',
    )
  })

  it('prefers an implementation in a later source', () => {
    const iface = 'interface IBridge {\n  function deposit() external;\n}'
    const anchor = anchorSnippet(sources(iface, BRIDGE), 'function deposit(')
    expect(anchor?.match.sourceIndex).toEqual(1)
    expect(anchor?.others.map((m) => [m.sourceIndex, m.line])).toEqual([
      [0, 2],
      [1, 2],
    ])
  })

  it('shows only the snippet lines of a source that does not parse', () => {
    const vyper = 'def deposit(amount: uint256):\n    pass'
    const anchor = anchorSnippet(sources(vyper), 'def deposit')
    expect(anchor?.match.declaration).toEqual(undefined)
    expect(excerptFor(vyper, 'def deposit')).toEqual(
      '1  def deposit(amount: uint256):',
    )
  })

  it('finds nothing for a snippet in no source', () => {
    expect(anchorSnippet(sources(BRIDGE), 'function withdraw(')).toEqual(
      undefined,
    )
  })
})

describe(excerptAt.name, () => {
  it('cuts a long function to a window around the snippet', () => {
    const body = Array.from({ length: 100 }, (_, i) => `    x += ${i};`)
    const code = [
      'contract Long {',
      '  function f() external {',
      ...body,
      '  }',
      '}',
    ].join('\n')
    const excerpt = excerptAt(code, matchOf(code, 'x += 70;'), 8)
    const lines = excerpt.text.split('\n')
    expect(excerpt.isCut).toEqual(true)
    expect(lines.length).toEqual(EXCERPT_LINES_MAX)
    expect(lines.some((line) => line.endsWith('x += 70;'))).toEqual(true)
  })

  it('cuts a function over the character limit', () => {
    const long = `    bytes x = "${'a'.repeat(1_000)}";`
    const body = Array.from({ length: 20 }, () => long)
    const code = ['contract Wide {', '  function f() external {', ...body]
      .concat(['  }', '}'])
      .join('\n')
    const excerpt = excerptAt(code, matchOf(code, 'function f('), 11)
    expect(excerpt.isCut).toEqual(true)
    expect(excerpt.text.length <= EXCERPT_CHARACTERS_MAX).toEqual(true)
  })
})

describe('excerptAt with long lines before the snippet', () => {
  it('keeps the snippet line when the lines above it fill the limit', () => {
    const long = `    bytes x = "${'a'.repeat(1_000)}";`
    const before = Array.from({ length: 9 }, () => long)
    const code = ['contract Wide {', '  function f() external {', ...before]
      .concat(['    target();', '  }', '}'])
      .join('\n')
    const excerpt = excerptFor(code, 'target();')
    expect(excerpt.includes('target();')).toEqual(true)
    expect(excerpt.length <= EXCERPT_CHARACTERS_MAX).toEqual(true)
  })
})

describe(cutText.name, () => {
  it('cuts at the last line end within the limit', () => {
    expect(cutText('ab\ncd\nef', 7)).toEqual({ text: 'ab\ncd', isCut: true })
    expect(cutText('ab\ncd', 5)).toEqual({ text: 'ab\ncd', isCut: false })
    expect(cutText('abcdef', 3)).toEqual({ text: 'abc', isCut: true })
  })
})

function sources(...codes: string[]): CodeSource[] {
  return codes.map((code, i) => ({ name: `Source${i}.sol`, code }))
}

function excerptFor(code: string, find: string): string {
  return excerptAt(code, matchOf(code, find), find.length).text
}

function matchOf(code: string, find: string): CodeMatch {
  const anchor = anchorSnippet(sources(code), find)
  if (anchor === undefined) {
    throw new Error('Snippet not found')
  }
  return anchor.match
}
