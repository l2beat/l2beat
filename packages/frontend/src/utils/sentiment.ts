import type { Sentiment } from '@l2beat/config'

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
      return 'fill-gray-400 dark:fill-zinc-700'
  }
}

export function sentimentToOpaqueBgColor(sentiment: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'bg-orange-600'
    case 'warning':
      return 'bg-yellow-200'
    case 'good':
      return 'bg-green-300 dark:bg-green-450'
    case 'neutral':
    case 'UnderReview':
      return 'bg-gray-400 dark:bg-zinc-700'
  }
}

export function sentimentToTransparentBgColor(sentiment: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'bg-orange-600/15'
    case 'warning':
      return 'bg-yellow-200/15'
    case 'good':
      return 'bg-green-300/15 dark:bg-green-450/15'
    case 'neutral':
    case 'UnderReview':
      return 'bg-gray-400/15 dark:bg-zinc-700/15'
  }
}

export function sentimentToTextColor(
  sentiment: Sentiment,
  opts?: { vibrant?: boolean },
): string {
  switch (sentiment) {
    case 'bad':
      return 'text-red-550 dark:text-orange-600'
    case 'warning':
      return 'text-yellow-700 dark:text-yellow-200'
    case 'good':
      return opts?.vibrant ? 'text-green-700 dark:text-green-450' : ''
    case 'neutral':
    case 'UnderReview':
      return ''
  }
}
