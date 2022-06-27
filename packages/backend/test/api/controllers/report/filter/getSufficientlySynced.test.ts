import { AssetId, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getSufficientlySynced } from '../../../../../src/api/controllers/report/filter/getSufficientlySynced'

describe(getSufficientlySynced.name, () => {
  const TODAY = UnixTime.now().toStartOf('day')
  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')
  const ASSET_A = AssetId('apple')
  const ASSET_B = AssetId('banana')

  function mockReport(projectId: ProjectId, asset: AssetId, offset: number) {
    return {
      timestamp: TODAY.add(offset, 'days'),
      projectId,
      asset,
      blockNumber: 0n,
      balanceUsd: 0n,
      balanceEth: 0n,
      balance: 0n,
    }
  }

  it('nothing to exclude', () => {
    const reports = [
      mockReport(PROJECT_A, ASSET_A, 0),
      mockReport(PROJECT_A, ASSET_A, -1),
      mockReport(PROJECT_A, ASSET_A, -2),
      mockReport(PROJECT_B, ASSET_A, 0),
      mockReport(PROJECT_B, ASSET_A, -1),
      mockReport(PROJECT_B, ASSET_A, -2),
      mockReport(PROJECT_B, ASSET_B, 0),
      mockReport(PROJECT_B, ASSET_B, -1),
      mockReport(PROJECT_B, ASSET_B, -2),
    ]
    const result = getSufficientlySynced(reports)
    expect(result).toEqual(reports)
  })

  it('exclude out of sync project', () => {
    const reports = [
      mockReport(PROJECT_A, ASSET_A, 0),
      mockReport(PROJECT_A, ASSET_A, -1),
      mockReport(PROJECT_A, ASSET_A, -2),
      mockReport(PROJECT_A, ASSET_A, -3),

      mockReport(PROJECT_B, ASSET_A, 0),
      mockReport(PROJECT_B, ASSET_A, -1),
      mockReport(PROJECT_B, ASSET_A, -2),
      mockReport(PROJECT_B, ASSET_A, -3),

      mockReport(PROJECT_B, ASSET_B, -2),
      mockReport(PROJECT_B, ASSET_B, -3),
    ]
    const result = getSufficientlySynced(reports)
    expect(result).toEqual([
      mockReport(PROJECT_A, ASSET_A, 0),
      mockReport(PROJECT_A, ASSET_A, -1),
      mockReport(PROJECT_A, ASSET_A, -2),
      mockReport(PROJECT_A, ASSET_A, -3),

      mockReport(PROJECT_B, ASSET_A, 0),
      mockReport(PROJECT_B, ASSET_A, -1),
      mockReport(PROJECT_B, ASSET_A, -2),
      mockReport(PROJECT_B, ASSET_A, -3),
    ])
  })

  it('go back in time one day', () => {
    const reports = [
      mockReport(PROJECT_A, ASSET_A, 0),
      mockReport(PROJECT_A, ASSET_A, -1),
      mockReport(PROJECT_A, ASSET_A, -2),
      mockReport(PROJECT_A, ASSET_A, -3),

      mockReport(PROJECT_B, ASSET_A, 0),
      mockReport(PROJECT_B, ASSET_A, -1),
      mockReport(PROJECT_B, ASSET_A, -2),
      mockReport(PROJECT_B, ASSET_A, -3),

      mockReport(PROJECT_B, ASSET_B, -1),
      mockReport(PROJECT_B, ASSET_B, -2),
      mockReport(PROJECT_B, ASSET_B, -3),
    ]
    const result = getSufficientlySynced(reports)
    expect(result).toEqual([
      mockReport(PROJECT_A, ASSET_A, -1),
      mockReport(PROJECT_A, ASSET_A, -2),
      mockReport(PROJECT_A, ASSET_A, -3),

      mockReport(PROJECT_B, ASSET_A, -1),
      mockReport(PROJECT_B, ASSET_A, -2),
      mockReport(PROJECT_B, ASSET_A, -3),

      mockReport(PROJECT_B, ASSET_B, -1),
      mockReport(PROJECT_B, ASSET_B, -2),
      mockReport(PROJECT_B, ASSET_B, -3),
    ])
  })
})
