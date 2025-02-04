import { revalidatePath, revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { env } from '~/env'

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/scaling/activity')
  revalidatePath('/scaling/liveness')
  revalidatePath('/scaling/finality')
  revalidatePath('/zk-catalog')
  revalidatePath('/governance')

  revalidatePath('/zk-catalog/[project]')

  revalidateTag('activity')
  return NextResponse.json({ message: 'revalidated daily data' })
}
