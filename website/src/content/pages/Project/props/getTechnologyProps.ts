import {
  Project,
  ProjectContract,
  ProjectExitMechanism,
  ProjectReference,
  ProjectTechnologyChoice,
} from '@l2beat/config'
import { getEditLink, getIssueLink } from './links'

export interface TechnologyProps {
  technologies: TechnologyChoice[]
  withdrawals: TechnologyChoice[]
  references: TechnologyReference[]
  contracts: TechnologyContracts
}

export interface TechnologyChoice {
  id: string
  name: string
  editLink: string
  issueLink: string
  description: string
  referenceIds: number[]
  risks: TechnologyRisk[]
}

export interface TechnologyRisk {
  text: string
  referenceIds: number[]
}

export interface TechnologyReference {
  id: number
  text: string
  href: string
}

export interface TechnologyContracts {
  editLink: string
  issueLink: string
  contracts: TechnologyContract[]
  risks: TechnologyRisk[]
}

export interface TechnologyContract {
  name: string
  address: string
  description?: string
  links: {
    name: string
    href: string
  }[]
}

export function getTechnologyProps(
  project: Project
): TechnologyProps | undefined {
  const tech = project.details.technology
  if (!tech) {
    return undefined
  }

  const references: TechnologyReference[] = []
  const technologies: TechnologyChoice[] = []
  const withdrawals: TechnologyChoice[] = []
  const contracts: TechnologyContract[] = []

  function addReference(reference: ProjectReference) {
    const id = references.length + 1
    references.push({ id, text: reference.text, href: reference.href })
    return id
  }

  function addTechnologyChoice(
    into: TechnologyChoice[],
    id: string,
    item?: ProjectTechnologyChoice | ProjectExitMechanism
  ) {
    if (item) {
      const risks = item.risks.map((risk) => ({
        referenceIds: (risk.references ?? []).map(addReference),
        text: `${risk.category} ${risk.text}`,
      }))

      const issueTitle = `Problem: ${project.name} - ${item.name}`

      into.push({
        id,
        name: item.name,
        editLink: getEditLink(project),
        issueLink: getIssueLink(issueTitle),
        description: item.description,
        referenceIds: item.references.map(addReference),
        risks,
      })
    }
  }

  function addContract(item: ProjectContract) {
    const links = []
    let codeLinkName = 'Code'
    if (item.upgradeDelay) {
      codeLinkName = `Code (Upgradable, ${item.upgradeDelay} delay)`
    } else if (item.upgradable) {
      codeLinkName = 'Code (Upgradable)'
    }
    links.push({
      name: codeLinkName,
      href: `https://etherscan.io/address/${item.address}#code`,
    })
    if (item.owner) {
      links.push({
        name:
          item.owner.type !== 'other' ? `Owner (${item.owner.type})` : 'Owner',
        href: `https://etherscan.io/address/${item.owner.address}`,
      })
    }

    contracts.push({
      name: item.name,
      address: item.address,
      description: item.description,
      links,
    })
  }

  const addTechnology = (id: string, item?: ProjectTechnologyChoice) =>
    addTechnologyChoice(technologies, id, item)

  addTechnology('state-correctness', tech.stateCorrectness)
  addTechnology('data-availability', tech.dataAvailability)
  addTechnology('new-cryptography', tech.newCryptography)
  addTechnology('mass-exit', tech.massExit)
  addTechnology('additional-privacy', tech.additionalPrivacy)
  addTechnology('smart-contracts', tech.smartContracts)
  addTechnology('operator', tech.operator)
  addTechnology('force-transactions', tech.forceTransactions)

  const addWithdrawal = (id: string, item?: ProjectExitMechanism) =>
    addTechnologyChoice(withdrawals, id, item)

  for (const [i, item] of tech.exitMechanisms.entries()) {
    addWithdrawal(`exit-mechanisms-${i + 1}`, item)
  }

  for (const item of tech.contracts.addresses) {
    addContract(item)
  }

  const contractRisks = tech.contracts.risks.map((risk) => ({
    referenceIds: (risk.references ?? []).map(addReference),
    text: `${risk.category} ${risk.text}`,
  }))

  return {
    references,
    technologies,
    withdrawals,
    contracts: {
      editLink: getEditLink(project),
      issueLink: getIssueLink(`Problem: ${project.name} - Contracts`),
      contracts,
      risks: contractRisks,
    },
  }
}
