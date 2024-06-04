import { expect } from 'earl'

import { stringAsBoolean, stringAsInt } from './branded'

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

describe(stringAsBoolean.name, () => {
  describe('parses correct input', () => {
    const parser = stringAsBoolean()
    const inputs = ['true', 'false', '0', '1']

    inputs.forEach((input) => {
      it(`${input}`, () =>
        expect(parser.safeParse(input).success).toEqual(true))
    })
  })

  describe('parses incorrect input', () => {
    const parser = stringAsBoolean()
    const inputs = ['foo', '123foo', '', '1.2']

    inputs.forEach((input) => {
      it(`${input}`, () =>
        expect(parser.safeParse(input).success).toEqual(false))
    })
  })

  it('uses fallback', () => {
    const fallback = true
    const parser = stringAsBoolean(fallback)

    expect(parser.parse('123')).toEqual(fallback)
  })
})
