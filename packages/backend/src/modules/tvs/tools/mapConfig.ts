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
import { getAggLayerTokens } from '../providers/aggLayer'
import { getElasticChainTokens } from '../providers/elasticChain'
import {
  type AmountFormula,
  type CalculationFormula,
  type ProjectTvsConfig,
  type Token,
  TokenId,
  type ValueFormula,
} from '../types'
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

  const tokens: Token[] = []
  const escrowTokens: Map<
    string,
    {
      token: Token
      chain: string
    }
  > = new Map()

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
        aggLayerL2Tokens.forEach((token) =>
          escrowTokens.set(token.id, { token, chain: escrow.chain }),
        )
      }

      if (escrow.sharedEscrow.type === 'ElasticChain') {
        logger.info(`Querying for ElasticChain L2 tokens addresses`)

        const elasticChainTokens = await getElasticChainTokens(
          project,
          escrow as ProjectTvlEscrow & { sharedEscrow: ElasticChainEscrow },
          chainOfL1Escrow,
          rpcClient,
        )
        elasticChainTokens.forEach((token) =>
          escrowTokens.set(token.id, { token, chain: escrow.chain }),
        )
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
          escrowTokens.set(token.id, { token, chain: escrow.chain })
          continue
        }

        if (previousToken?.token.amount.type === 'balanceOfEscrow') {
          assert(previousToken.token.source === token.source, `Source mismatch`)
          escrowTokens.set(token.id, {
            token: {
              ...previousToken.token,
              amount: {
                type: 'calculation',
                operator: 'sum',
                arguments: [previousToken.token.amount, token.amount],
              },
            },
            chain: escrow.chain,
          })
          continue
        }

        if (previousToken.token.amount.type === 'calculation') {
          escrowTokens.set(token.id, {
            token: {
              ...previousToken.token,
              amount: {
                ...(previousToken.token.amount as CalculationFormula),
                arguments: [
                  ...(previousToken.token.amount as CalculationFormula)
                    .arguments,
                  token.amount,
                ],
              },
            },
            chain: escrow.chain,
          })
          continue
        }
      }
    }
  }

  for (const legacyToken of project.tvlConfig.tokens) {
    tokens.push(createToken(project, legacyToken))
  }

  const uniqueTokens: Map<string, Token> = new Map()

  for (const token of tokens) {
    uniqueTokens.set(token.id, token)
  }

  for (const { token, chain } of Array.from(escrowTokens.values())) {
    if (!uniqueTokens.has(token.id)) {
      uniqueTokens.set(token.id, token)
    } else {
      const suffix = `.${chain}`
      uniqueTokens.set(TokenId(token.id + suffix), {
        ...token,
        id: TokenId(token.id + suffix),
        symbol: token.symbol + suffix,
        displaySymbol: token.symbol,
      })
    }
  }

  return {
    projectId: project.id,
    tokens: Array.from(uniqueTokens.values()),
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

  const source = escrow.source ?? 'canonical'
  const symbol =
    source === 'external' ? legacyToken.symbol + '.ext' : legacyToken.symbol
  const displaySymbol = source === 'external' ? legacyToken.symbol : undefined

  const id = TokenId.create(project.id, symbol)

  let valueForTotal: CalculationFormula | ValueFormula | undefined = undefined
  if (escrow.chain !== 'ethereum') {
    valueForTotal = {
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
    symbol,
    ...(displaySymbol ? { displaySymbol } : {}),
    name: legacyToken.name,
    amount: amountFormula,
    ...(valueForTotal ? { valueForTotal } : {}),

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
