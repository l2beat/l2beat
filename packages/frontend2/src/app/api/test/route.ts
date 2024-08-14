import { NextResponse } from 'next/server'
import { getLiveness } from '~/server/features/scaling/liveness/get-liveness'

export async function GET() {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const liveness = await getLiveness()
  return NextResponse.json(liveness)
}
