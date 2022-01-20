import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.object', () => {
  it('processes the value passed', () => {
    const result = as.object({})({})
    expect(result).toEqual({})
  })

  it('applies nested casts', () => {
    const asUser = as.object({
      name: as.string,
      age: as.integer,
    })

    const result = asUser({
      name: 'John',
      age: 31,
      foo: 'bar',
    })

    expect(result).toEqual({
      name: 'John',
      age: 31,
    })
  })

  it('throws when more properties are passed in strict mode', () => {
    const asUser = as.object('strict', {
      name: as.string,
      age: as.integer,
    })

    expect(() =>
      asUser({
        name: 'John',
        age: 31,
        foo: 'bar',
      })
    ).toThrow(CastError)
  })

  it('throws when nested casts throw', () => {
    const asUser = as.object({
      name: as.string,
      age: as.integer,
    })

    expect(() => asUser({ name: 'John', age: false })).toThrow(CastError)
  })

  it('throws for values other than objects', () => {
    expect(() => as.object({})('foo')).toThrow(CastError)
  })

  it('throws for null', () => {
    expect(() => as.object({})(null)).toThrow(CastError)
  })

  it('throws for arrays', () => {
    expect(() => as.object({})([])).toThrow(CastError)
  })

  it('preserves nested optional casts when missing', () => {
    const asUser = as.object({
      name: as.string,
      age: as.optional(as.integer),
    })
    const result = asUser({ name: 'John' })
    expect(result).toEqual({ name: 'John' } as any)
  })

  it('preserves nested optional casts when present', () => {
    const asUser = as.object({
      name: as.string,
      age: as.optional(as.integer),
    })
    const result = asUser({ name: 'John', age: null })
    expect(result).toEqual({ name: 'John', age: undefined })
  })

  it('allows optional properties in strict mode', () => {
    const asUser = as.object('strict', {
      name: as.string,
      age: as.optional(as.integer),
    })

    expect(() => asUser({ name: 'John' })).not.toThrow()
  })
})
