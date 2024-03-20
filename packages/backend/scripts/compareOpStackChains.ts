import { ConfigReader } from '@l2beat/discovery'
import { layer2s } from '@l2beat/config'

void main().catch((e) => {
  console.log(e)
})

interface Config {
  mode: 'print' | 'help' | 'all' | 'findSimilar'
  input?: string[]
}

async function main() {
  const config = parseCliParameters()
  switch (config.mode) {
    case 'help':
      printUsage()
      break
    case 'findSimilar':
      if (config.input && config.input.length > 0) {
        await analyseAllOpStackChains(config.input[0])
      } else {
        console.log('No chain name provided for findSimilar mode')
      }
      break
    case 'all':
      await analyseAllOpStackChains(null)
      break
  }
}

function printUsage(): void {
  console.log(
    'Usage: yarn analyse-opstack-chains --all | --findSimilar project-name',
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

  if (args.includes('--findSimilar')) {
    return { mode: 'findSimilar', input: [args[1]] }
  }

  let input: Config['input'] | undefined

  return {
    mode: 'print',
    input,
  }
}

type OpStackProject = {
  project: string
  OptimismPortal: string | undefined
  L1StandardBridge: string | undefined
  L1ERC721Bridge: string | undefined
  SystemConfig: string | undefined
  L1CrossDomainMessenger: string | undefined
  L2OutputOracle: string | undefined
}

function findMostSimilar(
  newObj: OpStackProject,
  list: OpStackProject[],
): OpStackProject | null {
  let maxSimilarity = 0
  let mostSimilar: OpStackProject | null = null

  for (const obj of list) {
    if (obj === newObj) {
      continue
    }
    let similarity = 0

    for (const key in newObj) {
      if (
        newObj[key as keyof OpStackProject] === obj[key as keyof OpStackProject]
      ) {
        similarity++
      }
    }

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity
      mostSimilar = obj
    }
  }

  return mostSimilar
}

async function analyseAllOpStackChains(
  projectToCompare: string | null,
): Promise<void> {
  const configReader = new ConfigReader()
  const opStackChains = [] as OpStackProject[]

  const l2s = layer2s.filter((l2) => l2.display.provider === 'OP Stack' && !l2.isArchived && !l2.isUpcoming)

  for (const l2 of l2s) {
    console.log('reading', l2.id)
    const discovery = await configReader.readDiscovery(l2.id.toString(), 'ethereum')
    const L2OutputOracle = discovery.contracts.find(
      (obj) => obj.name === 'L2OutputOracle',
    )
    const optimismPortal = discovery.contracts.find(
      (obj) => obj.name === 'OptimismPortal',
    )
    const l1StandardBridge = discovery.contracts.find(
      (obj) => obj.name === 'L1StandardBridge',
    )
    const l1ERC721Bridge = discovery.contracts.find(
      (obj) => obj.name === 'L1ERC721Bridge',
    )
    const systemConfig = discovery.contracts.find(
      (obj) => obj.name === 'SystemConfig',
    )
    const l1CrossDomainMessenger = discovery.contracts.find(
      (obj) => obj.name === 'L1CrossDomainMessenger',
    )

    const opStackChain = {
      project: l2.id.toString(),
      OptimismPortal: optimismPortal?.values?.version,
      L1StandardBridge: l1StandardBridge?.values?.version,
      L1ERC721Bridge: l1ERC721Bridge?.values?.version,
      SystemConfig: systemConfig?.values?.version,
      L1CrossDomainMessenger: l1CrossDomainMessenger?.values?.version,
      L2OutputOracle: L2OutputOracle?.values?.version,
    }
    opStackChains.push(opStackChain as OpStackProject)
  }
  console.table(opStackChains)

  if (projectToCompare !== undefined) {
    console.log('comparing to', projectToCompare)
    const projectToCompareTo = opStackChains.find(
      (obj) => obj.project === projectToCompare,
    ) as OpStackProject
    const mostSimilar = findMostSimilar(projectToCompareTo, opStackChains)

    console.log(`most similar to ${projectToCompare}:`, mostSimilar)
  }
}
