import { Env } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { getRpcStepDownOnThrottle } from './getRpcStepDownOnThrottle'

describe(getRpcStepDownOnThrottle.name, () => {
  const read = (value?: string) =>
    getRpcStepDownOnThrottle(new Env({ RPC_STEP_DOWN_ON_THROTTLE: value }))

  it('leaves the rate fixed when the variable is not set', () => {
    expect(read()).toEqual(undefined)
  })

  it('reads the share of the rate to give up', () => {
    expect(read('0.1')).toEqual(0.1)
  })

  // Why: the variable was a boolean before it carried the share, and a
  // share of 1 would take a client to its floor on the first refusal
  for (const value of ['true', '1', '-0.1', '']) {
    it(`rejects ${JSON.stringify(value)}`, () => {
      expect(() => read(value)).toThrow(
        'RPC_STEP_DOWN_ON_THROTTLE must be a number from 0 to below 1',
      )
    })
  }
})
