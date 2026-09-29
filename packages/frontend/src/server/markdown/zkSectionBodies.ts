import type { ZkCatalogTag } from '@l2beat/config'
import type { ZkCatalogAttester } from '@l2beat/config/build/common/zkCatalogAttesters'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { ProgramHashesSectionProps } from '~/components/projects/sections/program-hashes/ProgramHashesSection'
import type { TrustedSetupSectionProps } from '~/components/projects/sections/TrustedSetupsSection'
import type { VerifiersSectionProps } from '~/components/projects/sections/verifiers/VerifiersSection'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
  nestHeadings,
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
  return joinBlocks(
    trustedSetups.map((setup) =>
      joinBlocks([
        heading(level, setup.name),
        bulletList([
          `Risk: ${setup.risk}`,
          `Proof systems: ${setup.proofSystems.map(formatTag).join(', ')}`,
        ]),
        nestHeadings(setup.description, level + 1),
      ]),
    ),
  )
}

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
    'List of different onchain verifiers for this proving system. Unique ID distinguishes different deployments of the same verifier from different verifiers (e.g. different versions).',
    ...proofSystemVerifiers.map(({ proofSystem, verifierHashes }) =>
      joinBlocks([
        heading(level, `${proofSystem.type}: ${proofSystem.name}`),
        proofSystem.description,
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
    "List of known guest zkVM programs used by this prover. Each program represents a piece of offchain execution that is verified onchain. The program hash serves as the program's unique identifier.",
    ...programHashes.map((program) =>
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
  ])
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
    .map((project) => link(project.name, new URL(project.url, pageUrl).href))
    .join(', ')
}

export type VerificationStatus = keyof typeof VERIFICATION_STATUS_LABELS

/** In the order the HTML page lists them. */
export const VERIFICATION_STATUSES = [
  'successful',
  'notVerified',
  'unsuccessful',
] as const satisfies VerificationStatus[]

export function renderVerificationStatus(
  status: VerificationStatus,
  attesters: ZkCatalogAttester[] = [],
) {
  const by =
    attesters.length > 0
      ? ` (by ${attesters.map((a) => link(a.name, a.link)).join(', ')})`
      : ''
  return `${VERIFICATION_STATUS_LABELS[status]}${by}`
}

const VERIFICATION_STATUS_LABELS = {
  successful: 'successful',
  notVerified: 'not verified',
  unsuccessful: 'unsuccessful',
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
        return `${address}, used in: ${renderUsedIn(deployment.projectsUsedIn, pageUrl)}`
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
