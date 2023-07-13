import { expect } from 'earl'

import { Env } from './env'

describe(Env.name, () => {
  describe(Env.prototype.string.name, () => {
    it('returns the environment variable', () => {
      const env = new Env({ TEST_A: 'foo' })
      const result = env.string('TEST_A')
      expect(result).toEqual('foo')
    })

    it('returns the fallback if the variable is not present', () => {
      const env = new Env({})
      const result = env.string('TEST_A', 'bar')
      expect(result).toEqual('bar')
    })

    it('throws if variable is not present and there is no fallback', () => {
      const env = new Env({})
      expect(() => env.string('TEST_A')).toThrow()
    })
  })

  describe(Env.prototype.integer.name, () => {
    it('returns the environment variable as integer', () => {
      const env = new Env({ TEST_A: '-420' })
      const result = env.integer('TEST_A')
      expect(result).toEqual(-420)
    })

    it('returns the fallback if the variable is not present', () => {
      const env = new Env({})
      const result = env.integer('TEST_A', 69)
      expect(result).toEqual(69)
    })

    it('throws if variable is not present and there is no fallback', () => {
      const env = new Env({})
      expect(() => env.integer('TEST_A')).toThrow()
    })

    it('throws if variable is not an integer', () => {
      const env = new Env({ TEST_A: 'foo' })
      expect(() => env.integer('TEST_A')).toThrow()
    })
  })

  describe(Env.prototype.boolean.name, () => {
    it('returns the environment variable as boolean', () => {
      const env = new Env({ TEST_A: 'FALSE' })
      const result = env.boolean('TEST_A')
      expect(result).toEqual(false)
    })

    it('returns the fallback if the variable is not present', () => {
      const env = new Env({})
      const result = env.boolean('TEST_A', false)
      expect(result).toEqual(false)
    })

    it('throws if variable is not present and there is no fallback', () => {
      const env = new Env({})
      expect(() => env.boolean('TEST_A')).toThrow()
    })

    it('throws if variable is not a boolean', () => {
      const env = new Env({ TEST_A: '69' })
      expect(() => env.boolean('TEST_A')).toThrow()
    })
  })
})
