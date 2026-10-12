import type { FaqItem } from '~/pages/faq/FaqItems'
import { createMarkdown } from '~/utils/markdown/createMarkdown'

export function getFaqStructuredData(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: markdown.render(item.answer),
      },
    })),
  }
}

// Answers are markdown; schema.org Answer text accepts HTML, so links and
// emphasis survive instead of showing up as raw markdown syntax.
const markdown = createMarkdown()
