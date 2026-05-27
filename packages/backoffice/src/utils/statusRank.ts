export type Status = 'missing' | 'stale' | 'fresh'

export function statusRank(status: Status) {
  switch (status) {
    case 'stale':
      return 0
    case 'missing':
      return 1
    case 'fresh':
      return 2
  }
}
