import type { Logger } from '@l2beat/backend-tools'
import {
  get$Implementations,
  type IProvider,
  ProxyDetector,
} from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  formatAsAsciiTable,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { utils } from 'ethers'
import { getProvider } from './common/GetProvider'
import { getExplorerConfig } from './common/getExplorer'

export interface EventArgs {
  address: ChainSpecificAddress
  topics: string[]
  rpcUrl: string
  explorerUrl: string
  explorerApiKey: string | undefined
  explorerType: string
  explorerChainId: number | undefined
}

export async function getEvents(logger: Logger, args: EventArgs) {
  const { address: fullAddress, topics: inputTopics, rpcUrl } = args

  // Extract chain name from the chain-specific address
  const chainName = ChainSpecificAddress.longChain(fullAddress)

  const explorer = getExplorerConfig({ ...args, chainName })
  const provider = await getProvider(rpcUrl, explorer, chainName)

  const onlyHashedTopics = inputTopics.every(
    (t) => Hash256.check(t) || t === 'null',
  )
  const topics: (string | null)[] = []
  if (!onlyHashedTopics) {
    logger.info(
      'Some of the topics you provided are not hashes, trying to match them to the ABI',
    )

    const proxyDetector = new ProxyDetector()
    const result = await proxyDetector.detectProxy(provider, fullAddress)

    const addresses = [fullAddress]
    if (result !== undefined) {
      addresses.push(...get$Implementations(result.values))
    }

    logger.info('Fetching sources...')
    const sources = await Promise.all(
      addresses.map((address) => provider.getSource(address)),
    )

    const iface = new utils.Interface(
      [...new Set(sources.flatMap((s) => s.abi))].filter((e) =>
        e.startsWith('event '),
      ),
    )

    for (const topic of inputTopics) {
      if (topic === 'null') {
        topics.push(null)
        continue
      }

      if (Hash256.check(topic)) {
        topics.push(topic)
        continue
      }

      try {
        topics.push(iface.getEventTopic(topic))
      } catch {
        logger.info(
          `${chalk.red('ERROR')}: Event ${chalk.green(
            `"${topic}"`,
          )} does not exist in the ABI.`,
        )
        throw new Error('Unable to decode event name.')
      }
    }
    logger.info('Done')
  } else {
    topics.push(...inputTopics.map((t) => (t === 'null' ? null : t)))
  }

  logger.info('Fetching logs...')
  const logs = await provider.getLogs(
    fullAddress,
    topics.map((t) => t),
  )
  logger.info(`Done. Found ${logs.length} events.`)

  const headers = ['Date', 'Transaction hash', 'Sender']
  const values: string[][] = await Promise.all(
    logs.map(async (l) => {
      const timestamp = await getTimestampFromBlock(provider, l.blockNumber)
      const sender = await getTransactionSender(provider, l.transactionHash)
      return [formatTimestamp(timestamp), l.transactionHash, sender]
    }),
  )

  logger.info(formatAsAsciiTable(headers, values))
}

async function getTimestampFromBlock(
  provider: IProvider,
  blockNumber: number,
): Promise<UnixTime> {
  const result = await provider.getBlock(blockNumber)
  assert(result !== undefined)
  return UnixTime(result.timestamp)
}

async function getTransactionSender(
  provider: IProvider,
  transactionHash: string,
): Promise<string> {
  const result = await provider.getTransaction(Hash256(transactionHash))
  assert(result !== undefined)
  return result.from
}

function formatTimestamp(timestamp: UnixTime): string {
  const date = UnixTime.toDate(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
