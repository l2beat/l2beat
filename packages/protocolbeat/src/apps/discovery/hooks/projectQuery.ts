import { getProject } from '../../../api/api'
import { useGlobalSettingsStore } from '../store/global-settings-store'

interface ProjectQueryArgs {
  readonly maxReachableDepth: number | null
  readonly singleDiscoveryMode: boolean
}

// Single source for the `getProject` React Query key + args. Every consumer
// must build its key the same way, otherwise toggling singleDiscoveryMode (or
// maxReachableDepth) creates parallel caches and the UI mixes filtered with
// full-discovery data in the same session.
function buildProjectQueryOptions(project: string, args: ProjectQueryArgs) {
  return {
    queryKey: [
      'projects',
      project,
      args.maxReachableDepth,
      args.singleDiscoveryMode,
    ] as const,
    queryFn: () =>
      getProject(
        project,
        args.maxReachableDepth ?? undefined,
        args.singleDiscoveryMode,
      ),
  }
}

export function useProjectQueryOptions(project: string) {
  const maxReachableDepth = useGlobalSettingsStore((s) => s.maxReachableDepth)
  const singleDiscoveryMode = useGlobalSettingsStore(
    (s) => s.singleDiscoveryMode,
  )
  return buildProjectQueryOptions(project, {
    maxReachableDepth,
    singleDiscoveryMode,
  })
}

export function getProjectQueryOptions(project: string) {
  const { maxReachableDepth, singleDiscoveryMode } =
    useGlobalSettingsStore.getState()
  return buildProjectQueryOptions(project, {
    maxReachableDepth,
    singleDiscoveryMode,
  })
}
