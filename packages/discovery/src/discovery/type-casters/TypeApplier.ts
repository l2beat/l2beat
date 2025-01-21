import type { ContractValue } from '@l2beat/discovery-types'
import type { utils } from 'ethers'

import { assert } from '@l2beat/shared-pure'
import type { DiscoveryCustomType } from '../config/RawDiscoveryConfig'
import { getCustomTypeCaster, isCustomTypeCaster } from '../type-casters'
import {
  type TupleType,
  type Type,
  getReturnType,
  parseReturnType,
} from '../utils/parseReturnType'

export class TypeApplier {
  public readonly usedTypesSet: Set<DiscoveryCustomType> = new Set()
  constructor(private readonly types: Record<string, DiscoveryCustomType>) {}

  get usedTypes(): DiscoveryCustomType[] {
    return [...this.usedTypesSet]
  }

  applyReturnType(value: ContractValue, returnType: string): ContractValue {
    const type = parseReturnType(returnType)
    return this.reencodeWithReturnType(value, type)
  }

  applyReturnFragment(
    value: ContractValue,
    returnFragment?: utils.FunctionFragment,
  ): ContractValue {
    if (returnFragment === undefined || returnFragment.outputs === undefined) {
      return value
    }

    const type = getReturnType(returnFragment)
    return this.reencodeWithReturnType(value, type)
  }

  reencodeWithReturnType(value: ContractValue, type: TupleType): ContractValue {
    if (type.elements.length === 1) {
      const firstElement = type.elements[0]
      assert(firstElement !== undefined)
      return this.reencodeType(value, firstElement.type)
    } else {
      assert(Array.isArray(value))
      const names = type.elements.map((o) => o.name)
      const entries = names.map((name, i) => {
        const element = value[i]
        const outputElement = type.elements[i]
        assert(element !== undefined)
        assert(outputElement !== undefined)
        return [name, this.reencodeType(element, outputElement.type)]
      })

      return this.asObjectIfValidKeys(entries)
    }
  }

  reencodeType(value: ContractValue, paramType: Type): ContractValue {
    assert(
      this.valueShapeMatchesType(value, paramType),
      "The data shape of the value doesn't match the type",
    )

    if (paramType.kind === 'array') {
      const array = value as ContractValue[]
      return array.map((v) => {
        return this.reencodeType(v, paramType.childType)
      })
    }
    if (paramType.kind === 'tuple') {
      const array = value as ContractValue[]
      const entries = array.map((v, i) => {
        const element = paramType.elements[i]
        assert(element !== undefined)
        return [element.name, this.reencodeType(v, element.type)]
      })

      return this.asObjectIfValidKeys(entries)
    }

    if (isCustomTypeCaster(paramType.typeName)) {
      let typeCasterName = paramType.typeName
      let typeCasterArg = {}

      const typeDefinition = this.types[paramType.typeName]
      if (typeDefinition?.typeCaster !== undefined) {
        typeCasterName = typeDefinition.typeCaster
        typeCasterArg = typeDefinition.arg ?? {}

        this.usedTypesSet.add(typeDefinition)
      }

      return getCustomTypeCaster(typeCasterName).cast(typeCasterArg, value)
    }

    return value
  }

  valueShapeMatchesType(value: ContractValue, type: Type): boolean {
    const valueIsArray = Array.isArray(value)
    if (type.kind === 'array') {
      if (!valueIsArray) {
        return false
      }

      const arrayLength = type.length === 'dynamic' ? value.length : type.length
      return (
        value.length === arrayLength &&
        value.every((v) => this.valueShapeMatchesType(v, type.childType))
      )
    }
    if (type.kind === 'tuple') {
      return (
        valueIsArray &&
        value.length === type.elements.length &&
        value.every((v, i) => {
          const element = type.elements[i]
          assert(element !== undefined)
          return this.valueShapeMatchesType(v, element.type)
        })
      )
    }

    return !valueIsArray
  }

  asObjectIfValidKeys(entries: (ContractValue | undefined)[][]): ContractValue {
    if (entries.every((e) => e[0] !== undefined)) {
      return Object.fromEntries(entries)
    } else {
      return entries.map((e) => e[1] as ContractValue)
    }
  }
}
