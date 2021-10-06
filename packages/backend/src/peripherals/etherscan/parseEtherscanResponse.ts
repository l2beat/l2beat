import { as } from '../cast'

export interface EtherscanSuccessResponse {
  status: '1'
  message: 'OK'
  result: unknown
}

export interface EtherscanErrorResponse {
  status: '0'
  message: 'NOTOK'
  result: string
}

export type EtherscanResponse =
  | EtherscanSuccessResponse
  | EtherscanErrorResponse

const asSuccessResponse = as.object('strict', {
  status: as.exactly('1' as const),
  message: as.exactly('OK' as const),
  result: as.unknown,
})

const asErrorResponse = as.object('strict', {
  status: as.exactly('0' as const),
  message: as.exactly('NOTOK' as const),
  result: as.string,
})

const asEtherscanResponse = as.either(asSuccessResponse, asErrorResponse)

export function parseEtherscanResponse(value: string): EtherscanResponse {
  try {
    const json = JSON.parse(value)
    return asEtherscanResponse(json)
  } catch {
    throw new TypeError('Invalid Etherscan response')
  }
}
