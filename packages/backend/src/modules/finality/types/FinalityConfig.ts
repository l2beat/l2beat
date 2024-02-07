import { ProjectId } from '@l2beat/shared-pure'

import { BaseAnalyzer } from '../analyzers/types/BaseAnalyzer'

export interface FinalityConfig {
  projectId: ProjectId
  analyzer: BaseAnalyzer
}
