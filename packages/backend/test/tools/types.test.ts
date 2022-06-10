import { expect } from 'earljs'

import { stringAsBigInt, stringAsInt } from '../../src/tools/types'

describe(stringAsInt.name, () => {
  describe('parses correct input', () => {
    const parser = stringAsInt(10)
    const inputs = [undefined, null, '1']

    inputs.forEach((input) => {
      it(`${input}`, () =>
        expect(parser.safeParse(input).success).toEqual(true))
    })
  })

  describe('parses incorrect input', () => {
    const parser = stringAsInt()
    const inputs = ['foo', '123foo', '', '1.2']

    inputs.forEach((input) => {
      it(`${input}`, () =>
        expect(parser.safeParse(input).success).toEqual(false))
    })
  })
})

describe(stringAsBigInt.name, () => {
  describe('parses correct input', () => {
    const parser = stringAsBigInt(10n)
    const inputs = [undefined, null, '1']

    inputs.forEach((input) => {
      it(`${input}`, () =>
        expect(parser.safeParse(input).success).toEqual(true))
    })
  })

  describe('parses incorrect input', () => {
    const parser = stringAsBigInt()
    const inputs = ['foo', '123foo', '', '1.2']

    inputs.forEach((input) => {
      it(`${input}`, () =>
        expect(parser.safeParse(input).success).toEqual(false))
    })
  })
})
