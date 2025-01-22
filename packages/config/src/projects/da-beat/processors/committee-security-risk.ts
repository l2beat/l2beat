import type { DaBeatProjectProcessor } from '.'
import type { BlockchainDaLayer, DacDaLayer } from '../types'
import type { DacBridge } from '../types/DaBridge'
import { DaCommitteeSecurityRisk } from '../types/DaCommitteeSecurityRisk'

export const committeeSecurityRisk: DaBeatProjectProcessor<
  DacDaLayer | BlockchainDaLayer
> = (layer) => {
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
              value: `${bridge.requiredMembers}/${bridge.membersCount}`,
              sentiment: getDacSentiment(bridge),
            },
          }),
        },
      }
    }),
  }
}

function getDacSentiment(config?: {
  membersCount: number
  knownMembers?: DacBridge['knownMembers']
  requiredMembers: number
}) {
  if (!config || !config.knownMembers) return 'bad'

  const assumedHonestMembers = config.membersCount - config.requiredMembers + 1

  // If less than 6 members or more than 1/3 of members need to be honest, the sentiment is bad
  if (
    config.knownMembers.length < 6 ||
    assumedHonestMembers / config.knownMembers.length > 1 / 3
  ) {
    return 'bad'
  }

  // If less than 5 members are external, the sentiment is bad
  if (config.knownMembers.filter((member) => member.external).length < 5) {
    return 'bad'
  }

  return 'warning'
}
