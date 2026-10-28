import { ProjectId } from '@l2beat/shared-pure'

/**
 * Projects that ship a new version as new contracts, so every version keeps
 * its own page. `getProjects` attaches the group to each member as
 * `versions`, see `ProjectVersions`.
 */
export interface ProjectVersionGroup {
  id: string
  name: string
  /** The version to show by default, usually the most recent one. */
  latest: ProjectId
  /** In display order. A label is any string: "v2" or a name. */
  versions: { project: ProjectId; label: string }[]
}

export const versionGroups: ProjectVersionGroup[] = [
  {
    id: 'cctp',
    name: 'CCTP',
    latest: ProjectId('cctpv2'),
    versions: [
      { project: ProjectId('cctpv1'), label: 'v1' },
      { project: ProjectId('cctpv2'), label: 'v2' },
    ],
  },
  {
    id: 'aztec',
    name: 'Aztec Network',
    latest: ProjectId('aztecnetworkv6'),
    versions: [
      { project: ProjectId('aztecnetwork'), label: 'v5' },
      { project: ProjectId('aztecnetworkv6'), label: 'v6' },
    ],
  },
]
