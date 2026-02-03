import { assert, type InteropBridgeType } from '@l2beat/shared-pure'

export function makeProtocolEntriesKey(
  id: string,
  bridgeType: InteropBridgeType,
) {
  return `${id}::${bridgeType}`
}

export function parseProtocolEntriesKey(key: string): {
  id: string
  bridgeType: InteropBridgeType
} {
  const [id, bridgeType] = key.split('::')
  assert(id, `Invalid protocol entries key: ${key}`)
  assert(bridgeType, `Invalid protocol entries key: ${key}`)
  return { id, bridgeType: bridgeType as InteropBridgeType }
}
