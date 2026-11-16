import type { ReactNode } from 'react'
import {
  ACTION_BUTTON_CLASS,
  SECTION_ACTION_BUTTON_CLASS,
} from '~/components/core/actionButtonClassNames'
import { cn } from '~/utils/cn'

interface Props {
  href: string
  variant?: 'controls' | 'section'
  className?: string
  children?: ReactNode
}

const VARIANT_CLASSES = {
  controls: ACTION_BUTTON_CLASS,
  section: SECTION_ACTION_BUTTON_CLASS,
}

export function CompareProjectsLink({
  href,
  variant = 'controls',
  className,
  children = 'Compare projects',
}: Props) {
  return (
    <a href={href} className={cn(VARIANT_CLASSES[variant], className)}>
      {children}
    </a>
  )
}
