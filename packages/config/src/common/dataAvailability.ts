import type {
  DataAvailabilityConfig,
  DataAvailabilityLayer,
  ProjectDataAvailability,
} from '../types'

export function addSentimentToDataAvailability(
  data: DataAvailabilityConfig,
): ProjectDataAvailability {
  return {
    layer: addSentimentToLayers(data.layers),
    bridge: data.bridge,
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

export function getDacSentiment(config?: {
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
