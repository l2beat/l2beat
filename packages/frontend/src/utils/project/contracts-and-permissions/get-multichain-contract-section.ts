import type {
  DaBridgeContracts,
  ReferenceLink,
  ScalingProjectContract,
  UsedInProject,
} from '@l2beat/config'
import { CONTRACTS } from '@l2beat/config'
import type {
  ContractsVerificationStatuses,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { concat } from 'lodash'
import type { MultiChainContractsSectionProps } from '~/components/projects/sections/contracts/multichain-contracts-section'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import { toTechnologyRisk } from '../risk-summary/to-technology-risk'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  id?: string
  slug: string
  isUnderReview?: boolean
  isVerified: boolean
  architectureImage?: string
  contracts: DaBridgeContracts
  dacUsedIn?: UsedInProject
}

type MultiChainContractsSection = Omit<
  MultiChainContractsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

export function getMultiChainContractsSection(
  projectParams: ProjectParams,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  projectsChangeReport: ProjectsChangeReport | undefined,
): MultiChainContractsSection | undefined {
  const hasAnyContracts = Object.values(projectParams.contracts.addresses).some(
    (contracts) => contracts.length > 0,
  )

  if (!hasAnyContracts) {
    return undefined
  }

  const contracts = Object.fromEntries(
    Object.entries(projectParams.contracts.addresses ?? {}).map(
      ([chainName, contracts]) => {
        return [
          slugToDisplayName(chainName),
          contracts.map((contract) => {
            const isUnverified = isContractUnverified(
              contract,
              contractsVerificationStatuses,
            )
            const projectChangeReport = projectParams.id
              ? projectsChangeReport?.projects[projectParams.id]
              : undefined
            return makeTechnologyContract(
              contract,
              projectParams,
              isUnverified,
              contractsVerificationStatuses,
              projectChangeReport,
            )
          }),
        ]
      },
    ),
  )

  const risks = projectParams.contracts.risks.map(toTechnologyRisk)

  if (projectParams.isVerified === false) {
    risks.push({
      text: `${CONTRACTS.UNVERIFIED_RISK.category} ${CONTRACTS.UNVERIFIED_RISK.text}`,
      isCritical: !!CONTRACTS.UNVERIFIED_RISK.isCritical,
    })
  }

  return {
    contracts,
    risks,
    diagram: getDiagramParams(
      'architecture',
      projectParams.architectureImage ?? projectParams.slug,
    ),
    references: projectParams.contracts?.references ?? [],
    isIncomplete: projectParams.contracts?.isIncomplete,
    isUnderReview:
      projectParams.isUnderReview ?? projectParams.contracts?.isUnderReview,
    dacUsedIn: projectParams.dacUsedIn,
  }
}

function makeTechnologyContract(
  item: ScalingProjectContract,
  projectParams: ProjectParams,
  isUnverified: boolean,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
): TechnologyContract {
  const chain = item.chain ?? 'ethereum'

  const verificationStatusForChain = contractsVerificationStatuses[chain] ?? {}
  const etherscanUrl = getExplorerUrl(chain)

  const getAddress = (opts: {
    address: EthereumAddress
    name?: string
    isAdmin?: boolean
  }) => {
    const name =
      opts.name ?? `${opts.address.slice(0, 6)}…${opts.address.slice(38, 42)}`

    return {
      name: name,
      address: opts.address.toString(),
      verificationStatus: toVerificationStatus(
        verificationStatusForChain[opts.address.toString()],
      ),
      href: `${etherscanUrl}/address/${opts.address.toString()}#code`,
      isAdmin: !!opts.isAdmin,
    }
  }
  const addresses = getAddresses(item, getAddress)

  let description = item.description

  if (isUnverified) {
    const unverifiedText = CONTRACTS.UNVERIFIED_DESCRIPTION

    if (!description) {
      description = unverifiedText
    } else {
      description += ' ' + unverifiedText
    }
  }

  const areImplementationsUnverified = addresses
    .filter((c) => !c.isAdmin && c.verificationStatus !== 'unverified')
    .map((c) => verificationStatusForChain[c.address])
    .some((c) => c === false)

  if (areImplementationsUnverified) {
    if (!description) {
      description = CONTRACTS.UNVERIFIED_IMPLEMENTATIONS_DESCRIPTION
    } else {
      description += ' ' + CONTRACTS.UNVERIFIED_IMPLEMENTATIONS_DESCRIPTION
    }
  }

  const changes =
    projectChangeReport !== undefined ? Object.values(projectChangeReport) : []
  const implementationChangeAddresses = changes.flatMap((c) =>
    c.implementations.map((i) => i.containingContract.toString()),
  )
  const highSeverityFieldChangeAddresses = changes.flatMap((c) =>
    c.fieldHighSeverityChanges.map((i) => i.address.toString()),
  )

  const implementationChanged = implementationChangeAddresses.some(
    (changedAddress) =>
      addresses.map((a) => a.address).includes(changedAddress),
  )
  const highSeverityFieldChanged = highSeverityFieldChangeAddresses.some(
    (changedAddress) =>
      addresses.map((a) => a.address).includes(changedAddress),
  )

  const additionalReferences: ReferenceLink[] = []
  const mainAddresses = [getAddress({ address: item.address })]
  const implementationAddresses =
    item.upgradeability?.implementations.map((implementation) =>
      getAddress({ address: implementation }),
    ) ?? []

  // TODO: Investigate, this is currently doing NOTHING!
  const usedInProjects = getUsedInProjects(
    { id: '', ...projectParams, type: 'DaLayer' },
    mainAddresses,
    implementationAddresses,
  )

  return {
    name: item.name,
    addresses,
    description,
    usedInProjects,
    references: concat(item.references ?? [], additionalReferences),
    chain,
    implementationChanged,
    highSeverityFieldChanged,
    upgradeableBy: item.upgradableBy,
    upgradeDelay: item.upgradeDelay,
    upgradeConsiderations: item.upgradeConsiderations,
  }
}

function getAddresses(
  contract: ScalingProjectContract,
  getAddress: (opts: {
    address: EthereumAddress
    name?: string
    isAdmin?: boolean
  }) => TechnologyContractAddress,
): TechnologyContractAddress[] {
  const addresses = [getAddress({ address: contract.address })]

  const implementations = contract.upgradeability?.implementations ?? []
  for (const [i, implementation] of implementations.entries()) {
    const upgradable = !contract.upgradeability?.immutable
    const upgradeableText = upgradable ? ' (Upgradable)' : ''
    addresses.push(
      getAddress({
        name:
          implementations.length > 1
            ? `Implementation #${i + 1}${upgradeableText}`
            : `Implementation${upgradeableText}`,
        address: implementation,
      }),
    )
  }

  const admins = contract.upgradeability?.admins ?? []
  for (const [i, admin] of admins.entries()) {
    addresses.push(
      getAddress({
        name: admins.length > 1 ? `Admin (${i + 1})` : 'Admin',
        address: admin,
        isAdmin: true,
      }),
    )
  }

  return addresses
}

function isContractUnverified(
  contract: ScalingProjectContract,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): boolean {
  const chain = contract.chain ?? 'ethereum'
  return (
    contractsVerificationStatuses[chain]?.[contract.address.toString()] ===
    false
  )
}
