import { type DaBridgeRisks, type DaLayerRisks } from '@l2beat/config'
import { type Sentiment, type ValueWithSentiment } from '@l2beat/shared-pure'
import { type RosetteValue } from '~/app/_components/rosette/types'

export function mapRisksToRosetteValues(
  risks: Record<
    keyof (DaLayerRisks & DaBridgeRisks),
    ValueWithSentiment<string, Sentiment> & { description?: string }
  >,
): RosetteValue[] {
  const values: RosetteValue[] = [
    {
      name: 'Exit window',
      value: risks.exitWindow.value,
      sentiment: risks.exitWindow.sentiment,
      description: risks.exitWindow.description,
    },
    {
      name: 'Economic security',
      value: risks.economicSecurity.value,
      sentiment: risks.economicSecurity.sentiment,
      description: risks.economicSecurity.description,
    },
    {
      name: 'Accessibility',
      value: risks.accessibility.value,
      sentiment: risks.accessibility.sentiment,
      description: risks.accessibility.description,
    },
    {
      name: 'Fraud detection',
      value: risks.fraudDetection.value,
      sentiment: risks.fraudDetection.sentiment,
      description: risks.fraudDetection.description,
    },
    {
      name: 'Attestations',
      value: risks.attestations.value,
      sentiment: risks.attestations.sentiment,
      description: risks.attestations.description,
    },
  ]

  return values
}
