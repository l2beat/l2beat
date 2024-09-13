import { HttpClient } from '@l2beat/discovery'
import {
  ExplorerConfig,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { CliLogger } from '@l2beat/shared'
import {
  assert,
  EthereumAddress,
  Hash256,
  UnixTime,
  formatAsAsciiTable,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { providers, utils } from 'ethers'

export async function getEvents(
  logger: CliLogger,
  address: EthereumAddress,
  inputTopics: string[],
  rpcUrl: string,
  explorerUrl?: string,
  explorerApiKey?: string,
  explorerType?: string,
) {
  const provider = new providers.JsonRpcBatchProvider(rpcUrl)

  const onlyHashedTopics = inputTopics.every((t) => Hash256.check(t))
  const topics = []
  if (!onlyHashedTopics) {
    logger.logLine(
      'Some of the topics you provided are not hashes, trying to match them to the ABI',
    )
    assert(explorerUrl !== undefined)
    assert(
      explorerType !== 'etherscan' || explorerType !== undefined,
      'When using etherscan you should provide the API key using --api-key.',
    )

    const httpClient = new HttpClient()
    const client = getExplorerClient(httpClient, {
      type: explorerType as ExplorerConfig['type'],
      url: explorerUrl,
      apiKey: explorerApiKey ?? 'YourApiKeyToken',
    })

    logger.logLine('Fetching sources...')
    const source = await client.getContractSource(address)
    const iface = new utils.Interface(source.abi)
    for (const topic of inputTopics) {
      if (Hash256.check(topic)) {
        topics.push(topic)
        break
      }

      try {
        topics.push(iface.getEventTopic(topic))
      } catch {
        logger.logLine(
          `${chalk.red('ERROR')}: Event ${chalk.green(
            `"${topic}"`,
          )} does not exist in the ABI.`,
        )
        throw new Error(`Unable to decode event name.`)
      }
    }
    logger.logLine('Done')
  } else {
    topics.push(...inputTopics)
  }

  logger.logLine('Fetching logs...')
  const logs = await provider.getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: address.toString(),
    topics: topics.map((t) => t),
  })
  logger.logLine('Done.')

  const headers = ['Date', 'Transaction hash', 'Sender']
  const values: string[][] = await Promise.all(
    logs.map(async (l) => {
      const timestamp = await getTimestampFromBlock(provider, l.blockNumber)
      const sender = await getTransactionSender(provider, l.transactionHash)
      return [formatTimestamp(timestamp), l.transactionHash, sender]
    }),
  )

  logger.logLine(formatAsAsciiTable(headers, values))
}

async function getTimestampFromBlock(
  provider: providers.JsonRpcProvider,
  blockNumber: number,
): Promise<UnixTime> {
  const result = await provider.getBlock(blockNumber)
  return new UnixTime(result.timestamp)
}

async function getTransactionSender(
  provider: providers.JsonRpcProvider,
  transactionHash: string,
): Promise<string> {
  const result = await provider.getTransaction(transactionHash)
  return result.from
}

function formatTimestamp(timestamp: UnixTime): string {
  const date = timestamp.toDate()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
