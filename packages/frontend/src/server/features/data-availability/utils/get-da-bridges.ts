import type { DaBridge, DaProject } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'

export function getDaBridges(project: DaProject) {
  const bridges = [...project.daLayer.bridges]
  if (project.daLayer.usedWithoutBridgeIn.length > 0) {
    const noBridge: DaBridge = {
      id: ProjectId('unused-no-bridge'),
      addedAt: UnixTime.ZERO,
      display: {
        name: 'No Bridge',
        slug: 'no-bridge',
        description:
          'The risk profile in this page refers to L2s that do not integrate with a data availability bridge. Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.',
      },
      risks: {
        isNoBridge: true,
      },
      technology: {
        description:
          'No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.',
      },
      usedIn: project.daLayer.usedWithoutBridgeIn,
    }
    bridges.unshift(noBridge)
  }
  return bridges
}
