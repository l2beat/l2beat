import { NextResponse } from 'next/server'
import { ps } from '~/server/projects'

export async function GET() {
  const projects = await ps.getProjects({
    optional: [
      'isUpcoming',
      'isArchived',
      'bridgeInfo',
      'scalingInfo',
      'isBridge',
      'isScaling',
    ],
  })

  const data = projects
    .filter((project) => !!project.isBridge || !!project.isScaling)
    .map((project) => ({
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
