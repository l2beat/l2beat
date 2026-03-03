import type { InteropConfig, Project } from '@l2beat/config'

type TransfersTimeMode = NonNullable<InteropConfig['transfersTimeMode']>
export type TransfersTimeModeMap = Map<string, TransfersTimeMode>

export function buildTransfersTimeModeMap(
  interopProjects: Project<'interopConfig'>[],
): TransfersTimeModeMap {
  const transfersTimeModeMap = new Map<string, TransfersTimeMode>()

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
