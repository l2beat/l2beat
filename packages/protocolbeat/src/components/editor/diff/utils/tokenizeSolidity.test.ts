import { expect } from 'earl'
import { type Token, tokenizeSolidity } from './tokenizeSolidity'

describe('tokenizeSolidity', () => {
  it('returns no tokens for empty source', () => {
    expect(tokenizeSolidity('')).toEqual([])
  })

  it('skips whitespace entirely', () => {
    expect(tokenizeSolidity('   \t\n  \r\n')).toEqual([])
  })

  it('emits identifier as a single structural token', () => {
    expect(tokenizeSolidity('hello')).toEqual([
      structural('hello', 1, 1),
    ])
  })

  it('emits each punctuation char as its own token', () => {
    expect(tokenizeSolidity('a&&b')).toEqual([
      structural('a', 1, 1),
      structural('&', 1, 1),
      structural('&', 1, 1),
      structural('b', 1, 1),
    ])
  })

  it('whitespace between tokens does not change the token stream', () => {
    const tight = tokenizeSolidity('a&&b')
    const loose = tokenizeSolidity('a  &&\t b')
    expect(stripPositions(tight)).toEqual(stripPositions(loose))
  })

  it('line comment runs to end of line, excluding the newline', () => {
    const tokens = tokenizeSolidity('// hello\nx')
    expect(tokens).toEqual([
      comment('// hello', 1, 1),
      structural('x', 2, 2),
    ])
  })

  it('block comment can span multiple lines', () => {
    const tokens = tokenizeSolidity('/* a\nb\nc */ x')
    expect(tokens).toEqual([
      comment('/* a\nb\nc */', 1, 3),
      structural('x', 3, 3),
    ])
  })

  it('NatSpec triple-slash is a comment', () => {
    const tokens = tokenizeSolidity('/// @notice hi\nfoo')
    expect(tokens).toEqual([
      comment('/// @notice hi', 1, 1),
      structural('foo', 2, 2),
    ])
  })

  it('NatSpec block comment is a comment', () => {
    const tokens = tokenizeSolidity('/** @notice hi */\nfoo')
    expect(tokens).toEqual([
      comment('/** @notice hi */', 1, 1),
      structural('foo', 2, 2),
    ])
  })

  it('does not treat // inside a string as a comment', () => {
    const tokens = tokenizeSolidity('"// not a comment" x')
    expect(tokens).toEqual([
      structural('"// not a comment"', 1, 1),
      structural('x', 1, 1),
    ])
  })

  it('does not treat /* inside a string as a comment', () => {
    const tokens = tokenizeSolidity('"/* nope */"')
    expect(tokens).toEqual([structural('"/* nope */"', 1, 1)])
  })

  it('handles escaped quote inside a string', () => {
    const tokens = tokenizeSolidity('"a\\"b"')
    expect(tokens).toEqual([structural('"a\\"b"', 1, 1)])
  })

  it('handles single-quoted strings', () => {
    const tokens = tokenizeSolidity("'hello'")
    expect(tokens).toEqual([structural("'hello'", 1, 1)])
  })

  it('preserves whitespace inside strings verbatim', () => {
    const a = tokenizeSolidity('"a   b"')
    const b = tokenizeSolidity('"a b"')
    expect(a[0]?.content).toEqual('"a   b"')
    expect(b[0]?.content).toEqual('"a b"')
    expect(a[0]?.content === b[0]?.content).toEqual(false)
  })

  it('treats hex"..." as identifier followed by string', () => {
    const tokens = tokenizeSolidity('hex"AB CD"')
    expect(tokens).toEqual([
      structural('hex', 1, 1),
      structural('"AB CD"', 1, 1),
    ])
  })

  it('treats unicode"..." as identifier followed by string', () => {
    const tokens = tokenizeSolidity('unicode"héllo"')
    expect(tokens).toEqual([
      structural('unicode', 1, 1),
      structural('"héllo"', 1, 1),
    ])
  })

  it('tracks line numbers across newlines', () => {
    const tokens = tokenizeSolidity('a\n\nb\nc')
    expect(tokens).toEqual([
      structural('a', 1, 1),
      structural('b', 3, 3),
      structural('c', 4, 4),
    ])
  })

  it('unterminated block comment extends to EOF', () => {
    const tokens = tokenizeSolidity('/* never ends\nstill going')
    expect(tokens.length).toEqual(1)
    expect(tokens[0]?.type).toEqual('comment')
    expect(tokens[0]?.startLine).toEqual(1)
    expect(tokens[0]?.endLine).toEqual(2)
  })

  it('unterminated string extends to EOF', () => {
    const tokens = tokenizeSolidity('"never ends')
    expect(tokens.length).toEqual(1)
    expect(tokens[0]?.type).toEqual('structural')
    expect(tokens[0]?.content).toEqual('"never ends')
  })

  it('splits numeric literal with dot into separate tokens', () => {
    expect(tokenizeSolidity('1.5')).toEqual([
      structural('1', 1, 1),
      structural('.', 1, 1),
      structural('5', 1, 1),
    ])
  })

  it('hex numeric literal is a single identifier token', () => {
    expect(tokenizeSolidity('0xFF')).toEqual([structural('0xFF', 1, 1)])
  })

  it('member access "a.b" yields three tokens regardless of spacing', () => {
    const tight = stripPositions(tokenizeSolidity('a.b'))
    const loose = stripPositions(tokenizeSolidity('a . b'))
    expect(tight).toEqual([
      structural('a', 1, 1),
      structural('.', 1, 1),
      structural('b', 1, 1),
    ])
    expect(loose).toEqual(tight)
  })
})

function comment(content: string, startLine: number, endLine: number): Token {
  return { type: 'comment', content, startLine, endLine }
}

function structural(
  content: string,
  startLine: number,
  endLine: number,
): Token {
  return { type: 'structural', content, startLine, endLine }
}

function stripPositions(tokens: Token[]): Token[] {
  return tokens.map((t) => ({ ...t, startLine: 1, endLine: 1 }))
}
