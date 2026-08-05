import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import {
  extractFunctionCallParameter,
  getFunctionCallParameterPrefix,
} from './functionCallParameter'

// Aztec Rollup.submitEpochRootProof, the motivating case: ~66 KB of calldata
// of which liveness grouping needs only the first tuple member.
const AZTEC_SIGNATURE =
  'function submitEpochRootProof((uint256,uint256,(bytes32,bytes32,bytes32,address),(bytes32,bytes32,bytes32,bytes32,bytes32,uint256,uint256,address,bytes32,(uint128,uint128),uint256,uint256)[],(bytes,bytes),bytes,bytes))' as const

const PROVER = EthereumAddress.random().toString()

function hex32(value: number): string {
  return utils.hexZeroPad(`0x${value.toString(16)}`, 32)
}

function checkpoint(i: number) {
  return [
    hex32(1000 + i),
    hex32(2000 + i),
    hex32(3000 + i),
    hex32(4000 + i),
    hex32(5000 + i),
    6000 + i,
    7000 + i,
    PROVER,
    hex32(8000 + i),
    [1, 2],
    9000 + i,
    10000 + i,
  ]
}

const AZTEC_ARGS = [
  [
    24308,
    24339,
    [hex32(1), hex32(2), hex32(3), PROVER],
    [checkpoint(0), checkpoint(1), checkpoint(2)],
    [`0x${'aa'.repeat(100)}`, `0x${'bb'.repeat(7)}`],
    `0x${'cc'.repeat(1234)}`,
    `0x${'dd'.repeat(5)}`,
  ],
]

const AZTEC_INTERFACE = new utils.Interface([AZTEC_SIGNATURE])
const AZTEC_INPUT = AZTEC_INTERFACE.encodeFunctionData(
  'submitEpochRootProof',
  AZTEC_ARGS,
)

/** The pre-optimization implementation: full decode, walk the result. */
function decodeByPath(input: string, path: number[]): string {
  let value: unknown = AZTEC_INTERFACE.decodeFunctionData(
    'submitEpochRootProof',
    input,
  )
  for (const index of path) {
    value = (value as unknown[])[index]
  }
  return String(value)
}

function prefixOf(input: string, bytes: number): string {
  return input.slice(0, 2 + bytes * 2)
}

describe(extractFunctionCallParameter.name, () => {
  it('extracts a head-word parameter from the full input', () => {
    expect(
      extractFunctionCallParameter(AZTEC_SIGNATURE, AZTEC_INPUT, [0, 0]),
    ).toEqual('24308')
    expect(
      extractFunctionCallParameter(AZTEC_SIGNATURE, AZTEC_INPUT, [0, 1]),
    ).toEqual('24339')
  })

  it('extracts the same value from just the calldata prefix', () => {
    const prefix = getFunctionCallParameterPrefix(AZTEC_SIGNATURE, [0, 0])
    expect(prefix).toEqual(68)
    expect(
      extractFunctionCallParameter(
        AZTEC_SIGNATURE,
        prefixOf(AZTEC_INPUT, 68),
        [0, 0],
      ),
    ).toEqual('24308')
  })

  it('extracts an address from an inlined static tuple', () => {
    const path = [0, 2, 3]
    const value = extractFunctionCallParameter(
      AZTEC_SIGNATURE,
      AZTEC_INPUT,
      path,
    )
    expect(value).toEqual(decodeByPath(AZTEC_INPUT, path))
    expect(value).toEqual(PROVER)

    const prefix = getFunctionCallParameterPrefix(AZTEC_SIGNATURE, path)
    expect(prefix).toEqual(4 + 32 + 2 * 32 + 3 * 32 + 32)
    expect(
      extractFunctionCallParameter(
        AZTEC_SIGNATURE,
        prefixOf(AZTEC_INPUT, prefix ?? 0),
        path,
      ),
    ).toEqual(value)
  })

  it('extracts a member of a dynamic array element', () => {
    const path = [0, 3, 1, 5]
    const value = extractFunctionCallParameter(
      AZTEC_SIGNATURE,
      AZTEC_INPUT,
      path,
    )
    expect(value).toEqual(decodeByPath(AZTEC_INPUT, path))
    expect(value).toEqual('6001')

    // tuple offset word + tuple head (10 words) + array length word
    // + 1 full element (13 words) + 5 head words into the second element
    const prefix = getFunctionCallParameterPrefix(AZTEC_SIGNATURE, path)
    expect(prefix).toEqual(4 + (1 + 10 + 1 + 13 + 5) * 32 + 32)
    expect(
      extractFunctionCallParameter(
        AZTEC_SIGNATURE,
        prefixOf(AZTEC_INPUT, prefix ?? 0),
        path,
      ),
    ).toEqual(value)
  })

  it('extracts dynamic bytes when given the full input', () => {
    const path = [0, 4, 0]
    expect(
      extractFunctionCallParameter(AZTEC_SIGNATURE, AZTEC_INPUT, path),
    ).toEqual(`0x${'aa'.repeat(100)}`)
  })

  it('rejects input with a mismatched selector', () => {
    const other = new utils.Interface(['function foo(uint256)'])
    expect(() =>
      extractFunctionCallParameter(
        AZTEC_SIGNATURE,
        other.encodeFunctionData('foo', [1]),
        [0, 0],
      ),
    ).toThrow('Input does not match the function selector')
  })

  it('rejects input truncated below the target', () => {
    expect(() =>
      extractFunctionCallParameter(
        AZTEC_SIGNATURE,
        prefixOf(AZTEC_INPUT, 67),
        [0, 0],
      ),
    ).toThrow('Unexpected end of function call input')
  })

  it('rejects a path ending at a tuple', () => {
    expect(() =>
      extractFunctionCallParameter(AZTEC_SIGNATURE, AZTEC_INPUT, [0]),
    ).toThrow('Grouping parameter must be a scalar')
  })

  it('rejects a path outside the parameters', () => {
    expect(() =>
      extractFunctionCallParameter(AZTEC_SIGNATURE, AZTEC_INPUT, [0, 7]),
    ).toThrow('Parameter path does not exist')
    expect(() =>
      extractFunctionCallParameter(AZTEC_SIGNATURE, AZTEC_INPUT, [0, 3, 3, 0]),
    ).toThrow('Parameter path does not exist')
  })
})

describe(getFunctionCallParameterPrefix.name, () => {
  it('is undefined when the target position is data-dependent', () => {
    // (bytes,bytes) is not the first dynamic member of the tuple, so its
    // offset depends on the size of the checkpoint array before it.
    expect(getFunctionCallParameterPrefix(AZTEC_SIGNATURE, [0, 4, 0])).toEqual(
      undefined,
    )
    // Dynamic bytes need their data-dependent length even at a static offset.
    expect(getFunctionCallParameterPrefix('function foo(bytes)', [0])).toEqual(
      undefined,
    )
  })

  it('is undefined for an invalid path', () => {
    expect(getFunctionCallParameterPrefix(AZTEC_SIGNATURE, [0])).toEqual(
      undefined,
    )
    expect(getFunctionCallParameterPrefix(AZTEC_SIGNATURE, [5])).toEqual(
      undefined,
    )
  })

  it('covers a fully static parameter list', () => {
    expect(
      getFunctionCallParameterPrefix(
        'function foo(uint256,(uint256,address))',
        [1, 1],
      ),
    ).toEqual(4 + 2 * 32 + 32)
  })
})
