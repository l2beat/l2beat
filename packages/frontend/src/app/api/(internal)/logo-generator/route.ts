import { bridges, layer2s, layer3s } from '@l2beat/config'
import { NextResponse } from 'next/server'

export async function GET() {
  const projects = [...layer2s, ...layer3s, ...bridges]

  const data = projects.map((l2) => ({
    name: l2.display.name,
    type: l2.type,
    slug: l2.display.slug,
    isUpcoming: l2.isUpcoming,
    isArchived: l2.isArchived,
  }))

  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  )
}
