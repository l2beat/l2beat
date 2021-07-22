import {
  ShieldBadIcon,
  ShieldGoodIcon,
  ShieldWarnIcon,
} from '../../../common/icons'

interface SentimentIconProps {
  sentiment: 'good' | 'bad' | 'neutral'
}

export function SentimentIcon({ sentiment }: SentimentIconProps) {
  if (sentiment === 'good') {
    return (
      <ShieldGoodIcon
        viewBox="4 2 16 20"
        className="parameters__sentiment"
        fill="currentcolor"
      />
    )
  } else if (sentiment === 'neutral') {
    return (
      <ShieldWarnIcon
        viewBox="4 2 16 20"
        className="parameters__sentiment"
        fill="currentcolor"
      />
    )
  } else if (sentiment === 'bad') {
    return (
      <ShieldBadIcon
        viewBox="4 2 16 20"
        className="parameters__sentiment"
        fill="currentcolor"
      />
    )
  }
  return null
}
