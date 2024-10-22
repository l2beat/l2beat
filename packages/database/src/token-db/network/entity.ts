import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { NetworkType } from '../../kysely/generated/enums'
import { Network } from '../../kysely/generated/types'

export interface NetworkRecord {
  id: string
  name: string
  logoUrl: string | null
  type: NetworkType | null
  chainId: number | null
  coingeckoId: string | null
  axelarId: string | null
  axelarGatewayAddress: string | null
  orbitId: string | null
  wormholeId: string | null
  layerZeroV1EndpointAddress: string | null
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
