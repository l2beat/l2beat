import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type {
  CountedBlock,
  CountedOperation,
  CountedTransaction,
} from '@/types'
import type { RpcCodeClient } from '../clients/code/RpcCodeClient'
import type { ContractClient } from '../clients/contract/ContractClient'
import type { SignatureClient } from '../clients/signature/SignatureClient'
import type { DB } from '../db/db'
import { NameService } from './NameService'

describe(NameService.name, () => {
  describe(NameService.prototype.fillNames.name, () => {
    it('should fill method and contract names', async () => {
      const mockBlock: CountedBlock = mockObject<CountedBlock>({
        transactions: [
          mockObject<CountedTransaction>({
            details: mockObject<CountedOperation>(),
          }),
          mockObject<CountedTransaction>({
            details: mockObject<CountedOperation>(),
          }),
        ],
      })

      const nameService = createNameService()

      const fillMethodNamesMock = vi
        .fn<(operation: CountedOperation) => Promise<void>>()
        .mockResolvedValue()
      nameService.fillMethodNames = fillMethodNamesMock

      const fillContractNamesMock = vi
        .fn<(operation: CountedOperation) => Promise<void>>()
        .mockResolvedValue()
      nameService.fillContractNames = fillContractNamesMock

      const fillImplementationNameMock = vi
        .fn<(tx: CountedTransaction) => Promise<void>>()
        .mockResolvedValue()
      nameService.fillImplementationName = fillImplementationNameMock

      await nameService.fillNames(mockBlock)
      expect(fillContractNamesMock).toHaveBeenCalledTimes(2)
      expect(fillMethodNamesMock).toHaveBeenCalledTimes(2)
      expect(fillImplementationNameMock).toHaveBeenCalledTimes(2)
    })
  })

  describe(NameService.prototype.fillMethodNames.name, () => {
    it('should fill method names and save new signatures to DB', async () => {
      const mockDB: DB = {
        METHODS: new Map([['selector1', 'name1']]),
        CONTRACTS: new Map(),
        IMPLEMENTATIONS: new Map(),
      }

      const mockSignatureClient1 = mockObject<SignatureClient>({
        getSignature: vi
          .fn()
          .mockResolvedValueOnce('name2')
          .mockResolvedValueOnce(''),
        getName: vi.fn().mockReturnValue('client1'),
      })

      const mockSignatureClient2 = mockObject<SignatureClient>({
        getSignature: vi.fn().mockResolvedValueOnce('name3'),
        getName: vi.fn().mockReturnValue('client2'),
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

      const nameService = createNameService(mockDB, [
        mockSignatureClient1,
        mockSignatureClient2,
      ])

      await nameService.fillMethodNames(mockOperation)

      expect(mockSignatureClient1.getSignature).toHaveBeenCalledWith(
        'selector2',
      )

      expect(mockSignatureClient2.getSignature).toHaveBeenCalledWith(
        'selector3',
      )

      expect(mockDB.METHODS).toStrictEqual(
        new Map([
          ['selector1', 'name1'],
          ['selector2', 'name2'],
          ['selector3', 'name3'],
        ]),
      )

      expect(mockOperation.children[0].methodName).toStrictEqual('name1')
      expect(mockOperation.children[1].methodName).toStrictEqual('name2')
      expect(mockOperation.children[2].methodName).toStrictEqual('name3')
    })
  })

  describe(NameService.prototype.fillContractNames.name, () => {
    it('should fill contract names and save new signatures to DB', async () => {
      const mockDB: DB = {
        METHODS: new Map(),
        CONTRACTS: new Map([['address1', 'name1']]),
        IMPLEMENTATIONS: new Map(),
      }

      const mockContractClient = mockObject<ContractClient>({
        getName: vi.fn().mockResolvedValueOnce('name2'),
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

      const nameService = createNameService(mockDB, [], mockContractClient)

      await nameService.fillContractNames(mockOperation)

      expect(mockContractClient.getName).toHaveBeenCalledWith('address2')

      expect(mockDB.CONTRACTS).toStrictEqual(
        new Map([
          ['address1', 'name1'],
          ['address2', 'name2'],
        ]),
      )

      expect(mockOperation.children[0].contractName).toStrictEqual('name1')
      expect(mockOperation.children[1].contractName).toStrictEqual('name2')
    })
  })

  describe(NameService.prototype.fillImplementationName.name, () => {
    it('should fill contract names and save new signatures to DB', async () => {
      const mockImplementationName = 'name1'
      const mockCodeHash = 'codeHash1'
      const mockAddress = 'address1'

      const mockDB: DB = {
        METHODS: new Map(),
        CONTRACTS: new Map(),
        IMPLEMENTATIONS: new Map([[mockCodeHash, mockImplementationName]]),
      }

      const mockCodeClient = mockObject<RpcCodeClient>({
        getCodeHash: vi.fn().mockResolvedValueOnce(mockCodeHash),
      })

      const mockTransaction = mockObject<CountedTransaction>({
        type: 'EIP-712',
        from: mockAddress,
      })

      const nameService = createNameService(
        mockDB,
        [],
        undefined,
        mockCodeClient,
      )

      await nameService.fillImplementationName(mockTransaction)

      expect(mockCodeClient.getCodeHash).toHaveBeenCalledWith(mockAddress)

      expect(mockTransaction.type).toStrictEqual(
        `EIP-712 (${mockImplementationName})`,
      )
    })
  })
})

function createNameService(
  db?: DB,
  signatureClients?: SignatureClient[],
  contractClient?: ContractClient,
  codeClient?: RpcCodeClient,
) {
  return new NameService(
    db ?? {
      METHODS: new Map(),
      CONTRACTS: new Map(),
      IMPLEMENTATIONS: new Map(),
    },
    signatureClients ?? [],
    codeClient ?? mockObject<RpcCodeClient>(),
    contractClient ?? mockObject<ContractClient>(),
  )
}
