import { useMemo, useState } from 'react'
import { Callout } from '~/components/Callout'
import {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '~/components/Pagination'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { AnomalyText } from '~/pages/scaling/liveness/components/AnomalyText'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'

const ANOMALIES_PER_PAGE = 5

export function Last30DayAnomalies({
  anomalies,
  hasTrackedContractsChanged,
}: {
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
}) {
  const [currentPage, setCurrentPage] = useState(0)
  const pageCount = Math.ceil(anomalies.length / ANOMALIES_PER_PAGE)

  const currentAnomalies = anomalies.slice(
    currentPage * ANOMALIES_PER_PAGE,
    (currentPage + 1) * ANOMALIES_PER_PAGE,
  )

  const paginationItems = useMemo(
    () => getPaginationItems(pageCount, currentPage),
    [pageCount, currentPage],
  )

  if (anomalies.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="font-bold text-heading-20 md:text-heading-24">
        Last 30 day anomalies
      </h3>
      <p className="mt-4 text-paragraph-15 md:text-paragraph-16">
        All liveness anomalies detected for this project in the last 30 days,
        helping you review recent downtime and availability issues.
      </p>
      {hasTrackedContractsChanged && (
        <Callout
          className="mt-4 rounded px-3 py-2 text-[13px] leading-[130%]"
          color="yellow"
          small
          icon={<RoundedWarningIcon className="size-4" sentiment="warning" />}
          body="There are implementation changes to tracked contracts, anomaly data might be inaccurate."
        />
      )}
      <div className="mt-4 flex flex-col">
        {currentAnomalies.map((anomaly) => (
          <div
            key={`${anomaly.start}-${anomaly.subtype}`}
            className="border-divider border-t px-2 py-3 last:border-b md:px-5 md:py-4"
          >
            <AnomalyText anomaly={anomaly} className="md:text-paragraph-14" />
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="mt-4">
          <Pagination className="min-w-full px-1">
            <PaginationContent className="justify-center">
              {paginationItems.map((item) =>
                item.type === 'ellipsis' ? (
                  <PaginationItem key={item.key}>
                    <PaginationEllipsis className="text-secondary" />
                  </PaginationItem>
                ) : (
                  <PaginationLink
                    key={item.index}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(item.index)
                    }}
                    isActive={currentPage === item.index}
                  >
                    {item.index + 1}
                  </PaginationLink>
                ),
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
