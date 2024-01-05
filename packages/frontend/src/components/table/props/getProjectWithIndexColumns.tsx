import classNames from 'classnames'
import React from 'react'

import { BridgesEntry } from '../../../pages/bridges/types'
import { ScalingEntry } from '../../../pages/scaling/types'
import { IndexCell } from '../IndexCell'
import { ProjectIconCell } from '../ProjectIconCell'
import { ProjectNameCell } from '../ProjectNameCell'
import { ColumnConfig } from '../types'

const stickyColumnBackgroundClasses = classNames(
  'group-data-[row-type=ethereum]/table-row:bg-blue-400 dark:group-data-[row-type=ethereum]/table-row:bg-blue-900',
  'group-data-[row-type=under-review]/table-row:bg-[#FBF5E1] dark:group-data-[row-type=under-review]/table-row:bg-[#2B2414]',
  'group-data-[row-type=upcoming]/table-row:bg-[#F3DDFE] dark:group-data-[row-type=upcoming]/table-row:bg-[#350B46]',
  'group-data-[row-type=unverified]/table-row:bg-red-100 dark:group-data-[row-type=unverified]/table-row:bg-red-900',
)

export function getProjectWithIndexColumns(opts?: {
  indexAsDefaultSort: boolean
}): ColumnConfig<ScalingEntry | BridgesEntry>[] {
  const columns: ColumnConfig<ScalingEntry | BridgesEntry>[] = [
    {
      name: '#',
      align: 'center',
      minimalWidth: true,
      headClassName: 'pl-2 md:pl-4',
      className: classNames(
        'sticky -left-4 md:static z-10 dark:bg-neutral-900 bg-white md:!bg-transparent md:dark:!bg-transparent',
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
      className: classNames(
        'sticky left-[18px] md:static z-10 dark:bg-neutral-900 bg-white md:!bg-transparent md:dark:!bg-transparent',
        'before:absolute md:before:content-none',
        'before:z-10',
        'before:inset-y-0',
        'before:w-4',
        'before:-right-4',
        'before:bg-gradient-to-r',
        stickyColumnBackgroundClasses,
        // Gradient colors based on the row type
        'before:from-white dark:before:from-neutral-900',
        'group-data-[row-type=ethereum]/table-row:before:from-blue-400 dark:group-data-[row-type=ethereum]/table-row:before:from-blue-900',
        'group-data-[row-type=under-review]/table-row:before:from-[#FBF5E1] dark:group-data-[row-type=under-review]/table-row:before:from-[#2B2414]',
        'group-data-[row-type=upcoming]/table-row:before:from-[#F3DDFE] dark:group-data-[row-type=upcoming]/table-row:before:from-[#350B46]',
        'group-data-[row-type=unverified]/table-row:before:from-red-100 dark:group-data-[row-type=unverified]/table-row:before:from-red-900',
      ),
      getValue: (project) => <ProjectIconCell project={project} />,
    },
    {
      name: 'Name',
      headClassName: 'pl-3',
      getValue: (project) => <ProjectNameCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
  ]
  return columns
}
