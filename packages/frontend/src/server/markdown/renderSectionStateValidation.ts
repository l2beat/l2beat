import type { ProjectScalingStateValidation } from '@l2beat/config'
import { QUANTUM_RESISTANCE_TOOLTIPS } from '~/components/projects/ProjectTooltipContent'
import type {
  ProverInfoData,
  StateValidationSectionProps,
} from '~/components/projects/sections/state-validation/StateValidationSection'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { configMarkdown } from './configMarkdown'
import { bulletList, heading, joinBlocks, link, subsection } from './markdown'
import {
  INCOMPLETE_NOTE,
  renderDiagram,
  renderReferences,
  renderRisks,
} from './renderSectionParts'
import {
  formatTag,
  formatVerifierCounts,
  renderProgramHashesSubsection,
  renderUsedIn,
} from './zkSectionBodies'

export function renderStateValidation(
  props: Pick<
    StateValidationSectionProps,
    | 'diagram'
    | 'stateValidation'
    | 'proverInfos'
    | 'programHashes'
    | 'programHashesDescription'
  >,
  level: number,
) {
  return joinBlocks([
    renderDiagram(props.diagram),
    configMarkdown(props.stateValidation.description, level),
    ...props.stateValidation.categories.map((category) =>
      renderCategory(category, level),
    ),
    ...(props.proverInfos ?? []).map((prover) =>
      renderProverInfo(prover, level),
    ),
    renderProgramHashesSubsection(props, level),
  ])
}

type Category = ProjectScalingStateValidation['categories'][number]

function renderCategory(category: Category, level: number) {
  return joinBlocks([
    heading(level, category.title),
    category.isIncomplete ? INCOMPLETE_NOTE : '',
    configMarkdown(category.description, level + 1),
    renderRisks(
      (category.risks ?? []).map((risk) => ({
        text: `${risk.category} ${risk.text}`,
        isCritical: !!risk.isCritical,
      })),
    ),
    renderReferences(category.references ?? []),
  ])
}

/** The prover card: which prover, and per proof system its trusted setups, verifiers and users. */
function renderProverInfo(prover: ProverInfoData, level: number) {
  return joinBlocks([
    heading(level, `Prover: ${link(prover.name, prover.href)}`),
    prover.quantumResistant ? QUANTUM_RESISTANCE_TOOLTIPS.prover : '',
    subsection(
      level + 1,
      'Trusted setups',
      bulletList(
        Object.values(prover.trustedSetups).flatMap((proofSystem) =>
          formatProofSystemTrustedSetups(proofSystem),
        ),
      ),
    ),
  ])
}

function formatProofSystemTrustedSetups({
  trustedSetups,
  onchainVerifiers,
  verifiers,
  projectsUsedIn,
}: TrustedSetupsByProofSystem[string]) {
  const proofSystem = trustedSetups[0]?.proofSystem
  if (!proofSystem) return []
  const setups = trustedSetups
    .map(
      (setup) =>
        `${setup.name} (risk: ${setup.risk}; ${setup.shortDescription})`,
    )
    .join(', ')
  const verifierList =
    onchainVerifiers && onchainVerifiers.length > 0
      ? `onchain verifiers: ${onchainVerifiers
          .map(
            (verifier) =>
              `${link(verifier.name, verifier.href)} (${formatVerifierCounts(verifier.verifiers)})`,
          )
          .join(', ')}`
      : `verifiers: ${formatVerifierCounts(verifiers)}`
  return [
    `${formatTag(proofSystem)}: ${setups}; ${verifierList}; used in: ${renderUsedIn(projectsUsedIn)}`,
  ]
}
