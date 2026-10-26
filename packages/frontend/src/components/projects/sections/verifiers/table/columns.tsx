import { createColumnHelper } from '@tanstack/react-table'
import { EtherscanLink } from '~/components/EtherscanLink'
import { linkVariants } from '~/components/link/CustomLink'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { ChevronIcon } from '~/icons/Chevron'
import { CountWithAttesters } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import { cn } from '~/utils/cn'
import { DeploymentChainIcon } from '../KnownDeployments'
import type { VerifierRow } from './VerifiersTable'

const columnHelper = createColumnHelper<VerifierRow>()

const baseVerifiersColumns = [
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
    cell: ({ row }) => {
      const deployments = row.original.knownDeployments
      const shown = deployments.slice(0, 2)
      const extraCount = deployments.length - shown.length

      return (
        <div>
          {shown.map((deployment, i) => (
            // The same address can be deployed on several chains.
            <span key={`${deployment.chainId}:${deployment.address}`}>
              <DeploymentChainIcon
                deployment={deployment}
                className="mr-1 inline-block align-[-2px]"
              />
              <EtherscanLink
                address={deployment.address}
                href={deployment.url}
                className="text-label-value-14"
              />
              {(i < shown.length - 1 || extraCount > 0) && ', '}
            </span>
          ))}
          {extraCount > 0 &&
            // Once the row is open, the full list is right below.
            (row.getIsExpanded() ? (
              <span className="text-label-muted-12">+{extraCount} more</span>
            ) : (
              <button
                type="button"
                onClick={() => row.toggleExpanded(true)}
                className={cn(linkVariants(), 'text-label-value-14')}
              >
                +{extraCount} more
              </button>
            ))}
        </div>
      )
    },
  }),
]

const actionsColumn = columnHelper.display({
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
})

export const verifiersColumns = [...baseVerifiersColumns, actionsColumn]

export const verifiersColumnsWithoutActions = baseVerifiersColumns
