import { expect } from 'earljs'

import { getEnv } from '../../src/config/getEnv'

describe(getEnv.name, () => {
  it('returns the environment variable', () => {
    process.env.TEST_A = 'foo'
    const result = getEnv('TEST_A')
    expect(result).toEqual('foo')
  })

  it('returns the fallback if the variable is not present', () => {
    delete process.env.TEST_A
    const result = getEnv('TEST_A', 'bar')
    expect(result).toEqual('bar')
  })

  it('throws if variable is not present and there is no fallback', () => {
    delete process.env.TEST_A
    expect(() => getEnv('TEST_A')).toThrow()
  })

  describe(getEnv.integer.name, () => {
    it('returns the environment variable as integer', () => {
      process.env.TEST_A = '-420'
      const result = getEnv.integer('TEST_A')
      expect(result).toEqual(-420)
    })

    it('returns the fallback if the variable is not present', () => {
      delete process.env.TEST_A
      const result = getEnv.integer('TEST_A', 69)
      expect(result).toEqual(69)
    })

    it('throws if variable is not present and there is no fallback', () => {
      delete process.env.TEST_A
      expect(() => getEnv.integer('TEST_A')).toThrow()
    })

    it('throws if variable is not an integer', () => {
      process.env.TEST_A = 'foo'
      expect(() => getEnv.integer('TEST_A')).toThrow()
    })
  })
})
