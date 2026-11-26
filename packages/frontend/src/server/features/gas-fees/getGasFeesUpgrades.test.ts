import { expect } from 'earl'
import { getGasFeesUpgrades } from './getGasFeesUpgrades'

describe(getGasFeesUpgrades.name, () => {
  it("adds Ethereum's milestones since the fees start, newest first under the next upgrade", () => {
    const milestone = { url: '', type: 'general' as const }
    const upgrades = getGasFeesUpgrades([
      { ...milestone, title: 'Pectra', date: '2025-05-07T00:00:00Z' },
      { ...milestone, title: 'BPO2', date: '2026-01-07T00:00:00Z' },
    ])

    expect(upgrades.map((upgrade) => upgrade.title)).toEqual([
      'Glamsterdam',
      'BPO2',
      'Fusaka',
      'Gas limit 45M → 60M',
    ])
  })
})
