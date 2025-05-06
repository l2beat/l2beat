import { expect } from 'earl'

import { Env } from './env'

describe(Env.name, () => {
  describe(Env.key.name, () => {
    it('returns correct environment variable key', () => {
      const result = Env.key('polygon-pos', 'RPC_URL')
      expect(result).toEqual('POLYGONPOS_RPC_URL')
    })
  })

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

    it('supports array keys', () => {
      const env = new Env({ TEST_A: 'foo', TEST_C: 'bar' })
      expect(env.string(['TEST_B', 'TEST_A'])).toEqual('foo')
      expect(env.string(['TEST_C', 'TEST_A'])).toEqual('bar')
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

    it('supports array keys', () => {
      const env = new Env({ TEST_A: '69', TEST_C: '-420' })
      expect(env.integer(['TEST_B', 'TEST_A'])).toEqual(69)
      expect(env.integer(['TEST_C', 'TEST_A'])).toEqual(-420)
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

    it('supports array keys', () => {
      const env = new Env({ TEST_A: 'true', TEST_C: 'false' })
      expect(env.boolean(['TEST_B', 'TEST_A'])).toEqual(true)
      expect(env.boolean(['TEST_C', 'TEST_A'])).toEqual(false)
    })
  })
})
