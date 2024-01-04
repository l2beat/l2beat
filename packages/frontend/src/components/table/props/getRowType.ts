import classNames from 'classnames'

interface Entry {
  isVerified?: boolean
  isUpcoming?: boolean
  redWarning?: string
  showProjectUnderReview?: boolean
}

export function getRowType(entry: Entry): string | undefined {
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

export function getRowTypeClassNames(): string {
  return classNames(
    'data-[row-type=unverified]:bg-red-100 data-[row-type=unverified]:dark:bg-red-900',
    'data-[row-type=under-review]:bg-yellow-200/10 data-[row-type=under-review]:hover:!bg-yellow-200/20',
    'data-[row-type=upcoming]:bg-purple-300/80 data-[row-type=upcoming]:hover:bg-purple-300 data-[row-type=upcoming]:dark:bg-purple-500/40 data-[row-type=upcoming]:dark:hover:bg-purple-500/60',
  )
}
