import { expect } from 'earl'

import { getFirstTwoNonZeroPrecision } from './getFirstTwoNonZeroPrecision'

describe(getFirstTwoNonZeroPrecision.name, () => {
  const testCases = [
    { value: 99e-15, expected: 15 },
    { value: 1e-12, expected: 13 },
    { value: 0.000009347, expected: 7 },
    { value: 0.009, expected: 4 },
    { value: 0.01, expected: 3 },
    { value: 0.19, expected: 2 },
    { value: 0.99, expected: 2 },
  ]

  for (const testCase of testCases) {
    it(`should return ${testCase.expected} for ${testCase.value}`, () => {
      expect(getFirstTwoNonZeroPrecision(testCase.value)).toEqual(
        testCase.expected,
      )
    })

    it(`should return ${testCase.expected} for -${testCase.value}`, () => {
      expect(getFirstTwoNonZeroPrecision(-testCase.value)).toEqual(
        testCase.expected,
      )
    })
  }

  it('should throw an error if value is greater than 1', () => {
    expect(() => getFirstTwoNonZeroPrecision(1)).toThrow(
      'Value must be less than 1',
    )
  })
})
