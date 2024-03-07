export function getSentimentFillColor(severity: 'warning' | 'bad') {
  switch (severity) {
    case 'warning':
      return 'fill-yellow-700 dark:fill-yellow-300'
    case 'bad':
      return 'fill-red-700 dark:fill-red-300'
  }
}
