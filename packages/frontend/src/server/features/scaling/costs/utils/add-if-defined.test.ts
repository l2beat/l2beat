import { expect } from 'earl'
import { addIfDefined } from './add-if-defined'

type TestCase = {
  a: number | undefined | null
  b: number | undefined | null
  expected: number | undefined
  description: string
}

const testCases: TestCase[] = [
  {
    a: 2,
    b: 3,
    expected: 5,
    description: 'should return the sum of two defined numbers',
  },
  {
    a: 2,
    b: undefined,
    expected: 2,
    description: 'should return the first number if the second is undefined',
  },
  {
    a: 2,
    b: null,
    expected: 2,
    description: 'should return the first number if the second is null',
  },
  {
    a: undefined,
    b: 3,
    expected: 3,
    description: 'should return the second number if the first is undefined',
  },
  {
    a: null,
    b: 3,
    expected: 3,
    description: 'should return the second number if the first is null',
  },
  {
    a: undefined,
    b: undefined,
    expected: undefined,
    description: 'should return undefined if both numbers are undefined',
  },
  {
    a: null,
    b: null,
    expected: undefined,
    description: 'should return undefined if both numbers are null',
  },
  {
    a: undefined,
    b: null,
    expected: undefined,
    description:
      'should return undefined if the first is undefined and the second is null',
  },
  {
    a: null,
    b: undefined,
    expected: undefined,
    description:
      'should return undefined if the first is null and the second is undefined',
  },
]

describe('addIfDefined', () => {
  for (const { a, b, expected, description } of testCases) {
    it(description, () => {
      expect(addIfDefined(a, b)).toEqual(expected)
    })
  }
})
