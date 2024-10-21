import { expect, mockFn, mockObject } from 'earl'
import { RpcClient2 } from '../../clients'
import { BlockProvider } from './BlockProvider'

describe(BlockProvider.name, () => {
  it('returns block', async () => {
    const rpc = mockObject<RpcClient2>({
      getBlockWithTransactions: async () => block(1),
    })
    const provider = new BlockProvider([rpc])

    const result = await provider.getBlockWithTransactions(1)

    expect(rpc.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    expect(result).toEqual(block(1))
  })

  it('calls fallbacks when there are errors', async () => {
    const rpc_one = mockObject<RpcClient2>({
      getBlockWithTransactions: mockFn().rejectsWith(new Error()),
    })
    const rpc_two = mockObject<RpcClient2>({
      getBlockWithTransactions: mockFn().rejectsWith(new Error()),
    })
    const rpc_three = mockObject<RpcClient2>({
      getBlockWithTransactions: async () => block(1),
    })

    const provider = new BlockProvider([rpc_one, rpc_two, rpc_three])

    const result = await provider.getBlockWithTransactions(1)

    expect(rpc_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    expect(rpc_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    expect(rpc_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)

    expect(result).toEqual(block(1))
  })

  it('throws when ran out of fallbacks', async () => {
    const rpc_one = mockObject<RpcClient2>({
      getBlockWithTransactions: mockFn().rejectsWith(new Error()),
    })
    const rpc_two = mockObject<RpcClient2>({
      getBlockWithTransactions: mockFn().rejectsWith(new Error()),
    })
    const rpc_three = mockObject<RpcClient2>({
      getBlockWithTransactions: mockFn().rejectsWith(new Error('ERROR')),
    })

    const provider = new BlockProvider([rpc_one, rpc_two, rpc_three])

    await expect(() => provider.getBlockWithTransactions(1)).toBeRejectedWith(
      'ERROR',
    )

    expect(rpc_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    expect(rpc_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    expect(rpc_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
  })
})

function block(x: number) {
  return {
    number: x,
    transactions: [],
    hash: '0x' + x.toString(),
    timestamp: x * 100,
  }
}
