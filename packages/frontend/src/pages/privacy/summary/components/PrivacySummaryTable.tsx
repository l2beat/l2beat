import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import { TableLink } from '~/components/table/TableLink'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { PrivacySummaryEntry } from '../getPrivacySummaryData'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

export function PrivacySummaryTable({
  entries,
}: {
  entries: PrivacySummaryEntry[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHead>Project</TableHead>
          <TableHead tooltip="Shows the trusted setup used by the project's proving system and its risk.">
            Trusted setup
          </TableHead>
          <TableHead align="right">Total Value Secured</TableHead>
          <TableHead align="right">ETH / WETH Deposits 7D</TableHead>
          <TableHead align="right">ETH / WETH Deposits 30D</TableHead>
          <TableHead align="right">ETH / WETH Deposits Total</TableHead>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id} highlightId={entry.slug}>
            <TableCell>
              <TableLink href={entry.href}>
                <ProjectNameCell
                  project={{
                    name: entry.name,
                    shortName: entry.shortName,
                    icon: entry.icon,
                    backgroundColor: undefined,
                    description: entry.description,
                    statuses: {
                      underReview: entry.isUnderReview ? 'config' : undefined,
                    },
                  }}
                />
              </TableLink>
            </TableCell>
            <TableCell align="center">
              <PrivacyTrustedSetupCell trustedSetup={entry.trustedSetup} />
            </TableCell>
            <TableCell align="right" className="font-medium text-base">
              {formatCurrency(entry.totalValueSecuredUsd, 'usd')}
            </TableCell>
            <TableCell align="right" className="font-medium text-base">
              {formatInteger(entry.ethWethDeposits7d)}
            </TableCell>
            <TableCell align="right" className="font-medium text-base">
              {formatInteger(entry.ethWethDeposits30d)}
            </TableCell>
            <TableCell align="right" className="font-medium text-base">
              {formatInteger(entry.ethWethDepositsTotal)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
