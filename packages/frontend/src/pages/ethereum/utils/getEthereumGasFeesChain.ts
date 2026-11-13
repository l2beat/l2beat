import type { Project } from '@l2beat/config'
import type { GasFeesChain } from '~/pages/gas-fees/components/types'
import {
  FEE_SPLIT_NOTES,
  NO_PRIORITY_FEE_NOTES,
  TIP_ROLES,
} from '~/server/features/gas-fees/chains'
import { manifest } from '~/utils/Manifest'

/** Ethereum as the gas fees chart draws it, on its own */
export function getEthereumGasFeesChain(
  ethereum: Pick<Project, 'name' | 'shortName' | 'slug'>,
): GasFeesChain {
  return {
    id: 'ethereum',
    name: ethereum.name,
    shortName: ethereum.shortName,
    type: 'Layer 1',
    href: undefined,
    iconUrl: manifest.getUrl(`/icons/${ethereum.slug}.png`),
    color: 'var(--chart-ethereum)',
    noPriorityFeeNote: NO_PRIORITY_FEE_NOTES.ethereum,
    feeSplitNotes: FEE_SPLIT_NOTES.ethereum ?? {},
    tipRole: TIP_ROLES.ethereum,
  }
}
