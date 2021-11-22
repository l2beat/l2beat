import { utils } from 'ethers'

import { Bytes } from '../../../../src/model'
import { MulticallResponse } from '../../../../src/peripherals/ethereum/MulticallClient'

const coder = new utils.AbiCoder()

export function encodeUniswapV1Results(
  first: bigint | undefined,
  second: bigint | undefined
): MulticallResponse[] {
  return [encodeUintResponse(first), encodeUintResponse(second)]
}

function encodeUintResponse(value: bigint | undefined) {
  if (value === undefined) {
    return { success: false, data: Bytes.EMPTY }
  }
  return { success: true, data: encodeUint(value) }
}

function encodeUint(value: bigint) {
  return Bytes.fromHex(coder.encode(['uint'], [value.toString()]))
}

export function encodeUniswapV2Results(
  first: bigint,
  second: bigint
): MulticallResponse[] {
  return [encodeReservesResponse(first, second)]
}

function encodeReservesResponse(first: bigint, second: bigint) {
  return {
    success: true,
    data: Bytes.fromHex(
      coder.encode(
        ['uint112', 'uint112', 'uint32'],
        [first.toString(), second.toString(), 1]
      )
    ),
  }
}

export function encodeUniswapV3Results(
  balance: bigint,
  priceSqrt64x96: bigint
): MulticallResponse[] {
  return [encodeUintResponse(balance), encodeSlotZeroResponse(priceSqrt64x96)]
}

function encodeSlotZeroResponse(priceSqrt64x96: bigint) {
  return {
    success: true,
    data: Bytes.fromHex(
      coder.encode(
        ['uint160', 'int24', 'uint16', 'uint16', 'uint16', 'uint8', 'bool'],
        [priceSqrt64x96.toString(), 0, 0, 0, 0, 0, false]
      )
    ),
  }
}
