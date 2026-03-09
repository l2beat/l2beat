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
import { manifest } from '~/utils/Manifest'
import { getDiagramParams } from '~/utils/project/getDiagramParams'
import type { TechnologyContract } from '../../../components/projects/sections/ContractEntry'
import type { ContractsSectionProps } from '../../../components/projects/sections/contracts/ContractsSection'
import { toTechnologyRisk } from '../risk-summary/toTechnologyRisk'
import type { ContractUtils } from './getContractUtils'
import { getPastUpgradesData } from './getPastUpgradesData'
import { getProgramHashes } from './getProgramHashes'
import { toVerificationStatus } from './toVerificationStatus'

type ProjectParams = {
  id: ProjectId
  slug: string
  isUnderReview?: boolean
  isVerified: boolean
  architectureImage?: string
  contracts?: ProjectContracts
  tvsConfig?: TvsToken[]
}

type ContractsSection = Omit<
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
        return [
          contractUtils.getChainName(chainName),
          contracts.map((contract) => {
            const escrowKey = getEscrowKey(
              chainName,
              ChainSpecificAddress.address(contract.address),
            )
            const escrow = escrowsByAddress.get(escrowKey)
            if (escrow) {
              matchedEscrows.add(escrowKey)
            }
            return makeTechnologyContract(
              contract,
              projectParams,
              !contract.isVerified,
              projectChangeReport,
              contractUtils,
              escrow,
            )
          }),
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
        !contract.isVerified,
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
  }
}

function makeTechnologyContract(
  item: ProjectContract,
  projectParams: ProjectParams,
  isUnverified: boolean,
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

  const mainContractBecameVerified = projectChangeReport?.[
    item.chain
  ]?.becameVerified.includes(ChainSpecificAddress.address(item.address))

  const getAddress = (opts: { address: EthereumAddress; name?: string }) => {
    const name =
      opts.name ?? `${opts.address.slice(0, 6)}…${opts.address.slice(38, 42)}`

    return {
      name: name,
      address: opts.address.toString(),
      verificationStatus: toVerificationStatus(
        !isUnverified,
        mainContractBecameVerified,
      ),
      href: `${explorerUrl}/address/${opts.address.toString()}#code`,
    }
  }

  const addresses = [
    getAddress({ address: ChainSpecificAddress.address(item.address) }),
  ]

  const implementations = item.upgradeability?.implementations ?? []
  for (const [i, implementation] of implementations.entries()) {
    const upgradable = !item.upgradeability?.immutable
    const upgradeableText = upgradable ? ' (Upgradable)' : ''
    addresses.push(
      getAddress({
        name:
          implementations.length > 1
            ? `Implementation #${i + 1}${upgradeableText}`
            : `Implementation${upgradeableText}`,
        address: ChainSpecificAddress.address(implementation),
      }),
    )
  }

  const adminAddresses = item.upgradeability?.admins ?? []
  const admins = []
  for (const [i, admin] of adminAddresses.entries()) {
    admins.push(
      getAddress({
        name: admins.length > 1 ? `Admin (${i + 1})` : 'Admin',
        address: ChainSpecificAddress.address(admin),
      }),
    )
  }

  let description = item.description

  if (isUnverified) {
    let text = 'The source code of this contract is not verified on Etherscan.'
    if (mainContractBecameVerified) {
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
    [item.address, ...(item.upgradeability?.implementations ?? [])].flatMap(
      (address) =>
        contractUtils.getUsedIn(
          projectParams.id,
          item.chain,
          ChainSpecificAddress.address(address),
        ),
    ),
    'id',
  )

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
    pastUpgrades: getPastUpgradesData(item.pastUpgrades, explorerUrl),
    escrow,
  }
}

function getEscrowDetails(
  escrow: ProjectEscrow,
  tokenIconMap: Map<string, string>,
): NonNullable<TechnologyContract['escrow']> {
  if (escrow.tokens === '*') {
    return {
      tokens: escrow.tokens,
      tokenIcons: [],
    }
  }

  return {
    tokens: escrow.tokens,
    tokenIcons: escrow.tokens.map((symbol) => ({
      symbol,
      iconUrl:
        tokenIconMap.get(symbol) ??
        manifest.getUrl('/images/token-placeholder.png'),
    })),
  }
}

function getEscrowKey(chain: string, address: EthereumAddress | string) {
  return `${chain}:${address.toString()}`
}

function getEscrowTokenIconMap(tvsConfig?: TvsToken[]) {
  const result = new Map<string, string>()

  for (const token of tvsConfig ?? []) {
    const iconUrl =
      token.iconUrl ?? manifest.getUrl('/images/token-placeholder.png')

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
