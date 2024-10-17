import { DaBeatProjectProcessor } from '.'
import { DATA_AVAILABILITY } from '../../../../common'
import { DaCommitteeSecurityRisk } from '../types/DaCommitteeSecurityRisk'

export const committeeSecurityRisk: DaBeatProjectProcessor = (layer) => {
  if (layer.kind !== 'DAC') {
    return layer
  }

  return {
    ...layer,
    bridges: layer.bridges.map((bridge) => {
      if (
        bridge.type !== 'DAC' ||
        bridge.risks.committeeSecurity.type !== 'Auto'
      )
        return bridge

      return {
        ...bridge,
        risks: {
          ...bridge.risks,
          committeeSecurity: DaCommitteeSecurityRisk.Auto({
            resolved: {
              value: `${bridge.requiredMembers}/${bridge.totalMembers}`,
              sentiment: DATA_AVAILABILITY.DAC_SENTIMENT({
                membersCount: bridge.totalMembers,
                requiredSignatures: bridge.requiredMembers,
              }),
              description: 'TODO',
            },
          }),
        },
      }
    }),
  }
}
