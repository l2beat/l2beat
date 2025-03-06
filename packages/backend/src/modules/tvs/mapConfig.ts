import { createHash } from 'crypto'
import { getEscrowUntilTimestamp } from '@l2beat/backend-shared'
import type { Logger } from '@l2beat/backend-tools'
import type {
  AggLayerEscrow,
  ChainConfig,
  ElasticChainEscrow,
  Project,
  ProjectTvlEscrow,
} from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { Token as LegacyToken } from '@l2beat/shared-pure'
import { getAggLayerTokens } from './providers/aggLayer'
import { getElasticChainTokens } from './providers/elasticChain'
import {
  type AmountConfig,
  type AmountFormula,
  type BalanceOfEscrowAmountFormula,
  type CalculationFormula,
  type CirculatingSupplyAmountFormula,
  type PriceConfig,
  type Token,
  TokenId,
  type TotalSupplyAmountFormula,
  type TvsConfig,
  type ValueFormula,
} from './types'

export async function mapConfig(
  project: Project<'tvlConfig', 'chainConfig'>,
  chain: ChainConfig | undefined,
  logger: Logger,
  rpcClient?: RpcClient,
): Promise<TvsConfig> {
  const tokens: Token[] = []

  for (const escrow of project.tvlConfig.escrows) {
    if (escrow.sharedEscrow) {
      if (rpcClient === undefined) {
        logger.warn(`No Multicall passed, sharedEscrow support is not enabled`)
        continue
      }

      if (escrow.sharedEscrow.type === 'AggLayer') {
        logger.info(`Querying for AggLayer L2 tokens addresses`)
        const aggLayerL2Tokens = await getAggLayerTokens(
          project,
          chain,
          // TODO: fix types
          escrow as ProjectTvlEscrow & { sharedEscrow: AggLayerEscrow },
          rpcClient,
        )

        // TODO: add support for L1 assets
        // add support for native token
        tokens.push(...aggLayerL2Tokens)
      }

      if (escrow.sharedEscrow.type === 'ElasticChain') {
        logger.info(`Querying for ElasticChain L2 tokens addresses`)

        const elasticChainTokens = await getElasticChainTokens(
          project,
          chain,
          // TODO: fix types
          escrow as ProjectTvlEscrow & { sharedEscrow: ElasticChainEscrow },
          rpcClient,
        )

        tokens.push(...elasticChainTokens)
      }
    } else {
      for (const legacyToken of escrow.tokens) {
        if (!legacyToken.id.endsWith('native')) {
          assert(
            legacyToken.address,
            `Token address is required ${legacyToken.id}`,
          )
        }

        tokens.push(createEscrowToken(project, escrow, legacyToken))
      }
    }
  }

  for (const legacyToken of project.tvlConfig.tokens) {
    tokens.push(createToken(legacyToken, project))
  }

  return {
    projectId: project.id,
    tokens,
  }
}

export function createEscrowToken(
  project: Project<'tvlConfig'>,
  escrow: ProjectTvlEscrow,
  legacyToken: LegacyToken & { isPreminted?: boolean },
): Token {
  const id = TokenId.create(project.id, legacyToken.symbol)

  let amountFormula: CalculationFormula | AmountFormula

  if (legacyToken.isPreminted) {
    amountFormula = {
      type: 'calculation',
      operator: 'min',
      arguments: [
        {
          type: 'circulatingSupply',
          priceId: legacyToken.coingeckoId,
        },
        {
          type: 'balanceOfEscrow',
          address: legacyToken.address ?? 'native',
          escrowAddress: escrow.address,
          chain: escrow.chain,
          decimals: legacyToken.decimals,
        },
      ],
    }
  } else {
    amountFormula = {
      type: 'balanceOfEscrow',
      address: legacyToken.address ?? 'native',
      chain: escrow.chain,
      escrowAddress: escrow.address,
      decimals: legacyToken.decimals,
    } as BalanceOfEscrowAmountFormula
  }

  const sinceTimestamp = UnixTime.max(
    // TODO: make sure it takes chain.sinceTimestamp into consideration
    legacyToken.sinceTimestamp,
    escrow.sinceTimestamp,
  )
  const untilTimestamp = getEscrowUntilTimestamp(
    legacyToken.untilTimestamp,
    escrow.untilTimestamp,
  )
  const source = escrow.source ?? 'canonical'

  return {
    id,
    priceId: legacyToken.coingeckoId,
    symbol: legacyToken.symbol,
    name: legacyToken.name,
    amount: amountFormula,
    sinceTimestamp,
    untilTimestamp,
    category: legacyToken.category,
    source: source,
    isAssociated: !!project.tvlConfig.associatedTokens?.includes(
      legacyToken.symbol,
    ),
  }
}

export function createToken(
  legacyToken: LegacyToken,
  project: Project<'tvlConfig', 'chainConfig'>,
): Token {
  const id = TokenId.create(project.id, legacyToken.symbol)
  let amountFormula: AmountFormula

  switch (legacyToken.supply) {
    case 'totalSupply':
      amountFormula = {
        type: 'totalSupply',
        address: legacyToken.address,
        chain: project.id,
        decimals: legacyToken.decimals,
      } as TotalSupplyAmountFormula
      break

    case 'circulatingSupply':
      amountFormula = {
        type: 'circulatingSupply',
        priceId: legacyToken.coingeckoId,
      } as CirculatingSupplyAmountFormula
      break

    default:
      throw new Error(`Unsupported supply type ${legacyToken.supply}`)
  }

  return {
    id,
    priceId: legacyToken.coingeckoId,
    symbol: legacyToken.symbol,
    name: legacyToken.name,
    amount: amountFormula,
    // TODO: make sure it aligns with chain
    sinceTimestamp: legacyToken.sinceTimestamp,
    untilTimestamp: legacyToken.untilTimestamp,
    category: legacyToken.category,
    source: legacyToken.source,
    isAssociated: !!project.tvlConfig.associatedTokens?.includes(
      legacyToken.symbol,
    ),
  }
}

export function extractPricesAndAmounts(config: TvsConfig): {
  amounts: AmountConfig[]
  prices: PriceConfig[]
} {
  const amounts = new Map<string, AmountConfig>()
  const prices = new Map<string, PriceConfig>()

  for (const token of config.tokens) {
    if (token.amount.type === 'calculation') {
      const { formulaAmounts, formulaPrices } = processFormula(token.amount)
      formulaAmounts.forEach((a) => amounts.set(a.id, a))
      formulaPrices.forEach((p) => prices.set(p.priceId, p))
    } else {
      if (token.amount.type !== 'const') {
        const amount = createAmountConfig(token.amount)
        amounts.set(amount.id, amount)
      }
    }

    prices.set(token.priceId, { priceId: token.priceId })

    if (token.valueForProject) {
      const { formulaAmounts, formulaPrices } = processFormula(
        token.valueForProject,
      )
      formulaAmounts.forEach((a) => amounts.set(a.id, a))
      formulaPrices.forEach((p) => prices.set(p.priceId, p))
    }

    if (token.valueForTotal) {
      const { formulaAmounts, formulaPrices } = processFormula(
        token.valueForTotal,
      )
      formulaAmounts.forEach((a) => amounts.set(a.id, a))
      formulaPrices.forEach((p) => prices.set(p.priceId, p))
    }
  }

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
  }
}

export function createAmountConfig(
  formula:
    | BalanceOfEscrowAmountFormula
    | TotalSupplyAmountFormula
    | CirculatingSupplyAmountFormula,
): AmountConfig {
  switch (formula.type) {
    case 'balanceOfEscrow':
      return {
        id: hash([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
          formula.escrowAddress,
        ]),
        ...formula,
      }
    case 'totalSupply':
      return {
        id: hash([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
        ]),
        ...formula,
      }
    case 'circulatingSupply':
      return {
        id: hash([formula.type, formula.priceId]),
        ...formula,
      }
  }
}

function processFormula(
  formula: CalculationFormula | ValueFormula | AmountFormula,
): {
  formulaAmounts: AmountConfig[]
  formulaPrices: PriceConfig[]
} {
  const formulaAmounts: AmountConfig[] = []
  const formulaPrices: PriceConfig[] = []

  const processFormulaRecursive = (
    f: CalculationFormula | ValueFormula | AmountFormula,
  ) => {
    if (f.type === 'calculation') {
      for (const arg of f.arguments) {
        processFormulaRecursive(arg)
      }
      return
    }

    if (f.type === 'value') {
      processFormulaRecursive(f.amount)

      formulaPrices.push({ priceId: f.priceId })

      return
    }

    if (f.type !== 'const') {
      const amount = createAmountConfig(f)
      formulaAmounts.push(amount)
    }
  }

  processFormulaRecursive(formula)

  return { formulaAmounts, formulaPrices }
}

export function hash(input: string[]): string {
  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
