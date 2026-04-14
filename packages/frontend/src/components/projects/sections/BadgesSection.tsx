import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../../core/OverflowWrapper'
import type { BadgeWithParams } from '../ProjectBadge'
import { ProjectBadge } from '../ProjectBadge'
import { BadgesDialog } from './BadgesDialog'

interface BadgesSectionProps {
  badges: BadgeWithParams[]
  hideTitle?: boolean
  className?: string
  withDialog?: boolean
}

export function BadgesSection({
  badges,
  hideTitle,
  className,
  withDialog,
}: BadgesSectionProps) {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>()
  const utils = api.useUtils()

  const { data, isLoading } = api.projects.badgesDialog.useQuery(
    { badgeId: selectedBadgeId ?? '' },
    {
      enabled: !!selectedBadgeId,
      placeholderData: keepPreviousData,
    },
  )

  return (
    <>
      <div
        className={cn(
          'flex shrink-0 flex-col gap-2 lg:min-w-[288px]',
          className,
        )}
      >
        {!hideTitle && (
          <h2 className="text-secondary text-subtitle-12 uppercase max-md:hidden">
            Badges
          </h2>
        )}
        <OverflowWrapper className="-m-4">
          <div className="flex flex-row gap-1 p-4 lg:flex-wrap">
            {badges.map((badge, key) =>
              withDialog ? (
                <button
                  key={key}
                  className="shrink-0 cursor-pointer"
                  onMouseEnter={() =>
                    utils.projects.badgesDialog.prefetch({ badgeId: badge.id })
                  }
                  onClick={() => setSelectedBadgeId(badge.id)}
                >
                  <ProjectBadge badge={badge} disableInteraction />
                </button>
              ) : (
                <ProjectBadge key={key} badge={badge} />
              ),
            )}
          </div>
        </OverflowWrapper>
      </div>
      {withDialog && selectedBadgeId && (
        <BadgesDialog
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBadgeId(undefined)
            }
          }}
          data={data}
          isLoading={isLoading}
          onBadgeSelect={setSelectedBadgeId}
        />
      )}
    </>
  )
}
