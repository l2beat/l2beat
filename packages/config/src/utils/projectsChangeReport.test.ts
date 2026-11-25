import { expect } from 'earl'
import {
  buildProjectsChangeReport,
  hasImpactfulChange,
  type UpdateDiffLike,
} from './projectsChangeReport'

const ADDRESS = '0x1111111111111111111111111111111111111111'

describe(buildProjectsChangeReport.name, () => {
  // Why: a diff found before the project's config was last rebuilt has
  // already been assessed, and must not mark the project as under review.
  // How: one diff older and one newer than the project's base timestamp.
  it('ignores diffs older than the project discovery base', () => {
    const report = buildProjectsChangeReport(
      [
        diff('old', 'implementationChange', `eth:${ADDRESS}`, 100),
        diff('new', 'implementationChange', `eth:${ADDRESS}`, 300),
      ],
      () => 200,
    )

    expect(hasImpactfulChange(report, 'old')).toEqual(false)
    expect(hasImpactfulChange(report, 'new')).toEqual(true)
  })

  // Why: an implementation change counts on any chain, but field and
  // upgrader changes only on Ethereum, which the website relies on.
  // How: one project per rule, each with a single diff.
  it('applies the per-chain rules for impactful changes', () => {
    const report = buildProjectsChangeReport(
      [
        diff('impl-l2', 'implementationChange', `arb1:${ADDRESS}`, 1),
        diff('field-l2', 'highSeverityFieldChange', `arb1:${ADDRESS}`, 1),
        diff('field-eth', 'highSeverityFieldChange', `eth:${ADDRESS}`, 1),
        diff('upgrader-eth', 'ultimateUpgraderChange', `eth:${ADDRESS}`, 1),
        diff('verified-eth', 'becameVerified', `eth:${ADDRESS}`, 1),
      ],
      () => undefined,
    )

    expect(
      [
        'impl-l2',
        'field-l2',
        'field-eth',
        'upgrader-eth',
        'verified-eth',
        'none',
      ].map((id) => [id, hasImpactfulChange(report, id)]),
    ).toEqual([
      ['impl-l2', true],
      ['field-l2', false],
      ['field-eth', true],
      ['upgrader-eth', true],
      ['verified-eth', false],
      ['none', false],
    ])
  })
})

function diff(
  projectId: string,
  type: UpdateDiffLike['type'],
  address: string,
  diffBaseTimestamp: number,
): UpdateDiffLike {
  return { projectId, type, address, diffBaseTimestamp }
}
