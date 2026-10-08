import compact from 'lodash/compact'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { formatChange, formatUsd } from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'
import {
  describeProofSystemTrustedSetups,
  formatTag,
} from '~/server/markdown/zkSectionBodies'

/** The markdown alternate of the ZK catalog project page, from the entry the HTML page renders. */
export function renderZkCatalogProjectMarkdown(
  entry: ProjectZkCatalogEntry,
): string {
  return renderProjectMarkdown({
    name: entry.name,
    pagePath: `/zk-catalog/${entry.slug}`,
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

function getTrustedSetupsFact(
  proofSystemSetups: TrustedSetupsByProofSystem[string],
) {
  const described = describeProofSystemTrustedSetups(proofSystemSetups)
  return (
    described && {
      label: `Trusted setups for ${described.proofSystem}`,
      details: described.details,
    }
  )
}
