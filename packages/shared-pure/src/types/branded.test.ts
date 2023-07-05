import { expect } from 'earl'

import { stringAsInt } from './branded'

describe(stringAsInt.name, () => {
  describe('parses correct input', () => {
    const parser = stringAsInt(10)
    const inputs = [undefined, null, '1']

    inputs.forEach((input) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
