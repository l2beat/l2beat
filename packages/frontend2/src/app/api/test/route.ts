import { NextResponse } from 'next/server'
import { getTvlProjects } from '~/server/features/scaling/tvl/utils/get-tvl-projects'
import { getTvlValuesForProjects } from '~/server/features/scaling/tvl/utils/get-tvl-values-for-projects'

export async function GET() {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  console.time('response1')
  const response1 = await getTvlValuesForProjects(getTvlProjects(), '7d')
  console.timeEnd('response1')

  console.time('response2')
  const response2 = await getTvlValuesForProjects(
    getTvlProjects().filter((p) => p.slug === 'arbitrum'),
    '7d',
  )
  console.timeEnd('response2')

  return NextResponse.json({
    response1,
    response2,
  })
}
