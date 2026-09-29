import type { ReactNode } from 'react'
import {
  ParentHeadingLevelProvider,
  useParentHeadingLevel,
} from '~/components/markdown/ParentHeadingLevelContext'

interface SubsectionProps {
  /** Rendered as-is; put the `SubsectionHeading` wherever the layout needs it. */
  title: ReactNode
  children: ReactNode
}

/**
 * Markdown and headings under a subsection must nest below its title, not
 * beside it. Only the enclosing heading level is known from context, so the
 * subsection passes its own level down to its content.
 */
export function Subsection({ title, children }: SubsectionProps) {
  const level = subsectionLevel(useParentHeadingLevel())
  return (
    <>
      {title}
      <ParentHeadingLevelProvider value={level}>
        {children}
      </ParentHeadingLevelProvider>
    </>
  )
}

interface SubsectionHeadingProps {
  id?: string
  className?: string
  children: ReactNode
}

/**
 * A section is h2 at the top level but h3 inside a DA group, so a fixed tag
 * would sit beside its section instead of under it in one of the two cases.
 */
export function SubsectionHeading(props: SubsectionHeadingProps) {
  const Heading = `h${subsectionLevel(useParentHeadingLevel())}` as 'h2'
  return <Heading {...props} />
}

/** The page's h1 is the project title, so nothing else goes above h2. */
function subsectionLevel(parentLevel: number): number {
  return Math.min(Math.max(parentLevel + 1, 2), 6)
}
