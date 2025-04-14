import type { Logger } from '@l2beat/backend-tools'
import type {
  AggLayerEscrow,
  AmountFormula,
  CalculationFormula,
  ChainConfig,
  ElasticChainEscrow,
  Project,
  ProjectTvlEscrow,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import { assert, TokenId } from '@l2beat/shared-pure'
import type { Token as LegacyToken } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import type { ProjectTvsConfig } from '../types'
import { getTimeRangeIntersection } from './getTimeRangeIntersection'
import { getAggLayerTokens } from './sharedEscrows/getAggLayerTokens'
import { getElasticChainTokens } from './sharedEscrows/getElasticChainTokens'

export async function mapConfig(
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: Map<string, ChainConfig>,
  logger: Logger,
  rpcClient?: RpcClient,
): Promise<ProjectTvsConfig> {
  const tokens: TvsToken[] = []

  for (const legacyToken of project.tvlConfig.tokens) {
    tokens.push(createToken(project, legacyToken))
  }

  const sharedEscrows = project.tvlConfig.escrows.filter((e) => e.sharedEscrow)

  if (sharedEscrows.length > 0) {
    logger.info(
      `Querying for shared escrow L2 tokens addresses for project ${project.id}...`,
    )
  }

  for (const escrow of sharedEscrows) {
    assert(escrow.sharedEscrow)
    if (rpcClient === undefined) {
      logger.warn(
        `${project.id}: No rpc client configured, sharedEscrow support is not enabled`,
      )
      continue
    }

    const chainOfL1Escrow = getChain(escrow.chain, chains)

    if (escrow.sharedEscrow.type === 'AggLayer') {
      logger.debug(`Querying for AggLayer L2 tokens addresses`)
      const aggLayerL2Tokens = await getAggLayerTokens(
        project,
        escrow as ProjectTvlEscrow & { sharedEscrow: AggLayerEscrow },
        chainOfL1Escrow,
        rpcClient,
      )
      tokens.push(...aggLayerL2Tokens)
    }

    if (escrow.sharedEscrow.type === 'ElasticChain') {
      logger.debug(`Querying for ElasticChain L2 tokens addresses`)

      const elasticChainTokens = await getElasticChainTokens(
        project,
        escrow as ProjectTvlEscrow & { sharedEscrow: ElasticChainEscrow },
        chainOfL1Escrow,
        rpcClient,
      )
      tokens.push(...elasticChainTokens)
    }
  }

  const nonSharedEscrows = project.tvlConfig.escrows.filter(
    (e) => !e.sharedEscrow,
  )
  const bySource = groupBy(
    nonSharedEscrows.map((e) => ({
      ...e,
      source: e.source ?? 'canonical',
    })),
    'source',
  )

  for (const escrowGroup of Object.values(bySource)) {
    const tokensWithEscrow = escrowGroup.flatMap((escrow) =>
      escrow.tokens.map((token) => ({ ...token, escrow })),
    )

    const tokensBySymbol = groupBy(tokensWithEscrow, 'symbol')

    for (const symbolTokens of Object.values(tokensBySymbol)) {
      const tokensByCoingeckoId = groupBy(symbolTokens, 'coingeckoId')

      for (const sameIdTokens of Object.values(tokensByCoingeckoId)) {
        const token = mergeTokensWithSameId(project, chains, sameIdTokens)
        tokens.push(token)
      }
    }
  }

  return {
    projectId: project.id,
    tokens: deduplicateTokens(tokens),
  }
}

export function createEscrowToken(
  project: Project<'tvlConfig'>,
  escrow: ProjectTvlEscrow,
  chainOfEscrow: ChainConfig,
  legacyToken: LegacyToken & { isPreminted?: boolean },
): TvsToken {
  assert(
    chainOfEscrow.name === legacyToken.chainName,
    `${legacyToken.symbol}: chain mismatch`,
  )
  assert(
    chainOfEscrow.name === escrow.chain,
    `${legacyToken.symbol}: chain mismatch`,
  )

  let amountFormula: CalculationFormula | AmountFormula

  const { sinceTimestamp, untilTimestamp } = getTimeRangeIntersection(
    legacyToken,
    escrow,
    chainOfEscrow,
  )

  if (legacyToken.isPreminted) {
    assert(legacyToken.address, `Native asset not supported`)
    amountFormula = {
      type: 'calculation',
      operator: 'min',
      arguments: [
        {
          type: 'circulatingSupply',
          apiId: legacyToken.coingeckoId,
          decimals: legacyToken.decimals ?? 0,
          sinceTimestamp,
          ...(untilTimestamp ? { untilTimestamp } : {}),
          address: legacyToken.address,
          chain: legacyToken.chainName,
        },
        {
          type: 'balanceOfEscrow',
          address: legacyToken.address ?? 'native',
          escrowAddress: escrow.address,
          chain: escrow.chain,
          decimals: legacyToken.decimals,
          sinceTimestamp,
          ...(untilTimestamp ? { untilTimestamp } : {}),
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
      sinceTimestamp,
      ...(untilTimestamp ? { untilTimestamp } : {}),
    }
  }

  const id = TokenId.create(project.id, legacyToken.symbol)

  let valueForSummary: CalculationFormula | ValueFormula | undefined = undefined
  if (escrow.chain !== 'ethereum') {
    valueForSummary = {
      type: 'value',
      amount: {
        type: 'const',
        value: '0',
        decimals: 0,
        sinceTimestamp,
        ...(untilTimestamp ? { untilTimestamp } : {}),
      },
      priceId: legacyToken.coingeckoId,
    }
  }

  return {
    mode: 'auto',
    id,
    priceId: legacyToken.coingeckoId,
    symbol: legacyToken.symbol,
    name: legacyToken.name,
    iconUrl: legacyToken.iconUrl,
    amount: amountFormula,
    ...(valueForSummary ? { valueForSummary } : {}),
    category: legacyToken.category,
    source: escrow.source ?? 'canonical',
    isAssociated: !!project.tvlConfig.associatedTokens?.includes(
      legacyToken.symbol,
    ),
  }
}

export function createToken(
  project: Project<'tvlConfig', 'chainConfig'>,
  legacyToken: LegacyToken,
): TvsToken {
  assert(
    project.chainConfig && project.chainConfig.name === legacyToken.chainName,
  )
  const id = TokenId.create(project.id, legacyToken.symbol)
  let amountFormula: AmountFormula | CalculationFormula

  const { sinceTimestamp, untilTimestamp } = getTimeRangeIntersection(
    legacyToken,
    project.chainConfig,
  )

  switch (legacyToken.supply) {
    case 'totalSupply':
      assert(legacyToken.address, 'Only tokens have total supply')
      if (legacyToken.premint) {
        amountFormula = {
          type: 'calculation',
          operator: 'diff',
          arguments: [
            {
              type: 'totalSupply',
              address: legacyToken.address,
              chain: project.id,
              decimals: legacyToken.decimals,
              sinceTimestamp,
              ...(untilTimestamp ? { untilTimestamp } : {}),
            },
            {
              type: 'const',
              value: legacyToken.premint,
              decimals: legacyToken.decimals,
              sinceTimestamp,
              ...(untilTimestamp ? { untilTimestamp } : {}),
            },
          ],
        }
      } else {
        amountFormula = {
          type: 'totalSupply',
          address: legacyToken.address,
          chain: project.id,
          decimals: legacyToken.decimals,
          sinceTimestamp,
          ...(untilTimestamp ? { untilTimestamp } : {}),
        }
      }

      break

    case 'circulatingSupply':
      assert(legacyToken.address, 'Native asset not supported')
      amountFormula = {
        type: 'circulatingSupply',
        apiId: legacyToken.coingeckoId,
        decimals: legacyToken.decimals ?? 0,
        sinceTimestamp,
        ...(untilTimestamp ? { untilTimestamp } : {}),
        address: legacyToken.address,
        chain: legacyToken.chainName,
      }
      break

    default:
      throw new Error(`Unsupported supply type ${legacyToken.supply}`)
  }

  return {
    mode: 'auto',
    id,
    priceId: legacyToken.coingeckoId,
    symbol: legacyToken.symbol,
    name: legacyToken.name,
    iconUrl: legacyToken.iconUrl,
    amount: amountFormula,
    category: legacyToken.category,
    source: legacyToken.source,
    isAssociated: !!project.tvlConfig.associatedTokens?.includes(
      legacyToken.symbol,
    ),
  }
}

function getChain(name: string, chains: Map<string, ChainConfig>): ChainConfig {
  const chain = chains.get(name)
  assert(chain)
  return chain
}

function deduplicateTokens(tokens: TvsToken[]) {
  const byId = groupBy(tokens, 'id')

  const deduplicatedTokens: TvsToken[] = []

  for (const [id, tokensWithSameId] of Object.entries(byId)) {
    if (tokensWithSameId.length > 1) {
      tokensWithSameId.forEach((token, index) => {
        const newToken = { ...token }
        newToken.id = TokenId(`${id}-${index + 1}`)
        deduplicatedTokens.push(newToken)
      })
    } else {
      deduplicatedTokens.push(tokensWithSameId[0])
    }
  }
  return deduplicatedTokens
}

function mergeTokensWithSameId(
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: Map<string, ChainConfig>,
  sameIdTokens: (LegacyToken & { escrow: ProjectTvlEscrow })[],
): TvsToken {
  if (sameIdTokens.length === 1) {
    const tokenData = sameIdTokens[0]
    const chain = getChain(tokenData.chainName, chains)
    const token = createEscrowToken(project, tokenData.escrow, chain, tokenData)

    return token
  }
  const amounts = []
  const valueForSummary: (CalculationFormula | ValueFormula)[] = []
  let customValueForSummaryExists = false

  for (const tokenData of sameIdTokens) {
    const chain = getChain(tokenData.chainName, chains)
    const token = createEscrowToken(project, tokenData.escrow, chain, tokenData)
    amounts.push(token.amount)

    if (token.valueForSummary) {
      customValueForSummaryExists = true
      valueForSummary.push(token.valueForSummary)
    } else {
      valueForSummary.push({
        type: 'value',
        priceId: token.priceId,
        amount: token.amount,
      })
    }
  }

  const firstTokenData = sameIdTokens[0]
  const chain = getChain(firstTokenData.chainName, chains)
  const baseToken = createEscrowToken(
    project,
    firstTokenData.escrow,
    chain,
    firstTokenData,
  )

  return {
    ...baseToken,
    amount: {
      type: 'calculation',
      operator: 'sum',
      arguments: amounts,
    },
    ...(customValueForSummaryExists
      ? {
          valueForSummary: {
            type: 'calculation',
            operator: 'sum',
            arguments: valueForSummary,
          },
        }
      : {}),
  }
}
