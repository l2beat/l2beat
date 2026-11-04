import { formatCurrency } from '@l2beat/shared-pure'
import {
  formatContractCount,
  formatCriticalChangesPerYear,
} from '~/components/ossification/formatCriticalChangesPerYear'
import { OSSIFICATION_VALUE_LABELS } from '~/components/ossification/ossificationValueLabels'
import {
  getCachedOssificationEntries,
  type OssificationEntry,
} from '~/server/features/projects/ossification/getOssificationEntries'
import { formatTimestamp } from '~/utils/dates'
import {
  type LinkListSection,
  type MarkdownLink,
  withFacts,
} from '../listPageMarkdown'

/** One section per category with projects, each in the table's order: highest score first. */
export async function getOssificationListSections(): Promise<
  LinkListSection[]
> {
  const entries = await getCachedOssificationEntries()
  return SECTIONS.map(({ category, heading }) => ({
    heading,
    links: entries
      .filter((entry) => entry.category === category)
      .flatMap(ossificationLink),
  })).filter((section) => section.links.length > 0)
}

const SECTIONS: {
  category: OssificationEntry['category']
  heading: string
}[] = [
  { category: 'Layer 2', heading: 'Layer 2s (/layer2s/projects/{slug})' },
  { category: 'Layer 3', heading: 'Layer 3s (/layer2s/projects/{slug})' },
  {
    category: 'Privacy',
    heading: 'Privacy protocols (/privacy/projects/{slug})',
  },
  { category: 'DeFi', heading: 'DeFi protocols (/defi/projects/{slug})' },
]

/** Every entry has a page while the ossification page is on, which is when this is served. */
function ossificationLink(entry: OssificationEntry): MarkdownLink[] {
  if (!entry.href) return []
  return [
    {
      name: entry.name,
      path: entry.href,
      description: withFacts('', [
        entry.isUnverified
          ? 'ossification not calculated: unverified critical contracts'
          : `ossification ${entry.score}%`,
        `clock since ${formatTimestamp(entry.timeline.clockStart)}`,
        entry.exposure !== null &&
          entry.valueSource !== null &&
          `battle-tested exposure ${formatCurrency(entry.exposure, 'usd')}·years of ${OSSIFICATION_VALUE_LABELS[entry.valueSource].long}`,
        `${formatCriticalChangesPerYear(entry)} critical changes / year ${formatContractCount(entry.contractCount)}`,
        entry.exitWindow && `exit window: ${entry.exitWindow.value}`,
      ]),
    },
  ]
}
