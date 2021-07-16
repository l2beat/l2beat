interface SentimentIconProps {
  sentiment: 'good' | 'bad' | 'neutral'
}

export function SentimentIcon({ sentiment }: SentimentIconProps) {
  return (
    <svg
      className="parameters__sentiment"
      viewBox="0 0 16 20"
      fill="currentcolor"
    >
      {sentiment === 'neutral' && (
        <path d="M8 0L0 3V9.09C0 14.14 3.41 18.85 8 20C12.59 18.85 16 14.14 16 9.09V3L8 0ZM9 14H7V12H9V14ZM9 10H7V5H9V10Z" />
      )}
      {sentiment === 'good' && (
        <path d="M8 0L0 3V9.09C0 14.14 3.41 18.85 8 20C12.59 18.85 16 14.14 16 9.09V3L8 0ZM6.94 13.54L3.4 10L4.81 8.59L6.93 10.71L11.17 6.47L12.58 7.88L6.94 13.54Z" />
      )}
      {sentiment === 'bad' && (
        <path d="M8 0L0 3V9.09C0 14.14 3.41 18.85 8 20C12.59 18.85 16 14.14 16 9.09V3L8 0ZM11.5 12.09L10.09 13.5L8 11.42L5.91 13.5L4.5 12.09L6.59 10L4.5 7.91L5.91 6.5L8 8.59L10.09 6.5L11.5 7.91L9.42 10L11.5 12.09Z" />
      )}
    </svg>
  )
}
