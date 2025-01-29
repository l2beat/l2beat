import { Logger, getEnv } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { RpcClientPOC } from './modules/tvs/providers/RpcClientPOC'

async function main() {
  const env = getEnv()

  const logger = Logger.WARN
  // add logic here
  const rpc = new RpcClient({
    http: new HttpClient(),
    retryStrategy: 'RELIABLE',
    callsPerMinute: 12000, // * 100 calls inside a batch
    logger: logger,
    url: env.string('ETHEREUM_RPC_URL'),
    sourceName: 'rpc',
  })

  const multicallAddress = EthereumAddress(
    '0xcA11bde05977b3631167028862bE2a173976CA11',
  )
  const rpcPoc = new RpcClientPOC(
    new RpcClient({
      http: new HttpClient(),
      retryStrategy: 'RELIABLE',
      callsPerMinute: 120, // * 100 calls inside a batch
      logger: logger,
      url: env.string('ETHEREUM_RPC_URL'),
      sourceName: 'rpc',
    }),
    multicallAddress,
    logger,
  )

  const erc20Interface = new utils.Interface([
    'function balanceOf(address account) view returns (uint256)',
  ])

  const USDC = EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
  const blockNumber = 21723140

  const promises = []
  for (let i = 0; i < 1_000; i++) {
    promises.push(
      (async () => {
        const address = EthereumAddress.random()
        const balance = await rpc.call(
          {
            to: USDC,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionData('balanceOf', [address]),
            ),
          },
          blockNumber,
        )
        logger.debug(`[${i}] USDC balance for ${address} = ${balance}`)
      })(),
    )
  }

  console.time('SINGLE')
  await Promise.all(promises)
  console.timeEnd('SINGLE')

  const batchPromises = []
  for (let i = 0; i < 1_000; i++) {
    batchPromises.push(
      (async () => {
        const address = EthereumAddress.random()
        const balance = await rpcPoc.callWithBatching(
          {
            to: USDC,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionData('balanceOf', [address]),
            ),
          },
          blockNumber,
        )
        logger.debug(`[${i}] USDC balance for ${address} = ${balance}`)
      })(),
    )
  }

  console.time('BATCHING')
  await Promise.all(batchPromises)
  console.timeEnd('BATCHING')

  const promisesMulticall = []
  for (let i = 0; i < 1_000; i++) {
    promisesMulticall.push(
      (async () => {
        const address = EthereumAddress.random()
        const balance = await rpcPoc.callWithMulticall(
          {
            to: USDC,
            data: Bytes.fromHex(
              erc20Interface.encodeFunctionData('balanceOf', [address]),
            ),
          },
          blockNumber,
        )
        logger.debug(`[${i}] USDC balance for ${address} = ${balance}`)
      })(),
    )
  }

  console.time('MULTICALL')
  await Promise.all(promisesMulticall)
  console.timeEnd('MULTICALL')
}

main().catch((e: unknown) => {
  console.error(e)
})
