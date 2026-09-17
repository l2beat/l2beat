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
      const mockBlock: CountedBlock = {
        transactions: [
          {
            details: {} as unknown as CountedOperation,
          } as unknown as CountedTransaction,
          {
            details: {} as unknown as CountedOperation,
          } as unknown as CountedTransaction,
        ],
      } as unknown as CountedBlock

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

      const mockSignatureClient1 = {
        getSignature: vi
          .fn()
          .mockResolvedValueOnce('name2')
          .mockResolvedValueOnce(''),
        getName: vi.fn().mockReturnValue('client1'),
      } as unknown as SignatureClient

      const mockSignatureClient2 = {
        getSignature: vi.fn().mockResolvedValueOnce('name3'),
        getName: vi.fn().mockReturnValue('client2'),
      } as unknown as SignatureClient

      const mockOperation: CountedOperation = {
        methodSelector: 'selector0',
        methodName: 'root',
        children: [
          {
            methodSelector: 'selector1',
            methodName: '',
            children: [],
          } as unknown as CountedOperation,
          {
            methodSelector: 'selector2',
            methodName: '',
            children: [],
          } as unknown as CountedOperation,
          {
            methodSelector: 'selector3',
            methodName: '',
            children: [],
          } as unknown as CountedOperation,
        ],
      } as unknown as CountedOperation

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

      expect(mockDB.METHODS).toEqual(
        new Map([
          ['selector1', 'name1'],
          ['selector2', 'name2'],
          ['selector3', 'name3'],
        ]),
      )

      expect(mockOperation.children[0].methodName).toEqual('name1')
      expect(mockOperation.children[1].methodName).toEqual('name2')
      expect(mockOperation.children[2].methodName).toEqual('name3')
    })
  })

  describe(NameService.prototype.fillContractNames.name, () => {
    it('should fill contract names and save new signatures to DB', async () => {
      const mockDB: DB = {
        METHODS: new Map(),
        CONTRACTS: new Map([['address1', 'name1']]),
        IMPLEMENTATIONS: new Map(),
      }

      const mockContractClient = {
        getName: vi.fn().mockResolvedValueOnce('name2'),
      } as unknown as ContractClient

      const mockOperation: CountedOperation = {
        contractAddress: 'address0',
        contractName: 'root',
        children: [
          {
            contractAddress: 'address1',
            contractName: '',
            children: [],
          } as unknown as CountedOperation,
          {
            contractAddress: 'address2',
            contractName: '',
            children: [],
          } as unknown as CountedOperation,
        ],
      } as unknown as CountedOperation

      const nameService = createNameService(mockDB, [], mockContractClient)

      await nameService.fillContractNames(mockOperation)

      expect(mockContractClient.getName).toHaveBeenCalledWith('address2')

      expect(mockDB.CONTRACTS).toEqual(
        new Map([
          ['address1', 'name1'],
          ['address2', 'name2'],
        ]),
      )

      expect(mockOperation.children[0].contractName).toEqual('name1')
      expect(mockOperation.children[1].contractName).toEqual('name2')
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

      const mockCodeClient = {
        getCodeHash: vi.fn().mockResolvedValueOnce(mockCodeHash),
      } as unknown as RpcCodeClient

      const mockTransaction = {
        type: 'EIP-712',
        from: mockAddress,
      } as unknown as CountedTransaction

      const nameService = createNameService(
        mockDB,
        [],
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
    codeClient ?? ({} as unknown as RpcCodeClient),
    contractClient ?? ({} as unknown as ContractClient),
  )
}
