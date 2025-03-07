import { createHash } from 'crypto'
import type { Logger } from '@l2beat/backend-tools'
import {
  type AggLayerEscrow,
  type ChainConfig,
  type ElasticChainEscrow,
  type Project,
  ProjectService,
  type ProjectTvlEscrow,
} from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Token as LegacyToken } from '@l2beat/shared-pure'
import { getAggLayerTokens } from './providers/aggLayer'
import { getElasticChainTokens } from './providers/elasticChain'
import { getTimestampsRange } from './tools/timestamps'
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
  logger: Logger,
  rpcClient?: RpcClient,
): Promise<TvsConfig> {
  const CHAINS = await getChains()
  const getChain = (name: string) => {
    const chain = CHAINS.get(name)
    assert(chain)
    return chain
  }

  const tokens: Token[] = []
  const escrowTokens: Map<string, Token> = new Map()

  for (const escrow of project.tvlConfig.escrows) {
    if (escrow.sharedEscrow) {
      if (rpcClient === undefined) {
        logger.warn(`No Multicall passed, sharedEscrow support is not enabled`)
        continue
      }

      const chainOfL1Escrow = getChain(escrow.chain)

      if (escrow.sharedEscrow.type === 'AggLayer') {
        logger.info(`Querying for AggLayer L2 tokens addresses`)
        const aggLayerL2Tokens = await getAggLayerTokens(
          project,
          escrow as ProjectTvlEscrow & { sharedEscrow: AggLayerEscrow },
          chainOfL1Escrow,
          rpcClient,
        )
        tokens.push(...aggLayerL2Tokens)
      }

      if (escrow.sharedEscrow.type === 'ElasticChain') {
        logger.info(`Querying for ElasticChain L2 tokens addresses`)

        const elasticChainTokens = await getElasticChainTokens(
          project,
          escrow as ProjectTvlEscrow & { sharedEscrow: ElasticChainEscrow },
          chainOfL1Escrow,
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
        const chain = getChain(escrow.chain)
        const token = createEscrowToken(project, escrow, chain, legacyToken)
        const previousToken = escrowTokens.get(token.id)

        if (previousToken === undefined) {
          escrowTokens.set(token.id, token)
          continue
        }

        if (previousToken?.amount.type === 'balanceOfEscrow') {
          escrowTokens.set(token.id, {
            ...previousToken,
            amount: {
              type: 'calculation',
              operator: 'sum',
              arguments: [previousToken.amount, token.amount],
            },
          })
          continue
        }

        if (previousToken?.amount.type === 'calculation') {
          escrowTokens.set(token.id, {
            ...previousToken,
            amount: {
              ...(previousToken.amount as CalculationFormula),
              arguments: [
                ...(previousToken.amount as CalculationFormula).arguments,
                token.amount,
              ],
            },
          })
          continue
        }
      }
    }
  }

  for (const legacyToken of project.tvlConfig.tokens) {
    tokens.push(createToken(project, legacyToken))
  }

  return {
    projectId: project.id,
    tokens: [...tokens, ...Array.from(escrowTokens.values())],
  }
}

export function createEscrowToken(
  project: Project<'tvlConfig'>,
  escrow: ProjectTvlEscrow,
  chainOfEscrow: ChainConfig,
  legacyToken: LegacyToken & { isPreminted?: boolean },
): Token {
  assert(
    chainOfEscrow.name === legacyToken.chainName,
    `${legacyToken.symbol}: chain mismatch`,
  )
  assert(
    chainOfEscrow.name === escrow.chain,
    `${legacyToken.symbol}: chain mismatch`,
  )
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
          decimals: legacyToken.decimals ?? 0,
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

  const { sinceTimestamp, untilTimestamp } = getTimestampsRange(
    legacyToken,
    escrow,
    chainOfEscrow,
  )

  const source = escrow.source ?? 'canonical'

  return {
    mode: 'auto',
    id,
    priceId: legacyToken.coingeckoId,
    symbol: legacyToken.symbol,
    name: legacyToken.name,
    amount: amountFormula,
    sinceTimestamp,
    ...(untilTimestamp ? { untilTimestamp } : {}),
    category: legacyToken.category,
    source: source,
    isAssociated: !!project.tvlConfig.associatedTokens?.includes(
      legacyToken.symbol,
    ),
  }
}

export function createToken(
  project: Project<'tvlConfig', 'chainConfig'>,
  legacyToken: LegacyToken,
): Token {
  assert(
    project.chainConfig && project.chainConfig.name === legacyToken.chainName,
  )
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
        decimals: legacyToken.decimals ?? 0,
      } as CirculatingSupplyAmountFormula
      break

    default:
      throw new Error(`Unsupported supply type ${legacyToken.supply}`)
  }

  const { sinceTimestamp, untilTimestamp } = getTimestampsRange(
    legacyToken,
    project.chainConfig,
  )

  return {
    mode: 'auto',
    id,
    priceId: legacyToken.coingeckoId,
    symbol: legacyToken.symbol,
    name: legacyToken.name,
    amount: amountFormula,
    sinceTimestamp,
    ...(untilTimestamp ? { untilTimestamp } : {}),
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

async function getChains() {
  const ps = new ProjectService()
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  return new Map(chains.map((c) => [c.name, c]))
}
