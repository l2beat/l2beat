import {
  Project,
  ProjectContract,
  ProjectReference,
  ProjectTechnology,
  ProjectTechnologyChoice,
} from '@l2beat/config'
import { TechnologyContract } from '../view/ContractsSection'
import { TechnologyReference } from '../view/ReferencesSection'
import { TechnologyOverviewProps } from '../view/TechnologyOverview'
import {
  TechnologyChoice,
  TechnologySectionProps,
} from '../view/TechnologySection'
import { getEditLink, getIssueLink } from './links'

export function getTechnologyOverview(
  project: Project
): TechnologyOverviewProps | undefined {
  const tech = project.details.technology
  if (!tech) {
    return undefined
  }

  const references: TechnologyReference[] = []

  function addReference(reference: ProjectReference) {
    const index = references.findIndex((x) => x.href === reference.href)
    if (index !== -1) {
      return index + 1
    } else {
      const id = references.length + 1
      references.push({ id, text: reference.text, href: reference.href })
      return id
    }
  }

  function makeTechnologyChoice(
    id: string,
    item: ProjectTechnologyChoice
  ): TechnologyChoice {
    const risks = item.risks.map((risk) => ({
      referenceIds: (risk.references ?? []).map(addReference),
      text: `${risk.category} ${risk.text}`,
    }))

    const issueTitle = `Problem: ${project.name} - ${item.name}`

    return {
      id,
      name: item.name,
      editLink: getEditLink(project),
      issueLink: getIssueLink(issueTitle),
      description: item.description,
      isIncomplete: !!item.isIncomplete,
      referenceIds: item.references.map(addReference),
      risks,
    }
  }

  function makeSections(tech: ProjectTechnology) {
    const technology: TechnologySectionProps = {
      id: 'technology',
      title: 'Technology',
      items: [
        makeTechnologyChoice('state-correctness', tech.stateCorrectness),
        tech.newCryptography &&
          makeTechnologyChoice('new-cryptography', tech.newCryptography),
        makeTechnologyChoice('data-availability', tech.dataAvailability),
      ].filter(noUndefined),
    }

    const operator: TechnologySectionProps = {
      id: 'operator',
      title: 'Operator',
      items: [
        makeTechnologyChoice('operator', tech.operator),
        makeTechnologyChoice('force-transactions', tech.forceTransactions),
      ],
    }

    const withdrawals: TechnologySectionProps = {
      id: 'withdrawals',
      title: 'Withdrawals',
      items: [
        ...tech.exitMechanisms.map((x, i) =>
          makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x)
        ),
        tech.massExit && makeTechnologyChoice('mass-exit', tech.massExit),
      ].filter(noUndefined),
    }

    const other: TechnologySectionProps = {
      id: 'other-considerations',
      title: 'Other considerations',
      items: [
        tech.additionalPrivacy &&
          makeTechnologyChoice('additional-privacy', tech.additionalPrivacy),
        tech.smartContracts &&
          makeTechnologyChoice('smart-contracts', tech.smartContracts),
      ].filter(noUndefined),
    }

    return [technology, operator, withdrawals, other].filter(
      (x) => x.items.length > 0
    )
  }

  function makeTechnologyContract(item: ProjectContract): TechnologyContract {
    const links = []

    const upgradable = !!item.upgradeability
    let delay: string | undefined
    if (
      item.upgradeability?.type === 'StarkWare' &&
      item.upgradeability.upgradeDelay !== 0
    ) {
      const SECONDS_PER_DAY = 86_400
      const days = item.upgradeability.upgradeDelay / SECONDS_PER_DAY
      delay = Math.floor(days) + ' days'
    }

    let owner: string | undefined
    if (
      item.upgradeability?.type === 'EIP1967' ||
      item.upgradeability?.type === 'ZeppelinOs'
    ) {
      owner = item.upgradeability.admin
    }

    const codeLinkName = upgradable
      ? delay
        ? `Code (Upgradable, ${delay} delay)`
        : 'Code (Upgradable)'
      : 'Code'

    links.push({
      name: codeLinkName,
      href: `https://etherscan.io/address/${item.address}#code`,
    })
    if (owner) {
      links.push({
        name: 'Owner',
        href: `https://etherscan.io/address/${owner}`,
      })
    }

    return {
      name: item.name,
      address: item.address,
      description: item.description,
      links,
    }
  }

  function makeContractSection(tech: ProjectTechnology) {
    const contracts = tech.contracts.addresses.map(makeTechnologyContract)

    const risks = tech.contracts.risks.map((risk) => ({
      referenceIds: (risk.references ?? []).map(addReference),
      text: `${risk.category} ${risk.text}`,
    }))

    return {
      editLink: getEditLink(project),
      issueLink: getIssueLink(`Problem: ${project.name} - Contracts`),
      contracts,
      risks,
    }
  }

  const sections = makeSections(tech)
  const isIncomplete = sections.some((x) =>
    x.items.some((x) => x.isIncomplete === true || x.referenceIds.length === 0)
  )

  return {
    editLink: getEditLink(project),
    twitterLink: getTwitterLink(project),
    isIncomplete,
    sections,
    contractsSection: makeContractSection(tech),
    referencesSection: { items: references },
  }
}

function getTwitterLink(project: Project) {
  const twitterSocialMedia = project.details.links.socialMedia.find((x) =>
    x.includes('twitter')
  )
  if (!twitterSocialMedia) {
    return
  }
  const twitterAccount = twitterSocialMedia.substring(
    'https://twitter.com/'.length
  )

  const message = `Hey @${twitterAccount}. Your project overview on @l2beatcom would benefit from your help.`
  const url = `https://l2beat.com/projects/${project.slug}`

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
