import { assert } from '@l2beat/shared-pure'
import zip from 'lodash/zip'
import type {
  ContractValue,
  DiscoveryCustomType,
} from '../discovery/output/types'
import {
  getCustomTypeCaster,
  isCustomTypeCaster,
} from '../discovery/type-casters'
import type { BlipSexp } from './type'

export class BlipRuntime {
  public readonly usedTypesSet: Set<DiscoveryCustomType> = new Set()
  constructor(private readonly types: Record<string, DiscoveryCustomType>) {}

  get usedTypes(): DiscoveryCustomType[] {
    return [...this.usedTypesSet]
  }

  executeBlip(v: ContractValue, blip: BlipSexp): ContractValue {
    if (!Array.isArray(blip)) {
      if (typeof blip === 'string' && blip.startsWith('#')) {
        const key = blip.slice(1) // remove leading #
        const value = this.objectGet(v, [key])
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
        if (blip[1] === undefined) {
          return !v
        }
        return !this.executeBlip(v, blip[1])
      case '=': {
        const [x, ...xs] = blip.slice(1).map((b) => this.executeBlip(v, b))
        if (xs.length === 0) {
          return x === v
        }
        return xs.every((e) => x === e)
      }
      case '!=': {
        const [x, ...xs] = blip.slice(1).map((b) => this.executeBlip(v, b))
        if (xs.length === 0) {
          return x !== v
        }
        return xs.some((e) => x !== e)
      }
      case 'and': {
        const [x, ...xs] = blip.slice(1).map((b) => this.executeBlip(v, b))
        return xs.every((e) => x && e)
      }
      case 'pipe': {
        return blip.slice(1).reduce((acc, fn) => this.executeBlip(acc, fn), v)
      }
      case 'map': {
        const fn = blip[1]
        assert(Array.isArray(v), 'map requires an array input')
        return v.map((item) => this.executeBlip(item, fn))
      }
      case 'pick': {
        assert(
          typeof v === 'object' && v !== null && !Array.isArray(v),
          'pick requires an object input',
        )
        const keys = blip.slice(1).map((k) => {
          if (typeof k === 'string' && k.startsWith('#')) {
            return k.slice(1)
          }
          const resolved = this.executeBlip(v, k)
          assert(typeof resolved === 'string', 'pick keys must be strings')
          return resolved
        })

        const result: Record<string, ContractValue> = {}
        for (const key of keys) {
          if (v[key] !== undefined) {
            result[key] = v[key]
          }
        }
        return result
      }
      case 'get': {
        const keys = blip.slice(1)
        return this.objectGet(v, keys)
      }
      case 'set': {
        const [_, key, filter] = blip
        const keys = ensureArray(key)

        const copy = structuredClone(v)
        return this.objectSet(copy, keys, filter)
      }
      case 'filter': {
        const [_, filter] = blip
        assert(Array.isArray(v), 'Filtering is only supported for arrays')
        return v.filter((item) => this.executeBlip(item, filter))
      }
      case 'find': {
        const [_, filter] = blip
        assert(Array.isArray(v), 'Finding is only supported for arrays')
        const result = v.find((item) => this.executeBlip(item, filter))
        assert(result !== undefined, 'No matching item found')
        return result
      }
      case 'format': {
        const [_, typeName] = blip

        assert(isCustomTypeCaster(typeName), 'Type caster not found')

        let typeCasterName = typeName
        let typeCasterArg = {}

        const typeDefinition = this.types[typeName]
        if (typeDefinition?.typeCaster !== undefined) {
          typeCasterName = typeDefinition.typeCaster
          typeCasterArg = typeDefinition.arg ?? {}

          this.usedTypesSet.add(typeDefinition)
        }

        return getCustomTypeCaster(typeCasterName).cast(typeCasterArg, v)
      }
      case 'if': {
        const [_, condition, ifTrue, ifFalse] = blip
        return this.executeBlip(v, condition)
          ? this.executeBlip(v, ifTrue)
          : this.executeBlip(v, ifFalse)
      }
      case 'delete': {
        const keys = blip.slice(1)
        let result = structuredClone(v)

        if (Array.isArray(result)) {
          for (const k of keys) {
            assert(typeof k === 'number', 'Array access requires a number key')
            assert(
              k >= 0 && k < result.length,
              `Array index ${k} out of bounds`,
            )
          }

          const sortedKeys = ([...keys] as number[]).sort((a, b) => b - a)

          for (const k of sortedKeys) {
            result = [...result.slice(0, k), ...result.slice(k + 1)]
          }
        } else if (typeof result === 'object' && result !== null) {
          for (const k of keys) {
            assert(typeof k === 'string', 'Object access requires a string key')
            delete result[k]
          }
        } else {
          assert(false, 'delete requires an array or object input')
        }

        return result
      }
      case 'shape': {
        const [_, ...keys] = blip
        const copy = structuredClone(v)
        assert(
          typeof copy === 'object',
          'Shape operation requires an array or object as input',
        )
        const input = Array.isArray(copy) ? copy : Object.values(copy)
        const result: Record<string, ContractValue> = {}

        for (const [element, key] of zip(input, keys)) {
          if (key === undefined || element === undefined) {
            continue
          }

          if (typeof key === 'string') {
            result[key] = element
          } else if (Array.isArray(key)) {
            const [keyName, keyFilter] = key
            assert(typeof keyName === 'string', 'Key name must be a string')
            assert(keyFilter !== undefined, 'Key filter must be defined')
            result[keyName] = this.executeBlip(element, keyFilter)
          } else {
            assert(
              false,
              'Shape keys must be strings or [string, filter] pairs',
            )
          }
        }

        return result
      }
      case 'to_entries': {
        const copy = structuredClone(v)
        assert(typeof copy === 'object')
        return Object.entries(copy) as ContractValue
      }
      default: {
        assert(false, 'unhandled')
      }
    }
  }

  objectGet(value: ContractValue, keys: (string | number)[]): ContractValue {
    let input = value
    let result: ContractValue | undefined

    for (const key of keys) {
      if (typeof key === 'string') {
        assert(
          typeof input === 'object' && !Array.isArray(input),
          'String keys only work on objects',
        )

        result = input[key]
      } else if (typeof key === 'number') {
        assert(Array.isArray(input), 'Numeric keys only work on arrays')
        assert(
          key < input.length && key >= 0,
          `Array index ${key} out of bounds`,
        )
        result = input[key]
      }

      assert(result !== undefined, 'Key not found in object')
      input = result
    }

    assert(result !== undefined, 'Key not found in object')
    return result
  }

  objectSet(
    object: ContractValue,
    keys: (string | number)[],
    value: BlipSexp,
  ): ContractValue {
    if (keys.length === 0) {
      return value
    }

    const preKeys = structuredClone(keys)
    const lastKey = preKeys.pop()

    let current = object
    if (preKeys.length > 0) {
      current = this.objectGet(current, preKeys)
    }

    if (typeof lastKey === 'string') {
      assert(
        typeof current === 'object' && !Array.isArray(current),
        'String keys only work on objects',
      )
      assert(
        current[lastKey] !== undefined && current[lastKey] !== null,
        'Key not found in object',
      )

      current[lastKey] = this.executeBlip(current[lastKey], value)
    } else if (typeof lastKey === 'number') {
      assert(Array.isArray(current), 'Numeric keys only work on arrays')
      assert(
        lastKey < current.length && lastKey >= 0,
        `Array index ${lastKey} out of bounds`,
      )
      assert(
        current[lastKey] !== undefined && current[lastKey] !== null,
        'Key not found in object',
      )

      current[lastKey] = this.executeBlip(current[lastKey], value)
    }

    return object
  }
}

function ensureArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}
