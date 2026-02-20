import { useEffect, useMemo, useState } from 'react'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { cn } from '~/utils/cn'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { CloseIcon } from '~/icons/Close'
import {
  ProjectBadge,
  type BadgeWithParams,
} from '~/components/projects/ProjectBadge'
import { BadgeModalProjectsTable } from './BadgeModalProjectsTable'

export interface BadgeDetails {
  badge: BadgeWithParams
  type: string
  projectsCount: number
  projects: ScalingSummaryEntry[]
  combinedTvs: number
}

export function useBadgeDetails(entries: ScalingSummaryEntry[]) {
  return useMemo(() => {
    const badgeDetailsById = new Map<string, BadgeDetails>()

    for (const entry of entries) {
      const seen = new Set<string>()
      for (const badge of entry.badges ?? []) {
        if (seen.has(badge.id)) continue
        const badgeType = badge.type || 'Other'
        const existing = badgeDetailsById.get(badge.id)
        if (existing) {
          existing.projectsCount += 1
          existing.projects.push(entry)
          if (entry.tvsOrder >= 0) existing.combinedTvs += entry.tvsOrder
        } else {
          badgeDetailsById.set(badge.id, {
            badge,
            type: badgeType,
            projectsCount: 1,
            projects: [entry],
            combinedTvs: entry.tvsOrder >= 0 ? entry.tvsOrder : 0,
          })
        }
        seen.add(badge.id)
      }
    }

    for (const d of badgeDetailsById.values()) {
      d.projects.sort(
        (a, b) => b.tvsOrder - a.tvsOrder || a.name.localeCompare(b.name),
      )
    }

    return badgeDetailsById
  }, [entries])
}

interface BadgeDetailsDialogProps {
  badgeDetailsById: Map<string, BadgeDetails>
  openedBadgeId: string | undefined
  onOpenedBadgeIdChange: (id: string | undefined) => void
}

export function BadgeDetailsDialog({
  badgeDetailsById,
  openedBadgeId,
  onOpenedBadgeIdChange,
}: BadgeDetailsDialogProps) {
  const [allowRelatedBadgeTooltips, setAllowRelatedBadgeTooltips] =
    useState(false)

  const openedBadge = openedBadgeId
    ? badgeDetailsById.get(openedBadgeId)
    : undefined

  useEffect(() => {
    setAllowRelatedBadgeTooltips(false)
  }, [openedBadge?.badge.id])

  const relatedBadges = useMemo(() => {
    if (!openedBadge) return []
    return [...badgeDetailsById.values()]
      .filter(
        (b) =>
          b.type === openedBadge.type && b.badge.id !== openedBadge.badge.id,
      )
      .sort(
        (a, b) =>
          b.projectsCount - a.projectsCount ||
          a.badge.name.localeCompare(b.badge.name),
      )
  }, [openedBadge, badgeDetailsById])

  return (
    <Dialog
      open={openedBadge !== undefined}
      onOpenChange={(open) => {
        if (!open) onOpenedBadgeIdChange(undefined)
      }}
    >
      <DialogContent className="flex max-h-[85dvh] w-full flex-col overflow-hidden bg-surface-primary md:max-w-[960px] !gap-0 !p-0">
        {openedBadge && (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
            {/* Left panel: badge info + related badges */}
            <div className="flex shrink-0 flex-col md:w-[320px] md:border-r md:border-divider">
              <div className="relative overflow-clip bg-surface-secondary max-md:rounded-t-lg md:rounded-tl-lg">
                <div className="absolute inset-0 bg-radial-[ellipse_at_50%_80%] from-brand/10 via-transparent to-transparent" />
                <DialogClose className="absolute top-3 right-3 z-10 rounded-full p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10 md:hidden">
                  <CloseIcon className="size-4 fill-primary" />
                </DialogClose>
                <DialogHeader className="!space-y-0">
                  <DialogDescription className="sr-only">
                    {openedBadge.badge.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="relative flex flex-col items-center px-5 pt-6 pb-5">
                  <ProjectBadge
                    badge={openedBadge.badge}
                    disableInteraction
                    disableTooltip
                    className="h-[110px]! drop-shadow-lg"
                  />
                  <DialogTitle className="mt-3 text-center !text-xl">
                    {openedBadge.badge.name}
                  </DialogTitle>
                  <p className="mt-1.5 text-center text-xs leading-relaxed text-secondary">
                    {openedBadge.badge.description}
                  </p>
                  <div className="mt-3 flex items-center divide-x divide-divider">
                    <StatChip
                      label="Projects"
                      value={openedBadge.projectsCount.toString()}
                    />
                    <StatChip
                      label="Combined TVS"
                      value={formatCurrency(openedBadge.combinedTvs, 'usd')}
                    />
                  </div>
                </div>
              </div>
              {relatedBadges.length > 0 && (
                <div className="flex flex-col px-5 py-3">
                  <p className="mb-2 text-xs text-secondary">
                    Other {openedBadge.type} badges
                  </p>
                  <div
                    key={openedBadge.badge.id}
                    className="flex flex-wrap gap-2"
                    onPointerMove={() => {
                      if (!allowRelatedBadgeTooltips) {
                        setAllowRelatedBadgeTooltips(true)
                      }
                    }}
                  >
                    {relatedBadges.map((related) => (
                      <Tooltip
                        key={`${openedBadge.badge.id}-${related.badge.id}`}
                        delayDuration={200}
                        open={allowRelatedBadgeTooltips ? undefined : false}
                      >
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            title={related.badge.name}
                            className={cn(
                              'cursor-pointer rounded-lg p-1 transition-all',
                              'hover:bg-surface-tertiary hover:ring-1 hover:ring-brand/20',
                              'active:scale-95',
                            )}
                            onClick={() =>
                              onOpenedBadgeIdChange(related.badge.id)
                            }
                          >
                            <ProjectBadge
                              badge={related.badge}
                              disableInteraction
                              disableTooltip
                              className="h-[72px]! w-auto"
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent side="top" sideOffset={4} className="z-[1000]">
                            <p className="font-bold">{related.badge.name}</p>
                            <p className="mt-0.5 text-secondary">
                              {related.projectsCount} project
                              {related.projectsCount === 1 ? '' : 's'}
                            </p>
                          </TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right panel: project table. On md the table scrolls; on max-md the whole modal scrolls. */}
            <div className="flex min-h-0 flex-1 flex-col max-md:min-h-0 max-md:flex-none">
              <div className="flex items-center justify-between px-5 pt-4 pb-2 md:pt-5">
                <p className="font-bold text-sm">
                  Projects ({openedBadge.projectsCount})
                </p>
                <DialogClose className="hidden rounded-full p-1.5 transition-colors hover:bg-surface-tertiary md:block">
                  <CloseIcon className="size-4 fill-primary" />
                </DialogClose>
              </div>
              <HorizontalSeparator className="md:hidden" />
              <ScrollWithGradient className="min-h-0 flex-1 px-5 pb-5 max-md:!min-h-0 max-md:!overflow-visible max-md:!max-h-none">
                <BadgeModalProjectsTable entries={openedBadge.projects} />
              </ScrollWithGradient>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface StatChipProps {
  label: string
  value: string
}

function StatChip({ label, value }: StatChipProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4">
      <span className="font-bold text-lg tabular-nums leading-tight">
        {value}
      </span>
      <span className="font-medium text-2xs text-secondary">{label}</span>
    </div>
  )
}
