import {
  ENTRY_POINT_ADDRESS_0_6_0,
  ENTRY_POINT_ADDRESS_0_7_0,
  Method,
  SAFE_EXEC_TRANSACTION_SELECTOR,
  SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
} from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { providers } from 'ethers'
import { RpcUopsAnalyzer } from './RpcUopsAnalyzer'

describe(RpcUopsAnalyzer.name, () => {
  describe(RpcUopsAnalyzer.prototype.analyzeBlock.name, () => {
    it('should correctly sum the number of txs and uops', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx1 = mockObject<providers.TransactionResponse>()
      const tx2 = mockObject<providers.TransactionResponse>()
      const tx3 = mockObject<providers.TransactionResponse>()

      analyzer.mapTransaction = mockFn()
        .returnsOnce(1)
        .returnsOnce(2)
        .returnsOnce(4)

      const block = {
        transactions: [tx1, tx2, tx3],
      }

      const result = await analyzer.analyzeBlock(block)
      expect(result.transactionsLength).toEqual(3)
      expect(result.uopsLength).toEqual(7)
    })
  })

  describe(RpcUopsAnalyzer.prototype.mapTransaction.name, () => {
    it('should handle ERC-4337:EntryPoint0.6.0', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = mockObject<providers.TransactionResponse>({
        to: ENTRY_POINT_ADDRESS_0_6_0,
        data: '0x1234abcd',
      })

      analyzer.countUserOperations = mockFn().returns(2)

      const count = await analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle ERC-4337:EntryPoint0.7.0', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = mockObject<providers.TransactionResponse>({
        to: ENTRY_POINT_ADDRESS_0_7_0,
        data: '0x1234abcd',
      })

      analyzer.countUserOperations = mockFn().returns(2)

      const count = await analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle Safe:MultiSendCallOnly1.3.0', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = mockObject<providers.TransactionResponse>({
        to: SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
        data: '0x1234abcd',
      })

      analyzer.countUserOperations = mockFn().returns(2)

      const count = await analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle Safe:Singleton1.3.0', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = mockObject<providers.TransactionResponse>({
        to: EthereumAddress.random(),
        data: `${SAFE_EXEC_TRANSACTION_SELECTOR}1234abcd`,
      })

      analyzer.countUserOperations = mockFn().returns(2)

      const count = await analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle unrecognized tx', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = mockObject<providers.TransactionResponse>({
        to: EthereumAddress.random(),
        data: '0x1234abcd',
      })

      analyzer.countUserOperations = mockFn().returns(2)

      const count = await analyzer.mapTransaction(tx)
      expect(count).toEqual(1)
    })
  })

  describe(RpcUopsAnalyzer.prototype.countUserOperations.name, () => {
    it('should correctly count static operations', () => {
      const analyzer = new RpcUopsAnalyzer()
      const mockMethods: Method[] = [
        { selector: '0x1234abcd', count: () => [{ type: 'static', count: 1 }] },
      ]

      const result = analyzer.countUserOperations('0x1234abcd', mockMethods)
      expect(result).toEqual(1)
    })

    it('should correctly count recursive operations', () => {
      const analyzer = new RpcUopsAnalyzer()
      const mockMethods: Method[] = [
        {
          selector: '0x1234abcd',
          count: () => [
            { type: 'static', count: 1 },
            { type: 'static', count: 1 },
          ],
        },
        {
          selector: '0x5678abcd',
          count: () => [{ type: 'recursive', calldata: '0x1234abcd' }],
        },
      ]

      const result = analyzer.countUserOperations('0x5678abcd', mockMethods)
      expect(result).toEqual(2)
    })

    it('should handle unknown selectors', () => {
      const analyzer = new RpcUopsAnalyzer()
      const mockMethods: Method[] = [
        { selector: '0x1234abcd', count: () => [{ type: 'static', count: 2 }] },
      ]

      const result = analyzer.countUserOperations('0x5678abcd', mockMethods)
      expect(result).toEqual(1)
    })
  })
})
