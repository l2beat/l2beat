import { createColumnHelper } from '@tanstack/react-table'
import { EtherscanLink } from '~/components/EtherscanLink'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { ChevronIcon } from '~/icons/Chevron'
import { CountWithAttesters } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import { cn } from '~/utils/cn'
import type { VerifierRow } from './VerifiersTable'

const columnHelper = createColumnHelper<VerifierRow>()

export const verifiersColumns = [
  columnHelper.accessor('name', {
    header: 'Verifier',
    cell: (ctx) => (
      <div className="min-w-0">
        <span
          className="block max-w-48 truncate font-medium text-label-value-14 sm:max-w-96 md:max-w-max md:text-label-value-15"
          title={ctx.row.original.name}
        >
          {ctx.row.original.name}
        </span>
      </div>
    ),
  }),
  columnHelper.display({
    id: 'verification',
    header: 'Verification',
    meta: {
      cellClassName: 'whitespace-nowrap',
      headClassName: 'whitespace-nowrap',
    },
    cell: (ctx) => (
      <div className="flex items-center gap-1">
        <CountWithAttesters
          attesters={ctx.row.original.attesters}
          count={undefined}
          type={ctx.row.original.verificationStatus}
        />
      </div>
    ),
  }),
  columnHelper.display({
    id: 'usedIn',
    header: 'Used in',
    meta: {
      headClassName: 'max-lg:hidden',
      cellClassName: 'max-lg:hidden',
    },
    cell: (ctx) => <ProjectsUsedIn usedIn={ctx.row.original.projectsUsedIn} />,
  }),
  columnHelper.display({
    id: 'knownDeployments',
    header: 'Known deployments',
    meta: {
      headClassName: 'max-md:hidden',
      cellClassName: 'max-md:hidden',
    },
    cell: (ctx) => (
      <div>
        {(() => {
          const addresses = ctx.row.original.knownDeployments.map(
            (deployment) => deployment.address,
          )
          const showCount = 2
          const showAddresses = addresses.slice(0, showCount)
          const extraCount = addresses.length - showCount

          return (
            <>
              {showAddresses.map((address, i) => (
                <span key={address}>
                  <EtherscanLink
                    address={address}
                    className="text-label-value-14"
                  />
                  {i < showAddresses.length - 1 && ', '}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="ml-1 text-label-muted-12">
                  +{extraCount} more
                </span>
              )}
            </>
          )
        })()}
      </div>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    meta: {
      align: 'right',
      headClassName: 'w-0',
      cellClassName: '!pr-0',
    },
    cell: (ctx) => {
      const isExpanded = ctx.row.getIsExpanded()
      const toggleExpandedHandler = ctx.row.getToggleExpandedHandler()
      return (
        <button
          className="flex h-full w-full items-center justify-end p-1"
          onClick={toggleExpandedHandler}
        >
          <ChevronIcon
            className={cn(
              'size-3 transition-transform duration-300',
              isExpanded && 'rotate-180',
            )}
          />{' '}
        </button>
      )
    },
  }),
]
