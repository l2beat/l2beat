import { createHash } from 'crypto'
import type { Logger } from '@l2beat/backend-tools'
import {
  type AggLayerEscrow,
  type ChainConfig,
  type ElasticChainEscrow,
  type Project,
  type ProjectTvlEscrow,
  tokenList,
} from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
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
  chain: ChainConfig,
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

        const token = createToken(legacyToken, project, chain, escrow)
        tokens.push(token)
      }
    }
  }

  // map totalSupply and circulatingSupply tokens
  const nonZeroSupplyTokens = tokenList.filter(
    (t) => t.supply !== 'zero' && t.chainId === chain.chainId,
  )
  for (const legacyToken of nonZeroSupplyTokens) {
    const token = createToken(legacyToken, project, chain)
    tokens.push(token)
  }

  return {
    projectId: project.id,
    tokens,
  }
}

export function createToken(
  legacyToken: LegacyToken & { isPreminted?: boolean },
  project: Project<'tvlConfig', 'chainConfig'>,
  chain: ChainConfig,
  escrow?: ProjectTvlEscrow,
): Token {
  let amountFormula: CalculationFormula | AmountFormula
  let sinceTimestamp: UnixTime
  let untilTimestamp: UnixTime | undefined
  let source: 'canonical' | 'external' | 'native'
  let id: TokenId

  if (escrow) {
    id = TokenId.create(chain.name, legacyToken.symbol)

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

    sinceTimestamp = escrow.sinceTimestamp
    untilTimestamp = escrow.untilTimestamp
    source = escrow.source ?? 'canonical'

    return {
      id,
      // This is a temporary solution
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

  switch (legacyToken.supply) {
    case 'totalSupply':
      assert(chain.sinceTimestamp, 'Chain with token should have minTimestamp')

      id = TokenId.create(chain.name, legacyToken.symbol)

      amountFormula = {
        type: 'totalSupply',
        address: legacyToken.address,
        chain: chain.name,
        decimals: legacyToken.decimals,
      } as TotalSupplyAmountFormula

      sinceTimestamp = UnixTime.max(
        chain.sinceTimestamp,
        legacyToken.sinceTimestamp,
      )
      source = legacyToken.source
      break
    case 'circulatingSupply':
      assert(chain.sinceTimestamp, 'Chain with token should have minTimestamp')

      id = TokenId.create(chain.name, legacyToken.symbol)

      amountFormula = {
        type: 'circulatingSupply',
        priceId: legacyToken.coingeckoId,
      } as CirculatingSupplyAmountFormula

      sinceTimestamp = UnixTime.max(
        chain.sinceTimestamp,
        legacyToken.sinceTimestamp,
      )
      source = legacyToken.source
      break

    default:
      throw new Error(`Unsupported supply type ${legacyToken.supply}`)
  }

  return {
    id,
    // This is a temporary solution
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

    const price = createPriceConfig({
      amount: token.amount,
      priceId: token.priceId,
    } as ValueFormula)
    prices.set(price.priceId, price)

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

export function createPriceConfig(formula: ValueFormula): PriceConfig {
  return {
    priceId: formula.priceId,
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

      const price = createPriceConfig(f)
      formulaPrices.push(price)

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
