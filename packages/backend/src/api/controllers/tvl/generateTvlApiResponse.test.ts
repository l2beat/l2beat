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
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    // +1, because untilTimestamp is inclusive
    expect(result.projects.arbitrum?.charts.hourly.data.length).toEqual(24 + 1)
  })

  it('adjusts hourly timestamps', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:12:34Z'))
    const untilTimestamp = sinceTimestamp.add(2, 'hours')
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    expect(
      result.projects.arbitrum?.charts.hourly.data.map((x) => x[0]),
    ).toEqual([
      UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
      UnixTime.fromDate(new Date('2024-01-01T01:00:00Z')),
      UnixTime.fromDate(new Date('2024-01-01T02:00:00Z')),
    ])
  })

  it('fills hourly at most 7 days back', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const untilTimestamp = sinceTimestamp.add(123, 'days')
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    // +1, because untilTimestamp is inclusive
    expect(result.projects.arbitrum?.charts.hourly.data.length).toEqual(
      7 * 24 + 1,
    )
  })

  it('fills sixHourly from sinceTimestamp to untilTimestamp', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const untilTimestamp = sinceTimestamp.add(1, 'days')
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    // +1, because untilTimestamp is inclusive
    expect(result.projects.arbitrum?.charts.sixHourly.data.length).toEqual(
      4 + 1,
    )
  })

  it('adjusts sixHourly timestamps', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:12:34Z'))
    const untilTimestamp = sinceTimestamp.add(12, 'hours')
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    expect(
      result.projects.arbitrum?.charts.sixHourly.data.map((x) => x[0]),
    ).toEqual([
      UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
      UnixTime.fromDate(new Date('2024-01-01T06:00:00Z')),
      UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
    ])
  })

  it('fills sixHourly at most 90 days back', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const untilTimestamp = sinceTimestamp.add(123, 'days')
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    // +1, because untilTimestamp is inclusive
    expect(result.projects.arbitrum?.charts.sixHourly.data.length).toEqual(
      90 * 4 + 1,
    )
  })

  it('fills daily from sinceTimestamp to untilTimestamp', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
    const untilTimestamp = sinceTimestamp.add(123, 'days')
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    // +1, because untilTimestamp is inclusive
    expect(result.projects.arbitrum?.charts.daily.data.length).toEqual(123 + 1)
  })

  it('adjusts daily timestamps', () => {
    const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:12:34Z'))
    const untilTimestamp = sinceTimestamp.add(2, 'days')
    const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

    expect(
      result.projects.arbitrum?.charts.daily.data.map((x) => x[0]),
    ).toEqual([
      UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
      UnixTime.fromDate(new Date('2024-01-02T00:00:00Z')),
      UnixTime.fromDate(new Date('2024-01-03T00:00:00Z')),
    ])
  })
})

function generateEmpty(
  project: string,
  sinceTimestamp: UnixTime,
  untilTimestamp: UnixTime,
) {
  return generateTvlApiResponse(
    [],
    [],
    [],
    [],
    [{ id: ProjectId(project), isLayer2: true, sinceTimestamp }],
    untilTimestamp,
  )
}
