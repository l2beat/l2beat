import { ProxyDetector } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery-types'
import type { ExplorerConfig } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { CliLogger } from '@l2beat/shared'
import chalk from 'chalk'
import { command, positional } from 'cmd-ts'
import { getProvider } from '../implementations/common/GetProvider'
import { explorerApiKey, explorerType, explorerUrl, rpcUrl } from './args'
import { EthereumAddressValue } from './types'

export const DetectProxy = command({
  name: 'proxy',
  description: 'Detects the proxy kind and prints information about it.',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl,
    explorerUrl,
    type: explorerType,
    apiKey: explorerApiKey,
  },
  handler: async (args) => {
    const logger = new CliLogger()

    const explorer = {
      type: (args.type as ExplorerConfig['type']) ?? 'etherscan',
      url: args.explorerUrl ?? 'ERROR',
      apiKey: args.apiKey ?? 'ERROR',
    }
    const provider = await getProvider(args.rpcUrl, explorer)

    const proxyDetector = new ProxyDetector()
    const result = await proxyDetector.detectProxy(provider, args.address)

    if (result === undefined) {
      logger.logLine(
        "Couldn't detect the type of the proxy. Either it's not a proxy or it's a proxy we can't yet detect.",
      )
      return
    }

    logger.logLine(`Detected Proxy of kind: ${chalk.green(result.type)}`)
    const implementations = get$Implementations(result.values)
    for (const [i, implementation] of implementations.entries()) {
      const prefix = i === implementations.length - 1 ? `└─` : `├─`
      logger.logLine(
        ` ${prefix} ${chalk.blueBright(implementation.toString())}`,
      )
    }
  },
})
