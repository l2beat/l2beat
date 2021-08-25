import {
  ShieldBadIcon,
  ShieldGoodIcon,
  ShieldWarnIcon,
} from '../../../../common/icons'

interface SentimentIconProps {
  sentiment: 'good' | 'bad' | 'warning'
}

export function SentimentIcon({ sentiment }: SentimentIconProps) {
  if (sentiment === 'good') {
    return (
      <ShieldGoodIcon
        viewBox="4 2 16 20"
        className="ProjectParameter-Sentiment"
        fill="currentcolor"
      />
    )
  } else if (sentiment === 'warning') {
    return (
      <ShieldWarnIcon
        viewBox="4 2 16 20"
        className="ProjectParameter-Sentiment"
        fill="currentcolor"
      />
    )
  } else if (sentiment === 'bad') {
    return (
      <ShieldBadIcon
        viewBox="4 2 16 20"
        className="ProjectParameter-Sentiment"
        fill="currentcolor"
      />
    )
  }
  return null
}
