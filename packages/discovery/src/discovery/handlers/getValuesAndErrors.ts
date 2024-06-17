import { ContractParameters, ContractValue } from '@l2beat/discovery-types'
import { utils } from 'ethers'

import { assert } from '@l2beat/backend-tools'
import {
  DiscoveryContract,
  DiscoveryCustomType,
} from '../config/RawDiscoveryConfig'
import { getCustomTypeCaster, isCustomTypeCaster } from '../type-casters'
import {
  TupleType,
  Type,
  getReturnType,
  parseReturnType,
} from '../utils/parseReturnType'
import { HandlerResult } from './Handler'

export function getValuesAndErrors(
  results: HandlerResult[],
  fieldOverrides?: DiscoveryContract['fields'],
  types?: Record<string, DiscoveryCustomType>,
): {
  values: ContractParameters['values']
  errors: ContractParameters['errors']
} {
  const values: ContractParameters['values'] = {}
  const errors: ContractParameters['errors'] = {}
  for (const result of results) {
    if (result.value !== undefined) {
      const returnType = (fieldOverrides ?? {})[result.field]?.returnType
      if (returnType !== undefined && returnType !== null) {
        const type = parseReturnType(returnType)
        values[result.field] = reencodeWithReturnType(
          result.value,
          type,
          types ?? {},
        )
      } else {
        values[result.field] = reencodeWithABI(
          result.value,
          result.fragment,
          types ?? {},
        )
      }
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
  types: Record<string, DiscoveryCustomType>,
): ContractValue {
  if (fragment === undefined || fragment.outputs === undefined) {
    return value
  }

  const type = getReturnType(fragment)
  return reencodeWithReturnType(value, type, types)
}

function reencodeWithReturnType(
  value: ContractValue,
  type: TupleType,
  types: Record<string, DiscoveryCustomType>,
): ContractValue {
  if (type.elements.length === 1) {
    const firstElement = type.elements[0]
    assert(firstElement !== undefined)
    return reencodeType(value, firstElement.type, types)
  } else {
    assert(Array.isArray(value))
    const names = type.elements.map((o) => o.name)
    const entries = names.map((name, i) => {
      const element = value[i]
      const outputElement = type.elements[i]
      assert(element !== undefined)
      assert(outputElement !== undefined)
      return [name, reencodeType(element, outputElement.type, types)]
    })

    return asObjectIfValidKeys(entries)
  }
}

function reencodeType(
  value: ContractValue,
  paramType: Type,
  types: Record<string, DiscoveryCustomType>,
): ContractValue {
  assert(
    valueShapeMatchesType(value, paramType),
    "The data shape of the value doesn't match the type",
  )

  if (paramType.kind === 'array') {
    const array = value as ContractValue[]
    return array.map((v) => {
      return reencodeType(v, paramType.childType, types)
    })
  }
  if (paramType.kind === 'tuple') {
    const array = value as ContractValue[]
    const entries = array.map((v, i) => {
      const element = paramType.elements[i]
      assert(element !== undefined)
      return [element.name, reencodeType(v, element.type, types)]
    })

    return asObjectIfValidKeys(entries)
  }

  if (isCustomTypeCaster(paramType.typeName)) {
    let typeCasterName = paramType.typeName
    let typeCasterArg = {}

    const typeDefinition = types[paramType.typeName]
    if (typeDefinition?.typeCaster !== undefined) {
      typeCasterName = typeDefinition.typeCaster
      typeCasterArg = typeDefinition.arg ?? {}
    }

    return getCustomTypeCaster(typeCasterName).cast(typeCasterArg, value)
  }

  return value
}

function valueShapeMatchesType(value: ContractValue, type: Type): boolean {
  const valueIsArray = Array.isArray(value)
  if (type.kind === 'array') {
    if (!valueIsArray) {
      return false
    }

    const arrayLength = type.length === 'dynamic' ? value.length : type.length
    return (
      value.length === arrayLength &&
      value.every((v) => valueShapeMatchesType(v, type.childType))
    )
  }
  if (type.kind === 'tuple') {
    return (
      valueIsArray &&
      value.length === type.elements.length &&
      value.every((v, i) => {
        const element = type.elements[i]
        assert(element !== undefined)
        return valueShapeMatchesType(v, element.type)
      })
    )
  }

  return !valueIsArray
}

function asObjectIfValidKeys(
  entries: (ContractValue | undefined)[][],
): ContractValue {
  if (entries.every((e) => e[0] !== undefined)) {
    return Object.fromEntries(entries)
  } else {
    return entries.map((e) => e[1] as ContractValue)
  }
}
