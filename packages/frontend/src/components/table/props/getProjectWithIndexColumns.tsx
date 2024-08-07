import React from 'react'

import { BridgesEntry } from '../../../pages/bridges/types'
import { ScalingEntry } from '../../../pages/scaling/types'
import { cn } from '../../../utils/cn'
import { IndexCell } from '../IndexCell'
import { ProjectIconCell } from '../ProjectIconCell'
import { ProjectNameCell } from '../ProjectNameCell'
import { ColumnConfig } from '../types'

const stickyColumnBackgroundClasses = cn(
  'dark:group-data-[row-type=ethereum]/table-row:bg-blue-900 group-data-[row-type=ethereum]/table-row:bg-blue-400',
  'dark:group-data-[row-type=under-review]/table-row:bg-[#2B2414] group-data-[row-type=under-review]/table-row:bg-[#FBF5E1]',
  'dark:group-data-[row-type=implementation-changed]/table-row:bg-[#2B2414] group-data-[row-type=implementation-changed]/table-row:bg-[#FBF5E1]',
  'dark:group-data-[row-type=upcoming]/table-row:bg-[#350B46] group-data-[row-type=upcoming]/table-row:bg-[#F3DDFE]',
  'dark:group-data-[row-type=unverified]/table-row:bg-[#361112] group-data-[row-type=unverified]/table-row:bg-[#FDE3E3]',
)

export function getProjectWithIndexColumns(opts?: {
  isSynced?: boolean
  indexAsDefaultSort: boolean
  showIsL3?: boolean
}): ColumnConfig<ScalingEntry | BridgesEntry>[] {
  const columns: ColumnConfig<ScalingEntry | BridgesEntry>[] = [
    {
      name: '#',
      align: 'center',
      minimalWidth: true,
      headClassName: 'pl-2 md:pl-0 2xl:pl-4',
      className: cn(
        '-left-4 md:!bg-transparent md:dark:!bg-transparent sticky z-10 bg-white md:static dark:bg-neutral-900',
        stickyColumnBackgroundClasses,
      ),
      getValue: (_, index) => (
        <IndexCell index={index} className="pl-2 md:pl-4" />
      ),
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
        defaultState: opts?.indexAsDefaultSort ? 'asc' : undefined,
      },
    },
    {
      name: '',
      align: 'right',
      noPaddingRight: true,
      className: cn(
        'md:!bg-transparent md:dark:!bg-transparent sticky left-[18px] z-10 bg-white md:static dark:bg-neutral-900',
        'before:absolute md:before:content-none',
        'before:z-10',
        'before:inset-y-0',
        'before:w-4',
        'before:-right-4',
        'before:bg-gradient-to-r',
        stickyColumnBackgroundClasses,
        // Gradient colors based on the row type
        'before:from-white dark:before:from-neutral-900',
        'dark:group-data-[row-type=ethereum]/table-row:before:from-blue-900 group-data-[row-type=ethereum]/table-row:before:from-blue-400',
        'dark:group-data-[row-type=under-review]/table-row:before:from-[#2B2414] group-data-[row-type=under-review]/table-row:before:from-[#FBF5E1]',
        'dark:group-data-[row-type=implementation-changed]/table-row:before:from-[#2B2414] group-data-[row-type=implementation-changed]/table-row:before:from-[#FBF5E1]',
        'dark:group-data-[row-type=upcoming]/table-row:before:from-[#350B46] group-data-[row-type=upcoming]/table-row:before:from-[#F3DDFE]',
        'dark:group-data-[row-type=unverified]/table-row:before:from-[#361112] group-data-[row-type=unverified]/table-row:before:from-[#FDE3E3]',
      ),
      getValue: (project) => <ProjectIconCell project={project} />,
    },
    {
      name: 'Name',
      headClassName: 'max-md:!pl-4 pl-2 2xl:pl-3',
      className: 'max-md:pl-2',
      getValue: (project) => (
        <ProjectNameCell project={project} showIsL3={opts?.showIsL3} />
      ),
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
  ]
  return columns
}
