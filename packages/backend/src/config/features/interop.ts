import type { InteropConfig, ProjectService } from '@l2beat/config'

export interface InteropAggregationConfig extends InteropConfig {
  id: string
}
export async function getInteropAggregationConfigs(
  ps: ProjectService,
): Promise<InteropAggregationConfig[]> {
  const projects = await ps.getProjects({ select: ['interopConfig'] })
  return projects.map((p) => ({ ...p.interopConfig, id: p.id }))
}
