import type { ProjectLiquidStaking } from '@l2beat/config'

export interface CostOfExitDescription {
  /** What the value measures, by the routes counted. */
  tooltip: string
  /** The tooltip, with what is particular to the protocol's exit. */
  chart: string
}

const INTRO = 'Days of staking yield it costs to exit 1 ETH'
const ESTIMATE_NOTE =
  "~ marks an estimate: requests still in the queue are timed at the last 7 days' pace."

/** Each ends "by the cheapest route: …". */
const QUEUE = 'waiting in the queue, which earns nothing'
const INSTANT = "an instant exit's fee"
const MARKET = 'the market discount'

const ALL_ROUTES_TOOLTIP = `${describeRoutes([QUEUE, INSTANT, MARKET])} ${ESTIMATE_NOTE}`

/** Every route any protocol has, for pages that compare them. */
export const ALL_ROUTES_COST_OF_EXIT: CostOfExitDescription = {
  tooltip: ALL_ROUTES_TOOLTIP,
  chart: ALL_ROUTES_TOOLTIP,
}

/** The cost of exit of one protocol, naming only the routes it has. */
export function getCostOfExitDescription(
  liquidStaking: Pick<ProjectLiquidStaking, 'contracts' | 'marketQuotes'>,
): CostOfExitDescription {
  const hasMarket = liquidStaking.marketQuotes.length > 0
  const { routes, queued, notes } = getProtocolRoutes(
    liquidStaking.contracts.type,
  )

  const tooltip = [
    describeRoutes(hasMarket ? [...routes, MARKET] : routes),
    queued ? ESTIMATE_NOTE : undefined,
  ]
    .filter((sentence) => sentence !== undefined)
    .join(' ')
  const chart = [
    tooltip,
    ...notes,
    ...(hasMarket ? [] : ['Its pools are too thin to quote.']),
  ].join(' ')
  return { tooltip, chart }
}

/**
 * The routes the indexer reads for each protocol type, apart from selling,
 * which depends on the pools quoted.
 */
function getProtocolRoutes(type: ProjectLiquidStaking['contracts']['type']): {
  routes: string[]
  /** Its queue wait can be an estimate. */
  queued: boolean
  notes: string[]
} {
  switch (type) {
    case 'lido':
      return { routes: [QUEUE], queued: true, notes: [] }
    case 'rocketpool':
      return {
        routes: ['burning rETH, which pays out at once'],
        queued: false,
        notes: [],
      }
    case 'etherfi':
      return { routes: [QUEUE, INSTANT], queued: true, notes: [] }
    case 'wbeth':
      return {
        routes: ['unwrapping, which earns nothing while it waits'],
        queued: true,
        notes: [
          'Unwraps wait for Binance to allocate ETH and for its lock time.',
          '~ also marks an unwrap still inside the lock.',
        ],
      }
    case 'cbeth':
      return {
        routes: [],
        queued: false,
        notes: ['There is no onchain redemption.'],
      }
    case 'stakewise':
      return {
        routes: ['waiting in the redemption queue, which earns nothing'],
        queued: true,
        notes: [],
      }
    case 'sweth':
      return { routes: [QUEUE], queued: true, notes: [] }
  }
}

function describeRoutes(routes: string[]): string {
  const last = routes.at(-1)
  if (last === undefined) return `${INTRO}.`
  if (routes.length === 1) return `${INTRO}, by its only route: ${last}.`
  const cheapest = routes.length === 2 ? 'cheaper' : 'cheapest'
  return `${INTRO}, by the ${cheapest} route: ${routes.slice(0, -1).join(', ')}, or ${last}.`
}
