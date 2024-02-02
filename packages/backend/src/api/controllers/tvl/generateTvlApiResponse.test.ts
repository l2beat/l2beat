import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { generateTvlApiResponse } from './generateTvlApiResponse'

describe(generateTvlApiResponse.name, () => {
  it('returns the correct groupings', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const untilTimestamp = sinceTimestamp.add(1, 'days')

    const result = generateTvlApiResponse(
      [],
      [],
      [],
      [],
      [
        { id: ProjectId('arbitrum'), isLayer2: true, sinceTimestamp },
        { id: ProjectId('optimism'), isLayer2: true, sinceTimestamp },
        { id: ProjectId('avalanche'), isLayer2: true, sinceTimestamp },
      ],
      untilTimestamp,
    )

    expect(result.projects.arbitrum).not.toEqual(undefined)
    expect(result.projects.optimism).not.toEqual(undefined)
    expect(result.projects.avalanche).not.toEqual(undefined)
  })

  it('fills hourly from sinceTimestamp to untilTimestamp', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const untilTimestamp = sinceTimestamp.add(1, 'days')

    const result = generateTvlApiResponse(
      [],
      [],
      [],
      [],
      [{ id: ProjectId('arbitrum'), isLayer2: true, sinceTimestamp }],
      untilTimestamp,
    )

    // +1, because untilTimestamp is inclusive
    expect(result.projects.arbitrum?.charts.hourly.data.length).toEqual(24 + 1)
  })

  it('fills hourly at most 7 days back', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const untilTimestamp = sinceTimestamp.add(123, 'days')

    const result = generateTvlApiResponse(
      [],
      [],
      [],
      [],
      [{ id: ProjectId('arbitrum'), isLayer2: true, sinceTimestamp }],
      untilTimestamp,
    )

    // +1, because untilTimestamp is inclusive
    expect(result.projects.arbitrum?.charts.hourly.data.length).toEqual(
      7 * 24 + 1,
    )
  })
})
