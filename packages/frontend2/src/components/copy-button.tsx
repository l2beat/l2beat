'use client'

import { useState } from 'react'

import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { useTimeout } from '~/hooks/use-timeout'
import { CopyIcon } from '~/icons/copy'
import { SatisfiedIcon } from '~/icons/satisfied'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/tooltip'

interface Props {
  toCopy: string
  className?: string
}

export function CopyButton(props: Props) {
  const copy = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1400 : null)

  function copyToClipboard() {
    copy(props.toCopy)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
    setCopied(true)
  }

  return (
    <Tooltip>
      <TooltipTrigger
        className={props.className}
        onClick={(event) => {
          event.preventDefault()
          copyToClipboard()
        }}
      >
        <div className="relative size-6">
          <CopyIcon
            className={cn(
              'absolute inset-0 size-6 fill-blue-700 transition-opacity duration-200 hover:fill-blue-600 dark:fill-blue-500 dark:hover:fill-blue-550',
              copied ? 'opacity-0' : 'opacity-100',
            )}
          />
          <SatisfiedIcon
            className={cn(
              'absolute inset-0 size-6 fill-green-700 transition-opacity duration-200 dark:fill-green-450',
              copied ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
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
