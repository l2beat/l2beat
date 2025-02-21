import { formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import { providers } from 'ethers'
import {
  decodeChainId,
  getBlockTime,
  getGenesisTimestamp,
} from '../implementations/opConfigs'
import { rpcUrl } from './args'

export const OPConfigs = command({
  name: 'op-configs',
  description: 'Fetches genesisTimestamp and blockTime for opStacks.',
  args: { rpcUrl },
  handler: async (args) => {
    const provider = new providers.StaticJsonRpcProvider(args.rpcUrl)

    const chain = await decodeChainId((await provider.getNetwork()).chainId)
    const genesisTimestamp = await getGenesisTimestamp(provider)
    const blockTime = await getBlockTime(provider)

    console.log(
      [
        `${chalk.cyan(chalk.bold('Chain:'))} ${chalk.green(chain)}`,
        `${chalk.cyan(chalk.bold('Genesis Timestamp:'))} ${chalk.green(genesisTimestamp)}`,
        `${chalk.cyan(chalk.bold('Block Time:'))} ${chalk.green(blockTime)}`,
      ].join('\n'),
    )

    if (genesisTimestamp === 0) {
      const warningMessage = formatAsciiBorder([
        chalk.redBright('WARNING:'),
        'Genesis Timestamp was evaluated to zero, which is most likely incorrect.',
        '',
        'WHAT HAPPENED?',
        '• The genesis timestamp was fetched from block zero, but it returned zero.',
        '• This typically occurs if the chain was deployed pre-holocene or if the node is behaving unexpectedly.',
        '',
        'HOW TO FIX IT:',
        "1. Manually find the genesis timestamp in the chain's configuration files.",
      ])

      console.log(warningMessage)
    }
  },
})
