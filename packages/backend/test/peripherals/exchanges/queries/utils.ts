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
