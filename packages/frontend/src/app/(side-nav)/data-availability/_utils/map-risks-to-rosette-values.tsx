import { type DaBridge, type DaLayer } from '@l2beat/config'
import { type RosetteValue } from '~/components/rosette/types'

export function mapLayerRisksToRosetteValues(
  risks: DaLayer['risks'],
): RosetteValue[] {
  if (!('economicSecurity' in risks)) {
    return [
      {
        name: 'DA Layer',
        value: risks.value,
        sentiment: risks.sentiment,
        description: risks.description,
        warning: undefined,
      },
    ]
  }

  return [
    {
      name: 'Economic security',
      value: risks.economicSecurity.value,
      sentiment: risks.economicSecurity.sentiment,
      description: risks.economicSecurity.description,
      warning: undefined,
    },
    {
      name: 'Fraud detection',
      value: risks.fraudDetection.value,
      sentiment: risks.fraudDetection.sentiment,
      description: risks.fraudDetection.description,
      warning: undefined,
    },
  ]
}

export function mapBridgeRisksToRosetteValues(
  risks: DaBridge['risks'],
): RosetteValue[] {
  if (!('committeeSecurity' in risks)) {
    return [
      {
        name: 'DA Bridge',
        value: risks.value,
        sentiment: risks.sentiment,
        description: risks.description,
        warning: undefined,
      },
    ]
  }

  return [
    {
      name: 'Committee security',
      value: risks.committeeSecurity.value,
      sentiment: risks.committeeSecurity.sentiment,
      description: risks.committeeSecurity.description,
      warning: undefined,
    },
    {
      name: 'Upgradeability',
      value: risks.upgradeability.value,
      sentiment: risks.upgradeability.sentiment,
      description: risks.upgradeability.description,
      warning: undefined,
    },
    {
      name: 'Relayer failure',
      value: risks.relayerFailure.value,
      sentiment: risks.relayerFailure.sentiment,
      description: risks.relayerFailure.description,
      warning: undefined,
    },
  ]
}
