import { pluralize } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { FilledArrowIcon } from '~/icons/FilledArrow'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ZkCatalogEntry } from '../../../../server/features/zk-catalog/getZkCatalogEntries'
import { ProjectsUsedInByStatus } from '../components/ProjectsUsedInByStatus'
import { TechStackCell } from '../components/TechStackCell'
import { TrustedSetupCell } from '../components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '../components/VerifiedCountWithDetails'

const columnHelper = createColumnHelper<ZkCatalogEntry>()

export const zkCatalogColumns = [
  ...getCommonProjectColumns(columnHelper, (p) => `/zk-catalog/${p.slug}`),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (ctx) => {
      return (
        <TableLink href={`/zk-catalog/${ctx.row.original.slug}`}>
          <div className="w-max space-y-px">
            <div className="max-w-[146px] whitespace-pre-wrap font-bold text-base leading-none">
              {ctx.row.original.name}
            </div>
            {ctx.row.original.creator && (
              <div className="font-medium text-[13px] text-secondary leading-normal">
                {ctx.row.original.creator}
              </div>
            )}
          </div>
        </TableLink>
      )
    },
    enableHiding: false,
  }),
  columnHelper.accessor((row) => row.tvs.value, {
    id: 'tvs',
    meta: {
      tooltip:
        'The values secured by the listed verifiers, calculated as a sum of the total value secured of all projects that use them and are listed on L2BEAT.',
    },
    cell: (ctx) => {
      return (
        <TwoRowCell>
          <TwoRowCell.First>
            <div className="font-bold text-base">
              {formatCurrency(ctx.getValue(), 'usd')}
            </div>
          </TwoRowCell.First>
          <TwoRowCell.Second>
            {`${ctx.row.original.tvs.numberOfProjects} ${pluralize(ctx.row.original.tvs.numberOfProjects, 'project')}`}
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
  }),
  columnHelper.group({
    id: 'trusted-setup-group',
    columns: [
      columnHelper.display({
        id: 'trusted-setups',
        header: 'Trusted setups',
        cell: (ctx) => {
          const first = Object.values(
            ctx.row.original.trustedSetupsByProofSystem,
          )[0]
          if (!first) return null
          return <TrustedSetupCell {...first} />
        },
        meta: {
          tooltip:
            'Shows the trusted setups used within the proving stack and their risks.',
          cellClassName: 'px-6 pt-4 pb-3',

          additionalRows: (ctx) => {
            return Object.entries(ctx.row.original.trustedSetupsByProofSystem)
              .slice(1)
              .map(([key, ts]) => (
                <TrustedSetupCell key={key} trustedSetups={ts.trustedSetups} />
              ))
          },
        },
      }),
      columnHelper.display({
        id: 'verifiers',
        header: 'Verifiers',
        cell: (ctx) => {
          const first = Object.values(
            ctx.row.original.trustedSetupsByProofSystem,
          )[0]
          if (!first) return null
          return <VerifiedCountWithDetails data={first.verifiers} />
        },
        meta: {
          tooltip:
            'Shows the number of different versions of onchain verifiers and whether they were independently checked by regenerating them from the proving system’s source code. A green check indicates successful verification, while a red cross indicates a failure to regenerate.',
          additionalRows: (ctx) => {
            return Object.entries(ctx.row.original.trustedSetupsByProofSystem)
              .slice(1)
              .map(([key, ts]) => (
                <VerifiedCountWithDetails key={key} data={ts.verifiers} />
              ))
          },
        },
      }),
      columnHelper.display({
        id: 'used-in',
        header: 'Used in',
        cell: (ctx) => {
          const first = Object.values(
            ctx.row.original.trustedSetupsByProofSystem,
          )[0]
          if (!first) return null
          return <ProjectsUsedInByStatus data={first.projectsUsedInByStatus} />
        },
        meta: {
          additionalRows: (ctx) => {
            return Object.entries(ctx.row.original.trustedSetupsByProofSystem)
              .slice(1)
              .map(([key, ts]) => (
                <ProjectsUsedInByStatus
                  key={key}
                  data={ts.projectsUsedInByStatus}
                />
              ))
          },
        },
      }),
    ],
  }),
  columnHelper.display({
    id: 'zkevm-tech-stack',
    header: 'Main prover tech stack',
    cell: (ctx) => {
      return (
        <TechStackCell
          tags={[
            ...(ctx.row.original.techStack.zkVM ?? []),
            ...(ctx.row.original.techStack.snark ?? []),
          ]}
        />
      )
    },
    meta: {
      tooltip:
        'Technical attributes of the main proving system itself, which could be a zkVM or circuit-based. For validity L2s, this system produces a proof of valid state transition of one or more L2 blocks, possibly with recursive proving.',
      cellClassName: 'pr-1!',
    },
  }),
  columnHelper.display({
    id: 'arrow',
    cell: (ctx) => {
      const { finalWrap, zkVM, snark } = ctx.row.original.techStack

      const leftSideEmpty = !(zkVM?.length || snark?.length)
      const rightSideEmpty = !finalWrap?.length

      if (leftSideEmpty || rightSideEmpty) return null

      return <FilledArrowIcon className="fill-secondary" />
    },
    meta: {
      cellClassName: 'pr-1!',
    },
  }),
  columnHelper.display({
    id: 'final-wrap-stack',
    header: 'Final wrap stack',
    cell: (ctx) => {
      return (
        <TechStackCell
          tags={ctx.row.original.techStack.finalWrap ?? []}
          className="md:min-w-[180px]"
        />
      )
    },
    meta: {
      tooltip:
        'Technical attributes of the final wrap proving system, if applicable. Final wrap is a circuit-based SNARK that compresses the proof from the main prover and produces the proof that is submitted onchain for efficient verification.',
    },
  }),
]
