import { expect } from 'earl'
import { computeDiff } from './computeDiff'
import { getDiffVerdict } from './diffVerdict'

describe('getDiffVerdict', () => {
  it('calls equal texts identical', () => {
    expect(verdict('a = 1;\nb', 'a = 1;\nb', false)).toEqual('identical')
  })

  it('calls two empty texts identical', () => {
    expect(verdict('', '', false)).toEqual('identical')
  })

  it('tells a formatting only change apart from identical', () => {
    expect(verdict('a = 1;\nb', 'a =\n  1;\nb', false)).toEqual(
      'formattingDiffers',
    )
  })

  it('calls a comment only change different while comments count', () => {
    expect(verdict('a = 1;', '// x\na = 1;', false)).toEqual('different')
  })

  it('calls a comment only change the same code when comments are ignored', () => {
    expect(verdict('a = 1;', '// x\na = 1;', true)).toEqual(
      'sameIgnoringComments',
    )
  })

  it('calls a code change different when comments are ignored', () => {
    expect(verdict('a = 1;', 'a = 2;', true)).toEqual('different')
  })
})

function verdict(left: string, right: string, ignoreComments: boolean) {
  return getDiffVerdict(
    computeDiff(left, right, ignoreComments),
    ignoreComments,
  )
}
