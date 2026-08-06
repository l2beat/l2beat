import { getChainConfig } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { getProvider } from '../common/GetProvider'
import { getPlainLogger } from '../common/getPlainLogger'
import { estimateTVL } from '../estimateTVL'
import type { ApiTvlResponse } from './types'

const USD_CENTS_IN_DOLLAR = 100

export async function getTvl(
  holder: ChainSpecificAddress,
): Promise<ApiTvlResponse> {
  const chainName = ChainSpecificAddress.longChain(holder)
  const chain = getChainConfig(chainName)
  const provider = await getProvider(chain.rpcUrl, chain.explorer, chainName)

  const values = await estimateTVL(getPlainLogger(), provider, holder)
  if (!values) return []

  return values
    .map((value) => ({
      tvl: Number(value.value) / USD_CENTS_IN_DOLLAR,
      ticker: value.symbol,
      iconURL: value.iconUrl,
    }))
    .sort((a, b) => b.tvl - a.tvl)
}
