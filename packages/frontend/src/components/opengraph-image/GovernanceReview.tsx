interface Props {
  title: string
  baseUrl: string
  size: {
    width: number
    height: number
  }
}

export function GovernanceReviewOpengraphImage({
  title,
  baseUrl,
  size,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={`${baseUrl}/meta-images/publications/governance-review-background.png`}
        alt=""
        {...size}
      />
      <div
        style={{
          position: 'absolute',
          top: 242,
          left: 128,
          fontFamily: 'pt-serif',
          fontSize: 105,
          fontWeight: 700,
          color: '#1B1B1B',
          maxWidth: 620,
          lineHeight: '102%',
          letterSpacing: '-1.05px',
        }}
      >
        {title}
      </div>
    </div>
  )
}
