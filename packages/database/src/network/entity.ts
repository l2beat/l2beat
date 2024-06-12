import { Insertable, Selectable } from 'kysely'
import { Network as NetworkEntity } from '../kysely/generated/types'

export interface Network {
  id: string
  chainId: number
  name: string
  coingeckoId?: string
  axelarId?: string
  axelarGatewayAddress?: string
  orbitId?: string
  wormholeId?: string
  layerZeroV1EndpointAddress?: string
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(entity: Selectable<NetworkEntity>): Network {
  return {
    id: entity.id,
    chainId: entity.chain_id,
    name: entity.name,
    coingeckoId: entity.coingecko_id ?? undefined,
    axelarId: entity.axelar_id ?? undefined,
    axelarGatewayAddress: entity.axelar_gateway_address ?? undefined,
    orbitId: entity.orbit_id ?? undefined,
    wormholeId: entity.wormhole_id ?? undefined,
    layerZeroV1EndpointAddress:
      entity.layer_zero_v1_endpoint_address ?? undefined,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(network: Network): Insertable<NetworkEntity> {
  return {
    id: network.id,
    chain_id: network.chainId,
    name: network.name,
    coingecko_id: network.coingeckoId,
    axelar_id: network.axelarId,
    axelar_gateway_address: network.axelarGatewayAddress,
    orbit_id: network.orbitId,
    wormhole_id: network.wormholeId,
    layer_zero_v1_endpoint_address: network.layerZeroV1EndpointAddress,
    updated_at: network.updatedAt,
    created_at: network.createdAt,
  }
}
