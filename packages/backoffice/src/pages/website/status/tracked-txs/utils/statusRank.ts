export function statusRank(status: 'missing' | 'stale' | 'fresh') {
  switch (status) {
    case 'stale':
      return 0
    case 'missing':
      return 1
    case 'fresh':
      return 2
  }
}
