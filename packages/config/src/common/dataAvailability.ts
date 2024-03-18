import {
  assertUnreachable,
  Sentiment,
  ValueWithSentiment,
} from '@l2beat/shared-pure'

import {
  DataAvailabilityBridge,
  DataAvailabilityConfig,
  DataAvailabilityLayer,
  DataAvailabilityMode,
} from './ScalingProjectDataAvailability'

export interface DataAvailabilityWithSentiment {
  layer: ValueWithSentiment<string>
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

const MAIN_LAYER_SENTIMENT: Record<DataAvailabilityLayer, Sentiment> = {
  'Ethereum (calldata)': 'good',
  'Ethereum (blobs)': 'good',
  'Ethereum (blobs or calldata)': 'good',
  MEMO: 'warning',
  DAC: 'warning',
  Celestia: 'warning',
  External: 'warning',
  MantleDA: 'warning',
  FraxtalDA: 'warning',
}

const LAYER_DESCRIPTION: Record<
  DataAvailabilityLayer,
  [string, string | null]
> = {
  'Ethereum (blobs)': [
    'The data is posted to Ethereum as calldata.',
    'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  ],
  'Ethereum (blobs or calldata)': [
    'The data is posted to Ethereum as calldata or blobs.',
    'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  ],
  'Ethereum (calldata)': [
    'The data is posted to Ethereum as calldata.',
    'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  ],
  DAC: [
    'The data is posted off chain and a Data Availability Committee (DAC) is responsible for protecting and supplying it.',
    null,
  ],
  Celestia: ['The data is posted to Celestia.', null],
  MEMO: ['The data is posted to MEMO (a decentralized storage).', null],
  External: ['The data is posted off chain.', null],
  MantleDA: [
    'The data is posted to MantleDA (contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions).',
    null,
  ],
  FraxtalDA: [
    'The data is posted to FraxtalDA which is a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data is published on an on chain inbox.',
    null,
  ],
}

function addSentimentToLayers(layers: DataAvailabilityLayer[]) {
  const sentiment = MAIN_LAYER_SENTIMENT[layers[0]]
  return {
    value: layers.join(' or '),
    sentiment,
    description: layers
      .map((layer, i) => {
        const [main, fallback] = LAYER_DESCRIPTION[layer]
        if (i === 0) {
          return main
        } else if (fallback) {
          return fallback
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
        description: `There is a threshold of ${bridge.requiredSignatures}/${bridge.requiredSignatures} of staked operators that must sign and attest that the data has been made available.`,
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
