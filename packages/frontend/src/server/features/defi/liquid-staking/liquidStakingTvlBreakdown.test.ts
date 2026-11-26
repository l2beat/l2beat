import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getLatestComplete,
  getTvlChanges,
  isComplete,
  toBreakdown,
} from './liquidStakingTvlBreakdown'

const day = (
  timestamp: number,
  projects: Record<string, number | null>,
  staked: number | null,
  supply: number | null = 200,
) => toBreakdown({ timestamp, projects, staked, supply, ethPrice: 2 })

describe(toBreakdown.name, () => {
  it('splits the supply into the protocols, Others and the ETH not staked', () => {
    expect(day(1, { lido: 15, rocketpool: 10 }, 50)).toEqual({
      timestamp: 1,
      projects: { lido: 15, rocketpool: 10 },
      liquid: 25,
      others: 25,
      staked: 50,
      notStaked: 150,
      supply: 200,
      ethPrice: 2,
    })
  })

  it('has no liquid total or Others when a protocol is missing, rather than give Others its ETH', () => {
    const breakdown = day(1, { lido: 15, rocketpool: null }, 50)
    expect(breakdown.liquid).toEqual(null)
    expect(breakdown.others).toEqual(null)
    expect(breakdown.notStaked).toEqual(150)
    expect(isComplete(breakdown)).toEqual(false)
  })

  it('leaves out a part that would be below zero, and a supply below the stake, since their inputs disagree', () => {
    const breakdown = day(1, { lido: 60 }, 50, 40)
    expect(breakdown.others).toEqual(null)
    expect(breakdown.supply).toEqual(null)
    expect(breakdown.notStaked).toEqual(null)
    expect(isComplete(breakdown)).toEqual(false)
  })

  it('keeps a supply when the stake is unknown', () => {
    expect(day(1, { lido: 8 }, null, 40).supply).toEqual(40)
  })
})

describe(getLatestComplete.name, () => {
  it('takes the latest complete day', () => {
    const latest = getLatestComplete([
      day(1, { lido: 8, rocketpool: 2 }, 40, null),
      day(2, { lido: 10, rocketpool: null }, 50),
      day(3, { lido: 10, rocketpool: 2 }, null),
    ])
    expect(latest?.timestamp).toEqual(1)
    expect(latest?.others).toEqual(30)
  })
})

describe(getTvlChanges.name, () => {
  const n = (days: number) => days * UnixTime.DAY

  it('ends the changes on the latest complete day, not on a later partial one', () => {
    const days = [
      day(n(0), { lido: 8 }, 40, 100),
      day(n(1), { lido: 8 }, 50, 110),
      day(n(2), { lido: null }, 60, 120),
    ]
    const changes = getTvlChanges(days, getLatestComplete(days)!)
    expect(changes.stake).toEqual({
      value: 0.25,
      eth: 10,
      since: n(0),
      until: n(1),
    })
    expect(changes.supply?.eth).toEqual(10)
  })

  it('starts the supply change after a day whose supply is below its stake', () => {
    const days = [
      day(n(0), { lido: 8 }, 40, 30),
      day(n(1), { lido: 8 }, 45, 100),
      day(n(2), { lido: 8 }, 50, 110),
    ]
    expect(getTvlChanges(days, getLatestComplete(days)!).supply?.since).toEqual(
      n(1),
    )
  })

  it('has no supply change when the latest day has no supply', () => {
    const days = [
      day(n(0), { lido: 8 }, 40, 100),
      day(n(1), { lido: 8 }, 50, null),
    ]
    const changes = getTvlChanges(days, getLatestComplete(days)!)
    expect(changes.stake).not.toEqual(undefined)
    expect(changes.supply).toEqual(undefined)
  })

  it('drops the supply change on a historical range whose final day has no supply', () => {
    const days = [
      day(n(0), { lido: 8 }, 40, 100),
      day(n(1), { lido: 8 }, 45, 105),
      day(n(2), { lido: 8 }, 50, null),
    ]
    const latest = day(n(10), { lido: 8 }, 60, 120)
    const changes = getTvlChanges(days, getLatestComplete([latest])!)
    expect(changes.stake?.until).toEqual(n(2))
    expect(changes.supply).toEqual(undefined)
  })

  it('keeps the supply change on a historical range even when the server latest day has no supply', () => {
    const days = [
      day(n(0), { lido: 8 }, 40, 100),
      day(n(1), { lido: 8 }, 50, 125),
    ]
    const latest = day(n(10), { lido: 8 }, 60, null)
    const changes = getTvlChanges(days, getLatestComplete([latest])!)
    expect(changes.stake?.until).toEqual(n(1))
    expect(changes.supply).toEqual({
      value: 0.25,
      eth: 25,
      since: n(0),
      until: n(1),
    })
  })

  it('ends the supply change on the same day as the stake change on a historical range', () => {
    const days = [
      day(n(0), { lido: 8 }, 40, 100),
      day(n(1), { lido: 8 }, 50, 110),
      day(n(2), { lido: 8 }, null, 120),
    ]
    const latest = day(n(10), { lido: 8 }, 60, 130)
    const changes = getTvlChanges(days, getLatestComplete([latest])!)
    expect(changes.stake?.until).toEqual(n(1))
    expect(changes.supply?.until).toEqual(n(1))
    expect(changes.supply?.eth).toEqual(10)
  })

  it('has no change from a single day', () => {
    const days = [day(n(0), { lido: 8 }, 40, 100)]
    expect(getTvlChanges(days, getLatestComplete(days)!)).toEqual({
      stake: undefined,
      supply: undefined,
    })
  })
})
