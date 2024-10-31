import { NetworkRecord } from './entity'

export const selectNetwork = [
  'id',
  'name',
  'logoUrl',
  'type',
  'chainId',
  'orbitId',
  'axelarId',
  'updatedAt',
  'createdAt',
  'wormholeId',
  'coingeckoId',
  'axelarGatewayAddress',
  'layerZeroV1EndpointAddress',
] as const satisfies (keyof NetworkRecord)[]
