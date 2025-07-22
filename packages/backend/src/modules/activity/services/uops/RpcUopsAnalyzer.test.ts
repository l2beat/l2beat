import {
  EIP_7821_TRANSACTION_SELECTOR,
  EIP712_TX_TYPE,
  ENTRY_POINT_ADDRESS_0_6_0,
  ENTRY_POINT_ADDRESS_0_7_0,
  ENTRY_POINT_ADDRESS_0_8_0,
  ERC20ROUTER_TRANSACTION_SELECTOR,
  type Method,
  MULTICALL_V3,
  SAFE_EXEC_TRANSACTION_SELECTOR,
  SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
} from '@l2beat/shared/uops'
import {
  type Block,
  EthereumAddress,
  type Transaction,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { RpcUopsAnalyzer } from './RpcUopsAnalyzer'

describe(RpcUopsAnalyzer.name, () => {
  describe(RpcUopsAnalyzer.prototype.calculateUops.name, () => {
    it('should correctly sum the number of txs and uops', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx1 = mockObject<Transaction>()
      const tx2 = mockObject<Transaction>()
      const tx3 = mockObject<Transaction>()

      analyzer.mapTransaction = mockFn()
        .returnsOnce(1)
        .returnsOnce(2)
        .returnsOnce(4)

      const block = mockObject<Block>({
        transactions: [tx1, tx2, tx3],
      })

      const result = analyzer.calculateUops(block)
      expect(result).toEqual(7)
    })
  })

  describe(RpcUopsAnalyzer.prototype.mapTransaction.name, () => {
    it('should handle ERC-4337:EntryPoint0.6.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: ENTRY_POINT_ADDRESS_0_6_0,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle ERC-4337:EntryPoint0.7.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: ENTRY_POINT_ADDRESS_0_7_0,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle ERC-4337:EntryPoint0.8.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: ENTRY_POINT_ADDRESS_0_8_0,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle Safe:MultiSendCallOnly1.3.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle Safe:Singleton1.3.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: `${SAFE_EXEC_TRANSACTION_SELECTOR}1234abcd`,
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle EIP-712', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: '0x123',
        data: '0x1234abcd',
        hash: '0x0',
        type: EIP712_TX_TYPE,
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle Multicall v3', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: MULTICALL_V3,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle ERC20Router', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: `${ERC20ROUTER_TRANSACTION_SELECTOR}1234abcd`,
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle EIP-7821', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: `${EIP_7821_TRANSACTION_SELECTOR}1234abcd`,
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toEqual(2)
    })

    it('should handle unrecognized tx', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = mockFn().returns(2)

      const count = analyzer.mapTransaction(tx)
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
