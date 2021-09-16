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
})
