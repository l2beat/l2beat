import { type DaBridgeRisks, type DaLayerRisks } from '@l2beat/config'
import { type Sentiment, type ValueWithSentiment } from '@l2beat/shared-pure'
import { type RosetteValue } from '~/components/rosette/types'

export function mapRisksToRosetteValues(
  risks: Record<
    keyof (DaLayerRisks & DaBridgeRisks),
    ValueWithSentiment<string, Sentiment> & { description?: string }
  >,
): RosetteValue[] {
  const values: RosetteValue[] = [
    {
      name: 'Upgradeability',
      value: risks.upgradeability.value,
      sentiment: risks.upgradeability.sentiment,
      description: risks.upgradeability.description,
    },
    {
      name: 'Economic security',
      value: risks.economicSecurity.value,
      sentiment: risks.economicSecurity.sentiment,
      description: risks.economicSecurity.description,
    },
    {
      name: 'Relayer failure',
      value: risks.relayerFailure.value,
      sentiment: risks.relayerFailure.sentiment,
      description: risks.relayerFailure.description,
    },
    {
      name: 'Fraud detection',
      value: risks.fraudDetection.value,
      sentiment: risks.fraudDetection.sentiment,
      description: risks.fraudDetection.description,
    },
    {
      name: 'Committee security',
      value: risks.committeeSecurity.value,
      sentiment: risks.committeeSecurity.sentiment,
      description: risks.committeeSecurity.description,
    },
  ]

  return values
}
