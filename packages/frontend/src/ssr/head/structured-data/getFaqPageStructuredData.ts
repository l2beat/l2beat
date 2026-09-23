import MarkdownIt from 'markdown-it'
import type { FaqItem } from '~/pages/faq/FaqItems'
import { withSchemaOrgContext } from './StructuredData'

// Answers are markdown; schema.org Answer text accepts HTML, so links and
// emphasis survive instead of showing up as raw markdown syntax.
const markdown = MarkdownIt({ html: true, typographer: true })

export function getFaqPageStructuredData(items: FaqItem[]) {
  return withSchemaOrgContext({
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: markdown.render(joinParagraphs(item.answer)),
      },
    })),
  })
}

function joinParagraphs(answer: FaqItem['answer']) {
  return Array.isArray(answer) ? answer.join('\n\n') : answer
}
