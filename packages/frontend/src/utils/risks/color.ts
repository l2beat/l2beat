import { Sentiment } from '@l2beat/config'

export function sentimentToFillColor(sentiment: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'fill-orange-600'
    case 'warning':
      return 'fill-yellow-200'
    case 'good':
      return 'fill-green-300 dark:fill-green-450'
    case 'neutral':
    case 'UnderReview':
      return 'fill-gray-400 dark:fill-gray-750'
  }
}

export function sentimentToTextColor(sentiment: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'text-red-550 dark:text-orange-600'
    case 'warning':
      return 'text-yellow-700 dark:text-yellow-200'
    case 'good':
    case 'neutral':
    case 'UnderReview':
      return ''
  }
}
