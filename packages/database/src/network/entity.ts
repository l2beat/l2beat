import { Insertable, Selectable } from 'kysely'
import { Network as NetworkEntity } from '../kysely/generated/types'

export interface Network {
  id: string
  chainId: number
  name: string
  coingeckoId: string | null
  axelarId: string | null
  axelarGatewayAddress: string | null
  orbitId: string | null
  wormholeId: string | null
  layerZeroV1EndpointAddress: string | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<NetworkEntity>): Network {
  return row
}

export function toRow(record: Network): Insertable<NetworkEntity> {
  return record
}
