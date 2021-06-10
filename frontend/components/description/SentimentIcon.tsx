import styles from './styles.module.scss'

interface SentimentIconProps {
  sentiment: 'good' | 'bad' | 'neutral'
}

export function SentimentIcon({ sentiment }: SentimentIconProps) {
  return (
    <svg className={styles.sentimentIcon} viewBox="0 0 24 24" fill="currentcolor">
      {sentiment === 'neutral' && <circle cx={12} cy={12} r={10} />}
      {sentiment === 'good' && <path d="M2 22 L12 2 L22 22Z" />}
      {sentiment === 'bad' && <path d="M2 2 L12 22 L22 2Z" />}
    </svg>
  )
}
