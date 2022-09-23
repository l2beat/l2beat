import { ZksyncResponse } from './schemas'

export function parseZksyncResponse(value: string): ZksyncResponse {
  try {
    const json: unknown = JSON.parse(value)
    return ZksyncResponse.parse(json)
  } catch {
    throw new TypeError('Invalid Zksync response.')
  }
}
