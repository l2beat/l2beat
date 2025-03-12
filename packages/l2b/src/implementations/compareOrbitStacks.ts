import type { DiscoveryPaths, EntryParameters } from '@l2beat/discovery'
import { ConfigReader } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'

const chainMapping: Record<string, string> = {
  arbitrum: 'ethereum',
  parallel: 'ethereum',
  kinto: 'ethereum',
  xai: 'arbitrum',
  deri: 'arbitrum',
  rari: 'arbitrum',
  sxnetwork: 'ethereum',
  galxegravity: 'ethereum',
}

function getArbOSVersion(wasmModuleRoot: string): string {
  const wasmRoots: Record<string, string> = {
    '0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3': 'v10',
    '0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21':
      'v10.1',
    '0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17':
      'v10.2',
    '0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec':
      'v10.3',
    '0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a':
      'v11.0',
    '0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4':
      'v11.1',
    '0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4': 'v20',
    '0x1024d5971f781dd930c46b5fb6fb571e6af9f31b5dc191b82e82036c207cc968':
      '?????',
    '0x965a35130f4e34b7b2339eac03b2eacc659e2dafe850d213ea6a7cdf9edfa99f':
      'Stylus',
  }
  if (wasmModuleRoot === undefined) {
    return 'Unspecified'
  }
  return wasmRoots[wasmModuleRoot] || 'Unknown'
}

function getChainName(chainId: number | undefined): string {
  const chainIds: Record<number, string> = {
    42161: 'arbitrum',
    1024: 'parallel',
    660279: 'xai',
    20231119: 'deri',
    1380012617: 'rari',
    7887: 'kinto',
    4162: 'sxnetwork',
    1625: 'galxegravity',
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

export async function analyseAllOrbitChains(
  paths: DiscoveryPaths,
): Promise<void> {
  const configReader = new ConfigReader(paths.discovery)
  const rollups: EntryParameters[] = []
  for (const [chain, mapping] of Object.entries(chainMapping)) {
    const discovery = configReader.readDiscovery(chain, mapping)
    const contract = discovery.entries.find((obj) => obj.name === 'RollupProxy')
    assert(contract, 'RollupProxy contract not found')
    rollups.push(contract)
  }
  for (const rollup of rollups) {
    console.log(
      'Rollup:',
      rollup?.values?.chainId,
      ':',
      getChainName(rollup?.values?.chainId as number),
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
      name:
        rollup && rollup.values
          ? getChainName(rollup.values.chainId as number)
          : 'Unknown chainId',
      confirmPeriodBlocks: rollup?.values?.confirmPeriodBlocks,
      extraChallengeTimeBlocks: rollup?.values?.extraChallengeTimeBlocks,
      VALIDATOR_AFK_BLOCKS: rollup?.values?.VALIDATOR_AFK_BLOCKS,
    })
  }
  console.table(data)

  const data1 = []
  for (const rollup of rollups) {
    data1.push({
      name:
        rollup && rollup.values
          ? getChainName(rollup.values.chainId as number)
          : 'Unknown chainId',
      setValidatorCount: rollup?.values?.setValidatorCount,
      stakerCount: rollup?.values?.stakerCount,
    })
  }
  console.table(data1)

  const data2 = []
  for (const rollup of rollups) {
    data2.push({
      name:
        rollup && rollup.values
          ? getChainName(rollup.values.chainId as number)
          : 'Unknown chainId',
      baseStake: rollup?.values?.baseStake,
      currentRequiredStake: rollup?.values?.currentRequiredStake,
      stakeToken: rollup?.values?.stakeToken,
    })
  }
  console.table(data2)

  const data3 = []
  for (const rollup of rollups) {
    data3.push({
      name:
        rollup && rollup.values
          ? getChainName(rollup.values.chainId as number)
          : 'Unknown chainId',
      wasmModuleRoot: rollup?.values?.wasmModuleRoot,
      arbOsVersion: getArbOSVersion(rollup?.values?.wasmModuleRoot as string),
      isERC20Enabled: rollup?.values?.isERC20Enabled,
    })
  }
  console.table(data3)
}

export async function compareTwoOrbitChain(
  firstProject: string,
  secondProject: string,
  paths: DiscoveryPaths,
): Promise<void> {
  console.log(`Analyzing ${firstProject} and ${secondProject}`)
  const configReader = new ConfigReader(paths.discovery)

  const discovery1 = getSafeDiscovery(configReader, firstProject)
  const discovery2 = getSafeDiscovery(configReader, secondProject)

  const rollupProxy1 = discovery1.entries.find(
    (obj) => obj.name === 'RollupProxy',
  )

  const rollupProxy2 = discovery2.entries.find(
    (obj) => obj.name === 'RollupProxy',
  )

  const data = [
    {
      name: 'chainName',
      chain1: firstProject,
      chain2: secondProject,
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
      chain1:
        (rollupProxy1?.values?.wasmModuleRoot as string)?.slice(0, 10) + '...',
      chain2:
        (rollupProxy2?.values?.wasmModuleRoot as string)?.slice(0, 10) + '...',
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

function getSafeDiscovery(configReader: ConfigReader, chain: string) {
  const mappedChain = chainMapping[chain]
  assert(mappedChain, `Chain ${chain} not found in mapping`)
  return configReader.readDiscovery(chain, mappedChain)
}
