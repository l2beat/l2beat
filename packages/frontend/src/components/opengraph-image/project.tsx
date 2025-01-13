/* eslint-disable @next/next/no-img-element */

interface Props {
  baseUrl: string
  slug: string
  name: string
  size: {
    width: number
    height: number
  }
  children: React.ReactNode
}

export function ProjectOpengraphImage({
  baseUrl,
  slug,
  name,
  size,
  children,
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
        src={`${baseUrl}/meta-images/projects/template.png`}
        alt=""
        {...size}
      />

      <div
        style={{
          position: 'absolute',
          top: 228,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
          }}
        >
          <img
            src={`${baseUrl}/icons/${slug}.png`}
            alt={`${name} logo`}
            width={104}
            height={104}
          />
          <div
            style={{
              color: 'white',
              whiteSpace: 'pre',
              fontFamily: 'roboto',
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1,
            }}
          >
            {name}
          </div>
        </div>
        <div
          style={{
            color: '#db8bf7',
            fontFamily: 'roboto',
            fontWeight: 500,
            fontSize: 36,
            whiteSpace: 'pre',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
