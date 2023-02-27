import {
  Bridge,
  CONTRACTS,
  isSingleAddress,
  Layer2,
  ProjectContract,
} from '@l2beat/config'
import { assertUnreachable, VerificationStatus } from '@l2beat/shared'

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

  const risks =
    project.contracts?.risks.map((risk) => ({
      text: `${risk.category} ${risk.text}`,
      isCritical: !!risk.isCritical,
    })) ?? []

  if (verificationStatus.projects[project.id.toString()] === false) {
    risks.push({
      text: CONTRACTS.UNVERIFIED_RISK.text,
      isCritical: !!CONTRACTS.UNVERIFIED_RISK.isCritical,
    })
  }

  const architectureImage = hasArchitectureImage(project.display.slug)
    ? `/images/${project.display.slug}-architecture.png`
    : undefined

  return {
    contracts: contracts ?? [],
    risks: risks,
    architectureImage,
    references: project.contracts?.references ?? [],
    isIncomplete: project.contracts?.isIncomplete,
    verificationStatus,
  }
}

function makeTechnologyContract(
  item: ProjectContract,
  project: Layer2 | Bridge,
  isUnverified: boolean,
): TechnologyContract {
  const links: TechnologyContractLinks[] = []

  if (isSingleAddress(item)) {
    if (item.upgradeability?.type) {
      switch (item.upgradeability.type) {
        case 'EIP1967 proxy':
        case 'Custom':
        case 'ZeppelinOS proxy':
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
    if (tokens) {
      const tokenText =
        tokens === '*'
          ? 'This contract can store any token'
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

  return {
    name: item.name,
    addresses,
    description,
    links,
  }
}

function isContractUnverified(
  contract: ProjectContract,
  verificationStatus: {
    projects: Record<string, boolean | undefined>
    contracts: Record<string, boolean | undefined>
  },
) {
  if (isSingleAddress(contract)) {
    return verificationStatus.contracts[contract.address.toString()] === false
  }

  return contract.multipleAddresses.some(
    (address) => verificationStatus.contracts[address.toString()],
  )
}
