import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { decodeFunctionCallInput } from './decodeFunctionCallInput'

const SELECTOR_BYTES = 4
const WORD_BYTES = 32

type ParsedSignature = {
  inputs: readonly utils.ParamType[]
  selector: string
}

const signatures = new Map<`function ${string}`, ParsedSignature>()

/**
 * Returns the smallest canonical calldata prefix containing a fixed-width
 * scalar reached through tuples. More complex paths fall back to full input.
 */
export function getFunctionCallParameterPrefix(
  signature: `function ${string}`,
  path: readonly [number, ...number[]],
): number | undefined {
  const target = locateScalar(
    parseSignature(signature).inputs,
    path,
    canonicalTupleOffset,
  )
  return target === undefined
    ? undefined
    : SELECTOR_BYTES + target.position + WORD_BYTES
}

/**
 * Gets one scalar function parameter. Fixed-width tuple paths work with a
 * calldata prefix; all other paths use the complete ABI decoder.
 */
export function getFunctionCallParameter(
  signature: `function ${string}`,
  input: string,
  path: readonly [number, ...number[]],
): string {
  const extracted = extractFixedWidthScalar(signature, input, path)
  if (extracted !== undefined) return extracted

  let value: unknown = decodeFunctionCallInput(signature, input)
  for (const index of path) {
    assert(Number.isInteger(index) && index >= 0, 'Invalid parameter path')
    assert(Array.isArray(value), 'Parameter path does not exist')
    value = value[index]
  }

  assert(value !== undefined && value !== null, 'Parameter path does not exist')
  assert(!Array.isArray(value), 'Grouping parameter must be a scalar')
  return String(value)
}

function extractFixedWidthScalar(
  signature: `function ${string}`,
  input: string,
  path: readonly [number, ...number[]],
): string | undefined {
  const { inputs, selector } = parseSignature(signature)
  assert(
    input.toLowerCase().startsWith(selector),
    'Input does not match the function selector',
  )

  const data = Buffer.from(input.slice(2 + SELECTOR_BYTES * 2), 'hex')
  const target = locateScalar(inputs, path, (containerStart, slot) => {
    return containerStart + readWord(data, slot)
  })
  if (target === undefined) return undefined

  const word = readBytes(data, target.position, WORD_BYTES)
  const value: unknown = utils.defaultAbiCoder.decode(
    [target.type.type],
    word,
  )[0]
  return String(value)
}

type OffsetResolver = (
  containerStart: number,
  slot: number,
  parameters: readonly utils.ParamType[],
  index: number,
) => number | undefined

function locateScalar(
  inputs: readonly utils.ParamType[],
  path: readonly number[],
  resolveOffset: OffsetResolver,
): { type: utils.ParamType; position: number } | undefined {
  let parameters = inputs
  let containerStart = 0

  for (let depth = 0; depth < path.length; depth++) {
    const index = path[depth]
    assert(
      index !== undefined && Number.isInteger(index) && index >= 0,
      'Invalid parameter path',
    )

    const parameter = parameters[index]
    assert(parameter !== undefined, 'Parameter path does not exist')

    const slot =
      containerStart +
      parameters
        .slice(0, index)
        .reduce((sum, current) => sum + headSize(current), 0)
    const position = isDynamic(parameter)
      ? resolveOffset(containerStart, slot, parameters, index)
      : slot
    if (position === undefined) return undefined

    const isLast = depth === path.length - 1
    if (isLast) {
      return isDynamic(parameter) ||
        parameter.baseType === 'tuple' ||
        parameter.baseType === 'array'
        ? undefined
        : { type: parameter, position }
    }

    if (parameter.baseType !== 'tuple') return undefined
    assert(parameter.components !== null, 'Tuple components are missing')
    parameters = parameter.components
    containerStart = position
  }

  return undefined
}

function canonicalTupleOffset(
  containerStart: number,
  _slot: number,
  parameters: readonly utils.ParamType[],
  index: number,
): number | undefined {
  if (parameters.slice(0, index).some(isDynamic)) return undefined
  return containerStart + parameters.reduce((sum, p) => sum + headSize(p), 0)
}

function headSize(parameter: utils.ParamType): number {
  return staticSize(parameter) ?? WORD_BYTES
}

function staticSize(parameter: utils.ParamType): number | undefined {
  if (parameter.baseType === 'bytes' || parameter.baseType === 'string') {
    return undefined
  }

  if (parameter.baseType === 'array') {
    // Fixed arrays still affect the head position of following parameters,
    // even though prefix extraction does not enter array elements.
    assert(parameter.arrayChildren !== null, 'Array element type is missing')
    if (parameter.arrayLength === -1) return undefined
    const elementSize = staticSize(parameter.arrayChildren)
    return elementSize === undefined
      ? undefined
      : parameter.arrayLength * elementSize
  }

  if (parameter.baseType === 'tuple') {
    assert(parameter.components !== null, 'Tuple components are missing')
    let size = 0
    for (const component of parameter.components) {
      const componentSize = staticSize(component)
      if (componentSize === undefined) return undefined
      size += componentSize
    }
    return size
  }

  return WORD_BYTES
}

function isDynamic(parameter: utils.ParamType): boolean {
  return staticSize(parameter) === undefined
}

function parseSignature(signature: `function ${string}`): ParsedSignature {
  let parsed = signatures.get(signature)
  if (parsed === undefined) {
    const iface = new utils.Interface([signature])
    const fragment = Object.values(iface.functions)[0]
    assert(fragment !== undefined, 'Invalid function signature')
    parsed = {
      inputs: fragment.inputs,
      selector: iface.getSighash(fragment).toLowerCase(),
    }
    signatures.set(signature, parsed)
  }
  return parsed
}

function readWord(data: Buffer, position: number): number {
  const value = BigInt(
    `0x${readBytes(data, position, WORD_BYTES).toString('hex')}`,
  )
  assert(value <= BigInt(Number.MAX_SAFE_INTEGER), 'Pointer value out of range')
  return Number(value)
}

function readBytes(data: Buffer, position: number, length: number): Buffer {
  assert(
    position + length <= data.length,
    'Unexpected end of function call input',
  )
  return data.subarray(position, position + length)
}
