import { ProjectId, TvlApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { AggregatedReportRecord } from '../repositories/AggregatedReportRepository'
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

  describe('empty', () => {
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

    it('fills hourly from sinceTimestamp to untilTimestamp', () => {
      const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
      const untilTimestamp = sinceTimestamp.add(1, 'days')
      const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

      // +1, because untilTimestamp is inclusive
      expect(result.projects.arbitrum?.charts.hourly.data.length).toEqual(
        24 + 1,
      )
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

      expect(result.projects.arbitrum?.charts.hourly.data.length).toEqual(
        7 * 24,
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

      expect(result.projects.arbitrum?.charts.sixHourly.data.length).toEqual(
        90 * 4,
      )
    })

    it('fills daily from sinceTimestamp to untilTimestamp', () => {
      const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
      const untilTimestamp = sinceTimestamp.add(123, 'days')
      const result = generateEmpty('arbitrum', sinceTimestamp, untilTimestamp)

      // +1, because untilTimestamp is inclusive
      expect(result.projects.arbitrum?.charts.daily.data.length).toEqual(
        123 + 1,
      )
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

  describe('filling', () => {
    it('fills hourly with the correct values', () => {
      const t0 = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
      const t1 = t0.add(1, 'hours')

      const result = generateTvlApiResponse(
        [
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t1,
            usdValue: 32_000_00n,
            ethValue: 16_000000n,
            reportType: 'TVL',
          },
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t1,
            usdValue: 12_000_00n,
            ethValue: 6_000000n,
            reportType: 'CBV',
          },
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t1,
            usdValue: 16_000_00n,
            ethValue: 8_000000n,
            reportType: 'EBV',
          },
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t1,
            usdValue: 4_000_00n,
            ethValue: 2_000000n,
            reportType: 'NMV',
          },
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t0,
            usdValue: 16_000_00n,
            ethValue: 8_000000n,
            reportType: 'TVL',
          },
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t0,
            usdValue: 6_000_00n,
            ethValue: 3_000000n,
            reportType: 'CBV',
          },
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t0,
            usdValue: 8_000_00n,
            ethValue: 4_000000n,
            reportType: 'EBV',
          },
          {
            projectId: ProjectId('arbitrum'),
            timestamp: t0,
            usdValue: 2_000_00n,
            ethValue: 1_000000n,
            reportType: 'NMV',
          },
        ],
        [],
        [],
        [],
        [{ id: ProjectId('arbitrum'), isLayer2: true, sinceTimestamp: t0 }],
        t1,
      )

      expect(result.projects.arbitrum?.charts.hourly.data).toEqual([
        [t0, 16_000, 6_000, 8_000, 2_000, 8, 3, 4, 1],
        [t1, 32_000, 12_000, 16_000, 4_000, 16, 6, 8, 2],
      ])
    })

    it('does not include unknown projects', () => {
      const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
      const untilTimestamp = sinceTimestamp.add(1, 'hours')

      const result = generateTvlApiResponse(
        [
          {
            projectId: ProjectId('foo'),
            timestamp: untilTimestamp,
            usdValue: 1n,
            ethValue: 1n,
            reportType: 'TVL',
          },
        ],
        [],
        [],
        [],
        [{ id: ProjectId('arbitrum'), isLayer2: true, sinceTimestamp }],
        untilTimestamp,
      )

      expect(result.projects.foo).toEqual(undefined)
    })

    it('does not include invalid timestamps', () => {
      const sinceTimestamp = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
      const untilTimestamp = sinceTimestamp.add(1, 'hours')

      const result = generateTvlApiResponse(
        [
          {
            projectId: ProjectId('arbitrum'),
            timestamp: sinceTimestamp.add(-1, 'hours'),
            usdValue: 1n,
            ethValue: 1n,
            reportType: 'TVL',
          },
        ],
        [],
        [],
        [],
        [{ id: ProjectId('arbitrum'), isLayer2: true, sinceTimestamp }],
        untilTimestamp,
      )

      expect(
        result.projects.arbitrum?.charts.hourly.data.map((x) => x[0]),
      ).toEqual([sinceTimestamp, untilTimestamp])
    })
  })

  describe('aggregating', () => {
    it('generates aggregates for layer2s, bridges and combined', () => {
      const t0 = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

      const projects = [
        {
          id: ProjectId('arbitrum'),
          isLayer2: true,
        },
        {
          id: ProjectId('optimism'),
          isLayer2: true,
        },
        {
          id: ProjectId('stargate'),
          isLayer2: false,
        },
      ].map((p) => ({ ...p, sinceTimestamp: t0 }))

      const mock = (projectId: ProjectId, timestamp: UnixTime) =>
        getMockAggregatedRecord(projectId, timestamp, 32n, 12n, 16n, 4n)

      const expected = (props: { multiplier: number; t: UnixTime }) =>
        getMockChartPoint(props.t, props.multiplier, 32, 12, 16, 4)

      const result = generateTvlApiResponse(
        [
          ...mock(projects[0].id, t0),
          ...mock(projects[1].id, t0),
          ...mock(projects[2].id, t0),
          ...mock(projects[0].id, t0.add(1, 'hours')),
          ...mock(projects[1].id, t0.add(1, 'hours')),
          ...mock(projects[2].id, t0.add(1, 'hours')),
        ],
        [
          ...mock(projects[0].id, t0),
          ...mock(projects[1].id, t0),
          ...mock(projects[2].id, t0),
          ...mock(projects[0].id, t0.add(6, 'hours')),
          ...mock(projects[1].id, t0.add(6, 'hours')),
          ...mock(projects[2].id, t0.add(6, 'hours')),
        ],
        [
          ...mock(projects[0].id, t0),
          ...mock(projects[1].id, t0),
          ...mock(projects[2].id, t0),
          ...mock(projects[0].id, t0.add(1, 'days')),
          ...mock(projects[1].id, t0.add(1, 'days')),
          ...mock(projects[2].id, t0.add(1, 'days')),
        ],
        [],
        projects,
        t0.add(1, 'days'),
      )

      const aggregates: {
        key: 'layers2s' | 'bridges' | 'combined'
        multiplier: number
      }[] = [
        {
          key: 'layers2s',
          multiplier: 2,
        },
        {
          key: 'bridges',
          multiplier: 1,
        },
        {
          key: 'combined',
          multiplier: 3,
        },
      ]

      for (const aggregate of aggregates) {
        expect(result[aggregate.key].hourly.data.slice(0, 2)).toEqual([
          expected({ t: t0, multiplier: aggregate.multiplier }),
          expected({ t: t0.add(1, 'hours'), multiplier: aggregate.multiplier }),
        ])

        expect(result[aggregate.key].sixHourly.data.slice(0, 2)).toEqual([
          expected({ t: t0, multiplier: aggregate.multiplier }),
          expected({ t: t0.add(6, 'hours'), multiplier: aggregate.multiplier }),
        ])

        expect(result[aggregate.key].daily.data.slice(0, 2)).toEqual([
          expected({ t: t0, multiplier: aggregate.multiplier }),
          expected({ t: t0.add(1, 'days'), multiplier: aggregate.multiplier }),
        ])
      }
    })
  })
})

function getMockAggregatedRecord(
  projectId: ProjectId,
  timestamp: UnixTime,
  tvl: bigint,
  cbv: bigint,
  ebv: bigint,
  nmv: bigint,
): AggregatedReportRecord[] {
  return [
    {
      projectId,
      timestamp,
      usdValue: tvl * 100_000n,
      ethValue: tvl * 1000000n,
      reportType: 'TVL',
    },
    {
      projectId,
      timestamp,
      usdValue: cbv * 100_000n,
      ethValue: cbv * 1000000n,
      reportType: 'CBV',
    },
    {
      projectId,
      timestamp,
      usdValue: ebv * 100_000n,
      ethValue: ebv * 1000000n,
      reportType: 'EBV',
    },
    {
      projectId,
      timestamp,
      usdValue: nmv * 100_000n,
      ethValue: nmv * 1000000n,
      reportType: 'NMV',
    },
  ]
}

function getMockChartPoint(
  timestamp: UnixTime,
  multiplier: number,
  tvl: number,
  cbv: number,
  ebv: number,
  nmv: number,
): TvlApiChartPoint {
  return [
    timestamp,
    multiplier * tvl * 1000,
    multiplier * cbv * 1000,
    multiplier * ebv * 1000,
    multiplier * nmv * 1000,
    multiplier * tvl,
    multiplier * cbv,
    multiplier * ebv,
    multiplier * nmv,
  ]
}
