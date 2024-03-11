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
  bridge: ValueWithSentiment<'Enshrined'>
  mode: ScalingProjectDataAvailabilityMode
}

export type OffChainDataAvailabilityLayer =
  | 'MEMO'
  | 'DAC'
  | 'Celestia'
  | 'External'
  | 'MantleDA'

export type OffChainDataAvailabilityFallback = OnChainDataAvailabilityLayer

export type OffChainDataAvailabilityBridge =
  | 'None'
  | 'Optimistic'
  | 'DAC Members'
  | `${number}/${number} DAC Members`

type OffChainDataAvailability = {
  type: 'Off chain'
  layers: ValueWithSentiment<
    [OffChainDataAvailabilityLayer, OffChainDataAvailabilityFallback?]
  >
  bridge: ValueWithSentiment<OffChainDataAvailabilityBridge>
  mode: ScalingProjectDataAvailabilityMode
}
