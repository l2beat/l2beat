import { ProjectId } from '@l2beat/shared-pure'
import { NextResponse } from 'next/server'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'

export async function GET() {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const breakdown = await getTvlBreakdownForProject(ProjectId('arbitrum'))

  console.dir(breakdown, { depth: null })
  return NextResponse.json({ msg: 'check console' })
}
