import {
  CONTRACTS,
  type DaBridgeContracts,
  type ScalingProjectContract,
  isSingleAddress,
} from '@l2beat/config'
import { type UsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
import {
  type ContractsVerificationStatuses,
  type EthereumAddress,
  type ImplementationChangeReportApiResponse,
  type ImplementationChangeReportProjectData,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { concat } from 'lodash'
import { type MultiChainContractsSectionProps } from '~/components/projects/sections/contracts/multichain-contracts-section'
import { type ProjectSectionProps } from '~/components/projects/sections/types'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import {
  type TechnologyContract,
  type TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import { type Reference } from '../../../components/projects/sections/reference-list'
import { toTechnologyRisk } from '../risk-summary/to-technology-risk'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  id: string
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
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
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
            const implementationChangeForProject =
              implementationChange?.projects[projectParams.id]
            return makeTechnologyContract(
              contract,
              projectParams,
              isUnverified,
              contractsVerificationStatuses,
              manuallyVerifiedContracts,
              implementationChangeForProject,
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
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportProjectData | undefined,
): TechnologyContract {
  const chain = item.chain ?? 'ethereum'

  const verificationStatusForChain = contractsVerificationStatuses[chain] ?? {}
  const manuallyVerifiedContractsForChain =
    manuallyVerifiedContracts[chain] ?? {}
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
    let unverifiedText = ''
    if (isSingleAddress(item) || item.multipleAddresses.length === 1) {
      unverifiedText = CONTRACTS.UNVERIFIED_DESCRIPTION
    } else if (
      areAllAddressesUnverified(
        item.multipleAddresses,
        verificationStatusForChain,
      )
    ) {
      unverifiedText = CONTRACTS.UNVERIFIED_DESCRIPTION_ALL
    } else {
      unverifiedText = CONTRACTS.UNVERIFIED_DESCRIPTION_SOME
    }

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

  const changedAddresses = (
    implementationChange !== undefined
      ? Object.values(implementationChange)
      : []
  ).flat()

  const implementationHasChanged = changedAddresses.some((ca) =>
    addresses.map((a) => a.address).includes(ca.containingContract.toString()),
  )

  const additionalReferences: Reference[] = []
  addresses.forEach((address) => {
    const manuallyVerified = manuallyVerifiedContractsForChain[address.address]
    if (manuallyVerified) {
      additionalReferences.push({
        text: 'Source code',
        href: manuallyVerified,
      })
    }
  })

  if (isSingleAddress(item)) {
    const mainAddresses = getContractMainAddresses(item, getAddress)
    const implementationAddresses =
      item.upgradeability?.implementations.map((implementation) =>
        getAddress({ address: implementation }),
      ) ?? []

    const usedInProjects = getUsedInProjects(
      { ...projectParams, type: 'DaLayer' },
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
      implementationHasChanged,
      upgradeableBy: item.upgradableBy,
      upgradeDelay: item.upgradeDelay,
      upgradeConsiderations: item.upgradeConsiderations,
    }
  }

  return {
    name: item.name,
    addresses,
    description,
    usedInProjects: [],
    references: additionalReferences,
    chain,
    implementationHasChanged,
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
  const addresses = getContractMainAddresses(contract, getAddress)

  if (isSingleAddress(contract)) {
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
  }
  return addresses
}

function getContractMainAddresses(
  contract: ScalingProjectContract,
  getAddress: (opts: {
    address: EthereumAddress
    name?: string
    isAdmin?: boolean
  }) => TechnologyContractAddress,
): TechnologyContractAddress[] {
  return isSingleAddress(contract)
    ? [
        getAddress({
          address: contract.address,
        }),
      ]
    : [
        ...contract.multipleAddresses.map((address) =>
          getAddress({
            address: address,
          }),
        ),
      ]
}

function isContractUnverified(
  contract: ScalingProjectContract,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): boolean {
  const chain = contract.chain ?? 'ethereum'
  if (isSingleAddress(contract)) {
    return (
      contractsVerificationStatuses[chain]?.[contract.address.toString()] ===
      false
    )
  }

  return contract.multipleAddresses.some(
    (address) =>
      contractsVerificationStatuses[chain]?.[address.toString()] === false,
  )
}

function areAllAddressesUnverified(
  addresses: EthereumAddress[],
  verificationStatus: Partial<Record<string, boolean>>,
) {
  return addresses.every((address) => {
    return verificationStatus[address.toString()] === false
  })
}
