import { ScalingProjectReference, ScalingProjectRisk } from '../../../common'

export interface DaTechnology {
  /** Description of technology used by the data availability layer. [MARKDOWN] */
  description: string
  /** List of risks associated with the technology */
  risks?: ScalingProjectRisk[] // scaling risks on purpose
  /** List of references put underneath the technology section */
  references?: ScalingProjectReference[]
}
