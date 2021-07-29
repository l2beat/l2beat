import {
  Project,
  ProjectExitMechanism,
  ProjectReference,
  ProjectTechnologyChoice,
} from '@l2beat/config'
import { getEditLink, getIssueLink } from './links'

export interface TechnologyProps {
  technologies: TechnologyChoice[]
  withdrawals: TechnologyChoice[]
  references: TechnologyReference[]
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

  return {
    references,
    technologies,
    withdrawals,
  }
}
