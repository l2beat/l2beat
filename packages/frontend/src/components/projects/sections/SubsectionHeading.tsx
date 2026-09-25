import type { ReactNode } from 'react'
import { useParentHeadingLevel } from '~/components/markdown/ParentHeadingLevelContext'

interface SubsectionHeadingProps {
  /** How many levels below the section title; 2 for a heading under a subsection. */
  depth?: 1 | 2
  id?: string
  className?: string
  children: ReactNode
}

/**
 * A section is h2 at the top level but h3 inside a DA group, so a fixed tag
 * would sit beside its section instead of under it in one of the two cases.
 */
export function SubsectionHeading({
  depth = 1,
  ...props
}: SubsectionHeadingProps) {
  const level = Math.min(useParentHeadingLevel() + depth, 6)
  const Heading = `h${level}` as 'h3'
  return <Heading {...props} />
}
