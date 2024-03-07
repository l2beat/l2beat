export function getWarningColor(severity: 'yellow' | 'red') {
  switch (severity) {
    case 'yellow':
      return 'fill-yellow-700 dark:fill-yellow-300'
    case 'red':
      return 'fill-red-700 dark:fill-red-300'
  }
}
