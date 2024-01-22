import { bridges, layer2s } from '@l2beat/config'
import { ConfigReader } from '@l2beat/discovery'
import { ContractValue, DiscoveryOutput } from '@l2beat/discovery-types'
import { assert, ChainId, EthereumAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'

void main().catch((e) => {
  console.log(e)
})

async function main() {
  const config = parseCliParameters()
  switch (config.mode) {
    case 'help':
      printUsage()
      break
    case 'print':
      await findCommon(config)
      break
  }
}

async function findCommon(config: Config): Promise<void> {
  const configReader = new ConfigReader()
  // TODO: Why only ethereum?
  const configs = await configReader.readAllConfigsForChain('ethereum')

  const discoveriesFull = await Promise.all(
    configs.map((c) => configReader.readDiscovery(c.name, c.chain)),
  )
  const discoveries = getFilteredDiscoveries(config, discoveriesFull)

  const projectAddresses = Object.fromEntries(
    discoveries.map((d) => [
      d.name,
      getProjectAddresses(d).map((a) => a.toString()),
    ]),
  )

  const occurrence: Record<string, number> = {}
  discoveries.forEach((d) =>
    addToOccurrences(projectAddresses[d.name], occurrence),
  )
  const repeatedAddresses = Object.entries(occurrence)
    .filter(([_, count]) => count > 1)
    .map(([address, _]) => address)

  const commonContracts: string[] = []
  const commonEOAs: string[] = []

  repeatedAddresses.forEach((address) => {
    const linkedProjectes = discoveries.filter((d) =>
      projectAddresses[d.name].includes(address),
    )

    const isEOA = linkedProjectes
      .flatMap((p) => p.eoas)
      .map((a) => a.toString())
      .includes(address)
    const isContract = linkedProjectes
      .flatMap((p) => p.contracts)
      .map((a) => a.address.toString())
      .includes(address)
    const isImplementation = linkedProjectes
      .flatMap((p) => p.contracts)
      .flatMap((a) => a.implementations ?? [])
      .map((a) => a.toString())
      .includes(address)

    if (isEOA) {
      commonEOAs.push(address)
    } else if (isContract || isImplementation) {
      commonContracts.push(address)
    }
  })

  commonContracts.forEach((address) =>
    printRelations(address, projectAddresses, discoveries),
  )
  commonEOAs.forEach((address) =>
    printRelations(address, projectAddresses, discoveries),
  )
}

function getFilteredDiscoveries(
  config: Config,
  discoveriesFull: DiscoveryOutput[],
) {
  if (config.input === 'all') {
    return discoveriesFull
  } else if (config.input === 'l2s') {
    const layer2Ids = layer2s.map((l2) => l2.id.toString())
    return discoveriesFull.filter((d) => layer2Ids.includes(d.name))
  } else {
    const bridgesIds = bridges.map((l2) => l2.id.toString())
    return discoveriesFull.filter((d) => bridgesIds.includes(d.name))
  }
}

function printRelations(
  address: string,
  projectAddresses: Record<string, string[]>,
  discoveries: DiscoveryOutput[],
) {
  const linkedProjectes = discoveries.filter((d) =>
    projectAddresses[d.name].includes(address),
  )
  const isEOA = linkedProjectes
    .flatMap((p) => p.eoas)
    .map((a) => a.toString())
    .includes(address)
  function getContract() {
    return linkedProjectes
      .flatMap((p) => p.contracts)
      .filter(
        (a) =>
          a.address.toString() === address ||
          a.implementations?.includes(EthereumAddress(address)),
      )[0]
  }
  const header = isEOA
    ? chalk.yellow('EOA')
    : chalk.cyan(`Contract (${getContract().name})`)

  console.log(`\nCommon ${header} | ${address}`)
  linkedProjectes.forEach((p) => {
    const locations = getAddressLocations(p, address)
    locations.forEach((loc) =>
      console.log(
        `- in project ${p.name} as ${loc.key} in ${loc.contractName}`,
      ),
    )
  })
}

interface ContractLocation {
  key: string
  contractName: string
}

function getAddressLocations(
  project: DiscoveryOutput,
  address: string,
): ContractLocation[] {
  const result: ContractLocation[] = []

  project.contracts.forEach((c) => {
    if (!c.values && !c.implementations) {
      return
    }

    const matching: ContractLocation[] = Object.entries(c.values ?? {})
      .filter(([_, value]) =>
        getAddresses(value)
          .map((a) => a.toString())
          .includes(address),
      )
      .map(([key, _]) => ({ key, contractName: c.name }))
      .concat(
        (c.implementations ?? [])
          .filter((a) => a.toString() === address)
          .map((_) => ({ key: 'implementation', contractName: c.name })),
      )
    result.push(...matching)
  })

  return result
}

function addToOccurrences(
  projectAddresses: string[],
  occurrence: Record<string, number>,
) {
  const seen: Record<string, boolean> = {}
  projectAddresses.forEach((addr) => {
    if (!seen[addr]) {
      occurrence[addr] ??= 0
      occurrence[addr] += 1
      seen[addr] = true
    }
  })
}

function getProjectAddresses(project: DiscoveryOutput) {
  const addresses: EthereumAddress[] = []
  addresses.push(...project.eoas)
  addresses.push(...project.contracts.flatMap((c) => c.implementations ?? []))
  addresses.push(...project.contracts.map((c) => c.address))
  addresses.push(
    ...project.contracts.flatMap((c) => {
      return c.values
        ? Object.values(c.values).flatMap((v) => getAddresses(v))
        : []
    }),
  )

  return addresses
}

function getAddresses(value: ContractValue | undefined): EthereumAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap(getAddresses)
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap(getAddresses)
  } else if (typeof value === 'string') {
    try {
      return [EthereumAddress(value)]
    } catch {
      return []
    }
  }
  return []
}

interface Config {
  mode: 'print' | 'help'
  input?: 'l2s' | 'bridges' | 'all'
}

function printUsage(): void {
  console.log('Usage: yarn common-contracts --inputs=<l2s | bridges | all>')
}

function parseCliParameters(): Config {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    return { mode: 'help' }
  }

  let input: Config['input'] | undefined

  const inputArg = extractArgWithValue(args, '--inputs')
  if (inputArg.found) {
    const inputStr = inputArg.value
    if (inputStr === undefined) {
      return { mode: 'help' }
    }

    if (inputStr === 'l2s' || inputStr === 'bridges' || inputStr === 'all') {
      input = inputStr
    } else {
      return { mode: 'help' }
    }
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
