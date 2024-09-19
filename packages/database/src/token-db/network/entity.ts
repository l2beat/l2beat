import { Insertable } from 'kysely'
import { Network } from '../../kysely/generated/types'
import { nanoid } from 'nanoid'

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

export type UpsertableNetworkRecord = Omit<
  Insertable<NetworkRecord>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRow(
  record: UpsertableNetworkRecord,
): Insertable<Network> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
