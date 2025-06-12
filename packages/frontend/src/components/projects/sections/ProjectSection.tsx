import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { HighlightablePrimaryCard } from '~/components/primary-card/HighlightablePrimaryCard'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { MaximizeIcon } from '~/icons/Maximize'
import { MinimizeIcon } from '~/icons/Minimize'
import { cn } from '~/utils/cn'
import { UnderReviewCallout } from '../UnderReviewCallout'
import type { ProjectSectionId } from './types'

export interface ExtendedProjectSectionProps {
  title: string
  id: ProjectSectionId
  nested?: boolean
  sectionOrder: string | undefined
  className?: string
  children: ReactNode
  isUnderReview?: boolean
  fullscreenable?: boolean
  hideChildrenIfUnderReview?: boolean
  as?: 'section' | 'div'
}

export function ProjectSection(props: ExtendedProjectSectionProps) {
  const Component = props.as ?? 'section'
  const [isFullScreen, setIsFullScreen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setIsFullScreen(false))

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isFullScreen])

  return (
    <>
      <HighlightablePrimaryCard
        id={props.id}
        data-role="project-section"
        className={cn(
          'scroll-mt-10 px-4 py-8 md:mt-10 md:scroll-mt-8 md:p-8',
          'max-md:border-divider max-md:border-b max-md:last:border-none',
          'md:rounded-lg',
          props.nested && 'mt-10 p-0 md:p-0',
          props.className,
        )}
        asChild
      >
        <motion.div layoutId={`project-section-card-${props.id}`}>
          <Component>
            <ProjectDetailsSectionHeader
              title={props.title}
              id={props.id}
              sectionOrder={props.sectionOrder}
              nested={props.nested}
              fullScreenable={
                props.fullscreenable
                  ? { isFullScreen, setIsFullScreen }
                  : undefined
              }
              className="mb-4"
            />
            {props.isUnderReview ? (
              !props.hideChildrenIfUnderReview ? (
                <>
                  <UnderReviewCallout className="mb-4" />
                  {props.children}
                </>
              ) : (
                <UnderReviewCallout />
              )
            ) : (
              props.children
            )}
          </Component>
        </motion.div>
      </HighlightablePrimaryCard>
      {props.fullscreenable ? (
        <>
          <AnimatePresence>
            {isFullScreen ? (
              <motion.div
                className="fixed inset-0 z-999 bg-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {isFullScreen && (
              <div className="fixed inset-0 z-999 grid place-items-center">
                <PrimaryCard
                  asChild
                  className="max-h-[70vh] w-3/4 overflow-y-scroll"
                  ref={ref}
                >
                  <motion.div layoutId={`project-section-card-${props.id}`}>
                    <ProjectDetailsSectionHeader
                      title={props.title}
                      id={props.id}
                      sectionOrder={props.sectionOrder}
                      nested={props.nested}
                      fullScreenable={{ isFullScreen, setIsFullScreen }}
                      className="mb-4"
                    />
                    {props.children}
                  </motion.div>
                </PrimaryCard>
              </div>
            )}
          </AnimatePresence>
        </>
      ) : null}
    </>
  )
}

interface ProjectDetailsSectionHeaderProps {
  id: string
  title: string
  sectionOrder: string | undefined
  nested: boolean | undefined
  fullScreenable?: {
    isFullScreen: boolean
    setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>
  }
  className?: string
}

function ProjectDetailsSectionHeader(props: ProjectDetailsSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <a
        href={props.fullScreenable?.isFullScreen ? undefined : `#${props.id}`}
        className={cn(
          'flex items-center gap-4 md:leading-normal',
          props.nested && 'gap-3',
          props.className,
        )}
      >
        {props.sectionOrder && (
          <motion.div
            layoutId={`project-section-card-${props.id}-order`}
            className={cn(
              'hidden size-10 items-center justify-center rounded bg-surface-secondary px-3 font-bold text-[26px] text-secondary tabular-nums md:flex',
              props.nested && 'h-8 w-11 text-xl',
            )}
          >
            {props.sectionOrder}
          </motion.div>
        )}
        <motion.span
          layoutId={`project-section-card-${props.id}-title`}
          className={cn(
            'font-bold text-2xl md:text-4xl',
            props.nested && 'text-xl md:text-3xl',
          )}
        >
          {props.title}
        </motion.span>
      </a>
      {props.fullScreenable && (
        <motion.button
          layoutId={`project-section-card-${props.id}-maximize`}
          className="ml-auto"
          onClick={() => props.fullScreenable?.setIsFullScreen((prev) => !prev)}
        >
          {props.fullScreenable.isFullScreen ? (
            <MinimizeIcon />
          ) : (
            <MaximizeIcon />
          )}
        </motion.button>
      )}
    </div>
  )
}
