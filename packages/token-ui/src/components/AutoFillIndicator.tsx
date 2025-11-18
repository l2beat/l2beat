import { SparklesIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/Tooltip'

export function AutoFillIndicator({
  sources,
  available,
  chainName,
}: {
  sources: string[]
  available: boolean
  chainName: string
}) {
  const sourcesString = languageJoin(sources)

  if (available === true) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <SparklesIcon className="size-[1lh]" />
        </TooltipTrigger>
        <TooltipContent>
          Autofill available (using {sourcesString})
        </TooltipContent>
      </Tooltip>
    )
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={`/chains/${chainName}`} target="_blank">
          <SparklesIcon className="size-[1lh] text-red-500" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        Autofill not available (lack of {sourcesString} configuration). Click to
        configure.
      </TooltipContent>
    </Tooltip>
  )
}

function languageJoin(items: string[]) {
  if (items.length === 1) {
    return items[0]
  }
  return `${items.slice(0, -1).join(', ')} or ${items[items.length - 1]}`
}
