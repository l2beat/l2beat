import { Sentiment } from './types'

export function sentimentToFillColor(sentiment?: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'fill-orange-600'
    case 'warning':
      return 'fill-yellow-200'
    case undefined:
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
