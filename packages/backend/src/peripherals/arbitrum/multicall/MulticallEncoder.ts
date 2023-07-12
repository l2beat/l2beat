import { Bytes } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { MulticallEncoder, MulticallResponse } from './interfaces'

export const arbitrumMulticallInterface = new utils.Interface([
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[] returnData)',
])

type ArbitrumMulticallResult = [success: boolean, data: string][]

export const arbitrumMulticallEncoder: MulticallEncoder = {
  encode: (requests) => {
    const hexCalldata = arbitrumMulticallInterface.encodeFunctionData(
      'tryAggregate',
      [
        false,
        requests.map((request) => [
          request.address.toString(),
          request.data.toString(),
        ]),
      ],
    )

    return Bytes.fromHex(hexCalldata)
  },

  decode: (response) => {
    const decodedResponse = arbitrumMulticallInterface.decodeFunctionResult(
      'tryAggregate',
      response.toString(),
    )

    const values = decodedResponse[0] as ArbitrumMulticallResult

    return values.map(([success, data]): MulticallResponse => {
      const bytes = Bytes.fromHex(data)
      return {
        success: success && bytes.length !== 0,
        data: bytes,
      }
    })
  },
}
