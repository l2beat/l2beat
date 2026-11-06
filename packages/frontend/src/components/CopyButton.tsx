import { useState } from 'react'

import { useCopyToClipboard } from '~/hooks/useCopyToClipboard'
import { useTimeout } from '~/hooks/useTimeout'
import { CopyIcon } from '~/icons/Copy'
import { SatisfiedIcon } from '~/icons/Satisfied'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from './core/tooltip/Tooltip'

interface CopyButtonProps {
  toCopy: string | (() => string)
  className?: string
  iconClassName?: string
  copyText?: string
}

export function CopyButton({
  toCopy,
  className,
  iconClassName,
  copyText = 'Copy URL',
}: CopyButtonProps) {
  const copy = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1400 : null)

  function copyToClipboard() {
    copy(typeof toCopy === 'function' ? toCopy() : toCopy)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
    setCopied(true)
  }

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(className)}
        aria-label={copied ? 'Copied' : copyText}
        onClick={(event) => {
          event.preventDefault()
          copyToClipboard()
        }}
      >
        {/* One spot for both: on copying, the tick wipes in from the left
            as the copy icon wipes out at the same edge. Going back is
            instant. */}
        <span className="grid *:col-start-1 *:row-start-1">
          <CopyIcon
            className={cn(
              'fill-current',
              copied
                ? '[clip-path:inset(0_0_0_100%)] motion-safe:transition-[clip-path] motion-safe:duration-200 motion-safe:ease-out'
                : '[clip-path:inset(0)]',
              iconClassName,
            )}
          />
          <SatisfiedIcon
            aria-hidden
            className={cn(
              'fill-green-700 dark:fill-green-450',
              copied
                ? '[clip-path:inset(0)] motion-safe:transition-[clip-path] motion-safe:duration-200 motion-safe:ease-out'
                : '[clip-path:inset(0_100%_0_0)]',
              iconClassName,
            )}
          />
        </span>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          className="z-1000"
          hideWhenDetached
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          {copied ? 'Copied!' : copyText}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
