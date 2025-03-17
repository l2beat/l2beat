import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES, badges, badgesCompareFn } from '../common/badges'
import type * as Schema from '../meta/schema'
import type * as Types from '../types'

export function projectFromSchema(
  schema: Schema.Project,
  allProjects: Schema.Project[],
): Types.BaseProject {
  return {
    id: ProjectId(schema.id),
    slug: schema.slug,
    name: schema.name,
    shortName: schema.shortName,
    addedAt: UnixTime.from(schema.addedAt),

    isArchived: schema.isArchived ? true : undefined,
    isUpcoming: schema.isUpcoming ? true : undefined,
    isScaling: schema.scaling ? true : undefined,

    statuses: {
      yellowWarning: schema.statuses?.yellowWarning,
      redWarning: schema.statuses?.redWarning,
      isUnderReview: !!schema.statuses?.isUnderReview,
      isUnverified: !!schema.statuses?.isUnverified,
    },
    display: {
      description: schema.display.description,
      links: schema.display.links,
      badges: getBadges(schema),
    },
    milestones: schema.milestones,
    chainConfig: getChainConfig(schema),

    scalingInfo: getScalingInfo(schema, allProjects),
  }
}

function getBadges(schema: Schema.Project): Types.Badge[] {
  const definedBadges = (schema.display.badges ?? []).map(toBadge)
  const existingStack = definedBadges.find(
    (x) => x.type === 'Stack' || x.type === 'Fork',
  )
  if (schema.scaling && existingStack) {
    throw new Error(
      `Project ${schema.id}: Badge ${existingStack.type}${existingStack.id} defined unnecesarily. Please use scaling.stack instead.`,
    )
  }
  const existingRaaS = definedBadges.find((x) => x.type === 'RaaS')
  if (schema.scaling && existingRaaS) {
    throw new Error(
      `Project ${schema.id}: Badge ${existingRaaS.type}${existingRaaS.id} defined unnecesarily. Please use scaling.raas instead.`,
    )
  }

  const stackBadge = stackToBadge(schema.scaling?.stack)
  if (stackBadge) {
    definedBadges.push(stackBadge)
  }
  const raasBadge = badges.find(
    (x) => x.type === 'RaaS' && x.name === schema.scaling?.raas,
  )
  if (raasBadge) {
    definedBadges.push(raasBadge)
  }
  definedBadges.sort(badgesCompareFn)

  return definedBadges
}

function stackToBadge(stack: Schema.Scaling['stack']): Types.Badge | undefined {
  if (stack === undefined) {
    return undefined
  }
  const badges: Record<
    Exclude<Schema.Scaling['stack'], undefined>,
    Types.Badge | undefined
  > = {
    Arbitrum: BADGES.Stack.Orbit,
    'Cartesi Rollups': BADGES.Stack.Cartesi,
    Loopring: BADGES.Fork.LoopringFork,
    'OP Stack': BADGES.Stack.OPStack,
    OVM: BADGES.Fork.OVM,
    Polygon: BADGES.Stack.PolygonCDK,
    'SN Stack': BADGES.Stack.SNStack,
    StarkEx: BADGES.Stack.StarkEx,
    Starknet: BADGES.Fork.StarknetFork,
    Taiko: BADGES.Fork.TaikoFork,
    'ZK Stack': BADGES.Stack.ZKStack,
    'ZKsync Lite': BADGES.Fork.ZKsyncLiteFork,
  }
  return badges[stack]
}

function toBadge(input: Schema.Badge): Types.Badge {
  const [type, id] = input.split('.')
  const output = badges.find((x) => x.type === type && x.id === id)
  if (!output) {
    throw new Error(`Cannot find badge: ${input}`)
  }
  return output
}

function getChainConfig(schema: Schema.Project): Types.ChainConfig | undefined {
  if (!schema.chainConfig) {
    return undefined
  }
  return {
    name: schema.id,
    chainId: schema.chainConfig.chainId ?? undefined,
    explorerUrl: schema.chainConfig.explorerUrl,
    gasTokens: schema.chainConfig.gasTokens,
    multicallContracts: schema.chainConfig.multicallContracts?.map(
      toMulticallContractConfig,
    ),
    coingeckoPlatform: schema.chainConfig.coingeckoPlatform,
    sinceTimestamp: schema.chainConfig.sinceTimestamp
      ? UnixTime.from(schema.chainConfig.sinceTimestamp)
      : undefined,
    untilTimestamp: schema.chainConfig.untilTimestamp
      ? UnixTime.from(schema.chainConfig.untilTimestamp)
      : undefined,
    apis: schema.chainConfig.apis,
  }
}

function toMulticallContractConfig(
  input: Schema.MulticallContractConfig,
): Types.MulticallContractConfig {
  return {
    address: EthereumAddress(input.address),
    sinceBlock: input.sinceBlock,
    batchSize: input.batchSize,
    version: input.version,
    isNativeBalanceSupported: input.isNativeBalanceSupported,
  }
}

function getScalingInfo(
  schema: Schema.Project,
  allProjects: Schema.Project[],
): Types.ProjectScalingInfo | undefined {
  if (!schema.scaling) {
    return undefined
  }

  const hostChainId = schema.scaling.hostChain ?? 'ethereum'
  const hostChainProject = allProjects.find((x) => x.id === hostChainId)
  if (!hostChainProject) {
    throw new Error(
      `Project ${schema.id}: Host chain ${hostChainId} not found.`,
    )
  }

  return {
    layer: schema.scaling.hostChain !== 'ethereum' ? 'layer3' : 'layer2',
    type: schema.scaling.type,
    capability: schema.scaling.capability,
    isOther: false, // TODO: isOther
    reasonsForBeingOther: undefined, // TODO: reasonsForBeingOther
    hostChain: {
      id: ProjectId(hostChainProject.id),
      slug: hostChainProject.slug,
      name: hostChainProject.name,
      shortName: hostChainProject.shortName,
    },
    stack: schema.scaling.stack,
    raas: schema.scaling.raas,
    daLayer: 'Unknown', // TODO: daLayer
    stage: 'Not applicable', // TODO: stage
    purposes: schema.scaling.purposes,
    scopeOfAssessment: undefined, // TODO: scopeOfAssessment
  }
}
