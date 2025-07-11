import { expect } from 'earl'
import { Undecimal } from './Undecimal'

interface TestData {
  decimals: number
  incomingValue: string
  expected: string
}

const testData: TestData[] = [
  { decimals: 18, incomingValue: '0', expected: '0' },
  {
    decimals: 6,
    incomingValue: '1233458934095843',
    expected: '1,233,458,934.095843',
  },
  {
    decimals: 10,
    incomingValue: '1233458934095843',
    expected: '123,345.8934095843',
  },
  {
    decimals: 18,
    incomingValue: '123345893409584392323164',
    expected: '123,345.893409584392323164',
  },
  { decimals: 18, incomingValue: '1000000000000000000', expected: '1' },
]

describe('Undecimal', () => {
  for (const data of testData) {
    it('should cast a number to a ContractValue', () => {
      const result = Undecimal.cast(
        { decimals: data.decimals },
        data.incomingValue,
      )
      expect(result).toEqual(data.expected)
    })
  }
})
