import { ValueWithSentiment } from '@l2beat/shared-pure'

export type ScalingProjectDataAvailabilityMode =
  | 'State diffs'
  | 'State diffs (compressed)'
  | 'Transactions data'
  | 'Transactions data (compressed)'

export type ScalingProjectDataAvailability =
  | OnChainDataAvailability
  | OffChainDataAvailability

export type OnChainDataAvailabilityLayer =
  | 'Ethereum (calldata)'
  | 'Ethereum (blobs)'
  | 'Ethereum (blobs or calldata)'

type OnChainDataAvailability = {
  type: 'On chain'
  layer: ValueWithSentiment<OnChainDataAvailabilityLayer>
  bridge: ValueWithSentiment<{ type: 'Enshrined' }>
  mode: ScalingProjectDataAvailabilityMode
}

export type OffChainDataAvailabilityLayer =
  | 'MEMO'
  | 'DAC'
  | 'Celestia'
  | 'External'
  | 'MantleDA'
  | 'FraxtalDA'

export type OffChainDataAvailabilityFallback = OnChainDataAvailabilityLayer

export type OffChainDataAvailabilityBridge =
  | { type: 'None' }
  | { type: 'Optimistic' }
  | {
      type: 'DAC Members'
      threshold?: number
      outOf?: number
    }
  | {
      type: 'Staked Operators'
      threshold: number
      outOf: number
    }

type OffChainDataAvailability = {
  type: 'Off chain'
  layers: ValueWithSentiment<
    [OffChainDataAvailabilityLayer, OffChainDataAvailabilityFallback?]
  >
  bridge: ValueWithSentiment<OffChainDataAvailabilityBridge>
  mode: ScalingProjectDataAvailabilityMode
}
