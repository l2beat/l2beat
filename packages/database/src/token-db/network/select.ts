import { NetworkRecord } from './entity'

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
  'logoUrl',
] as const satisfies (keyof NetworkRecord)[]
