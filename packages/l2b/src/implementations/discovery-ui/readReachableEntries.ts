import {
  attachPermissions,
  type ConfigReader,
  type EntryParameters,
  getReachableEntries,
} from '@l2beat/discovery'

// The entries the graph draws: the project and the shared modules it
// references, reachable from the project, like getProject. A panel pointing
// anywhere else would point at nothing on screen.
export function readReachableEntries(
  configReader: ConfigReader,
  project: string,
): EntryParameters[] {
  const discoveries = configReader.readDiscoveryWithReferences(project)
  // The permission model makes shared modules reachable too.
  attachPermissions(discoveries)
  const entries = discoveries
    .flatMap((d) => d.entries)
    .filter((e) => e.type !== 'Reference')
  const entrypoints = (discoveries[0]?.entries ?? []).map((e) => e.address)
  return getReachableEntries(entries, entrypoints)
}
