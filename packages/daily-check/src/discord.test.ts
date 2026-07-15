import { expect } from 'earl'
import { splitMessage } from './discord'

describe('splitMessage', () => {
  it('keeps short content in one chunk', () => {
    expect(splitMessage('hello\nworld', 100)).toEqual(['hello\nworld'])
  })

  it('splits on line boundaries', () => {
    const chunks = splitMessage('aaaa\nbbbb\ncccc', 9)
    expect(chunks).toEqual(['aaaa\nbbbb', 'cccc'])
  })

  it('hard-splits single lines longer than the limit', () => {
    expect(splitMessage('abcdefghij', 4)).toEqual(['abcd', 'efgh', 'ij'])
  })

  it('never produces chunks over the limit', () => {
    const content = Array.from(
      { length: 50 },
      (_, index) => `line ${index} ${'x'.repeat(index * 7)}`,
    ).join('\n')
    for (const chunk of splitMessage(content, 80)) {
      expect(chunk.length <= 80).toEqual(true)
    }
  })
})
