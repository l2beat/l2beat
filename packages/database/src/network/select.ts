import { Network } from './entity'

export const selectNetwork = [
  'id',
  'name',
  'chainId',
  'orbitId',
  'axelarId',
  'updatedAt',
  'createdAt',
  'wormholeId',
  'coingeckoId',
  'axelarGatewayAddress',
  'layerZeroV1EndpointAddress',
] as const satisfies (keyof Network)[]
