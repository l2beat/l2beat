import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { findCutoffTime } from './findCutoffTime'

describe(findCutoffTime.name, () => {
  it('returns correct cutoff date for provided data', () => {
    // These timestamps don't make much sense, but they are just for testing purposes
    return expect(
      findCutoffTime([
        [{ timestamp: new UnixTime(2024_02_10) }],
        [{ timestamp: new UnixTime(2024_02_10) }],
        [{ timestamp: new UnixTime(2024_02_09) }],
        [{ timestamp: new UnixTime(2024_02_09) }],
        [{ timestamp: new UnixTime(2024_02_09) }],
      ]),
    ).toEqual(new UnixTime(2024_02_09))
  })
})
