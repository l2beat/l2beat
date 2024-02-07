import { ProjectId } from '@l2beat/shared-pure'

import { FinalityConfig } from '../types/FinalityConfig'

export function findConfigurationsToSync(
  runtimeConfigurations: FinalityConfig[],
  syncedProjects: ProjectId[],
) {
  return runtimeConfigurations.filter(
    (configuration) => !syncedProjects.includes(configuration.projectId),
  )
}
