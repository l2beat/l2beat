import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeChartSeries } from './describeChartSeries'

// Captions are the only text a crawler sees for a chart, so these tests pin
// the full sentence rather than fragments: a reworded caption should be a
// deliberate, reviewed change.
describe(describeChartSeries.name, () => {
  const START = UnixTime.fromDate(new Date('2025-09-23T00:00:00Z'))
  const END = UnixTime.fromDate(new Date('2026-09-22T00:00:00Z'))
  const formatValue = (value: number) => `${value} units`

  it('states the subject, range, latest value and change over the range', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [
        { timestamp: START, value: 100 },
        { timestamp: START + UnixTime.DAY, value: 90 },
        { timestamp: END, value: 125 },
      ],
      formatValue,
    })

    expect(caption).toEqual(
      'Widgets produced by Foo from 2025 Sep 23 to 2026 Sep 22. Latest value: 125 units, up 25.0% over this range.',
    )
  })

  it('reports a change exactly despite floating point ratios', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [
        { timestamp: START, value: 10e9 },
        { timestamp: END, value: 12e9 },
      ],
      formatValue,
    })

    expect(caption).toInclude('up 20.0% over this range.')
  })

  it('reports a decrease as down', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [
        { timestamp: START, value: 200 },
        { timestamp: END, value: 150 },
      ],
      formatValue,
    })

    expect(caption).toInclude(
      'Latest value: 150 units, down 25.0% over this range.',
    )
  })

  it('reports an unchanged value', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [
        { timestamp: START, value: 7 },
        { timestamp: END, value: 7 },
      ],
      formatValue,
    })

    expect(caption).toInclude(
      'Latest value: 7 units, unchanged over this range.',
    )
  })

  it('skips points without data when picking the first and latest value', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [
        { timestamp: START - UnixTime.DAY, value: null },
        { timestamp: START, value: 100 },
        { timestamp: END, value: 150 },
        { timestamp: END + UnixTime.DAY, value: null },
      ],
      formatValue,
    })

    expect(caption).toEqual(
      'Widgets produced by Foo from 2025 Sep 23 to 2026 Sep 22. Latest value: 150 units, up 50.0% over this range.',
    )
  })

  it('omits the change when the range starts at zero', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [
        { timestamp: START, value: 0 },
        { timestamp: END, value: 150 },
      ],
      formatValue,
    })

    expect(caption).toInclude('Latest value: 150 units.')
    expect(caption).not.toInclude('over this range')
  })

  it('says there is no data when no point has a value', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [{ timestamp: START, value: null }],
      formatValue,
    })

    expect(caption).toEqual(
      'Widgets produced by Foo. No data is available for this range.',
    )
  })

  it('appends extra facts after the summary', () => {
    const caption = describeChartSeries({
      subject: 'Widgets produced by Foo',
      points: [
        { timestamp: START, value: 100 },
        { timestamp: END, value: 125 },
      ],
      formatValue,
      extraFacts: ['Total over this range: 225 units.'],
    })

    expect(caption).toEqual(
      'Widgets produced by Foo from 2025 Sep 23 to 2026 Sep 22. Latest value: 125 units, up 25.0% over this range. Total over this range: 225 units.',
    )
  })
})
