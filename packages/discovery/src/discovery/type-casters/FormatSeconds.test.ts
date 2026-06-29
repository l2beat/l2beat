import { expect } from 'earl'
import { FormatSeconds } from './FormatSeconds'

interface TestData {
  incomingValue: number | bigint
  expected: string
}

const testData: TestData[] = [
  { incomingValue: 0, expected: '0s' },
  { incomingValue: 3600, expected: '1h' },
  { incomingValue: 90061, expected: '1d 1h' },
  { incomingValue: 123456789n, expected: '3y 11mo' },
  { incomingValue: BigInt(Number.MAX_SAFE_INTEGER), expected: '285616414y 8mo' },
  {
    incomingValue: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
    expected: 'more than 285616414y 8mo',
  },
  {
    incomingValue: 0x0fffffffffffffffn,
    expected: 'more than 285616414y 8mo',
  },
]

describe('FormatSeconds', () => {
  for (const data of testData) {
    it(`casts ${data.incomingValue} to "${data.expected}"`, () => {
      const result = FormatSeconds.cast(
        {},
        data.incomingValue as unknown as Parameters<
          typeof FormatSeconds.cast
        >[1],
      )
      expect(result).toEqual(data.expected)
    })
  }
})
