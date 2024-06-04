import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import { ETHEREUM_BALANCE_ENCODING } from '../../modules/tvl/balances/BalanceProvider'
import {
  ERC20MulticallCodec,
  MulticallRequest,
  NativeAssetMulticallCodec,
} from './types'

export const nativeAssetCodec: NativeAssetMulticallCodec = {
  sinceBlock: ETHEREUM_BALANCE_ENCODING.sinceBlock,
  balance: {
    encode: encodeGetEthBalance,
    decode: decodeGetEthBalance,
  },
}

export const erc20Codec: ERC20MulticallCodec = {
  balance: {
    encode: encodeErc20BalanceQuery,
    decode: decodeErc20BalanceQuery,
  },
  totalSupply: {
    encode: encodeErc20TotalSupplyQuery,
    decode: decodeErc20TotalSupplyQuery,
  },
}

const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

const multicallInterface = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
])

function encodeGetEthBalance(address: EthereumAddress): MulticallRequest {
  return {
    address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
    data: Bytes.fromHex(
      multicallInterface.encodeFunctionData('getEthBalance', [
        address.toString(),
      ]),
    ),
  }
}

function decodeGetEthBalance(response: Bytes) {
  return (
    multicallInterface.decodeFunctionResult(
      'getEthBalance',
      response.toString(),
    )[0] as BigNumber
  ).toBigInt()
}

function encodeErc20BalanceQuery(
  holder: EthereumAddress,
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(
      erc20Interface.encodeFunctionData('balanceOf', [holder.toString()]),
    ),
  }
}

function decodeErc20BalanceQuery(response: Bytes): bigint {
  const [value] = erc20Interface.decodeFunctionResult(
    'balanceOf',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}

export function encodeErc20TotalSupplyQuery(
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
  }
}

export function decodeErc20TotalSupplyQuery(response: Bytes): bigint {
  const [value] = erc20Interface.decodeFunctionResult(
    'totalSupply',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}
