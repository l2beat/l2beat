import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getTimestampedMilestones } from './ChartMilestones'

function ts(iso: string): number {
  return UnixTime.fromDate(new Date(iso))
}

function milestone(date: string): Milestone {
  return {
    type: 'general',
    title: date,
    url: 'https://example.com',
    date,
  }
}

function points(timestamps: number[]) {
  return timestamps.map((timestamp) => ({ timestamp }))
}

describe('getTimestampedMilestones', () => {
  it('snaps a milestone to the start of its day on a daily grid', () => {
    const data = points([
      ts('2024-05-25T00:00:00Z'),
      ts('2024-05-26T00:00:00Z'),
      ts('2024-05-27T00:00:00Z'),
    ])
    const result = getTimestampedMilestones(data, [
      milestone('2024-05-26T21:59:45Z'),
    ])

    const attached = result.filter((p) => p.milestones.length > 0)
    expect(attached.length).toEqual(1)
    expect(attached[0]?.timestamp).toEqual(ts('2024-05-26T00:00:00Z'))
  })

  it('snaps to the milestone hour on an hourly grid', () => {
    const data = points([
      ts('2024-05-26T20:00:00Z'),
      ts('2024-05-26T21:00:00Z'),
      ts('2024-05-26T22:00:00Z'),
    ])
    const result = getTimestampedMilestones(data, [
      milestone('2024-05-26T21:59:45Z'),
    ])

    const attached = result.filter((p) => p.milestones.length > 0)
    expect(attached.length).toEqual(1)
    expect(attached[0]?.timestamp).toEqual(ts('2024-05-26T21:00:00Z'))
  })

  it('drops milestones that fall before the first datapoint', () => {
    const data = points([
      ts('2024-05-26T00:00:00Z'),
      ts('2024-05-27T00:00:00Z'),
    ])
    const result = getTimestampedMilestones(data, [
      milestone('2024-05-24T12:00:00Z'),
    ])

    expect(result.every((p) => p.milestones.length === 0)).toEqual(true)
  })

  it('drops milestones that fall after the last datapoint', () => {
    const data = points([
      ts('2024-05-26T00:00:00Z'),
      ts('2024-05-27T00:00:00Z'),
    ])
    const result = getTimestampedMilestones(data, [
      milestone('2024-05-28T06:00:00Z'),
    ])

    expect(result.every((p) => p.milestones.length === 0)).toEqual(true)
  })

  it('groups same-day milestones on a daily grid', () => {
    const data = points([
      ts('2024-05-26T00:00:00Z'),
      ts('2024-05-27T00:00:00Z'),
    ])
    const result = getTimestampedMilestones(data, [
      milestone('2024-05-26T03:00:00Z'),
      milestone('2024-05-26T21:00:00Z'),
    ])

    const attached = result.filter((p) => p.milestones.length > 0)
    expect(attached.length).toEqual(1)
    expect(attached[0]?.milestones.length).toEqual(2)
  })

  it('separates same-day milestones on an hourly grid', () => {
    const data = points([
      ts('2024-05-26T03:00:00Z'),
      ts('2024-05-26T04:00:00Z'),
      ts('2024-05-26T20:00:00Z'),
      ts('2024-05-26T21:00:00Z'),
    ])
    const result = getTimestampedMilestones(data, [
      milestone('2024-05-26T03:30:00Z'),
      milestone('2024-05-26T21:00:00Z'),
    ])

    const attached = result.filter((p) => p.milestones.length > 0)
    expect(attached.length).toEqual(2)
    expect(attached.map((p) => p.timestamp)).toEqual([
      ts('2024-05-26T03:00:00Z'),
      ts('2024-05-26T21:00:00Z'),
    ])
  })
})
