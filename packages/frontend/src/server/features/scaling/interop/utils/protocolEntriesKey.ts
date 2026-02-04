import { assert, type InteropBridgeType } from '@l2beat/shared-pure'

export function makeByBridgeTypeKey(id: string, bridgeType: InteropBridgeType) {
  return `${id}::${bridgeType}`
}

export function parseByBridgeTypeKey(key: string): {
  id: string
  bridgeType: InteropBridgeType
} {
  const [id, bridgeType] = key.split('::')
  assert(id, `Invalid protocol entries key: ${key}`)
  assert(bridgeType, `Invalid protocol entries key: ${key}`)
  return { id, bridgeType: bridgeType as InteropBridgeType }
}
