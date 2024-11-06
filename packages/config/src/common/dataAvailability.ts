import { ValueWithSentiment, assertUnreachable } from '@l2beat/shared-pure'

import {
  DataAvailabilityBridge,
  DataAvailabilityConfig,
  DataAvailabilityLayer,
  DataAvailabilityMode,
} from './ScalingProjectDataAvailability'

export interface DataAvailabilityWithSentiment {
  layer: ValueWithSentiment<string> & { secondLine?: string }
  bridge: ValueWithSentiment<string>
  mode: DataAvailabilityMode
}

export function addSentimentToDataAvailability(
  data: DataAvailabilityConfig,
): DataAvailabilityWithSentiment {
  return {
    layer: addSentimentToLayers(data.layers),
    bridge: addSentimentToBridge(data.bridge),
    mode: data.mode,
  }
}

function addSentimentToLayers(layers: DataAvailabilityLayer[]) {
  const sentiment = layers[0].sentiment
  return {
    value: layers.map((l) => l.value).join(' or '),
    secondLine: layers[0].secondLine,
    sentiment,
    description: layers
      .map((layer, i) => {
        if (i === 0) {
          return layer.description
        }
        if (layer.fallbackDescription) {
          return layer.fallbackDescription
        }
        throw new Error(
          `Fallback is missing or too many layers! Revisit this function to fix!`,
        )
      })
      .join(' '),
  }
}

function addSentimentToBridge(
  bridge: DataAvailabilityBridge,
): ValueWithSentiment<string> {
  switch (bridge.type) {
    case 'None':
      return {
        value: 'None',
        sentiment: 'bad',
        description:
          'There is no bridge that can attest if the data has been made available.',
      }
    case 'None + DA challenges':
      return {
        value: 'None + DA challenges',
        sentiment: 'bad',
        description:
          'There is no bridge that can attest if the data has been made available. However, there is a mechanism that allows users to challenge unavailability of data.',
      }
    case 'Enshrined':
      return {
        value: 'Enshrined',
        sentiment: 'good',
        description:
          'The validating bridge has access to all the data, as it is posted on chain.',
      }
    case 'Optimistic':
      return {
        value: 'Optimistic',
        sentiment: 'bad',
        description:
          'There is a mechanism that allows validators to request that the Sequencer posts data on-chain via L1 contract if they find that data is unavailable.',
      }
    case 'DAC Members':
      return {
        value: bridge.requiredSignatures
          ? `${bridge.requiredSignatures}/${bridge.membersCount} DAC Members`
          : 'DAC Members',
        sentiment: DAC_SENTIMENT({
          requiredSignatures: bridge.requiredSignatures,
          membersCount: bridge.membersCount,
        }),
        description: bridge.requiredSignatures
          ? `There is a threshold of ${bridge.requiredSignatures}/${bridge.membersCount} members that must sign and attest that the data is correct and available.`
          : `There is a threshold of DAC members that must sign and attest that the data is correct and available.`,
      }
    case 'Staked Operators':
      return {
        value: `${bridge.requiredSignatures}/${bridge.membersCount} Staked Operators`,
        sentiment: 'warning',
        description: `There is a threshold of ${bridge.requiredSignatures}/${bridge.membersCount} of staked operators that must sign and attest that the data has been made available.`,
      }
    default:
      assertUnreachable(bridge)
  }
}

function DAC_SENTIMENT(config?: {
  membersCount?: number
  requiredSignatures?: number
}) {
  if (!config || !config.membersCount || !config.requiredSignatures)
    return 'bad'

  const assumedHonestMembers =
    config.membersCount - config.requiredSignatures + 1

  if (
    config.membersCount < 6 ||
    assumedHonestMembers / config.membersCount > 1 / 3
  ) {
    return 'bad'
  }

  return 'warning'
}

export const DATA_AVAILABILITY = {
  DAC_SENTIMENT,
}
