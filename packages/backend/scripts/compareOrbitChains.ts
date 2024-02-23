import { ConfigReader } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'

const chainMapping: Record<string, string> = {
  arbitrum: 'ethereum',
  parallel: 'ethereum',
  xai: 'arbitrum',
  deri: 'arbitrum',
  rari: 'arbitrum',
}

function getChainName(chainId: number | undefined): string {
  const chainIds: Record<number, string> = {
    42161: 'arbitrum',
    1024: 'parallel',
    660279: 'xai',
    20231119: 'deri',
    1380012617: 'rari',
  }
  if (chainId === undefined) {
    return 'Unknown chainId'
  }
  return chainIds[chainId] || `Unknown chainId: ${chainId}`
}

const descriptions: Record<string, string> = {
  confirmPeriodBlocks: 'Fraud Proof Window (in blocks)',
  VALIDATOR_AFK_BLOCKS:
    'The number of blocks after which, if Validator is AFK, users can self-propose roots.',
  extraChallengeTimeBlocks:
    'Dispute window (in blocks) during which it is required to respond to a challenge',
}

void main().catch((e) => {
  console.log(e)
})

interface Config {
  mode: 'print' | 'help' | 'all'
  input?: string[]
}

async function main() {
  const config = parseCliParameters()
  switch (config.mode) {
    case 'help':
      printUsage()
      break
    case 'print':
      await compareTwoOrbitChain(config)
      break
    case 'all':
      await analyseAllOrbitChains()
      break
  }
}

function printUsage(): void {
  console.log(
    'Usage: yarn analyse-orbit-chains <--chains=<firstOrbitchain, secondOrbitChain> | --all>',
  )
}

function parseCliParameters(): Config {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { mode: 'help' }
  }

  if (args.includes('--all') || args.includes('-a')) {
    return { mode: 'all' }
  }

  let input: Config['input'] | undefined

  const inputArg = extractArgWithValue(args, '--chains')
  if (inputArg.found) {
    const inputStr = inputArg.value
    if (inputStr === undefined) {
      return { mode: 'help' }
    }
    const chains = inputStr.split(',')
    input = chains
  }

  return {
    mode: 'print',
    input,
  }
}

function extractArgWithValue(
  args: string[],
  argName: string,
): { found: false } | { found: true; value: string | undefined } {
  assert(argName.startsWith('--'), 'Argument name must start with "--"')
  const argIndex = args.findIndex((arg) => arg.startsWith(`${argName}=`))
  if (argIndex !== -1) {
    const value = args[argIndex]?.split('=')[1]
    args.splice(argIndex, 1)
    return { found: true, value }
  }
  return { found: false }
}

async function analyseAllOrbitChains(): Promise<void> {
  const configReader = new ConfigReader()
  const rollups = []
  for (const [chain, mapping] of Object.entries(chainMapping)) {
    const discovery = await configReader.readDiscovery(chain, mapping)
    rollups.push(discovery.contracts.find((obj) => obj.name === 'RollupProxy'))
  }
  for (const rollup of rollups) {
    console.log(
      'Rollup:',
      rollup?.values?.chainId,
      ':',
      getChainName(rollup.values.chainId),
    )
  }
  console.log()
  console.log('confirmPeriodBlocks: ', descriptions['confirmPeriodBlocks'])
  console.log(
    'extraChallengeTimeBlocks: ',
    descriptions['extraChallengeTimeBlocks'],
  )
  console.log('VALIDATOR_AFK_BLOCKS: ', descriptions['VALIDATOR_AFK_BLOCKS'])

  const data = []
  for (const rollup of rollups) {
    data.push({
      name: getChainName(rollup?.values?.chainId),
      confirmPeriodBlocks: rollup?.values?.confirmPeriodBlocks,
      extraChallengeTimeBlocks: rollup?.values?.extraChallengeTimeBlocks,
      VALIDATOR_AFK_BLOCKS: rollup?.values?.VALIDATOR_AFK_BLOCKS,
    })
  }
  console.table(data)

  const data1 = []
  for (const rollup of rollups) {
    data1.push({
      name: getChainName(rollup?.values.chainId),
      setValidatorCount: rollup?.values?.setValidatorCount,
      stakerCount: rollup?.values?.stakerCount,
    })
  }
  console.table(data1)

  const data2 = []
  for (const rollup of rollups) {
    data2.push({
      name: getChainName(rollup?.values.chainId),
      baseStake: rollup?.values?.baseStake,
      currentRequiredStake: rollup?.values?.currentRequiredStake,
      stakeToken: rollup?.values?.stakeToken,
    })
  }
  console.table(data2)

  const data3 = []
  for (const rollup of rollups) {
    data3.push({
      name: getChainName(rollup?.values.chainId),
      wasmModuleRoot: rollup?.values?.wasmModuleRoot,
      isERC20Enabled: rollup?.values?.isERC20Enabled,
    })
  }
  console.table(data3)
}

async function compareTwoOrbitChain(config: Config): Promise<void> {
  console.log('Analyzing', config.input)
  const configReader = new ConfigReader()
  const discovery1 = await configReader.readDiscovery(
    config.input[0],
    chainMapping[config.input[0]],
  )
  const discovery2 = await configReader.readDiscovery(
    config.input[1],
    chainMapping[config.input[1]],
  )

  const rollupProxy1 = discovery1.contracts.find(
    (obj) => obj.name === 'RollupProxy',
  )
  // console.log('Rollup:', rollupProxy1)

  const rollupProxy2 = discovery2.contracts.find(
    (obj) => obj.name === 'RollupProxy',
  )
  //console.log('Rollup:', rollupProxy2)

  const data = [
    {
      name: 'chainName',
      chain1: config.input[0],
      chain2: config.input[1],
    },
    {
      name: 'chainId',
      chain1: rollupProxy1?.values?.chainId,
      chain2: rollupProxy2?.values?.chainId,
      description: 'Chain ID of the rollup chain',
    },
    {
      name: 'minimumAssertionPeriod',
      chain1: rollupProxy1?.values?.minimumAssertionPeriod,
      chain2: rollupProxy2?.values?.minimumAssertionPeriod,
    },
    {
      name: 'setValidatorCount',
      chain1: rollupProxy1?.values?.setValidatorCount,
      chain2: rollupProxy2?.values?.setValidatorCount,
      description: 'How many Validators are on the whitelist',
    },
    {
      name: 'stakerCount',
      chain1: rollupProxy1?.values?.stakerCount,
      chain2: rollupProxy2?.values?.stakerCount,
      description: 'How many Validators are staked and can propose state roots',
    },
    {
      name: 'baseStake',
      chain1: rollupProxy1?.values?.baseStake,
      chain2: rollupProxy2?.values?.baseStake,
    },
    {
      name: 'currentRequiredStake',
      chain1: rollupProxy1?.values?.currentRequiredStake,
      chain2: rollupProxy2?.values?.currentRequiredStake,
    },
    {
      name: 'stakeToken',
      chain1: rollupProxy1?.values?.stakeToken,
      chain2: rollupProxy2?.values?.stakeToken,
      description: '0x is ETH',
    },
    {
      name: 'confirmPeriodBlocks',
      chain1: rollupProxy1?.values?.confirmPeriodBlocks,
      chain2: rollupProxy2?.values?.confirmPeriodBlocks,
      description: descriptions['confirmPeriodBlocks'],
    },
    {
      name: 'extraChallengeTimeBlocks',
      chain1: rollupProxy1?.values?.extraChallengeTimeBlocks,
      chain2: rollupProxy2?.values?.extraChallengeTimeBlocks,
      description: descriptions['extraChallengeTimeBlocks'],
    },
    {
      name: 'VALIDATOR_AFK_BLOCKS',
      chain1: rollupProxy1?.values?.VALIDATOR_AFK_BLOCKS,
      chain2: rollupProxy2?.values?.VALIDATOR_AFK_BLOCKS,
      description: descriptions['VALIDATOR_AFK_BLOCKS'],
    },
    {
      name: 'wasmModuleRoot',
      chain1: (rollupProxy1?.values?.wasmModuleRoot as string)?.slice(0, 10) + '...',
      chain2: (rollupProxy2?.values?.wasmModuleRoot as string)?.slice(0, 10) + '...',
      description: descriptions['wasmModuleRoot'],
    },
    {
      name: 'isERC20Enabled',
      chain1: rollupProxy1?.values?.isERC20Enabled,
      chain2: rollupProxy2?.values?.isERC20Enabled,
    },
  ]

  console.table(data)
}
