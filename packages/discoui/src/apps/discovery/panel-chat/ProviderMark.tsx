import type { ApiChatProvider } from '../../../api/types'
import { IconPrompt } from '../../../icons/IconPrompt'
import { IconSparkle } from '../../../icons/IconSparkle'
import { cn } from '../../../utils/cn'

export const PROVIDER_NAMES: Record<ApiChatProvider, string> = {
  claude: 'Claude Code',
  codex: 'Codex',
}

// Claude's orange and a terminal prompt for Codex, so the researcher sees
// at a glance which agent answers.
export function ProviderMark(props: {
  provider: ApiChatProvider
  className?: string
}) {
  if (props.provider === 'codex') {
    return <IconPrompt className={cn('text-aux-teal', props.className)} />
  }
  return <IconSparkle className={cn('text-aux-orange', props.className)} />
}
