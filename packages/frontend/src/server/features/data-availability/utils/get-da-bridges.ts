import type { DaBridge, Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'

export function getDaBridges(project: Project<'daLayer' | 'daBridges'>) {
  const bridges = [...project.daBridges]
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
        committeeSecurity: {
          value: 'N/A',
          sentiment: 'bad',
          description:
            'There is no committee attesting to the availability of data. ',
        },
        upgradeability: {
          value: 'N/A',
          sentiment: 'bad',
          description:
            'Without the bridge, users cannot react in time to malicious actions by the sequencer.',
        },
        relayerFailure: {
          value: 'N/A',
          sentiment: 'bad',
          description:
            "The relayer does not contribute to the DA bridge liveness since data availability attestations are not integrated in the scaling solution's proof system.",
        },
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
