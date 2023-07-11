import { Bytes, ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { EthereumClient } from '../../ethereum/EthereumClient'
import { ArbitrumMulticallClient } from './ArbitrumMulticall'
import { MulticallEncoder, MulticallRequest } from './interfaces'
import {
  arbitrumMulticallEncoder,
  arbitrumMulticallInterface,
} from './MulticallEncoder'

describe(ArbitrumMulticallClient.name, () => {
  const ADDRESS_A = EthereumAddress('0x' + 'a'.repeat(40))
  const ADDRESS_B = EthereumAddress('0x' + 'b'.repeat(40))

  it('throws an error when called for block numbers before multicall deployment block', async () => {
    const multicallAddress = EthereumAddress.random()
    const deploymentBlockNumber = 10000
    const callBlockNumber = deploymentBlockNumber - 1
    const maxBatchSize = 100

    const arbitrumClient = mockObject<EthereumClient>({})
    const encoder = mockObject<MulticallEncoder>({})

    const multicallClient = new ArbitrumMulticallClient(
      arbitrumClient,
      encoder,
      multicallAddress,
      deploymentBlockNumber,
      maxBatchSize,
    )

    const calls: MulticallRequest[] = [
      {
        address: ADDRESS_A,
        data: Bytes.fromHex('0x123456'),
      },
      {
        address: ADDRESS_B,
        data: Bytes.fromHex('0x7eedbeef'),
      },
    ]

    await expect(async () =>
      multicallClient.multicall(calls, callBlockNumber),
    ).toBeRejectedWith(
      `Arbitrum multicall is not available for given block number: ${callBlockNumber}`,
    )
  })

  it('returns true if multicall can be used for block number after the multicall deployment block', async () => {
    const multicallAddress = EthereumAddress.random()
    const deploymentBlockNumber = 10000
    const maxBatchSize = 100

    const arbitrumClient = mockObject<EthereumClient>({})
    const encoder = mockObject<MulticallEncoder>({})

    const multicallClient = new ArbitrumMulticallClient(
      arbitrumClient,
      encoder,
      multicallAddress,
      deploymentBlockNumber,
      maxBatchSize,
    )

    expect(multicallClient.canBeUsed(deploymentBlockNumber + 1)).toEqual(true)
  })

  it('returns false if multicall cannot be used for block number before the multicall deployment block', async () => {
    const multicallAddress = EthereumAddress.random()
    const deploymentBlockNumber = 10000
    const maxBatchSize = 100

    const arbitrumClient = mockObject<EthereumClient>({})
    const encoder = mockObject<MulticallEncoder>({})

    const multicallClient = new ArbitrumMulticallClient(
      arbitrumClient,
      encoder,
      multicallAddress,
      deploymentBlockNumber,
      maxBatchSize,
    )

    expect(multicallClient.canBeUsed(deploymentBlockNumber - 1)).toEqual(false)
  })

  it('obtains provided multicall address', async () => {
    const multicallAddress = EthereumAddress.random()
    const deploymentBlockNumber = 10000
    const maxBatchSize = 100

    const arbitrumClient = mockObject<EthereumClient>({})
    const encoder = mockObject<MulticallEncoder>({})

    const multicallClient = new ArbitrumMulticallClient(
      arbitrumClient,
      encoder,
      multicallAddress,
      deploymentBlockNumber,
      maxBatchSize,
    )

    expect(multicallClient.getAddress()).toEqual(multicallAddress)
  })

  it('obtains multicall chainId', async () => {
    const multicallAddress = EthereumAddress.random()
    const deploymentBlockNumber = 10000
    const maxBatchSize = 100

    const arbitrumClient = mockObject<EthereumClient>({})
    const encoder = mockObject<MulticallEncoder>({})

    const multicallClient = new ArbitrumMulticallClient(
      arbitrumClient,
      encoder,
      multicallAddress,
      deploymentBlockNumber,
      maxBatchSize,
    )

    expect(multicallClient.getChainId()).toEqual(ChainId.ARBITRUM)
  })

  it('batches calls in batches of provided amount', async () => {
    const multicallAddress = EthereumAddress.random()
    const deploymentBlockNumber = 10000
    const maxBatchSize = 2

    const arbitrumClient = mockObject<EthereumClient>({
      call: mockFn(async () =>
        Bytes.fromHex(
          arbitrumMulticallInterface.encodeFunctionResult('tryAggregate', [
            new Array(maxBatchSize).fill(0).map(() => [true, '0x1234']),
          ]),
        ),
      ),
    })

    const encoder = mockObject<MulticallEncoder>({
      encode: mockFn(arbitrumMulticallEncoder.encode),
      decode: mockFn(arbitrumMulticallEncoder.decode),
    })

    const multicallClient = new ArbitrumMulticallClient(
      arbitrumClient,
      encoder,
      multicallAddress,
      deploymentBlockNumber,
      maxBatchSize,
    )

    // Encoded BalanceOf calls (70a08231 selector) for ADDRESS_A
    const calls: MulticallRequest[] = [
      {
        address: ADDRESS_B,
        data: Bytes.fromHex(
          '70a08231000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      },
      {
        address: ADDRESS_B,
        data: Bytes.fromHex(
          '70a08231000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      },
      {
        address: ADDRESS_B,
        data: Bytes.fromHex(
          '70a08231000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      },
    ]

    await multicallClient.multicall(calls, deploymentBlockNumber + 1)

    // 3 / 2 -> 1 r 1 -> 2 calls
    expect(encoder.encode).toHaveBeenCalledTimes(2)
    expect(encoder.decode).toHaveBeenCalledTimes(2)
  })
})
