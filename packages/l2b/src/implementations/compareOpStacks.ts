import { ConfigReader, type DiscoveryPaths } from '@l2beat/discovery'

type OpStackProject = {
  project: string
  OptimismPortal: string | undefined
  L1StandardBridge: string | undefined
  L1ERC721Bridge: string | undefined
  SystemConfig: string | undefined
  L1CrossDomainMessenger: string | undefined
  L2OutputOracle: string | undefined
}

export async function analyseAllOpStackChains(
  projectToCompare: string | null,
  paths: DiscoveryPaths,
): Promise<void> {
  const configReader = new ConfigReader(paths.discovery)
  const allL2s = configReader.readAllProjectsForChain('ethereum')

  const opStackChains = [] as OpStackProject[]

  for (const l2 of allL2s) {
    const discovery = configReader.readDiscovery(l2, 'ethereum')

    const L2OutputOracle = discovery.entries.find(
      (obj) => obj.name === 'L2OutputOracle',
    )
    const optimismPortal = discovery.entries.find(
      (obj) => obj.name === 'OptimismPortal',
    )
    const l1StandardBridge = discovery.entries.find(
      (obj) => obj.name === 'L1StandardBridge',
    )
    const l1ERC721Bridge = discovery.entries.find(
      (obj) => obj.name === 'L1ERC721Bridge',
    )
    const systemConfig = discovery.entries.find(
      (obj) => obj.name === 'SystemConfig',
    )
    const l1CrossDomainMessenger = discovery.entries.find(
      (obj) => obj.name === 'L1CrossDomainMessenger',
    )
    const disputeGameFactory = discovery.entries.find(
      (obj) => obj.name === 'DisputeGameFactory',
    )

    if (
      L2OutputOracle === undefined &&
      optimismPortal === undefined &&
      l1StandardBridge === undefined &&
      l1ERC721Bridge === undefined &&
      systemConfig === undefined &&
      l1CrossDomainMessenger === undefined &&
      disputeGameFactory === undefined
    ) {
      continue
    }

    const opStackChain = {
      project: l2,
      OptimismPortal: optimismPortal?.values?.version,
      L1StandardBridge: l1StandardBridge?.values?.version,
      L1ERC721Bridge: l1ERC721Bridge?.values?.version,
      SystemConfig: systemConfig?.values?.version,
      L1CrossDomainMessenger: l1CrossDomainMessenger?.values?.version,
      L2OutputOracle: L2OutputOracle?.values?.version,
      DisputeGameFactory: disputeGameFactory?.values?.version,
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
