import {
  Bridge,
  CONTRACTS,
  isSingleAddress,
  Layer2,
  ProjectContract,
  ProjectEscrow,
} from '@l2beat/config'
import {
  assert,
  assertUnreachable,
  EthereumAddress,
  VerificationStatus,
} from '@l2beat/shared-pure'

import {
  TechnologyContract,
  TechnologyContractLinks,
} from '../../components/project/ContractEntry'
import { ContractsSectionProps } from '../../components/project/ContractsSection'
import { hasArchitectureImage } from './hasArchitectureImage'

export function getContractSection(
  project: Layer2 | Bridge,
  verificationStatus: VerificationStatus,
): ContractsSectionProps {
  const contracts = project.contracts?.addresses.map((contract) => {
    const isUnverified = isContractUnverified(contract, verificationStatus)
    return makeTechnologyContract(contract, project, isUnverified)
  })

  const escrows = project.config.escrows
    .filter((escrow) => escrow.newVersion && !escrow.isHistorical)
    .sort(moreTokensFirst)
    .map((escrow) => {
      const isUnverified = isAddressUnverified(
        escrow.address,
        verificationStatus,
      )
      const contract = escrowToProjectContract(escrow)

      return makeTechnologyContract(contract, project, isUnverified, true)
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

  const architectureImage = hasArchitectureImage(project.display.slug)
    ? `/images/${project.display.slug}-architecture.png`
    : undefined

  return {
    id: 'contracts',
    title: 'Smart Contracts',
    contracts: contracts ?? [],
    escrows: escrows,
    risks: risks,
    architectureImage,
    references: project.contracts?.references ?? [],
    isIncomplete: project.contracts?.isIncomplete,
    isUnderReview: project.isUnderReview ?? project.contracts?.isUnderReview,
    verificationStatus,
    nativeL2TokensIncludedInTVL:
      project.type === 'layer2'
        ? project.config.nativeL2TokensIncludedInTVL ?? []
        : [],
  }
}

function makeTechnologyContract(
  item: ProjectContract,
  project: Layer2 | Bridge,
  isUnverified: boolean,
  isEscrow?: boolean,
): TechnologyContract {
  const links: TechnologyContractLinks[] = []

  if (isSingleAddress(item)) {
    if (item.upgradeability?.type) {
      switch (item.upgradeability.type) {
        case 'EIP1967 proxy':
        case 'Custom':
        case 'ZeppelinOS proxy':
        case 'Eternal Storage proxy':
          links.push({
            name: 'Implementation (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
          })
          if (item.upgradeability.admin) {
            links.push({
              name: 'Admin',
              href: `https://etherscan.io/address/${item.upgradeability.admin.toString()}#code`,
              address: item.upgradeability.admin.toString(),
              isAdmin: true,
            })
          }
          break

        case 'StarkWare diamond':
        case 'resolved delegate proxy':
        case 'call implementation proxy':
        case 'EIP897 proxy':
        case 'CustomWithoutAdmin':
        case 'Polygon proxy':
          links.push({
            name: 'Implementation (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
          })
          break

        case 'StarkWare proxy': {
          const delay = item.upgradeability.upgradeDelay !== 0
          const days = item.upgradeability.upgradeDelay / (60 * 60 * 24)
          const implementation =
            item.upgradeability.callImplementation ??
            item.upgradeability.implementation
          links.push({
            name: `Implementation (Upgradable${
              delay ? ` ${days} days delay` : ''
            })`,
            href: `https://etherscan.io/address/${implementation.toString()}#code`,
            address: implementation.toString(),
            isAdmin: false,
          })
          break
        }

        case 'Reference':
          links.push({
            name: 'Code (Upgradable)',
            href: `https://etherscan.io/address/${item.address.toString()}#code`,
            address: item.address.toString(),
            isAdmin: false,
          })
          break

        case 'new Arbitrum proxy':
        case 'Arbitrum proxy':
          links.push({
            name: 'Admin',
            href: `https://etherscan.io/address/${item.upgradeability.admin.toString()}#code`,
            address: item.upgradeability.admin.toString(),
            isAdmin: true,
          })
          links.push({
            name: 'Admin logic (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.adminImplementation.toString()}#code`,
            address: item.upgradeability.adminImplementation.toString(),
            isAdmin: true,
          })
          links.push({
            name: 'User logic (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.userImplementation.toString()}#code`,
            address: item.upgradeability.userImplementation.toString(),
            isAdmin: false,
          })
          break

        case 'Beacon':
          links.push({
            name: 'Beacon',
            href: `https://etherscan.io/address/${item.upgradeability.beacon.toString()}#code`,
            address: item.upgradeability.beacon.toString(),
            isAdmin: false,
          })
          links.push({
            name: 'Implementation (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
          })
          links.push({
            name: 'Beacon Admin',
            href: `https://etherscan.io/address/${item.upgradeability.beaconAdmin.toString()}#code`,
            address: item.upgradeability.beaconAdmin.toString(),
            isAdmin: true,
          })
          break

        case 'zkSync Lite proxy':
          links.push({
            name: 'Implementation (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
          })
          links.push({
            name: 'Additional implementation (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.additional.toString()}#code`,
            address: item.upgradeability.additional.toString(),
            isAdmin: false,
          })
          links.push({
            name: 'Admin',
            href: `https://etherscan.io/address/${item.upgradeability.admin.toString()}#code`,
            address: item.upgradeability.admin.toString(),
            isAdmin: true,
          })
          break
        case 'zkSpace proxy':
          links.push({
            name: 'Implementation (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
          })
          links.push(
            ...item.upgradeability.additional.map((additional) => ({
              name: 'Additional implementation (Upgradable)',
              href: `https://etherscan.io/address/${additional.toString()}#code`,
              address: additional.toString(),
              isAdmin: false,
            })),
          )
          links.push({
            name: 'Admin',
            href: `https://etherscan.io/address/${item.upgradeability.admin.toString()}#code`,
            address: item.upgradeability.admin.toString(),
            isAdmin: true,
          })
          break
        case 'Polygon Extension proxy':
          links.push({
            name: 'Implementation (Upgradable)',
            href: `https://etherscan.io/address/${item.upgradeability.implementation.toString()}#code`,
            address: item.upgradeability.implementation.toString(),
            isAdmin: false,
          }),
            links.push({
              name: 'Extension (Upgradable)',
              href: `https://etherscan.io/address/${item.upgradeability.extension.toString()}#code`,
              address: item.upgradeability.extension.toString(),
              isAdmin: false,
            })
          break

        // Ignore types
        case 'immutable':
        case 'gnosis safe':
        case 'EIP2535 diamond proxy':
          break

        default:
          assertUnreachable(item.upgradeability)
      }
    }
  }

  let description = item.description

  if (isUnverified) {
    if (!description) {
      description = CONTRACTS.UNVERIFIED_DESCRIPTION
    } else {
      description += ' ' + CONTRACTS.UNVERIFIED_DESCRIPTION
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

  const result: TechnologyContract = {
    name: item.name,
    addresses,
    description,
    links,
  }

  if (isSingleAddress(item)) {
    result.upgradeableBy = languageJoin(item.upgradableBy)
    result.upgradeDelay = item.upgradeDelay
    result.upgradeConsiderations = item.upgradeConsiderations
    result.references = item.references
  }

  return result
}

function languageJoin(items?: string[]) {
  if (!items || items.length === 0) {
    return undefined
  }
  if (items.length === 1) {
    return items[0]
  }
  items = [...items]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const last = items.pop()!
  return `${items.join(', ')} and ${last}`
}

function isContractUnverified(
  contract: ProjectContract,
  verificationStatus: {
    projects: Record<string, boolean | undefined>
    contracts: Record<string, boolean | undefined>
  },
): boolean {
  if (isSingleAddress(contract)) {
    return verificationStatus.contracts[contract.address.toString()] === false
  }

  return contract.multipleAddresses.some(
    (address) => verificationStatus.contracts[address.toString()],
  )
}

function isAddressUnverified(
  address: EthereumAddress,
  verificationStatus: {
    projects: Record<string, boolean | undefined>
    contracts: Record<string, boolean | undefined>
  },
): boolean {
  return verificationStatus.contracts[address.toString()] === false
}

function escrowToProjectContract(escrow: ProjectEscrow): ProjectContract {
  assert(escrow.newVersion, 'Old escrow format used') // old format misses upgradeability info

  return {
    ...escrow.contract,
    name:
      escrow.tokens === '*'
        ? 'Generic escrow'
        : 'Escrow for ' + escrow.tokens.join(', '),
    address: escrow.address,
  }
}

function moreTokensFirst(a: ProjectEscrow, b: ProjectEscrow) {
  const aTokens = a.tokens === '*' ? Number.POSITIVE_INFINITY : a.tokens.length
  const bTokens = b.tokens === '*' ? Number.POSITIVE_INFINITY : b.tokens.length

  return bTokens - aTokens
}
