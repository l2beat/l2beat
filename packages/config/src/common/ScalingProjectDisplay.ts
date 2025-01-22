import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import type { WarningWithSentiment } from '../projects'
import type { ReasonForBeingInOther } from './ReasonForBeingInOther'
import type { ScalingProjectCategory } from './ScalingProjectCategory'
import type { ScalingProjectLinks } from './ScalingProjectLinks'
import type { ScalingProjectPurpose } from './ScalingProjectPurpose'

export type ScalingProjectDisplay = {
  /** Name of the scaling project, will be used as a display name on the website */
  name: string
  /** Short name of the scaling project, will be used in some places on the website as a display name */
  shortName?: string
  /** Url friendly scaling project name, will be used in website urls */
  slug: string
  /** Name of the category the scaling project belongs to */
  category: ScalingProjectCategory
  /** Reasons why the scaling project is included in the other categories. If defined - project will be displayed as other */
  reasonsForBeingOther?: ReasonForBeingInOther[]
  mainPermissions?: {
    proposer: {
      value: string
      secondLine?: string
    }
    challenger: {
      value: StringWithAutocomplete<'None'>
      secondLine?: string
    }
    upgrader: {
      value: string
      secondLine?: string
    }
  }
  /** A warning displayed in the header of the project. Also will be displayed as yellow shield next to project name (table view) */
  headerWarning?: string
  /** Warning for TVL */
  tvlWarning?: WarningWithSentiment
  /** A warning displayed above the description of the project */
  warning?: string
  /** Project raw with red warning will turn into red, and there will be red warning icon with this message */
  redWarning?: string
  /** A few sentences describing the scaling project */
  description: string
  /** Detailed description of the scaling project, will be visible in detailed description section */
  detailedDescription?: string
  /** A short (<20 characters) description of the use case */
  purposes: ScalingProjectPurpose[]
  /** List of links */
  links: ScalingProjectLinks
  /** Name of the architecture image to show in the contract section if present, otherwise use slug */
  architectureImage?: string
  /** Name of the state validation image to show in the state validation section if present, otherwise use slug */
  stateValidationImage?: string
  /** Name of the upgrades and governance image to show in the upgrades and governance section if present, otherwise use slug */
  upgradesAndGovernanceImage?: string
}
