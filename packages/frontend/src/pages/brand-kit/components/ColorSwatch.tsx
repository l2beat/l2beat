import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard'
import { useTimeout } from '~/hooks/useTimeout'
import { cn } from '~/utils/cn'

export function ColorSwatch({
  color,
  label,
  darkText,
}: {
  color: string
  label: string
  darkText?: boolean
}) {
  const copy = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1400 : null)

  function copyToClipboard() {
    copy(color).then((success) => setCopied(success))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Tooltip>
        <TooltipTrigger
          onClick={(event) => {
            event.preventDefault()
            copyToClipboard()
          }}
        >
          <div
            className="flex h-20 items-end rounded-lg border border-divider p-3"
            style={{ backgroundColor: color }}
          >
            <span
              className={cn(
                'font-mono font-semibold text-sm',
                darkText ? 'text-black' : 'text-white',
              )}
            >
              {color}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          hideWhenDetached
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          {copied ? 'Copied!' : 'Copy color'}
        </TooltipContent>
      </Tooltip>
      <span className="text-secondary text-xs">{label}</span>
    </div>
  )
}
