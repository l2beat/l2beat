import type {
  ProjectContract,
  ProjectContracts,
  ProjectEscrow,
  ReferenceLink,
} from '@l2beat/config'
import { CONTRACTS, layer2s } from '@l2beat/config'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'
import { concat } from 'lodash'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import type { DaSolution } from '~/server/features/scaling/project/get-scaling-project-da-solution'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import type { TechnologyContract } from '../../../components/projects/sections/contract-entry'
import type { ContractsSectionProps } from '../../../components/projects/sections/contracts/contracts-section'
import { toTechnologyRisk } from '../risk-summary/to-technology-risk'
import { getUsedInProjects } from './get-used-in-projects'
import { toVerificationStatus } from './to-verification-status'

type ProjectParams = {
  type: 'layer2' | 'layer3' | 'bridge'
  id?: string
  slug: string
  isUnderReview?: boolean
  isVerified: boolean
  architectureImage?: string
  contracts: ProjectContracts
  daSolution?: DaSolution
  escrows: ProjectEscrow[] | undefined
  hostChain?: string
}

type ContractsSection = Omit<
  ContractsSectionProps,
  keyof Omit<ProjectSectionProps, 'isUnderReview'>
>

export function getContractsSection(
  projectParams: ProjectParams,
  projectsChangeReport: ProjectsChangeReport,
): ContractsSection | undefined {
  if (
    Object.values(projectParams.contracts.addresses).flat().length === 0 &&
    projectParams.daSolution?.contracts?.length === 0
  ) {
    return undefined
  }
  const projectChangeReport = projectParams.id
    ? projectsChangeReport?.projects[projectParams.id]
    : undefined

  const contracts = Object.fromEntries(
    Object.entries(projectParams.contracts.addresses ?? {}).map(
      ([chainName, contracts]) => {
        return [
          slugToDisplayName(chainName),
          contracts.map((contract) => {
            return makeTechnologyContract(
              contract,
              projectParams,
              !contract.isVerified,
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
            return makeTechnologyContract(
              contract,
              projectParams,
              !contract.isVerified,
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
        const contract = escrowToProjectContract(escrow)

        return makeTechnologyContract(
          contract,
          projectParams,
          !contract.isVerified,
          projectChangeReport,
          true,
        )
      }) ?? []

  const risks = projectParams.contracts.risks.map(toTechnologyRisk)

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
    projectParams.type === 'layer3' && projectParams.hostChain
      ? getL3HostChain(projectParams.hostChain)
      : 'Ethereum'

  return {
    chainName,
    contracts,
    escrows,
    risks,
    diagram: getDiagramParams(
      'architecture',
      projectParams.architectureImage ?? projectParams.slug,
    ),
    isUnderReview: projectParams.isUnderReview,
    daSolution,
  }
}

function makeTechnologyContract(
  item: ProjectContract,
  projectParams: ProjectParams,
  isUnverified: boolean,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
  isEscrow?: boolean,
): TechnologyContract {
  const chain = item.chain
  // TODO: sz-piotr: This here is just a stepping stone. Ideally none of this
  // weird logic would exist here. Instead you'd already have the items you want
  // to display already pre-processed in config
  const explorerUrl = item.url
    ? new URL(item.url).origin
    : 'https://etherscan.io'

  const getAddress = (opts: {
    address: EthereumAddress
    name?: string
  }) => {
    const name =
      opts.name ?? `${opts.address.slice(0, 6)}…${opts.address.slice(38, 42)}`

    return {
      name: name,
      address: opts.address.toString(),
      verificationStatus: toVerificationStatus(!isUnverified),
      href: `${explorerUrl}/address/${opts.address.toString()}#code`,
    }
  }

  const addresses = [getAddress({ address: item.address })]

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
        address: implementation,
      }),
    )
  }

  const adminAddresses = item.upgradeability?.admins ?? []
  const admins = []
  for (const [i, admin] of adminAddresses.entries()) {
    admins.push(
      getAddress({
        name: admins.length > 1 ? `Admin (${i + 1})` : 'Admin',
        address: admin,
      }),
    )
  }

  let description = item.description

  if (isUnverified) {
    const unverifiedText = CONTRACTS.UNVERIFIED_DESCRIPTION

    if (!description) {
      description = unverifiedText
    } else {
      description += ' ' + unverifiedText
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
    admins,
    description,
    usedInProjects,
    references: concat(item.references ?? [], additionalReferences),
    chain,
    implementationChanged,
    highSeverityFieldChanged,
    upgradeableBy: item.upgradableBy,
    upgradeConsiderations: item.upgradeConsiderations,
  }
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
    address: escrow.address,
  }
}

function moreTokensFirst(a: ProjectEscrow, b: ProjectEscrow) {
  const aTokens = a.tokens === '*' ? Number.POSITIVE_INFINITY : a.tokens.length
  const bTokens = b.tokens === '*' ? Number.POSITIVE_INFINITY : b.tokens.length

  return bTokens - aTokens
}
