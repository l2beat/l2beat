import { revalidatePath, revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { env } from '~/env'

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/scaling/summary')
  revalidatePath('/scaling/tvs')
  revalidatePath('/scaling/activity')
  revalidatePath('/scaling/liveness')
  revalidatePath('/scaling/finality')
  revalidatePath('/scaling/costs')
  revalidatePath('/scaling/archived')
  revalidatePath('/bridges/summary')
  revalidatePath('/bridges/archived')
  revalidatePath('/data-availability/summary')
  revalidatePath('/data-availability/throughput')

  revalidatePath('/scaling/projects/[slug]')
  revalidatePath('/scaling/projects/[slug]/tvs-breakdown')
  revalidatePath('/bridges/projects/[slug]')
  revalidatePath('/data-availability/projects/[layer]/[bridge]')
  revalidatePath('/zk-catalog/[project]')

  revalidatePath('/zk-catalog')
  revalidatePath('/governance')

  revalidateTag('hourly-data')
  return NextResponse.json({ message: 'revalidated hourly data' })
}
