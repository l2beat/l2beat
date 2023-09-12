import { Bytes } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { MulticallEncoder, MulticallResponse } from './interfaces'

export const optimismMulticallInterface = new utils.Interface([
  'function multicall(tuple(address, bytes)[] memory calls) public returns (bytes[] memory results)',
])

type OptimismMulticallResult = [success: boolean, data: string][]

export const optimismMulticallEncoder: MulticallEncoder = {
  encode: (requests) => {
    const hexCalldata = optimismMulticallInterface.encodeFunctionData(
      'multicall',
      [
        requests.map((request) => [
          request.address.toString(),
          request.data.toString(),
        ]),
      ],
    )

    return Bytes.fromHex(hexCalldata)
  },

  decode: (response) => {
    const decodedResponse = optimismMulticallInterface.decodeFunctionResult(
      'multicall',
      response.toString(),
    )

    const values = decodedResponse[0] as OptimismMulticallResult

    return values.map(([success, data]): MulticallResponse => {
      const bytes = Bytes.fromHex(data)
      return {
        success: success && bytes.length !== 0,
        data: bytes,
      }
    })
  },
}
