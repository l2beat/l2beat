import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { addMissingTimestamps } from './charts'

const now = UnixTime.now().toStartOf('day')

describe(addMissingTimestamps.name, () => {
  it('returns empty for empty input', () => {
    expect(addMissingTimestamps([], 1)).toEqual([])
  })

  const cases = [1, 6, 24]
  cases.forEach((hours) => {
    it(`adds missing ${hours}h timestamps`, () => {
      expect(
        addMissingTimestamps(
          [
            [now, 1, 1],
            [now.add(2 * hours, 'hours'), 2, 2],
            [now.add(5 * hours, 'hours'), 5, 5],
          ],
          hours,
        ),
      ).toEqual([
        [now, 1, 1],
        [now.add(1 * hours, 'hours'), 1, 1],
        [now.add(2 * hours, 'hours'), 2, 2],
        [now.add(3 * hours, 'hours'), 2, 2],
        [now.add(4 * hours, 'hours'), 2, 2],
        [now.add(5 * hours, 'hours'), 5, 5],
      ])
    })
  })
})
