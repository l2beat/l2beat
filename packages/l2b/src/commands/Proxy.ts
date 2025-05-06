import { ProxyDetector, get$Implementations } from '@l2beat/discovery'
import { CliLogger } from '@l2beat/shared'
import chalk from 'chalk'
import { command, positional } from 'cmd-ts'
import { getProvider } from '../implementations/common/GetProvider'
import {
  chainName,
  explorerApiKey,
  explorerChainId,
  explorerType,
  explorerUrl,
  rpcUrl,
} from './args'
import { EthereumAddressValue } from './types'
import { getExplorerConfig } from '../implementations/common/getExplorer'

export const DetectProxy = command({
  name: 'proxy',
  description: 'Detects the proxy kind and prints information about it.',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl,
    chainName,
    explorerUrl,
    explorerType,
    explorerApiKey,
    explorerChainId,
  },
  handler: async (args) => {
    const logger = new CliLogger()

    const explorer = getExplorerConfig(args)
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
