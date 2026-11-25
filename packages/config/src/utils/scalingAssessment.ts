import { getStage } from '../processing/utils/getStage'
import type {
  ProjectRiskView,
  ProjectScalingCategory,
  ProjectScalingStage,
  ProjectStageName,
  RegularExitWindowRisk,
  TableReadyValue,
} from '../types'

/**
 * The website, its `.md` pages and the public API must show the same
 * assessment, so the rules for deriving it from a project live here, where
 * every package can import them, and not in one consumer.
 */

export interface ScalingRiskValue extends TableReadyValue {
  name: string
  regular?: RegularExitWindowRisk
}

/** The five rosette risks, in the order the website draws them. */
export function getL2Risks(riskView: ProjectRiskView): ScalingRiskValue[] {
  return [
    {
      name: 'Sequencer Failure',
      value: riskView.sequencerFailure.value,
      sentiment: riskView.sequencerFailure.sentiment,
      warning: riskView.sequencerFailure.warning,
      description: riskView.sequencerFailure.description,
    },
    {
      name: 'State Validation',
      value: riskView.stateValidation.value,
      sentiment: riskView.stateValidation.sentiment,
      warning: riskView.stateValidation.warning,
      description: riskView.stateValidation.description,
    },
    {
      name: 'Data Availability',
      value: riskView.dataAvailability.value,
      sentiment: riskView.dataAvailability.sentiment,
      warning: riskView.dataAvailability.warning,
      description: riskView.dataAvailability.description,
    },
    {
      name: 'Exit Window',
      value: riskView.exitWindow.value,
      sentiment: riskView.exitWindow.sentiment,
      regular: riskView.exitWindow.regular,
      warning: riskView.exitWindow.warning,
      description: riskView.exitWindow.description,
    },
    {
      name: 'Proposer Failure',
      value: riskView.proposerFailure.value,
      sentiment: riskView.proposerFailure.sentiment,
      warning: riskView.proposerFailure.warning,
      description: riskView.proposerFailure.description,
    },
  ]
}

/**
 * Stages rate rollups, so an "Other" project shows no stage even when its
 * config still carries one from before it was recategorized.
 */
export function getDisplayedScalingStage(
  category: ProjectScalingCategory | undefined,
  stage: ProjectScalingStage | undefined,
): ProjectScalingStage {
  if (category === 'Other' || !stage) {
    return { stage: 'NotApplicable' }
  }
  return stage
}

export function getDisplayedScalingStageName(
  category: ProjectScalingCategory | undefined,
  stage: ProjectScalingStage | undefined,
): ProjectStageName {
  return getStage(getDisplayedScalingStage(category, stage))
}

export type UnderReviewStatus = 'config' | 'impactful-change' | undefined

/**
 * A project is under review while its config says so, or while discovery has
 * seen an impactful contract change that nobody has assessed yet.
 */
export function getUnderReviewStatus({
  isUnderReview,
  impactfulChange,
}: {
  isUnderReview: boolean
  impactfulChange: boolean
}): UnderReviewStatus {
  if (isUnderReview) {
    return 'config'
  }
  if (impactfulChange) {
    return 'impactful-change'
  }
}
