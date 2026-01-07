import { expect } from 'earl'
import { slidingWindow } from './slidingWindow.js'

describe(slidingWindow.name, () => {
  describe('Moving average size 3', () => {
    it('should return correct slices with advance 1', () => {
      const result = slidingWindow('abcdefg'.split(''), 3, 1)
      expect(result).toEqual([
        ['a', 'b', 'c'],
        ['b', 'c', 'd'],
        ['c', 'd', 'e'],
        ['d', 'e', 'f'],
        ['e', 'f', 'g'],
      ])
    })

    it('should handle multibyte characters correctly', () => {
      const input = '😀😁😂😃😄😅😆' // Unicode emojis
      const result = slidingWindow(Array.from(input), 3, 1)
      expect(result).toEqual([
        ['😀', '😁', '😂'],
        ['😁', '😂', '😃'],
        ['😂', '😃', '😄'],
        ['😃', '😄', '😅'],
        ['😄', '😅', '😆'],
      ])
    })
  })

  describe('Chunk/split every 3', () => {
    it('should return correct slices with advance 3', () => {
      const result = slidingWindow('abcdefg'.split(''), 3, 3)
      expect(result).toEqual([['a', 'b', 'c'], ['d', 'e', 'f'], ['g']])
    })
  })

  describe('Pick every even index', () => {
    it('should return every second element with size 1 and advance 2', () => {
      const result = slidingWindow('abcdefg'.split(''), 1, 2)
      expect(result).toEqual([['a'], ['c'], ['e'], ['g']])
    })
  })

  describe('Empty array handling', () => {
    it('should return an array with an empty array when input is empty', () => {
      const result = slidingWindow([], 1, 1)
      expect(result).toEqual([[]])
    })

    it('should handle size greater than length with empty input', () => {
      const result = slidingWindow([], 10, 1)
      expect(result).toEqual([[]])
    })

    it('should handle advance greater than length with empty input', () => {
      const result = slidingWindow([], 1, 10)
      expect(result).toEqual([[]])
    })

    it('should handle both size and advance greater than length with empty input', () => {
      const result = slidingWindow([], 10, 10)
      expect(result).toEqual([[]])
    })
  })

  describe('First and reset functionality', () => {
    it('should return the first slice correctly', () => {
      const result = slidingWindow('abcdefg'.split(''), 3, 3)
      expect(result[0]).toEqual(['a', 'b', 'c'])
    })

    it('should reset and return slices from the beginning', () => {
      const arr = 'abcdefg'.split('')
      const result1 = slidingWindow(arr, 3, 3)
      const result2 = slidingWindow(arr, 3, 3) // Reset by calling the function again

      expect(result1).toEqual([['a', 'b', 'c'], ['d', 'e', 'f'], ['g']])

      expect(result2).toEqual([['a', 'b', 'c'], ['d', 'e', 'f'], ['g']])
    })
  })
})
