import { DaBeatProjectProcessor } from '.'
import { DacBridge } from '../types/DaBridge'
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
              value: `${bridge.requiredMembers}/${bridge.members.type === 'unknown' ? bridge.members.count : bridge.members.list.length}`,
              sentiment: getDacSentiment({
                members: bridge.members,
                requiredMembers: bridge.requiredMembers,
              }),
              description: 'TODO',
            },
          }),
        },
      }
    }),
  }
}

function getDacSentiment(config?: {
  members: DacBridge['members']
  requiredMembers: number
}) {
  if (!config || config.members.type === 'unknown') return 'bad'

  const assumedHonestMembers =
    config.members.list.length - config.requiredMembers + 1

  // If less than 6 members or more than 1/3 of members need to be honest, the sentiment is bad
  if (
    config.members.list.length < 6 ||
    assumedHonestMembers / config.members.list.length > 1 / 3
  ) {
    return 'bad'
  }

  // If less than 5 members are external, the sentiment is bad
  if (config.members.list.filter((member) => member.external).length < 5) {
    return 'bad'
  }

  return 'warning'
}
