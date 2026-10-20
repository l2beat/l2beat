import type { ChainConfig, Formula, ProjectContract } from '@l2beat/config'
import {
  assertUnreachable,
  ChainSpecificAddress,
  type UnixTime,
} from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'
import type { Address } from './extractAddressesFromTokenConfig'

export type AddressData = {
  address: string
  url?: string
  name?: string
}

// Ik its ugly but it works and is type safe
export type FormulaWithMeta =
  | (Extract<Formula, { type: 'balanceOfEscrow' | 'starknetBalanceOf' }> & {
      addressMeta: AddressData
      escrowAddressMeta: AddressData
    })
  | (Omit<Extract<Formula, { type: 'calculation' }>, 'arguments'> & {
      arguments: FormulaWithMeta[]
    })
  | (Omit<Extract<Formula, { type: 'balanceOfEscrows' }>, 'escrowAddresses'> & {
      addressMeta: AddressData
      escrowCount: number
    })
  | (Extract<
      Formula,
      {
        type: 'circulatingSupply' | 'totalSupply' | 'starknetTotalSupply'
      }
    > & {
      addressMeta: AddressData
    })
  | (Omit<Extract<Formula, { type: 'value' }>, 'amount'> & {
      amount: FormulaWithMeta
    })
  | Extract<Formula, { type: 'const' }>

export function withExplorerUrl(
  formula: Formula,
  chains: ChainConfig[],
  projectContracts: Record<string, ProjectContract[]> | undefined,
): FormulaWithMeta {
  switch (formula.type) {
    case 'balanceOfEscrow':
    case 'starknetBalanceOf': {
      return {
        ...formula,
        escrowAddressMeta: processAddress(
          {
            address: formula.escrowAddress,
            chain: formula.chain,
          },
          chains,
          projectContracts,
        ),
        addressMeta: processAddress(
          {
            address: formula.address,
            chain: formula.chain,
          },
          chains,
          projectContracts,
        ),
      }
    }
    case 'calculation':
      return {
        ...formula,
        arguments: formula.arguments.map((arg) =>
          withExplorerUrl(arg, chains, projectContracts),
        ),
      }
    case 'balanceOfEscrows': {
      const { escrowAddresses, ...rest } = formula
      return {
        ...rest,
        escrowCount: escrowAddresses.length,
        addressMeta: processAddress(
          {
            address: formula.address,
            chain: formula.chain,
          },
          chains,
          projectContracts,
        ),
      }
    }
    case 'circulatingSupply':
    case 'totalSupply':
    case 'starknetTotalSupply': {
      return {
        ...formula,
        addressMeta: processAddress(
          {
            address: formula.address,
            chain: formula.chain,
          },
          chains,
          projectContracts,
        ),
      }
    }
    case 'value':
      return {
        ...formula,
        amount: withExplorerUrl(formula.amount, chains, projectContracts),
      }
    case 'const':
      return formula
    default:
      assertUnreachable(formula)
  }
}

export function processAddresses(
  addresses: Address[],
  chains: ChainConfig[],
  projectContracts: Record<string, ProjectContract[]> | undefined,
): AddressData | 'multiple' | undefined {
  if (addresses.length > 1) {
    return 'multiple'
  }
  if (addresses.length === 1 && addresses[0]) {
    const address = addresses[0]
    return processAddress(address, chains, projectContracts)
  }
  return undefined
}

function processAddress(
  address: Address,
  chains: ChainConfig[],
  projectContracts: Record<string, ProjectContract[]> | undefined,
): AddressData {
  const contractName = projectContracts?.[address.chain]?.find(
    (c) =>
      ChainSpecificAddress.address(c.address).toLowerCase() ===
      address.address.toLowerCase(),
  )?.name
  const explorer = chains.find((c) => c.name === address.chain)?.explorerUrl

  return {
    address: address.address,
    url: explorer ? `${explorer}/address/${address.address}` : undefined,
    name: contractName,
  }
}

export function getSyncStatus(
  valueTimestamp: UnixTime,
  targetTimestamp: UnixTime,
) {
  if (valueTimestamp < targetTimestamp) {
    return `No token data since ${formatTimestamp(valueTimestamp, {
      mode: 'datetime',
      longMonthName: true,
    })}.`
  }
}
