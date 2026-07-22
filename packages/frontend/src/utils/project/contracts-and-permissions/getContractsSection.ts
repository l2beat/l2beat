import type {
  Project,
  ProjectContract,
  ProjectContracts,
  ProjectEscrow,
  ReferenceLink,
  TvsToken,
} from '@l2beat/config'
import type { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getDiagramParams } from '~/utils/project/getDiagramParams'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { TechnologyContract } from '../../../components/projects/sections/ContractEntry'
import type { ContractsSectionProps } from '../../../components/projects/sections/contracts/ContractsSection'
import { toTechnologyRisk } from '../risk-summary/toTechnologyRisk'
import type { ContractUtils } from './getContractUtils'
import { getPastUpgradesData } from './getPastUpgradesData'
import { getProgramHashes } from './getProgramHashes'
import { getTechnologyContractAddresses } from './getTechnologyContractAddresses'

type ProjectParams = {
  id: ProjectId
  slug: string
  isUnderReview?: boolean
  architectureImage?: string
  contracts?: ProjectContracts
  tvsConfig?: TvsToken[]
}

export type ContractsSection = Omit<
  ContractsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

export function getContractsSection(
  projectParams: ProjectParams,
  contractUtils: ContractUtils,
  projectsChangeReport: ProjectsChangeReport,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  allProjects: Project<'contracts'>[],
  tvs: SevenDayTvsBreakdown,
): ContractsSection | undefined {
  if (!projectParams.contracts) {
    return undefined
  }
  const activeEscrows =
    projectParams.contracts.escrows?.filter(
      (escrow) => escrow.contract && !escrow.isHistorical,
    ) ?? []

  if (
    Object.values(projectParams.contracts.addresses).flat().length === 0 &&
    activeEscrows.length === 0
  ) {
    return undefined
  }
  const projectChangeReport = projectParams.id
    ? projectsChangeReport?.projects[projectParams.id]
    : undefined

  const escrowTokenIconMap = getEscrowTokenIconMap(projectParams.tvsConfig)
  const escrows = activeEscrows.sort(moreTokensFirst)
  const escrowsByAddress = new Map(
    escrows.map((escrow) => [
      getEscrowKey(escrow.chain, escrow.address),
      getEscrowDetails(escrow, escrowTokenIconMap),
    ]),
  )
  const matchedEscrows = new Set<string>()

  const contracts = Object.fromEntries(
    Object.entries(projectParams.contracts.addresses ?? {}).map(
      ([chainName, contracts]) => {
        const technologyContracts = contracts.map((contract) => {
          const escrowKey = getEscrowKey(
            chainName,
            ChainSpecificAddress.address(contract.address),
          )
          const escrow = escrowsByAddress.get(escrowKey)
          if (escrow) {
            matchedEscrows.add(escrowKey)
          }
          return [
            contract,
            makeTechnologyContract(
              contract,
              projectParams,
              projectChangeReport,
              contractUtils,
              escrow,
            ),
          ] as const
        })
        return [
          contractUtils.getChainName(chainName),
          groupTechnologyContracts(technologyContracts),
        ]
      },
    ),
  )

  for (const escrow of escrows) {
    const escrowKey = getEscrowKey(escrow.chain, escrow.address)
    if (matchedEscrows.has(escrowKey)) {
      continue
    }

    const chainName = contractUtils.getChainName(escrow.chain)
    const chainContracts = contracts[chainName] ?? []
    const escrowDetails = escrowsByAddress.get(escrowKey)
    assert(escrowDetails, 'Escrow details should exist for active escrows')

    const contract = escrowToProjectContract(escrow)

    contracts[chainName] = [
      ...chainContracts,
      makeTechnologyContract(
        contract,
        projectParams,
        projectChangeReport,
        contractUtils,
        escrowDetails,
      ),
    ]
  }

  const risks = projectParams.contracts.risks.map(toTechnologyRisk)

  return {
    contracts,
    escrows: [],
    risks,
    diagram: getDiagramParams(
      'architecture',
      projectParams.architectureImage ?? projectParams.slug,
    ),
    isUnderReview: projectParams.isUnderReview,
    programHashes: getProgramHashes(
      projectParams.contracts.programHashes,
      zkCatalogProjects,
      allProjects,
      tvs,
    ),
    programHashesDescription: projectParams.contracts.programHashesDescription,
  }
}

function makeTechnologyContract(
  item: ProjectContract,
  projectParams: ProjectParams,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
  contractUtils: ContractUtils,
  escrow?: TechnologyContract['escrow'],
): TechnologyContract {
  const chain = item.chain
  // TODO: sz-piotr: This here is just a stepping stone. Ideally none of this
  // weird logic would exist here. Instead you'd already have the items you want
  // to display already pre-processed in config
  const explorerUrl = item.url
    ? new URL(item.url).origin
    : 'https://etherscan.io'
  const { addresses, admins } = getTechnologyContractAddresses(
    item,
    projectChangeReport,
  )

  let description = item.description

  if (!item.isVerified) {
    let text = 'The source code of this contract is not verified on Etherscan.'
    if (addresses[0]?.verificationStatus === 'became-verified') {
      text =
        'The source code of this contract was recently verified. It is under review.'
    }
    if (!description) {
      description = text
    } else {
      description += ' ' + text
    }
  }

  const changes = Object.values(projectChangeReport ?? {}).flat()
  const impactfulChangeAddresses = changes.flatMap((c) =>
    c.implementationChange
      .concat(c.highSeverityFieldChange)
      .concat(c.ultimateUpgraderChange),
  )

  const impactfulChange = impactfulChangeAddresses.some((changedAddress) =>
    addresses.map((a) => a.address).includes(changedAddress),
  )

  const additionalReferences: ReferenceLink[] = []
  const usedInProjects = uniqBy(
    [
      item.address,
      ...(item.upgradeability?.implementations.map((x) => x.address) ?? []),
    ].flatMap((address) =>
      contractUtils
        .getUsedIn(item.chain, ChainSpecificAddress.address(address))
        .filter((x) => x.id !== projectParams.id),
    ),
    'id',
  )
  const contractAddress = ChainSpecificAddress.address(item.address)
  const pastUpgrades = item.pastUpgrades?.map((upgrade) => ({
    ...upgrade,
    explorerUrl,
    proxyContract: {
      name: item.name,
      address: contractAddress,
    },
  }))

  return {
    id: item.name,
    name: item.name,
    addresses,
    admins,
    description,
    usedInProjects,
    references: (item.references ?? []).concat(additionalReferences),
    chain,
    impactfulChange,
    upgradeableBy: item.upgradableBy,
    upgradeConsiderations: item.upgradeConsiderations,
    pastUpgrades: getPastUpgradesData(pastUpgrades),
    escrow,
  }
}

// TODO(radomski): We know this is not the best place for this code, nor the
// best solution. Ideally the config package owns all data manipulation and the
// frontend only renders it. We are not doing the grouping in config because the
// config makes many assumptions that a contract entry is a single contract tied
// to a single address, so introducing grouped contracts there is not easy. The
// proper fix is to simplify the contract data schema in config and move this
// logic there. Grouping also breaks per-contract rendering that assumes a single
// address per entry (e.g. past upgrades would need smarter handling). This is
// the first iteration and we will work on this more if there is demand for it.
function groupTechnologyContracts(
  contracts: (readonly [ProjectContract, TechnologyContract])[],
): TechnologyContract[] {
  const isGroupable = ([rawContract, contract]: readonly [
    ProjectContract,
    TechnologyContract,
  ]) =>
    rawContract.upgradeability?.immutable === true &&
    (contract.pastUpgrades?.upgrades.length ?? 0) === 0 &&
    !contract.escrow &&
    !contract.impactfulChange &&
    !contract.addresses.some(
      (address) => address.verificationStatus === 'became-verified',
    )

  const groupKey = (contract: TechnologyContract) =>
    JSON.stringify({
      name: contract.name,
      description: contract.description ?? null,
      upgradeableBy: contract.upgradeableBy ?? null,
      upgradeConsiderations: contract.upgradeConsiderations ?? null,
      references: contract.references,
      usedInProjects: contract.usedInProjects ?? null,
    })

  const result: TechnologyContract[] = []
  const groupIndexByKey = new Map<string, number>()

  for (const pair of contracts) {
    const [, contract] = pair
    if (!isGroupable(pair)) {
      result.push(contract)
      continue
    }

    const key = groupKey(contract)
    const existingIndex = groupIndexByKey.get(key)
    if (existingIndex === undefined) {
      groupIndexByKey.set(key, result.length)
      result.push(contract)
      continue
    }

    const group = result[existingIndex]
    assert(group, 'Group must exist')
    result[existingIndex] = {
      ...group,
      addresses: [...group.addresses, ...contract.addresses],
      groupCount: (group.groupCount ?? 1) + 1,
    }
  }

  return result
}

function getEscrowDetails(
  escrow: ProjectEscrow,
  tokenIconMap: Map<string, string>,
): NonNullable<TechnologyContract['escrow']> {
  const isCustom = escrow.source === 'custom-canonical'

  if (escrow.tokens === '*') {
    return {
      tokens: escrow.tokens,
      tokenIcons: [],
      isCustom,
    }
  }

  return {
    tokens: escrow.tokens,
    tokenIcons: escrow.tokens.map((symbol) => ({
      symbol,
      iconUrl: tokenIconMap.get(symbol) ?? TOKEN_PLACEHOLDER_ICON_URL,
    })),
    isCustom,
  }
}

function getEscrowKey(chain: string, address: EthereumAddress | string) {
  return `${chain}:${address.toString()}`
}

function getEscrowTokenIconMap(tvsConfig?: TvsToken[]) {
  const result = new Map<string, string>()

  for (const token of tvsConfig ?? []) {
    const iconUrl = token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL

    if (!result.has(token.symbol)) {
      result.set(token.symbol, iconUrl)
    }

    if (token.displaySymbol && !result.has(token.displaySymbol)) {
      result.set(token.displaySymbol, iconUrl)
    }
  }

  return result
}

function escrowToProjectContract(escrow: ProjectEscrow): ProjectContract {
  assert(escrow.contract, 'Old escrow format used') // old format misses upgradeability info

  const genericName =
    escrow.tokens === '*'
      ? 'Generic escrow'
      : 'Escrow for ' + escrow.tokens.join(', ')
  const name = escrow.useContractName ? escrow.contract.name : genericName

  return {
    ...escrow.contract,
    name,
    address: ChainSpecificAddress.fromLong(escrow.chain, escrow.address),
  }
}

function moreTokensFirst(a: ProjectEscrow, b: ProjectEscrow) {
  const aTokens = a.tokens === '*' ? Number.POSITIVE_INFINITY : a.tokens.length
  const bTokens = b.tokens === '*' ? Number.POSITIVE_INFINITY : b.tokens.length

  return bTokens - aTokens
}
