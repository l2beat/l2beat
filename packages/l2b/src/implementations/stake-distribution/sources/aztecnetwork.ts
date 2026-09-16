import { v } from '@l2beat/validate'
import type { StakingDataset } from '../types'
import {
  fetchJson,
  getUrlWithParams,
  StakeAmountSchema,
  sumStake,
  toFiniteNumber,
} from './utils'

const AZTEC_PROVIDERS_URL = 'https://dashtec.xyz/api/providers'
const DEFAULT_AZTEC_PAGE_SIZE = 200

const AztecProviderSchema = v.object({
  identifier: v.string(),
  name: v.string(),
  totalStaked: StakeAmountSchema,
  metadata: v.object({ name: v.string().optional() }).optional(),
})
type AztecProvider = v.infer<typeof AztecProviderSchema>

const AztecProvidersResponseSchema = v.object({
  data: v.array(AztecProviderSchema),
  pagination: v.object({ totalPages: v.number() }).optional(),
  aggregates: v
    .object({ totalStaked: StakeAmountSchema.optional() })
    .optional(),
})

export async function fetchAztecProviders(): Promise<StakingDataset> {
  const firstPage = AztecProvidersResponseSchema.parse(
    await fetchJson(
      getUrlWithParams(AZTEC_PROVIDERS_URL, {
        page: '1',
        limit: String(DEFAULT_AZTEC_PAGE_SIZE),
      }),
    ),
  )

  const totalPages = firstPage.pagination?.totalPages ?? 1
  const remainingPages = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => index + 2,
  )
  const remainingResponses = await Promise.all(
    remainingPages.map(async (page) =>
      AztecProvidersResponseSchema.parse(
        await fetchJson(
          getUrlWithParams(AZTEC_PROVIDERS_URL, {
            page: String(page),
            limit: String(DEFAULT_AZTEC_PAGE_SIZE),
          }),
        ),
      ),
    ),
  )

  const providers = [firstPage, ...remainingResponses].flatMap(
    (response) => response.data,
  )
  const entities = providers.map((provider) => ({
    name: getAztecProviderName(provider),
    stakeBaseUnits: toFiniteNumber(
      provider.totalStaked,
      `Aztec provider ${provider.identifier} totalStaked`,
    ),
  }))

  return {
    project: 'aztecnetwork',
    displayName: 'Aztec staking',
    stakeToken: 'AZTEC',
    stakeDecimals: 18,
    totalStakeBaseUnits:
      firstPage.aggregates?.totalStaked !== undefined
        ? toFiniteNumber(
            firstPage.aggregates.totalStaked,
            'Aztec aggregates.totalStaked',
          )
        : sumStake(entities),
    entities,
  }
}

function getAztecProviderName(provider: AztecProvider): string {
  const name = provider.name.trim() || provider.metadata?.name?.trim()
  return name || `Provider ${provider.identifier}`
}
