import { Bridge, Layer2, ProjectContract } from '@l2beat/config'
import { existsSync } from 'fs'
import path from 'path'

import {
  ContractsSectionProps,
  TechnologyContract,
} from '../../components/project/ContractsSection'

export function getContractSection(
  project: Layer2 | Bridge,
): ContractsSectionProps {
  const contracts = project.contracts?.addresses.map((contract) =>
    makeTechnologyContract(contract, project),
  )

  const risks = project.contracts?.risks.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  const file = path.join(
    __dirname,
    `../../../static/images/${project.display.slug}-architecture.png`,
  )
  const architectureImage = existsSync(file)
    ? `/images/${project.display.slug}-architecture.png`
    : undefined

  return {
    contracts: contracts ?? [],
    risks: risks ?? [],
    architectureImage,
    references: project.contracts?.references ?? [],
    isIncomplete: project.contracts?.isIncomplete,
  }
}

function makeTechnologyContract(
  item: ProjectContract,
  project: Layer2 | Bridge,
): TechnologyContract {
  const links = []

  if (
    item.upgradeability?.type === 'EIP1967' ||
    item.upgradeability?.type === 'Custom' ||
    item.upgradeability?.type === 'NutBerry' ||
    item.upgradeability?.type === 'ZeppelinOs'
  ) {
    links.push({
      name: 'Implementation (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.implementation}#code`,
    })
    links.push({
      name: 'Admin',
      href: `https://etherscan.io/address/${item.upgradeability.admin}#code`,
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
    })
  }

  if (item.upgradeability?.type === 'Reference') {
    links.push({
      name: 'Code (Upgradable)',
      href: `https://etherscan.io/address/${item.address}#code`,
    })
  }

  if (item.upgradeability?.type === 'Arbitrum') {
    links.push({
      name: 'Admin',
      href: `https://etherscan.io/address/${item.upgradeability.admin}#code`,
    })
    links.push({
      name: 'Admin logic (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.adminImplementation}#code`,
    })
    links.push({
      name: 'User logic (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.userImplementation}#code`,
    })
  }

  if (item.upgradeability?.type === 'Beacon') {
    links.push({
      name: 'Beacon',
      href: `https://etherscan.io/address/${item.upgradeability.beacon}#code`,
    })
    links.push({
      name: 'Implementation (Upgradable)',
      href: `https://etherscan.io/address/${item.upgradeability.implementation}#code`,
    })
    links.push({
      name: 'Beacon Admin',
      href: `https://etherscan.io/address/${item.upgradeability.beaconAdmin}#code`,
    })
  }

  const tokens = project.config.escrows.find(
    (x) => x.address === item.address,
  )?.tokens
  let description = item.description
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
