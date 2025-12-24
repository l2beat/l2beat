import MarkdownIt from 'markdown-it'
import { cn } from '../utils/cn'

interface MarkdownProps {
  children: string
  inline?: boolean
  className?: string
}

const markdown = MarkdownIt({
  html: true,
  typographer: true,
})

export function Markdown(props: MarkdownProps) {
  const Comp = props.inline ? 'span' : 'div'
  const render = (text: string) =>
    props.inline ? markdown.renderInline(text) : markdown.render(text)

  const rendered = render(props.children)

  return (
    <Comp
      className={cn('mdc', props.className)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}
