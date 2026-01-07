import { assert } from '@l2beat/shared-pure'
import type { utils } from 'ethers'
import type { ContractValue } from '../output/types'
import {
  type TupleType,
  type Type,
  toInternalType,
} from '../utils/parseReturnType'

export function asStructured(
  value: ContractValue,
  args?: utils.ParamType[],
): ContractValue {
  if (args === undefined) {
    return value
  }

  return reencodeWithInternalType(value, toInternalType(args))
}

function reencodeWithInternalType(
  value: ContractValue,
  type: TupleType,
): ContractValue {
  if (type.elements.length === 1) {
    const firstElement = type.elements[0]
    assert(firstElement !== undefined)
    return reencodeType(value, firstElement.type)
  }
  assert(Array.isArray(value))
  const names = type.elements.map((o) => o.name)
  const entries = names.map((name, i) => {
    const element = value[i]
    const outputElement = type.elements[i]
    assert(element !== undefined)
    assert(outputElement !== undefined)
    return [name, reencodeType(element, outputElement.type)]
  })

  return asObjectIfValidKeys(entries)
}

function reencodeType(value: ContractValue, paramType: Type): ContractValue {
  assert(
    valueShapeMatchesType(value, paramType),
    "The data shape of the value doesn't match the type",
  )

  if (paramType.kind === 'array') {
    const array = value as ContractValue[]
    return array.map((v) => {
      return reencodeType(v, paramType.childType)
    })
  }
  if (paramType.kind === 'tuple') {
    const array = value as ContractValue[]
    const entries = array.map((v, i) => {
      const element = paramType.elements[i]
      assert(element !== undefined)
      return [element.name, reencodeType(v, element.type)]
    })

    return asObjectIfValidKeys(entries)
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
  }
  return entries.map((e) => e[1] as ContractValue)
}
