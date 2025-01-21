import type { StateUpdateMode } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { BaseAnalyzer } from '../analyzers/types/BaseAnalyzer'

export type FinalityConfig = {
  projectId: ProjectId
  minTimestamp: UnixTime
  stateUpdateMode: StateUpdateMode
  analyzers: {
    timeToInclusion: BaseAnalyzer
    stateUpdate?: BaseAnalyzer
  }
}
