import { expect } from 'earl'
import { z } from 'zod'

import { strictBoolean, stringAsObject } from './zod'

describe('strictBoolean', () => {
  it('returns true for "true"', () => {
    expect(strictBoolean.parse('true')).toEqual(true)
  })

  it('returns false for "false"', () => {
    expect(strictBoolean.parse('false')).toEqual(false)
  })

  it('throws for other values', () => {
    expect(() => strictBoolean.parse('yes')).toThrow()
    expect(() => strictBoolean.parse('no')).toThrow()
    expect(() => strictBoolean.parse('')).toThrow()
    expect(() => strictBoolean.parse('0')).toThrow()
    expect(() => strictBoolean.parse('1')).toThrow()
    expect(() => strictBoolean.parse('null')).toThrow()
    expect(() => strictBoolean.parse('undefined')).toThrow()
  })
})

describe('stringAsObject', () => {
  const schema = z.object({
    a: z.string(),
    b: z.number(),
  })

  it('parses a string as an object', () => {
    expect(stringAsObject(schema).parse('{"a": "hello", "b": 1}')).toEqual({
      a: 'hello',
      b: 1,
    })
  })

  it('throws for invalid JSON', () => {
    expect(() =>
      stringAsObject(schema).parse('{"a": "hello", "b": 1'),
    ).toThrow()
  })
})
