import { v } from '@l2beat/validate'
import { getPrivacyAmountRecordsByProject } from './db/PrivacyAmountAnalysisRepo'
import {
  aggregateAmountRecords,
  computeAddressOverlap,
  type PrivacyAmountAnalysisDirectionData,
  type PrivacyAmountOverlap,
} from './privacyAmountAnalysisUtils'

/**
 * Amount analysis is a demo-only feature hardcoded to these three protocols.
 */
export const PRIVACY_AMOUNT_ANALYSIS_PROJECT_IDS = [
  'tornado-cash',
  'railgun',
  'privacy-pools',
] as const

export function isPrivacyAmountAnalysisProject(projectId: string): boolean {
  return (PRIVACY_AMOUNT_ANALYSIS_PROJECT_IDS as readonly string[]).includes(
    projectId,
  )
}

export const PrivacyProjectAmountAnalysisParams = v.object({
  projectId: v.string(),
})

export type PrivacyProjectAmountAnalysisParams = v.infer<
  typeof PrivacyProjectAmountAnalysisParams
>

export interface PrivacyProjectAmountAnalysisResponse {
  projectId: string
  sectionEnabled: boolean
  deposits: PrivacyAmountAnalysisDirectionData
  withdrawals: PrivacyAmountAnalysisDirectionData
  overlap: PrivacyAmountOverlap
}

const EMPTY_OVERLAP: PrivacyAmountOverlap = {
  depositorCount: 0,
  withdrawerCount: 0,
  bothCount: 0,
  withdrawersAlsoDepositorsPct: 0,
}

function emptyDirection(): PrivacyAmountAnalysisDirectionData {
  return {
    addressCount: 0,
    totalUsd: 0,
    buckets: [],
  }
}

export function getPrivacyProjectAmountAnalysis(
  params: PrivacyProjectAmountAnalysisParams,
): PrivacyProjectAmountAnalysisResponse {
  const { projectId } = params

  if (!isPrivacyAmountAnalysisProject(projectId)) {
    return {
      projectId,
      sectionEnabled: false,
      deposits: emptyDirection(),
      withdrawals: emptyDirection(),
      overlap: EMPTY_OVERLAP,
    }
  }

  const records = getPrivacyAmountRecordsByProject().get(projectId) ?? {
    deposits: [],
    withdrawals: [],
  }

  return {
    projectId,
    sectionEnabled: true,
    deposits: aggregateAmountRecords(records.deposits),
    withdrawals: aggregateAmountRecords(records.withdrawals),
    overlap: computeAddressOverlap(records.deposits, records.withdrawals),
  }
}
