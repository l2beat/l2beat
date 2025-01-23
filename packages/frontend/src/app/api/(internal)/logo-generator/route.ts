import { ProjectService } from '@l2beat/config'
import { NextResponse } from 'next/server'

export async function GET() {
  const projects = await ProjectService.STATIC.getProjects({
    select: ['isBridge', 'isScaling'],
    optional: ['isUpcoming', 'isArchived', 'scalingInfo'],
  })

  const data = projects.map((project) => ({
    name: project.name,
    type: project.scalingInfo?.layer ?? 'bridge',
    slug: project.slug,
    isUpcoming: project.isUpcoming,
    isArchived: project.isArchived,
  }))

  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
