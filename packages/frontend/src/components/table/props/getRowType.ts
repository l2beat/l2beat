interface Entry {
  slug?: string
  isVerified?: boolean
  isUpcoming?: boolean
  redWarning?: string
  showProjectUnderReview?: boolean
}

type RowType = ReturnType<typeof getRowType>

/* 
  We need to use row types to determine the background color of the sticky column data cell.
  You can check out the code for that in the following file: 
  - packages/frontend/src/components/table/props/getProjectWithIndexColumns.tsx
*/

export function getRowType(entry: Entry) {
  if (entry.slug === 'ethereum') {
    return 'ethereum'
  }
  if (entry.isVerified === false || entry.redWarning) {
    return 'unverified'
  }
  if (entry.showProjectUnderReview) {
    return 'under-review'
  }
  if (entry.isUpcoming) {
    return 'upcoming'
  }
}

export function getRowTypeClassNames(rowType: RowType) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-400 hover:bg-blue-400 border-b-blue-600 bg-blue-900 border-b-blue-500 hover:bg-blue-900'
    case 'unverified':
      return 'bg-red-100 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-900'
    case 'under-review':
      return 'bg-yellow-200/10 hover:!bg-yellow-200/20'
    case 'upcoming':
      return 'bg-purple-300/80 hover:bg-purple-300 dark:bg-purple-500/40 dark:hover:bg-purple-500/60'
  }
}
