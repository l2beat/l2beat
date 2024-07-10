import {
  CONTRACTS,
  type ScalingProjectContract,
  type ScalingProjectContracts,
  type ScalingProjectEscrow,
  bridges,
  isSingleAddress,
  layer2s,
  layer3s,
} from '@l2beat/config'
import {
  assert,
  type EthereumAddress,
  type ImplementationChangeReportApiResponse,
  type ImplementationChangeReportProjectData,
  type ManuallyVerifiedContracts,
  type VerificationStatus,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { type ContractsSectionProps } from './contracts-section'
import { getExplorerUrl } from '~/utils/get-explorer-url'
import {
  type TechnologyContract,
  type TechnologyContractAddress,
} from '../permissions/contract-entry.'
import { languageJoin } from '~/utils/language-join'

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
    architectureImage: `/images/architecture/${
      projectParams.architectureImage ?? projectParams.slug
    }.png`,
    references: projectParams.contracts?.references ?? [],
    isIncomplete: projectParams.contracts?.isIncomplete,
    isUnderReview:
      projectParams.isUnderReview ?? projectParams.contracts?.isUnderReview,
    verificationStatus,
    manuallyVerifiedContracts,
  }
}

function makeTechnologyContract(
  item: ScalingProjectContract,
  projectParams: ProjectParams,
  isUnverified: boolean,
  verificationStatus: VerificationStatus,
  implementationChange: ImplementationChangeReportProjectData | undefined,
  isEscrow?: boolean,
): TechnologyContract {
  const chain = item.chain ?? 'ethereum'
  const verificationStatusForChain = verificationStatus.contracts[chain] ?? {}
  const etherscanUrl = getExplorerUrl(chain)

  const addresses: TechnologyContractAddress[] = isSingleAddress(item)
    ? [
        {
          name: item.address.toString(),
          address: item.address.toString(),
          verified: !!verificationStatusForChain[item.address.toString()],
          href: `${etherscanUrl}/address/${item.address.toString()}#code`,
          isAdmin: false,
        },
      ]
    : [
        ...item.multipleAddresses.map((address) => ({
          name: address.toString(),
          address: address.toString(),
          verified: !!verificationStatusForChain[address.toString()],
          href: `${etherscanUrl}/address/${address.toString()}#code`,
          isAdmin: false,
        })),
      ]

  if (isSingleAddress(item)) {
    if (item.upgradeability?.type) {
      switch (item.upgradeability.type) {
        case 'EIP1967 proxy':
        case 'LightLink proxy':
        case 'Custom':
        case 'ZeppelinOS proxy':
        case 'Eternal Storage proxy':
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          })
          if (item.upgradeability.admin) {
            addresses.push({
              name: 'Admin',
              href: `${etherscanUrl}/address/${item.upgradeability.admin.toString()}#code`,
              address: item.upgradeability.admin.toString(),
              isAdmin: true,
              verified:
                !!verificationStatusForChain[
                  item.upgradeability.admin.toString()
                ],
            })
          }
          break

        case 'StarkWare diamond':
        case 'resolved delegate proxy':
        case 'call implementation proxy':
        case 'EIP897 proxy':
        case 'CustomWithoutAdmin':
        case 'Polygon proxy':
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          })
          break

        case 'StarkWare proxy': {
          const delay = item.upgradeability.upgradeDelay !== 0
          const days = item.upgradeability.upgradeDelay / (60 * 60 * 24)
          const implementation =
            item.upgradeability.callImplementation ??
            item.upgradeability.implementation
          addresses.push({
            name: `Implementation (Upgradable${
              delay ? ` ${days} days delay` : ''
            })`,
            href: `${etherscanUrl}/address/${implementation.toString()}#code`,
            address: implementation.toString(),
            isAdmin: false,
            verified: !!verificationStatusForChain[implementation.toString()],
          })
          break
        }

        case 'Reference':
          addresses.push({
            name: 'Code (Upgradable)',
            href: `${etherscanUrl}/address/${item.address.toString()}#code`,
            address: item.address.toString(),
            isAdmin: false,
            verified: !!verificationStatusForChain[item.address.toString()],
          })
          break

        case 'new Arbitrum proxy':
        case 'Arbitrum proxy':
          addresses.push({
            name: 'Admin',
            href: `${etherscanUrl}/address/${item.upgradeability.admin.toString()}#code`,
            address: item.upgradeability.admin.toString(),
            isAdmin: true,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.admin.toString()
              ],
          })
          addresses.push({
            name: 'Admin logic (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.adminImplementation.toString()}#code`,
            address: item.upgradeability.adminImplementation.toString(),
            isAdmin: true,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.adminImplementation.toString()
              ],
          })
          addresses.push({
            name: 'User logic (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.userImplementation.toString()}#code`,
            address: item.upgradeability.userImplementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.userImplementation.toString()
              ],
          })
          break

        case 'Beacon':
          addresses.push({
            name: 'Beacon',
            href: `${etherscanUrl}/address/${item.upgradeability.beacon.toString()}#code`,
            address: item.upgradeability.beacon.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.beacon.toString()
              ],
          })
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          })
          addresses.push({
            name: 'Beacon Admin',
            href: `${etherscanUrl}/address/${item.upgradeability.beaconAdmin.toString()}#code`,
            address: item.upgradeability.beaconAdmin.toString(),
            isAdmin: true,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.beaconAdmin.toString()
              ],
          })
          break

        case 'zkSync Lite proxy':
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          })
          addresses.push({
            name: 'Additional implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.additional.toString()}#code`,
            address: item.upgradeability.additional.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.additional.toString()
              ],
          })
          addresses.push({
            name: 'Admin',
            href: `${etherscanUrl}/address/${item.upgradeability.admin.toString()}#code`,
            address: item.upgradeability.admin.toString(),
            isAdmin: true,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.admin.toString()
              ],
          })
          break

        case 'zkSpace proxy':
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          })
          addresses.push(
            ...item.upgradeability.additional.map((additional) => ({
              name: 'Additional implementation (Upgradable)',
              href: `${etherscanUrl}/address/${additional.toString()}#code`,
              address: additional.toString(),
              isAdmin: false,
              verified: !!verificationStatusForChain[additional.toString()],
            })),
          )
          addresses.push({
            name: 'Admin',
            href: `${etherscanUrl}/address/${item.upgradeability.admin.toString()}#code`,
            address: item.upgradeability.admin.toString(),
            isAdmin: true,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.admin.toString()
              ],
          })
          break

        case 'Polygon Extension proxy':
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          }),
            addresses.push({
              name: 'Extension (Upgradable)',
              href: `${etherscanUrl}/address/${item.upgradeability.extension.toString()}#code`,
              address: item.upgradeability.extension.toString(),
              isAdmin: false,
              verified:
                !!verificationStatusForChain[
                  item.upgradeability.extension.toString()
                ],
            })
          break
        case 'Optics Beacon proxy':
          addresses.push({
            name: 'Upgrade Beacon',
            href: `${etherscanUrl}/address/${item.upgradeability.upgradeBeacon.toString()}#code`,
            address: item.upgradeability.upgradeBeacon.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.upgradeBeacon.toString()
              ],
          })
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          })
          addresses.push({
            name: 'Beacon Controller',
            href: `${etherscanUrl}/address/${item.upgradeability.beaconController.toString()}#code`,
            address: item.upgradeability.beaconController.toString(),
            isAdmin: true,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.beaconController.toString()
              ],
          })
          break
        case 'Axelar proxy':
          addresses.push({
            name: 'Implementation (Upgradable)',
            href: `${etherscanUrl}/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
            verified:
              !!verificationStatusForChain[
                item.upgradeability.implementation.toString()
              ],
          })
          break
        // Ignore types
        case 'immutable':
        case 'gnosis safe':
        case 'gnosis safe zodiac module':
        case 'EIP2535 diamond proxy':
          break

        default:
          assertUnreachable(item.upgradeability)
      }
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

  // const usedInProjects = getUsedInProjects(
  //   project,
  //   addresses,
  //   implementationAddresses,
  // )

  const result: TechnologyContract = {
    name: item.name,
    addresses,
    description,
    usedInProjects: [],
    references: [],
    chain,
    implementationHasChanged,
  }

  if (isSingleAddress(item)) {
    result.upgradeableBy = languageJoin(item.upgradableBy)
    result.upgradeDelay = item.upgradeDelay
    result.upgradeConsiderations = item.upgradeConsiderations
    result.references = item.references ?? []
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
