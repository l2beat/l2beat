'use client'

import { type ReactNode, useState } from 'react'

import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { useTimeout } from '~/hooks/use-timeout'
import { CopyIcon } from '~/icons/copy'
import { CopyBookIcon } from '~/icons/copy-book'
import { SatisfiedIcon } from '~/icons/satisfied'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/tooltip'

interface CopyButtonProps {
  toCopy: string
  className?: string
  variant?: 'default' | 'glossary'
}

interface IconConfig {
  default: {
    active: ReactNode
    inactive: ReactNode
  }
  glossary: {
    active: ReactNode
    inactive: ReactNode
  }
}

const iconConfig: IconConfig = {
  default: {
    active: <SatisfiedIcon className="size-4" />,
    inactive: <CopyIcon className="size-4 fill-gray-750 dark:fill-white/80" />,
  },
  glossary: {
    active: <SatisfiedIcon className="fill-green-700  dark:fill-green-450" />,
    inactive: (
      <CopyBookIcon className="fill-blue-700 hover:fill-blue-600 dark:fill-blue-500 dark:hover:fill-blue-550" />
    ),
  },
}

export function CopyGlossaryButton({
  ...props
}: Omit<CopyButtonProps, 'variant'>) {
  return <CopyButton {...props} variant="glossary" />
}

export function CopyButton({ variant = 'default', ...props }: CopyButtonProps) {
  const copy = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1400 : null)

  function copyToClipboard() {
    copy(props.toCopy)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
    setCopied(true)
  }

  const icons = iconConfig[variant]

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(props.className)}
        onClick={(event) => {
          event.preventDefault()
          copyToClipboard()
        }}
      >
        {copied ? icons.active : icons.inactive}
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
