import type { QueryClient, QueryKey } from '@tanstack/react-query'
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
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
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

// Only the payloads: other queries under ['projects', project] (code, preview,
// TVL) do not depend on configs or templates.
export function invalidateProjectPayloads(
  queryClient: QueryClient,
  project?: string,
) {
  return queryClient.invalidateQueries({
    predicate: (query) => isProjectPayloadKey(query.queryKey, project),
  })
}

function isProjectPayloadKey(queryKey: QueryKey, project: string | undefined) {
  if (queryKey.length !== 3 || queryKey[0] !== 'projects') {
    return false
  }
  if (typeof queryKey[2] === 'string') {
    return false
  }
  return project === undefined || queryKey[1] === project
}
