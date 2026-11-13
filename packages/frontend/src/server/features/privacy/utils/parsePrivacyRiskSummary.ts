import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'
import { PRIVACY_ADVERSARIES_SECTION_ID } from '~/pages/privacy/adversaries/privacyAdversaryUi'

/**
 * A privacy risk summary as risk groups, for a page that shows it among
 * generated ones. The summaries are `## Heading` + numbered list markdown.
 *
 * Like a generated item, each is plain text linking to a section: the one its
 * own text links to, else the adversaries for privacy risks and the
 * description for the rest. A page without a description links those to the
 * adversaries too, so that no link is dead.
 */
export function parsePrivacyRiskSummary(
  markdown: string,
  page: { hasDescription: boolean },
): Omit<RiskGroup, 'start'>[] {
  return markdown
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [heading = '', ...lines] = block.replace(/<br>/g, '').split('\n')
      const name = heading.trim()
      const items: string[] = []
      for (const line of lines) {
        const item = line.match(/^\d+\.\s+(.*)/)
        if (item?.[1]) items.push(item[1].trim())
        // A line that wraps the item above
        else if (line.trim() && items.length > 0) {
          items[items.length - 1] += ` ${line.trim()}`
        }
      }
      return {
        name,
        items: items.map((item) => ({
          text: toPlainText(item),
          referencedId:
            item.match(/\]\(#([\w-]+)\)/)?.[1] ??
            (name === 'Privacy can be lost if' || !page.hasDescription
              ? PRIVACY_ADVERSARIES_SECTION_ID
              : 'detailed-description'),
          isCritical: false,
        })),
      }
    })
}

/** The text of inline markdown: links and emphasis dropped. */
function toPlainText(markdown: string) {
  return markdown.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '')
}
