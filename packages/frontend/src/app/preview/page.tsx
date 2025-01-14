import { ProjectService } from '@l2beat/config'
import { NextResponse } from 'next/server'
import { ProjectOpengraphImage } from '~/components/opengraph-image/project'
import { roboto } from '~/fonts'
import { getBaseUrl } from '~/utils/get-base-url'

export default async function Page() {
  const project = await ProjectService.STATIC.getProject({
    slug: 'scroll',
  })
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  const baseUrl = getBaseUrl()

  return (
    <div className={roboto.className}>
      <ProjectOpengraphImage
        baseUrl={baseUrl}
        slug={project.slug}
        name={project.name}
        size={{
          width: 1200,
          height: 630,
        }}
      >
        ZK CATALOG&nbsp;•&nbsp;PROJECT PAGE
      </ProjectOpengraphImage>
    </div>
  )
}
