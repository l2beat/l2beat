import { Insertable, Selectable } from 'kysely'
import { Network } from '../../kysely/generated/types'

export interface NetworkRecord {
  id: string
  chainId: number
  name: string
  coingeckoId: string | null
  axelarId: string | null
  axelarGatewayAddress: string | null
  orbitId: string | null
  wormholeId: string | null
  layerZeroV1EndpointAddress: string | null
  logoUrl: string | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<Network>): NetworkRecord {
  return row
}

export function toRow(record: NetworkRecord): Insertable<Network> {
  return record
}
