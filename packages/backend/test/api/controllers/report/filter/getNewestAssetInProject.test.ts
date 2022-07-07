import { AssetId, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getNewestAssetsInProject } from '../../../../../src/api/controllers/report/filter/getNewestAssetsInProject'
import { ReportRecord } from '../../../../../src/peripherals/database/ReportRepository'

describe(getNewestAssetsInProject.name, () => {
  const TODAY = UnixTime.now().toStartOf('day')

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const ASSET_A = AssetId('apple')
  const ASSET_B = AssetId('banana')

  function fakeReport(
    projectId: ProjectId,
    asset: AssetId,
    offset: number,
  ): ReportRecord {
    return {
      timestamp: TODAY.add(offset, 'days'),
      projectId,
      asset,
      balance: 1234n,
      balanceUsd: 1234n,
      balanceEth: 1234n,
    }
  }

  it('returns mapping', () => {
    const reports = [
      fakeReport(PROJECT_A, ASSET_A, 0),
      fakeReport(PROJECT_A, ASSET_A, -1),
      fakeReport(PROJECT_A, ASSET_A, -2),

      fakeReport(PROJECT_A, ASSET_B, 0),
      fakeReport(PROJECT_A, ASSET_B, -1),
      fakeReport(PROJECT_A, ASSET_B, -2),

      fakeReport(PROJECT_B, ASSET_A, -1),
      fakeReport(PROJECT_B, ASSET_A, -2),

      fakeReport(PROJECT_B, ASSET_B, 0),
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
