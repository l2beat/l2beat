export function statusRank(status: 'missing' | 'stale' | 'fresh') {
  switch (status) {
    case 'missing':
      return 0
    case 'stale':
      return 1
    case 'fresh':
      return 2
  }
}
