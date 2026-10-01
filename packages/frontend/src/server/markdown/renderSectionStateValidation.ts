import type { ProjectScalingStateValidation } from '@l2beat/config'
import type {
  ProverInfoData,
  StateValidationSectionProps,
} from '~/components/projects/sections/state-validation/StateValidationSection'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
  nestHeadings,
  resolveSiteUrl,
  subsection,
} from './markdown'
import type { SectionContext } from './renderProjectSection'
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
  context: SectionContext,
) {
  return joinBlocks([
    renderDiagram(props.diagram, context.pageUrl),
    nestHeadings(props.stateValidation.description, level),
    ...props.stateValidation.categories.map((category) =>
      renderCategory(category, level),
    ),
    ...(props.proverInfos ?? []).map((prover) =>
      renderProverInfo(prover, level, context.pageUrl),
    ),
    renderProgramHashesSubsection(props, level, context),
  ])
}

type Category = ProjectScalingStateValidation['categories'][number]

function renderCategory(category: Category, level: number) {
  return joinBlocks([
    heading(level, category.title),
    category.isIncomplete ? INCOMPLETE_NOTE : '',
    nestHeadings(category.description, level + 1),
    renderRisks(
      (category.risks ?? []).map((risk) => ({
        text: `${risk.category} ${risk.text}`,
        isCritical: !!risk.isCritical,
      })),
    ),
    renderReferences(category.references ?? []),
  ])
}

const QUANTUM_RESISTANT_PROVER =
  "The prover is plausibly quantum resistant. There is no publicly known quantum algorithm that efficiently breaks prover's cryptography."

/** The prover card: which prover, and per proof system its trusted setups, verifiers and users. */
function renderProverInfo(
  prover: ProverInfoData,
  level: number,
  pageUrl: string,
) {
  return joinBlocks([
    heading(
      level,
      `Prover: ${link(prover.name, resolveSiteUrl(prover.href, pageUrl))}`,
    ),
    prover.quantumResistant ? QUANTUM_RESISTANT_PROVER : '',
    subsection(
      level + 1,
      'Trusted setups',
      bulletList(
        Object.values(prover.trustedSetups).flatMap((proofSystem) =>
          formatProofSystemTrustedSetups(proofSystem, pageUrl),
        ),
      ),
    ),
  ])
}

function formatProofSystemTrustedSetups(
  {
    trustedSetups,
    onchainVerifiers,
    verifiers,
    projectsUsedIn,
  }: TrustedSetupsByProofSystem[string],
  pageUrl: string,
) {
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
    `${formatTag(proofSystem)}: ${setups}; ${verifierList}; used in: ${renderUsedIn(projectsUsedIn, pageUrl)}`,
  ]
}
