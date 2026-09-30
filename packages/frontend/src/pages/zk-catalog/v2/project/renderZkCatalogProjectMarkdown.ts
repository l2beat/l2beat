import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { formatChange, formatUsd } from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import {
  formatTag,
  renderUsedIn,
  renderVerificationStatus,
  VERIFICATION_STATUSES,
} from '~/server/markdown/zkSectionBodies'

/** The markdown alternate of the ZK catalog project page, from the entry the HTML page renders. */
export function renderZkCatalogProjectMarkdown(
  entry: ProjectZkCatalogEntry,
): string {
  // Production URL, like the canonical link: the document is meant to be
  // cited, whichever deployment rendered it.
  const pageUrl = `${PRODUCTION_ORIGIN}/zk-catalog/${entry.slug}`
  return renderProjectMarkdown({
    name: entry.name,
    pageUrl,
    summary: {
      warnings: compact([
        entry.header.emergencyWarning,
        entry.header.redWarning?.text,
        entry.header.warning,
      ]),
      facts: getFacts(entry, pageUrl),
      // The page has no risk rosette: trusted setup risks are facts instead.
      risks: [],
      description: entry.header.description,
    },
    sections: entry.sections,
    apiLinks: {},
  })
}

/** Labels follow the header and the summary block at the top of the HTML page. */
function getFacts({ creator, header }: ProjectZkCatalogEntry, pageUrl: string) {
  const { zkVM = [], snark = [], finalWrap = [] } = header.techStack
  const zkVMTags = [...zkVM, ...snark]
  return compact([
    creator && { label: 'Creator', value: creator },
    header.tvs.value > 0 && {
      label: 'Total Value Secured',
      value: `${formatUsd(header.tvs.value)} (${formatChange(header.tvs.change, header.tvs.changePeriod)})`,
    },
    ...Object.values(header.trustedSetupsByProofSystem).map((proofSystem) =>
      getTrustedSetupsFact(proofSystem, pageUrl),
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

/** One row of the "Trusted setups" table: the setups of one proof system, where it is used and how its verifiers checked out. */
function getTrustedSetupsFact(
  {
    trustedSetups,
    projectsUsedIn,
    verifiers,
  }: TrustedSetupsByProofSystem[string],
  pageUrl: string,
) {
  const proofSystem = trustedSetups[0]?.proofSystem
  if (!proofSystem) return undefined
  const setups = trustedSetups
    .map((setup) => `${setup.name} (risk: ${setup.risk})`)
    .join(', ')
  return {
    label: `Trusted setups for ${proofSystem.type}`,
    value: `${setups}; used in: ${renderUsedIn(projectsUsedIn, pageUrl)}; verifiers: ${countVerifiers(verifiers)}`,
  }
}

function countVerifiers(
  verifiers: TrustedSetupsByProofSystem[string]['verifiers'],
) {
  const counts = VERIFICATION_STATUSES.flatMap((status) => {
    const group = verifiers[status]
    return group && group.count > 0
      ? [`${group.count} ${renderVerificationStatus(status, group.attesters)}`]
      : []
  })
  return counts.length > 0 ? counts.join(', ') : 'none'
}
