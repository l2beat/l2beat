import { EM_DASH } from '~/consts/characters'

export function LastUsedCell({ days }: { days: number | undefined }) {
  if (days === undefined) {
    return EM_DASH
  }

  if (days === 0) {
    return 'Today'
  }

  if (days === 1) {
    return '1 day ago'
  }

  if (days > 365) {
    return '1 year ago'
  }

  return `${days} days ago`
}
