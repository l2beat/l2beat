import { expect } from 'earl'
import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'
import { mergeRiskGroups } from './mergeRiskGroups'

describe(mergeRiskGroups.name, () => {
  const item = (text: string) => ({
    text,
    referencedId: 'section',
    isCritical: false,
  })
  const own: RiskGroup[] = [
    { start: 1, name: 'Funds can be stolen if', items: [item('own stolen')] },
    { start: 2, name: 'Funds can be frozen if', items: [item('own frozen')] },
  ]

  it('adds the items under shared headings and the other groups after', () => {
    const merged = mergeRiskGroups(own, [
      {
        name: 'Funds can be stolen if',
        items: [item('other stolen 1'), item('other stolen 2')],
      },
      { name: 'Privacy can be lost if', items: [item('other privacy')] },
    ])

    expect(
      merged.map((group) => ({
        start: group.start,
        name: group.name,
        items: group.items.map((item) => item.text),
      })),
    ).toEqual([
      {
        start: 1,
        name: 'Funds can be stolen if',
        items: ['own stolen', 'other stolen 1', 'other stolen 2'],
      },
      { start: 4, name: 'Funds can be frozen if', items: ['own frozen'] },
      { start: 5, name: 'Privacy can be lost if', items: ['other privacy'] },
    ])
  })
})
