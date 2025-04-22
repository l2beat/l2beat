import type { ContractValue } from '../output/types'
import type { DiscoveryCustomType } from '../config/StructureConfig'
import jsonata from 'jsonata'
import { getCustomTypeCaster, TypeConverters } from '../type-casters'
import { assert } from '@l2beat/shared-pure'
import { zip } from 'lodash'

export class EditRuntime {
  public readonly usedTypesSet: Set<DiscoveryCustomType> = new Set()
  constructor(private readonly types: Record<string, DiscoveryCustomType>) {}

  get usedTypes(): DiscoveryCustomType[] {
    return [...this.usedTypesSet]
  }

  async evaluateEdit(
    value: ContractValue | undefined,
    edit: string,
  ): Promise<ContractValue | undefined> {
    const expression = jsonata(edit)

    this.registerTypeCasterFunctions(expression, this.types)
    this.registerInternalFunctions(expression)

    return await expression.evaluate(value)
  }

  registerTypeCasterFunctions(
    expression: jsonata.Expression,
    types: Record<string, DiscoveryCustomType>,
  ) {
    const addUsedType = (typeDefinition: DiscoveryCustomType) => {
      this.usedTypesSet.add(typeDefinition)
    }

    for (const functionName in types) {
      expression.registerFunction(functionName, function (...args) {
        let typeCasterName = functionName
        let typeCasterArg = {}

        const typeDefinition = types[functionName]
        if (typeDefinition?.typeCaster !== undefined) {
          typeCasterName = typeDefinition.typeCaster
          typeCasterArg = typeDefinition.arg ?? {}

          addUsedType(typeDefinition)
        }

        return getCustomTypeCaster(typeCasterName).cast(typeCasterArg, args[0])
      })
    }

    for (const functionName in TypeConverters) {
      expression.registerFunction(functionName, function (...args) {
        return getCustomTypeCaster(functionName).cast({}, args[0])
      })
    }
  }

  registerInternalFunctions(expression: jsonata.Expression) {
    expression.registerFunction('shape', function (...args) {
      const keys = args
      const copy = structuredClone(this.input)
      assert(
        typeof copy === 'object',
        'shape operation requires an array or object as input',
      )

      // NOTE(radomski): We need to index into the array here cause the input
      // is an array of arrays if the object is an array for some reason.
      //
      // biome-ignore lint/suspicious/noExplicitAny: We understand the risk
      const input = (Array.isArray(copy) ? copy[0] : Object.values(copy)) as any[]

      const result: Record<string, ContractValue> = {}

      for (const [element, key] of zip(input, keys)) {
        if (typeof key === 'string') {
          console.log(key, element)
          result[key] = element
        } else if (Array.isArray(key)) {
          assert(
            key.length === 2,
            'Shape keys must be strings or [keyName, filter] pairs',
          )
          const [keyName, filter] = key
          assert(typeof keyName === 'string', 'Key name must be a string')
          assert(filter !== undefined, 'Filter must be defined')
          assert(typeof filter === 'object', 'Filter must be an object')
          assert(
            '_jsonata_function' in filter,
            'Filter must be a jsonata function',
          )
          assert(
            'implementation' in filter,
            'Filter must have an implementation',
          )
          assert(
            typeof filter.implementation === 'function',
            'Filter must have an implementation',
          )

          console.log(keyName, element)
          result[keyName] = filter.implementation(element)
        }
      }

      return result
    })
  }
}
