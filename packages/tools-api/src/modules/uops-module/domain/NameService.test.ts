import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import type {
  CountedBlock,
  CountedOperation,
  CountedTransaction,
} from '../types'
import type { KnownNames } from './KnownNames'
import {
  type ContractClient,
  NameService,
  type SignatureLookup,
} from './NameService'
import type { CodeClient } from './RpcCodeClient'

describe(NameService.name, () => {
  describe(NameService.prototype.fillNames.name, () => {
    it('names every transaction with details and skips the rest', async () => {
      const knownNames = createKnownNames({
        methods: new Map([['selector1', 'name1']]),
        contracts: new Map([['address1', 'Contract1']]),
        implementations: new Map([['hash1', 'Safe']]),
      })
      const codeClient = mockObject<CodeClient>({
        getCodeHash: mockFn().resolvesTo('hash1'),
      })
      const details: CountedOperation = {
        id: '1',
        level: 0,
        methodSelector: 'selector1',
        contractAddress: 'address1',
        count: 1,
        children: [],
      }
      const named: CountedTransaction = {
        from: '0xabc',
        type: 'EIP-712',
        hash: '0x1',
        operationsCount: 1,
        details,
      }
      const skipped: CountedTransaction = {
        from: '0xdef',
        type: 'EIP-712',
        hash: '0x2',
        operationsCount: 0,
      }
      const laterDetails: CountedOperation = {
        id: '2',
        level: 0,
        methodSelector: 'selector1',
        contractAddress: 'address1',
        count: 1,
        children: [],
      }
      const laterNamed: CountedTransaction = {
        from: '0x123',
        type: 'EIP-712',
        hash: '0x3',
        operationsCount: 1,
        details: laterDetails,
      }
      const block = mockObject<CountedBlock>({
        transactions: [named, skipped, laterNamed],
      })

      const nameService = createNameService(
        knownNames,
        undefined,
        undefined,
        codeClient,
      )
      await nameService.fillNames(block)

      expect(named.type).toEqual('EIP-712 (Safe)')
      expect(details.methodName).toEqual('name1')
      expect(details.contractName).toEqual('Contract1')
      expect(skipped.type).toEqual('EIP-712')
      expect(laterNamed.type).toEqual('EIP-712 (Safe)')
      expect(laterDetails.methodName).toEqual('name1')
      expect(laterDetails.contractName).toEqual('Contract1')
    })
  })

  describe(NameService.prototype.fillMethodNames.name, () => {
    it('should fill method names and remember new ones', async () => {
      const knownNames = createKnownNames({
        methods: new Map([['selector1', 'name1']]),
      })

      const mockSignatureLookup = mockObject<SignatureLookup>({
        lookup: mockFn()
          .resolvesToOnce(['function name2(uint256)', 'function other()'])
          .resolvesToOnce(['function name3(address)']),
      })

      const mockOperation: CountedOperation = mockObject<CountedOperation>({
        methodSelector: 'selector0',
        methodName: 'root',
        children: [
          mockObject<CountedOperation>({
            methodSelector: 'selector1',
            methodName: '',
            children: [],
          }),
          mockObject<CountedOperation>({
            methodSelector: 'selector2',
            methodName: '',
            children: [],
          }),
          mockObject<CountedOperation>({
            methodSelector: 'selector3',
            methodName: '',
            children: [],
          }),
        ],
      })

      const nameService = createNameService(knownNames, mockSignatureLookup)

      await nameService.fillMethodNames(mockOperation)

      expect(mockSignatureLookup.lookup).toHaveBeenCalledTimes(2)
      expect(mockSignatureLookup.lookup).toHaveBeenNthCalledWith(
        1,
        'selector2' as `0x${string}`,
      )
      expect(mockSignatureLookup.lookup).toHaveBeenNthCalledWith(
        2,
        'selector3' as `0x${string}`,
      )

      expect(knownNames.methods).toEqual(
        new Map([
          ['selector1', 'name1'],
          ['selector2', 'name2'],
          ['selector3', 'name3'],
        ]),
      )

      expect(mockOperation.children[0]?.methodName).toEqual('name1')
      expect(mockOperation.children[1]?.methodName).toEqual('name2')
      expect(mockOperation.children[2]?.methodName).toEqual('name3')
    })
  })

  describe(NameService.prototype.fillContractNames.name, () => {
    it('should fill contract names and remember new ones', async () => {
      const knownNames = createKnownNames({
        contracts: new Map([['address1', 'name1']]),
      })

      const mockContractClient = mockObject<ContractClient>({
        getName: mockFn().resolvesToOnce('name2'),
      })

      const mockOperation: CountedOperation = mockObject<CountedOperation>({
        contractAddress: 'address0',
        contractName: 'root',
        children: [
          mockObject<CountedOperation>({
            contractAddress: 'address1',
            contractName: '',
            children: [],
          }),
          mockObject<CountedOperation>({
            contractAddress: 'address2',
            contractName: '',
            children: [],
          }),
        ],
      })

      const nameService = createNameService(
        knownNames,
        undefined,
        mockContractClient,
      )

      await nameService.fillContractNames(mockOperation)

      expect(mockContractClient.getName).toHaveBeenOnlyCalledWith('address2')

      expect(knownNames.contracts).toEqual(
        new Map([
          ['address1', 'name1'],
          ['address2', 'name2'],
        ]),
      )

      expect(mockOperation.children[0]?.contractName).toEqual('name1')
      expect(mockOperation.children[1]?.contractName).toEqual('name2')
    })
  })

  describe(NameService.prototype.fillImplementationName.name, () => {
    it('should name the smart account implementation by its code hash', async () => {
      const mockImplementationName = 'name1'
      const mockCodeHash = 'codeHash1'
      const mockAddress = 'address1'

      const knownNames = createKnownNames({
        implementations: new Map([[mockCodeHash, mockImplementationName]]),
      })

      const mockCodeClient = mockObject<CodeClient>({
        getCodeHash: mockFn().resolvesToOnce(mockCodeHash),
      })

      const mockTransaction = mockObject<CountedTransaction>({
        type: 'EIP-712',
        from: mockAddress,
      })

      const nameService = createNameService(
        knownNames,
        undefined,
        undefined,
        mockCodeClient,
      )

      await nameService.fillImplementationName(mockTransaction)

      expect(mockCodeClient.getCodeHash).toHaveBeenCalledWith(mockAddress)

      expect(mockTransaction.type).toEqual(
        `EIP-712 (${mockImplementationName})`,
      )
    })
  })
})

function createKnownNames(names: Partial<KnownNames>): KnownNames {
  return {
    methods: new Map(),
    contracts: new Map(),
    implementations: new Map(),
    ...names,
  }
}

function createNameService(
  knownNames?: KnownNames,
  signatureLookup?: SignatureLookup,
  contractClient?: ContractClient,
  codeClient?: CodeClient,
) {
  return new NameService(
    knownNames ?? createKnownNames({}),
    signatureLookup ?? mockObject<SignatureLookup>(),
    codeClient ?? mockObject<CodeClient>(),
    contractClient ?? mockObject<ContractClient>(),
    Logger.SILENT,
  )
}
