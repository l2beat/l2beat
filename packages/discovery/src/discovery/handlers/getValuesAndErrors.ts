import { ContractParameters, ContractValue } from '@l2beat/discovery-types'
import { utils } from 'ethers'

import { assert } from '@l2beat/backend-tools'
import { ParamType } from 'ethers/lib/utils'
import { HandlerResult } from './Handler'

export function getValuesAndErrors(results: HandlerResult[]): {
  values: ContractParameters['values']
  errors: ContractParameters['errors']
} {
  const values: ContractParameters['values'] = {}
  const errors: ContractParameters['errors'] = {}
  for (const result of results) {
    if (result.value !== undefined) {
      values[result.field] = reencodeWithABI(result.value, result.fragment)
    }
    if (result.error !== undefined) {
      errors[result.field] = result.error
    }
  }
  return { values, errors }
}

function reencodeWithABI(
  value: ContractValue,
  fragment: utils.FunctionFragment | undefined,
): ContractValue {
  if (fragment === undefined || fragment.outputs === undefined) {
    return value
  }

  const outputs = fragment.outputs
  if (outputs.length === 1 && outputs[0] !== undefined) {
    return reencodeType(value, outputs[0])
  } else {
    assert(Array.isArray(value))
    const names = outputs.map((o) => o.name)
    const entries = names.map((name, i) => {
      const element = value[i]
      const output = outputs[i]
      assert(element !== undefined)
      assert(output !== undefined)
      return [name, reencodeType(element, output)]
    })

    return asObjectIfValidKeys(entries)
  }
}

function reencodeType(
  value: ContractValue,
  paramType: ParamType,
): ContractValue {
  assert(valueShapeMatchesType(value, paramType))

  if (paramType.arrayLength !== null) {
    const array = value as ContractValue[]
    return array.map((v) => {
      return reencodeType(v, paramType.arrayChildren)
    })
  }
  if (paramType.components !== null) {
    const array = value as ContractValue[]
    const entries = array.map((v, i) => {
      const component = paramType.components[i]
      assert(component !== undefined)
      return [component.name, reencodeType(v, component)]
    })

    return asObjectIfValidKeys(entries)
  }

  return value
}

function valueShapeMatchesType(
  value: ContractValue,
  paramType: ParamType,
): boolean {
  const valueIsArray = Array.isArray(value)
  if (paramType.arrayLength !== null) {
    if (!valueIsArray) {
      return false
    }

    const arrayLength =
      paramType.arrayLength === -1 ? value.length : paramType.arrayLength
    return (
      value.length === arrayLength &&
      value.every((v) => valueShapeMatchesType(v, paramType.arrayChildren))
    )
  }
  if (paramType.components !== null) {
    return (
      valueIsArray &&
      value.length === paramType.components.length &&
      value.every((v, i) => {
        const component = paramType.components[i]
        assert(component !== undefined)
        return valueShapeMatchesType(v, component)
      })
    )
  }

  return !valueIsArray
}

function asObjectIfValidKeys(entries: ContractValue[][]): ContractValue {
  if (entries.every((e) => e[0] !== null)) {
    return Object.fromEntries(entries)
  } else {
    return entries.map((e) => e[1] as ContractValue)
  }
}
