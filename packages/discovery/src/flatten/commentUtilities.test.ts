import { expect } from 'earl'

import { findLeadingCommentStart } from './commentUtilities'

describe(findLeadingCommentStart.name, () => {
  it('returns start when no comments precede', () => {
    const source = 'contract Foo {}'
    const start = 0
    expect(findLeadingCommentStart(source, start)).toEqual(start)
  })

  it('returns start when only whitespace precedes (no comments)', () => {
    const source = '    contract Foo {}'
    const start = 4 // index of 'c' in 'contract'
    expect(findLeadingCommentStart(source, start)).toEqual(start)
  })

  it('finds single-line comment start', () => {
    const source = `// comment
contract Foo {}`
    const start = source.indexOf('contract')
    const result = findLeadingCommentStart(source, start)
    expect(result).toEqual(0)
  })

  it('finds multi-line NatSpec comment start', () => {
    const source = `/// @title Foo
/// @notice Bar
contract Foo {}`
    const start = source.indexOf('contract')
    const result = findLeadingCommentStart(source, start)
    expect(result).toEqual(0)
  })

  it('finds block comment start', () => {
    const source = `/**
 * @title Foo
 */
contract Foo {}`
    const start = source.indexOf('contract')
    const result = findLeadingCommentStart(source, start)
    expect(result).toEqual(0)
  })

  it('does not include trailing comment from previous code', () => {
    const source = `contract A {} // trailing
contract B {}`
    const start = source.indexOf('contract B')
    const result = findLeadingCommentStart(source, start)
    expect(result).toEqual(start)
  })

  it('handles mixed comments and blank lines', () => {
    const source = `// First comment

/// Second comment
contract Foo {}`
    const start = source.indexOf('contract')
    const result = findLeadingCommentStart(source, start)
    expect(result).toEqual(0)
  })

  it('stops at code line before comments', () => {
    const source = `contract A {}
/// Comment for B
contract B {}`
    const start = source.indexOf('contract B')
    const result = findLeadingCommentStart(source, start)
    expect(source.slice(result, start)).toInclude('/// Comment for B')
    expect(source.slice(result, start)).not.toInclude('contract A')
  })
})
