import { getProject } from '../../../api/api'
import { useGlobalSettingsStore } from '../store/global-settings-store'

interface ProjectQueryArgs {
  readonly maxReachableDepth: number | null
}

// Single source for the `getProject` React Query key + args. Every consumer
// must build its key the same way, otherwise changing maxReachableDepth creates
// parallel caches and the UI mixes data from different reachability settings in
// the same session.
function buildProjectQueryOptions(project: string, args: ProjectQueryArgs) {
  return {
    queryKey: ['projects', project, args.maxReachableDepth] as const,
    queryFn: () => getProject(project, args.maxReachableDepth ?? undefined),
  }
}

export function useProjectQueryOptions(project: string) {
  const maxReachableDepth = useGlobalSettingsStore((s) => s.maxReachableDepth)
  return buildProjectQueryOptions(project, {
    maxReachableDepth,
  })
}

export function getProjectQueryOptions(project: string) {
  const { maxReachableDepth } = useGlobalSettingsStore.getState()
  return buildProjectQueryOptions(project, {
    maxReachableDepth,
  })
}
