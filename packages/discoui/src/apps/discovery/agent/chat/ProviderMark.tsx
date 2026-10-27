import { IconPrompt } from '../../../../icons/IconPrompt'
import { IconSparkle } from '../../../../icons/IconSparkle'
import { cn } from '../../../../utils/cn'

const CLAUDE_COLOR = '#D97757'

export function ProviderMark(props: {
  provider: string | undefined
  className?: string
}) {
  if (props.provider === 'codex') {
    return <IconPrompt className={cn('text-aux-teal', props.className)} />
  }
  return (
    <span style={{ color: CLAUDE_COLOR }} className="contents">
      <IconSparkle className={props.className} />
    </span>
  )
}
