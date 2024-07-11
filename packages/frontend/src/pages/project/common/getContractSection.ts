import {
  Bridge,
  CONTRACTS,
  Layer2,
  Layer3,
  ScalingProjectContract,
  ScalingProjectEscrow,
  bridges,
  isSingleAddress,
  layer2s,
  layer3s,
} from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  ImplementationChangeReportApiResponse,
  ImplementationChangeReportProjectData,
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { getExplorerUrl } from '../../../utils/getExplorerUrl'
import { languageJoin } from '../../../utils/utils'
import { getUsedInProjects } from '../common/getUsedInProjects'
import { ContractsSectionProps } from '../components/sections/ContractsSection/ContractsSection'
import {
  TechnologyContract,
  TechnologyContractLinks,
} from '../components/sections/common/ContractEntry'
import { getDiagramImage } from './getDiagramImage'

export function getContractSection(
  project: Layer2 | Layer3 | Bridge,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
): Omit<ContractsSectionProps, 'sectionOrder'> {
  const contracts = project.contracts?.addresses.map((contract) => {
    const isUnverified = isContractUnverified(contract, verificationStatus)
    const implementationChangeForProject =
      implementationChange?.projects[project.id.toString()]
    return makeTechnologyContract(
      contract,
      project,
      isUnverified,
      verificationStatus,
      implementationChangeForProject,
    )
  })

  const nativeContracts = Object.fromEntries(
    Object.entries(project.contracts?.nativeAddresses ?? {}).map(
      ([chainName, contracts]) => {
        return [
          slugToDisplayName(chainName),
          contracts.map((contract) => {
            const isUnverified = isContractUnverified(
              contract,
              verificationStatus,
            )
            const implementationChangeForProject =
              implementationChange?.projects[project.id.toString()]
            return makeTechnologyContract(
              contract,
              project,
              isUnverified,
              verificationStatus,
              implementationChangeForProject,
            )
          }),
        ]
      },
    ),
  )

  const escrows = project.config.escrows
    .filter((escrow) => escrow.newVersion && !escrow.isHistorical)
    .sort(moreTokensFirst)
    .map((escrow) => {
      const isUnverified = isEscrowUnverified(escrow, verificationStatus)
      const contract = escrowToProjectContract(escrow)
      const implementationChangeForProject =
        implementationChange?.projects[project.id.toString()]

      return makeTechnologyContract(
        contract,
        project,
        isUnverified,
        verificationStatus,
        implementationChangeForProject,
        true,
      )
    })

  const risks =
    project.contracts?.risks.map((risk) => ({
      text: `${risk.category} ${risk.text}`,
      isCritical: !!risk.isCritical,
    })) ?? []

  if (verificationStatus.projects[project.id.toString()] === false) {
    risks.push({
      text: `${CONTRACTS.UNVERIFIED_RISK.category} ${CONTRACTS.UNVERIFIED_RISK.text}`,
      isCritical: !!CONTRACTS.UNVERIFIED_RISK.isCritical,
    })
  }

  const getL3HostChain = (project: Layer3) => {
    if (project.hostChain === 'Multiple') {
      return 'Multiple'
    }
    return (
      layer2s.find((l2) => l2.id === project.hostChain)?.display.name ??
      'Unknown'
    )
  }

  const chainName =
    project.type === 'layer3' ? getL3HostChain(project) : 'Ethereum'

  return {
    id: 'contracts',
    chainName,
    title: 'Smart contracts',
    nativeContracts,
    contracts: contracts ?? [],
    escrows: escrows,
    risks: risks,
    architectureImage: getDiagramImage(
      'architecture',
      project.display.architectureImage ?? project.display.slug,
    ),
    references: project.contracts?.references ?? [],
    isIncomplete: project.contracts?.isIncomplete,
    isUnderReview: project.isUnderReview ?? project.contracts?.isUnderReview,
    verificationStatus,
    manuallyVerifiedContracts,
  }
}

function makeTechnologyContract(
  item: ScalingProjectContract,
  project: Layer2 | Layer3 | Bridge,
  isUnverified: boolean,
  verificationStatus: VerificationStatus,
  implementationChange: ImplementationChangeReportProjectData | undefined,
  isEscrow?: boolean,
): TechnologyContract {
  const links: TechnologyContractLinks[] = []
  const chain = item.chain ?? 'ethereum'
  const verificationStatusForChain = verificationStatus.contracts[chain] ?? {}
  const etherscanUrl = getExplorerUrl(chain)

  if (isSingleAddress(item)) {
    const implementations = item.upgradeability?.implementations ?? []
    for (const [i, implementation] of implementations.entries()) {
      links.push({
        // TODO: (sz-piotr). Add "(Upgradable)"
        name:
          implementations.length > 1
            ? `Implementation (${i + 1})`
            : 'Implementation',
        href: `${etherscanUrl}/address/${implementation.toString()}#code`,
        address: implementation.toString(),
        isAdmin: false,
      })
    }

    const admins = item.upgradeability?.admins ?? []
    for (const [i, admin] of admins.entries()) {
      links.push({
        name: admins.length > 1 ? `Admin (${i + 1})` : 'Admin',
        href: `${etherscanUrl}/address/${admin.toString()}#code`,
        address: admin.toString(),
        isAdmin: true,
      })
    }
  }
  const implementationAddresses = links
    .filter((c) => !c.isAdmin)
    .map((c) => c.address)

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

  const areImplementationsUnverified = links
    .filter((c) => !c.isAdmin)
    .map((c) => verificationStatusForChain[c.address])
    .some((c) => c === false)

  if (areImplementationsUnverified) {
    if (!description) {
      description = CONTRACTS.UNVERIFIED_IMPLEMENTATIONS_DESCRIPTION
    } else {
      description += ' ' + CONTRACTS.UNVERIFIED_IMPLEMENTATIONS_DESCRIPTION
    }
  }

  if (isSingleAddress(item)) {
    const tokens = project.config.escrows.find(
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
  }

  const addresses = isSingleAddress(item)
    ? [item.address.toString()]
    : [...item.multipleAddresses.map((x) => x.toString())]

  const changedAddresses = (
    implementationChange !== undefined
      ? Object.values(implementationChange)
      : []
  ).flat()
  const implementationHasChanged = changedAddresses.some((ca) =>
    addresses.includes(ca.containingContract.toString()),
  )

  const usedInProjects = getUsedInProjects(
    project,
    addresses,
    implementationAddresses,
  )

  const result: TechnologyContract = {
    name: item.name,
    addresses,
    description,
    links,
    usedInProjects,
    etherscanUrl,
    chain,
    implementationHasChanged,
  }

  if (isSingleAddress(item)) {
    result.upgradeableBy = languageJoin(item.upgradableBy)
    result.upgradeDelay = item.upgradeDelay
    result.upgradeConsiderations = item.upgradeConsiderations
    result.references = item.references
  }

  return result
}

function isContractUnverified(
  contract: ScalingProjectContract,
  verificationStatus: VerificationStatus,
): boolean {
  const chain = contract.chain ?? 'ethereum'
  if (isSingleAddress(contract)) {
    return (
      verificationStatus.contracts[chain]?.[contract.address.toString()] ===
      false
    )
  }

  return contract.multipleAddresses.some(
    (address) =>
      verificationStatus.contracts[chain]?.[address.toString()] === false,
  )
}

function isEscrowUnverified(
  escrow: ScalingProjectEscrow,
  verificationStatus: VerificationStatus,
): boolean {
  const chain = escrow.newVersion
    ? escrow.contract.chain ?? 'ethereum'
    : 'ethereum'
  return (
    verificationStatus.contracts[chain]?.[escrow.address.toString()] === false
  )
}

function escrowToProjectContract(
  escrow: ScalingProjectEscrow,
): ScalingProjectContract {
  assert(escrow.newVersion, 'Old escrow format used') // old format misses upgradeability info

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

function moreTokensFirst(a: ScalingProjectEscrow, b: ScalingProjectEscrow) {
  const aTokens = a.tokens === '*' ? Number.POSITIVE_INFINITY : a.tokens.length
  const bTokens = b.tokens === '*' ? Number.POSITIVE_INFINITY : b.tokens.length

  return bTokens - aTokens
}

function areAllAddressesUnverified(
  addresses: EthereumAddress[],
  verificationStatus: Partial<Record<string, boolean>>,
) {
  return addresses.every((address) => {
    return verificationStatus[address.toString()] === false
  })
}

export function slugToDisplayName(slug: string): string {
  if (slug === 'ethereum') {
    return 'Ethereum'
  }
  const isL2 = layer2s.find((l2) => l2.id === slug)
  if (isL2 !== undefined) {
    return isL2.display.name
  }
  const isL3 = layer3s.find((l3) => l3.id === slug)
  if (isL3 !== undefined) {
    return isL3.display.name
  }
  const isBridge = bridges.find((bridge) => bridge.id === slug)
  if (isBridge !== undefined) {
    return isBridge.display.name
  }

  assert(false, 'Unknown chain slug')
}
