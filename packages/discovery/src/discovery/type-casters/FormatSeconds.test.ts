import { expect } from 'earl'
import type { ContractValue } from '../output/types'
import { FormatSeconds } from './FormatSeconds'

interface TestData {
  incomingValue: ContractValue | bigint
  expected: string
}

const testData: TestData[] = [
  { incomingValue: 0, expected: '0s' },
  { incomingValue: 3600, expected: '1h' },
  { incomingValue: 90061, expected: '1d 1h' },
  { incomingValue: '123456789', expected: '3y 11mo' },
  { incomingValue: '9007199254740991', expected: '285616414y 8mo' },
  { incomingValue: '9007199254740992', expected: 'more than 285616414y 8mo' },
  {
    incomingValue: '1152921504606846975',
    expected: 'more than 285616414y 8mo',
  },
  { incomingValue: 123456789n, expected: '3y 11mo' },
  { incomingValue: 0x0fffffffffffffffn, expected: 'more than 285616414y 8mo' },
]

describe('FormatSeconds', () => {
  for (const data of testData) {
    it(`casts ${data.incomingValue} to "${data.expected}"`, () => {
      const result = FormatSeconds.cast({}, data.incomingValue)
      expect(result).toEqual(data.expected)
    })
  }
})
