import { Env } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { getStepDownOnThrottle } from './getStepDownOnThrottle'

describe(getStepDownOnThrottle.name, () => {
  const read = (value?: string) =>
    getStepDownOnThrottle(
      new Env({ SHAPE_RPC_STEP_DOWN_ON_THROTTLE: value }),
      'SHAPE_RPC_STEP_DOWN_ON_THROTTLE',
    )

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
        'Step down on throttle must be a number from 0 to below 1',
      )
    })
  }
})
