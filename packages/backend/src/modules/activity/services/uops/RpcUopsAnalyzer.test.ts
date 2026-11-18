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
import { type Block, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { RpcUopsAnalyzer } from './RpcUopsAnalyzer'

describe(RpcUopsAnalyzer.name, () => {
  describe(RpcUopsAnalyzer.prototype.calculateUops.name, () => {
    it('sums the operations of all transactions in the block', () => {
      const analyzer = new RpcUopsAnalyzer()
      const block = mockObject<Block>({
        transactions: [
          {
            to: MULTICALL_V3,
            data: MULTICALL_V3_AGGREGATE3_OF_4_CALLS,
            hash: '0x1',
          },
          { to: EthereumAddress.random(), data: '0x1234abcd', hash: '0x2' },
        ],
      })

      const result = analyzer.calculateUops(block)
      expect(result).toEqual(5)
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

const MULTICALL_V3_AGGREGATE3_OF_4_CALLS =
  '0x82ad56cb0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000005c000000000000000000000000002238bb0085395ae52cd4755456891fc2fd5934d000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000164000000000000000000000000000000000000000000000000000000000075abd795d5418a00000000000000000000000000000000000000000000000000000000673f247b00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001bde3868dd9a2ab4288f72284b1a7420d6390db93b5ccec47035c71fe2a98d556c36c863df0c9100b6268a90312c5c1a6a5c4ef1afcbfcf94abbda594818982909743ccd28307a009623a59bd7aff6de4746256859260d30c054fef4fb300f6f3c000000000000000000000000ab2cbae4c5a66eb7c115392e4d15e2cfc877b9e70000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000d1d4b60718a8f91a5a8d7dae6fa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b5130cc30be369afeac34b61d60ddfdef84b7b6300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000010400000082000000000000000000000000000000000000000000000001a611f1666fe84c6300000000000000000000000000000000000000000000000000000000673f247b000000000000000000000000000000000000000000000000000000000000006018358f517cc6527eabfbaafcdc5ff57de7dbd683cf17a8de7f22900d8db2987300000000000000000000000043349fb50ec2494e285810f3fed2d042015a8f210000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000d1d4b6071778f9195a5a8d7dafb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a770582353b573cbfdcc948751750eeb3ccf23cf000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000104000000820000000000000000000000000000000000000000000000d000db0ce74f1fcf8700000000000000000000000000000000000000000000000000000000673f24af000000000000000000000000000000000000000000000000000000000000006035c86360b9308d16cd50b77c72bf76997a9bf33f671fbc4e692b1bfe96aef7f1000000000000000000000000077495fbdd645b3d667d198fc85f97905c61a4720000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000d161d608a8fa5a8acd9dae6fafb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046ef0071b1e2ff6b42d36e5a177ea43ae5917f4e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000104000000820000000000000000000000000000000000000000000000af8347ea3f83b4000000000000000000000000000000000000000000000000000000000000673f24af0000000000000000000000000000000000000000000000000000000000000060ea078420052ad4433702241a49911a47a9789f6583865544114e0f9b32322427000000000000000000000000cc0c20e3cbcced39dfcad858f68b5330b476f9980000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000d6071778a8f91a8acd7d9dae6fb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
