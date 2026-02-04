import type { Project } from '@l2beat/config'

export function buildTransfersTimeModeMap(
  interopProjects: Project<'interopConfig'>[],
): Map<string, 'unknown'> {
  const transfersTimeModeMap = new Map<string, 'unknown'>()

  for (const project of interopProjects) {
    if (project.interopConfig.transfersTimeMode) {
      transfersTimeModeMap.set(
        project.id,
        project.interopConfig.transfersTimeMode,
      )
    }
  }

  return transfersTimeModeMap
}
