import type {
  Bridge,
  DaProject,
  Layer2,
  Layer3,
  ProjectEscrow,
  ReferenceLink,
  ScalingProjectContract,
  ScalingProjectContracts,
} from '@l2beat/config'
import { CONTRACTS, layer2s } from '@l2beat/config'
import type {
  ContractsVerificationStatuses,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'
import { concat } from 'lodash'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import type { DaSolution } from '~/server/features/scaling/project/get-scaling-project-da-solution'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import type { ContractsSectionProps } from '../../../components/projects/sections/contracts/contracts-section'
import { toTechnologyRisk } from '../risk-summary/to-technology-risk'
import { getChain } from './get-chain'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  id: string
  slug: string
  isUnderReview?: boolean
  isVerified: boolean
  architectureImage?: string
  contracts: ScalingProjectContracts
  daSolution?: DaSolution
  escrows: ProjectEscrow[] | undefined
} & (
  | {
      type: (Layer2 | Bridge | DaProject)['type']
    }
  | {
      type: Layer3['type']
      hostChain: string
    }
)

type ContractsSection = Omit<
  ContractsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

export function getContractsSection(
  projectParams: ProjectParams,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  projectsChangeReport: ProjectsChangeReport,
): ContractsSection | undefined {
  if (
    projectParams.contracts.addresses.length === 0 &&
    projectParams.daSolution?.contracts?.length === 0
  ) {
    return undefined
  }
  const projectChangeReport = projectsChangeReport?.projects[projectParams.id]

  const contracts = projectParams.contracts.addresses.map((contract) => {
    const isUnverified = isContractUnverified(
      contract,
      contractsVerificationStatuses,
    )

    return makeTechnologyContract(
      contract,
      projectParams,
      isUnverified,
      contractsVerificationStatuses,
      projectChangeReport,
    )
  })

  const nativeContracts = Object.fromEntries(
    Object.entries(projectParams.contracts.nativeAddresses ?? {}).map(
      ([chainName, contracts]) => {
        return [
          slugToDisplayName(chainName),
          contracts.map((contract) => {
            const isUnverified = isContractUnverified(
              contract,
              contractsVerificationStatuses,
            )

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

  const daSolution =
    projectParams.daSolution?.contracts &&
    projectParams.daSolution.contracts.length !== 0
      ? {
          layerName: projectParams.daSolution?.layerName,
          bridgeName: projectParams.daSolution?.bridgeName,
          hostChain: slugToDisplayName(projectParams.daSolution?.hostChain),
          contracts: projectParams.daSolution.contracts.flatMap((contract) => {
            const isUnverified = isContractUnverified(
              contract,
              contractsVerificationStatuses,
            )

            return makeTechnologyContract(
              contract,
              projectParams,
              isUnverified,
              contractsVerificationStatuses,
              projectChangeReport,
            )
          }),
        }
      : undefined

  const escrows =
    projectParams.escrows
      ?.filter((escrow) => escrow.contract && !escrow.isHistorical)
      .sort(moreTokensFirst)
      .map((escrow) => {
        const isUnverified = isEscrowUnverified(
          escrow,
          contractsVerificationStatuses,
        )
        const contract = escrowToProjectContract(escrow)

        return makeTechnologyContract(
          contract,
          projectParams,
          isUnverified,
          contractsVerificationStatuses,
          projectChangeReport,
          true,
        )
      }) ?? []

  const risks = projectParams.contracts.risks.map(toTechnologyRisk)

  /*
    TODO: isVerified should not be required after https://linear.app/l2beat/issue/L2B-6497/refactor-verification-status is done
    That's because contractsVerificationStatuses should only contain the verification status of the contracts that are actually used in the project thus you can derive isVerified from that.
  */
  if (projectParams.isVerified === false) {
    risks.push({
      text: `${CONTRACTS.UNVERIFIED_RISK.category} ${CONTRACTS.UNVERIFIED_RISK.text}`,
      isCritical: !!CONTRACTS.UNVERIFIED_RISK.isCritical,
    })
  }

  const getL3HostChain = (hostChain: string) => {
    return layer2s.find((l2) => l2.id === hostChain)?.display.name ?? 'Unknown'
  }

  const chainName =
    projectParams.type === 'layer3'
      ? getL3HostChain(projectParams.hostChain)
      : 'Ethereum'

  return {
    chainName,
    nativeContracts,
    contracts,
    escrows,
    risks,
    diagram: getDiagramParams(
      'architecture',
      projectParams.architectureImage ?? projectParams.slug,
    ),
    references: projectParams.contracts?.references ?? [],
    isIncomplete: projectParams.contracts?.isIncomplete,
    isUnderReview:
      projectParams.isUnderReview ?? projectParams.contracts?.isUnderReview,
    daSolution,
  }
}

function makeTechnologyContract(
  item: ScalingProjectContract,
  projectParams: ProjectParams,
  isUnverified: boolean,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
  isEscrow?: boolean,
): TechnologyContract {
  const chain = getChain(projectParams, item)
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

  const tokens = projectParams.escrows?.find(
    (x) => x.address === item.address,
  )?.tokens
  // if contract is an escrow we already tweak it's name so we don't need to add this
  if (tokens && !isEscrow) {
    const tokenText =
      tokens === '*'
        ? 'This contract can store any token.'
        : `This contract stores the following tokens: ${tokens.join(', ')}.`
    if (!description) {
      description = tokenText
    } else {
      description += ' ' + tokenText
    }
  }

  const changes = (
    projectChangeReport !== undefined ? Object.values(projectChangeReport) : []
  ).flat()
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

  const usedInProjects = getUsedInProjects(
    projectParams,
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

function isEscrowUnverified(
  escrow: ProjectEscrow,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): boolean {
  const chain = escrow.contract?.chain ?? 'ethereum'
  return (
    contractsVerificationStatuses[chain]?.[escrow.address.toString()] === false
  )
}

function escrowToProjectContract(
  escrow: ProjectEscrow,
): ScalingProjectContract {
  assert(escrow.contract, 'Old escrow format used') // old format misses upgradeability info

  const genericName =
    escrow.tokens === '*'
      ? 'Generic escrow'
      : 'Escrow for ' + escrow.tokens.join(', ')
  const name = escrow.useContractName ? escrow.contract.name : genericName

  return {
    ...escrow.contract,
    name,
    address: escrow.address,
  }
}

function moreTokensFirst(a: ProjectEscrow, b: ProjectEscrow) {
  const aTokens = a.tokens === '*' ? Number.POSITIVE_INFINITY : a.tokens.length
  const bTokens = b.tokens === '*' ? Number.POSITIVE_INFINITY : b.tokens.length

  return bTokens - aTokens
}
