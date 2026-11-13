import type { ProjectLiquidStaking } from '@l2beat/config'

export interface CostOfExitDescription {
  /** What the value measures, by the routes counted. */
  tooltip: string
  /** The tooltip, with how each route is measured. */
  chart: string
}

interface ExitRoute {
  /** Ends "by the cheapest route: …". */
  phrase: string
  /** How the route is measured. */
  note?: string
}

const INTRO =
  'How many days of staking yield a holder gives up to exit about 100 ETH'
const ESTIMATE_NOTE =
  "~ marks an estimate: requests still queued are timed at the last 7 days' pace."
const MARKET_NOTE =
  "The discount is the day's median of hourly quotes for selling 100 tokens on the deepest pools, on days they could fill the sale for most hours."
const INSTANT_NOTE =
  'An instant exit counts on days it could pay out 100 ETH for most hours.'

const QUEUE: ExitRoute = {
  phrase: "the protocol's withdrawal queue, which earns nothing while it waits",
}
const INSTANT: ExitRoute = {
  phrase: "the protocol's instant exit, for its fee",
  note: INSTANT_NOTE,
}
const MARKET: ExitRoute = {
  phrase: 'selling on the best onchain pool, for its discount',
  note: MARKET_NOTE,
}

const ALL_ROUTES_TOOLTIP = `${describeRoutes([QUEUE, INSTANT, MARKET])} ${ESTIMATE_NOTE}`

/** Every route any protocol has, for pages that compare them. */
export const ALL_ROUTES_COST_OF_EXIT: CostOfExitDescription = {
  tooltip: ALL_ROUTES_TOOLTIP,
  chart: [
    ALL_ROUTES_TOOLTIP,
    MARKET_NOTE,
    INSTANT_NOTE,
    'wBETH unwraps wait for Binance to allocate ETH, and at least the operator-set lock time; its pools are too thin to quote.',
  ].join(' '),
}

/** The cost of exit of one protocol, naming only the routes it has. */
export function getCostOfExitDescription(
  liquidStaking: Pick<ProjectLiquidStaking, 'contracts' | 'marketQuotes'>,
): CostOfExitDescription {
  const market = liquidStaking.marketQuotes.length > 0 ? [MARKET] : []
  const noMarketNote =
    market.length === 0 ? ['Its pools are too thin to quote.'] : []
  const { routes, queued, notes } = getProtocolRoutes(
    liquidStaking.contracts.type,
  )
  const all = [...routes, ...market]

  const tooltip = [describeRoutes(all), queued ? ESTIMATE_NOTE : undefined]
    .filter((sentence) => sentence !== undefined)
    .join(' ')
  const chart = [
    tooltip,
    ...all.flatMap((route) => (route.note ? [route.note] : [])),
    ...notes,
    ...noMarketNote,
  ].join(' ')
  return { tooltip, chart }
}

/**
 * The routes the indexer reads for each protocol type, apart from selling,
 * which depends on the pools quoted.
 */
function getProtocolRoutes(type: ProjectLiquidStaking['contracts']['type']): {
  routes: ExitRoute[]
  /** Its queue wait can be an estimate. */
  queued: boolean
  notes: string[]
} {
  switch (type) {
    case 'lido':
      return { routes: [QUEUE], queued: true, notes: [] }
    case 'rocketpool':
      return {
        routes: [
          {
            phrase: 'burning rETH, which pays out at once',
            note: 'Burning counts on days it could pay out 100 ETH for most hours.',
          },
        ],
        queued: false,
        notes: [],
      }
    case 'etherfi':
      return { routes: [QUEUE, INSTANT], queued: true, notes: [] }
    case 'wbeth':
      return {
        routes: [{ phrase: 'unwrapping, which earns nothing while it waits' }],
        queued: true,
        notes: [
          'Unwraps wait for Binance to allocate ETH, and at least the operator-set lock time.',
        ],
      }
    case 'cbeth':
      return {
        routes: [],
        queued: false,
        notes: ['There is no onchain redemption.'],
      }
  }
}

function describeRoutes(routes: ExitRoute[]): string {
  const phrases = routes.map((route) => route.phrase)
  const last = phrases.at(-1)
  if (last === undefined) return `${INTRO}.`
  if (phrases.length === 1) return `${INTRO}, by its only route: ${last}.`
  return `${INTRO}, by the cheapest route: ${phrases.slice(0, -1).join('; ')}; or ${last}.`
}
