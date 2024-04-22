// eslint-disable-next-line import/no-internal-modules
import { RawDiscoveryConfig } from '@l2beat/discovery/dist/discovery/config/RawDiscoveryConfig'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { exec } from 'child_process'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import util from 'util'

const execPromise = util.promisify(exec)

interface HelpMode {
  mode: 'help'
}

interface OpStackMode {
  mode: 'opStack'
  project: string
  initialAddresses: [EthereumAddress, EthereumAddress]
}

type Config = HelpMode | OpStackMode

void main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const config = parseCliParameters()
  switch (config.mode) {
    case 'help':
      printUsage()
      break
    case 'opStack':
      await createOpStackProject(config.project, config.initialAddresses)
      break
  }
}

async function createOpStackProject(
  project: string,
  initialAddresses: EthereumAddress[],
): Promise<void> {
  const dir = path.join(__dirname, '..', 'discovery', project, 'ethereum')
  await mkdir(dir, { recursive: true })

  let projectConfig: RawDiscoveryConfig = configTemplate(
    project,
    initialAddresses,
    names,
  )

  console.log('Running initial discovery for', project)
  await writeFile(
    path.join(dir, 'config.jsonc'),
    JSON.stringify(projectConfig, null, 2),
  )
  console.log('Initial discovery...')
  await execPromise('yarn discover ethereum ' + project, { cwd: __dirname })
  console.log('Initial discovery done!')

  let i = 1
  const maxTries = 5
  while (
    Object.keys(projectConfig.names ?? {}).length !== NAMES.length &&
    i < maxTries
  ) {
    console.log('Backfilling addresses...')
    projectConfig = await backfillAddresses(dir, projectConfig)
    await writeFile(
      path.join(dir, 'config.jsonc'),
      JSON.stringify(projectConfig, null, 2),
    )
    console.log('Running discovery:', i++)
    await execPromise('yarn discover ethereum ' + project, { cwd: __dirname })
  }

  console.log('Prettyfying config...')
  await execPromise(
    `yarn format:fix discovery/${project}/ethereum/config.jsonc`,
  )

  if (i === maxTries) {
    console.error('Failed to backfill all addresses')
  }

  console.log('Done! Checkout the config at')
  console.log(path.join(dir, 'config.jsonc'))
  console.log('and the discovery output at')
  console.log(path.join(dir, 'discovered.json'))
}

async function backfillAddresses(dir: string, oldConfig: RawDiscoveryConfig) {
  const discoveryOutput = await readFile(path.join(dir, 'discovered.json'))
  const discovery = JSON.parse(discoveryOutput.toString()) as {
    contracts: { name: string; address: string }[]
  }

  const names = discovery.contracts.reduce((acc, contract) => {
    if (NAMES.includes(contract.name)) {
      acc[contract.address] = contract.name
    }
    return acc
  }, {} as Record<string, string>)

  assert(typeof oldConfig === 'object', 'oldConfig must be an object')
  return configTemplate(oldConfig.name, oldConfig.initialAddresses, names)
}

function parseCliParameters(): Config {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { mode: 'help' }
  }

  const project = args[0]
  assert(project, 'project must be provided')
  const initialAddress1 = EthereumAddress(args[1])
  const initialAddress2 = EthereumAddress(args[2])

  return {
    mode: 'opStack',
    project,
    initialAddresses: [initialAddress1, initialAddress2],
  }
}

function printUsage(): void {
  console.log(
    'Usage: yarn add-opstack-project project initialAddress1 initialAddress2',
  )
}

const names = {
  '0xBB08cf90DEb93492b463f1Ee5DA9453e51643586': 'SystemConfig',
  '0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD': 'L2OutputOracle',
  '0x9f6F58F07863D72C47D001066C65528C27D3AE19': 'L1CrossDomainMessenger',
  '0x1bBde518ad01BaABFE30020407A7630FB17B545d': 'L1StandardBridge',
  '0xba1ac896F3b7cB273daE94bF9A6291A432e826c7': 'OptimismPortal',
  '0xeA078231B0ED94F816E57960423af6d028529b09': 'AddressManager',
}

const NAMES = Object.values(names)

const overrides = {
  OptimismPortal: {
    ignoreMethods: ['isOutputFinalized'],
    ignoreInWatchMode: ['params'],
  },
  L2OutputOracle: {
    ignoreMethods: [
      'getL2OutputAfter',
      'getL2OutputIndexAfter',
      'getL2Output',
      'computeL2Timestamp',
    ],
    ignoreInWatchMode: [
      'nextBlockNumber',
      'nextOutputIndex',
      'latestBlockNumber',
      'latestOutputIndex',
    ],
    fields: {
      deletedOutputs: {
        type: 'stateFromEvent' as const,
        event: 'OutputsDeleted',
        returnParams: ['prevNextOutputIndex', 'newNextOutputIndex'],
      },
    },
  },
  LyraMultisig: {
    ignoreInWatchMode: ['nonce'],
  },
  L1CrossDomainMessenger: {
    ignoreMethods: ['xDomainMessageSender'],
    ignoreInWatchMode: ['messageNonce'],
  },
  SystemConfig: {
    fields: {
      // this overrides the batcherHash method return type (bytes32 -> address) so our discovery detects it as an address
      batcherHash: {
        type: 'call' as const,
        method: 'function batcherHash() view returns (address)',
        args: [],
      },
      opStackDA: {
        type: 'opStackDA' as const,
        sequencerAddress: '{{ batcherHash }}',
      },
      sequencerInbox: {
        type: 'opStackSequencerInbox' as const,
        sequencerAddress: '{{ batcherHash }}',
      },
    },
    ignoreInWatchMode: ['scalar'],
  },
}

function configTemplate(
  projectName: string,
  initialAddresses: EthereumAddress[],
  names: Record<string, string>,
) {
  return {
    $schema:
      'https://raw.githubusercontent.com/l2beat/tools/main/schemas/config.schema.json',
    chain: 'ethereum',
    name: projectName,
    initialAddresses,
    names,
    overrides,
  }
}
