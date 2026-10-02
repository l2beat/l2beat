import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { formatChange, formatUsd } from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'
import {
  formatTag,
  formatTrustedSetupRisk,
  formatVerifierCounts,
  renderUsedIn,
  TRUSTED_SETUP_FRAMEWORK_LINK,
} from '~/server/markdown/zkSectionBodies'

/** The markdown alternate of the ZK catalog project page, from the entry the HTML page renders. */
export function renderZkCatalogProjectMarkdown(
  entry: ProjectZkCatalogEntry,
): string {
  // Production URL, like the canonical link: the document is meant to be
  // cited, whichever deployment rendered it.
  return renderProjectMarkdown({
    name: entry.name,
    pageUrl: `${PRODUCTION_ORIGIN}/zk-catalog/${entry.slug}`,
    summary: {
      warnings: compact([
        ...getProjectStatusWarnings(entry),
        entry.header.emergencyWarning,
        entry.header.redWarning?.text,
        entry.header.warning,
      ]),
      facts: getFacts(entry),
      // The page has no risk rosette: trusted setup risks are facts instead.
      risks: [],
      description: entry.header.description,
    },
    header: { links: entry.header.links },
    sections: entry.sections,
    apiLinks: {},
  })
}

/** Labels follow the header and the summary block at the top of the HTML page. */
function getFacts({ creator, header }: ProjectZkCatalogEntry) {
  const { zkVM = [], snark = [], finalWrap = [] } = header.techStack
  const zkVMTags = [...zkVM, ...snark]
  return compact([
    creator && { label: 'Creator', value: creator },
    header.tvs.value > 0 && {
      label: 'Total Value Secured',
      value: `${formatUsd(header.tvs.value)} (${formatChange(header.tvs.change, header.tvs.changePeriod)})`,
    },
    ...Object.values(header.trustedSetupsByProofSystem).map((proofSystem) =>
      getTrustedSetupsFact(proofSystem),
    ),
    zkVMTags.length > 0 && {
      label: 'zkVM',
      value: zkVMTags.map(formatTag).join(', '),
    },
    finalWrap.length > 0 && {
      label: 'Final wrap',
      value: finalWrap.map(formatTag).join(', '),
    },
  ])
}

/**
 * One row of the "Trusted setups" table: the setups of one proof system, with
 * the tooltip text of each, where it is used and how its verifiers checked
 * out. Named by the proof system tag, as a project can have several of one
 * type (e.g. two Groth16 wraps).
 */
function getTrustedSetupsFact({
  trustedSetups,
  projectsUsedIn,
  verifiers,
}: TrustedSetupsByProofSystem[string]) {
  const proofSystem = trustedSetups[0]?.proofSystem
  if (!proofSystem) return undefined
  return {
    label: `Trusted setups for ${formatTag(proofSystem)}`,
    details: [
      ...trustedSetups.map(
        (setup) =>
          `${setup.name}, risk ${formatTrustedSetupRisk(setup.risk)} per the ${TRUSTED_SETUP_FRAMEWORK_LINK}: ${setup.shortDescription}`,
      ),
      `Used in: ${renderUsedIn(projectsUsedIn)}`,
      `Verifiers: ${formatVerifierCounts(verifiers)}`,
    ],
  }
}
