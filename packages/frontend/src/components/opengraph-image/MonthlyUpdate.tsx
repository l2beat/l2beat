interface Props {
  date: string
  baseUrl: string
  size: {
    width: number
    height: number
  }
}

export function MonthlyUpdateOpengraphImage({ date, baseUrl, size }: Props) {
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
        src={`${baseUrl}/meta-images/publications/monthly-update-background.png`}
        alt=""
        {...size}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'montserrat',
          fontSize: 50,
          fontWeight: 700,
          color: '#000000',
          textTransform: 'uppercase',
        }}
      >
        {date}
      </div>
    </div>
  )
}
