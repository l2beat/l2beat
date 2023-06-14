import { getTokenByAssetId } from '@l2beat/config'
import { AssetId, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'

import { MULTICALL_V1_ADDRESS } from '../MulticallClient'
import { BalanceCall } from './BalanceCall'

describe('BalanceCall', () => {
  const coder = new utils.Interface([
    'function getEthBalance(address account) view returns (uint256)',
    'function balanceOf(address account) view returns (uint256)',
  ])

  const MOCK_HOLDER = EthereumAddress(
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  )

  describe('encode', () => {
    it('ether', () => {
      const ether = AssetId('eth-ether')
      const encoded = BalanceCall.encode(MOCK_HOLDER, ether)

      expect(encoded).toEqual({
        address: MULTICALL_V1_ADDRESS,
        data: Bytes.fromHex(
          coder.encodeFunctionData('getEthBalance', [MOCK_HOLDER.toString()]),
        ),
      })
    })

    it('token', () => {
      const token = AssetId('dai-dai-stablecoin')
      const encoded = BalanceCall.encode(MOCK_HOLDER, token)

      expect(encoded).toEqual({
        address: getTokenByAssetId(token)!.address!,
        data: Bytes.fromHex(
          coder.encodeFunctionData('balanceOf', [MOCK_HOLDER.toString()]),
        ),
      })
    })
  })

  describe('decode', () => {
    const response = {
      success: true,
      data: Bytes.fromHex(
        '0x0000000000000000000000000000000000000000000000000000000000000064',
      ),
    }
    const decoded = BalanceCall.decode(response)

    expect(decoded).toEqual(100n)
  })
})
