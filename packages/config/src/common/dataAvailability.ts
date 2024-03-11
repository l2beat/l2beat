import { assertUnreachable, Sentiment } from '@l2beat/shared-pure'

import {
  OffChainDataAvailabilityBridge,
  OffChainDataAvailabilityFallback,
  OffChainDataAvailabilityLayer,
  OnChainDataAvailabilityLayer,
  ScalingProjectDataAvailability,
  ScalingProjectDataAvailabilityMode,
} from './ScalingProjectDataAvailability'

type ConfigData = OnChainConfig | OffChainConfig | OffChainDacConfig

interface OnChainConfig {
  type: 'On chain'
  layer: OnChainDataAvailabilityLayer
  mode: ScalingProjectDataAvailabilityMode
}

interface OffChainConfig {
  type: 'Off chain'
  layers: [
    Exclude<OffChainDataAvailabilityLayer, 'DAC'>,
    OffChainDataAvailabilityFallback?,
  ]
  bridge: OffChainDataAvailabilityBridge
  mode: ScalingProjectDataAvailabilityMode
}

interface OffChainDacConfig {
  type: 'Off chain (DAC)'
  fallback?: OffChainDataAvailabilityFallback
  config: DacConfig | undefined
  mode: ScalingProjectDataAvailabilityMode
}

export interface DacConfig {
  membersCount: number
  requiredSignatures: number
}

export function makeDataAvailabilityConfig(
  data: ConfigData,
): ScalingProjectDataAvailability {
  switch (data.type) {
    case 'On chain':
      return makeOnChainDataAvailabilityConfig(data)
    case 'Off chain':
      return makeOffChainDataAvailabilityConfig(data)
    case 'Off chain (DAC)':
      return getOffChainDacDataAvailabilityConfig(data)
    default:
      assertUnreachable(data)
  }
}

function makeOnChainDataAvailabilityConfig(
  data: Extract<ConfigData, { type: 'On chain' }>,
): ScalingProjectDataAvailability {
  return {
    type: 'On chain',
    layer: {
      value: data.layer,
      description: getOnChainLayerDescription(data.layer),
      sentiment: 'good',
    },
    bridge: {
      value: 'Enshrined',
      description:
        'The validating bridge has access to all the data, as it is posted on chain.',
      sentiment: 'good',
    },
    mode: data.mode,
  }
}

function getOnChainLayerDescription(layer: OnChainDataAvailabilityLayer) {
  switch (layer) {
    case 'Ethereum (blobs)':
      return 'The data is posted to Ethereum as calldata.'
    case 'Ethereum (blobs or calldata)':
      return 'The data is posted to Ethereum as calldata or blobs.'
    case 'Ethereum (calldata)':
      return 'The data is posted to Ethereum as calldata.'
    default:
      assertUnreachable(layer)
  }
}

function makeOffChainDataAvailabilityConfig(
  data: Extract<ConfigData, { type: 'Off chain' }>,
): ScalingProjectDataAvailability {
  return {
    type: 'Off chain',
    layers: {
      values: data.layers,
      description: getOffChainLayerDescription(data.layers),
      sentiment: getOffChainLayerSentiment(data.layers[0]),
    },
    bridge: {
      value: data.bridge,
      description: getOffChainBridgeDescription(data.bridge),
      sentiment: getOffChainBridgeSentiment(data.bridge),
    },
    mode: data.mode,
  }
}

function getOffChainLayerDescription(
  layers: [OffChainDataAvailabilityLayer, OffChainDataAvailabilityFallback?],
) {
  const [layer, fallback] = layers
  const descriptions: string[] = []
  switch (layer) {
    case 'DAC':
      descriptions.push(
        'The data is posted off chain and a Data Availability Committee (DAC) is responsible for protecting and supplying it.',
      )
      break
    case 'Celestia':
      descriptions.push('The data is posted to Celestia.')
      break
    case 'MEMO':
      descriptions.push('The data is posted to MEMO (a decentralized storage).')
      break
    case 'External':
      descriptions.push('The data is posted off chain.')
      break
    case 'MantleDA':
      descriptions.push(
        'The data is posted to MantleDA (contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions).',
      )
      break
    case 'FraxtalDA':
      descriptions.push(
        'The data is posted to FraxtalDA which is a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data is published on an on chain inbox.',
      )
      break
    default:
      assertUnreachable(layer)
  }

  if (!fallback) {
    return descriptions[0]
  }

  switch (fallback) {
    case 'Ethereum (blobs or calldata)':
    case 'Ethereum (blobs)':
    case 'Ethereum (calldata)':
      descriptions.push(
        'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
      )
      break
    default:
      assertUnreachable(fallback)
  }

  return descriptions.join(' ')
}

function getOffChainLayerSentiment(
  layer: OffChainDataAvailabilityLayer,
): Sentiment {
  switch (layer) {
    case 'MEMO':
    case 'DAC':
    case 'External':
    case 'MantleDA':
    case 'FraxtalDA':
      return 'warning'
    case 'Celestia':
      return 'good'
    default:
      assertUnreachable(layer)
  }
}

function getOffChainBridgeDescription(
  bridge: OffChainDataAvailabilityBridge,
): string {
  switch (bridge) {
    case 'None':
      return 'There is no bridge that can attest if the data has been made available.'
    case 'Optimistic':
      return 'There is a mechanism that allows validators to request that the Sequencer posts data on-chain via L1 contract if they find that data is unavailable.'
    case 'DAC Members':
      return 'There is a threshold of members that must sign and attest that the data has been made available.'
    default:
      return `There is a threshold of ${bridge} that must sign and attest that the data the data has been made available.`
  }
}

function getOffChainBridgeSentiment(
  bridge: OffChainDataAvailabilityBridge,
): Sentiment {
  if (bridge === 'None') {
    return 'bad'
  }

  return 'warning'
}

function getOffChainDacDataAvailabilityConfig(
  data: Extract<ConfigData, { type: 'Off chain (DAC)' }>,
): ScalingProjectDataAvailability {
  const layers: ['DAC', OffChainDataAvailabilityFallback?] = [
    'DAC',
    data.fallback,
  ]

  if (!data.config) {
    return {
      type: 'Off chain',
      layers: {
        values: layers,
        description: getOffChainLayerDescription(layers),
        sentiment: getOffChainLayerSentiment('DAC'),
      },
      bridge: {
        value: 'DAC Members',
        sentiment: getOffChainBridgeSentiment('DAC Members'),
        description: `There is a threshold of DAC members that must sign and attest that the data is correct and available.`,
      },
      mode: data.mode,
    }
  }

  const { membersCount, requiredSignatures } = data.config

  return {
    type: 'Off chain',
    layers: {
      values: layers,
      description: getOffChainLayerDescription(layers),
      sentiment: getOffChainLayerSentiment('DAC'),
    },
    bridge: {
      value: `${requiredSignatures}/${membersCount} DAC Members`,
      sentiment: DAC_SENTIMENT(data.config),
      description: `There is a threshold of ${requiredSignatures}/${membersCount} members that must sign and attest that the data is correct and available.`,
    },
    mode: data.mode,
  }
}

function DAC_SENTIMENT(config?: {
  membersCount: number
  requiredSignatures: number
}) {
  if (!config) return 'bad'

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
