import { type DaBridgeRisks, type DaLayerRisks } from '@l2beat/config'
import {
  type Sentiment,
  type ValueWithSentiment,
  type WarningValueWithSentiment,
} from '@l2beat/shared-pure'
import { type RosetteValue } from '~/components/rosette/types'

export function mapRisksToRosetteValues(
  risks: Record<
    keyof (DaLayerRisks & DaBridgeRisks),
    ValueWithSentiment<string, Sentiment> & {
      description?: string
      warning?: WarningValueWithSentiment
    }
  >,
): RosetteValue[] {
  const values: RosetteValue[] = [
    {
      name: 'Upgradeability',
      value: risks.upgradeability.value,
      sentiment: risks.upgradeability.sentiment,
      description: risks.upgradeability.description,
      warning: risks.upgradeability.warning,
    },
    {
      name: 'Economic security',
      value: risks.economicSecurity.value,
      sentiment: risks.economicSecurity.sentiment,
      description: risks.economicSecurity.description,
      warning: risks.economicSecurity.warning,
    },
    {
      name: 'Relayer failure',
      value: risks.relayerFailure.value,
      sentiment: risks.relayerFailure.sentiment,
      description: risks.relayerFailure.description,
      warning: risks.relayerFailure.warning,
    },
    {
      name: 'Fraud detection',
      value: risks.fraudDetection.value,
      sentiment: risks.fraudDetection.sentiment,
      description: risks.fraudDetection.description,
      warning: risks.fraudDetection.warning,
    },
    {
      name: 'Committee security',
      value: risks.committeeSecurity.value,
      sentiment: risks.committeeSecurity.sentiment,
      description: risks.committeeSecurity.description,
      warning: risks.committeeSecurity.warning,
    },
  ]

  return values
}
