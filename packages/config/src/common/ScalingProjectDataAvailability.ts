import type { DA_BRIDGES, DA_LAYERS, DA_MODES } from './dataAvailability'

export interface DataAvailabilityConfig {
  layers: DataAvailabilityLayer[]
  bridge: DataAvailabilityBridge
  mode: DataAvailabilityMode
}

export type DataAvailabilityMode = (typeof DA_MODES)[keyof typeof DA_MODES]
export type DataAvailabilityLayer = (typeof DA_LAYERS)[keyof typeof DA_LAYERS]

type MappedDataAvailabilityBridge = {
  [key in keyof typeof DA_BRIDGES]: (typeof DA_BRIDGES)[key] extends (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ...args: any[]
  ) => infer R
    ? R
    : (typeof DA_BRIDGES)[key]
}
export type DataAvailabilityBridge =
  MappedDataAvailabilityBridge[keyof MappedDataAvailabilityBridge]
