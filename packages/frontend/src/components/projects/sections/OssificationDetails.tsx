import type { OssificationContractBreakdown } from '@l2beat/shared'
import { formatSeconds } from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import {
  ChangeRateValue,
  ExposureValue,
  UnverifiedBadge,
} from '~/components/ossification/OssificationValues'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import type { ProjectOssification } from '~/server/features/projects/ossification/getProjectOssification'

export interface OssificationDetailsProps {
  ossification: ProjectOssification
}

export function OssificationDetails({
  ossification,
}: OssificationDetailsProps) {
  return (
    <div
      id="ossification"
      className="flex scroll-mt-[38px] flex-col gap-4 md:scroll-mt-14 lg:scroll-mt-4"
    >
      <h3 className="text-heading-20">Ossification</h3>
      <div className="flex flex-col gap-4">
        <p className="text-secondary text-sm leading-relaxed">
          Contracts classified as critical by our research team form one
          project-wide perimeter; deploying or critically changing any of them
          resets its clock (changes within 24 hours count as one event).
          Ossification N means the unchanged perimeter has outlived the code age
          of N% of recorded code-bug exploits in our published, onchain-verified
          incident dataset. Battle-tested exposure is the value secured summed
          over that unchanged period — the implicit bug bounty the code has
          withstood.
        </p>
        <ChartStats>
          <ChartStatsItem label="Ossification %" className="max-md:h-7">
            <span className="tabular-nums">{ossification.score}</span>
          </ChartStatsItem>
          <ChartStatsItem label="Battle-tested exposure" className="max-md:h-7">
            <ExposureValue exposure={ossification.exposure} />
          </ChartStatsItem>
          <ChartStatsItem label="Last change" className="max-md:h-7">
            {`${formatSeconds(ossification.projectAgeSeconds)} ago`}
          </ChartStatsItem>
          <ChartStatsItem
            label="Critical changes / year"
            className="max-md:h-7"
          >
            <ChangeRateValue
              rate={ossification.criticalChangesPerYear}
              eventCount={ossification.clusteredEventCount}
            />
          </ChartStatsItem>
        </ChartStats>
        <ContractBreakdownTable contracts={ossification.contracts} />
      </div>
    </div>
  )
}

function ContractBreakdownTable({
  contracts,
}: {
  contracts: OssificationContractBreakdown[]
}) {
  return (
    <details className="group rounded-lg border border-divider bg-surface-primary">
      <summary className="cursor-pointer list-none px-4 py-3 font-medium text-sm marker:hidden hover:bg-surface-secondary">
        Per-contract breakdown ({contracts.length}{' '}
        {contracts.length === 1 ? 'contract' : 'contracts'})
      </summary>
      <div className="border-divider border-t">
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Contract</TableHead>
              <TableHead align="right">Age</TableHead>
              <TableHead align="right">Code changes</TableHead>
              <TableHead align="right">State changes</TableHead>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.address} highlightId={undefined}>
                <TableCell className="font-medium">
                  {contract.name}
                  {!contract.isVerified && <UnverifiedBadge className="ml-2" />}
                </TableCell>
                <TableCell align="right" className="tabular-nums">
                  {contract.ageSeconds !== null ? (
                    formatSeconds(contract.ageSeconds)
                  ) : (
                    <NotApplicableBadge />
                  )}
                </TableCell>
                <TableCell align="right" className="tabular-nums">
                  {contract.codeChangeCount}
                </TableCell>
                <TableCell align="right" className="tabular-nums">
                  {contract.stateChangeCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </details>
  )
}
