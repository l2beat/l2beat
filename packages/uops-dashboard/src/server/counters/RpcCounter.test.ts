import { CountedBlock, CountedOperation, CountedTransaction } from '@/types'
import {
  EIP712_TX_TYPE,
  EIP712_methods,
  ENTRY_POINT_ADDRESS_0_6_0,
  ENTRY_POINT_ADDRESS_0_7_0,
  ERC4337_methods,
  EVMBlock,
  EVMTransaction,
  SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
  SAFE_methods,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { RpcCounter } from './RpcCounter'

describe(RpcCounter.name, () => {
  describe(RpcCounter.prototype.countForBlock.name, () => {
    it('should return block with counted operations', () => {
      const mockBlock: EVMBlock = createBlock(1)

      const expectedResult: CountedBlock = {
        ...mockBlock,
        status: '<unknown>',
        transactions: [
          {
            hash: 'tx1.hash',
            operationsCount: 1,
            type: 'ERC-4337 Entry Point 0.6.0',
            from: 'tx1.from',
          },
          {
            hash: 'tx2.hash',
            operationsCount: 2,
            type: 'ERC-4337 Entry Point 0.6.0',
            from: 'tx1.from',
          },
        ],
      }

      const counter = new RpcCounter()

      counter.mapTransaction = mockFn()
        .returnsOnce(expectedResult.transactions[0])
        .returnsOnce(expectedResult.transactions[1])

      const result = counter.countForBlock(mockBlock)
      expect(result).toEqual(expectedResult)
    })
  })

  describe(RpcCounter.prototype.countForBlocks.name, () => {
    it('should return correct stats', () => {
      const end = UnixTime.now()
      const start = end.add(-1, 'hours')

      const mockBlocks: EVMBlock[] = [
        createBlock(1, start),
        createBlock(2),
        createBlock(3, end),
      ]

      const counter = new RpcCounter()

      const mockSmartAccountUsageForBlock1 = new Map([
        ['execute(address,uint256,bytes)', 2],
      ])

      const mockSmartAccountUsageForBlock2 = new Map([
        ['execute(address,uint256,bytes)', 1],
        ['executeBatch(address[],bytes[])', 1],
      ])

      const mockSmartAccountUsageForBlock3 = new Map([
        ['execute(address,uint256,bytes)', 1],
        ['unknown', 1],
      ])

      counter.generateSmartAccountUsageForBlock = mockFn()
        .returnsOnce(mockSmartAccountUsageForBlock1)
        .returnsOnce(mockSmartAccountUsageForBlock2)
        .returnsOnce(mockSmartAccountUsageForBlock3)

      counter.mapTransaction = mockFn()
        .returnsOnce(createCountedTransaction(2, false))
        .returnsOnce(createCountedTransaction(1, false))
        .returnsOnce(createCountedTransaction(3, true))
        .returnsOnce(createCountedTransaction(3, false))
        .returnsOnce(createCountedTransaction(1, true))
        .returnsOnce(createCountedTransaction(1, false))

      const result = counter.countForBlocks(mockBlocks)
      expect(result).toEqual({
        dateStart: start.toDate(),
        dateEnd: end.toDate(),
        numberOfTransactions: 6,
        numberOfOperations: 11,
        topBlocks: [
          {
            number: 3,
            ratio: 1,
            includesBatch: true,
            includesUnknown: true,
          },
          {
            number: 2,
            ratio: 3,
            includesBatch: true,
            includesUnknown: false,
          },
          {
            number: 1,
            ratio: 1.5,
            includesBatch: false,
            includesUnknown: false,
          },
        ],
        smartAccountUsage: [
          { signature: 'execute(address,uint256,bytes)', count: 4 },
          { signature: 'executeBatch(address[],bytes[])', count: 1 },
          { signature: 'unknown', count: 1 },
        ],
      })
    })
  })

  describe(RpcCounter.prototype.mapTransaction.name, () => {
    it('should return unknown for unrecognized txs', () => {
      const counter = new RpcCounter()

      const result = counter.mapTransaction({
        from: 'tx.from',
        to: 'tx.to',
        hash: 'tx.hash',
        data: 'tx.data',
        type: 0,
      })

      expect(result).toEqual({
        from: 'tx.from',
        type: 'Legacy',
        hash: 'tx.hash',
        operationsCount: 1,
        includesBatch: false,
      })
    })

    it('should map ERC-4337 txs', () => {
      const counter = new RpcCounter()

      const mockOperation = {
        id: 'id',
        level: 0,
        methodSelector: '0x123',
        count: 1,
        children: [],
      } as CountedOperation

      counter.countUserOperations = mockFn().returns(mockOperation)

      counter.checkOperations = mockFn().returns({
        includesBatch: false,
        includesUnknown: false,
      })

      const result = counter.mapTransaction({
        from: 'tx.from',
        to: ENTRY_POINT_ADDRESS_0_6_0,
        hash: 'tx.hash',
        data: 'tx.data',
        type: 2,
      })

      expect(result).toEqual({
        from: 'tx.from',
        type: 'ERC-4337 Entry Point 0.6.0',
        hash: 'tx.hash',
        operationsCount: 1,
        includesBatch: false,
        includesUnknown: false,
        details: mockOperation,
      })
    })

    it('should map GnosisSafe txs', () => {
      const counter = new RpcCounter()

      const mockOperation = {
        id: 'id',
        level: 0,
        methodSelector: '0x123',
        count: 1,
        children: [],
      } as CountedOperation

      counter.countUserOperations = mockFn().returns(mockOperation)

      counter.checkOperations = mockFn().returns({
        includesBatch: false,
        includesUnknown: false,
      })

      const result = counter.mapTransaction({
        from: 'tx.from',
        to: SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
        hash: 'tx.hash',
        data: 'tx.data',
        type: 2,
      })

      expect(result).toEqual({
        from: 'tx.from',
        type: 'Safe: Multi Send Call Only 1.3.0',
        hash: 'tx.hash',
        operationsCount: 1,
        includesBatch: false,
        includesUnknown: false,
        details: mockOperation,
      })
    })

    it('should map EIP-712 txs', () => {
      const counter = new RpcCounter()

      const mockOperation = {
        id: 'id',
        level: 0,
        methodSelector: '0x123',
        count: 1,
        children: [],
      } as CountedOperation

      counter.countUserOperations = mockFn().returns(mockOperation)

      counter.checkOperations = mockFn().returns({
        includesBatch: false,
        includesUnknown: false,
      })

      const result = counter.mapTransaction({
        from: 'tx.from',
        to: 'tx.to',
        hash: 'tx.hash',
        data: 'tx.data',
        type: EIP712_TX_TYPE,
      })

      expect(result).toEqual({
        from: 'tx.from',
        type: 'EIP-712',
        hash: 'tx.hash',
        operationsCount: 1,
        includesBatch: false,
        includesUnknown: false,
        details: mockOperation,
      })
    })
  })

  describe(RpcCounter.prototype.countUserOperations.name, () => {
    it('should count ERC-4337 user operations', () => {
      const calldata =
        '0x1fad948c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000065061d355ae0359ec801e047e40c76051833e78c00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000066000000000000000000000000005f123aaf77f2f128c26d026ba9725ce7f6c74fe0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000024e1000000000000000000000000000000000000000000000000000000000000115520000000000000000000000000000000000000000000000000000000000014b450000000000000000000000000000000000000000000000000000000000e6d2240000000000000000000000000000000000000000000000000000000000142440000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000005a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000344b61d27f60000000000000000000000009978c826d93883701522d2ca645d5436e56542520000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000002a4243a71340000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000010000000000000000000000002b06177b9ccea343be4f0f6ae0b5cc7fed681fdc000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000041a32c378a1a8f266665ad7b551a58251763ca77d16b8fd3683c4904cee876b3fc7910f808fb9423237c2a70a9a66854e4b24299f63fbf8264a02c235852c914991b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000194c696e6b20796f75722065787465726e616c2077616c6c657400000000000000000000000000000000000000f4629b4128efb49b8548765df26b02d74571259d000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000004104c29cde93788ba82029674026b4742251e0fa1fd6d8f03dd93e1b3fe184d3104b20f2d140f938d665fd4b7f55f9c64f5a9b48e5da2fce769a7ce51da3ce10521c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000194c696e6b20796f75722065787465726e616c2077616c6c657400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000754fd9098af9ddcb41da48a1d78f91f1398965addc000000000000000067174d1400000000000000000000000000000000000000007d18a21979f3521e81632e428bf49754a75c5b0de8e6b1679139c10dac66d771018232f04dc96ff141cd1788038da6246f5c1ee8fbcb6933875ed8db52f5df021b00000000000000000000000000000000000000000000000000000000000000000000000000000000000041bafa7be880f56b53bb842cdd4cd38940fd698e939a2df2950ba1203bc48ca4da5fc951702196272b899424defe6cd1ad6288e1f910477f6e0cf38b7a3fd053781c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000713030a35fc8caf90ad1f0982629610b7d9d0da50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000002c143000000000000000000000000000000000000000000000000000000000006c52c00000000000000000000000000000000000000000000000000000000000137d40000000000000000000000000000000000000000000000000000000000e6d2240000000000000000000000000000000000000000000000000000000000142440000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000000000000000000000000000000000000000000589406cc6185a346906296840746125a0e449764545fbfb9cf00000000000000000000000024272187a424d084b5e086f7e2f6f935f216ad06000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000204b61d27f60000000000000000000000009978c826d93883701522d2ca645d5436e56542520000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001642f4614530000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024272187a424d084b5e086f7e2f6f935f216ad06000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000041699bd04ff2656283df89442ff4a5f38db0c9a8959a0ad788d9d7bc1319966ffc50d4d5eae58c4e3e2c1dd3eb8216eccd58a8d85fa6be2462e02fb2bc4425c3701c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000194c696e6b20796f75722065787465726e616c2077616c6c657400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000754fd9098af9ddcb41da48a1d78f91f1398965addc000000000000000067174d150000000000000000000000000000000000000000016356d2d7da8d4179da8fc82ddb5cdcf089079afa0950da7e201c39affbff6b697974599ceffc0b3ea5b07140b97606063263f48648606e0d405539bffe220a1b0000000000000000000000000000000000000000000000000000000000000000000000000000000000004151028a9a6ccf83b3a013cdde031532c58d186d4737344fbc4ad54bde759c210707c561fb8938809ad529fb66ce6e13d01808ddd945f6ec710d78782692faaacf1b00000000000000000000000000000000000000000000000000000000000000'

      const expectedResult: CountedOperation = {
        children: [
          {
            children: [
              {
                children: [],
                contractAddress: '0x9978c826d93883701522d2CA645d5436e5654252',
                count: 1,
                id: 'id',
                level: 2,
                methodSelector: '0x243a7134',
              },
            ],
            contractAddress: '0x05f123AaF77F2F128C26D026Ba9725cE7f6c74fE',
            contractName: 'SmartAccount',
            count: 1,
            id: 'id',
            level: 1,
            methodName: 'execute',
            methodSelector: '0xb61d27f6',
            methodSignature: 'execute(address,uint256,bytes)',
          },
          {
            children: [],
            count: 1,
            id: 'id',
            level: 1,
            methodName: 'contract_deployment',
            methodSelector: '',
          },
          {
            children: [
              {
                children: [],
                contractAddress: '0x9978c826d93883701522d2CA645d5436e5654252',
                count: 1,
                id: 'id',
                level: 2,
                methodSelector: '0x2f461453',
              },
            ],
            contractAddress: '0x713030a35FC8cAf90ad1F0982629610B7D9D0da5',
            contractName: 'SmartAccount',
            count: 1,
            id: 'id',
            level: 1,
            methodName: 'execute',
            methodSelector: '0xb61d27f6',
            methodSignature: 'execute(address,uint256,bytes)',
          },
        ],
        contractAddress: '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789',
        contractName: 'ERC-4337:EntryPoint0.6.0',
        count: 3,
        id: 'id',
        level: 0,
        methodName: 'handleOps',
        methodSelector: '0x1fad948c',
        methodSignature:
          'handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)',
      }

      const counter = new RpcCounter()

      const result = counter.countUserOperations(
        calldata,
        ENTRY_POINT_ADDRESS_0_6_0,
        ERC4337_methods,
        () => 'id',
      )

      expect(result).toEqual(expectedResult)
    })

    it('should count GnosisSafe user operations', () => {
      const calldata =
        '0x8d80ff0a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000b0400feef177e6168f9b7fd59e6c5b6c2d87ff398c6fd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002246a7612020000000000000000000000007d7c1f5b9a4cbf87d8163bf6be7cc7d661c0f8b500000000000000000000000000000000000000000000000154bd8a0a38bc90000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082f73b5ee4cac89faecb44cfb228532b0085fe0ab12ec2b2261467c3ee1af5d3dc0febd7f984e6d77df1a9edb318416eddac9f2ff09f89e7ec1f71d11666bed40c1bc5726017e5bceff5e9152553a873a1db65c5ec3ae7041f659a491b6ec82ac0b5616ff52463ee69a7202a3cd1c433f293f97ca4935df2bf212436d9d462718e741f00000000000000000000000000000000000000000000000000000000000000feef177e6168f9b7fd59e6c5b6c2d87ff398c6fd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002846a7612020000000000000000000000009d65ff81a3c488d585bbfb0bfe3c7707c7917f540000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000007d7c1f5b9a4cbf87d8163bf6be7cc7d661c0f8b500000000000000000000000000000000000000000000001adeb80302ffd3e80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008238f953fc670a56f8bf686b41fc7b8d3c0443ee63e455e9da0ec144e3cb50d5a64c3ca7f9fa34e48f5e0cdd7210c0bcaaa9644547c6664c1f1dad862b140314891b6d2563f888e2623fd484fd6b88ad96649a71f5b02b8ca8a99d7c3dd6565ddf2a72b7a81b69b6afbee10058f73adc04424f87459760702ad904acee6b549985d91c00000000000000000000000000000000000000000000000000000000000000feef177e6168f9b7fd59e6c5b6c2d87ff398c6fd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002846a761202000000000000000000000000ec53bf9167f50cdeb3ae105f56099aaab9061f830000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000007d7c1f5b9a4cbf87d8163bf6be7cc7d661c0f8b50000000000000000000000000000000000000000000002b8e45fe63984e3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008212b2bafc025de0c768b5723398964e92f2a28a71bdd76791503b8a610638e1ad461ff71c669afbe29038074e5a6390d470fb92ea5a4992275ea11ccd1dd765af1ca343555eee4e04b5aff358be5e95d15b5115e442eafd16f6afb8c9073585463a381ca544963132d7c356c497ad2767e4c8cc3fa1438ea7246e6b4ef0cfc7f7a71c00000000000000000000000000000000000000000000000000000000000000feef177e6168f9b7fd59e6c5b6c2d87ff398c6fd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002846a7612020000000000000000000000004d1c297d39c5c1277964d0e3f8aa9014936645300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000007d7c1f5b9a4cbf87d8163bf6be7cc7d661c0f8b500000000000000000000000000000000000000000000316ec0e8772bac1c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082730f3dbed92a15d268de3d67b58833861ca921ef334d6b86a931e781aa3b474f272d6384f9e1f7be00163b07b345d1310e6fb1c0b620a77e324382d37bf504241bef32029e336da6c480b963edd0734b1dc259d84740c2b64a73a9d0e04657b79506b9c9d603cd9cb90161d459be81966e447e37cb5c680ae3e6fea8e0a8c655a91c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

      const expectedResult: CountedOperation = {
        children: [
          {
            children: [
              {
                children: [],
                contractAddress: '0x7d7C1F5B9A4cbf87D8163bf6Be7cC7D661C0f8B5',
                count: 1,
                id: 'id',
                level: 2,
                methodSelector: '0x',
              },
            ],
            contractAddress: '0xfeef177E6168F9b7fd59e6C5b6c2d87FF398c6FD',
            contractName: 'Safe:Singleton1.3.0',
            count: 1,
            id: 'id',
            level: 1,
            methodName: 'execTransaction',
            methodSelector: '0x6a761202',
            methodSignature:
              'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)',
          },
          {
            children: [
              {
                children: [],
                contractAddress: '0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54',
                count: 1,
                id: 'id',
                level: 2,
                methodSelector: '0xa9059cbb',
              },
            ],
            contractAddress: '0xfeef177E6168F9b7fd59e6C5b6c2d87FF398c6FD',
            contractName: 'Safe:Singleton1.3.0',
            count: 1,
            id: 'id',
            level: 1,
            methodName: 'execTransaction',
            methodSelector: '0x6a761202',
            methodSignature:
              'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)',
          },
          {
            children: [
              {
                children: [],
                contractAddress: '0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83',
                count: 1,
                id: 'id',
                level: 2,
                methodSelector: '0xa9059cbb',
              },
            ],
            contractAddress: '0xfeef177E6168F9b7fd59e6C5b6c2d87FF398c6FD',
            contractName: 'Safe:Singleton1.3.0',
            count: 1,
            id: 'id',
            level: 1,
            methodName: 'execTransaction',
            methodSelector: '0x6a761202',
            methodSignature:
              'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)',
          },
          {
            children: [
              {
                children: [],
                contractAddress: '0x4d1C297d39C5c1277964D0E3f8Aa901493664530',
                count: 1,
                id: 'id',
                level: 2,
                methodSelector: '0xa9059cbb',
              },
            ],
            contractAddress: '0xfeef177E6168F9b7fd59e6C5b6c2d87FF398c6FD',
            contractName: 'Safe:Singleton1.3.0',
            count: 1,
            id: 'id',
            level: 1,
            methodName: 'execTransaction',
            methodSelector: '0x6a761202',
            methodSignature:
              'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)',
          },
        ],
        contractAddress: '0x40a2accbd92bca938b02010e17a5b8929b49130d',
        contractName: 'Safe:MultiSendCallOnly1.3.0',
        count: 4,
        id: 'id',
        level: 0,
        methodName: 'multiSend',
        methodSelector: '0x8d80ff0a',
        methodSignature: 'multiSend(bytes)',
      }

      const counter = new RpcCounter()

      const result = counter.countUserOperations(
        calldata,
        SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
        SAFE_methods,
        () => 'id',
      )

      expect(result).toEqual(expectedResult)
    })

    it('should count GnosisSafe user operations', () => {
      const calldata =
        '0x8f0273a900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001200000000000000000000000009248f1ee8cbd029f3d22a92eb270333a39846fb200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000242e1a7d4d00000000000000000000000000000000000000000000003635c9adc5dea00000000000000000000000000000000000000000000000000000000000000000000000000000000000009248f1ee8cbd029f3d22a92eb270333a39846fb200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000043d18b91200000000000000000000000000000000000000000000000000000000'

      const expectedResult: CountedOperation = {
        contractAddress: 'tx.to',
        contractName: 'ClaveSmartWallet',
        count: 2,
        id: 'id',
        level: 0,
        methodName: 'batchCall',
        methodSelector: '0x8f0273a9',
        methodSignature: 'batchCall((address,bool,uint256,bytes)[])',
        children: [
          {
            children: [],
            contractAddress: '0x9248F1Ee8cBD029F3D22A92EB270333a39846fB2',
            count: 1,
            id: 'id',
            level: 1,
            methodSelector: '0x2e1a7d4d',
          },
          {
            children: [],
            contractAddress: '0x9248F1Ee8cBD029F3D22A92EB270333a39846fB2',
            count: 1,
            id: 'id',
            level: 1,
            methodSelector: '0x3d18b912',
          },
        ],
      }

      const counter = new RpcCounter()

      const result = counter.countUserOperations(
        calldata,
        'tx.to',
        EIP712_methods,
        () => 'id',
      )

      expect(result).toEqual(expectedResult)
    })
  })

  describe(RpcCounter.prototype.checkOperations.name, () => {
    it('should find batch operation for ERC-4337', () => {
      const mockCountedOperation = mockObject<CountedOperation>({
        level: 0,
        contractAddress: ENTRY_POINT_ADDRESS_0_6_0,
        children: [
          mockObject<CountedOperation>({
            id: 'id',
            level: 1,
            contractAddress: 'address',
            methodName: 'execute',
            methodSignature: 'executeBatch(address[],bytes[])',
            children: [
              mockObject<CountedOperation>({
                level: 2,
                contractAddress: 'address',
                methodName: 'unknown',
                methodSignature: undefined,
                children: [],
              }),
              mockObject<CountedOperation>({
                level: 2,
                contractAddress: 'address',
                methodName: 'unknown',
                methodSignature: undefined,
                children: [],
              }),
            ],
          }),
        ],
      })

      const mockTx = mockObject<EVMTransaction>({
        type: 2,
      })

      const counter = new RpcCounter()

      const result = counter.checkOperations(mockCountedOperation, mockTx)
      expect(result).toEqual({
        includesBatch: true,
        includesUnknown: false,
      })
    })

    it('should find batch operation for EIP-712', () => {
      const mockCountedOperation = mockObject<CountedOperation>({
        level: 0,
        id: 'id',
        contractAddress: 'address',
        children: [
          mockObject<CountedOperation>({
            id: 'id',
            level: 1,
            contractAddress: 'address',
            children: [],
          }),
          mockObject<CountedOperation>({
            id: 'id',
            level: 1,
            contractAddress: 'address',
            children: [],
          }),
        ],
      })

      const mockTx = mockObject<EVMTransaction>({
        type: EIP712_TX_TYPE,
      })

      const counter = new RpcCounter()

      const result = counter.checkOperations(mockCountedOperation, mockTx)
      expect(result).toEqual({
        includesBatch: true,
        includesUnknown: false,
      })
    })

    it('should find unknown operation', () => {
      const mockCountedOperation = mockObject<CountedOperation>({
        id: 'id',
        level: 0,
        contractAddress: ENTRY_POINT_ADDRESS_0_6_0,
        children: [
          mockObject<CountedOperation>({
            level: 1,
            contractAddress: 'address',
            methodName: 'unknown',
            methodSignature: undefined,
            children: [],
          }),
        ],
      })

      const mockTx = mockObject<EVMTransaction>({
        type: 2,
      })

      const counter = new RpcCounter()

      const result = counter.checkOperations(mockCountedOperation, mockTx)
      expect(result).toEqual({
        includesBatch: false,
        includesUnknown: true,
      })
    })
  })

  describe(RpcCounter.prototype.generateSmartAccountUsageForBlock.name, () => {
    it('should generate usage for block', () => {
      const mockCountedBlock = mockObject<CountedBlock>({
        transactions: [
          mockObject<CountedTransaction>({
            details: mockObject<CountedOperation>({
              contractAddress: ENTRY_POINT_ADDRESS_0_6_0,
              children: [
                mockObject<CountedOperation>({
                  contractAddress: 'address',
                  methodName: 'execute',
                  methodSignature: 'execute(address,uint256,bytes)',
                  children: [],
                }),
              ],
            }),
          }),
          mockObject<CountedTransaction>({
            details: mockObject<CountedOperation>({
              contractAddress: ENTRY_POINT_ADDRESS_0_7_0,
              children: [
                mockObject<CountedOperation>({
                  contractAddress: 'address',
                  methodName: 'execute',
                  methodSignature: 'execute(address,uint256,bytes)',
                  children: [],
                }),
              ],
            }),
          }),
          mockObject<CountedTransaction>({
            details: mockObject<CountedOperation>({
              contractAddress: ENTRY_POINT_ADDRESS_0_6_0,
              children: [
                mockObject<CountedOperation>({
                  contractAddress: 'address',
                  methodName: 'execute',
                  methodSignature: 'unknown',
                  children: [],
                }),
              ],
            }),
          }),
        ],
      })

      const counter = new RpcCounter()

      const result = counter.generateSmartAccountUsageForBlock(mockCountedBlock)
      expect(result).toEqual(
        new Map([
          ['execute(address,uint256,bytes)', 2],
          ['unknown', 1],
        ]),
      )
    })
  })
})

function createBlock(number: number, timestamp?: UnixTime): EVMBlock {
  return {
    number,
    timestamp: timestamp?.toNumber() ?? UnixTime.now().toNumber(),
    hash: `${number}.hash`,
    transactions: [
      {
        from: 'tx1.from',
        to: 'tx1.to',
        hash: 'tx1.hash',
        data: 'tx1.data',
        type: 2,
      },
      {
        from: 'tx2.from',
        to: 'tx2.to',
        hash: 'tx2.hash',
        data: 'tx2.data',
        type: 2,
      },
    ],
  }
}

function createCountedTransaction(
  operationsCount: number,
  includesBatch: boolean = false,
): CountedTransaction {
  return {
    hash: 'tx.hash',
    operationsCount,
    type: 'ERC-4337 Entry Point 0.6.0',
    includesBatch,
    from: 'tx.from',
  }
}
