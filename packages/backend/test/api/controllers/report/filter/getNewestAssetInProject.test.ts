import { AssetId, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getNewestAssetsInProject } from '../../../../../src/api/controllers/report/filter/getNewestAssetsInProject'
import { fakeReport } from '../../../../fakes'

describe(getNewestAssetsInProject.name, () => {
  const TODAY = UnixTime.now().toStartOf('day')

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const ASSET_A = AssetId('apple')
  const ASSET_B = AssetId('banana')

  function mockReport(projectId: ProjectId, asset: AssetId, offset: number) {
    return {
      ...fakeReport(),
      timestamp: TODAY.add(offset, 'days'),
      projectId,
      asset,
    }
  }

  it('returns mapping', () => {
    const reports = [
      mockReport(PROJECT_A, ASSET_A, 0),
      mockReport(PROJECT_A, ASSET_A, -1),
      mockReport(PROJECT_A, ASSET_A, -2),

      mockReport(PROJECT_A, ASSET_B, 0),
      mockReport(PROJECT_A, ASSET_B, -1),
      mockReport(PROJECT_A, ASSET_B, -2),

      mockReport(PROJECT_B, ASSET_A, -1),
      mockReport(PROJECT_B, ASSET_A, -2),

      mockReport(PROJECT_B, ASSET_B, 0),
    ]

    const result = getNewestAssetsInProject(reports)

    expect(result).toEqual(
      new Map([
        [`${PROJECT_A.toString()}-${ASSET_A.toString()}`, TODAY],
        [`${PROJECT_A.toString()}-${ASSET_B.toString()}`, TODAY],
        [
          `${PROJECT_B.toString()}-${ASSET_A.toString()}`,
          TODAY.add(-1, 'days'),
        ],
        [`${PROJECT_B.toString()}-${ASSET_B.toString()}`, TODAY],
      ]),
    )
  })
})
