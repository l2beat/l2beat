import { layer2s, layer3s } from '@l2beat/config'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { env } from '~/env'

export const runtime = 'nodejs'

const size = {
  width: 1200,
  height: 630,
}

const scalingProjects = [...layer2s, ...layer3s]

export async function generateStaticParams() {
  return scalingProjects.map((project) => ({
    slug: project.display.slug,
  }))
}

export async function generateImageMetadata({ params }: Props) {
  return [
    {
      id: params.slug,
      size,
      alt: `Project page for ${params.slug}`,
      contentType: 'image/png',
    },
  ]
}

interface Props {
  params: {
    slug: string
  }
}

export default async function Image({ params }: Props) {
  const project = scalingProjects.find((p) => p.display.slug === params.slug)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const [robotoMedium, robotoBold] = [
    fetch(new URL('/fonts/roboto/Roboto-Medium.ttf', env.VERCEL_URL)).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(new URL('/fonts/roboto/Roboto-Bold.ttf', env.VERCEL_URL)).then(
      (res) => res.arrayBuffer(),
    ),
  ]
  console.log(new URL('/fonts/Roboto-Medium.ttf', env.VERCEL_URL))
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={`${env.VERCEL_URL}/meta-images/projects/template.png`}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${env.VERCEL_URL}/icons/${project.display.slug}.png`}
            alt={`${project.display.name} logo`}
            width={104}
            height={104}
          />
          <div
            style={{
              color: 'white',
              fontSize: 96,
              whiteSpace: 'pre',
              fontFamily: 'RobotoBold',
              fontWeight: 700,
            }}
          >
            {project.display.name}
          </div>
        </div>
        <div
          style={{
            color: '#db8bf7',
            fontFamily: 'RobotoMedium',
            fontWeight: 500,
            fontSize: 32,
            whiteSpace: 'pre',
          }}
        >
          PROJECT PAGE
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'RobotoMedium',
          data: await robotoMedium,
          weight: 500,
        },
        {
          name: 'RobotoBold',
          data: await robotoBold,
          weight: 700,
        },
      ],
    },
  )
}
