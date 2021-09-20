import { expect } from 'chai'

import { as } from '../../../src/services/cast'
import { CastError } from '../../../src/services/cast/CastError'

describe('as.object', () => {
  it('processes the value passed', () => {
    const result = as.object({})({})
    expect(result).to.deep.equal({})
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

    expect(result).to.deep.equal({
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
    ).to.throw(CastError)
  })

  it('throws when nested casts throw', () => {
    const asUser = as.object({
      name: as.string,
      age: as.integer,
    })

    expect(() => asUser({ name: 'John', age: false })).to.throw(CastError)
  })

  it('throws for values other than objects', () => {
    expect(() => as.object({})('foo')).to.throw(CastError)
  })

  it('throws for null', () => {
    expect(() => as.object({})(null)).to.throw(CastError)
  })

  it('throws for arrays', () => {
    expect(() => as.object({})([])).to.throw(CastError)
  })

  it('preserves nested optional casts when missing', () => {
    const asUser = as.object({
      name: as.string,
      age: as.optional(as.integer),
    })
    const result = asUser({ name: 'John' })
    expect(result).to.deep.equal({ name: 'John' })
  })

  it('preserves nested optional casts when present', () => {
    const asUser = as.object({
      name: as.string,
      age: as.optional(as.integer),
    })
    const result = asUser({ name: 'John', age: null })
    expect(result).to.deep.equal({ name: 'John', age: undefined })
  })

  it('allows optional properties in strict mode', () => {
    const asUser = as.object('strict', {
      name: as.string,
      age: as.optional(as.integer),
    })

    expect(() => asUser({ name: 'John' })).not.to.throw()
  })
})
