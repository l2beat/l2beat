import { Env } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { getClockOffset } from './getClockOffset'

describe(getClockOffset.name, () => {
  it('defaults to one hour', () => {
    expect(getClockOffset(new Env({}))).toEqual({
      offsetSeconds: 3600,
      source: 'default',
    })
  })

  it('reads the offset from env', () => {
    const env = new Env({ CLOCK_SAFE_TIME_OFFSET_SECONDS: '900' })
    expect(getClockOffset(env)).toEqual({ offsetSeconds: 900, source: 'env' })
  })

  it('accepts the bounds', () => {
    for (const value of ['60', '86400']) {
      const env = new Env({ CLOCK_SAFE_TIME_OFFSET_SECONDS: value })
      expect(getClockOffset(env).offsetSeconds).toEqual(Number(value))
    }
  })

  for (const value of [
    '59',
    '86401',
    '900.5',
    'abc',
    '',
    '-900',
    '0x384',
    '9e2',
    ' 900',
    '0900',
  ]) {
    it(`throws for ${JSON.stringify(value)}`, () => {
      const env = new Env({ CLOCK_SAFE_TIME_OFFSET_SECONDS: value })
      expect(() => getClockOffset(env)).toThrow(
        'Invalid CLOCK_SAFE_TIME_OFFSET_SECONDS',
      )
    })
  }
})
