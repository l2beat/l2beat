import type { TrustedSetup, ZkCatalogTag } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { ProgramHashesSectionProps } from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import type { TrustedSetupSectionProps } from '~/components/projects/sections/TrustedSetupsSection'
import type { VerifiersSectionProps } from '~/components/projects/sections/verifiers/VerifiersSection'
import { externalLinks } from '~/consts/externalLinks'
import {
  PROGRAM_HASHES_SECTION_INTRO,
  VERIFIER_ID_DEFAULT_DESCRIPTION,
  VERIFIER_STATUS_ORDER,
  VERIFIERS_SECTION_INTRO,
  type VerifierStatus,
} from '~/pages/zk-catalog/v2/components/zkCatalogUi'
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

/*
 * Markdown bodies of the sections describing a proving system (ZK catalog and
 * privacy pages). On the HTML page most of this text sits in tooltips,
 * collapsed table rows and dialogs; here it is all spelled out.
 */

export function renderTrustedSetups(
  { trustedSetups }: Pick<TrustedSetupSectionProps, 'trustedSetups'>,
  level: number,
) {
  return joinBlocks([
    TRUSTED_SETUP_RISK_LEVELS,
    ...trustedSetups.map((setup) =>
      joinBlocks([
        heading(level, setup.name),
        bulletList([
          `Risk: ${formatTrustedSetupRisk(setup.risk)}`,
          `Proof systems: ${setup.proofSystems.map(formatTag).join(', ')}`,
        ]),
        nestHeadings(setup.description, level + 1),
      ]),
    ),
  ])
}

export const TRUSTED_SETUP_FRAMEWORK_LINK = link(
  'Trusted Setups Risk Framework',
  externalLinks.articles.trustedSetupFramework,
)

/** The HTML shows the risk as a coloured dot; the colour alone tells a reader nothing. */
export function formatTrustedSetupRisk(risk: TrustedSetup['risk']) {
  return TRUSTED_SETUP_RISK_LABELS[risk]
}

const TRUSTED_SETUP_RISK_LABELS: Record<TrustedSetup['risk'], string> = {
  green: 'green (lowest risk)',
  yellow: 'yellow (medium risk)',
  red: 'red (highest risk)',
  'N/A': 'N/A (no trusted setup)',
}

/** The criteria of the framework the ZK catalog links, so the levels can be read without it. */
const TRUSTED_SETUP_RISK_LEVELS = `Risk levels follow the ${TRUSTED_SETUP_FRAMEWORK_LINK}. Yellow (medium risk): all contributions are published and the final output can be verified, the ceremony client is open source, there were at least 30 contributions, participation was open to the public and announced, and participants are publicly identified. Green (lowest risk): everything required for yellow, with at least 150 contributions. Red (highest risk): at least one requirement for yellow is not met. N/A: the proof system needs no trusted setup.`

export function renderVerifiers(
  {
    variant,
    proofSystemVerifiers,
  }: Pick<VerifiersSectionProps, 'variant' | 'proofSystemVerifiers'>,
  level: number,
  context: SectionContext,
) {
  // Privacy pages embed a bare list; only the ZK catalog explains and groups it.
  if (variant !== 'zkCatalog') {
    return joinBlocks(
      proofSystemVerifiers.flatMap(({ verifierHashes }) =>
        verifierHashes.map((verifier) =>
          renderVerifier(verifier, level, context),
        ),
      ),
    )
  }
  return joinBlocks([
    VERIFIERS_SECTION_INTRO,
    ...proofSystemVerifiers.map(({ proofSystem, verifierHashes }) =>
      joinBlocks([
        heading(level, `${proofSystem.type}: ${proofSystem.name}`),
        proofSystem.description ?? VERIFIER_ID_DEFAULT_DESCRIPTION,
        ...verifierHashes.map((verifier) =>
          renderVerifier(verifier, level + 1, context),
        ),
      ]),
    ),
  ])
}

export function renderProgramHashes(
  { programHashes }: Pick<ProgramHashesSectionProps, 'programHashes'>,
  level: number,
  context: SectionContext,
) {
  return joinBlocks([
    PROGRAM_HASHES_SECTION_INTRO,
    renderProgramHashList(programHashes, level, context),
  ])
}

/**
 * State validation and smart contracts show the hashes as a subsection,
 * without the catalog intro, which speaks of "this prover".
 */
export function renderProgramHashesSubsection(
  {
    programHashes = [],
    programHashesDescription,
  }: {
    programHashes?: ProgramHashesSectionProps['programHashes']
    programHashesDescription?: string
  },
  level: number,
  context: SectionContext,
) {
  return subsection(
    level,
    'Program Hashes',
    joinBlocks([
      renderProgramHashList(programHashes, level + 1, context),
      nestHeadings(programHashesDescription, level + 1),
    ]),
  )
}

function renderProgramHashList(
  programHashes: ProgramHashesSectionProps['programHashes'],
  level: number,
  context: SectionContext,
) {
  return joinBlocks(
    programHashes.map((program) =>
      joinBlocks([
        heading(level, program.title),
        program.description ?? '',
        bulletList([
          `Hash: \`${program.hash}\``,
          `Repository: ${program.programUrl ?? 'code unknown'}`,
          `Verification: ${renderVerificationStatus(program.verificationStatus)}`,
          `Used in: ${renderUsedIn(program.usedIn, context.pageUrl)}`,
        ]),
        renderVerificationSteps(program.verificationSteps, level + 1),
      ]),
    ),
  )
}

/** Tags on the HTML page show the name and reveal the type on hover. */
export function formatTag(tag: ZkCatalogTag) {
  return `${tag.name} (${tag.type})`
}

/** Project URLs are paths; resolved against the page they become citable. */
export function renderUsedIn(
  projects: UsedInProjectWithIcon[],
  pageUrl: string,
) {
  if (projects.length === 0) return 'none'
  return projects
    .map((project) => link(project.name, resolveSiteUrl(project.url, pageUrl)))
    .join(', ')
}

export function renderVerificationStatus(
  status: VerifierStatus,
  attesters: ZkCatalogAttester[] = [],
) {
  const by =
    attesters.length > 0
      ? ` (${ATTESTER_ROLES[status]} ${attesters.map((a) => link(a.name, a.link)).join(', ')})`
      : ''
  return `${VERIFICATION_STATUS_LABELS[status]}${by}`
}

/** How many verifiers ended in each status, e.g. "2 successful, 1 not verified"; the HTML shows counted status icons. */
export function formatVerifierCounts(
  verifiers: Partial<
    Record<VerifierStatus, { count: number; attesters?: ZkCatalogAttester[] }>
  >,
  separator = ', ',
) {
  const counts = VERIFIER_STATUS_ORDER.flatMap((status) => {
    const group = verifiers[status]
    return group && group.count > 0
      ? [`${group.count} ${renderVerificationStatus(status, group.attesters)}`]
      : []
  })
  return counts.length > 0 ? counts.join(separator) : 'none'
}

/** Worded to follow "Verification:" or a count, unlike the tooltips of the HTML icons. */
const VERIFICATION_STATUS_LABELS: Record<VerifierStatus, string> = {
  successful: 'successful',
  notVerified: 'not verified',
  unsuccessful: 'unsuccessful',
}

/**
 * The HTML puts a bare "by" before the attester icons; after "not verified"
 * that would read as if the attester had verified it.
 */
const ATTESTER_ROLES: Record<VerifierStatus, string> = {
  successful: 'verified by',
  notVerified: 'status reported by',
  unsuccessful: 'checked by',
}

function renderVerifier(
  verifier: VerifiersSectionProps['proofSystemVerifiers'][number]['verifierHashes'][number],
  level: number,
  context: SectionContext,
) {
  return joinBlocks([
    heading(level, verifier.name),
    verifier.description ?? '',
    bulletList([
      `Verifier ID: \`${verifier.hash}\``,
      ...(verifier.sourceLink ? [`Source: ${verifier.sourceLink}`] : []),
      `Verification: ${renderVerificationStatus(verifier.verificationStatus, verifier.attesters)}`,
      `Used in: ${renderUsedIn(verifier.projectsUsedIn, context.pageUrl)}`,
    ]),
    renderKnownDeployments(verifier.knownDeployments, context.pageUrl),
    renderVerificationSteps(verifier.verificationSteps, level + 1),
  ])
}

function renderKnownDeployments(
  deployments: VerifiersSectionProps['proofSystemVerifiers'][number]['verifierHashes'][number]['knownDeployments'],
  pageUrl: string,
) {
  if (deployments.length === 0) return ''
  return joinBlocks([
    '**Known deployments**',
    bulletList(
      deployments.map((deployment) => {
        const address = deployment.url
          ? link(deployment.address, deployment.url)
          : deployment.address
        return `${address} on ${deployment.chain}, used in: ${renderUsedIn(deployment.projectsUsedIn, pageUrl)}`
      }),
    ),
  ])
}

function renderVerificationSteps(steps: string | undefined, level: number) {
  return subsection(
    level,
    'Verification steps',
    nestHeadings(steps ?? '', level + 1),
  )
}
