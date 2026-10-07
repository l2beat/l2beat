import { cn } from '~/utils/cn'
import { createMarkdown } from '~/utils/markdown/createMarkdown'
import { outLinksPlugin } from '~/utils/markdown/outlinksPlugin'

interface ArticleProps {
  children: string
  className?: string
}

const markdown = createMarkdown().use(outLinksPlugin)

export function Article(props: ArticleProps) {
  return (
    <article
      className={cn('article', props.className)}
      dangerouslySetInnerHTML={{ __html: markdown.render(props.children) }}
    />
  )
}
