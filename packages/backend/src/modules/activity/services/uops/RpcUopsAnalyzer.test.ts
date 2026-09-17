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
import { describe, expect, it, vi } from 'vitest'
import { RpcUopsAnalyzer } from './RpcUopsAnalyzer'

describe(RpcUopsAnalyzer.name, () => {
  describe(RpcUopsAnalyzer.prototype.calculateUops.name, () => {
    it('should correctly sum the number of txs and uops', async () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx1 = {} as unknown as Transaction
      const tx2 = {} as unknown as Transaction
      const tx3 = {} as unknown as Transaction

      analyzer.mapTransaction = vi
        .fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(4)

      const block = {
        transactions: [tx1, tx2, tx3],
      } as unknown as Block

      const result = analyzer.calculateUops(block)
      expect(result).toStrictEqual(7)
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

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle ERC-4337:EntryPoint0.7.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: ENTRY_POINT_ADDRESS_0_7_0,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle ERC-4337:EntryPoint0.8.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: ENTRY_POINT_ADDRESS_0_8_0,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle Safe:MultiSendCallOnly1.3.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle Safe:Singleton1.3.0', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: `${SAFE_EXEC_TRANSACTION_SELECTOR}1234abcd`,
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle EIP-712', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: '0x123',
        data: '0x1234abcd',
        hash: '0x0',
        type: EIP712_TX_TYPE,
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle Multicall v3', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: MULTICALL_V3,
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle ERC20Router', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: `${ERC20ROUTER_TRANSACTION_SELECTOR}1234abcd`,
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle EIP-7821', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: `${EIP_7821_TRANSACTION_SELECTOR}1234abcd`,
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(2)
    })

    it('should handle unrecognized tx', () => {
      const analyzer = new RpcUopsAnalyzer()
      const tx = {
        to: EthereumAddress.random(),
        data: '0x1234abcd',
        hash: '0x0',
      }

      analyzer.countUserOperations = vi.fn().mockReturnValue(2)

      const count = analyzer.mapTransaction(tx)
      expect(count).toStrictEqual(1)
    })
  })

  describe(RpcUopsAnalyzer.prototype.countUserOperations.name, () => {
    it('should correctly count static operations', () => {
      const analyzer = new RpcUopsAnalyzer()
      const mockMethods: Method[] = [
        { selector: '0x1234abcd', count: () => [{ type: 'static', count: 1 }] },
      ]

      const result = analyzer.countUserOperations('0x1234abcd', mockMethods)
      expect(result).toStrictEqual(1)
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
      expect(result).toStrictEqual(2)
    })

    it('should handle unknown selectors', () => {
      const analyzer = new RpcUopsAnalyzer()
      const mockMethods: Method[] = [
        { selector: '0x1234abcd', count: () => [{ type: 'static', count: 2 }] },
      ]

      const result = analyzer.countUserOperations('0x5678abcd', mockMethods)
      expect(result).toStrictEqual(1)
    })
  })
})
