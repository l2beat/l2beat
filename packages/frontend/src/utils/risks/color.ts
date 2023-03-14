import { Sentiment } from './types'

export function sentimentToClassName(sentiment?: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'fill-orange-600'
    case 'warning':
      return 'fill-yellow-200'
    case undefined:
      return 'fill-gray-400 dark:fill-gray-750'
  }
}
