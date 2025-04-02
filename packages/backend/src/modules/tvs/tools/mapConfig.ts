import type { Logger } from '@l2beat/backend-tools'
import {
  type AggLayerEscrow,
  type AmountFormula,
  type CalculationFormula,
  type ChainConfig,
  type ElasticChainEscrow,
  type Project,
  ProjectService,
  type ProjectTvlEscrow,
  type TvsToken,
  type ValueFormula,
} from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import { assert, TokenId } from '@l2beat/shared-pure'
import type { Token as LegacyToken } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { getAggLayerTokens } from '../providers/aggLayer'
import { getElasticChainTokens } from '../providers/elasticChain'
import type { ProjectTvsConfig } from '../types'
import { getTimestampsRange } from './timestamps'

export async function mapConfig(
  project: Project<'tvlConfig', 'chainConfig'>,
  logger: Logger,
  rpcClient?: RpcClient,
): Promise<ProjectTvsConfig> {
  const CHAINS = await getChains()
  const getChain = (name: string) => {
    const chain = CHAINS.get(name)
    assert(chain)
    return chain
  }

  const tokens: TvsToken[] = []

  for (const legacyToken of project.tvlConfig.tokens) {
    tokens.push(createToken(project, legacyToken))
  }

  const sharedEscrows = project.tvlConfig.escrows.filter((e) => e.sharedEscrow)
  for (const escrow of sharedEscrows) {
    assert(escrow.sharedEscrow)
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
  }

  const bySource = groupBy(
    project.tvlConfig.escrows
      .filter((e) => !e.sharedEscrow)
      .map((e) => ({
        ...e,
        source: e.source ?? 'canonical',
      })),
    'source',
  )

  for (const e of Object.values(bySource)) {
    const t = e.flatMap((e) => e.tokens.map((t) => ({ ...t, escrow: e })))
    const tt = groupBy(t, 'symbol')

    for (const ttt of Object.values(tt)) {
      const aa = groupBy(ttt, 'coingeckoId')

      for (const aaa of Object.values(aa)) {
        const chain = getChain(aaa[0].chainName)

        if (aaa.length === 1) {
          const token = createEscrowToken(project, aaa[0].escrow, chain, aaa[0])

          tokens.push(token)
        } else {
          const amounts = []
          const valueForSummary = []
          for (const aaaa of aaa) {
            const token = createEscrowToken(project, aaaa.escrow, chain, aaaa)
            amounts.push(token.amount)
            if (token.valueForSummary) {
              valueForSummary.push(token.valueForSummary)
            }
          }

          const token = createEscrowToken(project, aaa[0].escrow, chain, aaa[0])

          tokens.push({
            ...token,
            amount: {
              type: 'calculation',
              operator: 'sum',
              arguments: amounts,
            },
            ...(valueForSummary.length > 0
              ? {
                  valueForSummary:
                    valueForSummary.length > 1
                      ? {
                          type: 'calculation',
                          operator: 'sum',
                          arguments: valueForSummary,
                        }
                      : valueForSummary[0],
                }
              : {}),
          })
        }
      }
    }
  }

  return {
    projectId: project.id,
    tokens,
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

  const { sinceTimestamp, untilTimestamp } = getTimestampsRange(
    legacyToken,
    escrow,
    chainOfEscrow,
  )

  if (legacyToken.isPreminted) {
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
  let amountFormula: AmountFormula

  const { sinceTimestamp, untilTimestamp } = getTimestampsRange(
    legacyToken,
    project.chainConfig,
  )

  switch (legacyToken.supply) {
    case 'totalSupply':
      assert(legacyToken.address, 'Only tokens have total supply')
      amountFormula = {
        type: 'totalSupply',
        address: legacyToken.address,
        chain: project.id,
        decimals: legacyToken.decimals,
        sinceTimestamp,
        ...(untilTimestamp ? { untilTimestamp } : {}),
      }

      break

    case 'circulatingSupply':
      amountFormula = {
        type: 'circulatingSupply',
        apiId: legacyToken.coingeckoId,
        decimals: legacyToken.decimals ?? 0,
        sinceTimestamp,
        ...(untilTimestamp ? { untilTimestamp } : {}),
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
    amount: amountFormula,

    category: legacyToken.category,
    source: legacyToken.source,
    isAssociated: !!project.tvlConfig.associatedTokens?.includes(
      legacyToken.symbol,
    ),
  }
}

async function getChains() {
  const ps = new ProjectService()
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  return new Map(chains.map((c) => [c.name, c]))
}
