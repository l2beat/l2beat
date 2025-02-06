'use client'
import type { StageConfigured } from '@l2beat/config'
import { StageBadge } from '~/components/badge/stage-badge'
import { Countdown } from '~/components/countdown'
import { CustomLink } from '~/components/link/custom-link'
import { externalLinks } from '~/consts/external-links'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { ArrowRightIcon } from '~/icons/arrow-right'
import { CloseIcon } from '~/icons/close'
import { MissingIcon } from '~/icons/missing'
import { StopwatchIcon } from '~/icons/stopwatch'
import { CountdownSection } from '../countdown-section'

interface Props {
  downgradePending: NonNullable<StageConfigured['downgradePending']>
}

export function StageOneRequirementsChangeNotice({ downgradePending }: Props) {
  const isMobile = useIsMobile()
  return (
    <CountdownSection>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h2 className="mr-auto text-2xl font-bold md:text-3xl">
          Stages changes
        </h2>
        <Countdown
          expiresAt={downgradePending.expiresAt}
          size={isMobile ? 'sm' : 'md'}
        />
      </div>
      <div className="mt-4 text-base font-medium">
        The project will be downgraded to{' '}
        <StageBadge stage="Stage 0" isAppchain={false} className="inline" />{' '}
        because it does not satisfy an upcoming Stage 1 principle.
      </div>
      <p className="mb-4 mt-6 text-lg font-bold">
        The project will move to Stage 0 because:
      </p>
      <div className="flex gap-2 bg-red-600/20 p-4">
        <CloseIcon className="mt-[3px] size-3.5 shrink-0 fill-negative md:size-5" />{' '}
        <span>{downgradePending.reason}</span>
      </div>
      <CustomLink
        href={externalLinks.articles.stageOneRequirementsChange}
        className="mt-2.5 flex items-center gap-1 text-base font-bold"
      >
        Learn more about the new requirements <ArrowRightIcon />
      </CustomLink>
    </CountdownSection>
  )
}

export function StageOneRequirementsChangeStageSectionNotice({
  downgradePending,
}: Props) {
  return (
    <div className="flex gap-2 rounded-lg bg-brand/20 p-4">
      <StopwatchIcon className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="text-lg font-bold">New requirements coming soon</p>
        <Countdown expiresAt={downgradePending.expiresAt} size="sm" />
        <div className="mt-4 text-base font-medium">
          The project will be downgraded to{' '}
          <StageBadge stage="Stage 0" isAppchain={false} className="inline" />{' '}
          because it does not satisfy an upcoming Stage 1 principle.
        </div>
        <div className="flex gap-2">
          <MissingIcon className="mt-[5px] size-4 shrink-0 fill-negative" />
          <span>{downgradePending.reason}</span>
        </div>{' '}
        <CustomLink
          href={externalLinks.articles.stageOneRequirementsChange}
          className="mt-2.5 flex items-center gap-1 text-base font-bold"
        >
          Learn more about the new requirements <ArrowRightIcon />
        </CustomLink>
      </div>
    </div>
  )
}
