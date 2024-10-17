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
      name: 'Exit window',
      value: risks.exitWindow.value,
      sentiment: risks.exitWindow.sentiment,
      description: risks.exitWindow.description,
      warning: risks.exitWindow.warning,
    },
    {
      name: 'Economic security',
      value: risks.economicSecurity.value,
      sentiment: risks.economicSecurity.sentiment,
      description: risks.economicSecurity.description,
      warning: risks.economicSecurity.warning,
    },
    {
      name: 'Accessibility',
      value: risks.accessibility.value,
      sentiment: risks.accessibility.sentiment,
      description: risks.accessibility.description,
      warning: risks.accessibility.warning,
    },
    {
      name: 'Fraud detection',
      value: risks.fraudDetection.value,
      sentiment: risks.fraudDetection.sentiment,
      description: risks.fraudDetection.description,
      warning: risks.fraudDetection.warning,
    },
    {
      name: 'Attestations',
      value: risks.attestations.value,
      sentiment: risks.attestations.sentiment,
      description: risks.attestations.description,
      warning: risks.attestations.warning,
    },
  ]

  return values
}
