import { expect } from 'earl'
import { GreaterThan } from './GreaterThan'

interface TestData {
  value: number
  incomingValue: number | string
  expected: string | number | boolean
  trueResult?: string | number
  falseResult?: string | number
}

const testData: TestData[] = [
  { value: 0, incomingValue: 0, expected: false },
  { value: 1, incomingValue: 0, expected: false },
  { value: 0, incomingValue: 1, expected: true },
  { value: 1, incomingValue: 1, expected: false },
  { value: 42, incomingValue: 69, expected: true },
  { value: 420, incomingValue: 69, expected: false },

  {
    value: 1,
    incomingValue: 0,
    expected: 'no',
    trueResult: 'yes',
    falseResult: 'no',
  },
  {
    value: 0,
    incomingValue: 1,
    expected: 'yes',
    trueResult: 'yes',
    falseResult: 'no',
  },
  {
    value: 1,
    incomingValue: 0,
    expected: 999,
    trueResult: 100,
    falseResult: 999,
  },
  {
    value: 0,
    incomingValue: 1,
    expected: 100,
    trueResult: 100,
    falseResult: 999,
  },
]

describe('GreaterThan', () => {
  for (const data of testData) {
    it('should cast a number to a ContractValue', () => {
      const result = GreaterThan.cast(
        {
          value: data.value,
          ...(data.trueResult !== undefined && { trueResult: data.trueResult }),
          ...(data.falseResult !== undefined && {
            falseResult: data.falseResult,
          }),
        },
        data.incomingValue,
      )
      expect(result).toEqual(data.expected)
    })
  }
})
