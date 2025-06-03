import type { StageConfigured } from '@l2beat/config'
import { Countdown } from '~/components/Countdown'
import { StageBadge } from '~/components/badge/StageBadge'
import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'
import { useIsMobile } from '~/hooks/useIsMobile'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CloseIcon } from '~/icons/Close'
import { MissingIcon } from '~/icons/Missing'
import { StopwatchIcon } from '~/icons/Stopwatch'
import { CountdownSection } from '../CountdownSection'

interface Props {
  downgradePending: NonNullable<StageConfigured['downgradePending']>
}

export function StageOneRequirementsChangeNotice({ downgradePending }: Props) {
  const isMobile = useIsMobile()
  return (
    <CountdownSection>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h2 className="mr-auto font-bold text-2xl md:text-3xl">
          Stages changes
        </h2>
        <Countdown
          expiresAt={downgradePending.expiresAt}
          size={isMobile ? 'sm' : 'md'}
        />
      </div>
      <div className="mt-4 font-medium text-base">
        The project will be downgraded to{' '}
        <StageBadge stage="Stage 0" isAppchain={false} className="inline" />{' '}
        because it does not satisfy an upcoming Stage 1 principle.
      </div>
      <p className="mt-6 mb-4 font-bold text-lg">
        The project will move to Stage 0 because:
      </p>
      <div className="flex gap-2 bg-red-600/20 p-4">
        <CloseIcon className="mt-[3px] size-3.5 shrink-0 fill-negative md:size-5" />{' '}
        <span>{downgradePending.reason}</span>
      </div>
      <CustomLink
        href={externalLinks.articles.stageOneRequirementsChange}
        className="mt-2.5 flex items-center gap-1 font-bold text-base"
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
        <p className="font-bold text-lg">New requirements coming soon</p>
        <Countdown expiresAt={downgradePending.expiresAt} size="sm" />
        <div className="mt-4 font-medium text-base">
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
          className="mt-2.5 flex items-center gap-1 font-bold text-base"
        >
          Learn more about the new requirements <ArrowRightIcon />
        </CustomLink>
      </div>
    </div>
  )
}
