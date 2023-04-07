import { Sentiment } from './types'

export function sentimentToFillColor(
  sentiment?: Sentiment,
  isUpcoming?: boolean,
  isBrighterGreen?: boolean,
): string {
  if (isUpcoming) {
    return 'fill-gray-400 dark:fill-gray-750'
  }
  switch (sentiment) {
    case 'bad':
      return 'fill-orange-600'
    case 'warning':
      return 'fill-yellow-200'
    case undefined:
      if (isBrighterGreen) return 'fill-green-300 dark:fill-green-450'
      return 'fill-green-300 dark:fill-green-800'
  }
}

export function sentimentToTextColor(sentiment?: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'text-orange-600'
    case 'warning':
      return 'text-yellow-200'
    case undefined:
      return ''
  }
}
