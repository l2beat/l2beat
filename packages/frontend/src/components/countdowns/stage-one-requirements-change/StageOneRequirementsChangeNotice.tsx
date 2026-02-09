import type { StageConfigured } from '@l2beat/config'
import { StageBadge } from '~/components/badge/StageBadge'
import { Countdown } from '~/components/Countdown'
import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'
import { useDevice } from '~/hooks/useDevice'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CloseIcon } from '~/icons/Close'
import { MissingIcon } from '~/icons/Missing'
import { StopwatchIcon } from '~/icons/Stopwatch'
import { cn } from '~/utils/cn'
import { CountdownSection } from '../CountdownSection'

export function StageOneRequirementsChangeNotice({
  downgradePending,
}: {
  downgradePending: NonNullable<StageConfigured['downgradePending']>
}) {
  const { isDesktop } = useDevice()
  return (
    <CountdownSection>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h2 className="mr-auto text-heading-24">Stages changes</h2>
        <Countdown
          expiresAt={downgradePending.expiresAt}
          size={isDesktop ? 'md' : 'sm'}
        />
      </div>
      <div className="mt-4 font-medium text-paragraph-15 md:text-paragraph-16">
        The project will be downgraded to{' '}
        <StageBadge stage="Stage 0" isAppchain={false} className="inline" />{' '}
        because it does not satisfy upcoming Stage 1 requirements.
      </div>
      <p className="mt-6 mb-2 font-bold text-paragraph-15 md:text-paragraph-16">
        The project will move to Stage 0 because:
      </p>
      <div className="space-y-2">
        {downgradePending.reasons.map((reason, i) => (
          <div
            key={i}
            className="flex gap-2 rounded-lg bg-red-600/20 p-4 text-paragraph-15 md:text-paragraph-16"
          >
            <CloseIcon className="mt-[3px] size-[15px] shrink-0 fill-negative md:mt-1 md:size-3.5" />{' '}
            <span>{reason}</span>
          </div>
        ))}
      </div>
      <CustomLink
        href={externalLinks.articles.stageOneRequirementsChange}
        className="mt-4 flex items-center gap-1 font-bold text-paragraph-14"
      >
        Learn more about the new requirements <ArrowRightIcon />
      </CustomLink>
    </CountdownSection>
  )
}

export function StageOneRequirementsChangeStageSectionNotice({
  downgradePending,
  stage1PrincipleDescription,
  className,
}: {
  downgradePending: NonNullable<StageConfigured['downgradePending']>
  stage1PrincipleDescription?: string
  className?: string
}) {
  return (
    <div className={cn('flex gap-2 rounded-lg bg-brand/20 p-4', className)}>
      <StopwatchIcon className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-bold text-lg">New requirements coming soon</p>
        <Countdown expiresAt={downgradePending.expiresAt} size="sm" />
        <div className="mt-4 font-medium text-paragraph-15 md:text-paragraph-16">
          The project will be downgraded to{' '}
          <StageBadge stage="Stage 0" isAppchain={false} className="inline" />{' '}
          because it does not satisfy upcoming Stage 1 requirements.
        </div>
        {downgradePending.reasons.map((reason, i) => (
          <div
            key={i}
            className="flex gap-2 text-paragraph-15 md:text-paragraph-16"
          >
            <MissingIcon className="mt-[5px] size-4 shrink-0 fill-negative" />
            <span>{reason}</span>
          </div>
        ))}{' '}
        {stage1PrincipleDescription && (
          <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
            {stage1PrincipleDescription}
          </p>
        )}
        <CustomLink
          href={externalLinks.articles.stageOneRequirementsChange}
          className="mt-4 flex items-center gap-1 font-bold text-paragraph-14"
        >
          Learn more about the new requirements <ArrowRightIcon />
        </CustomLink>
      </div>
    </div>
  )
}
