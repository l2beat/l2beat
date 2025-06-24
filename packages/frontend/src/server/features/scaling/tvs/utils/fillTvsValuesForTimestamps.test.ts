import type { ProjectValueRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { fillTvsValuesForTimestamps } from './fillTvsValuesForTimestamps'

describe(fillTvsValuesForTimestamps.name, () => {
  it('groups values based on provided timestamps', () => {
    const result = fillTvsValuesForTimestamps(
      {
        '100': mockProjectValue(100),
        '150': mockProjectValue(150),
        '200': mockProjectValue(200),
        '250': mockProjectValue(250),
        '300': mockProjectValue(300),
      },
      [100, 200, 300],
      undefined,
    )
    expect(result).toEqual({
      '100': mockProjectValue(100),
      '200': mockProjectValue(200),
      '300': mockProjectValue(300),
    })
  })

  it('groups values and forwards fill values with latest known value', () => {
    const result = fillTvsValuesForTimestamps(
      {
        '100': mockProjectValue(100),
        '150': mockProjectValue(150),
      },
      [100, 200, 300],
      mockProjectValue(150),
    )
    expect(result).toEqual({
      '100': mockProjectValue(100),
      '200': mockProjectValue(150),
      '300': mockProjectValue(150),
    })
  })

  it('starts from first record', () => {
    const result = fillTvsValuesForTimestamps(
      {
        '200': mockProjectValue(100),
        '250': mockProjectValue(150),
      },
      [100, 200, 300],
      mockProjectValue(150),
    )
    expect(result).toEqual({
      '200': mockProjectValue(100),
      '300': mockProjectValue(150),
    })
  })
})

function mockProjectValue(timestamp: UnixTime) {
  return mockObject<ProjectValueRecord>({
    timestamp,
    value: timestamp * 10,
  })
}
