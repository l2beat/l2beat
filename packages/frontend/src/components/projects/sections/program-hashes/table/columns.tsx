import { createColumnHelper } from '@tanstack/react-table'
import { CopyButton } from '~/components/CopyButton'
import { CustomLink } from '~/components/link/CustomLink'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { GithubIcon } from '~/icons/products/Github'
import { CountWithAttesters } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import { ProgramHashNameCell } from './components/ProgramHashNameCell'
import { VerificationSteps } from './components/VerificationSteps'
import type { ZkProgramHashRow } from './ZkProgramHashesTable'

const columnHelper = createColumnHelper<ZkProgramHashRow>()

export const zkProgramHashesColumns = [
  columnHelper.accessor('title', {
    header: 'Name',
    cell: (ctx) => <ProgramHashNameCell {...ctx.row.original} />,
  }),
  columnHelper.display({
    id: 'hash',
    header: 'Hash',
    cell: (ctx) => (
      <div className="flex items-baseline gap-1.5">
        <span className="font-medium text-label-value-14 text-secondary md:text-label-value-15">
          {ctx.row.original.hash.slice(0, 6)}...
          {ctx.row.original.hash.slice(-4)}
        </span>
        <CopyButton
          toCopy={ctx.row.original.hash}
          iconClassName="size-3 fill-secondary"
        />
      </div>
    ),
  }),
  columnHelper.display({
    id: 'programUrl',
    header: 'Repository',
    cell: (ctx) => {
      const { programUrl } = ctx.row.original
      if (programUrl) {
        return (
          <div className="flex items-center gap-1">
            <GithubIcon className="-mt-px size-4" />
            <CustomLink
              href={programUrl}
              className="font-medium text-label-value-13"
            >
              Github
            </CustomLink>
          </div>
        )
      }
      return (
        <span className="font-medium text-label-value-13 text-secondary opacity-50">
          Code unknown
        </span>
      )
    },
  }),
  columnHelper.display({
    id: 'verification',
    header: 'Verification',
    cell: (ctx) => (
      <div className="flex items-center gap-1">
        <CountWithAttesters
          attesters={[]}
          count={1}
          type={ctx.row.original.verificationStatus}
          hideCount
        />
        <VerificationSteps
          verificationSteps={ctx.row.original.verificationSteps}
        />
      </div>
    ),
  }),
  columnHelper.display({
    id: 'usedIn',
    header: 'Used in',
    cell: (ctx) => <ProjectsUsedIn usedIn={ctx.row.original.usedIn} />,
  }),
]
