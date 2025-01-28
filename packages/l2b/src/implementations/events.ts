import { type IProvider, ProxyDetector } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery-types'
import type { ExplorerConfig } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import type { CliLogger } from '@l2beat/shared'
import {
  assert,
  type EthereumAddress,
  Hash256,
  UnixTime,
  formatAsAsciiTable,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { utils } from 'ethers'
import { getProvider } from './common/GetProvider'

export async function getEvents(
  logger: CliLogger,
  address: EthereumAddress,
  inputTopics: string[],
  rpcUrl: string,
  explorerUrl?: string,
  explorerApiKey?: string,
  explorerType?: string,
) {
  const explorer = {
    type: (explorerType as ExplorerConfig['type']) ?? 'etherscan',
    url: explorerUrl ?? 'ERROR',
    apiKey: explorerApiKey ?? 'ERROR',
  }
  const provider = await getProvider(rpcUrl, explorer)

  const onlyHashedTopics = inputTopics.every((t) => Hash256.check(t))
  const topics = []
  if (!onlyHashedTopics) {
    logger.logLine(
      'Some of the topics you provided are not hashes, trying to match them to the ABI',
    )
    assert(explorerUrl !== undefined)
    assert(
      explorerType !== 'etherscan' || explorerApiKey !== undefined,
      'When using etherscan you should provide the API key using --etherscan-key.',
    )

    const proxyDetector = new ProxyDetector()
    const result = await proxyDetector.detectProxy(provider, address)

    const addresses = [address]
    if (result !== undefined) {
      addresses.push(...get$Implementations(result.values))
    }

    logger.logLine('Fetching sources...')
    const sources = await Promise.all(
      addresses.map((address) => provider.getSource(address)),
    )

    const iface = new utils.Interface(
      [...new Set(sources.flatMap((s) => s.abi))].filter((e) =>
        e.startsWith('event '),
      ),
    )

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
  const logs = await provider.getLogs(
    address,
    topics.map((t) => t),
  )
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
  provider: IProvider,
  blockNumber: number,
): Promise<UnixTime> {
  const result = await provider.getBlock(blockNumber)
  assert(result !== undefined)
  return new UnixTime(result.timestamp)
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
  const date = timestamp.toDate()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
