import { Bridge, CONTRACTS, Layer2, ProjectContract } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'

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
    const isUnverified =
      verificationStatus.contracts[contract.address] === false
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

  if (
    item.upgradeability?.type === 'EIP1967' ||
    item.upgradeability?.type === 'Custom' ||
    item.upgradeability?.type === 'NutBerry' ||
    item.upgradeability?.type === 'ZeppelinOs'
  ) {
    links.push({
      name: 'Implementation (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.implementation}#code`,
      address: item.upgradeability.implementation,
      isAdmin: false,
    })
    links.push({
      name: 'Admin',
      href: `https://etherscan.io/address/${item.upgradeability.admin}#code`,
      address: item.upgradeability.admin,
      isAdmin: true,
    })
  }

  if (item.upgradeability?.type === 'CustomWithoutAdmin') {
    links.push({
      name: 'Implementation (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.implementation}#code`,
      address: item.upgradeability.implementation,
      isAdmin: false,
    })
  }

  if (item.upgradeability?.type === 'StarkWare') {
    const delay = item.upgradeability.upgradeDelay !== 0
    const days = item.upgradeability.upgradeDelay / (60 * 60 * 24)
    const implementation =
      item.upgradeability.callImplementation ??
      item.upgradeability.implementation
    links.push({
      name: `Implementation (Upgradable${delay ? ` ${days} days delay` : ''})`,
      href: `https://etherscan.io/address/${implementation}#code`,
      address: implementation,
      isAdmin: false,
    })
  }

  if (item.upgradeability?.type === 'Reference') {
    links.push({
      name: 'Code (Upgradable)',
      href: `https://etherscan.io/address/${item.address}#code`,
      address: item.address,
      isAdmin: false,
    })
  }

  if (item.upgradeability?.type === 'Arbitrum') {
    links.push({
      name: 'Admin',
      href: `https://etherscan.io/address/${item.upgradeability.admin}#code`,
      address: item.upgradeability.admin,
      isAdmin: true,
    })
    links.push({
      name: 'Admin logic (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.adminImplementation}#code`,
      address: item.upgradeability.adminImplementation,
      isAdmin: true,
    })
    links.push({
      name: 'User logic (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.userImplementation}#code`,
      address: item.upgradeability.userImplementation,
      isAdmin: false,
    })
  }

  if (item.upgradeability?.type === 'Beacon') {
    links.push({
      name: 'Beacon',
      href: `https://etherscan.io/address/${item.upgradeability.beacon}#code`,
      address: item.upgradeability.beacon,
      isAdmin: false,
    })
    links.push({
      name: 'Implementation (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.implementation}#code`,
      address: item.upgradeability.implementation,
      isAdmin: false,
    })
    links.push({
      name: 'Beacon Admin',
      href: `https://etherscan.io/address/${item.upgradeability.beaconAdmin}#code`,
      address: item.upgradeability.beaconAdmin,
      isAdmin: true,
    })
  }

  let description = item.description

  if (isUnverified) {
    if (!description) {
      description = CONTRACTS.UNVERIFIED_DESCRIPTION
    } else {
      description += ' ' + CONTRACTS.UNVERIFIED_DESCRIPTION
    }
  }

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

  return {
    name: item.name,
    address: item.address,
    description,
    links,
  }
}
