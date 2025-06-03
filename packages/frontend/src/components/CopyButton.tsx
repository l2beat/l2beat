import { useState } from 'react'

import { useCopyToClipboard } from '~/hooks/useCopyToClipboard'
import { useTimeout } from '~/hooks/useTimeout'
import { CopyIcon } from '~/icons/Copy'
import { SatisfiedIcon } from '~/icons/Satisfied'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

interface CopyButtonProps {
  toCopy: string
  className?: string
  iconClassName?: string
}

export function CopyButton({
  toCopy,
  className,
  iconClassName,
}: CopyButtonProps) {
  const copy = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1400 : null)

  function copyToClipboard() {
    copy(toCopy)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
    setCopied(true)
  }

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(className)}
        onClick={(event) => {
          event.preventDefault()
          copyToClipboard()
        }}
      >
        {copied ? (
          <SatisfiedIcon
            className={cn('fill-green-700 dark:fill-green-450', iconClassName)}
          />
        ) : (
          <CopyIcon className={cn('fill-current', iconClassName)} />
        )}
      </TooltipTrigger>
      <TooltipContent
        hideWhenDetached
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        {copied ? 'Copied!' : 'Copy URL'}
      </TooltipContent>
    </Tooltip>
  )
}
