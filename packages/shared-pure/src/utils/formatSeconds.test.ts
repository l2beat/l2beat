import { expect } from 'earl'

import { formatSeconds } from './formatSeconds'

describe(formatSeconds.name, () => {
  it('rounds up seconds to lower unit', () => {
    expect(formatSeconds(1)).toEqual('1s')
    expect(formatSeconds(60)).toEqual('1m')
    expect(formatSeconds(61)).toEqual('1m 1s')
    expect(formatSeconds(3600)).toEqual('1h')
    expect(formatSeconds(3601)).toEqual('1h')
    expect(formatSeconds(3660)).toEqual('1h 1m')
    expect(formatSeconds(3661)).toEqual('1h 1m')

    expect(formatSeconds(86400)).toEqual('1d')
    expect(formatSeconds(86401)).toEqual('1d')
    expect(formatSeconds(86460)).toEqual('1d')
    expect(formatSeconds(86461)).toEqual('1d')
    expect(formatSeconds(90000)).toEqual('1d 1h')
    expect(formatSeconds(90060)).toEqual('1d 1h')
    expect(formatSeconds(90061)).toEqual('1d 1h')
  })

  it('does not round up', () => {
    expect(formatSeconds(1, { preventRoundingUp: true })).toEqual('1s')
    expect(formatSeconds(60, { preventRoundingUp: true })).toEqual('1m')
    expect(formatSeconds(61, { preventRoundingUp: true })).toEqual('1m 1s')
    expect(formatSeconds(3600, { preventRoundingUp: true })).toEqual('1h')
    expect(formatSeconds(3601, { preventRoundingUp: true })).toEqual('1h 1s')
    expect(formatSeconds(3660, { preventRoundingUp: true })).toEqual('1h 1m')
    expect(formatSeconds(3661, { preventRoundingUp: true })).toEqual('1h 1m 1s')

    expect(formatSeconds(86400, { preventRoundingUp: true })).toEqual('1d')
    expect(formatSeconds(86401, { preventRoundingUp: true })).toEqual('1d 1s')
    expect(formatSeconds(86460, { preventRoundingUp: true })).toEqual('1d 1m')
    expect(formatSeconds(86461, { preventRoundingUp: true })).toEqual(
      '1d 1m 1s',
    )
    expect(formatSeconds(90000, { preventRoundingUp: true })).toEqual('1d 1h')
    expect(formatSeconds(90060, { preventRoundingUp: true })).toEqual(
      '1d 1h 1m',
    )
    expect(formatSeconds(90061, { preventRoundingUp: true })).toEqual(
      '1d 1h 1m 1s',
    )
  })
})
