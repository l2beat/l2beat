import {
  type Bridge,
  CONTRACTS,
  type DaLayer,
  type Layer2,
  type Layer3,
  type ScalingProjectContract,
  type ScalingProjectContracts,
  type ScalingProjectEscrow,
  isSingleAddress,
  layer2s,
} from '@l2beat/config'
import {
  assert,
  type ContractsVerificationStatuses,
  type EthereumAddress,
  type ImplementationChangeReportApiResponse,
  type ImplementationChangeReportProjectData,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { concat } from 'lodash'
import { type ProjectSectionProps } from '~/components/projects/sections/types'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import { getDiagramParams } from '~/utils/project/get-diagram-params'
import { slugToDisplayName } from '~/utils/project/slug-to-display-name'
import {
  type TechnologyContract,
  type TechnologyContractAddress,
} from '../../../components/projects/sections/contract-entry'
import { type ContractsSectionProps } from '../../../components/projects/sections/contracts/contracts-section'
import { type Reference } from '../../../components/projects/sections/reference-list'
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
  escrows: ScalingProjectEscrow[] | undefined
} & (
  | {
      type: (Layer2 | Bridge | DaLayer)['type']
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
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
): ContractsSection | undefined {
  if (projectParams.contracts.addresses.length === 0) {
    return undefined
  }

  const contracts = projectParams.contracts.addresses.map((contract) => {
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

  const escrows =
    projectParams.escrows
      ?.filter((escrow) => escrow.newVersion && !escrow.isHistorical)
      .sort(moreTokensFirst)
      .map((escrow) => {
        const isUnverified = isEscrowUnverified(
          escrow,
          contractsVerificationStatuses,
        )
        const contract = escrowToProjectContract(escrow)
        const implementationChangeForProject =
          implementationChange?.projects[projectParams.id]

        return makeTechnologyContract(
          contract,
          projectParams,
          isUnverified,
          contractsVerificationStatuses,
          manuallyVerifiedContracts,
          implementationChangeForProject,
          true,
        )
      }) ?? []

  const risks = projectParams.contracts.risks.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

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
    if (hostChain === 'Multiple') {
      return 'Multiple'
    }
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
  }
}

function makeTechnologyContract(
  item: ScalingProjectContract,
  projectParams: ProjectParams,
  isUnverified: boolean,
  contractsVerificationStatuses: ContractsVerificationStatuses,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportProjectData | undefined,
  isEscrow?: boolean,
): TechnologyContract {
  const chain = getChain(projectParams, item)
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

  const implementationAddresses = addresses.filter((c) => !c.isAdmin)

  const usedInProjects = getUsedInProjects(
    projectParams,
    addresses,
    implementationAddresses,
  )

  if (isSingleAddress(item)) {
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

function isEscrowUnverified(
  escrow: ScalingProjectEscrow,
  contractsVerificationStatuses: ContractsVerificationStatuses,
): boolean {
  const chain = escrow.newVersion
    ? escrow.contract.chain ?? 'ethereum'
    : 'ethereum'
  return (
    contractsVerificationStatuses[chain]?.[escrow.address.toString()] === false
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
