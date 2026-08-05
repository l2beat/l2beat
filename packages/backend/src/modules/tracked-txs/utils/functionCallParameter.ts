import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

const SELECTOR_BYTES = 4
const WORD_BYTES = 32

// The cache is bounded by the static tracked-tx configurations.
const signatures = new Map<
  `function ${string}`,
  { inputs: utils.ParamType[]; sighash: string }
>()

function parseSignature(signature: `function ${string}`) {
  let parsed = signatures.get(signature)
  if (parsed === undefined) {
    const iface = new utils.Interface([signature])
    const fragment = Object.values(iface.functions)[0]
    assert(fragment !== undefined, 'Invalid function signature')
    parsed = { inputs: fragment.inputs, sighash: iface.getSighash(fragment) }
    signatures.set(signature, parsed)
  }
  return parsed
}

/**
 * Extracts a single parameter from function call input by walking the ABI head
 * layout instead of running a full decode. Unlike a full decode this works on
 * a calldata prefix (see getFunctionCallParameterPrefix), as long as the
 * offsets on the path to the target and the target itself fit in the data.
 */
export function extractFunctionCallParameter(
  signature: `function ${string}`,
  input: string,
  path: readonly number[],
): string {
  const { inputs, sighash } = parseSignature(signature)
  assert(
    input.toLowerCase().startsWith(sighash),
    'Input does not match the function selector',
  )
  const data = Buffer.from(input.slice(2 + SELECTOR_BYTES * 2), 'hex')
  const target = locate(inputs, path, {
    blockOffset: (slot) => readPointer(data, slot),
    arrayElementOffset: (slot) => readPointer(data, slot),
    arrayLength: (position) => readPointer(data, position),
  })

  if (target.type.baseType === 'bytes' || target.type.baseType === 'string') {
    const length = readPointer(data, target.position)
    const bytes = readBytes(data, target.position + WORD_BYTES, length)
    return target.type.baseType === 'string'
      ? bytes.toString('utf8')
      : `0x${bytes.toString('hex')}`
  }

  const word = readBytes(data, target.position, WORD_BYTES)
  const value: unknown = utils.defaultAbiCoder.decode(
    [target.type.type],
    word,
  )[0]
  return String(value)
}

/**
 * The number of calldata bytes sufficient to extract the parameter at `path`,
 * assuming canonical ABI encoding (minimal offsets, which is what every
 * standard encoder emits). Returns undefined when the target's position is
 * data-dependent and the full input is required.
 */
export function getFunctionCallParameterPrefix(
  signature: `function ${string}`,
  path: readonly number[],
): number | undefined {
  try {
    const { inputs } = parseSignature(signature)
    const target = locate(inputs, path, CANONICAL_RESOLVER)
    if (staticSize(target.type) === undefined) return undefined
    return SELECTOR_BYTES + target.position + WORD_BYTES
  } catch {
    return undefined
  }
}

interface TailResolver {
  /** Offset stored in a block's head slot, relative to the block start. */
  blockOffset(
    slot: number,
    components: utils.ParamType[],
    index: number,
  ): number
  /** Offset stored in an array's element slot, relative to the elements start. */
  arrayElementOffset(slot: number): number
  /** Length of a dynamic array; undefined skips bounds checking. */
  arrayLength(position: number): number | undefined
}

const CANONICAL_RESOLVER: TailResolver = {
  blockOffset: (_slot, components, index) => {
    // Only the first tail's location is data-independent: canonical encoders
    // place it right after the block's head.
    for (let i = 0; i < index; i++) {
      if (staticSize(components[i]) === undefined) {
        throw new Error('Offset is data-dependent')
      }
    }
    return components.reduce((sum, c) => sum + headSize(c), 0)
  },
  arrayElementOffset: () => {
    // Element offsets follow the data-dependent array length.
    throw new Error('Offset is data-dependent')
  },
  arrayLength: () => undefined,
}

type Node =
  | { kind: 'block'; components: utils.ParamType[]; start: number }
  | {
      kind: 'array'
      element: utils.ParamType
      start: number
      length: number | undefined
    }
  | { kind: 'value'; type: utils.ParamType; position: number }

function locate(
  inputs: utils.ParamType[],
  path: readonly number[],
  resolver: TailResolver,
): { type: utils.ParamType; position: number } {
  let node: Node = { kind: 'block', components: inputs, start: 0 }
  for (const index of path) {
    assert(Number.isInteger(index) && index >= 0, 'Invalid parameter path')
    assert(node.kind !== 'value', 'Parameter path does not exist')
    node = stepInto(node, index, resolver)
  }
  assert(node.kind === 'value', 'Grouping parameter must be a scalar')
  return node
}

function stepInto(
  node: Exclude<Node, { kind: 'value' }>,
  index: number,
  resolver: TailResolver,
): Node {
  let type: utils.ParamType
  let slot: number
  if (node.kind === 'block') {
    assert(index < node.components.length, 'Parameter path does not exist')
    type = node.components[index]
    slot = node.start
    for (let i = 0; i < index; i++) {
      slot += headSize(node.components[i])
    }
  } else {
    assert(
      node.length === undefined || index < node.length,
      'Parameter path does not exist',
    )
    type = node.element
    slot = node.start + index * headSize(type)
  }

  // A static type is inlined in the head, a dynamic one's head slot points
  // into the tail, relative to the enclosing block.
  const start =
    staticSize(type) !== undefined
      ? slot
      : node.start +
        (node.kind === 'block'
          ? resolver.blockOffset(slot, node.components, index)
          : resolver.arrayElementOffset(slot))

  if (type.baseType === 'tuple') {
    return { kind: 'block', components: type.components, start }
  }
  if (type.baseType === 'array') {
    if (type.arrayLength !== -1) {
      // Fixed-size arrays have no length word.
      return {
        kind: 'array',
        element: type.arrayChildren,
        start,
        length: type.arrayLength,
      }
    }
    return {
      kind: 'array',
      element: type.arrayChildren,
      start: start + WORD_BYTES,
      length: resolver.arrayLength(start),
    }
  }
  return { kind: 'value', type, position: start }
}

function staticSize(type: utils.ParamType): number | undefined {
  switch (type.baseType) {
    case 'array': {
      if (type.arrayLength === -1) return undefined
      const element = staticSize(type.arrayChildren)
      return element === undefined ? undefined : type.arrayLength * element
    }
    case 'tuple': {
      let sum = 0
      for (const component of type.components) {
        const size = staticSize(component)
        if (size === undefined) return undefined
        sum += size
      }
      return sum
    }
    case 'bytes':
    case 'string':
      return undefined
    default:
      return WORD_BYTES
  }
}

function headSize(type: utils.ParamType): number {
  return staticSize(type) ?? WORD_BYTES
}

function readBytes(data: Buffer, position: number, length: number): Buffer {
  assert(
    position + length <= data.length,
    'Unexpected end of function call input',
  )
  return data.subarray(position, position + length)
}

function readPointer(data: Buffer, position: number): number {
  const value = BigInt(
    `0x${readBytes(data, position, WORD_BYTES).toString('hex')}`,
  )
  assert(value <= BigInt(Number.MAX_SAFE_INTEGER), 'Pointer value out of range')
  return Number(value)
}
