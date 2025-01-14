import { ValueWithSentiment } from '@l2beat/shared-pure'

import {
  DataAvailabilityBridge,
  DataAvailabilityConfig,
  DataAvailabilityLayer,
  DataAvailabilityMode,
} from './ScalingProjectDataAvailability'

export interface ProjectDataAvailability {
  layer: ValueWithSentiment<string> & { secondLine?: string }
  bridge: DataAvailabilityBridge
  mode: DataAvailabilityMode
}

export const DA_MODES = {
  STATE_DIFFS: {
    value: 'State diffs',
    secondLine: undefined,
  },
  STATE_DIFFS_COMPRESSED: {
    value: 'State diffs',
    secondLine: 'Compressed',
  },
  TRANSACTION_DATA: {
    value: 'Transaction data',
    secondLine: undefined,
  },
  TRANSACTION_DATA_COMPRESSED: {
    value: 'Transaction data',
    secondLine: 'Compressed',
  },
} as const satisfies Record<
  string,
  { value: string; secondLine: string | undefined }
>

export const DA_LAYERS = {
  ETH_CALLDATA: {
    value: 'Ethereum',
    secondLine: 'Calldata',
    sentiment: 'good',
    description: 'The data is posted to Ethereum as calldata.',
    fallbackDescription:
      'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  },
  ETH_BLOBS: {
    value: 'Ethereum',
    secondLine: 'Blobs',
    sentiment: 'good',
    description: 'The data is posted to Ethereum as blobs.',
    fallbackDescription:
      'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  },
  ETH_BLOBS_OR_CALLDATA: {
    value: 'Ethereum',
    secondLine: 'Blobs or Calldata',
    sentiment: 'good',
    description: 'The data is posted to Ethereum as calldata or blobs.',
    fallbackDescription:
      'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  },
  MEMO: {
    value: 'MEMO',
    sentiment: 'warning',
    description: 'The data is posted to MEMO (a decentralized storage).',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  DAC: {
    value: 'DAC',
    sentiment: 'warning',
    description:
      'The data is posted off chain and a Data Availability Committee (DAC) is responsible for protecting and supplying it.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  CELESTIA: {
    value: 'Celestia',
    sentiment: 'warning',
    description: 'The data is posted to Celestia.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  AVAIL: {
    value: 'Avail',
    sentiment: 'warning',
    description: 'The data is posted to Avail.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  NONE: {
    value: 'None',
    sentiment: 'bad',
    description: 'The data is not posted to any data availability layer.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  MANTLE_DA: {
    value: 'Mantle DA',
    sentiment: 'warning',
    description:
      'The data is posted to Mantle DA (contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions).',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  FRAXTAL_DA: {
    value: 'FraxtalDA',
    sentiment: 'warning',
    description:
      'The data is posted to FraxtalDA which is a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data are published on an onchain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  OP_ALT_DA: {
    value: 'Alt-DA Provider',
    sentiment: 'warning',
    description:
      'The data is posted to an off-chain data availability provider which is tasked to serve data upon request. Only hashes of the data are published on an onchain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  EIGEN_DA: {
    value: 'EigenDA',
    sentiment: 'warning',
    description:
      'The data is posted to EigenDA which is a separate data availability layer developed by the Eigenlayer team. Only hashes of data are published on an onchain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  NEAR_DA: {
    value: 'NearDA',
    sentiment: 'warning',
    description:
      'The data is posted to NearDA which is a separate data availability layer on the Near protocol. Only hashes of data are published on an onchain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  POLYGON_POS_DA: {
    value: 'Polygon PoS DA',
    sentiment: 'warning',
    description:
      'The data is guaranteed to be available by Polygon proof of stake validators. On Ethereum, the data is indirectly referenced in the signed block header.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  HYPERLIQUID_DA: {
    value: 'Hyperliquid DA',
    sentiment: 'bad',
    description:
      'The data is custodied by Hyperliquid validators. On Arbitrum there is no direct reference of the data.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
} as const satisfies Record<
  string,
  ValueWithSentiment<string> & {
    secondLine: string | undefined
    description: string
    fallbackDescription: string | undefined
  }
>

export const DA_BRIDGES = {
  NONE: {
    value: 'None',
    sentiment: 'bad',
    description:
      'There is no bridge that can attest if the data has been made available.',
  },
  NONE_WITH_DA_CHALLENGES: {
    value: 'None + DA challenges',
    sentiment: 'bad',
    description:
      'There is no bridge that can attest if the data has been made available. However, there is a mechanism that allows users to challenge the unavailability of data.',
  },
  ENSHRINED: {
    value: 'Enshrined',
    sentiment: 'good',
    description:
      'The validating bridge has access to all the data, as it is posted onchain.',
  },
  OPTIMISTIC: {
    value: 'Optimistic',
    sentiment: 'bad',
    description:
      'There is a mechanism that allows validators to request that the Sequencer posts data onchain via L1 contract if they find that data is unavailable.',
  },
  BLOBSTREAM: {
    value: 'Blobstream',
    sentiment: 'warning',
    description:
      'The Blobstream DA bridge is used to attest to the data availability on Celestia.',
  },
  DAC_MEMBERS: ({
    requiredSignatures,
    membersCount,
  }: {
    requiredSignatures: number
    membersCount: number
  }) => ({
    value: requiredSignatures
      ? `${requiredSignatures}/${membersCount} DAC Members`
      : 'DAC Members',
    sentiment: DAC_SENTIMENT({
      requiredSignatures: requiredSignatures,
      membersCount: membersCount,
    }),
    description: requiredSignatures
      ? `There is a threshold of ${requiredSignatures}/${membersCount} members that must sign and attest that the data is correct and available.`
      : `There is a threshold of DAC members that must sign and attest that the data is correct and available.`,
  }),
  STAKED_OPERATORS: ({
    requiredSignatures,
    membersCount,
  }: {
    requiredSignatures: number
    membersCount: number
  }) => ({
    value: `${requiredSignatures}/${membersCount} Staked Operators`,
    sentiment: 'warning',
    description: `There is a threshold of ${requiredSignatures}/${membersCount} of staked operators that must sign and attest that the data has been made available.`,
  }),
} as const satisfies Record<
  string,
  | (ValueWithSentiment<string> & { description: string })
  | ((config: {
      requiredSignatures: number
      membersCount: number
    }) => ValueWithSentiment<string> & { description: string })
>

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

export const DATA_AVAILABILITY = {
  DAC_SENTIMENT,
}
