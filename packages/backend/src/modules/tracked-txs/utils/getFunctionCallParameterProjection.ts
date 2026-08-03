import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

const FUNCTION_SELECTOR_LENGTH = 4
const ABI_WORD_LENGTH = 32

export interface FunctionCallParameterProjection {
  /** One-based byte position, matching DuneSQL's varbinary_substring(). */
  start: number
  length: number
  abiType: string
}

export function getFunctionCallParameterProjection(
  signature: `function ${string}`,
  path: readonly [number, ...number[]],
): FunctionCallParameterProjection {
  const fragment = utils.FunctionFragment.from(
    signature.replace('function ', ''),
  )
  return locateParameter(fragment.inputs, path, FUNCTION_SELECTOR_LENGTH)
}

function locateParameter(
  parameters: readonly utils.ParamType[],
  path: readonly number[],
  containerStart: number,
): FunctionCallParameterProjection {
  const [index, ...remainingPath] = path
  assert(
    index !== undefined && Number.isInteger(index) && index >= 0,
    'Invalid parameter path',
  )

  const parameter = parameters[index]
  assert(parameter !== undefined, 'Parameter path does not exist')

  const parameterHeadStart =
    containerStart +
    parameters.slice(0, index).reduce((sum, current) => {
      return sum + getHeadSize(current)
    }, 0)

  if (remainingPath.length === 0) {
    assert(
      parameter.baseType !== 'tuple' && parameter.baseType !== 'array',
      'Grouping parameter must be a scalar',
    )
    assert(
      !isDynamic(parameter),
      'Grouping parameter must be a fixed-width scalar',
    )

    return {
      // DuneSQL byte positions are one-based, while offsets above are zero-based.
      start: parameterHeadStart + 1,
      length: ABI_WORD_LENGTH,
      abiType: parameter.type,
    }
  }

  assert(parameter.baseType === 'tuple', 'Parameter path does not exist')
  assert(parameter.components !== null, 'Tuple components are missing')

  if (!isDynamic(parameter)) {
    return locateParameter(
      parameter.components,
      remainingPath,
      parameterHeadStart,
    )
  }

  const hasEarlierDynamicParameter = parameters.slice(0, index).some(isDynamic)
  assert(
    !hasEarlierDynamicParameter,
    'Grouping parameter has a runtime-dependent calldata offset',
  )

  // A first dynamic parameter starts immediately after its container's head.
  const parameterDataStart = containerStart + getTupleHeadSize(parameters)
  return locateParameter(
    parameter.components,
    remainingPath,
    parameterDataStart,
  )
}

function getTupleHeadSize(parameters: readonly utils.ParamType[]): number {
  return parameters.reduce((sum, parameter) => {
    return sum + getHeadSize(parameter)
  }, 0)
}

function getHeadSize(parameter: utils.ParamType): number {
  return isDynamic(parameter) ? ABI_WORD_LENGTH : getStaticSize(parameter)
}

function getStaticSize(parameter: utils.ParamType): number {
  assert(!isDynamic(parameter), 'Cannot get the static size of a dynamic type')

  if (parameter.baseType === 'tuple') {
    assert(parameter.components !== null, 'Tuple components are missing')
    return parameter.components.reduce((sum, component) => {
      return sum + getStaticSize(component)
    }, 0)
  }

  if (parameter.baseType === 'array') {
    assert(parameter.arrayChildren !== null, 'Array element type is missing')
    assert(parameter.arrayLength !== null, 'Array length is missing')
    return parameter.arrayLength * getStaticSize(parameter.arrayChildren)
  }

  return ABI_WORD_LENGTH
}

function isDynamic(parameter: utils.ParamType): boolean {
  if (parameter.baseType === 'bytes' || parameter.baseType === 'string') {
    return true
  }

  if (parameter.baseType === 'array') {
    assert(parameter.arrayChildren !== null, 'Array element type is missing')
    return parameter.arrayLength === -1 || isDynamic(parameter.arrayChildren)
  }

  if (parameter.baseType === 'tuple') {
    assert(parameter.components !== null, 'Tuple components are missing')
    return parameter.components.some(isDynamic)
  }

  return false
}
