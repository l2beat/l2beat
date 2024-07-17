import {
  CONTRACTS,
  type ScalingProjectContract,
  type ScalingProjectContracts,
  type ScalingProjectEscrow,
  isSingleAddress,
  layer2s,
} from '@l2beat/config'
import {
  assert,
  type EthereumAddress,
  type ImplementationChangeReportApiResponse,
  type ImplementationChangeReportProjectData,
  type ManuallyVerifiedContracts,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import { type ContractsSectionProps } from './contracts-section'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import {
  type TechnologyContract,
  type TechnologyContractAddress,
} from '../permissions/contract-entry'
import { languageJoin } from '~/utils/language-join'
import { getDiagramImage } from '~/utils/project/get-diagram-image'
import { type TechnologyReference } from '../permissions/reference-list'
import { concat } from 'lodash'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'

interface ProjectParams {
  id: string
  slug: string
  isUnderReview?: boolean
  hostChain?: string
  architectureImage?: string
  contracts: ScalingProjectContracts
  escrows: ScalingProjectEscrow[] | undefined
}

export function getContractsSection(
  projectParams: ProjectParams,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
): Omit<ContractsSectionProps, 'sectionOrder' | 'id' | 'title'> | undefined {
  if (projectParams.contracts.addresses.length === 0) {
    return undefined
  }

  const contracts = projectParams.contracts.addresses.map((contract) => {
    const isUnverified = isContractUnverified(contract, verificationStatus)
    const implementationChangeForProject =
      implementationChange?.projects[projectParams.id]
    return makeTechnologyContract(
      contract,
      projectParams,
      isUnverified,
      verificationStatus,
      manuallyVerifiedContracts,
      implementationChangeForProject,
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
              verificationStatus,
            )
            const implementationChangeForProject =
              implementationChange?.projects[projectParams.id]
            return makeTechnologyContract(
              contract,
              projectParams,
              isUnverified,
              verificationStatus,
              manuallyVerifiedContracts,
              implementationChangeForProject,
            )
          }),
        ]
      },
    ),
  )

  const escrows =
    projectParams.escrows
      ?.filter((escrow) => escrow.newVersion && !escrow.isHistorical)
      .sort(moreTokensFirst)
      .map((escrow) => {
        const isUnverified = isEscrowUnverified(escrow, verificationStatus)
        const contract = escrowToProjectContract(escrow)
        const implementationChangeForProject =
          implementationChange?.projects[projectParams.id]

        return makeTechnologyContract(
          contract,
          projectParams,
          isUnverified,
          verificationStatus,
          manuallyVerifiedContracts,
          implementationChangeForProject,
          true,
        )
      }) ?? []

  const risks = projectParams.contracts.risks.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  if (verificationStatus.projects[projectParams.id] === false) {
    risks.push({
      text: `${CONTRACTS.UNVERIFIED_RISK.category} ${CONTRACTS.UNVERIFIED_RISK.text}`,
      isCritical: !!CONTRACTS.UNVERIFIED_RISK.isCritical,
    })
  }

  const getL3HostChain = (hostChain: string) => {
    if (hostChain === 'Multiple') {
      return 'Multiple'
    }
    return layer2s.find((l2) => l2.id === hostChain)?.display.name ?? 'Unknown'
  }

  const chainName = projectParams.hostChain
    ? getL3HostChain(projectParams.hostChain)
    : 'Ethereum'

  return {
    chainName,
    nativeContracts,
    contracts,
    escrows,
    risks,
    architectureImage: getDiagramImage(
      'architecture',
      projectParams.architectureImage ?? projectParams.slug,
    ),
    references: projectParams.contracts?.references ?? [],
    isIncomplete: projectParams.contracts?.isIncomplete,
    isUnderReview:
      projectParams.isUnderReview ?? projectParams.contracts?.isUnderReview,
  }
}

function makeTechnologyContract(
  item: ScalingProjectContract,
  projectParams: ProjectParams,
  isUnverified: boolean,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportProjectData | undefined,
  isEscrow?: boolean,
): TechnologyContract {
  const chain = item.chain ?? 'ethereum'
  const verificationStatusForChain = verificationStatus.contracts[chain] ?? {}
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
      verified: !!verificationStatusForChain[opts.address.toString()],
      href: `${etherscanUrl}/address/${opts.address.toString()}#code`,
      isAdmin: !!opts.isAdmin,
    }
  }

  const addresses: TechnologyContractAddress[] = isSingleAddress(item)
    ? [
        getAddress({
          address: item.address,
        }),
      ]
    : [
        ...item.multipleAddresses.map((address) =>
          getAddress({
            address: address,
          }),
        ),
      ]

  if (isSingleAddress(item)) {
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

    const admins = item.upgradeability?.admins ?? []
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

  const implementationAddresses = addresses
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

  const areImplementationsUnverified = addresses
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
  }

  const changedAddresses = (
    implementationChange !== undefined
      ? Object.values(implementationChange)
      : []
  ).flat()
  const implementationHasChanged = changedAddresses.some((ca) =>
    addresses.map((a) => a.address).includes(ca.containingContract.toString()),
  )

  const additionalReferences: TechnologyReference[] = []
  addresses.forEach((address) => {
    const manuallyVerified = manuallyVerifiedContractsForChain[address.address]
    if (manuallyVerified) {
      additionalReferences.push({
        text: 'Source code',
        href: manuallyVerified,
      })
    }
  })

  // const usedInProjects = getUsedInProjects(
  //   project,
  //   addresses,
  //   implementationAddresses,
  // )

  if (isSingleAddress(item)) {
    return {
      name: item.name,
      addresses,
      description,
      usedInProjects: [],
      references: concat(item.references ?? [], additionalReferences),
      chain,
      implementationHasChanged,
      upgradeableBy: languageJoin(item.upgradableBy),
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
