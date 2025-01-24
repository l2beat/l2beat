import type { ContractValue } from '@l2beat/discovery-types'
import { assert } from '@l2beat/shared-pure'
import type { BlipSexp } from './type'

export function executeBlip(v: ContractValue, blip: BlipSexp): ContractValue {
  if (!Array.isArray(blip)) {
    if (typeof blip === 'string' && blip.startsWith('#')) {
      const key = blip.slice(1) // remove leading #
      const value = extractKey(v, key)
      assert(
        value !== undefined,
        `Tried to extract column [${key}] but it's undefined`,
      )
      return value
    }

    return blip
  }

  const [operation] = blip
  switch (operation) {
    case 'not':
      return !executeBlip(v, blip[1])
    case '=': {
      const [x, ...xs] = blip.slice(1).map((b) => executeBlip(v, b))
      return xs.every((e) => x === e)
    }
    case '!=': {
      const [x, ...xs] = blip.slice(1).map((b) => executeBlip(v, b))
      return xs.some((e) => x !== e)
    }
    case 'and': {
      const [x, ...xs] = blip.slice(1).map((b) => executeBlip(v, b))
      return xs.every((e) => x && e)
    }
    default: {
      assert(false, 'unhandled')
    }
  }
}

function extractKey(
  value: ContractValue,
  key: string,
): ContractValue | undefined {
  assert(typeof value === 'object' && !Array.isArray(value), 'Extract keys')

  return value[key]
}
