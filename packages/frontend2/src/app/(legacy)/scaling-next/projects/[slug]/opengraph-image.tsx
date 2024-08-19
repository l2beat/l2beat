import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { scalingProjects } from './page'

export const runtime = 'nodejs'

const size = {
  width: 1200,
  height: 630,
}

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
  if (!project) throw new Error('Project not found')
  const [robotoMedium, robotoBold, background, logo] = await Promise.all([
    readFile(join(process.cwd(), `/src/fonts/Roboto-Medium.ttf`)),
    readFile(join(process.cwd(), `/src/fonts/Roboto-Bold.ttf`)),
    readFile(join(process.cwd(), `/public/meta-images/projects/template.png`)),
    readFile(join(process.cwd(), `/public/icons/${project.display.slug}.png`)),
  ])

  const backgroundSrc = Uint8Array.from(background).buffer
  const logoSrc = Uint8Array.from(logo).buffer

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
      <img src={backgroundSrc} {...size} />

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
            src={logoSrc}
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
          data: robotoMedium,
          weight: 500,
        },
        {
          name: 'RobotoBold',
          data: robotoBold,
          weight: 700,
        },
      ],
    },
  )
}
