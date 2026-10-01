import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'

/*
 * The document shape shared by llms.txt and the markdown versions of the list
 * pages: an H1, a blockquote summary and H2 sections of described links.
 */

export interface MarkdownSection {
  heading: string
  description?: string
  links: MarkdownLink[]
}

export type MarkdownLink = { name: string; description: string } & (
  | { path: `/${string}` }
  | { url: string }
)

/** Same shape as llms.txt (H1, blockquote, H2 link lists) so one parser reads both. */
export function renderMarkdown(
  document: { title: string; summary: string; notes?: string },
  sections: MarkdownSection[],
): string {
  const rendered = sections.map((section) =>
    [
      `## ${section.heading}`,
      '',
      ...(section.description ? [section.description, ''] : []),
      ...section.links.map(
        (link) => `- [${link.name}](${linkUrl(link)}): ${link.description}`,
      ),
    ].join('\n'),
  )

  return `${[
    `# ${document.title}`,
    `> ${document.summary}`,
    document.notes,
    ...rendered,
  ]
    .filter((part) => part !== undefined)
    .join('\n\n')}\n`
}

/** "Fact, fact, fact. Description." keeps each line scannable and one line long. */
export function withFacts(description: string, facts: unknown[]): string {
  const known = facts.filter(
    (fact): fact is string => typeof fact === 'string' && fact !== '',
  )
  return [known.join(', '), description].filter(Boolean).join('. ')
}

export function firstSentence(text: string): string {
  const oneLine = text.replaceAll(/\s+/g, ' ').trim()
  const match = oneLine.match(/^.+?[.!?](?=\s|$)/)
  return match?.[0] ?? oneLine
}

function linkUrl(link: MarkdownLink) {
  return 'url' in link ? link.url : PRODUCTION_ORIGIN + link.path
}
