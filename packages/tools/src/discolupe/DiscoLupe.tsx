import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { ReactElement } from 'react'
import { NavLink, useSearchParams } from 'react-router'
import { SortingArrowIcon } from './SortingArrowIcon'
import { DiscoLupeProject, fetchData } from './data'

export type SortDirection = 'asc' | 'desc'
export interface Props {
  searchParams: { sort?: string; dir?: SortDirection }
  projects: DiscoLupeProject[]
}

interface LupeColumn {
  header: string
  id: string
  fn: (project: DiscoLupeProject) => string
  displayFn: (project: DiscoLupeProject, str: string) => ReactElement
}

interface Row {
  project: DiscoLupeProject
  columns: string[]
}

function divContainer(_: DiscoLupeProject, str: string) {
  return <div>{str}</div>
}

const CONFIGURED_HEADERS: LupeColumn[] = [
  {
    header: 'Name',
    id: 'qx',
    fn: (project: DiscoLupeProject) => project.display.name,
    displayFn: (project: DiscoLupeProject, str: string) => {
      return (
        <div>
          <img
            src={`https://raw.githubusercontent.com/l2beat/l2beat/refs/heads/main/packages/frontend/public/icons/${project.display.slug}.png`}
            alt={project.display.name}
            width={20}
            height={20}
            className="mr-2 inline-block"
          />
          <p className="inline-block">{str}</p>
        </div>
      )
    },
  },
  {
    header: 'TVL',
    id: 'ig',
    fn: (project: DiscoLupeProject) =>
      formatCurrencyExactValue(project.tvl, 'usd'),
    displayFn: divContainer,
  },
  {
    header: 'Permissions',
    id: 'td',
    fn: (project: DiscoLupeProject) =>
      project.arePermissionsDiscoveryDriven ? '✅' : '❌',
    displayFn: divContainer,
  },
  {
    header: 'Smart contracts',
    id: 'i9',
    fn: (project: DiscoLupeProject) =>
      project.areContractsDiscoveryDriven ? '✅' : '❌',
    displayFn: divContainer,
  },
  {
    header: 'Milestones & Incidents',
    id: 'vl',
    fn: (project: DiscoLupeProject) =>
      project.milestones && project.milestones.length > 0 ? '✅' : '❌',
    displayFn: divContainer,
  },
]

export function DiscoLupe() {
  const result = useQuery({
    queryKey: ['discolupe-data'],
    queryFn: fetchData,
  })

  const [searchParams, _] = useSearchParams()

  if (result.isPending) {
    return <div>Loading...</div>
  }

  if (result.isError) {
    return <div>{`Error... ${result.error}`}</div>
  }

  const selectedColumns = CONFIGURED_HEADERS

  const sortBy = searchParams.get('sort') ?? 'qx'
  const direction = (searchParams.get('dir') as SortDirection) ?? 'asc'

  const projects = result.data.data.projects
  const rows = getRows(projects, selectedColumns, sortBy, direction)

  return (
    <div className="overflow-x-scroll">
      <table className="table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {selectedColumns.map((c) => (
              <th
                key={c.header}
                className="whitespace-nowrap bg-black px-4 py-2 text-left font-medium text-sm text-white"
              >
                <NavLink
                  to={`?sort=${c.id}&dir=${getSortDirection(c.id, sortBy, direction)}`}
                  className="hover:text-gray-700"
                >
                  {c.header.charAt(0).toUpperCase() + c.header.slice(1)}
                  <span className="ml-2 inline-block align-middle">
                    {getSortIcon(c.id, sortBy, direction)}
                  </span>
                </NavLink>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            return (
              <tr
                key={row.project.id.toString()}
                className={clsx(
                  'border-t',
                  i % 2 === 1 ? 'bg-gray-500' : 'bg-white',
                )}
              >
                {row.columns.map((c, j) => (
                  <td
                    key={j}
                    className="whitespace-nowrap px-4 py-1 text-gray-900 text-sm"
                  >
                    {selectedColumns[j]?.displayFn(row.project, c)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function columnIDToIndex(columns: LupeColumn[], columnId: string): number {
  return columns.findIndex((c) => c.id === columnId)
}

function getRows(
  projects: DiscoLupeProject[],
  selectedColumns: LupeColumn[],
  sortColumn: string | undefined,
  sortDirection: SortDirection,
): Row[] {
  let rows: Row[] = projects.map((l2) => ({
    project: l2,
    columns: selectedColumns.map((c) => c.fn(l2)),
  }))

  if (sortColumn) {
    const columnIndex = columnIDToIndex(selectedColumns, sortColumn)
    rows.sort((r1, r2) => {
      if (
        r1.columns[columnIndex] === undefined ||
        r2.columns[columnIndex] === undefined
      ) {
        return 0
      }

      return r1.columns[columnIndex].localeCompare(r2.columns[columnIndex])
    })

    if (sortDirection === 'desc') {
      rows = rows.reverse()
    }
  }

  return rows
}

function getSortDirection(
  column: string,
  sortBy: string,
  direction: SortDirection,
): SortDirection {
  return column === sortBy && direction === 'asc' ? 'desc' : 'asc'
}

function getSortIcon(column: string, sortBy: string, direction: SortDirection) {
  if (column !== sortBy) {
    return (
      <div className="flex flex-col gap-0.5">
        <SortingArrowIcon />
        <SortingArrowIcon className="rotate-180" />
      </div>
    )
  }

  return direction === 'asc' ? (
    <SortingArrowIcon />
  ) : (
    <SortingArrowIcon className="rotate-180" />
  )
}

export function formatCurrencyExactValue(value: number, currency: string) {
  const string =
    currency === 'usd' || currency === 'USD'
      ? value.toFixed(2)
      : formatCrypto(value)
  const [integer, decimal = ''] = string.split('.')
  const formatted = formatInteger(integer ?? 0)
  return formatted + (decimal && `.${decimal}`)
}

function formatCrypto(value: number) {
  if (value < 1) {
    return value.toFixed(6)
  } else if (value < 100) {
    return value.toFixed(3)
  } else {
    return value.toFixed(2)
  }
}

function formatInteger(integer: number | string): string {
  const value = integer.toString()
  if (value.startsWith('-')) {
    return '-' + formatInteger(value.substring(1))
  }
  const count = value.length / 3
  const resultValue = value.split('')
  for (let i = 1; i < count; i++) {
    resultValue.splice(-4 * i + 1, 0, ',')
  }
  return resultValue.join('')
}
