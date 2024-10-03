import { TokenRecord } from '@l2beat/database'

export type TokenPayload = { tokenId: TokenRecord['id'] }
export type BatchTokenPayload = { tokenIds: TokenRecord['id'][] }
