import { expect } from 'earl'
import { splitCode } from './soliditySplitter'

describe('splitCode', () => {
  describe('removeSameDeclarations with ignoreComments=true', () => {
    it('omits a declaration whose only difference is in comments', () => {
      // When the user toggles "remove unchanged sections" and is also
      // ignoring comments, declarations that differ only in comments
      // are visually unchanged in the diff — the customDiffProvider
      // filters their line changes out. If splitCode keeps them, the
      // user sees a large block of identical-looking content polluting
      // the compressed view.
      const left = {
        'contract A': '// old comment\ncontract A { uint x; }',
        'contract B': 'contract B { uint y; }',
      }
      const right = {
        'contract A': '// new comment\ncontract A { uint x; }',
        'contract B': 'contract B { uint y; }',
      }
      const [leftOut, rightOut] = splitCode(left, right, true, true)
      expect(leftOut.includes('contract A')).toEqual(false)
      expect(rightOut.includes('contract A')).toEqual(false)
    })

    it('keeps a declaration whose code differs (not just comments)', () => {
      const left = {
        'contract A': '// comment\ncontract A { uint x; }',
      }
      const right = {
        'contract A': '// comment\ncontract A { uint y; }',
      }
      const [leftOut, rightOut] = splitCode(left, right, true, true)
      expect(leftOut.includes('uint x')).toEqual(true)
      expect(rightOut.includes('uint y')).toEqual(true)
    })

    it('keeps a comment-only diff when ignoreComments=false', () => {
      const left = {
        'contract A': '// old comment\ncontract A { uint x; }',
      }
      const right = {
        'contract A': '// new comment\ncontract A { uint x; }',
      }
      const [leftOut, rightOut] = splitCode(left, right, true, false)
      expect(leftOut.includes('// old comment')).toEqual(true)
      expect(rightOut.includes('// new comment')).toEqual(true)
    })
  })
})
