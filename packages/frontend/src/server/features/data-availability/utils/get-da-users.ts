import type { Project } from '@l2beat/config'

export function getDaUsers(
  layers: Project<'daLayer'>[],
  bridges: Project<'daBridge'>[],
  dacs: Project<'customDa'>[],
) {
  const projects = new Set([
    ...layers.flatMap((p) => p.daLayer.usedWithoutBridgeIn.map((x) => x.id)),
    ...bridges.flatMap((p) => p.daBridge.usedIn.map((x) => x.id)),
    ...dacs.map((p) => p.id),
  ])
  return Array.from(projects)
}
