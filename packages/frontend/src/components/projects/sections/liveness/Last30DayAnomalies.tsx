import { useMemo, useState } from 'react'
import {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '~/components/Pagination'
import { AnomalyText } from '~/pages/scaling/liveness/components/AnomalyText'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'

const ANOMALIES_PER_PAGE = 5

export function Last30DayAnomalies({
  anomalies,
}: {
  anomalies: LivenessAnomaly[]
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
      <h3 className="font-bold text-heading-24">Last 30 day anomalies</h3>
      <p className="mt-4 text-paragraph-16">
        All liveness anomalies detected for this project in the last 30 days,
        helping you review recent downtime and availability issues.
      </p>
      <div className="mt-4 flex flex-col">
        {currentAnomalies.map((anomaly) => (
          <div
            key={`${anomaly.start}-${anomaly.subtype}`}
            className="border-divider border-t px-5 py-4 last:border-b"
          >
            <AnomalyText anomaly={anomaly} className="text-paragraph-14" />
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
