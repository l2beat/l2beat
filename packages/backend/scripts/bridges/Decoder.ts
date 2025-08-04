import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { Chain } from './chains'
import type { Protocol } from './protocols/protocols'
import type { Asset } from './types/Asset'
import type { Message } from './types/Message'
import { logToViemLog } from './utils/viem'

export class Decoder {
  constructor(
    private readonly protocols: Protocol[],
    private readonly chains: (Chain & { rpc: RpcClient })[],
    private readonly logger: Logger,
  ) {}

  async execute(protocol: string, configs: { chain: string; block: number }[]) {
    const decoder = this.protocols.find((p) => p.name === protocol)?.decoder
    assert(decoder, `${protocol}: Protocol not found`)

    const messages: Message[] = []
    const assets: Asset[] = []

    for (const config of configs) {
      const chain = this.chains.find((c) => c.name === config.chain)
      assert(chain, `${config.chain}: Chain not found`)

      this.logger.info(`Fetching data for ${config.chain} @ ${config.block}`)

      const block = await chain.rpc.getBlockWithTransactions(config.block)
      const logs = await chain.rpc.getLogs(config.block, config.block)
      const logsByTx = groupBy(logs, 'transactionHash')

      this.logger.info(`Running decoder for ${protocol}`)
      for (const transaction of block.transactions) {
        assert(transaction.hash)
        for (const log of logsByTx[transaction.hash] ?? []) {
          assert(transaction.to)
          const decoded = await decoder(
            chain,
            {
              log: logToViemLog(log),
              transactionHash: transaction.hash,
              blockNumber: block.number,
              blockTimestamp: block.timestamp,
              transactionLogs: (logsByTx[transaction.hash] ?? []).map(
                logToViemLog,
              ),
              transactionTo: EthereumAddress(transaction.to),
            },
            chain.rpc,
          )
          if (decoded?.type === 'message') {
            messages.push(decoded)
            this.logger.info(
              `MESSAGE ${decoded.direction} (${decoded.customType})`,
              {
                input: {
                  interface:
                    'DecoderInput ./scripts/bridges/types/DecoderInput.ts',
                  log: logToViemLog(log),
                  transactionHash: transaction.hash,
                  blockNumber: block.number,
                  blockTimestamp: block.timestamp,
                  logs: `Array<${(logsByTx[transaction.hash] ?? []).length}>`,
                },
                output: {
                  interface:
                    'OUTPUT: Message ./scripts/bridges/types/Message.ts',
                  ...decoded,
                },
              },
            )
          }

          if (decoded?.type === 'asset') {
            assets.push(decoded)
            this.logger.info(
              `ASSET ${decoded.direction} (${decoded.customType})`,
              {
                input: {
                  interface:
                    'INPUT: Transaction with logs ./scripts/bridges/types/TransactionWithLogs.ts',
                  hash: transaction.hash,
                  blockNumber: block.number,
                  blockTimestamp: block.timestamp,
                  logs: `Array<${(logsByTx[transaction.hash] ?? []).length}>`,
                },
                output: {
                  interface: 'OUTPUT: Asset ./scripts/bridges/types/Asset.ts',
                  ...decoded,
                },
              },
            )
          }
        }
      }
    }
    return { messages, assets }
  }
}
