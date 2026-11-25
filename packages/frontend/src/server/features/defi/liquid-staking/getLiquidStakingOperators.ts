import type {
  ProjectLiquidStakingOperators,
  ProjectStakingOperatorNameSource,
  ProjectStakingOperatorUnit,
} from '@l2beat/config'
import { shortenAddress } from '~/utils/project/contracts-and-permissions/shortenAddress'

/** Who runs a protocol's validators, as read from the beacon chain. */
export interface LiquidStakingOperators {
  /** Unix seconds of the beacon chain read. */
  timestamp: number
  /** The protocol's validators' balance, of all ETH staked on Ethereum. */
  stakedEthShare: number
  /** Every operator with an active validator, counted one by one. */
  operatorCount: number
  /** What one row stands for. */
  unit: ProjectStakingOperatorUnit
  /** The largest first. */
  operators: LiquidStakingOperator[]
}

export interface LiquidStakingOperator {
  /** A name from the protocol or the operator itself, else the shortened address. */
  name: string
  /** Set when the name is one the operator gave itself, outside the protocol. */
  nameSource?: ProjectStakingOperatorNameSource
  /** False when the row is known only by its address. */
  named: boolean
  eth: number
  validators: number
  /** Of the protocol's own validators' stake: its part of the protocol's slice. */
  protocolShare: number
  /** Of all ETH staked on Ethereum. */
  stakedEthShare: number
  /** Set when the row sums several operators, such as a module's. */
  operatorCount?: number
  /** Set on the row that sums the protocol's smallest operators. */
  rest?: boolean
}

export function getLiquidStakingOperators(
  snapshot: ProjectLiquidStakingOperators | undefined,
): LiquidStakingOperators | undefined {
  if (!snapshot || snapshot.eth === 0 || snapshot.totalEth === 0) {
    return undefined
  }
  return {
    timestamp: snapshot.timestamp,
    stakedEthShare: snapshot.eth / snapshot.totalEth,
    operatorCount: snapshot.operatorCount,
    unit: snapshot.unit,
    operators: snapshot.operators.map((operator) => {
      const named = !operator.address || operator.name !== operator.address
      return {
        name: named
          ? operator.name
          : shortenAddress(operator.address ?? operator.name),
        ...(operator.nameSource && { nameSource: operator.nameSource }),
        named,
        eth: operator.eth,
        validators: operator.validators,
        protocolShare: operator.eth / snapshot.eth,
        stakedEthShare: operator.eth / snapshot.totalEth,
        ...(operator.operatorCount !== undefined && {
          operatorCount: operator.operatorCount,
        }),
        ...(operator.rest && { rest: true }),
      }
    }),
  }
}

const UNIT_NAMES: Record<ProjectStakingOperatorUnit, [string, string]> = {
  operator: ['operator', 'operators'],
  account: ['operator account', 'operator accounts'],
  node: ['node', 'nodes'],
  vault: ['vault', 'vaults'],
}

/** E.g. "1 node", "1,339 nodes". */
export function formatOperatorUnit(
  unit: ProjectStakingOperatorUnit,
  count: number,
): string {
  const [one, many] = UNIT_NAMES[unit]
  return `${count.toLocaleString('en-US')} ${count === 1 ? one : many}`
}

export function operatorUnitName(
  unit: ProjectStakingOperatorUnit,
  plural = false,
): string {
  return UNIT_NAMES[unit][plural ? 1 : 0]
}

/** Why a name the protocol does not give can be trusted, in a few words. */
export const NAME_SOURCES: Record<ProjectStakingOperatorNameSource, string> = {
  ssv: 'Name the account gave its own SSV operators',
  'vault-metadata': "Name set by the vault's admin",
  ens: 'The account’s own ENS name',
}

/** The largest operator that is one operator, not a sum of several. */
export function getLargestOperator(
  operators: LiquidStakingOperator[],
): LiquidStakingOperator | undefined {
  return operators
    .filter((operator) => operator.operatorCount === undefined)
    .reduce<LiquidStakingOperator | undefined>(
      (largest, operator) =>
        !largest || operator.stakedEthShare > largest.stakedEthShare
          ? operator
          : largest,
      undefined,
    )
}

export interface LiquidStakingCompany {
  name: string
  stakedEthShare: number
  /** The protocols it runs validators for, the largest part first. */
  protocols: string[]
}

/**
 * The largest company across protocols: rows with the same name are one
 * company, so one that runs for Lido and ether.fi counts once. Vaults are
 * left out (a vault's name is not its operator's), as are rows that sum
 * several operators and rows known only by an address.
 */
export function getLargestCompany(
  protocols: { name: string; operators: LiquidStakingOperators }[],
): LiquidStakingCompany | undefined {
  const companies = new Map<
    string,
    { name: string; share: number; parts: Map<string, number> }
  >()
  for (const protocol of protocols) {
    if (protocol.operators.unit === 'vault') continue
    for (const operator of protocol.operators.operators) {
      if (operator.operatorCount !== undefined || !operator.named) continue
      const key = operator.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      const company = companies.get(key) ?? {
        name: operator.name,
        share: 0,
        parts: new Map<string, number>(),
      }
      company.share += operator.stakedEthShare
      company.parts.set(
        protocol.name,
        (company.parts.get(protocol.name) ?? 0) + operator.stakedEthShare,
      )
      companies.set(key, company)
    }
  }
  let largest: LiquidStakingCompany | undefined
  for (const company of companies.values()) {
    if (largest && company.share <= largest.stakedEthShare) continue
    largest = {
      name: company.name,
      stakedEthShare: company.share,
      protocols: [...company.parts]
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name),
    }
  }
  return largest
}
