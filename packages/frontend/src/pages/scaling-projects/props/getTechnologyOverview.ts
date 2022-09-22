import { Layer2, Layer2Contract, Layer2TechnologyChoice } from '@l2beat/config'
import { existsSync } from 'fs'
import path from 'path'

import {
  ContractsSectionProps,
  TechnologyContract,
} from '../../../components/project/ContractsSection'
import { PermissionsSectionProps } from '../../../components/project/PermissionsSection'
import { TechnologyIncompleteProps } from '../../../components/project/TechnologyIncomplete'
import {
  TechnologyChoice,
  TechnologySectionProps,
} from '../../../components/project/TechnologySection'
import { getEditLink } from './links'

interface TechnologyOverview {
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
  permissionsSection?: PermissionsSectionProps
  contractsSection: ContractsSectionProps
}

export function getTechnologyOverview(project: Layer2): TechnologyOverview {
  function makeTechnologyChoice(
    id: string,
    item: Layer2TechnologyChoice,
  ): TechnologyChoice {
    const risks = item.risks.map((risk) => ({
      text: `${risk.category} ${risk.text}`,
      isCritical: !!risk.isCritical,
    }))

    return {
      id,
      name: item.name,
      description: item.description,
      isIncomplete: !!item.isIncomplete,
      references: item.references,
      risks,
    }
  }

  function makeSections() {
    const technology: TechnologySectionProps = {
      id: 'technology',
      title: 'Technology',
      items: [
        makeTechnologyChoice(
          'state-correctness',
          project.technology.stateCorrectness,
        ),
        project.technology.newCryptography &&
          makeTechnologyChoice(
            'new-cryptography',
            project.technology.newCryptography,
          ),
        makeTechnologyChoice(
          'data-availability',
          project.technology.dataAvailability,
        ),
      ].filter(noUndefined),
    }

    const operator: TechnologySectionProps = {
      id: 'operator',
      title: 'Operator',
      items: [
        makeTechnologyChoice('operator', project.technology.operator),
        makeTechnologyChoice(
          'force-transactions',
          project.technology.forceTransactions,
        ),
      ],
    }

    const withdrawals: TechnologySectionProps = {
      id: 'withdrawals',
      title: 'Withdrawals',
      items: [
        ...project.technology.exitMechanisms.map((x, i) =>
          makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x),
        ),
        project.technology.massExit &&
          makeTechnologyChoice('mass-exit', project.technology.massExit),
      ].filter(noUndefined),
    }

    const other: TechnologySectionProps = {
      id: 'other-considerations',
      title: 'Other considerations',
      items: [
        project.technology.additionalPrivacy &&
          makeTechnologyChoice(
            'additional-privacy',
            project.technology.additionalPrivacy,
          ),
        project.technology.smartContracts &&
          makeTechnologyChoice(
            'smart-contracts',
            project.technology.smartContracts,
          ),
      ].filter(noUndefined),
    }

    return [technology, operator, withdrawals, other].filter(
      (x) => x.items.length > 0,
    )
  }

  function makeTechnologyContract(item: Layer2Contract): TechnologyContract {
    const links = []

    if (
      item.upgradeability?.type === 'EIP1967' ||
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
        name: `Implementation (Upgradable${
          delay ? ` ${days} days delay` : ''
        })`,
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

  function makePermissionsSection() {
    if (!project.permissions) {
      return undefined
    }
    return {
      permissions: project.permissions,
    }
  }

  function makeContractSection() {
    const contracts = project.contracts.addresses.map(makeTechnologyContract)

    const risks = project.contracts.risks.map((risk) => ({
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
      contracts,
      risks,
      architectureImage,
      references: project.contracts.references ?? [],
    }
  }

  const sections = makeSections()
  const isIncomplete = sections.some((x) => x.items.some((x) => x.isIncomplete))

  const incomplete = isIncomplete
    ? {
        editLink: getEditLink(project),
        twitterLink: getTwitterLink(project),
      }
    : undefined

  return {
    incomplete,
    sections,
    permissionsSection: makePermissionsSection(),
    contractsSection: makeContractSection(),
  }
}

function getTwitterLink(project: Layer2) {
  const twitterSocialMedia = project.display.links.socialMedia.find((x) =>
    x.includes('twitter'),
  )
  if (!twitterSocialMedia) {
    return
  }
  const twitterAccount = twitterSocialMedia.substring(
    'https://twitter.com/'.length,
  )

  const message = `Hey @${twitterAccount}. Your project overview on @l2beat would benefit from your help.`
  const url = `https://l2beat.com/scaling/projects/${project.display.slug}`

  const options = [
    ['text', encodeURIComponent(message)],
    ['url', encodeURIComponent(url)],
  ]
    .map((x) => `${x[0]}=${x[1]}`)
    .join('&')

  return `https://twitter.com/intent/tweet?${options}`
}

function noUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
